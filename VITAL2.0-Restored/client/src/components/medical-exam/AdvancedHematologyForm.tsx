import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, 
  Heart, 
  Activity, 
  Zap, 
  AlertTriangle,
  Circle,
  Brain,
  TrendingUp,
  User,
  Calculator,
  Microscope,
  Search,
  Target,
  Stethoscope,
  Eye,
  Timer,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Thermometer
} from "lucide-react";

// 🎯 INTERFACES Y TIPOS MÉDICOS ESPECIALIZADOS
interface Alert {
  id: string;
  type: 'critical' | 'urgent' | 'warning' | 'info';
  message: string;
  action?: string;
  priority: number;
  timestamp: Date;
}

interface MedicalScale {
  name: string;
  score: number;
  interpretation: string;
  riskLevel: 'low' | 'intermediate' | 'high' | 'critical';
  recommendations: string[];
}

interface TriageMetrics {
  emergencyLevel: 'stable' | 'urgent' | 'critical';
  totalAlerts: number;
  criticalAlerts: number;
  progressPercentage: number;
  lastUpdated: Date;
}

interface AdvancedHematologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

export default function AdvancedHematologyForm({
  patientData,
  onDataChange,
  onComplete
}: AdvancedHematologyFormProps) {
  
  // 🚨 SISTEMA DE ALERTAS Y TRIAGE INTELIGENTE
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [triageMetrics, setTriageMetrics] = useState<TriageMetrics>({
    emergencyLevel: 'stable',
    totalAlerts: 0,
    criticalAlerts: 0,
    progressPercentage: 0,
    lastUpdated: new Date()
  });
  
  // 📊 CÁLCULOS AUTOMÁTICOS DE ESCALAS MÉDICAS
  const [medicalScales, setMedicalScales] = useState<MedicalScale[]>([]);
  const [currentPhase, setCurrentPhase] = useState<number>(1);

  // 🩸 FASE 1: TRIAGE DE EMERGENCIAS HEMATOLÓGICAS
  const [emergencyTriage, setEmergencyTriage] = useState({
    // 🔴 EMERGENCIAS CRÍTICAS (ROJAS)
    criticalEmergencies: {
      massiveHemorrhage: false,        // Sangrado >150mL/h o >1500mL/24h
      hemodynamicShock: false,         // TA <90/60 + taquicardia
      acuteHemolysis: false,           // Hemoglobinuria + ictericia aguda
      tumorLysisSyndrome: false,       // K+>6, LDH>1000, urato>15
      hyperleucocytosis: false,        // >100,000 leucocitos con síntomas
      intracranialBleeding: false,     // Cefalea + alt. neurológicas
      acuteDIC: false,                 // Sangrado + esquistocitos
      neutropenicSepsis: false,        // Neutrófilos <500 + fiebre
      thrombocytopenicPurpura: false,  // Plaq<20,000 + esquistocitos
      hypercalcemia: false             // Ca>14mg/dL + síntomas
    },
    
    // 🟡 URGENCIAS (AMARILLAS)
    urgentFindings: {
      severeAnemia: false,             // Hb <7 g/dL
      moderateHemorrhage: false,       // Sangrado 50-150mL/h
      blastCells: false,               // Blastos >20% en sangre
      splenomegaly: false,             // Bazo >5cm bajo reborde
      lymphadenopathy: false,          // Ganglios >2cm múltiples
      coagulopathy: false,             // INR>2 o TP>25seg
      hepatomegaly: false,             // Hígado >3cm bajo reborde
      persistentFever: false           // Fiebre >7 días
    },
    
    // 🟢 HALLAZGOS ESTABLES (VERDES)
    stableFindings: {
      mildAnemia: false,               // Hb 8-10 g/dL
      minorBleeding: false,            // Petequias o equimosis
      fatigueOnly: false,              // Solo astenia
      familyHistory: false,            // Antecedentes familiares
      chronicFindings: false           // Hallazgos conocidos estables
    }
  });

  // 🧬 FASE 2: SÍNTOMAS CONSTITUCIONALES Y ESPECÍFICOS
  const [symptomAssessment, setSymptomAssessment] = useState({
    // Síntomas B (oncohematológicos)
    bSymptoms: {
      fever: { present: false, duration: "", pattern: "", maxTemp: "" },
      nightSweats: { present: false, severity: "", frequency: "" },
      weightLoss: { present: false, percentage: "", timeframe: "" }
    },
    
    // Síntomas de sangrado - ESCALA ISTH AUTOMATIZADA
    bleedingIST: {
      cutaneousBleeding: {
        petechiae: false,      // 1 punto
        bruising: false,       // 2 puntos  
        hematomas: false,      // 3 puntos
        score: 0
      },
      mucosalBleeding: {
        epistaxis: false,      // 1 punto
        gingivalBleeding: false, // 2 puntos
        menorrhagia: false,    // 3 puntos
        GIBleeding: false,     // 4 puntos
        score: 0
      },
      surgicalBleeding: {
        dentalBleeding: false,  // 1 punto
        surgicalSites: false,   // 2-3 puntos
        score: 0
      },
      totalISTHScore: 0,
      riskLevel: 'low' // low, intermediate, high
    },
    
    // Síntomas anémicos con graduación
    anemicSymptoms: {
      fatigue: { present: false, severity: "" }, // leve/moderada/severa
      dyspnea: { present: false, trigger: "" },  // repos/esfuerzo/mínimos
      palpitations: { present: false, frequency: "" },
      dizziness: { present: false, positional: false },
      coldIntolerance: { present: false, severity: "" },
      exerciseIntolerance: { present: false, level: "" } // normal/limitada/severa
    },
    
    // Síntomas trombóticos
    thromboticSymptoms: {
      legSwelling: { present: false, unilateral: false, severity: "" },
      chestPain: { present: false, pleuritic: false, severity: "" },
      dyspneaAcute: { present: false, onset: "" },
      neurologicSymptoms: { present: false, type: "" }
    }
  });

  // 📋 FASE 3: EXAMEN FÍSICO SISTEMÁTICO OPTIMIZADO
  const [physicalExam, setPhysicalExam] = useState({
    // Evaluación de palidez sistematizada
    pallorAssessment: {
      conjunctival: { grade: "", bilateral: true },  // ausente/leve/moderada/severa
      palmar: { grade: "", bilateral: true },
      nailBed: { grade: "", capillaryRefill: "" },   // <2seg/2-3seg/>3seg
      generalSkin: { grade: "", distribution: "" }
    },
    
    // Evaluación de sangrado sistematizada  
    bleedingEvaluation: {
      petechiae: {
        present: false,
        distribution: "", // localizada/generalizada
        density: "",      // escasas/moderadas/numerosas
        freshness: ""     // recientes/antiguas/mixtas
      },
      purpura: {
        present: false,
        palpable: false,  // diferencia vasculitis vs plaquetaria
        size: "",         // <3mm=petequias, >3mm=purpura
        distribution: ""
      },
      ecchymoses: {
        present: false,
        spontaneous: false, // vs traumáticas
        multipleAges: false, // diferentes colores
        locations: []
      },
      mucosalBleeding: {
        gingival: false,
        oral: false,
        nasal: false,
        conjunctival: false
      }
    },
    
    // Examen linfático sistematizado por cadenas
    lymphNodeExam: {
      cervical: {
        present: false,
        quantity: "",     // única/múltiples/<5/>5
        maxSize: "",      // <1cm/1-2cm/2-4cm/>4cm
        characteristics: [], // móvil,fija,dura,blanda,dolorosa,adherida
        laterality: ""    // unilateral/bilateral
      },
      supraclavicular: {
        present: false,
        side: "",         // izquierda más sospechosa (Virchow)
        size: "",
        characteristics: []
      },
      axillary: {
        present: false,
        quantity: "",
        maxSize: "",
        characteristics: [],
        laterality: ""
      },
      epitrochlear: {
        present: false,   // muy específico si >1cm
        size: "",
        characteristics: []
      },
      inguinal: {
        present: false,
        quantity: "",
        maxSize: "",
        characteristics: [],
        reactive: false   // vs patológicas
      },
      mediastinal: {
        suspected: false, // por síntomas (tos, disnea, valsalva+)
        valsalvaSign: false,
        SVCobstruction: false
      },
      abdominal: {
        suspected: false, // no palpables normalmente
        discomfort: false
      }
    },
    
    // Evaluación hepatoesplénica con escalas
    organomegalyExam: {
      splenomegaly: {
        palpable: false,
        sizeInCm: 0,        // cm bajo reborde costal izquierdo
        hackettGrade: 0,     // 1-5 (1=solo palpable, 5=cruza línea media)
        consistency: "",     // blanda/firme/dura
        surface: "",         // lisa/irregular/nodular
        tenderness: false,
        friction: false,     // roce esplénico
        dullness: false      // matidez percutoria
      },
      hepatomegaly: {
        palpable: false,
        sizeInCm: 0,        // cm bajo reborde costal derecho
        consistency: "",
        surface: "",
        edge: "",           // romo/afilado/irregular
        tenderness: false,
        pulsatile: false
      },
      hepatosplenomegaly: false
    },
    
    // Evaluación de ictericia
    jaundieeEvaluation: {
      present: false,
      type: "",           // hemolítica/hepatocelular/obstructiva
      distribution: "",   // escleras/piel/mucosas
      intensity: "",      // leve/moderada/intensa
      bilirubin: ""       // estimada <3/>3/>10 mg/dL
    },
    
    // Maniobras especiales hematológicas
    specialManeuvers: {
      tourniquetTest: { performed: false, positive: false }, // fragilidad capilar
      splenPercussion: { performed: false, enlarged: false }, // matidez >8cm
      heelStickTest: { performed: false, positive: false },  // dolor óseo
      valsalvaManeuver: { performed: false, positive: false }, // masa mediastinal
      rubmorTest: { performed: false, positive: false }      // policitemia vera
    }
  });

  // 🧪 FASE 4: EVALUACIÓN DE LABORATORIOS Y ESCALAS
  const [laboratoryIntegration, setLaboratoryIntegration] = useState({
    // Hemograma interpretado automáticamente
    cbc: {
      hemoglobin: { value: 0, interpretation: "", severity: "" },
      hematocrit: { value: 0, interpretation: "" },
      plateletCount: { value: 0, interpretation: "", severity: "" },
      wbcCount: { value: 0, interpretation: "", severity: "" },
      neutrophils: { value: 0, absolute: 0, interpretation: "" },
      lymphocytes: { value: 0, absolute: 0, interpretation: "" },
      morphologyAlerts: {
        blasts: false,
        schistocytes: false,
        spherocytes: false,
        targetCells: false,
        rouleaux: false,
        immatureCells: false
      }
    },
    
    // Coagulación interpretada
    coagulation: {
      pt: { value: 0, inr: 0, interpretation: "" },
      ptt: { value: 0, interpretation: "" },
      fibrinogen: { value: 0, interpretation: "" },
      dDimer: { value: 0, interpretation: "" }
    },
    
    // Marcadores especiales
    specialMarkers: {
      ldh: { value: 0, interpretation: "", tissueDamage: false },
      uricAcid: { value: 0, interpretation: "", tumorLysis: false },
      haptoglobin: { value: 0, interpretation: "", hemolysis: false },
      reticulocytes: { value: 0, interpretation: "", response: "" },
      ferritin: { value: 0, interpretation: "", inflammatoryState: false },
      b12: { value: 0, interpretation: "" },
      folate: { value: 0, interpretation: "" }
    }
  });

  // 📊 CÁLCULOS AUTOMÁTICOS - FUNCIONES MÉDICAS INTELIGENTES
  
  // Cálculo automático de Score ISTH para sangrado
  const calculateISTHScore = () => {
    const { cutaneousBleeding, mucosalBleeding, surgicalBleeding } = symptomAssessment.bleedingIST;
    let total = cutaneousBleeding.score + mucosalBleeding.score + surgicalBleeding.score;
    
    let riskLevel: 'low' | 'intermediate' | 'high' = 'low';
    let interpretation = '';
    let recommendations: string[] = [];
    
    if (total <= 3) {
      riskLevel = 'low';
      interpretation = 'Riesgo bajo de diátesis hemorrágica';
      recommendations = ['Seguimiento clínico routine', 'Historia familiar detallada'];
    } else if (total <= 8) {
      riskLevel = 'intermediate';
      interpretation = 'Riesgo intermedio - requiere evaluación';
      recommendations = ['Estudios de coagulación básicos', 'Interconsulta hematología si indicado'];
    } else {
      riskLevel = 'high';
      interpretation = 'Alto riesgo de diátesis hemorrágica';
      recommendations = ['Estudios extensos de coagulación', 'Interconsulta hematología urgente', 'Evitar anticoagulantes/antiplaquetarios'];
    }
    
    return { score: total, riskLevel, interpretation, recommendations };
  };

  // Cálculo de Score de Wells para TVP
  const calculateWellsScore = () => {
    let score = 0;
    let factors: string[] = [];
    
    if (symptomAssessment.thromboticSymptoms.legSwelling.present && symptomAssessment.thromboticSymptoms.legSwelling.unilateral) {
      score += 1;
      factors.push('Edema unilateral de pierna');
    }
    
    // Simplified version - in real implementation would include all Wells criteria
    let probability = '';
    let recommendations: string[] = [];
    
    if (score <= 1) {
      probability = 'Probabilidad baja (<10%)';
      recommendations = ['Dímero D', 'Si negativo, descartar TVP'];
    } else if (score <= 2) {
      probability = 'Probabilidad intermedia (10-30%)';
      recommendations = ['Ecografía Doppler', 'Considerar anticoagulación'];
    } else {
      probability = 'Probabilidad alta (>30%)';
      recommendations = ['Ecografía Doppler urgente', 'Anticoagulación empírica si no contraindicada'];
    }
    
    return { score, probability, recommendations, factors };
  };

  // Cálculo de severidad de anemia
  const calculateAnemiaSeverity = () => {
    const hb = laboratoryIntegration.cbc.hemoglobin.value;
    let severity = '';
    let symptoms = '';
    let recommendations: string[] = [];
    
    if (hb >= 11) {
      severity = 'Normal/Leve';
      symptoms = 'Asintomática o síntomas mínimos';
      recommendations = ['Seguimiento routine'];
    } else if (hb >= 8) {
      severity = 'Moderada';
      symptoms = 'Fatiga, disnea de esfuerzo';
      recommendations = ['Estudio etiológico', 'Suplementación si indicada'];
    } else if (hb >= 6.5) {
      severity = 'Severa';
      symptoms = 'Fatiga importante, disnea, palpitaciones';
      recommendations = ['Estudio urgente', 'Considerar transfusión si síntomas'];
    } else {
      severity = 'Muy severa';
      symptoms = 'Síntomas cardiovasculares, riesgo de ICC';
      recommendations = ['Transfusión urgente', 'Hospitalización', 'Estudio inmediato'];
    }
    
    return { severity, symptoms, recommendations };
  };

  // 🚨 SISTEMA DE ALERTAS AUTOMÁTICAS
  const checkEmergencyAlerts = () => {
    const newAlerts: Alert[] = [];
    const timestamp = new Date();

    // Alertas críticas rojas
    Object.entries(emergencyTriage.criticalEmergencies).forEach(([key, value]) => {
      if (value) {
        const alertMessages: { [key: string]: string } = {
          massiveHemorrhage: '🚨 SANGRADO MASIVO - Activar protocolo de transfusión masiva',
          hemodynamicShock: '🚨 SHOCK HEMORRÁGICO - Reanimación inmediata + sangre O negativo',
          acuteHemolysis: '🚨 HEMÓLISIS AGUDA - Soporte renal + interconsulta nefrología',
          tumorLysisSyndrome: '🚨 SÍNDROME LISIS TUMORAL - Hidratación + uricosúrico + monitoreo renal',
          hyperleucocytosis: '🚨 HIPERLEUCOCITOSIS - Leucaféresis urgente si >100k',
          intracranialBleeding: '🚨 SANGRADO INTRACRANEAL - TC cráneo STAT + neurocirugía',
          acuteDIC: '🚨 CID AGUDA - Crioprecipitados + plaquetas + FFP',
          neutropenicSepsis: '🚨 SEPSIS NEUTROPÉNICA - Antibióticos empíricos STAT',
          thrombocytopenicPurpura: '🚨 PTT/SHU - Plasmaféresis urgente',
          hypercalcemia: '🚨 HIPERCALCEMIA SEVERA - Hidratación + bifosfonatos'
        };

        newAlerts.push({
          id: `critical-${key}-${timestamp.getTime()}`,
          type: 'critical',
          message: alertMessages[key] || `Emergencia crítica: ${key}`,
          priority: 1,
          timestamp,
          action: 'immediate-intervention'
        });
      }
    });

    // Alertas urgentes amarillas  
    Object.entries(emergencyTriage.urgentFindings).forEach(([key, value]) => {
      if (value) {
        const alertMessages: { [key: string]: string } = {
          severeAnemia: '⚠️ ANEMIA SEVERA - Considerar transfusión + estudio etiológico',
          moderateHemorrhage: '⚠️ SANGRADO MODERADO - Tipificar sangre + vigilancia estrecha',
          blastCells: '⚠️ BLASTOS EN SANGRE - Interconsulta hematología urgente',
          splenomegaly: '⚠️ ESPLENOMEGALIA - Ecografía abdominal + estudio',
          lymphadenopathy: '⚠️ LINFADENOPATÍA - Biopsia ganglionar considerar',
          coagulopathy: '⚠️ COAGULOPATÍA - Vitamina K + FFP si sangrado',
          hepatomegaly: '⚠️ HEPATOMEGALIA - Ecografía + función hepática',
          persistentFever: '⚠️ FIEBRE PERSISTENTE - Hemocultivos + estudio infeccioso'
        };

        newAlerts.push({
          id: `urgent-${key}-${timestamp.getTime()}`,
          type: 'urgent',
          message: alertMessages[key] || `Hallazgo urgente: ${key}`,
          priority: 2,
          timestamp
        });
      }
    });

    setAlerts(newAlerts);
    
    // Actualizar métricas de triage
    const criticalCount = newAlerts.filter(a => a.type === 'critical').length;
    const totalCount = newAlerts.length;
    
    let emergencyLevel: 'stable' | 'urgent' | 'critical' = 'stable';
    if (criticalCount > 0) emergencyLevel = 'critical';
    else if (totalCount > 0) emergencyLevel = 'urgent';
    
    setTriageMetrics({
      emergencyLevel,
      totalAlerts: totalCount,
      criticalAlerts: criticalCount,
      progressPercentage: calculateProgressPercentage(),
      lastUpdated: timestamp
    });
  };

  // Calcular porcentaje de progreso del examen
  const calculateProgressPercentage = () => {
    let completedFields = 0;
    let totalFields = 0;
    
    // Contar campos completados en cada fase
    const phases = [emergencyTriage, symptomAssessment, physicalExam, laboratoryIntegration];
    
    phases.forEach(phase => {
      const countFields = (obj: any): { completed: number, total: number } => {
        let completed = 0;
        let total = 0;
        
        Object.values(obj).forEach(value => {
          if (typeof value === 'boolean') {
            total++;
            if (value) completed++;
          } else if (typeof value === 'string') {
            total++;
            if (value.trim() !== '') completed++;
          } else if (typeof value === 'number') {
            total++;
            if (value > 0) completed++;
          } else if (typeof value === 'object' && value !== null) {
            const nested = countFields(value);
            completed += nested.completed;
            total += nested.total;
          }
        });
        
        return { completed, total };
      };
      
      const phaseCount = countFields(phase);
      completedFields += phaseCount.completed;
      totalFields += phaseCount.total;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  // Actualizar escalas médicas automáticamente
  useEffect(() => {
    const scales: MedicalScale[] = [];
    
    // ISTH Score
    const isthResult = calculateISTHScore();
    scales.push({
      name: 'ISTH Bleeding Score',
      score: isthResult.score,
      interpretation: isthResult.interpretation,
      riskLevel: isthResult.riskLevel as any,
      recommendations: isthResult.recommendations
    });
    
    // Wells Score  
    const wellsResult = calculateWellsScore();
    scales.push({
      name: 'Wells Score (TVP)',
      score: wellsResult.score,
      interpretation: wellsResult.probability,
      riskLevel: wellsResult.score > 2 ? 'high' : wellsResult.score > 1 ? 'intermediate' : 'low',
      recommendations: wellsResult.recommendations
    });
    
    // Anemia Severity
    if (laboratoryIntegration.cbc.hemoglobin.value > 0) {
      const anemiaResult = calculateAnemiaSeverity();
      scales.push({
        name: 'Severidad de Anemia',
        score: laboratoryIntegration.cbc.hemoglobin.value,
        interpretation: `${anemiaResult.severity} - ${anemiaResult.symptoms}`,
        riskLevel: laboratoryIntegration.cbc.hemoglobin.value < 6.5 ? 'critical' : 
                  laboratoryIntegration.cbc.hemoglobin.value < 8 ? 'high' : 
                  laboratoryIntegration.cbc.hemoglobin.value < 11 ? 'intermediate' : 'low',
        recommendations: anemiaResult.recommendations
      });
    }
    
    setMedicalScales(scales);
    checkEmergencyAlerts();
  }, [emergencyTriage, symptomAssessment, physicalExam, laboratoryIntegration]);

  // Handler para completar el examen
  const handleComplete = () => {
    const completeData = {
      triageMetrics,
      emergencyTriage,
      symptomAssessment, 
      physicalExam,
      laboratoryIntegration,
      medicalScales,
      alerts,
      timestamp: new Date(),
      progressPercentage: triageMetrics.progressPercentage
    };
    
    if (onComplete) {
      onComplete(completeData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* 🎯 DASHBOARD SUPERIOR FIJO - MÉTRICAS EN TIEMPO REAL */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Nivel de emergencia */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                triageMetrics.emergencyLevel === 'critical' ? 'bg-red-500' :
                triageMetrics.emergencyLevel === 'urgent' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="text-white text-sm">
                <div className="font-medium">
                  {triageMetrics.emergencyLevel === 'critical' ? '🚨 CRÍTICO' :
                   triageMetrics.emergencyLevel === 'urgent' ? '⚠️ URGENTE' : '✅ ESTABLE'}
                </div>
              </div>
            </div>

            {/* Total de alertas */}
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <div className="text-white text-sm">
                <div className="font-medium">{triageMetrics.totalAlerts}</div>
                <div className="text-xs text-gray-400">Alertas</div>
              </div>
            </div>

            {/* Alertas críticas */}
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <div className="text-white text-sm">
                <div className="font-medium">{triageMetrics.criticalAlerts}</div>
                <div className="text-xs text-gray-400">Críticas</div>
              </div>
            </div>

            {/* Progreso del examen */}
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <div className="text-white text-sm">
                <div className="font-medium">{triageMetrics.progressPercentage}%</div>
                <div className="text-xs text-gray-400">Progreso</div>
              </div>
            </div>

            {/* Escalas calculadas */}
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-400" />
              <div className="text-white text-sm">
                <div className="font-medium">{medicalScales.length}</div>
                <div className="text-xs text-gray-400">Escalas</div>
              </div>
            </div>

            {/* Botón de completar */}
            <div className="flex justify-end">
              <Button 
                onClick={handleComplete}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completar
              </Button>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-2">
            <Progress value={triageMetrics.progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* 📋 CONTENIDO PRINCIPAL */}
        <div className="flex-1 space-y-6">
          
          {/* Header del formulario */}
          <div className="text-center space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center gap-3">
              <Droplets className="h-10 w-10 text-red-300" />
              <h1 className="text-4xl font-bold text-white">Exploración Hematológica Optimizada</h1>
            </div>
            {patientData && (
              <div className="flex items-center justify-center gap-2 text-white/90">
                <User className="h-4 w-4" />
                <span className="font-medium">{patientData.name}</span>
                {patientData.age && <span>• {patientData.age} años</span>}
                {patientData.gender && <span>• {patientData.gender}</span>}
              </div>
            )}
            <p className="text-white/80 text-lg">Sistema inteligente de triage y evaluación hematológica</p>
            <div className="flex justify-center gap-4 mt-4">
              <Badge className="bg-red-500/30 text-white border border-white/20">Triage de Emergencias</Badge>
              <Badge className="bg-yellow-500/30 text-white border border-white/20">Síntomas Dirigidos</Badge>
              <Badge className="bg-blue-500/30 text-white border border-white/20">Examen Físico</Badge>
              <Badge className="bg-purple-500/30 text-white border border-white/20">Integración Lab</Badge>
            </div>
          </div>

          {/* 🚨 FASE 1: TRIAGE DE EMERGENCIAS HEMATOLÓGICAS */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <CardHeader className="backdrop-blur-sm bg-red-500/20 border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-6 w-6 text-red-300" />
                Fase 1: Triage de Emergencias Hematológicas
                <Badge className="ml-auto bg-red-200/30 text-white border border-white/20">
                  {triageMetrics.criticalAlerts > 0 ? 'CRÍTICO' : 'Screening'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              
              {/* EMERGENCIAS CRÍTICAS (ROJAS) */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    🔴 Emergencias Críticas (Acción Inmediata)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'massiveHemorrhage', label: 'Sangrado Masivo', desc: '>150mL/h o shock' },
                      { key: 'hemodynamicShock', label: 'Shock Hemorrágico', desc: 'TA<90/60 + taquicardia' },
                      { key: 'acuteHemolysis', label: 'Hemólisis Aguda', desc: 'Hemoglobinuria + ictericia' },
                      { key: 'tumorLysisSyndrome', label: 'Sínd. Lisis Tumoral', desc: 'K+>6, LDH>1000, urato>15' },
                      { key: 'hyperleucocytosis', label: 'Hiperleucocitosis', desc: '>100,000 con síntomas' },
                      { key: 'intracranialBleeding', label: 'Sangrado Intracraneal', desc: 'Cefalea + neuro' },
                      { key: 'acuteDIC', label: 'CID Aguda', desc: 'Sangrado + esquistocitos' },
                      { key: 'neutropenicSepsis', label: 'Sepsis Neutropénica', desc: 'Neutros<500 + fiebre' },
                      { key: 'thrombocytopenicPurpura', label: 'PTT/SHU', desc: 'Plaq<20k + esquistocitos' },
                      { key: 'hypercalcemia', label: 'Hipercalcemia Severa', desc: 'Ca>14mg/dL + síntomas' }
                    ].map((emergency) => (
                      <div key={emergency.key} className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={emergency.key}
                            checked={emergencyTriage.criticalEmergencies[emergency.key as keyof typeof emergencyTriage.criticalEmergencies]}
                            onCheckedChange={(checked) =>
                              setEmergencyTriage(prev => ({
                                ...prev,
                                criticalEmergencies: {
                                  ...prev.criticalEmergencies,
                                  [emergency.key]: checked
                                }
                              }))
                            }
                          />
                          <Label htmlFor={emergency.key} className="text-white font-medium text-sm cursor-pointer">
                            {emergency.label}
                          </Label>
                        </div>
                        <p className="text-red-300 text-xs">{emergency.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* URGENCIAS (AMARILLAS) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    🟡 Hallazgos Urgentes (Evaluación Prioritaria)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'severeAnemia', label: 'Anemia Severa', desc: 'Hb <7 g/dL' },
                      { key: 'moderateHemorrhage', label: 'Sangrado Moderado', desc: '50-150mL/h' },
                      { key: 'blastCells', label: 'Células Blásticas', desc: 'Blastos >20% sangre' },
                      { key: 'splenomegaly', label: 'Esplenomegalia', desc: 'Bazo >5cm palpable' },
                      { key: 'lymphadenopathy', label: 'Linfadenopatía', desc: 'Ganglios >2cm múltiples' },
                      { key: 'coagulopathy', label: 'Coagulopatía', desc: 'INR>2 o TP>25seg' },
                      { key: 'hepatomegaly', label: 'Hepatomegalia', desc: 'Hígado >3cm palpable' },
                      { key: 'persistentFever', label: 'Fiebre Persistente', desc: 'Fiebre >7 días' }
                    ].map((urgent) => (
                      <div key={urgent.key} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <Checkbox
                            id={urgent.key}
                            checked={emergencyTriage.urgentFindings[urgent.key as keyof typeof emergencyTriage.urgentFindings]}
                            onCheckedChange={(checked) =>
                              setEmergencyTriage(prev => ({
                                ...prev,
                                urgentFindings: {
                                  ...prev.urgentFindings,
                                  [urgent.key]: checked
                                }
                              }))
                            }
                          />
                          <Label htmlFor={urgent.key} className="text-white text-sm cursor-pointer font-medium">
                            {urgent.label}
                          </Label>
                        </div>
                        <p className="text-yellow-300 text-xs">{urgent.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HALLAZGOS ESTABLES (VERDES) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    🟢 Hallazgos Estables (Seguimiento Routine)
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { key: 'mildAnemia', label: 'Anemia Leve', desc: 'Hb 8-10 g/dL' },
                      { key: 'minorBleeding', label: 'Sangrado Menor', desc: 'Petequias/equimosis' },
                      { key: 'fatigueOnly', label: 'Solo Astenia', desc: 'Fatiga aislada' },
                      { key: 'familyHistory', label: 'Antec. Familiares', desc: 'Historia familiar' },
                      { key: 'chronicFindings', label: 'Hallazgos Crónicos', desc: 'Conocidos estables' }
                    ].map((stable) => (
                      <div key={stable.key} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center space-x-2 mb-1">
                          <Checkbox
                            id={stable.key}
                            checked={emergencyTriage.stableFindings[stable.key as keyof typeof emergencyTriage.stableFindings]}
                            onCheckedChange={(checked) =>
                              setEmergencyTriage(prev => ({
                                ...prev,
                                stableFindings: {
                                  ...prev.stableFindings,
                                  [stable.key]: checked
                                }
                              }))
                            }
                          />
                          <Label htmlFor={stable.key} className="text-white text-sm cursor-pointer font-medium">
                            {stable.label}
                          </Label>
                        </div>
                        <p className="text-green-300 text-xs">{stable.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🧬 FASE 2: EVALUACIÓN DE SÍNTOMAS DIRIGIDA */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <CardHeader className="backdrop-blur-sm bg-yellow-500/20 border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-6 w-6 text-yellow-300" />
                Fase 2: Síntomas Constitucionales y Específicos
                <Badge className="ml-auto bg-yellow-200/30 text-white border border-white/20">
                  Evaluación Dirigida
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              
              {/* Síntomas B (Oncohematológicos) */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-300" />
                    Síntomas B (Sospecha Neoplasia Hematológica)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Fiebre */}
                    <div className="space-y-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fever"
                          checked={symptomAssessment.bSymptoms.fever.present}
                          onCheckedChange={(checked) =>
                            setSymptomAssessment(prev => ({
                              ...prev,
                              bSymptoms: {
                                ...prev.bSymptoms,
                                fever: { ...prev.bSymptoms.fever, present: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="fever" className="text-white font-medium cursor-pointer">
                          Fiebre 🌡️
                        </Label>
                      </div>
                      
                      {symptomAssessment.bSymptoms.fever.present && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Duración:</Label>
                            <RadioGroup
                              value={symptomAssessment.bSymptoms.fever.duration}
                              onValueChange={(value) =>
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bSymptoms: {
                                    ...prev.bSymptoms,
                                    fever: { ...prev.bSymptoms.fever, duration: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="<7days" id="fever-short" />
                                <Label htmlFor="fever-short" className="text-white text-sm cursor-pointer">
                                  {"<7 días"}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="7-30days" id="fever-medium" />
                                <Label htmlFor="fever-medium" className="text-white text-sm cursor-pointer">
                                  7-30 días
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value=">30days" id="fever-long" />
                                <Label htmlFor="fever-long" className="text-white text-sm cursor-pointer">
                                  {">30 días"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Patrón:</Label>
                            <RadioGroup
                              value={symptomAssessment.bSymptoms.fever.pattern}
                              onValueChange={(value) =>
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bSymptoms: {
                                    ...prev.bSymptoms,
                                    fever: { ...prev.bSymptoms.fever, pattern: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="continuous" id="fever-continuous" />
                                <Label htmlFor="fever-continuous" className="text-white text-sm cursor-pointer">
                                  Continua
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intermittent" id="fever-intermittent" />
                                <Label htmlFor="fever-intermittent" className="text-white text-sm cursor-pointer">
                                  Intermitente
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cyclical" id="fever-cyclical" />
                                <Label htmlFor="fever-cyclical" className="text-white text-sm cursor-pointer">
                                  Cíclica (Pel-Ebstein)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sudores nocturnos */}
                    <div className="space-y-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="night-sweats"
                          checked={symptomAssessment.bSymptoms.nightSweats.present}
                          onCheckedChange={(checked) =>
                            setSymptomAssessment(prev => ({
                              ...prev,
                              bSymptoms: {
                                ...prev.bSymptoms,
                                nightSweats: { ...prev.bSymptoms.nightSweats, present: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="night-sweats" className="text-white font-medium cursor-pointer">
                          Sudores Nocturnos 💧
                        </Label>
                      </div>
                      
                      {symptomAssessment.bSymptoms.nightSweats.present && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Severidad:</Label>
                            <RadioGroup
                              value={symptomAssessment.bSymptoms.nightSweats.severity}
                              onValueChange={(value) =>
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bSymptoms: {
                                    ...prev.bSymptoms,
                                    nightSweats: { ...prev.bSymptoms.nightSweats, severity: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="mild" id="sweats-mild" />
                                <Label htmlFor="sweats-mild" className="text-white text-sm cursor-pointer">
                                  Leves (sin cambio ropa)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="sweats-moderate" />
                                <Label htmlFor="sweats-moderate" className="text-white text-sm cursor-pointer">
                                  Moderados (cambia pijama)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="severe" id="sweats-severe" />
                                <Label htmlFor="sweats-severe" className="text-white text-sm cursor-pointer">
                                  Severos (cambia sábanas)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pérdida de peso */}
                    <div className="space-y-3 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weight-loss"
                          checked={symptomAssessment.bSymptoms.weightLoss.present}
                          onCheckedChange={(checked) =>
                            setSymptomAssessment(prev => ({
                              ...prev,
                              bSymptoms: {
                                ...prev.bSymptoms,
                                weightLoss: { ...prev.bSymptoms.weightLoss, present: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="weight-loss" className="text-white font-medium cursor-pointer">
                          Pérdida de Peso ⚖️
                        </Label>
                      </div>
                      
                      {symptomAssessment.bSymptoms.weightLoss.present && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Porcentaje perdido:</Label>
                            <RadioGroup
                              value={symptomAssessment.bSymptoms.weightLoss.percentage}
                              onValueChange={(value) =>
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bSymptoms: {
                                    ...prev.bSymptoms,
                                    weightLoss: { ...prev.bSymptoms.weightLoss, percentage: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="5-10%" id="weight-mild" />
                                <Label htmlFor="weight-mild" className="text-white text-sm cursor-pointer">
                                  5-10% (significativa)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="10-15%" id="weight-moderate" />
                                <Label htmlFor="weight-moderate" className="text-white text-sm cursor-pointer">
                                  10-15% (importante)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value=">15%" id="weight-severe" />
                                <Label htmlFor="weight-severe" className="text-white text-sm cursor-pointer">
                                  {">15% (severa)"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Tiempo:</Label>
                            <RadioGroup
                              value={symptomAssessment.bSymptoms.weightLoss.timeframe}
                              onValueChange={(value) =>
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bSymptoms: {
                                    ...prev.bSymptoms,
                                    weightLoss: { ...prev.bSymptoms.weightLoss, timeframe: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="<3months" id="weight-rapid" />
                                <Label htmlFor="weight-rapid" className="text-white text-sm cursor-pointer">
                                  {"<3 meses (rápida)"}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3-6months" id="weight-gradual" />
                                <Label htmlFor="weight-gradual" className="text-white text-sm cursor-pointer">
                                  3-6 meses
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value=">6months" id="weight-chronic" />
                                <Label htmlFor="weight-chronic" className="text-white text-sm cursor-pointer">
                                  {">6 meses"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evaluación de Sangrado - ESCALA ISTH */}
                <Separator className="border-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-red-300" />
                    Evaluación de Sangrado - Escala ISTH Automatizada
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sangrado Cutáneo */}
                    <div className="space-y-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <h4 className="text-white font-medium">Sangrado Cutáneo</h4>
                      <div className="space-y-2">
                        {[
                          { key: 'petechiae', label: 'Petequias', points: 1 },
                          { key: 'bruising', label: 'Equimosis fáciles', points: 2 },
                          { key: 'hematomas', label: 'Hematomas espontáneos', points: 3 }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cutaneous-${item.key}`}
                              checked={symptomAssessment.bleedingIST.cutaneousBleeding[item.key as keyof typeof symptomAssessment.bleedingIST.cutaneousBleeding] as boolean}
                              onCheckedChange={(checked) => {
                                const newScore = checked ? item.points : 0;
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bleedingIST: {
                                    ...prev.bleedingIST,
                                    cutaneousBleeding: {
                                      ...prev.bleedingIST.cutaneousBleeding,
                                      [item.key]: checked,
                                      score: newScore
                                    }
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`cutaneous-${item.key}`} className="text-white text-sm cursor-pointer">
                              {item.label} ({item.points}pt)
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 p-2 bg-white/5 rounded">
                        <span className="text-white text-sm font-medium">
                          Score: {symptomAssessment.bleedingIST.cutaneousBleeding.score} puntos
                        </span>
                      </div>
                    </div>

                    {/* Sangrado Mucoso */}
                    <div className="space-y-3 p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
                      <h4 className="text-white font-medium">Sangrado Mucoso</h4>
                      <div className="space-y-2">
                        {[
                          { key: 'epistaxis', label: 'Epistaxis recurrentes', points: 1 },
                          { key: 'gingivalBleeding', label: 'Sangrado gingival', points: 2 },
                          { key: 'menorrhagia', label: 'Menorragia severa', points: 3 },
                          { key: 'GIBleeding', label: 'Sangrado digestivo', points: 4 }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mucosal-${item.key}`}
                              checked={symptomAssessment.bleedingIST.mucosalBleeding[item.key as keyof typeof symptomAssessment.bleedingIST.mucosalBleeding] as boolean}
                              onCheckedChange={(checked) => {
                                const currentScore = symptomAssessment.bleedingIST.mucosalBleeding.score;
                                const newScore = checked ? Math.max(currentScore, item.points) : 
                                  currentScore === item.points ? 0 : currentScore;
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bleedingIST: {
                                    ...prev.bleedingIST,
                                    mucosalBleeding: {
                                      ...prev.bleedingIST.mucosalBleeding,
                                      [item.key]: checked,
                                      score: newScore
                                    }
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`mucosal-${item.key}`} className="text-white text-sm cursor-pointer">
                              {item.label} ({item.points}pt)
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 p-2 bg-white/5 rounded">
                        <span className="text-white text-sm font-medium">
                          Score: {symptomAssessment.bleedingIST.mucosalBleeding.score} puntos
                        </span>
                      </div>
                    </div>

                    {/* Sangrado Quirúrgico */}
                    <div className="space-y-3 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                      <h4 className="text-white font-medium">Sangrado Quirúrgico</h4>
                      <div className="space-y-2">
                        {[
                          { key: 'dentalBleeding', label: 'Sangrado post-dental', points: 1 },
                          { key: 'surgicalSites', label: 'Sangrado post-quirúrgico', points: 2 }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`surgical-${item.key}`}
                              checked={symptomAssessment.bleedingIST.surgicalBleeding[item.key as keyof typeof symptomAssessment.bleedingIST.surgicalBleeding] as boolean}
                              onCheckedChange={(checked) => {
                                const newScore = checked ? item.points : 0;
                                setSymptomAssessment(prev => ({
                                  ...prev,
                                  bleedingIST: {
                                    ...prev.bleedingIST,
                                    surgicalBleeding: {
                                      ...prev.bleedingIST.surgicalBleeding,
                                      [item.key]: checked,
                                      score: newScore
                                    }
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={`surgical-${item.key}`} className="text-white text-sm cursor-pointer">
                              {item.label} ({item.points}pt)
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 p-2 bg-white/5 rounded">
                        <span className="text-white text-sm font-medium">
                          Score: {symptomAssessment.bleedingIST.surgicalBleeding.score} puntos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score ISTH Total */}
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg">Score ISTH Total</h4>
                        <p className="text-white/80 text-sm">
                          {symptomAssessment.bleedingIST.totalISTHScore <= 3 ? 'Riesgo bajo de diátesis hemorrágica' :
                           symptomAssessment.bleedingIST.totalISTHScore <= 8 ? 'Riesgo intermedio - requiere evaluación' :
                           'Alto riesgo de diátesis hemorrágica'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          symptomAssessment.bleedingIST.totalISTHScore <= 3 ? 'text-green-400' :
                          symptomAssessment.bleedingIST.totalISTHScore <= 8 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {symptomAssessment.bleedingIST.cutaneousBleeding.score + 
                           symptomAssessment.bleedingIST.mucosalBleeding.score + 
                           symptomAssessment.bleedingIST.surgicalBleeding.score}
                        </div>
                        <div className="text-white/60 text-sm">puntos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🔬 FASE 3: EXAMEN FÍSICO SISTEMÁTICO */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <CardHeader className="backdrop-blur-sm bg-blue-500/20 border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Stethoscope className="h-6 w-6 text-blue-300" />
                Fase 3: Examen Físico Sistemático Hematológico
                <Badge className="ml-auto bg-blue-200/30 text-white border border-white/20">
                  Exploración Completa
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              
              {/* Evaluación de Palidez Sistematizada */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-300" />
                    Evaluación de Palidez (Correlación con Grado de Anemia)
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'conjunctival', label: 'Conjuntival', desc: 'Más sensible' },
                      { key: 'palmar', label: 'Palmar', desc: 'Pliegues palmares' },
                      { key: 'nailBed', label: 'Lechos ungueales', desc: 'Relleno capilar' },
                      { key: 'generalSkin', label: 'Piel general', desc: 'Distribución' }
                    ].map((site) => (
                      <div key={site.key} className="space-y-3 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                        <h4 className="text-white font-medium">{site.label}</h4>
                        <p className="text-cyan-300 text-xs">{site.desc}</p>
                        
                        <RadioGroup
                          value={physicalExam.pallorAssessment[site.key as keyof typeof physicalExam.pallorAssessment].grade}
                          onValueChange={(value) =>
                            setPhysicalExam(prev => ({
                              ...prev,
                              pallorAssessment: {
                                ...prev.pallorAssessment,
                                [site.key]: {
                                  ...prev.pallorAssessment[site.key as keyof typeof prev.pallorAssessment],
                                  grade: value
                                }
                              }
                            }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="absent" id={`pallor-${site.key}-absent`} />
                            <Label htmlFor={`pallor-${site.key}-absent`} className="text-white text-xs cursor-pointer">
                              Ausente ✅
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mild" id={`pallor-${site.key}-mild`} />
                            <Label htmlFor={`pallor-${site.key}-mild`} className="text-white text-xs cursor-pointer">
                              Leve 🟡
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="moderate" id={`pallor-${site.key}-moderate`} />
                            <Label htmlFor={`pallor-${site.key}-moderate`} className="text-white text-xs cursor-pointer">
                              Moderada 🟠
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="severe" id={`pallor-${site.key}-severe`} />
                            <Label htmlFor={`pallor-${site.key}-severe`} className="text-white text-xs cursor-pointer">
                              Severa 🔴
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluación de Sangrado */}
                <Separator className="border-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-red-300" />
                    Evaluación Sistematizada de Manifestaciones Hemorrágicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Petequias */}
                    <div className="space-y-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="petechiae-present"
                          checked={physicalExam.bleedingEvaluation.petechiae.present}
                          onCheckedChange={(checked) =>
                            setPhysicalExam(prev => ({
                              ...prev,
                              bleedingEvaluation: {
                                ...prev.bleedingEvaluation,
                                petechiae: { ...prev.bleedingEvaluation.petechiae, present: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="petechiae-present" className="text-white font-medium cursor-pointer">
                          Petequias (⭕ {"<3mm"})
                        </Label>
                      </div>
                      
                      {physicalExam.bleedingEvaluation.petechiae.present && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Distribución:</Label>
                            <RadioGroup
                              value={physicalExam.bleedingEvaluation.petechiae.distribution}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  bleedingEvaluation: {
                                    ...prev.bleedingEvaluation,
                                    petechiae: { ...prev.bleedingEvaluation.petechiae, distribution: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="localized" id="petechiae-localized" />
                                <Label htmlFor="petechiae-localized" className="text-white text-sm cursor-pointer">
                                  Localizada (trauma, presión)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="generalized" id="petechiae-generalized" />
                                <Label htmlFor="petechiae-generalized" className="text-white text-sm cursor-pointer">
                                  Generalizada (trombocitopenia)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Densidad:</Label>
                            <RadioGroup
                              value={physicalExam.bleedingEvaluation.petechiae.density}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  bleedingEvaluation: {
                                    ...prev.bleedingEvaluation,
                                    petechiae: { ...prev.bleedingEvaluation.petechiae, density: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="scarce" id="petechiae-scarce" />
                                <Label htmlFor="petechiae-scarce" className="text-white text-sm cursor-pointer">
                                  Escasas (plaq 50-100k)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="petechiae-moderate" />
                                <Label htmlFor="petechiae-moderate" className="text-white text-sm cursor-pointer">
                                  Moderadas (plaq 20-50k)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="numerous" id="petechiae-numerous" />
                                <Label htmlFor="petechiae-numerous" className="text-white text-sm cursor-pointer">
                                  Numerosas (plaq {"<20k"})
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Purpura */}
                    <div className="space-y-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="purpura-present"
                          checked={physicalExam.bleedingEvaluation.purpura.present}
                          onCheckedChange={(checked) =>
                            setPhysicalExam(prev => ({
                              ...prev,
                              bleedingEvaluation: {
                                ...prev.bleedingEvaluation,
                                purpura: { ...prev.bleedingEvaluation.purpura, present: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="purpura-present" className="text-white font-medium cursor-pointer">
                          Púrpura (⭕ {">3mm"})
                        </Label>
                      </div>
                      
                      {physicalExam.bleedingEvaluation.purpura.present && (
                        <div className="space-y-3 ml-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="purpura-palpable"
                              checked={physicalExam.bleedingEvaluation.purpura.palpable}
                              onCheckedChange={(checked) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  bleedingEvaluation: {
                                    ...prev.bleedingEvaluation,
                                    purpura: { ...prev.bleedingEvaluation.purpura, palpable: checked as boolean }
                                  }
                                }))
                              }
                            />
                            <Label htmlFor="purpura-palpable" className="text-white text-sm cursor-pointer">
                              Palpable (vasculitis vs plaquetaria)
                            </Label>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Tamaño predominante:</Label>
                            <RadioGroup
                              value={physicalExam.bleedingEvaluation.purpura.size}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  bleedingEvaluation: {
                                    ...prev.bleedingEvaluation,
                                    purpura: { ...prev.bleedingEvaluation.purpura, size: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3-10mm" id="purpura-small" />
                                <Label htmlFor="purpura-small" className="text-white text-sm cursor-pointer">
                                  3-10mm (púrpura menor)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value=">10mm" id="purpura-large" />
                                <Label htmlFor="purpura-large" className="text-white text-sm cursor-pointer">
                                  {">10mm (equimosis)"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Examen Linfático Sistematizado */}
                <Separator className="border-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-300" />
                    Examen Linfático Sistematizado por Cadenas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { key: 'cervical', label: 'Cervical', significance: 'Infecciones ORL, linfomas' },
                      { key: 'supraclavicular', label: 'Supraclavicular', significance: 'Ganglio de Virchow (izq.)' },
                      { key: 'axillary', label: 'Axilar', significance: 'Mama, extremidad superior' },
                      { key: 'epitrochlear', label: 'Epitróclear', significance: 'Muy específico si >1cm' },
                      { key: 'inguinal', label: 'Inguinal', significance: 'Reactivos vs patológicos' },
                      { key: 'mediastinal', label: 'Mediastinal', significance: 'Linfomas, timomas' }
                    ].map((region) => (
                      <div key={region.key} className="space-y-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`lymph-${region.key}`}
                            checked={physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].present}
                            onCheckedChange={(checked) =>
                              setPhysicalExam(prev => ({
                                ...prev,
                                lymphNodeExam: {
                                  ...prev.lymphNodeExam,
                                  [region.key]: { 
                                    ...prev.lymphNodeExam[region.key as keyof typeof prev.lymphNodeExam], 
                                    present: checked as boolean 
                                  }
                                }
                              }))
                            }
                          />
                          <Label htmlFor={`lymph-${region.key}`} className="text-white font-medium cursor-pointer">
                            {region.label} 🔍
                          </Label>
                        </div>
                        <p className="text-green-300 text-xs">{region.significance}</p>
                        
                        {physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].present && (
                          <div className="space-y-3 ml-6">
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Tamaño máximo:</Label>
                              <RadioGroup
                                value={physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].maxSize || physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].size}
                                onValueChange={(value) =>
                                  setPhysicalExam(prev => ({
                                    ...prev,
                                    lymphNodeExam: {
                                      ...prev.lymphNodeExam,
                                      [region.key]: { 
                                        ...prev.lymphNodeExam[region.key as keyof typeof prev.lymphNodeExam], 
                                        maxSize: value,
                                        size: value 
                                      }
                                    }
                                  }))
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="<1cm" id={`${region.key}-small`} />
                                  <Label htmlFor={`${region.key}-small`} className="text-white text-sm cursor-pointer">
                                    {"<1cm (normal)"}
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="1-2cm" id={`${region.key}-medium`} />
                                  <Label htmlFor={`${region.key}-medium`} className="text-white text-sm cursor-pointer">
                                    1-2cm (aumentado)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="2-4cm" id={`${region.key}-large`} />
                                  <Label htmlFor={`${region.key}-large`} className="text-white text-sm cursor-pointer">
                                    2-4cm (patológico)
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value=">4cm" id={`${region.key}-massive`} />
                                  <Label htmlFor={`${region.key}-massive`} className="text-white text-sm cursor-pointer">
                                    {">4cm (masivo)"}
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-white text-sm">Características:</Label>
                              <div className="grid grid-cols-2 gap-1">
                                {[
                                  { key: 'mobile', label: 'Móvil' },
                                  { key: 'fixed', label: 'Fijo' },
                                  { key: 'hard', label: 'Duro' },
                                  { key: 'soft', label: 'Blando' },
                                  { key: 'tender', label: 'Doloroso' },
                                  { key: 'adherent', label: 'Adherido' }
                                ].map((char) => (
                                  <div key={char.key} className="flex items-center space-x-1">
                                    <Checkbox
                                      id={`${region.key}-${char.key}`}
                                      checked={(physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].characteristics as string[] || []).includes(char.key)}
                                      onCheckedChange={(checked) => {
                                        const currentChars = physicalExam.lymphNodeExam[region.key as keyof typeof physicalExam.lymphNodeExam].characteristics as string[] || [];
                                        const newChars = checked 
                                          ? [...currentChars, char.key]
                                          : currentChars.filter(c => c !== char.key);
                                        setPhysicalExam(prev => ({
                                          ...prev,
                                          lymphNodeExam: {
                                            ...prev.lymphNodeExam,
                                            [region.key]: { 
                                              ...prev.lymphNodeExam[region.key as keyof typeof prev.lymphNodeExam], 
                                              characteristics: newChars 
                                            }
                                          }
                                        }));
                                      }}
                                    />
                                    <Label htmlFor={`${region.key}-${char.key}`} className="text-white text-xs cursor-pointer">
                                      {char.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evaluación Hepatoesplénica */}
                <Separator className="border-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-300" />
                    Evaluación Hepatoesplénica con Escalas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Esplenomegalia */}
                    <div className="space-y-3 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="splenomegaly"
                          checked={physicalExam.organomegalyExam.splenomegaly.palpable}
                          onCheckedChange={(checked) =>
                            setPhysicalExam(prev => ({
                              ...prev,
                              organomegalyExam: {
                                ...prev.organomegalyExam,
                                splenomegaly: { ...prev.organomegalyExam.splenomegaly, palpable: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="splenomegaly" className="text-white font-medium cursor-pointer">
                          Esplenomegalia Palpable 🫘
                        </Label>
                      </div>
                      
                      {physicalExam.organomegalyExam.splenomegaly.palpable && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Escala de Hackett:</Label>
                            <RadioGroup
                              value={physicalExam.organomegalyExam.splenomegaly.hackettGrade.toString()}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  organomegalyExam: {
                                    ...prev.organomegalyExam,
                                    splenomegaly: { 
                                      ...prev.organomegalyExam.splenomegaly, 
                                      hackettGrade: parseInt(value),
                                      sizeInCm: parseInt(value) * 2 // Aproximación
                                    }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="hackett-1" />
                                <Label htmlFor="hackett-1" className="text-white text-sm cursor-pointer">
                                  Grado 1 (solo palpable en inspiración)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="hackett-2" />
                                <Label htmlFor="hackett-2" className="text-white text-sm cursor-pointer">
                                  Grado 2 (palpable en espiración)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="hackett-3" />
                                <Label htmlFor="hackett-3" className="text-white text-sm cursor-pointer">
                                  Grado 3 (1/3 distancia a ombligo)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4" id="hackett-4" />
                                <Label htmlFor="hackett-4" className="text-white text-sm cursor-pointer">
                                  Grado 4 (2/3 distancia a ombligo)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="5" id="hackett-5" />
                                <Label htmlFor="hackett-5" className="text-white text-sm cursor-pointer">
                                  Grado 5 (cruza línea media)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Consistencia:</Label>
                            <RadioGroup
                              value={physicalExam.organomegalyExam.splenomegaly.consistency}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  organomegalyExam: {
                                    ...prev.organomegalyExam,
                                    splenomegaly: { ...prev.organomegalyExam.splenomegaly, consistency: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="soft" id="spleen-soft" />
                                <Label htmlFor="spleen-soft" className="text-white text-sm cursor-pointer">
                                  Blanda (congestivo)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="firm" id="spleen-firm" />
                                <Label htmlFor="spleen-firm" className="text-white text-sm cursor-pointer">
                                  Firme (infiltrativo)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hard" id="spleen-hard" />
                                <Label htmlFor="spleen-hard" className="text-white text-sm cursor-pointer">
                                  Dura (fibrosis)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hepatomegalia */}
                    <div className="space-y-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hepatomegaly"
                          checked={physicalExam.organomegalyExam.hepatomegaly.palpable}
                          onCheckedChange={(checked) =>
                            setPhysicalExam(prev => ({
                              ...prev,
                              organomegalyExam: {
                                ...prev.organomegalyExam,
                                hepatomegaly: { ...prev.organomegalyExam.hepatomegaly, palpable: checked as boolean }
                              }
                            }))
                          }
                        />
                        <Label htmlFor="hepatomegaly" className="text-white font-medium cursor-pointer">
                          Hepatomegalia Palpable 🫀
                        </Label>
                      </div>
                      
                      {physicalExam.organomegalyExam.hepatomegaly.palpable && (
                        <div className="space-y-3 ml-6">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Tamaño (cm bajo reborde):</Label>
                            <RadioGroup
                              value={physicalExam.organomegalyExam.hepatomegaly.sizeInCm.toString()}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  organomegalyExam: {
                                    ...prev.organomegalyExam,
                                    hepatomegaly: { ...prev.organomegalyExam.hepatomegaly, sizeInCm: parseInt(value) }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="liver-1cm" />
                                <Label htmlFor="liver-1cm" className="text-white text-sm cursor-pointer">
                                  1cm (leve)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="liver-3cm" />
                                <Label htmlFor="liver-3cm" className="text-white text-sm cursor-pointer">
                                  3cm (moderada)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="5" id="liver-5cm" />
                                <Label htmlFor="liver-5cm" className="text-white text-sm cursor-pointer">
                                  5cm (importante)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="10" id="liver-10cm" />
                                <Label htmlFor="liver-10cm" className="text-white text-sm cursor-pointer">
                                  {">5cm (masiva)"}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Superficie:</Label>
                            <RadioGroup
                              value={physicalExam.organomegalyExam.hepatomegaly.surface}
                              onValueChange={(value) =>
                                setPhysicalExam(prev => ({
                                  ...prev,
                                  organomegalyExam: {
                                    ...prev.organomegalyExam,
                                    hepatomegaly: { ...prev.organomegalyExam.hepatomegaly, surface: value }
                                  }
                                }))
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="smooth" id="liver-smooth" />
                                <Label htmlFor="liver-smooth" className="text-white text-sm cursor-pointer">
                                  Lisa (congestiva)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="irregular" id="liver-irregular" />
                                <Label htmlFor="liver-irregular" className="text-white text-sm cursor-pointer">
                                  Irregular (cirrosis)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nodular" id="liver-nodular" />
                                <Label htmlFor="liver-nodular" className="text-white text-sm cursor-pointer">
                                  Nodular (metástasis)
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📊 PANEL LATERAL DE RESULTADOS EN TIEMPO REAL */}
        <div className="w-80 space-y-4">
          {/* Panel de Alertas Activas */}
          {alerts.length > 0 && (
            <Card className="backdrop-blur-md bg-red-500/10 border border-red-500/30 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Alertas Activas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <Alert key={alert.id} className={`${
                    alert.type === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                    alert.type === 'urgent' ? 'border-yellow-500/50 bg-yellow-500/10' :
                    'border-blue-500/50 bg-blue-500/10'
                  }`}>
                    <AlertDescription className={`text-xs ${
                      alert.type === 'critical' ? 'text-red-200' :
                      alert.type === 'urgent' ? 'text-yellow-200' : 'text-blue-200'
                    }`}>
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Panel de Escalas Médicas */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4 text-purple-400" />
                Escalas Médicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicalScales.map((scale, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">{scale.name}</span>
                    <Badge className={`text-xs ${
                      scale.riskLevel === 'critical' ? 'bg-red-500/30 text-red-200' :
                      scale.riskLevel === 'high' ? 'bg-orange-500/30 text-orange-200' :
                      scale.riskLevel === 'intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'
                    }`}>
                      {scale.score}
                    </Badge>
                  </div>
                  <p className="text-white/80 text-xs">{scale.interpretation}</p>
                  {scale.recommendations.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {scale.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="text-white/60 text-xs">• {rec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
              {medicalScales.length === 0 && (
                <div className="text-center py-4">
                  <Calculator className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">Escalas aparecerán aquí conforme completes el examen</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de Progreso */}
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Progreso del Examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs">Completado</span>
                  <span className="text-white text-sm font-bold">{triageMetrics.progressPercentage}%</span>
                </div>
                <Progress value={triageMetrics.progressPercentage} className="h-2" />
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Triage</span>
                    <span className="text-white">{triageMetrics.emergencyLevel !== 'stable' ? '✓' : '○'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Síntomas</span>
                    <span className="text-white">{Object.values(symptomAssessment.bSymptoms).some(s => s.present) ? '✓' : '○'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Ex. Físico</span>
                    <span className="text-white">{Object.values(physicalExam.pallorAssessment).some(p => p.grade !== '') ? '✓' : '○'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Escalas</span>
                    <span className="text-white">{medicalScales.length > 0 ? '✓' : '○'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de acción principal */}
          <Button 
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3"
            size="lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Finalizar Examen Hematológico
          </Button>
        </div>
      </div>
    </div>
  );
}