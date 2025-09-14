import Database from '@replit/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const replitDB = new Database();

// Environment variables with defaults
const JWT_SECRET = process.env.JWT_SECRET || 'medical-jwt-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'medical-refresh-secret-key';
const BCRYPT_ROUNDS = 12;

export interface MedicalUser {
  id: string;
  email: string;
  passwordHash: string;
  nombres: string;
  apellidos: string;
  role: 'medico' | 'super_admin';
  specialty: string;
  licenseNumber: string;
  hospitalId: string | null;
  isActive: boolean;
  isVerified: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  ultimoAcceso: string | null;
  preferencias: {
    idioma: string;
    tema: string;
    notificaciones: boolean;
  };
  replitMetadata: {
    deploymentUrl: string;
    lastActiveSession: string | null;
    replitUserId?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata?: any;
}

export class ReplitAuthService {
  // User management
  async createUser(userData: Omit<MedicalUser, 'id' | 'passwordHash' | 'fechaCreacion' | 'fechaActualizacion' | 'ultimoAcceso'> & { password: string }): Promise<MedicalUser> {
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);
    const now = new Date().toISOString();

    const user: MedicalUser = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      nombres: userData.nombres.trim(),
      apellidos: userData.apellidos.trim(),
      role: userData.role,
      specialty: userData.specialty,
      licenseNumber: userData.licenseNumber.toUpperCase().trim(),
      hospitalId: userData.hospitalId,
      isActive: true,
      isVerified: false,
      fechaCreacion: now,
      fechaActualizacion: now,
      ultimoAcceso: null,
      preferencias: userData.preferencias || {
        idioma: 'es',
        tema: 'claro',
        notificaciones: true
      },
      replitMetadata: userData.replitMetadata || {
        deploymentUrl: process.env.REPL_URL || 'localhost:5000',
        lastActiveSession: null
      }
    };

    // Store user data
    await replitDB.set(`users:${userId}`, JSON.stringify(user));
    
    // Create email index for fast lookups
    await replitDB.set(`users:email:${user.email}`, userId);
    
    // Create license index for validation
    await replitDB.set(`licenses:${user.licenseNumber}`, userId);

    return user;
  }

  async getUserByEmail(email: string): Promise<MedicalUser | null> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const userId = await replitDB.get(`users:email:${normalizedEmail}`);
      
      if (!userId) return null;

      const userDataStr = await replitDB.get(`users:${userId}`);
      if (!userDataStr) return null;

      return JSON.parse(userDataStr) as MedicalUser;
    } catch (error) {
      console.error('[AUTH SERVICE] Error getting user by email:', error);
      return null;
    }
  }

  async getUserById(userId: string): Promise<MedicalUser | null> {
    try {
      const userDataStr = await replitDB.get(`users:${userId}`);
      if (!userDataStr) return null;

      return JSON.parse(userDataStr) as MedicalUser;
    } catch (error) {
      console.error('[AUTH SERVICE] Error getting user by ID:', error);
      return null;
    }
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('[AUTH SERVICE] Error validating password:', error);
      return false;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return;

      user.ultimoAcceso = new Date().toISOString();
      user.fechaActualizacion = new Date().toISOString();

      await replitDB.set(`users:${userId}`, JSON.stringify(user));
    } catch (error) {
      console.error('[AUTH SERVICE] Error updating last login:', error);
    }
  }

  // Token management
  async generateTokens(user: MedicalUser): Promise<AuthTokens> {
    const accessTokenExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshTokenId = uuidv4();
    const refreshToken = jwt.sign(
      {
        id: user.id,
        tokenId: refreshTokenId,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token
    await replitDB.set(`refresh_tokens:${refreshTokenId}`, JSON.stringify({
      userId: user.id,
      tokenId: refreshTokenId,
      expiresAt: refreshTokenExpiry,
      createdAt: Date.now(),
      isActive: true
    }));

    return {
      accessToken,
      refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry
    };
  }

  async validateRefreshToken(refreshToken: string): Promise<{ valid: boolean; userId?: string; tokenId?: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      
      if (decoded.type !== 'refresh') {
        return { valid: false };
      }

      const tokenDataStr = await replitDB.get(`refresh_tokens:${decoded.tokenId}`);
      if (!tokenDataStr) {
        return { valid: false };
      }

      const tokenData = JSON.parse(tokenDataStr);
      
      if (!tokenData.isActive || Date.now() > tokenData.expiresAt) {
        // Clean up expired token
        await replitDB.delete(`refresh_tokens:${decoded.tokenId}`);
        return { valid: false };
      }

      return {
        valid: true,
        userId: decoded.id,
        tokenId: decoded.tokenId
      };
    } catch (error) {
      console.error('[AUTH SERVICE] Error validating refresh token:', error);
      return { valid: false };
    }
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    try {
      await replitDB.delete(`refresh_tokens:${tokenId}`);
    } catch (error) {
      console.error('[AUTH SERVICE] Error revoking refresh token:', error);
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    try {
      const keys = await replitDB.list('refresh_tokens:');
      
      for (const key of keys) {
        const tokenDataStr = await replitDB.get(key);
        if (!tokenDataStr) continue;

        const tokenData = JSON.parse(tokenDataStr);
        if (tokenData.userId === userId) {
          await replitDB.delete(key);
        }
      }
    } catch (error) {
      console.error('[AUTH SERVICE] Error revoking all user tokens:', error);
    }
  }

  // Session management
  async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      isActive: true,
      ...sessionData
    };

    await replitDB.set(`sessions:${sessionId}`, JSON.stringify(session));
    return sessionId;
  }

  async invalidateSession(sessionId: string): Promise<void> {
    try {
      await replitDB.delete(`sessions:${sessionId}`);
    } catch (error) {
      console.error('[AUTH SERVICE] Error invalidating session:', error);
    }
  }

  // Audit logging
  async createAuditLog(logEntry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      const logData: AuditLogEntry = {
        id,
        timestamp,
        ...logEntry
      };

      const logKey = `audit:${Date.now()}:${logEntry.action}:${logEntry.userId || 'anonymous'}`;
      await replitDB.set(logKey, JSON.stringify(logData));
      
      // Also log to console for immediate visibility
      console.log('[MEDICAL AUDIT]', logData);
    } catch (error) {
      console.error('[AUTH SERVICE] Error creating audit log:', error);
    }
  }

  // License validation
  async isLicenseNumberTaken(licenseNumber: string, excludeUserId?: string): Promise<boolean> {
    try {
      const normalizedLicense = licenseNumber.toUpperCase().trim();
      const existingUserId = await replitDB.get(`licenses:${normalizedLicense}`);
      
      if (!existingUserId) return false;
      if (excludeUserId && existingUserId === excludeUserId) return false;
      
      return true;
    } catch (error) {
      console.error('[AUTH SERVICE] Error checking license:', error);
      return false;
    }
  }

  // Cleanup utilities
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const keys = await replitDB.list('refresh_tokens:');
      const now = Date.now();
      let cleaned = 0;

      for (const key of keys) {
        const tokenDataStr = await replitDB.get(key);
        if (!tokenDataStr) continue;

        try {
          const tokenData = JSON.parse(tokenDataStr);
          if (now > tokenData.expiresAt) {
            await replitDB.delete(key);
            cleaned++;
          }
        } catch (e) {
          // Invalid data, delete it
          await replitDB.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[AUTH SERVICE] Cleaned up ${cleaned} expired tokens`);
      }
    } catch (error) {
      console.error('[AUTH SERVICE] Error cleaning up tokens:', error);
    }
  }
}

export const authService = new ReplitAuthService();