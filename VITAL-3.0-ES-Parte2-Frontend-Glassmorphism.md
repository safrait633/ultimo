# 🎨 VITAL 3.0 - Parte 2: Frontend y Glassmorphism UI
## 🇪🇸 Diseño Moderno con Efectos Visuales estilo Apple Health Records

> **OBJETIVO**: Crear una interfaz de usuario moderna con efectos glassmorphism, soporte multiidioma y componentes optimizados para uso médico profesional.

---

## 🌟 PROMPT PARA DISEÑO GLASSMORPHISM

```markdown
Crea la interfaz frontend de VITAL 3.0 con las siguientes características visuales:

🎨 ESTILO VISUAL:
- Glassmorphism inspirado en Apple Health Records
- Efectos de transparencia y blur (backdrop-filter)
- Gradientes sutiles y sombras suaves
- Animaciones fluidas con Framer Motion
- Esquema de colores médicos profesionales
- Tipografía Inter + JetBrains Mono para datos médicos

🌍 MULTIIDIOMA:
- Soporte para Español, Inglés, Francés, Portugués
- Componente selector de idioma en header
- Traducciones dinámicas con react-i18next
- Detección automática del idioma del navegador
- Persistencia de preferencia de idioma

📱 RESPONSIVE DESIGN:
- Tablet-first approach (médicos usan tablets)
- Adaptación automática a móviles
- Touch-friendly con gestos naturales
- Optimización para pantallas de 10-13 pulgadas
```

---

## 🏗️ PASO 1: CONFIGURACIÓN DE INTERNACIONALIZACIÓN

### 🌍 Setup de react-i18next

```typescript
// client/src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import esCommon from '../locales/es/common.json';
import esAuth from '../locales/es/auth.json';
import esMedical from '../locales/es/medical.json';
import esSpecialties from '../locales/es/specialties.json';

import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enMedical from '../locales/en/medical.json';
import enSpecialties from '../locales/en/specialties.json';

import frCommon from '../locales/fr/common.json';
import frAuth from '../locales/fr/auth.json';
import frMedical from '../locales/fr/medical.json';
import frSpecialties from '../locales/fr/specialties.json';

import ptCommon from '../locales/pt/common.json';
import ptAuth from '../locales/pt/auth.json';
import ptMedical from '../locales/pt/medical.json';
import ptSpecialties from '../locales/pt/specialties.json';

// Configuración de idiomas
const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    medical: esMedical,
    specialties: esSpecialties,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    medical: enMedical,
    specialties: enSpecialties,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    medical: frMedical,
    specialties: frSpecialties,
  },
  pt: {
    common: ptCommon,
    auth: ptAuth,
    medical: ptMedical,
    specialties: ptSpecialties,
  },
};

// Inicializar i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    
    // Idioma por defecto
    fallbackLng: 'es',
    
    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'auth', 'medical', 'specialties'],
    
    // Configuración de detección
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'vital3_language',
    },
    
    // Configuración de interpolación
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    
    // Configuración de desarrollo
    debug: import.meta.env.DEV,
    
    // Configuración de carga
    load: 'languageOnly',
    cleanCode: true,
    
    // Configuración de reactividad
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
  });

export default i18n;

// Hook personalizado para idiomas
export const useLanguage = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('vital3_language', lng);
  };
  
  const currentLanguage = i18n.language;
  
  const availableLanguages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ];
  
  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };
};
```

### 📁 Archivos de Traducciones

