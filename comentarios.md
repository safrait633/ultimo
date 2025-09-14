# 🏥 VITAL 3.0 - Mapa de- ✅ **Multiidioma** - Español y Catalán primero, otros idiomas después Proyecto

## 📋 Resumen del Proyecto
**Objetivo**: Plataforma médica para creación rápida de exámenes médicos  
**Tiempo de desarrollo**: Reducción de 15-20 minutos a 5-10 minutos  
**Diseño**: Glassmorphism estilo Apple Health Records  
**Arquitectura**: SPA con autoguardado y multiidioma (Español + Catalán)

## ✅ Listo para Implementar
- **Sincronización entre dispositivos** - función obligatoria para médicos
- **Glassmorphism + temática médica** - combinación única de diseño  
- **Enfoque en velocidad** - de 15-20 minutos a 5-10 minutos por examen
- **Todos los detalles técnicos definidos** - se puede comenzar a crear la aplicación

> 🎯 **Estado**: ¡Mapa del proyecto listo, podemos proceder a crear la aplicación!

---

## 🎯 Prioridades Actuales de Desarrollo

### 🚀 Etapa 1: MVP (Producto Mínimo Viable)
- ✅ **Glassmorphism UI** - Diseño moderno estilo Apple Health
- ✅ **Formularios rápidos** - Reducción del tiempo de creación de examen
- ✅ **Autoguardado** - Nunca perder datos
- ✅ **Multiidioma** - 4 idiomas para uso internacional
- ✅ **Sincronización de dispositivos** - Trabajo en tablet y computadora

### 🔮 Posibilidades Futuras (en un año+)
- 🤖 **IA-diagnóstico** - Sugerencias inteligentes por síntomas  
- 🔗 **APIs médicas** - ICD-10, bases de medicamentos
- 📊 **Analítica** - Estadísticas e informesultiidioma  

## ✅ Listo para Implementar
- **Sincronización entre dispositivos** - función obligatoria para médicos
- **Glassmorphism + temática médica** - combinación única de diseño  
- **Enfoque en velocidad** - de 15-20 minutos a 5-10 minutos por examen
- **Todos los detalles técnicos definidos** - se puede comenzar a crear la aplicación

> 🎯 **Estado**: ¡Mapa del proyecto listo, podemos proceder a crear la aplicación!

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    VITAL 3.0 PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 18 + TypeScript + Vite)                   │
│  ├── Glassmorphism UI Components                           │
│  ├── Soporte Multi-idioma (ES/CA - Fase 1)                │
│  ├── Sistema de Autoguardado (intervalos de 3 seg)        │
│  ├── Plantillas Específicas por Especialidad              │
│  └── Optimización Móvil/Tablet                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Node.js + Express + TypeScript)                  │
│  ├── REST API con validación                               │
│  ├── Autenticación y Autorización                         │
│  ├── Asistente de Diagnóstico IA                          │
│  ├── Motor de Plantillas                                  │
│  └── Gestión de Autoguardado                              │
├─────────────────────────────────────────────────────────────┤
│  Database (MySQL 8.0+)                                     │
│  ├── Esquemas optimizados con índices                      │
│  ├── Procedimientos almacenados para rendimiento          │
│  ├── Capacidades de búsqueda de texto completo            │
│  └── Trabajos de limpieza automatizados                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Directorios

