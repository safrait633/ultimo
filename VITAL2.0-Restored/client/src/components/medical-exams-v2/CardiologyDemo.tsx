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
  Heart, 
  Target,
  AlertTriangle,
  Activity,
  Stethoscope,
  TrendingUp,
  Calculator,
  Eye,
  FileText,
  Copy,
  Download,
  FlaskConical,
  Scale,
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
  Wind,
  Droplet,
  Timer,
  Shield
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

// 🏥 TIPOS DE CONSULTA Y ESTRUCTURAS MÉDICAS

// Tipos de consulta médica
type ConsultationType = 'primera' | 'seguimiento' | 'interconsulta' | 'emergencia';

// Historial médico del paciente
interface MedicalHistory {
  consultasPrevias: {
    fecha: string;
    tipo: ConsultationType;
    diagnostico: string;
    tratamiento: string;
    medico: string;
  }[];
  medicamentosActuales: {
    nombre: string;
    dosis: string;
    frecuencia: string;
    fechaInicio: string;
    activo: boolean;
  }[];
  alergias: {
    sustancia: string;
    tipo: 'medicamento' | 'alimento' | 'ambiental';
    severidad: 'leve' | 'moderada' | 'severa';
    reaccion: string;
  }[];
  estudiosComplementarios: {
    tipo: string;
    fecha: string;
    resultado: string;
    archivo?: string;
  }[];
  antecedentesPersonales: string[];
  antecedentesFamiliares: string[];
}

// Validaciones inteligentes
interface IntelligentValidations {
  interaccionesMedicamentosas: {
    medicamento1: string;
    medicamento2: string;
    severidad: 'leve' | 'moderada' | 'severa';
    descripcion: string;
  }[];
  contraindicaciones: {
    medicamento: string;
    condicion: string;
    razon: string;
  }[];
  alertasClinicas: {
    tipo: 'critica' | 'advertencia' | 'informativa';
    mensaje: string;
    accion: string;
  }[];
}

// Campos específicos por tipo de consulta
interface ConsultationSpecificFields {
  // Primera consulta
  motivoConsulta?: string;
  enfermedadActual?: string;
  antecedentesPersonales?: string;
  antecedentesFamiliares?: string;
  
  // Seguimiento
  evolucionClinica?: string;
  adherenciaTratamiento?: string;
  efectosAdversos?: string;
  
  // Interconsulta/Emergencia
  motivoInterconsulta?: string;
  urgenciaClinica?: 'baja' | 'media' | 'alta' | 'critica';
  tiempoEvolucion?: string;
  tratamientoPrevio?: string;
  
  // Campos obligatorios específicos
  impresionDiagnostica?: string;
  planSeguimiento?: string;
}

// 🏥 CARDIOLOGY DATA INTERFACE - Following EndocrinologyDemo Structure
interface CardiologyData {
  // Información de consulta
  consultaInfo: {
    tipo: ConsultationType;
    fecha: string;
    hora: string;
    medico: string;
    especialidad: string;
  };
  
  // Historial médico
  historialMedico: MedicalHistory;
  
  // Campos específicos por tipo de consulta
  camposEspecificos: ConsultationSpecificFields;
  
  // Validaciones inteligentes
  validaciones: IntelligentValidations;
  
  // Dashboard Metrics (existente)
  // Dashboard Metrics
  examProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  alertCount: number;
  warningCount: number;
  findingCount: number;
  urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico';
  
  // Cardiology-Specific Symptoms
  symptoms: {
    chestPain: string[];
    dyspnea: string[];
    palpitations: string[];
    syncope: string[];
    fatigue: string[];
  };

  // Cardiovascular Risk Factors
  riskFactors: {
    cardiovascular: string[];
    metabolic: string[];
    lifestyle: string[];
    familial: string[];
  };

  // Anthropometry (same as endocrinology)
  anthropometry: {
    height: number;
    weight: number;
    waistCircumference: number;
    bmi: number;
    bmiCategory: string;
  };

  // Vital Signs
  vitalSigns: {
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    temperature: number;
  };

  // Cardiovascular Physical Examination
  cardiovascularExam: {
    inspection: {
      generalAppearance: string;
      cyanosis: boolean;
      edema: string;
      jugularVeins: string;
    };
    palpation: {
      apicalImpulse: string;
      location: string;
      character: string;
      thrills: boolean;
    };
    auscultation: {
      heartSounds: {
        s1: string;
        s2: string;
        s3: boolean;
        s4: boolean;
      };
      murmurs: {
        systolic: boolean;
        diastolic: boolean;
        grade: string;
        location: string;
      };
    };
  };

  // Pulmonary Examination
  pulmonaryExam: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
    findings: string[];
  };

  // Vascular Examination
  vascularExam: {
    pulses: {
      carotid: { right: string; left: string; };
      radial: { right: string; left: string; };
      femoral: { right: string; left: string; };
      dorsalisPedis: { right: string; left: string; };
    };
    pulseCharacteristics: {
      rhythm: string;
      amplitude: string;
      contour: string;
    };
    ankleIndex: {
      armPressure: {
        right: number;
        left: number;
      };
      anklePressure: {
        right: number;
        left: number;
      };
      right: number;
      left: number;
      interpretation: string;
    };
    venousSystem: string[];
  };

  // ECG Findings
  ecg: {
    rhythm: string;
    rate: number;
    axis: string;
    intervals: {
      pr: number;
      qrs: number;
      qt: number;
    };
    findings: string[];
    interpretation: string;
  };

  // Clinical Scores
  clinicalScores: {
    chadsvasc: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    hasbled: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    grace: {
      age: number;
      heartRate: number;
      systolicBP: number;
      creatinine: number;
      killipClass: number;
      cardiacArrest: boolean;
      stSegmentDeviation: boolean;
      elevatedCardiacEnzymes: boolean;
      factors: string[];
      score: number;
      riskLevel: string;
      mortalityRisk: string;
    };
    timi: {
      factors: string[];
      score: number;
      riskLevel: string;
    };
    test6MinWalk: {
      distanciaRecorrida: number;
      disneaPostEjercicio: number;
      capacidadFuncional: string;
      porcentajePredicho: string;
    };
    escalaBorg: {
      valor: number;
      descripcion: string;
    };
  };

  // Management Plan
  management: {
    diagnosticPlan: string[];
    therapeuticPlan: string[];
    lifestyle: string[];
  };
}

