// ========================================
// UTILIDADES DE CÁLCULOS MÉDICOS
// ========================================

export interface MedicalScore {
  score: number;
  interpretation: string;
  risk?: string;
  recommendation?: string;
}

export interface ITBResult {
  right: number;
  left: number;
  interpretation: string;
  severity: 'normal' | 'borderline' | 'mild' | 'moderate' | 'severe' | 'non-compressible';
}

export interface ChildPughResult {
  score: number;
  class: 'A' | 'B' | 'C';
  interpretation: string;
  prognosis: string;
}

export interface GlasgowBlatchfordResult {
  score: number;
  risk: 'low' | 'moderate' | 'high';
  interpretation: string;
  recommendation: string;
}

export interface PainScale {
  value: number;
  description: string;
  color: 'green' | 'yellow' | 'red';
}

export interface IPSSResult {
  score: number;
  severity: 'mild' | 'moderate' | 'severe';
  interpretation: string;
  qualityOfLife?: string;
}

export interface ICIQResult {
  score: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'very-severe';
  interpretation: string;
}

export interface IIEFResult {
  score: number;
  classification: 'normal' | 'mild' | 'mild-moderate' | 'moderate' | 'severe';
  interpretation: string;
}

export interface ProstateEvaluation {
  size: 'normal' | 'mild-enlarged' | 'moderate-enlarged' | 'severe-enlarged';
  interpretation: string;
  severity: 'normal' | 'warning' | 'alert';
}

// ========================================
// CÁLCULOS CARDIOVASCULARES
// ========================================

/**
 * Calcula el Índice Tobillo-Brazo (ITB)
 */
export function calculateITB(
  armSystolicRight: number,
  armSystolicLeft: number,
  ankleSystolicRight: number,
  ankleSystolicLeft: number
): ITBResult {
  const maxArm = Math.max(armSystolicRight || 0, armSystolicLeft || 0);
  
  const rightITB = maxArm > 0 ? Number((ankleSystolicRight / maxArm).toFixed(2)) : 0;
  const leftITB = maxArm > 0 ? Number((ankleSystolicLeft / maxArm).toFixed(2)) : 0;
  
  const minITB = Math.min(rightITB, leftITB);
  
  let interpretation = '';
  let severity: ITBResult['severity'] = 'normal';
  
  if (minITB > 1.4) {
    interpretation = 'Arterias no compresibles (calcificación vascular)';
    severity = 'non-compressible';
  } else if (minITB >= 1.0) {
    interpretation = 'Normal';
    severity = 'normal';
  } else if (minITB >= 0.9) {
    interpretation = 'Límite (vigilancia)';
    severity = 'borderline';
  } else if (minITB >= 0.7) {
    interpretation = 'Enfermedad arterial periférica leve';
    severity = 'mild';
  } else if (minITB >= 0.4) {
    interpretation = 'Enfermedad arterial periférica moderada';
    severity = 'moderate';
  } else {
    interpretation = 'Enfermedad arterial periférica severa';
    severity = 'severe';
  }
  
  return {
    right: rightITB,
    left: leftITB,
    interpretation,
    severity
  };
}

/**
 * Calcula el score CHA2DS2-VASc
 */
export function calculateCHADS2VASc(factors: {
  heartFailure: boolean;
  hypertension: boolean;
  age75Plus: boolean;
  diabetes: boolean;
  strokeHistory: boolean;
  vascularDisease: boolean;
  age65to74: boolean;
  female: boolean;
}): MedicalScore {
  let score = 0;
  
  if (factors.heartFailure) score += 1;
  if (factors.hypertension) score += 1;
  if (factors.age75Plus) score += 2;
  if (factors.diabetes) score += 1;
  if (factors.strokeHistory) score += 2;
  if (factors.vascularDisease) score += 1;
  if (factors.age65to74) score += 1;
  if (factors.female) score += 1;
  
  let recommendation = '';
  if (score === 0) {
    recommendation = 'Sin anticoagulación (considerar aspirina)';
  } else if (score === 1) {
    recommendation = 'Considerar anticoagulación oral';
  } else {
    recommendation = 'Anticoagulación oral recomendada';
  }
  
  return {
    score,
    interpretation: `Riesgo de tromboembolismo ${score >= 2 ? 'alto' : score === 1 ? 'moderado' : 'bajo'}`,
    recommendation
  };
}

/**
 * Calcula el score HAS-BLED
 */
