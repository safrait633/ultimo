import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { NewConsultationLayout } from "@/components/layout/NewConsultationLayout";
import { ChevronLeft, ChevronRight, Heart, Stethoscope, Activity, Calculator } from "lucide-react";

interface VitalSigns {
  systolic: string;
  diastolic: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  systolicLeft: string;
  diastolicLeft: string;
  oxygenSaturation: string;
}

interface Anamnesis {
  chestPain: boolean;
  chestPainDetails: {
    intensity: number;
    type: string;
    duration: string;
    location: string;
    triggers: string[];
    relief: string[];
  };
  dyspnea: boolean;
  dyspneaDetails: {
    intensity: number;
    type: string;
    triggers: string[];
  };
  palpitations: boolean;
  syncope: boolean;
  fatigue: boolean;
  exerciseTolerance: string;
  otherSymptoms: string;
}

interface PhysicalExam {
  // Inspección General
  generalAppearance: string[];
  cardiacInspection: string;
  inspectionDetails: string;
  
  // Palpación Cardíaca
  apicalBeat: string;
  apicalLocation: string;
  beatCharacteristics: string[];
  otherPalpationFindings: string[];
  
  // Percusión Cardíaca
  cardiacBorders: string;
  borderDetails: {
    right: string;
    left: string;
    upper: string;
  };
  
  // Campos existentes
  cardiacAuscultation: string;
  peripheralPulses: string;
  respiratorySystem: string;
  neurologicalExam: string;
  other: string;
  chestPain: boolean;
  chestPainIntensity: number;
  chestPainType: string;
  dyspnea: boolean;
  dyspneaIntensity: number;
  exerciseTolerance: string;
}

interface CardiacAuscultation {
  aortic: {
    r1: string;
    r2: string;
    systolicMurmur: boolean;
    systolicGrade: string;
    diastolicMurmur: boolean;
    diastolicGrade: string;
  };
  pulmonary: {
    r1: string;
    r2: string;
    systolicMurmur: boolean;
    systolicGrade: string;
    diastolicMurmur: boolean;
    diastolicGrade: string;
  };
  tricuspid: {
    r1: string;
    r2: string;
    systolicMurmur: boolean;
    systolicGrade: string;
    diastolicMurmur: boolean;
    diastolicGrade: string;
  };
  mitral: {
    r1: string;
    r2: string;
    systolicMurmur: boolean;
    systolicGrade: string;
    diastolicMurmur: boolean;
    diastolicGrade: string;
  };
  additionalSounds: string[];
  murmurCharacteristics: string;
}

interface CirculationExam {
  peripheralPulses: {
    carotid: { right: string; left: string; };
    radial: { right: string; left: string; };
    femoral: { right: string; left: string; };
    popliteal: { right: string; left: string; };
    dorsalPedis: { right: string; left: string; };
    posteriorTibial: { right: string; left: string; };
  };
  edema: {
    location: string[];
    severity: string;
    characteristics: string;
  };
  skinChanges: string[];
  capillaryRefill: string;
}

interface ECGFindings {
  rhythm: string;
  rate: number;
  axis: string;
  intervals: {
    pr: number;
    qrs: number;
    qt: number;
  };
  waveforms: string[];
  abnormalities: string[];
  interpretation: string;
}

interface VascularExam {
  rightArmSystolic: string;
  leftArmSystolic: string;
  rightAnkleSystolic: string;
  leftAnkleSystolic: string;
  itbRight: number;
  itbLeft: number;
}

interface RiskScales {
  chadsScore: number;
  chadsFactors: {
    heartFailure: boolean;
    hypertension: boolean;
    age75Plus: boolean;
    diabetes: boolean;
    strokeHistory: boolean;
    vascularDisease: boolean;
    age65to74: boolean;
    female: boolean;
  };
  hasbledScore: number;
  hasbledFactors: {
    hypertension: boolean;
    renalDisease: boolean;
    liverDisease: boolean;
    stroke: boolean;
    bleeding: boolean;
    labile: boolean;
    elderly: boolean;
    drugs: boolean;
  };
  timiScore: number;
  timiFactors: {
    age65Plus: boolean;
    riskFactors3Plus: boolean;
    stenosis50Plus: boolean;
    stDeviation: boolean;
    angina2Plus: boolean;
    aspirinUse: boolean;
    elevatedMarkers: boolean;
  };
  walk6min: string;
  walk6minDistance: number;
  borgScale: string;
  functionalCapacity: string;
}

