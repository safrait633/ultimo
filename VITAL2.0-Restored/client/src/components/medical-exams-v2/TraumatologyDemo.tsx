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
  Bone, 
  Target,
  AlertTriangle,
  Activity,
  Gauge,
  Calculator,
  Eye,
  FileText,
  Copy,
  Download,
  Zap,
  Scissors,
  Hammer,
  Move,
  Info,
  CheckCircle,
  BarChart3,
  Users,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  X,
  FileText as PrintIcon,
  Clock,
  CheckCircle2,
  Crosshair,
  Shield,
  Scan
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

// 🎯 FRAMEWORK UNIVERSAL - TIPOS DE DATOS TRAUMATOLÓGICOS
interface TraumatologyData {
  // 📊 DASHBOARD MÉDICO ESTÁNDAR
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // 📋 ANAMNESIS TRAUMATOLÓGICA (ZERO-TYPING)
  traumaHistory: {
    mechanism: string;
    energy: string;
    timeElapsed: string;
    painSymptoms: string[];
    functionalSymptoms: string[];
    systemicSymptoms: string[];
  };

  riskFactors: {
    personal: string[];
    biomechanical: string[];
    medical: string[];
    occupational: string[];
  };

  // 🔍 EXAMEN FÍSICO SISTEMÁTICO
  physicalExam: {
    inspection: {
      posture: string;
      deformity: string[];
      swelling: string[];
      skinChanges: string[];
    };
    palpation: {
      tenderness: string[];
      masses: string[];
      temperature: string[];
      pulses: string[];
    };
    rangeOfMotion: {
      active: {
        flexion: number;
        extension: number;
        abduction: number;
        adduction: number;
        rotation: number;
      };
      passive: {
        flexion: number;
        extension: number;
        abduction: number;
        adduction: number;
        rotation: number;
      };
      limitation: string[];
    };
    specialTests: {
      stability: string[];
      neurovascular: string[];
      functional: string[];
    };
  };

  // 🩻 ESTUDIOS DE IMAGEN
  imaging: {
    xray: {
      findings: string[];
      classification: string;
      stability: string;
    };
    ct: {
      indicated: boolean;
      findings: string[];
    };
    mri: {
      indicated: boolean;
      findings: string[];
    };
  };

  // ⚕️ ESCALAS CLÍNICAS AUTOMÁTICAS
  clinicalScores: {
    painScale: {
      score: number;
      description: string;
      functional: string;
    };
    functionalScale: {
      adl: number;
      sports: number;
      work: number;
      total: number;
      classification: string;
    };
    fractureClassification: {
      ao: string;
      garden: string;
      salterHarris: string;
      interpretation: string;
    };
  };

  // 🏥 PLAN INTEGRAL
  management: {
    urgentTreatment: string[];
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    rehabilitation: string[];
    followUp: string[];
  };
}

interface TraumatologyDemoProps {
  patientData: {
    id: string;
    name?: string;
    age: number;
    gender: string;
  };
  onComplete: (data: any) => void;
}

