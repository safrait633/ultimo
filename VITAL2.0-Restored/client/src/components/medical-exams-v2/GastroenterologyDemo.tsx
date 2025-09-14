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
  CheckCircle2,
  Printer,
  Stethoscope
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";


// FRAMEWORK UNIVERSAL - TIPOS DE DATOS GASTROENTEROLÓGICOS
interface GastroenterologyData {
  // DASHBOARD MÉDICO ESTÁNDAR
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // ANAMNESIS GASTROENTEROLÓGICA (ZERO-TYPING)
  symptoms: {
    abdominal: string[];
    digestive: string[];
    bowel: string[];
    hepatic: string[];
    bleeding: string[];
  };

  riskFactors: {
    peptic: string[];
    hepatic: string[];
    inflammatory: string[];
    neoplastic: string[];
  };

  // ANTROPOMETRÍA CON CÁLCULOS AUTOMÁTICOS
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

  // EVALUACIÓN ABDOMINAL SISTEMÁTICA
  abdominalEvaluation: {
    inspection: {
      shape: string;
      symmetry: string;
      masses: boolean;
      distension: boolean;
    };
    auscultation: {
      bowelSounds: string;
      bruits: boolean;
    };
    percussion: {
      hepaticSpan: number;
      ascites: boolean;
    };
    palpation: {
      tenderness: string;
      masses: boolean;
      organomegaly: string;
    };
  };

  // EVALUACIÓN DIGESTIVA COMPLETA
  digestiveEvaluation: {
    upperGI: {
      dyspepsia: string[];
      reflux: string[];
      bleeding: string[];
    };
    lowerGI: {
      bowelHabits: string;
      bleeding: boolean;
      pain: string[];
    };
    hepatobiliary: {
      jaundice: boolean;
      pain: boolean;
      murphy: boolean;
    };
  };

  // ESCALAS AUTOMÁTICAS
  clinicalScores: {
    glasgowBlatchford: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    rockall: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    childPugh: {
      factors: string[];
      score: number;
      class: string;
      bilirubin: number;
      albumin: number;
      inr: number;
      ascites: string;
      encephalopathy: string;
    };
  };

  // PLAN INTEGRAL
  management: {
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    lifestyle: string[];
  };
}