```json
// client/src/locales/es/common.json
{
  "app": {
    "title": "VITAL 3.0",
    "subtitle": "Plataforma Médica Inteligente",
    "version": "Versión 3.0.0"
  },
  "navigation": {
    "dashboard": "Panel Principal",
    "patients": "Pacientes",
    "examinations": "Exámenes",
    "templates": "Plantillas",
    "reports": "Informes",
    "settings": "Configuración",
    "logout": "Cerrar Sesión"
  },
  "buttons": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "edit": "Editar",
    "delete": "Eliminar",
    "new": "Nuevo",
    "search": "Buscar",
    "filter": "Filtrar",
    "export": "Exportar",
    "print": "Imprimir",
    "back": "Volver",
    "next": "Siguiente",
    "previous": "Anterior",
    "submit": "Enviar",
    "reset": "Restablecer"
  },
  "status": {
    "loading": "Cargando...",
    "saving": "Guardando...",
    "saved": "Guardado",
    "error": "Error",
    "success": "Éxito",
    "warning": "Advertencia",
    "info": "Información"
  },
  "time": {
    "now": "Ahora",
    "today": "Hoy",
    "yesterday": "Ayer",
    "minutes_ago": "{{count}} minuto hace",
    "minutes_ago_plural": "{{count}} minutos hace",
    "hours_ago": "{{count}} hora hace",
    "hours_ago_plural": "{{count}} horas hace",
    "days_ago": "{{count}} día hace",
    "days_ago_plural": "{{count}} días hace"
  },
  "forms": {
    "required_field": "Este campo es obligatorio",
    "invalid_email": "Email inválido",
    "invalid_phone": "Teléfono inválido",
    "password_too_short": "La contraseña debe tener al menos 8 caracteres",
    "passwords_no_match": "Las contraseñas no coinciden",
    "invalid_date": "Fecha inválida",
    "field_too_long": "Texto demasiado largo (máximo {{max}} caracteres)",
    "field_too_short": "Texto demasiado corto (mínimo {{min}} caracteres)"
  }
}
```

```json
// client/src/locales/es/medical.json
{
  "patient": {
    "personal_info": "Información Personal",
    "medical_history": "Historia Médica",
    "allergies": "Alergias",
    "medications": "Medicamentos",
    "emergency_contact": "Contacto de Emergencia",
    "first_name": "Nombre",
    "last_name": "Apellidos",
    "age": "Edad",
    "gender": "Género",
    "birth_date": "Fecha de Nacimiento",
    "document_number": "Número de Documento",
    "email": "Correo Electrónico",
    "phone": "Teléfono",
    "address": "Dirección"
  },
  "examination": {
    "new_examination": "Nuevo Examen",
    "examination_code": "Código de Examen",
    "chief_complaint": "Motivo de Consulta",
    "present_illness": "Enfermedad Actual",
    "physical_examination": "Examen Físico",
    "vital_signs": "Signos Vitales",
    "diagnosis": "Diagnóstico",
    "treatment": "Tratamiento",
    "prescriptions": "Recetas",
    "recommendations": "Recomendaciones",
    "follow_up": "Seguimiento",
    "status": {
      "draft": "Borrador",
      "in_progress": "En Progreso",
      "completed": "Completado",
      "cancelled": "Cancelado"
    }
  },
  "vital_signs": {
    "blood_pressure": "Presión Arterial",
    "heart_rate": "Frecuencia Cardíaca",
    "temperature": "Temperatura",
    "respiratory_rate": "Frecuencia Respiratoria",
    "oxygen_saturation": "Saturación de Oxígeno",
    "weight": "Peso",
    "height": "Altura",
    "bmi": "IMC",
    "systolic": "Sistólica",
    "diastolic": "Diastólica",
    "units": {
      "mmhg": "mmHg",
      "bpm": "lpm",
      "celsius": "°C",
      "fahrenheit": "°F",
      "kg": "kg",
      "lb": "lb",
      "cm": "cm",
      "ft": "ft",
      "percent": "%"
    }
  },
  "templates": {
    "quick_templates": "Plantillas Rápidas",
    "select_template": "Seleccionar Plantilla",
    "no_template": "Sin Plantilla",
    "create_template": "Crear Plantilla",
    "save_as_template": "Guardar como Plantilla",
    "template_name": "Nombre de la Plantilla",
    "template_description": "Descripción",
    "estimated_time": "Tiempo Estimado"
  }
}
```

