import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "medical_app_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "medical_app_refresh_secret_key";

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres"),
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  specialty: z.string().min(1, "Especialidad es requerida"),
  licenseNumber: z.string().min(1, "Número de licencia es requerido")
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña es requerida")
});

// Generate tokens
function generateTokens(userId: string) {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    const existingUsername = await storage.getUserByUsername(validatedData.username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }
    
    // Create user
    const newUser = await storage.createUser({
      ...validatedData,
      role: 'medico',
      language: 'es',
      theme: 'light'
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);
    
    // Save refresh token
    await storage.saveRefreshToken(newUser.id, refreshToken);
    
    // Create audit log
    await storage.createAuditLog({
      userId: newUser.id,
      action: 'registro',
      resource: 'user',
      resourceId: newUser.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      metadata: JSON.stringify({ message: 'Usuario registrado exitosamente' })
    });
    
    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          specialty: newUser.specialty,
          role: newUser.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find user
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verify password
    const isValidPassword = await storage.verifyPassword(validatedData.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Save refresh token
    await storage.saveRefreshToken(user.id, refreshToken);
    
    // Update last login
    await storage.updateLastLogin(user.id);
    
    // Create audit log
    await storage.createAuditLog({
      userId: user.id,
      action: 'login',
      resource: 'session',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      metadata: JSON.stringify({ message: 'Usuario inició sesión' })
    });
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          specialty: user.specialty,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token requerido'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          specialty: user.specialty,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified
        }
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await storage.deleteRefreshToken(refreshToken);
    }
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;