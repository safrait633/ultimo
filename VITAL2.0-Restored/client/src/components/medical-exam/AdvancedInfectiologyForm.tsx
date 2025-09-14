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
  Thermometer, 
  Microscope, 
  Activity,
  Target,
  CheckCircle,
  AlertTriangle,
  Pill,
  Bug,
  Heart,
  Brain,
  Stethoscope,
  Eye,
  Users,
  Calculator,
  TrendingUp,
  Clock,
  Zap,
  User,
  HeartHandshake
} from "lucide-react";

interface AdvancedInfectiologyFormProps {
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
  phase: number;
  order: number;
}

interface AlertData {
  type: 'red' | 'yellow' | 'green';
  message: string;
  conditions: string[];
  priority: number;
}

interface CalculatorResult {
  name: string;
  value: number | string;
  interpretation: string;
  color: string;
  alert?: boolean;
}

const ADVANCED_INFECTIOLOGY_SECTIONS: FormSection[] = [
  // FASE 1: EVALUACIÓN INICIAL Y BIOSEGURIDAD (Nueva - Crítica)
  {
    id: "initialRiskAssessment",
    title: "Evaluación Inicial y Bioseguridad",
    icon: Shield,
    phase: 1,
    order: 1,
    completed: false,
    critical: true,
    fields: [
      {
        id: "transmissionRisk",
        label: "🛡️ Evaluación de Transmisibilidad",
        type: "object",
        subfields: [
          {
            id: "respiratorySymptoms",
            label: "¿Síntomas respiratorios + fiebre?",
            type: "boolean",
            alert: "Considerar aislamiento respiratorio"
          },
          {
            id: "bloodyDiarrhea",
            label: "¿Diarrea sanguinolenta?",
            type: "boolean",
            alert: "Considerar aislamiento entérico"
          },
          {
            id: "rashFever",
            label: "¿Exantema + fiebre?",
            type: "boolean",
            alert: "Considerar aislamiento de contacto"
          },
          {
            id: "suspectedMeningitis",
            label: "¿Sospecha meningitis?",
            type: "boolean",
            alert: "Considerar aislamiento por gotas"
          }
        ]
      },
      {
        id: "severityTrafficLight",
        label: "🚦 Semáforo de Gravedad Inicial",
        type: "select",
        options: [
          "🟢 VERDE: Estable para evaluación completa",
          "🟡 AMARILLO: Vigilancia estrecha", 
          "🔴 ROJO: Requiere atención inmediata"
        ],
        autoCalculate: true
      },
      {
        id: "antimicrobialResistanceFactors",
        label: "⚠️ Factores de Resistencia Antimicrobiana",
        type: "multiselect",
        options: [
          "Hospitalización <90 días",
          "Antibióticos <30 días", 
          "Dispositivos invasivos",
          "Factores MRSA",
          "Factores BLEE",
          "UCI reciente",
          "Colonización previa"
        ]
      }
    ]
  },
  
  // FASE 2: ANAMNESIS INFECTOLÓGICA INTELIGENTE (Mejorada)
  {
    id: "intelligentAnamnesis",
    title: "Anamnesis Infectológica Inteligente", 
    icon: Brain,
    phase: 2,
    order: 2,
    completed: false,
    fields: [
      {
        id: "febrileSymdrome",
        label: "📝 Síndrome Febril con Interpretación",
        type: "object",
        subfields: [
          {
            id: "maxTemperature",
            label: "Temperatura máxima (°C)",
            type: "number",
            min: 35,
            max: 45,
            autoInterpret: true
          },
          {
            id: "pattern",
            label: "Patrón febril",
            type: "select",
            options: ["Continua", "Intermitente", "Remitente", "Recurrente", "Bifásica", "Irregular"]
          },
          {
            id: "duration", 
            label: "Duración",
            type: "select",
            options: ["< 3 días", "3-7 días", "1-2 semanas", "2-3 semanas", "> 3 semanas (FOD)"]
          }
        ]
      },
      {
        id: "contactsOutbreaks",
        label: "⚡ Evaluación de Contactos y Brotes",
        type: "object",
        subfields: [
          {
            id: "familySymptoms",
            label: "¿Familiares con síntomas?",
            type: "boolean"
          },
          {
            id: "nosocomialExposure", 
            label: "¿Exposición nosocomial?",
            type: "boolean"
          },
          {
            id: "communityOutbreak",
            label: "¿Brote comunitario conocido?",
            type: "boolean"
          },
          {
            id: "endemicTravel",
            label: "¿Viajes a zonas endémicas?",
            type: "text",
            placeholder: "Especificar destinos y fechas"
          }
        ]
      }
    ]
  },

  // FASE 3: EXPLORACIÓN FÍSICA SISTEMÁTICA
  // 3.1 ESTADO GENERAL Y ASPECTO SÉPTICO
  {
    id: "generalStateAssessment",
    title: "Estado General y Aspecto Séptico",
    icon: User,
    phase: 3,
    order: 3.1,
    completed: false,
    critical: true,
    fields: [
      {
        id: "generalAppearance",
        label: "👤 Aspecto General",
        type: "select",
        options: [
          "Buen estado general",
          "Regular estado general",
          "Mal estado general", 
          "🚨 Aspecto séptico/tóxico",
          "🚨 Aspecto moribundo"
        ],
        critical: ["🚨 Aspecto séptico/tóxico", "🚨 Aspecto moribundo"]
      },
      {
        id: "consciousnessLevel",
        label: "Nivel de Conciencia",
        type: "select",
        options: [
          "Alerta y orientado",
          "Somnoliento pero despierta",
          "Estuporoso",
          "🚨 Comatoso"
        ],
        critical: ["🚨 Comatoso"]
      },
      {
        id: "hydrationPerfusion",
        label: "Hidratación y Perfusión",
        type: "select",
        options: [
          "Bien hidratado",
          "Deshidratación leve", 
          "Deshidratación moderada",
          "🚨 Deshidratación severa/shock"
        ],
        critical: ["🚨 Deshidratación severa/shock"]
      }
    ]
  },

  // 3.2 SIGNOS VITALES CON INTERPRETACIÓN AUTOMÁTICA
  {
    id: "intelligentVitalSigns",
    title: "Signos Vitales Inteligentes",
    icon: Activity,
    phase: 3,
    order: 3.2,
    completed: false,
    critical: true,
    fields: [
      {
        id: "vitalSigns",
        label: "🌡️ Signos Vitales",
        type: "object",
        subfields: [
          {
            id: "temperature",
            label: "Temperatura (°C)",
            type: "number",
            min: 30,
            max: 45,
            autoCalculate: true
          },
          {
            id: "systolicBP",
            label: "Presión sistólica (mmHg)",
            type: "number",
            min: 50,
            max: 250,
            autoCalculate: true
          },
          {
            id: "heartRate",
            label: "Frecuencia cardíaca (lpm)",
            type: "number",
            min: 30,
            max: 200,
            autoCalculate: true
          },
          {
            id: "respiratoryRate",
            label: "Frecuencia respiratoria (rpm)",
            type: "number",
            min: 8,
            max: 60,
            autoCalculate: true
          },
          {
            id: "oxygenSat",
            label: "Saturación O2 (%)",
            type: "number",
            min: 70,
            max: 100,
            autoCalculate: true
          }
        ]
      },
      {
        id: "automaticAlerts",
        label: "🚨 Alertas Automáticas",
        type: "calculated",
        calculators: [
          "triangleOfDeath",
          "qSOFA", 
          "shockIndex",
          "respiratoryGradient"
        ]
      }
    ]
  },

  // 3.3 CABEZA Y CUELLO
  {
    id: "headNeckExamination", 
    title: "Examen Céfalo-Cervical",
    icon: Eye,
    phase: 3,
    order: 3.3,
    completed: false,
    fields: [
      {
        id: "mucosalAssessment",
        label: "🗣️ Mucosas y Hidratación",
        type: "object",
        subfields: [
          {
            id: "mucosalState",
            label: "Estado mucosas",
            type: "select",
            options: ["Húmedas", "Secas", "Muy secas"]
          },
          {
            id: "coloration",
            label: "Coloración",
            type: "multiselect",
            options: ["Normal", "Palidez", "Ictericia", "Cianosis"]
          },
          {
            id: "capillaryRefill",
            label: "Tiempo llenado capilar (seg)",
            type: "number",
            min: 1,
            max: 10
          }
        ]
      },
      {
        id: "oropharynx",
        label: "Orofaringe Dirigida",
        type: "object",
        subfields: [
          {
            id: "pharyngealErythema",
            label: "Eritema faríngeo",
            type: "boolean"
          },
          {
            id: "tonsillarExudate",
            label: "Exudados amigdalinos",
            type: "boolean"
          },
          {
            id: "uvulaChanges",
            label: "Úvula (edema, desviación)",
            type: "select",
            options: ["Normal", "Edema", "Desviación", "Ambos"]
          },
          {
            id: "oralLesions",
            label: "Lesiones orales",
            type: "multiselect",
            options: ["Ausentes", "Aftas", "Candidiasis", "Úlceras", "Petequias"]
          }
        ]
      },
      {
        id: "neckExamination",
        label: "Cuello",
        type: "object", 
        subfields: [
          {
            id: "neckStiffness",
            label: "Rigidez nucal (grados)",
            type: "select",
            options: ["Ausente", "Leve", "Moderada", "Severa"]
          },
          {
            id: "cervicalAdenopathy",
            label: "Adenopatías cervicales",
            type: "boolean"
          },
          {
            id: "jugularDistention",
            label: "Ingurgitación yugular",
            type: "boolean"
          }
        ]
      }
    ]
  },

  // 3.4 EXAMEN RESPIRATORIO EXPANDIDO
  {
    id: "expandedRespiratoryExam",
    title: "Evaluación Respiratoria Sistemática", 
    icon: Stethoscope,
    phase: 3,
    order: 3.4,
    completed: false,
    fields: [
      {
        id: "respiratoryInspection",
        label: "🫁 Inspección Dinámica",
        type: "object",
        subfields: [
          {
            id: "respiratoryPattern",
            label: "Patrón respiratorio",
            type: "select",
            options: ["Normal", "Taquipnea", "Bradipnea", "Irregular", "Cheyne-Stokes"]
          },
          {
            id: "accessoryMuscles",
            label: "Músculos accesorios",
            type: "boolean"
          },
          {
            id: "intercostalRetraction",
            label: "Tiraje intercostal", 
            type: "boolean"
          },
          {
            id: "cyanosis",
            label: "Cianosis",
            type: "select",
            options: ["Ausente", "Central", "Periférica", "Ambas"]
          }
        ]
      },
      {
        id: "bilateralComparison",
        label: "Examen Bilateral Comparativo",
        type: "object",
        subfields: [
          {
            id: "rightHemithorax",
            label: "Hemitórax Derecho",
            type: "object",
            subfields: [
              {
                id: "expansion",
                label: "Expansión",
                type: "select",
                options: ["Normal", "Disminuida", "Ausente"]
              },
              {
                id: "tactilFremitus",
                label: "Frémito vocal",
                type: "select", 
                options: ["Normal", "Aumentado", "Disminuido", "Ausente"]
              },
              {
                id: "percussion",
                label: "Percusión",
                type: "select",
                options: ["Sonora", "Mate", "Timpánica", "Submate"]
              },
              {
                id: "breathSounds",
                label: "Murmullo vesicular",
                type: "select",
                options: ["Normal", "Disminuido", "Ausente", "Aumentado"]
              },
              {
                id: "adventitialSounds",
                label: "Ruidos agregados",
                type: "multiselect",
                options: ["Ausentes", "Crepitantes", "Roncus", "Sibilancias", "Frote pleural"]
              }
            ]
          },
          {
            id: "leftHemithorax",
            label: "Hemitórax Izquierdo", 
            type: "object",
            subfields: [
              {
                id: "expansion",
                label: "Expansión",
                type: "select",
                options: ["Normal", "Disminuida", "Ausente"]
              },
              {
                id: "tactilFremitus",
                label: "Frémito vocal",
                type: "select",
                options: ["Normal", "Aumentado", "Disminuido", "Ausente"]
              },
              {
                id: "percussion",
                label: "Percusión", 
                type: "select",
                options: ["Sonora", "Mate", "Timpánica", "Submate"]
              },
              {
                id: "breathSounds",
                label: "Murmullo vesicular",
                type: "select",
                options: ["Normal", "Disminuido", "Ausente", "Aumentado"]
              },
              {
                id: "adventitialSounds",
                label: "Ruidos agregados",
                type: "multiselect",
                options: ["Ausentes", "Crepitantes", "Roncus", "Sibilancias", "Frote pleural"]
              }
            ]
          }
        ]
      }
    ]
  },

  // 3.5 EXAMEN CARDIOVASCULAR CONTEXTUALIZADO
  {
    id: "contextualizedCardiovascularExam",
    title: "Evaluación Cardiovascular Infectológica",
    icon: Heart,
    phase: 3,
    order: 3.5,
    completed: false,
    fields: [
      {
        id: "cardiacAuscultation",
        label: "❤️ Auscultación Cardíaca Dirigida",
        type: "object",
        subfields: [
          {
            id: "rhythmRate",
            label: "Ritmo y frecuencia",
            type: "select",
            options: ["Regular", "Irregular", "Taquicárdico", "Bradicárdico"]
          },
          {
            id: "murmurs",
            label: "Soplos",
            type: "select",
            options: ["Ausentes", "Soplo nuevo", "Cambio en soplo previo", "Soplo conocido sin cambios"]
          },
          {
            id: "gallop",
            label: "Galope (S3/S4)",
            type: "select",
            options: ["Ausente", "S3", "S4", "Ambos"]
          },
          {
            id: "pericardialRub",
            label: "Roce pericárdico",
            type: "boolean"
          }
        ]
      },
      {
        id: "endocarditisSearch",
        label: "🔍 Búsqueda Dirigida Endocarditis",
        type: "object",
        subfields: [
          {
            id: "newMurmur",
            label: "Soplo nuevo presente",
            type: "boolean",
            alert: "Considerar endocarditis"
          },
          {
            id: "murmurChange",
            label: "Cambio en soplo previo",
            type: "boolean",
            alert: "Considerar endocarditis"
          },
          {
            id: "embolicPhenomena",
            label: "Fenómenos embólicos",
            type: "boolean",
            alert: "Considerar endocarditis"
          }
        ]
      },
      {
        id: "peripheralPerfusion",
        label: "Perfusión Periférica",
        type: "object",
        subfields: [
          {
            id: "peripheralPulses",
            label: "Pulsos periféricos",
            type: "select",
            options: ["Presentes y simétricos", "Disminuidos", "Asimétricos", "Ausentes"]
          },
          {
            id: "capillaryFill",
            label: "Llenado capilar (seg)",
            type: "number",
            min: 1,
            max: 10
          },
          {
            id: "extremityTemperature",
            label: "Temperatura extremidades",
            type: "select",
            options: ["Calientes", "Frías", "Asimétricas"]
          },
          {
            id: "centralPeripheralGradient",
            label: "Gradiente central-periférico",
            type: "select", 
            options: ["< 2°C", "2-4°C", "> 4°C"]
          }
        ]
      }
    ]
  },

  // 3.6 EXAMEN ABDOMINAL DIRIGIDO
  {
    id: "directedAbdominalExam",
    title: "Exploración Abdominal Infectológica",
    icon: Target,
    phase: 3,
    order: 3.6,
    completed: false,
    fields: [
      {
        id: "abdominalInspection",
        label: "🫄 Inspección Abdominal",
        type: "object",
        subfields: [
          {
            id: "distension",
            label: "Distensión",
            type: "boolean"
          },
          {
            id: "collateralCirculation",
            label: "Circulación colateral",
            type: "boolean"
          },
          {
            id: "parietalErythema",
            label: "Eritema parietal",
            type: "boolean"
          },
          {
            id: "skinLesions",
            label: "Lesiones cutáneas",
            type: "boolean"
          }
        ]
      },
      {
        id: "systematicPalpation",
        label: "Palpación Sistemática por Cuadrantes",
        type: "object",
        subfields: [
          {
            id: "painType",
            label: "Dolor",
            type: "select",
            options: ["Ausente", "Localizado", "Difuso", "Migratorio"]
          },
          {
            id: "defense",
            label: "Defensa",
            type: "select",
            options: ["Ausente", "Voluntaria", "Involuntaria"]
          },
          {
            id: "rebound",
            label: "Rebote (Blumberg)",
            type: "boolean"
          },
          {
            id: "palpableMasses",
            label: "Masas palpables",
            type: "boolean"
          }
        ]
      },
      {
        id: "specificManeuvers",
        label: "🔍 Maniobras Específicas",
        type: "object",
        subfields: [
          {
            id: "murphy",
            label: "Murphy (colecistitis)",
            type: "boolean"
          },
          {
            id: "psoas",
            label: "Psoas (apendicitis)",
            type: "boolean"
          },
          {
            id: "rovsing",
            label: "Rovsing (apendicitis)",
            type: "boolean"
          },
          {
            id: "mcBurney",
            label: "Mc Burney (apendicitis)",
            type: "boolean"
          }
        ]
      },
      {
        id: "organomegaly",
        label: "Organomegalias",
        type: "object",
        subfields: [
          {
            id: "hepatomegaly",
            label: "Hepatomegalia (cm bajo reborde)",
            type: "number",
            min: 0,
            max: 15
          },
          {
            id: "splenomegaly",
            label: "Esplenomegalia",
            type: "select",
            options: ["Ausente", "Grado I", "Grado II", "Grado III", "Grado IV"]
          },
          {
            id: "renalMasses",
            label: "Masas renales",
            type: "boolean"
          }
        ]
      }
    ]
  },

  // 3.7 EXAMEN NEUROLÓGICO EXPANDIDO
  {
    id: "expandedNeurologicalExam",
    title: "Evaluación Neurológica Sistemática",
    icon: Brain,
    phase: 3,
    order: 3.7,
    completed: false,
    fields: [
      {
        id: "consciousnessState",
        label: "🧠 Estado de Conciencia",
        type: "object",
        subfields: [
          {
            id: "glasgowScale",
            label: "Escala Glasgow",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "eyeOpening",
                label: "Apertura ocular",
                type: "select",
                options: ["Espontánea (4)", "Al llamado (3)", "Al dolor (2)", "No abre (1)"]
              },
              {
                id: "verbalResponse", 
                label: "Respuesta verbal",
                type: "select",
                options: ["Orientada (5)", "Confusa (4)", "Palabras inapropiadas (3)", "Sonidos incomprensibles (2)", "No respuesta (1)"]
              },
              {
                id: "motorResponse",
                label: "Respuesta motora",
                type: "select",
                options: ["Obedece órdenes (6)", "Localiza dolor (5)", "Retira al dolor (4)", "Flexión anormal (3)", "Extensión anormal (2)", "No respuesta (1)"]
              }
            ]
          },
          {
            id: "avpu",
            label: "AVPU",
            type: "select",
            options: ["Alert", "Voice", "Pain", "Unresponsive"]
          },
          {
            id: "orientation",
            label: "Orientación",
            type: "multiselect",
            options: ["Tiempo", "Espacio", "Persona"]
          }
        ]
      },
      {
        id: "meningealSigns",
        label: "🚨 Signos Meníngeos",
        type: "object",
        subfields: [
          {
            id: "neckStiffnessGrades",
            label: "Rigidez nucal (grados)",
            type: "select",
            options: ["Ausente", "Leve", "Moderada", "Severa"]
          },
          {
            id: "kernig",
            label: "Kernig",
            type: "boolean"
          },
          {
            id: "brudzinski",
            label: "Brudzinski", 
            type: "boolean"
          },
          {
            id: "photophobia",
            label: "Fotofobia",
            type: "boolean"
          }
        ]
      },
      {
        id: "focalNeurologicalSigns",
        label: "Signos Focales Neurológicos",
        type: "object",
        subfields: [
          {
            id: "cranialNerves",
            label: "Pares craneales",
            type: "select",
            options: ["Normales", "Alterados", "No evaluado"]
          },
          {
            id: "motorStrength",
            label: "Fuerza muscular",
            type: "select",
            options: ["Normal", "Disminuida", "Asimétrica", "Plejía"]
          },
          {
            id: "reflexes",
            label: "Reflejos",
            type: "select", 
            options: ["Normales", "Hiperreflexia", "Hiporreflexia", "Arreflexia"]
          },
          {
            id: "coordination",
            label: "Coordinación",
            type: "select",
            options: ["Normal", "Alterada", "No evaluable"]
          }
        ]
      }
    ]
  },

  // 3.8 EXTREMIDADES Y ARTICULACIONES
  {
    id: "extremitiesJointsExam",
    title: "Examen de Extremidades y Articulaciones", 
    icon: HeartHandshake,
    phase: 3,
    order: 3.8,
    completed: false,
    fields: [
      {
        id: "peripheralPerfusionDetailed",
        label: "🦵 Perfusión Periférica Detallada",
        type: "object",
        subfields: [
          {
            id: "distalPulses",
            label: "Pulsos distales",
            type: "select",
            options: ["Presentes bilateral", "Disminuidos", "Asimétricos", "Ausentes"]
          },
          {
            id: "capillaryRefillTime",
            label: "Llenado capilar (seg)",
            type: "number",
            min: 1,
            max: 10
          },
          {
            id: "temperature",
            label: "Temperatura",
            type: "select",
            options: ["Calientes", "Frías", "Asimétricas"]
          },
          {
            id: "edemaGrading",
            label: "Edema (graduación)",
            type: "select",
            options: ["Ausente", "+", "++", "+++", "++++"]
          }
        ]
      },
      {
        id: "embolicPhenomenaSearch",
        label: "🔍 Búsqueda de Fenómenos Embólicos",
        type: "object",
        subfields: [
          {
            id: "oslerNodes",
            label: "Nódulos de Osler",
            type: "boolean",
            alert: "Sugestivo de endocarditis"
          },
          {
            id: "janewayLesions",
            label: "Lesiones de Janeway",
            type: "boolean",
            alert: "Sugestivo de endocarditis"
          },
          {
            id: "splinterHemorrhages",
            label: "Hemorragias en astilla",
            type: "boolean",
            alert: "Sugestivo de endocarditis"
          },
          {
            id: "rothSpots",
            label: "Manchas de Roth (fondo ojo)",
            type: "boolean",
            alert: "Sugestivo de endocarditis"
          }
        ]
      },
      {
        id: "jointsAssessment",
        label: "Articulaciones",
        type: "object",
        subfields: [
          {
            id: "monoarthritis",
            label: "Artritis monoarticular",
            type: "boolean"
          },
          {
            id: "polyarthritis",
            label: "Artritis poliarticular",
            type: "boolean"
          },
          {
            id: "arthralgiaNoInflammation",
            label: "Artralgia sin inflamación",
            type: "boolean"
          },
          {
            id: "functionalLimitation",
            label: "Limitación funcional",
            type: "boolean"
          }
        ]
      }
    ]
  },

  // 3.9 EXAMEN DE PIEL INTEGRAL
  {
    id: "integralSkinExam",
    title: "Evaluación Dermatológica Completa",
    icon: Eye,
    phase: 3,
    order: 3.9,
    completed: false,
    fields: [
      {
        id: "rashByDistribution",
        label: "🎨 Exantemas por Distribución",
        type: "object",
        subfields: [
          {
            id: "distribution",
            label: "Distribución",
            type: "select",
            options: ["Generalizado", "Localizado", "Centrípeto", "Centrífugo"]
          },
          {
            id: "palmsPlantsInvolvement",
            label: "Compromiso palmas/plantas",
            type: "boolean"
          },
          {
            id: "temporalEvolution",
            label: "Evolución temporal",
            type: "select",
            options: ["Aguda", "Subaguda", "Crónica", "Recurrente"]
          }
        ]
      },
      {
        id: "lesionTypes",
        label: "Tipos de Lesiones",
        type: "object",
        subfields: [
          {
            id: "maculopapular",
            label: "Maculopapular",
            type: "boolean"
          },
          {
            id: "vesicularPustular",
            label: "Vesicular/pustular",
            type: "boolean"
          },
          {
            id: "petechialPurpuric",
            label: "Petequial/purpúrico",
            type: "boolean"
          },
          {
            id: "urticarial",
            label: "Urticariforme",
            type: "boolean"
          },
          {
            id: "ulcerative",
            label: "Ulcerativo",
            type: "boolean"
          }
        ]
      },
      {
        id: "alarmingLesions",
        label: "🚨 Lesiones de Alarma",
        type: "object",
        subfields: [
          {
            id: "palpablePurpura",
            label: "Púrpura palpable",
            type: "boolean",
            alert: "Vasculitis/Endocarditis"
          },
          {
            id: "skinNecrosis",
            label: "Necrosis cutánea",
            type: "boolean",
            alert: "Sepsis severa"
          },
          {
            id: "livedoReticularis",
            label: "Livedo reticularis",
            type: "boolean",
            alert: "Sepsis/Shock"
          },
          {
            id: "digitalGangrene",
            label: "Gangrena digital",
            type: "boolean",
            alert: "Endocarditis/Sepsis"
          }
        ]
      }
    ]
  },

  // 3.10 ADENOPATÍAS POR REGIONES
  {
    id: "regionalLymphadenopathy",
    title: "Evaluación Ganglionar Sistemática",
    icon: Users,
    phase: 3,
    order: 3.10,
    completed: false,
    fields: [
      {
        id: "cervicalNodes",
        label: "🔍 Ganglios Cervicales",
        type: "object",
        subfields: [
          {
            id: "anteriorChain",
            label: "Cadena anterior (yugular)",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presente",
                type: "boolean"
              },
              {
                id: "size",
                label: "Tamaño (cm)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "consistency",
                label: "Consistencia",
                type: "select",
                options: ["Blanda", "Firme", "Dura", "Fluctuante"]
              },
              {
                id: "mobility",
                label: "Movilidad",
                type: "select",
                options: ["Móvil", "Adherida"]
              },
              {
                id: "pain",
                label: "Doloroso",
                type: "boolean"
              }
            ]
          },
          {
            id: "posteriorChain",
            label: "Cadena posterior (espinal)",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presente",
                type: "boolean"
              },
              {
                id: "size",
                label: "Tamaño (cm)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          },
          {
            id: "supraclavicular",
            label: "Supraclaviculares",
            type: "object",
            subfields: [
              {
                id: "present",
                label: "Presente",
                type: "boolean",
                alert: "Siempre patológica"
              },
              {
                id: "size",
                label: "Tamaño (cm)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          }
        ]
      },
      {
        id: "axillaryNodes",
        label: "Ganglios Axilares",
        type: "object",
        subfields: [
          {
            id: "central",
            label: "Central",
            type: "boolean"
          },
          {
            id: "anterior",
            label: "Anterior (pectoral)",
            type: "boolean"
          },
          {
            id: "posterior",
            label: "Posterior (subescapular)",
            type: "boolean"
          },
          {
            id: "lateral",
            label: "Lateral (humeral)",
            type: "boolean"
          }
        ]
      },
      {
        id: "inguinalNodes",
        label: "Ganglios Inguinales",
        type: "object",
        subfields: [
          {
            id: "horizontal",
            label: "Horizontales",
            type: "boolean"
          },
          {
            id: "vertical",
            label: "Verticales",
            type: "boolean"
          }
        ]
      },
      {
        id: "epitrochlearNodes",
        label: "Ganglios Epitrocleares",
        type: "boolean"
      }
    ]
  },

  // ESCALAS Y CALCULADORAS DINÁMICAS
  {
    id: "dynamicCalculators",
    title: "Calculadoras e Índices Dinámicos",
    icon: Calculator,
    phase: 4,
    order: 4.1,
    completed: false,
    critical: true,
    fields: [
      {
        id: "sepsisScales",
        label: "📊 Escalas de Sepsis",
        type: "calculated",
        calculators: [
          {
            name: "qSOFA",
            fields: ["systolicBP", "respiratoryRate", "glasgowScale"],
            autoCalculate: true,
            interpretation: "≥2 puntos: Alto riesgo de sepsis"
          },
          {
            name: "SIRS",
            fields: ["temperature", "heartRate", "respiratoryRate", "wbc"],
            autoCalculate: true,
            interpretation: "≥2 criterios: SIRS presente"
          }
        ]
      },
      {
        id: "respiratoryScales",
        label: "Escalas Respiratorias",
        type: "calculated",
        calculators: [
          {
            name: "CURB-65",
            fields: ["confusion", "urea", "respiratoryRate", "systolicBP", "age"],
            autoCalculate: true,
            condition: "respiratorySymptoms",
            interpretation: "≥2 puntos: Hospitalización requerida"
          },
          {
            name: "PSI/PORT",
            fields: ["age", "comorbidities", "vitalSigns", "labResults"],
            autoCalculate: true,
            condition: "suspectedPneumonia"
          }
        ]
      },
      {
        id: "endocarditisScore",
        label: "Criterios de Endocarditis",
        type: "calculated",
        calculators: [
          {
            name: "Duke",
            fields: ["bloodCultures", "echocardiogram", "vascularPhenomena", "immunoPhenomena"],
            autoCalculate: true,
            interpretation: "2 mayores o 1 mayor + 3 menores: Probable"
          }
        ]
      }
    ]
  },

  // SÍNTESIS Y DECISIONES
  {
    id: "synthesisDecisions",
    title: "Síntesis Infectológica y Decisiones",
    icon: CheckCircle,
    phase: 5,
    order: 5.1,
    completed: false,
    fields: [
      {
        id: "clinicalCorrelation",
        label: "🎯 Correlación Clínica",
        type: "object",
        subfields: [
          {
            id: "primarySyndrome",
            label: "Síndrome infeccioso principal",
            type: "select",
            options: [
              "Síndrome febril sin foco",
              "Neumonía adquirida en comunidad",
              "Infección del tracto urinario",
              "Sepsis/Shock séptico",
              "Endocarditis",
              "Meningitis",
              "Gastroenteritis infecciosa",
              "Celulitis/Erisipela",
              "Absceso intraabdominal"
            ]
          },
          {
            id: "finalRiskStratification",
            label: "Estratificación final de riesgo",
            type: "select",
            options: [
              "🟢 Bajo riesgo - Ambulatorio",
              "🟡 Riesgo intermedio - Observación",
              "🔴 Alto riesgo - Hospitalización",
              "🚨 Riesgo crítico - UCI"
            ]
          }
        ]
      },
      {
        id: "managementRecommendations",
        label: "Recomendaciones de Manejo",
        type: "object",
        subfields: [
          {
            id: "immediateActions",
            label: "Acciones inmediatas",
            type: "multiselect",
            options: [
              "Hemocultivos urgentes",
              "Antibióticos empíricos",
              "Soporte hemodinámico",
              "Oxigenoterapia",
              "Rehidratación",
              "Aislamiento",
              "Interconsulta UCI",
              "Punción lumbar"
            ]
          },
          {
            id: "followUpCriteria",
            label: "Criterios de seguimiento",
            type: "multiselect",
            options: [
              "Signos vitales cada 4h",
              "Laboratorios control 24h",
              "Re-evaluación clínica diaria",
              "Cultivos de control",
              "Imagen de control",
              "Evaluación respuesta 48-72h"
            ]
          }
        ]
      }
    ]
  }
];

export default function AdvancedInfectiologyForm({ patientData, onDataChange, onComplete }: AdvancedInfectiologyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  const [adaptiveFlow, setAdaptiveFlow] = useState<string>("complete");

  // Calcular progreso total
  const progress = useMemo(() => {
    return Math.round((completedSections.size / ADVANCED_INFECTIOLOGY_SECTIONS.length) * 100);
  }, [completedSections.size]);

  // Sistema de alertas automáticas
  const checkAutomaticAlerts = (data: Record<string, any>) => {
    const newAlerts: AlertData[] = [];

    // Triángulo de muerte
    if (data.temperature && data.systolicBP && data.heartRate) {
      if (data.temperature < 36 && data.systolicBP < 90 && data.heartRate > 120) {
        newAlerts.push({
          type: 'red',
          message: '🚨 TRIÁNGULO DE MUERTE: T<36°C + PAS<90 + FC>120',
          conditions: ['Hipotermia', 'Hipotensión', 'Taquicardia'],
          priority: 1
        });
      }
    }

    // qSOFA ≥2
    const qsofa = calculateQSOFA(data);
    if (qsofa >= 2) {
      newAlerts.push({
        type: 'red', 
        message: '🚨 qSOFA ≥2: Alto riesgo de sepsis',
        conditions: ['Sepsis probable'],
        priority: 1
      });
    }

    // Meningitis probable
    const meningealSigns = [data.neckStiffness, data.kernig, data.brudzinski, data.photophobia];
    const positiveSignsCount = meningealSigns.filter(Boolean).length;
    if (positiveSignsCount >= 2) {
      newAlerts.push({
        type: 'red',
        message: '🔴 ALERTA: 2+ signos meníngeos positivos - Meningitis probable',
        conditions: ['Meningitis'],
        priority: 1
      });
    }

    // Endocarditis sospecha
    if (data.newMurmur || data.murmurChange || data.embolicPhenomena) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Sospecha endocarditis: Evaluar criterios de Duke',
        conditions: ['Endocarditis'],
        priority: 2
      });
    }

    // Fenómenos embólicos
    if (data.oslerNodes || data.janewayLesions || data.splinterHemorrhages) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Fenómenos embólicos presentes: Sugestivo de endocarditis',
        conditions: ['Endocarditis'],
        priority: 2
      });
    }

    setAlerts(newAlerts);
  };

  // Calculadoras automáticas
  const calculateQSOFA = (data: Record<string, any>): number => {
    let score = 0;
    if (data.systolicBP && data.systolicBP <= 100) score++;
    if (data.respiratoryRate && data.respiratoryRate >= 22) score++;
    if (data.glasgowScale && data.glasgowScale < 15) score++;
    return score;
  };

  const calculateSIRS = (data: Record<string, any>): number => {
    let criteria = 0;
    if (data.temperature && (data.temperature > 38 || data.temperature < 36)) criteria++;
    if (data.heartRate && data.heartRate > 90) criteria++;
    if (data.respiratoryRate && data.respiratoryRate > 20) criteria++;
    if (data.wbc && (data.wbc > 12 || data.wbc < 4)) criteria++;
    return criteria;
  };

  const calculateCURB65 = (data: Record<string, any>): number => {
    let score = 0;
    if (data.confusion) score++;
    if (data.urea && data.urea > 7) score++;
    if (data.respiratoryRate && data.respiratoryRate >= 30) score++;
    if (data.systolicBP && data.systolicBP < 90) score++;
    if (data.age && data.age >= 65) score++;
    return score;
  };

  // Actualizar calculadoras
  const updateCalculators = (data: Record<string, any>) => {
    const results: CalculatorResult[] = [];

    const qsofa = calculateQSOFA(data);
    results.push({
      name: 'qSOFA',
      value: qsofa,
      interpretation: qsofa >= 2 ? 'Alto riesgo de sepsis' : qsofa === 1 ? 'Riesgo intermedio' : 'Bajo riesgo',
      color: qsofa >= 2 ? '#ef4444' : qsofa === 1 ? '#f59e0b' : '#10b981',
      alert: qsofa >= 2
    });

    const sirs = calculateSIRS(data);
    results.push({
      name: 'SIRS',
      value: sirs,
      interpretation: sirs >= 2 ? 'SIRS presente' : 'SIRS ausente',
      color: sirs >= 2 ? '#f59e0b' : '#10b981',
      alert: sirs >= 3
    });

    if (data.respiratorySymptoms || data.suspectedPneumonia) {
      const curb65 = calculateCURB65(data);
      results.push({
        name: 'CURB-65',
        value: curb65,
        interpretation: curb65 >= 3 ? 'Alta severidad - UCI' : curb65 >= 2 ? 'Severidad moderada - Hospitalización' : 'Baja severidad - Ambulatorio',
        color: curb65 >= 3 ? '#ef4444' : curb65 >= 2 ? '#f59e0b' : '#10b981',
        alert: curb65 >= 3
      });
    }

    setCalculatorResults(results);
  };

  // Manejar cambios en datos
  const handleDataChange = (sectionId: string, fieldId: string, value: any) => {
    const newFormData = {
      ...formData,
      [`${sectionId}_${fieldId}`]: value
    };
    
    setFormData(newFormData);
    
    // Verificar alertas y calculadoras
    checkAutomaticAlerts(newFormData);
    updateCalculators(newFormData);
    
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
            {field.alert && value && (
              <Badge variant="destructive" className="text-xs">
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
              onChange={(e) => handleDataChange(section.id, field.id, parseFloat(e.target.value))}
              className="mt-1"
            />
            {field.unit && (
              <span className="text-sm text-gray-500 ml-2">{field.unit}</span>
            )}
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
          </div>
        );

      case 'multiselect':
        return (
          <div>
            <Label>{field.label}</Label>
            <div className="mt-2 space-y-2">
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
              {calculatorResults
                .filter(result => field.calculators?.includes(result.name.toLowerCase()))
                .map((result) => (
                  <div key={result.name} className="p-3 rounded-lg border" style={{ borderColor: result.color }}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.name}</span>
                      <Badge variant={result.alert ? "destructive" : "secondary"}>
                        {result.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.interpretation}</p>
                  </div>
                ))}
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

  const currentSectionData = ADVANCED_INFECTIOLOGY_SECTIONS[currentSection];
  const isLastSection = currentSection === ADVANCED_INFECTIOLOGY_SECTIONS.length - 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado con progreso y alertas */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl shadow-sm border border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-600" />
              Sistema Infectológico Inteligente
            </h1>
            <p className="text-gray-600 mt-1">
              Evaluación sistemática con alertas automáticas y calculadoras dinámicas
            </p>
            {patientData && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span className="font-medium">{patientData.name}</span>
                {patientData.age && <span>• {patientData.age} años</span>}
                {patientData.gender && <span>• {patientData.gender}</span>}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {progress}%
            </div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>
        
        <Progress value={progress} className="mb-4" />

        {/* Alertas críticas */}
        {alerts.filter(alert => alert.type === 'red').map((alert, index) => (
          <Alert key={index} className="mb-2 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {alert.message}
            </AlertDescription>
          </Alert>
        ))}

        {/* Alertas de precaución */}
        {alerts.filter(alert => alert.type === 'yellow').map((alert, index) => (
          <Alert key={index} className="mb-2 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {alert.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Navegación por fases */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(phase => (
          <div 
            key={phase}
            className={`p-3 text-center rounded-lg border-2 transition-all ${
              ADVANCED_INFECTIOLOGY_SECTIONS[currentSection]?.phase === phase
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="font-bold">FASE {phase}</div>
            <div className="text-xs mt-1">
              {phase === 1 && "Bioseguridad"}
              {phase === 2 && "Anamnesis"}
              {phase === 3 && "Exploración"}
              {phase === 4 && "Calculadoras"}
              {phase === 5 && "Síntesis"}
            </div>
          </div>
        ))}
      </div>

      {/* Navegación por secciones */}
      <div className="flex flex-wrap gap-2">
        {ADVANCED_INFECTIOLOGY_SECTIONS.map((section, index) => {
          const Icon = section.icon;
          const isCompleted = completedSections.has(section.id);
          const isCurrent = index === currentSection;
          const isCritical = section.critical;

          return (
            <Button
              key={section.id}
              variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
              className={`flex items-center gap-2 ${
                isCritical ? 'border-red-300' : ''
              } ${isCurrent ? 'ring-2 ring-orange-300' : ''}`}
              onClick={() => setCurrentSection(index)}
            >
              <Icon className="h-4 w-4" />
              {section.order} {section.title}
              {isCritical && <AlertTriangle className="h-3 w-3 text-red-500" />}
              {isCompleted && <CheckCircle className="h-3 w-3 text-green-500" />}
            </Button>
          );
        })}
      </div>

      {/* Calculadoras en tiempo real */}
      {calculatorResults.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadoras en Tiempo Real
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calculatorResults.map((result) => (
              <div 
                key={result.name}
                className={`p-3 rounded-lg border-2 ${
                  result.alert ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{result.name}</span>
                  <Badge 
                    variant={result.alert ? "destructive" : "secondary"}
                    className="text-white"
                    style={{ backgroundColor: result.color }}
                  >
                    {result.value}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{result.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección actual */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <currentSectionData.icon className="h-6 w-6 text-orange-600" />
              <span>
                FASE {currentSectionData.phase}: {currentSectionData.title}
              </span>
              {currentSectionData.critical && (
                <Badge variant="destructive">Crítico</Badge>
              )}
            </CardTitle>
            <Badge variant="outline">
              Sección {currentSection + 1} de {ADVANCED_INFECTIOLOGY_SECTIONS.length}
            </Badge>
          </div>
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
          ← Anterior
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
              Finalizar Evaluación
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentSection(Math.min(ADVANCED_INFECTIOLOGY_SECTIONS.length - 1, currentSection + 1))}
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}