import { Request, Response, NextFunction } from 'express';
import Database from '@replit/database';

const replitDB = new Database();

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
  keyGenerator: (req: Request) => string;
}

interface RateLimitData {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
    keyGenerator: (req: Request) => {
      const ip = req.ip || 'unknown';
      return `rate_limit:login:${ip}`;
    }
  },
  REGISTRATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours block
    keyGenerator: (req: Request) => {
      const ip = req.ip || 'unknown';
      return `rate_limit:register:${ip}`;
    }
  },
  REFRESH: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxAttempts: 10,
    blockDurationMs: 15 * 60 * 1000, // 15 minutes block
    keyGenerator: (req: Request) => {
      const ip = req.ip || 'unknown';
      return `rate_limit:refresh:${ip}`;
    }
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours block
    keyGenerator: (req: Request) => {
      const email = req.body?.email || 'unknown';
      return `rate_limit:password_reset:${email}`;
    }
  }
};

// Create rate limiter middleware
export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = config.keyGenerator(req);
      const now = Date.now();

      // Get current rate limit data
      const rateLimitDataStr = await replitDB.get(key);
      let rateLimitData: RateLimitData | null = null;

      if (rateLimitDataStr) {
        try {
          rateLimitData = JSON.parse(rateLimitDataStr);
        } catch (e) {
          // Invalid data, reset
          await replitDB.delete(key);
        }
      }

      // Check if currently blocked
      if (rateLimitData?.blockedUntil && now < rateLimitData.blockedUntil) {
        const remainingTime = Math.ceil((rateLimitData.blockedUntil - now) / 1000 / 60);
        
        // Log blocked attempt
        await logSecurityEvent(req, 'RATE_LIMIT_BLOCKED', {
          key,
          remainingMinutes: remainingTime,
          attempts: rateLimitData.attempts
        });

        return res.status(429).json({
          success: false,
          message: `Demasiados intentos. Intenta de nuevo en ${remainingTime} minutos`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: remainingTime * 60
        });
      }

      // Initialize or update rate limit data
      if (!rateLimitData || (now - rateLimitData.firstAttempt) > config.windowMs) {
        // Reset window
        rateLimitData = {
          attempts: 1,
          firstAttempt: now,
          lastAttempt: now
        };
      } else {
        // Increment attempts
        rateLimitData.attempts += 1;
        rateLimitData.lastAttempt = now;
      }

      // Check if limit exceeded
      if (rateLimitData.attempts > config.maxAttempts) {
        rateLimitData.blockedUntil = now + config.blockDurationMs;
        
        // Save blocked state
        await replitDB.set(key, JSON.stringify(rateLimitData));
        
        // Log rate limit exceeded
        await logSecurityEvent(req, 'RATE_LIMIT_EXCEEDED', {
          key,
          attempts: rateLimitData.attempts,
          blockDurationMinutes: config.blockDurationMs / 1000 / 60
        });

        const remainingTime = Math.ceil(config.blockDurationMs / 1000 / 60);
        return res.status(429).json({
          success: false,
          message: `Límite de intentos excedido. Cuenta bloqueada por ${remainingTime} minutos`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: remainingTime * 60
        });
      }

      // Save updated rate limit data
      await replitDB.set(key, JSON.stringify(rateLimitData));

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': config.maxAttempts.toString(),
        'X-RateLimit-Remaining': Math.max(0, config.maxAttempts - rateLimitData.attempts).toString(),
        'X-RateLimit-Reset': new Date(rateLimitData.firstAttempt + config.windowMs).toISOString()
      });

      next();
    } catch (error) {
      console.error('[RATE LIMITER ERROR]', error);
      // In case of error, allow the request but log it
      await logSecurityEvent(req, 'RATE_LIMITER_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
      next();
    }
  };
};

// Security event logging
async function logSecurityEvent(req: Request, event: string, metadata: any) {
  try {
    const timestamp = Date.now();
    const ip = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const logKey = `security_log:${timestamp}:${event}:${ip}`;
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      path: req.path,
      method: req.method,
      metadata
    };

    await replitDB.set(logKey, JSON.stringify(logData));
    
    // Also log to console for immediate visibility
    console.log(`[SECURITY EVENT] ${event}:`, logData);
  } catch (error) {
    console.error('[SECURITY LOG ERROR]', error);
  }
}

// Clean up old rate limit entries (call periodically)
export async function cleanupRateLimitData() {
  try {
    const keys = await replitDB.list('rate_limit:');
    const now = Date.now();
    let cleaned = 0;

    for (const key of keys) {
      try {
        const dataStr = await replitDB.get(key);
        if (!dataStr) continue;

        const data: RateLimitData = JSON.parse(dataStr);
        
        // Remove entries older than 24 hours or past block time
        const shouldCleanup = (
          (now - data.lastAttempt) > (24 * 60 * 60 * 1000) ||
          (data.blockedUntil && now > data.blockedUntil + (60 * 60 * 1000))
        );

        if (shouldCleanup) {
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
      console.log(`[RATE LIMITER] Cleaned up ${cleaned} old entries`);
    }
  } catch (error) {
    console.error('[RATE LIMITER CLEANUP ERROR]', error);
  }
}

// Rate limiter middleware instances
export const loginRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.LOGIN);
export const registrationRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.REGISTRATION);
export const refreshRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.REFRESH);
export const passwordResetRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.PASSWORD_RESET);