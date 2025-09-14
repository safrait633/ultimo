# 🏥 VITAL 3.0 - Parte 1: Arquitectura y Base de Datos
## 🇪🇸 Plataforma Médica con Glassmorphism - Prompt Detallado en Español

> **OBJETIVO**: Crear una plataforma médica moderna con diseño glassmorphism estilo Apple Health Records, soporte multiidioma y base de datos MySQL optimizada para velocidad.

---

## 📋 PROMPT PRINCIPAL PARA VITAL 3.0

```markdown
Crea una plataforma médica web moderna VITAL 3.0 con las siguientes características:

🎯 OBJETIVO PRINCIPAL: 
Reducir el tiempo de creación de exámenes médicos de 15-20 minutos a 5-10 minutos

🌟 CARACTERÍSTICAS CLAVE:
- Diseño glassmorphism inspirado en Apple Health Records
- Soporte multiidioma (Español, Inglés, Francés, Portugués)
- Todo en una sola página (SPA) - sin transiciones innecesarias
- Autoguardado cada 3 segundos
- Cambio entre especialidades sin pérdida de datos
- Base de datos MySQL (NO PostgreSQL)
- Templates rápidos de exámenes con sugerencias IA
- Optimización móvil para tablets
- Interfaz intuitiva con efectos visuales modernos

🛠️ STACK TÉCNICO:
Frontend: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
Backend: Node.js + Express + MySQL + TypeScript
Estado: Zustand + React Query
UI: Radix UI + shadcn/ui con efectos glassmorphism
Iconos: Lucide React + Heroicons
Formularios: React Hook Form + Zod validation
Internacionalización: react-i18next
Animaciones: Framer Motion + CSS backdrop-filter
```

---

## 🗄️ PASO 1: CONFIGURACIÓN DE BASE DE DATOS MYSQL

### 📊 Esquema Completo de Base de Datos