```
VITAL/
├── 📚 docs/                           # Documentación del proyecto
│   ├── api/                          # Documentación API
│   ├── database/                     # Esquemas BD
│   └── deployment/                   # Instrucciones de despliegue
│
├── 🗄️ database/                       # Base de datos MySQL
│   ├── schemas/                      # Esquemas SQL
│   ├── migrations/                   # Migraciones BD
│   ├── seeds/                        # Datos iniciales
│   └── procedures/                   # Procedimientos almacenados
│
├── 🎯 server/                         # Backend Node.js
│   ├── src/
│   │   ├── controllers/              # Controladores API
│   │   ├── models/                   # Modelos de datos
│   │   ├── routes/                   # Rutas API
│   │   ├── middleware/               # Middleware
│   │   ├── services/                 # Lógica de negocio
│   │   │   ├── ai/                   # Servicios IA
│   │   │   ├── templates/            # Sistema de plantillas
│   │   │   └── autosave/             # Autoguardado
│   │   ├── utils/                    # Utilidades
│   │   └── config/                   # Configuración
│   ├── tests/                        # Pruebas backend
│   ├── package.json
│   └── tsconfig.json
│
├── 🎨 client/                         # Frontend React
│   ├── public/
│   │   ├── locales/                  # Archivos de traducción
│   │   │   ├── es/                   # Español (Fase 1)
│   │   │   ├── ca/                   # Catalán (Fase 1)
│   │   │   ├── en/                   # Inglés (Fase 2)
│   │   │   ├── fr/                   # Francés (Fase 2)
│   │   │   └── pt/                   # Portugués (Fase 2)
│   │   └── assets/                   # Recursos estáticos
│   │
│   ├── src/
│   │   ├── 🧩 components/            # React компоненты
│   │   │   ├── ui/                   # UI компоненты
│   │   │   │   ├── glassmorphism/    # Glassmorphism компоненты
│   │   │   │   ├── forms/            # Формы
│   │   │   │   └── navigation/       # Навигация
│   │   │   ├── layout/               # Компоненты макета
│   │   │   ├── medical/              # Медицинские компоненты
│   │   │   │   ├── templates/        # Шаблоны осмотров
│   │   │   │   ├── specialties/      # Специализированные компоненты
│   │   │   │   ├── diagnosis/        # Компоненты диагностики
│   │   │   │   └── vitals/           # Витальные показатели
│   │   │   └── features/             # Функциональные компоненты
│   │   │
│   │   ├── 🎣 hooks/                 # Custom hooks
│   │   │   ├── useAutoSave.ts        # Автосохранение
│   │   │   ├── useSpecialtyForm.ts   # Формы специальностей
│   │   │   ├── usePatientSearch.ts   # Поиск пациентов
│   │   │   └── useResponsive.ts      # Responsive дизайн
│   │   │
│   │   ├── 📦 lib/                   # Библиотеки и утилиты
│   │   │   ├── api/                  # API клиент
│   │   │   ├── store/                # Состояние (Zustand)
│   │   │   ├── i18n/                 # Интернационализация
│   │   │   ├── validation/           # Валидация (Zod)
│   │   │   └── utils/                # Утилиты
│   │   │
│   │   ├── 📄 pages/                 # Страницы приложения
│   │   │   ├── auth/                 # Аутентификация
│   │   │   ├── dashboard/            # Панель управления
│   │   │   ├── examination/          # Осмотры
│   │   │   ├── patients/             # Пациенты
│   │   │   └── settings/             # Настройки
│   │   │
│   │   ├── 🎨 styles/                # Стили
│   │   │   ├── globals.css           # Глобальные стили
│   │   │   ├── glassmorphism.css     # Glassmorphism эффекты
│   │   │   └── medical-theme.css     # Медицинская тема
│   │   │
│   │   └── 🧪 types/                 # TypeScript типы
│   │       ├── api.ts                # API типы
│   │       ├── medical.ts            # Медицинские типы
│   │       └── ui.ts                 # UI типы
│   │
│   ├── tests/                        # Тесты frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── 🚀 deployment/                     # Развертывание
│   ├── docker/                       # Docker конфигурации
│   ├── nginx/                        # Nginx конфигурации
│   └── scripts/                      # Скрипты развертывания
│
└── 📋 README.md                       # Основная документация
```

---

## 🎯 Funciones Clave

### 🏥 Funciones Médicas
- ✅ **Sistema de plantillas** - Plantillas rápidas por especialidades
- ✅ **Asistente IA de diagnóstico** - Sugerencias por síntomas
- ✅ **Signos vitales** - Componente universal
- ✅ **Integración ICD-10** - Base de códigos de enfermedades
- ✅ **Búsqueda de síntomas** - Selector inteligente
- ✅ **Generador de informes** - Reportes médicos automáticos

### 🎨 Funciones UI/UX
- ✅ **Diseño Glassmorphism** - Efectos visuales modernos
- ✅ **Multiidioma** - 2 idiomas iniciales (ES/CA), después EN/FR/PT
- ✅ **Autoguardado** - Cada 3 segundos
- ✅ **Diseño Responsive** - Optimización para tablets
- ✅ **Tema oscuro/claro** - Cambio de temas
- ✅ **Navegación rápida** - SPA sin recargas

### ⚙️ Funciones Técnicas
- ✅ **Optimización MySQL** - Índices y procedimientos
- ✅ **REST API** - Validación y seguridad
- ✅ **Actualizaciones en tiempo real** - WebSocket para autoguardado
- ✅ **Almacenamiento en caché** - React Query para optimización
- ✅ **Validación de formularios** - Zod + React Hook Form
- ✅ **Pruebas** - Jest + Testing Library

---

## 📊 Especialidades

### 🫀 Cardiología
- Campos específicos: ECG, ecocardiografía
- Banderas rojas: dolor en el pecho, disnea
- Plantillas: infarto, arritmia, hipertensión

### 🧠 Neurología  
- Campos específicos: estado neurológico
- Banderas rojas: dolor de cabeza agudo, debilidad
- Plantillas: accidente cerebrovascular, migraña, epilepsia

### 🦴 Ortopedia
- Campos específicos: rango de movimiento
- Banderas rojas: fracturas, infecciones
- Plantillas: traumatismos, artritis, lesiones deportivas

### 👶 Pediatría
- Campos específicos: desarrollo, vacunación
- Banderas rojas: fiebre, deshidratación
- Plantillas: chequeos, infecciones, crecimiento

### 🤰 Obstetricia-Ginecología
- Campos específicos: ciclo menstrual, embarazo
- Banderas rojas: sangrado, preeclampsia
- Plantillas: embarazo, anticoncepción, tamizaje

