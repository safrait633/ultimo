import { type User, type InsertUser, type Specialty, type InsertSpecialty, type Patient, type InsertPatient, type Consultation, type InsertConsultation, type Template, type InsertTemplate, type RefreshToken, type InsertRefreshToken, type AuditLog, type InsertAuditLog, type FormTemplate, type InsertFormTemplate, type FormSection, type InsertFormSection, type FormField, type InsertFormField, type ConsultationResponse, type InsertConsultationResponse, users, specialties, patients, consultations, templates, refreshTokens, auditLogs, formTemplates, formSections, formFields, consultationResponses } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, sql, count } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  updateLastLogin(userId: string): Promise<void>;

  // Refresh token methods
  saveRefreshToken(userId: string, token: string): Promise<RefreshToken>;
  getRefreshToken(token: string): Promise<RefreshToken | undefined>;
  deleteRefreshToken(token: string): Promise<boolean>;
  cleanExpiredTokens(): Promise<void>;

  // Audit log methods
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(userId?: string, limit?: number): Promise<AuditLog[]>;

  // Specialty methods
  getSpecialties(): Promise<Specialty[]>;
  getSpecialty(id: string): Promise<Specialty | undefined>;
  createSpecialty(specialty: InsertSpecialty): Promise<Specialty>;
  updateSpecialty(id: string, specialty: Partial<InsertSpecialty>): Promise<Specialty | undefined>;
  deleteSpecialty(id: string): Promise<boolean>;

  // Patient methods
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: string): Promise<boolean>;

  // Consultation methods
  getConsultations(): Promise<Consultation[]>;
  getConsultationsByDoctor(doctorId: string): Promise<Consultation[]>;
  getConsultationsByPatient(patientId: string): Promise<Consultation[]>;
  getConsultation(id: string): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultation(id: string, consultation: Partial<Consultation>): Promise<Consultation | undefined>;
  deleteConsultation(id: string): Promise<boolean>;

  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplatesByDoctor(doctorId: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;

  // Dynamic Form Template methods
  getFormTemplates(): Promise<FormTemplate[]>;
  getFormTemplatesBySpecialty(specialty: string): Promise<FormTemplate[]>;
  getFormTemplate(id: string): Promise<FormTemplate | undefined>;
  createFormTemplate(template: InsertFormTemplate): Promise<FormTemplate>;
  updateFormTemplate(id: string, template: Partial<InsertFormTemplate>): Promise<FormTemplate | undefined>;
  deleteFormTemplate(id: string): Promise<boolean>;

  // Form Section methods
  getFormSections(templateId: string): Promise<FormSection[]>;
  getFormSectionsByTemplate(templateId: string): Promise<FormSection[]>;
  createFormSection(section: InsertFormSection): Promise<FormSection>;
  updateFormSection(id: string, section: Partial<InsertFormSection>): Promise<FormSection | undefined>;
  deleteFormSection(id: string): Promise<boolean>;

  // Form Field methods
  getFormFields(sectionId: string): Promise<FormField[]>;
  getFormFieldsBySection(sectionId: string): Promise<FormField[]>;
  createFormField(field: InsertFormField): Promise<FormField>;
  updateFormField(id: string, field: Partial<InsertFormField>): Promise<FormField | undefined>;
  deleteFormField(id: string): Promise<boolean>;
  deleteFormFieldsBySection(sectionId: string): Promise<boolean>;

  // Additional specialty methods
  getSpecialtyBySlug(slug: string): Promise<Specialty | undefined>;
  getAllFormTemplates(): Promise<FormTemplate[]>;

  // Consultation Response methods
  getConsultationResponses(consultationId: string): Promise<ConsultationResponse[]>;
  saveConsultationResponse(response: InsertConsultationResponse): Promise<ConsultationResponse>;
  updateConsultationResponse(id: string, response: Partial<InsertConsultationResponse>): Promise<ConsultationResponse | undefined>;
}

