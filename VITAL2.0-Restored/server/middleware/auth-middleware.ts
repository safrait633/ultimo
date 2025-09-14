import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { JWTManager, JWTPayload } from '../auth/jwt-manager';
import { MedicalUserDB } from '../database/medical-user-db';
import { createReplitDB } from '../database/replit-db-adapter';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      sessionInfo?: {
        sessionId: string;
        userId: string;
        userInfo: string;
        permissions: string[];
      };
    }
  }
}

const jwtManager = new JWTManager();
const replitDB = createReplitDB();
const medicalUserDB = new MedicalUserDB(replitDB);

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Demasiados intentos de autenticación. Intente de nuevo en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.',
    code: 'API_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Medical API rate limiting (more restrictive)
export const medicalApiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute for medical operations
  message: {
    error: 'Límite de solicitudes médicas excedido. Intente de nuevo en un minuto.',
    code: 'MEDICAL_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = jwtManager.extractTokenFromHeader(authHeader);

  if (!token) {
    return res.status(401).json({
      error: 'Token de acceso requerido',
      code: 'NO_TOKEN'
    });
  }

  const payload = jwtManager.verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({
      error: 'Token de acceso inválido o expirado',
      code: 'INVALID_TOKEN'
    });
  }

  // Validate medical permissions
  if (!jwtManager.validateMedicalPermissions(payload)) {
    return res.status(403).json({
      error: 'Permisos médicos insuficientes',
      code: 'INSUFFICIENT_MEDICAL_PERMISSIONS'
    });
  }

  // Add user and session info to request
  req.user = payload;
  req.sessionInfo = jwtManager.generateSessionInfo(payload);

  // Log access for audit trail
  logUserAccess(req);

  next();
}

// Role-based authentication middleware
export function requireRole(role: 'medico' | 'super_admin') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!jwtManager.validateMedicalPermissions(req.user, role)) {
      return res.status(403).json({
        error: `Acceso restringido. Se requiere rol: ${role}`,
        code: 'INSUFFICIENT_ROLE'
      });
    }

    next();
  };
}

// Middleware to check if user is active and verified
export async function requireActiveUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Usuario no autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  try {
    const user = await medicalUserDB.findUserById(req.user.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Cuenta de usuario desactivada. Contacte al administrador.',
        code: 'USER_INACTIVE'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Cuenta no verificada. Complete el proceso de verificación.',
        code: 'USER_NOT_VERIFIED'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking user status:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}

// Middleware to refresh token if expiring soon
export function autoRefreshToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = jwtManager.extractTokenFromHeader(authHeader);

  if (token && jwtManager.isTokenExpiringSoon(token)) {
    // Add header to indicate client should refresh token
    res.setHeader('X-Token-Refresh-Required', 'true');
  }

  next();
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // HIPAA and medical data security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
}

// Audit logging function
async function logUserAccess(req: Request) {
  try {
    if (!req.user || !req.sessionInfo) return;

    const logData = {
      userId: req.user.userId,
      sessionId: req.user.sessionId,
      action: 'api_access',
      resource: `${req.method} ${req.path}`,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
      metadata: JSON.stringify({
        endpoint: req.path,
        method: req.method,
        userRole: req.user.role,
        specialty: req.user.specialty,
        licenseNumber: req.user.licenseNumber
      })
    };

    // Store audit log in database
    await replitDB.set(
      `audit:${Date.now()}:${req.user.userId}:${req.user.sessionId}`,
      JSON.stringify(logData)
    );

  } catch (error) {
    console.error('Error logging user access:', error);
    // Don't fail the request if logging fails
  }
}

// Cleanup expired sessions (for periodic maintenance)
export async function cleanupExpiredSessions() {
  try {
    const keys = await replitDB.list('session:');
    const now = Date.now();
    
    for (const key of keys) {
      const sessionData = await replitDB.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (new Date(session.expiresAt).getTime() < now) {
          await replitDB.delete(key);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

// Medical license validation middleware
export function validateMedicalLicense(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.licenseNumber) {
    return res.status(403).json({
      error: 'Licencia médica requerida para esta operación',
      code: 'MEDICAL_LICENSE_REQUIRED'
    });
  }

  // Additional license validation could be added here
  // e.g., checking against medical board databases
  
  next();
}