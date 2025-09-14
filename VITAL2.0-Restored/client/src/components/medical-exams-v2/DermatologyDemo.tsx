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
  Shield, 
  Target,
  AlertTriangle,
  Activity,
  Eye,
  Microscope,
  Calculator,
  FileText,
  Copy,
  Download,
  Scan,
  Zap,
  Info,
  CheckCircle,
  Gauge,
  BarChart3,
  Users,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  X,
  FileText as PrintIcon,
  Clock,
  CheckCircle2,
  Palette,
  Ruler,
  Search
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

// 🎯 FRAMEWORK UNIVERSAL - TIPOS DE DATOS DERMATOLÓGICOS
interface DermatologyData {
  // 📊 DASHBOARD MÉDICO ESTÁNDAR
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // 📋 ANAMNESIS DERMATOLÓGICA (ZERO-TYPING)
  symptoms: {
    cutaneous: string[];
    sensory: string[];
    systemic: string[];
    duration: string;
    triggers: string[];
  };

  riskFactors: {
    personal: string[];
    family: string[];
    environmental: string[];
    occupational: string[];
  };

  // 🔍 EVALUACIÓN CUTÁNEA SISTEMÁTICA
  skinEvaluation: {
    skinType: string;
    generalCondition: string[];
    primaryLesions: string[];
    secondaryLesions: string[];
    distribution: string[];
    morphology: {
      size: string;
      shape: string;
      borders: string;
      surface: string;
      consistency: string;
    };
  };

  // 🔬 DERMATOSCOPÍA AVANZADA
  dermoscopy: {
    patterns: string[];
    colors: string[];
    structures: string[];
    vascularization: string[];
    pigmentation: string[];
  };

  // ⚕️ ESCALAS CLÍNICAS AUTOMÁTICAS
  clinicalScores: {
    abcde: {
      criteria: string[];
      score: number;
      riskLevel: string;
    };
    fitzpatrick: {
      type: string;
      characteristics: string[];
      uvSensitivity: string;
    };
    severity: {
      mild: string[];
      moderate: string[];
      severe: string[];
      score: number;
      classification: string;
    };
  };

  // 🗺️ MAPA CORPORAL DIGITAL
  bodyMap: {
    head: string[];
    trunk: string[];
    upperLimbs: string[];
    lowerLimbs: string[];
    genitals: string[];
    special: string[];
  };

  // 🏥 PLAN DERMATOLÓGICO INTEGRAL
  management: {
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    lifestyle: string[];
    followUp: string[];
  };
}

interface DermatologyDemoProps {
  patientData: {
    id: string;
    name?: string;
    age: number;
    gender: string;
  };
  onComplete: (data: any) => void;
}

