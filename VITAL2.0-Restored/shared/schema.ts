import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  role: text("role").notNull().default("medico"), // medico, super_admin
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  hospitalId: varchar("hospital_id"),
  avatar: text("avatar"),
  isActive: boolean("is_active").notNull().default(true),
  isVerified: boolean("is_verified").notNull().default(false),
  lastLogin: timestamp("last_login"),
  language: text("language").notNull().default("es"), // es, en
  theme: text("theme").notNull().default("light"), // dark, light
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const specialties = pgTable("specialties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(), // Para URLs y referencias
  description: text("description"),
  icon: text("icon").notNull(), // Nombre del icono de Lucide React
  patientCount: integer("patient_count").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  secondLastName: text("second_last_name"), // Segundo apellido (opcional)
  age: integer("age").notNull(),
  birthDate: date("birth_date").notNull(),
  gender: text("gender").notNull(), // masculino, femenino, otro
  documentNumber: text("document_number").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  avatar: text("avatar"),
  
  // Información de seguro médico
  insurancePolicyNumber: text("insurance_policy_number"),
  insuranceProvider: text("insurance_provider"),
  
  // Dirección
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country").default("España"),
  
  // Antecedentes médicos con checkboxes
  diabetes: boolean("diabetes").default(false),
  hypertension: boolean("hypertension").default(false),
  heartDisease: boolean("heart_disease").default(false),
  allergies: boolean("allergies").default(false),
  cancer: boolean("cancer").default(false),
  asthma: boolean("asthma").default(false),
  kidneyDisease: boolean("kidney_disease").default(false),
  liverDisease: boolean("liver_disease").default(false),
  thyroidDisease: boolean("thyroid_disease").default(false),
  mentalHealth: boolean("mental_health").default(false),
  surgeries: boolean("surgeries").default(false),
  medications: boolean("medications").default(false),
  smoking: boolean("smoking").default(false),
  alcohol: boolean("alcohol").default(false),
  drugs: boolean("drugs").default(false),
  
  // Notas médicas adicionales
  medicalNotes: text("medical_notes"),
  allergiesDetails: text("allergies_details"),
  medicationsDetails: text("medications_details"),
  surgeriesDetails: text("surgeries_details"),
  familyHistory: text("family_history"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Nueva tabla para pacientes despersonalizados (solo sexo y fecha de nacimiento)
export const anonymousPatients = pgTable("anonymous_patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // masculino, femenino, otro
  birthDate: date("birth_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla de códigos postales de España
export const postalCodes = pgTable("postal_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postalCode: text("postal_code").notNull().unique(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  autonomousCommunity: text("autonomous_community").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // P001, P002, etc.
  doctorId: varchar("doctor_id").notNull(),
  patientId: varchar("patient_id"), // ID del paciente normal (opcional)
  anonymousPatientId: varchar("anonymous_patient_id"), // ID del paciente despersonalizado (opcional)
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // M, F
  specialty: text("specialty").notNull(),
  reason: text("reason"), // motivo de consulta
  status: text("status").notNull().default("in-progress"), // urgent, completed, in-progress
  vitalSigns: text("vital_signs"), // JSON string for vital signs data
  physicalExam: text("physical_exam"), // JSON string for physical exam data  
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  doctorId: varchar("doctor_id").notNull(),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  resourceType: text("resource_type").notNull(), // 'specialty', 'template', 'form_template'
  resourceId: varchar("resource_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  action: text("action").notNull(), // login, logout, create, update, delete
  resource: text("resource"), // user, patient, consultation, etc.
  resourceId: varchar("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").defaultNow(),
});

// ===== DYNAMIC FORMS TABLES =====

export const formTemplates = pgTable("form_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(), // references specialties.id
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  version: integer("version").notNull().default(1),
  createdBy: varchar("created_by").notNull(), // references users.id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const formSections = pgTable("form_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull(), // references form_templates.id
  name: text("name").notNull(), // 'antecedentes', 'signos_vitales', etc.
  title: text("title").notNull(), // 'Antecedentes', 'Signos Vitales'
  description: text("description"),
  order: integer("order").notNull(),
  isRequired: boolean("is_required").notNull().default(false),
  conditions: text("conditions"), // JSON for conditional visibility
  createdAt: timestamp("created_at").defaultNow(),
});

export const formFields = pgTable("form_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionId: varchar("section_id").notNull(), // references form_sections.id
  name: text("name").notNull(), // 'presion_arterial', 'frecuencia_cardiaca'
  label: text("label").notNull(), // 'Presión Arterial (mmHg)'
  type: text("type").notNull(), // 'text', 'number', 'select', 'radio', 'checkbox', 'range'
  placeholder: text("placeholder"),
  defaultValue: text("default_value"),
  options: text("options"), // JSON array for select/radio/checkbox options
  validation: text("validation"), // JSON object with validation rules
  calculation: text("calculation"), // JSON object for calculated fields
  unit: text("unit"), // 'mmHg', 'bpm', 'cm', 'kg'
  order: integer("order").notNull(),
  isRequired: boolean("is_required").notNull().default(false),
  isCalculated: boolean("is_calculated").notNull().default(false),
  conditions: text("conditions"), // JSON for conditional visibility
  helpText: text("help_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultationResponses = pgTable("consultation_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  consultationId: varchar("consultation_id").notNull(), // references consultations.id
  templateId: varchar("template_id").notNull(), // references form_templates.id
  fieldId: varchar("field_id").notNull(), // references form_fields.id
  fieldName: text("field_name").notNull(), // for easier querying
  value: text("value"), // JSON string containing the response value
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== MEDICAL RECORDS & DOCUMENTS =====

export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  consultationId: varchar("consultation_id"), // optional reference to consultations.id
  doctorId: varchar("doctor_id").notNull(), // references users.id
  recordType: text("record_type").notNull(), // 'lab_result', 'imaging', 'prescription', 'note', 'referral'
  title: text("title").notNull(),
  content: text("content").notNull(), // JSON or text content
  filePath: text("file_path"), // path to uploaded files
  fileType: text("file_type"), // 'pdf', 'jpg', 'png', 'dicom'
  isConfidential: boolean("is_confidential").notNull().default(false),
  validUntil: timestamp("valid_until"), // for prescriptions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== APPOINTMENTS & SCHEDULING =====

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  doctorId: varchar("doctor_id").notNull(), // references users.id
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").notNull().default(30), // minutes
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, in-progress, completed, cancelled, no-show
  appointmentType: text("appointment_type").notNull(), // consultation, follow-up, emergency, telehealth
  reason: text("reason"),
  notes: text("notes"),
  reminderSent: boolean("reminder_sent").notNull().default(false),
  consultationId: varchar("consultation_id"), // created when appointment becomes consultation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== MEDICATIONS & PRESCRIPTIONS =====

export const medications = pgTable("medications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  brandName: text("brand_name"),
  drugClass: text("drug_class"), // antibiotic, analgesic, etc.
  strength: text("strength"), // 500mg, 10ml
  dosageForm: text("dosage_form"), // tablet, capsule, syrup
  activeIngredient: text("active_ingredient"),
  contraindications: text("contraindications"), // JSON array
  sideEffects: text("side_effects"), // JSON array
  isControlled: boolean("is_controlled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  consultationId: varchar("consultation_id").notNull(), // references consultations.id
  patientId: varchar("patient_id").notNull(), // references patients.id
  doctorId: varchar("doctor_id").notNull(), // references users.id
  medicationId: varchar("medication_id").notNull(), // references medications.id
  dosage: text("dosage").notNull(), // "1 tablet"
  frequency: text("frequency").notNull(), // "every 8 hours"
  duration: text("duration").notNull(), // "7 days"
  instructions: text("instructions"), // "take with food"
  quantity: integer("quantity").notNull(), // total number prescribed
  refills: integer("refills").notNull().default(0),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  prescribedDate: timestamp("prescribed_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== NOTIFICATIONS & ALERTS =====

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // references users.id
  type: text("type").notNull(), // appointment_reminder, lab_result, prescription_renewal, system_alert
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  isRead: boolean("is_read").notNull().default(false),
  actionRequired: boolean("action_required").notNull().default(false),
  actionUrl: text("action_url"), // URL for action button
  relatedResource: text("related_resource"), // appointment, consultation, prescription
  relatedResourceId: varchar("related_resource_id"),
  scheduledFor: timestamp("scheduled_for"), // for delayed notifications
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== LAB RESULTS & DIAGNOSTICS =====

export const labTests = pgTable("lab_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // blood, urine, imaging, pathology
  description: text("description"),
  normalRange: text("normal_range"), // JSON with min/max values
  unit: text("unit"),
  specimen: text("specimen"), // blood, urine, tissue
  preparationInstructions: text("preparation_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const labResults = pgTable("lab_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  consultationId: varchar("consultation_id"), // references consultations.id
  doctorId: varchar("doctor_id").notNull(), // references users.id (ordering doctor)
  labTestId: varchar("lab_test_id").notNull(), // references lab_tests.id
  value: text("value").notNull(), // numeric or text result
  unit: text("unit"),
  referenceRange: text("reference_range"),
  status: text("status").notNull().default("pending"), // pending, completed, abnormal, critical
  resultDate: timestamp("result_date"),
  orderedDate: timestamp("ordered_date").defaultNow(),
  labName: text("lab_name"), // external lab name
  technician: text("technician"),
  notes: text("notes"),
  isAbnormal: boolean("is_abnormal").notNull().default(false),
  isCritical: boolean("is_critical").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== EMERGENCY CONTACTS =====

export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  name: text("name").notNull(),
  relationship: text("relationship").notNull(), // spouse, parent, sibling, friend
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== INSURANCE & BILLING =====

export const insuranceProviders = pgTable("insurance_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patientInsurance = pgTable("patient_insurance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  providerId: varchar("provider_id").notNull(), // references insurance_providers.id
  policyNumber: text("policy_number").notNull(),
  groupNumber: text("group_number"),
  policyHolderName: text("policy_holder_name"),
  relationship: text("relationship"), // self, spouse, child
  effectiveDate: timestamp("effective_date"),
  expiryDate: timestamp("expiry_date"),
  copay: decimal("copay", { precision: 10, scale: 2 }),
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== MEDICAL HISTORY =====

export const medicalConditions = pgTable("medical_conditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  condition: text("condition").notNull(),
  icd10Code: text("icd10_code"),
  diagnosedDate: timestamp("diagnosed_date"),
  status: text("status").notNull().default("active"), // active, resolved, chronic
  severity: text("severity"), // mild, moderate, severe
  notes: text("notes"),
  diagnosedBy: varchar("diagnosed_by"), // references users.id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const allergies = pgTable("allergies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  allergen: text("allergen").notNull(),
  allergyType: text("allergy_type").notNull(), // medication, food, environmental, other
  severity: text("severity").notNull(), // mild, moderate, severe, life-threatening
  reaction: text("reaction"), // rash, swelling, difficulty breathing
  notes: text("notes"),
  discoveredDate: timestamp("discovered_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== VITAL SIGNS TRACKING =====

export const vitalSigns = pgTable("vital_signs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(), // references patients.id
  consultationId: varchar("consultation_id"), // references consultations.id
  recordedBy: varchar("recorded_by").notNull(), // references users.id
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  heartRate: integer("heart_rate"), // bpm
  temperature: decimal("temperature", { precision: 4, scale: 1 }), // celsius
  respiratoryRate: integer("respiratory_rate"), // breaths per minute
  oxygenSaturation: integer("oxygen_saturation"), // percentage
  height: decimal("height", { precision: 5, scale: 2 }), // cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // kg
  bmi: decimal("bmi", { precision: 4, scale: 1 }), // calculated
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== INSERT SCHEMAS =====

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isActive: true,
  isVerified: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Email médico inválido"),
  licenseNumber: z.string().min(6, "Número de colegiado debe tener al menos 6 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
});

export const insertSpecialtySchema = createInsertSchema(specialties).omit({
  id: true,
  patientCount: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertAnonymousPatientSchema = createInsertSchema(anonymousPatients).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  code: true, // auto-generated
  completedAt: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  lastUsed: true,
  createdAt: true,
});

export const insertRefreshTokenSchema = createInsertSchema(refreshTokens).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

// Dynamic Forms Insert Schemas
export const insertFormTemplateSchema = createInsertSchema(formTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFormSectionSchema = createInsertSchema(formSections).omit({
  id: true,
  createdAt: true,
});

export const insertFormFieldSchema = createInsertSchema(formFields).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationResponseSchema = createInsertSchema(consultationResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New table insert schemas
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  prescribedDate: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  sentAt: true,
  createdAt: true,
});

export const insertLabTestSchema = createInsertSchema(labTests).omit({
  id: true,
  createdAt: true,
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  orderedDate: true,
  createdAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInsuranceProviderSchema = createInsertSchema(insuranceProviders).omit({
  id: true,
  createdAt: true,
});

export const insertPatientInsuranceSchema = createInsertSchema(patientInsurance).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalConditionSchema = createInsertSchema(medicalConditions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAllergySchema = createInsertSchema(allergies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVitalSignsSchema = createInsertSchema(vitalSigns).omit({
  id: true,
  recordedAt: true,
  createdAt: true,
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertPostalCodeSchema = createInsertSchema(postalCodes).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Email médico inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

// ===== TYPES =====

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertAnonymousPatient = z.infer<typeof insertAnonymousPatientSchema>;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertRefreshToken = z.infer<typeof insertRefreshTokenSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type LoginData = z.infer<typeof loginSchema>;

// Dynamic Forms Types
export type InsertFormTemplate = z.infer<typeof insertFormTemplateSchema>;
export type InsertFormSection = z.infer<typeof insertFormSectionSchema>;
export type InsertFormField = z.infer<typeof insertFormFieldSchema>;
export type InsertConsultationResponse = z.infer<typeof insertConsultationResponseSchema>;

// New table insert types
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertLabTest = z.infer<typeof insertLabTestSchema>;
export type InsertLabResult = z.infer<typeof insertLabResultSchema>;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type InsertInsuranceProvider = z.infer<typeof insertInsuranceProviderSchema>;
export type InsertPatientInsurance = z.infer<typeof insertPatientInsuranceSchema>;
export type InsertMedicalCondition = z.infer<typeof insertMedicalConditionSchema>;
export type InsertAllergy = z.infer<typeof insertAllergySchema>;
export type InsertVitalSigns = z.infer<typeof insertVitalSignsSchema>;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type InsertPostalCode = z.infer<typeof insertPostalCodeSchema>;

// Select types for all tables
export type User = typeof users.$inferSelect;
export type Specialty = typeof specialties.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

export type FormTemplate = typeof formTemplates.$inferSelect;
export type FormSection = typeof formSections.$inferSelect;
export type FormField = typeof formFields.$inferSelect;
export type ConsultationResponse = typeof consultationResponses.$inferSelect;

// New table select types
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type Prescription = typeof prescriptions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type LabTest = typeof labTests.$inferSelect;
export type LabResult = typeof labResults.$inferSelect;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsuranceProvider = typeof insuranceProviders.$inferSelect;
export type PatientInsurance = typeof patientInsurance.$inferSelect;
export type MedicalCondition = typeof medicalConditions.$inferSelect;
export type Allergy = typeof allergies.$inferSelect;
export type VitalSigns = typeof vitalSigns.$inferSelect;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type AnonymousPatient = typeof anonymousPatients.$inferSelect;
export type PostalCode = typeof postalCodes.$inferSelect;

// ===== RELATIONS =====

export const usersRelations = relations(users, ({ many }) => ({
  consultations: many(consultations),
  templates: many(templates),
}));

export const consultationsRelations = relations(consultations, ({ one }) => ({
  doctor: one(users, {
    fields: [consultations.doctorId],
    references: [users.id],
  }),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  consultations: many(consultations),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  doctor: one(users, {
    fields: [templates.doctorId],
    references: [users.id],
  }),
}));

// ===== NEW TABLE RELATIONS =====

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  consultation: one(consultations, {
    fields: [medicalRecords.consultationId],
    references: [consultations.id],
  }),
  doctor: one(users, {
    fields: [medicalRecords.doctorId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
  }),
  consultation: one(consultations, {
    fields: [appointments.consultationId],
    references: [consultations.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  consultation: one(consultations, {
    fields: [prescriptions.consultationId],
    references: [consultations.id],
  }),
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [prescriptions.doctorId],
    references: [users.id],
  }),
  medication: one(medications, {
    fields: [prescriptions.medicationId],
    references: [medications.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const labResultsRelations = relations(labResults, ({ one }) => ({
  patient: one(patients, {
    fields: [labResults.patientId],
    references: [patients.id],
  }),
  consultation: one(consultations, {
    fields: [labResults.consultationId],
    references: [consultations.id],
  }),
  doctor: one(users, {
    fields: [labResults.doctorId],
    references: [users.id],
  }),
  labTest: one(labTests, {
    fields: [labResults.labTestId],
    references: [labTests.id],
  }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  patient: one(patients, {
    fields: [emergencyContacts.patientId],
    references: [patients.id],
  }),
}));

export const patientInsuranceRelations = relations(patientInsurance, ({ one }) => ({
  patient: one(patients, {
    fields: [patientInsurance.patientId],
    references: [patients.id],
  }),
  provider: one(insuranceProviders, {
    fields: [patientInsurance.providerId],
    references: [insuranceProviders.id],
  }),
}));

export const medicalConditionsRelations = relations(medicalConditions, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalConditions.patientId],
    references: [patients.id],
  }),
  diagnosedByDoctor: one(users, {
    fields: [medicalConditions.diagnosedBy],
    references: [users.id],
  }),
}));

export const allergiesRelations = relations(allergies, ({ one }) => ({
  patient: one(patients, {
    fields: [allergies.patientId],
    references: [patients.id],
  }),
}));

export const vitalSignsRelations = relations(vitalSigns, ({ one }) => ({
  patient: one(patients, {
    fields: [vitalSigns.patientId],
    references: [patients.id],
  }),
  consultation: one(consultations, {
    fields: [vitalSigns.consultationId],
    references: [consultations.id],
  }),
  recordedByUser: one(users, {
    fields: [vitalSigns.recordedBy],
    references: [users.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
}));

// Update existing relations to include new tables
export const patientsRelationsExtended = relations(patients, ({ many }) => ({
  consultations: many(consultations),
  medicalRecords: many(medicalRecords),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  labResults: many(labResults),
  emergencyContacts: many(emergencyContacts),
  insurance: many(patientInsurance),
  medicalConditions: many(medicalConditions),
  allergies: many(allergies),
  vitalSigns: many(vitalSigns),
}));

export const usersRelationsExtended = relations(users, ({ many }) => ({
  consultations: many(consultations),
  templates: many(templates),
  medicalRecords: many(medicalRecords),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  notifications: many(notifications),
  labResults: many(labResults),
  diagnosedConditions: many(medicalConditions),
  recordedVitalSigns: many(vitalSigns),
  favorites: many(userFavorites),
}));

export const consultationsRelationsExtended = relations(consultations, ({ one, many }) => ({
  doctor: one(users, {
    fields: [consultations.doctorId],
    references: [users.id],
  }),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  labResults: many(labResults),
  vitalSigns: many(vitalSigns),
  responses: many(consultationResponses),
}));