---

## 🚀 Fases de Desarrollo

### 📅 Fase 1: Base (2-3 semanas)
- [ ] Configuración del proyecto y estructura
- [ ] Base de datos MySQL con tablas básicas
- [ ] REST API básico
- [ ] Aplicación React con enrutamiento
- [ ] Sistema de autenticación
- [ ] Componentes UI básicos

### 📅 Fase 2: Funciones Core (3-4 semanas)  
- [ ] Sistema UI Glassmorphism
- [ ] Multiidioma con react-i18next (ES + CA)
- [ ] Sistema de autoguardado
- [ ] Formularios médicos básicos
- [ ] Gestión de pacientes
- [ ] Plantillas de exámenes

### 📅 Fase 3: Funciones Médicas (4-5 semanas)
- [ ] Componentes especializados
- [ ] Asistente IA de diagnóstico  
- [ ] Sistema de signos vitales
- [ ] Integración ICD-10
- [ ] Generador de informes
- [ ] Búsqueda y filtrado

### 📅 Fase 4: Expansión de Idiomas (2-3 semanas)
- [ ] Traducción a Inglés (EN)
- [ ] Traducción a Francés (FR)  
- [ ] Traducción a Portugués (PT)
- [ ] Validación de traducciones médicas
- [ ] Pruebas multiidioma completas

### 📅 Fase 5: Optimización Final (2-3 semanas)
- [ ] Optimización móvil
- [ ] Pruebas y depuración
- [ ] Rendimiento y caché
- [ ] Documentación
- [ ] Despliegue y CI/CD

---

## 🔧 Stack Técnico

### Frontend
```json
{
  "framework": "React 18 + TypeScript",
  "build": "Vite",
  "styling": "Tailwind CSS + Framer Motion",
  "ui": "Radix UI + shadcn/ui",
  "state": "Zustand + React Query",
  "forms": "React Hook Form + Zod",
  "i18n": "react-i18next",
  "icons": "Lucide React + Heroicons"
}
```

### Backend  
```json
{
  "runtime": "Node.js + TypeScript", 
  "framework": "Express.js",
  "database": "MySQL 8.0+",
  "orm": "Prisma или TypeORM",
  "auth": "JWT + bcrypt",
  "validation": "Zod",
  "api": "REST + WebSocket"
}
```

### DevOps
```json
{
  "containerization": "Docker + Docker Compose",
  "ci_cd": "GitHub Actions",
  "deployment": "nginx + PM2",
  "monitoring": "Winston + Morgan",
  "testing": "Jest + Supertest"
}
```

---

## 🎯 Métricas Clave de Éxito

- ⏱️ **Tiempo de creación de examen**: < 10 minutos (meta: 5-7 minutos)
- 🚀 **Velocidad de carga**: < 2 segundos primera visita
- 📱 **Rendimiento móvil**: > 90 puntos Lighthouse  
- 🌍 **Soporte de idiomas**: Español y Catalán (MVP), después EN/FR/PT
- 💾 **Confiabilidad del autoguardado**: 99.9% guardados exitosos
- 🎨 **Compatibilidad de navegadores**: Chrome, Firefox, Safari, Edge

---

## 🎯 Текущие приоритеты разработки

### 🚀 Этап 1: MVP (Минимально жизнеспособный продукт)
- ✅ **Glassmorphism UI** - Современный дизайн в стиле Apple Health
- ✅ **Быстрые формы** - Сокращение времени создания осмотра
- ✅ **Автосохранение** - Никогда не потерять данные
- ✅ **Мультиязычность** - 4 языка для международного использования
- ✅ **Синхронизация устройств** - Работа на планшете и компьютере

# VITAL 2.0 - Guía de Estilo y Diseño Inspirado en Apple Health Records

## 🎨 Filosofía de Diseño

### Principios Fundamentales
- **Claridad Médica**: Información crítica debe ser inmediatamente visible
- **Confianza Profesional**: Diseño que inspire credibilidad y seguridad
- **Accesibilidad Universal**: Cumplir con estándares WCAG 2.1 AA
- **Simplicidad Elegante**: Interfaces intuitivas sin sacrificar funcionalidad
- **Consistencia Visual**: Experiencia cohesiva en toda la plataforma

## 🌈 Paleta de Colores Principal

