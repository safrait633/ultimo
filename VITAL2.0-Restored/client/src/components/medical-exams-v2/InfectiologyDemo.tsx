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
  Shield,
  AlertTriangle,
  Activity,
  Thermometer,
  Zap,
  Target,
  CheckCircle,
  Calculator,
  Brain,
  FileText,
  TrendingUp,
  Search,
  Timer,
  Users,
  User,
  Eye,
  Hand,
  Heart,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Microscope,
  Siren,
  Pill
} from "lucide-react";

interface InfectiologyDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface InfectiologyData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  infectiousStatus: string;

  // Initial Assessment and Triage
  initialAssessment: {
    fever: {
      present: boolean;
      temperature: number;
      pattern: string;
      duration: string;
    };
    sepsis_screening: {
      sirs_criteria: string[];
      qsofa_criteria: string[];
      lactate_level: number;
      sepsis_risk: string;
    };
    immunocompromised: {
      status: boolean;
      causes: string[];
      severity: string;
    };
  };

  // Infectious Syndromes
  infectiousSyndromes: {
    respiratory: {
      pneumonia: boolean;
      bronchitis: boolean;
      tuberculosis_risk: boolean;
      covid_risk: boolean;
      symptoms: string[];
    };
    urogenital: {
      uti: boolean;
      pyelonephritis: boolean;
      sexually_transmitted: boolean;
      symptoms: string[];
    };
    gastrointestinal: {
      gastroenteritis: boolean;
      hepatitis: boolean;
      c_difficile_risk: boolean;
      symptoms: string[];
    };
    skin_soft_tissue: {
      cellulitis: boolean;
      abscess: boolean;
      necrotizing_fasciitis_risk: boolean;
      wound_infection: boolean;
      symptoms: string[];
    };
    central_nervous_system: {
      meningitis: boolean;
      encephalitis: boolean;
      brain_abscess: boolean;
      symptoms: string[];
    };
    bloodstream: {
      bacteremia: boolean;
      endocarditis: boolean;
      catheter_related: boolean;
      source: string;
    };
  };

  // Epidemiological Assessment
  epidemiologicalAssessment: {
    travel_history: {
      recent_travel: boolean;
      destinations: string[];
      tropical_disease_risk: string[];
    };
    exposure_history: {
      healthcare_exposure: boolean;
      animal_exposure: boolean;
      food_exposure: boolean;
      water_exposure: boolean;
      details: string;
    };
    outbreak_investigation: {
      cluster_case: boolean;
      nosocomial_infection: boolean;
      contact_tracing_needed: boolean;
    };
  };

  // Physical Examination
  physicalExamination: {
    vital_signs: {
      temperature: number;
      heart_rate: number;
      respiratory_rate: number;
      blood_pressure: { systolic: number; diastolic: number };
      oxygen_saturation: number;
    };
    general_appearance: {
      toxic_appearance: boolean;
      altered_mental_status: boolean;
      dehydration: string;
      shock_signs: boolean;
    };
    focused_examination: {
      lymphadenopathy: boolean;
      rash: {
        present: boolean;
        type: string;
        distribution: string;
      };
      hepatosplenomegaly: boolean;
      focal_findings: string[];
    };
  };

  // Diagnostic Workup
  diagnosticWorkup: {
    laboratory: {
      complete_blood_count: {
        leukocytes: number;
        neutrophils: number;
        lymphocytes: number;
        interpretation: string;
      };
      inflammatory_markers: {
        crp: number;
        esr: number;
        procalcitonin: number;
      };
      cultures: {
        blood_culture: boolean;
        urine_culture: boolean;
        sputum_culture: boolean;
        wound_culture: boolean;
        csf_culture: boolean;
      };
      serology: {
        hiv: string;
        hepatitis: string;
        other: string[];
      };
    };
    imaging: {
      chest_xray: boolean;
      ct_scan: boolean;
      ultrasound: boolean;
      findings: string;
    };
  };

  // Risk Stratification
  riskStratification: {
    severity_scores: {
      sirs: {
        criteria: string[];
        score: number;
      };
      qsofa: {
        criteria: string[];
        score: number;
        mortality_risk: string;
      };
      curb65: {
        criteria: string[];
        score: number;
        severity: string;
      };
    };
    antimicrobial_stewardship: {
      indication_appropriate: boolean;
      duration_planned: number;
      de_escalation_planned: boolean;
      resistance_risk: string;
    };
  };

  // Treatment Planning
  treatmentPlanning: {
    antimicrobial_therapy: {
      empirical_therapy: string;
      targeted_therapy: string;
      duration: number;
      route: string;
    };
    supportive_care: {
      fluid_resuscitation: boolean;
      vasopressors: boolean;
      oxygen_therapy: boolean;
      isolation_precautions: string;
    };
    monitoring: {
      clinical_response: string;
      laboratory_monitoring: string[];
      adverse_effects: string[];
    };
  };
}

