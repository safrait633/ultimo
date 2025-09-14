import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Simple login endpoint that works with our database
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email);

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Usuario o contraseña incorrectos'
      });
    }

    console.log('User found:', user.email, 'Active:', user.isActive);

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account inactive',
        message: 'Cuenta inactiva. Contacte al administrador'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        specialty: user.specialty
      },
      process.env.JWT_SECRET || 'medical-jwt-secret',
      { expiresIn: '24h' }
    );

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        specialty: user.specialty,
        licenseNumber: user.licenseNumber,
        hospitalId: user.hospitalId,
        isActive: user.isActive,
        isVerified: user.isVerified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Error interno del servidor'
    });
  }
});

// Get current user endpoint
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Token de acceso requerido'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medical-jwt-secret') as any;

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      specialty: user.specialty,
      licenseNumber: user.licenseNumber,
      hospitalId: user.hospitalId,
      isActive: user.isActive,
      isVerified: user.isVerified
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      error: 'Invalid token',
      message: 'Token inválido o expirado'
    });
  }
});

export default router;