```sql
-- ============================================================================
-- VITAL 3.0 - ESQUEMA MYSQL COMPLETO
-- ============================================================================

CREATE DATABASE vital3_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE vital3_db;

-- ----------------------------------------------------------------------------
-- TABLA: users (médicos y administradores)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    
    -- Información profesional
    specialty VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    hospital_id INT,
    department VARCHAR(100),
    
    -- Sistema y permisos
    role ENUM('doctor', 'admin', 'nurse', 'specialist') DEFAULT 'doctor',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Preferencias de usuario
    preferred_language VARCHAR(5) DEFAULT 'es',
    theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light',
    timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
    
    -- Timestamps
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_specialty (specialty),
    INDEX idx_users_active (is_active, created_at)
);

-- ----------------------------------------------------------------------------
-- TABLA: patients (pacientes registrados)
-- ----------------------------------------------------------------------------
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    
    -- Información personal
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    age INT,
    birth_date DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    
    -- Documentación
    document_type ENUM('dni', 'passport', 'nie', 'social_security') DEFAULT 'dni',
    document_number VARCHAR(50) UNIQUE,
    
    -- Contacto
    email VARCHAR(255),
    phone VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    
    -- Dirección
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'España',
    
    -- Historia médica (JSON)
    medical_history JSON DEFAULT ('{}'),
    allergies JSON DEFAULT ('[]'),
    chronic_conditions JSON DEFAULT ('[]'),
    current_medications JSON DEFAULT ('[]'),
    
    -- Sistema
    is_active BOOLEAN DEFAULT TRUE,
    privacy_consent BOOLEAN DEFAULT FALSE,
    data_sharing_consent BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(5) DEFAULT 'es',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patients_document (document_number),
    INDEX idx_patients_name (last_name, first_name),
    INDEX idx_patients_birth_date (birth_date),
    FULLTEXT idx_patients_search (first_name, last_name, document_number)
);

-- ----------------------------------------------------------------------------
-- TABLA: anonymous_patients (pacientes anónimos)
-- ----------------------------------------------------------------------------
CREATE TABLE anonymous_patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    
    -- Información mínima
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    birth_date DATE,
    
    -- Información médica básica
    chief_complaint TEXT,
    medical_history JSON DEFAULT ('{}'),
    
    -- Sistema
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)),
    
    INDEX idx_anonymous_session (session_id),
    INDEX idx_anonymous_expires (expires_at)
);

-- ----------------------------------------------------------------------------
-- TABLA: examinations (exámenes médicos)
-- ----------------------------------------------------------------------------
CREATE TABLE examinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    
    -- Código único del examen (auto-generado)
    exam_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Relaciones
    doctor_id INT NOT NULL,
    patient_id INT NULL,
    anonymous_patient_id INT NULL,
    template_id INT NULL,
    
    -- Información del examen
    specialty VARCHAR(100) NOT NULL,
    exam_type ENUM('consultation', 'followup', 'emergency', 'routine') DEFAULT 'consultation',
    status ENUM('draft', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    -- Datos médicos principales
    chief_complaint TEXT,
    present_illness TEXT,
    physical_examination TEXT,
    
    -- Signos vitales (JSON)
    vital_signs JSON DEFAULT ('{}'),
    
    -- Examen físico por sistemas (JSON)
    physical_exam JSON DEFAULT ('{}'),
    
    -- Datos específicos por especialidad (JSON)
    specialty_data JSON DEFAULT ('{}'),
    
    -- Diagnóstico y tratamiento
    preliminary_diagnosis TEXT,
    final_diagnosis TEXT,
    icd10_codes JSON DEFAULT ('[]'),
    treatment_plan TEXT,
    prescriptions JSON DEFAULT ('[]'),
    recommendations TEXT,
    follow_up_instructions TEXT,
    
    -- Referencias y documentos
    referrals JSON DEFAULT ('[]'),
    lab_orders JSON DEFAULT ('[]'),
    imaging_orders JSON DEFAULT ('[]'),
    attachments JSON DEFAULT ('[]'),
    
    -- Timestamps y autoguardado
    auto_saved_at TIMESTAMP NULL,
    last_modified_by INT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (anonymous_patient_id) REFERENCES anonymous_patients(id) ON DELETE CASCADE,
    
    INDEX idx_examinations_doctor (doctor_id, created_at DESC),
    INDEX idx_examinations_patient (patient_id, created_at DESC),
    INDEX idx_examinations_status (status, priority, created_at),
    INDEX idx_examinations_specialty (specialty, created_at DESC),
    INDEX idx_examinations_code (exam_code),
    FULLTEXT idx_examinations_search (chief_complaint, preliminary_diagnosis, final_diagnosis)
);

-- ----------------------------------------------------------------------------
-- TABLA: examination_templates (plantillas de exámenes)
-- ----------------------------------------------------------------------------
CREATE TABLE examination_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    
    -- Información básica
    name VARCHAR(200) NOT NULL,
    description TEXT,
    specialty VARCHAR(100) NOT NULL,
    template_type ENUM('quick', 'standard', 'comprehensive') DEFAULT 'standard',
    
    -- Datos de la plantilla (JSON)
    template_data JSON NOT NULL DEFAULT ('{}'),
    
    -- Configuración
    is_quick_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Estadísticas de uso
    usage_count INT DEFAULT 0,
    average_completion_time INT DEFAULT 0, -- en minutos
    
    -- Metadatos
    created_by INT NOT NULL,
    tags JSON DEFAULT ('[]'),
    estimated_duration INT DEFAULT 10, -- minutos
    
    -- Multiidioma
    translations JSON DEFAULT ('{}'),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_templates_specialty (specialty, is_active),
    INDEX idx_templates_quick (is_quick_template, specialty),
    INDEX idx_templates_usage (usage_count DESC),
    FULLTEXT idx_templates_search (name, description)
);

-- ----------------------------------------------------------------------------
-- TABLA: medical_specialties (especialidades médicas)
-- ----------------------------------------------------------------------------
CREATE TABLE medical_specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Información básica
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Visualización
    icon VARCHAR(50) DEFAULT 'stethoscope',
    color_primary VARCHAR(7) DEFAULT '#0066CC',
    color_secondary VARCHAR(7) DEFAULT '#E3F2FD',
    
    -- Configuración
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    
    -- Campos de plantilla específicos (JSON)
    template_fields JSON DEFAULT ('{}'),
    required_fields JSON DEFAULT ('[]'),
    optional_fields JSON DEFAULT ('[]'),
    
    -- Multiidioma
    translations JSON DEFAULT ('{}'),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_specialties_active (is_active, sort_order),
    INDEX idx_specialties_slug (slug)
);

-- ----------------------------------------------------------------------------
-- TABLA: pathologies (patologías ICD-10)
-- ----------------------------------------------------------------------------
CREATE TABLE pathologies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Códigos ICD-10
    icd10_code VARCHAR(10) UNIQUE NOT NULL,
    parent_code VARCHAR(10),
    
    -- Nombres
    name_es VARCHAR(500) NOT NULL,
    name_en VARCHAR(500),
    name_fr VARCHAR(500),
    name_pt VARCHAR(500),
    
    -- Descripción
    description_es TEXT,
    description_en TEXT,
    
    -- Relaciones médicas
    specialty_id INT,
    category VARCHAR(100),
    severity ENUM('mild', 'moderate', 'severe', 'critical'),
    
    -- Información clínica (JSON)
    typical_symptoms JSON DEFAULT ('[]'),
    differential_diagnosis JSON DEFAULT ('[]'),
    recommended_tests JSON DEFAULT ('[]'),
    treatment_guidelines JSON DEFAULT ('{}'),
    risk_factors JSON DEFAULT ('[]'),
    complications JSON DEFAULT ('[]'),
    
    -- Sistema
    is_active BOOLEAN DEFAULT TRUE,
    usage_frequency INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (specialty_id) REFERENCES medical_specialties(id),
    
    INDEX idx_pathologies_icd10 (icd10_code),
    INDEX idx_pathologies_specialty (specialty_id, is_active),
    INDEX idx_pathologies_category (category),
    FULLTEXT idx_pathologies_search_es (name_es, description_es),
    FULLTEXT idx_pathologies_search_en (name_en, description_en)
);

-- ----------------------------------------------------------------------------
-- TABLA: auto_saves (autoguardado temporal)
-- ----------------------------------------------------------------------------
CREATE TABLE auto_saves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Identificación
    session_id VARCHAR(100) NOT NULL,
    examination_id INT,
    user_id INT NOT NULL,
    
    -- Datos temporales
    form_data JSON NOT NULL DEFAULT ('{}'),
    form_section VARCHAR(100),
    
    -- Timestamps
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)),
    
    FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_auto_saves_session (session_id, saved_at DESC),
    INDEX idx_auto_saves_user (user_id, saved_at DESC),
    INDEX idx_auto_saves_expires (expires_at)
);

-- ----------------------------------------------------------------------------
-- TABLA: system_translations (traducciones del sistema)
-- ----------------------------------------------------------------------------
CREATE TABLE system_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Clave de traducción
    translation_key VARCHAR(200) NOT NULL,
    namespace VARCHAR(100) DEFAULT 'common',
    
    -- Traducciones
    text_es TEXT NOT NULL,
    text_en TEXT,
    text_fr TEXT,
    text_pt TEXT,
    
    -- Metadatos
    context VARCHAR(200),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_translations (translation_key, namespace),
    INDEX idx_translations_namespace (namespace, is_active),
    INDEX idx_translations_key (translation_key)
);

-- ----------------------------------------------------------------------------
-- TABLA: user_preferences (preferencias de usuario)
-- ----------------------------------------------------------------------------
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Preferencias de interfaz
    language VARCHAR(5) DEFAULT 'es',
    theme VARCHAR(10) DEFAULT 'light',
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    auto_save_interval INT DEFAULT 3, -- segundos
    
    -- Preferencias médicas
    default_specialty VARCHAR(100),
    favorite_templates JSON DEFAULT ('[]'),
    quick_actions JSON DEFAULT ('[]'),
    
    -- Notificaciones
    email_notifications BOOLEAN DEFAULT TRUE,
    desktop_notifications BOOLEAN DEFAULT TRUE,
    sound_alerts BOOLEAN DEFAULT FALSE,
    
    -- Datos JSON flexibles
    custom_settings JSON DEFAULT ('{}'),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_preferences (user_id)
);

-- ============================================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
-- ============================================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_examinations_doctor_status_date ON examinations(doctor_id, status, created_at DESC);
CREATE INDEX idx_examinations_patient_specialty ON examinations(patient_id, specialty, created_at DESC);
CREATE INDEX idx_templates_specialty_type ON examination_templates(specialty, template_type, is_active);

-- Índices para búsquedas de texto completo
ALTER TABLE patients ADD FULLTEXT(first_name, last_name, email);
ALTER TABLE examinations ADD FULLTEXT(chief_complaint, preliminary_diagnosis, final_diagnosis);

-- ============================================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================================================

-- Procedimiento para generar código único de examen
DELIMITER //
CREATE PROCEDURE GenerateExamCode(OUT exam_code VARCHAR(20))
BEGIN
    DECLARE code_num INT;
    DECLARE code_exists INT DEFAULT 1;
    
    WHILE code_exists > 0 DO
        SELECT COALESCE(MAX(CAST(SUBSTRING(exam_code, 2) AS UNSIGNED)), 0) + 1 
        INTO code_num 
        FROM examinations 
        WHERE exam_code LIKE 'E%';
        
        SET exam_code = CONCAT('E', LPAD(code_num, 6, '0'));
        
        SELECT COUNT(*) INTO code_exists 
        FROM examinations 
        WHERE examinations.exam_code = exam_code;
    END WHILE;
END //
DELIMITER ;

-- Procedimiento para limpiar autoguardados expirados
DELIMITER //
CREATE PROCEDURE CleanExpiredAutoSaves()
BEGIN
    DELETE FROM auto_saves WHERE expires_at < NOW();
    DELETE FROM anonymous_patients WHERE expires_at < NOW();
END //
DELIMITER ;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger para generar código de examen automáticamente
DELIMITER //
CREATE TRIGGER before_examination_insert 
BEFORE INSERT ON examinations
FOR EACH ROW
BEGIN
    IF NEW.exam_code IS NULL OR NEW.exam_code = '' THEN
        CALL GenerateExamCode(@new_code);
        SET NEW.exam_code = @new_code;
    END IF;
    
    SET NEW.uuid = UUID();
END //
DELIMITER ;

-- Trigger para actualizar usage_count en templates
DELIMITER //
CREATE TRIGGER after_examination_template_used
AFTER INSERT ON examinations
FOR EACH ROW
BEGIN
    IF NEW.template_id IS NOT NULL THEN
        UPDATE examination_templates 
        SET usage_count = usage_count + 1 
        WHERE id = NEW.template_id;
    END IF;
END //
DELIMITER ;
```

