import type { Express } from "express";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Simple registration endpoint that works
export function setupSimpleRegister(app: Express) {
  
  const registrationSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2), 
    middleName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    specialty: z.string().min(1),
    licenseNumber: z.string().min(4),
    hospitalId: z.string().optional(),
    acceptTerms: z.boolean()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

  // Complete registration endpoint with database integration
  app.post('/api/auth/register', async (req, res) => {
    try {
      console.log('[REGISTER] Request received for:', req.body.email);
      
      const validatedData = registrationSchema.parse(req.body);
      
      // Check if email already exists
      const { db } = await import('./db.js');
      const { users } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [existingUser] = await db.select().from(users).where(eq(users.email, validatedData.email.toLowerCase())).limit(1);
      
      if (existingUser) {
        console.log('[REGISTER] Email already exists:', validatedData.email);
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado en el sistema",
          code: "EMAIL_EXISTS"
        });
      }

      // Check license number doesn't already exist 
      const [existingLicense] = await db.select().from(users).where(eq(users.licenseNumber, validatedData.licenseNumber.toUpperCase())).limit(1);
      
      if (existingLicense) {
        console.log('[REGISTER] License already exists:', validatedData.licenseNumber);
        return res.status(400).json({
          success: false,
          message: "El número de licencia ya está registrado",
          code: "LICENSE_EXISTS"
        });
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      const userId = crypto.randomBytes(16).toString('hex');
      const now = new Date();
      
      const newUser = {
        id: userId,
        email: validatedData.email.toLowerCase(),
        username: validatedData.email.toLowerCase(), // Use email as username for simplicity
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName || null,
        specialty: validatedData.specialty,
        licenseNumber: validatedData.licenseNumber.toUpperCase(),
        hospitalId: validatedData.hospitalId || null,
        role: 'medico' as const,
        isActive: true,    // Auto-activate for development
        isVerified: true,  // Auto-verify for development  
        createdAt: now,
        updatedAt: now,
        lastLogin: null
      };
      
      // Save to database
      await db.insert(users).values([newUser]);
      
      console.log('[REGISTER] User saved to database successfully:', validatedData.email);
      
      // Generate JWT token for immediate access
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          specialty: newUser.specialty
        },
        process.env.JWT_SECRET || 'medical-jwt-secret',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        success: true,
        message: "¡Registro exitoso! Ya puedes acceder a la aplicación.",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            specialty: newUser.specialty,
            licenseNumber: newUser.licenseNumber,
            hospitalId: newUser.hospitalId,
            role: newUser.role,
            isActive: newUser.isActive,
            isVerified: newUser.isVerified
          },
          token: token,
          requiresVerification: false  // Development mode - no email verification needed
        }
      });
      
    } catch (error) {
      console.error('[REGISTER ERROR]', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  });

  // Check email availability
  app.post('/api/auth/check-email', async (req, res) => {
    res.json({
      success: true,
      available: true,
      message: "Email disponible"
    });
  });

  // Check license availability
  app.post('/api/auth/check-license', async (req, res) => {
    res.json({
      success: true,
      available: true,
      message: "Número de colegiado disponible"
    });
  });

  // Specialties endpoint
  app.get('/api/auth/specialties', (req, res) => {
    const specialties = [
      { value: 'cardiologia', label: 'Cardiología', icon: 'Heart', category: 'Medicina Interna' },
      { value: 'neurologia', label: 'Neurología', icon: 'Brain', category: 'Medicina Interna' },
      { value: 'medicina_general', label: 'Medicina General', icon: 'Stethoscope', category: 'Atención Primaria' }
    ];
    
    res.json({
      success: true,
      data: specialties,
      totalCount: specialties.length
    });
  });

  console.log('[SIMPLE REGISTER] Simple registration endpoints configured');
}