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
  Calculator, 
  AlertTriangle,
  User,
  UserCheck,
  Activity,
  BarChart3,
  Gauge,
  Stethoscope,
  ClipboardCheck,
  TrendingUp,
  Timer,
  Heart,
  Eye,
  Hand,
  Thermometer,
  Search,
  Target,
  FileText,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  CheckCircle,
  Shield
} from "lucide-react";

interface UrologyDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface UrologyData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urologyStatus: string;

  // Gender-specific workflow
  gender: "male" | "female" | "";

  // General assessment
  generalAssessment: {
    mainComplaint: string;
    currentIllness: string;
    painScale: number;
    urinarySymptoms: {
      frequency: boolean;
      urgency: boolean;
      nocturia: boolean;
      dysuria: boolean;
      hematuria: boolean;
      incontinence: boolean;
      retention: boolean;
    };
    sexualSymptoms: {
      erectileDysfunction: boolean;
      decreased_libido: boolean;
      ejaculatory_disorders: boolean;
      infertility: boolean;
    };
  };

  // Male-specific examination
  maleExam: {
    penisInspection: {
      lesions: boolean;
      phimosis: boolean;
      meatusPosition: string;
      discharge: boolean;
    };
    scrotumInspection: {
      asymmetry: boolean;
      lesions: boolean;
      edema: boolean;
    };
    testicular: {
      right: {
        size: string;
        consistency: string;
        tenderness: boolean;
        mass: boolean;
      };
      left: {
        size: string;
        consistency: string;
        tenderness: boolean;
        mass: boolean;
      };
    };
    varicocele: {
      grade: number;
      side: string;
    };
    prostateExam: {
      size: string;
      consistency: string;
      surface: string;
      nodules: boolean;
      tenderness: boolean;
      symmetry: boolean;
    };
  };

  // Female-specific examination
  femaleExam: {
    externalGenitalia: {
      vulva: string;
      urethralMeatus: string;
      vaginalIntroitus: string;
    };
    pelvicOrganProlapse: {
      cystocele: number;
      rectocele: number;
      uterineProlapse: number;
    };
    stressTest: {
      performed: boolean;
      positive: boolean;
      severity: string;
    };
    pelvicFloorAssessment: {
      strength: number;
      endurance: number;
      coordination: string;
    };
  };

  // Clinical scales and calculators
  clinicalScales: {
    ipss: {
      factors: string[];
      score: number;
      severity: string;
    };
    iciq: {
      factors: string[];
      score: number;
      impact: string;
    };
    iief5: {
      factors: string[];
      score: number;
      severity: string;
    };
    prostate_volume: {
      measurements: {
        length: number;
        width: number;
        height: number;
      };
      volume: number;
      classification: string;
    };
  };

  // Diagnostic workup
  diagnosticWorkup: {
    urinalysis: {
      performed: boolean;
      results: {
        proteins: string;
        blood: string;
        leukocytes: string;
        nitrites: boolean;
        bacteria: string;
      };
    };
    imaging: {
      ultrasound: boolean;
      ct_scan: boolean;
      mri: boolean;
      findings: string;
    };
    urodynamics: {
      performed: boolean;
      results: string;
    };
  };
}

