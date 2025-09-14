import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain,
  Search, 
  AlertTriangle, 
  Target,
  CheckCircle,
  FileText,
  Activity,
  Heart,
  Clock,
  Zap,
  Eye,
  Users,
  Calculator,
  Microscope,
  User,
  Droplets
} from "lucide-react";
import { 
  calculateNIHSS,
  calculateGlasgowComa,
  calculateCanadianCT,
  calculateHuntHess,
  calculateABCD2,
  evaluateThrombolysisEligibility,
  NIHSSResult,
  GlasgowComaResult,
  CanadianCTResult,
  HuntHessResult,
  ABCD2Result
} from "@/utils/medicalCalculations";

interface AdvancedNeurologiaFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

const AdvancedNeurologiaForm = ({ patientData, onDataChange, onComplete }: AdvancedNeurologiaFormProps) => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [emergencyAlerts, setEmergencyAlerts] = useState<Array<{
    id: string;
    type: 'critical' | 'urgent' | 'warning';
    message: string;
    action?: string;
  }>>([]);

  // FASE 1: TRIAGE NEUROLÓGICO INMEDIATO
  const [phase1Data, setPhase1Data] = useState({
    // ABC Neurológico
    abcNeurological: {
      airway: '', // Glasgow ≤8 compromiso vía aérea
      breathing: '', // Patrón respiratorio neurológico
      circulation: '', // Signos vitales neurológicos
    },
    // FAST Neurológico
    fastNeurological: {
      consciousnessAVPU: '', // Alert, Voice, Pain, Unresponsive
      pupils: {
        rightSize: 0,
        leftSize: 0,
        rightReactivity: '',
        leftReactivity: '',
        asymmetry: false
      },
      limbMovement: '', // Normal, débil, ausente
      speechBasic: '' // Normal, disártrico, afásico, mudo
    },
    // Códigos de activación
    activationCodes: {
      codeStroke: false, // Déficit focal agudo
      codeComa: false, // Glasgow ≤8
      codeSeizure: false // Crisis >5min
    },
    // Criterios de emergencia
    emergencyScreening: {
      glasgowScore: 15,
      herniationSigns: false,
      statusEpilepticus: false,
      acuteStrokeSigns: false,
      meningealSigns: false,
      intracranialPressure: false
    }
  });

  // FASE 2: ANAMNESIS NEUROLÓGICA DIRIGIDA
  const [phase2Data, setPhase2Data] = useState({
    // Historia del síntoma principal
    symptomHistory: {
      mainComplaint: '',
      timeEvolution: '', // Hiperagudo <1h, agudo <24h, subagudo, crónico
      temporalPattern: '', // Súbito, progresivo, fluctuante
      triggeringFactors: '',
      associatedSymptoms: []
    },
    // Antecedentes neurológicos estratificados
    neurologicalHistory: {
      previousStroke: false,
      strokeDate: '',
      strokeSequelae: '',
      epilepsy: false,
      epilepsyType: '',
      epilepsyControl: '',
      lastSeizure: '',
      headTrauma: false,
      traumaDate: '',
      traumaSeverity: '',
      neurodegenerative: false,
      neurodegenerativeType: ''
    },
    // Factores de riesgo vascular cerebral
    vascularRiskFactors: {
      hypertension: false,
      diabetes: false,
      dyslipidemia: false,
      atrialFibrillation: false,
      smoking: false,
      alcohol: false,
      anticoagulants: false,
      antiplatelets: false
    },
    // Evaluación funcional previa
    functionalAssessment: {
      modifiedRankinBaseline: 0,
      independentADL: true,
      previousCognition: ''
    }
  });

  // FASE 3: EXAMEN NEUROLÓGICO SISTEMÁTICO
  const [phase3Data, setPhase3Data] = useState({
    // Evaluación de conciencia expandida
    consciousnessExpanded: {
      glasgowEye: 4,
      glasgowVerbal: 5,
      glasgowMotor: 6,
      temporalOrientation: true,
      spatialOrientation: true,
      personalOrientation: true,
      sustainedAttention: true,
      workingMemory: true
    },
    // Pares craneales con correlación topográfica
    cranialNerves: {
      olfactory: '', // I
      visual: '', // II - campos visuales obligatorios si focal
      oculomotor: '', // III-IV-VI
      trigeminal: '', // V
      facial: '', // VII - central vs periférico
      auditory: '', // VIII
      glossopharyngeal: '', // IX-X
      accessory: '', // XI
      hypoglossal: '' // XII
    },
    // Sistema motor con localización precisa
    motorSystem: {
      leftArmStrength: 5, // Escala MRC 0-5
      rightArmStrength: 5,
      leftLegStrength: 5,
      rightLegStrength: 5,
      muscularTone: '',
      coordination: '',
      involuntaryMovements: '',
      gaitBalance: ''
    },
    // Sistema sensitivo por modalidades
    sensorySystem: {
      superficialSensation: '',
      deepSensation: '',
      tactileDiscrimination: '',
      topographicMapping: ''
    },
    // Reflejos y signos patológicos
    reflexes: {
      deepTendonReflexes: {
        biceps: 2, // 0-4+
        triceps: 2,
        knee: 2,
        ankle: 2
      },
      pathologicalReflexes: {
        babinski: false,
        hoffman: false,
        clonus: false
      },
      meningealSigns: {
        neckStiffness: false,
        kernig: false,
        brudzinski: false
      }
    }
  });

  // FASE 4: ESCALAS NEUROLÓGICAS DIRIGIDAS
  const [phase4Data, setPhase4Data] = useState({
    // NIHSS si sospecha ictus
    nihssComponents: {
      consciousness: 0, // 0-3
      gaze: 0, // 0-2
      visual: 0, // 0-3
      facialPalsy: 0, // 0-3
      leftArm: 0, // 0-4
      rightArm: 0, // 0-4
      leftLeg: 0, // 0-4
      rightLeg: 0, // 0-4
      limbAtaxia: 0, // 0-2
      sensory: 0, // 0-2
      language: 0, // 0-3
      dysarthria: 0, // 0-2
      extinction: 0 // 0-2
    },
    // Canadian CT Head Rule si traumatismo
    canadianCTCriteria: {
      gcsScore: 15,
      suspectedOpenSkullFracture: false,
      signOfBasilarFracture: false,
      vomitingEpisodes: 0,
      age65Plus: false,
      amnesia30min: false,
      dangerousMechanism: false
    },
    // Hunt-Hess si sospecha HSA
    huntHessFindings: {
      consciousness: 'alert' as 'alert' | 'drowsy' | 'stuporous' | 'comatose',
      neckStiffness: false,
      motorDeficit: false,
      severeFocalDeficit: false,
      deepComa: false
    },
    // ABCD² para TIA
    abcd2Factors: {
      age60Plus: false,
      bloodPressure: false,
      clinicalFeatures: 'none' as 'none' | 'speech' | 'motor',
      duration: 0,
      diabetes: false
    },
    // Criterios de trombolisis
    thrombolysisCriteria: {
      symptomOnsetHours: 0,
      nihssScore: 0,
      age: 0,
      contraindications: [] as string[]
    }
  });

  // MANIOBRAS NEUROLÓGICAS ESPECÍFICAS
  const [neurologicalManeuvers, setNeurologicalManeuvers] = useState({
    indicated: {
      oculocephalic: false,
      oculovestibular: false,
      nystagmusEvaluation: false,
      cerebellarTests: false,
      provocativeTests: false,
      drixFundoscopy: false
    },
    results: {
      oculocephalic: '',
      oculovestibular: '',
      nystagmus: '',
      cerebellar: '',
      provocative: '',
      fundoscopy: ''
    }
  });

  // ESCALAS Y RESULTADOS CALCULADOS
  const [calculatedScales, setCalculatedScales] = useState({
    nihss: null as NIHSSResult | null,
    glasgow: null as GlasgowComaResult | null,
    canadianCT: null as CanadianCTResult | null,
    huntHess: null as HuntHessResult | null,
    abcd2: null as ABCD2Result | null,
    thrombolysis: null as any
  });

  // VALIDACIÓN CRUZADA NEUROLÓGICA
  const [crossValidation, setCrossValidation] = useState({
    anatomicalCorrelations: [] as Array<{
      finding: string;
      location: string;
      consistency: 'consistent' | 'inconsistent';
      confidence: string;
    }>,
    clinicalInconsistencies: [] as Array<{
      type: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>,
    diagnosticClues: [] as Array<{
      syndrome: string;
      likelihood: string;
      keyFindings: string[];
      recommendation: string;
    }>
  });

  // Cálculo automático de escalas
  useEffect(() => {
    // NIHSS
    const nihssResult = calculateNIHSS(phase4Data.nihssComponents);
    
    // Glasgow
    const glasgowResult = calculateGlasgowComa(
      phase3Data.consciousnessExpanded.glasgowEye,
      phase3Data.consciousnessExpanded.glasgowVerbal,
      phase3Data.consciousnessExpanded.glasgowMotor
    );
    
    // Canadian CT Head Rule
    const canadianCTResult = calculateCanadianCT(phase4Data.canadianCTCriteria);
    
    // Hunt-Hess
    const huntHessResult = calculateHuntHess(phase4Data.huntHessFindings);
    
    // ABCD²
    const abcd2Result = calculateABCD2(phase4Data.abcd2Factors);
    
    // Trombolisis
    const thrombolysisResult = evaluateThrombolysisEligibility(phase4Data.thrombolysisCriteria);

    setCalculatedScales({
      nihss: nihssResult,
      glasgow: glasgowResult,
      canadianCT: canadianCTResult,
      huntHess: huntHessResult,
      abcd2: abcd2Result,
      thrombolysis: thrombolysisResult
    });

    // Actualizar datos del formulario
    setPhase1Data(prev => ({
      ...prev,
      emergencyScreening: {
        ...prev.emergencyScreening,
        glasgowScore: glasgowResult.score
      }
    }));

    setPhase4Data(prev => ({
      ...prev,
      thrombolysisCriteria: {
        ...prev.thrombolysisCriteria,
        nihssScore: nihssResult.score
      }
    }));

  }, [phase3Data.consciousnessExpanded, phase4Data.nihssComponents, phase4Data.canadianCTCriteria, phase4Data.huntHessFindings, phase4Data.abcd2Factors, phase4Data.thrombolysisCriteria]);

  // Sistema de alertas automáticas neurológicas
  useEffect(() => {
    const alerts = [];
    
    // Alertas Críticas (Rojas) - Acción inmediata
    if (calculatedScales.glasgow && calculatedScales.glasgow.score <= 8) {
      alerts.push({
        id: 'glasgow-critical',
        type: 'critical' as const,
        message: '🚨 GLASGOW ≤8 - COMA SEVERO',
        action: 'UCI inmediata + Evaluar vía aérea + Intubación'
      });
    }
    
    if (calculatedScales.nihss && calculatedScales.nihss.score >= 15) {
      alerts.push({
        id: 'nihss-severe',
        type: 'critical' as const,
        message: '🚨 NIHSS ≥15 - ICTUS SEVERO',
        action: 'Código ictus + Neurocirugía + Trombolisis urgente'
      });
    }
    
    if (phase1Data.activationCodes.codeSeizure) {
      alerts.push({
        id: 'status-epilepticus',
        type: 'critical' as const,
        message: '🚨 STATUS EPILÉPTICO - Crisis >5min',
        action: 'Benzodiacepinas IV + Fenitoína + UCI'
      });
    }
    
    if (phase1Data.fastNeurological.pupils.asymmetry && phase1Data.emergencyScreening.herniationSigns) {
      alerts.push({
        id: 'herniation-signs',
        type: 'critical' as const,
        message: '🚨 SIGNOS DE HERNIACIÓN',
        action: 'Osmóticos + Neurocirugía + TC urgente'
      });
    }

    // Alertas Urgentes (Amarillas)
    if (calculatedScales.nihss && calculatedScales.nihss.score >= 5 && calculatedScales.nihss.score < 15 && phase4Data.thrombolysisCriteria.symptomOnsetHours < 4.5) {
      alerts.push({
        id: 'thrombolysis-window',
        type: 'urgent' as const,
        message: '⚠️ VENTANA TROMBOLISIS - NIHSS 5-14',
        action: 'Activar código ictus + Evaluar trombolisis'
      });
    }
    
    if (phase2Data.symptomHistory.mainComplaint.includes('cefalea') && phase3Data.reflexes.meningealSigns.neckStiffness) {
      alerts.push({
        id: 'subarachnoid-hemorrhage',
        type: 'urgent' as const,
        message: '⚠️ SOSPECHA HEMORRAGIA SUBARACNOIDEA',
        action: 'TC cerebral urgente + Punción lumbar'
      });
    }
    
    if (calculatedScales.canadianCT && calculatedScales.canadianCT.recommendation === 'ct-required') {
      alerts.push({
        id: 'ct-required',
        type: 'urgent' as const,
        message: '⚠️ TC CEREBRAL URGENTE',
        action: calculatedScales.canadianCT.interpretation
      });
    }

    // Alertas Preventivas (Verdes)
    if (calculatedScales.abcd2 && calculatedScales.abcd2.score >= 4) {
      alerts.push({
        id: 'abcd2-high-risk',
        type: 'warning' as const,
        message: '🔔 ALTO RIESGO POST-TIA (ABCD² ≥4)',
        action: 'Hospitalización + Antiagregación + Estudio vascular'
      });
    }

    setEmergencyAlerts(alerts);
    
  }, [calculatedScales, phase1Data, phase2Data, phase3Data, phase4Data]);

  // Validación cruzada neurológica automática
  useEffect(() => {
    const correlations = [];
    const inconsistencies = [];
    const diagnosticClues = [];

    // Correlación Glasgow vs NIHSS
    if (calculatedScales.glasgow && calculatedScales.nihss) {
      const glasgowSevere = calculatedScales.glasgow.score <= 12;
      const nihssSevere = calculatedScales.nihss.score >= 15;
      
      if (glasgowSevere && nihssSevere) {
        correlations.push({
          finding: 'Glasgow bajo + NIHSS alto',
          location: 'Lesión cerebral extensa',
          consistency: 'consistent' as const,
          confidence: 'Alta correlación anatomoclínica'
        });
      } else if (!glasgowSevere && nihssSevere) {
        inconsistencies.push({
          type: 'GCS-NIHSS mismatch',
          message: 'NIHSS alto con Glasgow preservado - Evaluar afasia vs negligencia',
          severity: 'medium' as const
        });
      }
    }

    // Correlación síntomas-localización
    if (phase4Data.nihssComponents.facialPalsy > 0 && phase4Data.nihssComponents.leftArm > 0) {
      correlations.push({
        finding: 'Parálisis facial + Debilidad brazo izquierdo',
        location: 'Territorio arteria cerebral media derecha',
        consistency: 'consistent' as const,
        confidence: 'Correlación anatómica típica'
      });
    }

    // Pistas diagnósticas
    if (phase2Data.symptomHistory.temporalPattern === 'súbito' && calculatedScales.nihss && calculatedScales.nihss.score > 4) {
      diagnosticClues.push({
        syndrome: 'Ictus isquémico agudo',
        likelihood: 'Alta probabilidad',
        keyFindings: ['Inicio súbito', 'NIHSS >4', 'Déficit focal'],
        recommendation: 'Activar código ictus + Neuroimagen urgente'
      });
    }

    if (phase2Data.symptomHistory.mainComplaint.includes('cefalea') && phase2Data.symptomHistory.temporalPattern === 'súbito') {
      diagnosticClues.push({
        syndrome: 'Cefalea en trueno - HSA',
        likelihood: 'Sospecha alta',
        keyFindings: ['Cefalea súbita', 'Peor de la vida', 'Rigidez nuca'],
        recommendation: 'TC cerebral + Angio-TC + Considerar PL'
      });
    }

    setCrossValidation({
      anatomicalCorrelations: correlations,
      clinicalInconsistencies: inconsistencies,
      diagnosticClues: diagnosticClues
    });

  }, [calculatedScales, phase2Data, phase4Data]);

  // Función para enviar datos y completar
  const handleComplete = () => {
    const completeData = {
      phase1: phase1Data,
      phase2: phase2Data,
      phase3: phase3Data,
      phase4: phase4Data,
      neurologicalManeuvers,
      calculatedScales,
      crossValidation,
      emergencyAlerts
    };
    
    onDataChange?.(completeData);
    onComplete?.(completeData);
  };

  const phases = [
    { id: 1, name: "Triage Neurológico", icon: AlertTriangle, time: "0-2 min" },
    { id: 2, name: "Anamnesis Dirigida", icon: User, time: "3-10 min" },
    { id: 3, name: "Examen Sistemático", icon: Search, time: "10-20 min" },
    { id: 4, name: "Escalas Dirigidas", icon: Calculator, time: "5-15 min" },
    { id: 5, name: "Síntesis Neurológica", icon: Brain, time: "2-5 min" }
  ];

  const progress = (currentPhase / phases.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header del Sistema Neurológico */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="h-10 w-10 text-purple-300" />
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Sistema Neurológico Avanzado Integrado
                  </CardTitle>
                  {patientData && (
                    <div className="flex items-center gap-2 mt-2 mb-2">
                      <User className="h-4 w-4 text-blue-300" />
                      <span className="text-white/90 font-medium">
                        {patientData.name}
                        {patientData.age && `, ${patientData.age} años`}
                        {patientData.gender && `, ${patientData.gender}`}
                      </span>
                    </div>
                  )}
                  <CardDescription className="text-white/70 text-lg">
                    Evaluación neurológica completa con alertas automáticas y escalas especializadas
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                Fase {currentPhase}/5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-5 gap-2">
                {phases.map((phase) => (
                  <Button
                    key={phase.id}
                    onClick={() => setCurrentPhase(phase.id)}
                    variant={currentPhase === phase.id ? "default" : "outline"}
                    className={`flex flex-col items-center p-4 h-auto ${
                      currentPhase === phase.id 
                        ? "bg-purple-600 text-white" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <phase.icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium">{phase.name}</span>
                    <span className="text-xs opacity-70">{phase.time}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sistema de Alertas Automáticas */}
        {emergencyAlerts.length > 0 && (
          <div className="grid gap-4">
            {emergencyAlerts.map((alert) => (
              <Alert 
                key={alert.id} 
                className={`border-2 ${
                  alert.type === 'critical' ? 'bg-red-900/30 border-red-500' :
                  alert.type === 'urgent' ? 'bg-yellow-900/30 border-yellow-500' :
                  'bg-blue-900/30 border-blue-500'
                }`}
              >
                <AlertTriangle className={`h-6 w-6 ${
                  alert.type === 'critical' ? 'text-red-400' :
                  alert.type === 'urgent' ? 'text-yellow-400' :
                  'text-blue-400'
                }`} />
                <AlertDescription className="text-white">
                  <div className="space-y-2">
                    <div className="font-bold text-lg">{alert.message}</div>
                    {alert.action && (
                      <div className="text-sm bg-white/10 p-3 rounded">
                        <strong>Acción requerida:</strong> {alert.action}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* FASE 1: TRIAGE NEUROLÓGICO INMEDIATO */}
        {currentPhase === 1 && (
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-300" />
                FASE 1: Triage Neurológico Inmediato (0-2 minutos)
              </CardTitle>
              <CardDescription className="text-white/70">
                Evaluación ABC neurológico, FAST neurológico y activación de códigos de emergencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* ABC Neurológico */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  Clasificación ABC Neurológico
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">A - Vía aérea (Glasgow ≤8)</Label>
                    <Select 
                      value={phase1Data.abcNeurological.airway} 
                      onValueChange={(value) => setPhase1Data(prev => ({ 
                        ...prev, 
                        abcNeurological: { ...prev.abcNeurological, airway: value }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Evaluar vía aérea" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patent">Permeable</SelectItem>
                        <SelectItem value="compromised">Comprometida</SelectItem>
                        <SelectItem value="obstructed">Obstruida - INTUBACIÓN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">B - Respiración (Patrón neurológico)</Label>
                    <Select 
                      value={phase1Data.abcNeurological.breathing} 
                      onValueChange={(value) => setPhase1Data(prev => ({ 
                        ...prev, 
                        abcNeurological: { ...prev.abcNeurological, breathing: value }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Patrón respiratorio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="cheyne-stokes">Cheyne-Stokes</SelectItem>
                        <SelectItem value="central">Hiperventilación central</SelectItem>
                        <SelectItem value="ataxic">Atáxico (Biot)</SelectItem>
                        <SelectItem value="apneustic">Apnéustico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">C - Circulación (Signos vitales)</Label>
                    <Select 
                      value={phase1Data.abcNeurological.circulation} 
                      onValueChange={(value) => setPhase1Data(prev => ({ 
                        ...prev, 
                        abcNeurological: { ...prev.abcNeurological, circulation: value }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Estado circulatorio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable">Estable</SelectItem>
                        <SelectItem value="hypertensive">Hipertensión (PIC)</SelectItem>
                        <SelectItem value="bradycardia">Bradicardia (Cushing)</SelectItem>
                        <SelectItem value="shock">Shock neurogénico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* FAST Neurológico */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  Evaluación FAST Neurológico
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Nivel de conciencia (AVPU)</Label>
                      <Select 
                        value={phase1Data.fastNeurological.consciousnessAVPU} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          fastNeurological: { ...prev.fastNeurological, consciousnessAVPU: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Nivel conciencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alert">A - Alerta</SelectItem>
                          <SelectItem value="voice">V - Responde a voz</SelectItem>
                          <SelectItem value="pain">P - Responde a dolor</SelectItem>
                          <SelectItem value="unresponsive">U - No responde</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Movimiento extremidades</Label>
                      <Select 
                        value={phase1Data.fastNeurological.limbMovement} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          fastNeurological: { ...prev.fastNeurological, limbMovement: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Movimiento extremidades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal bilateral</SelectItem>
                          <SelectItem value="weak">Debilidad unilateral</SelectItem>
                          <SelectItem value="absent">Ausente unilateral</SelectItem>
                          <SelectItem value="posturing">Posturas patológicas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Habla básica</Label>
                      <Select 
                        value={phase1Data.fastNeurological.speechBasic} 
                        onValueChange={(value) => setPhase1Data(prev => ({ 
                          ...prev, 
                          fastNeurological: { ...prev.fastNeurological, speechBasic: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Evaluación del habla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="dysarthric">Disártrico</SelectItem>
                          <SelectItem value="aphasic">Afásico</SelectItem>
                          <SelectItem value="mute">Mudo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-white">Evaluación Pupilar Detallada</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Pupila derecha (mm)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="8"
                          value={phase1Data.fastNeurological.pupils.rightSize}
                          onChange={(e) => setPhase1Data(prev => ({
                            ...prev,
                            fastNeurological: {
                              ...prev.fastNeurological,
                              pupils: { ...prev.fastNeurological.pupils, rightSize: parseInt(e.target.value) || 0 }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Pupila izquierda (mm)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="8"
                          value={phase1Data.fastNeurological.pupils.leftSize}
                          onChange={(e) => setPhase1Data(prev => ({
                            ...prev,
                            fastNeurological: {
                              ...prev.fastNeurological,
                              pupils: { ...prev.fastNeurological.pupils, leftSize: parseInt(e.target.value) || 0 }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Reactividad derecha</Label>
                        <Select 
                          value={phase1Data.fastNeurological.pupils.rightReactivity} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            fastNeurological: {
                              ...prev.fastNeurological,
                              pupils: { ...prev.fastNeurological.pupils, rightReactivity: value }
                            }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Reactividad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reactive">Reactiva</SelectItem>
                            <SelectItem value="sluggish">Lenta</SelectItem>
                            <SelectItem value="fixed">Fija</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm">Reactividad izquierda</Label>
                        <Select 
                          value={phase1Data.fastNeurological.pupils.leftReactivity} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            fastNeurological: {
                              ...prev.fastNeurological,
                              pupils: { ...prev.fastNeurological.pupils, leftReactivity: value }
                            }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Reactividad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reactive">Reactiva</SelectItem>
                            <SelectItem value="sluggish">Lenta</SelectItem>
                            <SelectItem value="fixed">Fija</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pupilAsymmetry"
                        checked={phase1Data.fastNeurological.pupils.asymmetry}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({
                          ...prev,
                          fastNeurological: {
                            ...prev.fastNeurological,
                            pupils: { ...prev.fastNeurological.pupils, asymmetry: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="pupilAsymmetry" className="text-white text-sm font-bold">
                        🚨 Asimetría pupilar significativa (sospecha herniación)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Códigos de Activación */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-300" />
                  Activación de Códigos de Emergencia Neurológica
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="codeStroke"
                        checked={phase1Data.activationCodes.codeStroke}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({
                          ...prev,
                          activationCodes: { ...prev.activationCodes, codeStroke: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="codeStroke" className="text-white text-sm font-bold">
                        🧠 CÓDIGO ICTUS - Déficit focal agudo
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="codeComa"
                        checked={phase1Data.activationCodes.codeComa}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({
                          ...prev,
                          activationCodes: { ...prev.activationCodes, codeComa: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="codeComa" className="text-white text-sm font-bold">
                        😴 CÓDIGO COMA - Glasgow ≤8
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="codeSeizure"
                        checked={phase1Data.activationCodes.codeSeizure}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({
                          ...prev,
                          activationCodes: { ...prev.activationCodes, codeSeizure: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="codeSeizure" className="text-white text-sm font-bold">
                        ⚡ CÓDIGO CONVULSIVO - Crisis &gt;5 minutos
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Criterios de Emergencia */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-300" />
                  Criterios de Emergencia Neurológica
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-medium text-red-300">🚨 Signos de Alarma Críticos</h5>
                    {Object.entries({
                      herniationSigns: 'Signos de herniación cerebral',
                      statusEpilepticus: 'Status epiléptico (crisis >5min)',
                      acuteStrokeSigns: 'Signos de ictus agudo',
                      meningealSigns: 'Signos meníngeos',
                      intracranialPressure: 'Signos de hipertensión intracraneal'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={phase1Data.emergencyScreening[key as keyof typeof phase1Data.emergencyScreening] as boolean}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({
                            ...prev,
                            emergencyScreening: { ...prev.emergencyScreening, [key]: checked as boolean }
                          }))}
                        />
                        <Label htmlFor={key} className="text-white text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-white">Escala de Glasgow Rápida</h5>
                    
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-center space-y-2">
                        <div className={`text-3xl font-bold ${
                          phase1Data.emergencyScreening.glasgowScore <= 8 ? 'text-red-300' :
                          phase1Data.emergencyScreening.glasgowScore <= 12 ? 'text-yellow-300' : 'text-green-300'
                        }`}>
                          Glasgow: {phase1Data.emergencyScreening.glasgowScore}
                        </div>
                        <div className={`text-sm ${
                          phase1Data.emergencyScreening.glasgowScore <= 8 ? 'text-red-200' :
                          phase1Data.emergencyScreening.glasgowScore <= 12 ? 'text-yellow-200' : 'text-green-200'
                        }`}>
                          {calculatedScales.glasgow?.interpretation}
                        </div>
                        {calculatedScales.glasgow?.intubationRequired && (
                          <div className="text-red-200 text-sm font-bold">
                            ⚠️ INTUBACIÓN REQUERIDA
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FASE 2: ANAMNESIS NEUROLÓGICA DIRIGIDA */}
        {currentPhase === 2 && (
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <User className="h-6 w-6 text-blue-300" />
                FASE 2: Anamnesis Neurológica Dirigida (3-10 minutos)
              </CardTitle>
              <CardDescription className="text-white/70">
                Historia del síntoma principal, antecedentes neurológicos y factores de riesgo vascular
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Historia del síntoma principal */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-300" />
                  Historia del Síntoma Principal
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Motivo de consulta neurológico</Label>
                      <Textarea
                        value={phase2Data.symptomHistory.mainComplaint}
                        onChange={(e) => setPhase2Data(prev => ({
                          ...prev,
                          symptomHistory: { ...prev.symptomHistory, mainComplaint: e.target.value }
                        }))}
                        placeholder="Cefalea, déficit motor, alteración conciencia, crisis convulsiva..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Tiempo de evolución</Label>
                      <Select 
                        value={phase2Data.symptomHistory.timeEvolution} 
                        onValueChange={(value) => setPhase2Data(prev => ({ 
                          ...prev, 
                          symptomHistory: { ...prev.symptomHistory, timeEvolution: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Seleccionar tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hyperacute">Hiperagudo (&lt;1 hora) - URGENTE</SelectItem>
                          <SelectItem value="acute">Agudo (&lt;24 horas) - URGENTE</SelectItem>
                          <SelectItem value="subacute">Subagudo (días-semanas)</SelectItem>
                          <SelectItem value="chronic">Crónico (meses-años)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Patrón temporal</Label>
                      <Select 
                        value={phase2Data.symptomHistory.temporalPattern} 
                        onValueChange={(value) => setPhase2Data(prev => ({ 
                          ...prev, 
                          symptomHistory: { ...prev.symptomHistory, temporalPattern: value }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Patrón del síntoma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sudden">Súbito (cefalea en trueno, ictus)</SelectItem>
                          <SelectItem value="progressive">Progresivo (proceso expansivo)</SelectItem>
                          <SelectItem value="fluctuating">Fluctuante (demencia, delirium)</SelectItem>
                          <SelectItem value="episodic">Episódico (migraña, epilepsia)</SelectItem>
                          <SelectItem value="constant">Constante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Factores desencadenantes/aliviantes</Label>
                      <Textarea
                        value={phase2Data.symptomHistory.triggeringFactors}
                        onChange={(e) => setPhase2Data(prev => ({
                          ...prev,
                          symptomHistory: { ...prev.symptomHistory, triggeringFactors: e.target.value }
                        }))}
                        placeholder="Esfuerzo, cambios posturales, luz, estrés, medicamentos..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Síntomas asociados por sistemas</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Náuseas/vómitos', 'Fiebre', 'Diplopia', 'Disfagia',
                          'Disartria', 'Vértigo', 'Acúfenos', 'Parestesias'
                        ].map(symptom => (
                          <div key={symptom} className="flex items-center space-x-2">
                            <Checkbox 
                              id={symptom}
                              checked={phase2Data.symptomHistory.associatedSymptoms.includes(symptom)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPhase2Data(prev => ({
                                    ...prev,
                                    symptomHistory: {
                                      ...prev.symptomHistory,
                                      associatedSymptoms: [...prev.symptomHistory.associatedSymptoms, symptom]
                                    }
                                  }));
                                } else {
                                  setPhase2Data(prev => ({
                                    ...prev,
                                    symptomHistory: {
                                      ...prev.symptomHistory,
                                      associatedSymptoms: prev.symptomHistory.associatedSymptoms.filter(s => s !== symptom)
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={symptom} className="text-white text-sm">{symptom}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Antecedentes neurológicos estratificados */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-300" />
                  Antecedentes Neurológicos Estratificados
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-purple-300">Enfermedad Cerebrovascular</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="previousStroke"
                        checked={phase2Data.neurologicalHistory.previousStroke}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          neurologicalHistory: { ...prev.neurologicalHistory, previousStroke: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="previousStroke" className="text-white text-sm">Ictus/TIA previos</Label>
                    </div>
                    
                    {phase2Data.neurologicalHistory.previousStroke && (
                      <div className="ml-6 space-y-2">
                        <Input
                          placeholder="Fecha del último ictus/TIA"
                          value={phase2Data.neurologicalHistory.strokeDate}
                          onChange={(e) => setPhase2Data(prev => ({
                            ...prev,
                            neurologicalHistory: { ...prev.neurologicalHistory, strokeDate: e.target.value }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                        <Textarea
                          placeholder="Secuelas neurológicas actuales"
                          value={phase2Data.neurologicalHistory.strokeSequelae}
                          onChange={(e) => setPhase2Data(prev => ({
                            ...prev,
                            neurologicalHistory: { ...prev.neurologicalHistory, strokeSequelae: e.target.value }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          rows={2}
                        />
                      </div>
                    )}

                    <h5 className="font-medium text-purple-300 pt-4">Epilepsia</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="epilepsy"
                        checked={phase2Data.neurologicalHistory.epilepsy}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          neurologicalHistory: { ...prev.neurologicalHistory, epilepsy: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="epilepsy" className="text-white text-sm">Historia de epilepsia</Label>
                    </div>
                    
                    {phase2Data.neurologicalHistory.epilepsy && (
                      <div className="ml-6 space-y-2">
                        <Select 
                          value={phase2Data.neurologicalHistory.epilepsyType} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            neurologicalHistory: { ...prev.neurologicalHistory, epilepsyType: value }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Tipo de epilepsia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="focal">Crisis focales</SelectItem>
                            <SelectItem value="generalized">Crisis generalizadas</SelectItem>
                            <SelectItem value="unknown">Tipo desconocido</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Fecha última crisis"
                          value={phase2Data.neurologicalHistory.lastSeizure}
                          onChange={(e) => setPhase2Data(prev => ({
                            ...prev,
                            neurologicalHistory: { ...prev.neurologicalHistory, lastSeizure: e.target.value }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                        <Select 
                          value={phase2Data.neurologicalHistory.epilepsyControl} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            neurologicalHistory: { ...prev.neurologicalHistory, epilepsyControl: value }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Control actual" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="controlled">Controlada (sin crisis &gt;1 año)</SelectItem>
                            <SelectItem value="partial">Parcialmente controlada</SelectItem>
                            <SelectItem value="uncontrolled">No controlada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-purple-300">Traumatismo Craneal</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="headTrauma"
                        checked={phase2Data.neurologicalHistory.headTrauma}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          neurologicalHistory: { ...prev.neurologicalHistory, headTrauma: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="headTrauma" className="text-white text-sm">Traumatismo craneal previo</Label>
                    </div>
                    
                    {phase2Data.neurologicalHistory.headTrauma && (
                      <div className="ml-6 space-y-2">
                        <Input
                          placeholder="Fecha del traumatismo"
                          value={phase2Data.neurologicalHistory.traumaDate}
                          onChange={(e) => setPhase2Data(prev => ({
                            ...prev,
                            neurologicalHistory: { ...prev.neurologicalHistory, traumaDate: e.target.value }
                          }))}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                        <Select 
                          value={phase2Data.neurologicalHistory.traumaSeverity} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            neurologicalHistory: { ...prev.neurologicalHistory, traumaSeverity: value }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Gravedad del trauma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Leve (GCS 13-15)</SelectItem>
                            <SelectItem value="moderate">Moderado (GCS 9-12)</SelectItem>
                            <SelectItem value="severe">Severo (GCS ≤8)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <h5 className="font-medium text-purple-300 pt-4">Enfermedades Neurodegenerativas</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="neurodegenerative"
                        checked={phase2Data.neurologicalHistory.neurodegenerative}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          neurologicalHistory: { ...prev.neurologicalHistory, neurodegenerative: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="neurodegenerative" className="text-white text-sm">Enfermedad neurodegenerativa</Label>
                    </div>
                    
                    {phase2Data.neurologicalHistory.neurodegenerative && (
                      <div className="ml-6 space-y-2">
                        <Select 
                          value={phase2Data.neurologicalHistory.neurodegenerativeType} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            neurologicalHistory: { ...prev.neurologicalHistory, neurodegenerativeType: value }
                          }))}
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Tipo de enfermedad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alzheimer">Enfermedad de Alzheimer</SelectItem>
                            <SelectItem value="parkinson">Enfermedad de Parkinson</SelectItem>
                            <SelectItem value="multiple-sclerosis">Esclerosis múltiple</SelectItem>
                            <SelectItem value="als">Esclerosis lateral amiotrófica</SelectItem>
                            <SelectItem value="huntington">Enfermedad de Huntington</SelectItem>
                            <SelectItem value="other">Otra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Factores de riesgo vascular cerebral */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  Factores de Riesgo Vascular Cerebral
                </h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries({
                    hypertension: 'Hipertensión arterial',
                    diabetes: 'Diabetes mellitus',
                    dyslipidemia: 'Dislipidemia',
                    atrialFibrillation: 'Fibrilación auricular',
                    smoking: 'Tabaquismo activo',
                    alcohol: 'Alcoholismo',
                    anticoagulants: 'Anticoagulantes',
                    antiplatelets: 'Antiagregantes'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={phase2Data.vascularRiskFactors[key as keyof typeof phase2Data.vascularRiskFactors] as boolean}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          vascularRiskFactors: { ...prev.vascularRiskFactors, [key]: checked as boolean }
                        }))}
                      />
                      <Label htmlFor={key} className="text-white text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluación funcional previa */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-300" />
                  Evaluación Funcional Previa
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Escala de Rankin modificada basal</Label>
                    <Select 
                      value={phase2Data.functionalAssessment.modifiedRankinBaseline.toString()} 
                      onValueChange={(value) => setPhase2Data(prev => ({ 
                        ...prev, 
                        functionalAssessment: { ...prev.functionalAssessment, modifiedRankinBaseline: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - Sin síntomas</SelectItem>
                        <SelectItem value="1">1 - Sin discapacidad significativa</SelectItem>
                        <SelectItem value="2">2 - Discapacidad leve</SelectItem>
                        <SelectItem value="3">3 - Discapacidad moderada</SelectItem>
                        <SelectItem value="4">4 - Discapacidad moderada-severa</SelectItem>
                        <SelectItem value="5">5 - Discapacidad severa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="independentADL"
                        checked={phase2Data.functionalAssessment.independentADL}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({
                          ...prev,
                          functionalAssessment: { ...prev.functionalAssessment, independentADL: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="independentADL" className="text-white text-sm">
                        Independiente para AVD
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Estado cognitivo previo</Label>
                    <Select 
                      value={phase2Data.functionalAssessment.previousCognition} 
                      onValueChange={(value) => setPhase2Data(prev => ({ 
                        ...prev, 
                        functionalAssessment: { ...prev.functionalAssessment, previousCognition: value }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Cognición previa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="mci">Deterioro cognitivo leve</SelectItem>
                        <SelectItem value="dementia">Demencia establecida</SelectItem>
                        <SelectItem value="unknown">Desconocido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FASE 3: EXAMEN NEUROLÓGICO SISTEMÁTICO */}
        {currentPhase === 3 && (
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Search className="h-6 w-6 text-green-300" />
                FASE 3: Examen Neurológico Sistemático (10-20 minutos)
              </CardTitle>
              <CardDescription className="text-white/70">
                Evaluación completa de conciencia, pares craneales, sistemas motor y sensitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Glasgow Coma Scale detallada */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-300" />
                  Escala de Glasgow Detallada
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Apertura ocular</Label>
                    <Select 
                      value={phase3Data.consciousnessExpanded.glasgowEye.toString()} 
                      onValueChange={(value) => setPhase3Data(prev => ({ 
                        ...prev, 
                        consciousnessExpanded: { ...prev.consciousnessExpanded, glasgowEye: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 - Espontánea</SelectItem>
                        <SelectItem value="3">3 - Al estímulo verbal</SelectItem>
                        <SelectItem value="2">2 - Al dolor</SelectItem>
                        <SelectItem value="1">1 - No abre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Respuesta verbal</Label>
                    <Select 
                      value={phase3Data.consciousnessExpanded.glasgowVerbal.toString()} 
                      onValueChange={(value) => setPhase3Data(prev => ({ 
                        ...prev, 
                        consciousnessExpanded: { ...prev.consciousnessExpanded, glasgowVerbal: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 - Orientada</SelectItem>
                        <SelectItem value="4">4 - Confusa</SelectItem>
                        <SelectItem value="3">3 - Inapropiada</SelectItem>
                        <SelectItem value="2">2 - Incomprensible</SelectItem>
                        <SelectItem value="1">1 - No responde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Respuesta motora</Label>
                    <Select 
                      value={phase3Data.consciousnessExpanded.glasgowMotor.toString()} 
                      onValueChange={(value) => setPhase3Data(prev => ({ 
                        ...prev, 
                        consciousnessExpanded: { ...prev.consciousnessExpanded, glasgowMotor: parseInt(value) }
                      }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 - Obedece órdenes</SelectItem>
                        <SelectItem value="5">5 - Localiza dolor</SelectItem>
                        <SelectItem value="4">4 - Flexión normal</SelectItem>
                        <SelectItem value="3">3 - Flexión anormal</SelectItem>
                        <SelectItem value="2">2 - Extensión</SelectItem>
                        <SelectItem value="1">1 - No responde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    calculatedScales.glasgow && calculatedScales.glasgow.score <= 8 ? 'text-red-300' :
                    calculatedScales.glasgow && calculatedScales.glasgow.score <= 12 ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    Glasgow Total: {calculatedScales.glasgow?.score || 0}
                  </div>
                  <div className="text-white/70 text-sm mt-2">
                    {calculatedScales.glasgow?.interpretation}
                  </div>
                </div>
              </div>

              {/* Sistema Motor */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-300" />
                  Sistema Motor (Escala MRC 0-5)
                </h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries({
                    leftArmStrength: 'Brazo izquierdo',
                    rightArmStrength: 'Brazo derecho', 
                    leftLegStrength: 'Pierna izquierda',
                    rightLegStrength: 'Pierna derecha'
                  }).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-white text-sm">{label}</Label>
                      <Select 
                        value={phase3Data.motorSystem[key as keyof typeof phase3Data.motorSystem].toString()}
                        onValueChange={(value) => setPhase3Data(prev => ({ 
                          ...prev, 
                          motorSystem: { ...prev.motorSystem, [key]: parseInt(value) }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5/5 - Normal</SelectItem>
                          <SelectItem value="4">4/5 - Buena (vence resistencia)</SelectItem>
                          <SelectItem value="3">3/5 - Regular (vence gravedad)</SelectItem>
                          <SelectItem value="2">2/5 - Mala (movimiento sin gravedad)</SelectItem>
                          <SelectItem value="1">1/5 - Vestigios</SelectItem>
                          <SelectItem value="0">0/5 - Ausente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FASE 4: ESCALAS NEUROLÓGICAS DIRIGIDAS */}
        {currentPhase === 4 && (
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Calculator className="h-6 w-6 text-yellow-300" />
                FASE 4: Escalas Neurológicas Dirigidas por Sospecha (5-15 minutos)
              </CardTitle>
              <CardDescription className="text-white/70">
                Aplicación automática de escalas especializadas según la sospecha diagnóstica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* NIHSS */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-red-300" />
                  NIHSS - National Institutes of Health Stroke Scale
                </h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries({
                    consciousness: { label: 'Nivel de conciencia', max: 3 },
                    gaze: { label: 'Mirada conjugada', max: 2 },
                    visual: { label: 'Campos visuales', max: 3 },
                    facialPalsy: { label: 'Parálisis facial', max: 3 },
                    leftArm: { label: 'Motor brazo izq', max: 4 },
                    rightArm: { label: 'Motor brazo der', max: 4 },
                    leftLeg: { label: 'Motor pierna izq', max: 4 },
                    rightLeg: { label: 'Motor pierna der', max: 4 },
                    limbAtaxia: { label: 'Ataxia extremidades', max: 2 },
                    sensory: { label: 'Sensibilidad', max: 2 },
                    language: { label: 'Lenguaje', max: 3 },
                    dysarthria: { label: 'Disartria', max: 2 },
                    extinction: { label: 'Extinción/negligencia', max: 2 }
                  }).map(([key, config]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-white text-sm">{config.label}</Label>
                      <Select 
                        value={phase4Data.nihssComponents[key as keyof typeof phase4Data.nihssComponents].toString()}
                        onValueChange={(value) => setPhase4Data(prev => ({ 
                          ...prev, 
                          nihssComponents: { ...prev.nihssComponents, [key]: parseInt(value) }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: config.max + 1 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="text-center backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className={`text-3xl font-bold ${
                    calculatedScales.nihss && calculatedScales.nihss.score >= 15 ? 'text-red-300' :
                    calculatedScales.nihss && calculatedScales.nihss.score >= 5 ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    NIHSS Total: {calculatedScales.nihss?.score || 0}
                  </div>
                  <div className="text-white/70 text-sm mt-2">
                    {calculatedScales.nihss?.interpretation}
                  </div>
                  <div className="text-white/70 text-sm">
                    {calculatedScales.nihss?.thrombolysisEligible ? '✅ Elegible para trombolisis' : '❌ No elegible para trombolisis'}
                  </div>
                </div>
              </div>

              {/* Canadian CT Head Rule */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-blue-300" />
                  Canadian CT Head Rule (Traumatismo Craneal)
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-red-300">Criterios de Alto Riesgo</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="suspectedOpenSkullFracture"
                        checked={phase4Data.canadianCTCriteria.suspectedOpenSkullFracture}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, suspectedOpenSkullFracture: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="suspectedOpenSkullFracture" className="text-white text-sm">
                        Sospecha fractura abierta
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="signOfBasilarFracture"
                        checked={phase4Data.canadianCTCriteria.signOfBasilarFracture}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, signOfBasilarFracture: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="signOfBasilarFracture" className="text-white text-sm">
                        Signos de fractura basilar
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Episodios de vómito</Label>
                      <Input
                        type="number"
                        min="0"
                        value={phase4Data.canadianCTCriteria.vomitingEpisodes}
                        onChange={(e) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, vomitingEpisodes: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age65Plus"
                        checked={phase4Data.canadianCTCriteria.age65Plus}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, age65Plus: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="age65Plus" className="text-white text-sm">Edad ≥65 años</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-yellow-300">Criterios de Riesgo Medio</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="amnesia30min"
                        checked={phase4Data.canadianCTCriteria.amnesia30min}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, amnesia30min: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="amnesia30min" className="text-white text-sm">
                        Amnesia anterógrada ≥30 min
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dangerousMechanism"
                        checked={phase4Data.canadianCTCriteria.dangerousMechanism}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          canadianCTCriteria: { ...prev.canadianCTCriteria, dangerousMechanism: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="dangerousMechanism" className="text-white text-sm">
                        Mecanismo peligroso
                      </Label>
                    </div>

                    <div className="text-center backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className={`text-lg font-bold ${
                        calculatedScales.canadianCT?.recommendation === 'ct-required' ? 'text-red-300' :
                        calculatedScales.canadianCT?.recommendation === 'consider-ct' ? 'text-yellow-300' : 'text-green-300'
                      }`}>
                        {calculatedScales.canadianCT?.recommendation === 'ct-required' ? '🚨 TC URGENTE' :
                         calculatedScales.canadianCT?.recommendation === 'consider-ct' ? '⚠️ CONSIDERAR TC' :
                         '✅ TC NO INDICADA'}
                      </div>
                      <div className="text-white/70 text-sm mt-2">
                        {calculatedScales.canadianCT?.interpretation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ABCD² Score para TIA */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-300" />
                  ABCD² Score - Riesgo de Ictus post-TIA
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age60Plus"
                        checked={phase4Data.abcd2Factors.age60Plus}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          abcd2Factors: { ...prev.abcd2Factors, age60Plus: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="age60Plus" className="text-white text-sm">Edad ≥60 años (1 punto)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bloodPressure"
                        checked={phase4Data.abcd2Factors.bloodPressure}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          abcd2Factors: { ...prev.abcd2Factors, bloodPressure: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="bloodPressure" className="text-white text-sm">PA ≥140/90 (1 punto)</Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Características clínicas</Label>
                      <Select 
                        value={phase4Data.abcd2Factors.clinicalFeatures} 
                        onValueChange={(value) => setPhase4Data(prev => ({ 
                          ...prev, 
                          abcd2Factors: { ...prev.abcd2Factors, clinicalFeatures: value as 'none' | 'speech' | 'motor' }
                        }))}
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguna (0 puntos)</SelectItem>
                          <SelectItem value="speech">Solo alteración del habla (1 punto)</SelectItem>
                          <SelectItem value="motor">Déficit motor (2 puntos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Duración de síntomas (minutos)</Label>
                      <Input
                        type="number"
                        value={phase4Data.abcd2Factors.duration}
                        onChange={(e) => setPhase4Data(prev => ({
                          ...prev,
                          abcd2Factors: { ...prev.abcd2Factors, duration: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/5 border-white/20 text-white"
                      />
                      <div className="text-xs text-white/60">
                        ≥60 min: 2 puntos | 10-59 min: 1 punto | &lt;10 min: 0 puntos
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="diabetes"
                        checked={phase4Data.abcd2Factors.diabetes}
                        onCheckedChange={(checked) => setPhase4Data(prev => ({
                          ...prev,
                          abcd2Factors: { ...prev.abcd2Factors, diabetes: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="diabetes" className="text-white text-sm">Diabetes mellitus (1 punto)</Label>
                    </div>

                    <div className="text-center backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className={`text-2xl font-bold ${
                        calculatedScales.abcd2 && calculatedScales.abcd2.score >= 4 ? 'text-red-300' :
                        calculatedScales.abcd2 && calculatedScales.abcd2.score >= 2 ? 'text-yellow-300' : 'text-green-300'
                      }`}>
                        ABCD² Score: {calculatedScales.abcd2?.score || 0}
                      </div>
                      <div className="text-white/70 text-sm mt-2">
                        {calculatedScales.abcd2?.interpretation}
                      </div>
                      <div className="text-white/70 text-xs">
                        Riesgo ictus 48h: {calculatedScales.abcd2?.strokeRisk48h}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FASE 5: SÍNTESIS NEUROLÓGICA Y DECISIONES */}
        {currentPhase === 5 && (
          <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-300" />
                FASE 5: Síntesis Neurológica y Decisiones (2-5 minutos)
              </CardTitle>
              <CardDescription className="text-white/70">
                Correlación anatomoclínica automática y algoritmos de decisión integrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Resumen de escalas calculadas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-300" />
                    Resumen de Escalas Neurológicas
                  </h4>
                  
                  <div className="space-y-3">
                    {calculatedScales.glasgow && (
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">Glasgow Coma Scale</span>
                        <Badge className={`${
                          calculatedScales.glasgow.score <= 8 ? 'bg-red-600' :
                          calculatedScales.glasgow.score <= 12 ? 'bg-yellow-600' : 'bg-green-600'
                        } text-white`}>
                          {calculatedScales.glasgow.score}
                        </Badge>
                      </div>
                    )}
                    
                    {calculatedScales.nihss && (
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">NIHSS</span>
                        <Badge className={`${
                          calculatedScales.nihss.score >= 15 ? 'bg-red-600' :
                          calculatedScales.nihss.score >= 5 ? 'bg-yellow-600' : 'bg-green-600'
                        } text-white`}>
                          {calculatedScales.nihss.score}
                        </Badge>
                      </div>
                    )}
                    
                    {calculatedScales.abcd2 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">ABCD² Score</span>
                        <Badge className={`${
                          calculatedScales.abcd2.score >= 4 ? 'bg-red-600' :
                          calculatedScales.abcd2.score >= 2 ? 'bg-yellow-600' : 'bg-green-600'
                        } text-white`}>
                          {calculatedScales.abcd2.score}
                        </Badge>
                      </div>
                    )}
                    
                    {calculatedScales.huntHess && (
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">Hunt-Hess Grade</span>
                        <Badge className={`${
                          calculatedScales.huntHess.grade >= 4 ? 'bg-red-600' :
                          calculatedScales.huntHess.grade >= 3 ? 'bg-yellow-600' : 'bg-green-600'
                        } text-white`}>
                          Grado {calculatedScales.huntHess.grade}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-300" />
                    Validación Cruzada Neurológica
                  </h4>
                  
                  <div className="space-y-3">
                    {crossValidation.anatomicalCorrelations.map((correlation, index) => (
                      <div key={index} className={`p-3 rounded border-l-4 ${
                        correlation.consistency === 'consistent' ? 'border-green-400 bg-green-900/20' : 'border-red-400 bg-red-900/20'
                      }`}>
                        <div className="text-white text-sm font-medium">{correlation.finding}</div>
                        <div className="text-white/70 text-xs">{correlation.location}</div>
                        <div className="text-white/60 text-xs">{correlation.confidence}</div>
                      </div>
                    ))}
                    
                    {crossValidation.clinicalInconsistencies.map((inconsistency, index) => (
                      <div key={index} className="p-3 rounded border-l-4 border-yellow-400 bg-yellow-900/20">
                        <div className="text-white text-sm font-medium">{inconsistency.type}</div>
                        <div className="text-white/70 text-xs">{inconsistency.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pistas diagnósticas */}
              <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-300" />
                  Pistas Diagnósticas Neurológicas
                </h4>
                
                {crossValidation.diagnosticClues.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {crossValidation.diagnosticClues.map((clue, index) => (
                      <div key={index} className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                        <h5 className="font-medium text-white mb-2">{clue.syndrome}</h5>
                        <div className="text-green-300 text-sm mb-2">Probabilidad: {clue.likelihood}</div>
                        <div className="text-white/70 text-sm mb-2">
                          <strong>Hallazgos clave:</strong> {clue.keyFindings.join(', ')}
                        </div>
                        <div className="text-blue-300 text-sm">
                          <strong>Recomendación:</strong> {clue.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-4">
                    No se han identificado síndromes neurológicos específicos con la información actual
                  </div>
                )}
              </div>

              {/* Trombolisis eligibility */}
              {calculatedScales.thrombolysis && (
                <div className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-red-300" />
                    Evaluación de Trombolisis
                  </h4>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${
                      calculatedScales.thrombolysis.eligible ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {calculatedScales.thrombolysis.eligible ? '✅ ELEGIBLE' : '❌ NO ELEGIBLE'}
                    </div>
                    <div className="text-white text-lg mb-2">
                      Ventana: {calculatedScales.thrombolysis.window}
                    </div>
                    <div className="text-white/70 text-sm">
                      {calculatedScales.thrombolysis.recommendation}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Botones de navegación */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentPhase(Math.max(1, currentPhase - 1))}
            disabled={currentPhase === 1}
            variant="outline"
            className="bg-white/10 text-white hover:bg-white/20"
          >
            Fase Anterior
          </Button>
          
          {currentPhase === 5 ? (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Finalizar Evaluación Neurológica
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentPhase(Math.min(5, currentPhase + 1))}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Siguiente Fase
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedNeurologiaForm;