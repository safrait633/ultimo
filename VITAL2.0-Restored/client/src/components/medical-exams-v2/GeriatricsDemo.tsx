import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Brain, 
  Heart, 
  Pill,
  Target,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  Activity,
  User,
  Calculator,
  Shield,
  Eye,
  Hand,
  Search,
  TrendingUp,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Timer
} from "lucide-react";

interface GeriatricsDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface GeriatricsData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  geriatricsStatus: string;

  // Functional Assessment
  functionalAssessment: {
    adl: {
      bathing: string;
      dressing: string;
      toileting: string;
      transfers: string;
      continence: string;
      feeding: string;
    };
    iadl: {
      telephone: string;
      shopping: string;
      cooking: string;
      housework: string;
      laundry: string;
      medications: string;
      finances: string;
    };
    mobility: {
      walkingAid: boolean;
      walkingDistance: string;
      falls_risk: string;
      balance_problems: boolean;
    };
  };

  // Cognitive Assessment
  cognitiveAssessment: {
    miniMentalState: {
      orientation: number;
      registration: number;
      attention: number;
      recall: number;
      language: number;
      totalScore: number;
      interpretation: string;
    };
    clockTest: string;
    memoryComplaints: string[];
    behavioralChanges: string[];
    delirium_screening: {
      acute_onset: boolean;
      fluctuating_course: boolean;
      inattention: boolean;
      altered_consciousness: boolean;
      confusion: boolean;
    };
  };

  // Physical Assessment
  physicalAssessment: {
    nutrition: {
      weight: number;
      height: number;
      bmi: number;
      nutritionalStatus: string;
      appetite: string;
      unintentionalWeightLoss: boolean;
    };
    cardiovascular: {
      bloodPressure: { systolic: number; diastolic: number };
      heartRate: number;
      orthostatic_hypotension: boolean;
      peripheral_edema: boolean;
      cardiac_murmurs: boolean;
    };
    sensory: {
      vision: string;
      hearing: string;
      hearing_aid: boolean;
      glasses: boolean;
    };
    musculoskeletal: {
      muscle_strength: string;
      joint_stiffness: boolean;
      arthritis: boolean;
      osteoporosis_risk: boolean;
    };
  };

  // Comprehensive Geriatric Assessment
  comprehensiveAssessment: {
    medication_review: {
      total_medications: number;
      potentially_inappropriate: string[];
      drug_interactions: string[];
      adherence_issues: boolean;
    };
    social_assessment: {
      living_situation: string;
      social_support: string;
      caregiver_burden: string;
      financial_status: string;
    };
    mood_assessment: {
      depression_screening: {
        score: number;
        risk_level: string;
      };
      anxiety: boolean;
      sleep_disturbances: boolean;
      apathy: boolean;
    };
    safety_assessment: {
      home_safety: string;
      driving_assessment: string;
      fire_safety: boolean;
      medication_safety: boolean;
    };
  };

  // Geriatric Syndromes
  geriatricSyndromes: {
    frailty: {
      criteria: string[];
      score: number;
      classification: string;
    };
    sarcopenia: {
      muscle_mass: string;
      strength: string;
      performance: string;
      risk: string;
    };
    polypharmacy: {
      medication_count: number;
      risk_level: string;
      recommendations: string[];
    };
    incontinence: {
      urinary: boolean;
      fecal: boolean;
      type: string;
      impact: string;
    };
  };
}

