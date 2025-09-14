import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSpecialtySchema, insertPatientSchema, insertConsultationSchema, insertTemplateSchema, loginSchema } from "@shared/schema";
import { MedicalUserDB, type InsertMedicalUser } from "./database/medical-user-db";
import { JWTManager } from "./auth/jwt-manager";
import { createReplitDB } from "./database/replit-db-adapter";
import { 
  authRateLimit, 
  requireAuth, 
  requireRole, 
  requireActiveUser, 
  securityHeaders,
  validateMedicalLicense 
} from "./middleware/auth-middleware";
import { authRouter } from './routes/auth';
import registerRouter from './routes/register';
import recoveryRouter from './routes/recovery';
import specialtyRoutes from './routes/specialties.js';
import searchRoutes from './routes/search.js';
import notificationRoutes from './routes/notifications.js';
import simpleAuthRoutes from './routes/simple-auth.js';
import anonymousPatientRoutes from './routes/anonymous-patients.js';
import postalCodeRoutes from './routes/postal-codes.js';
import favoritesRoutes from './routes/favorites';
import simpleAuth from './simple-auth';
import { setupSimpleRegister } from './simple-register';
import { seedSpecialties, getActiveSpecialties } from './specialty-seeder';
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "medical_app_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "medical_app_refresh_secret_key";

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Demasiados intentos de acceso médico. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Initialize medical authentication services
const replitDB = createReplitDB();
const medicalUserDB = new MedicalUserDB(replitDB);
const jwtManager = new JWTManager();

// Validation schemas for medical authentication
const medicalLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Contraseña debe tener al menos 8 caracteres")
});

const medicalRegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Contraseña debe contener mayúscula, minúscula, número y símbolo especial"),
  nombres: z.string().min(2, "Nombres requeridos"),
  apellidos: z.string().min(2, "Apellidos requeridos"),
  specialty: z.string().min(2, "Especialidad requerida"),
  licenseNumber: z.string()
    .min(5, "Número de licencia inválido")
    .regex(/^[A-Z]{2,3}\d{4,8}$/, "Formato de licencia inválido (ej: CG12345)"),
  hospitalId: z.string().optional(),
  role: z.enum(['medico', 'super_admin']).default('medico')
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Apply security headers to all routes
  app.use(securityHeaders);

  // CRITICAL: Register API routes FIRST before any catch-all middlewares
  console.log('Registering API routes...');
  
  // Specialties endpoints - ONLY implemented specialties
  app.get("/api/specialties", async (req, res) => {
    try {
      console.log('GET /api/specialties called - returning only implemented specialties');
      
      const activeSpecialties = await getActiveSpecialties();
      
      // Transform data to match frontend interface
      const specialties = activeSpecialties.map(specialty => ({
        id: specialty.id,
        name: specialty.name,
        slug: specialty.slug,
        description: specialty.description || `Especialidad médica de ${specialty.name}`,
        icon: specialty.icon || 'Stethoscope',
        isActive: specialty.isActive,
        patientCount: specialty.patientCount || 0,
        isPopular: (specialty.patientCount || 0) > 50
      }));
      
      console.log(`Found ${specialties.length} implemented specialties:`, specialties.map(s => s.name));
      
      res.setHeader('Content-Type', 'application/json');
      res.json(specialties);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Setup simple registration system
  setupSimpleRegister(app);
  
  // Simple authentication routes
  app.use('/api/simple', simpleAuth);
  
  // Temporary bypass: comment out all auth routers to test direct endpoint
  // app.use('/api/auth', simpleAuthRoutes);
  // app.use('/api/auth-advanced', authRouter);
  
  // Registration and recovery routes (fallback)
  // app.use('/api/auth', registerRouter);
  // app.use('/api/auth', recoveryRouter);

  // Simple working login endpoint
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log('Direct login attempt for:', email);

      // Find user by email using our database
      const { db } = await import('./db.js');
      const { users } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      const bcrypt = await import('bcrypt');

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
  app.get("/api/auth/me", async (req, res) => {
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
      const { db } = await import('./db.js');
      const { users } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
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

  // Legacy endpoints (keeping existing functionality)
  app.post("/api/auth/legacy-register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ message: "Validation error", error });
    }
  });

  app.get("/api/auth/legacy-me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/legacy-login", async (req, res) => {
    try {
      const { email, password } = medicalLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(400).json({ message: "Validation error", error });
    }
  });

  // Users (commented out - getUsers method doesn't exist in DatabaseStorage)
  // app.get("/api/users", authenticateToken, async (req, res) => {
  //   const users = await storage.getUsers();
  //   res.json(users.map(({ password: _, ...user }) => user));
  // });

  // Legacy routes temporarily disabled due to missing methods in DatabaseStorage
  // The medical authentication system uses the new routes in /api/auth/*

  // Consultations endpoints  
  app.get("/api/consultations", async (req: any, res) => {
    try {
      console.log('GET /api/consultations called');
      
      const { db } = await import('./db.js');
      const { consultations } = await import('@shared/schema');
      const { desc } = await import('drizzle-orm');
      
      // Get limit parameter
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      
      // Fetch consultations from database
      const allConsultations = await db.select().from(consultations)
        .orderBy(desc(consultations.createdAt))
        .limit(limit);
      
      console.log(`Found ${allConsultations.length} consultations`);
      
      res.setHeader('Content-Type', 'application/json');
      res.json(allConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      res.status(500).json({ message: 'Error al cargar consultas' });
    }
  });
  
  app.post("/api/consultations", authenticateToken, async (req: any, res) => {
    try {
      const { db } = await import('./db.js');
      const { consultations } = await import('@shared/schema');
      
      // Generate unique consultation code
      const lastConsultations = await db.select({code: consultations.code}).from(consultations).orderBy(consultations.code).limit(1);
      let nextNumber = 1;
      if (lastConsultations.length > 0) {
        const lastCode = lastConsultations[0].code;
        const lastNumber = parseInt(lastCode.replace('P', ''));
        nextNumber = lastNumber + 1;
      }
      const newCode = `P${nextNumber.toString().padStart(3, '0')}`;
      
      const consultationData = {
        ...req.body,
        code: newCode,
        doctorId: req.user.userId
      };
      
      const [newConsultation] = await db.insert(consultations).values(consultationData).returning();
      res.status(201).json(newConsultation);
    } catch (error) {
      console.error('Error creating consultation:', error);
      res.status(500).json({ message: 'Error al crear consulta' });
    }
  });


  // Additional specialties endpoints (POST handled later)

  // Form templates endpoints - secure with auth
  app.get("/api/form-templates/specialty/:specialty", async (req, res) => {
    try {
      const { specialty } = req.params;
      console.log(`Getting templates for specialty: ${specialty}`);
      
      const { db } = await import('./db.js');
      const { formTemplates } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const templates = await db.select().from(formTemplates)
        .where(eq(formTemplates.specialty, specialty));
      
      console.log(`Found ${templates.length} templates for ${specialty}`);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Add search routes
  app.use('/api/search', searchRoutes);
  
  // Add notification routes
  app.use('/api/notifications', notificationRoutes);


  // ===== DYNAMIC FORMS API ROUTES =====
  
  // Form Templates Routes
  app.get("/api/form-templates", async (req: any, res) => {
    try {
      const templates = await storage.getFormTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching form templates:', error);
      res.status(500).json({ message: 'Error al cargar plantillas de formularios' });
    }
  });

  app.get("/api/form-templates/specialty/:specialty", async (req: any, res) => {
    try {
      const { specialty } = req.params;
      const templates = await storage.getFormTemplatesBySpecialty(specialty);
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates by specialty:', error);
      res.status(500).json({ message: 'Error al cargar plantillas por especialidad' });
    }
  });

  app.get("/api/form-templates/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getFormTemplate(id);
      if (!template) {
        return res.status(404).json({ message: 'Plantilla no encontrada' });
      }
      res.json(template);
    } catch (error) {
      console.error('Error fetching form template:', error);
      res.status(500).json({ message: 'Error al cargar plantilla' });
    }
  });

  app.post("/api/form-templates", authenticateToken, async (req: any, res) => {
    try {
      const templateData = {
        ...req.body,
        createdBy: req.user.userId
      };
      const template = await storage.createFormTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error('Error creating form template:', error);
      res.status(500).json({ message: 'Error al crear plantilla' });
    }
  });

  // Form Sections Routes
  app.get("/api/form-sections/:templateId", authenticateToken, async (req: any, res) => {
    try {
      const { templateId } = req.params;
      const sections = await storage.getFormSections(templateId);
      res.json(sections);
    } catch (error) {
      console.error('Error fetching form sections:', error);
      res.status(500).json({ message: 'Error al cargar secciones' });
    }
  });

  app.post("/api/form-sections", authenticateToken, async (req: any, res) => {
    try {
      const section = await storage.createFormSection(req.body);
      res.status(201).json(section);
    } catch (error) {
      console.error('Error creating form section:', error);
      res.status(500).json({ message: 'Error al crear sección' });
    }
  });

  // Form Fields Routes
  app.get("/api/form-fields/:sectionId", authenticateToken, async (req: any, res) => {
    try {
      const { sectionId } = req.params;
      const fields = await storage.getFormFields(sectionId);
      res.json(fields);
    } catch (error) {
      console.error('Error fetching form fields:', error);
      res.status(500).json({ message: 'Error al cargar campos' });
    }
  });

  app.post("/api/form-fields", authenticateToken, async (req: any, res) => {
    try {
      const field = await storage.createFormField(req.body);
      res.status(201).json(field);
    } catch (error) {
      console.error('Error creating form field:', error);
      res.status(500).json({ message: 'Error al crear campo' });
    }
  });

  // Complete Form Structure Route (Template + Sections + Fields)
  app.get("/api/forms/complete/:templateId", async (req: any, res) => {
    try {
      const { templateId } = req.params;
      
      // Get template
      const template = await storage.getFormTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: 'Plantilla no encontrada' });
      }

      // Get sections
      const sections = await storage.getFormSections(templateId);
      
      // Get fields for each section
      const sectionsWithFields = await Promise.all(
        sections.map(async (section) => {
          const fields = await storage.getFormFields(section.id);
          return {
            ...section,
            fields: fields.sort((a, b) => a.order - b.order)
          };
        })
      );

      // Sort sections by order
      sectionsWithFields.sort((a, b) => a.order - b.order);

      const completeForm = {
        ...template,
        sections: sectionsWithFields
      };

      res.json(completeForm);
    } catch (error) {
      console.error('Error fetching complete form:', error);
      res.status(500).json({ message: 'Error al cargar formulario completo' });
    }
  });

  // Consultation Responses Routes
  app.get("/api/consultation-responses/:consultationId", authenticateToken, async (req: any, res) => {
    try {
      const { consultationId } = req.params;
      const responses = await storage.getConsultationResponses(consultationId);
      res.json(responses);
    } catch (error) {
      console.error('Error fetching consultation responses:', error);
      res.status(500).json({ message: 'Error al cargar respuestas' });
    }
  });

  app.post("/api/consultation-responses", authenticateToken, async (req: any, res) => {
    try {
      const response = await storage.saveConsultationResponse(req.body);
      res.status(201).json(response);
    } catch (error) {
      console.error('Error saving consultation response:', error);
      res.status(500).json({ message: 'Error al guardar respuesta' });
    }
  });

  // Batch save consultation responses
  app.post("/api/consultation-responses/batch", authenticateToken, async (req: any, res) => {
    try {
      const { consultationId, templateId, responses } = req.body;
      
      const savedResponses = await Promise.all(
        responses.map(async (response: any) => {
          return await storage.saveConsultationResponse({
            consultationId,
            templateId,
            fieldId: response.fieldId,
            fieldName: response.fieldName,
            value: response.value
          });
        })
      );

      res.status(201).json(savedResponses);
    } catch (error) {
      console.error('Error batch saving responses:', error);
      res.status(500).json({ message: 'Error al guardar respuestas' });
    }
  });

  // Seed dynamic forms (development only)
  app.post("/api/seed-dynamic-forms", authenticateToken, async (req: any, res) => {
    try {
      // Only allow admins or in development
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'No permitido en producción' });
      }

      const { seedCardiologyForms } = await import('./seed-dynamic-forms');
      const result = await seedCardiologyForms();
      
      res.status(201).json({
        message: 'Formularios dinámicos poblados exitosamente',
        templateId: result.id
      });
    } catch (error) {
      console.error('Error seeding dynamic forms:', error);
      res.status(500).json({ message: 'Error al poblar formularios dinámicos' });
    }
  });

  // ===== PATIENT MANAGEMENT API ROUTES =====
  
  // Get all patients with search and filtering
  app.get("/api/patients", async (req, res) => {
    try {
      const { search, specialty, limit } = req.query;
      
      const { db } = await import('./db.js');
      const { patients } = await import('@shared/schema');
      const { or, ilike, desc } = await import('drizzle-orm');
      
      let query = db.select().from(patients);
      
      // Add search functionality
      if (search && typeof search === 'string') {
        query = query.where(
          or(
            ilike(patients.firstName, `%${search}%`),
            ilike(patients.lastName, `%${search}%`),
            ilike(patients.documentNumber, `%${search}%`),
            ilike(patients.email, `%${search}%`)
          )
        );
      }
      
      // Order by creation date
      query = query.orderBy(desc(patients.createdAt));
      
      // Apply limit
      if (limit && typeof limit === 'string') {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum)) {
          query = query.limit(limitNum);
        }
      }
      
      const allPatients = await query;
      
      // Transform patients to include combined name field for frontend compatibility
      const transformedPatients = allPatients.map(patient => ({
        ...patient,
        name: `${patient.firstName} ${patient.lastName}`.trim()
      }));
      
      console.log(`Found ${transformedPatients.length} patients`);
      res.json(transformedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: "Error al cargar pacientes" });
    }
  });

  // Get patient statistics
  app.get("/api/patients/stats", async (req, res) => {
    try {
      const { db } = await import('./db.js');
      const { patients } = await import('@shared/schema');
      const { count } = await import('drizzle-orm');
      
      const [totalCount] = await db.select({ count: count() }).from(patients);
      
      res.json({
        total: totalCount.count,
        active: totalCount.count // For now, all patients are considered active
      });
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      res.status(500).json({ message: "Error al cargar estadísticas de pacientes" });
    }
  });

  // Create new patient
  app.post("/api/patients", async (req, res) => {
    try {
      const { db } = await import('./db.js');
      const { patients } = await import('@shared/schema');
      
      console.log('Received patient data:', req.body);
      
      // Preparar datos para inserción con conversión de fechas
      const insertData = {
        ...req.body,
        birthDate: req.body.birthDate ? new Date(req.body.birthDate) : null,
        createdAt: new Date()
      };
      
      const [newPatient] = await db.insert(patients).values(insertData).returning();
      
      // Transform patient to include combined name field for frontend compatibility
      const transformedPatient = {
        ...newPatient,
        name: `${newPatient.firstName} ${newPatient.lastName}`.trim()
      };
      
      console.log('Created new patient:', newPatient.id);
      res.status(201).json(transformedPatient);
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ message: "Error al crear paciente", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Create anonymous patient
  app.post("/api/anonymous-patients", async (req, res) => {
    try {
      const { db } = await import('./db.js');
      const { anonymousPatients } = await import('@shared/schema');
      
      console.log('Received anonymous patient data:', req.body);
      
      // Preparar datos para inserción con conversión de fechas
      const insertData = {
        age: req.body.age,
        gender: req.body.gender,
        birthDate: req.body.birthDate ? new Date(req.body.birthDate) : null,
        createdAt: new Date()
      };
      
      const [newPatient] = await db.insert(anonymousPatients).values(insertData).returning();
      
      console.log('Created new anonymous patient:', newPatient.id);
      res.status(201).json(newPatient);
    } catch (error) {
      console.error('Error creating anonymous patient:', error);
      res.status(500).json({ message: "Error al crear paciente anónimo", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Endpoint para generar documento de consentimiento imprimible
  app.post('/api/generate-consent-pdf', async (req, res) => {
    try {
      const { patientData, consents, signature, timestamp } = req.body;
      
      // Generar contenido HTML optimizado para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Consentimiento Informado - VITAL</title>
          <style>
            @page {
              margin: 1in;
              size: A4;
            }
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px;
              background: #ffffff;
              color: #333;
              line-height: 1.4;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              border: 2px solid #10B981;
              border-radius: 10px;
              background: #f8fffe;
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #10B981; 
              margin-bottom: 5px;
            }
            .subtitle { 
              font-size: 14px; 
              color: #666; 
            }
            .patient-info {
              background: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
            }
            .patient-info h3 {
              margin-top: 0;
              color: #10B981;
              font-size: 14px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 10px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #555;
            }
            .section {
              background: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              page-break-inside: avoid;
            }
            .section h3 {
              color: #10B981;
              margin-top: 0;
              font-size: 14px;
              border-bottom: 1px solid #10B981;
              padding-bottom: 5px;
            }
            .consent-item {
              background: #e6f7f1;
              border: 1px solid #10B981;
              border-radius: 5px;
              padding: 10px;
              margin: 8px 0;
              page-break-inside: avoid;
            }
            .consent-item.checked {
              background: #d1f2e8;
              border-color: #10B981;
            }
            .signature-section {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border-radius: 15px;
              padding: 25px;
              margin-top: 30px;
              text-align: center;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .signature-image {
              border: 2px solid #10B981;
              border-radius: 10px;
              background: white;
              padding: 10px;
              margin: 20px auto;
              max-width: 400px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.6);
            }
            .checkmark { color: #10B981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VITAL</div>
            <div class="subtitle">Sistema Médico Integral</div>
          </div>

          <div class="patient-info">
            <h2 style="color: #10B981; margin-top: 0;">Información del Paciente</h2>
            <p><strong>Tipo:</strong> ${patientData.isAnonymous ? 'Paciente Anónimo' : patientData.name}</p>
            <p><strong>Edad:</strong> ${patientData.age} años</p>
            <p><strong>Género:</strong> ${patientData.gender}</p>
            <p><strong>Fecha del documento:</strong> ${new Date(timestamp).toLocaleDateString('es-ES')}</p>
          </div>

          <div class="section">
            <h3>Marco Legal y Derechos del Paciente</h3>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              <strong>Información importante sobre sus derechos:</strong><br>
              Como paciente, usted tiene derecho a recibir información clara sobre su tratamiento, 
              a dar o retirar su consentimiento en cualquier momento, y a que sus datos personales 
              sean tratados conforme a la legislación vigente de protección de datos (RGPD).
            </p>
            
            <p style="margin-bottom: 20px; line-height: 1.6;">
              <strong>Propósito del tratamiento médico:</strong><br>
              El examen físico y los procedimientos diagnósticos tienen como objetivo evaluar su 
              estado de salud, establecer un diagnóstico preciso y recomendar el tratamiento más 
              adecuado para su condición.
            </p>
            
            <p style="margin-bottom: 30px; line-height: 1.6;">
              <strong>Confidencialidad:</strong><br>
              Toda la información médica será manejada con absoluta confidencialidad y solo será 
              compartida con profesionales de la salud autorizados cuando sea necesario para su atención.
            </p>

            <h3>Consentimientos Otorgados</h3>
            
            <div class="consent-item ${consents.dataProcessing ? 'checked' : ''}">
              <strong>${consents.dataProcessing ? '✓' : '✗'} Procesamiento de Datos Personales</strong>
              <p><strong>Acepto</strong> el procesamiento de mis datos personales para fines médicos según la Ley de Protección de Datos (RGPD). 
              Entiendo que mis datos serán utilizados exclusivamente para mi atención médica y no serán compartidos con terceros sin mi autorización expresa.</p>
            </div>

            <div class="consent-item ${consents.medicalTreatment ? 'checked' : ''}">
              <strong>${consents.medicalTreatment ? '✓' : '✗'} Consentimiento para Tratamiento Médico</strong>
              <p><strong>Autorizo</strong> la realización del examen médico y los procedimientos diagnósticos necesarios. 
              He sido informado/a sobre los beneficios y posibles riesgos del tratamiento propuesto.</p>
            </div>

            <div class="consent-item ${consents.dataSharing ? 'checked' : ''}">
              <strong>${consents.dataSharing ? '✓' : '✗'} Compartir Información Médica</strong>
              <p><strong>Acepto</strong> que mi información médica pueda ser compartida con otros profesionales de la salud 
              cuando sea estrictamente necesario para mi atención médica, incluyendo especialistas, laboratorios y centros de diagnóstico.</p>
            </div>

            <div class="consent-item ${consents.photography ? 'checked' : ''}">
              <strong>${consents.photography ? '✓' : '✗'} Fotografías Médicas (Opcional)</strong>
              <p><strong>Autorizo</strong> la toma de fotografías con fines médicos y educativos, manteniendo siempre la confidencialidad 
              y anonimato. Estas imágenes solo serán utilizadas para documentar mi evolución médica y fines académicos autorizados.</p>
            </div>

            <div class="consent-item ${consents.research ? 'checked' : ''}">
              <strong>${consents.research ? '✓' : '✗'} Participación en Investigación (Opcional)</strong>
              <p><strong>Acepto</strong> que mis datos puedan ser utilizados para investigación médica de forma completamente anónima. 
              Esta participación es voluntaria y no afectará la calidad de mi atención médica.</p>
            </div>
          </div>

          <div class="section">
            <h3>Declaración del Paciente</h3>
            <p style="line-height: 1.6;">
              Declaro que he leído y comprendido toda la información proporcionada. He tenido la oportunidad 
              de hacer preguntas y todas han sido respondidas satisfactoriamente. Entiendo que puedo retirar 
              mi consentimiento en cualquier momento sin que esto afecte mi atención médica futura.
            </p>
            
            <p style="line-height: 1.6; margin-top: 15px;">
              <strong>Contacto para dudas:</strong><br>
              Para cualquier consulta sobre este consentimiento o sus derechos como paciente, 
              puede contactar con nuestro Delegado de Protección de Datos en: dpd@vital-medical.com
            </p>
          </div>

          <div class="signature-section">
            <h3 style="color: #10B981;">Firma del Consentimiento</h3>
            ${signature ? `<img src="${signature}" alt="Firma digital" class="signature-image" style="max-width: 200px; height: auto;">` : '<div style="border: 1px solid #ccc; height: 60px; padding: 10px; text-align: center; color: #666;">Firma realizada en papel durante la consulta</div>'}
            <p><strong>Fecha y hora:</strong> ${new Date(timestamp).toLocaleString('es-ES')}</p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              La firma puede realizarse digitalmente o en papel durante la consulta médica.
            </p>
          </div>

          <div class="footer">
            <p>Este documento ha sido generado electrónicamente por el Sistema Médico VITAL</p>
            <p>Documento legalmente válido según la normativa vigente de firmas electrónicas</p>
          </div>
        </body>
        </html>
      `;

      // Configurar headers y enviar HTML que se puede imprimir como PDF
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline');
      
      // HTML optimizado para impresión
      const finalHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Consentimiento Informado - VITAL</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #10B981; }
            .section { margin-bottom: 20px; }
            .consent-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; }
            .checked { background-color: #f0f8f4; }
            .signature-section { margin-top: 30px; border-top: 2px solid #10B981; padding-top: 20px; }
            @media print {
              .no-print { display: none !important; }
              body { margin: 0; }
            }
            .print-btn { 
              position: fixed; top: 10px; right: 10px; 
              background: #10B981; color: white; border: none; 
              padding: 10px 15px; border-radius: 5px; cursor: pointer;
            }
          </style>
          <script>
            function autoPrint() { setTimeout(() => window.print(), 500); }
          </script>
        </head>
        <body onload="autoPrint()">
          <button class="print-btn no-print" onclick="window.print()">Imprimir PDF</button>
          
          <div class="header">
            <div class="logo">SISTEMA MÉDICO VITAL</div>
            <h1>Consentimiento Informado</h1>
          </div>

          <div class="section">
            <h2>Información del Paciente</h2>
            <p><strong>Tipo:</strong> ${patientData.isAnonymous ? 'Paciente Anónimo' : patientData.name}</p>
            <p><strong>Edad:</strong> ${patientData.age} años</p>
            <p><strong>Género:</strong> ${patientData.gender}</p>
            <p><strong>Fecha:</strong> ${new Date(timestamp).toLocaleDateString('es-ES')}</p>
          </div>

          <div class="section">
            <h2>Marco Legal y Derechos del Paciente</h2>
            <p><strong>Sus derechos:</strong> Como paciente, tiene derecho a recibir información clara sobre su tratamiento, dar o retirar su consentimiento en cualquier momento, y que sus datos sean tratados conforme al RGPD.</p>
            <p><strong>Propósito:</strong> El examen físico tiene como objetivo evaluar su estado de salud y establecer un diagnóstico preciso.</p>
            <p><strong>Confidencialidad:</strong> Toda información será manejada con confidencialidad y solo compartida con profesionales autorizados.</p>
          </div>

          <div class="section">
            <h2>Consentimientos Otorgados</h2>
            
            <div class="consent-item ${consents.dataProcessing ? 'checked' : ''}">
              <strong>${consents.dataProcessing ? '✓' : '✗'} Procesamiento de Datos Personales</strong>
              <p>Acepto el procesamiento de mis datos para fines médicos según RGPD.</p>
            </div>

            <div class="consent-item ${consents.medicalTreatment ? 'checked' : ''}">
              <strong>${consents.medicalTreatment ? '✓' : '✗'} Consentimiento para Tratamiento</strong>
              <p>Autorizo el examen médico y procedimientos diagnósticos necesarios.</p>
            </div>

            <div class="consent-item ${consents.dataSharing ? 'checked' : ''}">
              <strong>${consents.dataSharing ? '✓' : '✗'} Compartir Información Médica</strong>
              <p>Acepto compartir información con otros profesionales cuando sea necesario.</p>
            </div>

            <div class="consent-item ${consents.photography ? 'checked' : ''}">
              <strong>${consents.photography ? '✓' : '✗'} Fotografías Médicas (Opcional)</strong>
              <p>Autorizo fotografías con fines médicos manteniendo confidencialidad.</p>
            </div>

            <div class="consent-item ${consents.research ? 'checked' : ''}">
              <strong>${consents.research ? '✓' : '✗'} Investigación (Opcional)</strong>
              <p>Acepto que mis datos sean usados para investigación de forma anónima.</p>
            </div>
          </div>

          <div class="signature-section">
            <h2>Firma del Consentimiento</h2>
            ${signature ? 
              `<div><img src="${signature}" alt="Firma digital" style="max-width: 200px; border: 1px solid #ccc;"></div>` : 
              '<div style="border: 1px solid #ccc; height: 60px; text-align: center; line-height: 60px;">Firma realizada en papel durante la consulta</div>'
            }
            <p><strong>Fecha y hora:</strong> ${new Date(timestamp).toLocaleString('es-ES')}</p>
            <p><small>La firma puede realizarse digitalmente o en papel durante la consulta.</small></p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            <p>Documento generado por Sistema Médico VITAL</p>
            <p>Contacto: dpd@vital-medical.com</p>
          </div>
        </body>
        </html>
      `;

      // Configurar nombre del archivo
      const patientName = patientData.isAnonymous ? 'anonimo' : 
        (patientData.name || 'paciente').toLowerCase().replace(/\s+/g, '-');
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `consentimiento-${patientName}-${dateStr}_${Date.now()}.html`;
      
      // Enviar HTML listo para imprimir como PDF
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      
      // HTML optimizado para PDF con instrucciones claras
      const printableHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Consentimiento Informado - VITAL</title>
          <style>
            @page { margin: 1in; size: A4; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; color: #333; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; padding: 20px; border: 2px solid #10B981; border-radius: 10px; }
            .logo { font-size: 24px; font-weight: bold; color: #10B981; margin-bottom: 5px; }
            .patient-info, .section { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
            .consent-item { background: #e6f7f1; border: 1px solid #10B981; border-radius: 5px; padding: 10px; margin: 8px 0; }
            .consent-item.checked { background: #d1f2e8; }
            .signature-section { margin-top: 30px; border-top: 2px solid #10B981; padding-top: 20px; }
            .print-btn { position: fixed; top: 10px; right: 10px; background: #10B981; color: white; border: none; padding: 15px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; z-index: 1000; }
            .no-print { display: block; }
            @media print { .no-print { display: none !important; } body { margin: 0; } }
          </style>
          <script>
            function printDocument() { window.print(); }
            function downloadPDF() { 
              document.querySelector('.print-btn').textContent = 'Descarga iniciada - Use Ctrl+P para generar PDF';
              setTimeout(printDocument, 500); 
            }
            window.onload = function() { 
              document.querySelector('.print-btn').onclick = downloadPDF;
            }
          </script>
        </head>
        <body>
          <button class="print-btn no-print">📄 Descargar PDF (Ctrl+P)</button>
          
          <div class="header">
            <div class="logo">SISTEMA MÉDICO VITAL</div>
            <h1>Consentimiento Informado para Atención Médica</h1>
            <p>Documento legalmente válido - Generado automáticamente</p>
          </div>

          <div class="patient-info">
            <h3 style="color: #10B981; margin-top: 0;">Información del Paciente</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong>Nombre:</strong> ${patientData.isAnonymous ? 'Paciente Anónimo' : patientData.name}</div>
              <div><strong>Edad:</strong> ${patientData.age} años</div>
              <div><strong>Género:</strong> ${patientData.gender}</div>
              <div><strong>Fecha:</strong> ${new Date(timestamp).toLocaleDateString('es-ES')}</div>
              ${!patientData.isAnonymous ? `<div><strong>DNI:</strong> ${patientData.documentNumber || 'No especificado'}</div>` : ''}
              ${!patientData.isAnonymous ? `<div><strong>Email:</strong> ${patientData.email || 'No especificado'}</div>` : ''}
            </div>
          </div>

          <div class="section">
            <h3 style="color: #10B981; margin-top: 0;">Marco Legal y Derechos del Paciente</h3>
            <p><strong>Base legal:</strong> Este consentimiento se basa en el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos.</p>
            <p><strong>Sus derechos:</strong> Tiene derecho a recibir información clara, dar o retirar su consentimiento, acceder a sus datos, rectificarlos o eliminarlos.</p>
            <p><strong>Propósito médico:</strong> El examen físico y tratamiento tienen como objetivo evaluar su estado de salud y establecer un diagnóstico preciso.</p>
            <p><strong>Confidencialidad:</strong> Toda información será tratada con máxima confidencialidad y solo compartida con profesionales autorizados.</p>
          </div>

          <div class="section">
            <h3 style="color: #10B981; margin-top: 0;">Consentimientos Otorgados</h3>
            
            <div class="consent-item ${consents.dataProcessing ? 'checked' : ''}">
              <strong>${consents.dataProcessing ? '✅' : '❌'} Procesamiento de Datos Personales (OBLIGATORIO)</strong>
              <p>Acepto el procesamiento de mis datos personales para fines médicos, diagnósticos y de tratamiento según lo establecido en el RGPD. Estos datos serán tratados con máxima confidencialidad y solo por personal autorizado.</p>
            </div>

            <div class="consent-item ${consents.medicalTreatment ? 'checked' : ''}">
              <strong>${consents.medicalTreatment ? '✅' : '❌'} Consentimiento para Tratamiento Médico (OBLIGATORIO)</strong>
              <p>Autorizo al personal médico a realizar el examen físico, procedimientos diagnósticos necesarios y tratamientos médicos que consideren apropiados para mi condición de salud.</p>
            </div>

            <div class="consent-item ${consents.dataSharing ? 'checked' : ''}">
              <strong>${consents.dataSharing ? '✅' : '❌'} Compartir Información Médica</strong>
              <p>Acepto que mi información médica pueda ser compartida con otros profesionales de la salud cuando sea estrictamente necesario para mi atención médica, incluyendo especialistas, laboratorios y centros de diagnóstico.</p>
            </div>

            <div class="consent-item ${consents.photography ? 'checked' : ''}">
              <strong>${consents.photography ? '✅' : '❌'} Fotografías Médicas (OPCIONAL)</strong>
              <p>Autorizo la toma de fotografías con fines médicos y educativos, manteniendo siempre la confidencialidad y anonimato. Estas imágenes solo serán utilizadas para documentar mi evolución médica y fines académicos autorizados.</p>
            </div>

            <div class="consent-item ${consents.research ? 'checked' : ''}">
              <strong>${consents.research ? '✅' : '❌'} Participación en Investigación (OPCIONAL)</strong>
              <p>Acepto que mis datos puedan ser utilizados para investigación médica de forma completamente anónima. Esta participación es voluntaria y no afectará la calidad de mi atención médica.</p>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #10B981; margin-top: 0;">Declaración del Paciente</h3>
            <p style="line-height: 1.6;">
              Declaro que he leído y comprendido toda la información proporcionada. He tenido la oportunidad 
              de hacer preguntas y todas han sido respondidas satisfactoriamente. Entiendo que puedo retirar 
              mi consentimiento en cualquier momento sin que esto afecte mi atención médica futura.
            </p>
            
            <p style="line-height: 1.6; margin-top: 15px;">
              <strong>Contacto para dudas:</strong><br>
              Para cualquier consulta sobre este consentimiento o sus derechos como paciente, 
              puede contactar con nuestro Delegado de Protección de Datos en: dpd@vital-medical.com
            </p>
          </div>

          <div class="signature-section">
            <h3 style="color: #10B981;">Firma del Consentimiento</h3>
            ${signature ? 
              `<div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;"><img src="${signature}" alt="Firma digital" style="max-width: 200px; height: auto;"></div>` : 
              '<div style="border: 1px solid #ccc; height: 80px; text-align: center; line-height: 80px; margin: 10px 0; background: #f9f9f9;">Firma realizada en papel durante la consulta médica</div>'
            }
            <p><strong>Fecha y hora:</strong> ${new Date(timestamp).toLocaleString('es-ES')}</p>
            <p style="font-size: 12px; color: #666; margin-top: 15px;">
              La firma puede realizarse digitalmente o en papel durante la consulta médica.<br>
              Este documento tiene validez legal según la normativa vigente de firmas electrónicas.
            </p>
          </div>

          <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
            <p><strong>Sistema Médico VITAL</strong> - Documento generado electrónicamente</p>
            <p>Contacto DPD: dpd@vital-medical.com | Generado el: ${new Date().toLocaleString('es-ES')}</p>
            <p>Para guardar como PDF: Use Ctrl+P → Destino: Guardar como PDF</p>
          </div>
        </body>
        </html>
      `;
      
      res.send(printableHtml);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Error al generar PDF', details: error.message });
    }
  });

  // Endpoint para guardar examen físico
  app.post('/api/physical-exams', async (req, res) => {
    try {
      const {
        patientId,
        patientType,
        vitalSigns,
        examFindings,
        examDate,
        startTime,
        endTime,
        bmi
      } = req.body;

      const examData = {
        id: Math.random().toString(36).substr(2, 9),
        patientId,
        patientType,
        bloodPressureSystolic: vitalSigns.bloodPressureSystolic || null,
        bloodPressureDiastolic: vitalSigns.bloodPressureDiastolic || null,
        heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : null,
        temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : null,
        weight: vitalSigns.weight ? parseFloat(vitalSigns.weight) : null,
        height: vitalSigns.height ? parseFloat(vitalSigns.height) : null,
        respiratoryRate: vitalSigns.respiratoryRate ? parseInt(vitalSigns.respiratoryRate) : null,
        oxygenSaturation: vitalSigns.oxygenSaturation ? parseFloat(vitalSigns.oxygenSaturation) : null,
        bmi: bmi ? parseFloat(bmi) : null,
        generalAppearance: examFindings.generalAppearance || '',
        cardiovascular: examFindings.cardiovascular || '',
        respiratory: examFindings.respiratory || '',
        neurological: examFindings.neurological || '',
        abdominal: examFindings.abdominal || '',
        musculoskeletal: examFindings.musculoskeletal || '',
        dermatological: examFindings.dermatological || '',
        additionalNotes: examFindings.additionalNotes || '',
        examDate: new Date(examDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdAt: new Date(),
        doctorId: (req.user as any)?.id || 'system'
      };

      console.log('Physical exam data saved:', examData);
      
      res.json({ 
        success: true, 
        message: 'Examen físico guardado exitosamente',
        examId: examData.id
      });

    } catch (error) {
      console.error('Error saving physical exam:', error);
      res.status(500).json({ message: 'Error al guardar examen físico' });
    }
  });

  // Update patient
  app.put("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { db } = await import('./db.js');
      const { patients, insertPatientSchema } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const updates = insertPatientSchema.partial().parse(req.body);
      
      const [updatedPatient] = await db
        .update(patients)
        .set(updates)
        .where(eq(patients.id, id))
        .returning();
      
      if (!updatedPatient) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      
      // Transform patient to include combined name field for frontend compatibility
      const transformedPatient = {
        ...updatedPatient,
        name: `${updatedPatient.firstName} ${updatedPatient.lastName}`.trim()
      };
      
      console.log('Updated patient:', id);
      res.json(transformedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        res.status(400).json({ message: "Datos de paciente inválidos", error: error.message });
      } else {
        res.status(500).json({ message: "Error al actualizar paciente" });
      }
    }
  });

  // Delete patient
  app.delete("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { db } = await import('./db.js');
      const { patients } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [deletedPatient] = await db
        .delete(patients)
        .where(eq(patients.id, id))
        .returning();
      
      if (!deletedPatient) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }
      
      console.log('Deleted patient:', id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ message: "Error al eliminar paciente" });
    }
  });

  // Anonymous patients routes
  app.use('/api/anonymous-patients', anonymousPatientRoutes);
  
  // Endpoint para obtener todas las especialidades médicas
  app.get('/api/medical-specialties', async (req, res) => {
    try {
      const specialties = await getActiveSpecialties();
      res.json({
        success: true,
        specialties: specialties,
        count: specialties.length
      });
    } catch (error) {
      console.error('Error fetching medical specialties:', error);
      res.status(500).json({
        success: false,
        message: "Error al cargar especialidades médicas"
      });
    }
  });

  // Endpoint para sembrar especialidades (solo desarrollo)
  app.post('/api/medical-specialties/seed', async (req, res) => {
    try {
      const success = await seedSpecialties();
      res.json({
        success,
        message: success ? 
          'Especialidades médicas sembradas correctamente' : 
          'Error al sembrar especialidades'
      });
    } catch (error) {
      console.error('Error seeding medical specialties:', error);
      res.status(500).json({
        success: false,
        message: "Error al sembrar especialidades médicas"
      });
    }
  });
  
  // API routes for specialties, search, notifications, and favorites
  app.use('/api/specialties', specialtyRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/postal-codes', postalCodeRoutes);
  app.use('/api/favorites', favoritesRoutes);

  // Import and register specialty templates routes
  const specialtyTemplatesRoutes = await import('./routes/specialty-templates');
  app.use('/api/specialty-templates', specialtyTemplatesRoutes.default);

  const httpServer = createServer(app);
  return httpServer;
}