```json
// client/src/locales/es/specialties.json
{
  "cardiology": {
    "name": "Cardiología",
    "description": "Especialidad del corazón y sistema cardiovascular",
    "fields": {
      "chest_pain": "Dolor torácico",
      "palpitations": "Palpitaciones",
      "dyspnea": "Disnea",
      "syncope": "Síncope",
      "edema": "Edema",
      "heart_sounds": "Ruidos Cardíacos",
      "murmurs": "Soplos",
      "ecg": "Electrocardiograma",
      "echocardiogram": "Ecocardiograma",
      "stress_test": "Prueba de Esfuerzo"
    },
    "templates": {
      "chest_pain": "Dolor Torácico",
      "hypertension": "Hipertensión",
      "arrhythmia": "Arritmia",
      "routine_checkup": "Revisión Rutinaria"
    }
  },
  "neurology": {
    "name": "Neurología",
    "description": "Especialidad del sistema nervioso",
    "fields": {
      "headache": "Cefalea",
      "dizziness": "Mareo",
      "seizures": "Convulsiones",
      "weakness": "Debilidad",
      "numbness": "Entumecimiento",
      "reflexes": "Reflejos",
      "coordination": "Coordinación",
      "cranial_nerves": "Nervios Craneales",
      "consciousness": "Nivel de Conciencia",
      "ct_scan": "TAC Cerebral",
      "mri": "Resonancia Magnética",
      "eeg": "Electroencefalograma"
    },
    "templates": {
      "headache": "Cefalea",
      "dizziness": "Mareo",
      "stroke": "Accidente Cerebrovascular",
      "seizure": "Crisis Epiléptica"
    }
  },
  "gastroenterology": {
    "name": "Gastroenterología",
    "description": "Especialidad del aparato digestivo",
    "fields": {
      "abdominal_pain": "Dolor Abdominal",
      "nausea": "Náuseas",
      "vomiting": "Vómitos",
      "diarrhea": "Diarrea",
      "constipation": "Estreñimiento",
      "abdomen": "Abdomen",
      "liver": "Hígado",
      "bowel_sounds": "Ruidos Intestinales",
      "endoscopy": "Endoscopia",
      "colonoscopy": "Colonoscopia",
      "ultrasound": "Ecografía"
    },
    "templates": {
      "abdominal_pain": "Dolor Abdominal",
      "gastritis": "Gastritis",
      "ibs": "Síndrome Intestino Irritable",
      "hepatitis": "Hepatitis"
    }
  }
}
```

## 🎨 PASO 2: COMPONENTES BASE CON GLASSMORPHISM

### 🔮 Componente Card Glassmorphism

```tsx
// client/src/components/ui/glassmorphism-card.tsx
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'medical' | 'specialty' | 'danger' | 'success';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  glow?: boolean;
  hover?: boolean;
}

const cardVariants = {
  default: 'bg-white/10 border-white/20',
  medical: 'bg-medical-primary/10 border-medical-primary/20',
  specialty: 'bg-purple-500/10 border-purple-500/20',
  danger: 'bg-red-500/10 border-red-500/20',
  success: 'bg-green-500/10 border-green-500/20',
};

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const glowClasses = {
  default: 'shadow-glassmorphism',
  medical: 'shadow-[0_8px_32px_rgba(0,102,204,0.3)]',
  specialty: 'shadow-[0_8px_32px_rgba(124,58,237,0.3)]',
  danger: 'shadow-[0_8px_32px_rgba(239,68,68,0.3)]',
  success: 'shadow-[0_8px_32px_rgba(16,185,129,0.3)]',
};

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className,
  variant = 'default',
  blur = 'md',
  border = true,
  glow = false,
  hover = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      className={cn(
        // Base glassmorphism
        'relative rounded-2xl',
        blurClasses[blur],
        cardVariants[variant],
        
        // Border
        border && 'border',
        
        // Glow effect
        glow && glowClasses[variant],
        
        // Interactive states
        'transition-all duration-300 ease-out',
        hover && 'hover:shadow-lg cursor-pointer',
        
        className
      )}
      {...props}
    >
      {/* Gradient overlay for enhanced glassmorphism */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Componente especializado para tarjetas médicas
export const MedicalCard: React.FC<GlassmorphismCardProps> = (props) => (
  <GlassmorphismCard
    variant="medical"
    glow
    {...props}
  />
);

// Componente para tarjetas de especialidades
export const SpecialtyCard: React.FC<GlassmorphismCardProps & { 
  specialty: string;
  icon: React.ReactNode;
  color?: string;
}> = ({ specialty, icon, color, children, ...props }) => (
  <GlassmorphismCard
    variant="specialty"
    className={cn('p-6', props.className)}
    style={color ? { 
      background: `${color}10`,
      borderColor: `${color}30`
    } : undefined}
    {...props}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-white/10">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{specialty}</h3>
    </div>
    {children}
  </GlassmorphismCard>
);
```