### 🔧 Configuración del Servidor MySQL

```bash
# ============================================================================
# CONFIGURACIÓN MYSQL PARA VITAL 3.0
# ============================================================================

# Crear usuario específico para la aplicación
mysql -u root -p << EOF
CREATE USER 'vital3_user'@'localhost' IDENTIFIED BY 'VitalSecure2025!';
CREATE USER 'vital3_user'@'%' IDENTIFIED BY 'VitalSecure2025!';

GRANT ALL PRIVILEGES ON vital3_db.* TO 'vital3_user'@'localhost';
GRANT ALL PRIVILEGES ON vital3_db.* TO 'vital3_user'@'%';

FLUSH PRIVILEGES;
EOF

# Configuración optimizada en /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
# Configuración básica
bind-address = 0.0.0.0
port = 3306
datadir = /var/lib/mysql
socket = /var/run/mysqld/mysqld.sock

# Configuración de memoria (ajustar según servidor)
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_log_buffer_size = 64M
key_buffer_size = 256M
max_connections = 200

# Configuración para aplicaciones web
query_cache_type = 1
query_cache_size = 128M
table_open_cache = 1000
tmp_table_size = 256M
max_heap_table_size = 256M

# Configuración de caracteres UTF-8
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init-connect = 'SET NAMES utf8mb4'

# Configuración de logs
log-error = /var/log/mysql/error.log
slow-query-log = 1
slow-query-log-file = /var/log/mysql/slow.log
long_query_time = 2

# Configuración InnoDB
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 2
innodb_lock_wait_timeout = 50
```

