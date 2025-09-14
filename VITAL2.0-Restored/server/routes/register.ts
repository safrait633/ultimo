import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { createReplitDB } from '../database/replit-db-adapter';
import { MedicalUserDB } from '../database/medical-user-db';
import { JWTManager } from '../auth/jwt-manager';
import rateLimit from 'express-rate-limit';

const router = Router();
const replitDB = createReplitDB();
const medicalUserDB = new MedicalUserDB(replitDB);
const jwtManager = new JWTManager();

// Rate limiting for registration
const registerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 registration attempts per windowMs
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Medical specialties list for validation (expanded)
const MEDICAL_SPECIALTIES = [
  'Cardiología',
  'Neumología',
  'Gastroenterología',
  'Endocrinología',
  'Hematología',
  'Neurología',
  'Oftalmología',
  'Otorrinolaringología',
  'Reumatología',
  'Dermatología',
  'Medicina Musculoesquelética',
  'Urología',
  'Infectología',
  'Medicina Interna',
  'Medicina Familiar',
  'Pediatría',
  'Ginecología y Obstetricia',
  'Cirugía General',
  'Oncología',
  'Radiología',
  'Psiquiatría',
  'Anestesiología',
  'Medicina de Emergencia'
];

// Registration validation schema
const medicalRegisterSchema = z.object({
  firstName: z.string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(50, "Nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "Nombre solo puede contener letras"),
  lastName: z.string()
    .min(2, "Apellido debe tener al menos 2 caracteres")
    .max(50, "Apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, "Apellido solo puede contener letras"),
  middleName: z.string()
    .max(50, "Segundo nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/, "Segundo nombre solo puede contener letras")
    .optional(),
  email: z.string()
    .email("Email inválido")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Formato de email profesional requerido"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .max(128, "Contraseña no puede exceder 128 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo"),
  confirmPassword: z.string(),
  specialty: z.enum(MEDICAL_SPECIALTIES as [string, ...string[]], {
    errorMap: () => ({ message: "Especialidad médica no válida" })
  }),
  licenseNumber: z.string()
    .min(4, "Número de colegiado debe tener al menos 4 caracteres")
    .max(20, "Número de colegiado no puede exceder 20 caracteres")
    .regex(/^[A-Z0-9]{4,20}$/, "Solo se permiten letras mayúsculas y números (ej: 12345, CMED12345)"),
  hospitalId: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Debe aceptar los términos y condiciones"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Medical user registration endpoint
router.post('/register', registerRateLimit, async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Validate input data
    const validatedData = medicalRegisterSchema.parse(req.body);
    
    // Check if email already exists
    const existingUserByEmail = await replitDB.get(`users:email:${validatedData.email.toLowerCase()}`);
    if (existingUserByEmail) {
      await replitDB.set(
        `audit:${Date.now()}:registration_attempt:email_exists`,
        JSON.stringify({
          action: 'registration_failed_email_exists',
          email: validatedData.email,
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado en el sistema",
        code: "EMAIL_EXISTS"
      });
    }

    // Check if license number already exists
    const normalizedLicense = validatedData.licenseNumber.toUpperCase().replace(/\s+/g, '');
    const existingLicense = await replitDB.get(`licenses:${normalizedLicense}`);
    if (existingLicense) {
      await replitDB.set(
        `audit:${Date.now()}:registration_attempt:license_exists`,
        JSON.stringify({
          action: 'registration_failed_license_exists',
          licenseNumber: validatedData.licenseNumber,
          ipAddress: ip,
          userAgent,
          timestamp: new Date().toISOString()
        })
      );
      
      return res.status(400).json({
        success: false,
        message: "El número de colegiado ya está registrado",
        code: "LICENSE_EXISTS"
      });
    }

    // Hash password with bcrypt (12 rounds for medical security)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Generate unique user ID
    const userId = crypto.randomBytes(16).toString('hex');
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user object
    const newUser = {
      id: userId,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      nombres: validatedData.firstName,
      apellidos: validatedData.lastName,
      segundoNombre: validatedData.middleName || null,
      role: 'medico' as const,
      specialty: validatedData.specialty,
      licenseNumber: normalizedLicense,
      hospitalId: validatedData.hospitalId || null,
      isActive: false, // Requires admin activation
      isVerified: false, // Requires email verification
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry.toISOString(),
      ultimoAcceso: null,
      preferencias: {
        idioma: 'es',
        tema: 'light',
        notificaciones: true
      },
      replitMetadata: {
        deploymentUrl: process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}`
          : req.get('host') || 'localhost',
        lastActiveSession: null,
        registrationIp: ip,
        registrationUserAgent: userAgent
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save user with multiple keys for efficient lookups
    await Promise.all([
      // Primary user data
      replitDB.set(`users:${userId}`, JSON.stringify(newUser)),
      // Email lookup
      replitDB.set(`users:email:${validatedData.email.toLowerCase()}`, userId),
      // License lookup
      replitDB.set(`licenses:${normalizedLicense}`, userId),
      // Verification token lookup
      replitDB.set(`verification:${verificationToken}`, JSON.stringify({
        userId,
        email: validatedData.email.toLowerCase(),
        expiresAt: verificationExpiry.toISOString(),
        type: 'email_verification'
      }))
    ]);

    // Create registration audit log
    await replitDB.set(
      `audit:${Date.now()}:registration_success:${userId}`,
      JSON.stringify({
        action: 'medical_user_registered',
        userId,
        email: validatedData.email,
        specialty: validatedData.specialty,
        licenseNumber: normalizedLicense,
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    console.log(`[REGISTER] Nuevo usuario médico registrado: ${validatedData.email} - ${validatedData.specialty}`);

    // Return success response (without sensitive data)
    res.status(201).json({
      success: true,
      message: "Registro exitoso. Se ha enviado un email de verificación.",
      data: {
        user: {
          id: userId,
          email: validatedData.email,
          nombres: validatedData.firstName,
          apellidos: validatedData.lastName,
          specialty: validatedData.specialty,
          licenseNumber: normalizedLicense,
          isActive: false,
          isVerified: false
        },
        verificationRequired: true,
        nextSteps: [
          "Verificar email haciendo clic en el enlace enviado",
          "Esperar activación por parte del administrador",
          "Iniciar sesión una vez activada la cuenta"
        ]
      }
    });

  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    
    // Log registration error
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await replitDB.set(
      `audit:${Date.now()}:registration_error`,
      JSON.stringify({
        action: 'registration_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress: ip,
        userAgent,
        timestamp: new Date().toISOString()
      })
    );

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Datos de registro inválidos",
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code
        })),
        code: "VALIDATION_ERROR"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor médico",
      code: "SERVER_ERROR"
    });
  }
});

// Check email availability endpoint
router.post('/check-email', async (req, res) => {
  try {
    const { email } = z.object({
      email: z.string().email()
    }).parse(req.body);

    const existingUser = await replitDB.get(`users:email:${email.toLowerCase()}`);
    
    res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Email ya registrado" : "Email disponible"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Email inválido"
    });
  }
});

// Check license availability endpoint
router.post('/check-license', async (req, res) => {
  try {
    const { licenseNumber } = z.object({
      licenseNumber: z.string().min(5)
    }).parse(req.body);

    const existingLicense = await replitDB.get(`licenses:${licenseNumber.toUpperCase()}`);
    
    res.json({
      success: true,
      available: !existingLicense,
      message: existingLicense ? "Número de colegiado ya registrado" : "Número de colegiado disponible"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Número de colegiado inválido"
    });
  }
});

// Get available specialties
router.get('/specialties', (req, res) => {
  const specialtiesWithData = MEDICAL_SPECIALTIES.map(specialty => {
    const data = getSpecialtyData(specialty);
    return {
      value: specialty,
      label: data.label,
      icon: data.icon,
      category: data.category
    };
  });

  // Group by category for better organization
  const groupedSpecialties = specialtiesWithData.reduce((acc, specialty) => {
    if (!acc[specialty.category]) {
      acc[specialty.category] = [];
    }
    acc[specialty.category].push(specialty);
    return acc;
  }, {} as Record<string, typeof specialtiesWithData>);

  res.json({
    success: true,
    data: specialtiesWithData,
    grouped: groupedSpecialties,
    totalCount: specialtiesWithData.length
  });
});

// Helper function to get specialty icons and labels
function getSpecialtyData(specialty: string): { icon: string; label: string; category: string } {
  const specialtyMap: Record<string, { icon: string; label: string; category: string }> = {
    'cardiologia': { icon: 'Heart', label: 'Cardiología', category: 'Medicina Interna' },
    'neurologia': { icon: 'Brain', label: 'Neurología', category: 'Medicina Interna' },
    'dermatologia': { icon: 'Shield', label: 'Dermatología', category: 'Especialidades Médicas' },
    'oftalmologia': { icon: 'Eye', label: 'Oftalmología', category: 'Especialidades Médicas' },
    'traumatologia': { icon: 'Bone', label: 'Traumatología y Ortopedia', category: 'Cirugía' },
    'endocrinologia': { icon: 'Activity', label: 'Endocrinología', category: 'Medicina Interna' },
    'gastroenterologia': { icon: 'Circle', label: 'Gastroenterología', category: 'Medicina Interna' },
    'psiquiatria': { icon: 'User', label: 'Psiquiatría', category: 'Salud Mental' },
    'pediatria': { icon: 'Baby', label: 'Pediatría', category: 'Medicina Pediátrica' },
    'ginecologia': { icon: 'Users', label: 'Ginecología y Obstetricia', category: 'Especialidades Médicas' },
    'urologia': { icon: 'Circle', label: 'Urología', category: 'Cirugía' },
    'otorrinolaringologia': { icon: 'Mic', label: 'Otorrinolaringología', category: 'Especialidades Médicas' },
    'medicina_general': { icon: 'Stethoscope', label: 'Medicina General', category: 'Atención Primaria' },
    'medicina_interna': { icon: 'HeartPulse', label: 'Medicina Interna', category: 'Medicina Interna' },
    'cirugia_general': { icon: 'Scissors', label: 'Cirugía General', category: 'Cirugía' },
    'anestesiologia': { icon: 'Syringe', label: 'Anestesiología', category: 'Especialidades Médicas' },
    'radiologia': { icon: 'Scan', label: 'Radiología', category: 'Diagnóstico por Imágenes' },
    'patologia': { icon: 'TestTube', label: 'Anatomía Patológica', category: 'Diagnóstico' },
    'medicina_familiar': { icon: 'Home', label: 'Medicina Familiar', category: 'Atención Primaria' },
    'geriatria': { icon: 'UserCheck', label: 'Geriatría', category: 'Medicina Interna' },
    'neumologia': { icon: 'Wind', label: 'Neumología', category: 'Medicina Interna' },
    'hematologia': { icon: 'Droplet', label: 'Hematología', category: 'Medicina Interna' },
    'infectologia': { icon: 'Shield', label: 'Infectología', category: 'Medicina Interna' },
    'nefrologia': { icon: 'Droplet', label: 'Nefrología', category: 'Medicina Interna' },
    'reumatologia': { icon: 'Bone', label: 'Reumatología', category: 'Medicina Interna' },
    'oncologia': { icon: 'Target', label: 'Oncología Médica', category: 'Medicina Interna' },
    'medicina_nuclear': { icon: 'Zap', label: 'Medicina Nuclear', category: 'Diagnóstico por Imágenes' },
    'medicina_fisica_rehabilitacion': { icon: 'Dumbbell', label: 'Medicina Física y Rehabilitación', category: 'Especialidades Médicas' },
    'cirugia_plastica': { icon: 'Scissors', label: 'Cirugía Plástica', category: 'Cirugía' },
    'cirugia_cardiovascular': { icon: 'Heart', label: 'Cirugía Cardiovascular', category: 'Cirugía' },
    'cirugia_neurologica': { icon: 'Brain', label: 'Neurocirugía', category: 'Cirugía' },
    'medicina_intensiva': { icon: 'MonitorSpeaker', label: 'Medicina Intensiva', category: 'Cuidados Críticos' },
    'medicina_legal': { icon: 'Scale', label: 'Medicina Legal', category: 'Especialidades Médicas' },
    'salud_publica': { icon: 'Globe', label: 'Salud Pública', category: 'Medicina Preventiva' },
    'medicina_ocupacional': { icon: 'HardHat', label: 'Medicina del Trabajo', category: 'Medicina Preventiva' },
    'alergia_inmunologia': { icon: 'Shield', label: 'Alergia e Inmunología', category: 'Especialidades Médicas' },
    'cirugia_pediatrica': { icon: 'Baby', label: 'Cirugía Pediátrica', category: 'Medicina Pediátrica' },
    'neonatologia': { icon: 'Baby', label: 'Neonatología', category: 'Medicina Pediátrica' },
    'medicina_deportiva': { icon: 'Activity', label: 'Medicina del Deporte', category: 'Especialidades Médicas' },
    'cirugia_digestiva': { icon: 'Circle', label: 'Cirugía Digestiva', category: 'Cirugía' }
  };
  
  return specialtyMap[specialty] || { icon: 'Stethoscope', label: specialty, category: 'Otras Especialidades' };
}

export default router;