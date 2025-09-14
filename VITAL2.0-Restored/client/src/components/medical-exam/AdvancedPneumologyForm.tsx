import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wind, 
  Calculator, 
  AlertTriangle,
  Activity,
  Stethoscope,
  ClipboardCheck,
  TrendingUp,
  Gauge,
  Timer,
  Eye,
  Hand,
  Volume2,
  Heart,
  BarChart3,
  Target,
  Zap,
  Search
} from "lucide-react";

interface AdvancedPneumologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

export default function AdvancedPneumologyForm({
  patientData,
  onDataChange,
  onComplete
}: AdvancedPneumologyFormProps) {
  // Estados organizados por fase del protocolo clínico integrado
  const [phase1Data, setPhase1Data] = useState({
    anamnesis: {
      mainComplaint: "",
      currentIllness: "",
      smokingHistory: {
        status: "",
        packsPerDay: 0,
        yearsSmoked: 0,
        packYears: 0
      },
      respiratoryHistory: {
        asthma: false,
        copd: false,
        pneumonia: false,
        tuberculosis: false,
        pulmonaryEmbolism: false,
        pleuralDisease: false
      },
      symptoms: {
        dyspnea: false,
        dyspneaOnExertion: false,
        orthopnea: false,
        paroxysmalNocturnal: false,
        cough: false,
        sputum: false,
        hemoptysis: false,
        chestPain: false,
        wheezing: false
      }
    },
    generalInspection: {
      consciousness: "",
      generalState: "",
      respiratoryDistress: false,
      speakingDifficulty: false,
      tripodPosition: false,
      audibleSounds: {
        wheezing: false,
        stridor: false,
        other: ""
      }
    },
    vitalSigns: {
      respiratoryRate: 0,
      oxygenSaturation: 0,
      heartRate: 0,
      bloodPressure: { systolic: 0, diastolic: 0 }
    },
    extremitiesHead: {
      clubbing: false,
      peripheralCyanosis: false,
      centralCyanosis: false,
      nasalFlaring: false
    },
    neckInspection: {
      accessoryMuscles: false,
      tracheaCentered: true,
      jugularVenousDistention: false
    }
  });

  const [phase2Data, setPhase2Data] = useState({
    posteriorThorax: {
      regions: {
        rightApex: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftApex: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightUpper: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftUpper: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightMiddle: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftMiddle: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightLower: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftLower: { inspection: "", palpation: "", percussion: "", auscultation: "" }
      },
      globalInspection: {
        chestSymmetry: true,
        respiratoryMovements: true,
        paradoxicalMovement: false
      },
      globalPalpation: {
        apicalExpansion: "",
        baseExpansion: "",
        tactilevocalFremitus: {
          rightSide: "",
          leftSide: "",
          comparative: ""
        }
      },
      globalPercussion: {
        generalSonority: "",
        diaphragmaticExcursion: 0
      },
      globalAuscultation: {
        vesicularMurmur: "",
        adventiciousSounds: {
          crackles: false,
          wheezes: false,
          rhonchi: false,
          pleuralFriction: false
        },
        voiceSounds: {
          bronchophony: false,
          egophony: false,
          whispered: false
        }
      }
    }
  });

  const [phase3Data, setPhase3Data] = useState({
    anteriorThorax: {
      regions: {
        rightApex: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftApex: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightUpper: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftUpper: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightMiddle: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftMiddle: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        rightLower: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftLower: { inspection: "", palpation: "", percussion: "", auscultation: "" }
      },
      axillaryRegions: {
        rightAxilla: { inspection: "", palpation: "", percussion: "", auscultation: "" },
        leftAxilla: { inspection: "", palpation: "", percussion: "", auscultation: "" }
      },
      globalInspection: {
        symmetry: true,
        accessoryMuscles: false,
        breathing: ""
      },
      hepaticDullness: true,
      gastricTympany: true
    },
    cardiovascularIntegration: {
      heartSounds: {
        s1: "",
        s2: "",
        murmurs: false,
        extraSounds: false
      },
      cardiacRhythm: "",
      heartRate: 0,
      bloodPressure: ""
    }
  });

  const [phase4Data, setPhase4Data] = useState({
    functionalTests: {
      spirometry: {
        fvc: 0,
        fev1: 0,
        fev1fvc: 0,
        pef: 0
      },
      walkTest: {
        distance: 0,
        finalSaturation: 0,
        dyspnea: 0
      }
    },
    scales: {
      mMRC: {
        score: 0,
        description: ""
      },
      cat: {
        cough: 0,
        phlegm: 0,
        chestTightness: 0,
        breathlessness: 0,
        activities: 0,
        confidence: 0,
        sleep: 0,
        energy: 0,
        totalScore: 0
      },
      bode: {
        bmi: 0,
        fev1: 0,
        mMRC: 0,
        walkTest: 0,
        totalScore: 0
      }
    },
    diagnosticSynthesis: {
      primaryImpression: "",
      differentialDiagnosis: "",
      managementPlan: ""
    }
  });

  // Cálculos automáticos
  const calculatePackYears = () => {
    const { packsPerDay, yearsSmoked } = phase1Data.anamnesis.smokingHistory;
    const packYears = packsPerDay * yearsSmoked;
    setPhase1Data(prev => ({
      ...prev,
      anamnesis: {
        ...prev.anamnesis,
        smokingHistory: { ...prev.anamnesis.smokingHistory, packYears }
      }
    }));
  };

  useEffect(() => {
    calculatePackYears();
  }, [phase1Data.anamnesis.smokingHistory.packsPerDay, phase1Data.anamnesis.smokingHistory.yearsSmoked]);

  const calculateCATScore = () => {
    const { cat } = phase4Data.scales;
    const totalScore = cat.cough + cat.phlegm + cat.chestTightness + cat.breathlessness + 
                       cat.activities + cat.confidence + cat.sleep + cat.energy;
    setPhase4Data(prev => ({
      ...prev,
      scales: {
        ...prev.scales,
        cat: { ...prev.scales.cat, totalScore }
      }
    }));
  };

  useEffect(() => {
    calculateCATScore();
  }, [
    phase4Data.scales.cat.cough,
    phase4Data.scales.cat.phlegm,
    phase4Data.scales.cat.chestTightness,
    phase4Data.scales.cat.breathlessness,
    phase4Data.scales.cat.activities,
    phase4Data.scales.cat.confidence,
    phase4Data.scales.cat.sleep,
    phase4Data.scales.cat.energy
  ]);

  const calculateBODEScore = () => {
    const { bode } = phase4Data.scales;
    let score = 0;
    
    // BMI scoring
    if (bode.bmi <= 21) score += 1;
    
    // FEV1 scoring
    if (bode.fev1 >= 65) score += 0;
    else if (bode.fev1 >= 50) score += 1;
    else if (bode.fev1 >= 36) score += 2;
    else score += 3;
    
    // mMRC scoring
    if (bode.mMRC >= 2) score += 1;
    
    // Walk test scoring
    if (bode.walkTest < 150) score += 3;
    else if (bode.walkTest < 250) score += 2;
    else if (bode.walkTest < 350) score += 1;
    
    setPhase4Data(prev => ({
      ...prev,
      scales: {
        ...prev.scales,
        bode: { ...prev.scales.bode, totalScore: score }
      }
    }));
  };

  const handleComplete = () => {
    const completeData = {
      phase1: phase1Data,
      phase2: phase2Data,
      phase3: phase3Data,
      phase4: phase4Data,
      calculations: {
        packYears: phase1Data.anamnesis.smokingHistory.packYears,
        catScore: phase4Data.scales.cat.totalScore,
        bodeScore: phase4Data.scales.bode.totalScore
      }
    };
    
    if (onComplete) {
      onComplete(completeData);
    }
  };

  const renderRegionalExam = (regionName: string, regionData: any, setRegionData: (fn: (prev: any) => any) => void, regionKey: string) => (
    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
      <h5 className="font-medium text-white text-sm">{regionName}</h5>
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label className="text-white text-xs">I-P-P-A Integrado</Label>
          <Select 
            value={regionData.inspection} 
            onValueChange={(value) => setRegionData(prev => ({ 
              ...prev, 
              [regionKey]: { ...prev[regionKey], inspection: value }
            }))}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
              <SelectValue placeholder="Hallazgos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="disminucion-amplexion">Disminución amplexión</SelectItem>
              <SelectItem value="fremito-aumentado">Frémito aumentado</SelectItem>
              <SelectItem value="fremito-disminuido">Frémito disminuido</SelectItem>
              <SelectItem value="matidez">Matidez</SelectItem>
              <SelectItem value="hipersonoridad">Hipersonoridad</SelectItem>
              <SelectItem value="murmullo-disminuido">Murmullo disminuido</SelectItem>
              <SelectItem value="murmullo-abolido">Murmullo abolido</SelectItem>
              <SelectItem value="crepitantes">Crepitantes</SelectItem>
              <SelectItem value="sibilancias">Sibilancias</SelectItem>
              <SelectItem value="roncus">Roncus</SelectItem>
              <SelectItem value="roce-pleural">Roce pleural</SelectItem>
              <SelectItem value="broncofonía">Broncofonía</SelectItem>
              <SelectItem value="soplo-tubárico">Soplo tubárico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-3">
            <Wind className="h-10 w-10 text-blue-300" />
            <h1 className="text-4xl font-bold text-white">Exploración Neumológica Integrada</h1>
          </div>
          <p className="text-white/80 text-lg">Protocolo clínico optimizado por regiones anatómicas I-P-P-A</p>
          {patientData && (
            <div className="mt-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-900 rounded-lg p-3 shadow justify-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{patientData.name} {patientData.surname}</span>
                <span>Edad: {patientData.age} años</span>
                <span>Género: {patientData.gender}</span>
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <Badge className="bg-emerald-500/30 text-white border border-white/20">Fase 1: Anamnesis-General</Badge>
            <Badge className="bg-blue-500/30 text-white border border-white/20">Fase 2: Tórax Posterior</Badge>
            <Badge className="bg-orange-500/30 text-white border border-white/20">Fase 3: Tórax Anterior</Badge>
            <Badge className="bg-purple-500/30 text-white border border-white/20">Fase 4: Síntesis-Escalas</Badge>
          </div>
        </div>

        {/* FASE 1: ANAMNESIS Y EVALUACIÓN GENERAL (PACIENTE SENTADO) */}
        <Card data-testid="card-fase-1" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-emerald-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-6 w-6 text-emerald-300" />
              Fase 1: Anamnesis y Evaluación General (Paciente Sentado)
              <Badge className="ml-auto bg-emerald-200/30 text-white border border-white/20">
                Inspección General Crítica
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Anamnesis Dirigida */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-emerald-300" />
                  Anamnesis Dirigida
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Queja Principal</Label>
                      <Input
                        value={phase1Data.anamnesis.mainComplaint}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          anamnesis: { ...prev.anamnesis, mainComplaint: e.target.value }
                        }))}
                        placeholder="Síntoma respiratorio principal"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Enfermedad Actual</Label>
                      <Input
                        value={phase1Data.anamnesis.currentIllness}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          anamnesis: { ...prev.anamnesis, currentIllness: e.target.value }
                        }))}
                        placeholder="Evolución temporal y características"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Historia Tabáquica</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Estado</Label>
                        <Select 
                          value={phase1Data.anamnesis.smokingHistory.status} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              smokingHistory: { ...prev.anamnesis.smokingHistory, status: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">Nunca fumó</SelectItem>
                            <SelectItem value="former">Ex-fumador</SelectItem>
                            <SelectItem value="current">Fumador activo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Paquetes/día</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={phase1Data.anamnesis.smokingHistory.packsPerDay || ''}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              smokingHistory: { ...prev.anamnesis.smokingHistory, packsPerDay: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="1.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Años fumando</Label>
                        <Input
                          type="number"
                          value={phase1Data.anamnesis.smokingHistory.yearsSmoked || ''}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              smokingHistory: { ...prev.anamnesis.smokingHistory, yearsSmoked: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="20"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-white font-medium">
                        Paquetes-año: {phase1Data.anamnesis.smokingHistory.packYears}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h4 className="font-medium text-white">Antecedentes Respiratorios</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(phase1Data.anamnesis.respiratoryHistory).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              respiratoryHistory: { 
                                ...prev.anamnesis.respiratoryHistory, 
                                [key]: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor={key} className="text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h4 className="font-medium text-white">Síntomas Respiratorios</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(phase1Data.anamnesis.symptoms).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              symptoms: { 
                                ...prev.anamnesis.symptoms, 
                                [key]: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor={key} className="text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Inspección General - PASO CRÍTICO OMITIDO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-300" />
                  Inspección General - PASO CRÍTICO INICIAL
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Observación a Distancia</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Estado de conciencia</Label>
                        <Select 
                          value={phase1Data.generalInspection.consciousness} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalInspection: { ...prev.generalInspection, consciousness: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Conciencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alerta">Alerta</SelectItem>
                            <SelectItem value="somnoliento">Somnoliento</SelectItem>
                            <SelectItem value="estuporoso">Estuporoso</SelectItem>
                            <SelectItem value="comatoso">Comatoso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="respiratory-distress"
                          checked={phase1Data.generalInspection.respiratoryDistress}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalInspection: { ...prev.generalInspection, respiratoryDistress: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="respiratory-distress" className="text-white">Dificultad respiratoria evidente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="speaking-difficulty"
                          checked={phase1Data.generalInspection.speakingDifficulty}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalInspection: { ...prev.generalInspection, speakingDifficulty: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="speaking-difficulty" className="text-white">Habla en frases cortas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tripod-position"
                          checked={phase1Data.generalInspection.tripodPosition}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalInspection: { ...prev.generalInspection, tripodPosition: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="tripod-position" className="text-white">Posición en trípode</Label>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Signos Vitales Clave</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">FR (respiraciones/min)</Label>
                        <Input
                          type="number"
                          value={phase1Data.vitalSigns.respiratoryRate || ''}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            vitalSigns: { ...prev.vitalSigns, respiratoryRate: Number(e.target.value) }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="16"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Saturación O₂ (%)</Label>
                        <Input
                          type="number"
                          value={phase1Data.vitalSigns.oxygenSaturation || ''}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            vitalSigns: { ...prev.vitalSigns, oxygenSaturation: Number(e.target.value) }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="98"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-white text-xs">TA Sistólica</Label>
                          <Input
                            type="number"
                            value={phase1Data.vitalSigns.bloodPressure.systolic || ''}
                            onChange={(e) => setPhase1Data(prev => ({ 
                              ...prev, 
                              vitalSigns: { 
                                ...prev.vitalSigns, 
                                bloodPressure: { 
                                  ...prev.vitalSigns.bloodPressure, 
                                  systolic: Number(e.target.value) 
                                }
                              }
                            }))}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="120"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-white text-xs">TA Diastólica</Label>
                          <Input
                            type="number"
                            value={phase1Data.vitalSigns.bloodPressure.diastolic || ''}
                            onChange={(e) => setPhase1Data(prev => ({ 
                              ...prev, 
                              vitalSigns: { 
                                ...prev.vitalSigns, 
                                bloodPressure: { 
                                  ...prev.vitalSigns.bloodPressure, 
                                  diastolic: Number(e.target.value) 
                                }
                              }
                            }))}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="80"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">Contar FR un minuto completo</p>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Extremidades y Cabeza</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="clubbing"
                          checked={phase1Data.extremitiesHead.clubbing}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            extremitiesHead: { ...prev.extremitiesHead, clubbing: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="clubbing" className="text-white">Acropaquias (dedos en palillo)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="peripheral-cyanosis"
                          checked={phase1Data.extremitiesHead.peripheralCyanosis}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            extremitiesHead: { ...prev.extremitiesHead, peripheralCyanosis: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="peripheral-cyanosis" className="text-white">Cianosis periférica (lechos ungueales)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="central-cyanosis"
                          checked={phase1Data.extremitiesHead.centralCyanosis}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            extremitiesHead: { ...prev.extremitiesHead, centralCyanosis: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="central-cyanosis" className="text-white">Cianosis central (labios, lengua)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="nasal-flaring"
                          checked={phase1Data.extremitiesHead.nasalFlaring}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            extremitiesHead: { ...prev.extremitiesHead, nasalFlaring: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="nasal-flaring" className="text-white">Aleteo nasal</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h4 className="font-medium text-white">Inspección del Cuello</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="accessory-muscles"
                        checked={phase1Data.neckInspection.accessoryMuscles}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                          ...prev, 
                          neckInspection: { ...prev.neckInspection, accessoryMuscles: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="accessory-muscles" className="text-white">Músculos accesorios (ECM, escalenos)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trachea-centered"
                        checked={phase1Data.neckInspection.tracheaCentered}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                          ...prev, 
                          neckInspection: { ...prev.neckInspection, tracheaCentered: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="trachea-centered" className="text-white">Tráquea centrada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="jugular-distention"
                        checked={phase1Data.neckInspection.jugularVenousDistention}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                          ...prev, 
                          neckInspection: { ...prev.neckInspection, jugularVenousDistention: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="jugular-distention" className="text-white">Ingurgitación yugular</Label>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <h4 className="font-medium text-white">Sonidos Audibles a Distancia</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="audible-wheezing"
                        checked={phase1Data.generalInspection.audibleSounds.wheezing}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                          ...prev, 
                          generalInspection: { 
                            ...prev.generalInspection, 
                            audibleSounds: { ...prev.generalInspection.audibleSounds, wheezing: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="audible-wheezing" className="text-white">Sibilancias audibles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="audible-stridor"
                        checked={phase1Data.generalInspection.audibleSounds.stridor}
                        onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                          ...prev, 
                          generalInspection: { 
                            ...prev.generalInspection, 
                            audibleSounds: { ...prev.generalInspection.audibleSounds, stridor: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="audible-stridor" className="text-white">Estridor</Label>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Otros sonidos</Label>
                      <Input
                        value={phase1Data.generalInspection.audibleSounds.other}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          generalInspection: { 
                            ...prev.generalInspection, 
                            audibleSounds: { ...prev.generalInspection.audibleSounds, other: e.target.value }
                          }
                        }))}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="Descripción"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 2: EXAMEN DEL TÓRAX POSTERIOR Y LATERAL (PACIENTE SENTADO, BRAZOS CRUZADOS) */}
        <Card data-testid="card-fase-2" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-blue-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Hand className="h-6 w-6 text-blue-300" />
              Fase 2: Examen del Tórax Posterior y Lateral (Sentado, Brazos Cruzados)
              <Badge className="ml-auto bg-blue-200/30 text-white border border-white/20">
                Mayor Rendimiento Diagnóstico - I-P-P-A Integrado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Inspección Global */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-300" />
                  Inspección Global del Tórax Posterior
                </h3>
                
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="chest-symmetry"
                        checked={phase2Data.posteriorThorax.globalInspection.chestSymmetry}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalInspection: { ...prev.posteriorThorax.globalInspection, chestSymmetry: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="chest-symmetry" className="text-white">Simetría de caja torácica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="respiratory-movements"
                        checked={phase2Data.posteriorThorax.globalInspection.respiratoryMovements}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalInspection: { ...prev.posteriorThorax.globalInspection, respiratoryMovements: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="respiratory-movements" className="text-white">Movimientos respiratorios simétricos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paradoxical-movement"
                        checked={phase2Data.posteriorThorax.globalInspection.paradoxicalMovement}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalInspection: { ...prev.posteriorThorax.globalInspection, paradoxicalMovement: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="paradoxical-movement" className="text-white">Movimiento paradójico</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Palpación Global */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hand className="h-5 w-5 text-green-300" />
                  Palpación Global - Amplexión y Frémito
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Amplexión y Amplexación</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Expansibilidad vértices</Label>
                        <Select 
                          value={phase2Data.posteriorThorax.globalPalpation.apicalExpansion} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalPalpation: { ...prev.posteriorThorax.globalPalpation, apicalExpansion: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Expansibilidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simétrica">Simétrica</SelectItem>
                            <SelectItem value="disminuida-derecha">Disminuida derecha</SelectItem>
                            <SelectItem value="disminuida-izquierda">Disminuida izquierda</SelectItem>
                            <SelectItem value="abolida-bilateral">Abolida bilateral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Expansibilidad bases</Label>
                        <Select 
                          value={phase2Data.posteriorThorax.globalPalpation.baseExpansion} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalPalpation: { ...prev.posteriorThorax.globalPalpation, baseExpansion: value }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Expansibilidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simétrica">Simétrica</SelectItem>
                            <SelectItem value="disminuida-derecha">Disminuida derecha</SelectItem>
                            <SelectItem value="disminuida-izquierda">Disminuida izquierda</SelectItem>
                            <SelectItem value="abolida-bilateral">Abolida bilateral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Frémito Táctil/Vocal ("treinta y tres")</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Hemitórax derecho</Label>
                        <Select 
                          value={phase2Data.posteriorThorax.globalPalpation.tactilevocalFremitus.rightSide} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalPalpation: { 
                                ...prev.posteriorThorax.globalPalpation, 
                                tactilevocalFremitus: { 
                                  ...prev.posteriorThorax.globalPalpation.tactilevocalFremitus, 
                                  rightSide: value 
                                }
                              }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Frémito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="aumentado">Aumentado</SelectItem>
                            <SelectItem value="disminuido">Disminuido</SelectItem>
                            <SelectItem value="abolido">Abolido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Hemitórax izquierdo</Label>
                        <Select 
                          value={phase2Data.posteriorThorax.globalPalpation.tactilevocalFremitus.leftSide} 
                          onValueChange={(value) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalPalpation: { 
                                ...prev.posteriorThorax.globalPalpation, 
                                tactilevocalFremitus: { 
                                  ...prev.posteriorThorax.globalPalpation.tactilevocalFremitus, 
                                  leftSide: value 
                                }
                              }
                            }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Frémito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="aumentado">Aumentado</SelectItem>
                            <SelectItem value="disminuido">Disminuido</SelectItem>
                            <SelectItem value="abolido">Abolido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Percusión Global */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-300" />
                  Percusión Global y Excursión Diafragmática
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Sonoridad General</h4>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Percusión comparativa sistémica</Label>
                      <Select 
                        value={phase2Data.posteriorThorax.globalPercussion.generalSonority} 
                        onValueChange={(value) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalPercussion: { ...prev.posteriorThorax.globalPercussion, generalSonority: value }
                          }
                        }))}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Sonoridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sonoridad-normal">Sonoridad normal bilateral</SelectItem>
                          <SelectItem value="matidez-derecha">Matidez hemitórax derecho</SelectItem>
                          <SelectItem value="matidez-izquierda">Matidez hemitórax izquierdo</SelectItem>
                          <SelectItem value="hipersonoridad-derecha">Hipersonoridad derecha</SelectItem>
                          <SelectItem value="hipersonoridad-izquierda">Hipersonoridad izquierda</SelectItem>
                          <SelectItem value="matidez-bases">Matidez en bases</SelectItem>
                          <SelectItem value="hipersonoridad-bilateral">Hipersonoridad bilateral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Excursión Diafragmática</h4>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Distancia inspiración-espiración (cm)</Label>
                      <Input
                        type="number"
                        value={phase2Data.posteriorThorax.globalPercussion.diaphragmaticExcursion || ''}
                        onChange={(e) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalPercussion: { 
                              ...prev.posteriorThorax.globalPercussion, 
                              diaphragmaticExcursion: Number(e.target.value) 
                            }
                          }
                        }))}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="5-7 cm normal"
                      />
                      <p className="text-white/60 text-xs">Medición entre inspiración y espiración forzada</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Auscultación Global */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-purple-300" />
                  Auscultación Global Comparativa
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Murmullo Vesicular</h4>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Intensidad y duración espiratoria</Label>
                      <Select 
                        value={phase2Data.posteriorThorax.globalAuscultation.vesicularMurmur} 
                        onValueChange={(value) => setPhase2Data(prev => ({ 
                          ...prev, 
                          posteriorThorax: { 
                            ...prev.posteriorThorax, 
                            globalAuscultation: { ...prev.posteriorThorax.globalAuscultation, vesicularMurmur: value }
                          }
                        }))}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Murmullo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal-bilateral">Normal bilateral</SelectItem>
                          <SelectItem value="disminuido-derecho">Disminuido derecho</SelectItem>
                          <SelectItem value="disminuido-izquierdo">Disminuido izquierdo</SelectItem>
                          <SelectItem value="abolido-derecho">Abolido derecho</SelectItem>
                          <SelectItem value="abolido-izquierdo">Abolido izquierdo</SelectItem>
                          <SelectItem value="bronquial">Soplo bronquial</SelectItem>
                          <SelectItem value="tubárico">Soplo tubárico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Ruidos Adventicios</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="crackles"
                          checked={phase2Data.posteriorThorax.globalAuscultation.adventiciousSounds.crackles}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                adventiciousSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.adventiciousSounds, 
                                  crackles: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="crackles" className="text-white">Crepitantes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="wheezes"
                          checked={phase2Data.posteriorThorax.globalAuscultation.adventiciousSounds.wheezes}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                adventiciousSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.adventiciousSounds, 
                                  wheezes: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="wheezes" className="text-white">Sibilancias</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rhonchi"
                          checked={phase2Data.posteriorThorax.globalAuscultation.adventiciousSounds.rhonchi}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                adventiciousSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.adventiciousSounds, 
                                  rhonchi: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="rhonchi" className="text-white">Roncus</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pleural-friction"
                          checked={phase2Data.posteriorThorax.globalAuscultation.adventiciousSounds.pleuralFriction}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                adventiciousSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.adventiciousSounds, 
                                  pleuralFriction: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="pleural-friction" className="text-white">Roce pleural</Label>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Sonidos de la Voz</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="bronchophony"
                          checked={phase2Data.posteriorThorax.globalAuscultation.voiceSounds.bronchophony}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                voiceSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.voiceSounds, 
                                  bronchophony: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="bronchophony" className="text-white">Broncofonía</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="egophony"
                          checked={phase2Data.posteriorThorax.globalAuscultation.voiceSounds.egophony}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                voiceSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.voiceSounds, 
                                  egophony: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="egophony" className="text-white">Egofonía</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="whispered"
                          checked={phase2Data.posteriorThorax.globalAuscultation.voiceSounds.whispered}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            posteriorThorax: { 
                              ...prev.posteriorThorax, 
                              globalAuscultation: { 
                                ...prev.posteriorThorax.globalAuscultation, 
                                voiceSounds: { 
                                  ...prev.posteriorThorax.globalAuscultation.voiceSounds, 
                                  whispered: checked as boolean 
                                }
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="whispered" className="text-white">Pectoriloquia áfona</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Mapa Pulmonar Regional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-cyan-300" />
                  Mapa Pulmonar Regional - I-P-P-A Integrado por Región
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(phase2Data.posteriorThorax.regions).map(([regionKey, regionData]) => {
                    const regionNames = {
                      rightApex: "Vértice Derecho",
                      leftApex: "Vértice Izquierdo", 
                      rightUpper: "Campo Superior Derecho",
                      leftUpper: "Campo Superior Izquierdo",
                      rightMiddle: "Campo Medio Derecho", 
                      leftMiddle: "Campo Medio Izquierdo",
                      rightLower: "Base Derecha",
                      leftLower: "Base Izquierda"
                    };
                    
                    return (
                      <div key={regionKey}>
                        {renderRegionalExam(
                          (regionNames as any)[regionKey], 
                          regionData, 
                          setPhase2Data,
                          `posteriorThorax.regions.${regionKey}`
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <Alert className="bg-blue-500/20 border-blue-500/30">
                  <AlertTriangle className="h-4 w-4 text-blue-300" />
                  <AlertDescription className="text-white text-sm">
                    Región de mayor rendimiento: Evaluar cada campo con I-P-P-A completo antes de pasar al siguiente
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 3: EXAMEN DEL TÓRAX ANTERIOR (DECÚBITO SUPINO 30-45°) */}
        <Card data-testid="card-fase-3" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-orange-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="h-6 w-6 text-orange-300" />
              Fase 3: Examen del Tórax Anterior (Decúbito Supino 30-45°)
              <Badge className="ml-auto bg-orange-200/30 text-white border border-white/20">
                Incluye Evaluación Cardiovascular Integrada
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Inspección Anterior */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-300" />
                  Inspección del Tórax Anterior
                </h3>
                
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="anterior-symmetry"
                        checked={phase3Data.anteriorThorax.globalInspection.symmetry}
                        onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                          ...prev, 
                          anteriorThorax: { 
                            ...prev.anteriorThorax, 
                            globalInspection: { ...prev.anteriorThorax.globalInspection, symmetry: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="anterior-symmetry" className="text-white">Simetría</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="anterior-accessory"
                        checked={phase3Data.anteriorThorax.globalInspection.accessoryMuscles}
                        onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                          ...prev, 
                          anteriorThorax: { 
                            ...prev.anteriorThorax, 
                            globalInspection: { ...prev.anteriorThorax.globalInspection, accessoryMuscles: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="anterior-accessory" className="text-white">Músculos accesorios</Label>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Patrón respiratorio</Label>
                      <Select 
                        value={phase3Data.anteriorThorax.globalInspection.breathing} 
                        onValueChange={(value) => setPhase3Data(prev => ({ 
                          ...prev, 
                          anteriorThorax: { 
                            ...prev.anteriorThorax, 
                            globalInspection: { ...prev.anteriorThorax.globalInspection, breathing: value }
                          }
                        }))}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Respiración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eupneico">Eupneico</SelectItem>
                          <SelectItem value="taquipneico">Taquipneico</SelectItem>
                          <SelectItem value="bradipneico">Bradipneico</SelectItem>
                          <SelectItem value="kussmaul">Kussmaul</SelectItem>
                          <SelectItem value="cheyne-stokes">Cheyne-Stokes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Percusión de Límites */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-300" />
                  Percusión de Límites Anatómicos
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="hepatic-dullness"
                        checked={phase3Data.anteriorThorax.hepaticDullness}
                        onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                          ...prev, 
                          anteriorThorax: { ...prev.anteriorThorax, hepaticDullness: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="hepatic-dullness" className="text-white">Matidez hepática derecha normal</Label>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gastric-tympany"
                        checked={phase3Data.anteriorThorax.gastricTympany}
                        onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                          ...prev, 
                          anteriorThorax: { ...prev.anteriorThorax, gastricTympany: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="gastric-tympany" className="text-white">Timpanismo gástrico izquierdo</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Mapa Pulmonar Anterior */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-cyan-300" />
                  Mapa Pulmonar Anterior y Axilar
                </h3>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Campos Anteriores</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(phase3Data.anteriorThorax.regions).map(([regionKey, regionData]) => {
                      const regionNames = {
                        rightApex: "Vértice Derecho",
                        leftApex: "Vértice Izquierdo", 
                        rightUpper: "Campo Superior Derecho",
                        leftUpper: "Campo Superior Izquierdo",
                        rightMiddle: "Campo Medio Derecho", 
                        leftMiddle: "Campo Medio Izquierdo",
                        rightLower: "Campo Inferior Derecho",
                        leftLower: "Campo Inferior Izquierdo"
                      };
                      
                      return (
                        <div key={regionKey}>
                          {renderRegionalExam(
                            (regionNames as any)[regionKey], 
                            regionData, 
                            setPhase3Data,
                            `anteriorThorax.regions.${regionKey}`
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="font-medium text-white">Regiones Axilares</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(phase3Data.anteriorThorax.axillaryRegions).map(([regionKey, regionData]) => {
                      const regionNames = {
                        rightAxilla: "Axila Derecha",
                        leftAxilla: "Axila Izquierda"
                      };
                      
                      return (
                        <div key={regionKey}>
                          {renderRegionalExam(
                            (regionNames as any)[regionKey], 
                            regionData, 
                            setPhase3Data,
                            `anteriorThorax.axillaryRegions.${regionKey}`
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Examen Cardiovascular Integrado */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  Examen Cardiovascular Integrado
                </h3>
                
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <p className="text-white/70 text-sm">Posición ideal para descartar causas cardiogénicas de disnea</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Ruidos Cardíacos</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-white text-sm">S1</Label>
                          <Select 
                            value={phase3Data.cardiovascularIntegration.heartSounds.s1} 
                            onValueChange={(value) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { 
                                ...prev.cardiovascularIntegration, 
                                heartSounds: { ...prev.cardiovascularIntegration.heartSounds, s1: value }
                              }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="S1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="aumentado">Aumentado</SelectItem>
                              <SelectItem value="disminuido">Disminuido</SelectItem>
                              <SelectItem value="desdoblado">Desdoblado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-white text-sm">S2</Label>
                          <Select 
                            value={phase3Data.cardiovascularIntegration.heartSounds.s2} 
                            onValueChange={(value) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { 
                                ...prev.cardiovascularIntegration, 
                                heartSounds: { ...prev.cardiovascularIntegration.heartSounds, s2: value }
                              }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="S2" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="desdoblado-fisiológico">Desdoblado fisiológico</SelectItem>
                              <SelectItem value="desdoblado-patológico">Desdoblado patológico</SelectItem>
                              <SelectItem value="único">Único</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Hallazgos Adicionales</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="murmurs"
                            checked={phase3Data.cardiovascularIntegration.heartSounds.murmurs}
                            onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { 
                                ...prev.cardiovascularIntegration, 
                                heartSounds: { ...prev.cardiovascularIntegration.heartSounds, murmurs: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="murmurs" className="text-white">Soplos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="extra-sounds"
                            checked={phase3Data.cardiovascularIntegration.heartSounds.extraSounds}
                            onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { 
                                ...prev.cardiovascularIntegration, 
                                heartSounds: { ...prev.cardiovascularIntegration.heartSounds, extraSounds: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="extra-sounds" className="text-white">Ruidos extra (S3, S4, clic)</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Ritmo y Frecuencia</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-white text-sm">Ritmo cardíaco</Label>
                          <Select 
                            value={phase3Data.cardiovascularIntegration.cardiacRhythm} 
                            onValueChange={(value) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { ...prev.cardiovascularIntegration, cardiacRhythm: value }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Ritmo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="irregular">Irregular</SelectItem>
                              <SelectItem value="irregularmente-irregular">Irregularmente irregular</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-white text-sm">FC (lpm)</Label>
                          <Input
                            type="number"
                            value={phase3Data.cardiovascularIntegration.heartRate || ''}
                            onChange={(e) => setPhase3Data(prev => ({ 
                              ...prev, 
                              cardiovascularIntegration: { ...prev.cardiovascularIntegration, heartRate: Number(e.target.value) }
                            }))}
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 4: SÍNTESIS Y PRUEBAS COMPLEMENTARIAS */}
        <Card data-testid="card-fase-4" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-purple-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="h-6 w-6 text-purple-300" />
              Fase 4: Síntesis y Pruebas Complementarias (Post-Examen)
              <Badge className="ml-auto bg-purple-200/30 text-white border border-white/20">
                Escalas CAT, BODE, mMRC
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Pruebas Funcionales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-300" />
                  Pruebas Funcionales
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Espirometría</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">CVF (L)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={phase4Data.functionalTests.spirometry.fvc || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              spirometry: { ...prev.functionalTests.spirometry, fvc: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="4.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">VEF₁ (L)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={phase4Data.functionalTests.spirometry.fev1 || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              spirometry: { ...prev.functionalTests.spirometry, fev1: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="3.6"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">VEF₁/CVF (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={phase4Data.functionalTests.spirometry.fev1fvc || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              spirometry: { ...prev.functionalTests.spirometry, fev1fvc: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">PEF (L/min)</Label>
                        <Input
                          type="number"
                          value={phase4Data.functionalTests.spirometry.pef || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              spirometry: { ...prev.functionalTests.spirometry, pef: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Test de Marcha 6 Minutos</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Distancia recorrida (m)</Label>
                        <Input
                          type="number"
                          value={phase4Data.functionalTests.walkTest.distance || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              walkTest: { ...prev.functionalTests.walkTest, distance: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="450"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">SatO₂ final (%)</Label>
                        <Input
                          type="number"
                          value={phase4Data.functionalTests.walkTest.finalSaturation || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              walkTest: { ...prev.functionalTests.walkTest, finalSaturation: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="95"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Disnea final (Borg)</Label>
                        <Input
                          type="number"
                          value={phase4Data.functionalTests.walkTest.dyspnea || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            functionalTests: { 
                              ...prev.functionalTests, 
                              walkTest: { ...prev.functionalTests.walkTest, dyspnea: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Escalas de Evaluación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-orange-300" />
                  Escalas de Evaluación
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* mMRC */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Escala mMRC</h4>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Grado de disnea</Label>
                      <Select 
                        value={phase4Data.scales.mMRC.score.toString()} 
                        onValueChange={(value) => setPhase4Data(prev => ({ 
                          ...prev, 
                          scales: { 
                            ...prev.scales, 
                            mMRC: { 
                              score: Number(value), 
                              description: value === "0" ? "Solo con ejercicio intenso" :
                                          value === "1" ? "Andando deprisa o subiendo cuesta ligera" :
                                          value === "2" ? "Caminar más despacio o parar al andar en llano" :
                                          value === "3" ? "Parar a los 100m o pocos minutos" :
                                          value === "4" ? "Demasiada disnea para salir de casa" : ""
                            }
                          }
                        }))}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Grado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Solo con ejercicio intenso</SelectItem>
                          <SelectItem value="1">1 - Andando deprisa</SelectItem>
                          <SelectItem value="2">2 - Caminar más despacio</SelectItem>
                          <SelectItem value="3">3 - Parar a los 100m</SelectItem>
                          <SelectItem value="4">4 - Demasiada disnea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* CAT */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Escala CAT</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(phase4Data.scales.cat).filter(([key]) => key !== 'totalScore').map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-white text-xs capitalize">{key}</Label>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            value={value || ''}
                            onChange={(e) => setPhase4Data(prev => ({ 
                              ...prev, 
                              scales: { 
                                ...prev.scales, 
                                cat: { ...prev.scales.cat, [key]: Number(e.target.value) }
                              }
                            }))}
                            className="bg-white/5 border-white/20 text-white text-xs"
                            placeholder="0-5"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-white/10 rounded border border-white/20">
                      <div className="text-white font-medium text-sm">
                        Total CAT: {phase4Data.scales.cat.totalScore}
                      </div>
                    </div>
                  </div>

                  {/* BODE */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Índice BODE</h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-white text-xs">IMC</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={phase4Data.scales.bode.bmi || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            scales: { 
                              ...prev.scales, 
                              bode: { ...prev.scales.bode, bmi: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white text-xs"
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">VEF₁ (% predicho)</Label>
                        <Input
                          type="number"
                          value={phase4Data.scales.bode.fev1 || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            scales: { 
                              ...prev.scales, 
                              bode: { ...prev.scales.bode, fev1: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white text-xs"
                          placeholder="70"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">mMRC</Label>
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={phase4Data.scales.bode.mMRC || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            scales: { 
                              ...prev.scales, 
                              bode: { ...prev.scales.bode, mMRC: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white text-xs"
                          placeholder="1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Test 6min (m)</Label>
                        <Input
                          type="number"
                          value={phase4Data.scales.bode.walkTest || ''}
                          onChange={(e) => setPhase4Data(prev => ({ 
                            ...prev, 
                            scales: { 
                              ...prev.scales, 
                              bode: { ...prev.scales.bode, walkTest: Number(e.target.value) }
                            }
                          }))}
                          className="bg-white/5 border-white/20 text-white text-xs"
                          placeholder="450"
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-white/10 rounded border border-white/20">
                      <div className="text-white font-medium text-sm">
                        BODE Score: {phase4Data.scales.bode.totalScore}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Síntesis Diagnóstica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-green-300" />
                  Síntesis Diagnóstica
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Impresión Diagnóstica Principal</Label>
                      <Input
                        value={phase4Data.diagnosticSynthesis.primaryImpression}
                        onChange={(e) => setPhase4Data(prev => ({ 
                          ...prev, 
                          diagnosticSynthesis: { ...prev.diagnosticSynthesis, primaryImpression: e.target.value }
                        }))}
                        placeholder="Diagnóstico principal integrado"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Diagnóstico Diferencial</Label>
                      <Input
                        value={phase4Data.diagnosticSynthesis.differentialDiagnosis}
                        onChange={(e) => setPhase4Data(prev => ({ 
                          ...prev, 
                          diagnosticSynthesis: { ...prev.diagnosticSynthesis, differentialDiagnosis: e.target.value }
                        }))}
                        placeholder="Diagnósticos alternativos"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Plan de Manejo</Label>
                      <Input
                        value={phase4Data.diagnosticSynthesis.managementPlan}
                        onChange={(e) => setPhase4Data(prev => ({ 
                          ...prev, 
                          diagnosticSynthesis: { ...prev.diagnosticSynthesis, managementPlan: e.target.value }
                        }))}
                        placeholder="Tratamiento y seguimiento"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Finalizar */}
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            data-testid="button-complete-exam"
          >
            <Wind className="h-5 w-5 mr-2" />
            Completar Exploración Neumológica Integrada
          </Button>
        </div>
      </div>
    </div>
  );
}