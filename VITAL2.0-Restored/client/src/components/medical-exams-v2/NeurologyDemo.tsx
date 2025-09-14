import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Target,
  AlertTriangle,
  Activity,
  Eye,
  Timer,
  Calculator,
  FileText,
  Copy,
  Download,
  Stethoscope,
  Gauge,
  Users,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  X,
  FileText as PrintIcon,
  Clock,
  CheckCircle2,
  Waves,
  HeartHandshake,
  Focus,
  Scan,
  Crosshair,
  RefreshCw
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

// 🎯 FRAMEWORK UNIVERSAL - TIPOS DE DATOS NEUROLÓGICOS
interface NeurologyData {
  // 📊 DASHBOARD MÉDICO ESTÁNDAR
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // 📋 ANAMNESIS NEUROLÓGICA (ZERO-TYPING)
  symptoms: {
    headache: string[];
    cognitive: string[];
    motor: string[];
    sensory: string[];
    consciousness: string[];
  };

  riskFactors: {
    vascular: string[];
    traumatic: string[];
    metabolic: string[];
    infectious: string[];
    genetic: string[];
  };

  // 🧠 ESTADO MENTAL SISTEMÁTICO
  mentalStatus: {
    consciousness: string;
    orientation: {
      time: boolean;
      place: boolean;
      person: boolean;
      score: number;
    };
    glasgow: {
      eye: number;
      verbal: number;
      motor: number;
      total: number;
      classification: string;
    };
  };

  // 👁️ PARES CRANEALES SISTEMÁTICOS
  cranialNerves: {
    olfactory: string;      // I
    optic: string;          // II
    oculomotor: string;     // III
    trochlear: string;      // IV
    trigeminal: string;     // V
    abducens: string;       // VI
    facial: string;         // VII
    auditory: string;       // VIII
    glossopharyngeal: string; // IX
    vagus: string;          // X
    spinal: string;         // XI
    hypoglossal: string;    // XII
  };

  // 💪 SISTEMA MOTOR BILATERAL
  motorSystem: {
    strength: {
      rightArm: number;
      leftArm: number;
      rightLeg: number;
      leftLeg: number;
    };
    reflexes: {
      biceps: string;
      triceps: string;
      patellar: string;
      achilles: string;
      babinski: string;
    };
    coordination: {
      fingerToNose: string;
      heelToShin: string;
      rapidMovements: string;
    };
  };

  // 🌊 SISTEMA SENSORIAL
  sensorySystem: {
    touch: {
      rightSide: string;
      leftSide: string;
    };
    vibration: {
      upper: string;
      lower: string;
    };
    position: {
      upper: string;
      lower: string;
    };
  };

  // 📊 ESCALAS AUTOMÁTICAS NEUROLÓGICAS
  clinicalScores: {
    nihss: {
      consciousness: number;
      orientation: number;
      commands: number;
      gaze: number;
      visual: number;
      facialPalsy: number;
      motorArm: number;
      motorLeg: number;
      ataxia: number;
      sensory: number;
      language: number;
      dysarthria: number;
      extinction: number;
      total: number;
      severity: string;
    };
    strokeRisk: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
  };

  // 🏥 PLAN INTEGRAL NEUROLÓGICO
  management: {
    emergencyTreatment: string[];
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    monitoring: string[];
  };
}

interface NeurologyDemoProps {
  patientData: {
    id: string;
    name?: string;
    age: number;
    gender: string;
  };
  onComplete: (data: any) => void;
}