const InfectiologyDemo: React.FC<InfectiologyDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['initial']));

  // Medical Data State
  const [medicalData, setMedicalData] = useState<InfectiologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 9,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    infectiousStatus: 'Sin fiebre',

    initialAssessment: {
      fever: {
        present: false,
        temperature: 0,
        pattern: '',
        duration: ''
      },
      sepsis_screening: {
        sirs_criteria: [],
        qsofa_criteria: [],
        lactate_level: 0,
        sepsis_risk: ''
      },
      immunocompromised: {
        status: false,
        causes: [],
        severity: ''
      }
    },

    infectiousSyndromes: {
      respiratory: {
        pneumonia: false,
        bronchitis: false,
        tuberculosis_risk: false,
        covid_risk: false,
        symptoms: []
      },
      urogenital: {
        uti: false,
        pyelonephritis: false,
        sexually_transmitted: false,
        symptoms: []
      },
      gastrointestinal: {
        gastroenteritis: false,
        hepatitis: false,
        c_difficile_risk: false,
        symptoms: []
      },
      skin_soft_tissue: {
        cellulitis: false,
        abscess: false,
        necrotizing_fasciitis_risk: false,
        wound_infection: false,
        symptoms: []
      },
      central_nervous_system: {
        meningitis: false,
        encephalitis: false,
        brain_abscess: false,
        symptoms: []
      },
      bloodstream: {
        bacteremia: false,
        endocarditis: false,
        catheter_related: false,
        source: ''
      }
    },

    epidemiologicalAssessment: {
      travel_history: {
        recent_travel: false,
        destinations: [],
        tropical_disease_risk: []
      },
      exposure_history: {
        healthcare_exposure: false,
        animal_exposure: false,
        food_exposure: false,
        water_exposure: false,
        details: ''
      },
      outbreak_investigation: {
        cluster_case: false,
        nosocomial_infection: false,
        contact_tracing_needed: false
      }
    },

    physicalExamination: {
      vital_signs: {
        temperature: 0,
        heart_rate: 0,
        respiratory_rate: 0,
        blood_pressure: { systolic: 0, diastolic: 0 },
        oxygen_saturation: 0
      },
      general_appearance: {
        toxic_appearance: false,
        altered_mental_status: false,
        dehydration: '',
        shock_signs: false
      },
      focused_examination: {
        lymphadenopathy: false,
        rash: {
          present: false,
          type: '',
          distribution: ''
        },
        hepatosplenomegaly: false,
        focal_findings: []
      }
    },

    diagnosticWorkup: {
      laboratory: {
        complete_blood_count: {
          leukocytes: 0,
          neutrophils: 0,
          lymphocytes: 0,
          interpretation: ''
        },
        inflammatory_markers: {
          crp: 0,
          esr: 0,
          procalcitonin: 0
        },
        cultures: {
          blood_culture: false,
          urine_culture: false,
          sputum_culture: false,
          wound_culture: false,
          csf_culture: false
        },
        serology: {
          hiv: '',
          hepatitis: '',
          other: []
        }
      },
      imaging: {
        chest_xray: false,
        ct_scan: false,
        ultrasound: false,
        findings: ''
      }
    },

    riskStratification: {
      severity_scores: {
        sirs: {
          criteria: [],
          score: 0
        },
        qsofa: {
          criteria: [],
          score: 0,
          mortality_risk: ''
        },
        curb65: {
          criteria: [],
          score: 0,
          severity: ''
        }
      },
      antimicrobial_stewardship: {
        indication_appropriate: false,
        duration_planned: 0,
        de_escalation_planned: false,
        resistance_risk: ''
      }
    },

    treatmentPlanning: {
      antimicrobial_therapy: {
        empirical_therapy: '',
        targeted_therapy: '',
        duration: 0,
        route: ''
      },
      supportive_care: {
        fluid_resuscitation: false,
        vasopressors: false,
        oxygen_therapy: false,
        isolation_precautions: ''
      },
      monitoring: {
        clinical_response: '',
        laboratory_monitoring: [],
        adverse_effects: []
      }
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Calculate SIRS Score
  const calculateSIRS = useCallback(() => {
    const criteria = medicalData.riskStratification.severity_scores.sirs.criteria;
    const score = criteria.length;

    setMedicalData(prev => ({
      ...prev,
      riskStratification: {
        ...prev.riskStratification,
        severity_scores: {
          ...prev.riskStratification.severity_scores,
          sirs: {
            ...prev.riskStratification.severity_scores.sirs,
            score
          }
        }
      }
    }));
  }, [medicalData.riskStratification.severity_scores.sirs.criteria]);

  // Calculate qSOFA Score
  const calculateQSOFA = useCallback(() => {
    const criteria = medicalData.riskStratification.severity_scores.qsofa.criteria;
    const score = criteria.length;
    
    let mortality_risk = '';
    if (score === 0) mortality_risk = 'Bajo riesgo (<3%)';
    else if (score === 1) mortality_risk = 'Riesgo intermedio (3-14%)';
    else mortality_risk = 'Alto riesgo (>14%)';

    setMedicalData(prev => ({
      ...prev,
      riskStratification: {
        ...prev.riskStratification,
        severity_scores: {
          ...prev.riskStratification.severity_scores,
          qsofa: {
            ...prev.riskStratification.severity_scores.qsofa,
            score,
            mortality_risk
          }
        }
      }
    }));
  }, [medicalData.riskStratification.severity_scores.qsofa.criteria]);

  // Calculate CURB-65 Score
  const calculateCURB65 = useCallback(() => {
    const criteria = medicalData.riskStratification.severity_scores.curb65.criteria;
    const score = criteria.length;
    
    let severity = '';
    if (score === 0) severity = 'Bajo riesgo - Ambulatorio';
    else if (score <= 1) severity = 'Riesgo intermedio - Hospitalización';
    else if (score === 2) severity = 'Hospitalización o UCI corta';
    else severity = 'UCI - Alto riesgo de mortalidad';

    setMedicalData(prev => ({
      ...prev,
      riskStratification: {
        ...prev.riskStratification,
        severity_scores: {
          ...prev.riskStratification.severity_scores,
          curb65: {
            ...prev.riskStratification.severity_scores.curb65,
            score,
            severity
          }
        }
      }
    }));
  }, [medicalData.riskStratification.severity_scores.curb65.criteria]);

  // Calculate status and alerts
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let infectiousStatus = 'Sin fiebre';

    // Check fever
    if (medicalData.initialAssessment.fever.present) {
      if (medicalData.initialAssessment.fever.temperature >= 38.5) {
        infectiousStatus = 'Fiebre alta';
        warningCount++;
      } else {
        infectiousStatus = 'Febril';
        findingCount++;
      }
    }

    // Check sepsis risk
    if (medicalData.riskStratification.severity_scores.qsofa.score >= 2) {
      alertCount++;
      infectiousStatus = 'Sepsis probable';
    } else if (medicalData.riskStratification.severity_scores.sirs.score >= 2) {
      warningCount++;
      if (!infectiousStatus.includes('Sepsis')) infectiousStatus = 'SIRS';
    }

    // Check critical infections
    const criticalInfections = [
      medicalData.infectiousSyndromes.central_nervous_system.meningitis,
      medicalData.infectiousSyndromes.central_nervous_system.encephalitis,
      medicalData.infectiousSyndromes.skin_soft_tissue.necrotizing_fasciitis_risk,
      medicalData.physicalExamination.general_appearance.toxic_appearance
    ];

    criticalInfections.forEach(condition => {
      if (condition) {
        alertCount++;
        infectiousStatus = 'Crítico';
      }
    });

    // Check immunocompromised status
    if (medicalData.initialAssessment.immunocompromised.status) {
      warningCount++;
      if (infectiousStatus === 'Sin fiebre') infectiousStatus = 'Inmunodeprimido';
    }

    // Calculate progress
    let completedSections = 0;
    if (medicalData.initialAssessment.fever.present !== undefined) completedSections++;
    if (Object.values(medicalData.infectiousSyndromes.respiratory).some(Boolean)) completedSections++;
    if (medicalData.physicalExamination.vital_signs.temperature > 0) completedSections++;
    if (Object.values(medicalData.diagnosticWorkup.laboratory.cultures).some(Boolean)) completedSections++;
    if (medicalData.riskStratification.severity_scores.qsofa.criteria.length > 0) completedSections++;
    if (medicalData.epidemiologicalAssessment.travel_history.recent_travel !== undefined) completedSections++;
    if (medicalData.treatmentPlanning.antimicrobial_therapy.empirical_therapy) completedSections++;

    const examProgress = Math.round((completedSections / 9) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      infectiousStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'INFORME INFECTOLÓGICO\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    }

    // Initial Assessment
    if (medicalData.initialAssessment.fever.present) {
      report += 'EVALUACIÓN INICIAL:\n';
      report += `Fiebre: ${medicalData.initialAssessment.fever.temperature}°C\n`;
      if (medicalData.initialAssessment.fever.pattern) {
        report += `Patrón febril: ${medicalData.initialAssessment.fever.pattern}\n`;
      }
      if (medicalData.initialAssessment.fever.duration) {
        report += `Duración: ${medicalData.initialAssessment.fever.duration}\n`;
      }
      
      if (medicalData.initialAssessment.immunocompromised.status) {
        report += 'PACIENTE INMUNODEPRIMIDO\n';
        if (medicalData.initialAssessment.immunocompromised.causes.length > 0) {
          report += `Causas: ${medicalData.initialAssessment.immunocompromised.causes.join(', ')}\n`;
        }
      }
      report += '\n';
    }

    // Infectious Syndromes
    const syndromes = [];
    if (medicalData.infectiousSyndromes.respiratory.pneumonia) syndromes.push('Neumonía');
    if (medicalData.infectiousSyndromes.urogenital.uti) syndromes.push('ITU');
    if (medicalData.infectiousSyndromes.gastrointestinal.gastroenteritis) syndromes.push('Gastroenteritis');
    if (medicalData.infectiousSyndromes.skin_soft_tissue.cellulitis) syndromes.push('Celulitis');
    if (medicalData.infectiousSyndromes.central_nervous_system.meningitis) syndromes.push('Meningitis');
    if (medicalData.infectiousSyndromes.bloodstream.bacteremia) syndromes.push('Bacteriemia');

    if (syndromes.length > 0) {
      report += 'SÍNDROMES INFECCIOSOS:\n';
      syndromes.forEach(syndrome => {
        report += `• ${syndrome}\n`;
      });
      report += '\n';
    }

    // Physical Examination
    if (medicalData.physicalExamination.vital_signs.temperature > 0) {
      report += 'EXPLORACIÓN FÍSICA:\n';
      report += `Temperatura: ${medicalData.physicalExamination.vital_signs.temperature}°C\n`;
      if (medicalData.physicalExamination.vital_signs.heart_rate > 0) {
        report += `FC: ${medicalData.physicalExamination.vital_signs.heart_rate} lpm\n`;
      }
      if (medicalData.physicalExamination.vital_signs.respiratory_rate > 0) {
        report += `FR: ${medicalData.physicalExamination.vital_signs.respiratory_rate} rpm\n`;
      }
      
      if (medicalData.physicalExamination.general_appearance.toxic_appearance) {
        report += '⚠️ ASPECTO TÓXICO\n';
      }
      if (medicalData.physicalExamination.general_appearance.altered_mental_status) {
        report += '⚠️ ALTERACIÓN DEL ESTADO MENTAL\n';
      }
      
      if (medicalData.physicalExamination.focused_examination.rash.present) {
        report += `Exantema: ${medicalData.physicalExamination.focused_examination.rash.type}\n`;
      }
      if (medicalData.physicalExamination.focused_examination.lymphadenopathy) {
        report += 'Linfadenopatía presente\n';
      }
      report += '\n';
    }

    // Laboratory Results
    if (medicalData.diagnosticWorkup.laboratory.complete_blood_count.leukocytes > 0) {
      report += 'RESULTADOS DE LABORATORIO:\n';
      report += `Leucocitos: ${medicalData.diagnosticWorkup.laboratory.complete_blood_count.leukocytes} /μL\n`;
      if (medicalData.diagnosticWorkup.laboratory.complete_blood_count.interpretation) {
        report += `Interpretación: ${medicalData.diagnosticWorkup.laboratory.complete_blood_count.interpretation}\n`;
      }
      
      if (medicalData.diagnosticWorkup.laboratory.inflammatory_markers.crp > 0) {
        report += `PCR: ${medicalData.diagnosticWorkup.laboratory.inflammatory_markers.crp} mg/L\n`;
      }
      if (medicalData.diagnosticWorkup.laboratory.inflammatory_markers.procalcitonin > 0) {
        report += `Procalcitonina: ${medicalData.diagnosticWorkup.laboratory.inflammatory_markers.procalcitonin} ng/mL\n`;
      }
      
      const cultures = Object.entries(medicalData.diagnosticWorkup.laboratory.cultures)
        .filter(([_, ordered]) => ordered)
        .map(([culture, _]) => culture.replace('_', ' '));
      
      if (cultures.length > 0) {
        report += `Cultivos solicitados: ${cultures.join(', ')}\n`;
      }
      report += '\n';
    }

    // Risk Stratification
    if (medicalData.riskStratification.severity_scores.qsofa.score > 0 || 
        medicalData.riskStratification.severity_scores.sirs.score > 0) {
      report += 'ESTRATIFICACIÓN DE RIESGO:\n';
      
      if (medicalData.riskStratification.severity_scores.sirs.score > 0) {
        report += `SIRS: ${medicalData.riskStratification.severity_scores.sirs.score}/4 criterios\n`;
      }
      
      if (medicalData.riskStratification.severity_scores.qsofa.score > 0) {
        report += `qSOFA: ${medicalData.riskStratification.severity_scores.qsofa.score}/3 puntos\n`;
        report += `Riesgo mortalidad: ${medicalData.riskStratification.severity_scores.qsofa.mortality_risk}\n`;
      }
      
      if (medicalData.riskStratification.severity_scores.curb65.score > 0) {
        report += `CURB-65: ${medicalData.riskStratification.severity_scores.curb65.score}/5 puntos\n`;
        report += `Recomendación: ${medicalData.riskStratification.severity_scores.curb65.severity}\n`;
      }
      report += '\n';
    }

    // Treatment Planning
    if (medicalData.treatmentPlanning.antimicrobial_therapy.empirical_therapy) {
      report += 'PLAN DE TRATAMIENTO:\n';
      report += `Terapia empírica: ${medicalData.treatmentPlanning.antimicrobial_therapy.empirical_therapy}\n`;
      
      if (medicalData.treatmentPlanning.antimicrobial_therapy.duration > 0) {
        report += `Duración: ${medicalData.treatmentPlanning.antimicrobial_therapy.duration} días\n`;
      }
      
      if (medicalData.treatmentPlanning.supportive_care.isolation_precautions) {
        report += `Precauciones: ${medicalData.treatmentPlanning.supportive_care.isolation_precautions}\n`;
      }
      
      if (medicalData.treatmentPlanning.supportive_care.fluid_resuscitation) {
        report += 'Soporte: Reanimación con fluidos\n';
      }
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN INFECTOLÓGICO:\n';
      report += `Estado: ${medicalData.infectiousStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} condición(es) crítica(s) - Atención inmediata\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} factor(es) de riesgo - Monitoreo estrecho\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData]);

  useEffect(() => {
    calculateSIRS();
    calculateQSOFA();
    calculateCURB65();
    calculateStatus();
    generateReport();
  }, [calculateSIRS, calculateQSOFA, calculateCURB65, calculateStatus, generateReport]);

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
    { id: 'initial', name: 'Evaluación Inicial', icon: Thermometer, count: medicalData.initialAssessment.fever.present ? 1 : 0 },
    { id: 'sepsis', name: 'Screening Sepsis', icon: AlertTriangle, count: medicalData.riskStratification.severity_scores.qsofa.criteria.length },
    { id: 'syndromes', name: 'Síndromes Infecciosos', icon: Target, count: Object.values(medicalData.infectiousSyndromes).filter(syndrome => Object.values(syndrome).some(Boolean)).length },
    { id: 'epidemiology', name: 'Epidemiología', icon: Search, count: medicalData.epidemiologicalAssessment.travel_history.recent_travel ? 1 : 0 },
    { id: 'physical', name: 'Examen Físico', icon: User, count: medicalData.physicalExamination.vital_signs.temperature > 0 ? 1 : 0 },
    { id: 'laboratory', name: 'Laboratorio', icon: Microscope, count: Object.values(medicalData.diagnosticWorkup.laboratory.cultures).filter(Boolean).length },
    { id: 'riskScores', name: 'Escalas Riesgo', icon: Calculator, count: [medicalData.riskStratification.severity_scores.qsofa.criteria.length, medicalData.riskStratification.severity_scores.sirs.criteria.length].filter(c => c > 0).length },
    { id: 'treatment', name: 'Tratamiento', icon: Pill, count: medicalData.treatmentPlanning.antimicrobial_therapy.empirical_therapy ? 1 : 0 }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-12 w-12 text-green-100" />
              <div>
                <h1 className="text-3xl font-bold">Infectología</h1>
                <p className="text-green-100">Sistema de Evaluación Infecciosa Integral</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso Infectológico</span>
                <span className="text-sm font-bold">{medicalData.examProgress}%</span>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.infectiousStatus}</span>
                <span>{medicalData.sectionsCompleted}/9 módulos</span>
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
                  <Siren className="h-5 w-5 text-white" />
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
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700">{medicalData.warningCount}</div>
                  <div className="text-sm text-orange-600">Riesgos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-700">{medicalData.infectiousStatus}</div>
                  <div className="text-sm text-green-600">Estado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Thermometer className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-700">
                    {medicalData.initialAssessment.fever.temperature || 'N/A'}°C
                  </div>
                  <div className="text-sm text-emerald-600">Temperatura</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
          >
            <Shield className="h-5 w-5 mr-2" />
            Iniciar Evaluación Infectológica
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-green-200 hover:bg-green-50"
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
                    Reporte Infectológico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando evaluación infectológica...'}
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-green-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Sistema Infectológico Completo - En Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Vista expandida completa en desarrollo. Utiliza la vista compacta para la evaluación infectológica integral.
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

export default InfectiologyDemo;