export function calculateHASBLED(factors: {
  hypertension: boolean;
  renalDisease: boolean;
  liverDisease: boolean;
  strokeHistory: boolean;
  bleedingHistory: boolean;
  labileINR: boolean;
  elderlyAge: boolean;
  drugsDrinking: boolean;
}): MedicalScore {
  let score = 0;
  
  if (factors.hypertension) score += 1;
  if (factors.renalDisease) score += 1;
  if (factors.liverDisease) score += 1;
  if (factors.strokeHistory) score += 1;
  if (factors.bleedingHistory) score += 1;
  if (factors.labileINR) score += 1;
  if (factors.elderlyAge) score += 1;
  if (factors.drugsDrinking) score += 1;
  
  let risk = '';
  if (score <= 2) {
    risk = 'Bajo riesgo hemorrágico';
  } else if (score === 3) {
    risk = 'Riesgo hemorrágico moderado';
  } else {
    risk = 'Alto riesgo hemorrágico';
  }
  
  return {
    score,
    interpretation: risk,
    risk: risk.split(' ')[0].toLowerCase()
  };
}

/**
 * Calcula el score TIMI
 */
export function calculateTIMI(factors: {
  age65Plus: boolean;
  riskFactors: boolean;
  stenosis50Plus: boolean;
  stDeviation: boolean;
  angina: boolean;
  aspirinUse: boolean;
  elevatedMarkers: boolean;
}): MedicalScore {
  let score = 0;
  
  if (factors.age65Plus) score += 1;
  if (factors.riskFactors) score += 1;
  if (factors.stenosis50Plus) score += 1;
  if (factors.stDeviation) score += 1;
  if (factors.angina) score += 1;
  if (factors.aspirinUse) score += 1;
  if (factors.elevatedMarkers) score += 1;
  
  const riskPercentages: { [key: number]: string } = {
    0: '4.7%', 1: '8.3%', 2: '16.2%', 3: '24.2%',
    4: '36.9%', 5: '50.8%', 6: '64.7%', 7: '70.8%'
  };
  
  return {
    score,
    interpretation: `Riesgo de eventos cardiovasculares adversos a 14 días: ${riskPercentages[score] || '--'}`,
    risk: riskPercentages[score] || '--'
  };
}

/**
 * Evalúa el Test de Marcha de 6 Minutos
 */
export function evaluate6MinuteWalk(distance: number, borgScale?: number): {
  distance: number;
  capacity: string;
  predictedPercentage: number;
  interpretation: string;
} {
  let capacity = '';
  if (distance >= 500) {
    capacity = 'Excelente';
  } else if (distance >= 400) {
    capacity = 'Buena';
  } else if (distance >= 300) {
    capacity = 'Regular';
  } else {
    capacity = 'Limitada';
  }
  
  // Cálculo aproximado del porcentaje predicho
  const predictedDistance = 600; // Valor promedio aproximado
  const predictedPercentage = Math.round((distance / predictedDistance) * 100);
  
  let interpretation = `Capacidad funcional ${capacity.toLowerCase()}`;
  if (borgScale) {
    interpretation += `. Escala de Borg: ${borgScale}/10`;
  }
  
  return {
    distance,
    capacity,
    predictedPercentage,
    interpretation
  };
}

// ========================================
// CÁLCULOS GASTROENTEROLÓGICOS
// ========================================

/**
 * Calcula el score Child-Pugh para cirrosis hepática
 */
export function calculateChildPugh(scores: {
  bilirubin: number; // 1-3 puntos
  albumin: number;   // 1-3 puntos
  inr: number;       // 1-3 puntos
  ascites: number;   // 1-3 puntos
  encephalopathy: number; // 1-3 puntos
}): ChildPughResult {
  const total = scores.bilirubin + scores.albumin + scores.inr + scores.ascites + scores.encephalopathy;
  
  let classification: 'A' | 'B' | 'C';
  let interpretation = '';
  let prognosis = '';
  
  if (total <= 6) {
    classification = 'A';
    interpretation = 'Clase A - Compensado';
    prognosis = 'Supervivencia a 1 año: >95%, Mortalidad quirúrgica: <10%';
  } else if (total <= 9) {
    classification = 'B';
    interpretation = 'Clase B - Descompensado';
    prognosis = 'Supervivencia a 1 año: 80%, Mortalidad quirúrgica: 30%';
  } else {
    classification = 'C';
    interpretation = 'Clase C - Descompensado Severo';
    prognosis = 'Supervivencia a 1 año: 45%, Mortalidad quirúrgica: 80%';
  }
  
  return {
    score: total,
    class: classification,
    interpretation,
    prognosis
  };
}