### 📊 Scripts de Datos Iniciales

```sql
-- ============================================================================
-- DATOS INICIALES PARA VITAL 3.0
-- ============================================================================

-- Insertar especialidades médicas
INSERT INTO medical_specialties (name, slug, description, icon, color_primary, color_secondary, template_fields, translations) VALUES
('Cardiología', 'cardiology', 'Especialidad que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón', 'heart', '#DC2626', '#FEE2E2', 
 JSON_OBJECT(
   'vitals', JSON_ARRAY('blood_pressure', 'heart_rate', 'rhythm'),
   'examination', JSON_ARRAY('heart_sounds', 'murmurs', 'edema'),
   'tests', JSON_ARRAY('ecg', 'echocardiogram', 'stress_test')
 ),
 JSON_OBJECT(
   'es', JSON_OBJECT('name', 'Cardiología', 'description', 'Especialidad del corazón'),
   'en', JSON_OBJECT('name', 'Cardiology', 'description', 'Heart specialty'),
   'fr', JSON_OBJECT('name', 'Cardiologie', 'description', 'Spécialité du cœur'),
   'pt', JSON_OBJECT('name', 'Cardiologia', 'description', 'Especialidade do coração')
 )),

('Neurología', 'neurology', 'Especialidad médica que trata los trastornos del sistema nervioso', 'brain', '#7C3AED', '#EDE9FE',
 JSON_OBJECT(
   'vitals', JSON_ARRAY('blood_pressure', 'consciousness_level'),
   'examination', JSON_ARRAY('reflexes', 'coordination', 'cranial_nerves'),
   'tests', JSON_ARRAY('ct_scan', 'mri', 'eeg')
 ),
 JSON_OBJECT(
   'es', JSON_OBJECT('name', 'Neurología', 'description', 'Especialidad del sistema nervioso'),
   'en', JSON_OBJECT('name', 'Neurology', 'description', 'Nervous system specialty'),
   'fr', JSON_OBJECT('name', 'Neurologie', 'description', 'Spécialité du système nerveux'),
   'pt', JSON_OBJECT('name', 'Neurologia', 'description', 'Especialidade do sistema nervoso')
 )),

('Gastroenterología', 'gastroenterology', 'Especialidad que estudia el aparato digestivo y sus enfermedades', 'activity', '#059669', '#D1FAE5',
 JSON_OBJECT(
   'vitals', JSON_ARRAY('weight', 'bmi', 'temperature'),
   'examination', JSON_ARRAY('abdomen', 'liver', 'bowel_sounds'),
   'tests', JSON_ARRAY('endoscopy', 'colonoscopy', 'ultrasound')
 ),
 JSON_OBJECT(
   'es', JSON_OBJECT('name', 'Gastroenterología', 'description', 'Especialidad del aparato digestivo'),
   'en', JSON_OBJECT('name', 'Gastroenterology', 'description', 'Digestive system specialty'),
   'fr', JSON_OBJECT('name', 'Gastroentérologie', 'description', 'Spécialité du système digestif'),
   'pt', JSON_OBJECT('name', 'Gastroenterologia', 'description', 'Especialidade do sistema digestivo')
 )),

('Endocrinología', 'endocrinology', 'Especialidad que estudia las hormonas y las glándulas que las producen', 'zap', '#D97706', '#FED7AA',
 JSON_OBJECT(
   'vitals', JSON_ARRAY('weight', 'height', 'bmi', 'blood_pressure'),
   'examination', JSON_ARRAY('thyroid', 'lymph_nodes', 'skin'),
   'tests', JSON_ARRAY('glucose', 'hba1c', 'thyroid_function')
 ),
 JSON_OBJECT(
   'es', JSON_OBJECT('name', 'Endocrinología', 'description', 'Especialidad hormonal'),
   'en', JSON_OBJECT('name', 'Endocrinology', 'description', 'Hormonal specialty'),
   'fr', JSON_OBJECT('name', 'Endocrinologie', 'description', 'Spécialité hormonale'),
   'pt', JSON_OBJECT('name', 'Endocrinologia', 'description', 'Especialidade hormonal')
 ));

-- Insertar patologías comunes
INSERT INTO pathologies (icd10_code, name_es, name_en, specialty_id, typical_symptoms, recommended_tests, treatment_guidelines) VALUES
('I20.9', 'Angina de pecho no especificada', 'Angina pectoris, unspecified', 1,
 JSON_ARRAY('dolor torácico', 'disnea de esfuerzo', 'fatiga'),
 JSON_ARRAY('ECG', 'troponinas', 'ecocardiograma'),
 JSON_OBJECT('medications', JSON_ARRAY('nitratos', 'betabloqueantes'), 'lifestyle', JSON_ARRAY('ejercicio', 'dieta'))),

('G43.9', 'Migraña no especificada', 'Migraine, unspecified', 2,
 JSON_ARRAY('cefalea pulsátil', 'fotofobia', 'náuseas'),
 JSON_ARRAY('TAC craneal', 'RMN cerebral'),
 JSON_OBJECT('acute', JSON_ARRAY('triptanes', 'AINEs'), 'preventive', JSON_ARRAY('betabloqueantes', 'anticonvulsivantes')));

-- Insertar traducciones del sistema
INSERT INTO system_translations (translation_key, namespace, text_es, text_en, text_fr, text_pt) VALUES
('app.title', 'common', 'VITAL 3.0 - Plataforma Médica', 'VITAL 3.0 - Medical Platform', 'VITAL 3.0 - Plateforme Médicale', 'VITAL 3.0 - Plataforma Médica'),
('navigation.dashboard', 'common', 'Panel Principal', 'Dashboard', 'Tableau de Bord', 'Painel Principal'),
('navigation.patients', 'common', 'Pacientes', 'Patients', 'Patients', 'Pacientes'),
('navigation.examinations', 'common', 'Exámenes', 'Examinations', 'Examens', 'Exames'),
('buttons.save', 'common', 'Guardar', 'Save', 'Sauvegarder', 'Salvar'),
('buttons.cancel', 'common', 'Cancelar', 'Cancel', 'Annuler', 'Cancelar'),
('forms.required_field', 'validation', 'Este campo es obligatorio', 'This field is required', 'Ce champ est obligatoire', 'Este campo é obrigatório');

-- Crear usuario administrador por defecto
INSERT INTO users (email, password_hash, first_name, last_name, role, specialty, preferred_language) VALUES
('admin@vital3.com', '$2b$12$LQv3c1yqBwlVHpuNAzlzieQKf1O.r8SzY8.abcd1234567890', 'Administrador', 'Sistema', 'admin', 'administration', 'es');
```