export default function DermatologyDemo({ patientData, onComplete }: DermatologyDemoProps) {
  
  // 🎯 ESTADO PRINCIPAL FRAMEWORK UNIVERSAL
  const [dermaData, setDermaData] = useState<DermatologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 9,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
    symptoms: {
      cutaneous: [],
      sensory: [],
      systemic: [],
      duration: '',
      triggers: []
    },
    riskFactors: {
      personal: [],
      family: [],
      environmental: [],
      occupational: []
    },
    skinEvaluation: {
      skinType: '',
      generalCondition: [],
      primaryLesions: [],
      secondaryLesions: [],
      distribution: [],
      morphology: {
        size: '',
        shape: '',
        borders: '',
        surface: '',
        consistency: ''
      }
    },
    dermoscopy: {
      patterns: [],
      colors: [],
      structures: [],
      vascularization: [],
      pigmentation: []
    },
    clinicalScores: {
      abcde: {
        criteria: [],
        score: 0,
        riskLevel: ''
      },
      fitzpatrick: {
        type: '',
        characteristics: [],
        uvSensitivity: ''
      },
      severity: {
        mild: [],
        moderate: [],
        severe: [],
        score: 0,
        classification: ''
      }
    },
    bodyMap: {
      head: [],
      trunk: [],
      upperLimbs: [],
      lowerLimbs: [],
      genitals: [],
      special: []
    },
    management: {
      diagnosticPlan: [],
      therapeuticPlan: [],
      lifestyle: [],
      followUp: []
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['symptoms']);
  const [showSplitView, setShowSplitView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 🛠️ FUNCIONES AUXILIARES UNIVERSALES
  const updateDermaData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setDermaData(prev => {
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
    setDermaData(prev => {
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
  const calculateABCDE = useCallback(() => {
    const criteria = dermaData.clinicalScores.abcde.criteria;
    let score = 0;
    let riskLevel = '';

    // Cálculo automático ABCDE para melanoma
    if (criteria.includes('Asimetría')) score += 1;
    if (criteria.includes('Bordes irregulares')) score += 1;
    if (criteria.includes('Color heterogéneo')) score += 1;
    if (criteria.includes('Diámetro > 6mm')) score += 1;
    if (criteria.includes('Evolución/cambios')) score += 1;

    if (score >= 3) riskLevel = 'Alto riesgo - Biopsia urgente';
    else if (score === 2) riskLevel = 'Riesgo moderado - Seguimiento estrecho';
    else if (score === 1) riskLevel = 'Riesgo bajo - Control periódico';
    else riskLevel = 'Lesión benigna probable';

    updateDermaData('clinicalScores.abcde.score', score);
    updateDermaData('clinicalScores.abcde.riskLevel', riskLevel);
  }, [dermaData.clinicalScores.abcde.criteria]);

  const calculateSeverityScore = useCallback(() => {
    const { mild, moderate, severe } = dermaData.clinicalScores.severity;
    let score = mild.length + (moderate.length * 2) + (severe.length * 3);
    let classification = '';

    if (score >= 10) classification = 'Dermatosis severa';
    else if (score >= 6) classification = 'Dermatosis moderada';
    else if (score >= 3) classification = 'Dermatosis leve';
    else if (score > 0) classification = 'Alteraciones mínimas';
    else classification = 'Piel normal';

    updateDermaData('clinicalScores.severity.score', score);
    updateDermaData('clinicalScores.severity.classification', classification);
  }, [dermaData.clinicalScores.severity]);

  // 🚨 SISTEMA DE ALERTAS UNIVERSAL
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: typeof dermaData.urgencyLevel = 'Normal';

    // ALERTAS ROJAS: Emergencias dermatológicas
    const emergencyFindings = [
      'Melanoma sospechoso', 'Lesión sangrante ulcerada', 'Cambios rápidos',
      'Metástasis cutáneas', 'Celulitis necrotizante'
    ];
    
    const hasEmergency = [...dermaData.skinEvaluation.primaryLesions, ...dermaData.symptoms.cutaneous]
      .some(finding => emergencyFindings.some(emergency => finding.includes(emergency)));
    
    if (hasEmergency || dermaData.clinicalScores.abcde.score >= 3) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }

    // ALERTAS AMARILLAS: Seguimiento prioritario
    if (dermaData.clinicalScores.abcde.score === 2 || 
        dermaData.riskFactors.family.includes('Melanoma familiar') ||
        dermaData.clinicalScores.severity.score >= 6) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // ALERTAS AZULES: Información adicional
    if (dermaData.symptoms.cutaneous.length > 3 || 
        dermaData.skinEvaluation.primaryLesions.length > 2) {
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }

    // Calcular progreso
    let sectionsCompleted = 0;
    if (dermaData.symptoms.cutaneous.length > 0) sectionsCompleted++;
    if (dermaData.riskFactors.personal.length > 0) sectionsCompleted++;
    if (dermaData.skinEvaluation.skinType) sectionsCompleted++;
    if (dermaData.skinEvaluation.primaryLesions.length > 0) sectionsCompleted++;
    if (dermaData.dermoscopy.patterns.length > 0) sectionsCompleted++;
    if (dermaData.clinicalScores.abcde.criteria.length > 0) sectionsCompleted++;
    if (dermaData.clinicalScores.fitzpatrick.type) sectionsCompleted++;
    if (Object.values(dermaData.bodyMap).some(area => area.length > 0)) sectionsCompleted++;
    if (dermaData.management.diagnosticPlan.length > 0) sectionsCompleted++;

    const progress = Math.round((sectionsCompleted / dermaData.totalSections) * 100);

    // Actualizar estados
    setDermaData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urgencyLevel,
      examProgress: progress,
      sectionsCompleted
    }));
  }, [dermaData]);

  // 📄 GENERACIÓN AUTOMÁTICA DE REPORTE
  const generateMedicalReport = useCallback(() => {
    let report = 'REPORTE DERMATOLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    report += `Fecha: ${new Date().toLocaleDateString()}\n`;
    report += `Paciente: ${patientData.name} (${patientData.age} años)\n`;
    report += `Urgencia: ${dermaData.urgencyLevel}\n`;
    report += `Progreso: ${dermaData.examProgress}%\n\n`;

    // Evaluación cutánea
    if (dermaData.skinEvaluation.skinType) {
      report += 'EVALUACIÓN CUTÁNEA:\n';
      report += `• Fototipo: ${dermaData.skinEvaluation.skinType}\n`;
      if (dermaData.skinEvaluation.primaryLesions.length > 0) {
        report += `• Lesiones primarias: ${dermaData.skinEvaluation.primaryLesions.join(', ')}\n`;
      }
      if (dermaData.skinEvaluation.secondaryLesions.length > 0) {
        report += `• Lesiones secundarias: ${dermaData.skinEvaluation.secondaryLesions.join(', ')}\n`;
      }
      report += '\n';
    }

    // Dermatoscopía
    if (dermaData.dermoscopy.patterns.length > 0) {
      report += 'DERMATOSCOPÍA:\n';
      report += `• Patrones: ${dermaData.dermoscopy.patterns.join(', ')}\n`;
      if (dermaData.dermoscopy.colors.length > 0) {
        report += `• Colores: ${dermaData.dermoscopy.colors.join(', ')}\n`;
      }
      report += '\n';
    }

    // Escalas clínicas
    if (dermaData.clinicalScores.abcde.riskLevel) {
      report += 'ESCALAS CLÍNICAS:\n';
      report += `• ABCDE: ${dermaData.clinicalScores.abcde.score}/5 - ${dermaData.clinicalScores.abcde.riskLevel}\n`;
    }
    if (dermaData.clinicalScores.fitzpatrick.type) {
      report += `• Fitzpatrick: ${dermaData.clinicalScores.fitzpatrick.type}\n`;
    }
    if (dermaData.clinicalScores.severity.classification) {
      report += `• Severidad: ${dermaData.clinicalScores.severity.classification}\n`;
    }
    report += '\n';

    // Plan
    if (dermaData.management.diagnosticPlan.length > 0) {
      report += 'PLAN DIAGNÓSTICO:\n';
      dermaData.management.diagnosticPlan.forEach(plan => report += `• ${plan}\n`);
      report += '\n';
    }

    setMedicalReport(report);
  }, [dermaData, patientData]);

  // 🔄 EFECTOS AUTOMÁTICOS
  useEffect(() => {
    calculateABCDE();
  }, [dermaData.clinicalScores.abcde.criteria]);

  useEffect(() => {
    calculateSeverityScore();
  }, [dermaData.clinicalScores.severity.mild, dermaData.clinicalScores.severity.moderate, dermaData.clinicalScores.severity.severe]);

  useEffect(() => {
    calculateRiskScores();
  }, [dermaData]);

  useEffect(() => {
    generateMedicalReport();
  }, [dermaData]);

  // 📋 DATOS MÉDICOS (PRINCIPIO ZERO-TYPING)
  const cutaneousSymptoms = [
    'Prurito intenso', 'Ardor/quemazón', 'Dolor punzante', 'Entumecimiento',
    'Descamación', 'Sequedad excesiva', 'Hipersudoración', 'Cambios de coloración',
    'Engrosamiento cutáneo', 'Fragilidad cutánea', 'Fotosensibilidad'
  ];

  const systemicSymptoms = [
    'Fiebre', 'Malestar general', 'Pérdida de peso', 'Fatiga crónica',
    'Artralgia', 'Adenopatías', 'Cambios ungueales', 'Alteraciones capilares'
  ];

  const personalRiskFactors = [
    'Exposición solar crónica', 'Antecedente de quemaduras solares', 'Uso de cabinas UV',
    'Inmunosupresión', 'Trasplante de órganos', 'Tratamiento oncológico',
    'Enfermedad autoinmune', 'Diabetes mellitus', 'Insuficiencia vascular'
  ];

  const familyRiskFactors = [
    'Melanoma familiar', 'Cáncer cutáneo no melanoma', 'Síndrome de nevus displásicos',
    'Xeroderma pigmentoso', 'Enfermedad autoinmune', 'Psoriasis', 'Atopia familiar'
  ];

  const primaryLesions = [
    'Mácula', 'Pápula', 'Nódulo', 'Tumor', 'Vesícula', 'Ampolla', 'Pústula',
    'Habón', 'Placa', 'Quiste', 'Comedón', 'Petequias', 'Púrpura'
  ];

  const secondaryLesions = [
    'Escama', 'Costra', 'Excoriación', 'Fisura', 'Erosión', 'Úlcera',
    'Cicatriz', 'Atrofia', 'Esclerosis', 'Liquenificación', 'Hiperqueratosis'
  ];

  const dermoscopyPatterns = [
    'Patrón reticular', 'Patrón globular', 'Patrón homogéneo', 'Patrón en starburst',
    'Patrón multicomponente', 'Patrón lacunar', 'Patrón cerebriform', 'Sin patrón específico'
  ];

  const dermoscopyColors = [
    'Negro', 'Marrón oscuro', 'Marrón claro', 'Azul', 'Gris', 'Rojo', 'Rosado', 'Blanco'
  ];

  const abcdeCriteria = [
    'Asimetría', 'Bordes irregulares', 'Color heterogéneo', 'Diámetro > 6mm', 'Evolución/cambios'
  ];

  const fitzpatrickTypes = [
    { value: 'I', label: 'Tipo I - Muy clara, nunca broncea, siempre se quema' },
    { value: 'II', label: 'Tipo II - Clara, broncea mínimamente, se quema fácilmente' },
    { value: 'III', label: 'Tipo III - Intermedia, broncea gradualmente, se quema moderadamente' },
    { value: 'IV', label: 'Tipo IV - Oliva, broncea bien, rara vez se quema' },
    { value: 'V', label: 'Tipo V - Oscura, broncea muy bien, muy rara vez se quema' },
    { value: 'VI', label: 'Tipo VI - Muy oscura, nunca se quema' }
  ];

  const diagnosticTests = [
    'Dermatoscopía digital', 'Biopsia punch', 'Biopsia escisional', 'Biopsia por afeitado',
    'Microscopía confocal', 'Tomografía de coherencia óptica', 'Cultivo bacteriano',
    'Cultivo micológico', 'Examen directo KOH', 'Inmunofluorescencia directa'
  ];

  const therapeuticOptions = [
    'Corticoides tópicos', 'Inhibidores de calcineurina', 'Retinoides tópicos',
    'Antimicóticos tópicos', 'Antibióticos tópicos', 'Fototerapia UVB',
    'Criocirugía', 'Cirugía dermatológica', 'Terapia fotodinámica'
  ];

  // Secciones del examen
  const examSections = [
    {
      id: 'symptoms',
      title: 'Síntomas Dermatológicos',
      icon: <Eye className="w-5 h-5 text-pink-500" />,
      description: 'Anamnesis dirigida con principio ZERO-TYPING',
      progress: dermaData.symptoms.cutaneous.length + dermaData.symptoms.systemic.length > 0 ? 100 : 0
    },
    {
      id: 'riskFactors',
      title: 'Factores de Riesgo',
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      description: 'Evaluación de riesgo personal y familiar',
      progress: dermaData.riskFactors.personal.length + dermaData.riskFactors.family.length > 0 ? 100 : 0
    },
    {
      id: 'skinEvaluation',
      title: 'Evaluación Cutánea',
      icon: <Scan className="w-5 h-5 text-blue-500" />,
      description: 'Inspección sistemática de la piel',
      progress: dermaData.skinEvaluation.skinType ? 100 : 0
    },
    {
      id: 'lesions',
      title: 'Caracterización de Lesiones',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      description: 'Descripción morfológica detallada',
      progress: dermaData.skinEvaluation.primaryLesions.length > 0 ? 100 : 0
    },
    {
      id: 'dermoscopy',
      title: 'Dermatoscopía',
      icon: <Microscope className="w-5 h-5 text-green-500" />,
      description: 'Evaluación dermatoscópica avanzada',
      progress: dermaData.dermoscopy.patterns.length > 0 ? 100 : 0
    },
    {
      id: 'abcde',
      title: 'Escala ABCDE',
      icon: <Calculator className="w-5 h-5 text-red-500" />,
      description: 'Evaluación de riesgo de melanoma',
      progress: dermaData.clinicalScores.abcde.criteria.length > 0 ? 100 : 0
    },
    {
      id: 'fitzpatrick',
      title: 'Fototipo Fitzpatrick',
      icon: <Palette className="w-5 h-5 text-yellow-500" />,
      description: 'Clasificación del tipo de piel',
      progress: dermaData.clinicalScores.fitzpatrick.type ? 100 : 0
    },
    {
      id: 'bodyMap',
      title: 'Mapa Corporal',
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      description: 'Distribución anatómica de lesiones',
      progress: Object.values(dermaData.bodyMap).some(area => area.length > 0) ? 100 : 0
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />,
      description: 'Plan integral dermatológico',
      progress: dermaData.management.diagnosticPlan.length > 0 ? 100 : 0
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
    síntomas: dermaData.symptoms.cutaneous.length > 0,
    'factores de riesgo': dermaData.riskFactors.personal.length > 0,
    'evaluación cutánea': dermaData.skinEvaluation.skinType !== '',
    lesiones: dermaData.skinEvaluation.primaryLesions.length > 0,
    dermatoscopía: dermaData.dermoscopy.patterns.length > 0,
    abcde: dermaData.clinicalScores.abcde.criteria.length > 0,
    fitzpatrick: dermaData.clinicalScores.fitzpatrick.type !== '',
    'mapa corporal': Object.values(dermaData.bodyMap).some(area => area.length > 0),
    plan: dermaData.management.diagnosticPlan.length > 0
  };

  const alerts = [
    ...(dermaData.alertCount > 0 ? [{
      id: 'critical',
      type: 'urgent' as const,
      message: `⚠️ ${dermaData.alertCount} alertas críticas dermatológicas`,
      timestamp: new Date()
    }] : []),
    ...(dermaData.warningCount > 0 ? [{
      id: 'warning',
      type: 'warning' as const,
      message: `⚠️ ${dermaData.warningCount} factores de riesgo identificados`,
      timestamp: new Date()
    }] : [])
  ];

  const medicalScales = [
    ...(dermaData.clinicalScores.abcde.riskLevel ? [{
      name: 'ABCDE Melanoma',
      score: dermaData.clinicalScores.abcde.score,
      interpretation: dermaData.clinicalScores.abcde.riskLevel,
      riskLevel: dermaData.clinicalScores.abcde.score >= 3 ? 'high' : 
                 dermaData.clinicalScores.abcde.score >= 2 ? 'intermediate' : 'low',
      recommendations: [dermaData.clinicalScores.abcde.riskLevel]
    }] : []),
    ...(dermaData.clinicalScores.severity.classification ? [{
      name: 'Severidad Cutánea',
      score: dermaData.clinicalScores.severity.score,
      interpretation: dermaData.clinicalScores.severity.classification,
      riskLevel: dermaData.clinicalScores.severity.score >= 10 ? 'high' : 
                 dermaData.clinicalScores.severity.score >= 6 ? 'intermediate' : 'low',
      recommendations: ['Seguimiento dermatológico']
    }] : [])
  ];

  const handleComplete = () => {
    onComplete?.({
      dermaData,
      medicalReport,
      alerts,
      medicalScales,
      progressPercentage: dermaData.examProgress,
      timestamp: new Date(),
      specialty: 'Dermatología'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-800">
      
      {/* 🎯 HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-full border border-pink-500/30">
                <Shield className="h-8 w-8 text-pink-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Dermatología Avanzada</h1>
                <p className="text-white/70">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-pink-500/20 text-pink-200 border border-pink-500/30">
                {dermaData.examProgress}% Completado
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
                            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all"
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
                        
                        {/* 🔍 SÍNTOMAS DERMATOLÓGICOS */}
                        {section.id === 'symptoms' && (
                          <div className="space-y-6">
                            {/* Síntomas Cutáneos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Scan className="w-4 h-4 text-pink-400" />
                                Síntomas Cutáneos
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {cutaneousSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`cutaneous-${symptom}`}
                                      checked={dermaData.symptoms.cutaneous.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.cutaneous', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`cutaneous-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Síntomas Sistémicos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-4 h-4 text-orange-400" />
                                Síntomas Sistémicos
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {systemicSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`systemic-${symptom}`}
                                      checked={dermaData.symptoms.systemic.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.systemic', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`systemic-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Duración y Triggers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white font-medium mb-3 block">Duración de síntomas:</Label>
                                <Select value={dermaData.symptoms.duration} onValueChange={(value) => updateDermaData('symptoms.duration', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar duración" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="agudo">Agudo (&lt; 6 semanas)</SelectItem>
                                    <SelectItem value="subagudo">Subagudo (6-12 semanas)</SelectItem>
                                    <SelectItem value="cronico">Crónico (&gt; 12 semanas)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🚨 FACTORES DE RIESGO */}
                        {section.id === 'riskFactors' && (
                          <div className="space-y-6">
                            {/* Factores Personales */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Factores de Riesgo Personales:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {personalRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`personal-${factor}`}
                                      checked={dermaData.riskFactors.personal.includes(factor)}
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

                            {/* Factores Familiares */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Antecedentes Familiares:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {familyRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`family-${factor}`}
                                      checked={dermaData.riskFactors.family.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('riskFactors.family', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`family-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🔍 EVALUACIÓN CUTÁNEA */}
                        {section.id === 'skinEvaluation' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-medium mb-3 block">Condición General de la Piel:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {['Piel normal', 'Piel seca', 'Piel grasa', 'Piel mixta', 'Piel sensible', 'Piel atópica', 'Fotoenvejecimiento', 'Hiperpigmentación', 'Telangiectasias'].map((condition) => (
                                  <div key={condition} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`condition-${condition}`}
                                      checked={dermaData.skinEvaluation.generalCondition.includes(condition)}
                                      onCheckedChange={(checked) => updateArrayData('skinEvaluation.generalCondition', condition, checked as boolean)}
                                    />
                                    <Label htmlFor={`condition-${condition}`} className="text-white text-sm cursor-pointer">
                                      {condition}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🎯 CARACTERIZACIÓN DE LESIONES */}
                        {section.id === 'lesions' && (
                          <div className="space-y-6">
                            {/* Lesiones Primarias */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Lesiones Primarias:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {primaryLesions.map((lesion) => (
                                  <div key={lesion} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`primary-${lesion}`}
                                      checked={dermaData.skinEvaluation.primaryLesions.includes(lesion)}
                                      onCheckedChange={(checked) => updateArrayData('skinEvaluation.primaryLesions', lesion, checked as boolean)}
                                    />
                                    <Label htmlFor={`primary-${lesion}`} className="text-white text-sm cursor-pointer">
                                      {lesion}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Lesiones Secundarias */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Lesiones Secundarias:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {secondaryLesions.map((lesion) => (
                                  <div key={lesion} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`secondary-${lesion}`}
                                      checked={dermaData.skinEvaluation.secondaryLesions.includes(lesion)}
                                      onCheckedChange={(checked) => updateArrayData('skinEvaluation.secondaryLesions', lesion, checked as boolean)}
                                    />
                                    <Label htmlFor={`secondary-${lesion}`} className="text-white text-sm cursor-pointer">
                                      {lesion}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Morfología */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Características Morfológicas:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Tamaño:</Label>
                                  <Select value={dermaData.skinEvaluation.morphology.size} onValueChange={(value) => updateDermaData('skinEvaluation.morphology.size', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar tamaño" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="<5mm">&lt; 5mm (Pequeña)</SelectItem>
                                      <SelectItem value="5-20mm">5-20mm (Mediana)</SelectItem>
                                      <SelectItem value=">20mm">&gt; 20mm (Grande)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Forma:</Label>
                                  <Select value={dermaData.skinEvaluation.morphology.shape} onValueChange={(value) => updateDermaData('skinEvaluation.morphology.shape', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar forma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="redonda">Redonda</SelectItem>
                                      <SelectItem value="ovalada">Ovalada</SelectItem>
                                      <SelectItem value="irregular">Irregular</SelectItem>
                                      <SelectItem value="lineal">Lineal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Bordes:</Label>
                                  <Select value={dermaData.skinEvaluation.morphology.borders} onValueChange={(value) => updateDermaData('skinEvaluation.morphology.borders', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar bordes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bien-definidos">Bien definidos</SelectItem>
                                      <SelectItem value="mal-definidos">Mal definidos</SelectItem>
                                      <SelectItem value="irregulares">Irregulares</SelectItem>
                                      <SelectItem value="festoneados">Festoneados</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Superficie:</Label>
                                  <Select value={dermaData.skinEvaluation.morphology.surface} onValueChange={(value) => updateDermaData('skinEvaluation.morphology.surface', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar superficie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="lisa">Lisa</SelectItem>
                                      <SelectItem value="rugosa">Rugosa</SelectItem>
                                      <SelectItem value="verrugosa">Verrugosa</SelectItem>
                                      <SelectItem value="ulcerada">Ulcerada</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🔬 DERMATOSCOPÍA */}
                        {section.id === 'dermoscopy' && (
                          <div className="space-y-6">
                            {/* Patrones Dermatoscópicos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Patrones Dermatoscópicos:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {dermoscopyPatterns.map((pattern) => (
                                  <div key={pattern} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`pattern-${pattern}`}
                                      checked={dermaData.dermoscopy.patterns.includes(pattern)}
                                      onCheckedChange={(checked) => updateArrayData('dermoscopy.patterns', pattern, checked as boolean)}
                                    />
                                    <Label htmlFor={`pattern-${pattern}`} className="text-white text-sm cursor-pointer">
                                      {pattern}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Colores Dermatoscópicos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Colores Observados:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {dermoscopyColors.map((color) => (
                                  <div key={color} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`color-${color}`}
                                      checked={dermaData.dermoscopy.colors.includes(color)}
                                      onCheckedChange={(checked) => updateArrayData('dermoscopy.colors', color, checked as boolean)}
                                    />
                                    <Label htmlFor={`color-${color}`} className="text-white text-sm cursor-pointer">
                                      {color}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 📊 ESCALA ABCDE */}
                        {section.id === 'abcde' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">
                                Criterios ABCDE para Melanoma:
                              </Label>
                              <div className="space-y-3">
                                {abcdeCriteria.map((criterion) => (
                                  <div key={criterion} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 border border-white/10">
                                    <Checkbox
                                      id={`abcde-${criterion}`}
                                      checked={dermaData.clinicalScores.abcde.criteria.includes(criterion)}
                                      onCheckedChange={(checked) => updateArrayData('clinicalScores.abcde.criteria', criterion, checked as boolean)}
                                    />
                                    <Label htmlFor={`abcde-${criterion}`} className="text-white cursor-pointer">
                                      {criterion}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resultado ABCDE */}
                            {dermaData.clinicalScores.abcde.score > 0 && (
                              <Alert className={`${dermaData.clinicalScores.abcde.score >= 3 ? 'bg-red-500/20 border-red-400/30' : 
                                dermaData.clinicalScores.abcde.score === 2 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-blue-500/20 border-blue-400/30'}`}>
                                <AlertTriangle className="h-4 w-4 text-white" />
                                <AlertDescription className="text-white">
                                  <strong>Puntuación ABCDE:</strong> {dermaData.clinicalScores.abcde.score}/5
                                  <br />
                                  <strong>Interpretación:</strong> {dermaData.clinicalScores.abcde.riskLevel}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        {/* 🌈 FOTOTIPO FITZPATRICK */}
                        {section.id === 'fitzpatrick' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Clasificación de Fitzpatrick:</Label>
                              <div className="space-y-3">
                                {fitzpatrickTypes.map((type) => (
                                  <div key={type.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 border border-white/10">
                                    <Checkbox
                                      id={`fitzpatrick-${type.value}`}
                                      checked={dermaData.clinicalScores.fitzpatrick.type === type.value}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          updateDermaData('clinicalScores.fitzpatrick.type', type.value);
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`fitzpatrick-${type.value}`} className="text-white cursor-pointer">
                                      {type.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🗺️ MAPA CORPORAL */}
                        {section.id === 'bodyMap' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                { key: 'head', label: 'Cabeza y Cuello', areas: ['Cuero cabelludo', 'Frente', 'Mejillas', 'Nariz', 'Labios', 'Cuello anterior', 'Cuello posterior'] },
                                { key: 'trunk', label: 'Tronco', areas: ['Tórax anterior', 'Tórax posterior', 'Abdomen', 'Espalda', 'Región lumbar'] },
                                { key: 'upperLimbs', label: 'Miembros Superiores', areas: ['Hombros', 'Brazos', 'Antebrazos', 'Manos', 'Dedos'] },
                                { key: 'lowerLimbs', label: 'Miembros Inferiores', areas: ['Muslos', 'Rodillas', 'Piernas', 'Pies', 'Dedos pies'] },
                                { key: 'genitals', label: 'Región Genital', areas: ['Genitales externos', 'Región inguinal', 'Región perianal'] },
                                { key: 'special', label: 'Áreas Especiales', areas: ['Mucosa oral', 'Conjuntivas', 'Lechos ungueales', 'Pliegues'] }
                              ].map((region) => (
                                <div key={region.key} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4">
                                  <h4 className="text-white font-medium mb-3">{region.label}</h4>
                                  <div className="space-y-2">
                                    {region.areas.map((area) => (
                                      <div key={area} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${region.key}-${area}`}
                                          checked={dermaData.bodyMap[region.key as keyof typeof dermaData.bodyMap].includes(area)}
                                          onCheckedChange={(checked) => updateArrayData(`bodyMap.${region.key}`, area, checked as boolean)}
                                        />
                                        <Label htmlFor={`${region.key}-${area}`} className="text-white text-sm cursor-pointer">
                                          {area}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 🏥 PLAN DE MANEJO */}
                        {section.id === 'management' && (
                          <div className="space-y-6">
                            {/* Plan Diagnóstico */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Plan Diagnóstico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {diagnosticTests.map((test) => (
                                  <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`diagnostic-${test}`}
                                      checked={dermaData.management.diagnosticPlan.includes(test)}
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
                                      checked={dermaData.management.therapeuticPlan.includes(therapy)}
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
                        {!['symptoms', 'riskFactors', 'skinEvaluation', 'lesions', 'dermoscopy', 'abcde', 'fitzpatrick', 'bodyMap', 'management'].includes(section.id) && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                              {section.icon}
                            </div>
                            <h4 className="font-medium text-white mb-2">
                              {section.title}
                            </h4>
                            <p className="text-white/70 mb-4">
                              Esta sección está en desarrollo y contendrá formularios médicos específicos para la evaluación dermatológica completa.
                            </p>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-pink-500/20 text-pink-300">
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
            progressPercentage={dermaData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Dermatología"
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
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-700 dark:to-purple-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-pink-600" />
                Informe Dermatológico
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
                {medicalReport || 'Seleccione los parámetros del examen dermatológico para generar el informe en tiempo real...'}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && dermaData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({dermaData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}