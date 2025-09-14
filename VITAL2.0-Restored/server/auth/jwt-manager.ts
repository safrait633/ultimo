import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'medico' | 'super_admin';
  specialty: string;
  licenseNumber: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenData {
  userId: string;
  sessionId: string;
  tokenId: string;
  expiresAt: Date;
  issuedAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

export class JWTManager {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry = '15m'; // 15 minutes
  private readonly refreshTokenExpiry = '7d'; // 7 days

  constructor() {
    // In production, these should come from environment variables
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'medical-access-secret-key-change-in-production';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'medical-refresh-secret-key-change-in-production';
  }

  // Generate access token with medical-specific claims
  generateAccessToken(payload: Omit<JWTPayload, 'sessionId' | 'iat' | 'exp'>): { token: string; sessionId: string } {
    const sessionId = randomUUID();
    
    const tokenPayload: JWTPayload = {
      ...payload,
      sessionId
    };

    const token = jwt.sign(tokenPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'medical-system',
      audience: 'medical-professionals'
    });

    return { token, sessionId };
  }

  // Generate refresh token
  generateRefreshToken(userId: string, sessionId: string, deviceInfo?: string, ipAddress?: string): RefreshTokenData {
    const tokenId = randomUUID();
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 7); // 7 days

    const refreshTokenData: RefreshTokenData = {
      userId,
      sessionId,
      tokenId,
      expiresAt,
      issuedAt: now,
      deviceInfo,
      ipAddress
    };

    return refreshTokenData;
  }

  // Create refresh token JWT
  createRefreshTokenJWT(refreshTokenData: RefreshTokenData): string {
    const payload = {
      tokenId: refreshTokenData.tokenId,
      userId: refreshTokenData.userId,
      sessionId: refreshTokenData.sessionId
    };

    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'medical-system',
      audience: 'medical-refresh'
    });
  }

  // Verify access token
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'medical-system',
        audience: 'medical-professionals'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Access token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log('Invalid access token');
      }
      return null;
    }
  }

  // Verify refresh token JWT
  verifyRefreshTokenJWT(token: string): { tokenId: string; userId: string; sessionId: string } | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'medical-system',
        audience: 'medical-refresh'
      }) as { tokenId: string; userId: string; sessionId: string };

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Refresh token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log('Invalid refresh token');
      }
      return null;
    }
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return false;
      
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      return (expirationTime - currentTime) <= fiveMinutes;
    } catch (error) {
      return true; // Assume expiring if we can't decode
    }
  }

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // Validate medical professional permissions
  validateMedicalPermissions(payload: JWTPayload, requiredRole?: 'medico' | 'super_admin'): boolean {
    // Check if user has valid medical license
    if (!payload.licenseNumber || !payload.specialty) {
      return false;
    }

    // Check role if specified
    if (requiredRole && payload.role !== requiredRole) {
      // Super admins can access medico resources
      if (requiredRole === 'medico' && payload.role === 'super_admin') {
        return true;
      }
      return false;
    }

    return true;
  }

  // Generate session info for audit logging
  generateSessionInfo(payload: JWTPayload): {
    sessionId: string;
    userId: string;
    userInfo: string;
    permissions: string[];
  } {
    const permissions = ['medical_access'];
    
    if (payload.role === 'super_admin') {
      permissions.push('admin_access', 'user_management', 'system_config');
    }
    
    permissions.push(`specialty_${payload.specialty.toLowerCase().replace(/\s+/g, '_')}`);

    return {
      sessionId: payload.sessionId,
      userId: payload.userId,
      userInfo: `${payload.email} (${payload.specialty})`,
      permissions
    };
  }
}