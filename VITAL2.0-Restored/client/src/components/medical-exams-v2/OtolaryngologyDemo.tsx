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
  AlertTriangle,
  Clock,
  Activity,
  Ear,
  Eye,
  Mic,
  Volume2,
  Stethoscope,
  Target,
  CheckCircle,
  Calculator,
  Brain,
  FileText,
  TrendingUp,
  Zap,
  ShieldAlert,
  Users,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Timer,
  Search,
  User
} from "lucide-react";

interface OtolaryngologyDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface OrlData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  orlStatus: string;

  // Phase 1: Emergency ORL Triage (3-5 min)
  emergencyTriage: {
    airwayObstruction: string;
    massiveBleeding: string;
    cervicalTrauma: string;
    impactedForeignBody: string;
    respiratoryDistress: string;
    stridor: string;
    hemodynamicStatus: string;
    consciousnessLevel: string;
  };

  // Phase 2: Intelligent ORL Anamnesis (10-15 min)
  anamnesis: {
    auditory: {
      hearingLoss: boolean;
      hearingLossType: string;
      hearingLossOnset: string;
      tinnitus: boolean;
      vertigo: boolean;
      vertigoSeverity: string;
    };
    nasal: {
      nasalObstruction: boolean;
      rhinorrhea: boolean;
      anosmia: boolean;
      epistaxis: boolean;
      facialPain: boolean;
    };
    laryngeal: {
      hoarseness: boolean;
      dysphagia: boolean;
      odynophagia: boolean;
      cough: boolean;
      globusSensation: boolean;
    };
    cervical: {
      neckMass: boolean;
      neckPain: boolean;
      lymphadenopathy: boolean;
      dyspnea: boolean;
    };
    riskFactors: {
      smokingHistory: string;
      alcoholConsumption: string;
      occupationalExposure: boolean;
      familyHistory: boolean;
      previousRadiation: boolean;
    };
  };

  // Phase 3: Systematic ORL Exploration (15-20 min)
  physicalExam: {
    otological: {
      auricle: {
        right: string;
        left: string;
      };
      externalAuditoryCanal: {
        right: string;
        left: string;
      };
      tympanicMembrane: {
        right: string;
        left: string;
      };
      hearingTests: {
        weber: string;
        rinne: {
          right: string;
          left: string;
        };
      };
    };
    nasal: {
      externalNose: string;
      rhinoscopy: {
        septum: string;
        turbinates: string;
        nasal_polyps: boolean;
        discharge: string;
      };
    };
    oropharyngeal: {
      lips: string;
      teeth: string;
      gums: string;
      tongue: string;
      palate: string;
      tonsilsSize: {
        right: string;
        left: string;
      };
      pharynx: string;
    };
    laryngeal: {
      externalLarynx: string;
      indirectLaryngoscopy: {
        epiglottis: string;
        vocalCords: {
          right: string;
          left: string;
        };
        mobility: {
          right: string;
          left: string;
        };
        subglottis: string;
      };
    };
    cervical: {
      inspection: string;
      lymphNodes: {
        submandibular: { right: boolean; left: boolean };
        jugulodigastric: { right: boolean; left: boolean };
        cervical_chain: { right: boolean; left: boolean };
        supraclavicular: { right: boolean; left: boolean };
      };
      thyroid: {
        size: string;
        consistency: string;
        nodules: boolean;
        mobility: string;
      };
    };
  };

  // Phase 4: Specialized ORL Evaluation (10-15 min)
  specializedEvaluation: {
    malignancyRisk: {
      factors: string[];
      score: number;
      risk: string;
    };
    sleepApneaRisk: {
      factors: string[];
      score: number;
      risk: string;
    };
    dizzinessEvaluation: {
      type: string;
      nystagmus: boolean;
      positionalTest: string;
      severity: string;
    };
    voiceEvaluation: {
      quality: string;
      pitch: string;
      loudness: string;
      endurance: string;
    };
  };

  // Phase 5: ORL Diagnostic Synthesis (5-10 min)
  diagnosticSynthesis: {
    primaryDiagnosis: string;
    differentialDiagnoses: string[];
    recommendedStudies: string[];
    treatmentPlan: string;
    followUpPlan: string;
    referrals: string[];
  };
}