export default function GastroenterologyDemo({ patientData, onComplete }: any) {
  
  // ESTADO PRINCIPAL FRAMEWORK UNIVERSAL
  const [gastroData, setGastroData] = useState<GastroenterologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 8,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
    symptoms: {
      abdominal: [],
      digestive: [],
      bowel: [],
      hepatic: [],
      bleeding: []
    },
    riskFactors: {
      peptic: [],
      hepatic: [],
      inflammatory: [],
      neoplastic: []
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
    abdominalEvaluation: {
      inspection: {
        shape: '',
        symmetry: '',
        masses: false,
        distension: false
      },
      auscultation: {
        bowelSounds: '',
        bruits: false
      },
      percussion: {
        hepaticSpan: 0,
        ascites: false
      },
      palpation: {
        tenderness: '',
        masses: false,
        organomegaly: ''
      }
    },
    digestiveEvaluation: {
      upperGI: {
        dyspepsia: [],
        reflux: [],
        bleeding: []
      },
      lowerGI: {
        bowelHabits: '',
        bleeding: false,
        pain: []
      },
      hepatobiliary: {
        jaundice: false,
        pain: false,
        murphy: false
      }
    },
    clinicalScores: {
      glasgowBlatchford: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      rockall: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      childPugh: {
        factors: [],
        score: 0,
        class: '',
        bilirubin: 0,
        albumin: 0,
        inr: 0,
        ascites: '',
        encephalopathy: ''
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

  // FUNCIONES AUXILIARES UNIVERSALES
  const updateGastroData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setGastroData(prev => {
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
    setGastroData(prev => {
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

  // AUTOMATIZACIONES CLÍNICAS UNIVERSALES
  const calculateBMI = useCallback(() => {
    const { height, weight } = gastroData.anthropometry;
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

      updateGastroData('anthropometry.bmi', Math.round(bmi * 10) / 10);
      updateGastroData('anthropometry.bmiCategory', category);
    }
  }, [gastroData.anthropometry]);

  // 🚨 SISTEMA DE ALERTAS UNIVERSAL
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: typeof gastroData.urgencyLevel = 'Normal';

    // Glasgow-Blatchford Score
    const gbFactors = gastroData.clinicalScores.glasgowBlatchford.factors;
    let gbScore = gbFactors.length * 2;
    let gbLevel = '';
    
    if (gbScore >= 12) {
      gbLevel = 'Muy alto riesgo - Intervención inmediata';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (gbScore >= 6) {
      gbLevel = 'Alto riesgo - Hospitalización';
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    } else if (gbScore >= 3) {
      gbLevel = 'Riesgo moderado - Observación';
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    } else if (gbScore > 0) {
      gbLevel = 'Bajo riesgo - Manejo ambulatorio';
      findingCount++;
    }

    // Rockall Score
    const rockallFactors = gastroData.clinicalScores.rockall.factors;
    let rockallScore = rockallFactors.length * 1.5;
    let rockallRisk = '';
    
    if (rockallScore >= 8) {
      rockallRisk = 'Mortalidad muy alta (>40%)';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (rockallScore >= 5) {
      rockallRisk = 'Mortalidad alta (10-40%)';
      warningCount++;
      if (urgencyLevel !== 'Crítico') urgencyLevel = 'Prioritario';
    } else if (rockallScore >= 3) {
      rockallRisk = 'Mortalidad moderada (5-10%)';
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    } else if (rockallScore > 0) {
      rockallRisk = 'Mortalidad baja (<5%)';
      findingCount++;
    }

    // Child-Pugh Score (Cálculo mejorado)
    const { bilirubin, albumin, inr, ascites, encephalopathy } = gastroData.clinicalScores.childPugh;
    let childScore = 0;
    let childClass = '';
    
    // Bilirrubina
    if (bilirubin < 2) childScore += 1;
    else if (bilirubin <= 3) childScore += 2;
    else childScore += 3;
    
    // Albúmina
    if (albumin > 3.5) childScore += 1;
    else if (albumin >= 2.8) childScore += 2;
    else childScore += 3;
    
    // INR
    if (inr < 1.7) childScore += 1;
    else if (inr <= 2.3) childScore += 2;
    else childScore += 3;
    
    // Ascitis
    if (ascites === 'ausente') childScore += 1;
    else if (ascites === 'leve') childScore += 2;
    else if (ascites === 'moderada') childScore += 3;
    
    // Encefalopatía
    if (encephalopathy === 'ausente') childScore += 1;
    else if (encephalopathy === 'grado1-2') childScore += 2;
    else if (encephalopathy === 'grado3-4') childScore += 3;
    
    if (childScore >= 10) {
      childClass = 'Clase C - Cirrosis descompensada';
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (childScore >= 7) {
      childClass = 'Clase B - Cirrosis moderada';
      warningCount++;
      if (urgencyLevel !== 'Crítico') urgencyLevel = 'Prioritario';
    } else if (childScore >= 5) {
      childClass = 'Clase A - Cirrosis compensada';
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }

    // Alertas por factores de riesgo
    const totalRiskFactors = [
      ...gastroData.riskFactors.peptic,
      ...gastroData.riskFactors.hepatic,
      ...gastroData.riskFactors.inflammatory,
      ...gastroData.riskFactors.neoplastic
    ].length;
    
    if (totalRiskFactors >= 5) {
      alertCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    } else if (totalRiskFactors >= 3) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    } else if (totalRiskFactors > 0) {
      findingCount++;
    }

    // Alertas por síntomas de sangrado
    const bleedingSymptoms = gastroData.symptoms.bleeding.length;
    if (bleedingSymptoms >= 2) {
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (bleedingSymptoms > 0) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // Alertas por signos vitales
    const { systolicBP, heartRate } = gastroData.vitalSigns;
    if (systolicBP < 90 || heartRate > 120) {
      alertCount++;
      urgencyLevel = 'Crítico';
    } else if (systolicBP < 100 || heartRate > 100) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // Calcular progreso
    let sectionsCompleted = 0;
    if (gastroData.symptoms.abdominal.length > 0 || gastroData.symptoms.digestive.length > 0) sectionsCompleted++;
    if (gastroData.riskFactors.peptic.length > 0 || gastroData.riskFactors.hepatic.length > 0) sectionsCompleted++;
    if (gastroData.anthropometry.bmi > 0) sectionsCompleted++;
    if (gastroData.vitalSigns.systolicBP > 0) sectionsCompleted++;
    if (gastroData.abdominalEvaluation.inspection.shape) sectionsCompleted++;
    if (gastroData.digestiveEvaluation.upperGI.dyspepsia.length > 0) sectionsCompleted++;
    if (gastroData.clinicalScores.glasgowBlatchford.factors.length > 0 || gastroData.clinicalScores.rockall.factors.length > 0) sectionsCompleted++;
    if (gastroData.management.diagnosticPlan.length > 0) sectionsCompleted++;

    const progress = Math.round((sectionsCompleted / gastroData.totalSections) * 100);

    // Actualizar estados
    setGastroData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urgencyLevel,
      examProgress: progress,
      sectionsCompleted,
      clinicalScores: {
        ...prev.clinicalScores,
        glasgowBlatchford: { ...prev.clinicalScores.glasgowBlatchford, score: gbScore, riskLevel: gbLevel },
        rockall: { ...prev.clinicalScores.rockall, score: Math.round(rockallScore), riskLevel: rockallRisk },
        childPugh: { ...prev.clinicalScores.childPugh, score: childScore, class: childClass }
      }
    }));
  }, [gastroData]);

  // 📋 GENERACIÓN AUTOMÁTICA DE REPORTE
  const generateMedicalReport = useCallback(() => {
    let report = 'REPORTE GASTROENTEROLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    // Encabezado
    report += `Fecha: ${new Date().toLocaleDateString()}\n`;
    report += `Hora: ${new Date().toLocaleTimeString()}\n`;
    report += `Nivel de urgencia: ${gastroData.urgencyLevel}\n`;
    report += `Progreso del examen: ${gastroData.examProgress}%\n`;
    report += `Alertas: ${gastroData.alertCount} críticas, ${gastroData.warningCount} advertencias\n\n`;

    // Antropometría
    if (gastroData.anthropometry.bmi > 0) {
      report += 'ANTROPOMETRÍA:\n';
      report += `• Peso: ${gastroData.anthropometry.weight} kg\n`;
      report += `• Talla: ${gastroData.anthropometry.height} cm\n`;
      report += `• IMC: ${gastroData.anthropometry.bmi} kg/m² (${gastroData.anthropometry.bmiCategory})\n`;
      if (gastroData.anthropometry.waistCircumference > 0) {
        report += `• Circunferencia abdominal: ${gastroData.anthropometry.waistCircumference} cm\n`;
      }
      report += '\n';
    }

    // Signos vitales
    if (gastroData.vitalSigns.systolicBP > 0) {
      report += 'SIGNOS VITALES:\n';
      report += `• Presión arterial: ${gastroData.vitalSigns.systolicBP}/${gastroData.vitalSigns.diastolicBP} mmHg\n`;
      if (gastroData.vitalSigns.heartRate > 0) {
        report += `• Frecuencia cardíaca: ${gastroData.vitalSigns.heartRate} lpm\n`;
      }
      if (gastroData.vitalSigns.temperature > 0) {
        report += `• Temperatura: ${gastroData.vitalSigns.temperature}°C\n`;
      }
      report += '\n';
    }

    // Síntomas por categorías
    const symptomCategories = [
      { name: 'Abdominales', symptoms: gastroData.symptoms.abdominal },
      { name: 'Digestivos', symptoms: gastroData.symptoms.digestive },
      { name: 'Intestinales', symptoms: gastroData.symptoms.bowel },
      { name: 'Hepáticos', symptoms: gastroData.symptoms.hepatic },
      { name: 'Sangrado', symptoms: gastroData.symptoms.bleeding }
    ];
    
    const hasSymptoms = symptomCategories.some(cat => cat.symptoms.length > 0);
    if (hasSymptoms) {
      report += 'SÍNTOMAS GASTROENTEROLÓGICOS:\n';
      symptomCategories.forEach(category => {
        if (category.symptoms.length > 0) {
          report += `${category.name}:\n`;
          category.symptoms.forEach(symptom => report += `  • ${symptom}\n`);
        }
      });
      report += '\n';
    }

    // Factores de riesgo
    const riskCategories = [
      { name: 'Pépticos', factors: gastroData.riskFactors.peptic },
      { name: 'Hepáticos', factors: gastroData.riskFactors.hepatic },
      { name: 'Inflamatorios', factors: gastroData.riskFactors.inflammatory },
      { name: 'Neoplásicos', factors: gastroData.riskFactors.neoplastic }
    ];
    
    const hasRiskFactors = riskCategories.some(cat => cat.factors.length > 0);
    if (hasRiskFactors) {
      report += 'FACTORES DE RIESGO:\n';
      riskCategories.forEach(category => {
        if (category.factors.length > 0) {
          report += `${category.name}:\n`;
          category.factors.forEach(factor => report += `  • ${factor}\n`);
        }
      });
      report += '\n';
    }

    // Examen físico abdominal
    if (gastroData.abdominalEvaluation.inspection.shape) {
      report += 'EXAMEN FÍSICO ABDOMINAL:\n';
      report += 'Inspección:\n';
      report += `  • Forma: ${gastroData.abdominalEvaluation.inspection.shape}\n`;
      if (gastroData.abdominalEvaluation.inspection.symmetry) {
        report += `  • Simetría: ${gastroData.abdominalEvaluation.inspection.symmetry}\n`;
      }
      if (gastroData.abdominalEvaluation.auscultation.bowelSounds) {
        report += 'Auscultación:\n';
        report += `  • Ruidos intestinales: ${gastroData.abdominalEvaluation.auscultation.bowelSounds}\n`;
      }
      if (gastroData.abdominalEvaluation.palpation.tenderness) {
        report += 'Palpación:\n';
        report += `  • Sensibilidad: ${gastroData.abdominalEvaluation.palpation.tenderness}\n`;
      }
      report += '\n';
    }

    // Escalas clínicas
    const hasScores = gastroData.clinicalScores.glasgowBlatchford.riskLevel || 
                     gastroData.clinicalScores.rockall.riskLevel || 
                     gastroData.clinicalScores.childPugh.class;
    
    if (hasScores) {
      report += 'ESCALAS CLÍNICAS:\n';
      if (gastroData.clinicalScores.glasgowBlatchford.riskLevel) {
        report += `• Glasgow-Blatchford Score: ${gastroData.clinicalScores.glasgowBlatchford.score} puntos\n`;
        report += `  Interpretación: ${gastroData.clinicalScores.glasgowBlatchford.riskLevel}\n`;
      }
      if (gastroData.clinicalScores.rockall.riskLevel) {
        report += `• Rockall Score: ${gastroData.clinicalScores.rockall.score} puntos\n`;
        report += `  Interpretación: ${gastroData.clinicalScores.rockall.riskLevel}\n`;
      }
      if (gastroData.clinicalScores.childPugh.class) {
        report += `• Child-Pugh Score: ${gastroData.clinicalScores.childPugh.score} puntos\n`;
        report += `  Clasificación: ${gastroData.clinicalScores.childPugh.class}\n`;
      }
      report += '\n';
    }

    // Evaluación digestiva
    if (gastroData.digestiveEvaluation.upperGI.dyspepsia.length > 0 || gastroData.digestiveEvaluation.lowerGI.bowelHabits) {
      report += 'EVALUACIÓN DIGESTIVA:\n';
      if (gastroData.digestiveEvaluation.upperGI.dyspepsia.length > 0) {
        report += 'Tracto GI Superior:\n';
        gastroData.digestiveEvaluation.upperGI.dyspepsia.forEach(symptom => {
          report += `  • ${symptom}\n`;
        });
      }
      if (gastroData.digestiveEvaluation.lowerGI.bowelHabits) {
        report += 'Tracto GI Inferior:\n';
        report += `  • Hábito intestinal: ${gastroData.digestiveEvaluation.lowerGI.bowelHabits}\n`;
      }
      report += '\n';
    }

    // Plan de manejo
    if (gastroData.management.diagnosticPlan.length > 0 || gastroData.management.therapeuticPlan.length > 0) {
      report += 'PLAN DE MANEJO:\n';
      if (gastroData.management.diagnosticPlan.length > 0) {
        report += 'Plan Diagnóstico:\n';
        gastroData.management.diagnosticPlan.forEach(plan => report += `  • ${plan}\n`);
      }
      if (gastroData.management.therapeuticPlan.length > 0) {
        report += 'Plan Terapéutico:\n';
        gastroData.management.therapeuticPlan.forEach(plan => report += `  • ${plan}\n`);
      }
      report += '\n';
    }

    // Recomendaciones basadas en urgencia
    if (gastroData.urgencyLevel !== 'Normal') {
      report += 'RECOMENDACIONES:\n';
      if (gastroData.urgencyLevel === 'Crítico') {
        report += '• ATENCIÓN INMEDIATA REQUERIDA\n';
        report += '• Considerar hospitalización\n';
        report += '• Monitoreo continuo de signos vitales\n';
      } else if (gastroData.urgencyLevel === 'Prioritario') {
        report += '• Evaluación prioritaria en las próximas 24 horas\n';
        report += '• Seguimiento estrecho\n';
      } else if (gastroData.urgencyLevel === 'Observación') {
        report += '• Seguimiento ambulatorio\n';
        report += '• Control en 1-2 semanas\n';
      }
      report += '\n';
    }

    report += `Reporte generado automáticamente el ${new Date().toLocaleString()}\n`;
    report += 'Sistema VITAL 2.0 - Gastroenterología\n';

    setMedicalReport(report);
  }, [gastroData]);

  // EFECTOS AUTOMÁTICOS
  useEffect(() => {
    calculateBMI();
  }, [gastroData.anthropometry.height, gastroData.anthropometry.weight]);

  useEffect(() => {
    calculateRiskScores();
  }, [gastroData.clinicalScores, gastroData.symptoms]);

  useEffect(() => {
    generateMedicalReport();
  }, [gastroData]);

  // DATOS MÉDICOS (PRINCIPIO ZERO-TYPING)
  const abdominalSymptoms = [
    'Dolor abdominal', 'Distensión abdominal', 'Náuseas', 
    'Vómitos', 'Pirosis', 'Regurgitación',
    'Disfagia', 'Odinofagia', 'Saciedad precoz'
  ];

  const digestiveSymptoms = [
    'Diarrea', 'Estreñimiento', 'Cambio hábito intestinal', 
    'Tenesmo', 'Urgencia defecatoria', 'Incontinencia fecal',
    'Flatulencia', 'Eructos', 'Meteorismo'
  ];

  const bleedingSymptoms = [
    'Hematemesis', 'Melena', 'Hematoquezia', 
    'Rectorragia', 'Sangre oculta', 'Anemia ferropénica'
  ];

  const pepticRiskFactors = [
    'H. pylori', 'AINEs', 'Corticoides',
    'Anticoagulantes', 'Tabaquismo', 'Alcohol',
    'Estrés', 'Antecedente úlcera', 'Edad > 65 años'
  ];

  const hepaticRiskFactors = [
    'Hepatitis B', 'Hepatitis C', 'Alcohol',
    'Esteatosis', 'Cirrosis', 'Medicamentos hepatotóxicos',
    'Autoinmune', 'Metabólica', 'Genética'
  ];

  const diagnosticTests = [
    'Endoscopia alta', 'Colonoscopia', 'Ecografía abdominal',
    'TAC abdomen', 'RMN hepática', 'CPRE',
    'Laboratorio completo', 'Marcadores tumorales', 'Biopsia'
  ];

  const therapeuticOptions = [
    'IBP', 'Antiácidos', 'Procinéticos',
    'Antiespasmódicos', 'Antibióticos', 'Corticoides',
    'Inmunosupresores', 'Cirugía', 'Endoscopia terapéutica'
  ];

  // Secciones del examen - Estructura idéntica a EndocrinologyDemo
  const examSections = [
    {
      id: 'symptoms',
      title: 'Síntomas Gastroenterológicos',
      icon: <Eye className="w-5 h-5 text-yellow-500" />,
      description: 'Anamnesis dirigida con principio ZERO-TYPING',
      progress: gastroData.symptoms.abdominal.length + gastroData.symptoms.digestive.length > 0 ? 100 : 0
    },
    {
      id: 'riskFactors',
      title: 'Factores de Riesgo',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      description: 'Factores de riesgo gastroenterológicos',
      progress: gastroData.riskFactors.peptic.length + gastroData.riskFactors.hepatic.length > 0 ? 100 : 0
    },
    {
      id: 'anthropometry',
      title: 'Antropometría',
      icon: <Scale className="w-5 h-5 text-blue-500" />,
      description: 'Mediciones con cálculos automáticos',
      progress: gastroData.anthropometry.bmi > 0 ? 100 : 0
    },
    {
      id: 'vitals',
      title: 'Signos Vitales',
      icon: <Activity className="w-5 h-5 text-red-500" />,
      description: 'Monitoreo vital con alertas',
      progress: gastroData.vitalSigns.systolicBP > 0 ? 100 : 0
    },
    {
      id: 'abdominal',
      title: 'Evaluación Abdominal',
      icon: <Stethoscope className="w-5 h-5 text-purple-500" />,
      description: 'Examen físico sistemático',
      progress: gastroData.abdominalEvaluation.inspection.shape ? 100 : 0
    },
    {
      id: 'digestive',
      title: 'Evaluación Digestiva',
      icon: <FlaskConical className="w-5 h-5 text-green-500" />,
      description: 'Tracto GI superior e inferior',
      progress: gastroData.digestiveEvaluation.upperGI.dyspepsia.length > 0 ? 100 : 0
    },
    {
      id: 'scores',
      title: 'Escalas Clínicas',
      icon: <Calculator className="w-5 h-5 text-orange-500" />,
      description: 'Scores automáticos y alertas',
      progress: gastroData.clinicalScores.glasgowBlatchford.factors.length > 0 ? 100 : 0
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />,
      description: 'Plan integral personalizado',
      progress: gastroData.management.diagnosticPlan.length > 0 ? 100 : 0
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
      gastroData,
      medicalReport,
      progressPercentage: gastroData.examProgress,
      timestamp: new Date(),
      specialty: 'Gastroenterología'
    });
  };

  // Datos para MedicalDashboard
  const alerts = [
    ...(gastroData.bmi >= 30 ? [{ type: 'warning' as const, message: `BMI elevado: ${gastroData.bmi.toFixed(1)}` }] : []),
    ...(gastroData.vitalSigns.systolicBP >= 140 || gastroData.vitalSigns.diastolicBP >= 90 ? [{ type: 'error' as const, message: 'Hipertensión arterial detectada' }] : []),
    ...(gastroData.clinicalScores.glasgowBlatchford.score >= 6 ? [{ type: 'error' as const, message: `Glasgow-Blatchford alto: ${gastroData.clinicalScores.glasgowBlatchford.score}` }] : []),
    ...(gastroData.clinicalScores.rockall.score >= 8 ? [{ type: 'error' as const, message: `Rockall alto: ${gastroData.clinicalScores.rockall.score}` }] : []),
    ...(gastroData.clinicalScores.childPugh.score >= 10 ? [{ type: 'error' as const, message: `Child-Pugh clase C: ${gastroData.clinicalScores.childPugh.score}` }] : [])
  ];

  const medicalScales = [
    {
      name: 'Glasgow-Blatchford',
      value: gastroData.clinicalScores.glasgowBlatchford.score,
      max: 23,
      interpretation: gastroData.clinicalScores.glasgowBlatchford.interpretation,
      color: gastroData.clinicalScores.glasgowBlatchford.score >= 6 ? 'red' : gastroData.clinicalScores.glasgowBlatchford.score >= 2 ? 'yellow' : 'green'
    },
    {
      name: 'Rockall Score',
      value: gastroData.clinicalScores.rockall.score,
      max: 11,
      interpretation: gastroData.clinicalScores.rockall.interpretation,
      color: gastroData.clinicalScores.rockall.score >= 8 ? 'red' : gastroData.clinicalScores.rockall.score >= 3 ? 'yellow' : 'green'
    },
    {
      name: 'Child-Pugh',
      value: gastroData.clinicalScores.childPugh.score,
      max: 15,
      interpretation: gastroData.clinicalScores.childPugh.interpretation,
      color: gastroData.clinicalScores.childPugh.score >= 10 ? 'red' : gastroData.clinicalScores.childPugh.score >= 7 ? 'yellow' : 'green'
    }
  ];

  const progressSections = examSections.reduce((acc, section) => {
    acc[section.title.toLowerCase().replace(/\s+/g, '')] = section.progress >= 100;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800">
      
      {/* HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gastroenterología</h1>
                <p className="text-emerald-200">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={gastroData.urgencyLevel === 'Crítico' ? 'destructive' : 
                        gastroData.urgencyLevel === 'Prioritario' ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                {gastroData.urgencyLevel}
              </Badge>
              <div className="text-right">
                <div className="text-white font-semibold">{gastroData.examProgress}% Completado</div>
                <div className="text-emerald-200 text-sm">{gastroData.sectionsCompleted}/{gastroData.totalSections} secciones</div>
              </div>
              <Button 
                onClick={() => setShowSplitView(!showSplitView)}
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Informe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* CONTENIDO PRINCIPAL */}
        <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          !showSplitView ? 'mr-96' : ''
        }`}>
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* MÉTRICAS RÁPIDAS */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 border border-red-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{gastroData.alertCount}</div>
                    <div className="text-red-200 text-sm">Críticos</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-orange-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{gastroData.warningCount}</div>
                    <div className="text-orange-200 text-sm">Alarmas</div>
                  </div>
                  <Zap className="w-8 h-8 text-orange-400" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{gastroData.urgencyLevel}</div>
                    <div className="text-blue-200 text-sm">Triage</div>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-green-500/20 backdrop-blur-md rounded-xl p-4 border border-green-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{gastroData.findingCount}</div>
                    <div className="text-green-200 text-sm">Normales</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>
            </div>

            {/* SECCIONES EXPANDIBLES */}
            <AnimatePresence>
              {examSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-black/30 backdrop-blur-md border-white/10">
                    <CardHeader 
                      className="cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {section.icon}
                          <div>
                            <CardTitle className="text-white">{section.title}</CardTitle>
                            <p className="text-gray-300 text-sm">{section.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                              style={{ width: `${section.progress}%` }}
                            />
                          </div>
                          {expandedSections.includes(section.id) ? 
                            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          }
                        </div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedSections.includes(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            {section.id === 'symptoms' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Eye className="w-4 h-4 mr-2 text-yellow-500" />
                                    Síntomas Abdominales
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {abdominalSymptoms.map(symptom => (
                                      <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`abdominal-${symptom}`}
                                          checked={gastroData.symptoms.abdominal.includes(symptom)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('symptoms.abdominal', symptom, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`abdominal-${symptom}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {symptom}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-blue-500" />
                                    Síntomas Digestivos
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {digestiveSymptoms.map(symptom => (
                                      <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`digestive-${symptom}`}
                                          checked={gastroData.symptoms.digestive.includes(symptom)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('symptoms.digestive', symptom, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`digestive-${symptom}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {symptom}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                                    Síntomas de Sangrado
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {bleedingSymptoms.map(symptom => (
                                      <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`bleeding-${symptom}`}
                                          checked={gastroData.symptoms.bleeding.includes(symptom)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('symptoms.bleeding', symptom, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`bleeding-${symptom}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {symptom}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.id === 'riskFactors' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                    Factores de Riesgo Péptico
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {pepticRiskFactors.map(factor => (
                                      <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`peptic-${factor}`}
                                          checked={gastroData.riskFactors.peptic.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('riskFactors.peptic', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`peptic-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <FlaskConical className="w-4 h-4 mr-2 text-yellow-500" />
                                    Factores de Riesgo Hepático
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {hepaticRiskFactors.map(factor => (
                                      <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`hepatic-${factor}`}
                                          checked={gastroData.riskFactors.hepatic.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('riskFactors.hepatic', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`hepatic-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-orange-500" />
                                    Factores Inflamatorios
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['Enfermedad de Crohn', 'Colitis ulcerosa', 'Síndrome intestino irritable', 'Diverticulitis', 'Pancreatitis crónica', 'Enfermedad celíaca'].map(factor => (
                                      <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`inflammatory-${factor}`}
                                          checked={gastroData.riskFactors.inflammatory.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('riskFactors.inflammatory', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`inflammatory-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-purple-500" />
                                    Factores Neoplásicos
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['Antecedente familiar cáncer GI', 'Pólipos colónicos', 'Síndrome Lynch', 'Poliposis adenomatosa', 'Tabaquismo', 'Alcohol crónico'].map(factor => (
                                      <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`neoplastic-${factor}`}
                                          checked={gastroData.riskFactors.neoplastic.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('riskFactors.neoplastic', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`neoplastic-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.id === 'anthropometry' && (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-white">Peso (kg)</Label>
                                    <Input 
                                      type="number" 
                                      value={gastroData.anthropometry.weight || ''}
                                      onChange={(e) => updateGastroData('anthropometry.weight', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-white">Talla (cm)</Label>
                                    <Input 
                                      type="number" 
                                      value={gastroData.anthropometry.height || ''}
                                      onChange={(e) => updateGastroData('anthropometry.height', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  {gastroData.anthropometry.bmi > 0 && (
                                    <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-500/30">
                                      <div className="text-white font-semibold">IMC Calculado</div>
                                      <div className="text-2xl font-bold text-emerald-400">
                                        {gastroData.anthropometry.bmi} kg/m²
                                      </div>
                                      <div className="text-emerald-200 text-sm">
                                        {gastroData.anthropometry.bmiCategory}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {section.id === 'vitals' && (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-white">Presión Sistólica (mmHg)</Label>
                                    <Input 
                                      type="number" 
                                      value={gastroData.vitalSigns.systolicBP || ''}
                                      onChange={(e) => updateGastroData('vitalSigns.systolicBP', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-white">Presión Diastólica (mmHg)</Label>
                                    <Input 
                                      type="number" 
                                      value={gastroData.vitalSigns.diastolicBP || ''}
                                      onChange={(e) => updateGastroData('vitalSigns.diastolicBP', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-white">Frecuencia Cardíaca (lpm)</Label>
                                    <Input 
                                      type="number" 
                                      value={gastroData.vitalSigns.heartRate || ''}
                                      onChange={(e) => updateGastroData('vitalSigns.heartRate', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-white">Temperatura (°C)</Label>
                                    <Input 
                                      type="number" 
                                      step="0.1"
                                      value={gastroData.vitalSigns.temperature || ''}
                                      onChange={(e) => updateGastroData('vitalSigns.temperature', parseFloat(e.target.value) || 0)}
                                      className="bg-white/10 border-white/20 text-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.id === 'abdominal' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-white font-semibold mb-3">Inspección</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white">Forma del abdomen</Label>
                                      <Select 
                                        value={gastroData.abdominalEvaluation.inspection.shape}
                                        onValueChange={(value) => updateGastroData('abdominalEvaluation.inspection.shape', value)}
                                      >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="plano">Plano</SelectItem>
                                          <SelectItem value="globoso">Globoso</SelectItem>
                                          <SelectItem value="distendido">Distendido</SelectItem>
                                          <SelectItem value="excavado">Excavado</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label className="text-white">Simetría</Label>
                                      <Select 
                                        value={gastroData.abdominalEvaluation.inspection.symmetry}
                                        onValueChange={(value) => updateGastroData('abdominalEvaluation.inspection.symmetry', value)}
                                      >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="simétrico">Simétrico</SelectItem>
                                          <SelectItem value="asimétrico">Asimétrico</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3">Auscultación</h4>
                                  <div>
                                    <Label className="text-white">Ruidos intestinales</Label>
                                    <Select 
                                      value={gastroData.abdominalEvaluation.auscultation.bowelSounds}
                                      onValueChange={(value) => updateGastroData('abdominalEvaluation.auscultation.bowelSounds', value)}
                                    >
                                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="normales">Normales</SelectItem>
                                        <SelectItem value="aumentados">Aumentados</SelectItem>
                                        <SelectItem value="disminuidos">Disminuidos</SelectItem>
                                        <SelectItem value="ausentes">Ausentes</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3">Palpación</h4>
                                  <div>
                                    <Label className="text-white">Dolor a la palpación</Label>
                                    <Select 
                                      value={gastroData.abdominalEvaluation.palpation.tenderness}
                                      onValueChange={(value) => updateGastroData('abdominalEvaluation.palpation.tenderness', value)}
                                    >
                                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="ausente">Ausente</SelectItem>
                                        <SelectItem value="epigastrio">Epigastrio</SelectItem>
                                        <SelectItem value="hipocondrio_derecho">Hipocondrio derecho</SelectItem>
                                        <SelectItem value="fosa_iliaca_derecha">Fosa ilíaca derecha</SelectItem>
                                        <SelectItem value="generalizado">Generalizado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.id === 'digestive' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-white font-semibold mb-3">Tracto GI Superior - Dispepsia</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['Dolor epigástrico', 'Saciedad precoz', 'Plenitud postprandial', 'Náuseas'].map(symptom => (
                                      <div key={symptom} className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`dyspepsia-${symptom}`}
                                          checked={gastroData.digestiveEvaluation.upperGI.dyspepsia.includes(symptom)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('digestiveEvaluation.upperGI.dyspepsia', symptom, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`dyspepsia-${symptom}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {symptom}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3">Tracto GI Inferior</h4>
                                  <div>
                                    <Label className="text-white">Hábito intestinal</Label>
                                    <Select 
                                      value={gastroData.digestiveEvaluation.lowerGI.bowelHabits}
                                      onValueChange={(value) => updateGastroData('digestiveEvaluation.lowerGI.bowelHabits', value)}
                                    >
                                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="estreñimiento">Estreñimiento</SelectItem>
                                        <SelectItem value="diarrea">Diarrea</SelectItem>
                                        <SelectItem value="alternante">Alternante</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.id === 'clinicalScales' && (
                              <div className="space-y-6">
                                <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Calculator className="w-4 h-4 mr-2 text-red-500" />
                                    Glasgow-Blatchford Score
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[
                                      'Urea elevada (>6.5 mmol/L)',
                                      'Hemoglobina baja (<13 H, <12 M)',
                                      'Presión sistólica <100 mmHg',
                                      'Frecuencia cardíaca >100 lpm',
                                      'Melena',
                                      'Síncope',
                                      'Enfermedad hepática',
                                      'Insuficiencia cardíaca'
                                    ].map(factor => (
                                      <div key={factor} className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`gb-${factor}`}
                                          checked={gastroData.clinicalScores.glasgowBlatchford.factors.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('clinicalScores.glasgowBlatchford.factors', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`gb-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  {gastroData.clinicalScores.glasgowBlatchford.riskLevel && (
                                    <div className="mt-4 p-3 bg-black/30 rounded-lg">
                                      <div className="text-white font-semibold">Score: {gastroData.clinicalScores.glasgowBlatchford.score}</div>
                                      <div className="text-red-300">{gastroData.clinicalScores.glasgowBlatchford.riskLevel}</div>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                                    Rockall Score
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[
                                      'Edad 60-79 años',
                                      'Edad >80 años',
                                      'Shock (FC>100, PAS<100)',
                                      'Comorbilidad (cardíaca, renal, hepática)',
                                      'Diagnóstico alto riesgo (Mallory-Weiss, neoplasia)',
                                      'Estigmas alto riesgo (sangrado activo, vaso visible)'
                                    ].map(factor => (
                                      <div key={factor} className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`rockall-${factor}`}
                                          checked={gastroData.clinicalScores.rockall.factors.includes(factor)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('clinicalScores.rockall.factors', factor, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`rockall-${factor}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {factor}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                  {gastroData.clinicalScores.rockall.riskLevel && (
                                    <div className="mt-4 p-3 bg-black/30 rounded-lg">
                                      <div className="text-white font-semibold">Score: {gastroData.clinicalScores.rockall.score}</div>
                                      <div className="text-orange-300">{gastroData.clinicalScores.rockall.riskLevel}</div>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-purple-500" />
                                    Child-Pugh Score
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white text-sm">Bilirrubina (mg/dL)</Label>
                                      <Input 
                                        type="number" 
                                        step="0.1"
                                        value={gastroData.clinicalScores.childPugh.bilirubin || ''}
                                        onChange={(e) => updateGastroData('clinicalScores.childPugh.bilirubin', parseFloat(e.target.value) || 0)}
                                        className="bg-white/10 border-white/20 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white text-sm">Albúmina (g/dL)</Label>
                                      <Input 
                                        type="number" 
                                        step="0.1"
                                        value={gastroData.clinicalScores.childPugh.albumin || ''}
                                        onChange={(e) => updateGastroData('clinicalScores.childPugh.albumin', parseFloat(e.target.value) || 0)}
                                        className="bg-white/10 border-white/20 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white text-sm">INR</Label>
                                      <Input 
                                        type="number" 
                                        step="0.1"
                                        value={gastroData.clinicalScores.childPugh.inr || ''}
                                        onChange={(e) => updateGastroData('clinicalScores.childPugh.inr', parseFloat(e.target.value) || 0)}
                                        className="bg-white/10 border-white/20 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-white text-sm">Ascitis</Label>
                                      <Select 
                                        value={gastroData.clinicalScores.childPugh.ascites}
                                        onValueChange={(value) => updateGastroData('clinicalScores.childPugh.ascites', value)}
                                      >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ausente">Ausente</SelectItem>
                                          <SelectItem value="leve">Leve</SelectItem>
                                          <SelectItem value="moderada">Moderada-severa</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label className="text-white text-sm">Encefalopatía</Label>
                                      <Select 
                                        value={gastroData.clinicalScores.childPugh.encephalopathy}
                                        onValueChange={(value) => updateGastroData('clinicalScores.childPugh.encephalopathy', value)}
                                      >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ausente">Ausente</SelectItem>
                                          <SelectItem value="grado1-2">Grado 1-2</SelectItem>
                                          <SelectItem value="grado3-4">Grado 3-4</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  {gastroData.clinicalScores.childPugh.class && (
                                    <div className="mt-4 p-3 bg-black/30 rounded-lg">
                                      <div className="text-white font-semibold">Score: {gastroData.clinicalScores.childPugh.score}</div>
                                      <div className="text-purple-300">Clase {gastroData.clinicalScores.childPugh.class}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {section.id === 'management' && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-white font-semibold mb-3">Plan Diagnóstico</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {diagnosticTests.map(test => (
                                      <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                          id={`diagnostic-${test}`}
                                          checked={gastroData.management.diagnosticPlan.includes(test)}
                                          onCheckedChange={(checked) => 
                                            updateArrayData('management.diagnosticPlan', test, checked as boolean)
                                          }
                                        />
                                        <Label 
                                          htmlFor={`diagnostic-${test}`} 
                                          className="text-gray-300 text-sm cursor-pointer"
                                        >
                                          {test}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-white font-semibold mb-3">Plan Terapéutico</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {therapeuticOptions.map(option => (
                                      <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                        <Checkbox 
                                           id={`therapeutic-${option}`}
                                           checked={gastroData.management.therapeuticPlan.includes(option)}
                                           onCheckedChange={(checked) => 
                                             updateArrayData('management.therapeuticPlan', option, checked as boolean)
                                           }
                                         />
                                         <Label 
                                           htmlFor={`therapeutic-${option}`} 
                                           className="text-gray-300 text-sm cursor-pointer"
                                         >
                                           {option}
                                         </Label>
                                       </div>
                                     ))}
                                   </div>
                                 </div>

                                 <div>
                                   <h4 className="text-white font-semibold mb-3">Recomendaciones de Estilo de Vida</h4>
                                   <div className="grid grid-cols-2 gap-2">
                                     {[
                                       'Dieta blanda', 'Evitar irritantes', 'Fraccionamiento',
                                       'Hidratación', 'Ejercicio moderado', 'Control estrés',
                                       'Evitar alcohol', 'Evitar tabaco', 'Horarios regulares'
                                     ].map(lifestyle => (
                                       <div key={lifestyle} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                         <Checkbox 
                                           id={`lifestyle-${lifestyle}`}
                                           checked={gastroData.management.lifestyle.includes(lifestyle)}
                                           onCheckedChange={(checked) => 
                                             updateArrayData('management.lifestyle', lifestyle, checked as boolean)
                                           }
                                         />
                                         <Label 
                                           htmlFor={`lifestyle-${lifestyle}`} 
                                           className="text-gray-300 text-sm cursor-pointer"
                                         >
                                           {lifestyle}
                                         </Label>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               </div>
                             )}
                           </CardContent>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>

             {/* BOTONES DE ACCIÓN */}
             <div className="flex justify-center space-x-4 mt-8">
               <Button 
                 onClick={handleComplete}
                 className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold"
                 disabled={gastroData.examProgress < 50}
               >
                 <CheckCircle2 className="w-5 h-5 mr-2" />
                 Completar Evaluación
               </Button>
               <Button 
                 onClick={copyReport}
                 variant="outline"
                 className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-3"
               >
                 <Copy className="w-5 h-5 mr-2" />
                 Copiar Reporte
               </Button>
             </div>
           </div>
         </div>

        {/* PANEL DERECHO - MEDICAL DASHBOARD */}
        {!showSplitView && (
          <MedicalDashboard 
            alerts={alerts}
            medicalScales={medicalScales.map(scale => ({
              ...scale,
              riskLevel: scale.color === 'red' ? 'critical' : scale.color === 'yellow' ? 'high' : 'low'
            }))}
            progressPercentage={gastroData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Gastroenterología"
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
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-700 dark:to-teal-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-emerald-600" />
                Informe Gastroenterológico
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
                {medicalReport || 'Seleccione los parámetros del examen gastroenterológico para generar el informe en tiempo real...'}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && gastroData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({gastroData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}