### Colores Primarios de Apple Health
```css
/* Azul Médico Principal - Inspirado en Apple Health */
--vital-blue-50: #f0f9ff;    /* Fondo de tarjetas médicas */
--vital-blue-100: #e0f2fe;   /* Hover states suaves */
--vital-blue-200: #bae6fd;   /* Bordes de sección */
--vital-blue-300: #7dd3fc;   /* Elementos secundarios */
--vital-blue-400: #38bdf8;   /* Botones secundarios */
--vital-blue-500: #0ea5e9;   /* Color primario principal */
--vital-blue-600: #0284c7;   /* Botones primarios hover */
--vital-blue-700: #0369a1;   /* Texto de encabezados */
--vital-blue-800: #075985;   /* Navegación activa */
--vital-blue-900: #0c4a6e;   /* Texto principal oscuro */

/* Verdes de Salud - Estados Positivos */
--vital-green-50: #f0fdf4;   /* Fondo de alertas positivas */
--vital-green-100: #dcfce7;  /* Badges de estado saludable */
--vital-green-500: #22c55e;  /* Indicadores de éxito */
--vital-green-600: #16a34a;  /* Botones de confirmación */
--vital-green-700: #15803d;  /* Texto de confirmación */

/* Rojos de Alerta - Estados Críticos */
--vital-red-50: #fef2f2;     /* Fondo de alertas críticas */
--vital-red-100: #fee2e2;    /* Badges de urgencia */
--vital-red-500: #ef4444;    /* Indicadores de alerta */
--vital-red-600: #dc2626;    /* Botones de emergencia */
--vital-red-700: #b91c1c;    /* Texto de advertencia */

/* Ambers de Precaución */
--vital-amber-50: #fffbeb;   /* Fondo de advertencias */
--vital-amber-100: #fef3c7;  /* Badges de precaución */
--vital-amber-500: #f59e0b;  /* Indicadores de advertencia */
--vital-amber-600: #d97706;  /* Estados de atención */

/* Grises Neutrales - Sistema */
--vital-gray-50: #f9fafb;    /* Fondo de página */
--vital-gray-100: #f3f4f6;   /* Fondo de tarjetas */
--vital-gray-200: #e5e7eb;   /* Bordes suaves */
--vital-gray-300: #d1d5db;   /* Bordes definidos */
--vital-gray-400: #9ca3af;   /* Texto placeholder */
--vital-gray-500: #6b7280;   /* Texto secundario */
--vital-gray-600: #4b5563;   /* Texto principal */
--vital-gray-700: #374151;   /* Encabezados */
--vital-gray-800: #1f2937;   /* Texto fuerte */
--vital-gray-900: #111827;   /* Texto máximo contraste */
```

## 🏥 Colores Especializados por Área Médica

### Cardiología
```css
--cardio-primary: #dc2626;   /* Rojo corazón */
--cardio-secondary: #fecaca; /* Rosa suave */
--cardio-accent: #991b1b;    /* Rojo profundo */
```

### Neurología
```css
--neuro-primary: #7c3aed;    /* Púrpura neuronal */
--neuro-secondary: #ddd6fe;  /* Lavanda */
--neuro-accent: #5b21b6;     /* Púrpura profundo */
```

### Endocrinología
```css
--endo-primary: #059669;     /* Verde hormonal */
--endo-secondary: #d1fae5;   /* Verde menta */
--endo-accent: #047857;      /* Verde bosque */
```

### Pediatría
```css
--pedi-primary: #f59e0b;     /* Naranja cálido */
--pedi-secondary: #fef3c7;   /* Amarillo suave */
--pedi-accent: #d97706;      /* Naranja vivo */
```

## 📱 Componentes de Interfaz Estilo Apple Health

### 1. Tarjetas de Registro Médico
```css
.health-record-card {
  background: linear-gradient(135deg, var(--vital-blue-50) 0%, var(--vital-gray-50) 100%);
  border: 1px solid var(--vital-gray-200);
  border-radius: 16px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.health-record-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.05);
  border-color: var(--vital-blue-300);
}
```

### 2. Indicadores de Estado Médico
```css
.health-indicator {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.health-indicator--normal {
  background: var(--vital-green-100);
  color: var(--vital-green-700);
  border: 1px solid var(--vital-green-200);
}

.health-indicator--attention {
  background: var(--vital-amber-100);
  color: var(--vital-amber-700);
  border: 1px solid var(--vital-amber-200);
}

.health-indicator--critical {
  background: var(--vital-red-100);
  color: var(--vital-red-700);
  border: 1px solid var(--vital-red-200);
}
```

### 3. Navegación de Pestañas Médicas
```css
.medical-tabs {
  display: flex;
  background: var(--vital-gray-100);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.medical-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  border-radius: 8px;
  font-weight: 500;
  color: var(--vital-gray-600);
  transition: all 0.2s ease;
  cursor: pointer;
}

.medical-tab--active {
  background: white;
  color: var(--vital-blue-700);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## 🔤 Tipografía Médica

### Jerarquía de Fuentes
```css
/* Fuente Principal - San Francisco Pro (Apple System) */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
  font-feature-settings: "kern" 1, "liga" 1, "ss01" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Encabezados Principales */
.medical-heading-1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--vital-gray-900);
}

.medical-heading-2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.3px;
  color: var(--vital-gray-800);
}

.medical-heading-3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vital-gray-700);
}

/* Texto de Contenido Médico */
.medical-body-large {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vital-gray-700);
}

.medical-body-regular {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--vital-gray-600);
}