const GeriatricsDemo: React.FC<GeriatricsDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['functional']));

  // Medical Data State
  const [medicalData, setMedicalData] = useState<GeriatricsData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 8,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    geriatricsStatus: 'Independiente',

    functionalAssessment: {
      adl: {
        bathing: '',
        dressing: '',
        toileting: '',
        transfers: '',
        continence: '',
        feeding: ''
      },
      iadl: {
        telephone: '',
        shopping: '',
        cooking: '',
        housework: '',
        laundry: '',
        medications: '',
        finances: ''
      },
      mobility: {
        walkingAid: false,
        walkingDistance: '',
        falls_risk: '',
        balance_problems: false
      }
    },

    cognitiveAssessment: {
      miniMentalState: {
        orientation: 0,
        registration: 0,
        attention: 0,
        recall: 0,
        language: 0,
        totalScore: 0,
        interpretation: ''
      },
      clockTest: '',
      memoryComplaints: [],
      behavioralChanges: [],
      delirium_screening: {
        acute_onset: false,
        fluctuating_course: false,
        inattention: false,
        altered_consciousness: false,
        confusion: false
      }
    },

    physicalAssessment: {
      nutrition: {
        weight: 0,
        height: 0,
        bmi: 0,
        nutritionalStatus: '',
        appetite: '',
        unintentionalWeightLoss: false
      },
      cardiovascular: {
        bloodPressure: { systolic: 0, diastolic: 0 },
        heartRate: 0,
        orthostatic_hypotension: false,
        peripheral_edema: false,
        cardiac_murmurs: false
      },
      sensory: {
        vision: '',
        hearing: '',
        hearing_aid: false,
        glasses: false
      },
      musculoskeletal: {
        muscle_strength: '',
        joint_stiffness: false,
        arthritis: false,
        osteoporosis_risk: false
      }
    },

    comprehensiveAssessment: {
      medication_review: {
        total_medications: 0,
        potentially_inappropriate: [],
        drug_interactions: [],
        adherence_issues: false
      },
      social_assessment: {
        living_situation: '',
        social_support: '',
        caregiver_burden: '',
        financial_status: ''
      },
      mood_assessment: {
        depression_screening: {
          score: 0,
          risk_level: ''
        },
        anxiety: false,
        sleep_disturbances: false,
        apathy: false
      },
      safety_assessment: {
        home_safety: '',
        driving_assessment: '',
        fire_safety: false,
        medication_safety: false
      }
    },

    geriatricSyndromes: {
      frailty: {
        criteria: [],
        score: 0,
        classification: ''
      },
      sarcopenia: {
        muscle_mass: '',
        strength: '',
        performance: '',
        risk: ''
      },
      polypharmacy: {
        medication_count: 0,
        risk_level: '',
        recommendations: []
      },
      incontinence: {
        urinary: false,
        fecal: false,
        type: '',
        impact: ''
      }
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Calculate MMSE Score
  const calculateMMSE = useCallback(() => {
    const { orientation, registration, attention, recall, language } = medicalData.cognitiveAssessment.miniMentalState;
    const totalScore = orientation + registration + attention + recall + language;
    
    let interpretation = '';
    if (totalScore >= 24) interpretation = 'Normal';
    else if (totalScore >= 18) interpretation = 'Deterioro cognitivo leve';
    else if (totalScore >= 10) interpretation = 'Deterioro cognitivo moderado';
    else interpretation = 'Deterioro cognitivo severo';

    setMedicalData(prev => ({
      ...prev,
      cognitiveAssessment: {
        ...prev.cognitiveAssessment,
        miniMentalState: {
          ...prev.cognitiveAssessment.miniMentalState,
          totalScore,
          interpretation
        }
      }
    }));
  }, [medicalData.cognitiveAssessment.miniMentalState]);

  // Calculate BMI
  const calculateBMI = useCallback(() => {
    const { weight, height } = medicalData.physicalAssessment.nutrition;
    
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
      
      let nutritionalStatus = '';
      if (bmi < 18.5) nutritionalStatus = 'Bajo peso';
      else if (bmi <= 24.9) nutritionalStatus = 'Normal';
      else if (bmi <= 29.9) nutritionalStatus = 'Sobrepeso';
      else nutritionalStatus = 'Obesidad';

      setMedicalData(prev => ({
        ...prev,
        physicalAssessment: {
          ...prev.physicalAssessment,
          nutrition: {
            ...prev.physicalAssessment.nutrition,
            bmi,
            nutritionalStatus
          }
        }
      }));
    }
  }, [medicalData.physicalAssessment.nutrition.weight, medicalData.physicalAssessment.nutrition.height]);

  // Calculate Frailty Score
  const calculateFrailtyScore = useCallback(() => {
    const criteria = medicalData.geriatricSyndromes.frailty.criteria;
    const score = criteria.length;
    
    let classification = '';
    if (score === 0) classification = 'Robusto';
    else if (score <= 2) classification = 'Pre-frágil';
    else classification = 'Frágil';

    setMedicalData(prev => ({
      ...prev,
      geriatricSyndromes: {
        ...prev.geriatricSyndromes,
        frailty: {
          ...prev.geriatricSyndromes.frailty,
          score,
          classification
        }
      }
    }));
  }, [medicalData.geriatricSyndromes.frailty.criteria]);

  // Calculate status and alerts
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let geriatricsStatus = 'Independiente';

    // Check cognitive status
    if (medicalData.cognitiveAssessment.miniMentalState.totalScore < 18 && 
        medicalData.cognitiveAssessment.miniMentalState.totalScore > 0) {
      alertCount++;
      geriatricsStatus = 'Deterioro Cognitivo';
    }

    // Check functional dependence
    const adlDependencies = Object.values(medicalData.functionalAssessment.adl)
      .filter(value => value === 'Dependiente').length;
    
    if (adlDependencies >= 3) {
      alertCount++;
      geriatricsStatus = 'Dependiente';
    } else if (adlDependencies > 0) {
      warningCount++;
      if (geriatricsStatus === 'Independiente') geriatricsStatus = 'Parcialmente Dependiente';
    }

    // Check frailty
    if (medicalData.geriatricSyndromes.frailty.score >= 3) {
      warningCount++;
      if (geriatricsStatus === 'Independiente') geriatricsStatus = 'Frágil';
    }

    // Check delirium
    const deliriumCriteria = Object.values(medicalData.cognitiveAssessment.delirium_screening)
      .filter(Boolean).length;
    
    if (deliriumCriteria >= 2) {
      alertCount++;
      geriatricsStatus = 'Delirium';
    }

    // Calculate progress
    let completedSections = 0;
    if (Object.values(medicalData.functionalAssessment.adl).some(Boolean)) completedSections++;
    if (Object.values(medicalData.functionalAssessment.iadl).some(Boolean)) completedSections++;
    if (medicalData.cognitiveAssessment.miniMentalState.totalScore > 0) completedSections++;
    if (medicalData.physicalAssessment.nutrition.weight > 0) completedSections++;
    if (medicalData.physicalAssessment.cardiovascular.heartRate > 0) completedSections++;
    if (medicalData.comprehensiveAssessment.medication_review.total_medications > 0) completedSections++;
    if (medicalData.geriatricSyndromes.frailty.criteria.length > 0) completedSections++;

    const examProgress = Math.round((completedSections / 8) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      geriatricsStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'EVALUACIÓN GERIÁTRICA INTEGRAL\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    }

    // Functional Assessment
    if (Object.values(medicalData.functionalAssessment.adl).some(Boolean)) {
      report += 'EVALUACIÓN FUNCIONAL:\n';
      report += 'Actividades de la Vida Diaria (ADL):\n';
      
      const adlActivities = Object.entries(medicalData.functionalAssessment.adl);
      adlActivities.forEach(([activity, status]) => {
        if (status) {
          const activityNames: { [key: string]: string } = {
            bathing: 'Baño',
            dressing: 'Vestido',
            toileting: 'Uso del baño',
            transfers: 'Transferencias',
            continence: 'Continencia',
            feeding: 'Alimentación'
          };
          report += `• ${activityNames[activity]}: ${status}\n`;
        }
      });

      const iadlActivities = Object.entries(medicalData.functionalAssessment.iadl);
      const completedIADL = iadlActivities.filter(([_, status]) => status);
      
      if (completedIADL.length > 0) {
        report += '\nActividades Instrumentales (IADL):\n';
        completedIADL.forEach(([activity, status]) => {
          const activityNames: { [key: string]: string } = {
            telephone: 'Teléfono',
            shopping: 'Compras',
            cooking: 'Cocinar',
            housework: 'Tareas domésticas',
            laundry: 'Lavado',
            medications: 'Medicamentos',
            finances: 'Finanzas'
          };
          report += `• ${activityNames[activity]}: ${status}\n`;
        });
      }
      
      if (medicalData.functionalAssessment.mobility.walkingAid) {
        report += '\nMovilidad: Requiere ayuda técnica\n';
      }
      
      report += '\n';
    }

    // Cognitive Assessment
    if (medicalData.cognitiveAssessment.miniMentalState.totalScore > 0) {
      report += 'EVALUACIÓN COGNITIVA:\n';
      report += `Mini Mental State: ${medicalData.cognitiveAssessment.miniMentalState.totalScore}/30 puntos\n`;
      report += `Interpretación: ${medicalData.cognitiveAssessment.miniMentalState.interpretation}\n`;
      
      if (medicalData.cognitiveAssessment.clockTest) {
        report += `Test del Reloj: ${medicalData.cognitiveAssessment.clockTest}\n`;
      }

      if (medicalData.cognitiveAssessment.memoryComplaints.length > 0) {
        report += `Quejas de memoria: ${medicalData.cognitiveAssessment.memoryComplaints.join(', ')}\n`;
      }

      const deliriumCriteria = Object.entries(medicalData.cognitiveAssessment.delirium_screening)
        .filter(([_, present]) => present)
        .map(([criterion, _]) => criterion);

      if (deliriumCriteria.length > 0) {
        report += `Criterios de delirium: ${deliriumCriteria.length}/5 presentes\n`;
        if (deliriumCriteria.length >= 2) {
          report += '⚠️ POSIBLE DELIRIUM\n';
        }
      }
      
      report += '\n';
    }

    // Physical Assessment
    if (medicalData.physicalAssessment.nutrition.bmi > 0) {
      report += 'EVALUACIÓN FÍSICA:\n';
      report += `Peso: ${medicalData.physicalAssessment.nutrition.weight} kg\n`;
      report += `Talla: ${medicalData.physicalAssessment.nutrition.height} cm\n`;
      report += `IMC: ${medicalData.physicalAssessment.nutrition.bmi} (${medicalData.physicalAssessment.nutrition.nutritionalStatus})\n`;
      
      if (medicalData.physicalAssessment.nutrition.unintentionalWeightLoss) {
        report += '⚠️ Pérdida de peso no intencional\n';
      }
    }

    if (medicalData.physicalAssessment.cardiovascular.heartRate > 0) {
      report += `FC: ${medicalData.physicalAssessment.cardiovascular.heartRate} lpm\n`;
      if (medicalData.physicalAssessment.cardiovascular.bloodPressure.systolic > 0) {
        report += `PA: ${medicalData.physicalAssessment.cardiovascular.bloodPressure.systolic}/${medicalData.physicalAssessment.cardiovascular.bloodPressure.diastolic} mmHg\n`;
      }
      if (medicalData.physicalAssessment.cardiovascular.orthostatic_hypotension) {
        report += '⚠️ Hipotensión ortostática presente\n';
      }
    }

    // Geriatric Syndromes
    if (medicalData.geriatricSyndromes.frailty.criteria.length > 0) {
      report += '\nSÍNDROMES GERIÁTRICOS:\n';
      report += `Fragilidad: ${medicalData.geriatricSyndromes.frailty.score}/5 criterios (${medicalData.geriatricSyndromes.frailty.classification})\n`;
      
      if (medicalData.comprehensiveAssessment.medication_review.total_medications > 0) {
        report += `Medicamentos: ${medicalData.comprehensiveAssessment.medication_review.total_medications}\n`;
        
        if (medicalData.comprehensiveAssessment.medication_review.total_medications >= 5) {
          report += '⚠️ Polifarmacia presente\n';
        }
      }
      
      if (medicalData.geriatricSyndromes.incontinence.urinary || medicalData.geriatricSyndromes.incontinence.fecal) {
        const incontinenceTypes = [];
        if (medicalData.geriatricSyndromes.incontinence.urinary) incontinenceTypes.push('urinaria');
        if (medicalData.geriatricSyndromes.incontinence.fecal) incontinenceTypes.push('fecal');
        report += `Incontinencia: ${incontinenceTypes.join(' y ')}\n`;
      }
      
      report += '\n';
    }

    // Comprehensive Assessment Summary
    if (medicalData.comprehensiveAssessment.social_assessment.living_situation) {
      report += 'EVALUACIÓN PSICOSOCIAL:\n';
      report += `Situación de vivienda: ${medicalData.comprehensiveAssessment.social_assessment.living_situation}\n`;
      if (medicalData.comprehensiveAssessment.social_assessment.social_support) {
        report += `Soporte social: ${medicalData.comprehensiveAssessment.social_assessment.social_support}\n`;
      }
      
      if (medicalData.comprehensiveAssessment.mood_assessment.depression_screening.score > 0) {
        report += `Screening depresión: ${medicalData.comprehensiveAssessment.mood_assessment.depression_screening.score} puntos\n`;
        report += `Riesgo: ${medicalData.comprehensiveAssessment.mood_assessment.depression_screening.risk_level}\n`;
      }
      
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN GERIÁTRICO:\n';
      report += `Estado funcional: ${medicalData.geriatricsStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} problema(s) crítico(s) - Atención inmediata\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} factor(es) de riesgo - Seguimiento necesario\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData]);

  useEffect(() => {
    calculateMMSE();
    calculateBMI();
    calculateFrailtyScore();
    calculateStatus();
    generateReport();
  }, [calculateMMSE, calculateBMI, calculateFrailtyScore, calculateStatus, generateReport]);

  const updateMedicalData = (path: string, value: any) => {
    const pathArray = path.split('.');
    setMedicalData(prev => {
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
    setMedicalData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      
      const array = current[pathArray[pathArray.length - 1]] || [];
      if (checked && !array.includes(item)) {
        current[pathArray[pathArray.length - 1]] = [...array, item];
      } else if (!checked && array.includes(item)) {
        current[pathArray[pathArray.length - 1]] = array.filter((i: string) => i !== item);
      }
      
      return newData;
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    { id: 'functional', name: 'Evaluación Funcional', icon: Activity, count: Object.values(medicalData.functionalAssessment.adl).filter(Boolean).length },
    { id: 'cognitive', name: 'Evaluación Cognitiva', icon: Brain, count: medicalData.cognitiveAssessment.miniMentalState.totalScore > 0 ? 1 : 0 },
    { id: 'physical', name: 'Evaluación Física', icon: Heart, count: medicalData.physicalAssessment.nutrition.bmi > 0 ? 1 : 0 },
    { id: 'medication', name: 'Revisión Medicamentos', icon: Pill, count: medicalData.comprehensiveAssessment.medication_review.total_medications > 0 ? 1 : 0 },
    { id: 'social', name: 'Evaluación Social', icon: Users, count: medicalData.comprehensiveAssessment.social_assessment.living_situation ? 1 : 0 },
    { id: 'mood', name: 'Evaluación Anímica', icon: Brain, count: medicalData.comprehensiveAssessment.mood_assessment.depression_screening.score > 0 ? 1 : 0 },
    { id: 'syndromes', name: 'Síndromes Geriátricos', icon: Target, count: medicalData.geriatricSyndromes.frailty.criteria.length },
    { id: 'safety', name: 'Evaluación Seguridad', icon: Shield, count: medicalData.comprehensiveAssessment.safety_assessment.home_safety ? 1 : 0 }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Users className="h-12 w-12 text-purple-100" />
              <div>
                <h1 className="text-3xl font-bold">Geriatría</h1>
                <p className="text-purple-100">Evaluación Geriátrica Integral</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso EGI</span>
                <span className="text-sm font-bold">{medicalData.examProgress}%</span>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.geriatricsStatus}</span>
                <span>{medicalData.sectionsCompleted}/8 áreas</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{medicalData.alertCount}</div>
                  <div className="text-sm text-red-600">Críticos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700">{medicalData.warningCount}</div>
                  <div className="text-sm text-orange-600">Riesgos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-700">{medicalData.geriatricsStatus}</div>
                  <div className="text-sm text-purple-600">Estado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-violet-700">
                    {medicalData.cognitiveAssessment.miniMentalState.totalScore || 'N/A'}/30
                  </div>
                  <div className="text-sm text-violet-600">MMSE</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium"
          >
            <Users className="h-5 w-5 mr-2" />
            Iniciar Evaluación Geriátrica Integral
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-purple-200 hover:bg-purple-50"
          >
            <FileText className="h-5 w-5 mr-2" />
            {showSplitView ? 'Ocultar' : 'Ver'} Reporte
          </Button>
        </div>

        {/* Split View Report */}
        <AnimatePresence>
          {showSplitView && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-slate-800 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reporte Geriátrico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando evaluación geriátrica integral...'}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full expanded view (simplified for now)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-purple-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-6 w-6" />
                Sistema Geriátrico Completo - En Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Vista expandida completa en desarrollo. Utiliza la vista compacta para la evaluación geriátrica integral.
              </p>
              <Button 
                onClick={() => setIsExpanded(false)}
                className="mt-4"
                variant="outline"
              >
                Volver a Vista Compacta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeriatricsDemo;