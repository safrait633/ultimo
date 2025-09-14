import { Router, Request, Response } from 'express';
import { authService, MedicalUser } from '../auth/replit-auth-service';
import {
  validateRequest,
  loginValidationSchema,
  registrationValidationSchema,
  refreshTokenValidationSchema,
  extractClientInfo,
  sanitizeMedicalData
} from '../middleware/validation';
import {
  loginRateLimiter,
  registrationRateLimiter,
  refreshRateLimiter
} from '../middleware/rate-limiter';
import jwt from 'jsonwebtoken';

const router = Router();

// Response codes for medical compliance
export const AUTH_RESPONSE_CODES = {
  SUCCESS: 'AUTH_SUCCESS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  LICENSE_ALREADY_EXISTS: 'LICENSE_ALREADY_EXISTS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR'
};

// POST /api/auth/login - Medical professional login
router.post('/login', 
  loginRateLimiter,
  validateRequest(loginValidationSchema),
  async (req: Request, res: Response) => {
    const clientInfo = extractClientInfo(req);
    const { email, password } = req.body;

    try {
      // Get user by email
      const user = await authService.getUserByEmail(email);
      
      if (!user) {
        // Log failed login attempt
        await authService.createAuditLog({
          action: 'login_failed',
          resource: 'user',
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { email, reason: 'user_not_found' }
        });

        return res.status(401).json({
          success: false,
          message: 'Credenciales médicas inválidas',
          code: AUTH_RESPONSE_CODES.INVALID_CREDENTIALS
        });
      }

      // Check if account is active
      if (!user.isActive) {
        await authService.createAuditLog({
          userId: user.id,
          action: 'login_failed',
          resource: 'user',
          resourceId: user.id,
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { email, reason: 'account_inactive' }
        });

        return res.status(401).json({
          success: false,
          message: 'Cuenta médica inactiva. Contacte al administrador',
          code: AUTH_RESPONSE_CODES.ACCOUNT_INACTIVE
        });
      }

      // Validate password
      const isValidPassword = await authService.validatePassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        await authService.createAuditLog({
          userId: user.id,
          action: 'login_failed',
          resource: 'user',
          resourceId: user.id,
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { email, reason: 'invalid_password' }
        });

        return res.status(401).json({
          success: false,
          message: 'Credenciales médicas inválidas',
          code: AUTH_RESPONSE_CODES.INVALID_CREDENTIALS
        });
      }

      // Generate tokens
      const tokens = await authService.generateTokens(user);
      
      // Update last login
      await authService.updateLastLogin(user.id);
      
      // Create session
      const sessionId = await authService.createSession(user.id, {
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        loginTime: new Date().toISOString()
      });

      // Log successful login
      await authService.createAuditLog({
        userId: user.id,
        action: 'login_success',
        resource: 'user',
        resourceId: user.id,
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: true,
        metadata: { 
          email, 
          specialty: user.specialty,
          sessionId,
          tokenExpiry: tokens.accessTokenExpiry
        }
      });

      // Prepare response data (exclude sensitive information)
      const { passwordHash, ...userResponse } = user;
      
      res.json({
        success: true,
        message: `Bienvenido/a Dr. ${user.nombres} ${user.apellidos}`,
        code: AUTH_RESPONSE_CODES.SUCCESS,
        data: {
          user: userResponse,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
            refreshExpiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
          },
          session: {
            id: sessionId,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

    } catch (error) {
      console.error('[AUTH LOGIN ERROR]', error);
      
      await authService.createAuditLog({
        action: 'login_error',
        resource: 'user',
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: false,
        metadata: { 
          email, 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      res.status(500).json({
        success: false,
        message: 'Error interno del sistema médico',
        code: AUTH_RESPONSE_CODES.SERVER_ERROR
      });
    }
  }
);

// POST /api/auth/refresh - Token refresh
router.post('/refresh',
  refreshRateLimiter,
  validateRequest(refreshTokenValidationSchema),
  async (req: Request, res: Response) => {
    const clientInfo = extractClientInfo(req);
    const { refreshToken } = req.body;

    try {
      // Validate refresh token
      const tokenValidation = await authService.validateRefreshToken(refreshToken);
      
      if (!tokenValidation.valid || !tokenValidation.userId) {
        await authService.createAuditLog({
          action: 'token_refresh_failed',
          resource: 'token',
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { reason: 'invalid_refresh_token' }
        });

        return res.status(401).json({
          success: false,
          message: 'Token de renovación inválido o expirado',
          code: AUTH_RESPONSE_CODES.INVALID_TOKEN
        });
      }

      // Get user
      const user = await authService.getUserById(tokenValidation.userId);
      
      if (!user || !user.isActive) {
        // Revoke the token since user is inactive
        if (tokenValidation.tokenId) {
          await authService.revokeRefreshToken(tokenValidation.tokenId);
        }

        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo',
          code: AUTH_RESPONSE_CODES.ACCOUNT_INACTIVE
        });
      }

      // Revoke old refresh token (token rotation)
      if (tokenValidation.tokenId) {
        await authService.revokeRefreshToken(tokenValidation.tokenId);
      }

      // Generate new tokens
      const newTokens = await authService.generateTokens(user);

      // Log successful token refresh
      await authService.createAuditLog({
        userId: user.id,
        action: 'token_refresh_success',
        resource: 'token',
        resourceId: tokenValidation.tokenId,
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: true,
        metadata: { 
          oldTokenId: tokenValidation.tokenId,
          newTokenExpiry: newTokens.accessTokenExpiry
        }
      });

      res.json({
        success: true,
        message: 'Tokens renovados exitosamente',
        code: AUTH_RESPONSE_CODES.SUCCESS,
        data: {
          tokens: {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
            refreshExpiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
          }
        }
      });

    } catch (error) {
      console.error('[AUTH REFRESH ERROR]', error);
      
      await authService.createAuditLog({
        action: 'token_refresh_error',
        resource: 'token',
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: false,
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      res.status(500).json({
        success: false,
        message: 'Error interno del sistema médico',
        code: AUTH_RESPONSE_CODES.SERVER_ERROR
      });
    }
  }
);

// POST /api/auth/logout - Logout and invalidate session
router.post('/logout', async (req: Request, res: Response) => {
  const clientInfo = extractClientInfo(req);
  
  try {
    const authHeader = req.headers.authorization;
    let userId: string | undefined;
    let sessionId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medical-jwt-secret-key') as any;
        userId = decoded.id;
      } catch (e) {
        // Token might be expired, but we still want to logout
      }
    }

    // Get session ID from request body or headers
    sessionId = req.body.sessionId || req.headers['x-session-id'] as string;

    // Invalidate session if provided
    if (sessionId) {
      await authService.invalidateSession(sessionId);
    }

    // Revoke all refresh tokens for the user
    if (userId) {
      await authService.revokeAllUserTokens(userId);
    }

    // Log logout event
    await authService.createAuditLog({
      userId,
      action: 'logout',
      resource: 'session',
      resourceId: sessionId,
      ipAddress: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      success: true,
      metadata: { sessionId }
    });

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      code: AUTH_RESPONSE_CODES.SUCCESS
    });

  } catch (error) {
    console.error('[AUTH LOGOUT ERROR]', error);
    
    await authService.createAuditLog({
      action: 'logout_error',
      resource: 'session',
      ipAddress: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      success: false,
      metadata: { 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    res.status(500).json({
      success: false,
      message: 'Error interno del sistema médico',
      code: AUTH_RESPONSE_CODES.SERVER_ERROR
    });
  }
});

// POST /api/auth/register - Medical professional registration
router.post('/register',
  registrationRateLimiter,
  validateRequest(registrationValidationSchema),
  async (req: Request, res: Response) => {
    const clientInfo = extractClientInfo(req);
    
    try {
      const { email, password, nombres, apellidos, specialty, licenseNumber, role, hospitalId } = req.body;

      // Check if email already exists
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        await authService.createAuditLog({
          action: 'registration_failed',
          resource: 'user',
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { email, reason: 'email_exists' }
        });

        return res.status(409).json({
          success: false,
          message: 'Email médico ya registrado',
          code: AUTH_RESPONSE_CODES.EMAIL_ALREADY_EXISTS
        });
      }

      // Check if license number is already taken
      const isLicenseTaken = await authService.isLicenseNumberTaken(licenseNumber);
      if (isLicenseTaken) {
        await authService.createAuditLog({
          action: 'registration_failed',
          resource: 'user',
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          success: false,
          metadata: { email, licenseNumber, reason: 'license_exists' }
        });

        return res.status(409).json({
          success: false,
          message: 'Número de licencia médica ya registrado',
          code: AUTH_RESPONSE_CODES.LICENSE_ALREADY_EXISTS
        });
      }

      // Create new user
      const newUser = await authService.createUser({
        email,
        password,
        nombres,
        apellidos,
        role: role || 'medico',
        specialty,
        licenseNumber,
        hospitalId,
        isActive: true,
        isVerified: false,
        preferencias: {
          idioma: 'es',
          tema: 'claro',
          notificaciones: true
        },
        replitMetadata: {
          deploymentUrl: process.env.REPL_URL || 'localhost:5000',
          lastActiveSession: null
        }
      });

      // Log successful registration
      await authService.createAuditLog({
        userId: newUser.id,
        action: 'registration_success',
        resource: 'user',
        resourceId: newUser.id,
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: true,
        metadata: sanitizeMedicalData({
          email: newUser.email,
          nombres: newUser.nombres,
          apellidos: newUser.apellidos,
          specialty: newUser.specialty,
          licenseNumber: newUser.licenseNumber,
          role: newUser.role
        })
      });

      // Generate initial tokens
      const tokens = await authService.generateTokens(newUser);

      // Prepare response (exclude sensitive data)
      const { passwordHash, ...userResponse } = newUser;

      res.status(201).json({
        success: true,
        message: `Registro exitoso. Bienvenido/a Dr. ${newUser.nombres} ${newUser.apellidos}`,
        code: AUTH_RESPONSE_CODES.SUCCESS,
        data: {
          user: userResponse,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: 15 * 60, // 15 minutes in seconds
            refreshExpiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
          }
        }
      });

    } catch (error) {
      console.error('[AUTH REGISTRATION ERROR]', error);
      
      await authService.createAuditLog({
        action: 'registration_error',
        resource: 'user',
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        success: false,
        metadata: { 
          email: req.body.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      res.status(500).json({
        success: false,
        message: 'Error interno del sistema médico',
        code: AUTH_RESPONSE_CODES.SERVER_ERROR
      });
    }
  }
);

export { router as authRouter };