### 🎨 Sistema de Colores Dinámicos

```typescript
// client/src/lib/colors.ts
export const medicalColors = {
  primary: '#0066CC',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: '#6B7280',
} as const;

export const specialtyColors = {
  cardiology: '#DC2626',
  neurology: '#7C3AED',
  gastroenterology: '#059669',
  endocrinology: '#D97706',
  dermatology: '#EC4899',
  orthopedics: '#1D4ED8',
  ophthalmology: '#0891B2',
  psychiatry: '#7C2D12',
  pediatrics: '#EA580C',
  gynecology: '#BE185D',
  urology: '#1E40AF',
  otolaryngology: '#059669',
  pulmonology: '#0D9488',
  rheumatology: '#7C3AED',
  oncology: '#991B1B',
} as const;

export const getSpecialtyColor = (specialty: keyof typeof specialtyColors) => {
  return specialtyColors[specialty] || medicalColors.primary;
};

export const getSpecialtyGradient = (specialty: keyof typeof specialtyColors) => {
  const color = getSpecialtyColor(specialty);
  return `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`;
};

// Convertir color hex a rgba
export const hexToRgba = (hex: string, alpha: number = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generar variantes de color para glassmorphism
export const createGlassmorphismVariant = (color: string) => ({
  background: hexToRgba(color, 0.1),
  border: hexToRgba(color, 0.2),
  shadow: `0 8px 32px ${hexToRgba(color, 0.3)}`,
});
```

### 🎭 Componente Selector de Idioma

```tsx
// client/src/components/layout/language-selector.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, LanguagesIcon } from '@heroicons/react/24/outline';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { useLanguage } from '@/lib/i18n';

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LanguagesIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.flag}</span>
        <span className="hidden sm:block text-sm">{currentLang?.name}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 min-w-[200px]"
            >
              <GlassmorphismCard className="p-2" blur="lg">
                <div className="space-y-1">
                  {availableLanguages.map((language) => (
                    <motion.button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        currentLanguage === language.code
                          ? 'bg-medical-primary/20 text-medical-primary'
                          : 'hover:bg-white/10'
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <div className="font-medium">{language.name}</div>
                        <div className="text-xs opacity-70">{language.code.toUpperCase()}</div>
                      </div>
                      {currentLanguage === language.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-medical-primary rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
```

## 📱 PASO 3: LAYOUT PRINCIPAL CON GLASSMORPHISM

### 🏗️ Layout Principal de la Aplicación

```tsx
// client/src/components/layout/main-layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TopBar } from './top-bar';
import { Sidebar } from './sidebar';
import { AutoSaveIndicator } from './auto-save-indicator';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,204,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            sidebarCollapsed ? 'w-16' : 'w-80'
          } transition-all duration-300 relative z-20`}
        >
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar />

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </main>

          {/* Auto Save Indicator */}
          <AutoSaveIndicator />
        </div>
      </div>
    </div>
  );
};
```

### 🔝 Barra Superior (TopBar)

```tsx
// client/src/components/layout/top-bar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BellIcon, 
  Cog6ToothIcon,
  UserCircleIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { LanguageSelector } from './language-selector';