export default function ConsultationForm() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  // Get consultation data from URL params first
  const urlParams = new URLSearchParams(window.location.search);
  const consultationCode = urlParams.get('code') || 'P009';
  const patientAge = urlParams.get('age') || '67';
  const patientGender = urlParams.get('gender') || 'M';
  const specialty = urlParams.get('specialty') || 'Cardiología';
  const reason = urlParams.get('reason') || '';
  
  // Get patient data from localStorage
  const [patientData, setPatientData] = useState(() => {
    try {
      const storedData = localStorage.getItem('currentPatientData');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error parsing patient data:', error);
    }
    return null;
  });

  const [activeSection, setActiveSection] = useState('vital-signs');

  // Configuración dinámica de secciones basada en especialidad
  const getSectionOrderBySpecialty = (specialty: string) => {
    const specialtyConfig: { [key: string]: string[] } = {
      'Cardiología': ['vital-signs', 'physical-exam', 'vascular-exam', 'risk-scales', 'diagnosis'],
      'Neurología': ['vital-signs', 'neurological-exam', 'cognitive-assessment', 'motor-function', 'diagnosis'],
      'Pediatría': ['vital-signs', 'growth-development', 'physical-exam', 'vaccination', 'diagnosis'],
      'Traumatología': ['vital-signs', 'musculoskeletal', 'joint-mobility', 'imaging-studies', 'diagnosis'],
      'Cirugía General': ['vital-signs', 'physical-exam', 'surgical-assessment', 'preoperative', 'diagnosis'],
      'Ginecología': ['vital-signs', 'gynecological-exam', 'reproductive-health', 'screening', 'diagnosis']
    };
    
    return specialtyConfig[specialty] || ['vital-signs', 'physical-exam', 'clinical-assessment', 'diagnosis'];
  };
  
  const sectionOrder = getSectionOrderBySpecialty(specialty);
  
  const getCurrentSectionIndex = () => sectionOrder.indexOf(activeSection);
  const isFirstSection = getCurrentSectionIndex() === 0;
  const isLastSection = getCurrentSectionIndex() === sectionOrder.length - 1;
  
  const goToPreviousSection = () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
    }
  };
  
  const goToNextSection = () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[currentIndex + 1]);
    }
  };

  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    systolic: '150',
    diastolic: '95',
    heartRate: '88',
    temperature: '',
    weight: '',
    height: '',
    systolicLeft: '148',
    diastolicLeft: '92',
    oxygenSaturation: '98'
  });

  const [anamnesis, setAnamnesis] = useState<Anamnesis>({
    chestPain: false,
    chestPainDetails: {
      intensity: 0,
      type: '',
      duration: '',
      location: '',
      triggers: [],
      relief: []
    },
    dyspnea: false,
    dyspneaDetails: {
      intensity: 0,
      type: '',
      triggers: []
    },
    palpitations: false,
    syncope: false,
    fatigue: false,
    exerciseTolerance: '',
    otherSymptoms: ''
  });

  const [physicalExam, setPhysicalExam] = useState<PhysicalExam>({
    // Inspección General
    generalAppearance: [],
    cardiacInspection: '',
    inspectionDetails: '',
    
    // Palpación Cardíaca
    apicalBeat: '',
    apicalLocation: '',
    beatCharacteristics: [],
    otherPalpationFindings: [],
    
    // Percusión Cardíaca
    cardiacBorders: '',
    borderDetails: {
      right: '',
      left: '',
      upper: ''
    },
    
    // Campos existentes
    cardiacAuscultation: '',
    peripheralPulses: 'Simétricos, presentes',
    respiratorySystem: '',
    neurologicalExam: '',
    other: '',
    chestPain: false,
    chestPainIntensity: 0,
    chestPainType: '',
    dyspnea: false,
    dyspneaIntensity: 0,
    exerciseTolerance: ''
  });

  const [cardiacAuscultation, setCardiacAuscultation] = useState<CardiacAuscultation>({
    aortic: {
      r1: '',
      r2: '',
      systolicMurmur: false,
      systolicGrade: '',
      diastolicMurmur: false,
      diastolicGrade: ''
    },
    pulmonary: {
      r1: '',
      r2: '',
      systolicMurmur: false,
      systolicGrade: '',
      diastolicMurmur: false,
      diastolicGrade: ''
    },
    tricuspid: {
      r1: '',
      r2: '',
      systolicMurmur: false,
      systolicGrade: '',
      diastolicMurmur: false,
      diastolicGrade: ''
    },
    mitral: {
      r1: '',
      r2: '',
      systolicMurmur: false,
      systolicGrade: '',
      diastolicMurmur: false,
      diastolicGrade: ''
    },
    additionalSounds: [],
    murmurCharacteristics: ''
  });

  const [circulation, setCirculation] = useState<CirculationExam>({
    peripheralPulses: {
      carotid: { right: '', left: '' },
      radial: { right: '', left: '' },
      femoral: { right: '', left: '' },
      popliteal: { right: '', left: '' },
      dorsalPedis: { right: '', left: '' },
      posteriorTibial: { right: '', left: '' }
    },
    edema: {
      location: [],
      severity: '',
      characteristics: ''
    },
    skinChanges: [],
    capillaryRefill: ''
  });

  const [ecgFindings, setEcgFindings] = useState<ECGFindings>({
    rhythm: '',
    rate: 0,
    axis: '',
    intervals: {
      pr: 0,
      qrs: 0,
      qt: 0
    },
    waveforms: [],
    abnormalities: [],
    interpretation: ''
  });

  // Variables de estado para escalas de riesgo
  const [chaScore, setChaScore] = useState(0);
  const [hasBlueScore, setHasBlueScore] = useState(0);
  const [timiScore, setTimiScore] = useState(0);
  const [wellensScore, setWellensScore] = useState(0);
  const [graceScore, setGraceScore] = useState(0);

  const [vascularExam, setVascularExam] = useState<VascularExam>({
    rightArmSystolic: '',
    leftArmSystolic: '',
    rightAnkleSystolic: '',
    leftAnkleSystolic: '',
    itbRight: 0,
    itbLeft: 0
  });

  const [riskScales, setRiskScales] = useState<RiskScales>({
    chadsScore: 0,
    chadsFactors: {
      heartFailure: false,
      hypertension: false,
      age75Plus: false,
      diabetes: false,
      strokeHistory: false,
      vascularDisease: false,
      age65to74: false,
      female: false
    },
    hasbledScore: 0,
    hasbledFactors: {
      hypertension: false,
      renalDisease: false,
      liverDisease: false,
      stroke: false,
      bleeding: false,
      labile: false,
      elderly: false,
      drugs: false
    },
    timiScore: 0,
    timiFactors: {
      age65Plus: false,
      riskFactors3Plus: false,
      stenosis50Plus: false,
      stDeviation: false,
      angina2Plus: false,
      aspirinUse: false,
      elevatedMarkers: false
    },
    walk6min: '',
    walk6minDistance: 0,
    borgScale: '',
    functionalCapacity: ''
  });

  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');

  // Función para calcular ITB (Índice Tobillo-Brazo)
  const calculateITB = (anklePressure: number, armPressure: number): number => {
    if (armPressure === 0) return 0;
    return Math.round((anklePressure / armPressure) * 100) / 100;
  };

  // Función para calcular CHA₂DS₂-VASc
  const calculateCHADSScore = (factors: typeof riskScales.chadsFactors): number => {
    let score = 0;
    if (factors.heartFailure) score += 1;
    if (factors.hypertension) score += 1;
    if (factors.age75Plus) score += 2;
    if (factors.diabetes) score += 1;
    if (factors.strokeHistory) score += 2;
    if (factors.vascularDisease) score += 1;
    if (factors.age65to74) score += 1;
    if (factors.female) score += 1;
    return score;
  };

  // Función para calcular HAS-BLED
  const calculateHASBLEDScore = (factors: typeof riskScales.hasbledFactors): number => {
    let score = 0;
    if (factors.hypertension) score += 1;
    if (factors.renalDisease) score += 1;
    if (factors.liverDisease) score += 1;
    if (factors.stroke) score += 1;
    if (factors.bleeding) score += 1;
    if (factors.labile) score += 1;
    if (factors.elderly) score += 1;
    if (factors.drugs) score += 1;
    return score;
  };

  // Función para calcular TIMI
  const calculateTIMIScore = (factors: typeof riskScales.timiFactors): number => {
    let score = 0;
    if (factors.age65Plus) score += 1;
    if (factors.riskFactors3Plus) score += 1;
    if (factors.stenosis50Plus) score += 1;
    if (factors.stDeviation) score += 1;
    if (factors.angina2Plus) score += 1;
    if (factors.aspirinUse) score += 1;
    if (factors.elevatedMarkers) score += 1;
    return score;
  };

  // Función para calcular CHA₂DS₂-VASc (usando riskScales)
  const calculateCHA2DS2VAScScore = (): number => {
    return riskScales.chadsScore;
  };

  // Función para calcular Wellens Score
  const calculateWellensScore = (): number => {
    return wellensScore;
  };

  // Función para calcular GRACE Score
  const calculateGRACEScore = (): number => {
    return graceScore;
  };

  // Actualizar puntajes automáticamente cuando cambien los factores
  useEffect(() => {
    const newChadsScore = calculateCHADSScore(riskScales.chadsFactors);
    const newHasbledScore = calculateHASBLEDScore(riskScales.hasbledFactors);
    const newTimiScore = calculateTIMIScore(riskScales.timiFactors);
    
    setRiskScales(prev => ({
      ...prev,
      chadsScore: newChadsScore,
      hasbledScore: newHasbledScore,
      timiScore: newTimiScore
    }));
  }, [riskScales.chadsFactors, riskScales.hasbledFactors, riskScales.timiFactors]);

  // Actualizar ITB automáticamente
  useEffect(() => {
    const rightArmSys = parseFloat(vascularExam.rightArmSystolic) || 0;
    const leftArmSys = parseFloat(vascularExam.leftArmSystolic) || 0;
    const rightAnkleSys = parseFloat(vascularExam.rightAnkleSystolic) || 0;
    const leftAnkleSys = parseFloat(vascularExam.leftAnkleSystolic) || 0;
    
    const maxArmPressure = Math.max(rightArmSys, leftArmSys);
    
    setVascularExam(prev => ({
      ...prev,
      itbRight: calculateITB(rightAnkleSys, maxArmPressure),
      itbLeft: calculateITB(leftAnkleSys, maxArmPressure)
    }));
  }, [vascularExam.rightArmSystolic, vascularExam.leftArmSystolic, vascularExam.rightAnkleSystolic, vascularExam.leftAnkleSystolic]);

  const handleFinishConsultation = () => {
    // Save consultation data
    const consultationData = {
      code: consultationCode,
      age: patientAge,
      gender: patientGender,
      specialty,
      reason,
      vitalSigns,
      physicalExam,
      diagnosis,
      treatment,
      notes,
      status: 'completed'
    };
    
    console.log('Saving consultation:', consultationData);
    
    // Navigate to PDF report
    setLocation('/consultation-report');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...');
    alert('Borrador guardado exitosamente');
  };

  const getAlerts = () => {
    const alerts = [];
    
    // Check blood pressure
    const systolic = parseInt(vitalSigns.systolic);
    const diastolic = parseInt(vitalSigns.diastolic);
    
    if (systolic >= 140 || diastolic >= 90) {
      alerts.push({
        type: 'error',
        title: 'Hipertensión Grado 1',
        description: `PA: ${vitalSigns.systolic}/${vitalSigns.diastolic} mmHg`
      });
    }
    
    // Check heart rate
    const heartRate = parseInt(vitalSigns.heartRate);
    if (heartRate > 100) {
      alerts.push({
        type: 'warning',
        title: 'Taquicardia',
        description: `FC: ${vitalSigns.heartRate} bpm`
      });
    } else if (heartRate > 85) {
      alerts.push({
        type: 'warning',
        title: 'Taquicardia Leve',
        description: `FC: ${vitalSigns.heartRate} bpm`
      });
    }

    return alerts;
  };

  // Función para recalcular ITB automáticamente
  const updateITBCalculation = () => {
    const rightArmSystolic = parseFloat(vascularExam.rightArmSystolic) || 0;
    const leftArmSystolic = parseFloat(vascularExam.leftArmSystolic) || 0;
    const rightAnkleSystolic = parseFloat(vascularExam.rightAnkleSystolic) || 0;
    const leftAnkleSystolic = parseFloat(vascularExam.leftAnkleSystolic) || 0;

    if (rightArmSystolic > 0 && rightAnkleSystolic > 0) {
      const maxArmPressure = Math.max(rightArmSystolic, leftArmSystolic > 0 ? leftArmSystolic : rightArmSystolic);
      const itbRight = rightAnkleSystolic / maxArmPressure;
      const itbLeft = leftAnkleSystolic > 0 ? leftAnkleSystolic / maxArmPressure : 0;

      setVascularExam(prev => ({
        ...prev,
        itbRight,
        itbLeft
      }));

      return { itbRight, itbLeft };
    }
    return { itbRight: 0, itbLeft: 0 };
  };

  const evaluateBloodPressure = (systolic: number, diastolic: number) => {
    if (systolic >= 180 || diastolic >= 110) {
      return { level: 'Hipertensión Grado 3 (Crisis)', color: 'text-red-600', priority: 'critical' };
    } else if (systolic >= 160 || diastolic >= 100) {
      return { level: 'Hipertensión Grado 2', color: 'text-red-500', priority: 'high' };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { level: 'Hipertensión Grado 1', color: 'text-orange-500', priority: 'medium' };
    } else if (systolic >= 130 || diastolic >= 80) {
      return { level: 'Presión Arterial Elevada', color: 'text-yellow-600', priority: 'low' };
    } else if (systolic < 90) {
      return { level: 'Hipotensión', color: 'text-blue-600', priority: 'medium' };
    } else {
      return { level: 'Normal', color: 'text-green-600', priority: 'none' };
    }
  };

  const evaluateHeartRate = (heartRate: number) => {
    if (heartRate > 150) {
      return { level: 'Taquicardia Severa', color: 'text-red-600', priority: 'critical' };
    } else if (heartRate > 120) {
      return { level: 'Taquicardia Moderada', color: 'text-red-500', priority: 'high' };
    } else if (heartRate > 100) {
      return { level: 'Taquicardia Leve', color: 'text-orange-500', priority: 'medium' };
    } else if (heartRate < 50) {
      return { level: 'Bradicardia', color: 'text-blue-600', priority: 'medium' };
    } else if (heartRate < 60) {
      return { level: 'Bradicardia Leve', color: 'text-blue-500', priority: 'low' };
    } else {
      return { level: 'Normal', color: 'text-green-600', priority: 'none' };
    }
  };

  const evaluateChestPain = () => {
    if (!physicalExam.chestPain) return { risk: 'Sin dolor torácico', color: 'text-green-600' };
    
    let riskScore = 0;
    
    // Intensidad del dolor (0-10)
    if (physicalExam.chestPainIntensity >= 8) riskScore += 3;
    else if (physicalExam.chestPainIntensity >= 5) riskScore += 2;
    else if (physicalExam.chestPainIntensity >= 3) riskScore += 1;

    // Tipo de dolor
    if (physicalExam.chestPainType === 'opresivo' || physicalExam.chestPainType === 'constrictivo') {
      riskScore += 2;
    } else if (physicalExam.chestPainType === 'punzante') {
      riskScore += 1;
    }

    if (riskScore >= 4) {
      return { risk: 'Alto riesgo coronario', color: 'text-red-600' };
    } else if (riskScore >= 2) {
      return { risk: 'Riesgo moderado', color: 'text-orange-500' };
    } else {
      return { risk: 'Bajo riesgo', color: 'text-yellow-600' };
    }
  };

  const calculateNYHAClass = () => {
    const exerciseTolerance = physicalExam.exerciseTolerance;
    const dyspneaIntensity = physicalExam.dyspneaIntensity;

    if (exerciseTolerance === 'limitacion-reposo' || dyspneaIntensity >= 8) {
      return { class: 'IV', description: 'Síntomas en reposo', color: 'text-red-600' };
    } else if (exerciseTolerance === 'limitacion-minima' || dyspneaIntensity >= 6) {
      return { class: 'III', description: 'Síntomas con actividad mínima', color: 'text-orange-500' };
    } else if (exerciseTolerance === 'limitacion-moderada' || dyspneaIntensity >= 3) {
      return { class: 'II', description: 'Síntomas con actividad habitual', color: 'text-yellow-600' };
    } else {
      return { class: 'I', description: 'Sin limitación', color: 'text-green-600' };
    }
  };

  const evaluate6MinWalk = () => {
    const distance = parseFloat(riskScales.walk6min) || 0;
    const age = parseInt(patientAge);
    const isMale = patientGender === 'M';

    if (distance === 0) return { capacity: '--', percentage: '--', color: 'text-gray-500' };

    // Fórmula de referencia para predicción
    let predicted = 0;
    if (isMale) {
      predicted = 7.57 * 70 - 5.02 * age - 1.76 * 75 + 667; // Altura estimada 170cm, peso 75kg
    } else {
      predicted = 2.11 * 65 - 2.29 * age - 5.78 * age + 667; // Altura estimada 160cm, peso 65kg
    }

    const percentage = Math.round((distance / predicted) * 100);

    if (percentage >= 80) {
      return { capacity: 'Normal', percentage: `${percentage}%`, color: 'text-green-600' };
    } else if (percentage >= 60) {
      return { capacity: 'Reducida leve', percentage: `${percentage}%`, color: 'text-yellow-600' };
    } else if (percentage >= 40) {
      return { capacity: 'Reducida moderada', percentage: `${percentage}%`, color: 'text-orange-500' };
    } else {
      return { capacity: 'Reducida severa', percentage: `${percentage}%`, color: 'text-red-600' };
    }
  };

  const getEnhancedAlerts = () => {
    const alerts = [];
    
    // Evaluación de presión arterial mejorada
    const systolic = parseInt(vitalSigns.systolic) || 0;
    const diastolic = parseInt(vitalSigns.diastolic) || 0;
    const systolicLeft = parseInt(vitalSigns.systolicLeft) || 0;
    const diastolicLeft = parseInt(vitalSigns.diastolicLeft) || 0;

    if (systolic > 0 && diastolic > 0) {
      const bpEval = evaluateBloodPressure(systolic, diastolic);
      if (bpEval.priority !== 'none') {
        alerts.push({
          type: bpEval.priority === 'critical' ? 'error' : bpEval.priority === 'high' ? 'error' : 'warning',
          title: bpEval.level,
          description: `Brazo derecho: ${systolic}/${diastolic} mmHg${systolicLeft > 0 ? ` | Izquierdo: ${systolicLeft}/${diastolicLeft} mmHg` : ''}`
        });
      }
    }

    // Evaluación de frecuencia cardíaca mejorada
    const heartRate = parseInt(vitalSigns.heartRate) || 0;
    if (heartRate > 0) {
      const hrEval = evaluateHeartRate(heartRate);
      if (hrEval.priority !== 'none') {
        alerts.push({
          type: hrEval.priority === 'critical' ? 'error' : hrEval.priority === 'high' ? 'error' : 'warning',
          title: hrEval.level,
          description: `FC: ${heartRate} bpm`
        });
      }
    }

    // Evaluación de dolor torácico
    if (physicalExam.chestPain) {
      const chestPainEval = evaluateChestPain();
      alerts.push({
        type: chestPainEval.risk.includes('Alto') ? 'error' : 'warning',
        title: 'Dolor Torácico',
        description: `${chestPainEval.risk} - Intensidad: ${physicalExam.chestPainIntensity}/10`
      });
    }

    // Evaluación de ITB
    if (vascularExam.itbRight > 0 || vascularExam.itbLeft > 0) {
      if (vascularExam.itbRight < 0.9 || vascularExam.itbLeft < 0.9) {
        alerts.push({
          type: 'warning',
          title: 'ITB Alterado',
          description: `Derecho: ${vascularExam.itbRight.toFixed(2)} | Izquierdo: ${vascularExam.itbLeft.toFixed(2)}`
        });
      }
    }

    // Evaluación de saturación de oxígeno
    const saturation = parseInt(vitalSigns.oxygenSaturation) || 0;
    if (saturation > 0 && saturation < 95) {
      alerts.push({
        type: saturation < 90 ? 'error' : 'warning',
        title: 'Hipoxemia',
        description: `SpO₂: ${saturation}%`
      });
    }

    return alerts;
  };

  const alerts = getEnhancedAlerts();

  return (
    <NewConsultationLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      consultationData={{
        code: consultationCode,
        specialty: specialty,
        age: patientData?.age?.toString() || patientAge,
        gender: patientData?.gender || patientGender,
        patientName: patientData?.name || 'Paciente'
      }}
    >
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3 lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Formulario de {specialty}
            </h1>
            
            <form className="space-y-8">
              {/* Vital Signs Section */}
              {activeSection === 'vital-signs' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Signos Vitales
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Presión Sistólica (mmHg)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.systolic}
                        onChange={(e) => setVitalSigns({...vitalSigns, systolic: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Presión Diastólica (mmHg)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.diastolic}
                        onChange={(e) => setVitalSigns({...vitalSigns, diastolic: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Frecuencia Cardíaca (bpm)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.heartRate}
                        onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Temperatura (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={vitalSigns.temperature}
                        onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.weight}
                        onChange={(e) => setVitalSigns({...vitalSigns, weight: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.height}
                        onChange={(e) => setVitalSigns({...vitalSigns, height: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    {/* Signos vitales adicionales para cardiología */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        PA Sistólica Izquierda (mmHg)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.systolicLeft}
                        onChange={(e) => setVitalSigns({...vitalSigns, systolicLeft: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        PA Diastólica Izquierda (mmHg)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.diastolicLeft}
                        onChange={(e) => setVitalSigns({...vitalSigns, diastolicLeft: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Saturación O₂ (%)
                      </label>
                      <input
                        type="number"
                        value={vitalSigns.oxygenSaturation}
                        onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                        min="70"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Indicadores automáticos de evaluación */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vitalSigns.systolic && vitalSigns.diastolic && (
                      <div className="p-3 rounded-lg border">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Evaluación PA</div>
                        <div className={`text-sm font-medium ${evaluateBloodPressure(parseInt(vitalSigns.systolic), parseInt(vitalSigns.diastolic)).color}`}>
                          {evaluateBloodPressure(parseInt(vitalSigns.systolic), parseInt(vitalSigns.diastolic)).level}
                        </div>
                      </div>
                    )}
                    {vitalSigns.heartRate && (
                      <div className="p-3 rounded-lg border">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Evaluación FC</div>
                        <div className={`text-sm font-medium ${evaluateHeartRate(parseInt(vitalSigns.heartRate)).color}`}>
                          {evaluateHeartRate(parseInt(vitalSigns.heartRate)).level}
                        </div>
                      </div>
                    )}
                    {vitalSigns.oxygenSaturation && (
                      <div className="p-3 rounded-lg border">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Saturación O₂</div>
                        <div className={`text-sm font-medium ${parseInt(vitalSigns.oxygenSaturation) < 95 ? 'text-red-600' : 'text-green-600'}`}>
                          {parseInt(vitalSigns.oxygenSaturation) < 90 ? 'Hipoxemia severa' : 
                           parseInt(vitalSigns.oxygenSaturation) < 95 ? 'Hipoxemia leve' : 'Normal'}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Anamnesis Section */}
              {activeSection === 'anamnesis' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    <Heart className="inline mr-2" size={20} />
                    Anamnesis y Quejas Principales
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Dolor Torácico */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={anamnesis.chestPain}
                          onChange={(e) => setAnamnesis({...anamnesis, chestPain: e.target.checked})}
                          className="mr-2 h-4 w-4 text-emerald-600"
                        />
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Dolor Torácico</span>
                      </label>
                      
                      {anamnesis.chestPain && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Intensidad (0-10)
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={anamnesis.chestPainDetails.intensity}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                chestPainDetails: {...anamnesis.chestPainDetails, intensity: parseInt(e.target.value)}
                              })}
                              className="w-full"
                            />
                            <div className="text-center text-sm font-bold">{anamnesis.chestPainDetails.intensity}/10</div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Tipo de Dolor
                            </label>
                            <select
                              value={anamnesis.chestPainDetails.type}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                chestPainDetails: {...anamnesis.chestPainDetails, type: e.target.value}
                              })}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Seleccionar tipo...</option>
                              <option value="opresivo">Opresivo</option>
                              <option value="constrictivo">Constrictivo</option>
                              <option value="punzante">Punzante</option>
                              <option value="quemante">Quemante</option>
                              <option value="sordo">Sordo</option>
                              <option value="pulsatil">Pulsátil</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Duración
                            </label>
                            <input
                              type="text"
                              value={anamnesis.chestPainDetails.duration}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                chestPainDetails: {...anamnesis.chestPainDetails, duration: e.target.value}
                              })}
                              placeholder="ej: 30 minutos, 2 horas"
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Localización
                            </label>
                            <input
                              type="text"
                              value={anamnesis.chestPainDetails.location}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                chestPainDetails: {...anamnesis.chestPainDetails, location: e.target.value}
                              })}
                              placeholder="ej: Retroesternal, precordial"
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Disnea */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={anamnesis.dyspnea}
                          onChange={(e) => setAnamnesis({...anamnesis, dyspnea: e.target.checked})}
                          className="mr-2 h-4 w-4 text-emerald-600"
                        />
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Disnea</span>
                      </label>
                      
                      {anamnesis.dyspnea && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Intensidad (0-10)
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={anamnesis.dyspneaDetails.intensity}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                dyspneaDetails: {...anamnesis.dyspneaDetails, intensity: parseInt(e.target.value)}
                              })}
                              className="w-full"
                            />
                            <div className="text-center text-sm font-bold">{anamnesis.dyspneaDetails.intensity}/10</div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Tipo de Disnea
                            </label>
                            <select
                              value={anamnesis.dyspneaDetails.type}
                              onChange={(e) => setAnamnesis({
                                ...anamnesis,
                                dyspneaDetails: {...anamnesis.dyspneaDetails, type: e.target.value}
                              })}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Seleccionar tipo...</option>
                              <option value="esfuerzo">De esfuerzo</option>
                              <option value="reposo">En reposo</option>
                              <option value="paroxistica">Paroxística nocturna</option>
                              <option value="ortopnea">Ortopnea</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Otros Síntomas */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Otros Síntomas Cardiovasculares</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={anamnesis.palpitations}
                            onChange={(e) => setAnamnesis({...anamnesis, palpitations: e.target.checked})}
                            className="mr-2 h-4 w-4 text-emerald-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Palpitaciones</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={anamnesis.syncope}
                            onChange={(e) => setAnamnesis({...anamnesis, syncope: e.target.checked})}
                            className="mr-2 h-4 w-4 text-emerald-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Síncope</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={anamnesis.fatigue}
                            onChange={(e) => setAnamnesis({...anamnesis, fatigue: e.target.checked})}
                            className="mr-2 h-4 w-4 text-emerald-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Fatiga</span>
                        </label>
                      </div>
                    </div>

                    {/* Tolerancia al Ejercicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Tolerancia al Ejercicio
                      </label>
                      <select
                        value={anamnesis.exerciseTolerance}
                        onChange={(e) => setAnamnesis({...anamnesis, exerciseTolerance: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="normal">Normal</option>
                        <option value="limitacion-leve">Limitación leve</option>
                        <option value="limitacion-moderada">Limitación moderada</option>
                        <option value="limitacion-severa">Limitación severa</option>
                        <option value="limitacion-reposo">Síntomas en reposo</option>
                      </select>
                    </div>

                    {/* Otros Síntomas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Otros Síntomas o Observaciones
                      </label>
                      <textarea
                        value={anamnesis.otherSymptoms}
                        onChange={(e) => setAnamnesis({...anamnesis, otherSymptoms: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Describa otros síntomas relevantes..."
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Physical Exam Section */}
              {activeSection === 'physical-exam' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Examen Físico Cardiovascular
                  </h2>
                  <div className="space-y-6">
                    {/* Síntomas Cardiovasculares */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Síntomas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dolor Torácico */}
                        <div>
                          <label className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={physicalExam.chestPain}
                              onChange={(e) => setPhysicalExam({...physicalExam, chestPain: e.target.checked})}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dolor Torácico</span>
                          </label>
                          {physicalExam.chestPain && (
                            <div className="space-y-2 ml-6">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Intensidad (0-10): {physicalExam.chestPainIntensity}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  value={physicalExam.chestPainIntensity}
                                  onChange={(e) => setPhysicalExam({...physicalExam, chestPainIntensity: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <select
                                  value={physicalExam.chestPainType}
                                  onChange={(e) => setPhysicalExam({...physicalExam, chestPainType: e.target.value})}
                                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                                >
                                  <option value="">Tipo de dolor</option>
                                  <option value="opresivo">Opresivo</option>
                                  <option value="constrictivo">Constrictivo</option>
                                  <option value="punzante">Punzante</option>
                                  <option value="quemante">Quemante</option>
                                  <option value="palpitante">Palpitante</option>
                                </select>
                              </div>
                              <div className={`text-xs p-2 rounded ${evaluateChestPain().color}`}>
                                {evaluateChestPain().risk}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Disnea */}
                        <div>
                          <label className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={physicalExam.dyspnea}
                              onChange={(e) => setPhysicalExam({...physicalExam, dyspnea: e.target.checked})}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Disnea</span>
                          </label>
                          {physicalExam.dyspnea && (
                            <div className="space-y-2 ml-6">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Intensidad (0-10): {physicalExam.dyspneaIntensity}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  value={physicalExam.dyspneaIntensity}
                                  onChange={(e) => setPhysicalExam({...physicalExam, dyspneaIntensity: parseInt(e.target.value)})}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <select
                                  value={physicalExam.exerciseTolerance}
                                  onChange={(e) => setPhysicalExam({...physicalExam, exerciseTolerance: e.target.value})}
                                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                                >
                                  <option value="">Tolerancia al ejercicio</option>
                                  <option value="sin-limitacion">Sin limitación</option>
                                  <option value="limitacion-moderada">Limitación moderada</option>
                                  <option value="limitacion-minima">Limitación mínima</option>
                                  <option value="limitacion-reposo">Síntomas en reposo</option>
                                </select>
                              </div>
                              <div className={`text-xs p-2 rounded ${calculateNYHAClass().color}`}>
                                NYHA Clase {calculateNYHAClass().class}: {calculateNYHAClass().description}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Examen Físico Tradicional */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Auscultación Cardíaca
                        </label>
                        <textarea
                          rows={3}
                          value={physicalExam.cardiacAuscultation}
                          onChange={(e) => setPhysicalExam({...physicalExam, cardiacAuscultation: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                          placeholder="Ruidos cardíacos, soplos, galopes..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Pulsos Periféricos
                        </label>
                        <input
                          type="text"
                          value={physicalExam.peripheralPulses}
                          onChange={(e) => setPhysicalExam({...physicalExam, peripheralPulses: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                          placeholder="Simétricos, presentes, ausentes..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Sistema Respiratorio
                        </label>
                        <textarea
                          rows={3}
                          value={physicalExam.respiratorySystem}
                          onChange={(e) => setPhysicalExam({...physicalExam, respiratorySystem: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                          placeholder="Murmullo vesicular, estertores, sibilancias..."
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Auscultación Cardíaca Section */}
              {activeSection === 'auscultacion' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    <Stethoscope className="inline mr-2" size={20} />
                    Auscultación Cardíaca Completa
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Focos Cardíacos */}
                    {[
                      { name: 'Aórtico', key: 'aortic', location: '2° EIC derecho' },
                      { name: 'Pulmonar', key: 'pulmonary', location: '2° EIC izquierdo' },
                      { name: 'Tricúspide', key: 'tricuspid', location: '4° EIC izquierdo' },
                      { name: 'Mitral', key: 'mitral', location: '5° EIC línea medioclavicular' }
                    ].map((focus) => (
                      <div key={focus.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                          Foco {focus.name} <span className="text-sm text-gray-500">({focus.location})</span>
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* R1 */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">R1</label>
                            <select
                              value={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.r1 || ''}
                              onChange={(e) => setCardiacAuscultation({
                                ...cardiacAuscultation,
                                [focus.key]: {
                                  ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                  r1: e.target.value
                                }
                              })}
                              className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="">-</option>
                              <option value="abolido">Abolido</option>
                              <option value="hipofonico">Hipofonético</option>
                              <option value="normal">Normal</option>
                              <option value="hiperfonico">Hiperfonético</option>
                            </select>
                          </div>
                          
                          {/* R2 */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">R2</label>
                            <select
                              value={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.r2 || ''}
                              onChange={(e) => setCardiacAuscultation({
                                ...cardiacAuscultation,
                                [focus.key]: {
                                  ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                  r2: e.target.value
                                }
                              })}
                              className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="">-</option>
                              <option value="abolido">Abolido</option>
                              <option value="hipofonico">Hipofonético</option>
                              <option value="normal">Normal</option>
                              <option value="hiperfonico">Hiperfonético</option>
                            </select>
                          </div>
                          
                          {/* Soplo Sistólico */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <input
                                type="checkbox"
                                checked={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.systolicMurmur || false}
                                onChange={(e) => setCardiacAuscultation({
                                  ...cardiacAuscultation,
                                  [focus.key]: {
                                    ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                    systolicMurmur: e.target.checked
                                  }
                                })}
                                className="mr-1 h-3 w-3 text-emerald-600"
                              />
                              Soplo sistólico
                            </label>
                            {(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.systolicMurmur && (
                              <select
                                value={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.systolicGrade || ''}
                                onChange={(e) => setCardiacAuscultation({
                                  ...cardiacAuscultation,
                                  [focus.key]: {
                                    ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                    systolicGrade: e.target.value
                                  }
                                })}
                                className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="">Grado</option>
                                <option value="1">I/VI</option>
                                <option value="2">II/VI</option>
                                <option value="3">III/VI</option>
                                <option value="4">IV/VI</option>
                                <option value="5">V/VI</option>
                                <option value="6">VI/VI</option>
                              </select>
                            )}
                          </div>
                          
                          {/* Soplo Diastólico */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              <input
                                type="checkbox"
                                checked={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.diastolicMurmur || false}
                                onChange={(e) => setCardiacAuscultation({
                                  ...cardiacAuscultation,
                                  [focus.key]: {
                                    ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                    diastolicMurmur: e.target.checked
                                  }
                                })}
                                className="mr-1 h-3 w-3 text-emerald-600"
                              />
                              Soplo diastólico
                            </label>
                            {(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.diastolicMurmur && (
                              <select
                                value={(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any)?.diastolicGrade || ''}
                                onChange={(e) => setCardiacAuscultation({
                                  ...cardiacAuscultation,
                                  [focus.key]: {
                                    ...(cardiacAuscultation[focus.key as keyof typeof cardiacAuscultation] as any),
                                    diastolicGrade: e.target.value
                                  }
                                })}
                                className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="">Grado</option>
                                <option value="1">I/VI</option>
                                <option value="2">II/VI</option>
                                <option value="3">III/VI</option>
                                <option value="4">IV/VI</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Sonidos Adicionales */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Sonidos Adicionales</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['S3 galope', 'S4 galope', 'Click sistólico', 'Chasquido de apertura', 'Frote pericárdico', 'Soplo continuo'].map((sound) => (
                          <label key={sound} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={cardiacAuscultation.additionalSounds.includes(sound)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCardiacAuscultation({
                                    ...cardiacAuscultation,
                                    additionalSounds: [...cardiacAuscultation.additionalSounds, sound]
                                  });
                                } else {
                                  setCardiacAuscultation({
                                    ...cardiacAuscultation,
                                    additionalSounds: cardiacAuscultation.additionalSounds.filter(s => s !== sound)
                                  });
                                }
                              }}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{sound}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Características de Soplos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Características Detalladas de Soplos
                      </label>
                      <textarea
                        value={cardiacAuscultation.murmurCharacteristics}
                        onChange={(e) => setCardiacAuscultation({...cardiacAuscultation, murmurCharacteristics: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Describa irradiación, intensidad con maniobras, etc..."
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Circulación Periférica Section */}
              {activeSection === 'circulacion-periferica' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    <Activity className="inline mr-2" size={20} />
                    Circulación Periférica y Edemas
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Pulsos Periféricos */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Pulsos Periféricos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(circulation.peripheralPulses).map(([location, pulses]) => (
                          <div key={location} className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {location === 'carotid' ? 'Carótida' :
                               location === 'radial' ? 'Radial' :
                               location === 'femoral' ? 'Femoral' :
                               location === 'popliteal' ? 'Poplítea' :
                               location === 'dorsalPedis' ? 'Dorsal del pie' :
                               location === 'posteriorTibial' ? 'Tibial posterior' : location}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400">Derecho</label>
                                <select
                                  value={pulses.right}
                                  onChange={(e) => setCirculation({
                                    ...circulation,
                                    peripheralPulses: {
                                      ...circulation.peripheralPulses,
                                      [location]: { ...pulses, right: e.target.value }
                                    }
                                  })}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  <option value="">-</option>
                                  <option value="0">0 (Ausente)</option>
                                  <option value="1">1+ (Débil)</option>
                                  <option value="2">2+ (Normal)</option>
                                  <option value="3">3+ (Fuerte)</option>
                                  <option value="4">4+ (Saltón)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400">Izquierdo</label>
                                <select
                                  value={pulses.left}
                                  onChange={(e) => setCirculation({
                                    ...circulation,
                                    peripheralPulses: {
                                      ...circulation.peripheralPulses,
                                      [location]: { ...pulses, left: e.target.value }
                                    }
                                  })}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  <option value="">-</option>
                                  <option value="0">0 (Ausente)</option>
                                  <option value="1">1+ (Débil)</option>
                                  <option value="2">2+ (Normal)</option>
                                  <option value="3">3+ (Fuerte)</option>
                                  <option value="4">4+ (Saltón)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Edemas */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Evaluación de Edemas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Localización</label>
                          <div className="space-y-2">
                            {['Miembros inferiores', 'Tobillos', 'Pretibial', 'Sacro', 'Generalizado', 'Ascitis'].map((location) => (
                              <label key={location} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={circulation.edema.location.includes(location)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCirculation({
                                        ...circulation,
                                        edema: {
                                          ...circulation.edema,
                                          location: [...circulation.edema.location, location]
                                        }
                                      });
                                    } else {
                                      setCirculation({
                                        ...circulation,
                                        edema: {
                                          ...circulation.edema,
                                          location: circulation.edema.location.filter(l => l !== location)
                                        }
                                      });
                                    }
                                  }}
                                  className="mr-2 h-4 w-4 text-emerald-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{location}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Severidad</label>
                            <select
                              value={circulation.edema.severity}
                              onChange={(e) => setCirculation({
                                ...circulation,
                                edema: { ...circulation.edema, severity: e.target.value }
                              })}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Seleccionar...</option>
                              <option value="leve">Leve (+)</option>
                              <option value="moderado">Moderado (++)</option>
                              <option value="severo">Severo (+++)</option>
                              <option value="masivo">Masivo (++++)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Características</label>
                            <textarea
                              value={circulation.edema.characteristics}
                              onChange={(e) => setCirculation({
                                ...circulation,
                                edema: { ...circulation.edema, characteristics: e.target.value }
                              })}
                              rows={2}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              placeholder="Con fóvea, sin fóvea, simétrico..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cambios en la Piel */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Cambios en la Piel</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Cianosis', 'Palidez', 'Rubor', 'Úlceras', 'Hiperpigmentación', 'Descamación'].map((change) => (
                          <label key={change} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={circulation.skinChanges.includes(change)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCirculation({
                                    ...circulation,
                                    skinChanges: [...circulation.skinChanges, change]
                                  });
                                } else {
                                  setCirculation({
                                    ...circulation,
                                    skinChanges: circulation.skinChanges.filter(c => c !== change)
                                  });
                                }
                              }}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{change}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Llenado Capilar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Llenado Capilar
                      </label>
                      <select
                        value={circulation.capillaryRefill}
                        onChange={(e) => setCirculation({...circulation, capillaryRefill: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="normal">Normal (&lt;2 seg)</option>
                        <option value="retrasado">Retrasado (2-3 seg)</option>
                        <option value="muy-retrasado">Muy retrasado (&gt;3 seg)</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* Vascular Exam Section */}
              {activeSection === 'vascular-exam' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Examen Vascular e Índice Tobillo-Brazo (ITB)
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Presión Arterial - Brazos</h3>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400">PA Sistólica Brazo Derecho (mmHg)</label>
                            <input
                              type="number"
                              value={vascularExam.rightArmSystolic}
                              onChange={(e) => {
                                setVascularExam({...vascularExam, rightArmSystolic: e.target.value});
                                updateITBCalculation();
                              }}
                              className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                              placeholder="120"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400">PA Sistólica Brazo Izquierdo (mmHg)</label>
                            <input
                              type="number"
                              value={vascularExam.leftArmSystolic}
                              onChange={(e) => {
                                setVascularExam({...vascularExam, leftArmSystolic: e.target.value});
                                updateITBCalculation();
                              }}
                              className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                              placeholder="118"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Presión Arterial - Tobillos</h3>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400">PA Sistólica Tobillo Derecho (mmHg)</label>
                            <input
                              type="number"
                              value={vascularExam.rightAnkleSystolic}
                              onChange={(e) => {
                                setVascularExam({...vascularExam, rightAnkleSystolic: e.target.value});
                                updateITBCalculation();
                              }}
                              className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                              placeholder="110"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400">PA Sistólica Tobillo Izquierdo (mmHg)</label>
                            <input
                              type="number"
                              value={vascularExam.leftAnkleSystolic}
                              onChange={(e) => {
                                setVascularExam({...vascularExam, leftAnkleSystolic: e.target.value});
                                updateITBCalculation();
                              }}
                              className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded"
                              placeholder="108"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resultados ITB */}
                    {(vascularExam.itbRight > 0 || vascularExam.itbLeft > 0) && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h3 className="text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">Resultados ITB</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">ITB Derecho: </span>
                            <span className={`font-medium ${vascularExam.itbRight < 0.9 ? 'text-orange-600' : vascularExam.itbRight > 1.3 ? 'text-red-600' : 'text-green-600'}`}>
                              {vascularExam.itbRight.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">ITB Izquierdo: </span>
                            <span className={`font-medium ${vascularExam.itbLeft < 0.9 ? 'text-orange-600' : vascularExam.itbLeft > 1.3 ? 'text-red-600' : 'text-green-600'}`}>
                              {vascularExam.itbLeft.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          <p>• Normal: 0.90 - 1.30</p>
                          <p>• Enfermedad arterial periférica: &lt; 0.90</p>
                          <p>• Calcificación arterial: &gt; 1.30</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* ECG Section */}
              {activeSection === 'electrocardiograma' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    <Activity className="inline mr-2" size={20} />
                    Electrocardiograma (ECG)
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Parámetros Básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Ritmo
                        </label>
                        <select
                          value={ecgFindings.rhythm}
                          onChange={(e) => setEcgFindings({...ecgFindings, rhythm: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Seleccionar ritmo...</option>
                          <option value="sinusal">Ritmo sinusal</option>
                          <option value="fibrilacion-auricular">Fibrilación auricular</option>
                          <option value="flutter-auricular">Flutter auricular</option>
                          <option value="taquicardia-supraventricular">Taquicardia supraventricular</option>
                          <option value="taquicardia-ventricular">Taquicardia ventricular</option>
                          <option value="bradicardia-sinusal">Bradicardia sinusal</option>
                          <option value="bloqueo-av">Bloqueo AV</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Frecuencia (lpm)
                        </label>
                        <input
                          type="number"
                          value={ecgFindings.rate}
                          onChange={(e) => setEcgFindings({...ecgFindings, rate: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="75"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Eje Eléctrico
                        </label>
                        <select
                          value={ecgFindings.axis}
                          onChange={(e) => setEcgFindings({...ecgFindings, axis: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Seleccionar eje...</option>
                          <option value="normal">Normal (0° a +90°)</option>
                          <option value="desviacion-izquierda">Desviación izquierda (-30° a -90°)</option>
                          <option value="desviacion-derecha">Desviación derecha (+90° a +180°)</option>
                          <option value="desviacion-extrema">Desviación extrema (-90° a -180°)</option>
                        </select>
                      </div>
                    </div>

                    {/* Intervalos */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Intervalos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Intervalo PR (ms)
                          </label>
                          <input
                            type="number"
                            value={ecgFindings.intervals.pr}
                            onChange={(e) => setEcgFindings({
                              ...ecgFindings,
                              intervals: { ...ecgFindings.intervals, pr: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="160"
                          />
                          <div className="text-xs text-gray-500 mt-1">Normal: 120-200 ms</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Duración QRS (ms)
                          </label>
                          <input
                            type="number"
                            value={ecgFindings.intervals.qrs}
                            onChange={(e) => setEcgFindings({
                              ...ecgFindings,
                              intervals: { ...ecgFindings.intervals, qrs: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="100"
                          />
                          <div className="text-xs text-gray-500 mt-1">Normal: &lt;120 ms</div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Intervalo QT (ms)
                          </label>
                          <input
                            type="number"
                            value={ecgFindings.intervals.qt}
                            onChange={(e) => setEcgFindings({
                              ...ecgFindings,
                              intervals: { ...ecgFindings.intervals, qt: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="400"
                          />
                          <div className="text-xs text-gray-500 mt-1">Normal: &lt;440 ms (♂), &lt;460 ms (♀)</div>
                        </div>
                      </div>
                    </div>

                    {/* Morfología de Ondas */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Morfología de Ondas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          'Onda P normal', 'Onda P ausente', 'Onda P invertida',
                          'Onda Q patológica', 'Ondas Q normales',
                          'Onda R alta', 'Onda R baja', 'Progresión R normal',
                          'Onda S profunda', 'Onda T invertida', 'Onda T picuda',
                          'Onda U presente'
                        ].map((waveform) => (
                          <label key={waveform} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={ecgFindings.waveforms.includes(waveform)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEcgFindings({
                                    ...ecgFindings,
                                    waveforms: [...ecgFindings.waveforms, waveform]
                                  });
                                } else {
                                  setEcgFindings({
                                    ...ecgFindings,
                                    waveforms: ecgFindings.waveforms.filter(w => w !== waveform)
                                  });
                                }
                              }}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{waveform}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Anormalidades */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Anormalidades</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Elevación del ST', 'Depresión del ST', 'Inversión de onda T',
                          'Bloqueo de rama derecha', 'Bloqueo de rama izquierda', 'Hemibloqueo',
                          'Hipertrofia ventricular izquierda', 'Hipertrofia ventricular derecha',
                          'Dilatación auricular izquierda', 'Dilatación auricular derecha',
                          'Isquemia anterior', 'Isquemia inferior', 'Isquemia lateral',
                          'Extrasístoles ventriculares', 'Extrasístoles auriculares'
                        ].map((abnormality) => (
                          <label key={abnormality} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={ecgFindings.abnormalities.includes(abnormality)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEcgFindings({
                                    ...ecgFindings,
                                    abnormalities: [...ecgFindings.abnormalities, abnormality]
                                  });
                                } else {
                                  setEcgFindings({
                                    ...ecgFindings,
                                    abnormalities: ecgFindings.abnormalities.filter(a => a !== abnormality)
                                  });
                                }
                              }}
                              className="mr-2 h-4 w-4 text-emerald-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{abnormality}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Interpretación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Interpretación ECG
                      </label>
                      <textarea
                        value={ecgFindings.interpretation}
                        onChange={(e) => setEcgFindings({...ecgFindings, interpretation: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Interpretación clínica del ECG, conclusiones diagnósticas..."
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Risk Scales Section */}
              {activeSection === 'escalas-riesgo' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    <Calculator className="inline mr-2" size={20} />
                    Escalas de Riesgo Cardiovascular
                  </h2>
                  
                  <div className="space-y-8">
                    {/* CHA₂DS₂-VASc Score */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                        Escala CHA₂DS₂-VASc (Fibrilación Auricular)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Factores de riesgo */}
                        <div className="space-y-3">
                          {Object.entries(chaScore).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={value as boolean}
                                  onChange={(e) => setChaScore({...chaScore, [key]: e.target.checked})}
                                  className="mr-3 h-4 w-4 text-blue-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {key === 'congestiveHeartFailure' ? 'Insuficiencia cardíaca congestiva/Disfunción VI' :
                                   key === 'hypertension' ? 'Hipertensión arterial' :
                                   key === 'age75Plus' ? 'Edad ≥75 años' :
                                   key === 'diabetes' ? 'Diabetes mellitus' :
                                   key === 'strokeHistory' ? 'ACV/AIT/Tromboembolismo previo' :
                                   key === 'vascularDisease' ? 'Enfermedad vascular (IAM, EAP, placa aórtica)' :
                                   key === 'age65To74' ? 'Edad 65-74 años' :
                                   key === 'female' ? 'Sexo femenino' : key}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-blue-600">
                                {key === 'age75Plus' || key === 'strokeHistory' ? '+2' : '+1'}
                              </span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Resultado */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              {calculateCHA2DS2VAScScore()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Puntos</div>
                            <div className="text-sm">
                              <div className={`p-2 rounded font-medium ${
                                calculateCHA2DS2VAScScore() === 0 ? 'bg-green-100 text-green-800' :
                                calculateCHA2DS2VAScScore() === 1 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {calculateCHA2DS2VAScScore() === 0 ? 'Bajo riesgo - No anticoagulación' :
                                 calculateCHA2DS2VAScScore() === 1 ? 'Riesgo moderado - Considerar anticoagulación' :
                                 'Alto riesgo - Anticoagulación recomendada'}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Riesgo anual de ACV: {
                                  calculateCHA2DS2VAScScore() === 0 ? '0.2%' :
                                  calculateCHA2DS2VAScScore() === 1 ? '0.6%' :
                                  calculateCHA2DS2VAScScore() === 2 ? '2.2%' :
                                  calculateCHA2DS2VAScScore() === 3 ? '3.2%' :
                                  calculateCHA2DS2VAScScore() === 4 ? '4.0%' :
                                  calculateCHA2DS2VAScScore() === 5 ? '6.7%' :
                                  calculateCHA2DS2VAScScore() === 6 ? '9.8%' :
                                  calculateCHA2DS2VAScScore() === 7 ? '9.6%' :
                                  calculateCHA2DS2VAScScore() === 8 ? '6.7%' :
                                  calculateCHA2DS2VAScScore() >= 9 ? '15.2%' : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HAS-BLED Score */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h3 className="text-lg font-semibold mb-4 text-red-900 dark:text-red-100">
                        Escala HAS-BLED (Riesgo de sangrado)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {Object.entries(hasBlueScore).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={value as boolean}
                                  onChange={(e) => setHasBlueScore({...hasBlueScore, [key]: e.target.checked})}
                                  className="mr-3 h-4 w-4 text-red-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {key === 'hypertension' ? 'Hipertensión (PAS >160 mmHg)' :
                                   key === 'abnormalRenal' ? 'Función renal/hepática anormal' :
                                   key === 'stroke' ? 'Accidente cerebrovascular' :
                                   key === 'bleeding' ? 'Sangrado previo o predisposición' :
                                   key === 'labileINR' ? 'INR lábil (TTR <60%)' :
                                   key === 'elderly' ? 'Edad >65 años' :
                                   key === 'drugs' ? 'Fármacos (antiplaquetarios, AINE) o alcohol' : key}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-red-600">+1</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">
                              {calculateHASBLEDScore()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Puntos</div>
                            <div className="text-sm">
                              <div className={`p-2 rounded font-medium ${
                                calculateHASBLEDScore() <= 2 ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {calculateHASBLEDScore() <= 2 ? 'Riesgo aceptable de sangrado' : 'Alto riesgo de sangrado - precaución'}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Riesgo anual de sangrado mayor: {
                                  calculateHASBLEDScore() === 0 ? '1.02%' :
                                  calculateHASBLEDScore() === 1 ? '1.13%' :
                                  calculateHASBLEDScore() === 2 ? '1.88%' :
                                  calculateHASBLEDScore() === 3 ? '3.74%' :
                                  calculateHASBLEDScore() === 4 ? '8.70%' :
                                  calculateHASBLEDScore() >= 5 ? '>12%' : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TIMI Score */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h3 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100">
                        Escala TIMI (Síndrome Coronario Agudo)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {Object.entries(timiScore).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={value as boolean}
                                  onChange={(e) => setTimiScore({...timiScore, [key]: e.target.checked})}
                                  className="mr-3 h-4 w-4 text-purple-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {key === 'age65Plus' ? 'Edad ≥65 años' :
                                   key === 'riskFactors' ? '≥3 factores de riesgo para CAD' :
                                   key === 'knownCAD' ? 'Enfermedad coronaria conocida (estenosis ≥50%)' :
                                   key === 'aspirinUse' ? 'Uso de aspirina en últimos 7 días' :
                                   key === 'severeSymptoms' ? 'Episodios de angina severa ≥2 en 24h' :
                                   key === 'stDeviation' ? 'Desviación del ST ≥0.5mm' :
                                   key === 'positiveMarkers' ? 'Marcadores cardíacos elevados' : key}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-purple-600">+1</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {calculateTIMIScore()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Puntos</div>
                            <div className="text-sm">
                              <div className={`p-2 rounded font-medium ${
                                calculateTIMIScore() <= 2 ? 'bg-green-100 text-green-800' :
                                calculateTIMIScore() <= 4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {calculateTIMIScore() <= 2 ? 'Bajo riesgo - Manejo conservador' :
                                 calculateTIMIScore() <= 4 ? 'Riesgo intermedio - Estrategia invasiva selectiva' :
                                 'Alto riesgo - Estrategia invasiva temprana'}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Riesgo de eventos a 14 días: {
                                  calculateTIMIScore() === 0 || calculateTIMIScore() === 1 ? '4.7%' :
                                  calculateTIMIScore() === 2 ? '8.3%' :
                                  calculateTIMIScore() === 3 ? '13.2%' :
                                  calculateTIMIScore() === 4 ? '19.9%' :
                                  calculateTIMIScore() === 5 ? '26.2%' :
                                  calculateTIMIScore() === 6 || calculateTIMIScore() === 7 ? '40.9%' : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wellens Score */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                      <h3 className="text-lg font-semibold mb-4 text-orange-900 dark:text-orange-100">
                        Criterios de Wellens (Oclusión LAD inminente)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {Object.entries(wellensScore).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={value as boolean}
                                  onChange={(e) => setWellensScore({...wellensScore, [key]: e.target.checked})}
                                  className="mr-3 h-4 w-4 text-orange-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {key === 'biphasicT' ? 'Ondas T bifásicas en V2-V3 (Tipo A)' :
                                   key === 'symmetricT' ? 'Ondas T invertidas simétricas V2-V6 (Tipo B)' :
                                   key === 'historyChestPain' ? 'Historia de dolor torácico anginoso' :
                                   key === 'painFreeECG' ? 'ECG realizado libre de dolor' :
                                   key === 'normalMarkers' ? 'Marcadores cardíacos normales o mínimamente elevados' :
                                   key === 'noSTElevation' ? 'Sin elevación del segmento ST' :
                                   key === 'noQWaves' ? 'Sin ondas Q patológicas' : key}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-orange-600">✓</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                              {calculateWellensScore()}/7
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Criterios cumplidos</div>
                            <div className="text-sm">
                              <div className={`p-2 rounded font-medium ${
                                calculateWellensScore() >= 6 ? 'bg-red-100 text-red-800' :
                                calculateWellensScore() >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {calculateWellensScore() >= 6 ? 'Síndrome de Wellens MUY PROBABLE' :
                                 calculateWellensScore() >= 4 ? 'Síndrome de Wellens POSIBLE' :
                                 'Criterios insuficientes para Wellens'}
                              </div>
                              {calculateWellensScore() >= 6 && (
                                <div className="mt-2 text-xs text-red-600 font-medium">
                                  ⚠️ URGENCIA: Riesgo extremo de oclusión LAD en días/semanas
                                  <br />
                                  📞 Cardiología de urgencia + Cateterismo
                                </div>
                              )}
                              {calculateWellensScore() >= 4 && calculateWellensScore() < 6 && (
                                <div className="mt-2 text-xs text-yellow-600 font-medium">
                                  ⚠️ Monitoreo estrecho y evaluación cardiológica urgente
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GRACE Score */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h3 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-100">
                        Escala GRACE (Mortalidad en SCA)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Edad (años)
                            </label>
                            <input
                              type="number"
                              value={graceScore.age}
                              onChange={(e) => setGraceScore({...graceScore, age: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="65"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Frecuencia cardíaca (lpm)
                            </label>
                            <input
                              type="number"
                              value={graceScore.heartRate}
                              onChange={(e) => setGraceScore({...graceScore, heartRate: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="80"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Presión sistólica (mmHg)
                            </label>
                            <input
                              type="number"
                              value={graceScore.systolicBP}
                              onChange={(e) => setGraceScore({...graceScore, systolicBP: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="130"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Creatinina (mg/dL)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={graceScore.creatinine}
                              onChange={(e) => setGraceScore({...graceScore, creatinine: parseFloat(e.target.value) || 0})}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="1.0"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={graceScore.cardiacArrest}
                                onChange={(e) => setGraceScore({...graceScore, cardiacArrest: e.target.checked})}
                                className="mr-2 h-4 w-4 text-indigo-600"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Paro cardíaco al ingreso</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={graceScore.stDeviation}
                                onChange={(e) => setGraceScore({...graceScore, stDeviation: e.target.checked})}
                                className="mr-2 h-4 w-4 text-indigo-600"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Desviación del segmento ST</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={graceScore.elevatedMarkers}
                                onChange={(e) => setGraceScore({...graceScore, elevatedMarkers: e.target.checked})}
                                className="mr-2 h-4 w-4 text-indigo-600"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Marcadores cardíacos elevados</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600 mb-2">
                              {calculateGRACEScore()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Puntos GRACE</div>
                            <div className="text-sm">
                              <div className={`p-2 rounded font-medium ${
                                calculateGRACEScore() <= 108 ? 'bg-green-100 text-green-800' :
                                calculateGRACEScore() <= 140 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {calculateGRACEScore() <= 108 ? 'Bajo riesgo' :
                                 calculateGRACEScore() <= 140 ? 'Riesgo intermedio' :
                                 'Alto riesgo'}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Mortalidad hospitalaria: {
                                  calculateGRACEScore() <= 108 ? '<1%' :
                                  calculateGRACEScore() <= 140 ? '1-3%' :
                                  '>3%'
                                }
                                <br />
                                Mortalidad a 6 meses: {
                                  calculateGRACEScore() <= 108 ? '<3%' :
                                  calculateGRACEScore() <= 140 ? '3-8%' :
                                  '>8%'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Diagnosis Section */}
              {activeSection === 'diagnosis' && (
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Diagnóstico y Plan de Tratamiento
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Diagnóstico Principal
                      </label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Hipertensión Arterial Grado 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Plan de Tratamiento
                      </label>
                      <textarea
                        rows={5}
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                        placeholder="Medicamentos, recomendaciones, seguimiento..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Notas Adicionales
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                  </div>
                </section>
              )}
            </form>
            
            {/* Botones de navegación entre secciones */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={goToPreviousSection}
                disabled={isFirstSection}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isFirstSection
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                    : 'bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              
              <div className="flex space-x-2">
                {sectionOrder.map((section, index) => (
                  <div
                    key={section}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === getCurrentSectionIndex()
                        ? 'bg-emerald-500'
                        : index < getCurrentSectionIndex()
                        ? 'bg-emerald-300'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={goToNextSection}
                disabled={isLastSection}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isLastSection
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Alerts Panel */}
          <aside className="col-span-3 lg:col-span-1 sticky top-8 h-fit">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Conclusiones y Alertas
              </h2>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}
                  >
                    <h4 className={`font-semibold ${
                      alert.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.description}
                    </p>
                  </div>
                ))}
                
                {diagnosis && (
                  <div>
                    <h3 className="font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">
                      Resumen
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paciente de {patientAge} años presenta {diagnosis.toLowerCase()}. 
                      {treatment && ' Se ha establecido plan de tratamiento apropiado.'}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setLocation('/consultation-report')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Exportar PDF
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </NewConsultationLayout>
  );
}