.medical-caption {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--vital-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

## 🎯 Implementación de Componentes React

### Componente de Tarjeta de Paciente
```typescript
interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    condition: 'normal' | 'attention' | 'critical';
    lastVisit: Date;
    specialty: string;
  };
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'normal': return 'var(--vital-green-500)';
      case 'attention': return 'var(--vital-amber-500)';
      case 'critical': return 'var(--vital-red-500)';
      default: return 'var(--vital-gray-400)';
    }
  };

  return (
    <div className="health-record-card group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="medical-heading-3 mb-1">{patient.name}</h3>
          <p className="medical-caption text-gray-500">
            {patient.age} años • {patient.specialty}
          </p>
        </div>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getConditionColor(patient.condition) }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className="medical-body-regular">
          Última visita: {format(patient.lastVisit, 'dd/MM/yyyy')}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
};
```

### Componente de Métricas de Salud
```typescript
interface HealthMetricProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'normal' | 'attention' | 'critical';
  icon: React.ComponentType<any>;
}

export const HealthMetric: React.FC<HealthMetricProps> = ({
  title,
  value,
  unit,
  trend,
  severity,
  icon: Icon
}) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: 'text-green-500'
        };
      case 'attention':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: 'text-amber-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-500'
        };
    }
  };

  const styles = getSeverityStyles(severity);
  
  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${styles.icon}`} />
        <TrendIndicator trend={trend} />
      </div>
      
      <h4 className="medical-caption mb-2">{title}</h4>
      
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold ${styles.text}`}>
          {value}
        </span>
        {unit && (
          <span className="ml-1 text-sm text-gray-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
```

## 📊 Visualizaciones de Datos Médicos

### Gráficos de Tendencias
```css
.health-chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--vital-gray-200);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vital-gray-800);
  margin-bottom: 16px;
}

.chart-subtitle {
  font-size: 14px;
  color: var(--vital-gray-500);
  margin-bottom: 20px;
}
```

### Paleta para Gráficos
```javascript
export const CHART_COLORS = {
  primary: '#0ea5e9',      // Azul principal
  secondary: '#22c55e',    // Verde salud
  accent: '#f59e0b',       // Ámbar precaución
  danger: '#ef4444',       // Rojo crítico
  info: '#8b5cf6',         // Púrpura información
  neutral: '#6b7280'       // Gris neutral
};

export const GRADIENT_COLORS = {
  blue: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
  green: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  amber: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  red: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
};
```

## 🎨 Animaciones y Transiciones

### Micro-interacciones Médicas
```css
/* Animación de entrada para datos críticos */
@keyframes pulse-critical {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.critical-alert {
  animation: pulse-critical 2s infinite;
}

/* Transición suave para cambios de estado */
.health-status-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effect para tarjetas interactivas */
.interactive-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
```

## 🔧 Implementación Técnica

### Setup de Tailwind CSS para Apple Health Style
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        vital: {
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
          }
        }
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'apple': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
      }
    }
  }
}
```

### Componente Base de Formulario Médico
```typescript
import { motion } from 'framer-motion';

interface MedicalFormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  severity?: 'normal' | 'attention' | 'critical';
}

