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
  Brain,
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
  Zap,
  Lightbulb,
  Maximize2,
  Minimize2,
  Copy,
  FileText as PrintIcon,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Moon,
  Sun,
  Smile,
  Frown
} from "lucide-react";

interface PsychiatryDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

interface PsychiatryData {
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  psychiatricStatus: string;

  // Initial Assessment
  initialAssessment: {
    chief_complaint: string;
    reason_for_referral: string;
    previous_psychiatric_treatment: boolean;
    current_medications: string[];
    family_psychiatric_history: boolean;
    risk_assessment: {
      suicide_risk: string;
      homicide_risk: string;
      self_harm: boolean;
      impulsivity: string;
    };
  };

  // Mental State Examination
  mentalStateExam: {
    appearance: {
      grooming: string;
      clothing: string;
      posture: string;
      facial_expression: string;
      eye_contact: string;
    };
    behavior: {
      psychomotor_activity: string;
      abnormal_movements: boolean;
      agitation: boolean;
      cooperation: string;
    };
    speech: {
      rate: string;
      volume: string;
      fluency: string;
      coherence: string;
    };
    mood_affect: {
      mood_self_reported: string;
      affect_observed: string;
      congruence: boolean;
      lability: boolean;
    };
    thought: {
      process: string;
      content: {
        delusions: boolean;
        obsessions: boolean;
        phobias: boolean;
        suicidal_ideation: boolean;
        homicidal_ideation: boolean;
      };
    };
    perception: {
      hallucinations: {
        auditory: boolean;
        visual: boolean;
        tactile: boolean;
        olfactory: boolean;
      };
      illusions: boolean;
      depersonalization: boolean;
      derealization: boolean;
    };
    cognition: {
      orientation: {
        time: boolean;
        place: boolean;
        person: boolean;
      };
      attention_concentration: string;
      memory: {
        immediate: string;
        short_term: string;
        long_term: string;
      };
      abstract_thinking: string;
    };
    insight: string;
    judgment: string;
  };

  // Psychiatric Rating Scales
  ratingScales: {
    depression: {
      phq9: {
        score: number;
        severity: string;
        questions: { [key: string]: number };
      };
      gad7: {
        score: number;
        severity: string;
        questions: { [key: string]: number };
      };
    };
    mania: {
      ymrs: {
        score: number;
        severity: string;
        items: { [key: string]: number };
      };
    };
    psychosis: {
      panss_positive: {
        score: number;
        items: { [key: string]: number };
      };
      panss_negative: {
        score: number;
        items: { [key: string]: number };
      };
    };
    functioning: {
      gaf: {
        score: number;
        level: string;
      };
    };
  };

  // Substance Use Assessment
  substanceUse: {
    alcohol: {
      current_use: boolean;
      frequency: string;
      quantity: string;
      problems: boolean;
      audit_score: number;
    };
    drugs: {
      current_use: boolean;
      substances: string[];
      frequency: string;
      problems: boolean;
    };
    tobacco: {
      current_use: boolean;
      pack_years: number;
      cessation_interest: boolean;
    };
  };

  // Trauma and Stressors
  traumaAssessment: {
    trauma_history: boolean;
    types: string[];
    ptsd_symptoms: {
      intrusive_thoughts: boolean;
      avoidance: boolean;
      negative_cognitions: boolean;
      hyperarousal: boolean;
    };
    current_stressors: string[];
    coping_mechanisms: string[];
  };

  // Social and Occupational Functioning
  functionalAssessment: {
    living_situation: string;
    employment_status: string;
    financial_status: string;
    relationships: string;
    social_support: string;
    activities_of_daily_living: string;
    hobbies_interests: string[];
  };

  // Treatment Planning
  treatmentPlan: {
    diagnostic_impression: string[];
    differential_diagnoses: string[];
    treatment_goals: string[];
    interventions: {
      psychotherapy: {
        recommended: boolean;
        type: string;
        frequency: string;
      };
      medications: {
        recommended: boolean;
        classes: string[];
        specific_medications: string[];
      };
      psychosocial: {
        recommended: boolean;
        interventions: string[];
      };
    };
    safety_plan: {
      needed: boolean;
      components: string[];
    };
    follow_up: {
      frequency: string;
      monitoring: string[];
    };
  };
}

