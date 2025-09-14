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
  Bone,
  Heart,
  Eye,
  FlaskConical,
  TrendingUp,
  Users,
  Microscope,
  Timer,
  Stethoscope
} from "lucide-react";

interface AdvancedRheumatologyFormProps {
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
}

const ADVANCED_RHEUMATOLOGY_SECTIONS: FormSection[] = [
  // 1. TRIAGE REUMATOLÓGICO URGENTE
  {
    id: "rheumatologyUrgentTriage",
    title: "Triage Reumatológico Urgente",
    icon: Shield,
    section: 1,
    order: 1.1,
    completed: false,
    critical: true,
    fields: [
      {
        id: "criticalRedFlags",
        label: "🚨 Banderas Rojas Críticas",
        type: "object",
        subfields: [
          {
            id: "septicArthritis",
            label: "Sospecha artritis séptica (fiebre + monoartritis aguda + leucocitosis)",
            type: "boolean",
            critical: true,
            alert: "⚠️ SOSPECHA ARTRITIS SÉPTICA - Derivación urgente",
            action: "Hemocultivos + artrocentesis urgente"
          },
          {
            id: "systemicVasculitis",
            label: "Sospecha vasculitis sistémica (púrpura palpable + neuropatía + proteinuria)",
            type: "boolean",
            critical: true,
            alert: "⚠️ SOSPECHA VASCULITIS SISTÉMICA - Evaluación inmediata",
            action: "Biopsia + estudios vasculitis"
          },
          {
            id: "giantCellArteritis",
            label: "Arteritis de células gigantes (cefalea + claudicación mandibular + >50 años)",
            type: "boolean",
            critical: true,
            alert: "⚠️ SOSPECHA ARTERITIS CÉLULAS GIGANTES - Corticoides urgentes",
            action: "Prednisolona 1mg/kg inmediato + biopsia arterial"
          },
          {
            id: "lupusNephritis",
            label: "Nefritis lúpica (proteinuria + hematuria + hipertensión)",
            type: "boolean",
            critical: true,
            alert: "⚠️ SOSPECHA NEFRITIS LÚPICA - Evaluación nefrológica urgente",
            action: "Biopsia renal + inmunosupresión"
          },
          {
            id: "spinalCompression",
            label: "Compresión medular (debilidad + hiperreflexia + nivel sensitivo)",
            type: "boolean",
            critical: true,
            alert: "⚠️ COMPRESIÓN MEDULAR - RM urgente",
            action: "RM columna + neurocirugía"
          }
        ]
      },
      {
        id: "initialRiskStratification",
        label: "📊 Estratificación de Riesgo Inicial",
        type: "select",
        options: [
          "🔴 ALTO RIESGO: Evaluación inmediata (<2h)",
          "🟡 RIESGO MEDIO: Evaluación prioritaria (<24h)",
          "🟢 BAJO RIESGO: Evaluación programada (<1 semana)"
        ],
        autoCalculate: true
      },
      {
        id: "urgentReferralCriteria",
        label: "🚑 Criterios de Derivación Urgente",
        type: "multiselect",
        options: [
          "Articulación caliente + fiebre",
          "Púrpura palpable",
          "Pérdida de visión",
          "Debilidad neurológica aguda",
          "Proteinuria + hematuria",
          "Cefalea temporal severa",
          "Disfagia progresiva",
          "Disnea + derrame pleural"
        ],
        autoCalculate: true
      }
    ]
  },

  // 2. ANAMNESIS DIRIGIDA ADAPTATIVA
  {
    id: "adaptiveDirectedAnamnesis",
    title: "Anamnesis Dirigida Adaptativa",
    icon: Brain,
    section: 2,
    order: 2.1,
    completed: false,
    fields: [
      {
        id: "symptomAlgorithm",
        label: "🧠 Algoritmo Síntomas → Sospecha Diagnóstica",
        type: "object",
        subfields: [
          {
            id: "jointPainPattern",
            label: "Patrón dolor articular",
            type: "object",
            subfields: [
              {
                id: "morningStiffnessDuration",
                label: "Rigidez matutina (minutos)",
                type: "number",
                min: 0,
                max: 480,
                autoInterpret: true
              },
              {
                id: "smallJointsInvolved",
                label: "Articulaciones pequeñas afectadas",
                type: "number",
                min: 0,
                max: 28,
                autoInterpret: true
              },
              {
                id: "symmetricalInvolvement",
                label: "Afectación simétrica",
                type: "boolean",
                autoInterpret: true
              },
              {
                id: "additivePattern",
                label: "Patrón aditivo (no migratorio)",
                type: "boolean",
                autoInterpret: true
              }
            ]
          },
          {
            id: "systemicFeatures",
            label: "Características sistémicas",
            type: "object",
            subfields: [
              {
                id: "constitutionalSymptoms",
                label: "Síntomas constitucionales",
                type: "multiselect",
                options: ["Fiebre", "Pérdida de peso", "Fatiga severa", "Sudores nocturnos"]
              },
              {
                id: "organSystemInvolvement",
                label: "Afectación orgánica",
                type: "multiselect",
                options: [
                  "Sequedad ocular/bucal",
                  "Fenómeno de Raynaud",
                  "Eritema malar",
                  "Fotosensibilidad",
                  "Úlceras orales",
                  "Alopecia",
                  "Dolor lumbar inflamatorio"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "specificFamilyHistory",
        label: "🧬 Historia Familiar con Peso Específico",
        type: "object",
        subfields: [
          {
            id: "rheumatoidArthritis",
            label: "Artritis reumatoide (peso: 3x)",
            type: "boolean"
          },
          {
            id: "lupus",
            label: "Lupus eritematoso sistémico (peso: 5x)",
            type: "boolean"
          },
          {
            id: "ankylosingSpondylitis",
            label: "Espondilitis anquilosante (peso: 4x)",
            type: "boolean"
          },
          {
            id: "psoriasis",
            label: "Psoriasis (peso: 3x)",
            type: "boolean"
          },
          {
            id: "inflammatory_bowel",
            label: "Enfermedad inflamatoria intestinal (peso: 2x)",
            type: "boolean"
          },
          {
            id: "autoimmune_thyroid",
            label: "Enfermedad tiroidea autoinmune (peso: 2x)",
            type: "boolean"
          }
        ]
      },
      {
        id: "contextualizedRiskFactors",
        label: "⚡ Factores de Riesgo Contextualizados",
        type: "object",
        subfields: [
          {
            id: "smoking",
            label: "Tabaquismo",
            type: "object",
            subfields: [
              {
                id: "current",
                label: "Fumador actual",
                type: "boolean"
              },
              {
                id: "packYears",
                label: "Paquetes-año",
                type: "number",
                min: 0,
                max: 100
              }
            ]
          },
          {
            id: "environmentalExposures",
            label: "Exposiciones ambientales",
            type: "multiselect",
            options: [
              "Sílice",
              "Asbesto",
              "Solventes orgánicos",
              "Metales pesados",
              "Infecciones previas (EBV, Parvovirus)"
            ]
          },
          {
            id: "medications",
            label: "Medicamentos de riesgo",
            type: "multiselect",
            options: [
              "Hidralazina",
              "Procainamida",
              "Minociclina",
              "Anti-TNF",
              "Interferón",
              "Estatinas"
            ]
          }
        ]
      }
    ]
  },

  // 3. EXAMEN FÍSICO SISTEMATIZADO
  {
    id: "systematizedPhysicalExam",
    title: "Examen Físico Sistematizado",
    icon: Activity,
    section: 3,
    order: 3.1,
    completed: false,
    fields: [
      {
        id: "automatedJointCount",
        label: "🦴 Recuento Articular Automatizado",
        type: "object",
        subfields: [
          {
            id: "swollenJoints28",
            label: "Articulaciones tumefactas (SJC28)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "shoulders",
                label: "Hombros",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "elbows",
                label: "Codos",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "wrists",
                label: "Muñecas",
                type: "multiselect",
                options: ["Derecha", "Izquierda"]
              },
              {
                id: "mcpJoints",
                label: "MCF (1-5)",
                type: "multiselect",
                options: ["MCF1-D", "MCF2-D", "MCF3-D", "MCF4-D", "MCF5-D", "MCF1-I", "MCF2-I", "MCF3-I", "MCF4-I", "MCF5-I"]
              },
              {
                id: "pipJoints",
                label: "IFP (2-5)",
                type: "multiselect",
                options: ["IFP2-D", "IFP3-D", "IFP4-D", "IFP5-D", "IFP2-I", "IFP3-I", "IFP4-I", "IFP5-I"]
              },
              {
                id: "knees",
                label: "Rodillas",
                type: "multiselect",
                options: ["Derecha", "Izquierda"]
              }
            ]
          },
          {
            id: "tenderJoints28",
            label: "Articulaciones dolorosas (TJC28)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "shoulders",
                label: "Hombros",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "elbows",
                label: "Codos",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "wrists",
                label: "Muñecas",
                type: "multiselect",
                options: ["Derecha", "Izquierda"]
              },
              {
                id: "mcpJoints",
                label: "MCF (1-5)",
                type: "multiselect",
                options: ["MCF1-D", "MCF2-D", "MCF3-D", "MCF4-D", "MCF5-D", "MCF1-I", "MCF2-I", "MCF3-I", "MCF4-I", "MCF5-I"]
              },
              {
                id: "pipJoints",
                label: "IFP (2-5)",
                type: "multiselect",
                options: ["IFP2-D", "IFP3-D", "IFP4-D", "IFP5-D", "IFP2-I", "IFP3-I", "IFP4-I", "IFP5-I"]
              },
              {
                id: "knees",
                label: "Rodillas",
                type: "multiselect",
                options: ["Derecha", "Izquierda"]
              }
            ]
          }
        ]
      },
      {
        id: "targetedExtraArticularSearch",
        label: "🔍 Búsqueda Dirigida Manifestaciones Extraarticulares",
        type: "object",
        subfields: [
          {
            id: "skinManifestations",
            label: "Manifestaciones cutáneas",
            type: "object",
            subfields: [
              {
                id: "malarRash",
                label: "Eritema malar",
                type: "boolean"
              },
              {
                id: "discoidRash",
                label: "Lesiones discoides",
                type: "boolean"
              },
              {
                id: "photosensitivity",
                label: "Fotosensibilidad",
                type: "boolean"
              },
              {
                id: "rheumatoidNodules",
                label: "Nódulos reumatoideos",
                type: "boolean"
              },
              {
                id: "psoriasiformLesions",
                label: "Lesiones psoriasiformes",
                type: "boolean"
              },
              {
                id: "palpablePurpura",
                label: "Púrpura palpable",
                type: "boolean",
                alert: "Sospecha vasculitis"
              }
            ]
          },
          {
            id: "ocularManifestations",
            label: "Manifestaciones oculares",
            type: "object",
            subfields: [
              {
                id: "dryEyes",
                label: "Sequedad ocular (Schirmer <5mm)",
                type: "boolean"
              },
              {
                id: "redEye",
                label: "Ojo rojo",
                type: "boolean"
              },
              {
                id: "visualDisturbances",
                label: "Alteraciones visuales",
                type: "boolean",
                alert: "Descartar arteritis células gigantes"
              },
              {
                id: "uveitis",
                label: "Uveítis",
                type: "boolean"
              }
            ]
          },
          {
            id: "pulmonaryManifestations",
            label: "Manifestaciones pulmonares",
            type: "object",
            subfields: [
              {
                id: "dryness",
                label: "Tos seca persistente",
                type: "boolean"
              },
              {
                id: "dyspnea",
                label: "Disnea de esfuerzo",
                type: "boolean"
              },
              {
                id: "pleuralEffusion",
                label: "Derrame pleural",
                type: "boolean"
              },
              {
                id: "fibrosis",
                label: "Fibrosis pulmonar",
                type: "boolean"
              }
            ]
          },
          {
            id: "renalManifestations",
            label: "Manifestaciones renales",
            type: "object",
            subfields: [
              {
                id: "proteinuria",
                label: "Proteinuria",
                type: "boolean"
              },
              {
                id: "hematuria",
                label: "Hematuria",
                type: "boolean"
              },
              {
                id: "hypertension",
                label: "Hipertensión de novo",
                type: "boolean"
              },
              {
                id: "elevatedCreatinine",
                label: "Creatinina elevada",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "specificManeuversBySuspicion",
        label: "🎯 Maniobras Específicas según Sospecha",
        type: "object",
        subfields: [
          {
            id: "rheumatoidArthritisSpecific",
            label: "AR - Maniobras específicas",
            type: "object",
            condition: "suspectedRA",
            subfields: [
              {
                id: "metacarpalSqueeze",
                label: "Compresión metacarpianos",
                type: "boolean"
              },
              {
                id: "metatarsalSqueeze",
                label: "Compresión metatarsianos",
                type: "boolean"
              },
              {
                id: "wristCompressionTest",
                label: "Test compresión muñeca",
                type: "boolean"
              }
            ]
          },
          {
            id: "spondyloarthritisSpecific",
            label: "SpA - Evaluación sacroilíaca",
            type: "object",
            condition: "suspectedSpA",
            subfields: [
              {
                id: "patrick",
                label: "FABER/Patrick",
                type: "select",
                options: ["Negativo bilateral", "Positivo derecho", "Positivo izquierdo", "Positivo bilateral"]
              },
              {
                id: "compression",
                label: "Compresión sacroilíaca",
                type: "select",
                options: ["Negativo", "Positivo derecho", "Positivo izquierdo", "Positivo bilateral"]
              },
              {
                id: "gaenslen",
                label: "Test de Gaenslen",
                type: "select",
                options: ["Negativo bilateral", "Positivo derecho", "Positivo izquierdo", "Positivo bilateral"]
              }
            ]
          },
          {
            id: "enthesitisEvaluation",
            label: "Evaluación de entesis (MASES)",
            type: "object",
            condition: "suspectedSpA",
            subfields: [
              {
                id: "achillesTendon",
                label: "Tendón de Aquiles",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "plantarFascia",
                label: "Fascia plantar",
                type: "multiselect",
                options: ["Derecha", "Izquierda"]
              },
              {
                id: "lateralEpicondyle",
                label: "Epicóndilo lateral",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              },
              {
                id: "medialEpicondyle",
                label: "Epicóndilo medial",
                type: "multiselect",
                options: ["Derecho", "Izquierdo"]
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. ESCALAS Y EVALUACIÓN FUNCIONAL
  {
    id: "scalesFunctionalEvaluation",
    title: "Escalas y Evaluación Funcional",
    icon: Calculator,
    section: 4,
    order: 4.1,
    completed: false,
    fields: [
      {
        id: "rheumatoidArthritisScales",
        label: "🦴 Artritis Reumatoide - Escalas Específicas",
        type: "object",
        condition: "suspectedRA",
        subfields: [
          {
            id: "das28CRP",
            label: "DAS28-CRP (Disease Activity Score)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "tenderJointCount",
                label: "Recuento articulaciones dolorosas (0-28)",
                type: "number",
                min: 0,
                max: 28,
                autoCalculate: true
              },
              {
                id: "swollenJointCount",
                label: "Recuento articulaciones tumefactas (0-28)",
                type: "number",
                min: 0,
                max: 28,
                autoCalculate: true
              },
              {
                id: "crp",
                label: "PCR (mg/L)",
                type: "number",
                min: 0,
                max: 200
              },
              {
                id: "patientGlobalAssessment",
                label: "Evaluación global paciente (0-100)",
                type: "number",
                min: 0,
                max: 100
              }
            ]
          },
          {
            id: "cdai",
            label: "CDAI (Clinical Disease Activity Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "tenderJointCount",
                label: "Articulaciones dolorosas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "swollenJointCount",
                label: "Articulaciones tumefactas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "patientGlobal",
                label: "Evaluación global paciente (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "physicianGlobal",
                label: "Evaluación global médico (0-10)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          },
          {
            id: "sdai",
            label: "SDAI (Simplified Disease Activity Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "tenderJointCount",
                label: "Articulaciones dolorosas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "swollenJointCount",
                label: "Articulaciones tumefactas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "patientGlobal",
                label: "Evaluación global paciente (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "physicianGlobal",
                label: "Evaluación global médico (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "crp",
                label: "PCR (mg/dL)",
                type: "number",
                min: 0,
                max: 20
              }
            ]
          },
          {
            id: "haq",
            label: "HAQ (Health Assessment Questionnaire)",
            type: "object",
            subfields: [
              {
                id: "dressing",
                label: "Vestirse y arreglarse (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "arising",
                label: "Levantarse (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "eating",
                label: "Comer (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "walking",
                label: "Caminar (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "hygiene",
                label: "Higiene (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "reach",
                label: "Alcanzar objetos (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "grip",
                label: "Abrir/cerrar (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "activities",
                label: "Actividades cotidianas (0-3)",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              }
            ]
          }
        ]
      },
      {
        id: "spondyloarthritisScales",
        label: "🔗 Espondiloartritis - Escalas Específicas",
        type: "object",
        condition: "suspectedSpA",
        subfields: [
          {
            id: "basdai",
            label: "BASDAI (Bath Ankylosing Spondylitis Disease Activity Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "fatigue",
                label: "1. Fatiga/cansancio (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "spinalPain",
                label: "2. Dolor cuello, espalda, cadera (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "peripheralPain",
                label: "3. Dolor/hinchazón articulaciones (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "localizedTenderness",
                label: "4. Molestias al tacto (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "morningStiffnessSeverity",
                label: "5. Severidad rigidez matutina (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "morningStiffnessDuration",
                label: "6. Duración rigidez matutina (0-10)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          },
          {
            id: "basfi",
            label: "BASFI (Bath Ankylosing Spondylitis Functional Index)",
            type: "object",
            subfields: [
              {
                id: "socksPutOn",
                label: "1. Ponerse calcetines (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "bendDownPickUp",
                label: "2. Agacharse a recoger (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "reachUpHigh",
                label: "3. Alcanzar estantería alta (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "lightSwitch",
                label: "4. Alcanzar interruptor de pie (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "carFromFloor",
                label: "5. Sacar coche de garaje (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "stairsClimb",
                label: "6. Subir 12-15 escalones (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "lookOverShoulder",
                label: "7. Mirar por encima del hombro (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "physicalActivity",
                label: "8. Actividad física intensa (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "fullDayActivities",
                label: "9. Día completo actividades (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "coping",
                label: "10. Enfrentarse con problemas (0-10)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          }
        ]
      },
      {
        id: "lupusScales",
        label: "🦋 Lupus Eritematoso Sistémico - Escalas Específicas",
        type: "object",
        condition: "suspectedLupus",
        subfields: [
          {
            id: "sledai",
            label: "SLEDAI-2K (SLE Disease Activity Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "seizure",
                label: "Convulsión (reciente) - 8 puntos",
                type: "boolean"
              },
              {
                id: "psychosis",
                label: "Psicosis - 8 puntos",
                type: "boolean"
              },
              {
                id: "organicBrainSyndrome",
                label: "Síndrome cerebral orgánico - 8 puntos",
                type: "boolean"
              },
              {
                id: "visualDisturbance",
                label: "Alteración visual - 8 puntos",
                type: "boolean"
              },
              {
                id: "cranialNerveDisorder",
                label: "Alteración pares craneales - 8 puntos",
                type: "boolean"
              },
              {
                id: "lupusHeadache",
                label: "Cefalea lúpica - 8 puntos",
                type: "boolean"
              },
              {
                id: "cva",
                label: "ACV - 8 puntos",
                type: "boolean"
              },
              {
                id: "vasculitis",
                label: "Vasculitis - 8 puntos",
                type: "boolean"
              },
              {
                id: "arthritis",
                label: "Artritis (2+ articulaciones) - 4 puntos",
                type: "boolean"
              },
              {
                id: "myositis",
                label: "Miositis - 4 puntos",
                type: "boolean"
              },
              {
                id: "urinaryCasts",
                label: "Cilindros urinarios - 4 puntos",
                type: "boolean"
              },
              {
                id: "hematuria",
                label: "Hematuria (>5 GR/campo) - 4 puntos",
                type: "boolean"
              },
              {
                id: "proteinuria",
                label: "Proteinuria (>0.5g/24h) - 4 puntos",
                type: "boolean"
              },
              {
                id: "pyuria",
                label: "Piuria (>5 GB/campo) - 4 puntos",
                type: "boolean"
              },
              {
                id: "rash",
                label: "Exantema - 2 puntos",
                type: "boolean"
              },
              {
                id: "alopecia",
                label: "Alopecia - 2 puntos",
                type: "boolean"
              },
              {
                id: "mucosalUlcers",
                label: "Úlceras mucosas - 2 puntos",
                type: "boolean"
              },
              {
                id: "pleuritis",
                label: "Pleuritis - 2 puntos",
                type: "boolean"
              },
              {
                id: "pericarditis",
                label: "Pericarditis - 2 puntos",
                type: "boolean"
              },
              {
                id: "complementLow",
                label: "Complemento bajo - 2 puntos",
                type: "boolean"
              },
              {
                id: "dnaBinding",
                label: "Anti-DNA elevado - 2 puntos",
                type: "boolean"
              },
              {
                id: "fever",
                label: "Fiebre - 1 punto",
                type: "boolean"
              },
              {
                id: "thrombocytopenia",
                label: "Trombocitopenia (<100,000) - 1 punto",
                type: "boolean"
              },
              {
                id: "leukopenia",
                label: "Leucopenia (<3,000) - 1 punto",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "fibromyalgiaScales",
        label: "💫 Fibromialgia - Evaluación Completa",
        type: "object",
        condition: "suspectedFibromyalgia",
        subfields: [
          {
            id: "widespreadPainIndex",
            label: "WPI (Widespread Pain Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "shoulderGirdleLeft",
                label: "Cintura escapular izquierda",
                type: "boolean"
              },
              {
                id: "shoulderGirdleRight",
                label: "Cintura escapular derecha",
                type: "boolean"
              },
              {
                id: "hipLeft",
                label: "Cadera izquierda",
                type: "boolean"
              },
              {
                id: "hipRight",
                label: "Cadera derecha",
                type: "boolean"
              },
              {
                id: "upperArmLeft",
                label: "Brazo izquierdo",
                type: "boolean"
              },
              {
                id: "upperArmRight",
                label: "Brazo derecho",
                type: "boolean"
              },
              {
                id: "upperLegLeft",
                label: "Pierna izquierda",
                type: "boolean"
              },
              {
                id: "upperLegRight",
                label: "Pierna derecha",
                type: "boolean"
              },
              {
                id: "lowerArmLeft",
                label: "Antebrazo izquierdo",
                type: "boolean"
              },
              {
                id: "lowerArmRight",
                label: "Antebrazo derecho",
                type: "boolean"
              },
              {
                id: "lowerLegLeft",
                label: "Pierna inferior izquierda",
                type: "boolean"
              },
              {
                id: "lowerLegRight",
                label: "Pierna inferior derecha",
                type: "boolean"
              },
              {
                id: "jaw",
                label: "Mandíbula",
                type: "boolean"
              },
              {
                id: "chest",
                label: "Tórax",
                type: "boolean"
              },
              {
                id: "abdomen",
                label: "Abdomen",
                type: "boolean"
              },
              {
                id: "upperBack",
                label: "Espalda superior",
                type: "boolean"
              },
              {
                id: "lowerBack",
                label: "Espalda inferior",
                type: "boolean"
              },
              {
                id: "neck",
                label: "Cuello",
                type: "boolean"
              }
            ]
          },
          {
            id: "symptomSeverity",
            label: "SS (Symptom Severity Scale)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "fatigue",
                label: "Fatiga (0-3)",
                type: "select",
                options: ["0-Sin problema", "1-Problema leve", "2-Problema moderado", "3-Problema severo"]
              },
              {
                id: "wakeUnrefreshed",
                label: "Despertar no reparador (0-3)",
                type: "select",
                options: ["0-Sin problema", "1-Problema leve", "2-Problema moderado", "3-Problema severo"]
              },
              {
                id: "cognitiveSymptoms",
                label: "Síntomas cognitivos (0-3)",
                type: "select",
                options: ["0-Sin problema", "1-Problema leve", "2-Problema moderado", "3-Problema severo"]
              },
              {
                id: "somaticSymptoms",
                label: "Síntomas somáticos generales",
                type: "multiselect",
                options: [
                  "Dolor muscular",
                  "Síndrome colon irritable",
                  "Fatiga/cansancio",
                  "Problemas pensamiento/memoria",
                  "Debilidad muscular",
                  "Cefalea",
                  "Dolor/calambres abdominales",
                  "Entumecimiento/hormigueo",
                  "Mareos",
                  "Insomnio",
                  "Depresión",
                  "Estreñimiento",
                  "Dolor región superior abdomen",
                  "Náuseas",
                  "Nerviosismo",
                  "Dolor torácico",
                  "Visión borrosa",
                  "Fiebre",
                  "Diarrea",
                  "Boca seca",
                  "Picazón",
                  "Pitidos oídos",
                  "Vómitos",
                  "Acidez",
                  "Disminución apetito",
                  "Exantema",
                  "Sensibilidad sol",
                  "Problemas audición",
                  "Moratones fáciles",
                  "Caída cabello",
                  "Orinar frecuente",
                  "Orinar doloroso",
                  "Espasmos vejiga"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. CORRELACIÓN Y DIAGNÓSTICO
  {
    id: "correlationDiagnosis",
    title: "Correlación y Diagnóstico",
    icon: CheckCircle,
    section: 5,
    order: 5.1,
    completed: false,
    fields: [
      {
        id: "automaticClinicalConsistency",
        label: "🎯 Análisis de Consistencia Clínica Automático",
        type: "object",
        subfields: [
          {
            id: "consistencyChecks",
            label: "Validaciones automáticas",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "contradictionAlerts",
            label: "Alertas de contradicción",
            type: "calculated", 
            autoGenerate: true
          }
        ]
      },
      {
        id: "weightedDifferentialDiagnosis",
        label: "📋 Diagnósticos Diferenciales Ponderados",
        type: "object",
        subfields: [
          {
            id: "primaryDiagnosis",
            label: "Diagnóstico principal más probable",
            type: "select",
            options: [
              "Artritis reumatoide",
              "Lupus eritematoso sistémico",
              "Espondiloartritis axial",
              "Artritis psoriásica",
              "Síndrome de Sjögren",
              "Esclerosis sistémica",
              "Polimiositis/dermatomiositis",
              "Vasculitis sistémica",
              "Fibromialgia",
              "Osteoartritis generalizada",
              "Polimialgia reumática",
              "Artritis indiferenciada",
              "Conectivopatía mixta",
              "Síndrome antifosfolípido"
            ],
            autoCalculate: true
          },
          {
            id: "probabilityScore",
            label: "Puntuación de probabilidad (%)",
            type: "number",
            min: 0,
            max: 100,
            autoCalculate: true
          },
          {
            id: "secondaryDiagnoses",
            label: "Diagnósticos alternativos",
            type: "multiselect",
            options: [
              "Artritis reumatoide seronegativa",
              "Lupus inducido por drogas",
              "Artritis reactiva",
              "Artritis séptica",
              "Gota tofácea",
              "Condrocalcinosis",
              "Artropatía degenerativa",
              "Síndrome paraneoplásico",
              "Amiloidosis",
              "Sarcoidosis articular"
            ],
            autoCalculate: true
          }
        ]
      },
      {
        id: "followUpRecommendations",
        label: "📅 Recomendaciones de Seguimiento",
        type: "object",
        subfields: [
          {
            id: "urgencyLevel",
            label: "Nivel de urgencia",
            type: "select",
            options: [
              "🔴 URGENTE: <48h - Derivación inmediata",
              "🟡 PREFERENTE: <2 semanas - Reumatología",
              "🟢 RUTINARIO: <6 semanas - Seguimiento",
              "⚪ OBSERVACIÓN: 3-6 meses - Control"
            ],
            autoCalculate: true
          },
          {
            id: "recommendedStudies",
            label: "Estudios recomendados",
            type: "multiselect",
            options: [
              "Factor reumatoideo + ACPA",
              "ANA + ENA",
              "Anti-dsDNA + Complemento",
              "HLA-B27",
              "ANCA",
              "Anticuerpos antifosfolípido",
              "VSG + PCR",
              "Hemograma + bioquímica",
              "Orina completa",
              "Rx manos y pies",
              "Rx pelvis (sacroilíacas)",
              "Ecografía articular",
              "Capilaroscopia",
              "Densitometría ósea"
            ],
            autoCalculate: true
          },
          {
            id: "therapeuticRecommendations",
            label: "Recomendaciones terapéuticas iniciales",
            type: "multiselect",
            options: [
              "AINES + protección gástrica",
              "Corticosteroides bajo dosis",
              "Metotrexato + ácido fólico",
              "Sulfasalazina",
              "Hidroxicloroquina",
              "Infiltración intraarticular",
              "Fisioterapia",
              "Ejercicio acuático",
              "Educación paciente",
              "Modificación estilo vida"
            ],
            autoCalculate: true
          },
          {
            id: "monitoringParameters",
            label: "Parámetros de monitoreo",
            type: "multiselect",
            options: [
              "Actividad enfermedad (escalas)",
              "Función renal y hepática",
              "Hemograma (si MTX)",
              "Presión arterial",
              "Efectos adversos medicamentos",
              "Calidad de vida",
              "Capacidad funcional",
              "Adherencia tratamiento"
            ],
            autoCalculate: true
          }
        ]
      }
    ]
  }
];

export default function AdvancedRheumatologyForm({ patientData, onDataChange, onComplete }: AdvancedRheumatologyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  const [diagnosticSuspicion, setDiagnosticSuspicion] = useState<string>("");

  // Calcular progreso total
  const progress = useMemo(() => {
    return Math.round((completedSections.size / ADVANCED_RHEUMATOLOGY_SECTIONS.length) * 100);
  }, [completedSections.size]);

  // Motor de alertas contextual
  const checkContextualAlerts = (data: Record<string, any>) => {
    const newAlerts: AlertData[] = [];

    // Alertas críticas
    if (data.septicArthritis) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ SOSPECHA ARTRITIS SÉPTICA - Derivación urgente',
        conditions: ['Fiebre', 'Monoartritis aguda', 'Leucocitosis'],
        priority: 1,
        action: 'Hemocultivos + artrocentesis urgente'
      });
    }

    if (data.systemicVasculitis) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ SOSPECHA VASCULITIS SISTÉMICA - Evaluación inmediata',
        conditions: ['Púrpura palpable', 'Neuropatía', 'Proteinuria'],
        priority: 1,
        action: 'Biopsia + estudios vasculitis'
      });
    }

    if (data.giantCellArteritis) {
      newAlerts.push({
        type: 'red',
        message: '⚠️ SOSPECHA ARTERITIS CÉLULAS GIGANTES - Corticoides urgentes',
        conditions: ['Cefalea', 'Claudicación mandibular', '>50 años'],
        priority: 1,
        action: 'Prednisolona 1mg/kg inmediato + biopsia arterial'
      });
    }

    // Alertas moderadas
    const morningStiffness = data.morningStiffnessDuration;
    const smallJoints = data.smallJointsInvolved;
    const symmetrical = data.symmetricalInvolvement;

    if (morningStiffness > 60 && smallJoints >= 3 && symmetrical) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 Sospecha AR - Completar criterios clasificación',
        conditions: ['Rigidez matutina >60min', 'Articulaciones pequeñas ≥3', 'Simetría'],
        priority: 2,
        action: 'Solicitar RF, ACPA, reactantes fase aguda'
      });
    }

    // Inconsistencias clínicas
    if (morningStiffness > 60 && data.painPattern !== "inflammatory") {
      newAlerts.push({
        type: 'yellow',
        message: '⚠️ Inconsistencia: Rigidez prolongada sugiere patrón inflamatorio',
        conditions: ['Rigidez >60min', 'Patrón no inflamatorio'],
        priority: 3
      });
    }

    setAlerts(newAlerts);
  };

  // Calculadoras específicas
  const calculateDAS28CRP = (data: Record<string, any>): number => {
    const tjc = data.tenderJointCount || 0;
    const sjc = data.swollenJointCount || 0;
    const crp = data.crp || 5;
    const pga = data.patientGlobalAssessment || 50;
    
    const das28 = 0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 
                  0.36 * Math.log(crp + 1) + 0.014 * pga + 0.96;
    return Math.round(das28 * 100) / 100;
  };

  const calculateCDAI = (data: Record<string, any>): number => {
    const tjc = data.tenderJointCount || 0;
    const sjc = data.swollenJointCount || 0;
    const pga = data.patientGlobal || 5;
    const ega = data.physicianGlobal || 5;
    
    return tjc + sjc + pga + ega;
  };

  const calculateSDAI = (data: Record<string, any>): number => {
    const tjc = data.tenderJointCount || 0;
    const sjc = data.swollenJointCount || 0;
    const pga = data.patientGlobal || 5;
    const ega = data.physicianGlobal || 5;
    const crp = data.crp || 0.5;
    
    return tjc + sjc + pga + ega + crp;
  };

  const calculateBASDAI = (data: Record<string, any>): number => {
    const fatigue = data.fatigue || 0;
    const spinalPain = data.spinalPain || 0;
    const peripheralPain = data.peripheralPain || 0;
    const localizedTenderness = data.localizedTenderness || 0;
    const stiffnessSeverity = data.morningStiffnessSeverity || 0;
    const stiffnessDuration = data.morningStiffnessDuration || 0;
    
    const basdai = (fatigue + spinalPain + peripheralPain + localizedTenderness + 
                   (stiffnessSeverity + stiffnessDuration) / 2) / 5;
    return Math.round(basdai * 100) / 100;
  };

  const calculateBASFI = (data: Record<string, any>): number => {
    const fields = [
      'socksPutOn', 'bendDownPickUp', 'reachUpHigh', 'lightSwitch', 'carFromFloor',
      'stairsClimb', 'lookOverShoulder', 'physicalActivity', 'fullDayActivities', 'coping'
    ];
    
    const sum = fields.reduce((total, field) => total + (data[field] || 0), 0);
    return Math.round((sum / 10) * 100) / 100;
  };

  const calculateSLEDAI = (data: Record<string, any>): number => {
    let score = 0;
    
    // 8 puntos
    const eightPointItems = [
      'seizure', 'psychosis', 'organicBrainSyndrome', 'visualDisturbance',
      'cranialNerveDisorder', 'lupusHeadache', 'cva', 'vasculitis'
    ];
    eightPointItems.forEach(item => {
      if (data[item]) score += 8;
    });
    
    // 4 puntos
    const fourPointItems = [
      'arthritis', 'myositis', 'urinaryCasts', 'hematuria', 'proteinuria', 'pyuria'
    ];
    fourPointItems.forEach(item => {
      if (data[item]) score += 4;
    });
    
    // 2 puntos
    const twoPointItems = [
      'rash', 'alopecia', 'mucosalUlcers', 'pleuritis', 'pericarditis',
      'complementLow', 'dnaBinding'
    ];
    twoPointItems.forEach(item => {
      if (data[item]) score += 2;
    });
    
    // 1 punto
    const onePointItems = ['fever', 'thrombocytopenia', 'leukopenia'];
    onePointItems.forEach(item => {
      if (data[item]) score += 1;
    });
    
    return score;
  };

  const calculateFibromyalgiaScore = (data: Record<string, any>): { wpi: number, ss: number, total: number } => {
    // WPI calculation
    const wpiFields = [
      'shoulderGirdleLeft', 'shoulderGirdleRight', 'hipLeft', 'hipRight',
      'upperArmLeft', 'upperArmRight', 'upperLegLeft', 'upperLegRight',
      'lowerArmLeft', 'lowerArmRight', 'lowerLegLeft', 'lowerLegRight',
      'jaw', 'chest', 'abdomen', 'upperBack', 'lowerBack', 'neck'
    ];
    
    const wpi = wpiFields.reduce((count, field) => count + (data[field] ? 1 : 0), 0);
    
    // SS calculation
    const fatigue = parseInt(data.fatigue?.charAt(0) || '0');
    const wakeUnrefreshed = parseInt(data.wakeUnrefreshed?.charAt(0) || '0');
    const cognitiveSymptoms = parseInt(data.cognitiveSymptoms?.charAt(0) || '0');
    
    const somaticCount = (data.somaticSymptoms || []).length;
    const somaticScore = somaticCount === 0 ? 0 : somaticCount <= 3 ? 1 : somaticCount <= 6 ? 2 : 3;
    
    const ss = fatigue + wakeUnrefreshed + cognitiveSymptoms + somaticScore;
    
    return { wpi, ss, total: wpi + ss };
  };

  // Actualizar calculadoras
  const updateCalculators = (data: Record<string, any>) => {
    const results: CalculatorResult[] = [];

    // DAS28-CRP para AR
    if (data.suspectedRA || diagnosticSuspicion === "RA") {
      const das28 = calculateDAS28CRP(data);
      results.push({
        name: 'DAS28-CRP',
        value: das28,
        interpretation: das28 > 5.1 ? 'Actividad alta' : das28 > 3.2 ? 'Actividad moderada' : das28 > 2.6 ? 'Actividad baja' : 'Remisión',
        color: das28 > 5.1 ? '#ef4444' : das28 > 3.2 ? '#f59e0b' : das28 > 2.6 ? '#3b82f6' : '#10b981',
        alert: das28 > 5.1,
        recommendation: das28 > 5.1 ? 'Intensificar terapia - Considerar biológicos' : 
                       das28 > 3.2 ? 'Ajustar DMARDs' : 
                       das28 > 2.6 ? 'Mantener terapia' : 'Considerar reducción',
        classification: das28 > 5.1 ? 'ALTA' : das28 > 3.2 ? 'MODERADA' : das28 > 2.6 ? 'BAJA' : 'REMISIÓN'
      });

      const cdai = calculateCDAI(data);
      results.push({
        name: 'CDAI',
        value: cdai,
        interpretation: cdai > 22 ? 'Actividad alta' : cdai > 10 ? 'Actividad moderada' : cdai > 2.8 ? 'Actividad baja' : 'Remisión',
        color: cdai > 22 ? '#ef4444' : cdai > 10 ? '#f59e0b' : cdai > 2.8 ? '#3b82f6' : '#10b981',
        alert: cdai > 22
      });

      const sdai = calculateSDAI(data);
      results.push({
        name: 'SDAI',
        value: sdai,
        interpretation: sdai > 26 ? 'Actividad alta' : sdai > 11 ? 'Actividad moderada' : sdai > 3.3 ? 'Actividad baja' : 'Remisión',
        color: sdai > 26 ? '#ef4444' : sdai > 11 ? '#f59e0b' : sdai > 3.3 ? '#3b82f6' : '#10b981',
        alert: sdai > 26
      });
    }

    // BASDAI/BASFI para SpA
    if (data.suspectedSpA || diagnosticSuspicion === "SpA") {
      const basdai = calculateBASDAI(data);
      results.push({
        name: 'BASDAI',
        value: basdai,
        interpretation: basdai >= 4 ? 'Actividad alta - Considerar biológicos' : 'Actividad aceptable',
        color: basdai >= 4 ? '#ef4444' : '#10b981',
        alert: basdai >= 4,
        recommendation: basdai >= 4 ? 'Anti-TNF candidato' : 'AINES + ejercicio'
      });

      const basfi = calculateBASFI(data);
      results.push({
        name: 'BASFI',
        value: basfi,
        interpretation: basfi >= 4 ? 'Limitación funcional severa' : 'Función preservada',
        color: basfi >= 4 ? '#f59e0b' : '#10b981',
        alert: basfi >= 4
      });
    }

    // SLEDAI para Lupus
    if (data.suspectedLupus || diagnosticSuspicion === "Lupus") {
      const sledai = calculateSLEDAI(data);
      results.push({
        name: 'SLEDAI-2K',
        value: sledai,
        interpretation: sledai >= 12 ? 'Actividad severa' : sledai >= 6 ? 'Actividad moderada' : sledai >= 1 ? 'Actividad leve' : 'Inactivo',
        color: sledai >= 12 ? '#ef4444' : sledai >= 6 ? '#f59e0b' : sledai >= 1 ? '#3b82f6' : '#10b981',
        alert: sledai >= 12,
        recommendation: sledai >= 12 ? 'Inmunosupresión intensiva' : 
                       sledai >= 6 ? 'Ajustar inmunosupresión' : 
                       sledai >= 1 ? 'Mantener tratamiento' : 'Seguimiento'
      });
    }

    // Fibromialgia
    if (data.suspectedFibromyalgia || diagnosticSuspicion === "Fibromyalgia") {
      const fibromyalgiaScore = calculateFibromyalgiaScore(data);
      results.push({
        name: 'Fibromialgia',
        value: `WPI:${fibromyalgiaScore.wpi} SS:${fibromyalgiaScore.ss}`,
        interpretation: (fibromyalgiaScore.wpi >= 7 && fibromyalgiaScore.ss >= 5) || 
                       (fibromyalgiaScore.wpi >= 3 && fibromyalgiaScore.ss >= 9) ? 
                       'Cumple criterios ACR 2010' : 'No cumple criterios',
        color: (fibromyalgiaScore.wpi >= 7 && fibromyalgiaScore.ss >= 5) || 
               (fibromyalgiaScore.wpi >= 3 && fibromyalgiaScore.ss >= 9) ? 
               '#ef4444' : '#10b981',
        alert: (fibromyalgiaScore.wpi >= 7 && fibromyalgiaScore.ss >= 5) || 
               (fibromyalgiaScore.wpi >= 3 && fibromyalgiaScore.ss >= 9)
      });
    }

    setCalculatorResults(results);
  };

  // Algoritmo diagnóstico automático
  const determineAutomaticSuspicion = (data: Record<string, any>): string => {
    // Algoritmo: Dolor articular → Rigidez matutina >60min → Articulaciones pequeñas → AR
    if (data.morningStiffnessDuration > 60 && data.smallJointsInvolved >= 3 && data.symmetricalInvolvement) {
      return "RA";
    }
    
    // Dolor lumbar inflamatorio + joven → SpA
    if (data.organSystemInvolvement?.includes("Dolor lumbar inflamatorio") && data.age < 45) {
      return "SpA";
    }
    
    // Eritema malar + fotosensibilidad → Lupus
    if (data.organSystemInvolvement?.includes("Eritema malar") && data.organSystemInvolvement?.includes("Fotosensibilidad")) {
      return "Lupus";
    }
    
    // Dolor generalizado + fatiga → Fibromialgia
    if (data.constitutionalSymptoms?.includes("Fatiga severa") && data.smallJointsInvolved === 0) {
      return "Fibromyalgia";
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
    
    // Verificar alertas y calculadoras
    checkContextualAlerts(newFormData);
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

    // Mostrar campos condicionales
    if (field.condition && !formData[field.condition] && diagnosticSuspicion !== field.condition?.replace('suspected', '')) {
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
              <Badge variant="outline" className="text-xs text-blue-600">
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
            {field.autoInterpret && value && (
              <div className="mt-1 text-sm text-blue-600">
                {field.label.includes("Rigidez matutina") && value > 60 && "Sugestivo de inflamación"}
                {field.label.includes("Articulaciones pequeñas") && value >= 3 && "Patrón típico AR"}
              </div>
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
                    Las validaciones y alertas se generan automáticamente basadas en los datos ingresados.
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

  const currentSectionData = ADVANCED_RHEUMATOLOGY_SECTIONS[currentSection];
  const isLastSection = currentSection === ADVANCED_RHEUMATOLOGY_SECTIONS.length - 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado con progreso y alertas */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bone className="h-8 w-8 text-purple-600" />
              Sistema Reumatológico Optimizado
            </h1>
            <p className="text-gray-600 mt-1">
              Evaluación sistemática con triage urgente, escalas específicas y correlación diagnóstica
            </p>
            {patientData && (
              <div className="flex items-center gap-3 mt-4 bg-purple-100/40 rounded-xl px-4 py-2 border border-purple-200">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900 font-semibold">
                  {patientData.name} {patientData.surname}
                  {patientData.age && (
                    <span className="ml-2 text-gray-700 font-normal">({patientData.age} años{patientData.gender ? `, ${patientData.gender}` : ""})</span>
                  )}
                </span>
              </div>
            )}
            {diagnosticSuspicion && (
              <div className="mt-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Sospecha: {diagnosticSuspicion === "RA" ? "Artritis Reumatoide" : 
                           diagnosticSuspicion === "SpA" ? "Espondiloartritis" :
                           diagnosticSuspicion === "Lupus" ? "Lupus Eritematoso Sistémico" :
                           diagnosticSuspicion === "Fibromyalgia" ? "Fibromialgia" : diagnosticSuspicion}
                </Badge>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
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
              {alert.action && (
                <div className="mt-1 text-sm font-bold">
                  ACCIÓN: {alert.action}
                </div>
              )}
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

      {/* Navegación por secciones */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(section => (
          <div 
            key={section}
            className={`p-3 text-center rounded-lg border-2 transition-all ${
              ADVANCED_RHEUMATOLOGY_SECTIONS[currentSection]?.section === section
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="font-bold">SECCIÓN {section}</div>
            <div className="text-xs mt-1">
              {section === 1 && "Triage"}
              {section === 2 && "Anamnesis"}
              {section === 3 && "Examen"}
              {section === 4 && "Escalas"}
              {section === 5 && "Correlación"}
            </div>
          </div>
        ))}
      </div>

      {/* Calculadoras en tiempo real */}
      {calculatorResults.length > 0 && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Escalas Reumatológicas en Tiempo Real
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calculatorResults.map((result) => (
              <div 
                key={result.name}
                className={`p-3 rounded-lg border-2 ${
                  result.alert ? 'border-red-300 bg-red-50' : 'border-green-200 bg-white'
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

      {/* Sección actual */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-3">
              <currentSectionData.icon className="h-6 w-6 text-purple-600" />
              <span>
                {currentSectionData.section}. {currentSectionData.title}
              </span>
              {currentSectionData.critical && (
                <Badge variant="destructive">Crítico</Badge>
              )}
            </CardTitle>
            <Badge variant="outline">
              Sección {currentSection + 1} de {ADVANCED_RHEUMATOLOGY_SECTIONS.length}
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
              onClick={() => setCurrentSection(Math.min(ADVANCED_RHEUMATOLOGY_SECTIONS.length - 1, currentSection + 1))}
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}