export const MedicalFormSection: React.FC<MedicalFormSectionProps> = ({
  title,
  subtitle,
  children,
  severity = 'normal'
}) => {
  const getSectionStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50/50';
      case 'attention':
        return 'border-amber-200 bg-amber-50/50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-2xl border p-6 shadow-apple ${getSectionStyles(severity)}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};
```

## 🌐 Responsive Design para Dispositivos Médicos

### Breakpoints Específicos
```css
/* Tablet médica horizontal */
@media (min-width: 768px) and (max-width: 1024px) {
  .medical-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Móvil médico - Una sola columna para máxima legibilidad */
@media (max-width: 767px) {
  .medical-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .health-record-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .medical-heading-1 {
    font-size: 24px;
  }
}
```

## 🎯 Accesibilidad Médica

### Contraste y Legibilidad
```css
/* Asegurar contraste mínimo AA (4.5:1) */
.medical-text-primary {
  color: var(--vital-gray-900); /* Contraste 15.3:1 */
}

.medical-text-secondary {
  color: var(--vital-gray-700); /* Contraste 7.9:1 */
}

/* Focus states para navegación por teclado */
.medical-interactive:focus {
  outline: 2px solid var(--vital-blue-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

/* Estados de hover aumentados para precisión táctil */
.medical-button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}
```

## 📱 Implementación de Dark Mode Médico

### Variables CSS para Temas
```css
:root {
  --medical-bg-primary: #ffffff;
  --medical-bg-secondary: #f9fafb;
  --medical-text-primary: #111827;
  --medical-text-secondary: #6b7280;
  --medical-border: #e5e7eb;
}

[data-theme="dark"] {
  --medical-bg-primary: #1f2937;
  --medical-bg-secondary: #111827;
  --medical-text-primary: #f9fafb;
  --medical-text-secondary: #d1d5db;
  --medical-border: #374151;
}

.medical-card {
  background-color: var(--medical-bg-primary);
  color: var(--medical-text-primary);
  border: 1px solid var(--medical-border);
}
```

## 🔄 Estados de Carga y Feedback

### Skeletons Médicos
```css
.medical-skeleton {
  background: linear-gradient(
    90deg,
    var(--vital-gray-200) 25%,
    var(--vital-gray-100) 50%,
    var(--vital-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.patient-card-skeleton {
  height: 120px;
  margin-bottom: 16px;
}
```

## 🎨 Iconografía Médica

### Sistema de Iconos Consistente
```typescript
// Iconos médicos estandarizados
export const MedicalIcons = {
  // Estados de salud
  heart: HeartIcon,
  brain: CpuChipIcon,
  lungs: CloudIcon,
  
  // Acciones médicas
  stethoscope: MicrophoneIcon,
  prescription: DocumentTextIcon,
  lab: BeakerIcon,
  
  // Severidad
  normal: CheckCircleIcon,
  attention: ExclamationTriangleIcon,
  critical: XCircleIcon,
  
  // Especialidades
  cardiology: HeartIcon,
  neurology: CpuChipIcon,
  pediatrics: UserIcon,
  endocrinology: ScaleIcon
};

// Tamaños estandarizados
export const IconSizes = {
  xs: 'w-3 h-3',    // 12px
  sm: 'w-4 h-4',    // 16px
  md: 'w-5 h-5',    // 20px
  lg: 'w-6 h-6',    // 24px
  xl: 'w-8 h-8'     // 32px
};
```

## 🚀 Optimización de Rendimiento

### Lazy Loading para Imágenes Médicas
```typescript
const OptimizedMedicalImage: React.FC<{
  src: string;
  alt: string;
  priority?: boolean;
}> = ({ src, alt, priority = false }) => {
  return (
    <Image
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className="rounded-lg object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};
```

---
# VITAL 2.0 - Guía de Estilo y Diseño Inspirado en Apple Health Records

## 🎨 Filosofía de Diseño

### Principios Fundamentales
- **Claridad Médica**: Información crítica debe ser inmediatamente visible
- **Confianza Profesional**: Diseño que inspire credibilidad y seguridad
- **Accesibilidad Universal**: Cumplir con estándares WCAG 2.1 AA
- **Simplicidad Elegante**: Interfaces intuitivas sin sacrificar funcionalidad
- **Consistencia Visual**: Experiencia cohesiva en toda la plataforma

## 🌈 Paleta de Colores Principal

### Colores Primarios de Apple Health
```css
/* Azul Médico Principal - Inspirado en Apple Health */
--vital-blue-50: #f0f9ff;    /* Fondo de tarjetas médicas */
--vital-blue-100: #e0f2fe;   /* Hover states suaves */
--vital-blue-200: #bae6fd;   /* Bordes de sección */
--vital-blue-300: #7dd3fc;   /* Elementos secundarios */
--vital-blue-400: #38bdf8;   /* Botones secundarios */
--vital-blue-500: #0ea5e9;   /* Color primario principal */
--vital-blue-600: #0284c7;   /* Botones primarios hover */
--vital-blue-700: #0369a1;   /* Texto de encabezados */
--vital-blue-800: #075985;   /* Navegación activa */
--vital-blue-900: #0c4a6e;   /* Texto principal oscuro */

/* Verdes de Salud - Estados Positivos */
--vital-green-50: #f0fdf4;   /* Fondo de alertas positivas */
--vital-green-100: #dcfce7;  /* Badges de estado saludable */
--vital-green-500: #22c55e;  /* Indicadores de éxito */
--vital-green-600: #16a34a;  /* Botones de confirmación */
--vital-green-700: #15803d;  /* Texto de confirmación */

/* Rojos de Alerta - Estados Críticos */
--vital-red-50: #fef2f2;     /* Fondo de alertas críticas */
--vital-red-100: #fee2e2;    /* Badges de urgencia */
--vital-red-500: #ef4444;    /* Indicadores de alerta */
--vital-red-600: #dc2626;    /* Botones de emergencia */
--vital-red-700: #b91c1c;    /* Texto de advertencia */

/* Ambers de Precaución */
--vital-amber-50: #fffbeb;   /* Fondo de advertencias */
--vital-amber-100: #fef3c7;  /* Badges de precaución */
--vital-amber-500: #f59e0b;  /* Indicadores de advertencia */
--vital-amber-600: #d97706;  /* Estados de atención */

/* Grises Neutrales - Sistema */
--vital-gray-50: #f9fafb;    /* Fondo de página */
--vital-gray-100: #f3f4f6;   /* Fondo de tarjetas */
--vital-gray-200: #e5e7eb;   /* Bordes suaves */
--vital-gray-300: #d1d5db;   /* Bordes definidos */
--vital-gray-400: #9ca3af;   /* Texto placeholder */
--vital-gray-500: #6b7280;   /* Texto secundario */
--vital-gray-600: #4b5563;   /* Texto principal */
--vital-gray-700: #374151;   /* Encabezados */
--vital-gray-800: #1f2937;   /* Texto fuerte */
--vital-gray-900: #111827;   /* Texto máximo contraste */
```

## 🏥 Colores Especializados por Área Médica

### Cardiología
```css
--cardio-primary: #dc2626;   /* Rojo corazón */
--cardio-secondary: #fecaca; /* Rosa suave */
--cardio-accent: #991b1b;    /* Rojo profundo */
```

### Neurología
```css
--neuro-primary: #7c3aed;    /* Púrpura neuronal */
--neuro-secondary: #ddd6fe;  /* Lavanda */
--neuro-accent: #5b21b6;     /* Púrpura profundo */
```

### Endocrinología
```css
--endo-primary: #059669;     /* Verde hormonal */
--endo-secondary: #d1fae5;   /* Verde menta */
--endo-accent: #047857;      /* Verde bosque */
```

### Pediatría
```css
--pedi-primary: #f59e0b;     /* Naranja cálido */
--pedi-secondary: #fef3c7;   /* Amarillo suave */
--pedi-accent: #d97706;      /* Naranja vivo */
```

## 📱 Componentes de Interfaz Estilo Apple Health

### 1. Tarjetas de Registro Médico
```css
.health-record-card {
  background: linear-gradient(135deg, var(--vital-blue-50) 0%, var(--vital-gray-50) 100%);
  border: 1px solid var(--vital-gray-200);
  border-radius: 16px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.health-record-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.05);
  border-color: var(--vital-blue-300);
}
```

### 2. Indicadores de Estado Médico
```css
.health-indicator {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.health-indicator--normal {
  background: var(--vital-green-100);
  color: var(--vital-green-700);
  border: 1px solid var(--vital-green-200);
}

.health-indicator--attention {
  background: var(--vital-amber-100);
  color: var(--vital-amber-700);
  border: 1px solid var(--vital-amber-200);
}

.health-indicator--critical {
  background: var(--vital-red-100);
  color: var(--vital-red-700);
  border: 1px solid var(--vital-red-200);
}
```

### 3. Navegación de Pestañas Médicas
```css
.medical-tabs {
  display: flex;
  background: var(--vital-gray-100);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.medical-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  border-radius: 8px;
  font-weight: 500;
  color: var(--vital-gray-600);
  transition: all 0.2s ease;
  cursor: pointer;
}

.medical-tab--active {
  background: white;
  color: var(--vital-blue-700);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## 🔤 Tipografía Médica

### Jerarquía de Fuentes
```css
/* Fuente Principal - San Francisco Pro (Apple System) */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
  font-feature-settings: "kern" 1, "liga" 1, "ss01" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Encabezados Principales */
.medical-heading-1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--vital-gray-900);
}

.medical-heading-2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.3px;
  color: var(--vital-gray-800);
}

.medical-heading-3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vital-gray-700);
}

/* Texto de Contenido Médico */
.medical-body-large {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--vital-gray-700);
}

.medical-body-regular {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--vital-gray-600);
}

.medical-caption {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--vital-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

## 🎯 Implementación de Componentes React

### Componente de Tarjeta de Paciente
```typescript
interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    condition: 'normal' | 'attention' | 'critical';
    lastVisit: Date;
    specialty: string;
  };
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'normal': return 'var(--vital-green-500)';
      case 'attention': return 'var(--vital-amber-500)';
      case 'critical': return 'var(--vital-red-500)';
      default: return 'var(--vital-gray-400)';
    }
  };

  return (
    <div className="health-record-card group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="medical-heading-3 mb-1">{patient.name}</h3>
          <p className="medical-caption text-gray-500">
            {patient.age} años • {patient.specialty}
          </p>
        </div>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getConditionColor(patient.condition) }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className="medical-body-regular">
          Última visita: {format(patient.lastVisit, 'dd/MM/yyyy')}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
};
```

### Componente de Métricas de Salud
```typescript
interface HealthMetricProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'normal' | 'attention' | 'critical';
  icon: React.ComponentType<any>;
}

export const HealthMetric: React.FC<HealthMetricProps> = ({
  title,
  value,
  unit,
  trend,
  severity,
  icon: Icon
}) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: 'text-green-500'
        };
      case 'attention':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: 'text-amber-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-500'
        };
    }
  };

  const styles = getSeverityStyles(severity);
  
  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-6 h-6 ${styles.icon}`} />
        <TrendIndicator trend={trend} />
      </div>
      
      <h4 className="medical-caption mb-2">{title}</h4>
      
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold ${styles.text}`}>
          {value}
        </span>
        {unit && (
          <span className="ml-1 text-sm text-gray-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
```

## 📊 Visualizaciones de Datos Médicos

### Gráficos de Tendencias
```css
.health-chart-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--vital-gray-200);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vital-gray-800);
  margin-bottom: 16px;
}

