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
  Zap, 
  Target,
  AlertTriangle,
  Activity,
  Thermometer,
  TrendingUp,
  Calculator,
  Eye,
  FileText,
  Copy,
  Download,
  FlaskConical,
  Scale,
  Heart,
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
  CheckCircle2
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

// 🎯 FRAMEWORK UNIVERSAL - TIPOS DE DATOS ENDOCRINOLÓGICOS
interface EndocrinologyData {
  // 📊 DASHBOARD MÉDICO ESTÁNDAR
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // 📋 ANAMNESIS ENDOCRINOLÓGICA (ZERO-TYPING)
  symptoms: {
    metabolic: string[];
    thyroid: string[];
    reproductive: string[];
    adrenal: string[];
    growth: string[];
  };

  riskFactors: {
    diabetes: string[];
    thyroid: string[];
    hormonal: string[];
    metabolic: string[];
  };

  // 📏 ANTROPOMETRÍA CON CÁLCULOS AUTOMÁTICOS
  anthropometry: {
    height: number;
    weight: number;
    waistCircumference: number;
    bmi: number;
    bmiCategory: string;
  };

  vitalSigns: {
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    temperature: number;
  };

  // 🔬 EVALUACIÓN TIROIDEA SISTEMÁTICA
  thyroidEvaluation: {
    palpation: {
      size: string;
      consistency: string;
      nodules: boolean;
      tenderness: boolean;
    };
    functionalSigns: string[];
  };

  // 🍯 EVALUACIÓN DIABÉTICA COMPLETA
  diabeticEvaluation: {
    riskFactors: string[];
    symptoms: string[];
    glycemicControl: {
      fastingGlucose: number;
      hba1c: number;
    };
    homaCalculation: {
      insulin: number;
      glucose: number;
      result: number;
      interpretation: string;
    };
  };

  // 🧬 SÍNDROME METABÓLICO
  metabolicSyndrome: {
    criteria: string[];
    score: number;
    classification: string;
  };

  // 📊 ESCALAS AUTOMÁTICAS
  clinicalScores: {
    findrisk: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    thyroidRisk: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
  };

  // 🏥 PLAN INTEGRAL
  management: {
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    lifestyle: string[];
  };
}