import { PatientQuickSearch } from '@/components/medical/patient-quick-search';
import { useAuthStore } from '@/store/auth-store';

export const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-30"
    >
      <GlassmorphismCard className="m-4 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo & Search */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-medical-primary to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-medical-primary to-purple-600 bg-clip-text text-transparent">
                  VITAL 3.0
                </h1>
                <p className="text-xs text-gray-500">{t('app.subtitle')}</p>
              </div>
            </motion.div>

            {/* Quick Search */}
            <div className="hidden lg:block">
              <PatientQuickSearch />
            </div>
          </div>

          {/* Right Side - Actions & User */}
          <div className="flex items-center gap-4">
            {/* Search Icon for Mobile */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </motion.button>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="font-medium text-sm">
                  Dr. {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {t(`specialties.${user?.specialty}.name`)}
                </p>
              </div>
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.header>
  );
};
```

### 📧 Componente de Búsqueda Rápida de Pacientes

```tsx
// client/src/components/medical/patient-quick-search.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon,
  UserPlusIcon,
  ClockIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { usePatientSearch } from '@/hooks/use-patient-search';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export const PatientQuickSearch: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  
  const { 
    patients, 
    recentPatients, 
    isLoading, 
    searchPatients 
  } = usePatientSearch();

  React.useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchPatients(debouncedQuery);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, searchPatients]);

  return (
    <div className="relative w-96">
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={t('medical.patient.search_placeholder')}
          className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-primary/50 focus:border-medical-primary/50 transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-medical-primary border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <GlassmorphismCard className="max-h-96 overflow-y-auto" blur="lg">
                {/* Search Results */}
                {query.length >= 2 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      {t('medical.patient.search_results')}
                    </h3>
                    
                    {patients.length > 0 ? (
                      <div className="space-y-2">
                        {patients.map((patient) => (
                          <motion.div
                            key={patient.id}
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => {
                              // Navigate to patient
                              setIsOpen(false);
                              setQuery('');
                            }}
                          >
                            <div className="w-8 h-8 bg-medical-primary/20 rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-medical-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {patient.documentNumber} • {patient.age} años
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <UserIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('medical.patient.no_results')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="border-t border-white/10 p-4">
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                      onClick={() => {
                        // Navigate to new patient
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <UserPlusIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">{t('medical.patient.new_patient')}</p>
                        <p className="text-xs text-gray-500">{t('medical.patient.create_new')}</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                      onClick={() => {
                        // Create anonymous patient
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <UserIcon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{t('medical.patient.anonymous')}</p>
                        <p className="text-xs text-gray-500">{t('medical.patient.quick_exam')}</p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Recent Patients */}
                {query.length < 2 && recentPatients.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {t('medical.patient.recent_patients')}
                    </h3>
                    
                    <div className="space-y-2">
                      {recentPatients.slice(0, 5).map((patient) => (
                        <motion.div
                          key={patient.id}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                          onClick={() => {
                            // Navigate to patient
                            setIsOpen(false);
                          }}
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {patient.lastVisit && new Date(patient.lastVisit).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassmorphismCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
```

## 🎯 PASO 4: HOOKS PERSONALIZADOS

### 🔄 Hook de Autoguardado

```typescript
// client/src/hooks/use-auto-save.ts
import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

interface AutoSaveOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAutoSave = <T>(
  data: T,
  saveFunction: (data: T) => Promise<any>,
  options: AutoSaveOptions = {}
) => {
  const { t } = useTranslation();
  const {
    interval = 3000,
    enabled = true,
    onSuccess,
    onError
  } = options;

  const lastSavedData = useRef<T>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveTime = useRef<Date>();

  // Mutation para guardar
  const saveMutation = useMutation({
    mutationFn: saveFunction,
    onSuccess: () => {
      lastSavedData.current = structuredClone(data);
      lastSaveTime.current = new Date();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: t('status.error'),
        description: t('auto_save.error'),
        variant: 'destructive',
      });
      onError?.(error);
    },
  });

  // Función para verificar si los datos han cambiado
  const hasDataChanged = useCallback(() => {
    return JSON.stringify(data) !== JSON.stringify(lastSavedData.current);
  }, [data]);

  // Función para guardar
  const save = useCallback(() => {
    if (hasDataChanged() && enabled) {
      saveMutation.mutate(data);
    }
  }, [data, hasDataChanged, enabled, saveMutation]);

  // Efecto para autoguardado
  useEffect(() => {
    if (!enabled) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programar nuevo autoguardado
    timeoutRef.current = setTimeout(() => {
      save();
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, enabled, save]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    save,
    isSaving: saveMutation.isPending,
    lastSaveTime: lastSaveTime.current,
    hasUnsavedChanges: hasDataChanged(),
    error: saveMutation.error,
  };
};

// Hook específico para exámenes médicos
export const useExaminationAutoSave = (examinationId: string, data: any) => {
  const { t } = useTranslation();

  return useAutoSave(
    data,
    async (examData) => {
      return apiClient.patch(`/examinations/${examinationId}/auto-save`, examData);
    },
    {
      interval: 3000,
      enabled: !!examinationId && !!data,
      onSuccess: () => {
        // Mostrar indicador sutil de guardado
        toast({
          title: t('status.saved'),
          description: t('auto_save.success'),
          variant: 'default',
          duration: 2000,
        });
      }
    }
  );
};
```

### 📱 Hook de Responsive Design

```typescript
// client/src/hooks/use-responsive.ts
import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}) => {
  const bp = { ...defaultBreakpoints, ...breakpoints };
  
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < bp.tablet;
  const isTablet = screenSize.width >= bp.tablet && screenSize.width < bp.desktop;
  const isDesktop = screenSize.width >= bp.desktop && screenSize.width < bp.wide;
  const isWide = screenSize.width >= bp.wide;

  const isMobileOrTablet = isMobile || isTablet;
  const isDesktopOrWide = isDesktop || isWide;

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isMobileOrTablet,
    isDesktopOrWide,
    breakpoints: bp,
  };
};

// Hook especializado para aplicaciones médicas
export const useMedicalViewport = () => {
  const responsive = useResponsive();
  
  // Los tablets médicos suelen ser de 10-13 pulgadas
  const isMedicalTablet = responsive.screenSize.width >= 768 && 
                         responsive.screenSize.width <= 1366;
  
  // Determinar layout óptimo para uso médico
  const layoutMode = responsive.isMobile ? 'mobile' :
                    isMedicalTablet ? 'tablet' :
                    'desktop';

  const shouldUseSidebar = !responsive.isMobile;
  const shouldUseCompactHeader = responsive.isMobile;
  const optimalColumnCount = responsive.isMobile ? 1 :
                           responsive.isTablet ? 2 :
                           3;

  return {
    ...responsive,
    isMedicalTablet,
    layoutMode,
    shouldUseSidebar,
    shouldUseCompactHeader,
    optimalColumnCount,
  };
};
```

---

¡Excelente! He completado el **Documento 2: Frontend y Glassmorphism UI** con todos los componentes visuales modernos. Este documento incluye:

✅ **Sistema de internacionalización** completo con 4 idiomas  
✅ **Componentes glassmorphism** estilo Apple Health Records  
✅ **Layout responsive** optimizado para tablets médicos  
✅ **Selector de idiomas** interactivo con animaciones  
✅ **Búsqueda rápida de pacientes** con autocompletado  
✅ **Sistema de colores dinámicos** por especialidades  
✅ **Hooks personalizados** para autoguardado y responsive  

<function_calls>
<invoke name="manage_todo_list">
<parameter name="operation">write