/**
 * Calcula el score Glasgow-Blatchford para hemorragia digestiva alta
 */
export function calculateGlasgowBlatchford(factors: {
  urea1: boolean;      // BUN 6.5-8.0 mmol/L = 2 puntos
  urea2: boolean;      // BUN 8.0-10.0 mmol/L = 3 puntos
  urea3: boolean;      // BUN 10.0-25.0 mmol/L = 4 puntos
  urea4: boolean;      // BUN >25.0 mmol/L = 6 puntos
  hemoglobinMale: boolean;   // Hb <12 g/dL (hombre) = 1 punto
  hemoglobinFemale: boolean; // Hb <10 g/dL (mujer) = 1 punto
  systolicBP: boolean;       // TAS <100 mmHg = 1 punto
  heartRate: boolean;        // FC ≥100 lpm = 1 punto
}): GlasgowBlatchfordResult {
  let score = 0;
  
  if (factors.urea1) score += 2;
  if (factors.urea2) score += 3;
  if (factors.urea3) score += 4;
  if (factors.urea4) score += 6;
  if (factors.hemoglobinMale) score += 1;
  if (factors.hemoglobinFemale) score += 1;
  if (factors.systolicBP) score += 1;
  if (factors.heartRate) score += 1;
  
  let risk: 'low' | 'moderate' | 'high';
  let interpretation = '';
  let recommendation = '';
  
  if (score <= 6) {
    risk = 'low';
    interpretation = 'Bajo riesgo de re-sangrado y mortalidad';
    recommendation = 'Manejo ambulatorio puede ser considerado';
  } else if (score <= 12) {
    risk = 'moderate';
    interpretation = 'Riesgo moderado de re-sangrado y mortalidad';
    recommendation = 'Hospitalización y endoscopia urgente';
  } else {
    risk = 'high';
    interpretation = 'Alto riesgo de re-sangrado y mortalidad';
    recommendation = 'Hospitalización inmediata, endoscopia emergente';
  }
  
  return {
    score,
    risk,
    interpretation,
    recommendation
  };
}

// ========================================
// ESCALAS DE DOLOR Y EVALUACIÓN
// ========================================

/**
 * Evalúa una escala de dolor del 0-10
 */
export function evaluatePainScale(value: number): PainScale {
  let description = '';
  let color: 'green' | 'yellow' | 'red' = 'green';
  
  if (value === 0) {
    description = 'Sin dolor';
    color = 'green';
  } else if (value <= 3) {
    description = 'Dolor leve';
    color = 'green';
  } else if (value <= 7) {
    description = 'Dolor moderado';
    color = 'yellow';
  } else {
    description = 'Dolor severo';
    color = 'red';
  }
  
  return { value, description, color };
}

/**
 * Evalúa intensidad de pulsos (0-4+)
 */
export function evaluatePulseIntensity(intensity: number): {
  intensity: number;
  description: string;
  normal: boolean;
} {
  const descriptions = {
    0: 'Ausente',
    1: 'Débil',
    2: 'Normal',
    3: 'Aumentado',
    4: 'Saltón'
  };
  
  return {
    intensity,
    description: descriptions[intensity as keyof typeof descriptions] || 'No evaluado',
    normal: intensity === 2
  };
}

// ========================================
// UTILIDADES GENERALES
// ========================================

/**
 * Clasifica valores de signos vitales
 */
export function classifyVitalSigns(values: {
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
}): {
  classification: 'normal' | 'abnormal' | 'critical';
  alerts: string[];
} {
  const alerts: string[] = [];
  let classification: 'normal' | 'abnormal' | 'critical' = 'normal';
  
  if (values.systolic) {
    if (values.systolic < 90 || values.systolic > 180) {
      alerts.push(`Presión sistólica ${values.systolic < 90 ? 'baja' : 'alta'}: ${values.systolic} mmHg`);
      classification = values.systolic < 70 || values.systolic > 200 ? 'critical' : 'abnormal';
    }
  }
  
  if (values.diastolic) {
    if (values.diastolic < 60 || values.diastolic > 110) {
      alerts.push(`Presión diastólica ${values.diastolic < 60 ? 'baja' : 'alta'}: ${values.diastolic} mmHg`);
      classification = values.diastolic < 40 || values.diastolic > 120 ? 'critical' : 'abnormal';
    }
  }
  
  if (values.heartRate) {
    if (values.heartRate < 60 || values.heartRate > 100) {
      alerts.push(`Frecuencia cardíaca ${values.heartRate < 60 ? 'baja' : 'alta'}: ${values.heartRate} lpm`);
      classification = values.heartRate < 40 || values.heartRate > 150 ? 'critical' : 'abnormal';
    }
  }
  
  if (values.temperature) {
    if (values.temperature < 36.1 || values.temperature > 37.2) {
      alerts.push(`Temperatura ${values.temperature < 36.1 ? 'baja' : 'alta'}: ${values.temperature}°C`);
      classification = values.temperature < 35 || values.temperature > 39 ? 'critical' : 'abnormal';
    }
  }
  
  if (values.oxygenSaturation) {
    if (values.oxygenSaturation < 95) {
      alerts.push(`Saturación de oxígeno baja: ${values.oxygenSaturation}%`);
      classification = values.oxygenSaturation < 90 ? 'critical' : 'abnormal';
    }
  }
  
  return { classification, alerts };
}

