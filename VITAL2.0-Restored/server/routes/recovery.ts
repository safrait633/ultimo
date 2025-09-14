import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { createReplitDB } from '../database/replit-db-adapter';
import rateLimit from 'express-rate-limit';

const router = Router();
const replitDB = createReplitDB();

// Rate limiting for password recovery (3 attempts per hour per email)
const recoveryRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 recovery attempts per hour
  message: {
    success: false,
    message: 'Demasiados intentos de recuperación. Intente nuevamente en 1 hora.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by email instead of IP for medical users
    const email = req.body?.email || req.ip;
    return `recovery:${email}`;
  }
});

// Password recovery request validation
const forgotPasswordSchema = z.object({
  email: z.string()
    .email("Email inválido")
    .toLowerCase()
});

// Password reset validation
const resetPasswordSchema = z.object({
  token: z.string()
    .min(64, "Token de recuperación inválido")
    .max(64, "Token de recuperación inválido"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .max(128, "Contraseña no puede exceder 128 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Forgot password endpoint
router.post('/forgot-password', recoveryRateLimit, async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Validate email input
    const { email } = forgotPasswordSchema.parse(req.body);
    
    // Check if user exists
    const userId = await replitDB.get(`users:email:${email}`);
    if (!userId) {
      // Log failed attempt for security audit
      await replitDB.set(
        `audit:${Date.now()}:recovery_attempt:user_not_found`,
        JSON.stringify({
          action: 'password_recovery_failed_user_not_found',
          email,
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      // Return success message even if user doesn't exist (security best practice)
      return res.json({
        success: true,
        message: "Si el email está registrado, recibirás instrucciones de recuperación en los próximos minutos.",
        code: "RECOVERY_EMAIL_SENT"
      });
    }

    // Get user data
    const userDataStr = await replitDB.get(`users:${userId}`);
    if (!userDataStr) {
      return res.json({
        success: true,
        message: "Si el email está registrado, recibirás instrucciones de recuperación en los próximos minutos.",
        code: "RECOVERY_EMAIL_SENT"
      });
    }

    const userData = JSON.parse(userDataStr);
    
    // Check if user is active
    if (!userData.isActive) {
      await replitDB.set(
        `audit:${Date.now()}:recovery_attempt:inactive_user`,
        JSON.stringify({
          action: 'password_recovery_failed_inactive_user',
          userId,
          email,
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      return res.status(400).json({
        success: false,
        message: "La cuenta médica está inactiva. Contacte al administrador.",
        code: "ACCOUNT_INACTIVE"
      });
    }

    // Generate secure recovery token
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    
    // Store recovery token
    await replitDB.set(
      `recovery:${recoveryToken}`,
      JSON.stringify({
        userId,
        email,
        expiresAt: expiresAt.toISOString(),
        type: 'password_recovery',
        createdAt: new Date().toISOString(),
        ipAddress: ip,
        userAgent
      })
    );

    // Update user with recovery request info
    const updatedUserData = {
      ...userData,
      lastPasswordRecoveryRequest: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await replitDB.set(`users:${userId}`, JSON.stringify(updatedUserData));

    // Create audit log for successful recovery request
    await replitDB.set(
      `audit:${Date.now()}:recovery_success:${userId}`,
      JSON.stringify({
        action: 'password_recovery_requested',
        userId,
        email,
        recoveryToken: recoveryToken.substring(0, 8) + '...', // Log only first 8 chars for security
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    console.log(`[RECOVERY] Solicitud de recuperación para: ${email}`);

    // In a real application, you would send an email here
    // For now, we'll return the token in development mode
    const responseData: any = {
      success: true,
      message: "Se han enviado las instrucciones de recuperación a tu email profesional.",
      code: "RECOVERY_EMAIL_SENT"
    };

    // Include token in development mode for testing
    if (process.env.NODE_ENV === 'development') {
      responseData.developmentToken = recoveryToken;
      responseData.developmentNote = "Token incluido solo en modo desarrollo";
    }

    res.json(responseData);

  } catch (error) {
    console.error('[RECOVERY ERROR]', error);
    
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await replitDB.set(
      `audit:${Date.now()}:recovery_error`,
      JSON.stringify({
        action: 'password_recovery_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Email inválido",
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })),
        code: "VALIDATION_ERROR"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "SERVER_ERROR"
    });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Validate input
    const { token, password } = resetPasswordSchema.parse(req.body);
    
    // Verify recovery token
    const recoveryDataStr = await replitDB.get(`recovery:${token}`);
    if (!recoveryDataStr) {
      await replitDB.set(
        `audit:${Date.now()}:reset_attempt:invalid_token`,
        JSON.stringify({
          action: 'password_reset_failed_invalid_token',
          token: token.substring(0, 8) + '...',
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      return res.status(400).json({
        success: false,
        message: "Token de recuperación inválido o expirado",
        code: "INVALID_TOKEN"
      });
    }

    const recoveryData = JSON.parse(recoveryDataStr);
    
    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(recoveryData.expiresAt);
    
    if (now > expiresAt) {
      // Remove expired token
      await replitDB.delete(`recovery:${token}`);
      
      await replitDB.set(
        `audit:${Date.now()}:reset_attempt:expired_token`,
        JSON.stringify({
          action: 'password_reset_failed_expired_token',
          userId: recoveryData.userId,
          email: recoveryData.email,
          token: token.substring(0, 8) + '...',
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      return res.status(400).json({
        success: false,
        message: "El token de recuperación ha expirado. Solicite uno nuevo.",
        code: "TOKEN_EXPIRED"
      });
    }

    // Get user data
    const userDataStr = await replitDB.get(`users:${recoveryData.userId}`);
    if (!userDataStr) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
        code: "USER_NOT_FOUND"
      });
    }

    const userData = JSON.parse(userDataStr);
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update user password
    const updatedUserData = {
      ...userData,
      password: hashedPassword,
      lastPasswordChange: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await replitDB.set(`users:${recoveryData.userId}`, JSON.stringify(updatedUserData));
    
    // Remove used recovery token
    await replitDB.delete(`recovery:${token}`);
    
    // Create audit log for successful password reset
    await replitDB.set(
      `audit:${Date.now()}:password_reset_success:${recoveryData.userId}`,
      JSON.stringify({
        action: 'password_reset_successful',
        userId: recoveryData.userId,
        email: recoveryData.email,
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    console.log(`[RECOVERY] Contraseña restablecida para: ${recoveryData.email}`);

    res.json({
      success: true,
      message: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.",
      code: "PASSWORD_RESET_SUCCESS"
    });

  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error);
    
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await replitDB.set(
      `audit:${Date.now()}:reset_error`,
      JSON.stringify({
        action: 'password_reset_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        })),
        code: "VALIDATION_ERROR"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "SERVER_ERROR"
    });
  }
});

// Verify recovery token endpoint
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = z.object({
      token: z.string().min(64).max(64)
    }).parse(req.body);
    
    const recoveryDataStr = await replitDB.get(`recovery:${token}`);
    if (!recoveryDataStr) {
      return res.status(400).json({
        success: false,
        message: "Token inválido",
        code: "INVALID_TOKEN"
      });
    }

    const recoveryData = JSON.parse(recoveryDataStr);
    const now = new Date();
    const expiresAt = new Date(recoveryData.expiresAt);
    
    if (now > expiresAt) {
      await replitDB.delete(`recovery:${token}`);
      return res.status(400).json({
        success: false,
        message: "Token expirado",
        code: "TOKEN_EXPIRED"
      });
    }

    res.json({
      success: true,
      message: "Token válido",
      data: {
        email: recoveryData.email,
        expiresAt: recoveryData.expiresAt
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Token inválido",
      code: "INVALID_TOKEN"
    });
  }
});

export default router;