---

## 🚀 PASO 2: CONFIGURACIÓN DEL PROYECTO

### 📁 Estructura de Proyecto Completa

```bash
# ============================================================================
# CREAR ESTRUCTURA DE PROYECTO VITAL 3.0
# ============================================================================

mkdir vital3-medical-platform
cd vital3-medical-platform

# Estructura del proyecto
mkdir -p {
  client/{src/{components/{ui,medical,layout,forms},hooks,lib,pages,store,types,locales},public},
  server/{src/{routes,middleware,database,services,types,utils},config},
  shared/{types,constants,utils},
  docs,
  scripts
}

# Crear archivos de configuración
touch {
  client/{package.json,vite.config.ts,tailwind.config.js,tsconfig.json,.env.example},
  server/{package.json,tsconfig.json,.env.example},
  docker-compose.yml,
  README.md
}
```

### 📦 Package.json del Frontend

```json
{
  "name": "vital3-frontend",
  "version": "3.0.0",
  "description": "VITAL 3.0 - Plataforma Médica con Glassmorphism",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.15.0",
    
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.8.4",
    
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.6",
    "i18next-browser-languagedetector": "^7.2.0",
    
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    
    "framer-motion": "^10.16.5",
    "lucide-react": "^0.292.0",
    "@heroicons/react": "^2.0.18",
    
    "tailwindcss": "^3.3.6",
    "tailwindcss-animate": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "react-day-picker": "^8.9.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 📦 Package.json del Backend

```json
{
  "name": "vital3-backend",
  "version": "3.0.0",
  "description": "VITAL 3.0 - API Backend con MySQL",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "tsx src/database/migrate.ts",
    "db:seed": "tsx src/database/seed.ts",
    "test": "jest",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    
    "mysql2": "^3.6.5",
    "knex": "^3.0.1",
    
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    
    "dotenv": "^16.3.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/node": "^20.10.5",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "tsx": "^4.6.2",
    "typescript": "^5.3.3"
  }
}
```

### ⚙️ Configuración de Vite

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/locales": path.resolve(__dirname, "./src/locales")
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
})
```

