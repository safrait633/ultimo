import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Medical license validation patterns for different countries/regions
const MEDICAL_LICENSE_PATTERNS = {
  COLOMBIA: /^[A-Z]{2}\d{5}$/, // CG12345 format
  SPAIN: /^[0-9]{8,9}$/, // Spanish medical license
  MEXICO: /^[A-Z]{3}\d{6}$/, // Mexican medical license
  GENERIC: /^[A-Z0-9]{6,15}$/ // Generic international format
};

// Medical specialties validation list
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

// Login validation schema
export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email médico inválido',
      'any.required': 'Email es requerido'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Contraseña debe tener al menos 8 caracteres',
      'string.max': 'Contraseña no puede exceder 128 caracteres',
      'string.pattern.base': 'Contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo',
      'any.required': 'Contraseña es requerida'
    })
});

// Registration validation schema
export const registrationValidationSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email médico inválido',
      'any.required': 'Email es requerido'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Contraseña debe tener al menos 8 caracteres',
      'string.max': 'Contraseña no puede exceder 128 caracteres',
      'string.pattern.base': 'Contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo',
      'any.required': 'Contraseña es requerida'
    }),
  nombres: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.min': 'Nombres debe tener al menos 2 caracteres',
      'string.max': 'Nombres no puede exceder 50 caracteres',
      'string.pattern.base': 'Nombres solo puede contener letras y espacios',
      'any.required': 'Nombres son requeridos'
    }),
  apellidos: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.min': 'Apellidos debe tener al menos 2 caracteres',
      'string.max': 'Apellidos no puede exceder 50 caracteres',
      'string.pattern.base': 'Apellidos solo puede contener letras y espacios',
      'any.required': 'Apellidos son requeridos'
    }),
  specialty: Joi.string()
    .valid(...MEDICAL_SPECIALTIES)
    .required()
    .messages({
      'any.only': 'Especialidad médica no reconocida',
      'any.required': 'Especialidad médica es requerida'
    }),
  licenseNumber: Joi.string()
    .custom((value: string, helpers: any) => {
      // Check against multiple patterns
      const isValid = Object.values(MEDICAL_LICENSE_PATTERNS).some(pattern => 
        pattern.test(value)
      );
      
      if (!isValid) {
        return helpers.error('string.pattern.base');
      }
      
      return value;
    })
    .required()
    .messages({
      'string.pattern.base': 'Número de licencia médica inválido (formato: CG12345)',
      'any.required': 'Número de licencia médica es requerido'
    }),
  role: Joi.string()
    .valid('medico', 'super_admin')
    .default('medico')
    .messages({
      'any.only': 'Rol debe ser "medico" o "super_admin"'
    }),
  hospitalId: Joi.string()
    .alphanum()
    .max(20)
    .optional()
    .allow(null)
    .messages({
      'string.alphanum': 'ID de hospital debe ser alfanumérico',
      'string.max': 'ID de hospital no puede exceder 20 caracteres'
    })
});

// Refresh token validation schema
export const refreshTokenValidationSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Token de renovación es requerido',
      'string.empty': 'Token de renovación no puede estar vacío'
    })
});

// Validation middleware factory
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message,
        code: detail.type
      }));

      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors,
        code: 'VALIDATION_ERROR'
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// IP address extraction utility
export const extractClientInfo = (req: Request) => {
  const ip = req.ip || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    (req.connection as any)?.socket?.remoteAddress ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    'unknown';

  const userAgent = req.headers['user-agent'] || 'unknown';
  const origin = req.headers.origin || req.headers.referer || 'unknown';

  return {
    ip: Array.isArray(ip) ? ip[0] : ip,
    userAgent,
    origin,
    timestamp: new Date().toISOString()
  };
};

// Medical data sanitization
export const sanitizeMedicalData = (data: any) => {
  const sanitized = { ...data };
  
  // Remove sensitive fields from logging
  delete sanitized.password;
  delete sanitized.passwordHash;
  
  // Normalize medical data
  if (sanitized.nombres) {
    sanitized.nombres = sanitized.nombres.trim();
  }
  if (sanitized.apellidos) {
    sanitized.apellidos = sanitized.apellidos.trim();
  }
  if (sanitized.licenseNumber) {
    sanitized.licenseNumber = sanitized.licenseNumber.toUpperCase().trim();
  }
  
  return sanitized;
};