export default function EndocrinologyDemo({ patientData, onComplete }: any) {
  
  // 🎯 ESTADO PRINCIPAL FRAMEWORK UNIVERSAL
  const [endoData, setEndoData] = useState<EndocrinologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 8,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
    symptoms: {
      metabolic: [],
      thyroid: [],
      reproductive: [],
      adrenal: [],
      growth: []
    },
    riskFactors: {
      diabetes: [],
      thyroid: [],
      hormonal: [],
      metabolic: []
    },
    anthropometry: {
      height: 0,
      weight: 0,
      waistCircumference: 0,
      bmi: 0,
      bmiCategory: ''
    },
    vitalSigns: {
      systolicBP: 0,
      diastolicBP: 0,
      heartRate: 0,
      temperature: 0
    },
    thyroidEvaluation: {
      palpation: {
        size: '',
        consistency: '',
        nodules: false,
        tenderness: false
      },
      functionalSigns: []
    },
    diabeticEvaluation: {
      riskFactors: [],
      symptoms: [],
      glycemicControl: {
        fastingGlucose: 0,
        hba1c: 0
      },
      homaCalculation: {
        insulin: 0,
        glucose: 0,
        result: 0,
        interpretation: ''
      }
    },
    metabolicSyndrome: {
      criteria: [],
      score: 0,
      classification: ''
    },
    clinicalScores: {
      findrisk: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      thyroidRisk: {
        factors: [],
        score: 0,
        riskLevel: ''
      }
    },
    management: {
      diagnosticPlan: [],
      therapeuticPlan: [],
      lifestyle: []
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['symptoms']);
  const [showSplitView, setShowSplitView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 🛠️ FUNCIONES AUXILIARES UNIVERSALES
  const updateEndoData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setEndoData(prev => {
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
    setEndoData(prev => {
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
  const calculateBMI = useCallback(() => {
    const { height, weight } = endoData.anthropometry;
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let category = '';
      
      if (bmi < 18.5) category = 'Bajo peso';
      else if (bmi < 25) category = 'Normal';
      else if (bmi < 30) category = 'Sobrepeso';
      else if (bmi < 35) category = 'Obesidad I';
      else if (bmi < 40) category = 'Obesidad II';
      else category = 'Obesidad III';

      updateEndoData('anthropometry.bmi', Math.round(bmi * 10) / 10);
      updateEndoData('anthropometry.bmiCategory', category);
    }
  }, [endoData.anthropometry]);

  const calculateHomaIR = useCallback(() => {
    const { insulin, glucose } = endoData.diabeticEvaluation.homaCalculation;
    if (insulin > 0 && glucose > 0) {
      const homaIR = (insulin * glucose) / 22.5;
      let interpretation = '';
      
      if (homaIR < 2.5) interpretation = 'Sensibilidad normal';
      else if (homaIR < 3.8) interpretation = 'Resistencia leve';
      else interpretation = 'Resistencia significativa';

      updateEndoData('diabeticEvaluation.homaCalculation.result', Math.round(homaIR * 100) / 100);
      updateEndoData('diabeticEvaluation.homaCalculation.interpretation', interpretation);
    }
  }, [endoData.diabeticEvaluation.homaCalculation]);

  // 🚨 SISTEMA DE ALERTAS UNIVERSAL
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: typeof endoData.urgencyLevel = 'Normal';

    // FINDRISK Score
    const findriskFactors = endoData.clinicalScores.findrisk.factors;
    let findriskScore = findriskFactors.length * 2;
    let findriskLevel = '';
    
    if (findriskScore >= 10) {
      findriskLevel = 'Muy alto riesgo';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (findriskScore >= 7) {
      findriskLevel = 'Alto riesgo';
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    } else if (findriskScore >= 4) {
      findriskLevel = 'Riesgo moderado';
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    } else if (findriskScore > 0) {
      findriskLevel = 'Bajo riesgo';
      findingCount++;
    }

    // Riesgo Tiroideo
    const thyroidFactors = endoData.clinicalScores.thyroidRisk.factors;
    const thyroidScore = thyroidFactors.length;
    let thyroidRisk = '';
    
    if (thyroidScore >= 4) {
      thyroidRisk = 'Alto riesgo disfunción';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (thyroidScore >= 2) {
      thyroidRisk = 'Riesgo moderado';
      warningCount++;
    } else if (thyroidScore > 0) {
      thyroidRisk = 'Evaluación rutinaria';
      findingCount++;
    }

    // Síndrome Metabólico
    const metabolicCriteria = endoData.metabolicSyndrome.criteria.length;
    let metabolicClassification = '';
    
    if (metabolicCriteria >= 3) {
      metabolicClassification = 'Síndrome metabólico';
      alertCount++;
      urgencyLevel = 'Prioritario';
    } else if (metabolicCriteria === 2) {
      metabolicClassification = 'Pre-síndrome metabólico';
      warningCount++;
    } else if (metabolicCriteria === 1) {
      metabolicClassification = 'Factor de riesgo aislado';
      findingCount++;
    }

    // Alertas por Glucemia
    const { fastingGlucose, hba1c } = endoData.diabeticEvaluation.glycemicControl;
    if (fastingGlucose >= 126 || hba1c >= 6.5) {
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (fastingGlucose >= 100 || hba1c >= 5.7) {
      warningCount++;
    }

    // Calcular progreso
    let sectionsCompleted = 0;
    if (endoData.symptoms.metabolic.length > 0) sectionsCompleted++;
    if (endoData.anthropometry.bmi > 0) sectionsCompleted++;
    if (endoData.vitalSigns.systolicBP > 0) sectionsCompleted++;
    if (endoData.thyroidEvaluation.palpation.size) sectionsCompleted++;
    if (endoData.diabeticEvaluation.riskFactors.length > 0) sectionsCompleted++;
    if (endoData.metabolicSyndrome.criteria.length > 0) sectionsCompleted++;
    if (endoData.clinicalScores.findrisk.factors.length > 0) sectionsCompleted++;
    if (endoData.management.diagnosticPlan.length > 0) sectionsCompleted++;

    const progress = Math.round((sectionsCompleted / endoData.totalSections) * 100);

    // Actualizar estados
    setEndoData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urgencyLevel,
      examProgress: progress,
      sectionsCompleted,
      clinicalScores: {
        ...prev.clinicalScores,
        findrisk: { ...prev.clinicalScores.findrisk, score: findriskScore, riskLevel: findriskLevel },
        thyroidRisk: { ...prev.clinicalScores.thyroidRisk, score: thyroidScore, riskLevel: thyroidRisk }
      },
      metabolicSyndrome: {
        ...prev.metabolicSyndrome,
        score: metabolicCriteria,
        classification: metabolicClassification
      }
    }));
  }, [endoData]);

  // 📄 GENERACIÓN AUTOMÁTICA DE REPORTE
  const generateMedicalReport = useCallback(() => {
    let report = 'REPORTE ENDOCRINOLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    report += `Fecha: ${new Date().toLocaleDateString()}\n`;
    report += `Urgencia: ${endoData.urgencyLevel}\n`;
    report += `Progreso: ${endoData.examProgress}%\n\n`;

    // Antropometría
    if (endoData.anthropometry.bmi > 0) {
      report += 'ANTROPOMETRÍA:\n';
      report += `• IMC: ${endoData.anthropometry.bmi} kg/m² (${endoData.anthropometry.bmiCategory})\n`;
      report += `• Peso: ${endoData.anthropometry.weight} kg\n`;
      report += `• Talla: ${endoData.anthropometry.height} cm\n\n`;
    }

    // Síntomas
    const allSymptoms = [
      ...endoData.symptoms.metabolic,
      ...endoData.symptoms.thyroid,
      ...endoData.symptoms.reproductive,
      ...endoData.symptoms.adrenal
    ];
    
    if (allSymptoms.length > 0) {
      report += 'SÍNTOMAS ENDOCRINOLÓGICOS:\n';
      allSymptoms.forEach(symptom => report += `• ${symptom}\n`);
      report += '\n';
    }

    // Scores de riesgo
    if (endoData.clinicalScores.findrisk.riskLevel) {
      report += 'ESCALAS DE RIESGO:\n';
      report += `• FINDRISK: ${endoData.clinicalScores.findrisk.score} puntos - ${endoData.clinicalScores.findrisk.riskLevel}\n`;
    }
    if (endoData.clinicalScores.thyroidRisk.riskLevel) {
      report += `• Riesgo tiroideo: ${endoData.clinicalScores.thyroidRisk.riskLevel}\n`;
    }
    if (endoData.metabolicSyndrome.classification) {
      report += `• Síndrome metabólico: ${endoData.metabolicSyndrome.classification}\n`;
    }
    report += '\n';

    // Plan
    if (endoData.management.diagnosticPlan.length > 0) {
      report += 'PLAN DIAGNÓSTICO:\n';
      endoData.management.diagnosticPlan.forEach(plan => report += `• ${plan}\n`);
      report += '\n';
    }

    setMedicalReport(report);
  }, [endoData]);

  // 🔄 EFECTOS AUTOMÁTICOS
  useEffect(() => {
    calculateBMI();
  }, [endoData.anthropometry.height, endoData.anthropometry.weight]);

  useEffect(() => {
    calculateHomaIR();
  }, [endoData.diabeticEvaluation.homaCalculation.insulin, endoData.diabeticEvaluation.homaCalculation.glucose]);

  useEffect(() => {
    calculateRiskScores();
  }, [endoData.clinicalScores, endoData.metabolicSyndrome.criteria, endoData.diabeticEvaluation.glycemicControl]);

  useEffect(() => {
    generateMedicalReport();
  }, [endoData]);

  // 📋 DATOS MÉDICOS (PRINCIPIO ZERO-TYPING)
  const metabolicSymptoms = [
    'Fatiga crónica', 'Sed excesiva', 'Micción frecuente', 
    'Pérdida de peso involuntaria', 'Aumento del apetito', 'Visión borrosa',
    'Cicatrización lenta', 'Infecciones recurrentes', 'Hormigueo en extremidades'
  ];

  const thyroidSymptoms = [
    'Intolerancia al frío', 'Intolerancia al calor', 'Palpitaciones',
    'Nerviosismo/ansiedad', 'Caída del cabello', 'Sequedad de piel',
    'Estreñimiento', 'Diarrea', 'Cambios menstruales', 'Temblor'
  ];

  const diabeticRiskFactors = [
    'Edad ≥ 45 años', 'IMC ≥ 25 kg/m²', 'Antecedente familiar diabetes',
    'Hipertensión arterial', 'HDL < 35 mg/dL', 'Triglicéridos > 250 mg/dL',
    'Diabetes gestacional', 'Sedentarismo', 'Acantosis nigricans'
  ];

  const thyroidRiskFactors = [
    'Antecedente familiar tiroideo', 'Sexo femenino', 'Edad > 60 años',
    'Embarazo reciente', 'Enfermedad autoinmune', 'Radiación cuello',
    'Bocio previo', 'Nódulos tiroideos', 'Medicamentos (amiodarona, litio)'
  ];

  const metabolicCriteria = [
    'Circunferencia abdominal ≥ 80 cm (F) / 90 cm (M)',
    'Triglicéridos ≥ 150 mg/dL',
    'HDL < 50 mg/dL (F) / 40 mg/dL (M)',
    'Presión arterial ≥ 130/85 mmHg',
    'Glucosa en ayunas ≥ 100 mg/dL'
  ];

  const diagnosticTests = [
    'Glucosa en ayunas', 'HbA1c', 'TSH', 'T4 libre', 'Insulina basal',
    'Perfil lipídico', 'Cortisol matutino', 'Prolactina', 'Ecografía tiroidea'
  ];

  const therapeuticOptions = [
    'Metformina', 'Levotiroxina', 'Modificación estilo de vida',
    'Estatinas', 'Inhibidores ECA', 'Pérdida de peso'
  ];

  // Secciones del examen
  const examSections = [
    {
      id: 'symptoms',
      title: 'Síntomas Endocrinológicos',
      icon: <Eye className="w-5 h-5 text-yellow-500" />,
      description: 'Anamnesis dirigida con principio ZERO-TYPING',
      progress: endoData.symptoms.metabolic.length + endoData.symptoms.thyroid.length > 0 ? 100 : 0
    },
    {
      id: 'anthropometry',
      title: 'Antropometría',
      icon: <Scale className="w-5 h-5 text-blue-500" />,
      description: 'Mediciones con cálculos automáticos',
      progress: endoData.anthropometry.bmi > 0 ? 100 : 0
    },
    {
      id: 'vitals',
      title: 'Signos Vitales',
      icon: <Activity className="w-5 h-5 text-red-500" />,
      description: 'Monitoreo vital con alertas',
      progress: endoData.vitalSigns.systolicBP > 0 ? 100 : 0
    },
    {
      id: 'thyroid',
      title: 'Evaluación Tiroidea',
      icon: <Thermometer className="w-5 h-5 text-purple-500" />,
      description: 'Palpación y factores de riesgo',
      progress: endoData.thyroidEvaluation.palpation.size ? 100 : 0
    },
    {
      id: 'diabetes',
      title: 'Evaluación Diabética',
      icon: <FlaskConical className="w-5 h-5 text-green-500" />,
      description: 'FINDRISK y HOMA-IR automáticos',
      progress: endoData.diabeticEvaluation.riskFactors.length > 0 ? 100 : 0
    },
    {
      id: 'metabolic',
      title: 'Síndrome Metabólico',
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      description: 'Criterios ATP III automáticos',
      progress: endoData.metabolicSyndrome.criteria.length > 0 ? 100 : 0
    },
    {
      id: 'scores',
      title: 'Escalas de Riesgo',
      icon: <Calculator className="w-5 h-5 text-indigo-500" />,
      description: 'Scores automáticos y alertas',
      progress: endoData.clinicalScores.findrisk.factors.length > 0 ? 100 : 0
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />,
      description: 'Plan integral personalizado',
      progress: endoData.management.diagnosticPlan.length > 0 ? 100 : 0
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
    síntomas: endoData.symptoms.metabolic.length + endoData.symptoms.thyroid.length > 0,
    antropometría: endoData.anthropometry.bmi > 0,
    signos: endoData.vitalSigns.systolicBP > 0,
    tiroides: endoData.thyroidEvaluation.palpation.size !== '',
    diabetes: endoData.diabeticEvaluation.riskFactors.length > 0,
    metabólico: endoData.metabolicSyndrome.criteria.length > 0,
    scores: endoData.clinicalScores.findrisk.factors.length > 0,
    plan: endoData.management.diagnosticPlan.length > 0
  };

  const alerts = [
    ...(endoData.alertCount > 0 ? [{
      id: 'critical',
      type: 'urgent' as const,
      message: `⚠️ ${endoData.alertCount} alertas críticas detectadas`,
      timestamp: new Date()
    }] : []),
    ...(endoData.warningCount > 0 ? [{
      id: 'warning',
      type: 'warning' as const,
      message: `⚠️ ${endoData.warningCount} factores de riesgo identificados`,
      timestamp: new Date()
    }] : [])
  ];

  const medicalScales = [
    ...(endoData.clinicalScores.findrisk.riskLevel ? [{
      name: 'FINDRISK',
      score: endoData.clinicalScores.findrisk.score,
      interpretation: endoData.clinicalScores.findrisk.riskLevel,
      riskLevel: endoData.clinicalScores.findrisk.score >= 10 ? 'high' : 
                 endoData.clinicalScores.findrisk.score >= 7 ? 'intermediate' : 'low',
      recommendations: [endoData.clinicalScores.findrisk.riskLevel]
    }] : []),
    ...(endoData.metabolicSyndrome.classification ? [{
      name: 'Síndrome Metabólico',
      score: endoData.metabolicSyndrome.score,
      interpretation: endoData.metabolicSyndrome.classification,
      riskLevel: endoData.metabolicSyndrome.score >= 3 ? 'high' : 
                 endoData.metabolicSyndrome.score >= 2 ? 'intermediate' : 'low',
      recommendations: ['Evaluación cardiovascular']
    }] : [])
  ];

  const handleComplete = () => {
    onComplete?.({
      endoData,
      medicalReport,
      alerts,
      medicalScales,
      progressPercentage: endoData.examProgress,
      timestamp: new Date(),
      specialty: 'Endocrinología'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800">
      
      {/* 🎯 HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Zap className="h-8 w-8 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Endocrinología</h1>
                <p className="text-white/70">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-500/20 text-yellow-200 border border-yellow-500/30">
                {endoData.examProgress}% Completado
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
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
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
                        
                        {/* 🔍 SÍNTOMAS (ZERO-TYPING) */}
                        {section.id === 'symptoms' && (
                          <div className="space-y-6">
                            {/* Síntomas Metabólicos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                Síntomas Metabólicos
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {metabolicSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`metabolic-${symptom}`}
                                      checked={endoData.symptoms.metabolic.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.metabolic', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`metabolic-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Síntomas Tiroideos */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-orange-400" />
                                Síntomas Tiroideos
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {thyroidSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`thyroid-${symptom}`}
                                      checked={endoData.symptoms.thyroid.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.thyroid', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`thyroid-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 📏 ANTROPOMETRÍA */}
                        {section.id === 'anthropometry' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-white">Talla (cm)</Label>
                                <Input
                                  type="number"
                                  value={endoData.anthropometry.height || ''}
                                  onChange={(e) => updateEndoData('anthropometry.height', parseFloat(e.target.value) || 0)}
                                  placeholder="170"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Peso (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={endoData.anthropometry.weight || ''}
                                  onChange={(e) => updateEndoData('anthropometry.weight', parseFloat(e.target.value) || 0)}
                                  placeholder="70.0"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Cintura (cm)</Label>
                                <Input
                                  type="number"
                                  value={endoData.anthropometry.waistCircumference || ''}
                                  onChange={(e) => updateEndoData('anthropometry.waistCircumference', parseFloat(e.target.value) || 0)}
                                  placeholder="85"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>

                            {/* Resultado Automático */}
                            {endoData.anthropometry.bmi > 0 && (
                              <Alert className="bg-blue-500/20 border-blue-400/30">
                                <Calculator className="h-4 w-4 text-blue-300" />
                                <AlertDescription className="text-white">
                                  <strong>Cálculo Automático:</strong> IMC = {endoData.anthropometry.bmi} kg/m² 
                                  ({endoData.anthropometry.bmiCategory})
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        {/* 🩺 SIGNOS VITALES */}
                        {section.id === 'vitals' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">TA Sistólica (mmHg)</Label>
                                <Input
                                  type="number"
                                  value={endoData.vitalSigns.systolicBP || ''}
                                  onChange={(e) => updateEndoData('vitalSigns.systolicBP', parseFloat(e.target.value) || 0)}
                                  placeholder="120"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">TA Diastólica (mmHg)</Label>
                                <Input
                                  type="number"
                                  value={endoData.vitalSigns.diastolicBP || ''}
                                  onChange={(e) => updateEndoData('vitalSigns.diastolicBP', parseFloat(e.target.value) || 0)}
                                  placeholder="80"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">FC (lpm)</Label>
                                <Input
                                  type="number"
                                  value={endoData.vitalSigns.heartRate || ''}
                                  onChange={(e) => updateEndoData('vitalSigns.heartRate', parseFloat(e.target.value) || 0)}
                                  placeholder="72"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Temperatura (°C)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={endoData.vitalSigns.temperature || ''}
                                  onChange={(e) => updateEndoData('vitalSigns.temperature', parseFloat(e.target.value) || 0)}
                                  placeholder="36.5"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🦋 EVALUACIÓN TIROIDEA */}
                        {section.id === 'thyroid' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-white font-medium mb-3 block">Tamaño Tiroideo:</Label>
                                <Select value={endoData.thyroidEvaluation.palpation.size} onValueChange={(value) => updateEndoData('thyroidEvaluation.palpation.size', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar tamaño" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="aumentado-grado1">Aumentado Grado I</SelectItem>
                                    <SelectItem value="aumentado-grado2">Aumentado Grado II</SelectItem>
                                    <SelectItem value="bocio-multinodular">Bocio Multinodular</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-white font-medium mb-3 block">Consistencia:</Label>
                                <Select value={endoData.thyroidEvaluation.palpation.consistency} onValueChange={(value) => updateEndoData('thyroidEvaluation.palpation.consistency', value)}>
                                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar consistencia" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="blanda">Blanda</SelectItem>
                                    <SelectItem value="firme">Firme</SelectItem>
                                    <SelectItem value="dura">Dura</SelectItem>
                                    <SelectItem value="nodular">Nodular</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Factores de Riesgo Tiroideo */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Factores de Riesgo Tiroideo:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {thyroidRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`thyroid-risk-${factor}`}
                                      checked={endoData.clinicalScores.thyroidRisk.factors.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('clinicalScores.thyroidRisk.factors', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`thyroid-risk-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🍯 EVALUACIÓN DIABÉTICA */}
                        {section.id === 'diabetes' && (
                          <div className="space-y-6">
                            {/* Factores de Riesgo FINDRISK */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Factores de Riesgo FINDRISK:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {diabeticRiskFactors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`findrisk-${factor}`}
                                      checked={endoData.clinicalScores.findrisk.factors.includes(factor)}
                                      onCheckedChange={(checked) => updateArrayData('clinicalScores.findrisk.factors', factor, checked as boolean)}
                                    />
                                    <Label htmlFor={`findrisk-${factor}`} className="text-white text-sm cursor-pointer">
                                      {factor}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Control Glucémico */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Control Glucémico:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Glucosa en ayunas (mg/dL)</Label>
                                  <Input
                                    type="number"
                                    value={endoData.diabeticEvaluation.glycemicControl.fastingGlucose || ''}
                                    onChange={(e) => updateEndoData('diabeticEvaluation.glycemicControl.fastingGlucose', parseFloat(e.target.value) || 0)}
                                    placeholder="100"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">HbA1c (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={endoData.diabeticEvaluation.glycemicControl.hba1c || ''}
                                    onChange={(e) => updateEndoData('diabeticEvaluation.glycemicControl.hba1c', parseFloat(e.target.value) || 0)}
                                    placeholder="5.5"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Cálculo HOMA-IR */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">Cálculo HOMA-IR:</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Insulina basal (μU/mL)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={endoData.diabeticEvaluation.homaCalculation.insulin || ''}
                                    onChange={(e) => updateEndoData('diabeticEvaluation.homaCalculation.insulin', parseFloat(e.target.value) || 0)}
                                    placeholder="10"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Glucosa HOMA (mg/dL)</Label>
                                  <Input
                                    type="number"
                                    value={endoData.diabeticEvaluation.homaCalculation.glucose || ''}
                                    onChange={(e) => updateEndoData('diabeticEvaluation.homaCalculation.glucose', parseFloat(e.target.value) || 0)}
                                    placeholder="90"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                </div>
                              </div>
                              
                              {/* Resultado HOMA-IR */}
                              {endoData.diabeticEvaluation.homaCalculation.result > 0 && (
                                <Alert className="bg-green-500/20 border-green-400/30 mt-4">
                                  <Calculator className="h-4 w-4 text-green-300" />
                                  <AlertDescription className="text-white">
                                    <strong>HOMA-IR:</strong> {endoData.diabeticEvaluation.homaCalculation.result} 
                                    ({endoData.diabeticEvaluation.homaCalculation.interpretation})
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 🧬 SÍNDROME METABÓLICO */}
                        {section.id === 'metabolic' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block">
                                Criterios Diagnósticos (≥3 para diagnóstico):
                              </Label>
                              <div className="space-y-3">
                                {metabolicCriteria.map((criterion) => (
                                  <div key={criterion} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 border border-white/10">
                                    <Checkbox
                                      id={`metabolic-${criterion}`}
                                      checked={endoData.metabolicSyndrome.criteria.includes(criterion)}
                                      onCheckedChange={(checked) => updateArrayData('metabolicSyndrome.criteria', criterion, checked as boolean)}
                                    />
                                    <Label htmlFor={`metabolic-${criterion}`} className="text-white cursor-pointer">
                                      {criterion}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resultado Síndrome Metabólico */}
                            {endoData.metabolicSyndrome.score > 0 && (
                              <Alert className={`${endoData.metabolicSyndrome.score >= 3 ? 'bg-red-500/20 border-red-400/30' : 
                                endoData.metabolicSyndrome.score === 2 ? 'bg-yellow-500/20 border-yellow-400/30' : 'bg-blue-500/20 border-blue-400/30'}`}>
                                <AlertTriangle className="h-4 w-4 text-white" />
                                <AlertDescription className="text-white">
                                  <strong>Criterios presentes:</strong> {endoData.metabolicSyndrome.score}/5
                                  <br />
                                  <strong>Diagnóstico:</strong> {endoData.metabolicSyndrome.classification}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        {/* 📊 SCORES Y ESCALAS */}
                        {section.id === 'scores' && (
                          <div className="space-y-6">
                            {/* Resumen de Scores */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">FINDRISK</h3>
                                <p className="text-2xl font-bold">{endoData.clinicalScores.findrisk.score}</p>
                                <p className="text-sm opacity-90">{endoData.clinicalScores.findrisk.riskLevel || 'Sin evaluar'}</p>
                              </div>
                              
                              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">Riesgo Tiroideo</h3>
                                <p className="text-2xl font-bold">{endoData.clinicalScores.thyroidRisk.score}</p>
                                <p className="text-sm opacity-90">{endoData.clinicalScores.thyroidRisk.riskLevel || 'Sin evaluar'}</p>
                              </div>
                              
                              <div className="bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl p-4 text-white">
                                <h3 className="font-semibold">Síndrome Metabólico</h3>
                                <p className="text-2xl font-bold">{endoData.metabolicSyndrome.score}/5</p>
                                <p className="text-sm opacity-90">{endoData.metabolicSyndrome.classification || 'Sin evaluar'}</p>
                              </div>
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
                                      checked={endoData.management.diagnosticPlan.includes(test)}
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
                                      checked={endoData.management.therapeuticPlan.includes(therapy)}
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
                        {!['symptoms', 'anthropometry', 'vitals', 'thyroid', 'diabetes', 'metabolic', 'scores', 'management'].includes(section.id) && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                              {section.icon}
                            </div>
                            <h4 className="font-medium text-white mb-2">
                              {section.title}
                            </h4>
                            <p className="text-white/70 mb-4">
                              Esta sección está en desarrollo y contendrá formularios médicos específicos para la evaluación endocrinológica completa.
                            </p>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-300">
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
            medicalScales={medicalScales.map(scale => ({
              ...scale,
              riskLevel: scale.riskLevel as "critical" | "high" | "intermediate" | "low"
            }))}
            progressPercentage={endoData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Endocrinología"
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
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-700 dark:to-orange-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-yellow-600" />
                Informe Endocrinológico
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
                {medicalReport || 'Seleccione los parámetros del examen endocrinológico para generar el informe en tiempo real...'}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && endoData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({endoData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}