### 🎨 Configuración de Tailwind CSS con Glassmorphism

```javascript
// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Paleta médica VITAL 3.0
        medical: {
          primary: '#0066CC',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          neutral: '#6B7280',
        },
        // Especialidades médicas
        specialty: {
          cardiology: '#DC2626',
          neurology: '#7C3AED',
          gastroenterology: '#059669',
          endocrinology: '#D97706',
          dermatology: '#EC4899',
          orthopedics: '#1D4ED8',
        },
        // Colores base adaptados para glassmorphism
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        medical: ['JetBrains Mono', 'monospace'],
      },
      // Efectos glassmorphism
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-glassmorphism': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'gradient-medical': 'linear-gradient(135deg, #0066CC 0%, #4A90E2 100%)',
        'gradient-specialty-cardiology': 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        'gradient-specialty-neurology': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
      },
      boxShadow: {
        'glassmorphism': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glassmorphism-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.2)',
        'medical': '0 4px 20px 0 rgba(0, 102, 204, 0.15)',
        'specialty': '0 4px 20px 0 rgba(124, 58, 237, 0.15)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-medical": "pulse-medical 2s infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "pulse-medical": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin personalizado para glassmorphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glassmorphism': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glassmorphism-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        '.glassmorphism-medical': {
          background: 'rgba(0, 102, 204, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 102, 204, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 102, 204, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
```