// ========================================
// CÁLCULOS UROLÓGICOS
// ========================================

/**
 * Calcula el score IPSS (International Prostate Symptom Score)
 */
export function calculateIPSS(scores: {
  incompleteEmptying: number;    // 0-5
  frequency: number;             // 0-5
  intermittency: number;         // 0-5
  urgency: number;               // 0-5
  weakStream: number;            // 0-5
  straining: number;             // 0-5
  nocturia: number;              // 0-5
}, qualityOfLife?: number): IPSSResult {
  const total = scores.incompleteEmptying + scores.frequency + scores.intermittency + 
                scores.urgency + scores.weakStream + scores.straining + scores.nocturia;
  
  let severity: 'mild' | 'moderate' | 'severe';
  let interpretation = '';
  
  if (total <= 7) {
    severity = 'mild';
    interpretation = 'Síntomas leves';
  } else if (total <= 19) {
    severity = 'moderate';
    interpretation = 'Síntomas moderados';
  } else {
    severity = 'severe';
    interpretation = 'Síntomas severos';
  }
  
  let qualityOfLifeText = '';
  if (qualityOfLife !== undefined) {
    if (qualityOfLife <= 1) {
      qualityOfLifeText = 'Encantado/Satisfecho';
    } else if (qualityOfLife <= 3) {
      qualityOfLifeText = 'Mayormente satisfecho/Mixto';
    } else if (qualityOfLife <= 5) {
      qualityOfLifeText = 'Mayormente insatisfecho/Infeliz';
    } else {
      qualityOfLifeText = 'Terrible';
    }
  }
  
  return {
    score: total,
    severity,
    interpretation,
    qualityOfLife: qualityOfLifeText
  };
}

/**
 * Calcula el score ICIQ (International Consultation on Incontinence Questionnaire)
 */
export function calculateICIQ(
  frequency: number,      // 0-5
  amount: number,         // 0-6  
  interference: number    // 0-10
): ICIQResult {
  const total = frequency + amount + interference;
  
  let severity: 'none' | 'mild' | 'moderate' | 'severe' | 'very-severe';
  let interpretation = '';
  
  if (total === 0) {
    severity = 'none';
    interpretation = 'Sin incontinencia';
  } else if (total <= 5) {
    severity = 'mild';
    interpretation = 'Incontinencia leve';
  } else if (total <= 12) {
    severity = 'moderate';
    interpretation = 'Incontinencia moderada';
  } else if (total <= 18) {
    severity = 'severe';
    interpretation = 'Incontinencia severa';
  } else {
    severity = 'very-severe';
    interpretation = 'Incontinencia muy severa';
  }
  
  return {
    score: total,
    severity,
    interpretation
  };
}

/**
 * Calcula el score IIEF-5 (International Index of Erectile Function)
 */
export function calculateIIEF5(scores: {
  confidence: number;        // 1-5
  firmness: number;          // 1-5
  maintenance: number;       // 1-5
  difficulty: number;        // 1-5
  satisfaction: number;      // 1-5
}): IIEFResult {
  const total = scores.confidence + scores.firmness + scores.maintenance + 
                scores.difficulty + scores.satisfaction;
  
  let classification: 'normal' | 'mild' | 'mild-moderate' | 'moderate' | 'severe';
  let interpretation = '';
  
  if (total >= 22) {
    classification = 'normal';
    interpretation = 'Sin disfunción eréctil';
  } else if (total >= 17) {
    classification = 'mild';
    interpretation = 'Disfunción eréctil leve';
  } else if (total >= 12) {
    classification = 'mild-moderate';
    interpretation = 'Disfunción eréctil leve-moderada';
  } else if (total >= 8) {
    classification = 'moderate';
    interpretation = 'Disfunción eréctil moderada';
  } else {
    classification = 'severe';
    interpretation = 'Disfunción eréctil severa';
  }
  
  return {
    score: total,
    classification,
    interpretation
  };
}