export default function TraumatologyDemo({ patientData, onComplete }: TraumatologyDemoProps) {
  
  // 🎯 ESTADO PRINCIPAL FRAMEWORK UNIVERSAL
  const [traumaData, setTraumaData] = useState<TraumatologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 9,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
    traumaHistory: {
      mechanism: '',
      energy: '',
      timeElapsed: '',
      painSymptoms: [],
      functionalSymptoms: [],
      systemicSymptoms: []
    },
    riskFactors: {
      personal: [],
      biomechanical: [],
      medical: [],
      occupational: []
    },
    physicalExam: {
      inspection: {
        posture: '',
        deformity: [],
        swelling: [],
        skinChanges: []
      },
      palpation: {
        tenderness: [],
        masses: [],
        temperature: [],
        pulses: []
      },
      rangeOfMotion: {
        active: { flexion: 0, extension: 0, abduction: 0, adduction: 0, rotation: 0 },
        passive: { flexion: 0, extension: 0, abduction: 0, adduction: 0, rotation: 0 },
        limitation: []
      },
      specialTests: {
        stability: [],
        neurovascular: [],
        functional: []
      }
    },
    imaging: {
      xray: { findings: [], classification: '', stability: '' },
      ct: { indicated: false, findings: [] },
      mri: { indicated: false, findings: [] }
    },
    clinicalScores: {
      painScale: { score: 0, description: '', functional: '' },
      functionalScale: { adl: 0, sports: 0, work: 0, total: 0, classification: '' },
      fractureClassification: { ao: '', garden: '', salterHarris: '', interpretation: '' }
    },
    management: {
      urgentTreatment: [],
      diagnosticPlan: [],
      therapeuticPlan: [],
      rehabilitation: [],
      followUp: []
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['traumaHistory']);
  const [showSplitView, setShowSplitView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 🛠️ FUNCIONES AUXILIARES UNIVERSALES
  const updateTraumaData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setTraumaData(prev => {
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
    setTraumaData(prev => {
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
  const calculatePainScore = useCallback(() => {
    const score = traumaData.clinicalScores.painScale.score;
    let description = '';
    let functional = '';

    if (score === 0) {
      description = 'Sin dolor';
      functional = 'Actividad normal';
    } else if (score <= 3) {
      description = 'Dolor leve';
      functional = 'Actividades diarias normales';
    } else if (score <= 6) {
      description = 'Dolor moderado';
      functional = 'Limitación actividades deportivas';
    } else if (score <= 8) {
      description = 'Dolor intenso';
      functional = 'Limitación actividades diarias';
    } else {
      description = 'Dolor insoportable';
      functional = 'Incapacidad funcional total';
    }

    updateTraumaData('clinicalScores.painScale.description', description);
    updateTraumaData('clinicalScores.painScale.functional', functional);
  }, [traumaData.clinicalScores.painScale.score]);

  const calculateFunctionalScore = useCallback(() => {
    const { adl, sports, work } = traumaData.clinicalScores.functionalScale;
    const total = adl + sports + work;
    let classification = '';

    if (total >= 80) classification = 'Excelente función';
    else if (total >= 65) classification = 'Buena función';
    else if (total >= 50) classification = 'Función regular';
    else if (total >= 35) classification = 'Función pobre';
    else classification = 'Disfunción severa';

    updateTraumaData('clinicalScores.functionalScale.total', total);
    updateTraumaData('clinicalScores.functionalScale.classification', classification);
  }, [traumaData.clinicalScores.functionalScale.adl, traumaData.clinicalScores.functionalScale.sports, traumaData.clinicalScores.functionalScale.work]);

  // 🚨 SISTEMA DE ALERTAS UNIVERSAL
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: typeof traumaData.urgencyLevel = 'Normal';

    // ALERTAS ROJAS: Emergencias traumatológicas
    const emergencyFindings = [
      'Fractura expuesta', 'Síndrome compartimental', 'Luxación posterior cadera',
      'Déficit neurovascular', 'Fractura inestable', 'Pérdida de pulsos',
      'Deformidad severa', 'Shock hipovolémico'
    ];
    
    const hasEmergency = [
      ...traumaData.physicalExam.inspection.deformity,
      ...traumaData.physicalExam.palpation.pulses,
      ...traumaData.imaging.xray.findings,
      ...traumaData.traumaHistory.painSymptoms
    ].some(finding => emergencyFindings.some(emergency => finding.includes(emergency)));
    
    if (hasEmergency || traumaData.clinicalScores.painScale.score >= 8) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }

    // ALERTAS AMARILLAS: Seguimiento prioritario
    if (traumaData.clinicalScores.painScale.score >= 6 ||
        traumaData.clinicalScores.functionalScale.total <= 50 ||
        traumaData.physicalExam.rangeOfMotion.limitation.length >= 3) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // ALERTAS AZULES: Información adicional
    if (traumaData.traumaHistory.painSymptoms.length > 3 ||
        traumaData.physicalExam.specialTests.stability.length > 2) {
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }

    // Calcular progreso
    let sectionsCompleted = 0;
    if (traumaData.traumaHistory.mechanism) sectionsCompleted++;
    if (traumaData.riskFactors.personal.length > 0) sectionsCompleted++;
    if (traumaData.physicalExam.inspection.posture) sectionsCompleted++;
    if (traumaData.physicalExam.palpation.tenderness.length > 0) sectionsCompleted++;
    if (traumaData.physicalExam.rangeOfMotion.active.flexion > 0) sectionsCompleted++;
    if (traumaData.physicalExam.specialTests.stability.length > 0) sectionsCompleted++;
    if (traumaData.imaging.xray.findings.length > 0) sectionsCompleted++;
    if (traumaData.clinicalScores.painScale.score > 0) sectionsCompleted++;
    if (traumaData.management.diagnosticPlan.length > 0) sectionsCompleted++;

    const progress = Math.round((sectionsCompleted / traumaData.totalSections) * 100);

    // Actualizar estados
    setTraumaData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urgencyLevel,
      examProgress: progress,
      sectionsCompleted
    }));
  }, [traumaData]);

  // 📄 GENERACIÓN AUTOMÁTICA DE REPORTE
  const generateMedicalReport = useCallback(() => {
    let report = 'REPORTE TRAUMATOLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    report += `Fecha: ${new Date().toLocaleDateString()}\n`;
    report += `Paciente: ${patientData.name} (${patientData.age} años)\n`;
    report += `Urgencia: ${traumaData.urgencyLevel}\n`;
    report += `Progreso: ${traumaData.examProgress}%\n\n`;

    // Historia del trauma
    if (traumaData.traumaHistory.mechanism) {
      report += 'HISTORIA DEL TRAUMA:\n';
      report += `• Mecanismo: ${traumaData.traumaHistory.mechanism}\n`;
      report += `• Energía: ${traumaData.traumaHistory.energy}\n`;
      report += `• Tiempo transcurrido: ${traumaData.traumaHistory.timeElapsed}\n`;
      if (traumaData.traumaHistory.painSymptoms.length > 0) {
        report += `• Síntomas dolorosos: ${traumaData.traumaHistory.painSymptoms.join(', ')}\n`;
      }
      report += '\n';
    }

    // Examen físico
    if (traumaData.physicalExam.inspection.posture) {
      report += 'EXAMEN FÍSICO:\n';
      report += `• Postura: ${traumaData.physicalExam.inspection.posture}\n`;
      if (traumaData.physicalExam.inspection.deformity.length > 0) {
        report += `• Deformidades: ${traumaData.physicalExam.inspection.deformity.join(', ')}\n`;
      }
      if (traumaData.physicalExam.palpation.tenderness.length > 0) {
        report += `• Puntos dolorosos: ${traumaData.physicalExam.palpation.tenderness.join(', ')}\n`;
      }
      report += '\n';
    }

    // Rangos de movimiento
    const { active } = traumaData.physicalExam.rangeOfMotion;
    if (active.flexion > 0 || active.extension > 0) {
      report += 'RANGOS DE MOVIMIENTO ACTIVO:\n';
      if (active.flexion > 0) report += `• Flexión: ${active.flexion}°\n`;
      if (active.extension > 0) report += `• Extensión: ${active.extension}°\n`;
      if (active.abduction > 0) report += `• Abducción: ${active.abduction}°\n`;
      if (active.rotation > 0) report += `• Rotación: ${active.rotation}°\n`;
      report += '\n';
    }

    // Escalas clínicas
    if (traumaData.clinicalScores.painScale.score > 0) {
      report += 'ESCALAS CLÍNICAS:\n';
      report += `• Dolor EVA: ${traumaData.clinicalScores.painScale.score}/10 - ${traumaData.clinicalScores.painScale.description}\n`;
      report += `• Impacto funcional: ${traumaData.clinicalScores.painScale.functional}\n`;
    }
    if (traumaData.clinicalScores.functionalScale.total > 0) {
      report += `• Función: ${traumaData.clinicalScores.functionalScale.total}/100 - ${traumaData.clinicalScores.functionalScale.classification}\n`;
    }
    report += '\n';

    // Estudios de imagen
    if (traumaData.imaging.xray.findings.length > 0) {
      report += 'ESTUDIOS DE IMAGEN:\n';
      report += `• Radiografía: ${traumaData.imaging.xray.findings.join(', ')}\n`;
      if (traumaData.imaging.xray.classification) {
        report += `• Clasificación: ${traumaData.imaging.xray.classification}\n`;
      }
      report += '\n';
    }

    // Plan
    if (traumaData.management.diagnosticPlan.length > 0) {
      report += 'PLAN DE MANEJO:\n';
      traumaData.management.diagnosticPlan.forEach(plan => report += `• ${plan}\n`);
      report += '\n';
    }

    setMedicalReport(report);
  }, [traumaData, patientData]);

  // 🔄 EFECTOS AUTOMÁTICOS
  useEffect(() => {
    calculatePainScore();
  }, [traumaData.clinicalScores.painScale.score]);

  useEffect(() => {
    calculateFunctionalScore();
  }, [traumaData.clinicalScores.functionalScale.adl, traumaData.clinicalScores.functionalScale.sports, traumaData.clinicalScores.functionalScale.work]);

  useEffect(() => {
    calculateRiskScores();
  }, [traumaData]);

  useEffect(() => {
    generateMedicalReport();
  }, [traumaData]);

  // 📋 DATOS MÉDICOS (PRINCIPIO ZERO-TYPING)
  const traumaMechanisms = [
    'Caída de altura', 'Accidente de tráfico', 'Lesión deportiva', 'Golpe directo',
    'Torsión forzada', 'Tracción brusca', 'Aplastamiento', 'Penetrante'
  ];

  const painSymptoms = [
    'Dolor en reposo', 'Dolor al movimiento', 'Dolor nocturno', 'Dolor irradiado',
    'Hormigueo', 'Entumecimiento', 'Debilidad muscular', 'Rigidez articular'
  ];

  const functionalSymptoms = [
    'Limitación para caminar', 'Dificultad escaleras', 'Imposibilidad carga peso',
    'Limitación deportiva', 'Incapacidad laboral', 'Dependencia AVD', 'Claudicación'
  ];

  const personalRiskFactors = [
    'Edad > 65 años', 'Osteoporosis', 'Artritis previa', 'Cirugía previa',
    'Inestabilidad articular', 'Debilidad muscular', 'Déficit propioceptivo'
  ];

  const medicalRiskFactors = [
    'Diabetes mellitus', 'Enfermedad vascular', 'Uso corticoides',
    'Tabaquismo', 'Alcoholismo', 'Malnutrición', 'Trastornos coagulación'
  ];

  const inspectionFindings = [
    'Deformidad angular', 'Acortamiento', 'Rotación externa', 'Edema localizado',
    'Hematoma', 'Equimosis', 'Herida abierta', 'Ampollas', 'Palidez', 'Cianosis'
  ];

  const palpationFindings = [
    'Crepitación ósea', 'Escalón óseo', 'Dolor puntual', 'Masa palpable',
    'Aumento temperatura', 'Pulso disminuido', 'Pulso ausente', 'Llenado capilar lento'
  ];

  const stabilityTests = [
    'Cajón anterior', 'Cajón posterior', 'Lachman', 'McMurray', 'Apley',
    'Bostezo lateral', 'Bostezo medial', 'Impingement', 'Apprehension'
  ];

  const imagingFindings = [
    'Fractura simple', 'Fractura conminuta', 'Fractura espiroidea', 'Fractura oblicua',
    'Luxación', 'Subluxación', 'Avulsión ósea', 'Lesión condral', 'Derrame articular'
  ];

  const diagnosticTests = [
    'Radiografía simple', 'TAC', 'Resonancia magnética', 'Ecografía musculoesquelética',
    'Gammagrafía ósea', 'Artroscopía diagnóstica', 'Electromiografía'
  ];

  const therapeuticOptions = [
    'Inmovilización', 'Reducción cerrada', 'Reducción abierta', 'Fijación interna',
    'Fijación externa', 'Artroplastia', 'Artrodesis', 'Rehabilitación'
  ];

  // Secciones del examen
  const examSections = [
    {
      id: 'traumaHistory',
      title: 'Historia del Trauma',
      icon: <Hammer className="w-5 h-5 text-blue-500" />,
      description: 'Mecanismo y contexto del trauma',
      progress: traumaData.traumaHistory.mechanism ? 100 : 0
    },
    {
      id: 'riskFactors',
      title: 'Factores de Riesgo',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      description: 'Evaluación de riesgo integral',
      progress: traumaData.riskFactors.personal.length > 0 ? 100 : 0
    },
    {
      id: 'inspection',
      title: 'Inspección',
      icon: <Eye className="w-5 h-5 text-green-500" />,
      description: 'Evaluación visual sistemática',
      progress: traumaData.physicalExam.inspection.posture ? 100 : 0
    },
    {
      id: 'palpation',
      title: 'Palpación',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      description: 'Exploración táctil dirigida',
      progress: traumaData.physicalExam.palpation.tenderness.length > 0 ? 100 : 0
    },
    {
      id: 'rangeOfMotion',
      title: 'Rangos de Movimiento',
      icon: <Move className="w-5 h-5 text-indigo-500" />,
      description: 'Evaluación funcional articular',
      progress: traumaData.physicalExam.rangeOfMotion.active.flexion > 0 ? 100 : 0
    },
    {
      id: 'specialTests',
      title: 'Pruebas Especiales',
      icon: <Crosshair className="w-5 h-5 text-red-500" />,
      description: 'Maniobras diagnósticas específicas',
      progress: traumaData.physicalExam.specialTests.stability.length > 0 ? 100 : 0
    },
    {
      id: 'imaging',
      title: 'Estudios de Imagen',
      icon: <Scan className="w-5 h-5 text-cyan-500" />,
      description: 'Evaluación radiológica sistemática',
      progress: traumaData.imaging.xray.findings.length > 0 ? 100 : 0
    },
    {
      id: 'scores',
      title: 'Escalas Clínicas',
      icon: <Calculator className="w-5 h-5 text-pink-500" />,
      description: 'Scores automáticos y escalas',
      progress: traumaData.clinicalScores.painScale.score > 0 ? 100 : 0
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />,
      description: 'Plan integral traumatológico',
      progress: traumaData.management.diagnosticPlan.length > 0 ? 100 : 0
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

  // Convertir a formato compatible con MedicalDashboard
  const progressSections = {
    trauma: traumaData.traumaHistory.mechanism !== '',
    riesgo: traumaData.riskFactors.personal.length > 0,
    inspección: traumaData.physicalExam.inspection.posture !== '',
    palpación: traumaData.physicalExam.palpation.tenderness.length > 0,
    movimiento: traumaData.physicalExam.rangeOfMotion.active.flexion > 0,
    pruebas: traumaData.physicalExam.specialTests.stability.length > 0,
    imagen: traumaData.imaging.xray.findings.length > 0,
    escalas: traumaData.clinicalScores.painScale.score > 0,
    plan: traumaData.management.diagnosticPlan.length > 0
  };

  const alerts = [
    ...(traumaData.alertCount > 0 ? [{
      id: 'critical',
      type: 'urgent' as const,
      message: `🚨 ${traumaData.alertCount} emergencias traumatológicas detectadas`,
      timestamp: new Date()
    }] : []),
    ...(traumaData.warningCount > 0 ? [{
      id: 'warning',
      type: 'warning' as const,
      message: `⚠️ ${traumaData.warningCount} factores de riesgo identificados`,
      timestamp: new Date()
    }] : [])
  ];

  const medicalScales = [
    ...(traumaData.clinicalScores.painScale.score > 0 ? [{
      name: 'Escala EVA Dolor',
      score: traumaData.clinicalScores.painScale.score,
      interpretation: traumaData.clinicalScores.painScale.description,
      riskLevel: traumaData.clinicalScores.painScale.score >= 7 ? 'high' : 
                 traumaData.clinicalScores.painScale.score >= 4 ? 'intermediate' : 'low',
      recommendations: [traumaData.clinicalScores.painScale.functional]
    }] : []),
    ...(traumaData.clinicalScores.functionalScale.total > 0 ? [{
      name: 'Función Traumatológica',
      score: traumaData.clinicalScores.functionalScale.total,
      interpretation: traumaData.clinicalScores.functionalScale.classification,
      riskLevel: traumaData.clinicalScores.functionalScale.total >= 65 ? 'low' : 
                 traumaData.clinicalScores.functionalScale.total >= 50 ? 'intermediate' : 'high',
      recommendations: ['Evaluación rehabilitación']
    }] : [])
  ];

  const handleComplete = () => {
    onComplete?.({
      traumaData,
      medicalReport,
      alerts,
      medicalScales,
      progressPercentage: traumaData.examProgress,
      timestamp: new Date(),
      specialty: 'Traumatología'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-steel-800">
      
      {/* 🎯 HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                <Bone className="h-8 w-8 text-blue-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Traumatología Avanzada</h1>
                <p className="text-white/70">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/20 text-blue-200 border border-blue-500/30">
                {traumaData.examProgress}% Completado
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
                            className="h-full bg-gradient-to-r from-blue-400 to-slate-500 transition-all"
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
                        
                        {/* 📋 HISTORIA DEL TRAUMA */}
                        {section.id === 'traumaHistory' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-white font-medium mb-3 block">Mecanismo de trauma:</Label>
                                <Select value={traumaData.traumaHistory.mechanism} onValueChange={(value) => updateTraumaData('traumaHistory.mechanism', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar mecanismo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {traumaMechanisms.map((mechanism) => (
                                      <SelectItem key={mechanism} value={mechanism}>{mechanism}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-white font-medium mb-3 block">Energía del trauma:</Label>
                                <Select value={traumaData.traumaHistory.energy} onValueChange={(value) => updateTraumaData('traumaHistory.energy', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar energía" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="baja">Baja energía</SelectItem>
                                    <SelectItem value="moderada">Moderada energía</SelectItem>
                                    <SelectItem value="alta">Alta energía</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Síntomas Dolorosos:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {painSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`pain-${symptom}`}
                                      checked={traumaData.traumaHistory.painSymptoms.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('traumaHistory.painSymptoms', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`pain-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Síntomas Funcionales:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {functionalSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`functional-${symptom}`}
                                      checked={traumaData.traumaHistory.functionalSymptoms.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('traumaHistory.functionalSymptoms', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`functional-${symptom}`} className="text-white text-sm cursor-pointer">
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
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Factores de Riesgo Personales:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {personalRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`personal-${factor}`}
                                      checked={traumaData.riskFactors.personal.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('riskFactors.personal', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`personal-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Factores de Riesgo Médicos:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {medicalRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`medical-${factor}`}
                                      checked={traumaData.riskFactors.medical.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('riskFactors.medical', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`medical-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 👁️ INSPECCIÓN */}
                        {section.id === 'inspection' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-medium mb-3 block">Postura:</Label>
                              <Select value={traumaData.physicalExam.inspection.posture} onValueChange={(value) => updateTraumaData('physicalExam.inspection.posture', value)}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                  <SelectValue placeholder="Seleccionar postura" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="antalgica">Antiálgica</SelectItem>
                                  <SelectItem value="forzada">Forzada</SelectItem>
                                  <SelectItem value="imposible">Imposible bipedestación</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Hallazgos de Inspección:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {inspectionFindings.map((finding) => (
                                  <div key={finding} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`inspection-${finding}`}
                                      checked={traumaData.physicalExam.inspection.deformity.includes(finding)}
                                      onCheckedChange={(checked) => updateArrayData('physicalExam.inspection.deformity', finding, checked as boolean)}
                                    />
                                    <Label htmlFor={`inspection-${finding}`} className="text-white text-sm cursor-pointer">
                                      {finding}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ✋ PALPACIÓN */}
                        {section.id === 'palpation' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Hallazgos de Palpación:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {palpationFindings.map((finding) => (
                                  <div key={finding} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`palpation-${finding}`}
                                      checked={traumaData.physicalExam.palpation.tenderness.includes(finding)}
                                      onCheckedChange={(checked) => updateArrayData('physicalExam.palpation.tenderness', finding, checked as boolean)}
                                    />
                                    <Label htmlFor={`palpation-${finding}`} className="text-white text-sm cursor-pointer">
                                      {finding}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🔄 RANGOS DE MOVIMIENTO */}
                        {section.id === 'rangeOfMotion' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Movimiento Activo (grados):</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Flexión:</Label>
                                  <Input
                                    type="number"
                                    value={traumaData.physicalExam.rangeOfMotion.active.flexion || ''}
                                    onChange={(e) => updateTraumaData('physicalExam.rangeOfMotion.active.flexion', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Extensión:</Label>
                                  <Input
                                    type="number"
                                    value={traumaData.physicalExam.rangeOfMotion.active.extension || ''}
                                    onChange={(e) => updateTraumaData('physicalExam.rangeOfMotion.active.extension', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Abducción:</Label>
                                  <Input
                                    type="number"
                                    value={traumaData.physicalExam.rangeOfMotion.active.abduction || ''}
                                    onChange={(e) => updateTraumaData('physicalExam.rangeOfMotion.active.abduction', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Aducción:</Label>
                                  <Input
                                    type="number"
                                    value={traumaData.physicalExam.rangeOfMotion.active.adduction || ''}
                                    onChange={(e) => updateTraumaData('physicalExam.rangeOfMotion.active.adduction', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Rotación:</Label>
                                  <Input
                                    type="number"
                                    value={traumaData.physicalExam.rangeOfMotion.active.rotation || ''}
                                    onChange={(e) => updateTraumaData('physicalExam.rangeOfMotion.active.rotation', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🎯 PRUEBAS ESPECIALES */}
                        {section.id === 'specialTests' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Pruebas de Estabilidad:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {stabilityTests.map((test) => (
                                  <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`stability-${test}`}
                                      checked={traumaData.physicalExam.specialTests.stability.includes(test)}
                                      onCheckedChange={(checked) => updateArrayData('physicalExam.specialTests.stability', test, checked as boolean)}
                                    />
                                    <Label htmlFor={`stability-${test}`} className="text-white text-sm cursor-pointer">
                                      {test}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🩻 ESTUDIOS DE IMAGEN */}
                        {section.id === 'imaging' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Hallazgos Radiológicos:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {imagingFindings.map((finding) => (
                                  <div key={finding} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`imaging-${finding}`}
                                      checked={traumaData.imaging.xray.findings.includes(finding)}
                                      onCheckedChange={(checked) => updateArrayData('imaging.xray.findings', finding, checked as boolean)}
                                    />
                                    <Label htmlFor={`imaging-${finding}`} className="text-white text-sm cursor-pointer">
                                      {finding}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-white font-medium mb-3 block">Clasificación de fractura:</Label>
                              <Select value={traumaData.imaging.xray.classification} onValueChange={(value) => updateTraumaData('imaging.xray.classification', value)}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                  <SelectValue placeholder="Seleccionar clasificación" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ao-a">AO Tipo A (Simple)</SelectItem>
                                  <SelectItem value="ao-b">AO Tipo B (Cuña)</SelectItem>
                                  <SelectItem value="ao-c">AO Tipo C (Compleja)</SelectItem>
                                  <SelectItem value="garden-1">Garden I (Incompleta)</SelectItem>
                                  <SelectItem value="garden-2">Garden II (Completa sin desplazamiento)</SelectItem>
                                  <SelectItem value="garden-3">Garden III (Completa parcialmente desplazada)</SelectItem>
                                  <SelectItem value="garden-4">Garden IV (Completa totalmente desplazada)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* 📊 ESCALAS CLÍNICAS */}
                        {section.id === 'scores' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Escala Visual Analógica (EVA):</Label>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white text-sm">Intensidad del dolor (0-10):</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={traumaData.clinicalScores.painScale.score || ''}
                                    onChange={(e) => updateTraumaData('clinicalScores.painScale.score', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                {traumaData.clinicalScores.painScale.score > 0 && (
                                  <Alert className={`${traumaData.clinicalScores.painScale.score >= 7 ? 'bg-red-500/20 border-red-400/30' : 
                                    traumaData.clinicalScores.painScale.score >= 4 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-blue-500/20 border-blue-400/30'}`}>
                                    <AlertTriangle className="h-4 w-4 text-white" />
                                    <AlertDescription className="text-white">
                                      <strong>Puntuación:</strong> {traumaData.clinicalScores.painScale.score}/10
                                      <br />
                                      <strong>Clasificación:</strong> {traumaData.clinicalScores.painScale.description}
                                      <br />
                                      <strong>Impacto funcional:</strong> {traumaData.clinicalScores.painScale.functional}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Escala Funcional:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Actividades diarias (/30):</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={traumaData.clinicalScores.functionalScale.adl || ''}
                                    onChange={(e) => updateTraumaData('clinicalScores.functionalScale.adl', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Actividades deportivas (/40):</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="40"
                                    value={traumaData.clinicalScores.functionalScale.sports || ''}
                                    onChange={(e) => updateTraumaData('clinicalScores.functionalScale.sports', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Actividades laborales (/30):</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={traumaData.clinicalScores.functionalScale.work || ''}
                                    onChange={(e) => updateTraumaData('clinicalScores.functionalScale.work', parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              {traumaData.clinicalScores.functionalScale.total > 0 && (
                                <Alert className={`mt-4 ${traumaData.clinicalScores.functionalScale.total >= 65 ? 'bg-green-500/20 border-green-400/30' : 
                                  traumaData.clinicalScores.functionalScale.total >= 50 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-red-500/20 border-red-400/30'}`}>
                                  <AlertTriangle className="h-4 w-4 text-white" />
                                  <AlertDescription className="text-white">
                                    <strong>Puntuación total:</strong> {traumaData.clinicalScores.functionalScale.total}/100
                                    <br />
                                    <strong>Clasificación:</strong> {traumaData.clinicalScores.functionalScale.classification}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 🏥 PLAN DE MANEJO */}
                        {section.id === 'management' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Plan Diagnóstico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {diagnosticTests.map((test) => (
                                  <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`diagnostic-${test}`}
                                      checked={traumaData.management.diagnosticPlan.includes(test)}
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

                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Plan Terapéutico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {therapeuticOptions.map((therapy) => (
                                  <div key={therapy} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`therapeutic-${therapy}`}
                                      checked={traumaData.management.therapeuticPlan.includes(therapy)}
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
                        {!['traumaHistory', 'riskFactors', 'inspection', 'palpation', 'rangeOfMotion', 'specialTests', 'imaging', 'scores', 'management'].includes(section.id) && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                              {section.icon}
                            </div>
                            <h4 className="font-medium text-white mb-2">
                              {section.title}
                            </h4>
                            <p className="text-white/70 mb-4">
                              Esta sección está en desarrollo y contendrá formularios médicos específicos para la evaluación traumatológica completa.
                            </p>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300">
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
            progressPercentage={traumaData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Traumatología"
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
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-blue-100 to-slate-100 dark:from-blue-700 dark:to-slate-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Informe Traumatológico
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
                {medicalReport || 'Seleccione los parámetros del examen traumatológico para generar el informe en tiempo real...'}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && traumaData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({traumaData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}