### 🐳 Docker Compose para Desarrollo

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: vital3_mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: VitalRootPassword2025!
      MYSQL_DATABASE: vital3_db
      MYSQL_USER: vital3_user
      MYSQL_PASSWORD: VitalSecure2025!
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./scripts/mysql-init:/docker-entrypoint-initdb.d
    command: --default-authentication-plugin=mysql_native_password
    networks:
      - vital3_network

  redis:
    image: redis:7-alpine
    container_name: vital3_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - vital3_network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: vital3_backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 3001
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: vital3_user
      DB_PASSWORD: VitalSecure2025!
      DB_NAME: vital3_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: VitalJWTSecret2025SuperSecure!
    ports:
      - "3001:3001"
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      - mysql
      - redis
    networks:
      - vital3_network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: vital3_frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:3001/api/v3
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - vital3_network

volumes:
  mysql_data:
  redis_data:

networks:
  vital3_network:
    driver: bridge
```

---

## 🔒 PASO 3: CONFIGURACIÓN DE SEGURIDAD Y AUTENTICACIÓN

### 🛡️ Middleware de Autenticación JWT

```typescript
// server/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  specialty?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'vital3-secret-key';
  private static readonly JWT_EXPIRES_IN = '7d';
  private static readonly REFRESH_EXPIRES_IN = '30d';

  // Generar token JWT
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: 'vital3-platform',
    });
  }

  // Generar refresh token
  static generateRefreshToken(userId: number): string {
    return jwt.sign({ userId, type: 'refresh' }, this.JWT_SECRET, {
      expiresIn: this.REFRESH_EXPIRES_IN,
    });
  }

  // Verificar token
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
  }

  // Hash de contraseña
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verificar contraseña
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Autenticar usuario
  static async authenticateUser(email: string, password: string) {
    try {
      // Buscar usuario por email
      const [users] = await db.execute(
        'SELECT id, email, password_hash, first_name, last_name, role, specialty, is_active FROM users WHERE email = ? AND is_active = true',
        [email]
      );

      const user = (users as any[])[0];
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
      }

      // Actualizar último login
      await db.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );

      // Generar tokens
      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
      };

      const accessToken = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          specialty: user.specialty,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

