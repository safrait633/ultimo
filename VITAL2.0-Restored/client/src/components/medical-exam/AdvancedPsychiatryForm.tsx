import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Brain,
  Activity,
  Calculator,
  Target,
  CheckCircle,
  AlertTriangle,
  Zap,
  Users,
  Heart,
  Eye,
  FlaskConical,
  Clock,
  Stethoscope,
  FileText,
  TrendingUp,
  Timer,
  Search,
  Bell,
  BarChart3,
  User
} from "lucide-react";

interface AdvancedPsychiatryFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface FormSection {
  id: string;
  title: string;
  icon: any;
  fields: any[];
  completed: boolean;
  critical?: boolean;
  section: number;
  order: number;
  timeEstimate: string;
}

interface AlertData {
  type: 'red' | 'yellow' | 'green';
  message: string;
  conditions: string[];
  priority: number;
  action?: string;
  protocol?: string;
}

interface CalculatorResult {
  name: string;
  value: number | string;
  interpretation: string;
  color: string;
  alert?: boolean;
  recommendation?: string;
  classification?: string;
  cutoffReached?: boolean;
}

const ADVANCED_PSYCHIATRY_SECTIONS: FormSection[] = [
  // 1. TRIAGE Y EVALUACIÓN DE URGENCIA (0-5 min)
  {
    id: "triageEmergencyEvaluation",
    title: "Triage y Evaluación de Urgencia",
    icon: Shield,
    section: 1,
    order: 1.1,
    completed: false,
    critical: true,
    timeEstimate: "0-5 min",
    fields: [
      {
        id: "immediateRiskAssessment",
        label: "🚨 Clasificación de Riesgo Inmediato",
        type: "object",
        subfields: [
          {
            id: "vitalRisk",
            label: "Riesgo vital inmediato",
            type: "boolean",
            critical: true,
            alert: "⚠️ RIESGO VITAL - Evaluación médica urgente",
            action: "Triaje médico inmediato + monitorización"
          },
          {
            id: "agitation",
            label: "Agitación/agresividad severa",
            type: "boolean",
            critical: true,
            alert: "⚠️ AGITACIÓN SEVERA - Contención/sedación",
            action: "Protocolo de contención + antipsicótico IM"
          },
          {
            id: "acuteConfusion",
            label: "Estado confusional agudo (delirium)",
            type: "boolean",
            critical: true,
            alert: "⚠️ DELIRIUM - Descarte médico urgente",
            action: "Evaluación médica integral + laboratorios"
          },
          {
            id: "activeSuicidalIdeation",
            label: "Ideación suicida activa con plan/medios",
            type: "boolean",
            critical: true,
            alert: "⚠️ RIESGO SUICIDA ALTO - Vigilancia 1:1",
            action: "Supervisión continua + psiquiatría urgente"
          },
          {
            id: "catatonia",
            label: "Estado catatónico",
            type: "boolean",
            critical: true,
            alert: "⚠️ CATATONIA - Lorazepam urgente",
            action: "Lorazepam IV + monitorización"
          }
        ]
      },
      {
        id: "emergencyProtocol",
        label: "🏥 Protocolo de Urgencias Automático",
        type: "object",
        subfields: [
          {
            id: "immediateSafety",
            label: "Medidas de seguridad inmediatas",
            type: "multiselect",
            options: [
              "Vigilancia 1:1",
              "Retirada de objetos punzantes",
              "Ambiente tranquilo",
              "Acompañamiento familiar",
              "Contención física",
              "Aislamiento protector"
            ]
          },
          {
            id: "emergencyMedication",
            label: "Medicación de urgencia indicada",
            type: "multiselect",
            options: [
              "Lorazepam 2mg IM",
              "Haloperidol 5mg IM",
              "Olanzapina 10mg IM",
              "Midazolam 5mg IV",
              "Sin medicación de urgencia"
            ]
          },
          {
            id: "urgentReferral",
            label: "Derivación inmediata requerida",
            type: "select",
            options: [
              "🔴 URGENCIA VITAL: Medicina intensiva",
              "🔴 URGENCIA PSIQUIÁTRICA: Psiquiatría inmediata", 
              "🟡 PREFERENTE: Evaluación psiquiátrica <6h",
              "🟢 RUTINARIO: Seguimiento ambulatorio"
            ]
          }
        ]
      },
      {
        id: "substanceScreening",
        label: "💊 Screening de Intoxicación/Abstinencia",
        type: "object",
        subfields: [
          {
            id: "intoxicationSigns",
            label: "Signos de intoxicación",
            type: "multiselect",
            options: [
              "Aliento alcohólico",
              "Pupilas midriáticas",
              "Pupilas mióticas",
              "Disartria",
              "Ataxia",
              "Agitación",
              "Somnolencia",
              "Ninguno"
            ]
          },
          {
            id: "withdrawalSigns",
            label: "Signos de abstinencia",
            type: "multiselect",
            options: [
              "Temblor",
              "Sudoración",
              "Náuseas/vómitos",
              "Ansiedad severa",
              "Insomnio",
              "Alucinaciones",
              "Convulsiones",
              "Ninguno"
            ]
          },
          {
            id: "substanceHistory",
            label: "Antecedente de consumo",
            type: "multiselect",
            options: [
              "Alcohol",
              "Cocaína",
              "Marihuana",
              "Benzodiacepinas",
              "Opiáceos",
              "Anfetaminas",
              "Otros",
              "Negado"
            ]
          }
        ]
      }
    ]
  },

  // 2. ANAMNESIS DIRIGIDA INTELIGENTE (15-20 min)
  {
    id: "intelligentDirectedAnamnesis",
    title: "Anamnesis Dirigida Inteligente", 
    icon: Brain,
    section: 2,
    order: 2.1,
    completed: false,
    timeEstimate: "15-20 min",
    fields: [
      {
        id: "mainSymptomsValidation",
        label: "🎯 Síntomas Principales con Validación Cruzada",
        type: "object",
        subfields: [
          {
            id: "primarySymptoms",
            label: "Síntomas principales actuales",
            type: "multiselect",
            options: [
              "Estado de ánimo deprimido",
              "Anhedonia",
              "Ansiedad generalizada",
              "Ataques de pánico",
              "Alucinaciones auditivas",
              "Alucinaciones visuales",
              "Delirios de persecución",
              "Delirios de grandeza",
              "Insomnio",
              "Agitación psicomotora",
              "Ideación suicida",
              "Problemas de memoria",
              "Desorientación"
            ]
          },
          {
            id: "symptomSeverity",
            label: "Severidad global síntomas (0-10)",
            type: "number",
            min: 0,
            max: 10
          },
          {
            id: "functionalImpairment",
            label: "Deterioro funcional",
            type: "select",
            options: [
              "Ninguno - Funcionamiento normal",
              "Leve - Dificultades mínimas",
              "Moderado - Interferencia significativa",
              "Severo - Incapacidad importante",
              "Muy severo - Incapacidad total"
            ]
          }
        ]
      },
      {
        id: "chronologyPrecipitants",
        label: "⏱️ Cronología y Factores Precipitantes",
        type: "object",
        subfields: [
          {
            id: "symptomOnset",
            label: "Inicio de síntomas actuales",
            type: "select",
            options: [
              "Agudo (<1 semana)",
              "Subagudo (1-4 semanas)", 
              "Gradual (1-6 meses)",
              "Insidioso (>6 meses)",
              "Crónico estable",
              "Exacerbación de cuadro crónico"
            ]
          },
          {
            id: "precipitatingFactors",
            label: "Factores precipitantes identificados",
            type: "multiselect",
            options: [
              "Evento traumático",
              "Pérdida/duelo",
              "Estrés laboral/académico",
              "Problemas económicos",
              "Conflictos familiares",
              "Enfermedad médica",
              "Cambio de medicación",
              "Consumo de sustancias",
              "Cambios hormonales",
              "Ninguno identificado"
            ]
          },
          {
            id: "episodeType",
            label: "Tipo de episodio",
            type: "select",
            options: [
              "Primer episodio",
              "Recurrencia de cuadro conocido", 
              "Exacerbación aguda",
              "Evolución crónica",
              "No determinado"
            ]
          }
        ]
      },
      {
        id: "stratifiedPsychiatricHistory",
        label: "🧬 Antecedentes Psiquiátricos Estratificados",
        type: "object",
        subfields: [
          {
            id: "previousDiagnoses",
            label: "Diagnósticos psiquiátricos previos",
            type: "multiselect",
            options: [
              "Trastorno depresivo mayor",
              "Trastorno bipolar",
              "Esquizofrenia",
              "Trastorno esquizoafectivo",
              "Trastornos de ansiedad",
              "Trastorno límite personalidad",
              "Trastorno por déficit atención",
              "Trastornos por uso sustancias",
              "Trastorno obsesivo-compulsivo",
              "Trastorno estrés postraumático",
              "Trastornos alimentarios",
              "Ninguno"
            ]
          },
          {
            id: "previousHospitalizations",
            label: "Hospitalizaciones psiquiátricas",
            type: "select",
            options: [
              "Ninguna",
              "1 hospitalización",
              "2-3 hospitalizaciones",
              "4-5 hospitalizaciones",
              ">5 hospitalizaciones"
            ]
          },
          {
            id: "suicideAttempts",
            label: "Intentos de suicidio previos",
            type: "select",
            options: [
              "Ninguno",
              "1 intento",
              "2-3 intentos",
              ">3 intentos"
            ]
          },
          {
            id: "familyHistory",
            label: "Antecedentes familiares psiquiátricos",
            type: "multiselect",
            options: [
              "Depresión",
              "Trastorno bipolar",
              "Esquizofrenia",
              "Trastornos de ansiedad",
              "Suicidio",
              "Alcoholismo",
              "Demencia",
              "Ninguno conocido"
            ]
          }
        ]
      },
      {
        id: "currentMedicationAdherence",
        label: "💊 Medicación Actual y Adherencia",
        type: "object",
        subfields: [
          {
            id: "currentPsychiatricMeds",
            label: "Medicación psiquiátrica actual",
            type: "multiselect",
            options: [
              "Antidepresivos ISRS",
              "Antidepresivos tricíclicos",
              "Antidepresivos atípicos",
              "Estabilizadores ánimo",
              "Antipsicóticos típicos",
              "Antipsicóticos atípicos",
              "Benzodiacepinas",
              "Anticonvulsivantes",
              "Ninguna"
            ]
          },
          {
            id: "medicationAdherence",
            label: "Adherencia al tratamiento",
            type: "select",
            options: [
              "Excelente (>95%)",
              "Buena (80-95%)",
              "Regular (50-79%)", 
              "Mala (<50%)",
              "No toma medicación"
            ]
          },
          {
            id: "sideEffects",
            label: "Efectos secundarios reportados",
            type: "multiselect",
            options: [
              "Sedación",
              "Aumento de peso",
              "Disfunción sexual",
              "Sequedad bucal",
              "Temblor",
              "Rigidez",
              "Movimientos anormales",
              "Ninguno"
            ]
          }
        ]
      }
    ]
  },

  // 3. EXAMEN MENTAL SISTEMÁTICO (20-30 min)
  {
    id: "systematicMentalExam",
    title: "Examen Mental Sistemático",
    icon: Activity,
    section: 3,
    order: 3.1,
    completed: false,
    timeEstimate: "20-30 min",
    fields: [
      {
        id: "appearanceContact",
        label: "👁️ Apariencia y Contacto",
        type: "object",
        subfields: [
          {
            id: "generalAppearance",
            label: "Apariencia general",
            type: "select",
            options: [
              "Bien cuidado, apropiado para la edad",
              "Levemente descuidado",
              "Moderadamente descuidado", 
              "Severamente descuidado",
              "Bizarro o inapropiado"
            ]
          },
          {
            id: "eyeContact",
            label: "Contacto visual",
            type: "select",
            options: [
              "Apropiado y sostenido",
              "Escaso pero presente",
              "Evitativo sistemático",
              "Excesivo o penetrante",
              "Bizarro"
            ]
          },
          {
            id: "rapport",
            label: "Establecimiento de rapport",
            type: "select",
            options: [
              "Fácil y natural",
              "Inicialmente difícil, luego bueno",
              "Difícil durante toda la entrevista",
              "Imposible de establecer"
            ]
          },
          {
            id: "attitude",
            label: "Actitud durante la entrevista",
            type: "select",
            options: [
              "Cooperativo y colaborador",
              "Parcialmente cooperativo",
              "Reticente pero no hostil",
              "Hostil o negativista",
              "Agresivo"
            ]
          }
        ]
      },
      {
        id: "languageCommunication",
        label: "🗣️ Lenguaje y Comunicación",
        type: "object",
        subfields: [
          {
            id: "speechRate",
            label: "Velocidad del habla",
            type: "select",
            options: [
              "Normal",
              "Lenta",
              "Muy lenta/enlentecida",
              "Rápida",
              "Muy rápida/taquilálica"
            ]
          },
          {
            id: "speechVolume",
            label: "Volumen",
            type: "select",
            options: [
              "Normal",
              "Bajo/susurrado",
              "Muy bajo",
              "Alto",
              "Gritado"
            ]
          },
          {
            id: "speechFluency",
            label: "Fluidez",
            type: "select",
            options: [
              "Fluida y espontánea",
              "Levemente disminuida",
              "Moderadamente disminuida",
              "Muy pobre/monosilábica",
              "Mutismo"
            ]
          },
          {
            id: "languageContent",
            label: "Contenido del lenguaje",
            type: "multiselect",
            options: [
              "Apropiado y coherente",
              "Pobreza de contenido",
              "Verborrea",
              "Perseveración",
              "Ecolalia",
              "Neologismos",
              "Ensalada de palabras"
            ]
          }
        ]
      },
      {
        id: "thoughtCourseContentForm",
        label: "🧠 Pensamiento (Curso, Contenido, Forma)",
        type: "object",
        subfields: [
          {
            id: "thoughtCourse",
            label: "Curso del pensamiento",
            type: "multiselect",
            options: [
              "Normal y organizado",
              "Acelerado/taquipsiquia",
              "Enlentecido/bradipsiquia",
              "Fuga de ideas",
              "Bloqueo del pensamiento",
              "Circunstancialidad",
              "Tangencialidad"
            ]
          },
          {
            id: "delusions",
            label: "Delirios",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presentes",
                type: "boolean"
              },
              {
                id: "types",
                label: "Tipos de delirios",
                type: "multiselect",
                condition: "present",
                options: [
                  "Persecución",
                  "Grandeza",
                  "Referencia",
                  "Celos",
                  "Somáticos",
                  "Nihilistas",
                  "Culpa",
                  "Control/influencia",
                  "Religiosos"
                ]
              },
              {
                id: "systematization",
                label: "Sistematización",
                type: "select",
                condition: "present",
                options: ["Sistematizados", "No sistematizados", "Fragmentarios"]
              },
              {
                id: "conviction",
                label: "Grado de convicción",
                type: "select", 
                condition: "present",
                options: ["Total", "Parcial", "Dudoso"]
              }
            ]
          },
          {
            id: "obsessions",
            label: "Obsesiones",
            type: "multiselect",
            options: [
              "Ausentes",
              "Contaminación/limpieza",
              "Orden/simetría",
              "Agresión/daño",
              "Sexuales",
              "Religiosas/blasfemas",
              "Somáticas"
            ]
          }
        ]
      },
      {
        id: "perception",
        label: "👂 Percepción",
        type: "object",
        subfields: [
          {
            id: "auditoryHallucinations",
            label: "Alucinaciones auditivas",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presentes",
                type: "boolean"
              },
              {
                id: "characteristics",
                label: "Características",
                type: "multiselect",
                condition: "present",
                options: [
                  "Voces masculinas",
                  "Voces femeninas", 
                  "Una voz",
                  "Múltiples voces",
                  "Voces conocidas",
                  "Voces extrañas",
                  "Comandos/órdenes",
                  "Comentarios sobre actividad",
                  "Conversaciones",
                  "Ruidos/sonidos"
                ]
              },
              {
                id: "content",
                label: "Contenido emocional",
                type: "select",
                condition: "present",
                options: ["Neutro", "Amenazante", "Crítico", "Consolador", "Comandos peligrosos"]
              }
            ]
          },
          {
            id: "visualHallucinations",
            label: "Alucinaciones visuales",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presentes",
                type: "boolean"
              },
              {
                id: "types",
                label: "Tipos",
                type: "multiselect",
                condition: "present",
                options: [
                  "Personas/figuras",
                  "Animales",
                  "Objetos",
                  "Luces/destellos",
                  "Formas geométricas",
                  "Escenas complejas"
                ]
              }
            ]
          },
          {
            id: "otherHallucinations",
            label: "Otras alucinaciones",
            type: "multiselect",
            options: [
              "Ausentes",
              "Táctiles",
              "Olfatorias",
              "Gustativas",
              "Somáticas",
              "Cenestésicas"
            ]
          }
        ]
      },
      {
        id: "affectiveState",
        label: "💝 Estado Afectivo",
        type: "object",
        subfields: [
          {
            id: "subjectiveMood",
            label: "Estado de ánimo subjetivo",
            type: "select",
            options: [
              "Eutímico/normal",
              "Deprimido/triste",
              "Ansioso/preocupado",
              "Irritable/hostil",
              "Eufórico/elevado",
              "Lábil/cambiante"
            ]
          },
          {
            id: "objectiveAffect",
            label: "Afecto objetivo observado",
            type: "select",
            options: [
              "Eutímico",
              "Deprimido",
              "Ansioso", 
              "Irritable",
              "Eufórico",
              "Embotado",
              "Plano",
              "Lábil"
            ]
          },
          {
            id: "moodReactivity",
            label: "Reactividad afectiva",
            type: "select",
            options: [
              "Buena reactividad",
              "Reactividad disminuida",
              "No reactivo",
              "Labilidad marcada"
            ]
          },
          {
            id: "congruence",
            label: "Congruencia humor-afecto",
            type: "select",
            options: [
              "Congruente",
              "Parcialmente congruente",
              "Incongruente"
            ]
          }
        ]
      },
      {
        id: "psychomotorActivity",
        label: "⚡ Actividad Psicomotora",
        type: "object",
        subfields: [
          {
            id: "motorActivity",
            label: "Actividad motora",
            type: "select",
            options: [
              "Normal",
              "Agitación leve",
              "Agitación moderada",
              "Agitación severa",
              "Retardo leve",
              "Retardo moderado", 
              "Retardo severo",
              "Estupor",
              "Catatonia"
            ]
          },
          {
            id: "abnormalMovements",
            label: "Movimientos anormales",
            type: "multiselect",
            options: [
              "Ausentes",
              "Tics",
              "Temblor",
              "Acatisia",
              "Discinesia tardía",
              "Distonía",
              "Estereotipias",
              "Manierismos",
              "Automatismos"
            ]
          },
          {
            id: "catatomicSigns",
            label: "Signos catatónicos",
            type: "multiselect",
            options: [
              "Ausentes",
              "Estupor",
              "Catalepsia",
              "Flexibilidad cérea",
              "Negativismo",
              "Mutismo",
              "Ecolalia",
              "Ecopraxia"
            ]
          }
        ]
      },
      {
        id: "insightJudgment",
        label: "🎭 Insight y Juicio Clínico",
        type: "object",
        subfields: [
          {
            id: "insightLevel",
            label: "Nivel de insight",
            type: "select",
            options: [
              "Insight completo - Reconoce enfermedad y necesidad tratamiento",
              "Insight parcial - Reconoce algunos síntomas",
              "Insight limitado - Reconoce estar enfermo pero no específicamente",
              "Insight pobre - Reconoce necesitar ayuda sin entender por qué",
              "Sin insight - Negación completa de enfermedad"
            ]
          },
          {
            id: "judgmentCapacity",
            label: "Capacidad de juicio",
            type: "select",
            options: [
              "Juicio intacto",
              "Juicio levemente alterado",
              "Juicio moderadamente alterado",
              "Juicio severamente alterado",
              "Sin capacidad de juicio"
            ]
          },
          {
            id: "decisionMaking",
            label: "Capacidad toma de decisiones",
            type: "select",
            options: [
              "Íntegra",
              "Levemente comprometida",
              "Moderadamente comprometida", 
              "Severamente comprometida",
              "Ausente"
            ]
          }
        ]
      }
    ]
  },

  // 4. EVALUACIÓN ESPECIALIZADA ADAPTATIVA (15-25 min)
  {
    id: "adaptiveSpecializedEvaluation",
    title: "Evaluación Especializada Adaptativa",
    icon: Calculator,
    section: 4,
    order: 4.1,
    completed: false,
    timeEstimate: "15-25 min",
    fields: [
      {
        id: "completeCognitiveBattery",
        label: "🧮 Batería Cognitiva Completa",
        type: "object",
        subfields: [
          {
            id: "consciousnessLevel",
            label: "Nivel de conciencia",
            type: "select",
            options: [
              "Alerta y consciente",
              "Somnoliento",
              "Obnubilado",
              "Estupor",
              "Coma"
            ]
          },
          {
            id: "orientation",
            label: "Orientación",
            type: "object",
            subfields: [
              {
                id: "person",
                label: "Persona (nombre, edad)",
                type: "select",
                options: ["Orientado", "Parcialmente orientado", "Desorientado"]
              },
              {
                id: "place",
                label: "Lugar (hospital, ciudad)",
                type: "select",
                options: ["Orientado", "Parcialmente orientado", "Desorientado"]
              },
              {
                id: "time",
                label: "Tiempo (fecha, día semana)",
                type: "select",
                options: ["Orientado", "Parcialmente orientado", "Desorientado"]
              }
            ]
          },
          {
            id: "mmse",
            label: "MMSE (Mini-Mental State Examination)",
            type: "object",
            condition: "age>=65",
            subfields: [
              {
                id: "orientationScore",
                label: "Orientación (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "registrationScore",
                label: "Registro (0-3)",
                type: "number",
                min: 0,
                max: 3
              },
              {
                id: "attentionScore",
                label: "Atención y cálculo (0-5)",
                type: "number",
                min: 0,
                max: 5
              },
              {
                id: "recallScore",
                label: "Recuerdo (0-3)",
                type: "number",
                min: 0,
                max: 3
              },
              {
                id: "languageScore",
                label: "Lenguaje (0-9)",
                type: "number",
                min: 0,
                max: 9
              }
            ]
          },
          {
            id: "clockTest",
            label: "Test del reloj",
            type: "select",
            options: [
              "Normal (3-4 puntos)",
              "Leve alteración (2 puntos)",
              "Moderada alteración (1 punto)",
              "Severamente alterado (0 puntos)",
              "No realizable"
            ]
          },
          {
            id: "executiveFunctions",
            label: "Funciones ejecutivas",
            type: "object",
            subfields: [
              {
                id: "abstractThinking",
                label: "Pensamiento abstracto",
                type: "select",
                options: ["Normal", "Levemente concreto", "Muy concreto", "No evaluable"]
              },
              {
                id: "planification",
                label: "Capacidad de planificación",
                type: "select",
                options: ["Adecuada", "Levemente alterada", "Moderadamente alterada", "Severamente alterada"]
              },
              {
                id: "inhibition",
                label: "Control inhibitorio",
                type: "select",
                options: ["Adecuado", "Levemente alterado", "Moderadamente alterado", "Severamente alterado"]
              }
            ]
          }
        ]
      },
      {
        id: "dynamicSpecificScales",
        label: "📊 Escalas Específicas Dinámicas",
        type: "object",
        subfields: [
          {
            id: "hamiltonDepression",
            label: "Hamilton-D (Depresión)",
            type: "object",
            condition: "depressiveSymptoms",
            autoCalculate: true,
            subfields: [
              {
                id: "depressedMood",
                label: "Estado ánimo deprimido (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Expresado al preguntar", "2-Expresado espontáneamente", "3-Comunicado no verbalmente", "4-Extremo"]
              },
              {
                id: "guilt",
                label: "Sentimientos de culpa (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Se autorreprueba", "2-Ideas de culpa", "3-Enfermedad actual castigo", "4-Alucinaciones de culpa"]
              },
              {
                id: "suicide",
                label: "Suicidio (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Le parece no vale pena vivir", "2-Desearía estar muerto", "3-Ideas/gestos suicidas", "4-Intentos suicidio"]
              },
              {
                id: "insomniaEarly",
                label: "Insomnio inicial (0-2)",
                type: "select",
                options: ["0-Sin dificultad", "1-Dificultad ocasional", "2-Dificultad constante"]
              },
              {
                id: "insomniMiddle",
                label: "Insomnio medio (0-2)",
                type: "select",
                options: ["0-Sin dificultad", "1-Queja de inquietud nocturna", "2-Despierta durante la noche"]
              },
              {
                id: "insomniaLate",
                label: "Insomnio tardío (0-2)",
                type: "select",
                options: ["0-Sin dificultad", "1-Despierta madrugada pero vuelve dormir", "2-Incapaz volver a dormir"]
              },
              {
                id: "work",
                label: "Trabajo y actividades (0-4)",
                type: "select",
                options: ["0-Sin dificultad", "1-Ideas/sentimientos incapacidad", "2-Pérdida interés", "3-Disminución tiempo/productividad", "4-Dejó trabajar"]
              }
            ]
          },
          {
            id: "panss",
            label: "PANSS (Positive and Negative Syndrome Scale)",
            type: "object",
            condition: "psychoticSymptoms",
            autoCalculate: true,
            subfields: [
              {
                id: "positiveScale",
                label: "Escala Positiva",
                type: "object",
                subfields: [
                  {
                    id: "delusions",
                    label: "P1-Delirios (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "conceptualDisorganization",
                    label: "P2-Desorganización conceptual (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "hallucinatoryBehavior",
                    label: "P3-Comportamiento alucinatorio (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "excitement",
                    label: "P4-Excitación (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "grandiosity",
                    label: "P5-Grandiosidad (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "suspiciousness",
                    label: "P6-Suspicacia/persecución (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "hostility",
                    label: "P7-Hostilidad (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  }
                ]
              },
              {
                id: "negativeScale",
                label: "Escala Negativa",
                type: "object",
                subfields: [
                  {
                    id: "bluntedAffect",
                    label: "N1-Afecto embotado (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "emotionalWithdrawal",
                    label: "N2-Retraimiento emocional (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "poorRapport",
                    label: "N3-Pobre rapport (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "socialWithdrawal",
                    label: "N4-Retraimiento social pasivo (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "abstractThinking",
                    label: "N5-Dificultad pensamiento abstracto (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "spontaneity",
                    label: "N6-Falta espontaneidad (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  },
                  {
                    id: "stereotypedThinking",
                    label: "N7-Pensamiento estereotipado (1-7)",
                    type: "select",
                    options: ["1-Ausente", "2-Mínimo", "3-Leve", "4-Moderado", "5-Mod-severo", "6-Severo", "7-Extremo"]
                  }
                ]
              }
            ]
          },
          {
            id: "ymrs",
            label: "YMRS (Young Mania Rating Scale)",
            type: "object",
            condition: "manicSymptoms",
            autoCalculate: true,
            subfields: [
              {
                id: "elevatedMood",
                label: "Estado ánimo elevado (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Leve elevación", "2-Claro optimismo", "3-Euforia marcada", "4-Euforia extrema"]
              },
              {
                id: "motorActivity",
                label: "Actividad motora/energía (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Subjetivamente aumentada", "2-Animado/gesticulante", "3-Energía excesiva", "4-Excitación motora"]
              },
              {
                id: "sexualInterest",
                label: "Interés sexual (0-4)",
                type: "select",
                options: ["0-Normal", "1-Levemente aumentado", "2-Moderadamente aumentado", "3-Claramente aumentado", "4-Completamente desinhibido"]
              },
              {
                id: "sleep",
                label: "Sueño (0-4)",
                type: "select",
                options: ["0-No disminuido", "1-<1h menos", "2-<2h menos", "3-<3h menos", "4-Sin necesidad sueño"]
              },
              {
                id: "irritability",
                label: "Irritabilidad (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Subjetiva", "2-Episodios irritables", "3-Irritable durante entrevista", "4-Hostil"]
              },
              {
                id: "speech",
                label: "Habla/velocidad/cantidad (0-4)",
                type: "select",
                options: ["0-Sin aumento", "1-Sensación subjetiva", "2-Animado/verborreico", "3-Difícil interrumpir", "4-Continuo/ininterrumpible"]
              },
              {
                id: "thoughtDisorder",
                label: "Lenguaje-trastorno pensamiento (0-4)",
                type: "select",
                options: ["0-Ausente", "1-Circunstancial", "2-Distraible/ideas fuga", "3-Ocasional irrelevancia", "4-Incoherente/comunicación imposible"]
              },
              {
                id: "content",
                label: "Contenido (0-4)",
                type: "select",
                options: ["0-Normal", "1-Planes cuestionables", "2-Proyectos especiales", "3-Ideas grandiosas", "4-Delirios grandeza"]
              },
              {
                id: "appearance",
                label: "Apariencia (0-4)",
                type: "select",
                options: ["0-Apropiada", "1-Levemente descuidada", "2-Mal arreglado", "3-Desaliñado/inapropiado", "4-Completamente descuidado"]
              },
              {
                id: "insight",
                label: "Insight (0-4)",
                type: "select",
                options: ["0-Presente/admite enfermedad", "1-Posible enfermedad", "2-Admite cambio conducta", "3-Admite posible medicación", "4-Niega enfermedad"]
              }
            ]
          },
          {
            id: "cageAudit",
            label: "CAGE/AUDIT (Sustancias)",
            type: "object",
            condition: "substanceUse",
            subfields: [
              {
                id: "cage",
                label: "CAGE (Alcohol)",
                type: "object",
                subfields: [
                  {
                    id: "cutDown",
                    label: "¿Ha sentido necesidad de reducir el consumo?",
                    type: "boolean"
                  },
                  {
                    id: "annoyed",
                    label: "¿Se ha molestado por críticas al consumo?",
                    type: "boolean"
                  },
                  {
                    id: "guilty",
                    label: "¿Se ha sentido culpable por el consumo?",
                    type: "boolean"
                  },
                  {
                    id: "eyeOpener",
                    label: "¿Ha necesitado beber al despertar?",
                    type: "boolean"
                  }
                ]
              },
              {
                id: "substanceFrequency",
                label: "Frecuencia consumo sustancias",
                type: "select",
                options: [
                  "Nunca",
                  "Ocasional (<1 vez/mes)",
                  "Regular (1-3 veces/mes)",
                  "Frecuente (1-3 veces/semana)",
                  "Diario"
                ]
              }
            ]
          },
          {
            id: "gafEagar",
            label: "GAF/EAGAR (Funcionamiento Global)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "gafScore",
                label: "Puntuación GAF (1-100)",
                type: "number",
                min: 1,
                max: 100
              },
              {
                id: "functionalAreas",
                label: "Áreas de funcionamiento alteradas",
                type: "multiselect",
                options: [
                  "Laboral/académico",
                  "Social/interpersonal",
                  "Familiar",
                  "Autocuidado",
                  "Actividades vida diaria",
                  "Recreativo",
                  "Ninguna"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "integralRiskAssessment",
        label: "⚖️ Evaluación de Riesgo Integral",
        type: "object",
        subfields: [
          {
            id: "suicideRiskColumbia",
            label: "Riesgo suicida (Escala Columbia)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "wishToDie",
                label: "Deseo de morir",
                type: "boolean"
              },
              {
                id: "suicidalIdeation",
                label: "Ideación suicida",
                type: "boolean"
              },
              {
                id: "suicidalPlan",
                label: "Plan suicida",
                type: "boolean"
              },
              {
                id: "suicidalIntent",
                label: "Intención suicida",
                type: "boolean"
              },
              {
                id: "preparatoryBehavior",
                label: "Comportamiento preparatorio",
                type: "boolean"
              },
              {
                id: "suicideAttempt",
                label: "Intento de suicidio",
                type: "boolean"
              }
            ]
          },
          {
            id: "violenceRiskHCR20",
            label: "Riesgo de violencia (HCR-20)",
            type: "object",
            subfields: [
              {
                id: "violenceHistory",
                label: "Historia de violencia",
                type: "boolean"
              },
              {
                id: "youngAge",
                label: "Edad joven al primer incidente",
                type: "boolean"
              },
              {
                id: "relationshipInstability",
                label: "Inestabilidad relaciones",
                type: "boolean"
              },
              {
                id: "substanceUse",
                label: "Problemas con sustancias",
                type: "boolean"
              },
              {
                id: "majorMentalIllness",
                label: "Enfermedad mental mayor",
                type: "boolean"
              },
              {
                id: "psychopathy",
                label: "Rasgos psicopáticos",
                type: "boolean"
              }
            ]
          },
          {
            id: "overallRiskLevel",
            label: "Nivel de riesgo global",
            type: "select",
            autoCalculate: true,
            options: [
              "🟢 BAJO: Seguimiento ambulatorio rutinario",
              "🟡 MODERADO: Seguimiento frecuente",
              "🔶 ALTO: Evaluación psiquiátrica urgente",
              "🔴 MUY ALTO: Hospitalización/contención",
              "🚨 INMINENTE: Intervención inmediata"
            ]
          }
        ]
      },
      {
        id: "complementaryStudies",
        label: "🔬 Indicación de Estudios Complementarios",
        type: "object",
        subfields: [
          {
            id: "neurologicalStudies",
            label: "Estudios neurológicos",
            type: "multiselect",
            options: [
              "EEG (sospecha epilepsia)",
              "TC cerebral (primer episodio >40 años)",
              "RM cerebral (deterioro cognitivo)",
              "PET/SPECT (demencia temprana)",
              "No indicado"
            ]
          },
          {
            id: "laboratoryStudies",
            label: "Estudios laboratorio",
            type: "multiselect",
            options: [
              "Hemograma completo",
              "Función hepática/renal",
              "Función tiroidea",
              "Vitamina B12/folato",
              "Screening toxicológico",
              "Serología VIH",
              "No indicado"
            ]
          },
          {
            id: "psychometricTesting",
            label: "Testeo psicométrico",
            type: "multiselect",
            options: [
              "Evaluación neuropsicológica completa",
              "Test inteligencia (WAIS)",
              "Test personalidad (MMPI)",
              "Escalas específicas adicionales",
              "No indicado"
            ]
          }
        ]
      }
    ]
  },

  // 5. SÍNTESIS DIAGNÓSTICA Y PLANIFICACIÓN (10-15 min)
  {
    id: "diagnosticSynthesisPlanning",
    title: "Síntesis Diagnóstica y Planificación",
    icon: CheckCircle,
    section: 5,
    order: 5.1,
    completed: false,
    timeEstimate: "10-15 min",
    fields: [
      {
        id: "automaticClinicalCorrelation",
        label: "🎯 Correlación Clínica Automática",
        type: "object",
        subfields: [
          {
            id: "clinicalConsistency",
            label: "Consistencia clínica detectada",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "contradictionAlerts",
            label: "Alertas de contradicción",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "missingData",
            label: "Datos faltantes críticos",
            type: "calculated",
            autoGenerate: true
          }
        ]
      },
      {
        id: "dsm5Criteria",
        label: "📋 Criterios Diagnósticos DSM-5/CIE-11",
        type: "object",
        subfields: [
          {
            id: "primaryDiagnosis",
            label: "Diagnóstico principal más probable",
            type: "select",
            autoCalculate: true,
            options: [
              "F32.9 - Episodio depresivo mayor",
              "F31.9 - Trastorno bipolar",
              "F20.9 - Esquizofrenia",
              "F25.9 - Trastorno esquizoafectivo",
              "F41.1 - Trastorno ansiedad generalizada",
              "F41.0 - Trastorno pánico",
              "F43.1 - Trastorno estrés postraumático",
              "F42.2 - Trastorno obsesivo-compulsivo",
              "F60.3 - Trastorno límite personalidad",
              "F10.20 - Trastorno por uso alcohol",
              "F03.90 - Demencia no especificada",
              "F06.30 - Trastorno del estado de ánimo debido condición médica",
              "R41.82 - Deterioro cognitivo leve",
              "Z03.89 - Sin diagnóstico psiquiátrico específico"
            ]
          },
          {
            id: "diagnosticConfidence",
            label: "Grado de certeza diagnóstica",
            type: "select",
            autoCalculate: true,
            options: [
              "Alta (>80%) - Criterios completos cumplidos",
              "Moderada (60-80%) - Mayoría criterios cumplidos",
              "Baja (40-60%) - Algunos criterios cumplidos",
              "Incierta (<40%) - Información insuficiente"
            ]
          },
          {
            id: "secondaryDiagnoses",
            label: "Diagnósticos secundarios/comorbilidades",
            type: "multiselect",
            options: [
              "Trastorno por uso sustancias comórbido",
              "Trastorno de personalidad comórbido",
              "Trastorno de ansiedad comórbido",
              "Condición médica contribuyente",
              "Trastorno del sueño comórbido",
              "Sin comorbilidades identificadas"
            ]
          },
          {
            id: "differentialDiagnoses",
            label: "Diagnósticos diferenciales a considerar",
            type: "multiselect",
            autoCalculate: true,
            options: [
              "Trastorno bipolar vs depresión unipolar",
              "Esquizofrenia vs trastorno esquizoafectivo",
              "Trastorno límite vs trastorno bipolar",
              "Demencia vs depresión en ancianos",
              "Trastorno inducido sustancias",
              "Condición médica que simula psiquiátrica",
              "Trastorno adaptativo vs episodio depresivo"
            ]
          }
        ]
      },
      {
        id: "severityStratification",
        label: "📈 Estratificación de Severidad",
        type: "object",
        subfields: [
          {
            id: "symptomSeverity",
            label: "Severidad sintomática global",
            type: "select",
            autoCalculate: true,
            options: [
              "Leve - Síntomas mínimos, funcionamiento preservado",
              "Moderada - Síntomas evidentes, algún deterioro funcional",
              "Severa - Síntomas importantes, deterioro funcional significativo",
              "Muy severa - Síntomas incapacitantes, funcionamiento muy alterado"
            ]
          },
          {
            id: "functionalImpairment",
            label: "Grado deterioro funcional",
            type: "select",
            options: [
              "Mínimo (GAF 70-100)",
              "Leve (GAF 60-69)",
              "Moderado (GAF 40-59)",
              "Severo (GAF 20-39)",
              "Muy severo (GAF 1-19)"
            ]
          },
          {
            id: "riskLevel",
            label: "Nivel de riesgo",
            type: "select",
            autoCalculate: true,
            options: [
              "Bajo riesgo",
              "Riesgo moderado",
              "Alto riesgo",
              "Muy alto riesgo",
              "Riesgo inmediato"
            ]
          }
        ]
      },
      {
        id: "therapeuticRecommendations",
        label: "💊 Recomendaciones Terapéuticas",
        type: "object",
        subfields: [
          {
            id: "pharmacotherapy",
            label: "Farmacoterapia indicada",
            type: "multiselect",
            autoCalculate: true,
            options: [
              "ISRS (sertralina, escitalopram)",
              "IRSN (venlafaxina, duloxetina)",
              "Estabilizadores ánimo (litio, valproato)",
              "Antipsicóticos atípicos (risperidona, olanzapina)",
              "Antipsicóticos típicos (haloperidol)",
              "Benzodiacepinas (lorazepam, clonazepam)",
              "Anticonvulsivantes (gabapentina)",
              "Sin farmacoterapia inicial"
            ]
          },
          {
            id: "psychotherapy",
            label: "Psicoterapia recomendada",
            type: "multiselect",
            options: [
              "TCC (Terapia cognitivo-conductual)",
              "TIP (Terapia interpersonal)",
              "TDF (Terapia dinámica focal)",
              "EMDR (Trauma)",
              "Terapia familiar",
              "Terapia grupal",
              "Sin psicoterapia inicial"
            ]
          },
          {
            id: "psychosocialInterventions",
            label: "Intervenciones psicosociales",
            type: "multiselect",
            options: [
              "Educación paciente/familia",
              "Rehabilitación psicosocial",
              "Terapia ocupacional",
              "Apoyo social estructurado",
              "Grupos de autoayuda",
              "Intervención crisis",
              "Case management"
            ]
          },
          {
            id: "hospitalManagement",
            label: "Manejo hospitalario",
            type: "select",
            options: [
              "Alta inmediata - Seguimiento ambulatorio",
              "Observación 24-48h - Reevaluación",
              "Hospitalización breve (3-7 días)",
              "Hospitalización prolongada (>7 días)",
              "Unidad de cuidados intensivos psiquiátricos",
              "Hospitalización involuntaria"
            ]
          }
        ]
      },
      {
        id: "followupPlan",
        label: "📅 Plan de Seguimiento",
        type: "object",
        subfields: [
          {
            id: "followupTiming",
            label: "Cronograma seguimiento",
            type: "select",
            autoCalculate: true,
            options: [
              "24-48h - Control urgente",
              "1 semana - Seguimiento estrecho", 
              "2 semanas - Seguimiento frecuente",
              "1 mes - Seguimiento rutinario",
              "3 meses - Seguimiento de mantenimiento",
              "SOS - Seguimiento según necesidad"
            ]
          },
          {
            id: "monitoringParameters",
            label: "Parámetros de monitoreo",
            type: "multiselect",
            options: [
              "Ideación suicida/riesgo",
              "Respuesta a medicación",
              "Efectos secundarios",
              "Adherencia tratamiento",
              "Funcionamiento psicosocial",
              "Escalas de síntomas",
              "Laboratorios de control",
              "Niveles séricos medicación"
            ]
          },
          {
            id: "crisisIntervention",
            label: "Plan intervención crisis",
            type: "object",
            subfields: [
              {
                id: "contactNumbers",
                label: "Números de contacto emergencia",
                type: "boolean"
              },
              {
                id: "safetyPlan",
                label: "Plan de seguridad establecido",
                type: "boolean"
              },
              {
                id: "triggerIdentification",
                label: "Identificación de triggers",
                type: "boolean"
              },
              {
                id: "copingStrategies",
                label: "Estrategias de afrontamiento",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "structuredReport",
        label: "📄 Informe Estructurado Automático",
        type: "object",
        subfields: [
          {
            id: "executiveSummary",
            label: "Resumen ejecutivo",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "clinicalFindings",
            label: "Hallazgos clínicos principales",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "riskAssessment",
            label: "Evaluación de riesgo",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "treatmentPlan",
            label: "Plan de tratamiento",
            type: "calculated",
            autoGenerate: true
          }
        ]
      }
    ]
  }
];

export default function AdvancedPsychiatryForm({ patientData, onDataChange, onComplete }: AdvancedPsychiatryFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  const [diagnosticSuspicion, setDiagnosticSuspicion] = useState<string>("");
  const [adaptiveFlow, setAdaptiveFlow] = useState<Record<string, boolean>>({});

  // Calcular progreso total
  const progress = useMemo(() => {
    return Math.round((completedSections.size / ADVANCED_PSYCHIATRY_SECTIONS.length) * 100);
  }, [completedSections.size]);

  // Motor de alertas contextual especializado
  const checkContextualAlerts = (data: Record<string, any>) => {
    const newAlerts: AlertData[] = [];

    // ⚠️ ALERTAS ROJAS (Acción inmediata)
    if (data.vitalRisk) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ RIESGO VITAL - Evaluación médica urgente',
        conditions: ['Riesgo vital inmediato'],
        priority: 1,
        action: 'Triaje médico inmediato + monitorización'
      });
    }

    if (data.agitation) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ AGITACIÓN SEVERA - Contención/sedación',
        conditions: ['Agitación/agresividad severa'],
        priority: 1,
        action: 'Protocolo de contención + antipsicótico IM'
      });
    }

    if (data.acuteConfusion) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ DELIRIUM - Descarte médico urgente',
        conditions: ['Estado confusional agudo'],
        priority: 1,
        action: 'Evaluación médica integral + laboratorios'
      });
    }

    if (data.activeSuicidalIdeation) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ RIESGO SUICIDA ALTO - Vigilancia 1:1',
        conditions: ['Ideación suicida activa con plan/medios'],
        priority: 1,
        action: 'Supervisión continua + psiquiatría urgente'
      });
    }

    if (data.catatonia) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ CATATONIA - Lorazepam urgente',
        conditions: ['Estado catatónico'],
        priority: 1,
        action: 'Lorazepam IV + monitorización'
      });
    }

    // 🟡 ALERTAS AMARILLAS (Atención prioritaria)
    if (data.suicidalPlan && data.suicidalIntent) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Riesgo suicida moderado-alto - Evaluación prioritaria',
        conditions: ['Plan suicida + intención'],
        priority: 2,
        action: 'Evaluación psiquiátrica preferente'
      });
    }

    if (data.delusions && data.hallucinatoryBehavior) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Primer episodio psicótico - Protocolo especializado',
        conditions: ['Delirios + alucinaciones'],
        priority: 2,
        action: 'Neuroimagen + descarte médico'
      });
    }

    // Detección automática de patrones
    const mmseScore = (data.orientationScore || 0) + (data.registrationScore || 0) + 
                     (data.attentionScore || 0) + (data.recallScore || 0) + (data.languageScore || 0);
    
    if (mmseScore < 24) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Deterioro cognitivo significativo - Evaluación neuropsicológica',
        conditions: [`MMSE: ${mmseScore}/30`],
        priority: 2,
        action: 'Estudios cognitivos completos'
      });
    }

    // Inconsistencias clínicas
    if (data.subjectiveMood === "Eutímico/normal" && data.symptomSeverity > 7) {
      newAlerts.push({
        type: 'yellow',
        message: '⚠️ Inconsistencia: Estado ánimo eutímico con síntomas severos',
        conditions: ['Contradicción clínica'],
        priority: 3
      });
    }

    setAlerts(newAlerts);
  };

  // Calculadoras específicas para psiquiatría
  const calculateHamiltonD = (data: Record<string, any>): number => {
    const items = [
      'depressedMood', 'guilt', 'suicide', 'insomniaEarly', 
      'insomniMiddle', 'insomniaLate', 'work'
    ];
    
    return items.reduce((total, item) => {
      const value = data[item];
      if (typeof value === 'string') {
        return total + parseInt(value.charAt(0));
      }
      return total;
    }, 0);
  };

  const calculatePANSS = (data: Record<string, any>): { positive: number, negative: number, total: number } => {
    const positiveItems = ['delusions', 'conceptualDisorganization', 'hallucinatoryBehavior', 
                          'excitement', 'grandiosity', 'suspiciousness', 'hostility'];
    const negativeItems = ['bluntedAffect', 'emotionalWithdrawal', 'poorRapport', 
                          'socialWithdrawal', 'abstractThinking', 'spontaneity', 'stereotypedThinking'];
    
    const positive = positiveItems.reduce((sum, item) => {
      const value = data[item];
      return sum + (typeof value === 'string' ? parseInt(value.charAt(0)) : 0);
    }, 0);
    
    const negative = negativeItems.reduce((sum, item) => {
      const value = data[item];
      return sum + (typeof value === 'string' ? parseInt(value.charAt(0)) : 0);
    }, 0);
    
    return { positive, negative, total: positive + negative };
  };

  const calculateYMRS = (data: Record<string, any>): number => {
    const items = [
      'elevatedMood', 'motorActivity', 'sexualInterest', 'sleep', 'irritability',
      'speech', 'thoughtDisorder', 'content', 'appearance', 'insight'
    ];
    
    return items.reduce((total, item) => {
      const value = data[item];
      if (typeof value === 'string') {
        return total + parseInt(value.charAt(0));
      }
      return total;
    }, 0);
  };

  const calculateCAGE = (data: Record<string, any>): number => {
    const cageItems = ['cutDown', 'annoyed', 'guilty', 'eyeOpener'];
    return cageItems.reduce((count, item) => count + (data[item] ? 1 : 0), 0);
  };

  const calculateColumbiaRisk = (data: Record<string, any>): number => {
    const riskItems = ['wishToDie', 'suicidalIdeation', 'suicidalPlan', 
                      'suicidalIntent', 'preparatoryBehavior', 'suicideAttempt'];
    return riskItems.reduce((count, item) => count + (data[item] ? 1 : 0), 0);
  };

  // Actualizar calculadoras en tiempo real
  const updateCalculators = (data: Record<string, any>) => {
    const results: CalculatorResult[] = [];

    // Hamilton-D (si síntomas depresivos)
    if (data.depressiveSymptoms || data.primarySymptoms?.includes("Estado de ánimo deprimido")) {
      const hamiltonScore = calculateHamiltonD(data);
      results.push({
        name: 'Hamilton-D',
        value: hamiltonScore,
        interpretation: hamiltonScore >= 23 ? 'Depresión severa' : 
                       hamiltonScore >= 14 ? 'Depresión moderada' :
                       hamiltonScore >= 8 ? 'Depresión leve' : 'Sin depresión',
        color: hamiltonScore >= 23 ? '#ef4444' : hamiltonScore >= 14 ? '#f59e0b' : 
               hamiltonScore >= 8 ? '#3b82f6' : '#10b981',
        alert: hamiltonScore >= 23,
        recommendation: hamiltonScore >= 23 ? 'Antidepresivo + psicoterapia urgente' :
                       hamiltonScore >= 14 ? 'Iniciar antidepresivo' :
                       hamiltonScore >= 8 ? 'Psicoterapia + seguimiento' : 'Seguimiento',
        cutoffReached: hamiltonScore >= 8
      });
    }

    // PANSS (si síntomas psicóticos)
    if (data.psychoticSymptoms || data.primarySymptoms?.includes("Alucinaciones auditivas")) {
      const panssScores = calculatePANSS(data);
      results.push({
        name: 'PANSS Total',
        value: panssScores.total,
        interpretation: panssScores.total >= 95 ? 'Psicosis severa' :
                       panssScores.total >= 75 ? 'Psicosis moderada' :
                       panssScores.total >= 55 ? 'Psicosis leve' : 'Síntomas mínimos',
        color: panssScores.total >= 95 ? '#ef4444' : panssScores.total >= 75 ? '#f59e0b' :
               panssScores.total >= 55 ? '#3b82f6' : '#10b981',
        alert: panssScores.total >= 95,
        recommendation: panssScores.total >= 95 ? 'Antipsicótico + hospitalización' :
                       panssScores.total >= 75 ? 'Antipsicótico oral' :
                       panssScores.total >= 55 ? 'Antipsicótico bajo dosis' : 'Observación'
      });

      results.push({
        name: 'PANSS Positiva',
        value: panssScores.positive,
        interpretation: `Síntomas positivos: ${panssScores.positive >= 20 ? 'Severos' : panssScores.positive >= 15 ? 'Moderados' : 'Leves'}`,
        color: panssScores.positive >= 20 ? '#ef4444' : panssScores.positive >= 15 ? '#f59e0b' : '#3b82f6'
      });
    }

    // YMRS (si síntomas maniacos)
    if (data.manicSymptoms || data.primarySymptoms?.includes("Eufórico/elevado")) {
      const ymrsScore = calculateYMRS(data);
      results.push({
        name: 'YMRS',
        value: ymrsScore,
        interpretation: ymrsScore >= 20 ? 'Manía severa' :
                       ymrsScore >= 12 ? 'Manía moderada' :
                       ymrsScore >= 6 ? 'Hipomanía' : 'Eutímico',
        color: ymrsScore >= 20 ? '#ef4444' : ymrsScore >= 12 ? '#f59e0b' :
               ymrsScore >= 6 ? '#3b82f6' : '#10b981',
        alert: ymrsScore >= 20,
        recommendation: ymrsScore >= 20 ? 'Hospitalización + estabilizador ánimo' :
                       ymrsScore >= 12 ? 'Estabilizador ánimo' :
                       ymrsScore >= 6 ? 'Seguimiento estrecho' : 'Seguimiento rutinario',
        cutoffReached: ymrsScore >= 6
      });
    }

    // CAGE (si uso de sustancias)
    if (data.substanceUse || data.substanceHistory?.length > 1) {
      const cageScore = calculateCAGE(data);
      results.push({
        name: 'CAGE',
        value: cageScore,
        interpretation: cageScore >= 2 ? 'Probable trastorno por uso alcohol' : 'Sin problemas alcohol',
        color: cageScore >= 2 ? '#ef4444' : '#10b981',
        alert: cageScore >= 2,
        recommendation: cageScore >= 2 ? 'Evaluación adicción + tratamiento' : 'Sin intervención necesaria'
      });
    }

    // Riesgo suicida Columbia
    const columbiaRisk = calculateColumbiaRisk(data);
    if (columbiaRisk > 0) {
      results.push({
        name: 'Riesgo Suicida Columbia',
        value: columbiaRisk,
        interpretation: columbiaRisk >= 4 ? 'Riesgo muy alto' :
                       columbiaRisk >= 3 ? 'Riesgo alto' :
                       columbiaRisk >= 2 ? 'Riesgo moderado' : 'Riesgo bajo',
        color: columbiaRisk >= 4 ? '#ef4444' : columbiaRisk >= 3 ? '#f59e0b' :
               columbiaRisk >= 2 ? '#3b82f6' : '#10b981',
        alert: columbiaRisk >= 3,
        recommendation: columbiaRisk >= 4 ? 'Vigilancia 1:1 + hospitalización' :
                       columbiaRisk >= 3 ? 'Seguimiento diario' :
                       columbiaRisk >= 2 ? 'Seguimiento frecuente' : 'Seguimiento rutinario',
        classification: columbiaRisk >= 4 ? 'MUY ALTO' : columbiaRisk >= 3 ? 'ALTO' : 
                       columbiaRisk >= 2 ? 'MODERADO' : 'BAJO'
      });
    }

    // GAF Score
    if (data.gafScore) {
      results.push({
        name: 'GAF',
        value: data.gafScore,
        interpretation: data.gafScore >= 81 ? 'Funcionamiento superior' :
                       data.gafScore >= 71 ? 'Funcionamiento normal' :
                       data.gafScore >= 61 ? 'Síntomas leves' :
                       data.gafScore >= 51 ? 'Síntomas moderados' :
                       data.gafScore >= 41 ? 'Síntomas serios' :
                       data.gafScore >= 31 ? 'Deterioro importante' : 'Deterioro severo',
        color: data.gafScore >= 61 ? '#10b981' : data.gafScore >= 41 ? '#f59e0b' : '#ef4444',
        alert: data.gafScore < 41
      });
    }

    setCalculatorResults(results);
  };

  // Flujos adaptativos automáticos
  const updateAdaptiveFlow = (data: Record<string, any>) => {
    const newFlow: Record<string, boolean> = {};

    // Activar evaluación completa de riesgo si hay ideación suicida
    if (data.activeSuicidalIdeation || data.suicidalIdeation) {
      newFlow.suicideRiskComplete = true;
      newFlow.protectiveMeasures = true;
    }

    // Si hay alucinaciones auditivas, explorar contenido
    if (data.auditoryHallucinations) {
      newFlow.exploreVoiceContent = true;
      newFlow.assessPsychoticInsight = true;
    }

    // Primer episodio psicótico
    if (data.episodeType === "Primer episodio" && (data.delusions || data.hallucinatoryBehavior)) {
      newFlow.firstEpisodePsychosis = true;
      newFlow.medicalWorkup = true;
      newFlow.familyEvaluation = true;
    }

    // Deterioro cognitivo en >65 años
    if (data.age >= 65 && data.cognitiveSymptoms) {
      newFlow.dementiaEvaluation = true;
      newFlow.neurologicalStudies = true;
    }

    setAdaptiveFlow(newFlow);
  };

  // Algoritmo diagnóstico automático
  const determineAutomaticSuspicion = (data: Record<string, any>): string => {
    // Depresión mayor
    if (data.primarySymptoms?.includes("Estado de ánimo deprimido") && 
        data.primarySymptoms?.includes("Anhedonia") &&
        data.functionalImpairment !== "Ninguno - Funcionamiento normal") {
      return "Depression";
    }

    // Episodio maníaco
    if (data.subjectiveMood === "Eufórico/elevado" && 
        data.symptomSeverity >= 7) {
      return "Mania";
    }

    // Esquizofrenia/Psicosis
    if (data.primarySymptoms?.includes("Alucinaciones auditivas") && 
        data.primarySymptoms?.includes("Delirios de persecución")) {
      return "Psychosis";
    }

    // Trastorno por uso de sustancias
    if (data.substanceHistory?.length > 2 && 
        data.intoxicationSigns?.length > 1) {
      return "Substance";
    }

    return "";
  };

  // Manejar cambios en datos
  const handleDataChange = (sectionId: string, fieldId: string, value: any) => {
    const newFormData = {
      ...formData,
      [`${sectionId}_${fieldId}`]: value
    };
    
    setFormData(newFormData);
    
    // Determinar sospecha diagnóstica automáticamente
    const suspicion = determineAutomaticSuspicion(newFormData);
    setDiagnosticSuspicion(suspicion);
    
    // Verificar alertas, calculadoras y flujos adaptativos
    checkContextualAlerts(newFormData);
    updateCalculators(newFormData);
    updateAdaptiveFlow(newFormData);
    
    if (onDataChange) {
      onDataChange(newFormData);
    }
  };

  // Marcar sección como completada
  const markSectionCompleted = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  // Renderizar campo según tipo
  const renderField = (section: FormSection, field: any) => {
    const fieldId = `${section.id}_${field.id}`;
    const value = formData[fieldId];

    // Mostrar campos condicionales
    if (field.condition && !shouldShowConditionalField(field.condition, formData)) {
      return null;
    }

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={fieldId}
              checked={value || false}
              onCheckedChange={(checked) => handleDataChange(section.id, field.id, checked)}
            />
            <Label htmlFor={fieldId}>{field.label}</Label>
            {field.critical && value && (
              <Badge variant="destructive" className="text-xs">
                CRÍTICO
              </Badge>
            )}
            {field.alert && value && (
              <Badge variant="outline" className="text-xs text-red-600">
                {field.alert}
              </Badge>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              type="number"
              min={field.min}
              max={field.max}
              value={value || ''}
              onChange={(e) => handleDataChange(section.id, field.id, parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        );

      case 'select':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Select value={value || ''} onValueChange={(val) => handleDataChange(section.id, field.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.autoCalculate && (
              <Badge variant="outline" className="mt-1 text-xs">
                Cálculo automático
              </Badge>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div>
            <Label>{field.label}</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {field.options?.map((option: string) => {
                const optionValue = value ? value.includes(option) : false;
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={optionValue}
                      onCheckedChange={(checked) => {
                        const currentValues = value || [];
                        const newValues = checked 
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        handleDataChange(section.id, field.id, newValues);
                      }}
                    />
                    <Label className="text-sm">{option}</Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Textarea
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleDataChange(section.id, field.id, e.target.value)}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        );

      case 'object':
        return (
          <div>
            <Label className="text-base font-semibold">{field.label}</Label>
            <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
              {field.subfields?.map((subfield: any) => (
                <div key={subfield.id}>
                  {renderField(section, { ...subfield, id: `${field.id}_${subfield.id}` })}
                </div>
              ))}
            </div>
          </div>
        );

      case 'calculated':
        return (
          <div>
            <Label className="text-base font-semibold">{field.label}</Label>
            <div className="mt-3 space-y-3">
              {field.autoGenerate && (
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <p className="text-sm text-blue-800">
                    Los análisis y validaciones se generan automáticamente basados en los datos ingresados.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor={fieldId}>{field.label}</Label>
            <Input
              id={fieldId}
              value={value || ''}
              onChange={(e) => handleDataChange(section.id, field.id, e.target.value)}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        );
    }
  };

  // Función helper para campos condicionales
  const shouldShowConditionalField = (condition: string, data: Record<string, any>): boolean => {
    // Implementar lógica de condiciones específicas
    if (condition === "present") {
      return data[condition.replace("_present", "")] === true;
    }
    
    if (condition === "age>=65") {
      return data.age >= 65;
    }

    if (condition === "depressiveSymptoms") {
      return data.primarySymptoms?.includes("Estado de ánimo deprimido") || 
             data.primarySymptoms?.includes("Anhedonia");
    }

    if (condition === "psychoticSymptoms") {
      return data.primarySymptoms?.includes("Alucinaciones auditivas") ||
             data.primarySymptoms?.includes("Delirios de persecución");
    }

    if (condition === "manicSymptoms") {
      return data.subjectiveMood === "Eufórico/elevado" ||
             data.primarySymptoms?.includes("Agitación psicomotora");
    }

    if (condition === "substanceUse") {
      return data.substanceHistory?.length > 1 ||
             data.intoxicationSigns?.length > 0;
    }

    return true;
  };

  const currentSectionData = ADVANCED_PSYCHIATRY_SECTIONS[currentSection];
  const isLastSection = currentSection === ADVANCED_PSYCHIATRY_SECTIONS.length - 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado con progreso y alertas */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              Sistema de Evaluación Psiquiátrica Optimizado
            </h1>
            {patientData && (
              <div className="flex items-center gap-2 mt-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {patientData.name}
                  {patientData.age && `, ${patientData.age} años`}
                  {patientData.gender && `, ${patientData.gender}`}
                </span>
              </div>
            )}
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Evaluación sistemática en 5 fases con IA diagnóstica y protocolos de seguridad
            </p>
            {diagnosticSuspicion && (
              <div className="mt-2">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  Sospecha: {diagnosticSuspicion === "Depression" ? "Trastorno Depresivo Mayor" : 
                           diagnosticSuspicion === "Mania" ? "Episodio Maníaco" :
                           diagnosticSuspicion === "Psychosis" ? "Trastorno Psicótico" :
                           diagnosticSuspicion === "Substance" ? "Trastorno por Uso de Sustancias" : diagnosticSuspicion}
                </Badge>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {progress}%
            </div>
            <div className="text-sm text-gray-600">Completado</div>
            <div className="text-xs text-gray-500 mt-1">
              ⏱️ {currentSectionData.timeEstimate}
            </div>
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />

        {/* Alertas críticas */}
        {alerts.filter(alert => alert.type === 'red').map((alert, index) => (
          <Alert key={index} className="mb-2 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {alert.message}
              {alert.action && (
                <div className="mt-1 text-sm font-bold">
                  PROTOCOLO: {alert.action}
                </div>
              )}
            </AlertDescription>
          </Alert>
        ))}

        {/* Alertas de precaución */}
        {alerts.filter(alert => alert.type === 'yellow').map((alert, index) => (
          <Alert key={index} className="mb-2 border-yellow-200 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {alert.message}
              {alert.action && (
                <div className="mt-1 text-sm">
                  Recomendación: {alert.action}
                </div>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Navegación por secciones con tiempo estimado */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(section => {
          const sectionData = ADVANCED_PSYCHIATRY_SECTIONS.find(s => s.section === section);
          return (
            <div 
              key={section}
              className={`p-3 text-center rounded-lg border-2 transition-all cursor-pointer ${
                currentSectionData?.section === section
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setCurrentSection(section - 1)}
            >
              <div className="font-bold">FASE {section}</div>
              <div className="text-xs mt-1">
                {section === 1 && "Triage"}
                {section === 2 && "Anamnesis"}
                {section === 3 && "Examen Mental"}
                {section === 4 && "Evaluación"}
                {section === 5 && "Síntesis"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sectionData?.timeEstimate}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculadoras y escalas en tiempo real */}
      {calculatorResults.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Escalas Psiquiátricas en Tiempo Real
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calculatorResults.map((result) => (
              <div 
                key={result.name}
                className={`p-3 rounded-lg border-2 ${
                  result.alert ? 'border-red-300 bg-red-50' : 
                  result.cutoffReached ? 'border-yellow-300 bg-yellow-50' :
                  'border-green-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{result.name}</span>
                  <Badge 
                    variant={result.alert ? "destructive" : result.cutoffReached ? "secondary" : "outline"}
                    className="text-white"
                    style={{ backgroundColor: result.color }}
                  >
                    {result.value}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{result.interpretation}</p>
                {result.recommendation && (
                  <p className="text-sm font-medium text-blue-600 mt-1">{result.recommendation}</p>
                )}
                {result.classification && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {result.classification}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flujos adaptativos activos */}
      {Object.keys(adaptiveFlow).length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Protocolos Adaptativos Activados
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(adaptiveFlow).map(([key, active]) => active && (
              <Badge key={key} variant="secondary" className="bg-blue-100 text-blue-800">
                {key === 'suicideRiskComplete' && '🛡️ Protocolo Riesgo Suicida'}
                {key === 'firstEpisodePsychosis' && '🧠 Protocolo Primer Episodio'}
                {key === 'dementiaEvaluation' && '🔍 Protocolo Demencia'}
                {key === 'exploreVoiceContent' && '👂 Exploración Alucinaciones'}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sección actual */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <currentSectionData.icon className="h-6 w-6 text-indigo-600" />
              <span>
                FASE {currentSectionData.section}: {currentSectionData.title}
              </span>
              {currentSectionData.critical && (
                <Badge variant="destructive">Crítico</Badge>
              )}
              <Badge variant="outline" className="bg-indigo-50">
                {currentSectionData.timeEstimate}
              </Badge>
            </CardTitle>
            <Badge variant="outline">
              Fase {currentSection + 1} de {ADVANCED_PSYCHIATRY_SECTIONS.length}
            </Badge>
          </div>
          {patientData && (
            <div className="mt-4 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-3 shadow justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{patientData.name} {patientData.surname}</span>
                <span>Edad: {patientData.age} años</span>
                <span>Género: {patientData.gender}</span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSectionData.fields.map((field) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              {renderField(currentSectionData, field)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navegación inferior */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          ← Fase Anterior
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => markSectionCompleted(currentSectionData.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Completa
          </Button>

          {isLastSection ? (
            <Button 
              onClick={() => onComplete && onComplete(formData)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Evaluación Psiquiátrica
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentSection(Math.min(ADVANCED_PSYCHIATRY_SECTIONS.length - 1, currentSection + 1))}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Siguiente Fase →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}