// PostgreSQL Storage Implementation
export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const [user] = await db
      .insert(users)
      .values({ 
        ...insertUser, 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Refresh token methods
  async saveRefreshToken(userId: string, token: string): Promise<RefreshToken> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    const [refreshToken] = await db
      .insert(refreshTokens)
      .values({
        userId,
        token,
        expiresAt
      })
      .returning();
    return refreshToken;
  }

  async getRefreshToken(token: string): Promise<RefreshToken | undefined> {
    const [refreshToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return refreshToken || undefined;
  }

  async deleteRefreshToken(token: string): Promise<boolean> {
    const result = await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    return (result.rowCount || 0) > 0;
  }

  async cleanExpiredTokens(): Promise<void> {
    await db.delete(refreshTokens).where(sql`expires_at < NOW()`);
  }

  // Audit log methods
  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db
      .insert(auditLogs)
      .values(insertAuditLog)
      .returning();
    return auditLog;
  }

  async getAuditLogs(userId?: string, limit = 100): Promise<AuditLog[]> {
    if (userId) {
      return await db.select().from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .limit(limit)
        .orderBy(sql`timestamp DESC`);
    }
    
    return await db.select().from(auditLogs)
      .limit(limit)
      .orderBy(sql`timestamp DESC`);
  }

  // Specialty methods
  async getSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties);
  }

  async getSpecialty(id: string): Promise<Specialty | undefined> {
    const [specialty] = await db.select().from(specialties).where(eq(specialties.id, id));
    return specialty || undefined;
  }

  async createSpecialty(insertSpecialty: InsertSpecialty): Promise<Specialty> {
    const [specialty] = await db
      .insert(specialties)
      .values(insertSpecialty)
      .returning();
    return specialty;
  }

  async updateSpecialty(id: string, updates: Partial<InsertSpecialty>): Promise<Specialty | undefined> {
    const [specialty] = await db
      .update(specialties)
      .set(updates)
      .where(eq(specialties.id, id))
      .returning();
    return specialty || undefined;
  }

  async deleteSpecialty(id: string): Promise<boolean> {
    const result = await db.delete(specialties).where(eq(specialties.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [patient] = await db
      .update(patients)
      .set(updates)
      .where(eq(patients.id, id))
      .returning();
    return patient || undefined;
  }

  async deletePatient(id: string): Promise<boolean> {
    const result = await db.delete(patients).where(eq(patients.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Consultation methods
  async getConsultations(): Promise<Consultation[]> {
    return await db.select().from(consultations);
  }

  async getConsultationsByDoctor(doctorId: string): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.doctorId, doctorId));
  }

  async getConsultationsByPatient(patientId: string): Promise<Consultation[]> {
    // Note: Consultations use anonymized codes, not patient IDs
    // This method is kept for interface compatibility
    return [];
  }

  async getConsultation(id: string): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation || undefined;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    // Generate unique consultation code (P001, P002, etc.)
    const [{ count: consultationCount }] = await db.select({ count: count() }).from(consultations);
    const code = `P${String(consultationCount + 1).padStart(3, '0')}`;
    
    const [consultation] = await db
      .insert(consultations)
      .values({
        ...insertConsultation,
        code
      })
      .returning();
    return consultation;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation | undefined> {
    const [consultation] = await db
      .update(consultations)
      .set(updates)
      .where(eq(consultations.id, id))
      .returning();
    return consultation || undefined;
  }

  async deleteConsultation(id: string): Promise<boolean> {
    const result = await db.delete(consultations).where(eq(consultations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplatesByDoctor(doctorId: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.doctorId, doctorId));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [template] = await db
      .update(templates)
      .set(updates)
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Dynamic Form Template methods
  async getFormTemplates(): Promise<FormTemplate[]> {
    return await db.select().from(formTemplates);
  }

  async getFormTemplatesBySpecialty(specialty: string): Promise<FormTemplate[]> {
    return await db.select().from(formTemplates).where(eq(formTemplates.specialty, specialty));
  }

  async getFormTemplate(id: string): Promise<FormTemplate | undefined> {
    const [template] = await db.select().from(formTemplates).where(eq(formTemplates.id, id));
    return template || undefined;
  }

  async createFormTemplate(insertTemplate: InsertFormTemplate): Promise<FormTemplate> {
    const [template] = await db
      .insert(formTemplates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async updateFormTemplate(id: string, updates: Partial<InsertFormTemplate>): Promise<FormTemplate | undefined> {
    const [template] = await db
      .update(formTemplates)
      .set(updates)
      .where(eq(formTemplates.id, id))
      .returning();
    return template || undefined;
  }

  async deleteFormTemplate(id: string): Promise<boolean> {
    const result = await db.delete(formTemplates).where(eq(formTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Form Section methods
  async getFormSections(templateId: string): Promise<FormSection[]> {
    return await db.select().from(formSections).where(eq(formSections.templateId, templateId));
  }

  async createFormSection(insertSection: InsertFormSection): Promise<FormSection> {
    const [section] = await db
      .insert(formSections)
      .values(insertSection)
      .returning();
    return section;
  }

  async updateFormSection(id: string, updates: Partial<InsertFormSection>): Promise<FormSection | undefined> {
    const [section] = await db
      .update(formSections)
      .set(updates)
      .where(eq(formSections.id, id))
      .returning();
    return section || undefined;
  }

  async deleteFormSection(id: string): Promise<boolean> {
    const result = await db.delete(formSections).where(eq(formSections.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Form Field methods
  async getFormFields(sectionId: string): Promise<FormField[]> {
    const fields = await db.select().from(formFields).where(eq(formFields.sectionId, sectionId));
    return fields;
  }

  async createFormField(insertField: InsertFormField): Promise<FormField> {
    const [field] = await db
      .insert(formFields)
      .values(insertField)
      .returning();
    return field;
  }

  async updateFormField(id: string, updates: Partial<InsertFormField>): Promise<FormField | undefined> {
    const [field] = await db
      .update(formFields)
      .set(updates)
      .where(eq(formFields.id, id))
      .returning();
    return field || undefined;
  }

  async deleteFormField(id: string): Promise<boolean> {
    const result = await db.delete(formFields).where(eq(formFields.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Consultation Response methods
  async getConsultationResponses(consultationId: string): Promise<ConsultationResponse[]> {
    return await db.select().from(consultationResponses).where(eq(consultationResponses.consultationId, consultationId));
  }

  async saveConsultationResponse(insertResponse: InsertConsultationResponse): Promise<ConsultationResponse> {
    const [response] = await db
      .insert(consultationResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async updateConsultationResponse(id: string, updates: Partial<InsertConsultationResponse>): Promise<ConsultationResponse | undefined> {
    const [response] = await db
      .update(consultationResponses)
      .set(updates)
      .where(eq(consultationResponses.id, id))
      .returning();
    return response || undefined;
  }

  // Additional methods for specialty templates
  async getFormSectionsByTemplate(templateId: string): Promise<FormSection[]> {
    return this.getFormSections(templateId);
  }

  async getFormFieldsBySection(sectionId: string): Promise<FormField[]> {
    return this.getFormFields(sectionId);
  }

  async deleteFormFieldsBySection(sectionId: string): Promise<boolean> {
    const result = await db.delete(formFields).where(eq(formFields.sectionId, sectionId));
    return (result.rowCount || 0) > 0;
  }

  async getSpecialtyBySlug(slug: string): Promise<Specialty | undefined> {
    const [specialty] = await db.select().from(specialties).where(eq(specialties.slug, slug));
    return specialty || undefined;
  }

  async getAllFormTemplates(): Promise<FormTemplate[]> {
    return this.getFormTemplates();
  }
}

// Export default storage instance
export const storage = new PostgresStorage();