const OtolaryngologyDemo: React.FC<OtolaryngologyDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['emergencyTriage']));
  const [currentPhase, setCurrentPhase] = useState(1);
  const [timeSpent, setTimeSpent] = useState(0);

  // Medical Data State
  const [medicalData, setMedicalData] = useState<OrlData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 10,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    orlStatus: 'Normal',

    emergencyTriage: {
      airwayObstruction: '',
      massiveBleeding: '',
      cervicalTrauma: '',
      impactedForeignBody: '',
      respiratoryDistress: '',
      stridor: '',
      hemodynamicStatus: '',
      consciousnessLevel: ''
    },

    anamnesis: {
      auditory: {
        hearingLoss: false,
        hearingLossType: '',
        hearingLossOnset: '',
        tinnitus: false,
        vertigo: false,
        vertigoSeverity: ''
      },
      nasal: {
        nasalObstruction: false,
        rhinorrhea: false,
        anosmia: false,
        epistaxis: false,
        facialPain: false
      },
      laryngeal: {
        hoarseness: false,
        dysphagia: false,
        odynophagia: false,
        cough: false,
        globusSensation: false
      },
      cervical: {
        neckMass: false,
        neckPain: false,
        lymphadenopathy: false,
        dyspnea: false
      },
      riskFactors: {
        smokingHistory: '',
        alcoholConsumption: '',
        occupationalExposure: false,
        familyHistory: false,
        previousRadiation: false
      }
    },

    physicalExam: {
      otological: {
        auricle: { right: '', left: '' },
        externalAuditoryCanal: { right: '', left: '' },
        tympanicMembrane: { right: '', left: '' },
        hearingTests: {
          weber: '',
          rinne: { right: '', left: '' }
        }
      },
      nasal: {
        externalNose: '',
        rhinoscopy: {
          septum: '',
          turbinates: '',
          nasal_polyps: false,
          discharge: ''
        }
      },
      oropharyngeal: {
        lips: '',
        teeth: '',
        gums: '',
        tongue: '',
        palate: '',
        tonsilsSize: { right: '', left: '' },
        pharynx: ''
      },
      laryngeal: {
        externalLarynx: '',
        indirectLaryngoscopy: {
          epiglottis: '',
          vocalCords: { right: '', left: '' },
          mobility: { right: '', left: '' },
          subglottis: ''
        }
      },
      cervical: {
        inspection: '',
        lymphNodes: {
          submandibular: { right: false, left: false },
          jugulodigastric: { right: false, left: false },
          cervical_chain: { right: false, left: false },
          supraclavicular: { right: false, left: false }
        },
        thyroid: {
          size: '',
          consistency: '',
          nodules: false,
          mobility: ''
        }
      }
    },

    specializedEvaluation: {
      malignancyRisk: {
        factors: [],
        score: 0,
        risk: ''
      },
      sleepApneaRisk: {
        factors: [],
        score: 0,
        risk: ''
      },
      dizzinessEvaluation: {
        type: '',
        nystagmus: false,
        positionalTest: '',
        severity: ''
      },
      voiceEvaluation: {
        quality: '',
        pitch: '',
        loudness: '',
        endurance: ''
      }
    },

    diagnosticSynthesis: {
      primaryDiagnosis: '',
      differentialDiagnoses: [],
      recommendedStudies: [],
      treatmentPlan: '',
      followUpPlan: '',
      referrals: []
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate malignancy risk score
  const calculateMalignancyRisk = useCallback(() => {
    let risk = 0;
    const factors = medicalData.specializedEvaluation.malignancyRisk.factors;

    factors.forEach(factor => {
      switch(factor) {
        case 'heavy_smoking': risk += 25; break;
        case 'heavy_alcohol': risk += 20; break;
        case 'age_over_50': risk += 15; break;
        case 'hard_fixed_mass': risk += 30; break;
        case 'vocal_cord_paralysis': risk += 20; break;
        case 'weight_loss': risk += 15; break;
        case 'progressive_dysphagia': risk += 15; break;
        case 'persistent_hoarseness': risk += 10; break;
      }
    });

    const riskLevel = risk === 0 ? 'Muy bajo' : 
                     risk <= 25 ? 'Bajo' :
                     risk <= 50 ? 'Moderado' :
                     risk <= 75 ? 'Alto' : 'Muy alto';

    setMedicalData(prev => ({
      ...prev,
      specializedEvaluation: {
        ...prev.specializedEvaluation,
        malignancyRisk: {
          ...prev.specializedEvaluation.malignancyRisk,
          score: risk,
          risk: riskLevel
        }
      }
    }));
  }, [medicalData.specializedEvaluation.malignancyRisk.factors]);

  // Calculate sleep apnea risk
  const calculateSleepApneaRisk = useCallback(() => {
    let risk = 0;
    const factors = medicalData.specializedEvaluation.sleepApneaRisk.factors;

    factors.forEach(factor => {
      switch(factor) {
        case 'loud_snoring': risk += 20; break;
        case 'witnessed_apneas': risk += 30; break;
        case 'daytime_sleepiness': risk += 15; break;
        case 'obesity': risk += 20; break;
        case 'large_neck': risk += 15; break;
        case 'hypertension': risk += 10; break;
        case 'male_gender': risk += 5; break;
        case 'age_over_40': risk += 5; break;
      }
    });

    const riskLevel = risk === 0 ? 'Muy bajo' : 
                     risk <= 30 ? 'Bajo' :
                     risk <= 60 ? 'Moderado' :
                     risk <= 80 ? 'Alto' : 'Muy alto';

    setMedicalData(prev => ({
      ...prev,
      specializedEvaluation: {
        ...prev.specializedEvaluation,
        sleepApneaRisk: {
          ...prev.specializedEvaluation.sleepApneaRisk,
          score: risk,
          risk: riskLevel
        }
      }
    }));
  }, [medicalData.specializedEvaluation.sleepApneaRisk.factors]);

  // Calculate alerts and status
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let orlStatus = 'Normal';

    // Check emergency conditions
    const emergencyConditions = [
      medicalData.emergencyTriage.airwayObstruction === 'severe',
      medicalData.emergencyTriage.massiveBleeding === 'active',
      medicalData.emergencyTriage.cervicalTrauma === 'penetrating',
      medicalData.emergencyTriage.stridor === 'inspiratory'
    ];

    emergencyConditions.forEach(condition => {
      if (condition) {
        alertCount++;
        orlStatus = 'Crítico';
      }
    });

    // Check high malignancy risk
    if (medicalData.specializedEvaluation.malignancyRisk.score > 60) {
      warningCount++;
      if (orlStatus === 'Normal') orlStatus = 'Sospechoso';
    }

    // Check hearing loss
    if (medicalData.anamnesis.auditory.hearingLoss && 
        medicalData.anamnesis.auditory.hearingLossOnset === 'sudden') {
      warningCount++;
      if (orlStatus === 'Normal') orlStatus = 'Urgente';
    }

    // Calculate progress
    let completedSections = 0;
    if (medicalData.emergencyTriage.airwayObstruction) completedSections++;
    if (Object.values(medicalData.anamnesis.auditory).some(v => typeof v === 'boolean' ? v : !!v)) completedSections++;
    if (Object.values(medicalData.anamnesis.nasal).some(Boolean)) completedSections++;
    if (medicalData.physicalExam.otological.auricle.right || medicalData.physicalExam.otological.auricle.left) completedSections++;
    if (medicalData.physicalExam.nasal.externalNose) completedSections++;
    if (medicalData.physicalExam.laryngeal.externalLarynx) completedSections++;
    if (medicalData.specializedEvaluation.malignancyRisk.factors.length > 0) completedSections++;
    if (medicalData.diagnosticSynthesis.primaryDiagnosis) completedSections++;

    const examProgress = Math.round((completedSections / 10) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      orlStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'INFORME OTORRINOLARINGOLÓGICO\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n`;
      report += `Tiempo de exploración: ${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}\n\n`;
    }

    // Emergency Triage
    if (medicalData.emergencyTriage.airwayObstruction) {
      report += 'TRIAGE DE EMERGENCIA ORL:\n';
      if (medicalData.emergencyTriage.airwayObstruction !== 'none') {
        report += `Obstrucción vía aérea: ${medicalData.emergencyTriage.airwayObstruction}\n`;
      }
      if (medicalData.emergencyTriage.stridor) {
        report += `Estridor: ${medicalData.emergencyTriage.stridor}\n`;
      }
      if (medicalData.emergencyTriage.massiveBleeding !== 'none') {
        report += `Sangrado: ${medicalData.emergencyTriage.massiveBleeding}\n`;
      }
      report += '\n';
    }

    // Anamnesis by systems
    let anamnesisAdded = false;
    
    if (Object.values(medicalData.anamnesis.auditory).some(v => typeof v === 'boolean' ? v : !!v)) {
      if (!anamnesisAdded) {
        report += 'ANAMNESIS POR APARATOS:\n';
        anamnesisAdded = true;
      }
      report += 'Sistema Auditivo:\n';
      if (medicalData.anamnesis.auditory.hearingLoss) {
        report += `- Hipoacusia: ${medicalData.anamnesis.auditory.hearingLossType} (${medicalData.anamnesis.auditory.hearingLossOnset})\n`;
      }
      if (medicalData.anamnesis.auditory.tinnitus) report += '- Acúfenos presentes\n';
      if (medicalData.anamnesis.auditory.vertigo) report += `- Vértigo (severidad: ${medicalData.anamnesis.auditory.vertigoSeverity})\n`;
    }

    if (Object.values(medicalData.anamnesis.nasal).some(Boolean)) {
      if (!anamnesisAdded) {
        report += 'ANAMNESIS POR APARATOS:\n';
        anamnesisAdded = true;
      }
      report += 'Sistema Nasal:\n';
      if (medicalData.anamnesis.nasal.nasalObstruction) report += '- Obstrucción nasal\n';
      if (medicalData.anamnesis.nasal.rhinorrhea) report += '- Rinorrea\n';
      if (medicalData.anamnesis.nasal.anosmia) report += '- Anosmia\n';
      if (medicalData.anamnesis.nasal.epistaxis) report += '- Epistaxis\n';
    }

    if (Object.values(medicalData.anamnesis.laryngeal).some(Boolean)) {
      if (!anamnesisAdded) {
        report += 'ANAMNESIS POR APARATOS:\n';
        anamnesisAdded = true;
      }
      report += 'Sistema Laríngeo:\n';
      if (medicalData.anamnesis.laryngeal.hoarseness) report += '- Disfonía\n';
      if (medicalData.anamnesis.laryngeal.dysphagia) report += '- Disfagia\n';
      if (medicalData.anamnesis.laryngeal.odynophagia) report += '- Odinofagia\n';
      if (medicalData.anamnesis.laryngeal.cough) report += '- Tos\n';
    }

    if (anamnesisAdded) report += '\n';

    // Physical Examination
    let physicalAdded = false;

    if (medicalData.physicalExam.otological.auricle.right || medicalData.physicalExam.otological.auricle.left) {
      if (!physicalAdded) {
        report += 'EXPLORACIÓN FÍSICA ORL:\n';
        physicalAdded = true;
      }
      report += 'Exploración Otológica:\n';
      if (medicalData.physicalExam.otological.auricle.right) {
        report += `Pabellón auricular derecho: ${medicalData.physicalExam.otological.auricle.right}\n`;
      }
      if (medicalData.physicalExam.otological.auricle.left) {
        report += `Pabellón auricular izquierdo: ${medicalData.physicalExam.otological.auricle.left}\n`;
      }
      if (medicalData.physicalExam.otological.hearingTests.weber) {
        report += `Weber: ${medicalData.physicalExam.otological.hearingTests.weber}\n`;
      }
    }

    if (medicalData.physicalExam.nasal.externalNose) {
      if (!physicalAdded) {
        report += 'EXPLORACIÓN FÍSICA ORL:\n';
        physicalAdded = true;
      }
      report += 'Exploración Nasal:\n';
      report += `Nariz externa: ${medicalData.physicalExam.nasal.externalNose}\n`;
      if (medicalData.physicalExam.nasal.rhinoscopy.septum) {
        report += `Septum: ${medicalData.physicalExam.nasal.rhinoscopy.septum}\n`;
      }
      if (medicalData.physicalExam.nasal.rhinoscopy.nasal_polyps) {
        report += 'Pólipos nasales presentes\n';
      }
    }

    if (physicalAdded) report += '\n';

    // Risk Assessment
    if (medicalData.specializedEvaluation.malignancyRisk.score > 0) {
      report += 'EVALUACIÓN DE RIESGO:\n';
      report += `Riesgo de Malignidad: ${medicalData.specializedEvaluation.malignancyRisk.score}% (${medicalData.specializedEvaluation.malignancyRisk.risk})\n`;
      
      if (medicalData.specializedEvaluation.sleepApneaRisk.score > 0) {
        report += `Riesgo de Apnea del Sueño: ${medicalData.specializedEvaluation.sleepApneaRisk.score}% (${medicalData.specializedEvaluation.sleepApneaRisk.risk})\n`;
      }
      report += '\n';
    }

    // Diagnostic Synthesis
    if (medicalData.diagnosticSynthesis.primaryDiagnosis) {
      report += 'SÍNTESIS DIAGNÓSTICA:\n';
      report += `Diagnóstico Principal: ${medicalData.diagnosticSynthesis.primaryDiagnosis}\n`;
      
      if (medicalData.diagnosticSynthesis.differentialDiagnoses.length > 0) {
        report += `Diagnósticos Diferenciales: ${medicalData.diagnosticSynthesis.differentialDiagnoses.join(', ')}\n`;
      }
      
      if (medicalData.diagnosticSynthesis.recommendedStudies.length > 0) {
        report += `Estudios Recomendados: ${medicalData.diagnosticSynthesis.recommendedStudies.join(', ')}\n`;
      }
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN CLÍNICO ORL:\n';
      report += `Estado: ${medicalData.orlStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} hallazgo(s) crítico(s) - Atención inmediata\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} hallazgo(s) de alarma - Seguimiento prioritario\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData, timeSpent]);

  useEffect(() => {
    calculateMalignancyRisk();
    calculateSleepApneaRisk();
    calculateStatus();
    generateReport();
  }, [calculateMalignancyRisk, calculateSleepApneaRisk, calculateStatus, generateReport]);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const sections = [
    { id: 'emergencyTriage', name: 'Triage ORL', icon: AlertTriangle, count: medicalData.emergencyTriage.airwayObstruction ? 1 : 0 },
    { id: 'auditorySystem', name: 'Sistema Auditivo', icon: Ear, count: Object.values(medicalData.anamnesis.auditory).filter(v => typeof v === 'boolean' ? v : !!v).length },
    { id: 'nasalSystem', name: 'Sistema Nasal', icon: Volume2, count: Object.values(medicalData.anamnesis.nasal).filter(Boolean).length },
    { id: 'laryngealSystem', name: 'Sistema Laríngeo', icon: Mic, count: Object.values(medicalData.anamnesis.laryngeal).filter(Boolean).length },
    { id: 'otological', name: 'Exploración Otológica', icon: Stethoscope, count: [medicalData.physicalExam.otological.auricle.right, medicalData.physicalExam.otological.auricle.left].filter(Boolean).length },
    { id: 'nasal', name: 'Exploración Nasal', icon: Search, count: medicalData.physicalExam.nasal.externalNose ? 1 : 0 },
    { id: 'laryngeal', name: 'Exploración Laríngea', icon: Eye, count: medicalData.physicalExam.laryngeal.externalLarynx ? 1 : 0 },
    { id: 'cervical', name: 'Exploración Cervical', icon: Target, count: Object.values(medicalData.physicalExam.cervical.lymphNodes).flat().filter(Boolean).length },
    { id: 'riskCalculators', name: 'Calculadoras', icon: Calculator, count: [medicalData.specializedEvaluation.malignancyRisk.factors.length, medicalData.specializedEvaluation.sleepApneaRisk.factors.length].filter(c => c > 0).length },
    { id: 'synthesis', name: 'Síntesis', icon: Brain, count: medicalData.diagnosticSynthesis.primaryDiagnosis ? 1 : 0 }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Ear className="h-12 w-12 text-blue-100" />
              <div>
                <h1 className="text-3xl font-bold">Otorrinolaringología</h1>
                <p className="text-blue-100">Sistema Optimizado 5 Fases</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso ORL</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">{formatTime(timeSpent)}</span>
                </div>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.orlStatus}</span>
                <span>Fase {currentPhase}/5</span>
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
                  <ShieldAlert className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700">{medicalData.warningCount}</div>
                  <div className="text-sm text-orange-600">Alarmas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">{medicalData.orlStatus}</div>
                  <div className="text-sm text-blue-600">Estado ORL</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Timer className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{formatTime(timeSpent)}</div>
                  <div className="text-sm text-green-600">Tiempo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
          >
            <Ear className="h-5 w-5 mr-2" />
            Iniciar Exploración ORL
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-blue-200 hover:bg-blue-50"
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
                    Reporte ORL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando reporte ORL...'}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full expanded view (similar structure to other components)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
      {/* Similar full view structure as GastroenterologyDemo but with ORL-specific content */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-blue-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Ear className="h-6 w-6" />
                Sistema ORL Completo - Desarrollo en Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Esta es una vista previa del sistema ORL. La interfaz completa expandida está en desarrollo.
                Por ahora, utiliza la vista compacta para acceder a todas las funcionalidades.
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

export default OtolaryngologyDemo;