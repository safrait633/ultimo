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
  Zap,
  AlertTriangle,
  Activity,
  Heart,
  Eye,
  Target,
  CheckCircle,
  Calculator,
  FileText,
  TrendingUp,
  Search,
  Timer,
  Users,
  User,
  Shield,
  Hand,
  Bone,
  Lightbulb,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Thermometer,
  Gauge,
  Stethoscope
} from "lucide-react";

interface RheumatologyDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface RheumatologyData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  rheumatologicStatus: string;

  // Initial Assessment
  initialAssessment: {
    chief_complaint: string;
    pain_characteristics: {
      location: string[];
      quality: string;
      severity: number;
      timing: string;
      aggravating_factors: string[];
      relieving_factors: string[];
    };
    stiffness: {
      present: boolean;
      morning_duration: number;
      pattern: string;
    };
    functional_impact: {
      daily_activities: string;
      work_disability: boolean;
      walking_distance: string;
    };
  };

  // Rheumatologic Review of Systems
  systemicReview: {
    constitutional: {
      fatigue: boolean;
      fever: boolean;
      weight_loss: boolean;
      night_sweats: boolean;
    };
    musculoskeletal: {
      joint_swelling: boolean;
      joint_warmth: boolean;
      joint_deformity: boolean;
      muscle_weakness: boolean;
      muscle_pain: boolean;
    };
    skin: {
      rash: boolean;
      photosensitivity: boolean;
      raynaud_phenomenon: boolean;
      skin_thickening: boolean;
      oral_ulcers: boolean;
    };
    ocular: {
      dry_eyes: boolean;
      eye_pain: boolean;
      vision_changes: boolean;
      conjunctivitis: boolean;
    };
    cardiopulmonary: {
      chest_pain: boolean;
      dyspnea: boolean;
      palpitations: boolean;
      cough: boolean;
    };
    neurological: {
      headaches: boolean;
      seizures: boolean;
      neuropathy: boolean;
      cognitive_changes: boolean;
    };
    renal: {
      hematuria: boolean;
      proteinuria: boolean;
      hypertension: boolean;
      kidney_stones: boolean;
    };
  };

  // Physical Examination
  physicalExamination: {
    general: {
      vital_signs: {
        blood_pressure: { systolic: number; diastolic: number };
        heart_rate: number;
        temperature: number;
        respiratory_rate: number;
      };
      general_appearance: string;
      habitus: string;
    };
    musculoskeletal: {
      spine: {
        cervical: {
          range_of_motion: string;
          tenderness: boolean;
          deformity: boolean;
        };
        thoracic: {
          kyphosis: boolean;
          tenderness: boolean;
          expansion: number;
        };
        lumbar: {
          range_of_motion: string;
          tenderness: boolean;
          lordosis: string;
        };
        sacroiliac: {
          tenderness: boolean;
          compression_test: boolean;
          distraction_test: boolean;
        };
      };
      peripheral_joints: {
        hands: {
          swelling: boolean;
          deformity: string[];
          tenderness: boolean;
          warmth: boolean;
          grip_strength: string;
        };
        wrists: {
          swelling: boolean;
          tenderness: boolean;
          range_of_motion: string;
        };
        elbows: {
          swelling: boolean;
          tenderness: boolean;
          range_of_motion: string;
        };
        shoulders: {
          range_of_motion: string;
          impingement_signs: boolean;
          tenderness: boolean;
        };
        hips: {
          range_of_motion: string;
          tenderness: boolean;
          flexion_contracture: boolean;
        };
        knees: {
          swelling: boolean;
          effusion: boolean;
          tenderness: boolean;
          stability: string;
          range_of_motion: string;
        };
        ankles: {
          swelling: boolean;
          tenderness: boolean;
          range_of_motion: string;
        };
        feet: {
          deformity: string[];
          tenderness: boolean;
          swelling: boolean;
        };
      };
    };
    skin_examination: {
      rash_present: boolean;
      rash_description: string;
      nail_changes: boolean;
      alopecia: boolean;
      subcutaneous_nodules: boolean;
    };
    neurological: {
      muscle_strength: { [key: string]: string };
      reflexes: { [key: string]: string };
      sensation: string;
    };
  };

  // Rheumatologic Assessment Tools
  assessmentTools: {
    joint_count: {
      tender_joint_count: number;
      swollen_joint_count: number;
      total_joints_examined: number;
    };
    disease_activity_scores: {
      das28: {
        score: number;
        interpretation: string;
      };
      cdai: {
        score: number;
        interpretation: string;
      };
      sledai: {
        score: number;
        interpretation: string;
      };
    };
    functional_assessment: {
      haq: {
        score: number;
        interpretation: string;
      };
      patient_global: number;
      physician_global: number;
      pain_vas: number;
    };
  };

  // Laboratory and Diagnostic Workup
  diagnosticWorkup: {
    laboratory: {
      inflammatory_markers: {
        esr: number;
        crp: number;
        interpretation: string;
      };
      autoantibodies: {
        rf: string;
        accp: string;
        ana: {
          result: string;
          pattern: string;
          titer: string;
        };
        anti_dna: string;
        ena_panel: string[];
        complement: {
          c3: number;
          c4: number;
        };
      };
      hematology: {
        hemoglobin: number;
        wbc: number;
        platelets: number;
      };
      chemistry: {
        creatinine: number;
        liver_enzymes: {
          alt: number;
          ast: number;
        };
        uric_acid: number;
      };
    };
    imaging: {
      xrays: {
        performed: boolean;
        joints_imaged: string[];
        findings: string[];
      };
      ultrasound: {
        performed: boolean;
        findings: string;
      };
      mri: {
        performed: boolean;
        findings: string;
      };
      dexa_scan: {
        performed: boolean;
        t_score: number;
        interpretation: string;
      };
    };
  };

  // Treatment Plan
  treatmentPlan: {
    diagnosis: {
      primary: string;
      differential: string[];
      icd_codes: string[];
    };
    pharmacological: {
      nsaids: {
        prescribed: boolean;
        medication: string;
        monitoring: string[];
      };
      dmards: {
        prescribed: boolean;
        medications: string[];
        monitoring: string[];
      };
      biologics: {
        prescribed: boolean;
        medication: string;
        monitoring: string[];
      };
      corticosteroids: {
        prescribed: boolean;
        route: string;
        duration: string;
      };
      analgesics: {
        prescribed: boolean;
        medications: string[];
      };
    };
    nonPharmacological: {
      physical_therapy: boolean;
      occupational_therapy: boolean;
      exercise_program: string;
      lifestyle_modifications: string[];
      patient_education: string[];
    };
    monitoring: {
      follow_up_interval: string;
      lab_monitoring: string[];
      imaging_follow_up: string[];
      outcome_measures: string[];
    };
  };
}