const UrologyDemo: React.FC<UrologyDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));

  // Medical Data State
  const [medicalData, setMedicalData] = useState<UrologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 9,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urologyStatus: 'Normal',

    gender: "",

    generalAssessment: {
      mainComplaint: '',
      currentIllness: '',
      painScale: 0,
      urinarySymptoms: {
        frequency: false,
        urgency: false,
        nocturia: false,
        dysuria: false,
        hematuria: false,
        incontinence: false,
        retention: false
      },
      sexualSymptoms: {
        erectileDysfunction: false,
        decreased_libido: false,
        ejaculatory_disorders: false,
        infertility: false
      }
    },

    maleExam: {
      penisInspection: {
        lesions: false,
        phimosis: false,
        meatusPosition: '',
        discharge: false
      },
      scrotumInspection: {
        asymmetry: false,
        lesions: false,
        edema: false
      },
      testicular: {
        right: { size: '', consistency: '', tenderness: false, mass: false },
        left: { size: '', consistency: '', tenderness: false, mass: false }
      },
      varicocele: {
        grade: 0,
        side: ''
      },
      prostateExam: {
        size: '',
        consistency: '',
        surface: '',
        nodules: false,
        tenderness: false,
        symmetry: true
      }
    },

    femaleExam: {
      externalGenitalia: {
        vulva: '',
        urethralMeatus: '',
        vaginalIntroitus: ''
      },
      pelvicOrganProlapse: {
        cystocele: 0,
        rectocele: 0,
        uterineProlapse: 0
      },
      stressTest: {
        performed: false,
        positive: false,
        severity: ''
      },
      pelvicFloorAssessment: {
        strength: 0,
        endurance: 0,
        coordination: ''
      }
    },

    clinicalScales: {
      ipss: {
        factors: [],
        score: 0,
        severity: ''
      },
      iciq: {
        factors: [],
        score: 0,
        impact: ''
      },
      iief5: {
        factors: [],
        score: 0,
        severity: ''
      },
      prostate_volume: {
        measurements: { length: 0, width: 0, height: 0 },
        volume: 0,
        classification: ''
      }
    },

    diagnosticWorkup: {
      urinalysis: {
        performed: false,
        results: {
          proteins: '',
          blood: '',
          leukocytes: '',
          nitrites: false,
          bacteria: ''
        }
      },
      imaging: {
        ultrasound: false,
        ct_scan: false,
        mri: false,
        findings: ''
      },
      urodynamics: {
        performed: false,
        results: ''
      }
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Calculate IPSS Score (International Prostate Symptom Score)
  const calculateIPSS = useCallback(() => {
    let score = 0;
    const factors = medicalData.clinicalScales.ipss.factors;

    // Each IPSS question is scored 0-5
    factors.forEach(factor => {
      const match = factor.match(/(\d+)$/);
      if (match) {
        score += parseInt(match[1]);
      }
    });

    let severity = '';
    if (score <= 7) severity = 'Síntomas leves';
    else if (score <= 19) severity = 'Síntomas moderados';
    else severity = 'Síntomas severos';

    setMedicalData(prev => ({
      ...prev,
      clinicalScales: {
        ...prev.clinicalScales,
        ipss: {
          ...prev.clinicalScales.ipss,
          score,
          severity
        }
      }
    }));
  }, [medicalData.clinicalScales.ipss.factors]);

  // Calculate IIEF-5 Score (International Index of Erectile Function)
  const calculateIIEF5 = useCallback(() => {
    let score = 0;
    const factors = medicalData.clinicalScales.iief5.factors;

    factors.forEach(factor => {
      const match = factor.match(/(\d+)$/);
      if (match) {
        score += parseInt(match[1]);
      }
    });

    let severity = '';
    if (score >= 22) severity = 'Normal';
    else if (score >= 17) severity = 'Disfunción leve';
    else if (score >= 12) severity = 'Disfunción leve-moderada';
    else if (score >= 8) severity = 'Disfunción moderada';
    else severity = 'Disfunción severa';

    setMedicalData(prev => ({
      ...prev,
      clinicalScales: {
        ...prev.clinicalScales,
        iief5: {
          ...prev.clinicalScales.iief5,
          score,
          severity
        }
      }
    }));
  }, [medicalData.clinicalScales.iief5.factors]);

  // Calculate prostate volume
  const calculateProstateVolume = useCallback(() => {
    const { length, width, height } = medicalData.clinicalScales.prostate_volume.measurements;
    
    if (length > 0 && width > 0 && height > 0) {
      // Ellipsoid formula: (π/6) × length × width × height
      const volume = Math.round((Math.PI / 6) * length * width * height);
      
      let classification = '';
      if (volume <= 20) classification = 'Normal';
      else if (volume <= 40) classification = 'Levemente aumentada';
      else if (volume <= 80) classification = 'Moderadamente aumentada';
      else classification = 'Severamente aumentada';

      setMedicalData(prev => ({
        ...prev,
        clinicalScales: {
          ...prev.clinicalScales,
          prostate_volume: {
            ...prev.clinicalScales.prostate_volume,
            volume,
            classification
          }
        }
      }));
    }
  }, [medicalData.clinicalScales.prostate_volume.measurements]);

  // Calculate status and alerts
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urologyStatus = 'Normal';

    // Check critical conditions
    if (medicalData.generalAssessment.urinarySymptoms.hematuria) {
      alertCount++;
      urologyStatus = 'Crítico';
    }

    if (medicalData.generalAssessment.urinarySymptoms.retention) {
      alertCount++;
      urologyStatus = 'Crítico';
    }

    // Check testicular masses
    if (medicalData.maleExam.testicular.right.mass || medicalData.maleExam.testicular.left.mass) {
      alertCount++;
      urologyStatus = 'Crítico';
    }

    // Check prostate nodules
    if (medicalData.maleExam.prostateExam.nodules) {
      warningCount++;
      if (urologyStatus === 'Normal') urologyStatus = 'Sospechoso';
    }

    // Calculate progress
    let completedSections = 0;
    if (medicalData.gender) completedSections++;
    if (medicalData.generalAssessment.mainComplaint) completedSections++;
    if (Object.values(medicalData.generalAssessment.urinarySymptoms).some(Boolean)) completedSections++;
    if (medicalData.gender === 'male' && medicalData.maleExam.penisInspection.meatusPosition) completedSections++;
    if (medicalData.gender === 'female' && medicalData.femaleExam.externalGenitalia.vulva) completedSections++;
    if (medicalData.clinicalScales.ipss.factors.length > 0) completedSections++;
    if (medicalData.diagnosticWorkup.urinalysis.performed) completedSections++;

    const examProgress = Math.round((completedSections / 9) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      urologyStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'INFORME UROLÓGICO\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n`;
      if (medicalData.gender) {
        report += `Género: ${medicalData.gender === 'male' ? 'Masculino' : 'Femenino'}\n`;
      }
      report += '\n';
    }

    // General Assessment
    if (medicalData.generalAssessment.mainComplaint) {
      report += 'EVALUACIÓN GENERAL:\n';
      report += `Motivo de consulta: ${medicalData.generalAssessment.mainComplaint}\n`;
      
      if (medicalData.generalAssessment.painScale > 0) {
        report += `Escala de dolor: ${medicalData.generalAssessment.painScale}/10\n`;
      }

      const urinarySymptoms = Object.entries(medicalData.generalAssessment.urinarySymptoms)
        .filter(([_, present]) => present)
        .map(([symptom, _]) => symptom);

      if (urinarySymptoms.length > 0) {
        report += `Síntomas urinarios: ${urinarySymptoms.join(', ')}\n`;
      }
      report += '\n';
    }

    // Gender-specific examination
    if (medicalData.gender === 'male' && medicalData.maleExam.penisInspection.meatusPosition) {
      report += 'EXPLORACIÓN MASCULINA:\n';
      
      if (medicalData.maleExam.penisInspection.meatusPosition) {
        report += `Inspección genital: Meato ${medicalData.maleExam.penisInspection.meatusPosition}\n`;
      }
      
      if (medicalData.maleExam.penisInspection.phimosis) {
        report += 'Fimosis presente\n';
      }

      if (medicalData.maleExam.testicular.right.size || medicalData.maleExam.testicular.left.size) {
        report += 'Exploración testicular:\n';
        if (medicalData.maleExam.testicular.right.size) {
          report += `  Testículo derecho: ${medicalData.maleExam.testicular.right.size}, ${medicalData.maleExam.testicular.right.consistency}\n`;
          if (medicalData.maleExam.testicular.right.mass) report += '  ⚠️ MASA TESTICULAR DERECHA\n';
        }
        if (medicalData.maleExam.testicular.left.size) {
          report += `  Testículo izquierdo: ${medicalData.maleExam.testicular.left.size}, ${medicalData.maleExam.testicular.left.consistency}\n`;
          if (medicalData.maleExam.testicular.left.mass) report += '  ⚠️ MASA TESTICULAR IZQUIERDA\n';
        }
      }

      if (medicalData.maleExam.prostateExam.size) {
        report += `Tacto rectal: Próstata ${medicalData.maleExam.prostateExam.size}, ${medicalData.maleExam.prostateExam.consistency}\n`;
        if (medicalData.maleExam.prostateExam.nodules) {
          report += '⚠️ NÓDULOS PROSTÁTICOS PRESENTES\n';
        }
      }

      if (medicalData.maleExam.varicocele.grade > 0) {
        report += `Varicocele grado ${medicalData.maleExam.varicocele.grade} (${medicalData.maleExam.varicocele.side})\n`;
      }

      report += '\n';
    }

    if (medicalData.gender === 'female' && medicalData.femaleExam.externalGenitalia.vulva) {
      report += 'EXPLORACIÓN FEMENINA:\n';
      
      if (medicalData.femaleExam.externalGenitalia.vulva) {
        report += `Genitales externos: ${medicalData.femaleExam.externalGenitalia.vulva}\n`;
      }

      const prolapses = [];
      if (medicalData.femaleExam.pelvicOrganProlapse.cystocele > 0) {
        prolapses.push(`Cistocele grado ${medicalData.femaleExam.pelvicOrganProlapse.cystocele}`);
      }
      if (medicalData.femaleExam.pelvicOrganProlapse.rectocele > 0) {
        prolapses.push(`Rectocele grado ${medicalData.femaleExam.pelvicOrganProlapse.rectocele}`);
      }
      if (medicalData.femaleExam.pelvicOrganProlapse.uterineProlapse > 0) {
        prolapses.push(`Prolapso uterino grado ${medicalData.femaleExam.pelvicOrganProlapse.uterineProlapse}`);
      }

      if (prolapses.length > 0) {
        report += `Prolapsos: ${prolapses.join(', ')}\n`;
      }

      if (medicalData.femaleExam.stressTest.performed) {
        report += `Test de esfuerzo: ${medicalData.femaleExam.stressTest.positive ? 'Positivo' : 'Negativo'}\n`;
      }

      if (medicalData.femaleExam.pelvicFloorAssessment.strength > 0) {
        report += `Fuerza suelo pélvico: ${medicalData.femaleExam.pelvicFloorAssessment.strength}/5\n`;
      }

      report += '\n';
    }

    // Clinical Scales
    let scalesAdded = false;
    if (medicalData.clinicalScales.ipss.score > 0) {
      if (!scalesAdded) {
        report += 'ESCALAS CLÍNICAS:\n';
        scalesAdded = true;
      }
      report += `IPSS: ${medicalData.clinicalScales.ipss.score}/35 puntos - ${medicalData.clinicalScales.ipss.severity}\n`;
    }

    if (medicalData.clinicalScales.iief5.score > 0) {
      if (!scalesAdded) {
        report += 'ESCALAS CLÍNICAS:\n';
        scalesAdded = true;
      }
      report += `IIEF-5: ${medicalData.clinicalScales.iief5.score}/25 puntos - ${medicalData.clinicalScales.iief5.severity}\n`;
    }

    if (medicalData.clinicalScales.prostate_volume.volume > 0) {
      if (!scalesAdded) {
        report += 'MEDICIONES:\n';
      } else {
        report += '\nMEDICIONES:\n';
      }
      report += `Volumen prostático: ${medicalData.clinicalScales.prostate_volume.volume} cc (${medicalData.clinicalScales.prostate_volume.classification})\n`;
    }

    if (scalesAdded) report += '\n';

    // Diagnostic Workup
    if (medicalData.diagnosticWorkup.urinalysis.performed) {
      report += 'ESTUDIOS COMPLEMENTARIOS:\n';
      report += 'Uroanálisis:\n';
      const { results } = medicalData.diagnosticWorkup.urinalysis;
      if (results.proteins) report += `  Proteínas: ${results.proteins}\n`;
      if (results.blood) report += `  Sangre: ${results.blood}\n`;
      if (results.leukocytes) report += `  Leucocitos: ${results.leukocytes}\n`;
      if (results.nitrites) report += '  Nitritos: Positivos\n';
      
      if (medicalData.diagnosticWorkup.imaging.ultrasound || 
          medicalData.diagnosticWorkup.imaging.ct_scan || 
          medicalData.diagnosticWorkup.imaging.mri) {
        
        const studies = [];
        if (medicalData.diagnosticWorkup.imaging.ultrasound) studies.push('Ecografía');
        if (medicalData.diagnosticWorkup.imaging.ct_scan) studies.push('TC');
        if (medicalData.diagnosticWorkup.imaging.mri) studies.push('RM');
        
        report += `Estudios de imagen: ${studies.join(', ')}\n`;
        if (medicalData.diagnosticWorkup.imaging.findings) {
          report += `Hallazgos: ${medicalData.diagnosticWorkup.imaging.findings}\n`;
        }
      }
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN CLÍNICO:\n';
      report += `Estado urológico: ${medicalData.urologyStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} hallazgo(s) crítico(s) - Evaluación urgente\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} hallazgo(s) sospechoso(s) - Seguimiento necesario\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData]);

  useEffect(() => {
    calculateIPSS();
    calculateIIEF5();
    calculateProstateVolume();
    calculateStatus();
    generateReport();
  }, [calculateIPSS, calculateIIEF5, calculateProstateVolume, calculateStatus, generateReport]);

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
    { id: 'general', name: 'Evaluación General', icon: User, count: medicalData.generalAssessment.mainComplaint ? 1 : 0 },
    { id: 'gender', name: 'Selección Género', icon: Users, count: medicalData.gender ? 1 : 0 },
    { id: 'urinarySymptoms', name: 'Síntomas Urinarios', icon: AlertTriangle, count: Object.values(medicalData.generalAssessment.urinarySymptoms).filter(Boolean).length },
    { id: 'maleExam', name: 'Exploración Masculina', icon: UserCheck, count: medicalData.gender === 'male' && medicalData.maleExam.penisInspection.meatusPosition ? 1 : 0 },
    { id: 'femaleExam', name: 'Exploración Femenina', icon: Users, count: medicalData.gender === 'female' && medicalData.femaleExam.externalGenitalia.vulva ? 1 : 0 },
    { id: 'clinicalScales', name: 'Escalas Clínicas', icon: Calculator, count: [medicalData.clinicalScales.ipss.factors.length, medicalData.clinicalScales.iief5.factors.length].filter(c => c > 0).length },
    { id: 'prostate', name: 'Evaluación Prostática', icon: Target, count: medicalData.maleExam.prostateExam.size ? 1 : 0 },
    { id: 'diagnosticWorkup', name: 'Estudios', icon: Search, count: medicalData.diagnosticWorkup.urinalysis.performed ? 1 : 0 }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-12 w-12 text-cyan-100" />
              <div>
                <h1 className="text-3xl font-bold">Urología</h1>
                <p className="text-cyan-100">Sistema por Género con Escalas IPSS/IIEF</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso Urológico</span>
                <span className="text-sm font-bold">{medicalData.examProgress}%</span>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.urologyStatus}</span>
                <span>Género: {medicalData.gender || 'No seleccionado'}</span>
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
                  <div className="text-sm text-orange-600">Sospechosos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-700">{medicalData.urologyStatus}</div>
                  <div className="text-sm text-cyan-600">Estado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-teal-700">{medicalData.gender || 'N/A'}</div>
                  <div className="text-sm text-teal-600">Género</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-medium"
          >
            <Shield className="h-5 w-5 mr-2" />
            Iniciar Evaluación Urológica
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-cyan-200 hover:bg-cyan-50"
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
                    Reporte Urológico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando reporte urológico...'}
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-900 to-blue-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-cyan-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Sistema Urológico Completo - En Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Vista expandida completa en desarrollo. Utiliza la vista compacta para acceder a todas las funcionalidades.
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

export default UrologyDemo;