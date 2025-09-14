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
  AlertTriangle, 
  Shield,
  Brain,
  Stethoscope,
  Calculator,
  CheckCircle,
  Clock,
  Eye,
  Hand, 
  Activity,
  Target,
  Zap,
  HeartHandshake,
  Bone,
  FlaskConical,
  TrendingUp,
  User,
  Users
} from "lucide-react";

interface AdvancedTraumatologyFormProps {
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
  emergencyProtocol?: string;
}

interface CalculatorResult {
  name: string;
  value: number | string;
  interpretation: string;
  color: string;
  alert?: boolean;
  recommendation?: string;
}

const ADVANCED_MUSCULOSKELETAL_SECTIONS: FormSection[] = [
  // FASE 0: TRIAGE INMEDIATO (2-3 minutos)
  {
    id: "immediateTriageFlags",
    title: "Triage Inmediato - Banderas Rojas",
    icon: Shield,
    phase: 0,
    order: 0.1,
    completed: false,
    critical: true,
    fields: [
      {
        id: "emergencyFlags",
        label: "🚨 Banderas Rojas Críticas (18 ítems obligatorios)",
        type: "object",
        subfields: [
          {
            id: "vascularCompromise",
            label: "1. Compromiso vascular (ausencia pulsos distales)",
            type: "boolean",
            emergency: true,
            protocol: "QUIRÓFANO URGENTE"
          },
          {
            id: "neurologicalDeficit",
            label: "2. Déficit neurológico progresivo",
            type: "boolean",
            emergency: true,
            protocol: "EVALUACIÓN NEUROLÓGICA URGENTE"
          },
          {
            id: "compartmentSyndrome",
            label: "3. Sospecha síndrome compartimental (5 P's)",
            type: "boolean",
            emergency: true,
            protocol: "FASCIOTOMÍA URGENTE"
          },
          {
            id: "openFracture",
            label: "4. Fractura abierta con deformidad evidente",
            type: "boolean",
            emergency: true,
            protocol: "QUIRÓFANO URGENTE + ANTIBIÓTICOS"
          },
          {
            id: "multiTrauma",
            label: "5. Politraumatismo con inestabilidad hemodinámica",
            type: "boolean",
            emergency: true,
            protocol: "TRAUMA TEAM + UCI"
          },
          {
            id: "caudaEquina",
            label: "6. Síndrome de cola de caballo (retención urinaria + anestesia silla)",
            type: "boolean",
            emergency: true,
            protocol: "RM INMEDIATA + DESCOMPRESIÓN"
          },
          {
            id: "septicArthritis",
            label: "7. Sospecha artritis séptica (articulación caliente + fiebre)",
            type: "boolean",
            emergency: true,
            protocol: "PUNCIÓN ARTICULAR URGENTE"
          },
          {
            id: "cervicalMyelopathy",
            label: "8. Mielopatía cervical aguda",
            type: "boolean",
            emergency: true,
            protocol: "INMOVILIZACIÓN + RM URGENTE"
          },
          {
            id: "pathologicalFracture",
            label: "9. Fractura patológica con sospecha malignidad",
            type: "boolean",
            emergency: false,
            protocol: "EVALUACIÓN ONCOLÓGICA URGENTE"
          },
          {
            id: "massiveHemarthrosis",
            label: "10. Hemartrosis masiva",
            type: "boolean",
            emergency: false,
            protocol: "EVALUACIÓN VASCULAR + PUNCIÓN"
          },
          {
            id: "progressiveMyelopathy",
            label: "11. Mielopatía progresiva",
            type: "boolean",
            emergency: true,
            protocol: "RM + DESCOMPRESIÓN URGENTE"
          },
          {
            id: "severeDeformity",
            label: "12. Deformidad severa con compromiso neurovascular",
            type: "boolean",
            emergency: true,
            protocol: "REDUCCIÓN + ESTABILIZACIÓN"
          },
          {
            id: "unstableSpine",
            label: "13. Inestabilidad espinal",
            type: "boolean",
            emergency: true,
            protocol: "INMOVILIZACIÓN + FUSION"
          },
          {
            id: "crushSyndrome",
            label: "14. Síndrome de aplastamiento",
            type: "boolean",
            emergency: true,
            protocol: "MANEJO RABDOMIOLISIS"
          },
          {
            id: "fatEmbolism",
            label: "15. Embolia grasa",
            type: "boolean",
            emergency: true,
            protocol: "SOPORTE RESPIRATORIO"
          },
          {
            id: "gasGangrene",
            label: "16. Gangrena gaseosa",
            type: "boolean",
            emergency: true,
            protocol: "DESBRIDAMIENTO + ANTIBIÓTICOS"
          },
          {
            id: "acuteMI",
            label: "17. Infarto agudo de miocardio post-trauma",
            type: "boolean",
            emergency: true,
            protocol: "CARDIOLOGÍA + UCI"
          },
          {
            id: "tensionPneumothorax",
            label: "18. Neumotórax a tensión",
            type: "boolean",
            emergency: true,
            protocol: "DESCOMPRESIÓN INMEDIATA"
          }
        ]
      },
      {
        id: "urgencyStratification",
        label: "🚦 Estratificación de Urgencia",
        type: "select",
        options: [
          "🔴 ALTO RIESGO: Atención inmediata (<30 min)",
          "🟡 RIESGO MEDIO: Evaluación prioritaria (<4h)",
          "🟢 BAJO RIESGO: Evaluación programada (<24h)"
        ],
        autoCalculate: true
      },
      {
        id: "urgentStudies",
        label: "📋 Estudios Urgentes Requeridos",
        type: "multiselect",
        options: [
          "Rx urgente",
          "TAC sin contraste",
          "TAC con contraste",
          "RM inmediata",
          "Eco-Doppler vascular",
          "Arteriografía",
          "Punción articular",
          "Hemocultivos",
          "Laboratorio completo"
        ],
        autoCalculate: true
      }
    ]
  },

  // FASE 1: ANAMNESIS DIRIGIDA INTELIGENTE
  {
    id: "intelligentAnamnesis",
    title: "Anamnesis Dirigida Inteligente - ALICIA Expandida",
    icon: Brain,
    phase: 1,
    order: 1.1,
    completed: false,
    fields: [
      {
        id: "aliciaExpanded",
        label: "📋 ALICIA Expandida con Validación Cruzada",
        type: "object",
        subfields: [
          {
            id: "allergyReactions",
            label: "A - Alergias (medicamentos, materiales)",
            type: "textarea",
            placeholder: "Detallar alergias conocidas, reacciones previas"
          },
          {
            id: "lastMeal",
            label: "L - Última ingesta (para cirugía urgente)",
            type: "text",
            placeholder: "Hora de última comida/líquidos"
          },
          {
            id: "illnessHistory",
            label: "I - Enfermedad actual (cronología detallada)",
            type: "textarea",
            placeholder: "Secuencia temporal precisa del evento"
          },
          {
            id: "currentMedications",
            label: "C - Medicación actual",
            type: "object",
            subfields: [
              {
                id: "medications",
                label: "Medicamentos actuales",
                type: "textarea",
                placeholder: "Incluir anticoagulantes, corticoides, inmunosupresores"
              },
              {
                id: "anticoagulants",
                label: "Anticoagulantes/Antiagregantes",
                type: "boolean"
              },
              {
                id: "steroids",
                label: "Corticosteroides crónicos",
                type: "boolean"
              },
              {
                id: "immunosuppressants",
                label: "Inmunosupresores",
                type: "boolean"
              }
            ]
          },
          {
            id: "personalHistory",
            label: "A - Antecedentes personales específicos",
            type: "object",
            subfields: [
              {
                id: "previousFractures",
                label: "Fracturas previas",
                type: "textarea",
                placeholder: "Detallar fracturas previas, complicaciones"
              },
              {
                id: "previousSurgeries",
                label: "Cirugías ortopédicas previas",
                type: "textarea",
                placeholder: "Incluir implantes, prótesis"
              },
              {
                id: "rheumatologicalDisease",
                label: "Enfermedad reumatológica",
                type: "select",
                options: ["Ninguna", "Artritis reumatoide", "Lupus", "Espondiloartritis", "Artritis psoriásica", "Fibromialgia", "Gota", "Osteoartrosis"]
              },
              {
                id: "osteoporosis",
                label: "Osteoporosis/Osteopenia",
                type: "boolean"
              },
              {
                id: "metabolicDisorders",
                label: "Trastornos metabólicos",
                type: "multiselect",
                options: ["Diabetes", "Hipotiroidismo", "Hiperparatiroidismo", "Enfermedad renal crónica"]
              }
            ]
          }
        ]
      },
      {
        id: "functionalImpactAssessment",
        label: "⚡ Evaluación Impacto Funcional",
        type: "object",
        subfields: [
          {
            id: "preInjuryFunctionLevel",
            label: "Nivel funcional previo",
            type: "select",
            options: ["Independiente completo", "Independiente con ayudas", "Dependiente parcial", "Dependiente total"]
          },
          {
            id: "occupationalImpact",
            label: "Impacto laboral",
            type: "object",
            subfields: [
              {
                id: "workType",
                label: "Tipo de trabajo",
                type: "select",
                options: ["Sedentario", "Demanda física ligera", "Demanda física moderada", "Demanda física alta", "Jubilado", "Sin empleo"]
              },
              {
                id: "workLimitations",
                label: "Limitaciones laborales actuales",
                type: "multiselect",
                options: ["Ninguna", "No puede cargar peso", "No puede caminar distancias", "No puede estar de pie", "No puede usar extremidad superior"]
              }
            ]
          },
          {
            id: "sportsActivity",
            label: "Actividad deportiva",
            type: "object",
            subfields: [
              {
                id: "sportsLevel",
                label: "Nivel deportivo",
                type: "select",
                options: ["No practica", "Recreativo", "Competitivo amateur", "Profesional"]
              },
              {
                id: "returnToSportsGoal",
                label: "Objetivo de retorno deportivo",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "psychosocialFactors",
        label: "🧠 Factores Psicosociales",
        type: "object",
        subfields: [
          {
            id: "painCatastrophizing",
            label: "Catastrofización del dolor",
            type: "select",
            options: ["Ausente", "Leve", "Moderada", "Severa"]
          },
          {
            id: "anxietyDepression",
            label: "Ansiedad/Depresión",
            type: "select",
            options: ["Ausente", "Leve", "Moderada", "Severa", "Diagnóstico previo"]
          },
          {
            id: "socialSupport",
            label: "Soporte social",
            type: "select",
            options: ["Excelente", "Bueno", "Limitado", "Ausente"]
          },
          {
            id: "litigationStatus",
            label: "Proceso legal/compensación",
            type: "boolean"
          }
        ]
      }
    ]
  },

  // FASE 2: EXPLORACIÓN FÍSICA SISTEMÁTICA ADAPTATIVA
  // 2.1 INSPECCIÓN GENERAL DIRIGIDA
  {
    id: "directedGeneralInspection",
    title: "Inspección General Dirigida por Sospecha",
    icon: Eye,
    phase: 2,
    order: 2.1,
    completed: false,
    fields: [
      {
        id: "generalAppearance",
        label: "👤 Apariencia General",
        type: "object",
        subfields: [
          {
            id: "posture",
            label: "Postura",
            type: "select",
            options: ["Normal", "Antiálgica", "Rígida", "Escoliótica", "Cifótica", "Lordótica"]
          },
          {
            id: "gait",
            label: "Marcha",
            type: "select",
            options: ["Normal", "Antiálgica", "Claudicante", "Trendelenburg", "Steppage", "Imposible"]
          },
          {
            id: "functionalPosition",
            label: "Posición funcional extremidades",
            type: "select",
            options: ["Mantiene posiciones funcionales", "Posición antiálgica", "Deformidad evidente", "Pérdida función completa"]
          }
        ]
      },
      {
        id: "deformityAssessment",
        label: "🔍 Evaluación de Deformidades",
        type: "object",
        subfields: [
          {
            id: "angularDeformity",
            label: "Deformidad angular",
            type: "multiselect",
            options: ["Ausente", "Varus", "Valgus", "Recurvatum", "Antecurvatum", "Rotacional"]
          },
          {
            id: "lengthDiscrepancy",
            label: "Dismetría aparente",
            type: "boolean"
          },
          {
            id: "swellingDistribution",
            label: "Distribución del edema",
            type: "select",
            options: ["Ausente", "Localizado", "Segmentario", "Generalizado de extremidad"]
          },
          {
            id: "skinChanges",
            label: "Cambios cutáneos",
            type: "multiselect",
            options: ["Normales", "Equimosis", "Hematoma", "Laceración", "Desgarro", "Flictenas", "Necrosis"]
          }
        ]
      }
    ]
  },

  // 2.2 EVALUACIÓN POR SISTEMAS CON ALGORITMOS BIFURCADOS
  {
    id: "systemBasedEvaluation",
    title: "Evaluación por Sistemas - Algoritmos Bifurcados",
    icon: Target,
    phase: 2,
    order: 2.2,
    completed: false,
    fields: [
      {
        id: "spinalAssessment",
        label: "🦴 Columna Vertebral",
        type: "object",
        condition: "spinalPain",
        subfields: [
          {
            id: "cervicalRange",
            label: "Rango cervical",
            type: "object",
            subfields: [
              {
                id: "flexion",
                label: "Flexión (0-50°)",
                type: "number",
                min: 0,
                max: 50
              },
              {
                id: "extension",
                label: "Extensión (0-60°)",
                type: "number",
                min: 0,
                max: 60
              },
              {
                id: "lateralBending",
                label: "Flexión lateral (0-45° cada lado)",
                type: "number",
                min: 0,
                max: 45
              },
              {
                id: "rotation",
                label: "Rotación (0-80° cada lado)",
                type: "number",
                min: 0,
                max: 80
              }
            ]
          },
          {
            id: "lumbarRange",
            label: "Rango lumbar",
            type: "object",
            subfields: [
              {
                id: "flexion",
                label: "Flexión (Schober modificado cm)",
                type: "number",
                min: 0,
                max: 15
              },
              {
                id: "extension",
                label: "Extensión",
                type: "select",
                options: ["Normal", "Limitada", "Muy limitada", "Dolorosa"]
              }
            ]
          },
          {
            id: "neurologicalTesting",
            label: "Evaluación neurológica",
            type: "object",
            subfields: [
              {
                id: "straightLegRaise",
                label: "Lasègue (grados)",
                type: "number",
                min: 0,
                max: 90
              },
              {
                id: "crossedStraightLeg",
                label: "Lasègue cruzado",
                type: "boolean"
              },
              {
                id: "spurling",
                label: "Test de Spurling",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "peripheralJointsAssessment",
        label: "🔗 Articulaciones Periféricas",
        type: "object",
        subfields: [
          {
            id: "shoulderExam",
            label: "Hombro",
            type: "object",
            subfields: [
              {
                id: "painfulArc",
                label: "Arco doloroso",
                type: "boolean"
              },
              {
                id: "impingementSigns",
                label: "Signos de pinzamiento",
                type: "multiselect",
                options: ["Neer", "Hawkins-Kennedy", "Jobe"]
              },
              {
                id: "rotatorCuffStrength",
                label: "Fuerza manguito rotador",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              }
            ]
          },
          {
            id: "kneeExam",
            label: "Rodilla",
            type: "object",
            subfields: [
              {
                id: "mcMurray",
                label: "McMurray (meniscos)",
                type: "select",
                options: ["Negativo", "Positivo medial", "Positivo lateral", "Positivo bilateral"]
              },
              {
                id: "lachman",
                label: "Lachman (LCA)",
                type: "select",
                options: ["Negativo", "1+ (5mm)", "2+ (10mm)", "3+ (>10mm)"]
              },
              {
                id: "valgusStress",
                label: "Bostezo valgo (LCM)",
                type: "select",
                options: ["Negativo", "1+ (5mm)", "2+ (10mm)", "3+ (>10mm)"]
              },
              {
                id: "varusStress",
                label: "Bostezo varo (LCL)",
                type: "select",
                options: ["Negativo", "1+ (5mm)", "2+ (10mm)", "3+ (>10mm)"]
              }
            ]
          },
          {
            id: "hipExam",
            label: "Cadera",
            type: "object",
            subfields: [
              {
                id: "faberTest",
                label: "FABER (Patrick)",
                type: "boolean"
              },
              {
                id: "thomasTest",
                label: "Thomas (contractura flexión)",
                type: "boolean"
              },
              {
                id: "trendelenburg",
                label: "Trendelenburg",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "muscleStrengthMRC",
        label: "💪 Fuerza Muscular MRC Expandida",
        type: "object",
        subfields: [
          {
            id: "upperExtremityStrength",
            label: "Extremidad Superior",
            type: "object",
            subfields: [
              {
                id: "shoulderAbduction",
                label: "Abducción hombro (C5)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "elbowFlexion",
                label: "Flexión codo (C6)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "wristExtension",
                label: "Extensión muñeca (C7)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "fingerFlexion",
                label: "Flexión dedos (C8)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "fingerAbduction",
                label: "Separación dedos (T1)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              }
            ]
          },
          {
            id: "lowerExtremityStrength",
            label: "Extremidad Inferior",
            type: "object",
            subfields: [
              {
                id: "hipFlexion",
                label: "Flexión cadera (L2)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "kneeExtension",
                label: "Extensión rodilla (L3)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "ankleDorsiflexion",
                label: "Dorsiflexión tobillo (L4)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "extensorHallucis",
                label: "Extensión dedo gordo (L5)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              },
              {
                id: "plantarFlexion",
                label: "Flexión plantar (S1)",
                type: "select",
                options: ["5/5 Normal", "4/5 Buena", "3/5 Regular", "2/5 Pobre", "1/5 Vestigios", "0/5 Ausente"]
              }
            ]
          }
        ]
      }
    ]
  },

  // FASE 3: ESCALAS Y CRITERIOS ESPECÍFICOS
  {
    id: "specificScalesCriteria",
    title: "Escalas y Criterios Específicos",
    icon: Calculator,
    phase: 3,
    order: 3.1,
    completed: false,
    fields: [
      {
        id: "rheumatoidArthritisScales",
        label: "🦴 Artritis Reumatoide",
        type: "object",
        condition: "suspectedRA",
        subfields: [
          {
            id: "das28",
            label: "DAS28 (Disease Activity Score)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "tenderJoints",
                label: "Articulaciones dolorosas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "swollenJoints", 
                label: "Articulaciones tumefactas (0-28)",
                type: "number",
                min: 0,
                max: 28
              },
              {
                id: "esr",
                label: "VSG (mm/h)",
                type: "number",
                min: 0,
                max: 150
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
            id: "haq",
            label: "HAQ (Health Assessment Questionnaire)",
            type: "object",
            subfields: [
              {
                id: "dressing",
                label: "Vestirse y arreglarse",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "arising",
                label: "Levantarse",
                type: "select", 
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "eating",
                label: "Comer",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              },
              {
                id: "walking",
                label: "Caminar",
                type: "select",
                options: ["0-Sin dificultad", "1-Alguna dificultad", "2-Mucha dificultad", "3-Imposible"]
              }
            ]
          },
          {
            id: "acrEularCriteria",
            label: "Criterios ACR/EULAR 2010",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "jointInvolvement",
                label: "Afectación articular",
                type: "select",
                options: [
                  "1 articulación grande (0 puntos)",
                  "2-10 articulaciones grandes (1 punto)",
                  "1-3 articulaciones pequeñas (2 puntos)",
                  "4-10 articulaciones pequeñas (3 puntos)",
                  ">10 articulaciones (5 puntos)"
                ]
              },
              {
                id: "serology",
                label: "Serología",
                type: "select",
                options: [
                  "FR y ACPA negativos (0 puntos)",
                  "FR o ACPA bajo positivo (2 puntos)",
                  "FR o ACPA alto positivo (3 puntos)"
                ]
              },
              {
                id: "acutePhaseReactants",
                label: "Reactantes fase aguda",
                type: "select",
                options: [
                  "PCR y VSG normales (0 puntos)",
                  "PCR o VSG elevados (1 punto)"
                ]
              },
              {
                id: "symptomDuration",
                label: "Duración síntomas",
                type: "select",
                options: [
                  "<6 semanas (0 puntos)",
                  "≥6 semanas (1 punto)"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "spondyloarthritisScales",
        label: "🔗 Espondiloartritis",
        type: "object",
        condition: "suspectedSpA",
        subfields: [
          {
            id: "basdai",
            label: "BASDAI (Bath AS Disease Activity Index)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "fatigue",
                label: "Fatiga/cansancio (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "spinalPain",
                label: "Dolor columna (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "jointPainSwelling",
                label: "Dolor/hinchazón articulaciones (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "localizedTenderness",
                label: "Sensibilidad localizada (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "morningStiffnessSeverity",
                label: "Severidad rigidez matutina (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "morningStiffnessDuration",
                label: "Duración rigidez matutina (0-10)",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          },
          {
            id: "basfi",
            label: "BASFI (Bath AS Functional Index)",
            type: "object",
            subfields: [
              {
                id: "socksPutOn",
                label: "Ponerse calcetines sin ayuda",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "bendDown",
                label: "Agacharse desde posición erguida",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "reachUp",
                label: "Alcanzar objetos en estantería alta",
                type: "number",
                min: 0,
                max: 10
              }
            ]
          },
          {
            id: "asasCriteria",
            label: "Criterios ASAS",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "backPainOnset",
                label: "Inicio dolor espalda <45 años",
                type: "boolean"
              },
              {
                id: "chronicBackPain",
                label: "Dolor espalda crónico ≥3 meses",
                type: "boolean"
              },
              {
                id: "inflammatoryBackPain",
                label: "Dolor espalda inflamatorio",
                type: "boolean"
              },
              {
                id: "hlaB27",
                label: "HLA-B27 positivo",
                type: "boolean"
              }
            ]
          }
        ]
      },
      {
        id: "osteoarthritisScales",
        label: "🔧 Artrosis",
        type: "object",
        condition: "suspectedOA",
        subfields: [
          {
            id: "womac",
            label: "WOMAC (Western Ontario McMaster)",
            type: "object",
            autoCalculate: true,
            subfields: [
              {
                id: "painScore",
                label: "Dolor (0-20)",
                type: "number",
                min: 0,
                max: 20
              },
              {
                id: "stiffnessScore",
                label: "Rigidez (0-8)",
                type: "number",
                min: 0,
                max: 8
              },
              {
                id: "functionScore",
                label: "Función física (0-68)",
                type: "number",
                min: 0,
                max: 68
              }
            ]
          },
          {
            id: "lequesneIndex",
            label: "Índice de Lequesne (cadera)",
            type: "object",
            condition: "hipOA",
            subfields: [
              {
                id: "painDiscomfort",
                label: "Dolor/molestias (0-10)",
                type: "number",
                min: 0,
                max: 10
              },
              {
                id: "maxDistanceWalked",
                label: "Distancia máxima caminada",
                type: "select",
                options: [
                  "Sin límite (0)",
                  ">1 km pero limitada (1)",
                  "Alrededor 1 km (2)",
                  "500-900m (3)",
                  "300-500m (4)",
                  "100-300m (5)",
                  "<100m (6)"
                ]
              }
            ]
          }
        ]
      },
      {
        id: "painFunctionalityScales",
        label: "😣 Dolor y Funcionalidad",
        type: "object",
        subfields: [
          {
            id: "vasScale",
            label: "EVA Dolor (0-10)",
            type: "number",
            min: 0,
            max: 10
          },
          {
            id: "painCatastrophizing",
            label: "Escala Catastrofización Dolor",
            type: "object",
            subfields: [
              {
                id: "rumination",
                label: "Rumiación (0-16)",
                type: "number",
                min: 0,
                max: 16
              },
              {
                id: "magnification",
                label: "Magnificación (0-12)",
                type: "number",
                min: 0,
                max: 12
              },
              {
                id: "helplessness",
                label: "Desesperanza (0-24)",
                type: "number",
                min: 0,
                max: 24
              }
            ]
          },
          {
            id: "workProductivityIndex",
            label: "Índice Productividad Laboral",
            type: "object",
            subfields: [
              {
                id: "workTimeMissed",
                label: "% tiempo trabajo perdido (0-100)",
                type: "number",
                min: 0,
                max: 100
              },
              {
                id: "workProductivityAffected",
                label: "% productividad afectada (0-100)",
                type: "number",
                min: 0,
                max: 100
              }
            ]
          }
        ]
      }
    ]
  },

  // FASE 4: SÍNTESIS Y PLAN
  {
    id: "synthesisAutomatedPlan",
    title: "Síntesis y Plan - Correlación Clínica Automatizada",
    icon: CheckCircle,
    phase: 4,
    order: 4.1,
    completed: false,
    fields: [
      {
        id: "automatedClinicalCorrelation",
        label: "🎯 Correlación Clínica Automatizada",
        type: "object",
        subfields: [
          {
            id: "primarySyndrome",
            label: "Síndrome musculoesquelético principal",
            type: "select",
            options: [
              "Dolor articular monoarticular agudo",
              "Poliartritis simétrica",
              "Poliartritis asimétrica", 
              "Lumbalgia mecánica",
              "Lumbalgia inflamatoria",
              "Cervicalgia con radiculopatía",
              "Síndrome hombro doloroso",
              "Gonalgia traumática",
              "Gonalgia degenerativa",
              "Fibromialgia",
              "Artritis séptica"
            ],
            autoCalculate: true
          },
          {
            id: "weightedDifferentialDx",
            label: "Diagnósticos diferenciales ponderados",
            type: "calculated",
            autoGenerate: true
          },
          {
            id: "riskStratification",
            label: "Estratificación de riesgo final",
            type: "select",
            options: [
              "🟢 Bajo riesgo - Manejo conservador ambulatorio",
              "🟡 Riesgo intermedio - Seguimiento especializado",
              "🔴 Alto riesgo - Intervención urgente",
              "🚨 Riesgo crítico - Emergencia"
            ],
            autoCalculate: true
          }
        ]
      },
      {
        id: "specificDiagnosticPlan",
        label: "📋 Plan Diagnóstico Específico",
        type: "object",
        subfields: [
          {
            id: "immediateActions",
            label: "Acciones inmediatas",
            type: "multiselect",
            options: [
              "Rx simple AP y lateral",
              "Rx con proyecciones especiales",
              "TAC sin contraste",
              "RM con contraste",
              "Ecografía articular",
              "Laboratorio básico",
              "Marcadores inflamatorios",
              "Estudios inmunológicos",
              "Punción articular",
              "Interconsulta urgente"
            ],
            autoCalculate: true
          },
          {
            id: "followUpCriteria",
            label: "Criterios de seguimiento",
            type: "multiselect",
            options: [
              "Control en 48-72h",
              "Control en 1 semana",
              "Control en 2 semanas",
              "Control en 1 mes",
              "Seguimiento por especialista",
              "Re-evaluación funcional",
              "Repetir escalas actividad",
              "Monitoreo laboratorio"
            ],
            autoCalculate: true
          },
          {
            id: "referralCriteria",
            label: "Criterios de derivación",
            type: "multiselect",
            options: [
              "Reumatología - artritis inflamatoria",
              "Traumatología - fractura/cirugía",
              "Neurocirugía - mielopatía",
              "Medicina del dolor - dolor crónico",
              "Rehabilitación - terapia física",
              "Urgencias - emergencia",
              "UCI - paciente crítico"
            ],
            autoCalculate: true
          }
        ]
      },
      {
        id: "therapeuticRecommendations",
        label: "💊 Recomendaciones Terapéuticas Iniciales",
        type: "object",
        subfields: [
          {
            id: "pharmacologicalTreatment",
            label: "Tratamiento farmacológico",
            type: "multiselect",
            options: [
              "Analgésicos simples",
              "AINES",
              "Corticosteroides",
              "Relajantes musculares",
              "Medicamentos neuropáticos",
              "DMARDs convencionales",
              "Biológicos",
              "Infiltraciones locales"
            ]
          },
          {
            id: "nonPharmacologicalTreatment",
            label: "Tratamiento no farmacológico",
            type: "multiselect",
            options: [
              "Reposo relativo",
              "Fisioterapia",
              "Ejercicio terapéutico",
              "Crioterapia",
              "Termoterapia",
              "Soporte psicológico",
              "Modificación actividad",
              "Ayudas técnicas"
            ]
          },
          {
            id: "redFlagMonitoring",
            label: "Monitoreo banderas rojas",
            type: "multiselect",
            options: [
              "Empeoramiento neurológico",
              "Pérdida función motora",
              "Signos infección",
              "Síndrome compartimental",
              "Inestabilidad hemodinámica"
            ]
          }
        ]
      }
    ]
  }
];

export default function AdvancedTraumatologyForm({ patientData, onDataChange, onComplete }: AdvancedTraumatologyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<CalculatorResult[]>([]);
  const [adaptiveFlow, setAdaptiveFlow] = useState<string>("complete");

  // Calcular progreso total
  const progress = useMemo(() => {
    return Math.round((completedSections.size / ADVANCED_MUSCULOSKELETAL_SECTIONS.length) * 100);
  }, [completedSections.size]);

  // Sistema de alertas automáticas especializadas
  const checkAutomaticAlerts = (data: Record<string, any>) => {
    const newAlerts: AlertData[] = [];

    // Alertas rojas (emergencias)
    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('emergencyFlags') && value === true) {
        if (key.includes('vascularCompromise')) {
          newAlerts.push({
            type: 'red',
            message: '🚨 FRACTURA ABIERTA - QUIRÓFANO URGENTE',
            conditions: ['Compromiso vascular'],
            priority: 1,
            emergencyProtocol: 'QUIRÓFANO URGENTE'
          });
        }
        if (key.includes('compartmentSyndrome')) {
          newAlerts.push({
            type: 'red',
            message: '🚨 SÍNDROME COMPARTIMENTAL - FASCIOTOMÍA',
            conditions: ['5 P\'s presentes'],
            priority: 1,
            emergencyProtocol: 'FASCIOTOMÍA URGENTE'
          });
        }
        if (key.includes('septicArthritis')) {
          newAlerts.push({
            type: 'red',
            message: '🚨 ARTRITIS SÉPTICA - PUNCIÓN URGENTE',
            conditions: ['Articulación caliente + fiebre'],
            priority: 1,
            emergencyProtocol: 'PUNCIÓN ARTICULAR URGENTE'
          });
        }
        if (key.includes('cauda_equina')) {
          newAlerts.push({
            type: 'red',
            message: '🚨 SÍNDROME COLA CABALLO - RM INMEDIATA',
            conditions: ['Retención urinaria + anestesia silla'],
            priority: 1,
            emergencyProtocol: 'RM INMEDIATA + DESCOMPRESIÓN'
          });
        }
      }
    });

    // Alertas amarillas (precaución)
    const morningStiffness = data.morningStiffnessDuration;
    const cpr = data.cpr;
    const symmetry = data.jointSymmetry;
    
    if (morningStiffness > 60 && cpr > 5 && symmetry) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 SOSPECHA ARTRITIS REUMATOIDE - Evaluar criterios ACR',
        conditions: ['Rigidez matutina >60min', 'PCR elevada', 'Simetría'],
        priority: 2
      });
    }

    const axialPain = data.spinalPain;
    const flexionLimitation = data.flexionLimitation;
    const youngMale = data.age < 45 && data.sex === 'male';
    
    if (axialPain && flexionLimitation && youngMale) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 SOSPECHA ESPONDILITIS - Evaluar criterios ASAS',
        conditions: ['Dolor axial', 'Limitación flexión', 'Varón joven'],
        priority: 2
      });
    }

    // Mielopatía
    const myelopathySigns = data.myelopathySigns;
    const hyperreflexia = data.hyperreflexia;
    const babinski = data.babinski;
    
    if (myelopathySigns && hyperreflexia && babinski) {
      newAlerts.push({
        type: 'yellow',
        message: '🟡 MIELOPATÍA CERVICAL - RM programada',
        conditions: ['Signos mielopáticos', 'Hiperreflexia', 'Babinski'],
        priority: 2
      });
    }

    setAlerts(newAlerts);
  };

  // Calculadoras automáticas
  const calculateDAS28 = (data: Record<string, any>): number => {
    const tjc = data.tenderJoints || 0;
    const sjc = data.swollenJoints || 0;
    const esr = data.esr || 20;
    const pga = data.patientGlobalAssessment || 50;
    
    const das28 = 0.56 * Math.sqrt(tjc) + 0.28 * Math.sqrt(sjc) + 
                  0.70 * Math.log(esr) + 0.014 * pga;
    return Math.round(das28 * 100) / 100;
  };

  const calculateBASDAI = (data: Record<string, any>): number => {
    const fatigue = data.fatigue || 0;
    const spinalPain = data.spinalPain || 0;
    const jointPainSwelling = data.jointPainSwelling || 0;
    const localizedTenderness = data.localizedTenderness || 0;
    const stiffnessSeverity = data.morningStiffnessSeverity || 0;
    const stiffnessDuration = data.morningStiffnessDuration || 0;
    
    const basdai = (fatigue + spinalPain + jointPainSwelling + localizedTenderness + 
                   (stiffnessSeverity + stiffnessDuration) / 2) / 5;
    return Math.round(basdai * 100) / 100;
  };

  const calculateWOMAC = (data: Record<string, any>): number => {
    const pain = data.painScore || 0;
    const stiffness = data.stiffnessScore || 0;
    const function_score = data.functionScore || 0;
    
    const total = pain + stiffness + function_score;
    return Math.round(total * 100) / 100;
  };

  const calculateACREULAR = (data: Record<string, any>): number => {
    let score = 0;
    
    // Joint involvement scoring
    if (data.jointInvolvement) {
      if (data.jointInvolvement.includes("1 articulación")) score += 0;
      if (data.jointInvolvement.includes("2-10 articulaciones grandes")) score += 1;
      if (data.jointInvolvement.includes("1-3 articulaciones pequeñas")) score += 2;
      if (data.jointInvolvement.includes("4-10 articulaciones pequeñas")) score += 3;
      if (data.jointInvolvement.includes(">10 articulaciones")) score += 5;
    }
    
    // Serology
    if (data.serology) {
      if (data.serology.includes("negativos")) score += 0;
      if (data.serology.includes("bajo positivo")) score += 2;
      if (data.serology.includes("alto positivo")) score += 3;
    }
    
    // Acute phase reactants
    if (data.acutePhaseReactants) {
      if (data.acutePhaseReactants.includes("normales")) score += 0;
      if (data.acutePhaseReactants.includes("elevados")) score += 1;
    }
    
    // Duration
    if (data.symptomDuration) {
      if (data.symptomDuration.includes("<6 semanas")) score += 0;
      if (data.symptomDuration.includes("≥6 semanas")) score += 1;
    }
    
    return score;
  };

  // Actualizar calculadoras
  const updateCalculators = (data: Record<string, any>) => {
    const results: CalculatorResult[] = [];

    // DAS28 para AR
    if (data.suspectedRA) {
      const das28 = calculateDAS28(data);
      results.push({
        name: 'DAS28',
        value: das28,
        interpretation: das28 > 5.1 ? 'Actividad alta - Intensificar terapia' : 
                       das28 > 3.2 ? 'Actividad moderada - Ajustar DMARDs' :
                       das28 > 2.6 ? 'Actividad baja - Mantener terapia' : 'Remisión',
        color: das28 > 5.1 ? '#ef4444' : das28 > 3.2 ? '#f59e0b' : '#10b981',
        alert: das28 > 5.1,
        recommendation: das28 > 5.1 ? 'Considerar biológicos' : das28 > 3.2 ? 'Optimizar DMARDs' : 'Mantener tratamiento'
      });
    }

    // BASDAI para Espondiloartritis
    if (data.suspectedSpA) {
      const basdai = calculateBASDAI(data);
      results.push({
        name: 'BASDAI',
        value: basdai,
        interpretation: basdai >= 4 ? 'Actividad alta' : basdai >= 2 ? 'Actividad moderada' : 'Actividad baja',
        color: basdai >= 4 ? '#ef4444' : basdai >= 2 ? '#f59e0b' : '#10b981',
        alert: basdai >= 4,
        recommendation: basdai >= 4 ? 'Considerar terapia biológica' : 'AINES + ejercicio'
      });
    }

    // WOMAC para Artrosis
    if (data.suspectedOA) {
      const womac = calculateWOMAC(data);
      results.push({
        name: 'WOMAC',
        value: womac,
        interpretation: womac > 39 ? 'Impacto severo' : womac > 19 ? 'Impacto moderado' : 'Impacto leve',
        color: womac > 39 ? '#ef4444' : womac > 19 ? '#f59e0b' : '#10b981',
        alert: womac > 39
      });
    }

    // Criterios ACR/EULAR
    if (data.suspectedRA) {
      const acrScore = calculateACREULAR(data);
      results.push({
        name: 'ACR/EULAR',
        value: `${acrScore}/10`,
        interpretation: acrScore >= 6 ? 'Cumple criterios AR' : 'No cumple criterios',
        color: acrScore >= 6 ? '#ef4444' : '#10b981',
        alert: acrScore >= 6,
        recommendation: acrScore >= 6 ? 'Iniciar DMARDs' : 'Seguimiento'
      });
    }

    setCalculatorResults(results);
  };

  // Flujos adaptativos
  const getAdaptiveFlow = (data: Record<string, any>): string => {
    // Algoritmo: Dolor Articular Agudo
    if (data.jointPain && data.acuteOnset) {
      if (data.monoarticular) {
        if (data.fever) {
          return "artritis_septica";
        } else if (data.crystals) {
          return "gota_pseudogota";
        } else if (data.trauma) {
          return "fracture_ligament_evaluation";
        } else {
          return "early_inflammatory_arthritis";
        }
      } else {
        if (data.symmetry) {
          return "ra_lupus_evaluation";
        } else {
          return "psoriatic_spondyloarthritis_evaluation";
        }
      }
    }

    // Algoritmo: Lumbalgia Aguda
    if (data.backPain && data.acuteOnset) {
      if (data.redFlags) {
        return "urgent_referral";
      } else if (data.legIrradiation) {
        if (data.motorDeficit) {
          return "urgent_mri_disc_herniation";
        } else {
          return "conservative_management_followup";
        }
      } else {
        if (data.improvesWithMovement) {
          return "mechanical_back_pain";
        } else {
          return "inflammatory_cause_evaluation";
        }
      }
    }

    return "complete";
  };

  // Manejar cambios en datos
  const handleDataChange = (sectionId: string, fieldId: string, value: any) => {
    const newFormData = {
      ...formData,
      [`${sectionId}_${fieldId}`]: value
    };
    
    setFormData(newFormData);
    
    // Verificar alertas, calculadoras y flujo adaptativo
    checkAutomaticAlerts(newFormData);
    updateCalculators(newFormData);
    const newFlow = getAdaptiveFlow(newFormData);
    setAdaptiveFlow(newFlow);
    
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
            {field.emergency && value && (
              <Badge variant="destructive" className="text-xs">
                {field.protocol}
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
                    {result.recommendation && (
                      <p className="text-sm text-blue-600 mt-1 font-medium">{result.recommendation}</p>
                    )}
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

  const currentSectionData = ADVANCED_MUSCULOSKELETAL_SECTIONS[currentSection];
  const isLastSection = currentSection === ADVANCED_MUSCULOSKELETAL_SECTIONS.length - 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado con progreso y alertas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bone className="h-8 w-8 text-blue-600" />
              Sistema Musculoesquelético Inteligente
            </h1>
            <p className="text-gray-600 mt-1">
              Evaluación especializada con triage automático, escalas específicas y flujos adaptativos
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
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
              {alert.emergencyProtocol && (
                <div className="mt-1 text-sm font-bold">
                  PROTOCOLO: {alert.emergencyProtocol}
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

      {/* Navegación por fases */}
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map(phase => (
          <div 
            key={phase}
            className={`p-3 text-center rounded-lg border-2 transition-all ${
              ADVANCED_MUSCULOSKELETAL_SECTIONS[currentSection]?.phase === phase
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="font-bold">FASE {phase}</div>
            <div className="text-xs mt-1">
              {phase === 0 && "Triage"}
              {phase === 1 && "Anamnesis"}
              {phase === 2 && "Exploración"}
              {phase === 3 && "Escalas"}
              {phase === 4 && "Síntesis"}
            </div>
          </div>
        ))}
      </div>

      {/* Navegación por secciones */}
      <div className="flex flex-wrap gap-2">
        {ADVANCED_MUSCULOSKELETAL_SECTIONS.map((section, index) => {
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
              } ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}
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
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Escalas Específicas en Tiempo Real
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
              <currentSectionData.icon className="h-6 w-6 text-blue-600" />
              <span>
                FASE {currentSectionData.phase}: {currentSectionData.title}
              </span>
              {currentSectionData.critical && (
                <Badge variant="destructive">Crítico</Badge>
              )}
            </CardTitle>
            <Badge variant="outline">
              Sección {currentSection + 1} de {ADVANCED_MUSCULOSKELETAL_SECTIONS.length}
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
              onClick={() => setCurrentSection(Math.min(ADVANCED_MUSCULOSKELETAL_SECTIONS.length - 1, currentSection + 1))}
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}