export default function NeurologyDemo({ patientData, onComplete }: NeurologyDemoProps) {
  
  // 🎯 ESTADO PRINCIPAL FRAMEWORK UNIVERSAL
  const [neuroData, setNeuroData] = useState<NeurologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 8,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
    symptoms: {
      headache: [],
      cognitive: [],
      motor: [],
      sensory: [],
      consciousness: []
    },
    riskFactors: {
      vascular: [],
      traumatic: [],
      metabolic: [],
      infectious: [],
      genetic: []
    },
    mentalStatus: {
      consciousness: '',
      orientation: {
        time: false,
        place: false,
        person: false,
        score: 0
      },
      glasgow: {
        eye: 0,
        verbal: 0,
        motor: 0,
        total: 0,
        classification: ''
      }
    },
    cranialNerves: {
      olfactory: '',
      optic: '',
      oculomotor: '',
      trochlear: '',
      trigeminal: '',
      abducens: '',
      facial: '',
      auditory: '',
      glossopharyngeal: '',
      vagus: '',
      spinal: '',
      hypoglossal: ''
    },
    motorSystem: {
      strength: {
        rightArm: 5,
        leftArm: 5,
        rightLeg: 5,
        leftLeg: 5
      },
      reflexes: {
        biceps: '',
        triceps: '',
        patellar: '',
        achilles: '',
        babinski: ''
      },
      coordination: {
        fingerToNose: '',
        heelToShin: '',
        rapidMovements: ''
      }
    },
    sensorySystem: {
      touch: {
        rightSide: '',
        leftSide: ''
      },
      vibration: {
        upper: '',
        lower: ''
      },
      position: {
        upper: '',
        lower: ''
      }
    },
    clinicalScores: {
      nihss: {
        consciousness: 0,
        orientation: 0,
        commands: 0,
        gaze: 0,
        visual: 0,
        facialPalsy: 0,
        motorArm: 0,
        motorLeg: 0,
        ataxia: 0,
        sensory: 0,
        language: 0,
        dysarthria: 0,
        extinction: 0,
        total: 0,
        severity: ''
      },
      strokeRisk: {
        factors: [],
        score: 0,
        riskLevel: ''
      }
    },
    management: {
      emergencyTreatment: [],
      diagnosticPlan: [],
      therapeuticPlan: [],
      monitoring: []
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['symptoms']);
  const [showSplitView, setShowSplitView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 🛠️ FUNCIONES AUXILIARES UNIVERSALES
  const updateNeuroData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setNeuroData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) current[pathArray[i]] = {};
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  };

  const updateArrayData = (path: string, item: string, checked: boolean) => {
    const pathArray = path.split('.');
    setNeuroData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) current[pathArray[i]] = {};
        current = current[pathArray[i]];
      }
      
      const currentArray = current[pathArray[pathArray.length - 1]] || [];
      if (checked) {
        if (!currentArray.includes(item)) {
          current[pathArray[pathArray.length - 1]] = [...currentArray, item];
        }
      } else {
        current[pathArray[pathArray.length - 1]] = currentArray.filter((i: string) => i !== item);
      }
      
      return newData;
    });
  };

  // 📊 AUTOMATIZACIONES CLÍNICAS UNIVERSALES
  const calculateGlasgowScore = useCallback(() => {
    const { eye, verbal, motor } = neuroData.mentalStatus.glasgow;
    const total = eye + verbal + motor;
    let classification = '';
    
    if (total >= 15) classification = 'Normal';
    else if (total >= 13) classification = 'TCE Leve';
    else if (total >= 9) classification = 'TCE Moderado';
    else if (total >= 3) classification = 'TCE Severo';
    else classification = 'Sin evaluación';

    updateNeuroData('mentalStatus.glasgow.total', total);
    updateNeuroData('mentalStatus.glasgow.classification', classification);
  }, [neuroData.mentalStatus.glasgow]);

  const calculateNIHSSScore = useCallback(() => {
    const nihss = neuroData.clinicalScores.nihss;
    const total = Object.keys(nihss).reduce((sum, key) => {
      if (key !== 'total' && key !== 'severity') {
        return sum + (nihss[key as keyof typeof nihss] as number);
      }
      return sum;
    }, 0);

    let severity = '';
    if (total === 0) severity = 'Sin déficit';
    else if (total <= 4) severity = 'Déficit leve';
    else if (total <= 15) severity = 'Déficit moderado';
    else if (total <= 25) severity = 'Déficit severo';
    else severity = 'Déficit muy severo';

    updateNeuroData('clinicalScores.nihss.total', total);
    updateNeuroData('clinicalScores.nihss.severity', severity);
  }, [neuroData.clinicalScores.nihss]);

  const calculateOrientationScore = useCallback(() => {
    const { time, place, person } = neuroData.mentalStatus.orientation;
    const score = [time, place, person].filter(Boolean).length;
    updateNeuroData('mentalStatus.orientation.score', score);
  }, [neuroData.mentalStatus.orientation]);

  // 🚨 SISTEMA DE ALERTAS UNIVERSAL
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: typeof neuroData.urgencyLevel = 'Normal';

    // ALERTAS ROJAS: Emergencias neurológicas
    const criticalFindings = [
      neuroData.symptoms.headache.includes('Cefalea en trueno'),
      neuroData.symptoms.consciousness.includes('Coma'),
      neuroData.mentalStatus.glasgow.total > 0 && neuroData.mentalStatus.glasgow.total < 9,
      neuroData.clinicalScores.nihss.total > 15,
      neuroData.symptoms.motor.includes('Hemiparesia aguda'),
      neuroData.symptoms.cognitive.includes('Afasia súbita'),
      neuroData.cranialNerves.optic === 'Ceguera súbita'
    ];

    if (criticalFindings.some(finding => finding)) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }

    // ALERTAS AMARILLAS: Seguimiento prioritario
    const warningFindings = [
      neuroData.symptoms.headache.includes('Cefalea severa'),
      neuroData.mentalStatus.glasgow.total > 0 && neuroData.mentalStatus.glasgow.total < 13,
      neuroData.clinicalScores.nihss.total > 4,
      neuroData.symptoms.motor.includes('Debilidad focal'),
      neuroData.symptoms.cognitive.includes('Confusión aguda'),
      neuroData.mentalStatus.orientation.score < 2
    ];

    if (warningFindings.some(finding => finding)) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // ALERTAS AZULES: Información adicional
    const infoFindings = [
      neuroData.symptoms.headache.length > 0,
      neuroData.symptoms.sensory.length > 0,
      neuroData.symptoms.motor.length > 0,
      neuroData.riskFactors.vascular.length > 2,
      neuroData.symptoms.cognitive.length > 0
    ];

    if (infoFindings.some(finding => finding)) {
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }

    // Riesgo de ACV
    const strokeFactors = neuroData.clinicalScores.strokeRisk.factors;
    const strokeScore = strokeFactors.length;
    let strokeRisk = '';
    
    if (strokeScore >= 5) {
      strokeRisk = 'Muy alto riesgo';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (strokeScore >= 3) {
      strokeRisk = 'Alto riesgo';
      warningCount++;
    } else if (strokeScore >= 1) {
      strokeRisk = 'Riesgo moderado';
      findingCount++;
    }

    // Calcular progreso
    let sectionsCompleted = 0;
    if (neuroData.symptoms.headache.length > 0) sectionsCompleted++;
    if (neuroData.riskFactors.vascular.length > 0) sectionsCompleted++;
    if (neuroData.mentalStatus.consciousness) sectionsCompleted++;
    if (neuroData.cranialNerves.optic) sectionsCompleted++;
    if (neuroData.motorSystem.strength.rightArm < 5) sectionsCompleted++;
    if (neuroData.sensorySystem.touch.rightSide) sectionsCompleted++;
    if (neuroData.clinicalScores.nihss.total > 0) sectionsCompleted++;
    if (neuroData.management.diagnosticPlan.length > 0) sectionsCompleted++;

    const progress = Math.round((sectionsCompleted / neuroData.totalSections) * 100);

    // Actualizar estados
    setNeuroData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urgencyLevel,
      examProgress: progress,
      sectionsCompleted,
      clinicalScores: {
        ...prev.clinicalScores,
        strokeRisk: { ...prev.clinicalScores.strokeRisk, score: strokeScore, riskLevel: strokeRisk }
      }
    }));
  }, [neuroData]);

  // 📄 GENERACIÓN AUTOMÁTICA DE REPORTE
  const generateMedicalReport = useCallback(() => {
    let report = 'REPORTE NEUROLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    report += `Fecha: ${new Date().toLocaleDateString()}\n`;
    report += `Paciente: ${patientData.name} (${patientData.age} años)\n`;
    report += `Urgencia: ${neuroData.urgencyLevel}\n`;
    report += `Progreso: ${neuroData.examProgress}%\n\n`;

    // Síntomas neurológicos
    const allSymptoms = [
      ...neuroData.symptoms.headache,
      ...neuroData.symptoms.cognitive,
      ...neuroData.symptoms.motor,
      ...neuroData.symptoms.sensory
    ];
    
    if (allSymptoms.length > 0) {
      report += 'SÍNTOMAS NEUROLÓGICOS:\n';
      allSymptoms.forEach(symptom => report += `• ${symptom}\n`);
      report += '\n';
    }

    // Estado mental
    if (neuroData.mentalStatus.glasgow.total > 0) {
      report += 'ESTADO MENTAL:\n';
      report += `• Glasgow: ${neuroData.mentalStatus.glasgow.total}/15 (${neuroData.mentalStatus.glasgow.classification})\n`;
      report += `• Orientación: ${neuroData.mentalStatus.orientation.score}/3\n`;
      report += '\n';
    }

    // Escalas neurológicas
    if (neuroData.clinicalScores.nihss.total > 0) {
      report += 'ESCALAS NEUROLÓGICAS:\n';
      report += `• NIHSS: ${neuroData.clinicalScores.nihss.total} puntos - ${neuroData.clinicalScores.nihss.severity}\n`;
    }
    if (neuroData.clinicalScores.strokeRisk.riskLevel) {
      report += `• Riesgo ACV: ${neuroData.clinicalScores.strokeRisk.riskLevel}\n`;
    }
    report += '\n';

    // Plan de manejo
    if (neuroData.management.diagnosticPlan.length > 0) {
      report += 'PLAN DIAGNÓSTICO:\n';
      neuroData.management.diagnosticPlan.forEach(plan => report += `• ${plan}\n`);
      report += '\n';
    }

    if (neuroData.management.therapeuticPlan.length > 0) {
      report += 'PLAN TERAPÉUTICO:\n';
      neuroData.management.therapeuticPlan.forEach(plan => report += `• ${plan}\n`);
      report += '\n';
    }

    setMedicalReport(report);
  }, [neuroData, patientData]);

  // 🔄 EFECTOS AUTOMÁTICOS
  useEffect(() => {
    calculateGlasgowScore();
  }, [neuroData.mentalStatus.glasgow.eye, neuroData.mentalStatus.glasgow.verbal, neuroData.mentalStatus.glasgow.motor]);

  useEffect(() => {
    calculateNIHSSScore();
  }, [neuroData.clinicalScores.nihss]);

  useEffect(() => {
    calculateOrientationScore();
  }, [neuroData.mentalStatus.orientation.time, neuroData.mentalStatus.orientation.place, neuroData.mentalStatus.orientation.person]);

  useEffect(() => {
    calculateRiskScores();
  }, [neuroData.clinicalScores, neuroData.symptoms, neuroData.riskFactors]);

  useEffect(() => {
    generateMedicalReport();
  }, [neuroData]);

  // 📋 DATOS MÉDICOS (PRINCIPIO ZERO-TYPING)
  const headacheSymptoms = [
    'Cefalea tensional', 'Migraña', 'Cefalea en racimos', 'Cefalea en trueno',
    'Cefalea severa', 'Cefalea matutina', 'Cefalea con aura', 'Cefalea occipital',
    'Cefalea frontal', 'Cefalea temporal', 'Cefalea con rigidez nucal'
  ];

  const cognitiveSymptoms = [
    'Confusión aguda', 'Pérdida de memoria', 'Desorientación', 'Afasia súbita',
    'Disfasia', 'Apraxia', 'Agnosia', 'Demencia progresiva',
    'Alteración de juicio', 'Cambios de personalidad'
  ];

  const motorSymptoms = [
    'Hemiparesia aguda', 'Debilidad focal', 'Parálisis facial', 'Temblor',
    'Rigidez', 'Bradicinesia', 'Ataxia', 'Distonía',
    'Fasciculaciones', 'Calambres musculares'
  ];

  const sensorySymptoms = [
    'Entumecimiento', 'Hormigueo', 'Pérdida sensorial', 'Dolor neuropático',
    'Hipoestesia', 'Parestesias', 'Disestesias', 'Alodinia',
    'Pérdida de vibración', 'Pérdida de posición'
  ];

  const consciousnessSymptoms = [
    'Somnolencia', 'Estupor', 'Coma', 'Síncope',
    'Convulsiones', 'Crisis de ausencia', 'Estado confusional', 'Letargia'
  ];

  const vascularRiskFactors = [
    'Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Fibrilación auricular',
    'Tabaquismo', 'ACV previo', 'Cardiopatía', 'Arteriopatía periférica',
    'Anticoagulación', 'Edad > 65 años', 'Sedentarismo'
  ];

  const traumaticRiskFactors = [
    'TCE reciente', 'Accidente de tráfico', 'Caída', 'Deporte de contacto',
    'Violencia doméstica', 'Accidente laboral', 'TCE previo', 'Fractura craneal'
  ];

  const strokeRiskFactors = [
    'Hipertensión', 'Diabetes', 'Fibrilación auricular', 'Tabaquismo',
    'Edad > 65 años', 'ACV previo', 'Estenosis carotídea', 'Cardiopatía',
    'Anticoagulación inadecuada', 'Dislipidemia'
  ];

  const diagnosticTests = [
    'TC cráneo urgente', 'RM cerebral', 'Angio-TC', 'Angio-RM', 
    'Punción lumbar', 'EEG', 'Doppler carotídeo', 'Ecocardiograma',
    'Analítica básica', 'Coagulación', 'Perfusión cerebral'
  ];

  const therapeuticOptions = [
    'Antiagregación', 'Anticoagulación', 'Trombolisis IV', 'Trombectomía mecánica',
    'Antiepilepticos', 'Neuroprotección', 'Control PIC', 'Rehabilitación neurológica',
    'Fisioterapia', 'Logopedia', 'Terapia ocupacional'
  ];

  const emergencyTreatments = [
    'Vía aérea permeable', 'Oxigenoterapia', 'Monitorización', 'Acceso vascular',
    'Control glucemia', 'Control TA', 'Posición 30°', 'Neuroprotección',
    'Anticonvulsivantes', 'Manitol', 'Suero salino hipertónico'
  ];

  // Secciones del examen neurológico
  const examSections = [
    {
      id: 'symptoms',
      title: 'Síntomas Neurológicos',
      icon: <Brain className="w-5 h-5 text-red-500" />,
      description: 'Anamnesis dirigida con principio ZERO-TYPING',
      progress: neuroData.symptoms.headache.length + neuroData.symptoms.cognitive.length > 0 ? 100 : 0
    },
    {
      id: 'riskFactors',
      title: 'Factores de Riesgo',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      description: 'Factores vasculares y traumáticos',
      progress: neuroData.riskFactors.vascular.length > 0 ? 100 : 0
    },
    {
      id: 'mentalStatus',
      title: 'Estado Mental',
      icon: <Focus className="w-5 h-5 text-yellow-500" />,
      description: 'Conciencia, orientación y Glasgow',
      progress: neuroData.mentalStatus.consciousness ? 100 : 0
    },
    {
      id: 'cranialNerves',
      title: 'Pares Craneales',
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      description: 'Evaluación sistemática I-XII',
      progress: neuroData.cranialNerves.optic ? 100 : 0
    },
    {
      id: 'motorSystem',
      title: 'Sistema Motor',
      icon: <Activity className="w-5 h-5 text-green-500" />,
      description: 'Fuerza, reflejos y coordinación',
      progress: neuroData.motorSystem.strength.rightArm < 5 ? 100 : 0
    },
    {
      id: 'sensorySystem',
      title: 'Sistema Sensorial',
      icon: <Waves className="w-5 h-5 text-cyan-500" />,
      description: 'Tacto, vibración y posición',
      progress: neuroData.sensorySystem.touch.rightSide ? 100 : 0
    },
    {
      id: 'nihss',
      title: 'Escalas Neurológicas',
      icon: <Calculator className="w-5 h-5 text-purple-500" />,
      description: 'NIHSS y scores automáticos',
      progress: neuroData.clinicalScores.nihss.total > 0 ? 100 : 0
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      icon: <ClipboardCheck className="w-5 h-5 text-indigo-500" />,
      description: 'Plan integral neurológico',
      progress: neuroData.management.diagnosticPlan.length > 0 ? 100 : 0
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyReport = () => {
    navigator.clipboard.writeText(medicalReport);
  };

  const handleComplete = () => {
    onComplete?.({
      neuroData,
      medicalReport,
      alerts,
      medicalScales,
      progressPercentage: neuroData.examProgress,
      timestamp: new Date(),
      specialty: 'Neurología'
    });
  };

  // Convertir a formato compatible con MedicalDashboard
  const progressSections = {
    síntomas: neuroData.symptoms.headache.length + neuroData.symptoms.cognitive.length > 0,
    riesgo: neuroData.riskFactors.vascular.length > 0,
    mental: neuroData.mentalStatus.consciousness !== '',
    pares: neuroData.cranialNerves.optic !== '',
    motor: neuroData.motorSystem.strength.rightArm < 5,
    sensorial: neuroData.sensorySystem.touch.rightSide !== '',
    escalas: neuroData.clinicalScores.nihss.total > 0,
    plan: neuroData.management.diagnosticPlan.length > 0
  };

  const alerts = [
    ...(neuroData.alertCount > 0 ? [{
      id: 'critical',
      type: 'urgent' as const,
      message: `🚨 ${neuroData.alertCount} emergencias neurológicas detectadas`,
      timestamp: new Date()
    }] : []),
    ...(neuroData.warningCount > 0 ? [{
      id: 'warning',
      type: 'warning' as const,
      message: `⚠️ ${neuroData.warningCount} factores de riesgo neurológico`,
      timestamp: new Date()
    }] : [])
  ];

  const medicalScales = [
    ...(neuroData.mentalStatus.glasgow.total > 0 ? [{
      name: 'Escala de Glasgow',
      score: neuroData.mentalStatus.glasgow.total,
      interpretation: neuroData.mentalStatus.glasgow.classification,
      riskLevel: neuroData.mentalStatus.glasgow.total < 9 ? 'high' : 
                 neuroData.mentalStatus.glasgow.total < 13 ? 'intermediate' : 'low',
      recommendations: ['Evaluación neurológica urgente']
    }] : []),
    ...(neuroData.clinicalScores.nihss.total > 0 ? [{
      name: 'NIHSS Score',
      score: neuroData.clinicalScores.nihss.total,
      interpretation: neuroData.clinicalScores.nihss.severity,
      riskLevel: neuroData.clinicalScores.nihss.total > 15 ? 'high' : 
                 neuroData.clinicalScores.nihss.total > 4 ? 'intermediate' : 'low',
      recommendations: ['Protocolo ACV agudo']
    }] : []),
    ...(neuroData.clinicalScores.strokeRisk.riskLevel ? [{
      name: 'Riesgo de ACV',
      score: neuroData.clinicalScores.strokeRisk.score,
      interpretation: neuroData.clinicalScores.strokeRisk.riskLevel,
      riskLevel: neuroData.clinicalScores.strokeRisk.score >= 5 ? 'high' : 
                 neuroData.clinicalScores.strokeRisk.score >= 3 ? 'intermediate' : 'low',
      recommendations: ['Prevención primaria']
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-800">
      
      {/* 🎯 HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                <Brain className="h-8 w-8 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Neurología Avanzada</h1>
                <p className="text-white/70">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                {neuroData.examProgress}% Completado
              </Badge>
              <Button
                onClick={() => setShowSplitView(!showSplitView)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showSplitView ? 'Ocultar' : 'Ver'} Informe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 📋 LAYOUT PRINCIPAL CON SPLIT VIEW */}
      <div className="flex gap-6 p-6">
        
        {/* PANEL IZQUIERDO - SECCIONES */}
        <div className={`transition-all duration-300 ${showSplitView ? 'flex-1' : 'w-full max-w-4xl mx-auto'}`}>
          <div className="space-y-4">
            {examSections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden"
              >
                {/* Header de la sección */}
                <div 
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <div>
                        <h3 className="font-semibold text-white">{section.title}</h3>
                        <p className="text-sm text-white/70">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all"
                            style={{ width: `${section.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/70">{section.progress}%</span>
                      </div>
                      {expandedSections.includes(section.id) ? 
                        <ChevronUp className="w-5 h-5 text-white/70" /> : 
                        <ChevronDown className="w-5 h-5 text-white/70" />
                      }
                    </div>
                  </div>
                </div>

                {/* Contenido expandible */}
                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 border-t border-white/10 bg-white/5">
                        
                        {/* 🧠 SÍNTOMAS NEUROLÓGICOS (ZERO-TYPING) */}
                        {section.id === 'symptoms' && (
                          <div className="space-y-6">
                            {/* Cefalea */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Brain className="w-4 h-4 text-red-400" />
                                Cefalea
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {headacheSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`headache-${symptom}`}
                                      checked={neuroData.symptoms.headache.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.headache', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`headache-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Síntomas Cognitivos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Focus className="w-4 h-4 text-yellow-400" />
                                Síntomas Cognitivos
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {cognitiveSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`cognitive-${symptom}`}
                                      checked={neuroData.symptoms.cognitive.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.cognitive', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`cognitive-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Síntomas Motores */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-400" />
                                Síntomas Motores
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {motorSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`motor-${symptom}`}
                                      checked={neuroData.symptoms.motor.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.motor', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`motor-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🚨 FACTORES DE RIESGO */}
                        {section.id === 'riskFactors' && (
                          <div className="space-y-6">
                            {/* Factores Vasculares */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <HeartHandshake className="w-4 h-4 text-red-400" />
                                Factores de Riesgo Vascular
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {vascularRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`vascular-${factor}`}
                                      checked={neuroData.riskFactors.vascular.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('riskFactors.vascular', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`vascular-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Factores Traumáticos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                Factores de Riesgo Traumático
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {traumaticRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`traumatic-${factor}`}
                                      checked={neuroData.riskFactors.traumatic.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('riskFactors.traumatic', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`traumatic-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Factores de Riesgo de ACV */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-400" />
                                Factores de Riesgo de ACV
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {strokeRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`stroke-${factor}`}
                                      checked={neuroData.clinicalScores.strokeRisk.factors.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('clinicalScores.strokeRisk.factors', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`stroke-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🧠 ESTADO MENTAL */}
                        {section.id === 'mentalStatus' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Nivel de Conciencia */}
                              <div>
                                <Label className="text-white font-medium mb-3 block">Nivel de Conciencia:</Label>
                                <Select value={neuroData.mentalStatus.consciousness} onValueChange={(value) => updateNeuroData('mentalStatus.consciousness', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar nivel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Alerta">Alerta</SelectItem>
                                    <SelectItem value="Somnolencia">Somnolencia</SelectItem>
                                    <SelectItem value="Estupor">Estupor</SelectItem>
                                    <SelectItem value="Coma">Coma</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Orientación */}
                              <div>
                                <Label className="text-white font-medium mb-3 block">Orientación:</Label>
                                <div className="space-y-2">
                                  {[
                                    { key: 'time', label: 'Tiempo' },
                                    { key: 'place', label: 'Lugar' },
                                    { key: 'person', label: 'Persona' }
                                  ].map((item) => (
                                    <div key={item.key} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`orientation-${item.key}`}
                                        checked={neuroData.mentalStatus.orientation[item.key as keyof typeof neuroData.mentalStatus.orientation] as boolean}
                                        onCheckedChange={(checked) => updateNeuroData(`mentalStatus.orientation.${item.key}`, checked)}
                                      />
                                      <Label htmlFor={`orientation-${item.key}`} className="text-white cursor-pointer">
                                        {item.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Escala de Glasgow */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Escala de Glasgow:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm mb-2 block">Apertura Ocular (/4):</Label>
                                  <Select 
                                    value={neuroData.mentalStatus.glasgow.eye.toString()} 
                                    onValueChange={(value) => updateNeuroData('mentalStatus.glasgow.eye', parseInt(value))}
                                  >
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="4">4 - Espontánea</SelectItem>
                                      <SelectItem value="3">3 - Al estímulo verbal</SelectItem>
                                      <SelectItem value="2">2 - Al dolor</SelectItem>
                                      <SelectItem value="1">1 - No abre</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-white text-sm mb-2 block">Respuesta Verbal (/5):</Label>
                                  <Select 
                                    value={neuroData.mentalStatus.glasgow.verbal.toString()} 
                                    onValueChange={(value) => updateNeuroData('mentalStatus.glasgow.verbal', parseInt(value))}
                                  >
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">5 - Orientado</SelectItem>
                                      <SelectItem value="4">4 - Confuso</SelectItem>
                                      <SelectItem value="3">3 - Palabras inadecuadas</SelectItem>
                                      <SelectItem value="2">2 - Sonidos incomprensibles</SelectItem>
                                      <SelectItem value="1">1 - Sin respuesta</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-white text-sm mb-2 block">Respuesta Motora (/6):</Label>
                                  <Select 
                                    value={neuroData.mentalStatus.glasgow.motor.toString()} 
                                    onValueChange={(value) => updateNeuroData('mentalStatus.glasgow.motor', parseInt(value))}
                                  >
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="6">6 - Obedece órdenes</SelectItem>
                                      <SelectItem value="5">5 - Localiza el dolor</SelectItem>
                                      <SelectItem value="4">4 - Retirada normal</SelectItem>
                                      <SelectItem value="3">3 - Flexión anormal</SelectItem>
                                      <SelectItem value="2">2 - Extensión anormal</SelectItem>
                                      <SelectItem value="1">1 - Sin respuesta</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Resultado Glasgow */}
                              {neuroData.mentalStatus.glasgow.total > 0 && (
                                <Alert className={`mt-4 ${neuroData.mentalStatus.glasgow.total < 9 ? 'bg-red-500/20 border-red-400/30' : 
                                  neuroData.mentalStatus.glasgow.total < 13 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-green-500/20 border-green-400/30'}`}>
                                  <Calculator className="h-4 w-4 text-white" />
                                  <AlertDescription className="text-white">
                                    <strong>Glasgow Coma Scale:</strong> {neuroData.mentalStatus.glasgow.total}/15
                                    <br />
                                    <strong>Clasificación:</strong> {neuroData.mentalStatus.glasgow.classification}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 👁️ PARES CRANEALES */}
                        {section.id === 'cranialNerves' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                { key: 'olfactory', label: 'I - Olfatorio', options: ['Normal', 'Hiposmia', 'Anosmia'] },
                                { key: 'optic', label: 'II - Óptico', options: ['Normal', 'Déficit visual', 'Ceguera súbita'] },
                                { key: 'oculomotor', label: 'III - Oculomotor', options: ['Normal', 'Paresia', 'Parálisis'] },
                                { key: 'trochlear', label: 'IV - Troclear', options: ['Normal', 'Paresia', 'Parálisis'] },
                                { key: 'trigeminal', label: 'V - Trigémino', options: ['Normal', 'Hipoestesia', 'Anestesia'] },
                                { key: 'abducens', label: 'VI - Abducens', options: ['Normal', 'Paresia', 'Parálisis'] },
                                { key: 'facial', label: 'VII - Facial', options: ['Normal', 'Paresia central', 'Parálisis periférica'] },
                                { key: 'auditory', label: 'VIII - Auditivo', options: ['Normal', 'Hipoacusia', 'Sordera'] },
                                { key: 'glossopharyngeal', label: 'IX - Glosofaríngeo', options: ['Normal', 'Alterado'] },
                                { key: 'vagus', label: 'X - Vago', options: ['Normal', 'Alterado'] },
                                { key: 'spinal', label: 'XI - Espinal', options: ['Normal', 'Debilidad'] },
                                { key: 'hypoglossal', label: 'XII - Hipogloso', options: ['Normal', 'Desviación'] }
                              ].map((nerve) => (
                                <div key={nerve.key} className="space-y-2 p-3 bg-white/5 rounded-lg">
                                  <Label className="text-white text-sm font-medium">{nerve.label}:</Label>
                                  <Select 
                                    value={neuroData.cranialNerves[nerve.key as keyof typeof neuroData.cranialNerves]} 
                                    onValueChange={(value) => updateNeuroData(`cranialNerves.${nerve.key}`, value)}
                                  >
                                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                      <SelectValue placeholder="Evaluar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {nerve.options.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          <span className={option === 'Normal' ? 'text-green-600' : option.includes('Hiposmia') || option.includes('Paresia') || option.includes('Hipoacusia') ? 'text-yellow-600' : 'text-red-600'}>
                                            {option}
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 💪 SISTEMA MOTOR */}
                        {section.id === 'motorSystem' && (
                          <div className="space-y-6">
                            {/* Fuerza Muscular */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Fuerza Muscular (0-5):</Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                  { key: 'rightArm', label: 'Brazo Derecho' },
                                  { key: 'leftArm', label: 'Brazo Izquierdo' },
                                  { key: 'rightLeg', label: 'Pierna Derecha' },
                                  { key: 'leftLeg', label: 'Pierna Izquierda' }
                                ].map((limb) => (
                                  <div key={limb.key} className="space-y-2">
                                    <Label className="text-white text-sm">{limb.label}:</Label>
                                    <Select 
                                      value={neuroData.motorSystem.strength[limb.key as keyof typeof neuroData.motorSystem.strength].toString()} 
                                      onValueChange={(value) => updateNeuroData(`motorSystem.strength.${limb.key}`, parseInt(value))}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[0,1,2,3,4,5].map((grade) => (
                                          <SelectItem key={grade} value={grade.toString()}>
                                            <span className={grade === 5 ? 'text-green-600' : grade >= 3 ? 'text-yellow-600' : 'text-red-600'}>
                                              {grade}/5 {grade === 5 ? '(Normal)' : grade === 4 ? '(Buena)' : grade === 3 ? '(Contra gravedad)' : grade === 2 ? '(Sin gravedad)' : grade === 1 ? '(Contracción)' : '(Parálisis)'}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Reflejos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Reflejos:</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                  { key: 'biceps', label: 'Biceps' },
                                  { key: 'triceps', label: 'Triceps' },
                                  { key: 'patellar', label: 'Rotuliano' },
                                  { key: 'achilles', label: 'Aquíleo' },
                                  { key: 'babinski', label: 'Babinski' }
                                ].map((reflex) => (
                                  <div key={reflex.key} className="space-y-2">
                                    <Label className="text-white text-sm">{reflex.label}:</Label>
                                    <Select 
                                      value={neuroData.motorSystem.reflexes[reflex.key as keyof typeof neuroData.motorSystem.reflexes]} 
                                      onValueChange={(value) => updateNeuroData(`motorSystem.reflexes.${reflex.key}`, value)}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue placeholder="Evaluar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {reflex.key === 'babinski' ? 
                                          ['Ausente', 'Presente'].map((option) => (
                                            <SelectItem key={option} value={option}>
                                              <span className={option === 'Ausente' ? 'text-green-600' : 'text-red-600'}>
                                                {option}
                                              </span>
                                            </SelectItem>
                                          ))
                                        :
                                          ['Ausente', 'Hipoactivo', 'Normal', 'Hiperactivo'].map((option) => (
                                            <SelectItem key={option} value={option}>
                                              <span className={option === 'Normal' ? 'text-green-600' : option === 'Hipoactivo' || option === 'Hiperactivo' ? 'text-yellow-600' : 'text-red-600'}>
                                                {option}
                                              </span>
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🌊 SISTEMA SENSORIAL */}
                        {section.id === 'sensorySystem' && (
                          <div className="space-y-6">
                            {/* Sensibilidad Táctil */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Sensibilidad Táctil:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  { key: 'rightSide', label: 'Lado Derecho' },
                                  { key: 'leftSide', label: 'Lado Izquierdo' }
                                ].map((side) => (
                                  <div key={side.key} className="space-y-2">
                                    <Label className="text-white text-sm">{side.label}:</Label>
                                    <Select 
                                      value={neuroData.sensorySystem.touch[side.key as keyof typeof neuroData.sensorySystem.touch]} 
                                      onValueChange={(value) => updateNeuroData(`sensorySystem.touch.${side.key}`, value)}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue placeholder="Evaluar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {['Normal', 'Hipoestesia', 'Anestesia'].map((option) => (
                                          <SelectItem key={option} value={option}>
                                            <span className={option === 'Normal' ? 'text-green-600' : option === 'Hipoestesia' ? 'text-yellow-600' : 'text-red-600'}>
                                              {option}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Sensibilidad Vibratoria y Posición */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-white font-semibold text-lg mb-3 block">Sensibilidad Vibratoria:</Label>
                                <div className="space-y-3">
                                  {[
                                    { key: 'upper', label: 'Miembros Superiores' },
                                    { key: 'lower', label: 'Miembros Inferiores' }
                                  ].map((region) => (
                                    <div key={region.key} className="flex items-center gap-3">
                                      <Label className="text-white text-sm w-32">{region.label}:</Label>
                                      <Select 
                                        value={neuroData.sensorySystem.vibration[region.key as keyof typeof neuroData.sensorySystem.vibration]} 
                                        onValueChange={(value) => updateNeuroData(`sensorySystem.vibration.${region.key}`, value)}
                                      >
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white flex-1">
                                          <SelectValue placeholder="Evaluar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {['Normal', 'Alterada', 'Ausente'].map((option) => (
                                            <SelectItem key={option} value={option}>
                                              <span className={option === 'Normal' ? 'text-green-600' : option === 'Alterada' ? 'text-yellow-600' : 'text-red-600'}>
                                                {option}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <Label className="text-white font-semibold text-lg mb-3 block">Propiocepción:</Label>
                                <div className="space-y-3">
                                  {[
                                    { key: 'upper', label: 'Miembros Superiores' },
                                    { key: 'lower', label: 'Miembros Inferiores' }
                                  ].map((region) => (
                                    <div key={region.key} className="flex items-center gap-3">
                                      <Label className="text-white text-sm w-32">{region.label}:</Label>
                                      <Select 
                                        value={neuroData.sensorySystem.position[region.key as keyof typeof neuroData.sensorySystem.position]} 
                                        onValueChange={(value) => updateNeuroData(`sensorySystem.position.${region.key}`, value)}
                                      >
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white flex-1">
                                          <SelectValue placeholder="Evaluar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {['Normal', 'Alterada', 'Ausente'].map((option) => (
                                            <SelectItem key={option} value={option}>
                                              <span className={option === 'Normal' ? 'text-green-600' : option === 'Alterada' ? 'text-yellow-600' : 'text-red-600'}>
                                                {option}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 📊 ESCALAS NEUROLÓGICAS */}
                        {section.id === 'nihss' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Escala NIHSS:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                  { key: 'consciousness', label: 'Nivel conciencia', max: 3 },
                                  { key: 'orientation', label: 'Orientación', max: 2 },
                                  { key: 'commands', label: 'Comandos', max: 2 },
                                  { key: 'gaze', label: 'Mirada conjugada', max: 2 },
                                  { key: 'visual', label: 'Campo visual', max: 3 },
                                  { key: 'facialPalsy', label: 'Paresia facial', max: 3 },
                                  { key: 'motorArm', label: 'Motor brazo', max: 4 },
                                  { key: 'motorLeg', label: 'Motor pierna', max: 4 },
                                  { key: 'ataxia', label: 'Ataxia', max: 2 },
                                  { key: 'sensory', label: 'Sensibilidad', max: 2 },
                                  { key: 'language', label: 'Lenguaje', max: 3 },
                                  { key: 'dysarthria', label: 'Disartria', max: 2 },
                                  { key: 'extinction', label: 'Extinción/Inatención', max: 2 }
                                ].map((item) => (
                                  <div key={item.key} className="space-y-2">
                                    <Label className="text-white text-sm font-medium">{item.label}:</Label>
                                    <Select 
                                      value={neuroData.clinicalScores.nihss[item.key as keyof typeof neuroData.clinicalScores.nihss].toString()} 
                                      onValueChange={(value) => updateNeuroData(`clinicalScores.nihss.${item.key}`, parseInt(value))}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({length: item.max + 1}, (_, i) => (
                                          <SelectItem key={i} value={i.toString()}>
                                            <span className={i === 0 ? 'text-green-600' : i <= item.max/2 ? 'text-yellow-600' : 'text-red-600'}>
                                              {i}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resultado NIHSS */}
                            {neuroData.clinicalScores.nihss.total > 0 && (
                              <Alert className={`${neuroData.clinicalScores.nihss.total > 15 ? 'bg-red-500/20 border-red-400/30' : 
                                neuroData.clinicalScores.nihss.total > 4 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-green-500/20 border-green-400/30'}`}>
                                <Gauge className="h-4 w-4 text-white" />
                                <AlertDescription className="text-white">
                                  <strong>NIHSS Score:</strong> {neuroData.clinicalScores.nihss.total}/42
                                  <br />
                                  <strong>Severidad:</strong> {neuroData.clinicalScores.nihss.severity}
                                  <br />
                                  <strong>Recomendación:</strong> {neuroData.clinicalScores.nihss.total > 4 ? 'Considerar trombolisis/trombectomía' : 'Manejo conservador'}
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Resumen de Scores */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">Glasgow</h3>
                                <p className="text-2xl font-bold">{neuroData.mentalStatus.glasgow.total}/15</p>
                                <p className="text-sm opacity-90">{neuroData.mentalStatus.glasgow.classification || 'Sin evaluar'}</p>
                              </div>
                              
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">NIHSS</h3>
                                <p className="text-2xl font-bold">{neuroData.clinicalScores.nihss.total}/42</p>
                                <p className="text-sm opacity-90">{neuroData.clinicalScores.nihss.severity || 'Sin evaluar'}</p>
                              </div>
                              
                              <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">Riesgo ACV</h3>
                                <p className="text-2xl font-bold">{neuroData.clinicalScores.strokeRisk.score}</p>
                                <p className="text-sm opacity-90">{neuroData.clinicalScores.strokeRisk.riskLevel || 'Sin evaluar'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🏥 PLAN DE MANEJO */}
                        {section.id === 'management' && (
                          <div className="space-y-6">
                            {/* Tratamiento de Emergencia */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Tratamiento de Emergencia:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {emergencyTreatments.map((treatment) => (
                                  <div key={treatment} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`emergency-${treatment}`}
                                      checked={neuroData.management.emergencyTreatment.includes(treatment)}
                                      onCheckedChange={(checked) => updateArrayData('management.emergencyTreatment', treatment, checked as boolean)}
                                    />
                                    <Label htmlFor={`emergency-${treatment}`} className="text-white text-sm cursor-pointer">
                                      {treatment}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Plan Diagnóstico */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Plan Diagnóstico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {diagnosticTests.map((test) => (
                                  <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`diagnostic-${test}`}
                                      checked={neuroData.management.diagnosticPlan.includes(test)}
                                      onCheckedChange={(checked) => updateArrayData('management.diagnosticPlan', test, checked as boolean)}
                                    />
                                    <Label htmlFor={`diagnostic-${test}`} className="text-white text-sm cursor-pointer">
                                      {test}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Plan Terapéutico */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Plan Terapéutico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {therapeuticOptions.map((therapy) => (
                                  <div key={therapy} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`therapeutic-${therapy}`}
                                      checked={neuroData.management.therapeuticPlan.includes(therapy)}
                                      onCheckedChange={(checked) => updateArrayData('management.therapeuticPlan', therapy, checked as boolean)}
                                    />
                                    <Label htmlFor={`therapeutic-${therapy}`} className="text-white text-sm cursor-pointer">
                                      {therapy}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Placeholder para secciones no definidas */}
                        {!['symptoms', 'riskFactors', 'mentalStatus', 'cranialNerves', 'motorSystem', 'sensorySystem', 'nihss', 'management'].includes(section.id) && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                              {section.icon}
                            </div>
                            <h4 className="font-medium text-white mb-2">
                              {section.title}
                            </h4>
                            <p className="text-white/70 mb-4">
                              Esta sección está en desarrollo y contendrá formularios médicos específicos para la evaluación neurológica completa.
                            </p>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Próximamente</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO - MEDICAL DASHBOARD */}
        {!showSplitView && (
          <MedicalDashboard 
            alerts={alerts}
            medicalScales={medicalScales}
            progressPercentage={neuroData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Neurología"
          />
        )}
      </div>

      {/* PANEL LATERAL SPLIT VIEW - INFORME EN TIEMPO REAL */}
      <AnimatePresence>
        {showSplitView && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 right-4 w-96 h-[calc(100vh-6rem)] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 z-30 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-700 dark:to-blue-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                Informe Neurológico
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyReport}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Copiar informe"
                >
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Imprimir informe"
                >
                  <PrintIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button
                  onClick={() => setShowSplitView(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {medicalReport || 'Seleccione los parámetros del examen neurológico para generar el informe en tiempo real...'}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && neuroData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({neuroData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}