const PsychiatryDemo: React.FC<PsychiatryDemoProps> = ({ patientData, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['initial']));

  // Medical Data State
  const [medicalData, setMedicalData] = useState<PsychiatryData>({
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 10,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    psychiatricStatus: 'Estable',

    initialAssessment: {
      chief_complaint: '',
      reason_for_referral: '',
      previous_psychiatric_treatment: false,
      current_medications: [],
      family_psychiatric_history: false,
      risk_assessment: {
        suicide_risk: '',
        homicide_risk: '',
        self_harm: false,
        impulsivity: ''
      }
    },

    mentalStateExam: {
      appearance: {
        grooming: '',
        clothing: '',
        posture: '',
        facial_expression: '',
        eye_contact: ''
      },
      behavior: {
        psychomotor_activity: '',
        abnormal_movements: false,
        agitation: false,
        cooperation: ''
      },
      speech: {
        rate: '',
        volume: '',
        fluency: '',
        coherence: ''
      },
      mood_affect: {
        mood_self_reported: '',
        affect_observed: '',
        congruence: false,
        lability: false
      },
      thought: {
        process: '',
        content: {
          delusions: false,
          obsessions: false,
          phobias: false,
          suicidal_ideation: false,
          homicidal_ideation: false
        }
      },
      perception: {
        hallucinations: {
          auditory: false,
          visual: false,
          tactile: false,
          olfactory: false
        },
        illusions: false,
        depersonalization: false,
        derealization: false
      },
      cognition: {
        orientation: {
          time: true,
          place: true,
          person: true
        },
        attention_concentration: '',
        memory: {
          immediate: '',
          short_term: '',
          long_term: ''
        },
        abstract_thinking: ''
      },
      insight: '',
      judgment: ''
    },

    ratingScales: {
      depression: {
        phq9: {
          score: 0,
          severity: '',
          questions: {}
        },
        gad7: {
          score: 0,
          severity: '',
          questions: {}
        }
      },
      mania: {
        ymrs: {
          score: 0,
          severity: '',
          items: {}
        }
      },
      psychosis: {
        panss_positive: {
          score: 0,
          items: {}
        },
        panss_negative: {
          score: 0,
          items: {}
        }
      },
      functioning: {
        gaf: {
          score: 0,
          level: ''
        }
      }
    },

    substanceUse: {
      alcohol: {
        current_use: false,
        frequency: '',
        quantity: '',
        problems: false,
        audit_score: 0
      },
      drugs: {
        current_use: false,
        substances: [],
        frequency: '',
        problems: false
      },
      tobacco: {
        current_use: false,
        pack_years: 0,
        cessation_interest: false
      }
    },

    traumaAssessment: {
      trauma_history: false,
      types: [],
      ptsd_symptoms: {
        intrusive_thoughts: false,
        avoidance: false,
        negative_cognitions: false,
        hyperarousal: false
      },
      current_stressors: [],
      coping_mechanisms: []
    },

    functionalAssessment: {
      living_situation: '',
      employment_status: '',
      financial_status: '',
      relationships: '',
      social_support: '',
      activities_of_daily_living: '',
      hobbies_interests: []
    },

    treatmentPlan: {
      diagnostic_impression: [],
      differential_diagnoses: [],
      treatment_goals: [],
      interventions: {
        psychotherapy: {
          recommended: false,
          type: '',
          frequency: ''
        },
        medications: {
          recommended: false,
          classes: [],
          specific_medications: []
        },
        psychosocial: {
          recommended: false,
          interventions: []
        }
      },
      safety_plan: {
        needed: false,
        components: []
      },
      follow_up: {
        frequency: '',
        monitoring: []
      }
    }
  });

  const [medicalReport, setMedicalReport] = useState<string>('');

  // Calculate PHQ-9 Score
  const calculatePHQ9 = useCallback(() => {
    const questions = medicalData.ratingScales.depression.phq9.questions;
    const score = Object.values(questions).reduce((sum, value) => sum + value, 0);
    
    let severity = '';
    if (score <= 4) severity = 'Mínima depresión';
    else if (score <= 9) severity = 'Depresión leve';
    else if (score <= 14) severity = 'Depresión moderada';
    else if (score <= 19) severity = 'Depresión moderada-severa';
    else severity = 'Depresión severa';

    setMedicalData(prev => ({
      ...prev,
      ratingScales: {
        ...prev.ratingScales,
        depression: {
          ...prev.ratingScales.depression,
          phq9: {
            ...prev.ratingScales.depression.phq9,
            score,
            severity
          }
        }
      }
    }));
  }, [medicalData.ratingScales.depression.phq9.questions]);

  // Calculate GAD-7 Score
  const calculateGAD7 = useCallback(() => {
    const questions = medicalData.ratingScales.depression.gad7.questions;
    const score = Object.values(questions).reduce((sum, value) => sum + value, 0);
    
    let severity = '';
    if (score <= 4) severity = 'Ansiedad mínima';
    else if (score <= 9) severity = 'Ansiedad leve';
    else if (score <= 14) severity = 'Ansiedad moderada';
    else severity = 'Ansiedad severa';

    setMedicalData(prev => ({
      ...prev,
      ratingScales: {
        ...prev.ratingScales,
        depression: {
          ...prev.ratingScales.depression,
          gad7: {
            ...prev.ratingScales.depression.gad7,
            score,
            severity
          }
        }
      }
    }));
  }, [medicalData.ratingScales.depression.gad7.questions]);

  // Calculate GAF Score
  const calculateGAF = useCallback(() => {
    const score = medicalData.ratingScales.functioning.gaf.score;
    let level = '';
    
    if (score >= 91) level = 'Funcionamiento superior';
    else if (score >= 81) level = 'Síntomas ausentes o mínimos';
    else if (score >= 71) level = 'Síntomas leves';
    else if (score >= 61) level = 'Síntomas moderados';
    else if (score >= 51) level = 'Síntomas severos';
    else if (score >= 41) level = 'Deterioro severo';
    else if (score >= 31) level = 'Deterioro marcado';
    else if (score >= 21) level = 'Riesgo de daño';
    else if (score >= 11) level = 'Riesgo significativo';
    else if (score >= 1) level = 'Peligro persistente';

    setMedicalData(prev => ({
      ...prev,
      ratingScales: {
        ...prev.ratingScales,
        functioning: {
          ...prev.ratingScales.functioning,
          gaf: {
            ...prev.ratingScales.functioning.gaf,
            level
          }
        }
      }
    }));
  }, [medicalData.ratingScales.functioning.gaf.score]);

  // Calculate status and alerts
  const calculateStatus = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let psychiatricStatus = 'Estable';

    // Check suicide risk
    if (medicalData.initialAssessment.risk_assessment.suicide_risk === 'high' ||
        medicalData.mentalStateExam.thought.content.suicidal_ideation) {
      alertCount++;
      psychiatricStatus = 'Alto riesgo';
    } else if (medicalData.initialAssessment.risk_assessment.suicide_risk === 'moderate') {
      warningCount++;
      if (psychiatricStatus === 'Estable') psychiatricStatus = 'Riesgo moderado';
    }

    // Check homicide risk
    if (medicalData.initialAssessment.risk_assessment.homicide_risk === 'high' ||
        medicalData.mentalStateExam.thought.content.homicidal_ideation) {
      alertCount++;
      psychiatricStatus = 'Alto riesgo';
    }

    // Check psychosis
    if (medicalData.mentalStateExam.thought.content.delusions ||
        Object.values(medicalData.mentalStateExam.perception.hallucinations).some(Boolean)) {
      warningCount++;
      if (psychiatricStatus === 'Estable') psychiatricStatus = 'Psicosis';
    }

    // Check severe depression
    if (medicalData.ratingScales.depression.phq9.score >= 20) {
      warningCount++;
      if (psychiatricStatus === 'Estable') psychiatricStatus = 'Depresión severa';
    }

    // Check functioning
    if (medicalData.ratingScales.functioning.gaf.score < 50 && medicalData.ratingScales.functioning.gaf.score > 0) {
      warningCount++;
      if (psychiatricStatus === 'Estable') psychiatricStatus = 'Deterioro funcional';
    }

    // Calculate progress
    let completedSections = 0;
    if (medicalData.initialAssessment.chief_complaint) completedSections++;
    if (medicalData.mentalStateExam.appearance.grooming) completedSections++;
    if (medicalData.ratingScales.depression.phq9.score > 0) completedSections++;
    if (medicalData.substanceUse.alcohol.current_use !== undefined) completedSections++;
    if (medicalData.traumaAssessment.trauma_history !== undefined) completedSections++;
    if (medicalData.functionalAssessment.living_situation) completedSections++;
    if (medicalData.treatmentPlan.diagnostic_impression.length > 0) completedSections++;

    const examProgress = Math.round((completedSections / 10) * 100);

    setMedicalData(prev => ({
      ...prev,
      alertCount,
      warningCount,
      findingCount,
      psychiatricStatus,
      examProgress,
      sectionsCompleted: completedSections
    }));
  }, [medicalData]);

  // Generate medical report
  const generateReport = useCallback(() => {
    let report = 'INFORME PSIQUIÁTRICO\n\n';
    
    if (patientData) {
      report += `Paciente: ${patientData.nombre || 'N/A'} ${patientData.apellido || ''}\n`;
      report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
    }

    // Initial Assessment
    if (medicalData.initialAssessment.chief_complaint) {
      report += 'EVALUACIÓN INICIAL:\n';
      report += `Motivo de consulta: ${medicalData.initialAssessment.chief_complaint}\n`;
      
      if (medicalData.initialAssessment.reason_for_referral) {
        report += `Motivo de derivación: ${medicalData.initialAssessment.reason_for_referral}\n`;
      }
      
      if (medicalData.initialAssessment.previous_psychiatric_treatment) {
        report += 'Tratamiento psiquiátrico previo: Sí\n';
      }
      
      if (medicalData.initialAssessment.family_psychiatric_history) {
        report += 'Historia familiar psiquiátrica: Sí\n';
      }
      
      report += '\n';
    }

    // Risk Assessment
    const riskAssessment = medicalData.initialAssessment.risk_assessment;
    if (riskAssessment.suicide_risk || riskAssessment.homicide_risk) {
      report += 'EVALUACIÓN DE RIESGO:\n';
      if (riskAssessment.suicide_risk) {
        report += `Riesgo suicida: ${riskAssessment.suicide_risk.toUpperCase()}\n`;
      }
      if (riskAssessment.homicide_risk) {
        report += `Riesgo homicida: ${riskAssessment.homicide_risk.toUpperCase()}\n`;
      }
      if (riskAssessment.self_harm) {
        report += 'Autolesiones presentes\n';
      }
      report += '\n';
    }

    // Mental State Examination
    if (medicalData.mentalStateExam.appearance.grooming) {
      report += 'EXAMEN DEL ESTADO MENTAL:\n';
      
      // Appearance
      report += 'Apariencia:\n';
      if (medicalData.mentalStateExam.appearance.grooming) {
        report += `  Arreglo personal: ${medicalData.mentalStateExam.appearance.grooming}\n`;
      }
      if (medicalData.mentalStateExam.appearance.eye_contact) {
        report += `  Contacto visual: ${medicalData.mentalStateExam.appearance.eye_contact}\n`;
      }
      
      // Behavior
      if (medicalData.mentalStateExam.behavior.psychomotor_activity) {
        report += `Actividad psicomotora: ${medicalData.mentalStateExam.behavior.psychomotor_activity}\n`;
      }
      if (medicalData.mentalStateExam.behavior.agitation) {
        report += 'Agitación presente\n';
      }
      
      // Speech
      if (medicalData.mentalStateExam.speech.rate) {
        report += `Habla - Velocidad: ${medicalData.mentalStateExam.speech.rate}\n`;
      }
      
      // Mood and Affect
      if (medicalData.mentalStateExam.mood_affect.mood_self_reported) {
        report += `Ánimo (autorreportado): ${medicalData.mentalStateExam.mood_affect.mood_self_reported}\n`;
      }
      if (medicalData.mentalStateExam.mood_affect.affect_observed) {
        report += `Afecto (observado): ${medicalData.mentalStateExam.mood_affect.affect_observed}\n`;
      }
      
      // Thought
      const thoughtContent = medicalData.mentalStateExam.thought.content;
      const positiveContent = Object.entries(thoughtContent)
        .filter(([_, present]) => present)
        .map(([item, _]) => item);
      
      if (positiveContent.length > 0) {
        report += `Contenido del pensamiento: ${positiveContent.join(', ')}\n`;
      }
      
      // Perception
      const hallucinations = Object.entries(medicalData.mentalStateExam.perception.hallucinations)
        .filter(([_, present]) => present)
        .map(([type, _]) => type);
      
      if (hallucinations.length > 0) {
        report += `Alucinaciones: ${hallucinations.join(', ')}\n`;
      }
      
      // Cognition
      const orientation = Object.entries(medicalData.mentalStateExam.cognition.orientation)
        .filter(([_, oriented]) => !oriented)
        .map(([domain, _]) => domain);
      
      if (orientation.length > 0) {
        report += `Desorientación: ${orientation.join(', ')}\n`;
      } else {
        report += 'Orientación: Conservada\n';
      }
      
      if (medicalData.mentalStateExam.insight) {
        report += `Conciencia de enfermedad: ${medicalData.mentalStateExam.insight}\n`;
      }
      
      report += '\n';
    }

    // Rating Scales
    if (medicalData.ratingScales.depression.phq9.score > 0) {
      report += 'ESCALAS DE EVALUACIÓN:\n';
      report += `PHQ-9: ${medicalData.ratingScales.depression.phq9.score}/27 puntos (${medicalData.ratingScales.depression.phq9.severity})\n`;
      
      if (medicalData.ratingScales.depression.gad7.score > 0) {
        report += `GAD-7: ${medicalData.ratingScales.depression.gad7.score}/21 puntos (${medicalData.ratingScales.depression.gad7.severity})\n`;
      }
      
      if (medicalData.ratingScales.functioning.gaf.score > 0) {
        report += `GAF: ${medicalData.ratingScales.functioning.gaf.score}/100 puntos (${medicalData.ratingScales.functioning.gaf.level})\n`;
      }
      
      report += '\n';
    }

    // Substance Use
    if (medicalData.substanceUse.alcohol.current_use || 
        medicalData.substanceUse.drugs.current_use || 
        medicalData.substanceUse.tobacco.current_use) {
      report += 'CONSUMO DE SUSTANCIAS:\n';
      
      if (medicalData.substanceUse.alcohol.current_use) {
        report += `Alcohol: ${medicalData.substanceUse.alcohol.frequency}, ${medicalData.substanceUse.alcohol.quantity}\n`;
        if (medicalData.substanceUse.alcohol.audit_score > 0) {
          report += `AUDIT: ${medicalData.substanceUse.alcohol.audit_score} puntos\n`;
        }
      }
      
      if (medicalData.substanceUse.drugs.current_use) {
        report += `Drogas: ${medicalData.substanceUse.drugs.substances.join(', ')}\n`;
      }
      
      if (medicalData.substanceUse.tobacco.current_use) {
        report += `Tabaco: ${medicalData.substanceUse.tobacco.pack_years} paquetes-año\n`;
      }
      
      report += '\n';
    }

    // Functional Assessment
    if (medicalData.functionalAssessment.living_situation) {
      report += 'EVALUACIÓN FUNCIONAL:\n';
      report += `Situación de vivienda: ${medicalData.functionalAssessment.living_situation}\n`;
      if (medicalData.functionalAssessment.employment_status) {
        report += `Estado laboral: ${medicalData.functionalAssessment.employment_status}\n`;
      }
      if (medicalData.functionalAssessment.social_support) {
        report += `Soporte social: ${medicalData.functionalAssessment.social_support}\n`;
      }
      report += '\n';
    }

    // Treatment Plan
    if (medicalData.treatmentPlan.diagnostic_impression.length > 0) {
      report += 'PLAN DE TRATAMIENTO:\n';
      report += `Impresión diagnóstica: ${medicalData.treatmentPlan.diagnostic_impression.join(', ')}\n`;
      
      if (medicalData.treatmentPlan.differential_diagnoses.length > 0) {
        report += `Diagnósticos diferenciales: ${medicalData.treatmentPlan.differential_diagnoses.join(', ')}\n`;
      }
      
      if (medicalData.treatmentPlan.interventions.psychotherapy.recommended) {
        report += `Psicoterapia: ${medicalData.treatmentPlan.interventions.psychotherapy.type} (${medicalData.treatmentPlan.interventions.psychotherapy.frequency})\n`;
      }
      
      if (medicalData.treatmentPlan.interventions.medications.recommended) {
        report += `Medicación: ${medicalData.treatmentPlan.interventions.medications.classes.join(', ')}\n`;
      }
      
      if (medicalData.treatmentPlan.safety_plan.needed) {
        report += 'Plan de seguridad: Necesario\n';
      }
      
      report += '\n';
    }

    // Clinical Summary
    if (medicalData.alertCount > 0 || medicalData.warningCount > 0) {
      report += 'RESUMEN PSIQUIÁTRICO:\n';
      report += `Estado mental: ${medicalData.psychiatricStatus}\n`;
      if (medicalData.alertCount > 0) {
        report += `🚨 ${medicalData.alertCount} riesgo(s) crítico(s) - Atención inmediata\n`;
      }
      if (medicalData.warningCount > 0) {
        report += `⚠️ ${medicalData.warningCount} síntoma(s) significativo(s) - Seguimiento necesario\n`;
      }
    }

    setMedicalReport(report);
  }, [medicalData, patientData]);

  useEffect(() => {
    calculatePHQ9();
    calculateGAD7();
    calculateGAF();
    calculateStatus();
    generateReport();
  }, [calculatePHQ9, calculateGAD7, calculateGAF, calculateStatus, generateReport]);

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
    { id: 'risk', name: 'Evaluación de Riesgo', icon: AlertTriangle, count: Object.values(medicalData.initialAssessment.risk_assessment).filter(v => typeof v === 'boolean' ? v : !!v).length },
    { id: 'mentalState', name: 'Estado Mental', icon: Brain, count: medicalData.mentalStateExam.appearance.grooming ? 1 : 0 },
    { id: 'mood', name: 'Ánimo y Afecto', icon: Smile, count: medicalData.mentalStateExam.mood_affect.mood_self_reported ? 1 : 0 },
    { id: 'thought', name: 'Pensamiento', icon: Lightbulb, count: Object.values(medicalData.mentalStateExam.thought.content).filter(Boolean).length },
    { id: 'scales', name: 'Escalas Rating', icon: Calculator, count: medicalData.ratingScales.depression.phq9.score > 0 ? 1 : 0 },
    { id: 'substance', name: 'Consumo Sustancias', icon: Shield, count: [medicalData.substanceUse.alcohol.current_use, medicalData.substanceUse.drugs.current_use, medicalData.substanceUse.tobacco.current_use].filter(Boolean).length },
    { id: 'trauma', name: 'Trauma/Estrés', icon: Target, count: medicalData.traumaAssessment.trauma_history ? 1 : 0 },
    { id: 'functional', name: 'Funcionamiento', icon: Users, count: medicalData.functionalAssessment.living_situation ? 1 : 0 },
    { id: 'treatment', name: 'Plan Tratamiento', icon: FileText, count: medicalData.treatmentPlan.diagnostic_impression.length }
  ];

  if (!isExpanded) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-8"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative text-white text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Brain className="h-12 w-12 text-indigo-100" />
              <div>
                <h1 className="text-3xl font-bold">Psiquiatría</h1>
                <p className="text-indigo-100">Evaluación Integral del Estado Mental</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso Psiquiátrico</span>
                <span className="text-sm font-bold">{medicalData.examProgress}%</span>
              </div>
              <Progress value={medicalData.examProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs">
                <span>Estado: {medicalData.psychiatricStatus}</span>
                <span>{medicalData.sectionsCompleted}/10 áreas</span>
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
                  <div className="text-sm text-red-600">Riesgos</div>
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
                  <div className="text-sm text-orange-600">Síntomas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-indigo-700">{medicalData.psychiatricStatus}</div>
                  <div className="text-sm text-indigo-600">Estado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-700">
                    PHQ-9: {medicalData.ratingScales.depression.phq9.score || 'N/A'}
                  </div>
                  <div className="text-sm text-purple-600">Depresión</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
          >
            <Brain className="h-5 w-5 mr-2" />
            Iniciar Evaluación Psiquiátrica
          </Button>

          <Button 
            onClick={() => setShowSplitView(!showSplitView)}
            variant="outline"
            className="px-6 h-14 border-indigo-200 hover:bg-indigo-50"
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
                    Reporte Psiquiátrico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto bg-white p-4 rounded-lg border">
                    {medicalReport || 'Generando evaluación psiquiátrica integral...'}
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="bg-indigo-500/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Sistema Psiquiátrico Completo - En Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Vista expandida completa en desarrollo. Utiliza la vista compacta para la evaluación psiquiátrica completa.
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

export default PsychiatryDemo;