.chart-subtitle {
  font-size: 14px;
  color: var(--vital-gray-500);
  margin-bottom: 20px;
}
```

### Paleta para Gráficos
```javascript
export const CHART_COLORS = {
  primary: '#0ea5e9',      // Azul principal
  secondary: '#22c55e',    // Verde salud
  accent: '#f59e0b',       // Ámbar precaución
  danger: '#ef4444',       // Rojo crítico
  info: '#8b5cf6',         // Púrpura información
  neutral: '#6b7280'       // Gris neutral
};

export const GRADIENT_COLORS = {
  blue: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
  green: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  amber: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  red: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
};
```

## 🎨 Animaciones y Transiciones

### Micro-interacciones Médicas
```css
/* Animación de entrada para datos críticos */
@keyframes pulse-critical {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.critical-alert {
  animation: pulse-critical 2s infinite;
}

/* Transición suave para cambios de estado */
.health-status-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effect para tarjetas interactivas */
.interactive-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
```

## 🔧 Implementación Técnica

### Setup de Tailwind CSS para Apple Health Style
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        vital: {
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
          }
        }
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'apple': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
      }
    }
  }
}
```

### Componente Base de Formulario Médico
```typescript
import { motion } from 'framer-motion';

interface MedicalFormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  severity?: 'normal' | 'attention' | 'critical';
}

export const MedicalFormSection: React.FC<MedicalFormSectionProps> = ({
  title,
  subtitle,
  children,
  severity = 'normal'
}) => {
  const getSectionStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50/50';
      case 'attention':
        return 'border-amber-200 bg-amber-50/50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-2xl border p-6 shadow-apple ${getSectionStyles(severity)}`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};