const RheumatologyDemo: React.FC<RheumatologyDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['initial']));

  // Medical Data State
  const [medicalData, setMedicalData] = useState<RheumatologyData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 9,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    rheumatologicStatus: 'Sin inflamación',

    initialAssessment: {
      chief_complaint: '',
      pain_characteristics: {
        location: [],
        quality: '',
        severity: 0,
        timing: '',
        aggravating_factors: [],
        relieving_factors: []
      },
      stiffness: {
        present: false,
        morning_duration: 0,
        pattern: ''
      },
      functional_impact: {
        daily_activities: '',
        work_disability: false,
        walking_distance: ''
      }
    },

    systemicReview: {
      constitutional: {
        fatigue: false,
        fever: false,
        weight_loss: false,
        night_sweats: false
      },
      musculoskeletal: {
        joint_swelling: false,
        joint_warmth: false,
        joint_deformity: false,
        muscle_weakness: false,
        muscle_pain: false
      },
      skin: {
        rash: false,
        photosensitivity: false,
        raynaud_phenomenon: false,
        skin_thickening: false,
        oral_ulcers: false
      },
      ocular: {
        dry_eyes: false,
        eye_pain: false,
        vision_changes: false,
        conjunctivitis: false
      },
      cardiopulmonary: {
        chest_pain: false,
        dyspnea: false,
        palpitations: false,
        cough: false
      },
      neurological: {
        headaches: false,
        seizures: false,
        neuropathy: false,
        cognitive_changes: false
      },
      renal: {
        hematuria: false,
        proteinuria: false,
        hypertension: false,
        kidney_stones: false
      }
    },

    physicalExamination: {
      general: {
        vital_signs: {
          blood_pressure: { systolic: 0, diastolic: 0 },
          heart_rate: 0,
          temperature: 0,
          respiratory_rate: 0
        },
        general_appearance: '',
        habitus: ''
      },
      musculoskeletal: {
        spine: {
          cervical: {
            range_of_motion: '',
            tenderness: false,
            deformity: false
          },
          thoracic: {
            kyphosis: false,
            tenderness: false,
            expansion: 0
          },
          lumbar: {
            range_of_motion: '',
            tenderness: false,
            lordosis: ''
          },
          sacroiliac: {
            tenderness: false,
            compression_test: false,
            distraction_test: false
          }
        },
        peripheral_joints: {
          hands: {
            swelling: false,
            deformity: [],
            tenderness: false,
            warmth: false,
            grip_strength: ''
          },
          wrists: {
            swelling: false,
            tenderness: false,
            range_of_motion: ''
          },
          elbows: {
            swelling: false,
            tenderness: false,
            range_of_motion: ''
          },
          shoulders: {
            range_of_motion: '',
            impingement_signs: false,
            tenderness: false
          },
          hips: {
            range_of_motion: '',
            tenderness: false,
            flexion_contracture: false
          },
          knees: {
            swelling: false,
            effusion: false,
            tenderness: false,
            stability: '',
            range_of_motion: ''
          },
          ankles: {
            swelling: false,
            tenderness: false,
            range_of_motion: ''
          },
          feet: {
            deformity: [],
            tenderness: false,
            swelling: false
          }
        }
      },
      skin_examination: {
        rash_present: false,
        rash_description: '',
        nail_changes: false,
        alopecia: false,
        subcutaneous_nodules: false
      },
      neurological: {
        muscle_strength: {},
        reflexes: {},
        sensation: ''
      }
    },

    assessmentTools: {
      joint_count: {
        tender_joint_count: 0,
        swollen_joint_count: 0,
        total_joints_examined: 0
      },
      disease_activity_scores: {
        das28: {
          score: 0,
          interpretation: ''
        },
        cdai: {
          score: 0,
          interpretation: ''
        },
        sledai: {
          score: 0,
          interpretation: ''
        }
      },
      functional_assessment: {
        haq: {
          score: 0,
          interpretation: ''
        },
        patient_global: 0,
        physician_global: 0,
        pain_vas: 0
      }
    },

    diagnosticWorkup: {
      laboratory: {
        inflammatory_markers: {
          esr: 0,
          crp: 0,
          interpretation: ''
        },
        autoantibodies: {
          rf: '',
          accp: '',
          ana: {
            result: '',
            pattern: '',
            titer: ''
          },
          anti_dna: '',
          ena_panel: [],
          complement: {
            c3: 0,
            c4: 0
          }
        },
        hematology: {
          hemoglobin: 0,
          wbc: 0,
          platelets: 0
        },
        chemistry: {
          creatinine: 0,
          liver_enzymes: {
            alt: 0,
            ast: 0
          },
          uric_acid: 0
        }
      },
      imaging: {
        xrays: {
          performed: false,
          joints_imaged: [],
          findings: []
        },
        ultrasound: {
          performed: false,
          findings: ''
        },
        mri: {
          performed: false,
          findings: ''
        },
        dexa_scan: {
          performed: false,
          t_score: 0,
          interpretation: ''
        }
      }
    },

    treatmentPlan: {
      diagnosis: {
        primary: '',
        differential: [],
        icd_codes: []
      },
      pharmacological: {
        nsaids: {
          prescribed: false,
          medication: '',
          monitoring: []
        },
        dmards: {
          prescribed: false,
          medications: [],
          monitoring: []
        },
        biologics: {
          prescribed: false,
          medication: '',
          monitoring: []
        },
        corticosteroids: {
          prescribed: false,
          route: '',
          duration: ''
        },
        analgesics: {
          prescribed: false,
          medications: []
        }
      },
      nonPharmacological: {
        physical_therapy: false,
        occupational_therapy: false,
        exercise_program: '',
        lifestyle_modifications: [],
        patient_education: []
      },
      monitoring: {
        follow_up_interval: '',
        lab_monitoring: [],
        imaging_follow_up: [],
        outcome_measures: []
      }
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Calculate DAS28 Score
  const calculateDAS28 = useCallback(() => {
    const { tender_joint_count, swollen_joint_count } = medicalData.assessmentTools.joint_count;
    const patient_global = medicalData.assessmentTools.functional_assessment.patient_global;
    const esr = medicalData.diagnosticWorkup.laboratory.inflammatory_markers.esr;
    
    if (tender_joint_count > 0 && swollen_joint_count > 0 && patient_global > 0 && esr > 0) {
      const score = 0.56 * Math.sqrt(tender_joint_count) + 
                   0.28 * Math.sqrt(swollen_joint_count) +
                   0.70 * Math.log(esr) +
                   0.014 * patient_global;
      
      let interpretation = '';
      if (score < 2.6) interpretation = 'Remisión';
      else if (score <= 3.2) interpretation = 'Actividad baja';
      else if (score <= 5.1) interpretation = 'Actividad moderada';
      else interpretation = 'Actividad alta';

      setMedicalData(prev => ({
        ...prev,
        assessmentTools: {
          ...prev.assessmentTools,
          disease_activity_scores: {
            ...prev.assessmentTools.disease_activity_scores,
            das28: {
              score: Math.round(score * 100) / 100,
              interpretation
            }
          }
        }
      }));
    }
  }, [medicalData.assessmentTools, medicalData.diagnosticWorkup.laboratory.inflammatory_markers.esr]);

  // Calculate HAQ Score
  const calculateHAQ = useCallback(() => {
    const score = medicalData.assessmentTools.functional_assessment.haq.score;
    let interpretation = '';
    
    if (score === 0) interpretation = 'Sin discapacidad';
    else if (score <= 1) interpretation = 'Discapacidad leve-moderada';
    else if (score <= 2) interpretation = 'Discapacidad moderada-severa';
    else interpretation = 'Discapacidad severa';

    setMedicalData(prev => ({
      ...prev,
      assessmentTools: {
        ...prev.assessmentTools,
        functional_assessment: {
          ...prev.assessmentTools.functional_assessment,
          haq: {
            ...prev.assessmentTools.functional_assessment.haq,
            interpretation
          }
        }
      }
    }));
  }, [medicalData.assessmentTools.functional_assessment.haq.score]);

  // Calculate status and alerts
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let rheumatologicStatus = 'Sin inflamación';

    // Check inflammatory markers
    const { esr, crp } = medicalData.diagnosticWorkup.laboratory.inflammatory_markers;
    if (esr > 100 || crp > 50) {
      alertCount++;
      rheumatologicStatus = 'Inflamación severa';
    } else if (esr > 30 || crp > 10) {
      warningCount++;
      rheumatologicStatus = 'Inflamación moderada';
    } else if (esr > 20 || crp > 3) {
      findingCount++;
      if (rheumatologicStatus === 'Sin inflamación') rheumatologicStatus = 'Inflamación leve';
    }

    // Check joint involvement
    const { tender_joint_count, swollen_joint_count } = medicalData.assessmentTools.joint_count;
    if (swollen_joint_count >= 10) {
      warningCount++;
      rheumatologicStatus = 'Poliartritis activa';
    } else if (swollen_joint_count >= 5) {
      findingCount++;
      if (!rheumatologicStatus.includes('Inflamación')) rheumatologicStatus = 'Artritis activa';
    }

    // Check systemic involvement
    const systemicSymptoms = [
      medicalData.systemicReview.constitutional.fever,
      medicalData.systemicReview.constitutional.weight_loss,
      medicalData.systemicReview.renal.proteinuria,
      medicalData.systemicReview.neurological.seizures
    ];

    systemicSymptoms.forEach(symptom => {
      if (symptom) {
        warningCount++;
        if (rheumatologicStatus !== 'Inflamación severa' && rheumatologicStatus !== 'Poliartritis activa') {
          rheumatologicStatus = 'Compromiso sistémico';
        }
      }
    });

    // Check DAS28 score
    if (medicalData.assessmentTools.disease_activity_scores.das28.score > 5.1) {
      warningCount++;
      rheumatologicStatus = 'Actividad alta';
    }

    // Calculate progress
    let completedSections = 0;
    if (medicalData.initialAssessment.chief_complaint) completedSections++;
    if (Object.values(medicalData.systemicReview.constitutional).some(Boolean)) completedSections++;
    if (medicalData.physicalExamination.general.vital_signs.heart_rate > 0) completedSections++;
    if (medicalData.assessmentTools.joint_count.total_joints_examined > 0) completedSections++;
    if (medicalData.diagnosticWorkup.laboratory.inflammatory_markers.esr > 0) completedSections++;
    if (Object.values(medicalData.diagnosticWorkup.laboratory.autoantibodies).some(v => typeof v === 'string' ? !!v : !!v)) completedSections++;
    if (medicalData.diagnosticWorkup.imaging.xrays.performed) completedSections++;
    if (medicalData.treatmentPlan.diagnosis.primary) completedSections++;

    const examProgress = Math.round((completedSections / 9) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      rheumatologicStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'INFORME REUMATOLÓGICO\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    }

    // Initial Assessment
    if (medicalData.initialAssessment.chief_complaint) {
      report += 'EVALUACIÓN INICIAL:\n';
      report += `Motivo de consulta: ${medicalData.initialAssessment.chief_complaint}\n`;
      
      if (medicalData.initialAssessment.pain_characteristics.severity > 0) {
        report += `Dolor: Intensidad ${medicalData.initialAssessment.pain_characteristics.severity}/10\n`;
        if (medicalData.initialAssessment.pain_characteristics.location.length > 0) {
          report += `Localización: ${medicalData.initialAssessment.pain_characteristics.location.join(', ')}\n`;
        }
        if (medicalData.initialAssessment.pain_characteristics.quality) {
          report += `Calidad: ${medicalData.initialAssessment.pain_characteristics.quality}\n`;
        }
      }
      
      if (medicalData.initialAssessment.stiffness.present) {
        report += `Rigidez matinal: ${medicalData.initialAssessment.stiffness.morning_duration} minutos\n`;
      }
      
      if (medicalData.initialAssessment.functional_impact.work_disability) {
        report += 'Discapacidad laboral presente\n';
      }
      
      report += '\n';
    }

    // Systemic Review
    const systemicPositives: string[] = [];
    Object.entries(medicalData.systemicReview).forEach(([system, symptoms]) => {
      const positiveSymptoms = Object.entries(symptoms)
        .filter(([_, present]) => present)
        .map(([symptom, _]) => symptom);
      
      if (positiveSymptoms.length > 0) {
        systemicPositives.push(`${system}: ${positiveSymptoms.join(', ')}`);
      }
    });

    if (systemicPositives.length > 0) {
      report += 'REVISIÓN POR SISTEMAS:\n';
      systemicPositives.forEach((finding: string) => {
        report += `${finding}\n`;
      });
      report += '\n';
    }

    // Physical Examination
    if (medicalData.physicalExamination.general.vital_signs.heart_rate > 0) {
      report += 'EXPLORACIÓN FÍSICA:\n';
      const vs = medicalData.physicalExamination.general.vital_signs;
      if (vs.blood_pressure.systolic > 0) {
        report += `PA: ${vs.blood_pressure.systolic}/${vs.blood_pressure.diastolic} mmHg\n`;
      }
      if (vs.heart_rate > 0) {
        report += `FC: ${vs.heart_rate} lpm\n`;
      }
      if (vs.temperature > 0) {
        report += `Temperatura: ${vs.temperature}°C\n`;
      }
      
      // Joint examination
      const jointFindings: string[] = [];
      const joints = medicalData.physicalExamination.musculoskeletal.peripheral_joints;
      
      Object.entries(joints).forEach(([joint, findings]) => {
        if (typeof findings === 'object' && findings !== null) {
          const jointIssues = [];
          if ('swelling' in findings && findings.swelling) jointIssues.push('edema');
          if ('tenderness' in findings && findings.tenderness) jointIssues.push('dolor');
          if ('warmth' in findings && findings.warmth) jointIssues.push('calor');
          if ('deformity' in findings && Array.isArray(findings.deformity) && findings.deformity.length > 0) {
            jointIssues.push(`deformidad: ${findings.deformity.join(', ')}`);
          }
          
          if (jointIssues.length > 0) {
            jointFindings.push(`${joint}: ${jointIssues.join(', ')}`);
          }
        }
      });

      if (jointFindings.length > 0) {
        report += 'Exploración articular:\n';
        jointFindings.forEach(finding => {
          report += `  ${finding}\n`;
        });
      }
      
      report += '\n';
    }

    // Assessment Tools
    if (medicalData.assessmentTools.joint_count.total_joints_examined > 0) {
      report += 'HERRAMIENTAS DE EVALUACIÓN:\n';
      const jc = medicalData.assessmentTools.joint_count;
      report += `Recuento articular: ${jc.tender_joint_count} dolorosas, ${jc.swollen_joint_count} edematosas (${jc.total_joints_examined} examinadas)\n`;
      
      if (medicalData.assessmentTools.disease_activity_scores.das28.score > 0) {
        const das28 = medicalData.assessmentTools.disease_activity_scores.das28;
        report += `DAS28: ${das28.score} (${das28.interpretation})\n`;
      }
      
      if (medicalData.assessmentTools.functional_assessment.haq.score > 0) {
        const haq = medicalData.assessmentTools.functional_assessment.haq;
        report += `HAQ: ${haq.score} (${haq.interpretation})\n`;
      }
      
      if (medicalData.assessmentTools.functional_assessment.pain_vas > 0) {
        report += `EVA dolor: ${medicalData.assessmentTools.functional_assessment.pain_vas}/10\n`;
      }
      
      report += '\n';
    }

    // Laboratory Results
    if (medicalData.diagnosticWorkup.laboratory.inflammatory_markers.esr > 0 ||
        medicalData.diagnosticWorkup.laboratory.inflammatory_markers.crp > 0) {
      report += 'RESULTADOS DE LABORATORIO:\n';
      
      const inflam = medicalData.diagnosticWorkup.laboratory.inflammatory_markers;
      if (inflam.esr > 0) report += `VSG: ${inflam.esr} mm/h\n`;
      if (inflam.crp > 0) report += `PCR: ${inflam.crp} mg/L\n`;
      if (inflam.interpretation) report += `Interpretación: ${inflam.interpretation}\n`;
      
      const auto = medicalData.diagnosticWorkup.laboratory.autoantibodies;
      if (auto.rf) report += `Factor Reumatoide: ${auto.rf}\n`;
      if (auto.accp) report += `Anti-CCP: ${auto.accp}\n`;
      if (auto.ana.result) {
        report += `ANA: ${auto.ana.result}`;
        if (auto.ana.titer) report += ` (1:${auto.ana.titer})`;
        if (auto.ana.pattern) report += ` - patrón ${auto.ana.pattern}`;
        report += '\n';
      }
      if (auto.anti_dna) report += `Anti-DNA: ${auto.anti_dna}\n`;
      
      const hematol = medicalData.diagnosticWorkup.laboratory.hematology;
      if (hematol.hemoglobin > 0) report += `Hemoglobina: ${hematol.hemoglobin} g/dL\n`;
      
      report += '\n';
    }

    // Imaging
    if (medicalData.diagnosticWorkup.imaging.xrays.performed) {
      report += 'ESTUDIOS DE IMAGEN:\n';
      if (medicalData.diagnosticWorkup.imaging.xrays.joints_imaged.length > 0) {
        report += `Radiografías: ${medicalData.diagnosticWorkup.imaging.xrays.joints_imaged.join(', ')}\n`;
        if (medicalData.diagnosticWorkup.imaging.xrays.findings.length > 0) {
          report += `Hallazgos: ${medicalData.diagnosticWorkup.imaging.xrays.findings.join(', ')}\n`;
        }
      }
      
      if (medicalData.diagnosticWorkup.imaging.dexa_scan.performed) {
        const dexa = medicalData.diagnosticWorkup.imaging.dexa_scan;
        report += `DEXA: T-score ${dexa.t_score} (${dexa.interpretation})\n`;
      }
      
      report += '\n';
    }

    // Treatment Plan
    if (medicalData.treatmentPlan.diagnosis.primary) {
      report += 'PLAN DE TRATAMIENTO:\n';
      report += `Diagnóstico principal: ${medicalData.treatmentPlan.diagnosis.primary}\n`;
      
      if (medicalData.treatmentPlan.diagnosis.differential.length > 0) {
        report += `Diagnósticos diferenciales: ${medicalData.treatmentPlan.diagnosis.differential.join(', ')}\n`;
      }
      
      // Pharmacological treatment
      const pharm = medicalData.treatmentPlan.pharmacological;
      const treatments = [];
      
      if (pharm.nsaids.prescribed) treatments.push(`AINEs: ${pharm.nsaids.medication}`);
      if (pharm.dmards.prescribed) treatments.push(`FARMEs: ${pharm.dmards.medications.join(', ')}`);
      if (pharm.biologics.prescribed) treatments.push(`Biológicos: ${pharm.biologics.medication}`);
      if (pharm.corticosteroids.prescribed) treatments.push(`Corticoides: ${pharm.corticosteroids.route} (${pharm.corticosteroids.duration})`);
      
      if (treatments.length > 0) {
        report += `Tratamiento farmacológico: ${treatments.join('; ')}\n`;
      }
      
      // Non-pharmacological treatment
      const nonPharm = medicalData.treatmentPlan.nonPharmacological;
      const nonPharmTreatments = [];
      
      if (nonPharm.physical_therapy) nonPharmTreatments.push('Fisioterapia');
      if (nonPharm.occupational_therapy) nonPharmTreatments.push('Terapia ocupacional');
      if (nonPharm.exercise_program) nonPharmTreatments.push(`Ejercicio: ${nonPharm.exercise_program}`);
      
      if (nonPharmTreatments.length > 0) {
        report += `Tratamiento no farmacológico: ${nonPharmTreatments.join(', ')}\n`;
      }
      
      if (medicalData.treatmentPlan.monitoring.follow_up_interval) {
        report += `Seguimiento: ${medicalData.treatmentPlan.monitoring.follow_up_interval}\n`;
      }
      
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN REUMATOLÓGICO:\n';
      report += `Estado reumatológico: ${medicalData.rheumatologicStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} hallazgo(s) crítico(s) - Atención inmediata\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} hallazgo(s) significativo(s) - Seguimiento estrecho\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData]);

  useEffect(() => {
    calculateDAS28();
    calculateHAQ();
    calculateStatus();
    generateReport();
  }, [calculateDAS28, calculateHAQ, calculateStatus, generateReport]);

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
    { id: 'initial', name: 'Evaluación Inicial', icon: User, count: medicalData.initialAssessment.chief_complaint ? 1 : 0 },
    { id: 'systemic', name: 'Revisión Sistémica', icon: Activity, count: Object.values(medicalData.systemicReview).filter(system => Object.values(system).some(Boolean)).length },
    { id: 'spine', name: 'Exploración Columna', icon: Bone, count: Object.values(medicalData.physicalExamination.musculoskeletal.spine).filter(region => Object.values(region).some(v => typeof v === 'boolean' ? v : !!v)).length },
    { id: 'joints', name: 'Articulaciones', icon: Hand, count: Object.values(medicalData.physicalExamination.musculoskeletal.peripheral_joints).filter(joint => Object.values(joint).some(Boolean)).length },
    { id: 'assessment', name: 'Herramientas', icon: Calculator, count: medicalData.assessmentTools.joint_count.total_joints_examined > 0 ? 1 : 0 },
    { id: 'laboratory', name: 'Laboratorio', icon: Search, count: [medicalData.diagnosticWorkup.laboratory.inflammatory_markers.esr, medicalData.diagnosticWorkup.laboratory.inflammatory_markers.crp].filter(v => v > 0).length },
    { id: 'autoantibodies', name: 'Autoanticuerpos', icon: Target, count: Object.values(medicalData.diagnosticWorkup.laboratory.autoantibodies).filter(v => typeof v === 'string' ? !!v : !!v).length },
    { id: 'imaging', name: 'Imagenología', icon: Eye, count: medicalData.diagnosticWorkup.imaging.xrays.performed ? 1 : 0 },
    { id: 'treatment', name: 'Tratamiento', icon: Shield, count: medicalData.treatmentPlan.diagnosis.primary ? 1 : 0 }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-12 w-12 text-rose-100" />
              <div>
                <h1 className="text-3xl font-bold">Reumatología</h1>
                <p className="text-rose-100">Sistema Integral DAS28/HAQ</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso Reumatológico</span>
                <span className="text-sm font-bold">{medicalData.examProgress}%</span>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.rheumatologicStatus}</span>
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
                  <div className="text-sm text-orange-600">Importantes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-rose-700">{medicalData.rheumatologicStatus}</div>
                  <div className="text-sm text-rose-600">Estado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-pink-700">
                    DAS28: {medicalData.assessmentTools.disease_activity_scores.das28.score || 'N/A'}
                  </div>
                  <div className="text-sm text-pink-600">Actividad</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium"
          >
            <Zap className="h-5 w-5 mr-2" />
            Iniciar Evaluación Reumatológica
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-rose-200 hover:bg-rose-50"
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
                    Reporte Reumatológico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando evaluación reumatológica integral...'}
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
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-purple-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-rose-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Sistema Reumatológico Completo - En Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Vista expandida completa en desarrollo. Utiliza la vista compacta para la evaluación reumatológica completa con herramientas DAS28 y HAQ.
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

export default RheumatologyDemo;