/**
 * Evalúa el tamaño y características de la próstata
 */
export function evaluateProstate(
  size: 'normal' | 'mild-enlarged' | 'moderate-enlarged' | 'severe-enlarged',
  characteristics?: {
    hard?: boolean;
    nodular?: boolean;
    fixed?: boolean;
    painful?: boolean;
  }
): ProstateEvaluation {
  let interpretation = '';
  let severity: 'normal' | 'warning' | 'alert' = 'normal';
  
  switch (size) {
    case 'normal':
      interpretation = 'Próstata de tamaño normal';
      severity = 'normal';
      break;
    case 'mild-enlarged':
      interpretation = 'Hiperplasia prostática leve';
      severity = 'normal';
      break;
    case 'moderate-enlarged':
      interpretation = 'Hiperplasia prostática moderada';
      severity = 'warning';
      break;
    case 'severe-enlarged':
      interpretation = 'Hiperplasia prostática severa';
      severity = 'alert';
      break;
  }
  
  // Evaluar características sospechosas
  if (characteristics) {
    if (characteristics.hard || characteristics.nodular || characteristics.fixed) {
      interpretation += ' - Características sospechosas';
      severity = 'alert';
    }
    if (characteristics.painful) {
      interpretation += ' - Dolorosa a la palpación';
      if (severity === 'normal') severity = 'warning';
    }
  }
  
  return {
    size,
    interpretation,
    severity
  };
}

/**
 * Evalúa síntomas urinarios
 */
export function evaluateUrinarySymptoms(
  daytimeFrequency: number,
  nocturia: number
): {
  daytimeStatus: 'normal' | 'increased';
  nocturiaStatus: 'normal' | 'significant';
  interpretation: string;
} {
  const daytimeStatus = daytimeFrequency > 8 ? 'increased' : 'normal';
  const nocturiaStatus = nocturia > 2 ? 'significant' : 'normal';
  
  let interpretation = '';
  if (daytimeStatus === 'increased') interpretation += 'Polaquiuria ';
  if (nocturiaStatus === 'significant') interpretation += 'Nicturia significativa ';
  if (!interpretation) interpretation = 'Patrón miccional normal';
  
  return {
    daytimeStatus,
    nocturiaStatus,
    interpretation: interpretation.trim()
  };
}

// ========================================
// CÁLCULOS NEUMOLÓGICOS
// ========================================

export interface DyspneaScale {
  value: number;
  description: string;
  color: 'green' | 'yellow' | 'red';
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'very-severe';
}

export interface COPDRiskResult {
  score: number;
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  interpretation: string;
  recommendation: string;
}

/**
 * Evalúa la escala de disnea mMRC (Modified Medical Research Council)
 */
export function evaluateDyspnea(mMRCScore: number): DyspneaScale {
  let description = '';
  let color: 'green' | 'yellow' | 'red' = 'green';
  let severity: 'none' | 'mild' | 'moderate' | 'severe' | 'very-severe' = 'none';

  switch (mMRCScore) {
    case 0:
      description = 'Sin disnea significativa';
      color = 'green';
      severity = 'none';
      break;
    case 1:
      description = 'Disnea leve con ejercicio intenso';
      color = 'green';
      severity = 'mild';
      break;
    case 2:
      description = 'Disnea moderada al caminar';
      color = 'yellow';
      severity = 'moderate';
      break;
    case 3:
      description = 'Disnea importante limitante';
      color = 'red';
      severity = 'severe';
      break;
    case 4:
      description = 'Disnea incapacitante';
      color = 'red';
      severity = 'very-severe';
      break;
    default:
      description = 'Escala no válida';
      color = 'yellow';
      severity = 'none';
  }

  return {
    value: mMRCScore,
    description,
    color,
    severity
  };
}

/**
 * Calcula el riesgo de EPOC basado en factores de riesgo
 */