// Middleware de autenticación
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido',
      });
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    // Verificar que el usuario sigue activo
    const [users] = await db.execute(
      'SELECT id, email, role, specialty, is_active FROM users WHERE id = ? AND is_active = true',
      [decoded.userId]
    );

    const user = (users as any[])[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error de autenticación',
    });
  }
};

// Middleware de autorización por rol
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
      });
    }

    next();
  };
};
```

### 🔐 Variables de Entorno

```bash
# server/.env.example
# ============================================================================
# VITAL 3.0 - CONFIGURACIÓN DEL SERVIDOR
# ============================================================================

# Configuración del servidor
NODE_ENV=development
PORT=3001
HOST=localhost

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=vital3_user
DB_PASSWORD=VitalSecure2025!
DB_NAME=vital3_db
DB_CONNECTION_LIMIT=20

# Redis (para caché y sesiones)
REDIS_URL=redis://localhost:6379
REDIS_PREFIX=vital3:

# JWT y seguridad
JWT_SECRET=VitalJWTSecret2025SuperSecure!
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=12

# Configuración de archivos
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
UPLOAD_DIR=./uploads

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@vital3.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=VITAL 3.0 <noreply@vital3.com>

# Configuración de CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_CREDENTIALS=true

# Rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/vital3.log

# Configuración médica
AUTO_SAVE_INTERVAL=3000
MAX_EXAMINATION_DURATION=24
ANONYMOUS_PATIENT_EXPIRY=24

# ============================================================================
# VARIABLES ESPECÍFICAS DE PRODUCCIÓN
# ============================================================================

# Base de datos (producción)
# DB_HOST=your-production-db-host
# DB_USER=your-production-user
# DB_PASSWORD=your-super-secure-password

# SSL/TLS
# SSL_CERT_PATH=/path/to/certificate.crt
# SSL_KEY_PATH=/path/to/private.key

# Monitoring
# SENTRY_DSN=your-sentry-dsn
# NEW_RELIC_LICENSE_KEY=your-new-relic-key
```

```bash
# client/.env.example
# ============================================================================
# VITAL 3.0 - CONFIGURACIÓN DEL FRONTEND
# ============================================================================

# API Configuration
VITE_API_URL=http://localhost:3001/api/v3
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_STORAGE_KEY=vital3_token
VITE_REFRESH_TOKEN_KEY=vital3_refresh

# Application
VITE_APP_NAME=VITAL 3.0
VITE_APP_VERSION=3.0.0
VITE_DEFAULT_LANGUAGE=es
VITE_SUPPORTED_LANGUAGES=es,en,fr,pt

# Features
VITE_ENABLE_AUTO_SAVE=true
VITE_AUTO_SAVE_INTERVAL=3000
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PUSH_NOTIFICATIONS=false

# UI Configuration
VITE_DEFAULT_THEME=light
VITE_ENABLE_GLASSMORPHISM=true
VITE_ANIMATION_DURATION=300

# Development
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=info

# Analytics (opcional)
# VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
# VITE_HOTJAR_ID=XXXXXXX

# External Services
# VITE_MAPS_API_KEY=your-maps-api-key
# VITE_SENTRY_DSN=your-sentry-dsn
```

---

¡Perfecto! He completado el **Documento 1: Arquitectura y Base de Datos** con toda la configuración técnica necesaria para VITAL 3.0. Este documento incluye:

✅ **Esquema MySQL completo** con todas las tablas optimizadas  
✅ **Configuración del proyecto** con estructura moderna  
✅ **Package.json** para frontend y backend  
✅ **Tailwind CSS** con efectos glassmorphism personalizados  
✅ **Docker Compose** para desarrollo  
✅ **Sistema de autenticación JWT** robusto  
✅ **Variables de entorno** configuradas  

<function_calls>
<invoke name="manage_todo_list">
<parameter name="operation">write