```

## 🌐 Responsive Design para Dispositivos Médicos

### Breakpoints Específicos
```css
/* Tablet médica horizontal */
@media (min-width: 768px) and (max-width: 1024px) {
  .medical-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Móvil médico - Una sola columna para máxima legibilidad */
@media (max-width: 767px) {
  .medical-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .health-record-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .medical-heading-1 {
    font-size: 24px;
  }
}
```

## 🎯 Accesibilidad Médica

### Contraste y Legibilidad
```css
/* Asegurar contraste mínimo AA (4.5:1) */
.medical-text-primary {
  color: var(--vital-gray-900); /* Contraste 15.3:1 */
}

.medical-text-secondary {
  color: var(--vital-gray-700); /* Contraste 7.9:1 */
}

/* Focus states para navegación por teclado */
.medical-interactive:focus {
  outline: 2px solid var(--vital-blue-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

/* Estados de hover aumentados para precisión táctil */
.medical-button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}
```

## 📱 Implementación de Dark Mode Médico

### Variables CSS para Temas
```css
:root {
  --medical-bg-primary: #ffffff;
  --medical-bg-secondary: #f9fafb;
  --medical-text-primary: #111827;
  --medical-text-secondary: #6b7280;
  --medical-border: #e5e7eb;
}

[data-theme="dark"] {
  --medical-bg-primary: #1f2937;
  --medical-bg-secondary: #111827;
  --medical-text-primary: #f9fafb;
  --medical-text-secondary: #d1d5db;
  --medical-border: #374151;
}

.medical-card {
  background-color: var(--medical-bg-primary);
  color: var(--medical-text-primary);
  border: 1px solid var(--medical-border);
}
```

## 🔄 Estados de Carga y Feedback

### Skeletons Médicos
```css
.medical-skeleton {
  background: linear-gradient(
    90deg,
    var(--vital-gray-200) 25%,
    var(--vital-gray-100) 50%,
    var(--vital-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.patient-card-skeleton {
  height: 120px;
  margin-bottom: 16px;
}
```

## 🎨 Iconografía Médica

### Sistema de Iconos Consistente
```typescript
// Iconos médicos estandarizados
export const MedicalIcons = {
  // Estados de salud
  heart: HeartIcon,
  brain: CpuChipIcon,
  lungs: CloudIcon,
  
  // Acciones médicas
  stethoscope: MicrophoneIcon,
  prescription: DocumentTextIcon,
  lab: BeakerIcon,
  
  // Severidad
  normal: CheckCircleIcon,
  attention: ExclamationTriangleIcon,
  critical: XCircleIcon,
  
  // Especialidades
  cardiology: HeartIcon,
  neurology: CpuChipIcon,
  pediatrics: UserIcon,
  endocrinology: ScaleIcon
};

// Tamaños estandarizados
export const IconSizes = {
  xs: 'w-3 h-3',    // 12px
  sm: 'w-4 h-4',    // 16px
  md: 'w-5 h-5',    // 20px
  lg: 'w-6 h-6',    // 24px
  xl: 'w-8 h-8'     // 32px
};
```

## 🚀 Optimización de Rendimiento

### Lazy Loading para Imágenes Médicas
```typescript
const OptimizedMedicalImage: React.FC<{
  src: string;
  alt: string;
  priority?: boolean;
}> = ({ src, alt, priority = false }) => {
  return (
    <Image
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className="rounded-lg object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};
```

---