export function calculateCOPDRisk(
  age: number,
  packYears: number,
  symptoms: string[],
  mMRCScore: number
): COPDRiskResult {
  let score = 0;
  
  // Edad
  if (age >= 40) score += 1;
  if (age >= 60) score += 1;
  
  // Pack-years
  if (packYears >= 10) score += 1;
  if (packYears >= 20) score += 2;
  if (packYears >= 40) score += 1;
  
  // Síntomas
  const hasChronicCough = symptoms.some(s => s.includes('Tos') || s.includes('productiva'));
  const hasDyspnea = symptoms.some(s => s.includes('Disnea'));
  const hasSputum = symptoms.some(s => s.includes('esputo') || s.includes('flema'));
  
  if (hasChronicCough) score += 1;
  if (hasDyspnea) score += 1;
  if (hasSputum) score += 1;
  
  // mMRC
  if (mMRCScore >= 2) score += 1;
  if (mMRCScore >= 3) score += 1;
  
  // Determinar riesgo
  let risk: 'low' | 'moderate' | 'high' | 'very-high';
  let interpretation: string;
  let recommendation: string;
  
  if (score <= 2) {
    risk = 'low';
    interpretation = 'Riesgo bajo de EPOC';
    recommendation = 'Seguimiento de rutina. Promoción de cesación tabáquica.';
  } else if (score <= 4) {
    risk = 'moderate';
    interpretation = 'Riesgo moderado de EPOC';
    recommendation = 'Considerar espirometría. Intervención anti-tabaco intensiva.';
  } else if (score <= 6) {
    risk = 'high';
    interpretation = 'Riesgo alto de EPOC';
    recommendation = 'Espirometría recomendada. Evaluación neumológica.';
  } else {
    risk = 'very-high';
    interpretation = 'Riesgo muy alto de EPOC';
    recommendation = 'Espirometría urgente. Derivación inmediata a neumología.';
  }
  
  return {
    score,
    risk,
    interpretation,
    recommendation
  };
}

// ========================================
// CÁLCULOS NEUROLÓGICOS AVANZADOS
// ========================================

