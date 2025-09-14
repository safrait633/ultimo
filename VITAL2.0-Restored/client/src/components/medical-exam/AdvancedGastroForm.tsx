import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  Circle, 
  Calculator, 
  AlertTriangle,
  TrendingUp,
  Activity,
  FileText,
  Gauge,
  Stethoscope,
  ClipboardCheck,
  Timer,
  Heart,
  Eye,
  Hand,
  Volume2,
  Target,
  Search,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Zap,
  Brain,
  User
} from "lucide-react";

// Tipos de alertas para el sistema de triage
interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  action?: string;
  priority: number;
}

interface AdvancedGastroFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

export default function AdvancedGastroForm({
  patientData,
  onDataChange,
  onComplete
}: AdvancedGastroFormProps) {
  // Sistema de alertas inteligente
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [triageLevel, setTriageLevel] = useState<'stable' | 'urgent' | 'critical'>('stable');
  
  // Variable de validación cruzada para recomendaciones
  const [crossValidation] = useState({
    recommendedManeuvers: [] as string[]
  });

  // Estados organizados por fase del protocolo clínico integrado I-A-P-P
  const [phase1Data, setPhase1Data] = useState({
    // TRIAGE Y EVALUACIÓN INICIAL CRÍTICA
    triage: {
      emergencyLevel: '',
      vitalSignsStability: '',
      consciousnessLevel: '',
      hemodynamicStatus: '',
      suspectedEmergency: '',
      immediateReferral: false
    },
    anamnesis: {
      mainComplaint: "",
      alicia: {
        aggravating: "", // Agravantes
        location: "",    // Localización
        intensity: 0,    // Intensidad (0-10)
        character: "",   // Carácter
        irradiation: "", // Irradiación
        associated: ""   // Síntomas asociados
      },
      intestinalHabits: {
        bowelMovements: "",
        consistency: "",
        frequency: "",
        blood: false,
        mucus: false,
        tenesmus: false
      },
      alarmSigns: {
        weightLoss: false,
        rectalBleeding: false,
        ironDeficiency: false,
        dysphagia: false,
        persistentVomiting: false,
        familyHistory: false,
        // Signos de alarma específicos para emergencias GI
        charcotTriad: false,      // Colangitis
        reynoldsTriad: false,     // Colangitis complicada
        murphyPositive: false,    // Colecistitis aguda
        abdominalRigidity: false, // Perforación/peritonitis
        massiveHematemesis: false,// Hemorragia masiva
        melena: false,           // Hemorragia digestiva
        shockSigns: false,       // Compromiso hemodinámico
        acuteAbdomen: false      // Abdomen agudo
      },
      antecedents: {
        previousSurgeries: "",
        ibd: false,
        ulcers: false,
        gallstones: false,
        hepaticDisease: false,
        medications: ""
      }
    },
    positioning: {
      supinePosition: true,
      kneesFlexed: true,
      armsAtSides: true,
      fullExposure: true,
      patientComfort: true
    }
  });

  const [phase2Data, setPhase2Data] = useState({
    inspection: {
      static: {
        abdominalShape: "",
        symmetry: true,
        visibleMasses: false,
        scars: {
          present: false,
          description: "",
          location: ""
        },
        striae: {
          present: false,
          purple: false
        },
        collateralCirculation: false,
        caputMedusae: false
      },
      dynamic: {
        coughTest: "",
        headRaiseTest: "",
        respiratoryMovement: "",
        ventralHernias: false,
        eventrations: false
      }
    },
    auscultation: {
      stethoscopeWarmed: true,
      bowelSounds: {
        frequency: "",
        character: "",
        rightUpperQuadrant: "",
        leftUpperQuadrant: "",
        rightLowerQuadrant: "",
        leftLowerQuadrant: ""
      },
      vascularSounds: {
        aorticBruit: false,
        renalArteryBruit: false,
        iliacBruit: false
      }
    },
    percussion: {
      radiatedPercussion: {
        predominantSound: "",
        tympanyAreas: "",
        dullnessAreas: ""
      },
      hepaticDullness: {
        upperBorder: "",
        lowerBorder: "",
        span: 0
      },
      splenicDullness: {
        traumeSpace: "",
        splenomegaly: false
      },
      ascites: {
        flankDullness: false,
        shiftingDullness: false,
        fluidWaveSign: false
      }
    },
    palpation: {
      superficial: {
        tenderness: "",
        temperature: "",
        muscularDefense: "",
        voluntaryGuarding: false,
        involuntaryRigidity: false
      },
      deep: {
        masses: {
          present: false,
          location: "",
          size: "",
          shape: "",
          consistency: "",
          mobility: "",
          tenderness: false
        },
        hepaticPalpation: {
          palpable: false,
          method: "",
          edge: "",
          surface: "",
          consistency: "",
          tenderness: false
        },
        splenicPalpation: {
          palpable: false,
          method: "",
          size: "",
          consistency: "",
          tenderness: false
        }
      }
    }
  });

  const [specificManeuvers, setSpecificManeuvers] = useState({
    indicated: {
      murphy: false,
      appendicular: false,
      blumberg: false,
      psoas: false,
      obturator: false,
      // Maniobras especializadas avanzadas
      boas: false,
      carnett: false,
      carvallo: false,
      sisterMaryJoseph: false,
      courvoisier: false,
      ballance: false,
      kehr: false,
      dance: false,
      greyTurner: false,
      cullen: false
    },
    results: {
      murphySign: false,
      mcBurneyPoint: false,
      blumbergSign: false,
      psoasSign: false,
      obturatorSign: false,
      // Resultados de maniobras avanzadas
      boasSign: false,
      carnettTest: false,
      carvalloSign: false,
      sisterMaryJosephSign: false,
      courvoisierSign: false,
      ballanceSign: false,
      kehrSign: false,
      danceSign: false,
      greyTurnerSign: false,
      cullenSign: false
    },
    additionalSigns: {
      rovsing: false,
      cutaneous: false,
      cough: false
    }
  });

  const [phase5Data, setPhase5Data] = useState({
    rectalExam: {
      performed: false,
      sphincterTone: "",
      prostateFindings: "",
      masses: false,
      tenderness: false,
      bloodOnGlove: false,
      guaiacTest: ""
    },
    genitalExam: {
      performed: false,
      findings: ""
    },
    complementaryData: {
      vitalSigns: {
        bloodPressure: { systolic: 0, diastolic: 0 },
        heartRate: 0,
        temperature: 0
      },
      laboratoryData: {
        hemoglobin: 0,
        hematocrit: 0,
        leukocytes: 0,
        bilirubin: 0,
        albumin: 0,
        inr: 0,
        urea: 0
      }
    }
  });

  const [scalesData, setScalesData] = useState({
    childPugh: {
      bilirubin: 0,
      albumin: 0,
      inr: 0,
      ascites: 0,
      encephalopathy: 0,
      totalScore: 0,
      classification: ""
    },
    // MELD-Na (Más preciso que MELD clásico)
    meldNa: {
      bilirubin: 0,
      creatinine: 0,
      inr: 0,
      sodium: 140,
      dialysis: false,
      totalScore: 0,
      mortalityRisk: ""
    },
    glasgowBlatchford: {
      urea: 0,
      hemoglobin: 0,
      systolicBP: 0,
      heartRate: 0,
      melena: false,
      syncope: false,
      hepaticDisease: false,
      heartFailure: false,
      totalScore: 0
    },
    // BISAP para pancreatitis aguda
    bisap: {
      bun: 0,              // BUN > 25 mg/dL
      impairedMentalState: false,
      sirs: false,         // Criterios SIRS
      age: 0,              // > 60 años
      pleuralEffusion: false,
      totalScore: 0,
      severityRisk: ""
    },
    // Criterios Rome IV para trastornos funcionales
    romeIV: {
      // Dispepsia funcional
      postprandialFullness: false,
      earlyFullness: false,
      epigastricPain: false,
      epigastricBurning: false,
      duration: 0,         // meses
      noStructuralDisease: false,
      functionalDyspepsia: false,
      
      // Síndrome intestino irritable
      abdominalPain: false,
      painRelatedDefecation: false,
      changeFrequency: false,
      changeAppearance: false,
      ibsClassification: "",
      
      totalScore: 0
    },
    // SGA - Valoración Global Subjetiva nutricional
    sga: {
      weightLoss: 0,       // % en 6 meses
      dietaryIntake: "",   // normal/moderada/severa
      giSymptoms: "",      // náuseas, vómitos, diarrea
      functionalCapacity: "", // normal/reducida/severamente reducida
      metabolicRequirements: "", // normal/aumentados
      physicalExam: "",    // normal/leve/moderada/severa
      subcutaneousFat: "",
      muscleWasting: "",
      edemaAscites: false,
      totalScore: 0,
      classification: ""    // A: bien nutrido, B: moderadamente desnutrido, C: severamente desnutrido
    },
    diagnosticImpression: {
      primary: "",
      differential: "",
      plan: ""
    }
  });

  // SISTEMA DE ALERTAS AUTOMÁTICAS ESPECÍFICAS PARA GASTROENTEROLOGÍA
  const checkEmergencyAlerts = () => {
    const newAlerts: Alert[] = [];
    const { triage, anamnesis } = phase1Data;
    const { vitalSigns, laboratoryData } = phase5Data.complementaryData;
    
    // 🔴 ALERTAS ROJAS (Emergencia inmediata)
    // Triada de Charcot + hipotensión (Colangitis)
    if (anamnesis.alarmSigns.charcotTriad && vitalSigns.bloodPressure.systolic < 90) {
      newAlerts.push({
        id: 'cholangitis',
        type: 'critical',
        message: '🚨 EMERGENCIA: Colangitis con shock séptico - Derivación INMEDIATA',
        action: 'CPRE urgente + antibióticos IV + soporte hemodinámico',
        priority: 1
      });
    }
    
    // Rigidez abdominal + fiebre (Perforación)
    if (anamnesis.alarmSigns.abdominalRigidity && vitalSigns.temperature > 38.5) {
      newAlerts.push({
        id: 'perforation',
        type: 'critical',
        message: '🚨 EMERGENCIA: Sospecha perforación visceral - Cirugía URGENTE',
        action: 'Cirugía inmediata + antibióticos IV + ayuno absoluto',
        priority: 1
      });
    }
    
    // Hematemesis + shock (Hemorragia masiva)
    if (anamnesis.alarmSigns.massiveHematemesis && anamnesis.alarmSigns.shockSigns) {
      newAlerts.push({
        id: 'massive_hemorrhage',
        type: 'critical',
        message: '🚨 EMERGENCIA: Hemorragia digestiva masiva con shock',
        action: 'Endoscopia URGENTE + transfusión + UCI',
        priority: 1
      });
    }
    
    // Murphy + ictericia + fiebre (Colecistitis complicada)
    if (anamnesis.alarmSigns.murphyPositive && anamnesis.alarmSigns.charcotTriad) {
      newAlerts.push({
        id: 'complicated_cholecystitis',
        type: 'critical',
        message: '🚨 EMERGENCIA: Colecistitis complicada',
        action: 'Colecistectomía urgente + antibióticos IV',
        priority: 1
      });
    }
    
    // 🟡 ALERTAS AMARILLAS (Urgencia diferida)
    // Glasgow-Blatchford > 6 (Alto riesgo resangrado)
    if (scalesData.glasgowBlatchford.totalScore > 6) {
      newAlerts.push({
        id: 'high_rebleeding_risk',
        type: 'warning',
        message: '⚠️ URGENCIA: Alto riesgo de resangrado (Glasgow-Blatchford > 6)',
        action: 'Endoscopia en 24h + hospitalización',
        priority: 2
      });
    }
    
    // Child-Pugh C + ascitis (Descompensación)
    if (scalesData.childPugh.classification.includes('Clase C') && 
        phase2Data.percussion.ascites.flankDullness) {
      newAlerts.push({
        id: 'hepatic_decompensation',
        type: 'warning',
        message: '⚠️ URGENCIA: Descompensación hepática severa',
        action: 'Hospitalización + diuréticos + restricción sodio',
        priority: 2
      });
    }
    
    // Dolor epigástrico + amilasa elevada simulada
    if (anamnesis.alicia.location === 'epigastrio' && 
        anamnesis.alicia.intensity >= 8) {
      newAlerts.push({
        id: 'pancreatitis_suspicion',
        type: 'warning',
        message: '⚠️ URGENCIA: Sospecha pancreatitis aguda',
        action: 'Laboratorios (amilasa/lipasa) + TC abdominal urgente',
        priority: 2
      });
    }
    
    // 🟢 ALERTAS VERDES (Seguimiento)
    // Síntomas funcionales
    if (anamnesis.alicia.intensity <= 4 && 
        !Object.values(anamnesis.alarmSigns).some(sign => sign === true)) {
      newAlerts.push({
        id: 'functional_symptoms',
        type: 'info',
        message: '✅ SEGUIMIENTO: Probable trastorno funcional',
        action: 'Aplicar criterios Rome IV + manejo conservador',
        priority: 3
      });
    }
    
    // Actualizar nivel de triage basado en alertas
    const criticalAlerts = newAlerts.filter(alert => alert.type === 'critical');
    const warningAlerts = newAlerts.filter(alert => alert.type === 'warning');
    
    if (criticalAlerts.length > 0) {
      setTriageLevel('critical');
    } else if (warningAlerts.length > 0) {
      setTriageLevel('urgent');
    } else {
      setTriageLevel('stable');
    }
    
    setAlerts(newAlerts.sort((a, b) => a.priority - b.priority));
  };
  
  // FLUJOS ADAPTATIVOS ESPECÍFICOS PARA EMERGENCIAS GI
  const [adaptiveFlows, setAdaptiveFlows] = useState({
    hemorrhageProtocol: {
      active: false,
      severity: '',
      immediateActions: [],
      timeline: ''
    },
    acuteAbdomenProtocol: {
      active: false,
      suspectedCause: '',
      surgicalUrgency: '',
      workupPlan: []
    },
    cholangitisProtocol: {
      active: false,
      severity: '',
      antibiotics: [],
      drainageUrgency: ''
    }
  });
  
  const activateAdaptiveFlows = () => {
    const newFlows = { ...adaptiveFlows };
    const { alarmSigns, alicia } = phase1Data.anamnesis;
    const { vitalSigns } = phase5Data.complementaryData;
    
    // PROTOCOLO DE HEMORRAGIA DIGESTIVA
    if (alarmSigns.massiveHematemesis || alarmSigns.melena || scalesData.glasgowBlatchford.totalScore >= 6) {
      let severity = 'leve';
      const actions = ['Acceso vascular doble', 'Tipificación y reserva 6U sangre'];
      let timeline = 'Endoscopia en 12-24h';
      
      if (alarmSigns.massiveHematemesis && alarmSigns.shockSigns) {
        severity = 'masiva con shock';
        actions.push(
          'Reanimación agresiva con cristaloides',
          'Transfusión inmediata si Hb < 7 g/dL',
          'Octreotide 50 mcg IV bolo + 50 mcg/h',
          'PPI en bolo + infusión continua',
          'Contactar gastroenterología URGENTE'
        );
        timeline = 'Endoscopia en < 2 horas';
      } else if (scalesData.glasgowBlatchford.totalScore >= 12) {
        severity = 'alto riesgo';
        actions.push(
          'Hospitalización inmediata',
          'Octreotide si sospecha variceal',
          'PPI IV en bolo'
        );
        timeline = 'Endoscopia en < 6 horas';
      }
      
      newFlows.hemorrhageProtocol = {
        active: true,
        severity,
        immediateActions: actions as string[],
        timeline
      };
    }
    
    // PROTOCOLO DE ABDOMEN AGUDO
    if (alarmSigns.acuteAbdomen || alarmSigns.abdominalRigidity || 
        (alicia.intensity >= 8)) {
      
      let suspectedCause = '';
      let surgicalUrgency = 'diferida';
      const workup = ['Hemograma', 'Química sanguínea', 'Coagulación', 'Orina'];
      
      if (alarmSigns.abdominalRigidity && vitalSigns.temperature > 38.5) {
        suspectedCause = 'Perforación visceral con peritonitis';
        surgicalUrgency = 'inmediata';
        workup.push(
          'TC abdomen/pelvis con contraste IV URGENTE',
          'Gasometría arterial',
          'Lactato sérico',
          'Rx tórax (neumoperitoneo)'
        );
      } else if (alicia.location === 'fosa iliaca derecha' && alicia.intensity >= 7) {
        suspectedCause = 'Apendicitis aguda';
        surgicalUrgency = 'urgente (< 24h)';
        workup.push('TC abdomen/pelvis', 'PCR', 'Ecografía abdominal');
      } else if (alarmSigns.charcotTriad) {
        suspectedCause = 'Colangitis aguda';
        surgicalUrgency = 'drenaje urgente';
        workup.push('Bilirrubinas', 'FA/GGT', 'CPRE urgente');
      }
      
      newFlows.acuteAbdomenProtocol = {
        active: true,
        suspectedCause,
        surgicalUrgency,
        workupPlan: workup as string[]
      };
    }
    
    // PROTOCOLO DE COLANGITIS
    if (alarmSigns.charcotTriad || alarmSigns.reynoldsTriad) {
      let severity = 'leve';
      const antibiotics = ['Piperacilina-tazobactam 4.5g c/8h IV'];
      let drainageUrgency = 'electiva';
      
      if (alarmSigns.reynoldsTriad || 
          (alarmSigns.charcotTriad && vitalSigns.bloodPressure.systolic < 90)) {
        severity = 'severa con shock séptico';
        antibiotics.push(
          'Vancomicina 15-20 mg/kg c/12h IV',
          'Considerar antifúngicos si factores de riesgo'
        );
        drainageUrgency = 'inmediata (< 6h)';
      } else if (alarmSigns.charcotTriad) {
        severity = 'moderada';
        drainageUrgency = 'urgente (< 24h)';
      }
      
      newFlows.cholangitisProtocol = {
        active: true,
        severity,
        antibiotics: antibiotics as string[],
        drainageUrgency
      };
    }
    
    setAdaptiveFlows(newFlows);
  };
  
  // Ejecutar alertas y flujos cuando cambien los datos relevantes
  useEffect(() => {
    checkEmergencyAlerts();
    activateAdaptiveFlows();
  }, [phase1Data.anamnesis.alarmSigns, phase5Data.complementaryData.vitalSigns, 
      scalesData.childPugh, scalesData.glasgowBlatchford, phase1Data.anamnesis.alicia]);
  
  // CALCULADORAS DINÁMICAS AVANZADAS
  
  // Cálculo MELD-Na (más preciso que MELD estándar)
  const calculateMELDNa = () => {
    const { bilirubin, creatinine, inr, sodium, dialysis } = scalesData.meldNa;
    
    // Fórmula MELD-Na original
    let meldScore = 3.78 * Math.log(Math.max(bilirubin, 1)) + 
                   11.2 * Math.log(Math.max(inr, 1)) + 
                   9.57 * Math.log(Math.max(creatinine, 1)) + 
                   6.43;
    
    if (dialysis) {
      meldScore = Math.max(meldScore, 40);
    }
    
    // Ajuste por sodio
    const sodiumAdjusted = Math.max(Math.min(sodium, 137), 125);
    const meldNaScore = meldScore + 1.32 * (137 - sodiumAdjusted) - 
                       (0.033 * meldScore * (137 - sodiumAdjusted));
    
    const finalScore = Math.round(Math.max(6, Math.min(meldNaScore, 40)));
    
    let mortalityRisk = "";
    if (finalScore < 15) mortalityRisk = "Bajo riesgo (< 6% mortalidad 3 meses)";
    else if (finalScore < 25) mortalityRisk = "Riesgo moderado (6-20% mortalidad 3 meses)";
    else mortalityRisk = "Alto riesgo (> 20% mortalidad 3 meses)";
    
    setScalesData(prev => ({
      ...prev,
      meldNa: { ...prev.meldNa, totalScore: finalScore, mortalityRisk }
    }));
  };
  
  // Cálculo BISAP para pancreatitis aguda
  const calculateBISAP = () => {
    const { bun, impairedMentalState, sirs, age, pleuralEffusion } = scalesData.bisap;
    
    let score = 0;
    if (bun > 25) score += 1;                    // BUN > 25 mg/dL
    if (impairedMentalState) score += 1;         // Estado mental alterado
    if (sirs) score += 1;                        // Criterios SIRS
    if (age > 60) score += 1;                    // Edad > 60 años
    if (pleuralEffusion) score += 1;             // Derrame pleural
    
    let severityRisk = "";
    if (score <= 2) severityRisk = "Bajo riesgo de complicaciones (< 2% mortalidad)";
    else if (score === 3) severityRisk = "Riesgo moderado (5-7% mortalidad)";
    else severityRisk = "Alto riesgo (> 15% mortalidad, considerar UCI)";
    
    setScalesData(prev => ({
      ...prev,
      bisap: { ...prev.bisap, totalScore: score, severityRisk }
    }));
  };
  
  // Evaluación Rome IV
  const evaluateRomeIV = () => {
    const rome = scalesData.romeIV;
    let score = 0;
    
    // Dispepsia funcional (2 de 4 síntomas por ≥ 3 meses)
    const dyspepsiaSymptoms = [
      rome.postprandialFullness,
      rome.earlyFullness,
      rome.epigastricPain,
      rome.epigastricBurning
    ].filter(Boolean).length;
    
    const functionalDyspepsia = dyspepsiaSymptoms >= 2 && 
                               rome.duration >= 3 && 
                               rome.noStructuralDisease;
    
    // IBS (dolor abdominal + 2 criterios asociados)
    const ibsCriteria = [
      rome.painRelatedDefecation,
      rome.changeFrequency,
      rome.changeAppearance
    ].filter(Boolean).length;
    
    const ibsDiagnosis = rome.abdominalPain && ibsCriteria >= 2 && rome.duration >= 3;
    
    let ibsClassification = "";
    if (ibsDiagnosis) {
      // Simplificado - en realidad requiere evaluación detallada de hábitos intestinales
      ibsClassification = "IBS - Requiere clasificación detallada (C/D/M/U)";
    }
    
    setScalesData(prev => ({
      ...prev,
      romeIV: { 
        ...prev.romeIV, 
        functionalDyspepsia, 
        ibsClassification,
        totalScore: (functionalDyspepsia ? 1 : 0) + (ibsDiagnosis ? 1 : 0)
      }
    }));
  };
  
  // Cálculo SGA (Valoración Global Subjetiva)
  const calculateSGA = () => {
    const sga = scalesData.sga;
    let score = 0;
    
    // Evaluación numérica simplificada
    // Pérdida de peso
    if (sga.weightLoss >= 10) score += 2;
    else if (sga.weightLoss >= 5) score += 1;
    
    // Ingesta dietética
    if (sga.dietaryIntake === 'severa') score += 2;
    else if (sga.dietaryIntake === 'moderada') score += 1;
    
    // Síntomas GI
    if (sga.giSymptoms === 'severos') score += 2;
    else if (sga.giSymptoms === 'moderados') score += 1;
    
    // Capacidad funcional
    if (sga.functionalCapacity === 'severamente reducida') score += 2;
    else if (sga.functionalCapacity === 'reducida') score += 1;
    
    // Examen físico
    if (sga.physicalExam === 'severa') score += 3;
    else if (sga.physicalExam === 'moderada') score += 2;
    else if (sga.physicalExam === 'leve') score += 1;
    
    if (sga.edemaAscites) score += 1;
    
    let classification = "";
    if (score <= 3) classification = "A: Bien nutrido";
    else if (score <= 8) classification = "B: Moderadamente desnutrido";
    else classification = "C: Severamente desnutrido";
    
    setScalesData(prev => ({
      ...prev,
      sga: { ...prev.sga, totalScore: score, classification }
    }));
  };
  
  // Cálculos automáticos
  const calculateChildPugh = () => {
    const { bilirubin, albumin, inr, ascites, encephalopathy } = scalesData.childPugh;
    
    let score = 0;
    
    // Bilirrubina (mg/dL)
    if (bilirubin < 2) score += 1;
    else if (bilirubin <= 3) score += 2;
    else score += 3;
    
    // Albúmina (g/dL)  
    if (albumin > 3.5) score += 1;
    else if (albumin >= 2.8) score += 2;
    else score += 3;
    
    // INR
    if (inr < 1.7) score += 1;
    else if (inr <= 2.3) score += 2;
    else score += 3;
    
    score += ascites + encephalopathy;
    
    let classification = "";
    if (score <= 6) classification = "Clase A (Compensado)";
    else if (score <= 9) classification = "Clase B (Descompensado)";
    else classification = "Clase C (Descompensado severo)";
    
    setScalesData(prev => ({
      ...prev,
      childPugh: { ...prev.childPugh, totalScore: score, classification }
    }));
  };

  const calculateGlasgowBlatchford = () => {
    const { urea, hemoglobin, systolicBP, heartRate, melena, syncope, hepaticDisease, heartFailure } = scalesData.glasgowBlatchford;
    
    let score = 0;
    
    // Urea (mg/dL)
    if (urea >= 25) score += 2;
    else if (urea >= 18.2) score += 1;
    
    // Hemoglobina según sexo (asumiendo masculino para simplicidad)
    if (hemoglobin < 10) score += 6;
    else if (hemoglobin < 12) score += 3;
    else if (hemoglobin < 13) score += 1;
    
    // Presión sistólica
    if (systolicBP < 90) score += 3;
    else if (systolicBP < 100) score += 2;
    else if (systolicBP < 110) score += 1;
    
    // Frecuencia cardíaca
    if (heartRate >= 100) score += 1;
    
    // Síntomas y comorbilidades
    if (melena) score += 1;
    if (syncope) score += 2;
    if (hepaticDisease) score += 2;
    if (heartFailure) score += 2;
    
    setScalesData(prev => ({
      ...prev,
      glasgowBlatchford: { ...prev.glasgowBlatchford, totalScore: score }
    }));
  };

  // UseEffects para cálculos automáticos
  useEffect(() => {
    calculateChildPugh();
  }, [scalesData.childPugh.bilirubin, scalesData.childPugh.albumin, scalesData.childPugh.inr, scalesData.childPugh.ascites, scalesData.childPugh.encephalopathy]);

  useEffect(() => {
    calculateGlasgowBlatchford();
  }, [scalesData.glasgowBlatchford.urea, scalesData.glasgowBlatchford.hemoglobin, scalesData.glasgowBlatchford.systolicBP, scalesData.glasgowBlatchford.heartRate, scalesData.glasgowBlatchford.melena, scalesData.glasgowBlatchford.syncope, scalesData.glasgowBlatchford.hepaticDisease, scalesData.glasgowBlatchford.heartFailure]);
  
  useEffect(() => {
    calculateMELDNa();
  }, [scalesData.meldNa.bilirubin, scalesData.meldNa.creatinine, scalesData.meldNa.inr, scalesData.meldNa.sodium, scalesData.meldNa.dialysis]);
  
  useEffect(() => {
    calculateBISAP();
  }, [scalesData.bisap.bun, scalesData.bisap.impairedMentalState, scalesData.bisap.sirs, scalesData.bisap.age, scalesData.bisap.pleuralEffusion]);
  
  useEffect(() => {
    evaluateRomeIV();
  }, [scalesData.romeIV.postprandialFullness, scalesData.romeIV.earlyFullness, scalesData.romeIV.epigastricPain, scalesData.romeIV.epigastricBurning, scalesData.romeIV.duration, scalesData.romeIV.noStructuralDisease, scalesData.romeIV.abdominalPain, scalesData.romeIV.painRelatedDefecation, scalesData.romeIV.changeFrequency, scalesData.romeIV.changeAppearance]);
  
  useEffect(() => {
    calculateSGA();
  }, [scalesData.sga.weightLoss, scalesData.sga.dietaryIntake, scalesData.sga.giSymptoms, scalesData.sga.functionalCapacity, scalesData.sga.physicalExam, scalesData.sga.edemaAscites]);

  const handleComplete = () => {
    const completeData = {
      phase1: phase1Data,
      phase2: phase2Data,
      specificManeuvers: specificManeuvers,
      phase5: phase5Data,
      scales: scalesData,
      summary: {
        childPughScore: scalesData.childPugh.totalScore,
        childPughClass: scalesData.childPugh.classification,
        glasgowScore: scalesData.glasgowBlatchford.totalScore,
        painIntensity: phase1Data.anamnesis.alicia.intensity
      }
    };
    
    if (onComplete) {
      onComplete(completeData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* SISTEMA DE TRIAGE INTELIGENTE */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <div className={`h-4 w-4 rounded-full animate-pulse ${
                triageLevel === 'critical' ? 'bg-red-500' :
                triageLevel === 'urgent' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <h2 className={`text-lg font-bold ${
                triageLevel === 'critical' ? 'text-red-300' :
                triageLevel === 'urgent' ? 'text-yellow-300' : 'text-green-300'
              }`}>
                NIVEL DE TRIAGE: {triageLevel === 'critical' ? 'CRÍTICO' :
                                 triageLevel === 'urgent' ? 'URGENTE' : 'ESTABLE'}
              </h2>
            </div>
            
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={`border-2 ${
                  alert.type === 'critical' ? 'bg-red-900/30 border-red-500/50' :
                  alert.type === 'warning' ? 'bg-yellow-900/30 border-yellow-500/50' :
                  'bg-green-900/30 border-green-500/50'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                  <AlertDescription className="text-white">
                    <div className="space-y-2">
                      <div className="font-bold text-lg">{alert.message}</div>
                      {alert.action && (
                        <div className="text-sm opacity-90">
                          <strong>Acción recomendada:</strong> {alert.action}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        {/* PROTOCOLOS ADAPTATIVOS ACTIVADOS */}
        {(adaptiveFlows.hemorrhageProtocol.active || adaptiveFlows.acuteAbdomenProtocol.active || adaptiveFlows.cholangitisProtocol.active) && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <Zap className="h-6 w-6 text-orange-300 animate-pulse" />
              <h2 className="text-xl font-bold text-orange-300">PROTOCOLOS ADAPTATIVOS ACTIVADOS</h2>
            </div>
            
            {/* PROTOCOLO DE HEMORRAGIA DIGESTIVA */}
            {adaptiveFlows.hemorrhageProtocol.active && (
              <Alert className="bg-red-900/40 border-red-500/60 border-2">
                <Activity className="h-6 w-6 text-red-300" />
                <AlertDescription className="text-white">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-red-200">🚑 PROTOCOLO HEMORRAGIA DIGESTIVA</h3>
                      <Badge className={`${
                        adaptiveFlows.hemorrhageProtocol.severity.includes('masiva') ? 'bg-red-600' :
                        adaptiveFlows.hemorrhageProtocol.severity.includes('alto') ? 'bg-orange-600' : 'bg-yellow-600'
                      }`}>
                        {adaptiveFlows.hemorrhageProtocol.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-red-200 mb-2">📝 Acciones Inmediatas:</h4>
                        <ul className="space-y-1">
                          {adaptiveFlows.hemorrhageProtocol.immediateActions.map((action, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-red-300 font-bold">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-200 mb-2">⏰ Timeline:</h4>
                        <div className="text-lg font-bold text-red-100">
                          {adaptiveFlows.hemorrhageProtocol.timeline}
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* PROTOCOLO DE ABDOMEN AGUDO */}
            {adaptiveFlows.acuteAbdomenProtocol.active && (
              <Alert className="bg-orange-900/40 border-orange-500/60 border-2">
                <AlertTriangle className="h-6 w-6 text-orange-300" />
                <AlertDescription className="text-white">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-orange-200">🏥 PROTOCOLO ABDOMEN AGUDO</h3>
                      <Badge className={`${
                        adaptiveFlows.acuteAbdomenProtocol.surgicalUrgency.includes('inmediata') ? 'bg-red-600' :
                        adaptiveFlows.acuteAbdomenProtocol.surgicalUrgency.includes('urgente') ? 'bg-orange-600' : 'bg-yellow-600'
                      }`}>
                        {adaptiveFlows.acuteAbdomenProtocol.surgicalUrgency.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-orange-200 mb-2">🔍 Sospecha Diagnóstica:</h4>
                        <div className="text-lg font-medium text-orange-100">
                          {adaptiveFlows.acuteAbdomenProtocol.suspectedCause || 'En evaluación'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-200 mb-2">📝 Estudios Requeridos:</h4>
                        <ul className="space-y-1">
                          {adaptiveFlows.acuteAbdomenProtocol.workupPlan.map((study, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-orange-300 font-bold">•</span>
                              <span>{study}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* PROTOCOLO DE COLANGITIS */}
            {adaptiveFlows.cholangitisProtocol.active && (
              <Alert className="bg-purple-900/40 border-purple-500/60 border-2">
                <Zap className="h-6 w-6 text-purple-300" />
                <AlertDescription className="text-white">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-purple-200">⚙️ PROTOCOLO COLANGITIS</h3>
                      <Badge className={`${
                        adaptiveFlows.cholangitisProtocol.severity.includes('severa') ? 'bg-red-600' :
                        adaptiveFlows.cholangitisProtocol.severity.includes('moderada') ? 'bg-orange-600' : 'bg-yellow-600'
                      }`}>
                        {adaptiveFlows.cholangitisProtocol.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-purple-200 mb-2">💊 Antibióticos:</h4>
                        <ul className="space-y-1">
                          {adaptiveFlows.cholangitisProtocol.antibiotics.map((antibiotic, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-purple-300 font-bold">•</span>
                              <span>{antibiotic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-200 mb-2">🔧 Drenaje:</h4>
                        <div className="text-lg font-bold text-purple-100">
                          {adaptiveFlows.cholangitisProtocol.drainageUrgency}
                        </div>
                        <div className="text-sm text-purple-200 mt-1">
                          CPRE + esfinterotomía + extracción cálculos
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {/* Header */}
        <div className="text-center space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-3">
            <Circle className="h-10 w-10 text-orange-300" />
            <h1 className="text-4xl font-bold text-white">Exploración Gastroenterológica Integrada</h1>
          </div>
          <p className="text-white/80 text-lg">Protocolo clínico I-A-P-P como proceso único y fluido</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge className={`border border-white/20 ${
              triageLevel === 'critical' ? 'bg-red-500/30 text-white animate-pulse' :
              triageLevel === 'urgent' ? 'bg-yellow-500/30 text-white' :
              'bg-emerald-500/30 text-white'
            }`}>Triage: {triageLevel.toUpperCase()}</Badge>
            <Badge className="bg-emerald-500/30 text-white border border-white/20">Fase 1: Anamnesis-Posicionamiento</Badge>
            <Badge className="bg-blue-500/30 text-white border border-white/20">Fase 2: I-A-P-P Integrado</Badge>
            <Badge className="bg-orange-500/30 text-white border border-white/20">Maniobras Específicas</Badge>
            <Badge className="bg-purple-500/30 text-white border border-white/20">Fase 5: Rectal-Genital</Badge>
          </div>
        </div>

        {/* FASE 1: PREPARACIÓN Y ANAMNESIS (PACIENTE EN DECÚBITO SUPINO) */}
        <Card data-testid="card-fase-1" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-emerald-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-6 w-6 text-emerald-300" />
              Fase 1: Preparación y Anamnesis (Paciente en Decúbito Supino)
              <Badge className="ml-auto bg-emerald-200/30 text-white border border-white/20">
                Acrónimo ALICIA + Posicionamiento
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Anamnesis Dirigida */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-emerald-300" />
                  Anamnesis Dirigida
                </h3>
                
                {/* EVALUACIÓN DE TRIAGE INICIAL */}
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-300" />
                    Evaluación de Triage y Emergencias
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Nivel de Emergencia</Label>
                      <Select 
                        value={phase1Data.triage.emergencyLevel} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          triage: { ...prev.triage, emergencyLevel: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Evaluar gravedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estable">🟢 Estable</SelectItem>
                          <SelectItem value="urgente">🟡 Urgente (24h)</SelectItem>
                          <SelectItem value="critico">🔴 Crítico (inmediato)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Estado Hemodinámico</Label>
                      <Select 
                        value={phase1Data.triage.hemodynamicStatus} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          triage: { ...prev.triage, hemodynamicStatus: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Estado circulatorio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estable">Estable</SelectItem>
                          <SelectItem value="compensado">Compensado</SelectItem>
                          <SelectItem value="shock">Shock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Emergencia Sospechada</Label>
                      <Select 
                        value={phase1Data.triage.suspectedEmergency} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          triage: { ...prev.triage, suspectedEmergency: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Tipo de emergencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguna">Ninguna</SelectItem>
                          <SelectItem value="hemorragia">Hemorragia digestiva</SelectItem>
                          <SelectItem value="perforacion">Perforación</SelectItem>
                          <SelectItem value="obstruccion">Obstrucción</SelectItem>
                          <SelectItem value="colangitis">Colangitis</SelectItem>
                          <SelectItem value="pancreatitis">Pancreatitis aguda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Motivo de Consulta Principal</Label>
                      <Input
                        value={phase1Data.anamnesis.mainComplaint}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          anamnesis: { ...prev.anamnesis, mainComplaint: e.target.value }
                        }))}
                        placeholder="Síntoma abdominal principal"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Signos de Alarma para Emergencias GI</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Signos básicos */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="weightLoss"
                          checked={phase1Data.anamnesis.alarmSigns.weightLoss}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                weightLoss: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="weightLoss" className="text-white text-sm">Pérdida peso involuntaria</Label>
                      </div>
                      
                      {/* Signos de emergencia específicos */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="charcotTriad"
                          checked={phase1Data.anamnesis.alarmSigns.charcotTriad}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                charcotTriad: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="charcotTriad" className="text-white text-sm">🔴 Triada de Charcot</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="abdominalRigidity"
                          checked={phase1Data.anamnesis.alarmSigns.abdominalRigidity}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                abdominalRigidity: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="abdominalRigidity" className="text-white text-sm">🔴 Rigidez abdominal</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="massiveHematemesis"
                          checked={phase1Data.anamnesis.alarmSigns.massiveHematemesis}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                massiveHematemesis: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="massiveHematemesis" className="text-white text-sm">🔴 Hematemesis masiva</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="shockSigns"
                          checked={phase1Data.anamnesis.alarmSigns.shockSigns}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                shockSigns: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="shockSigns" className="text-white text-sm">🔴 Signos de shock</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="murphyPositive"
                          checked={phase1Data.anamnesis.alarmSigns.murphyPositive}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                murphyPositive: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="murphyPositive" className="text-white text-sm">🟡 Murphy positivo</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="melena"
                          checked={phase1Data.anamnesis.alarmSigns.melena}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                melena: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="melena" className="text-white text-sm">🟡 Melena</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="acuteAbdomen"
                          checked={phase1Data.anamnesis.alarmSigns.acuteAbdomen}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alarmSigns: { 
                                ...prev.anamnesis.alarmSigns, 
                                acuteAbdomen: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="acuteAbdomen" className="text-white text-sm">🟡 Abdomen agudo</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acrónimo ALICIA - Dolor */}
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-300" />
                    Análisis del Dolor (Acrónimo ALICIA)
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">A - Agravantes</Label>
                        <Input
                          value={phase1Data.anamnesis.alicia.aggravating}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alicia: { ...prev.anamnesis.alicia, aggravating: e.target.value }
                            }
                          }))}
                          placeholder="Factores que empeoran"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">L - Localización</Label>
                        <Select 
                          value={phase1Data.anamnesis.alicia.location} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alicia: { ...prev.anamnesis.alicia, location: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Ubicación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="epigastrio">Epigastrio</SelectItem>
                            <SelectItem value="hipocondrio-derecho">Hipocondrio derecho</SelectItem>
                            <SelectItem value="hipocondrio-izquierdo">Hipocondrio izquierdo</SelectItem>
                            <SelectItem value="mesogastrio">Mesogastrio</SelectItem>
                            <SelectItem value="fosa-iliaca-derecha">Fosa ilíaca derecha</SelectItem>
                            <SelectItem value="fosa-iliaca-izquierda">Fosa ilíaca izquierda</SelectItem>
                            <SelectItem value="hipogastrio">Hipogastrio</SelectItem>
                            <SelectItem value="difuso">Difuso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">I - Intensidad (0-10)</Label>
                        <div className="space-y-2">
                          <Slider
                            value={[phase1Data.anamnesis.alicia.intensity]}
                            onValueChange={(value) => setPhase1Data(prev => ({ 
                              ...prev, 
                              anamnesis: { 
                                ...prev.anamnesis, 
                                alicia: { ...prev.anamnesis.alicia, intensity: value[0] }
                              }
                            }))}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-center text-white font-medium">
                            {phase1Data.anamnesis.alicia.intensity}/10
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">C - Carácter</Label>
                        <Select 
                          value={phase1Data.anamnesis.alicia.character} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alicia: { ...prev.anamnesis.alicia, character: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Tipo de dolor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sordo">Sordo</SelectItem>
                            <SelectItem value="punzante">Punzante</SelectItem>
                            <SelectItem value="cólico">Cólico</SelectItem>
                            <SelectItem value="quemante">Quemante</SelectItem>
                            <SelectItem value="opresivo">Opresivo</SelectItem>
                            <SelectItem value="pulsátil">Pulsátil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">I - Irradiación</Label>
                        <Input
                          value={phase1Data.anamnesis.alicia.irradiation}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alicia: { ...prev.anamnesis.alicia, irradiation: e.target.value }
                            }
                          }))}
                          placeholder="Hacia dónde se extiende"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">A - Asociados</Label>
                        <Input
                          value={phase1Data.anamnesis.alicia.associated}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              alicia: { ...prev.anamnesis.alicia, associated: e.target.value }
                            }
                          }))}
                          placeholder="Síntomas acompañantes"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hábitos Intestinales */}
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Hábitos Intestinales</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Frecuencia</Label>
                        <Select 
                          value={phase1Data.anamnesis.intestinalHabits.frequency} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              intestinalHabits: { ...prev.anamnesis.intestinalHabits, frequency: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Veces/día" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menos-3-semana">Menos de 3/semana</SelectItem>
                            <SelectItem value="3-semana">3/semana</SelectItem>
                            <SelectItem value="1-dia">1/día</SelectItem>
                            <SelectItem value="2-3-dia">2-3/día</SelectItem>
                            <SelectItem value="mas-3-dia">Más de 3/día</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Consistencia</Label>
                        <Select 
                          value={phase1Data.anamnesis.intestinalHabits.consistency} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              intestinalHabits: { ...prev.anamnesis.intestinalHabits, consistency: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Bristol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tipo-1">Tipo 1 - Terrones duros</SelectItem>
                            <SelectItem value="tipo-2">Tipo 2 - Forma de salchicha</SelectItem>
                            <SelectItem value="tipo-3">Tipo 3 - Salchicha agrietada</SelectItem>
                            <SelectItem value="tipo-4">Tipo 4 - Salchicha lisa</SelectItem>
                            <SelectItem value="tipo-5">Tipo 5 - Trozos blandos</SelectItem>
                            <SelectItem value="tipo-6">Tipo 6 - Pastosa</SelectItem>
                            <SelectItem value="tipo-7">Tipo 7 - Líquida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="blood"
                          checked={phase1Data.anamnesis.intestinalHabits.blood}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              intestinalHabits: { ...prev.anamnesis.intestinalHabits, blood: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="blood" className="text-white">Sangrado rectal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mucus"
                          checked={phase1Data.anamnesis.intestinalHabits.mucus}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              intestinalHabits: { ...prev.anamnesis.intestinalHabits, mucus: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="mucus" className="text-white">Moco</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tenesmus"
                          checked={phase1Data.anamnesis.intestinalHabits.tenesmus}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              intestinalHabits: { ...prev.anamnesis.intestinalHabits, tenesmus: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="tenesmus" className="text-white">Tenesmo</Label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white text-sm font-medium">Antecedentes Relevantes</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="ibd"
                            checked={phase1Data.anamnesis.antecedents.ibd}
                            onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                              ...prev, 
                              anamnesis: { 
                                ...prev.anamnesis, 
                                antecedents: { ...prev.anamnesis.antecedents, ibd: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="ibd" className="text-white text-sm">EII</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="ulcers"
                            checked={phase1Data.anamnesis.antecedents.ulcers}
                            onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                              ...prev, 
                              anamnesis: { 
                                ...prev.anamnesis, 
                                antecedents: { ...prev.anamnesis.antecedents, ulcers: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="ulcers" className="text-white text-sm">Úlceras</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hepaticDisease"
                            checked={phase1Data.anamnesis.antecedents.hepaticDisease}
                            onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                              ...prev, 
                              anamnesis: { 
                                ...prev.anamnesis, 
                                antecedents: { ...prev.anamnesis.antecedents, hepaticDisease: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="hepaticDisease" className="text-white text-sm">Hepatopatía</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Posicionamiento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-300" />
                  Posicionamiento del Paciente
                </h3>
                
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-white/70 text-sm mb-4">Verificar posición óptima para maximizar la relajación de la pared abdominal</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(phase1Data.positioning).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            positioning: { ...prev.positioning, [key]: checked as boolean }
                          }))}
                        />
                        <Label htmlFor={key} className="text-white text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <Alert className="mt-4 bg-blue-500/20 border-blue-500/30">
                    <ShieldCheck className="h-4 w-4 text-blue-300" />
                    <AlertDescription className="text-white text-sm">
                      Exposición completa desde apéndice xifoides hasta sínfisis del pubis
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 2: EXAMEN ABDOMINAL SECUENCIAL I-A-P-P */}
        <Card data-testid="card-fase-2" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-blue-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-6 w-6 text-blue-300" />
              Fase 2: Examen Abdominal Secuencial (I-A-P-P)
              <Badge className="ml-auto bg-blue-200/30 text-white border border-white/20">
                Proceso Único, Fluido e Integrado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* INSPECCIÓN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-300" />
                  Inspección (Estática y Dinámica)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Inspección Estática</h4>
                    <p className="text-white/60 text-sm">Observar desde lado derecho y desde los pies de la cama</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Forma del abdomen</Label>
                        <Select 
                          value={phase2Data.inspection.static.abdominalShape} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            inspection: { 
                              ...prev.inspection, 
                              static: { ...prev.inspection.static, abdominalShape: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Forma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plano">Plano</SelectItem>
                            <SelectItem value="globoso">Globoso</SelectItem>
                            <SelectItem value="excavado">Excavado</SelectItem>
                            <SelectItem value="distendido">Distendido</SelectItem>
                            <SelectItem value="asimétrico">Asimétrico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="symmetry"
                            checked={phase2Data.inspection.static.symmetry}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inspection: { 
                                ...prev.inspection, 
                                static: { ...prev.inspection.static, symmetry: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="symmetry" className="text-white text-sm">Simetría</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="visibleMasses"
                            checked={phase2Data.inspection.static.visibleMasses}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inspection: { 
                                ...prev.inspection, 
                                static: { ...prev.inspection.static, visibleMasses: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="visibleMasses" className="text-white text-sm">Masas visibles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="collateralCirculation"
                            checked={phase2Data.inspection.static.collateralCirculation}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inspection: { 
                                ...prev.inspection, 
                                static: { ...prev.inspection.static, collateralCirculation: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="collateralCirculation" className="text-white text-sm">Circulación colateral</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="caputMedusae"
                            checked={phase2Data.inspection.static.caputMedusae}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inspection: { 
                                ...prev.inspection, 
                                static: { ...prev.inspection.static, caputMedusae: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="caputMedusae" className="text-white text-sm">Cabeza de medusa</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Cicatrices</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="scarsPresent"
                              checked={phase2Data.inspection.static.scars.present}
                              onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                                ...prev, 
                                inspection: { 
                                  ...prev.inspection, 
                                  static: { 
                                    ...prev.inspection.static, 
                                    scars: { ...prev.inspection.static.scars, present: checked as boolean }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="scarsPresent" className="text-white text-sm">Presentes</Label>
                          </div>
                          {phase2Data.inspection.static.scars.present && (
                            <Input
                              value={phase2Data.inspection.static.scars.description}
                              onChange={(e) => setPhase2Data(prev => ({ 
                                ...prev, 
                                inspection: { 
                                  ...prev.inspection, 
                                  static: { 
                                    ...prev.inspection.static, 
                                    scars: { ...prev.inspection.static.scars, description: e.target.value }
                                  }
                                }
                              }))}
                              placeholder="Describir localización y tipo"
                              className="bg-white/5 border-white/20 text-white text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Inspección Dinámica</h4>
                    <p className="text-white/60 text-sm">Pedir al paciente que tosa y levante la cabeza</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Test de la tos</Label>
                        <Select 
                          value={phase2Data.inspection.dynamic.coughTest} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            inspection: { 
                              ...prev.inspection, 
                              dynamic: { ...prev.inspection.dynamic, coughTest: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Resultado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="hernia-ventral">Hernia ventral</SelectItem>
                            <SelectItem value="eventración">Eventración</SelectItem>
                            <SelectItem value="diastasis-recti">Diástasis de rectos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Elevación de cabeza</Label>
                        <Select 
                          value={phase2Data.inspection.dynamic.headRaiseTest} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            inspection: { 
                              ...prev.inspection, 
                              dynamic: { ...prev.inspection.dynamic, headRaiseTest: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Hallazgos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="hernia-epigástrica">Hernia epigástrica</SelectItem>
                            <SelectItem value="hernia-umbilical">Hernia umbilical</SelectItem>
                            <SelectItem value="línea-alba">Defecto línea alba</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Movimiento respiratorio</Label>
                        <Select 
                          value={phase2Data.inspection.dynamic.respiratoryMovement} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            inspection: { 
                              ...prev.inspection, 
                              dynamic: { ...prev.inspection.dynamic, respiratoryMovement: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Patrón" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="superficial">Superficial</SelectItem>
                            <SelectItem value="ausente">Ausente (rigidez)</SelectItem>
                            <SelectItem value="paradójico">Paradójico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* AUSCULTACIÓN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-purple-300" />
                  Auscultación (SIEMPRE ANTES de Percutir o Palpar)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Ruidos Hidroaéreos (RHA)</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="stethoscopeWarmed"
                          checked={phase2Data.auscultation.stethoscopeWarmed}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { ...prev.auscultation, stethoscopeWarmed: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="stethoscopeWarmed" className="text-white text-sm">Estetoscopio calentado</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Frecuencia general</Label>
                        <Select 
                          value={phase2Data.auscultation.bowelSounds.frequency} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              bowelSounds: { ...prev.auscultation.bowelSounds, frequency: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="RHA/min" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ausentes">Ausentes</SelectItem>
                            <SelectItem value="disminuidos">Disminuidos (menos de 5/min)</SelectItem>
                            <SelectItem value="normales">Normales (5-35/min)</SelectItem>
                            <SelectItem value="aumentados">Aumentados (más de 35/min)</SelectItem>
                            <SelectItem value="metálicos">Metálicos (obstrucción)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Características</Label>
                        <Select 
                          value={phase2Data.auscultation.bowelSounds.character} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              bowelSounds: { ...prev.auscultation.bowelSounds, character: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normales">Normales</SelectItem>
                            <SelectItem value="aumentados-gastroenteritis">Aumentados (gastroenteritis)</SelectItem>
                            <SelectItem value="disminuidos-íleo">Disminuidos (íleo)</SelectItem>
                            <SelectItem value="metálicos-obstrucción">Metálicos (obstrucción)</SelectItem>
                            <SelectItem value="en-ráfagas">En ráfagas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Soplos Vasculares</h4>
                    <p className="text-white/60 text-sm">Auscultar con campana sobre grandes vasos</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="aorticBruit"
                          checked={phase2Data.auscultation.vascularSounds.aorticBruit}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              vascularSounds: { ...prev.auscultation.vascularSounds, aorticBruit: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="aorticBruit" className="text-white text-sm">Soplo aórtico</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="renalArteryBruit"
                          checked={phase2Data.auscultation.vascularSounds.renalArteryBruit}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              vascularSounds: { ...prev.auscultation.vascularSounds, renalArteryBruit: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="renalArteryBruit" className="text-white text-sm">Soplo arteria renal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="iliacBruit"
                          checked={phase2Data.auscultation.vascularSounds.iliacBruit}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              vascularSounds: { ...prev.auscultation.vascularSounds, iliacBruit: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="iliacBruit" className="text-white text-sm">Soplo ilíaco</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="font-medium text-white mb-3">Auscultación por Cuadrantes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'rightUpperQuadrant', label: 'Cuadrante superior derecho' },
                      { key: 'leftUpperQuadrant', label: 'Cuadrante superior izquierdo' },
                      { key: 'rightLowerQuadrant', label: 'Cuadrante inferior derecho' },
                      { key: 'leftLowerQuadrant', label: 'Cuadrante inferior izquierdo' }
                    ].map((quadrant) => (
                      <div key={quadrant.key} className="space-y-2">
                        <Label className="text-white text-xs">{quadrant.label}</Label>
                        <Select 
                          value={phase2Data.auscultation.bowelSounds[quadrant.key as keyof typeof phase2Data.auscultation.bowelSounds]} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            auscultation: { 
                              ...prev.auscultation, 
                              bowelSounds: { ...prev.auscultation.bowelSounds, [quadrant.key]: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="RHA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normales">Normales</SelectItem>
                            <SelectItem value="aumentados">Aumentados</SelectItem>
                            <SelectItem value="disminuidos">Disminuidos</SelectItem>
                            <SelectItem value="ausentes">Ausentes</SelectItem>
                            <SelectItem value="metálicos">Metálicos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* PERCUSIÓN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-300" />
                  Percusión
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Percusión General Radiada</h4>
                    <p className="text-white/60 text-sm">Desde apéndice xifoides hacia resto del abdomen</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Sonido predominante</Label>
                        <Select 
                          value={phase2Data.percussion.radiatedPercussion.predominantSound} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              radiatedPercussion: { ...prev.percussion.radiatedPercussion, predominantSound: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Sonido" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="timpanismo">Timpanismo (predominante)</SelectItem>
                            <SelectItem value="matidez">Matidez (predominante)</SelectItem>
                            <SelectItem value="mixto">Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Áreas de timpanismo</Label>
                        <Input
                          value={phase2Data.percussion.radiatedPercussion.tympanyAreas}
                          onChange={(e) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              radiatedPercussion: { ...prev.percussion.radiatedPercussion, tympanyAreas: e.target.value }
                            }
                          }))}
                          placeholder="Describir localización"
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Matidez Hepática</h4>
                    <p className="text-white/60 text-sm">Percutir en línea medioclavicular</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Borde superior</Label>
                        <Select 
                          value={phase2Data.percussion.hepaticDullness.upperBorder} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              hepaticDullness: { ...prev.percussion.hepaticDullness, upperBorder: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Espacio intercostal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4-ei">4º EI</SelectItem>
                            <SelectItem value="5-ei">5º EI (normal)</SelectItem>
                            <SelectItem value="6-ei">6º EI (normal)</SelectItem>
                            <SelectItem value="7-ei">7º EI (normal)</SelectItem>
                            <SelectItem value="8-ei">8º EI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Borde inferior</Label>
                        <Select 
                          value={phase2Data.percussion.hepaticDullness.lowerBorder} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              hepaticDullness: { ...prev.percussion.hepaticDullness, lowerBorder: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Referencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reborde-costal">Reborde costal (normal)</SelectItem>
                            <SelectItem value="2cm-debajo">2cm debajo reborde</SelectItem>
                            <SelectItem value="4cm-debajo">4cm debajo reborde</SelectItem>
                            <SelectItem value="no-delimitable">No delimitable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Span hepático (cm)</Label>
                        <Input
                          type="number"
                          value={phase2Data.percussion.hepaticDullness.span || ''}
                          onChange={(e) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              hepaticDullness: { ...prev.percussion.hepaticDullness, span: Number(e.target.value) }
                            }
                          }))}
                          placeholder="10-12 cm normal"
                          className="bg-white/5 border-white/20 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Matidez Esplénica y Ascitis</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Espacio de Traube</Label>
                        <Select 
                          value={phase2Data.percussion.splenicDullness.traumeSpace} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              splenicDullness: { ...prev.percussion.splenicDullness, traumeSpace: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Percusión" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="timpánico">Timpánico (normal)</SelectItem>
                            <SelectItem value="mate">Mate (esplenomegalia)</SelectItem>
                            <SelectItem value="mixto">Mixto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="splenomegaly"
                          checked={phase2Data.percussion.splenicDullness.splenomegaly}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            percussion: { 
                              ...prev.percussion, 
                              splenicDullness: { ...prev.percussion.splenicDullness, splenomegaly: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="splenomegaly" className="text-white text-sm">Esplenomegalia</Label>
                      </div>

                      <Separator className="border-white/30" />

                      <h5 className="text-white text-sm font-medium">Ascitis</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="flankDullness"
                            checked={phase2Data.percussion.ascites.flankDullness}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              percussion: { 
                                ...prev.percussion, 
                                ascites: { ...prev.percussion.ascites, flankDullness: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="flankDullness" className="text-white text-sm">Matidez flancos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="shiftingDullness"
                            checked={phase2Data.percussion.ascites.shiftingDullness}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              percussion: { 
                                ...prev.percussion, 
                                ascites: { ...prev.percussion.ascites, shiftingDullness: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="shiftingDullness" className="text-white text-sm">Matidez desplazable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="fluidWaveSign"
                            checked={phase2Data.percussion.ascites.fluidWaveSign}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              percussion: { 
                                ...prev.percussion, 
                                ascites: { ...prev.percussion.ascites, fluidWaveSign: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="fluidWaveSign" className="text-white text-sm">Signo de la oleada</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* PALPACIÓN */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hand className="h-5 w-5 text-red-300" />
                  Palpación (Superficial a Profunda)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Palpación Superficial</h4>
                    <p className="text-white/60 text-sm">Comenzar lejos del área de dolor, mano plana</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Sensibilidad</Label>
                        <Select 
                          value={phase2Data.palpation.superficial.tenderness} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            palpation: { 
                              ...prev.palpation, 
                              superficial: { ...prev.palpation.superficial, tenderness: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Dolor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sin-dolor">Sin dolor</SelectItem>
                            <SelectItem value="dolor-leve">Dolor leve</SelectItem>
                            <SelectItem value="dolor-moderado">Dolor moderado</SelectItem>
                            <SelectItem value="dolor-intenso">Dolor intenso</SelectItem>
                            <SelectItem value="localizado">Localizado</SelectItem>
                            <SelectItem value="difuso">Difuso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Temperatura</Label>
                        <Select 
                          value={phase2Data.palpation.superficial.temperature} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            palpation: { 
                              ...prev.palpation, 
                              superficial: { ...prev.palpation.superficial, temperature: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Temperatura" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="caliente">Caliente</SelectItem>
                            <SelectItem value="fría">Fría</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Defensa muscular</Label>
                        <Select 
                          value={phase2Data.palpation.superficial.muscularDefense} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            palpation: { 
                              ...prev.palpation, 
                              superficial: { ...prev.palpation.superficial, muscularDefense: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Defensa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ausente">Ausente</SelectItem>
                            <SelectItem value="voluntaria">Voluntaria</SelectItem>
                            <SelectItem value="involuntaria">Involuntaria (rigidez)</SelectItem>
                            <SelectItem value="tabla">En tabla</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Palpación Profunda</h4>
                    <p className="text-white/60 text-sm">Buscar masas y organomegalias</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="massesPresent"
                            checked={phase2Data.palpation.deep.masses.present}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              palpation: { 
                                ...prev.palpation, 
                                deep: { 
                                  ...prev.palpation.deep, 
                                  masses: { ...prev.palpation.deep.masses, present: checked as boolean }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="massesPresent" className="text-white text-sm">Masas palpables</Label>
                        </div>
                        
                        {phase2Data.palpation.deep.masses.present && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <Input
                              value={phase2Data.palpation.deep.masses.location}
                              onChange={(e) => setPhase2Data(prev => ({ 
                                ...prev, 
                                palpation: { 
                                  ...prev.palpation, 
                                  deep: { 
                                    ...prev.palpation.deep, 
                                    masses: { ...prev.palpation.deep.masses, location: e.target.value }
                                  }
                                }
                              }))}
                              placeholder="Localización"
                              className="bg-white/5 border-white/20 text-white text-sm"
                            />
                            <Input
                              value={phase2Data.palpation.deep.masses.size}
                              onChange={(e) => setPhase2Data(prev => ({ 
                                ...prev, 
                                palpation: { 
                                  ...prev.palpation, 
                                  deep: { 
                                    ...prev.palpation.deep, 
                                    masses: { ...prev.palpation.deep.masses, size: e.target.value }
                                  }
                                }
                              }))}
                              placeholder="Tamaño"
                              className="bg-white/5 border-white/20 text-white text-sm"
                            />
                            <Input
                              value={phase2Data.palpation.deep.masses.consistency}
                              onChange={(e) => setPhase2Data(prev => ({ 
                                ...prev, 
                                palpation: { 
                                  ...prev.palpation, 
                                  deep: { 
                                    ...prev.palpation.deep, 
                                    masses: { ...prev.palpation.deep.masses, consistency: e.target.value }
                                  }
                                }
                              }))}
                              placeholder="Consistencia"
                              className="bg-white/5 border-white/20 text-white text-sm"
                            />
                            <Input
                              value={phase2Data.palpation.deep.masses.mobility}
                              onChange={(e) => setPhase2Data(prev => ({ 
                                ...prev, 
                                palpation: { 
                                  ...prev.palpation, 
                                  deep: { 
                                    ...prev.palpation.deep, 
                                    masses: { ...prev.palpation.deep.masses, mobility: e.target.value }
                                  }
                                }
                              }))}
                              placeholder="Movilidad"
                              className="bg-white/5 border-white/20 text-white text-sm"
                            />
                          </div>
                        )}
                      </div>

                      <Separator className="border-white/30" />

                      <div className="space-y-2">
                        <h5 className="text-white text-sm font-medium">Palpación Hepática</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="hepaticPalpable"
                              checked={phase2Data.palpation.deep.hepaticPalpation.palpable}
                              onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                                ...prev, 
                                palpation: { 
                                  ...prev.palpation, 
                                  deep: { 
                                    ...prev.palpation.deep, 
                                    hepaticPalpation: { ...prev.palpation.deep.hepaticPalpation, palpable: checked as boolean }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="hepaticPalpable" className="text-white text-sm">Palpable</Label>
                          </div>
                          
                          {phase2Data.palpation.deep.hepaticPalpation.palpable && (
                            <div className="grid grid-cols-2 gap-2">
                              <Select 
                                value={phase2Data.palpation.deep.hepaticPalpation.method} 
                                onValueChange={(value) => setPhase2Data(prev => ({ 
                                  ...prev, 
                                  palpation: { 
                                    ...prev.palpation, 
                                    deep: { 
                                      ...prev.palpation.deep, 
                                      hepaticPalpation: { ...prev.palpation.deep.hepaticPalpation, method: value }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Método" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mathieu">Mathieu (enganche)</SelectItem>
                                  <SelectItem value="gilbert">Gilbert (cuchara)</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select 
                                value={phase2Data.palpation.deep.hepaticPalpation.edge} 
                                onValueChange={(value) => setPhase2Data(prev => ({ 
                                  ...prev, 
                                  palpation: { 
                                    ...prev.palpation, 
                                    deep: { 
                                      ...prev.palpation.deep, 
                                      hepaticPalpation: { ...prev.palpation.deep.hepaticPalpation, edge: value }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Borde" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="romo">Romo</SelectItem>
                                  <SelectItem value="afilado">Afilado</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select 
                                value={phase2Data.palpation.deep.hepaticPalpation.surface} 
                                onValueChange={(value) => setPhase2Data(prev => ({ 
                                  ...prev, 
                                  palpation: { 
                                    ...prev.palpation, 
                                    deep: { 
                                      ...prev.palpation.deep, 
                                      hepaticPalpation: { ...prev.palpation.deep.hepaticPalpation, surface: value }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Superficie" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lisa">Lisa</SelectItem>
                                  <SelectItem value="nodular">Nodular</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select 
                                value={phase2Data.palpation.deep.hepaticPalpation.consistency} 
                                onValueChange={(value) => setPhase2Data(prev => ({ 
                                  ...prev, 
                                  palpation: { 
                                    ...prev.palpation, 
                                    deep: { 
                                      ...prev.palpation.deep, 
                                      hepaticPalpation: { ...prev.palpation.deep.hepaticPalpation, consistency: value }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Consistencia" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="blanda">Blanda</SelectItem>
                                  <SelectItem value="firme">Firme</SelectItem>
                                  <SelectItem value="dura">Dura</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-white text-sm font-medium">Palpación Esplénica</h5>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="splenicPalpable"
                            checked={phase2Data.palpation.deep.splenicPalpation.palpable}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              palpation: { 
                                ...prev.palpation, 
                                deep: { 
                                  ...prev.palpation.deep, 
                                  splenicPalpation: { ...prev.palpation.deep.splenicPalpation, palpable: checked as boolean }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="splenicPalpable" className="text-white text-sm">Palpable</Label>
                        </div>
                        <p className="text-white/60 text-xs">Maniobra de Schuster o decúbito intermedio</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MANIOBRAS ESPECÍFICAS (SOLO SI ESTÁN INDICADAS) */}
        <Card data-testid="card-specific-maneuvers" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-orange-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-6 w-6 text-orange-300" />
              Maniobras Específicas (SOLO si están indicadas por la anamnesis)
              <Badge className="ml-auto bg-orange-200/30 text-white border border-white/20">
                Murphy, McBurney, Blumberg, Psoas, Obturador
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Alert className="bg-yellow-500/20 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-300" />
                <AlertDescription className="text-white text-sm">
                  Realizar únicamente las maniobras indicadas por la historia clínica para evitar exploraciones innecesarias
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Maniobras Indicadas</h4>
                  <div className="space-y-3">
                    {Object.entries(specificManeuvers.indicated).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`indicated-${key}`}
                          checked={value}
                          onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                            ...prev, 
                            indicated: { ...prev.indicated, [key]: checked as boolean }
                          }))}
                        />
                        <Label htmlFor={`indicated-${key}`} className={`text-white text-sm capitalize ${
                          crossValidation.recommendedManeuvers.includes(key) ? 'font-bold text-yellow-300' : ''
                        }`}>
                          {key === 'murphy' ? 'Murphy (colecistitis)' :
                           key === 'appendicular' ? 'Puntos apendiculares' :
                           key === 'blumberg' ? 'Blumberg (rebote)' :
                           key === 'psoas' ? 'Psoas (apendicitis retrocecal)' :
                           key === 'obturator' ? 'Obturador (apendicitis pélvica)' :
                           key === 'boas' ? 'Boas (dolor escapular)' :
                           key === 'carnett' ? 'Carnett (dolor parietal)' :
                           key === 'carvallo' ? 'Carvallo (inspiración)' :
                           key === 'sisterMaryJoseph' ? 'Sister Mary Joseph' :
                           key === 'courvoisier' ? 'Courvoisier' :
                           key === 'ballance' ? 'Ballance (hemoperitoneo)' :
                           key === 'kehr' ? 'Kehr (hombro izquierdo)' :
                           key === 'dance' ? 'Dance (invaginación)' :
                           key === 'greyTurner' ? 'Grey Turner' :
                           key === 'cullen' ? 'Cullen' : key}
                          {crossValidation.recommendedManeuvers.includes(key) && ' ⭐'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Resultados</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {specificManeuvers.indicated.murphy && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="murphySign"
                            checked={specificManeuvers.results.murphySign}
                            onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                              ...prev, 
                              results: { ...prev.results, murphySign: checked as boolean }
                            }))}
                          />
                          <Label htmlFor="murphySign" className="text-white text-sm">Murphy +</Label>
                        </div>
                      )}
                      
                      {specificManeuvers.indicated.appendicular && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="mcBurneyPoint"
                            checked={specificManeuvers.results.mcBurneyPoint}
                            onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                              ...prev, 
                              results: { ...prev.results, mcBurneyPoint: checked as boolean }
                            }))}
                          />
                          <Label htmlFor="mcBurneyPoint" className="text-white text-sm">McBurney +</Label>
                        </div>
                      )}
                      
                      {specificManeuvers.indicated.blumberg && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="blumbergSign"
                            checked={specificManeuvers.results.blumbergSign}
                            onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                              ...prev, 
                              results: { ...prev.results, blumbergSign: checked as boolean }
                            }))}
                          />
                          <Label htmlFor="blumbergSign" className="text-white text-sm">Blumberg +</Label>
                        </div>
                      )}
                      
                      {specificManeuvers.indicated.psoas && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="psoasSign"
                            checked={specificManeuvers.results.psoasSign}
                            onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                              ...prev, 
                              results: { ...prev.results, psoasSign: checked as boolean }
                            }))}
                          />
                          <Label htmlFor="psoasSign" className="text-white text-sm">Psoas +</Label>
                        </div>
                      )}
                      
                      {specificManeuvers.indicated.obturator && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="obturatorSign"
                            checked={specificManeuvers.results.obturatorSign}
                            onCheckedChange={(checked) => setSpecificManeuvers(prev => ({ 
                              ...prev, 
                              results: { ...prev.results, obturatorSign: checked as boolean }
                            }))}
                          />
                          <Label htmlFor="obturatorSign" className="text-white text-sm">Obturador +</Label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 5: EXAMEN RECTAL Y GENITAL (PASO FINAL) */}
        <Card data-testid="card-fase-5" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-purple-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-6 w-6 text-purple-300" />
              Fase 5: Examen Rectal y Genital (Paso Final)
              <Badge className="ml-auto bg-purple-200/30 text-white border border-white/20">
                Sin Alterar Hallazgos Abdominales
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <Alert className="bg-purple-500/20 border-purple-500/30">
                <ShieldCheck className="h-4 w-4 text-purple-300" />
                <AlertDescription className="text-white text-sm">
                  Realizar al final de todas las maniobras para no alterar los hallazgos abdominales
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Tacto Rectal</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rectalPerformed"
                        checked={phase5Data.rectalExam.performed}
                        onCheckedChange={(checked) => setPhase5Data(prev => ({ 
                          ...prev, 
                          rectalExam: { ...prev.rectalExam, performed: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="rectalPerformed" className="text-white text-sm">Realizado</Label>
                    </div>
                    
                    {phase5Data.rectalExam.performed && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Tono del esfínter</Label>
                          <Select 
                            value={phase5Data.rectalExam.sphincterTone} 
                            onValueChange={(value) => setPhase5Data(prev => ({ 
                              ...prev, 
                              rectalExam: { ...prev.rectalExam, sphincterTone: value }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Tono" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="aumentado">Aumentado</SelectItem>
                              <SelectItem value="disminuido">Disminuido</SelectItem>
                              <SelectItem value="ausente">Ausente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Próstata (hombres)</Label>
                          <Input
                            value={phase5Data.rectalExam.prostateFindings}
                            onChange={(e) => setPhase5Data(prev => ({ 
                              ...prev, 
                              rectalExam: { ...prev.rectalExam, prostateFindings: e.target.value }
                            }))}
                            placeholder="Tamaño, consistencia, superficie"
                            className="bg-white/5 border-white/20 text-white text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="rectalMasses"
                              checked={phase5Data.rectalExam.masses}
                              onCheckedChange={(checked) => setPhase5Data(prev => ({ 
                                ...prev, 
                                rectalExam: { ...prev.rectalExam, masses: checked as boolean }
                              }))}
                            />
                            <Label htmlFor="rectalMasses" className="text-white text-sm">Masas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="rectalTenderness"
                              checked={phase5Data.rectalExam.tenderness}
                              onCheckedChange={(checked) => setPhase5Data(prev => ({ 
                                ...prev, 
                                rectalExam: { ...prev.rectalExam, tenderness: checked as boolean }
                              }))}
                            />
                            <Label htmlFor="rectalTenderness" className="text-white text-sm">Dolor</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="bloodOnGlove"
                              checked={phase5Data.rectalExam.bloodOnGlove}
                              onCheckedChange={(checked) => setPhase5Data(prev => ({ 
                                ...prev, 
                                rectalExam: { ...prev.rectalExam, bloodOnGlove: checked as boolean }
                              }))}
                            />
                            <Label htmlFor="bloodOnGlove" className="text-white text-sm">Sangre en guante</Label>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-white text-xs">Test guayaco</Label>
                            <Select 
                              value={phase5Data.rectalExam.guaiacTest} 
                              onValueChange={(value) => setPhase5Data(prev => ({ 
                                ...prev, 
                                rectalExam: { ...prev.rectalExam, guaiacTest: value }
                              }))}>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                <SelectValue placeholder="Resultado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="positivo">Positivo</SelectItem>
                                <SelectItem value="negativo">Negativo</SelectItem>
                                <SelectItem value="no-realizado">No realizado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Examen Genital</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="genitalPerformed"
                        checked={phase5Data.genitalExam.performed}
                        onCheckedChange={(checked) => setPhase5Data(prev => ({ 
                          ...prev, 
                          genitalExam: { ...prev.genitalExam, performed: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="genitalPerformed" className="text-white text-sm">Realizado</Label>
                    </div>
                    
                    {phase5Data.genitalExam.performed && (
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Hallazgos</Label>
                        <Textarea
                          value={phase5Data.genitalExam.findings}
                          onChange={(e) => setPhase5Data(prev => ({ 
                            ...prev, 
                            genitalExam: { ...prev.genitalExam, findings: e.target.value }
                          }))}
                          placeholder="Hallazgos relevantes del examen genital"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="border-white/30" />

                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <Calculator className="h-6 w-6 text-yellow-300" />
                      <h4 className="font-bold text-white text-xl">Sistema de Escalas Especializadas Avanzadas</h4>
                    </div>
                    
                    {/* ESCALAS CLÁSICAS */}
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <h5 className="font-medium text-white mb-4">Escalas Clásicas</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.childPugh.totalScore > 9 ? 'bg-red-900/20 border-red-500/30' :
                          scalesData.childPugh.totalScore > 6 ? 'bg-yellow-900/20 border-yellow-500/30' :
                          'bg-green-900/20 border-green-500/30'
                        }`}>
                          <Label className="text-white text-sm font-bold">Child-Pugh</Label>
                          <div className="text-white font-medium text-lg">
                            {scalesData.childPugh.totalScore} puntos
                          </div>
                          <div className={`text-sm font-medium ${
                            scalesData.childPugh.totalScore > 9 ? 'text-red-300' :
                            scalesData.childPugh.totalScore > 6 ? 'text-yellow-300' : 'text-green-300'
                          }`}>
                            {scalesData.childPugh.classification}
                          </div>
                        </div>
                        
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.glasgowBlatchford.totalScore >= 6 ? 'bg-red-900/20 border-red-500/30' :
                          scalesData.glasgowBlatchford.totalScore >= 2 ? 'bg-yellow-900/20 border-yellow-500/30' :
                          'bg-green-900/20 border-green-500/30'
                        }`}>
                          <Label className="text-white text-sm font-bold">Glasgow-Blatchford</Label>
                          <div className="text-white font-medium text-lg">
                            {scalesData.glasgowBlatchford.totalScore} puntos
                          </div>
                          <div className={`text-sm font-medium ${
                            scalesData.glasgowBlatchford.totalScore >= 6 ? 'text-red-300' :
                            scalesData.glasgowBlatchford.totalScore >= 2 ? 'text-yellow-300' : 'text-green-300'
                          }`}>
                            {scalesData.glasgowBlatchford.totalScore >= 6 ? 'Alto riesgo' :
                             scalesData.glasgowBlatchford.totalScore >= 2 ? 'Riesgo moderado' : 'Bajo riesgo'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* ESCALAS AVANZADAS ESPECIALIZADAS */}
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <h5 className="font-medium text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-300" />
                        Escalas Especializadas Avanzadas
                      </h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        
                        {/* MELD-Na */}
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.meldNa.totalScore >= 25 ? 'bg-red-900/20 border-red-500/30' :
                          scalesData.meldNa.totalScore >= 15 ? 'bg-yellow-900/20 border-yellow-500/30' :
                          'bg-green-900/20 border-green-500/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-300" />
                            <Label className="text-white text-sm font-bold">MELD-Na</Label>
                          </div>
                          <div className="text-white font-medium text-lg">
                            {scalesData.meldNa.totalScore} puntos
                          </div>
                          <div className={`text-xs font-medium ${
                            scalesData.meldNa.totalScore >= 25 ? 'text-red-300' :
                            scalesData.meldNa.totalScore >= 15 ? 'text-yellow-300' : 'text-green-300'
                          }`}>
                            {scalesData.meldNa.mortalityRisk}
                          </div>
                        </div>
                        
                        {/* BISAP */}
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.bisap.totalScore >= 4 ? 'bg-red-900/20 border-red-500/30' :
                          scalesData.bisap.totalScore === 3 ? 'bg-yellow-900/20 border-yellow-500/30' :
                          'bg-green-900/20 border-green-500/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-300" />
                            <Label className="text-white text-sm font-bold">BISAP (Pancreatitis)</Label>
                          </div>
                          <div className="text-white font-medium text-lg">
                            {scalesData.bisap.totalScore} / 5 puntos
                          </div>
                          <div className={`text-xs font-medium ${
                            scalesData.bisap.totalScore >= 4 ? 'text-red-300' :
                            scalesData.bisap.totalScore === 3 ? 'text-yellow-300' : 'text-green-300'
                          }`}>
                            {scalesData.bisap.severityRisk}
                          </div>
                        </div>
                        
                        {/* Rome IV */}
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.romeIV.functionalDyspepsia || scalesData.romeIV.ibsClassification ? 
                          'bg-blue-900/20 border-blue-500/30' : 'bg-gray-900/20 border-gray-500/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-indigo-300" />
                            <Label className="text-white text-sm font-bold">Rome IV</Label>
                          </div>
                          <div className="text-white font-medium text-sm">
                            {scalesData.romeIV.functionalDyspepsia ? '✓ Dispepsia Funcional' : ''}
                          </div>
                          <div className="text-white/70 text-xs">
                            {scalesData.romeIV.ibsClassification || 'No cumple criterios'}
                          </div>
                        </div>
                        
                        {/* SGA */}
                        <div className={`space-y-2 p-3 rounded-lg border ${
                          scalesData.sga.classification.includes('C:') ? 'bg-red-900/20 border-red-500/30' :
                          scalesData.sga.classification.includes('B:') ? 'bg-yellow-900/20 border-yellow-500/30' :
                          scalesData.sga.classification.includes('A:') ? 'bg-green-900/20 border-green-500/30' :
                          'bg-gray-900/20 border-gray-500/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-300" />
                            <Label className="text-white text-sm font-bold">SGA Nutricional</Label>
                          </div>
                          <div className="text-white font-medium text-lg">
                            {scalesData.sga.totalScore} puntos
                          </div>
                          <div className={`text-xs font-medium ${
                            scalesData.sga.classification.includes('C:') ? 'text-red-300' :
                            scalesData.sga.classification.includes('B:') ? 'text-yellow-300' :
                            scalesData.sga.classification.includes('A:') ? 'text-green-300' : 'text-gray-300'
                          }`}>
                            {scalesData.sga.classification || 'Sin evaluar'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* INTERPRETACIÓN INTEGRADA */}
                    {(scalesData.childPugh.totalScore > 6 || scalesData.glasgowBlatchford.totalScore > 2 || 
                      scalesData.meldNa.totalScore > 15 || scalesData.bisap.totalScore > 2) && (
                      <Alert className="bg-yellow-900/30 border-yellow-500/50">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <AlertDescription className="text-white">
                          <div className="font-bold">Interpretación Integrada de Escalas:</div>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            {scalesData.childPugh.totalScore > 9 && (
                              <li>Hepatopatía descompensada severa - Considerar trasplante</li>
                            )}
                            {scalesData.glasgowBlatchford.totalScore >= 6 && (
                              <li>Alto riesgo hemorragia digestiva - Endoscopia urgente</li>
                            )}
                            {scalesData.meldNa.totalScore >= 25 && (
                              <li>Prioridad alta para trasplante hepático</li>
                            )}
                            {scalesData.bisap.totalScore >= 3 && (
                              <li>Pancreatitis severa - Considerar UCI</li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white">Impresión Diagnóstica</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Diagnóstico principal</Label>
                    <Input
                      value={scalesData.diagnosticImpression.primary}
                      onChange={(e) => setScalesData(prev => ({ 
                        ...prev, 
                        diagnosticImpression: { ...prev.diagnosticImpression, primary: e.target.value }
                      }))}
                      placeholder="Impresión diagnóstica principal"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Diagnóstico diferencial</Label>
                    <Input
                      value={scalesData.diagnosticImpression.differential}
                      onChange={(e) => setScalesData(prev => ({ 
                        ...prev, 
                        diagnosticImpression: { ...prev.diagnosticImpression, differential: e.target.value }
                      }))}
                      placeholder="Diagnósticos alternativos"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Plan de manejo</Label>
                    <Input
                      value={scalesData.diagnosticImpression.plan}
                      onChange={(e) => setScalesData(prev => ({ 
                        ...prev, 
                        diagnosticImpression: { ...prev.diagnosticImpression, plan: e.target.value }
                      }))}
                      placeholder="Tratamiento y seguimiento"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Finalizar */}
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            data-testid="button-complete-exam"
          >
            <Circle className="h-5 w-5 mr-2" />
            Completar Exploración Gastroenterológica Integrada
          </Button>
        </div>
      </div>
    </div>
  );
}