export default function CardiologyDemo({ patientData, onComplete }: any) {
  // 🎯 STATE MANAGEMENT - Following EndocrinologyDemo Pattern
  // Función para calcular el Índice Tobillo-Brazo (ITB)
  const calculateITB = (armPressure: { right: number; left: number }, anklePressure: { right: number; left: number }) => {
    const maxArmPressure = Math.max(armPressure.right, armPressure.left);
    
    if (maxArmPressure === 0) {
      return { right: 0, left: 0, interpretation: 'Presión de brazo requerida' };
    }
    
    const rightITB = anklePressure.right / maxArmPressure;
    const leftITB = anklePressure.left / maxArmPressure;
    
    const getInterpretation = (itb: number) => {
      if (itb < 0.9) return 'Enfermedad arterial periférica';
      if (itb >= 0.9 && itb <= 1.3) return 'Normal';
      if (itb > 1.3) return 'Calcificación arterial';
      return 'Indeterminado';
    };
    
    const rightInterpretation = getInterpretation(rightITB);
    const leftInterpretation = getInterpretation(leftITB);
    
    return {
      right: Number(rightITB.toFixed(2)),
      left: Number(leftITB.toFixed(2)),
      interpretation: `Derecho: ${rightInterpretation}, Izquierdo: ${leftInterpretation}`
    };
  };

  const [cardioData, setCardioData] = useState<CardiologyData>({
    // Información de consulta
    consultaInfo: {
      tipo: 'primera',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      medico: 'Dr. Sistema',
      especialidad: 'Cardiología'
    },
    
    // Historial médico
    historialMedico: {
      consultasPrevias: [],
      medicamentosActuales: [],
      alergias: [],
      estudiosComplementarios: [],
      antecedentesPersonales: [],
      antecedentesFamiliares: []
    },
    
    // Campos específicos por tipo de consulta
    camposEspecificos: {
      impresionDiagnostica: '',
      planSeguimiento: ''
    },
    
    // Validaciones inteligentes
    validaciones: {
      interaccionesMedicamentosas: [],
      contraindicaciones: [],
      alertasClinicas: []
    },
    
    // Dashboard Metrics (existente)
    examProgress: 0,
    sectionsCompleted: 0,
    totalSections: 8,
    alertCount: 0,
    warningCount: 0,
    findingCount: 0,
    urgencyLevel: 'Normal',
     symptoms: {
      chestPain: [],
      dyspnea: [],
      palpitations: [],
      syncope: [],
      fatigue: []
    },
    riskFactors: {
      cardiovascular: [],
      metabolic: [],
      lifestyle: [],
      familial: []
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
      respiratoryRate: 0,
      oxygenSaturation: 0,
      temperature: 0
    },
    cardiovascularExam: {
      inspection: {
        generalAppearance: '',
        cyanosis: false,
        edema: '',
        jugularVeins: ''
      },
      palpation: {
        apicalImpulse: '',
        location: '',
        character: '',
        thrills: false
      },
      auscultation: {
        heartSounds: {
          s1: '',
          s2: '',
          s3: false,
          s4: false
        },
        murmurs: {
          systolic: false,
          diastolic: false,
          grade: '',
          location: ''
        }
      }
    },
    pulmonaryExam: {
      inspection: '',
      palpation: '',
      percussion: '',
      auscultation: '',
      findings: []
    },
    vascularExam: {
      pulses: {
        carotid: { right: '', left: '' },
        radial: { right: '', left: '' },
        femoral: { right: '', left: '' },
        dorsalisPedis: { right: '', left: '' }
      },
      pulseCharacteristics: {
        rhythm: '',
        amplitude: '',
        contour: ''
      },
      ankleIndex: {
        armPressure: {
          right: 0,
          left: 0
        },
        anklePressure: {
          right: 0,
          left: 0
        },
        right: 0,
        left: 0,
        interpretation: ''
      },
      venousSystem: []
    },
    ecg: {
      rhythm: '',
      rate: 0,
      axis: '',
      intervals: {
        pr: 0,
        qrs: 0,
        qt: 0
      },
      findings: [],
      interpretation: ''
    },
    clinicalScores: {
      chadsvasc: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      hasbled: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      grace: {
        age: 0,
        heartRate: 0,
        systolicBP: 0,
        creatinine: 0,
        killipClass: 1,
        cardiacArrest: false,
        stSegmentDeviation: false,
        elevatedCardiacEnzymes: false,
        factors: [],
        score: 0,
        riskLevel: '',
        mortalityRisk: ''
      },
      timi: {
        factors: [],
        score: 0,
        riskLevel: ''
      },
      test6MinWalk: {
        distanciaRecorrida: 0,
        disneaPostEjercicio: 0,
        capacidadFuncional: '',
        porcentajePredicho: ''
      },
      escalaBorg: {
        valor: 0,
        descripcion: 'Sin disnea'
      }
    },
    management: {
      diagnosticPlan: [],
      therapeuticPlan: [],
      lifestyle: []
    }
  });

  // UI State
  const [medicalReport, setMedicalReport] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['symptoms']);
  const [showSplitView, setShowSplitView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Effect para actualizar automáticamente el ITB
  useEffect(() => {
    const { armPressure, anklePressure } = cardioData.vascularExam.ankleIndex;
    if (armPressure.right > 0 || armPressure.left > 0 || anklePressure.right > 0 || anklePressure.left > 0) {
      const itbResult = calculateITB(armPressure, anklePressure);
      if (itbResult.right !== cardioData.vascularExam.ankleIndex.right || 
          itbResult.left !== cardioData.vascularExam.ankleIndex.left) {
        setCardioData(prev => ({
          ...prev,
          vascularExam: {
            ...prev.vascularExam,
            ankleIndex: {
              ...prev.vascularExam.ankleIndex,
              right: itbResult.right,
              left: itbResult.left,
              interpretation: itbResult.interpretation
            }
          }
        }));
      }
    }
  }, [cardioData.vascularExam.ankleIndex.armPressure, cardioData.vascularExam.ankleIndex.anklePressure]);

  // 🔄 EFECTOS AUTOMÁTICOS - Sistema de alertas inteligentes
  useEffect(() => {
    calculateRiskScores();
  }, [
    cardioData.vitalSigns,
    cardioData.symptoms,
    cardioData.clinicalScores,
    cardioData.riskFactors,
    cardioData.cardiovascularExam,
    cardioData.pulmonaryExam,
    cardioData.vascularExam,
    cardioData.ecg,
    cardioData.management
  ]);

  useEffect(() => {
    generateMedicalReport();
  }, [cardioData]);

  // 🔧 UNIVERSAL HELPER FUNCTIONS - Following EndocrinologyDemo Pattern
  const updateCardioData = useCallback((path: string, value: any) => {
    setCardioData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const updateArrayData = useCallback((path: string, item: string, checked: boolean) => {
    setCardioData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const arrayKey = keys[keys.length - 1];
      if (checked) {
        if (!current[arrayKey].includes(item)) {
          current[arrayKey] = [...current[arrayKey], item];
        }
      } else {
        current[arrayKey] = current[arrayKey].filter((i: string) => i !== item);
      }
      
      return newData;
    });
  }, []);

  // 🧮 CLINICAL AUTOMATION FUNCTIONS
  const calculateBMI = useCallback(() => {
    const { height, weight } = cardioData.anthropometry;
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      
      let category = '';
      if (bmi < 18.5) category = 'Bajo peso';
      else if (bmi < 25) category = 'Normal';
      else if (bmi < 30) category = 'Sobrepeso';
      else category = 'Obesidad';
      
      updateCardioData('anthropometry.bmi', bmi);
      updateCardioData('anthropometry.bmiCategory', category);
    }
  }, [cardioData.anthropometry, updateCardioData]);

  // 🧮 NUEVAS FUNCIONES DE CÁLCULO - Test de Marcha de 6 Minutos y Escala de Borg
  const calculate6MWT = useCallback((distancia: number, edad: number, altura: number, peso: number, sexo: 'M' | 'F') => {
    // Valores predichos según ecuaciones de referencia
    const predichoHombre = 7.57 * altura - 5.02 * edad - 1.76 * peso - 309;
    const predichoMujer = 2.11 * altura - 2.29 * peso - 5.78 * edad + 667;
    
    const predicho = sexo === 'M' ? predichoHombre : predichoMujer;
    const porcentaje = Math.round((distancia / predicho) * 100);
    
    let capacidad = '';
    if (porcentaje >= 80) capacidad = 'Normal';
    else if (porcentaje >= 60) capacidad = 'Levemente reducida';
    else if (porcentaje >= 40) capacidad = 'Moderadamente reducida';
    else capacidad = 'Severamente reducida';
    
    updateCardioData('clinicalScores.test6MinWalk.capacidadFuncional', capacidad);
    updateCardioData('clinicalScores.test6MinWalk.porcentajePredicho', `${porcentaje}%`);
  }, [updateCardioData]);

  const updateBorgScale = useCallback((valor: number) => {
    const escalaBorg = [
      { valor: 0, descripcion: 'Sin disnea' },
      { valor: 1, descripcion: 'Muy leve' },
      { valor: 2, descripcion: 'Leve' },
      { valor: 3, descripcion: 'Moderada' },
      { valor: 4, descripcion: 'Algo severa' },
      { valor: 5, descripcion: 'Severa' },
      { valor: 6, descripcion: '6' },
      { valor: 7, descripcion: 'Muy severa' },
      { valor: 8, descripcion: '8' },
      { valor: 9, descripcion: 'Muy muy severa' },
      { valor: 10, descripcion: 'Máxima' }
    ];
    
    const descripcion = escalaBorg.find(item => item.valor === valor)?.descripcion || 'Sin disnea';
    updateCardioData('clinicalScores.escalaBorg.valor', valor);
    updateCardioData('clinicalScores.escalaBorg.descripcion', descripcion);
  }, [updateCardioData]);

  // 🩺 ALGORITMOS DE EVALUACIÓN CLÍNICA
  
  // Evaluación de Dolor Torácico
  const evaluateChestPain = useCallback((symptoms: any) => {
    let score = 0;
    
    // Factores que aumentan probabilidad coronaria
    if (symptoms.chestPain.includes('Dolor opresivo')) score += 2;
    if (symptoms.chestPain.includes('Dolor con esfuerzo')) score += 2;
    if (symptoms.chestPain.includes('Dolor irradiado a brazo izquierdo')) score += 1;
    if (symptoms.chestPain.includes('Dolor irradiado a mandíbula')) score += 1;
    
    // Factores de riesgo cardiovascular
    const riskFactors = cardioData.riskFactors.cardiovascular.length + 
                       cardioData.riskFactors.metabolic.length;
    if (riskFactors >= 3) score += 1;
    
    // Factores que disminuyen probabilidad
    if (symptoms.chestPain.includes('Dolor punzante')) score -= 1;
    if (symptoms.chestPain.includes('Dolor en reposo')) score -= 1;
    
    let probability = '';
    let recommendation = '';
    
    if (score >= 6) {
      probability = 'Alta probabilidad coronaria (>85%)';
      recommendation = 'ECG inmediato, troponinas, considerar cateterismo';
    } else if (score >= 4) {
      probability = 'Probabilidad intermedia (15-85%)';
      recommendation = 'ECG, troponinas, prueba de esfuerzo o imagen';
    } else if (score >= 2) {
      probability = 'Baja probabilidad coronaria (5-15%)';
      recommendation = 'ECG, considerar otras causas';
    } else {
      probability = 'Muy baja probabilidad coronaria (<5%)';
      recommendation = 'Evaluar causas no coronarias';
    }
    
    return { score, probability, recommendation };
  }, [cardioData.riskFactors]);
  
  // Clasificación NYHA Funcional
  const evaluateNYHA = useCallback((toleranciaEjercicio: number) => {
    const clasificaciones = {
      1: {
        clase: 'NYHA I',
        descripcion: 'Sin limitación de la actividad física ordinaria',
        pronostico: 'Excelente'
      },
      2: {
        clase: 'NYHA II',
        descripcion: 'Ligera limitación de la actividad física',
        pronostico: 'Bueno'
      },
      3: {
        clase: 'NYHA III',
        descripcion: 'Marcada limitación de la actividad física',
        pronostico: 'Reservado'
      },
      4: {
        clase: 'NYHA IV',
        descripcion: 'Incapacidad para realizar actividad física sin molestias',
        pronostico: 'Malo'
      }
    };
    
    return clasificaciones[toleranciaEjercicio as keyof typeof clasificaciones] || clasificaciones[1];
  }, []);
  
  // Evaluación de Presión Arterial
  const evaluateBloodPressure = useCallback((systolic: number, diastolic: number) => {
    let categoria = '';
    let riesgo = '';
    let recomendacion = '';
    
    if (systolic < 90 || diastolic < 60) {
      categoria = 'Hipotensión arterial';
      riesgo = 'Alto';
      recomendacion = 'Evaluación inmediata, considerar causas secundarias';
    } else if (systolic < 120 && diastolic < 80) {
      categoria = 'Presión arterial normal';
      riesgo = 'Bajo';
      recomendacion = 'Mantener estilo de vida saludable';
    } else if (systolic < 130 && diastolic < 80) {
      categoria = 'Presión arterial normal-alta';
      riesgo = 'Bajo-Moderado';
      recomendacion = 'Modificaciones del estilo de vida';
    } else if (systolic < 140 || diastolic < 90) {
      categoria = 'Hipertensión arterial grado 1';
      riesgo = 'Moderado';
      recomendacion = 'Cambios de estilo de vida + considerar medicación';
    } else if (systolic < 180 || diastolic < 110) {
      categoria = 'Hipertensión arterial grado 2';
      riesgo = 'Alto';
      recomendacion = 'Medicación antihipertensiva inmediata';
    } else {
      categoria = 'Hipertensión arterial grado 3';
      riesgo = 'Muy Alto';
      recomendacion = 'Tratamiento inmediato, considerar hospitalización';
    }
    
    return { categoria, riesgo, recomendacion };
  }, []);

  // 🚨 SISTEMA DE ALERTAS INTELIGENTES
  const calculateRiskScores = useCallback(() => {
    let alertCount = 0;
    let warningCount = 0;
    let findingCount = 0;
    let urgencyLevel: 'Normal' | 'Observación' | 'Prioritario' | 'Crítico' = 'Normal';

    // ALERTAS CRÍTICAS - Emergencias cardiovasculares
    if (cardioData.vitalSigns.systolicBP < 90) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }
    
    if (cardioData.vitalSigns.heartRate > 150 || cardioData.vitalSigns.heartRate < 40) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }
    
    if (cardioData.symptoms.chestPain.includes('Dolor opresivo') && 
        cardioData.symptoms.chestPain.includes('Dolor con esfuerzo')) {
      alertCount++;
      urgencyLevel = 'Crítico';
    }

    // ALERTAS DE ADVERTENCIA - Factores de riesgo elevado
    if (cardioData.vitalSigns.systolicBP >= 180 || cardioData.vitalSigns.diastolicBP >= 110) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }
    
    if (cardioData.clinicalScores.chadsvasc.score >= 2) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }
    
    if (cardioData.clinicalScores.grace.score > 140) {
      warningCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Prioritario';
    }

    // ALERTAS INFORMATIVAS - Hallazgos relevantes
    if (cardioData.symptoms.dyspnea.length > 0 || cardioData.symptoms.palpitations.length > 0) {
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }
    
    if (cardioData.riskFactors.cardiovascular.length >= 3) {
      findingCount++;
      if (urgencyLevel === 'Normal') urgencyLevel = 'Observación';
    }

    // Calcular progreso del examen
    let sectionsCompleted = 0;
    const totalSections = 9;
    
    if (cardioData.symptoms.chestPain.length > 0 || cardioData.symptoms.dyspnea.length > 0) sectionsCompleted++;
    if (cardioData.anthropometry.bmi > 0) sectionsCompleted++;
    if (cardioData.vitalSigns.systolicBP > 0) sectionsCompleted++;
    if (cardioData.cardiovascularExam.inspection.generalAppearance !== '') sectionsCompleted++;
    if (cardioData.pulmonaryExam.inspection !== '') sectionsCompleted++;
    if (Object.values(cardioData.vascularExam.pulses.carotid).some(p => p !== '')) sectionsCompleted++;
    if (cardioData.ecg.rhythm !== '') sectionsCompleted++;
    if (cardioData.clinicalScores.chadsvasc.factors.length > 0) sectionsCompleted++;
    if (cardioData.management.diagnosticPlan.length > 0) sectionsCompleted++;
    
    const examProgress = Math.round((sectionsCompleted / totalSections) * 100);

    // Actualizar estado con alertas
    updateCardioData('alertCount', alertCount);
    updateCardioData('warningCount', warningCount);
    updateCardioData('findingCount', findingCount);
    updateCardioData('urgencyLevel', urgencyLevel);
    updateCardioData('examProgress', examProgress);
    updateCardioData('sectionsCompleted', sectionsCompleted);
    updateCardioData('totalSections', totalSections);
    // CHA₂DS₂-VASc Score
    const chadsFactors = cardioData.clinicalScores.chadsvasc.factors;
    let chadsScore = 0;
    
    const chadsMapping: { [key: string]: number } = {
      'insuficiencia-cardiaca': 1,
      'hipertension': 1,
      'edad-75': 2,
      'diabetes': 1,
      'ictus-avc': 2,
      'enfermedad-vascular': 1,
      'edad-65-74': 1,
      'sexo-femenino': 1
    };
    
    chadsFactors.forEach(factor => {
      chadsScore += chadsMapping[factor] || 0;
    });
    
    let chadsRisk = '';
    if (chadsScore === 0) chadsRisk = 'Bajo riesgo';
    else if (chadsScore === 1) chadsRisk = 'Riesgo intermedio';
    else chadsRisk = 'Alto riesgo';
    
    updateCardioData('clinicalScores.chadsvasc.score', chadsScore);
    updateCardioData('clinicalScores.chadsvasc.riskLevel', chadsRisk);

    // HAS-BLED Score
    const hasbledScore = cardioData.clinicalScores.hasbled.factors.length;
    let hasbledRisk = '';
    if (hasbledScore <= 2) hasbledRisk = 'Bajo riesgo hemorrágico';
    else if (hasbledScore === 3) hasbledRisk = 'Riesgo moderado';
    else hasbledRisk = 'Alto riesgo hemorrágico';
    
    updateCardioData('clinicalScores.hasbled.score', hasbledScore);
    updateCardioData('clinicalScores.hasbled.riskLevel', hasbledRisk);

    // GRACE Score (implementación validada)
    const grace = cardioData.clinicalScores.grace;
    let graceScore = 0;
    
    // Edad (0-100 años)
    if (grace.age < 30) graceScore += 0;
    else if (grace.age < 40) graceScore += 8;
    else if (grace.age < 50) graceScore += 25;
    else if (grace.age < 60) graceScore += 41;
    else if (grace.age < 70) graceScore += 58;
    else if (grace.age < 80) graceScore += 75;
    else if (grace.age < 90) graceScore += 91;
    else graceScore += 100;
    
    // Frecuencia cardíaca (lpm)
    if (grace.heartRate < 50) graceScore += 0;
    else if (grace.heartRate < 70) graceScore += 3;
    else if (grace.heartRate < 90) graceScore += 9;
    else if (grace.heartRate < 110) graceScore += 15;
    else if (grace.heartRate < 150) graceScore += 24;
    else if (grace.heartRate < 200) graceScore += 38;
    else graceScore += 46;
    
    // Presión arterial sistólica (mmHg)
    if (grace.systolicBP < 80) graceScore += 58;
    else if (grace.systolicBP < 100) graceScore += 53;
    else if (grace.systolicBP < 120) graceScore += 43;
    else if (grace.systolicBP < 140) graceScore += 34;
    else if (grace.systolicBP < 160) graceScore += 24;
    else if (grace.systolicBP < 200) graceScore += 10;
    else graceScore += 0;
    
    // Creatinina (mg/dL)
    if (grace.creatinine < 0.4) graceScore += 1;
    else if (grace.creatinine < 0.8) graceScore += 4;
    else if (grace.creatinine < 1.2) graceScore += 7;
    else if (grace.creatinine < 1.6) graceScore += 10;
    else if (grace.creatinine < 2.0) graceScore += 13;
    else if (grace.creatinine < 4.0) graceScore += 21;
    else graceScore += 28;
    
    // Clase Killip
    if (grace.killipClass === 1) graceScore += 0;
    else if (grace.killipClass === 2) graceScore += 20;
    else if (grace.killipClass === 3) graceScore += 39;
    else if (grace.killipClass === 4) graceScore += 59;
    
    // Paro cardíaco al ingreso
    if (grace.cardiacArrest) graceScore += 39;
    
    // Desviación del segmento ST
    if (grace.stSegmentDeviation) graceScore += 28;
    
    // Enzimas cardíacas elevadas
    if (grace.elevatedCardiacEnzymes) graceScore += 14;
    
    // Interpretación del riesgo
    let graceRisk = '';
    let mortalityRisk = '';
    
    if (graceScore <= 108) {
      graceRisk = 'Bajo riesgo';
      mortalityRisk = 'Mortalidad hospitalaria <1%';
    } else if (graceScore <= 140) {
      graceRisk = 'Riesgo intermedio';
      mortalityRisk = 'Mortalidad hospitalaria 1-3%';
    } else {
      graceRisk = 'Alto riesgo';
      mortalityRisk = 'Mortalidad hospitalaria >3%';
    }
    
    updateCardioData('clinicalScores.grace.score', graceScore);
    updateCardioData('clinicalScores.grace.riskLevel', graceRisk);
    updateCardioData('clinicalScores.grace.mortalityRisk', mortalityRisk);

    // TIMI Score
    const timiScore = cardioData.clinicalScores.timi.factors.length;
    let timiRisk = '';
    if (timiScore <= 2) timiRisk = 'Bajo riesgo (4.7%)';
    else if (timiScore <= 4) timiRisk = 'Riesgo intermedio (19.9%)';
    else timiRisk = 'Alto riesgo (40.9%)';
    
    updateCardioData('clinicalScores.timi.score', timiScore);
    updateCardioData('clinicalScores.timi.riskLevel', timiRisk);
  }, [cardioData.clinicalScores, updateCardioData]);

  // 📄 GENERACIÓN AUTOMÁTICA DE REPORTE MÉDICO COMPLETO
  const generateMedicalReport = useCallback(() => {
    let report = 'INFORME CARDIOLÓGICO AUTOMATIZADO\n';
    report += '=' + '='.repeat(50) + '\n\n';
    
    report += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    report += `Urgencia: ${cardioData.urgencyLevel}\n`;
    report += `Progreso: ${cardioData.examProgress}%\n\n`;

    // DATOS ANTROPOMÉTRICOS
    if (cardioData.anthropometry.bmi > 0) {
      report += 'DATOS ANTROPOMÉTRICOS:\n';
      report += `• Talla: ${cardioData.anthropometry.height} cm\n`;
      report += `• Peso: ${cardioData.anthropometry.weight} kg\n`;
      report += `• IMC: ${cardioData.anthropometry.bmi} kg/m² (${cardioData.anthropometry.bmiCategory})\n`;
      if (cardioData.anthropometry.waistCircumference > 0) {
        report += `• Circunferencia abdominal: ${cardioData.anthropometry.waistCircumference} cm\n`;
      }
      report += '\n';
    }

    // SIGNOS VITALES
    if (cardioData.vitalSigns.systolicBP > 0 || cardioData.vitalSigns.heartRate > 0) {
      report += 'SIGNOS VITALES:\n';
      if (cardioData.vitalSigns.systolicBP > 0) {
        report += `• Presión arterial: ${cardioData.vitalSigns.systolicBP}/${cardioData.vitalSigns.diastolicBP} mmHg`;
        const bpEval = evaluateBloodPressure(cardioData.vitalSigns.systolicBP, cardioData.vitalSigns.diastolicBP);
        report += ` (${bpEval.categoria})\n`;
      }
      if (cardioData.vitalSigns.heartRate > 0) {
        report += `• Frecuencia cardíaca: ${cardioData.vitalSigns.heartRate} lpm\n`;
      }
      if (cardioData.vitalSigns.respiratoryRate > 0) {
        report += `• Frecuencia respiratoria: ${cardioData.vitalSigns.respiratoryRate} rpm\n`;
      }
      if (cardioData.vitalSigns.oxygenSaturation > 0) {
        report += `• Saturación de oxígeno: ${cardioData.vitalSigns.oxygenSaturation}%\n`;
      }
      if (cardioData.vitalSigns.temperature > 0) {
        report += `• Temperatura: ${cardioData.vitalSigns.temperature}°C\n`;
      }
      report += '\n';
    }

    // SÍNTOMAS CARDIOVASCULARES
    const allSymptoms = [
      ...cardioData.symptoms.chestPain,
      ...cardioData.symptoms.dyspnea,
      ...cardioData.symptoms.palpitations,
      ...cardioData.symptoms.syncope,
      ...cardioData.symptoms.fatigue
    ];
    if (allSymptoms.length > 0) {
      report += 'SÍNTOMAS CARDIOVASCULARES:\n';
      if (cardioData.symptoms.chestPain.length > 0) {
        report += `• Dolor torácico: ${cardioData.symptoms.chestPain.join(', ')}\n`;
      }
      if (cardioData.symptoms.dyspnea.length > 0) {
        report += `• Disnea: ${cardioData.symptoms.dyspnea.join(', ')}\n`;
      }
      if (cardioData.symptoms.palpitations.length > 0) {
        report += `• Palpitaciones: ${cardioData.symptoms.palpitations.join(', ')}\n`;
      }
      if (cardioData.symptoms.syncope.length > 0) {
        report += `• Síncope: ${cardioData.symptoms.syncope.join(', ')}\n`;
      }
      if (cardioData.symptoms.fatigue.length > 0) {
        report += `• Fatiga: ${cardioData.symptoms.fatigue.join(', ')}\n`;
      }
      report += '\n';
    }

    // FACTORES DE RIESGO
    const allRiskFactors = [
      ...cardioData.riskFactors.cardiovascular,
      ...cardioData.riskFactors.metabolic,
      ...cardioData.riskFactors.lifestyle,
      ...cardioData.riskFactors.familial
    ];
    if (allRiskFactors.length > 0) {
      report += 'FACTORES DE RIESGO CARDIOVASCULAR:\n';
      allRiskFactors.forEach(factor => report += `• ${factor}\n`);
      report += '\n';
    }

    // EXAMEN FÍSICO CARDIOVASCULAR
    if (cardioData.cardiovascularExam.inspection.generalAppearance || 
        cardioData.cardiovascularExam.palpation.apicalImpulse ||
        cardioData.cardiovascularExam.auscultation.heartSounds.s1) {
      report += 'EXAMEN FÍSICO CARDIOVASCULAR:\n';
      
      // Inspección
      if (cardioData.cardiovascularExam.inspection.generalAppearance) {
        report += `• Inspección general: ${cardioData.cardiovascularExam.inspection.generalAppearance}\n`;
      }
      if (cardioData.cardiovascularExam.inspection.cyanosis) {
        report += '• Cianosis presente\n';
      }
      if (cardioData.cardiovascularExam.inspection.edema) {
        report += `• Edemas: ${cardioData.cardiovascularExam.inspection.edema}\n`;
      }
      if (cardioData.cardiovascularExam.inspection.jugularVeins) {
        report += `• Venas yugulares: ${cardioData.cardiovascularExam.inspection.jugularVeins}\n`;
      }
      
      // Palpación
      if (cardioData.cardiovascularExam.palpation.apicalImpulse) {
        report += `• Latido apical: ${cardioData.cardiovascularExam.palpation.apicalImpulse}\n`;
      }
      if (cardioData.cardiovascularExam.palpation.location) {
        report += `• Localización: ${cardioData.cardiovascularExam.palpation.location}\n`;
      }
      if (cardioData.cardiovascularExam.palpation.thrills) {
        report += '• Frémitos presentes\n';
      }
      
      // Auscultación
      if (cardioData.cardiovascularExam.auscultation.heartSounds.s1) {
        report += `• R1: ${cardioData.cardiovascularExam.auscultation.heartSounds.s1}\n`;
        report += `• R2: ${cardioData.cardiovascularExam.auscultation.heartSounds.s2}\n`;
      }
      if (cardioData.cardiovascularExam.auscultation.heartSounds.s3) {
        report += '• R3 presente (galope ventricular)\n';
      }
      if (cardioData.cardiovascularExam.auscultation.heartSounds.s4) {
        report += '• R4 presente (galope auricular)\n';
      }
      if (cardioData.cardiovascularExam.auscultation.murmurs.systolic) {
        report += `• Soplo sistólico grado ${cardioData.cardiovascularExam.auscultation.murmurs.grade}\n`;
      }
      if (cardioData.cardiovascularExam.auscultation.murmurs.diastolic) {
        report += '• Soplo diastólico presente\n';
      }
      report += '\n';
    }

    // EXAMEN PULMONAR
    if (cardioData.pulmonaryExam.findings.length > 0) {
      report += 'EXAMEN PULMONAR:\n';
      if (cardioData.pulmonaryExam.inspection) {
        report += `• Inspección: ${cardioData.pulmonaryExam.inspection}\n`;
      }
      if (cardioData.pulmonaryExam.auscultation) {
        report += `• Auscultación: ${cardioData.pulmonaryExam.auscultation}\n`;
      }
      cardioData.pulmonaryExam.findings.forEach(finding => report += `• ${finding}\n`);
      report += '\n';
    }

    // EXAMEN VASCULAR
    if (cardioData.vascularExam.pulses.carotid.right || cardioData.vascularExam.ankleIndex.right > 0) {
      report += 'EXAMEN VASCULAR:\n';
      
      // Pulsos
      if (cardioData.vascularExam.pulses.carotid.right) {
        report += 'Pulsos arteriales:\n';
        report += `  - Carotídeos: Der ${cardioData.vascularExam.pulses.carotid.right}, Izq ${cardioData.vascularExam.pulses.carotid.left}\n`;
        report += `  - Radiales: Der ${cardioData.vascularExam.pulses.radial.right}, Izq ${cardioData.vascularExam.pulses.radial.left}\n`;
        report += `  - Femorales: Der ${cardioData.vascularExam.pulses.femoral.right}, Izq ${cardioData.vascularExam.pulses.femoral.left}\n`;
        report += `  - Pedios: Der ${cardioData.vascularExam.pulses.dorsalisPedis.right}, Izq ${cardioData.vascularExam.pulses.dorsalisPedis.left}\n`;
      }
      
      // Características del pulso
      if (cardioData.vascularExam.pulseCharacteristics.rhythm) {
        report += `• Ritmo: ${cardioData.vascularExam.pulseCharacteristics.rhythm}\n`;
        report += `• Amplitud: ${cardioData.vascularExam.pulseCharacteristics.amplitude}\n`;
        report += `• Contorno: ${cardioData.vascularExam.pulseCharacteristics.contour}\n`;
      }
      
      // Índice Tobillo-Brazo
      if (cardioData.vascularExam.ankleIndex.right > 0) {
        report += `• ITB Derecho: ${cardioData.vascularExam.ankleIndex.right}\n`;
        report += `• ITB Izquierdo: ${cardioData.vascularExam.ankleIndex.left}\n`;
        report += `• Interpretación: ${cardioData.vascularExam.ankleIndex.interpretation}\n`;
      }
      
      if (cardioData.vascularExam.venousSystem.length > 0) {
        report += `• Sistema venoso: ${cardioData.vascularExam.venousSystem.join(', ')}\n`;
      }
      report += '\n';
    }

    // ELECTROCARDIOGRAMA
    if (cardioData.ecg.rhythm || cardioData.ecg.findings.length > 0) {
      report += 'ELECTROCARDIOGRAMA:\n';
      if (cardioData.ecg.rhythm) {
        report += `• Ritmo: ${cardioData.ecg.rhythm}\n`;
      }
      if (cardioData.ecg.rate > 0) {
        report += `• Frecuencia: ${cardioData.ecg.rate} lpm\n`;
      }
      if (cardioData.ecg.axis) {
        report += `• Eje: ${cardioData.ecg.axis}\n`;
      }
      if (cardioData.ecg.intervals.pr > 0) {
        report += `• Intervalo PR: ${cardioData.ecg.intervals.pr} ms\n`;
      }
      if (cardioData.ecg.intervals.qrs > 0) {
        report += `• Ancho QRS: ${cardioData.ecg.intervals.qrs} ms\n`;
      }
      if (cardioData.ecg.intervals.qt > 0) {
        report += `• Intervalo QT: ${cardioData.ecg.intervals.qt} ms\n`;
      }
      if (cardioData.ecg.findings.length > 0) {
        report += 'Hallazgos:\n';
        cardioData.ecg.findings.forEach(finding => report += `  • ${finding}\n`);
      }
      if (cardioData.ecg.interpretation) {
        report += `• Interpretación: ${cardioData.ecg.interpretation}\n`;
      }
      report += '\n';
    }

    // ESCALAS CLÍNICAS Y SCORES
    if (cardioData.clinicalScores.chadsvasc.score > 0 || 
        cardioData.clinicalScores.hasbled.score > 0 ||
        cardioData.clinicalScores.grace.score > 0 ||
        cardioData.clinicalScores.timi.score > 0) {
      report += 'ESCALAS DE RIESGO CARDIOVASCULAR:\n';
      
      if (cardioData.clinicalScores.chadsvasc.score > 0) {
        report += `• CHA₂DS₂-VASc: ${cardioData.clinicalScores.chadsvasc.score}/9 puntos (${cardioData.clinicalScores.chadsvasc.riskLevel})\n`;
        if (cardioData.clinicalScores.chadsvasc.factors.length > 0) {
          report += `  Factores: ${cardioData.clinicalScores.chadsvasc.factors.join(', ')}\n`;
        }
      }
      
      if (cardioData.clinicalScores.hasbled.score > 0) {
        report += `• HAS-BLED: ${cardioData.clinicalScores.hasbled.score}/9 puntos (${cardioData.clinicalScores.hasbled.riskLevel})\n`;
        if (cardioData.clinicalScores.hasbled.factors.length > 0) {
          report += `  Factores: ${cardioData.clinicalScores.hasbled.factors.join(', ')}\n`;
        }
      }
      
      if (cardioData.clinicalScores.grace.score > 0) {
        report += `• GRACE: ${cardioData.clinicalScores.grace.score} puntos (${cardioData.clinicalScores.grace.riskLevel})\n`;
        report += `  Riesgo de mortalidad: ${cardioData.clinicalScores.grace.mortalityRisk}\n`;
      }
      
      if (cardioData.clinicalScores.timi.score > 0) {
        report += `• TIMI: ${cardioData.clinicalScores.timi.score}/7 puntos (${cardioData.clinicalScores.timi.riskLevel})\n`;
      }
      
      report += '\n';
    }

    // TEST FUNCIONALES
    if (cardioData.clinicalScores.test6MinWalk.distanciaRecorrida > 0 || 
        cardioData.clinicalScores.escalaBorg.valor > 0) {
      report += 'EVALUACIÓN FUNCIONAL:\n';
      
      if (cardioData.clinicalScores.test6MinWalk.distanciaRecorrida > 0) {
        report += `• Test de marcha 6 minutos: ${cardioData.clinicalScores.test6MinWalk.distanciaRecorrida} metros\n`;
        report += `  Capacidad funcional: ${cardioData.clinicalScores.test6MinWalk.capacidadFuncional}\n`;
        report += `  Porcentaje predicho: ${cardioData.clinicalScores.test6MinWalk.porcentajePredicho}\n`;
        if (cardioData.clinicalScores.test6MinWalk.disneaPostEjercicio > 0) {
          report += `  Disnea post-ejercicio: ${cardioData.clinicalScores.test6MinWalk.disneaPostEjercicio}/10 (Borg)\n`;
        }
      }
      
      if (cardioData.clinicalScores.escalaBorg.valor > 0) {
        report += `• Escala de Borg: ${cardioData.clinicalScores.escalaBorg.valor}/10 (${cardioData.clinicalScores.escalaBorg.descripcion})\n`;
      }
      
      report += '\n';
    }

    // ALERTAS CLÍNICAS
    if (cardioData.alertCount > 0 || cardioData.warningCount > 0) {
      report += 'ALERTAS CLÍNICAS:\n';
      if (cardioData.alertCount > 0) {
        report += `🚨 ${cardioData.alertCount} alertas críticas detectadas\n`;
      }
      if (cardioData.warningCount > 0) {
        report += `⚠️ ${cardioData.warningCount} advertencias identificadas\n`;
      }
      if (cardioData.findingCount > 0) {
        report += `ℹ️ ${cardioData.findingCount} hallazgos adicionales\n`;
      }
      report += '\n';
    }

    // PLAN DE MANEJO
    if (cardioData.management.diagnosticPlan.length > 0 || 
        cardioData.management.therapeuticPlan.length > 0 ||
        cardioData.management.lifestyle.length > 0) {
      report += 'PLAN DE MANEJO:\n';
      
      if (cardioData.management.diagnosticPlan.length > 0) {
        report += 'Plan diagnóstico:\n';
        cardioData.management.diagnosticPlan.forEach(plan => report += `  • ${plan}\n`);
      }
      
      if (cardioData.management.therapeuticPlan.length > 0) {
        report += 'Plan terapéutico:\n';
        cardioData.management.therapeuticPlan.forEach(plan => report += `  • ${plan}\n`);
      }
      
      if (cardioData.management.lifestyle.length > 0) {
        report += 'Modificaciones del estilo de vida:\n';
        cardioData.management.lifestyle.forEach(lifestyle => report += `  • ${lifestyle}\n`);
      }
      
      report += '\n';
    }

    // RESUMEN ESTADÍSTICO
    report += 'RESUMEN DEL EXAMEN:\n';
    report += `• Completitud: ${cardioData.examProgress}%\n`;
    report += `• Secciones completadas: ${cardioData.sectionsCompleted}/${cardioData.totalSections}\n`;
    report += `• Nivel de urgencia: ${cardioData.urgencyLevel}\n`;
    
    // Pie del informe
    report += '\n' + '='.repeat(52) + '\n';
    report += 'Informe generado automáticamente por el Sistema de Evaluación Cardiológica\n';
    report += `Fecha y hora: ${new Date().toLocaleString('es-ES')}\n`;
    
    setMedicalReport(report);
  }, [cardioData, evaluateBloodPressure]);

  // 📊 PROGRESS CALCULATION
  const calculateProgress = useCallback(() => {
    let completedSections = 0;
    let totalWeight = 0;
    let completedWeight = 0;
    
    // Weight each section
    const sectionWeights = {
      symptoms: 15,
      anthropometry: 10,
      vitals: 15,
      cardiovascular: 20,
      pulmonary: 10,
      vascular: 10,
      ecg: 10,
      scores: 10
    };
    
    Object.entries(sectionWeights).forEach(([section, weight]) => {
      totalWeight += weight;
      
      switch (section) {
        case 'symptoms':
          if (cardioData.symptoms.chestPain.length > 0 || cardioData.symptoms.dyspnea.length > 0) {
            completedWeight += weight;
            completedSections++;
          }
          break;
        case 'anthropometry':
          if (cardioData.anthropometry.bmi > 0) {
            completedWeight += weight;
            completedSections++;
          }
          break;
        case 'vitals':
          if (cardioData.vitalSigns.systolicBP > 0 && cardioData.vitalSigns.heartRate > 0) {
            completedWeight += weight;
            completedSections++;
          }
          break;
        case 'cardiovascular':
          if (cardioData.cardiovascularExam.inspection.generalAppearance !== '') {
            completedWeight += weight;
            completedSections++;
          }
          break;
        case 'scores':
          if (cardioData.clinicalScores.chadsvasc.factors.length > 0) {
            completedWeight += weight;
            completedSections++;
          }
          break;
        default:
          break;
      }
    });
    
    const progress = Math.round((completedWeight / totalWeight) * 100);
    
    updateCardioData('examProgress', progress);
    updateCardioData('sectionsCompleted', completedSections);
  }, [cardioData, updateCardioData]);

  // 🎯 EFFECTS - Following EndocrinologyDemo Pattern
  useEffect(() => {
    calculateBMI();
  }, [cardioData.anthropometry.height, cardioData.anthropometry.weight, calculateBMI]);

  useEffect(() => {
    calculateRiskScores();
  }, [cardioData.clinicalScores.chadsvasc.factors, cardioData.clinicalScores.hasbled.factors, 
      cardioData.clinicalScores.grace.factors, cardioData.clinicalScores.timi.factors, calculateRiskScores]);

  useEffect(() => {
    generateMedicalReport();
  }, [cardioData, generateMedicalReport]);

  useEffect(() => {
    calculateProgress();
  }, [cardioData, calculateProgress]);

  // 🔍 VALIDACIONES INTELIGENTES AUTOMÁTICAS
  useEffect(() => {
    const validarInteraccionesMedicamentosas = () => {
      const medicamentos = cardioData.historialMedico.medicamentosActuales
        .filter(med => med.activo)
        .map(med => med.nombre.toLowerCase());
      
      const interacciones = [];
      const contraindicaciones = [];
      const alertas = [];

      // Interacciones medicamentosas comunes en cardiología
      const interaccionesConocidas = [
        {
          medicamento1: 'warfarina',
          medicamento2: 'aspirina',
          severidad: 'severa',
          descripcion: 'Riesgo aumentado de sangrado'
        },
        {
          medicamento1: 'digoxina',
          medicamento2: 'furosemida',
          severidad: 'moderada',
          descripcion: 'La furosemida puede aumentar niveles de digoxina por depleción de potasio'
        },
        {
          medicamento1: 'enalapril',
          medicamento2: 'espironolactona',
          severidad: 'moderada',
          descripcion: 'Riesgo de hiperpotasemia'
        },
        {
          medicamento1: 'metoprolol',
          medicamento2: 'verapamilo',
          severidad: 'severa',
          descripcion: 'Riesgo de bradicardia severa y bloqueo AV'
        }
      ];

      // Verificar interacciones
      interaccionesConocidas.forEach(interaccion => {
        const tiene1 = medicamentos.some(med => med.includes(interaccion.medicamento1));
        const tiene2 = medicamentos.some(med => med.includes(interaccion.medicamento2));
        
        if (tiene1 && tiene2) {
          interacciones.push(interaccion);
          alertas.push({
            tipo: interaccion.severidad === 'severa' ? 'critica' : 'advertencia',
            mensaje: `Interacción ${interaccion.severidad}: ${interaccion.medicamento1} + ${interaccion.medicamento2}`,
            accion: `${interaccion.descripcion}. Monitorear estrechamente y considerar ajuste de dosis.`
          });
        }
      });

      // Contraindicaciones basadas en condiciones
      const condiciones = [
        ...cardioData.riskFactors.cardiovascular,
        ...cardioData.historialMedico.antecedentesPersonales
      ].map(c => c.toLowerCase());

      // Verificar contraindicaciones
      if (condiciones.some(c => c.includes('asma') || c.includes('epoc')) && 
          medicamentos.some(med => med.includes('metoprolol') || med.includes('propranolol'))) {
        contraindicaciones.push({
          medicamento: 'Beta-bloqueadores',
          condicion: 'Enfermedad pulmonar obstructiva',
          razon: 'Pueden causar broncoespasmo'
        });
        alertas.push({
          tipo: 'critica',
          mensaje: 'Contraindicación: Beta-bloqueadores en paciente con enfermedad pulmonar obstructiva',
          accion: 'Considerar beta-bloqueadores cardioselectivos o alternativas terapéuticas'
        });
      }

      if (condiciones.some(c => c.includes('insuficiencia renal')) && 
          medicamentos.some(med => med.includes('enalapril') || med.includes('losartan'))) {
        alertas.push({
          tipo: 'advertencia',
          mensaje: 'Precaución: IECA/ARA-II en paciente con insuficiencia renal',
          accion: 'Monitorear función renal y electrolitos regularmente'
        });
      }

      // Alertas por alergias
      cardioData.historialMedico.alergias.forEach(alergia => {
        if (alergia.tipo === 'medicamento' && 
            medicamentos.some(med => med.includes(alergia.sustancia.toLowerCase()))) {
          alertas.push({
            tipo: 'critica',
            mensaje: `ALERGIA CONOCIDA: ${alergia.sustancia}`,
            accion: `Suspender inmediatamente. Reacción previa: ${alergia.reaccion}. Severidad: ${alergia.severidad}`
          });
        }
      });

      // Actualizar validaciones
      updateCardioData('validaciones', {
        interaccionesMedicamentosas: interacciones,
        contraindicaciones: contraindicaciones,
        alertasClinicas: alertas
      });
    };

    // Solo ejecutar si hay medicamentos
    if (cardioData.historialMedico.medicamentosActuales.length > 0) {
      validarInteraccionesMedicamentosas();
    }
  }, [cardioData.historialMedico.medicamentosActuales, cardioData.riskFactors.cardiovascular, 
      cardioData.historialMedico.antecedentesPersonales, cardioData.historialMedico.alergias, updateCardioData]);

  // 📋 PREDEFINED MEDICAL DATA FOR ZERO-TYPING
  const chestPainSymptoms = [
    'Dolor opresivo', 'Dolor punzante', 'Dolor urente', 'Presión torácica',
    'Dolor irradiado a brazo izquierdo', 'Dolor irradiado a mandíbula', 'Dolor irradiado a espalda',
    'Dolor con esfuerzo', 'Dolor en reposo', 'Dolor nocturno'
  ];

  const dyspneaSymptoms = [
    'Disnea de esfuerzo', 'Disnea de reposo', 'Ortopnea', 'Disnea paroxística nocturna',
    'Disnea progresiva', 'Disnea súbita', 'Disnea con palpitaciones'
  ];

  const palpitationSymptoms = [
    'Palpitaciones regulares', 'Palpitaciones irregulares', 'Taquicardia',
    'Bradicardia', 'Extrasístoles', 'Palpitaciones con mareo', 'Palpitaciones nocturnas'
  ];

  const cardiovascularRiskFactors = [
    'Hipertensión arterial', 'Diabetes mellitus', 'Dislipidemia', 'Obesidad',
    'Síndrome metabólico', 'Enfermedad renal crónica', 'Enfermedad arterial periférica'
  ];

  const lifestyleRiskFactors = [
    'Tabaquismo activo', 'Tabaquismo pasivo', 'Sedentarismo', 'Dieta rica en sodio',
    'Consumo excesivo de alcohol', 'Estrés crónico', 'Insomnio'
  ];

  const chadsVascFactors = [
    'insuficiencia-cardiaca', 'hipertension', 'edad-75', 'diabetes',
    'ictus-avc', 'enfermedad-vascular', 'edad-65-74', 'sexo-femenino'
  ];

  const hasbledFactors = [
    'Hipertensión no controlada', 'Función renal/hepática anormal', 'Ictus previo',
    'Historia de sangrado', 'INR lábil', 'Edad >65 años', 'Fármacos/alcohol'
  ];

  const diagnosticTests = [
    'Electrocardiograma', 'Ecocardiograma transtorácico', 'Radiografía de tórax',
    'Prueba de esfuerzo', 'Holter 24h', 'Cateterismo cardíaco', 'Angio-TC coronario',
    'Resonancia magnética cardíaca', 'Gammagrafía de perfusión miocárdica'
  ];

  const therapeuticOptions = [
    'IECA/ARA-II', 'Betabloqueadores', 'Diuréticos', 'Estatinas',
    'Antiagregantes plaquetarios', 'Anticoagulantes', 'Nitratos',
    'Calcioantagonistas', 'Antiarrítmicos', 'Inotrópicos'
  ];

  // 🎯 SECTION MANAGEMENT
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

  // 📋 EXAM SECTIONS DEFINITION - DIFFERENTIATED FLOWS
  const examSections = [
    {
      id: 'consultation-type',
      title: 'Tipo de Consulta',
      description: 'Primera consulta, seguimiento, interconsulta o emergencia',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      progress: cardioData.consultaInfo.tipo !== 'primera' || Object.keys(cardioData.camposEspecificos).length > 0 ? 100 : 0,
      visible: true, // Always visible
      priority: 1
    },
    {
      id: 'medical-history',
      title: 'Historial Médico',
      description: 'Consultas previas, medicamentos, alergias, estudios',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      progress: cardioData.historialMedico.consultasPrevias.length > 0 || cardioData.historialMedico.medicamentosActuales.length > 0 ? 100 : 0,
      visible: true, // Always visible
      priority: 2
    },
    {
      id: 'symptoms',
      title: 'Síntomas Cardiovasculares',
      description: 'Dolor torácico, disnea, palpitaciones, síncope',
      icon: <Heart className="w-5 h-5 text-red-400" />,
      progress: cardioData.symptoms.chestPain.length + cardioData.symptoms.dyspnea.length > 0 ? 100 : 0,
      visible: ['primera', 'interconsulta', 'emergencia'].includes(cardioData.consultaInfo.tipo),
      priority: 3
    },
    {
      id: 'anthropometry',
      title: 'Antropometría',
      description: 'Talla, peso, IMC, circunferencia abdominal',
      icon: <Scale className="w-5 h-5 text-blue-400" />,
      progress: cardioData.anthropometry.bmi > 0 ? 100 : 0,
      visible: ['primera', 'seguimiento'].includes(cardioData.consultaInfo.tipo),
      priority: 4
    },
    {
      id: 'vitals',
      title: 'Signos Vitales',
      description: 'Presión arterial, frecuencia cardíaca, saturación',
      icon: <Activity className="w-5 h-5 text-green-400" />,
      progress: cardioData.vitalSigns.systolicBP > 0 ? 100 : 0,
      visible: true, // Always visible
      priority: cardioData.consultaInfo.tipo === 'emergencia' ? 2 : 5
    },
    {
      id: 'cardiovascular',
      title: 'Examen Cardiovascular',
      description: 'Inspección, palpación, auscultación cardíaca',
      icon: <Stethoscope className="w-5 h-5 text-purple-400" />,
      progress: cardioData.cardiovascularExam.inspection.generalAppearance !== '' ? 100 : 0,
      visible: true, // Always visible
      priority: cardioData.consultaInfo.tipo === 'emergencia' ? 3 : 6
    },
    {
      id: 'pulmonary',
      title: 'Examen Pulmonar',
      description: 'Inspección, palpación, percusión, auscultación',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      progress: cardioData.pulmonaryExam.inspection !== '' ? 100 : 0,
      visible: ['primera', 'interconsulta', 'emergencia'].includes(cardioData.consultaInfo.tipo),
      priority: 7
    },
    {
      id: 'vascular',
      title: 'Examen Vascular',
      description: 'Pulsos, índice tobillo-brazo, sistema venoso',
      icon: <Droplet className="w-5 h-5 text-orange-400" />,
      progress: Object.values(cardioData.vascularExam.pulses.carotid).some(p => p !== '') ? 100 : 0,
      visible: ['primera', 'interconsulta'].includes(cardioData.consultaInfo.tipo),
      priority: 8
    },
    {
      id: 'ecg',
      title: 'Electrocardiograma',
      description: 'Ritmo, frecuencia, intervalos, hallazgos',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      progress: cardioData.ecg.rhythm !== '' ? 100 : 0,
      visible: true, // Always visible
      priority: cardioData.consultaInfo.tipo === 'emergencia' ? 4 : 9
    },
    {
      id: 'scores',
      title: 'Escalas de Riesgo',
      description: 'CHA₂DS₂-VASc, HAS-BLED, GRACE, TIMI',
      icon: <Calculator className="w-5 h-5 text-pink-400" />,
      progress: cardioData.clinicalScores.chadsvasc.factors.length > 0 ? 100 : 0,
      visible: ['primera', 'interconsulta', 'emergencia'].includes(cardioData.consultaInfo.tipo),
      priority: cardioData.consultaInfo.tipo === 'emergencia' ? 5 : 10
    },
    {
      id: 'clinical-algorithms',
      title: 'Algoritmos Clínicos',
      description: 'Dolor torácico, NYHA, presión arterial',
      icon: <Target className="w-5 h-5 text-cyan-400" />,
      progress: (cardioData.symptoms.chestPain.length > 0 || cardioData.vitalSigns.systolicBP > 0) ? 100 : 0,
      visible: ['primera', 'interconsulta', 'emergencia'].includes(cardioData.consultaInfo.tipo),
      priority: 11
    },
    {
      id: 'management',
      title: 'Plan de Manejo',
      description: 'Diagnóstico, terapéutico, estilo de vida',
      icon: <ClipboardCheck className="w-5 h-5 text-indigo-400" />,
      progress: cardioData.management.diagnosticPlan.length > 0 ? 100 : 0,
      visible: true, // Always visible
      priority: 12
    }
  ];

  // 🔄 FILTERED AND SORTED SECTIONS BASED ON CONSULTATION TYPE
  const visibleSections = examSections
    .filter(section => section.visible)
    .sort((a, b) => a.priority - b.priority);

  // 📊 PROGRESS SECTIONS FOR DASHBOARD
  const progressSections = {
    síntomas: cardioData.symptoms.chestPain.length + cardioData.symptoms.dyspnea.length > 0,
    antropometría: cardioData.anthropometry.bmi > 0,
    signos: cardioData.vitalSigns.systolicBP > 0,
    cardiovascular: cardioData.cardiovascularExam.inspection.generalAppearance !== '',
    pulmonar: cardioData.pulmonaryExam.inspection !== '',
    vascular: Object.values(cardioData.vascularExam.pulses.carotid).some(p => p !== ''),
    ecg: cardioData.ecg.rhythm !== '',
    scores: cardioData.clinicalScores.chadsvasc.factors.length > 0,
    'algoritmos-clínicos': cardioData.symptoms.chestPain.length > 0 || cardioData.vitalSigns.systolicBP > 0,
    plan: cardioData.management.diagnosticPlan.length > 0
  };

  const alerts = [
    ...(cardioData.alertCount > 0 ? [{
      id: 'critical',
      type: 'urgent' as const,
      message: `⚠️ ${cardioData.alertCount} alertas críticas detectadas`,
      timestamp: new Date()
    }] : []),
    ...(cardioData.warningCount > 0 ? [{
      id: 'warning',
      type: 'warning' as const,
      message: `⚠️ ${cardioData.warningCount} factores de riesgo identificados`,
      timestamp: new Date()
    }] : [])
  ];

  const medicalScales = [
    ...(cardioData.clinicalScores.chadsvasc.riskLevel ? [{
      name: 'CHA₂DS₂-VASc',
      score: cardioData.clinicalScores.chadsvasc.score,
      interpretation: cardioData.clinicalScores.chadsvasc.riskLevel,
      riskLevel: cardioData.clinicalScores.chadsvasc.score >= 2 ? 'high' : 
                 cardioData.clinicalScores.chadsvasc.score === 1 ? 'intermediate' : 'low',
      recommendations: [cardioData.clinicalScores.chadsvasc.riskLevel]
    }] : []),
    ...(cardioData.clinicalScores.hasbled.riskLevel ? [{
      name: 'HAS-BLED',
      score: cardioData.clinicalScores.hasbled.score,
      interpretation: cardioData.clinicalScores.hasbled.riskLevel,
      riskLevel: cardioData.clinicalScores.hasbled.score >= 3 ? 'high' : 
                 cardioData.clinicalScores.hasbled.score === 2 ? 'intermediate' : 'low',
      recommendations: ['Evaluación riesgo hemorrágico']
    }] : []),
    ...(cardioData.clinicalScores.grace.riskLevel ? [{
      name: 'GRACE',
      score: cardioData.clinicalScores.grace.score,
      interpretation: cardioData.clinicalScores.grace.riskLevel,
      riskLevel: cardioData.clinicalScores.grace.score > 140 ? 'high' : 
                 cardioData.clinicalScores.grace.score > 108 ? 'intermediate' : 'low',
      recommendations: ['Estratificación síndrome coronario agudo']
    }] : [])
  ];

  const handleComplete = () => {
    onComplete?.({
      cardioData,
      medicalReport,
      alerts,
      medicalScales,
      progressPercentage: cardioData.examProgress,
      timestamp: new Date(),
      specialty: 'Cardiología'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-rose-800">
      
      {/* 🎯 HEADER ESTÁNDAR */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                <Heart className="h-8 w-8 text-red-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Cardiología</h1>
                <p className="text-white/70">Framework Universal - Principio ZERO-TYPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500/20 text-red-200 border border-red-500/30">
                {cardioData.examProgress}% Completado
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
            {visibleSections.map((section) => (
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
                            className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all"
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
                        
                        {/* 📋 TIPO DE CONSULTA */}
                        {section.id === 'consultation-type' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                Tipo de Consulta
                              </Label>
                              <Select 
                                value={cardioData.consultaInfo.tipo} 
                                onValueChange={(value: ConsultationType) => updateCardioData('consultaInfo.tipo', value)}
                              >
                                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                  <SelectValue placeholder="Seleccionar tipo de consulta" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="primera">Primera Consulta</SelectItem>
                                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                                  <SelectItem value="interconsulta">Interconsulta</SelectItem>
                                  <SelectItem value="emergencia">Emergencia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Fecha</Label>
                                <Input
                                  type="date"
                                  value={cardioData.consultaInfo.fecha}
                                  onChange={(e) => updateCardioData('consultaInfo.fecha', e.target.value)}
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Hora</Label>
                                <Input
                                  type="time"
                                  value={cardioData.consultaInfo.hora}
                                  onChange={(e) => updateCardioData('consultaInfo.hora', e.target.value)}
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>
                            
                            {/* Campos específicos según tipo de consulta */}
                            {cardioData.consultaInfo.tipo === 'primera' && (
                              <div className="space-y-4 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                                <h5 className="text-blue-200 font-medium">Campos Específicos - Primera Consulta</h5>
                                <div>
                                  <Label className="text-white">Motivo de Consulta *</Label>
                                  <textarea
                                    value={cardioData.camposEspecificos.motivoConsulta || ''}
                                    onChange={(e) => updateCardioData('camposEspecificos.motivoConsulta', e.target.value)}
                                    placeholder="Describa el motivo principal de la consulta..."
                                    className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Enfermedad Actual *</Label>
                                  <textarea
                                    value={cardioData.camposEspecificos.enfermedadActual || ''}
                                    onChange={(e) => updateCardioData('camposEspecificos.enfermedadActual', e.target.value)}
                                    placeholder="Describa la evolución de la enfermedad actual..."
                                    className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                                    rows={4}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {cardioData.consultaInfo.tipo === 'seguimiento' && (
                              <div className="space-y-4 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                                <h5 className="text-green-200 font-medium">Campos Específicos - Seguimiento</h5>
                                <div>
                                  <Label className="text-white">Evolución Clínica *</Label>
                                  <textarea
                                    value={cardioData.camposEspecificos.evolucionClinica || ''}
                                    onChange={(e) => updateCardioData('camposEspecificos.evolucionClinica', e.target.value)}
                                    placeholder="Describa la evolución desde la última consulta..."
                                    className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Adherencia al Tratamiento</Label>
                                  <textarea
                                    value={cardioData.camposEspecificos.adherenciaTratamiento || ''}
                                    onChange={(e) => updateCardioData('camposEspecificos.adherenciaTratamiento', e.target.value)}
                                    placeholder="Evalúe la adherencia al tratamiento prescrito..."
                                    className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                            
                            {(cardioData.consultaInfo.tipo === 'interconsulta' || cardioData.consultaInfo.tipo === 'emergencia') && (
                              <div className="space-y-4 p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                                <h5 className="text-red-200 font-medium">
                                  Campos Específicos - {cardioData.consultaInfo.tipo === 'interconsulta' ? 'Interconsulta' : 'Emergencia'}
                                </h5>
                                <div>
                                  <Label className="text-white">Motivo de {cardioData.consultaInfo.tipo === 'interconsulta' ? 'Interconsulta' : 'Emergencia'} *</Label>
                                  <textarea
                                    value={cardioData.camposEspecificos.motivoInterconsulta || ''}
                                    onChange={(e) => updateCardioData('camposEspecificos.motivoInterconsulta', e.target.value)}
                                    placeholder={`Describa el motivo de la ${cardioData.consultaInfo.tipo}...`}
                                    className="w-full mt-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
                                    rows={3}
                                  />
                                </div>
                                {cardioData.consultaInfo.tipo === 'emergencia' && (
                                  <div>
                                    <Label className="text-white">Nivel de Urgencia</Label>
                                    <Select 
                                      value={cardioData.camposEspecificos.urgenciaClinica || 'media'} 
                                      onValueChange={(value) => updateCardioData('camposEspecificos.urgenciaClinica', value)}
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="baja">Baja</SelectItem>
                                        <SelectItem value="media">Media</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                        <SelectItem value="critica">Crítica</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* 🕒 HISTORIAL MÉDICO */}
                        {section.id === 'medical-history' && (
                          <div className="space-y-6">
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                Historial Médico Previo
                              </Label>
                            </div>
                            
                            {/* Consultas Previas */}
                            <div className="p-4 bg-amber-500/20 rounded-lg border border-amber-400/30">
                              <h5 className="text-amber-200 font-medium mb-3">Consultas Previas</h5>
                              {cardioData.historialMedico.consultasPrevias.length === 0 ? (
                                <p className="text-white/70 text-sm">No hay consultas previas registradas</p>
                              ) : (
                                <div className="space-y-2">
                                  {cardioData.historialMedico.consultasPrevias.map((consulta, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="text-white font-medium">{consulta.fecha} - {consulta.tipo}</p>
                                          <p className="text-white/80 text-sm">{consulta.diagnostico}</p>
                                          <p className="text-white/60 text-xs">Dr. {consulta.medico}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Medicamentos Actuales */}
                            <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                              <h5 className="text-purple-200 font-medium mb-3">Medicamentos Actuales</h5>
                              {cardioData.historialMedico.medicamentosActuales.length === 0 ? (
                                <p className="text-white/70 text-sm">No hay medicamentos registrados</p>
                              ) : (
                                <div className="space-y-2">
                                  {cardioData.historialMedico.medicamentosActuales.map((med, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="text-white font-medium">{med.nombre}</p>
                                          <p className="text-white/80 text-sm">{med.dosis} - {med.frecuencia}</p>
                                          <p className="text-white/60 text-xs">Desde: {med.fechaInicio}</p>
                                        </div>
                                        <Badge className={med.activo ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'}>
                                          {med.activo ? 'Activo' : 'Suspendido'}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Alergias */}
                            <div className="p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                              <h5 className="text-red-200 font-medium mb-3">Alergias Conocidas</h5>
                              {cardioData.historialMedico.alergias.length === 0 ? (
                                <p className="text-white/70 text-sm">No hay alergias registradas</p>
                              ) : (
                                <div className="space-y-2">
                                  {cardioData.historialMedico.alergias.map((alergia, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="text-white font-medium">{alergia.sustancia}</p>
                                          <p className="text-white/80 text-sm">{alergia.reaccion}</p>
                                          <p className="text-white/60 text-xs">Tipo: {alergia.tipo}</p>
                                        </div>
                                        <Badge className={`${
                                          alergia.severidad === 'severa' ? 'bg-red-500/30 text-red-200' :
                                          alergia.severidad === 'moderada' ? 'bg-yellow-500/30 text-yellow-200' :
                                          'bg-green-500/30 text-green-200'
                                        }`}>
                                          {alergia.severidad}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Validaciones Inteligentes */}
                            {cardioData.validaciones.alertasClinicas.length > 0 && (
                              <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-400/30">
                                <h5 className="text-orange-200 font-medium mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Alertas Clínicas
                                </h5>
                                <div className="space-y-2">
                                  {cardioData.validaciones.alertasClinicas.map((alerta, index) => (
                                    <Alert key={index} className={`${
                                      alerta.tipo === 'critica' ? 'border-red-400/50 bg-red-500/20' :
                                      alerta.tipo === 'advertencia' ? 'border-yellow-400/50 bg-yellow-500/20' :
                                      'border-blue-400/50 bg-blue-500/20'
                                    }`}>
                                      <AlertDescription className="text-white">
                                        <strong>{alerta.tipo.toUpperCase()}:</strong> {alerta.mensaje}
                                        <br />
                                        <em>Acción recomendada: {alerta.accion}</em>
                                      </AlertDescription>
                                    </Alert>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* 💓 SÍNTOMAS CARDIOVASCULARES (ZERO-TYPING) */}
                        {section.id === 'symptoms' && (
                          <div className="space-y-6">
                            {/* Dolor Torácico */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                Dolor Torácico
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {chestPainSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`chest-pain-${symptom}`}
                                      checked={cardioData.symptoms.chestPain.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.chestPain', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`chest-pain-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Disnea */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Wind className="w-4 h-4 text-cyan-400" />
                                Disnea
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {dyspneaSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`dyspnea-${symptom}`}
                                      checked={cardioData.symptoms.dyspnea.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.dyspnea', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`dyspnea-${symptom}`} className="text-white text-sm cursor-pointer">
                                      {symptom}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator className="border-white/20" />

                            {/* Palpitaciones */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-400" />
                                Palpitaciones
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {palpitationSymptoms.map((symptom) => (
                                  <div key={symptom} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                    <Checkbox
                                      id={`palpitation-${symptom}`}
                                      checked={cardioData.symptoms.palpitations.includes(symptom)}
                                      onCheckedChange={(checked) => updateArrayData('symptoms.palpitations', symptom, checked as boolean)}
                                    />
                                    <Label htmlFor={`palpitation-${symptom}`} className="text-white text-sm cursor-pointer">
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
                                  value={cardioData.anthropometry.height || ''}
                                  onChange={(e) => updateCardioData('anthropometry.height', parseFloat(e.target.value) || 0)}
                                  placeholder="170"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Peso (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={cardioData.anthropometry.weight || ''}
                                  onChange={(e) => updateCardioData('anthropometry.weight', parseFloat(e.target.value) || 0)}
                                  placeholder="70.0"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Cintura (cm)</Label>
                                <Input
                                  type="number"
                                  value={cardioData.anthropometry.waistCircumference || ''}
                                  onChange={(e) => updateCardioData('anthropometry.waistCircumference', parseFloat(e.target.value) || 0)}
                                  placeholder="85"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>

                            {/* Resultado Automático */}
                            {cardioData.anthropometry.bmi > 0 && (
                              <Alert className="bg-blue-500/20 border-blue-400/30">
                                <Calculator className="h-4 w-4 text-blue-300" />
                                <AlertDescription className="text-white">
                                  <strong>Cálculo Automático:</strong> IMC = {cardioData.anthropometry.bmi} kg/m² 
                                  ({cardioData.anthropometry.bmiCategory})
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
                                  value={cardioData.vitalSigns.systolicBP || ''}
                                  onChange={(e) => updateCardioData('vitalSigns.systolicBP', parseFloat(e.target.value) || 0)}
                                  placeholder="120"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">TA Diastólica (mmHg)</Label>
                                <Input
                                  type="number"
                                  value={cardioData.vitalSigns.diastolicBP || ''}
                                  onChange={(e) => updateCardioData('vitalSigns.diastolicBP', parseFloat(e.target.value) || 0)}
                                  placeholder="80"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">FC (lpm)</Label>
                                <Input
                                  type="number"
                                  value={cardioData.vitalSigns.heartRate || ''}
                                  onChange={(e) => updateCardioData('vitalSigns.heartRate', parseFloat(e.target.value) || 0)}
                                  placeholder="72"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">SatO2 (%)</Label>
                                <Input
                                  type="number"
                                  value={cardioData.vitalSigns.oxygenSaturation || ''}
                                  onChange={(e) => updateCardioData('vitalSigns.oxygenSaturation', parseFloat(e.target.value) || 0)}
                                  placeholder="98"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 💓 EXAMEN CARDIOVASCULAR */}
                        {section.id === 'cardiovascular' && (
                          <div className="space-y-8">
                            {/* INSPECCIÓN GENERAL */}
                            <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                              <h5 className="font-medium text-blue-200 mb-4 flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                Inspección General
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Apariencia General:</Label>
                                  <Select value={cardioData.cardiovascularExam.inspection.generalAppearance} onValueChange={(value) => updateCardioData('cardiovascularExam.inspection.generalAppearance', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="distres-respiratorio">Distrés respiratorio</SelectItem>
                                      <SelectItem value="palidez">Palidez</SelectItem>
                                      <SelectItem value="diaforesis">Diaforesis</SelectItem>
                                      <SelectItem value="fatiga">Aspecto de fatiga</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Cianosis:</Label>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="cyanosis"
                                      checked={cardioData.cardiovascularExam.inspection.cyanosis}
                                      onCheckedChange={(checked) => updateCardioData('cardiovascularExam.inspection.cyanosis', checked)}
                                    />
                                    <Label htmlFor="cyanosis" className="text-white text-sm cursor-pointer">
                                      Presente
                                    </Label>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Edema:</Label>
                                  <Select value={cardioData.cardiovascularExam.inspection.edema} onValueChange={(value) => updateCardioData('cardiovascularExam.inspection.edema', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ausente">Ausente</SelectItem>
                                      <SelectItem value="maleolar">Maleolar</SelectItem>
                                      <SelectItem value="pretibial">Pretibial</SelectItem>
                                      <SelectItem value="generalizado">Generalizado</SelectItem>
                                      <SelectItem value="sacro">Sacro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Venas Yugulares:</Label>
                                  <Select value={cardioData.cardiovascularExam.inspection.jugularVeins} onValueChange={(value) => updateCardioData('cardiovascularExam.inspection.jugularVeins', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="ingurgitacion">Ingurgitación</SelectItem>
                                      <SelectItem value="colapso">Colapso</SelectItem>
                                      <SelectItem value="pulsacion-visible">Pulsación visible</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* INSPECCIÓN CARDÍACA */}
                            <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30">
                              <h5 className="font-medium text-red-200 mb-4 flex items-center">
                                <Heart className="w-4 h-4 mr-2" />
                                Inspección de Región Cardíaca
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Latido Apical Visible:</Label>
                                  <Select value={cardioData.cardiovascularExam.palpation.location} onValueChange={(value) => updateCardioData('cardiovascularExam.palpation.location', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="no-visible">No visible</SelectItem>
                                      <SelectItem value="5to-eic-lmc">5to EIC línea medioclavicular</SelectItem>
                                      <SelectItem value="desplazado-lateral">Desplazado lateral</SelectItem>
                                      <SelectItem value="desplazado-inferior">Desplazado inferior</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Deformidad Torácica:</Label>
                                  <Select value={cardioData.cardiovascularExam.palpation.character} onValueChange={(value) => updateCardioData('cardiovascularExam.palpation.character', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="pectus-excavatum">Pectus excavatum</SelectItem>
                                      <SelectItem value="pectus-carinatum">Pectus carinatum</SelectItem>
                                      <SelectItem value="escoliosis">Escoliosis</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* PALPACIÓN CARDÍACA */}
                            <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                              <h5 className="font-medium text-green-200 mb-4 flex items-center">
                                <Activity className="w-4 h-4 mr-2" />
                                Palpación Cardíaca
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Impulso Apical:</Label>
                                  <Select value={cardioData.cardiovascularExam.palpation.apicalImpulse} onValueChange={(value) => updateCardioData('cardiovascularExam.palpation.apicalImpulse', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="desplazado">Desplazado</SelectItem>
                                      <SelectItem value="hiperdinamico">Hiperdinámico</SelectItem>
                                      <SelectItem value="sostenido">Sostenido</SelectItem>
                                      <SelectItem value="no-palpable">No palpable</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Localización:</Label>
                                  <Select value={cardioData.cardiovascularExam.palpation.location} onValueChange={(value) => updateCardioData('cardiovascularExam.palpation.location', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5to-eic-lmc">5to EIC línea medioclavicular</SelectItem>
                                      <SelectItem value="desplazado-lateral">Desplazado lateral</SelectItem>
                                      <SelectItem value="desplazado-inferior">Desplazado inferior</SelectItem>
                                      <SelectItem value="difuso">Difuso</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white font-medium mb-2 block">Frémitos:</Label>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="thrills"
                                      checked={cardioData.cardiovascularExam.palpation.thrills}
                                      onCheckedChange={(checked) => updateCardioData('cardiovascularExam.palpation.thrills', checked)}
                                    />
                                    <Label htmlFor="thrills" className="text-white text-sm cursor-pointer">
                                      Presentes
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* AUSCULTACIÓN CARDÍACA */}
                            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
                              <h5 className="font-medium text-purple-200 mb-4 flex items-center">
                                <Stethoscope className="w-4 h-4 mr-2" />
                                Auscultación Cardíaca
                              </h5>
                              <div className="space-y-6">
                                {/* Ruidos Cardíacos */}
                                <div>
                                  <Label className="text-white font-medium mb-3 block">Ruidos Cardíacos:</Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-white mb-2 block">R1:</Label>
                                      <Select value={cardioData.cardiovascularExam.auscultation.heartSounds.s1} onValueChange={(value) => updateCardioData('cardiovascularExam.auscultation.heartSounds.s1', value)}>
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar R1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="hipofonico">Hipofónico</SelectItem>
                                          <SelectItem value="hiperfonico">Hiperfónico</SelectItem>
                                          <SelectItem value="desdoblado">Desdoblado</SelectItem>
                                          <SelectItem value="variable">Variable</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label className="text-white mb-2 block">R2:</Label>
                                      <Select value={cardioData.cardiovascularExam.auscultation.heartSounds.s2} onValueChange={(value) => updateCardioData('cardiovascularExam.auscultation.heartSounds.s2', value)}>
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                          <SelectValue placeholder="Seleccionar R2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="hipofonico">Hipofónico</SelectItem>
                                          <SelectItem value="hiperfonico">Hiperfónico</SelectItem>
                                          <SelectItem value="desdoblado">Desdoblado fisiológico</SelectItem>
                                          <SelectItem value="paradojico">Desdoblado paradójico</SelectItem>
                                          <SelectItem value="fijo">Desdoblado fijo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>

                                {/* Ruidos Adicionales */}
                                <div>
                                  <Label className="text-white font-medium mb-3 block">Ruidos Adicionales:</Label>
                                  <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="s3"
                                        checked={cardioData.cardiovascularExam.auscultation.heartSounds.s3}
                                        onCheckedChange={(checked) => updateCardioData('cardiovascularExam.auscultation.heartSounds.s3', checked)}
                                      />
                                      <Label htmlFor="s3" className="text-white text-sm cursor-pointer">
                                        R3 (Galope ventricular)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="s4"
                                        checked={cardioData.cardiovascularExam.auscultation.heartSounds.s4}
                                        onCheckedChange={(checked) => updateCardioData('cardiovascularExam.auscultation.heartSounds.s4', checked)}
                                      />
                                      <Label htmlFor="s4" className="text-white text-sm cursor-pointer">
                                        R4 (Galope auricular)
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                {/* Soplos */}
                                <div>
                                  <Label className="text-white font-medium mb-3 block">Soplos:</Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="systolic-murmur"
                                        checked={cardioData.cardiovascularExam.auscultation.murmurs.systolic}
                                        onCheckedChange={(checked) => updateCardioData('cardiovascularExam.auscultation.murmurs.systolic', checked)}
                                      />
                                      <Label htmlFor="systolic-murmur" className="text-white text-sm cursor-pointer">
                                        Soplo sistólico
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="diastolic-murmur"
                                        checked={cardioData.cardiovascularExam.auscultation.murmurs.diastolic}
                                        onCheckedChange={(checked) => updateCardioData('cardiovascularExam.auscultation.murmurs.diastolic', checked)}
                                      />
                                      <Label htmlFor="diastolic-murmur" className="text-white text-sm cursor-pointer">
                                        Soplo diastólico
                                      </Label>
                                    </div>
                                    <div>
                                      <Label className="text-white text-sm mb-1 block">Grado:</Label>
                                      <Select value={cardioData.cardiovascularExam.auscultation.murmurs.grade} onValueChange={(value) => updateCardioData('cardiovascularExam.auscultation.murmurs.grade', value)}>
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                          <SelectValue placeholder="Grado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">I/VI - Muy suave</SelectItem>
                                          <SelectItem value="2">II/VI - Suave</SelectItem>
                                          <SelectItem value="3">III/VI - Moderado</SelectItem>
                                          <SelectItem value="4">IV/VI - Fuerte</SelectItem>
                                          <SelectItem value="5">V/VI - Muy fuerte</SelectItem>
                                          <SelectItem value="6">VI/VI - Audible sin estetoscopio</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label className="text-white text-sm mb-1 block">Localización:</Label>
                                    <Select value={cardioData.cardiovascularExam.auscultation.murmurs.location} onValueChange={(value) => updateCardioData('cardiovascularExam.auscultation.murmurs.location', value)}>
                                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                        <SelectValue placeholder="Seleccionar localización" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="aortico">Foco aórtico</SelectItem>
                                        <SelectItem value="pulmonar">Foco pulmonar</SelectItem>
                                        <SelectItem value="tricuspideo">Foco tricuspídeo</SelectItem>
                                        <SelectItem value="mitral">Foco mitral</SelectItem>
                                        <SelectItem value="erb">Punto de Erb</SelectItem>
                                        <SelectItem value="generalizado">Generalizado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🫁 EXAMEN PULMONAR */}
                        {section.id === 'pulmonary' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Inspección</Label>
                                <Input
                                  value={cardioData.pulmonaryExam.inspection}
                                  onChange={(e) => updateCardioData('pulmonaryExam.inspection', e.target.value)}
                                  placeholder="Tórax simétrico, sin retracciones"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Auscultación</Label>
                                <Input
                                  value={cardioData.pulmonaryExam.auscultation}
                                  onChange={(e) => updateCardioData('pulmonaryExam.auscultation', e.target.value)}
                                  placeholder="Murmullo vesicular conservado"
                                  className="bg-white/5 border-white/20 text-white mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🩸 EXAMEN VASCULAR */}
                        {section.id === 'vascular' && (
                          <div className="space-y-6">
                            {/* Evaluación de Pulsos Arteriales */}
                            <div>
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-5 h-5 text-red-400" />
                                Pulsos Arteriales:
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(cardioData.vascularExam.pulses).map(([pulse, values]) => (
                                  <div key={pulse} className="space-y-2">
                                    <Label className="text-white capitalize">{pulse.replace(/([A-Z])/g, ' $1')}</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Select value={values.right} onValueChange={(value) => updateCardioData(`vascularExam.pulses.${pulse}.right`, value)}>
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                          <SelectValue placeholder="Derecho" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">0 - Ausente</SelectItem>
                                          <SelectItem value="1">1+ - Débil</SelectItem>
                                          <SelectItem value="2">2+ - Normal</SelectItem>
                                          <SelectItem value="3">3+ - Aumentado</SelectItem>
                                          <SelectItem value="4">4+ - Saltón</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Select value={values.left} onValueChange={(value) => updateCardioData(`vascularExam.pulses.${pulse}.left`, value)}>
                                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                          <SelectValue placeholder="Izquierdo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="0">0 - Ausente</SelectItem>
                                          <SelectItem value="1">1+ - Débil</SelectItem>
                                          <SelectItem value="2">2+ - Normal</SelectItem>
                                          <SelectItem value="3">3+ - Aumentado</SelectItem>
                                          <SelectItem value="4">4+ - Saltón</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Características del Pulso */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-400" />
                                Características del Pulso:
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Ritmo:</Label>
                                  <Select value={cardioData.vascularExam.pulseCharacteristics?.rhythm || ''} onValueChange={(value) => updateCardioData('vascularExam.pulseCharacteristics.rhythm', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="regular">Regular</SelectItem>
                                      <SelectItem value="irregular">Irregular</SelectItem>
                                      <SelectItem value="extrasistoles">Con extrasístoles</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Amplitud:</Label>
                                  <Select value={cardioData.vascularExam.pulseCharacteristics?.amplitude || ''} onValueChange={(value) => updateCardioData('vascularExam.pulseCharacteristics.amplitude', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="salton">Saltón</SelectItem>
                                      <SelectItem value="debil">Débil</SelectItem>
                                      <SelectItem value="filiforme">Filiforme</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Contorno:</Label>
                                  <Select value={cardioData.vascularExam.pulseCharacteristics?.contour || ''} onValueChange={(value) => updateCardioData('vascularExam.pulseCharacteristics.contour', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="bisferiens">Bisferiens</SelectItem>
                                      <SelectItem value="alternante">Alternante</SelectItem>
                                      <SelectItem value="paradojico">Paradójico</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Índice Tobillo-Brazo (ITB) */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-400/20">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-purple-400" />
                                Índice Tobillo-Brazo (ITB):
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Presiones */}
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-white text-sm font-medium mb-2 block">Presión Arterial Brazo (mmHg):</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label className="text-white text-xs">Derecho:</Label>
                                        <Input
                                          type="number"
                                          value={cardioData.vascularExam.ankleIndex?.armPressure?.right || ''}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            updateCardioData('vascularExam.ankleIndex.armPressure.right', value);
                                            calculateITB();
                                          }}
                                          placeholder="120"
                                          className="bg-white/5 border-white/20 text-white mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-white text-xs">Izquierdo:</Label>
                                        <Input
                                          type="number"
                                          value={cardioData.vascularExam.ankleIndex?.armPressure?.left || ''}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            updateCardioData('vascularExam.ankleIndex.armPressure.left', value);
                                            calculateITB();
                                          }}
                                          placeholder="120"
                                          className="bg-white/5 border-white/20 text-white mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-white text-sm font-medium mb-2 block">Presión Arterial Tobillo (mmHg):</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label className="text-white text-xs">Derecho:</Label>
                                        <Input
                                          type="number"
                                          value={cardioData.vascularExam.ankleIndex?.anklePressure?.right || ''}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            updateCardioData('vascularExam.ankleIndex.anklePressure.right', value);
                                            calculateITB();
                                          }}
                                          placeholder="120"
                                          className="bg-white/5 border-white/20 text-white mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-white text-xs">Izquierdo:</Label>
                                        <Input
                                          type="number"
                                          value={cardioData.vascularExam.ankleIndex?.anklePressure?.left || ''}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            updateCardioData('vascularExam.ankleIndex.anklePressure.left', value);
                                            calculateITB();
                                          }}
                                          placeholder="120"
                                          className="bg-white/5 border-white/20 text-white mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Resultados ITB */}
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-white text-sm font-medium mb-2 block">Índice Calculado:</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-white/10 rounded-lg p-3">
                                        <Label className="text-white text-xs">ITB Derecho:</Label>
                                        <div className="text-lg font-bold text-blue-300">
                                          {cardioData.vascularExam.ankleIndex?.right?.toFixed(2) || '0.00'}
                                        </div>
                                      </div>
                                      <div className="bg-white/10 rounded-lg p-3">
                                        <Label className="text-white text-xs">ITB Izquierdo:</Label>
                                        <div className="text-lg font-bold text-blue-300">
                                          {cardioData.vascularExam.ankleIndex?.left?.toFixed(2) || '0.00'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white/10 rounded-lg p-3">
                                    <Label className="text-white text-xs">Interpretación:</Label>
                                    <div className={`text-sm font-medium mt-1 ${
                                      cardioData.vascularExam.ankleIndex?.interpretation?.includes('Normal') ? 'text-green-300' :
                                      cardioData.vascularExam.ankleIndex?.interpretation?.includes('leve') ? 'text-yellow-300' :
                                      cardioData.vascularExam.ankleIndex?.interpretation?.includes('severa') ? 'text-red-300' :
                                      'text-gray-300'
                                    }`}>
                                      {cardioData.vascularExam.ankleIndex?.interpretation || 'Ingrese valores para calcular'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ⚡ ELECTROCARDIOGRAMA */}
                        {section.id === 'ecg' && (
                          <div className="space-y-6">
                            {/* Ritmo y Parámetros Básicos */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Ritmo y Frecuencia:
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Tipo de Ritmo:</Label>
                                  <Select value={cardioData.ecg.rhythm} onValueChange={(value) => updateCardioData('ecg.rhythm', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar ritmo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="sinusal">Sinusal</SelectItem>
                                      <SelectItem value="fibrilacion-auricular">Fibrilación auricular</SelectItem>
                                      <SelectItem value="flutter-auricular">Flutter auricular</SelectItem>
                                      <SelectItem value="ritmo-nodal">Ritmo nodal</SelectItem>
                                      <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Frecuencia (lpm):</Label>
                                  <Input
                                    type="number"
                                    value={cardioData.ecg.rate || ''}
                                    onChange={(e) => updateCardioData('ecg.rate', parseFloat(e.target.value) || 0)}
                                    placeholder="72"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Eje Eléctrico:</Label>
                                  <Select value={cardioData.ecg.axis} onValueChange={(value) => updateCardioData('ecg.axis', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Seleccionar eje" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal (0° a +90°)</SelectItem>
                                      <SelectItem value="desviacion-izquierda">Desviación izquierda (-30° a -90°)</SelectItem>
                                      <SelectItem value="desviacion-derecha">Desviación derecha (+90° a +180°)</SelectItem>
                                      <SelectItem value="desviacion-extrema">Desviación extrema (-90° a -180°)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Intervalos y Conducción */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-400" />
                                Intervalos y Conducción:
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <Label className="text-white text-sm">PR (ms):</Label>
                                  <Input
                                    type="number"
                                    value={cardioData.ecg.intervals.pr || ''}
                                    onChange={(e) => updateCardioData('ecg.intervals.pr', parseFloat(e.target.value) || 0)}
                                    placeholder="160"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                  <div className="text-xs text-gray-400 mt-1">Normal: 120-200ms</div>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">QRS (ms):</Label>
                                  <Input
                                    type="number"
                                    value={cardioData.ecg.intervals.qrs || ''}
                                    onChange={(e) => updateCardioData('ecg.intervals.qrs', parseFloat(e.target.value) || 0)}
                                    placeholder="100"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                  <div className="text-xs text-gray-400 mt-1">Normal: &lt;120ms</div>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">QT (ms):</Label>
                                  <Input
                                    type="number"
                                    value={cardioData.ecg.intervals.qt || ''}
                                    onChange={(e) => updateCardioData('ecg.intervals.qt', parseFloat(e.target.value) || 0)}
                                    placeholder="400"
                                    className="bg-white/5 border-white/20 text-white mt-1"
                                  />
                                  <div className="text-xs text-gray-400 mt-1">Variable según FC</div>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">QTc (ms):</Label>
                                  <Input
                                    type="number"
                                    value={cardioData.ecg.intervals.qt && cardioData.ecg.rate ? 
                                      Math.round(cardioData.ecg.intervals.qt / Math.sqrt(60/cardioData.ecg.rate)) : ''}
                                    readOnly
                                    placeholder="Calculado"
                                    className="bg-gray-600/30 border-gray-500/30 text-gray-300 mt-1"
                                  />
                                  <div className="text-xs text-gray-400 mt-1">Normal: &lt;440ms</div>
                                </div>
                              </div>
                              
                              {/* Bloqueos */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-white text-sm">Bloqueo AV:</Label>
                                  <Select value={cardioData.ecg.findings.find(f => f.includes('bloqueo-av'))?.split('-')[2] || ''} 
                                    onValueChange={(value) => {
                                      const newFindings = cardioData.ecg.findings.filter(f => !f.includes('bloqueo-av'));
                                      if (value) newFindings.push(`bloqueo-av-${value}`);
                                      updateCardioData('ecg.findings', newFindings);
                                    }}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Sin bloqueo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="">Sin bloqueo</SelectItem>
                                      <SelectItem value="primer-grado">Primer grado</SelectItem>
                                      <SelectItem value="segundo-grado-tipo-I">Segundo grado tipo I</SelectItem>
                                      <SelectItem value="segundo-grado-tipo-II">Segundo grado tipo II</SelectItem>
                                      <SelectItem value="tercer-grado">Tercer grado</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Bloqueo de Rama:</Label>
                                  <Select value={cardioData.ecg.findings.find(f => f.includes('bloqueo-rama'))?.split('-')[2] || ''} 
                                    onValueChange={(value) => {
                                      const newFindings = cardioData.ecg.findings.filter(f => !f.includes('bloqueo-rama'));
                                      if (value) newFindings.push(`bloqueo-rama-${value}`);
                                      updateCardioData('ecg.findings', newFindings);
                                    }}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Sin bloqueo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="">Sin bloqueo</SelectItem>
                                      <SelectItem value="BRD-completo">BRD completo</SelectItem>
                                      <SelectItem value="BRD-incompleto">BRD incompleto</SelectItem>
                                      <SelectItem value="BRI-completo">BRI completo</SelectItem>
                                      <SelectItem value="BRI-incompleto">BRI incompleto</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-white text-sm">Bloqueo Fascicular:</Label>
                                  <Select value={cardioData.ecg.findings.find(f => f.includes('bloqueo-fascicular'))?.split('-')[2] || ''} 
                                    onValueChange={(value) => {
                                      const newFindings = cardioData.ecg.findings.filter(f => !f.includes('bloqueo-fascicular'));
                                      if (value) newFindings.push(`bloqueo-fascicular-${value}`);
                                      updateCardioData('ecg.findings', newFindings);
                                    }}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                      <SelectValue placeholder="Sin bloqueo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="">Sin bloqueo</SelectItem>
                                      <SelectItem value="HAFAI">HAFAI</SelectItem>
                                      <SelectItem value="HFPAI">HFPAI</SelectItem>
                                      <SelectItem value="bifascicular">Bifascicular</SelectItem>
                                      <SelectItem value="trifascicular">Trifascicular</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Hipertrofia */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Signos de Hipertrofia:
                              </Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                  { key: 'hipertrofia-vi', label: 'Ventricular Izquierda' },
                                  { key: 'hipertrofia-vd', label: 'Ventricular Derecha' },
                                  { key: 'hipertrofia-ai', label: 'Auricular Izquierda' },
                                  { key: 'hipertrofia-ad', label: 'Auricular Derecha' }
                                ].map(item => (
                                  <div key={item.key} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={item.key}
                                      checked={cardioData.ecg.findings.includes(item.key)}
                                      onCheckedChange={(checked) => {
                                        updateArrayData('ecg.findings', item.key, checked as boolean);
                                      }}
                                      className="border-white/30 data-[state=checked]:bg-blue-500"
                                    />
                                    <Label htmlFor={item.key} className="text-white text-sm cursor-pointer">
                                      {item.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Cambios Isquémicos */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                Cambios Isquémicos:
                              </Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                {[
                                  { key: 'elevacion-st', label: 'Elevación ST' },
                                  { key: 'depresion-st', label: 'Depresión ST' },
                                  { key: 'inversion-t', label: 'Inversión T' },
                                  { key: 'ondas-q', label: 'Ondas Q patológicas' }
                                ].map(item => (
                                  <div key={item.key} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={item.key}
                                      checked={cardioData.ecg.findings.includes(item.key)}
                                      onCheckedChange={(checked) => {
                                        updateArrayData('ecg.findings', item.key, checked as boolean);
                                      }}
                                      className="border-white/30 data-[state=checked]:bg-red-500"
                                    />
                                    <Label htmlFor={item.key} className="text-white text-sm cursor-pointer">
                                      {item.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                              {cardioData.ecg.findings.some(f => ['elevacion-st', 'depresion-st', 'inversion-t', 'ondas-q'].includes(f)) && (
                                <div>
                                  <Label className="text-white text-sm">Localización:</Label>
                                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                                    {['Anterior', 'Inferior', 'Lateral', 'Posterior', 'Septal', 'Anteroseptal'].map(location => (
                                      <div key={location} className="flex items-center space-x-1">
                                        <Checkbox
                                          id={`loc-${location}`}
                                          checked={cardioData.ecg.findings.includes(`localizacion-${location.toLowerCase()}`)}
                                          onCheckedChange={(checked) => {
                                            updateArrayData('ecg.findings', `localizacion-${location.toLowerCase()}`, checked as boolean);
                                          }}
                                          className="border-white/30 data-[state=checked]:bg-orange-500"
                                        />
                                        <Label htmlFor={`loc-${location}`} className="text-white text-xs cursor-pointer">
                                          {location}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Arritmias */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <Gauge className="w-5 h-5 text-purple-400" />
                                Arritmias:
                              </Label>
                              <div className="space-y-4">
                                {/* Extrasístoles */}
                                <div>
                                  <Label className="text-white text-sm mb-2 block">Extrasístoles:</Label>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                      { key: 'extrasistoles-ventriculares', label: 'Ventriculares' },
                                      { key: 'extrasistoles-supraventriculares', label: 'Supraventriculares' },
                                      { key: 'extrasistoles-aisladas', label: 'Aisladas' },
                                      { key: 'extrasistoles-frecuentes', label: 'Frecuentes' }
                                    ].map(item => (
                                      <div key={item.key} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={item.key}
                                          checked={cardioData.ecg.findings.includes(item.key)}
                                          onCheckedChange={(checked) => {
                                            updateArrayData('ecg.findings', item.key, checked as boolean);
                                          }}
                                          className="border-white/30 data-[state=checked]:bg-purple-500"
                                        />
                                        <Label htmlFor={item.key} className="text-white text-xs cursor-pointer">
                                          {item.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Otras Arritmias */}
                                <div>
                                  <Label className="text-white text-sm mb-2 block">Otras Arritmias:</Label>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                      { key: 'taquicardia-sinusal', label: 'Taquicardia sinusal' },
                                      { key: 'bradicardia-sinusal', label: 'Bradicardia sinusal' },
                                      { key: 'taquicardia-supraventricular', label: 'TSV' },
                                      { key: 'taquicardia-ventricular', label: 'TV' },
                                      { key: 'fibrilacion-ventricular', label: 'FV' },
                                      { key: 'asistolia', label: 'Asistolia' }
                                    ].map(item => (
                                      <div key={item.key} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={item.key}
                                          checked={cardioData.ecg.findings.includes(item.key)}
                                          onCheckedChange={(checked) => {
                                            updateArrayData('ecg.findings', item.key, checked as boolean);
                                          }}
                                          className="border-white/30 data-[state=checked]:bg-indigo-500"
                                        />
                                        <Label htmlFor={item.key} className="text-white text-xs cursor-pointer">
                                          {item.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Interpretación */}
                            <div className="bg-white/5 rounded-lg p-4">
                              <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-400" />
                                Interpretación ECG:
                              </Label>
                              <textarea
                                value={cardioData.ecg.interpretation}
                                onChange={(e) => updateCardioData('ecg.interpretation', e.target.value)}
                                placeholder="Interpretación completa del ECG..."
                                className="w-full h-24 bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                              />
                            </div>
                          </div>
                        )}

                         {/* 🧮 ESCALAS DE RIESGO */}
                         {section.id === 'scores' && (
                           <div className="space-y-6">
                             {/* CHA₂DS₂-VASc Score */}
                             <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                               <h5 className="font-medium text-blue-200 mb-3 flex items-center">
                                 <Target className="w-4 h-4 mr-2" />
                                 Escala CHA₂DS₂-VASc (Fibrilación Auricular)
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                 {[
                                   { id: 'insuficiencia-cardiaca', label: 'Insuficiencia cardíaca (1pt)' },
                                   { id: 'hipertension', label: 'Hipertensión (1pt)' },
                                   { id: 'edad-75', label: 'Edad ≥75 años (2pts)' },
                                   { id: 'diabetes', label: 'Diabetes (1pt)' },
                                   { id: 'ictus-avc', label: 'ACV/AIT/Embolia (2pts)' },
                                   { id: 'enfermedad-vascular', label: 'Enfermedad vascular (1pt)' },
                                   { id: 'edad-65-74', label: 'Edad 65-74 años (1pt)' },
                                   { id: 'sexo-femenino', label: 'Sexo femenino (1pt)' }
                                 ].map((factor) => (
                                   <div key={factor.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`chads-${factor.id}`}
                                       checked={cardioData.clinicalScores.chadsvasc.factors.includes(factor.id)}
                                       onCheckedChange={(checked) => updateArrayData('clinicalScores.chadsvasc.factors', factor.id, checked as boolean)}
                                     />
                                     <Label htmlFor={`chads-${factor.id}`} className="text-white text-sm cursor-pointer">
                                       {factor.label}
                                     </Label>
                                   </div>
                                 ))}
                               </div>
                               <div className="p-3 bg-blue-600/30 rounded-lg">
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium text-blue-200">
                                     Puntuación Total: {cardioData.clinicalScores.chadsvasc.score}/9 puntos
                                   </span>
                                   <span className="text-sm text-blue-300">
                                     {cardioData.clinicalScores.chadsvasc.riskLevel}
                                   </span>
                                 </div>
                               </div>
                             </div>

                             {/* HAS-BLED Score */}
                             <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30">
                               <h5 className="font-medium text-red-200 mb-3 flex items-center">
                                 <Droplet className="w-4 h-4 mr-2" />
                                 Escala HAS-BLED (Riesgo Hemorrágico)
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                 {hasbledFactors.map((factor) => (
                                   <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`hasbled-${factor}`}
                                       checked={cardioData.clinicalScores.hasbled.factors.includes(factor)}
                                       onCheckedChange={(checked) => updateArrayData('clinicalScores.hasbled.factors', factor, checked as boolean)}
                                     />
                                     <Label htmlFor={`hasbled-${factor}`} className="text-white text-sm cursor-pointer">
                                       {factor} (1pt)
                                     </Label>
                                   </div>
                                 ))}
                               </div>
                               <div className="p-3 bg-red-600/30 rounded-lg">
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium text-red-200">
                                     Puntuación Total: {cardioData.clinicalScores.hasbled.score}/7 puntos
                                   </span>
                                   <span className="text-sm text-red-300">
                                     {cardioData.clinicalScores.hasbled.riskLevel}
                                   </span>
                                 </div>
                               </div>
                             </div>

                             {/* GRACE Score */}
                             <div className="p-4 rounded-lg bg-amber-500/20 border border-amber-400/30">
                               <h5 className="font-medium text-amber-200 mb-3 flex items-center">
                                 <TrendingUp className="w-4 h-4 mr-2" />
                                 Escala GRACE (Síndrome Coronario Agudo)
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                 {[
                                   'Edad >75 años', 'Frecuencia cardíaca >100', 'Presión sistólica <100',
                                   'Clase Killip II-IV', 'Elevación ST', 'Creatinina >2.0',
                                   'Paro cardíaco', 'Marcadores cardíacos elevados'
                                 ].map((factor) => (
                                   <div key={factor} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`grace-${factor}`}
                                       checked={cardioData.clinicalScores.grace.factors.includes(factor)}
                                       onCheckedChange={(checked) => updateArrayData('clinicalScores.grace.factors', factor, checked as boolean)}
                                     />
                                     <Label htmlFor={`grace-${factor}`} className="text-white text-sm cursor-pointer">
                                       {factor}
                                     </Label>
                                   </div>
                                 ))}
                               </div>
                               <div className="p-3 bg-amber-600/30 rounded-lg">
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium text-amber-200">
                                     Puntuación Estimada: {cardioData.clinicalScores.grace.score} puntos
                                   </span>
                                   <span className="text-sm text-amber-300">
                                     {cardioData.clinicalScores.grace.riskLevel}
                                   </span>
                                 </div>
                               </div>
                             </div>

                             {/* Test de Marcha de 6 Minutos */}
                             <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                               <h5 className="font-medium text-green-200 mb-3 flex items-center">
                                 <Timer className="w-4 h-4 mr-2" />
                                 Test de Marcha de 6 Minutos
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                   <Label className="text-white">Distancia Recorrida (metros)</Label>
                                   <Input
                                     type="number"
                                     value={cardioData.clinicalScores.test6MinWalk.distanciaRecorrida || ''}
                                     onChange={(e) => {
                                       const distancia = parseFloat(e.target.value) || 0;
                                       updateCardioData('clinicalScores.test6MinWalk.distanciaRecorrida', distancia);
                                       // Calcular automáticamente si tenemos datos antropométricos
                                       if (cardioData.anthropometry.height > 0 && cardioData.anthropometry.weight > 0) {
                                         calculate6MWT(distancia, 65, cardioData.anthropometry.height, cardioData.anthropometry.weight, 'M');
                                       }
                                     }}
                                     placeholder="450"
                                     className="bg-white/5 border-white/20 text-white mt-1"
                                   />
                                 </div>
                                 <div>
                                   <Label className="text-white">Disnea Post-Ejercicio (Borg 0-10)</Label>
                                   <Select
                                     value={cardioData.clinicalScores.test6MinWalk.disneaPostEjercicio.toString()}
                                     onValueChange={(value) => {
                                       const valorBorg = parseInt(value);
                                       updateCardioData('clinicalScores.test6MinWalk.disneaPostEjercicio', valorBorg);
                                       updateBorgScale(valorBorg);
                                     }}
                                   >
                                     <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                       <SelectValue placeholder="Seleccionar nivel" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {[0,1,2,3,4,5,6,7,8,9,10].map(valor => (
                                         <SelectItem key={valor} value={valor.toString()}>
                                           {valor} - {valor === 0 ? 'Sin disnea' : valor === 10 ? 'Máxima' : `Nivel ${valor}`}
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
                               </div>
                               <div className="p-3 bg-green-600/30 rounded-lg">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                     <span className="font-medium text-green-200 block">Capacidad Funcional:</span>
                                     <span className="text-sm text-green-300">
                                       {cardioData.clinicalScores.test6MinWalk.capacidadFuncional || 'Pendiente cálculo'}
                                     </span>
                                   </div>
                                   <div>
                                     <span className="font-medium text-green-200 block">% Predicho:</span>
                                     <span className="text-sm text-green-300">
                                       {cardioData.clinicalScores.test6MinWalk.porcentajePredicho || 'Pendiente cálculo'}
                                     </span>
                                   </div>
                                 </div>
                               </div>
                             </div>

                             {/* Escala de Borg para Disnea */}
                             <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
                               <h5 className="font-medium text-purple-200 mb-3 flex items-center">
                                 <Wind className="w-4 h-4 mr-2" />
                                 Escala de Borg para Disnea
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                   <Label className="text-white">Nivel de Disnea (0-10)</Label>
                                   <Select
                                     value={cardioData.clinicalScores.escalaBorg.valor.toString()}
                                     onValueChange={(value) => updateBorgScale(parseInt(value))}
                                   >
                                     <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                       <SelectValue placeholder="Seleccionar nivel" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {[
                                         { valor: 0, desc: 'Sin disnea' },
                                         { valor: 1, desc: 'Muy leve' },
                                         { valor: 2, desc: 'Leve' },
                                         { valor: 3, desc: 'Moderada' },
                                         { valor: 4, desc: 'Algo severa' },
                                         { valor: 5, desc: 'Severa' },
                                         { valor: 6, desc: 'Nivel 6' },
                                         { valor: 7, desc: 'Muy severa' },
                                         { valor: 8, desc: 'Nivel 8' },
                                         { valor: 9, desc: 'Muy muy severa' },
                                         { valor: 10, desc: 'Máxima' }
                                       ].map(item => (
                                         <SelectItem key={item.valor} value={item.valor.toString()}>
                                           {item.valor} - {item.desc}
                                         </SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
                               </div>
                               <div className="p-3 bg-purple-600/30 rounded-lg">
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium text-purple-200">
                                     Nivel Actual: {cardioData.clinicalScores.escalaBorg.valor}/10
                                   </span>
                                   <span className="text-sm text-purple-300">
                                     {cardioData.clinicalScores.escalaBorg.descripcion}
                                   </span>
                                 </div>
                               </div>
                             </div>

                             <Separator className="border-white/20" />

                             {/* 📝 TEXTAREAS OBLIGATORIAS ESPECÍFICAS */}
                             <div className="space-y-6">
                               {/* Impresión Diagnóstica - OBLIGATORIA */}
                               <div>
                                 <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                   <FileText className="w-4 h-4 text-red-400" />
                                   Impresión Diagnóstica *
                                   <Badge variant="destructive" className="ml-2">Obligatorio</Badge>
                                 </Label>
                                 <textarea
                                   className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                   placeholder="Escriba la impresión diagnóstica detallada basada en los hallazgos del examen..."
                                   value={cardioData.camposEspecificos.impresionDiagnostica || ''}
                                   onChange={(e) => updateCardioData('camposEspecificos.impresionDiagnostica', e.target.value)}
                                   required
                                 />
                                 {(!cardioData.camposEspecificos.impresionDiagnostica || cardioData.camposEspecificos.impresionDiagnostica.length < 10) && (
                                   <Alert className="mt-2 border-red-500/50 bg-red-500/10">
                                     <AlertTriangle className="h-4 w-4 text-red-400" />
                                     <AlertDescription className="text-red-300">
                                       La impresión diagnóstica es obligatoria y debe tener al menos 10 caracteres
                                     </AlertDescription>
                                   </Alert>
                                 )}
                               </div>

                               {/* Evolución Clínica - Para seguimiento */}
                               {cardioData.consultaInfo.tipo === 'seguimiento' && (
                                 <div>
                                   <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                     <Clock className="w-4 h-4 text-blue-400" />
                                     Evolución Clínica *
                                     <Badge variant="destructive" className="ml-2">Obligatorio</Badge>
                                   </Label>
                                   <textarea
                                     className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                     placeholder="Describa la evolución del paciente desde la última consulta, respuesta al tratamiento, nuevos síntomas..."
                                     value={cardioData.camposEspecificos.evolucionClinica || ''}
                                     onChange={(e) => updateCardioData('camposEspecificos.evolucionClinica', e.target.value)}
                                     required
                                   />
                                   {(!cardioData.camposEspecificos.evolucionClinica || cardioData.camposEspecificos.evolucionClinica.length < 10) && (
                                     <Alert className="mt-2 border-red-500/50 bg-red-500/10">
                                       <AlertTriangle className="h-4 w-4 text-red-400" />
                                       <AlertDescription className="text-red-300">
                                         La evolución clínica es obligatoria para consultas de seguimiento
                                       </AlertDescription>
                                     </Alert>
                                   )}
                                 </div>
                               )}

                               {/* Motivo de Interconsulta - Para interconsulta/emergencia */}
                               {(cardioData.consultaInfo.tipo === 'interconsulta' || cardioData.consultaInfo.tipo === 'emergencia') && (
                                 <div>
                                   <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                     <AlertTriangle className="w-4 h-4 text-orange-400" />
                                     Motivo de {cardioData.consultaInfo.tipo === 'interconsulta' ? 'Interconsulta' : 'Emergencia'} *
                                     <Badge variant="destructive" className="ml-2">Obligatorio</Badge>
                                   </Label>
                                   <textarea
                                     className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                     placeholder={`Especifique claramente el motivo de la ${cardioData.consultaInfo.tipo}, urgencia clínica y expectativas de la consulta...`}
                                     value={cardioData.camposEspecificos.motivoInterconsulta || ''}
                                     onChange={(e) => updateCardioData('camposEspecificos.motivoInterconsulta', e.target.value)}
                                     required
                                   />
                                   {(!cardioData.camposEspecificos.motivoInterconsulta || cardioData.camposEspecificos.motivoInterconsulta.length < 10) && (
                                     <Alert className="mt-2 border-red-500/50 bg-red-500/10">
                                       <AlertTriangle className="h-4 w-4 text-red-400" />
                                       <AlertDescription className="text-red-300">
                                         El motivo de {cardioData.consultaInfo.tipo} es obligatorio y debe ser específico
                                       </AlertDescription>
                                     </Alert>
                                   )}
                                 </div>
                               )}

                               {/* Plan de Seguimiento - Para todas las consultas */}
                               <div>
                                 <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-400" />
                                   Plan de Seguimiento
                                 </Label>
                                 <textarea
                                   className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                   placeholder="Indique próximos controles, estudios pendientes, recomendaciones específicas..."
                                   value={cardioData.camposEspecificos.planSeguimiento || ''}
                                   onChange={(e) => updateCardioData('camposEspecificos.planSeguimiento', e.target.value)}
                                 />
                               </div>
                             </div>
                           </div>
                         )}

                         {/* 🩺 ALGORITMOS DE EVALUACIÓN CLÍNICA */}
                         {section.id === 'clinical-algorithms' && (
                           <div className="space-y-6">
                             {/* Evaluación de Dolor Torácico */}
                             <div className="p-4 rounded-lg bg-red-500/20 border border-red-400/30">
                               <h5 className="font-medium text-red-200 mb-3 flex items-center">
                                 <Heart className="w-4 h-4 mr-2" />
                                 Evaluación de Dolor Torácico
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                   <Label className="text-white">Características del Dolor</Label>
                                   <div className="grid grid-cols-1 gap-2 mt-2">
                                     {[
                                       'Dolor opresivo', 'Dolor punzante', 'Dolor urente',
                                       'Dolor con esfuerzo', 'Dolor en reposo',
                                       'Dolor irradiado a brazo izquierdo', 'Dolor irradiado a mandíbula'
                                     ].map((symptom) => (
                                       <div key={symptom} className="flex items-center space-x-2">
                                         <Checkbox
                                           id={`chest-pain-${symptom}`}
                                           checked={cardioData.symptoms.chestPain.includes(symptom)}
                                           onCheckedChange={(checked) => updateArrayData('symptoms.chestPain', symptom, checked as boolean)}
                                         />
                                         <Label htmlFor={`chest-pain-${symptom}`} className="text-white text-sm cursor-pointer">
                                           {symptom}
                                         </Label>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 <div>
                                   <Label className="text-white">Evaluación Automática</Label>
                                   <div className="p-3 bg-red-600/30 rounded-lg mt-2">
                                     {(() => {
                                       const evaluation = evaluateChestPain({ chestPain: cardioData.symptoms.chestPain });
                                       return (
                                         <div className="space-y-2">
                                           <div>
                                             <span className="font-medium text-red-200 block">Puntuación:</span>
                                             <span className="text-sm text-red-300">{evaluation.score} puntos</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-red-200 block">Probabilidad:</span>
                                             <span className="text-sm text-red-300">{evaluation.probability}</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-red-200 block">Recomendación:</span>
                                             <span className="text-sm text-red-300">{evaluation.recommendation}</span>
                                           </div>
                                         </div>
                                       );
                                     })()} 
                                   </div>
                                 </div>
                               </div>
                             </div>

                             {/* Clasificación NYHA */}
                             <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                               <h5 className="font-medium text-blue-200 mb-3 flex items-center">
                                 <Activity className="w-4 h-4 mr-2" />
                                 Clasificación NYHA Funcional
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                   <Label className="text-white">Tolerancia al Ejercicio</Label>
                                   <Select
                                     value={cardioData.clinicalScores.escalaBorg.valor.toString()}
                                     onValueChange={(value) => {
                                       const nivel = parseInt(value);
                                       updateCardioData('clinicalScores.escalaBorg.valor', nivel);
                                     }}
                                   >
                                     <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                                       <SelectValue placeholder="Seleccionar clase NYHA" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       <SelectItem value="1">NYHA I - Sin limitación</SelectItem>
                                       <SelectItem value="2">NYHA II - Ligera limitación</SelectItem>
                                       <SelectItem value="3">NYHA III - Marcada limitación</SelectItem>
                                       <SelectItem value="4">NYHA IV - Incapacidad total</SelectItem>
                                     </SelectContent>
                                   </Select>
                                 </div>
                                 <div>
                                   <Label className="text-white">Evaluación NYHA</Label>
                                   <div className="p-3 bg-blue-600/30 rounded-lg mt-2">
                                     {(() => {
                                       const nyhaEval = evaluateNYHA(cardioData.clinicalScores.escalaBorg.valor || 1);
                                       return (
                                         <div className="space-y-2">
                                           <div>
                                             <span className="font-medium text-blue-200 block">Clase:</span>
                                             <span className="text-sm text-blue-300">{nyhaEval.clase}</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-blue-200 block">Descripción:</span>
                                             <span className="text-sm text-blue-300">{nyhaEval.descripcion}</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-blue-200 block">Pronóstico:</span>
                                             <span className="text-sm text-blue-300">{nyhaEval.pronostico}</span>
                                           </div>
                                         </div>
                                       );
                                     })()} 
                                   </div>
                                 </div>
                               </div>
                             </div>

                             {/* Evaluación de Presión Arterial */}
                             <div className="p-4 rounded-lg bg-green-500/20 border border-green-400/30">
                               <h5 className="font-medium text-green-200 mb-3 flex items-center">
                                 <Gauge className="w-4 h-4 mr-2" />
                                 Evaluación de Presión Arterial
                               </h5>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                   <Label className="text-white">Valores Actuales</Label>
                                   <div className="grid grid-cols-2 gap-2 mt-2">
                                     <div>
                                       <Label className="text-white text-sm">Sistólica</Label>
                                       <div className="text-lg font-bold text-green-300">
                                         {cardioData.vitalSigns.systolicBP || 0} mmHg
                                       </div>
                                     </div>
                                     <div>
                                       <Label className="text-white text-sm">Diastólica</Label>
                                       <div className="text-lg font-bold text-green-300">
                                         {cardioData.vitalSigns.diastolicBP || 0} mmHg
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                 <div>
                                   <Label className="text-white">Evaluación Automática</Label>
                                   <div className="p-3 bg-green-600/30 rounded-lg mt-2">
                                     {(() => {
                                       const bpEval = evaluateBloodPressure(
                                         cardioData.vitalSigns.systolicBP || 0,
                                         cardioData.vitalSigns.diastolicBP || 0
                                       );
                                       return (
                                         <div className="space-y-2">
                                           <div>
                                             <span className="font-medium text-green-200 block">Categoría:</span>
                                             <span className="text-sm text-green-300">{bpEval.categoria}</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-green-200 block">Riesgo:</span>
                                             <span className="text-sm text-green-300">{bpEval.riesgo}</span>
                                           </div>
                                           <div>
                                             <span className="font-medium text-green-200 block">Recomendación:</span>
                                             <span className="text-sm text-green-300">{bpEval.recomendacion}</span>
                                           </div>
                                         </div>
                                       );
                                     })()} 
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         )}

                         {/* 📋 PLAN DE MANEJO */}
                         {section.id === 'management' && (
                           <div className="space-y-6">
                             {/* Plan Diagnóstico */}
                             <div>
                               <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                 <FlaskConical className="w-4 h-4 text-blue-400" />
                                 Plan Diagnóstico
                               </Label>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                 {diagnosticTests.map((test) => (
                                   <div key={test} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`diagnostic-${test}`}
                                       checked={cardioData.management.diagnosticPlan.includes(test)}
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
                               <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                 <Shield className="w-4 h-4 text-green-400" />
                                 Plan Terapéutico
                               </Label>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                 {therapeuticOptions.map((option) => (
                                   <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`therapeutic-${option}`}
                                       checked={cardioData.management.therapeuticPlan.includes(option)}
                                       onCheckedChange={(checked) => updateArrayData('management.therapeuticPlan', option, checked as boolean)}
                                     />
                                     <Label htmlFor={`therapeutic-${option}`} className="text-white text-sm cursor-pointer">
                                       {option}
                                     </Label>
                                   </div>
                                 ))}
                               </div>
                             </div>

                             <Separator className="border-white/20" />

                             {/* Modificaciones del Estilo de Vida */}
                             <div>
                               <Label className="text-white font-semibold text-lg mb-3 block flex items-center gap-2">
                                 <Users className="w-4 h-4 text-purple-400" />
                                 Modificaciones del Estilo de Vida
                               </Label>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {[
                                   'Cesación tabáquica', 'Dieta cardiosaludable', 'Ejercicio regular',
                                   'Control de peso', 'Reducción de sodio', 'Limitación de alcohol',
                                   'Manejo del estrés', 'Adherencia medicamentosa'
                                 ].map((lifestyle) => (
                                   <div key={lifestyle} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                     <Checkbox
                                       id={`lifestyle-${lifestyle}`}
                                       checked={cardioData.management.lifestyle.includes(lifestyle)}
                                       onCheckedChange={(checked) => updateArrayData('management.lifestyle', lifestyle, checked as boolean)}
                                     />
                                     <Label htmlFor={`lifestyle-${lifestyle}`} className="text-white text-sm cursor-pointer">
                                       {lifestyle}
                                     </Label>
                                   </div>
                                 ))}
                               </div>
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
              riskLevel: scale.riskLevel.toLowerCase() as "critical" | "high" | "intermediate" | "low"
            }))}
            progressPercentage={cardioData.examProgress}
            progressSections={progressSections}
            onComplete={handleComplete}
            specialty="Cardiología"
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
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-700 dark:to-pink-600 rounded-t-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-red-600 dark:text-red-300" />
                Informe en Tiempo Real
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyReport}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Contenido del informe */}
            <div className="p-4 h-96 overflow-y-auto">
               <pre className="text-xs text-white/90 whitespace-pre-wrap font-mono leading-relaxed">
                 {medicalReport || 'Seleccione los parámetros del examen cardiovascular para generar el informe en tiempo real...'}
               </pre>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

      {/* BOTÓN DE COMPLETAR */}
      {isExpanded && onComplete && cardioData.examProgress >= 50 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completar Examen ({cardioData.examProgress}%)
          </Button>
        </div>
      )}
    </div>
  );
}