export interface NIHSSResult {
  score: number;
  severity: 'minor' | 'moderate' | 'moderate-severe' | 'severe';
  interpretation: string;
  thrombolysisEligible: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface GlasgowComaResult {
  score: number;
  eyeOpening: number;
  verbalResponse: number;
  motorResponse: number;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  interpretation: string;
  intubationRequired: boolean;
}

export interface CanadianCTResult {
  highRisk: boolean;
  mediumRisk: boolean;
  recommendation: 'no-ct' | 'consider-ct' | 'ct-required';
  interpretation: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface HuntHessResult {
  grade: number;
  interpretation: string;
  mortality: string;
  surgicalUrgency: 'elective' | 'urgent' | 'emergent';
}

export interface ABCD2Result {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  interpretation: string;
  strokeRisk48h: string;
  recommendation: string;
}

/**
 * Calcula el NIHSS (National Institutes of Health Stroke Scale)
 */
export function calculateNIHSS(components: {
  consciousness: number; // 0-3
  gaze: number; // 0-2
  visual: number; // 0-3
  facialPalsy: number; // 0-3
  leftArm: number; // 0-4
  rightArm: number; // 0-4
  leftLeg: number; // 0-4
  rightLeg: number; // 0-4
  limbAtaxia: number; // 0-2
  sensory: number; // 0-2
  language: number; // 0-3
  dysarthria: number; // 0-2
  extinction: number; // 0-2
}): NIHSSResult {
  const score = Object.values(components).reduce((sum, value) => sum + value, 0);
  
  let severity: NIHSSResult['severity'] = 'minor';
  let interpretation = '';
  let thrombolysisEligible = false;
  let urgencyLevel: NIHSSResult['urgencyLevel'] = 'low';
  
  if (score <= 4) {
    severity = 'minor';
    interpretation = 'Ictus menor - déficit neurológico leve';
    urgencyLevel = 'medium';
    thrombolysisEligible = score >= 4;
  } else if (score <= 15) {
    severity = 'moderate';
    interpretation = 'Ictus moderado - déficit neurológico significativo';
    urgencyLevel = 'high';
    thrombolysisEligible = true;
  } else if (score <= 20) {
    severity = 'moderate-severe';
    interpretation = 'Ictus moderado-severo - déficit neurológico importante';
    urgencyLevel = 'critical';
    thrombolysisEligible = true;
  } else {
    severity = 'severe';
    interpretation = 'Ictus severo - déficit neurológico grave';
    urgencyLevel = 'critical';
    thrombolysisEligible = true; // Evaluar caso por caso
  }
  
  return {
    score,
    severity,
    interpretation,
    thrombolysisEligible,
    urgencyLevel
  };
}

/**
 * Calcula la Escala de Coma de Glasgow
 */
export function calculateGlasgowComa(
  eyeOpening: number,
  verbalResponse: number,
  motorResponse: number
): GlasgowComaResult {
  const score = eyeOpening + verbalResponse + motorResponse;
  
  let severity: GlasgowComaResult['severity'] = 'minor';
  let interpretation = '';
  let intubationRequired = false;
  
  if (score <= 8) {
    severity = 'critical';
    interpretation = 'Coma severo - Riesgo vital inmediato';
    intubationRequired = true;
  } else if (score <= 12) {
    severity = 'severe';
    interpretation = 'Lesión cerebral grave - Monitorización intensiva';
    intubationRequired = false; // Evaluar individualmente
  } else if (score <= 14) {
    severity = 'moderate';
    interpretation = 'Lesión cerebral moderada - Vigilancia estrecha';
    intubationRequired = false;
  } else {
    severity = 'minor';
    interpretation = 'Lesión cerebral leve o normal';
    intubationRequired = false;
  }
  
  return {
    score,
    eyeOpening,
    verbalResponse,
    motorResponse,
    severity,
    interpretation,
    intubationRequired
  };
}

/**
 * Calcula Canadian CT Head Rule
 */
export function calculateCanadianCT(criteria: {
  // Criterios de alto riesgo
  gcsScore: number;
  suspectedOpenSkullFracture: boolean;
  signOfBasilarFracture: boolean;
  vomitingEpisodes: number;
  age65Plus: boolean;
  
  // Criterios de riesgo medio
  amnesia30min: boolean;
  dangerousMechanism: boolean;
}): CanadianCTResult {
  let highRisk = false;
  let mediumRisk = false;
  
  // Criterios de alto riesgo para lesión neurológicamente importante
  if (criteria.gcsScore < 15 || 
      criteria.suspectedOpenSkullFracture || 
      criteria.signOfBasilarFracture || 
      criteria.vomitingEpisodes >= 2 || 
      criteria.age65Plus) {
    highRisk = true;
  }
  
  // Criterios de riesgo medio para cualquier lesión traumática
  if (criteria.amnesia30min || criteria.dangerousMechanism) {
    mediumRisk = true;
  }
  
  let recommendation: CanadianCTResult['recommendation'] = 'no-ct';
  let interpretation = '';
  let urgencyLevel: CanadianCTResult['urgencyLevel'] = 'low';
  
  if (highRisk) {
    recommendation = 'ct-required';
    interpretation = 'TC cerebral URGENTE - Alto riesgo de lesión neurológicamente significativa';
    urgencyLevel = 'high';
  } else if (mediumRisk) {
    recommendation = 'consider-ct';
    interpretation = 'Considerar TC cerebral - Riesgo intermedio de lesión traumática';
    urgencyLevel = 'medium';
  } else {
    recommendation = 'no-ct';
    interpretation = 'TC cerebral no indicada - Bajo riesgo de lesión traumática';
    urgencyLevel = 'low';
  }
  
  return {
    highRisk,
    mediumRisk,
    recommendation,
    interpretation,
    urgencyLevel
  };
}

/**
 * Calcula Hunt-Hess para Hemorragia Subaracnoidea
 */
export function calculateHuntHess(clinicalFindings: {
  consciousness: 'alert' | 'drowsy' | 'stuporous' | 'comatose';
  neckStiffness: boolean;
  motorDeficit: boolean;
  severeFocalDeficit: boolean;
  deepComa: boolean;
}): HuntHessResult {
  let grade = 1;
  let interpretation = '';
  let mortality = '';
  let surgicalUrgency: HuntHessResult['surgicalUrgency'] = 'elective';
  
  if (clinicalFindings.deepComa) {
    grade = 5;
    interpretation = 'Coma profundo, rigidez de descerebración - Pronóstico grave';
    mortality = '70-100%';
    surgicalUrgency = 'emergent';
  } else if (clinicalFindings.severeFocalDeficit || clinicalFindings.consciousness === 'comatose') {
    grade = 4;
    interpretation = 'Estupor, hemiparesia severa - Pronóstico reservado';
    mortality = '40-70%';
    surgicalUrgency = 'emergent';
  } else if (clinicalFindings.motorDeficit || clinicalFindings.consciousness === 'stuporous') {
    grade = 3;
    interpretation = 'Somnolencia, déficit neurológico leve - Riesgo moderado';
    mortality = '20-40%';
    surgicalUrgency = 'urgent';
  } else if (clinicalFindings.neckStiffness || clinicalFindings.consciousness === 'drowsy') {
    grade = 2;
    interpretation = 'Cefalea severa, rigidez de nuca - Buen pronóstico con tratamiento';
    mortality = '5-15%';
    surgicalUrgency = 'urgent';
  } else {
    grade = 1;
    interpretation = 'Asintomático o cefalea leve - Excelente pronóstico';
    mortality = '<5%';
    surgicalUrgency = 'elective';
  }
  
  return {
    grade,
    interpretation,
    mortality,
    surgicalUrgency
  };
}

/**
 * Calcula ABCD² Score para riesgo de ictus post-TIA
 */
export function calculateABCD2(factors: {
  age60Plus: boolean;
  bloodPressure: boolean; // ≥140/90
  clinicalFeatures: 'none' | 'speech' | 'motor'; // Motor = 2 pts, Speech = 1 pt
  duration: number; // in minutes
  diabetes: boolean;
}): ABCD2Result {
  let score = 0;
  
  if (factors.age60Plus) score += 1;
  if (factors.bloodPressure) score += 1;
  if (factors.clinicalFeatures === 'motor') score += 2;
  else if (factors.clinicalFeatures === 'speech') score += 1;
  if (factors.duration >= 60) score += 2;
  else if (factors.duration >= 10) score += 1;
  if (factors.diabetes) score += 1;
  
  let riskLevel: ABCD2Result['riskLevel'] = 'low';
  let interpretation = '';
  let strokeRisk48h = '';
  let recommendation = '';
  
  if (score >= 4) {
    riskLevel = 'high';
    interpretation = 'Alto riesgo de ictus en las próximas 48 horas';
    strokeRisk48h = '8-12%';
    recommendation = 'Hospitalización inmediata + antiagregación + estudio vascular urgente';
  } else if (score >= 2) {
    riskLevel = 'moderate';
    interpretation = 'Riesgo moderado de ictus en las próximas 48 horas';
    strokeRisk48h = '2-4%';
    recommendation = 'Evaluación urgente en 24h + antiagregación + estudio vascular precoz';
  } else {
    riskLevel = 'low';
    interpretation = 'Bajo riesgo de ictus en las próximas 48 horas';
    strokeRisk48h = '<1%';
    recommendation = 'Seguimiento ambulatorio + antiagregación + estudios electivos';
  }
  
  return {
    score,
    riskLevel,
    interpretation,
    strokeRisk48h,
    recommendation
  };
}

/**
 * Evalúa criterios de trombolisis tiempo-dependientes
 */
export function evaluateThrombolysisEligibility(criteria: {
  symptomOnsetHours: number;
  nihssScore: number;
  age: number;
  contraindications: string[];
}): {
  eligible: boolean;
  window: 'ideal' | 'extended' | 'thrombectomy' | 'expired';
  recommendation: string;
  urgency: 'immediate' | 'urgent' | 'consider' | 'not-indicated';
} {
  const { symptomOnsetHours, nihssScore, age, contraindications } = criteria;
  
  let eligible = false;
  let window: 'ideal' | 'extended' | 'thrombectomy' | 'expired' = 'expired';
  let recommendation = '';
  let urgency: 'immediate' | 'urgent' | 'consider' | 'not-indicated' = 'not-indicated';
  
  // Contraindicaciones absolutas
  if (contraindications.length > 0) {
    recommendation = `Contraindicado: ${contraindications.join(', ')}`;
    return { eligible, window, recommendation, urgency };
  }
  
  // Ventana ideal (0-3 horas)
  if (symptomOnsetHours <= 3) {
    window = 'ideal';
    if (nihssScore >= 4 && nihssScore <= 25) {
      eligible = true;
      urgency = 'immediate';
      recommendation = 'CANDIDATO IDEAL para trombolisis IV - Activar código ictus';
    }
  }
  // Ventana extendida (3-4.5 horas)
  else if (symptomOnsetHours <= 4.5) {
    window = 'extended';
    if (nihssScore >= 4 && nihssScore <= 25 && age < 80) {
      eligible = true;
      urgency = 'urgent';
      recommendation = 'Considerar trombolisis IV con criterios expandidos';
    }
  }
  // Ventana trombectomía (4.5-6 horas)
  else if (symptomOnsetHours <= 6) {
    window = 'thrombectomy';
    if (nihssScore >= 6) {
      urgency = 'consider';
      recommendation = 'Fuera de ventana trombolisis - EVALUAR TROMBECTOMÍA MECÁNICA';
    }
  }
  // Fuera de ventana
  else {
    window = 'expired';
    recommendation = 'Fuera de ventana terapéutica para reperfusión - Tratamiento conservador';
  }
  
  return { eligible, window, recommendation, urgency };
}