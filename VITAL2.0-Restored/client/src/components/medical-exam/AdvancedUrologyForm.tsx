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
  Search
} from "lucide-react";
import {
  calculateIPSS,
  calculateICIQ,
  calculateIIEF5,
  evaluateProstate,
  evaluateUrinarySymptoms,
  evaluatePainScale,
  type IPSSResult,
  type ICIQResult,
  type IIEFResult,
  type ProstateEvaluation
} from "@/utils/medicalCalculations";

interface AdvancedUrologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
}

export default function AdvancedUrologyForm({
  patientData,
  onDataChange,
  onComplete
}: AdvancedUrologyFormProps) {
  // Estados organizados por fase
  const [phase1Data, setPhase1Data] = useState({
    anamnesis: {
      mainComplaint: "",
      currentIllness: "",
      urologicalHistory: {
        surgeries: [],
        lithiasis: false,
        infections: [],
        cancer: false
      },
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        neurologicalDisease: false
      },
      medications: {
        diuretics: false,
        anticholinergics: false,
        alphablockers: false,
        other: ""
      }
    },
    vitalSigns: {
      bloodPressure: { systolic: 0, diastolic: 0 },
      heartRate: 0,
      temperature: 0
    },
    generalObservation: {
      acutePain: false,
      discomfort: false,
      jaundice: false,
      generalState: ""
    }
  });

  const [phase2Data, setPhase2Data] = useState({
    abdominalExam: {
      inspection: {
        scars: [],
        visibleMasses: false,
        distension: false
      },
      auscultation: {
        aorticBruit: false,
        renalArteryBruit: { right: false, left: false }
      },
      palpation: {
        superficial: { tenderness: false, masses: false },
        deep: { 
          renalMasses: { right: false, left: false },
          suprapubicPain: false,
          bladderGlobe: false
        }
      },
      percussion: {
        costovertebralAngle: { right: "", left: "" },
        suprapubicDullness: false
      }
    },
    inguinalExam: {
      hernias: { right: false, left: false },
      lymphNodes: { right: false, left: false }
    }
  });

  const [phase3Data, setPhase3Data] = useState({
    gender: "" as "male" | "female" | "",
    maleExam: {
      standing: {
        penisInspection: {
          lesions: false,
          phimosis: false,
          meatusPosition: ""
        },
        scrotumInspection: {
          lesions: false,
          asymmetry: false
        },
        varicocele: {
          grade: 0,
          valsalva: false
        },
        inguinalHernias: { right: false, left: false }
      },
      supine: {
        penisPalpation: {
          plaques: false,
          induration: false
        },
        testicular: {
          right: { size: "", consistency: "", tenderness: false },
          left: { size: "", consistency: "", tenderness: false }
        },
        epididymal: {
          right: { normal: true, enlarged: false, tender: false },
          left: { normal: true, enlarged: false, tender: false }
        },
        transillumination: {
          performed: false,
          results: ""
        }
      },
      rectalExam: {
        perianal: { lesions: false },
        neurological: {
          perinealSensation: true,
          analReflex: true,
          bulbocavernosusReflex: true
        },
        digitalRectal: {
          sphincterTone: "",
          prostate: {
            size: "",
            consistency: "",
            surface: "",
            borders: "",
            centralGroove: true,
            nodules: false,
            pain: false
          }
        }
      }
    },
    femaleExam: {
      lithotomy: {
        externalGenitalia: {
          vulva: "",
          clitoris: "",
          introitus: "",
          urethralMeatus: ""
        },
        pelvicOrganProlapse: {
          cystocele: 0,
          rectocele: 0,
          uterineProlapse: 0
        },
        stressTest: {
          performed: false,
          positive: false,
          leakageType: ""
        },
        qtipTest: {
          performed: false,
          angle: 0
        },
        vaginalExam: {
          pelvicFloorStrength: 0,
          anteriorWallPain: false,
          urethralDiverticula: false
        }
      }
    }
  });

  const [phase4Data, setPhase4Data] = useState({
    urineCollection: {
      performed: false,
      method: ""
    },
    urinalysis: {
      color: "",
      clarity: "",
      specificGravity: 0,
      ph: 0,
      protein: "",
      glucose: "",
      ketones: "",
      blood: "",
      leukocytes: "",
      nitrites: "",
      bacteria: ""
    },
    uroflowmetry: {
      performed: false,
      maxFlow: 0,
      averageFlow: 0,
      voidedVolume: 0,
      postVoidResidual: 0
    },
    pocus: {
      kidneys: {
        right: { size: 0, hydronephrosis: false, stones: false },
        left: { size: 0, hydronephrosis: false, stones: false }
      },
      bladder: {
        wall: "",
        content: "",
        postVoidResidual: 0
      }
    },
    questionnaires: {
      ipss: {
        incompleteEmptying: 0,
        frequency: 0,
        intermittency: 0,
        urgency: 0,
        weakStream: 0,
        straining: 0,
        nocturia: 0,
        qualityOfLife: 0
      },
      iciq: {
        frequency: 0,
        amount: 0,
        impact: 0
      },
      iief5: {
        confidence: 0,
        firmness: 0,
        maintenance: 0,
        satisfaction: 0,
        frequency: 0
      }
    }
  });

  // Cálculos automáticos
  const ipssResult = calculateIPSS ? calculateIPSS(phase4Data.questionnaires.ipss) : { score: 0, severity: 'leve' };
  const iciqResult = calculateICIQ ? calculateICIQ(phase4Data.questionnaires.iciq) : { score: 0, severity: 'leve' };
  const iiefResult = (phase3Data.gender === 'male' && calculateIIEF5) ? calculateIIEF5({...phase4Data.questionnaires.iief5, difficulty: 0}) : null;

  const handleComplete = () => {
    const completeData = {
      phase1: phase1Data,
      phase2: phase2Data,
      phase3: phase3Data,
      phase4: phase4Data,
      calculations: {
        ipssResult,
        iciqResult,
        iiefResult
      }
    };
    
    if (onComplete) {
      onComplete(completeData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-10 w-10 text-blue-300" />
            <h1 className="text-4xl font-bold text-white">Exploración Urológica Optimizada</h1>
          </div>
          <p className="text-white/80 text-lg">Protocolo clínico de 4 fases para máxima eficiencia diagnóstica</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge className="bg-blue-500/30 text-white border border-white/20">Fase 1: Sentado y Vestido</Badge>
            <Badge className="bg-green-500/30 text-white border border-white/20">Fase 2: Decúbito Supino</Badge>
            <Badge className="bg-orange-500/30 text-white border border-white/20">Fase 3: Genitourinaria</Badge>
            <Badge className="bg-purple-500/30 text-white border border-white/20">Fase 4: Complementarias</Badge>
          </div>
        </div>

        {/* FASE 1: DIÁLOGO Y CONSTANTES VITALES (PACIENTE SENTADO Y VESTIDO) */}
        <Card data-testid="card-fase-1" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-blue-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-6 w-6 text-blue-300" />
              Fase 1: Diálogo y Constantes Vitales (Paciente Sentado y Vestido)
              <Badge className="ml-auto bg-blue-200/30 text-white border border-white/20">
                Establecimiento del Diagnóstico
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Anamnesis Dirigida */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-300" />
                  Anamnesis Dirigida
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Motivo de Consulta</Label>
                      <Input
                        value={phase1Data.anamnesis.mainComplaint}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          anamnesis: { ...prev.anamnesis, mainComplaint: e.target.value }
                        }))}
                        placeholder="¿Qué le trae a la consulta?"
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
                        placeholder="Inicio, duración, severidad de síntomas"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Antecedentes Urológicos Clave</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lithiasis"
                          checked={phase1Data.anamnesis.urologicalHistory.lithiasis}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              urologicalHistory: { 
                                ...prev.anamnesis.urologicalHistory, 
                                lithiasis: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="lithiasis" className="text-white">Litiasis previa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="cancer"
                          checked={phase1Data.anamnesis.urologicalHistory.cancer}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              urologicalHistory: { 
                                ...prev.anamnesis.urologicalHistory, 
                                cancer: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="cancer" className="text-white">Cáncer urológico</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                    <h4 className="font-medium text-white">Antecedentes Médicos Relevantes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="diabetes"
                          checked={phase1Data.anamnesis.medicalHistory.diabetes}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medicalHistory: { 
                                ...prev.anamnesis.medicalHistory, 
                                diabetes: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="diabetes" className="text-white">Diabetes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hypertension"
                          checked={phase1Data.anamnesis.medicalHistory.hypertension}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medicalHistory: { 
                                ...prev.anamnesis.medicalHistory, 
                                hypertension: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="hypertension" className="text-white">Hipertensión</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="neurological"
                          checked={phase1Data.anamnesis.medicalHistory.neurologicalDisease}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medicalHistory: { 
                                ...prev.anamnesis.medicalHistory, 
                                neurologicalDisease: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="neurological" className="text-white">Enfermedad neurológica</Label>
                      </div>
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                    <h4 className="font-medium text-white">Medicación Principal</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="diuretics"
                          checked={phase1Data.anamnesis.medications.diuretics}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medications: { 
                                ...prev.anamnesis.medications, 
                                diuretics: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="diuretics" className="text-white">Diuréticos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="anticholinergics"
                          checked={phase1Data.anamnesis.medications.anticholinergics}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medications: { 
                                ...prev.anamnesis.medications, 
                                anticholinergics: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="anticholinergics" className="text-white">Anticolinérgicos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="alphablockers"
                          checked={phase1Data.anamnesis.medications.alphablockers}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            anamnesis: { 
                              ...prev.anamnesis, 
                              medications: { 
                                ...prev.anamnesis.medications, 
                                alphablockers: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="alphablockers" className="text-white">Alfabloqueantes</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Otros medicamentos</Label>
                      <Input
                        value={phase1Data.anamnesis.medications.other}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          anamnesis: { 
                            ...prev.anamnesis, 
                            medications: { 
                              ...prev.anamnesis.medications, 
                              other: e.target.value 
                            }
                          }
                        }))}
                        placeholder="Otros medicamentos relevantes"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Signos Vitales y Observación General */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-300" />
                  Signos Vitales y Observación General
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Signos Vitales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">TA Sistólica (mmHg)</Label>
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
                      <div className="space-y-2">
                        <Label className="text-white text-sm">TA Diastólica (mmHg)</Label>
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
                      <div className="space-y-2">
                        <Label className="text-white text-sm">FC (lpm)</Label>
                        <Input
                          type="number"
                          value={phase1Data.vitalSigns.heartRate || ''}
                          onChange={(e) => setPhase1Data(prev => ({ 
                            ...prev, 
                            vitalSigns: { ...prev.vitalSigns, heartRate: Number(e.target.value) }
                          }))}
                          className="bg-white/5 border-white/20 text-white"
                          placeholder="70"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Temperatura (°C)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={phase1Data.vitalSigns.temperature || ''}
                        onChange={(e) => setPhase1Data(prev => ({ 
                          ...prev, 
                          vitalSigns: { ...prev.vitalSigns, temperature: Number(e.target.value) }
                        }))}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="36.5"
                      />
                    </div>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Observación General</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="acute-pain"
                          checked={phase1Data.generalObservation.acutePain}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalObservation: { ...prev.generalObservation, acutePain: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="acute-pain" className="text-white">Signos de dolor agudo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="discomfort"
                          checked={phase1Data.generalObservation.discomfort}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalObservation: { ...prev.generalObservation, discomfort: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="discomfort" className="text-white">Malestar general</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="jaundice"
                          checked={phase1Data.generalObservation.jaundice}
                          onCheckedChange={(checked) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalObservation: { ...prev.generalObservation, jaundice: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="jaundice" className="text-white">Ictericia</Label>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Estado general</Label>
                        <Select 
                          value={phase1Data.generalObservation.generalState} 
                          onValueChange={(value) => setPhase1Data(prev => ({ 
                            ...prev, 
                            generalObservation: { ...prev.generalObservation, generalState: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelente">Excelente</SelectItem>
                            <SelectItem value="bueno">Bueno</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="malo">Malo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 2: EXPLORACIÓN GENERAL Y ABDOMINAL (PACIENTE EN DECÚBITO SUPINO) */}
        <Card data-testid="card-fase-2" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-green-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-6 w-6 text-green-300" />
              Fase 2: Exploración General y Abdominal (Decúbito Supino)
              <Badge className="ml-auto bg-green-200/30 text-white border border-white/20">
                Exploración Física Sistemática
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Examen Abdominal Completo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-300" />
                  Examen Abdominal Completo
                </h3>

                {/* Inspección */}
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Inspección</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label className="text-white">Cicatrices</Label>
                      <div className="space-y-2">
                        {['Nefrectomía', 'Cistectomía', 'Laparoscopia', 'Otra cirugía'].map((scar) => (
                          <div key={scar} className="flex items-center space-x-2">
                            <Checkbox 
                              id={scar}
                              checked={phase2Data.abdominalExam.inspection.scars.includes(scar)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPhase2Data(prev => ({ 
                                    ...prev, 
                                    abdominalExam: { 
                                      ...prev.abdominalExam, 
                                      inspection: { 
                                        ...prev.abdominalExam.inspection, 
                                        scars: [...prev.abdominalExam.inspection.scars, scar]
                                      }
                                    }
                                  }));
                                } else {
                                  setPhase2Data(prev => ({ 
                                    ...prev, 
                                    abdominalExam: { 
                                      ...prev.abdominalExam, 
                                      inspection: { 
                                        ...prev.abdominalExam.inspection, 
                                        scars: prev.abdominalExam.inspection.scars.filter(s => s !== scar)
                                      }
                                    }
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={scar} className="text-white text-sm">{scar}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="visible-masses"
                          checked={phase2Data.abdominalExam.inspection.visibleMasses}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            abdominalExam: { 
                              ...prev.abdominalExam, 
                              inspection: { ...prev.abdominalExam.inspection, visibleMasses: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="visible-masses" className="text-white">Masas visibles</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="distension"
                          checked={phase2Data.abdominalExam.inspection.distension}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            abdominalExam: { 
                              ...prev.abdominalExam, 
                              inspection: { ...prev.abdominalExam.inspection, distension: checked as boolean }
                            }
                          }))}
                        />
                        <Label htmlFor="distension" className="text-white">Distensión abdominal</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auscultación */}
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Auscultación</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aortic-bruit"
                        checked={phase2Data.abdominalExam.auscultation.aorticBruit}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          abdominalExam: { 
                            ...prev.abdominalExam, 
                            auscultation: { ...prev.abdominalExam.auscultation, aorticBruit: checked as boolean }
                          }
                        }))}
                      />
                      <Label htmlFor="aortic-bruit" className="text-white">Soplo aórtico</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="renal-bruit-right"
                        checked={phase2Data.abdominalExam.auscultation.renalArteryBruit.right}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          abdominalExam: { 
                            ...prev.abdominalExam, 
                            auscultation: { 
                              ...prev.abdominalExam.auscultation, 
                              renalArteryBruit: { 
                                ...prev.abdominalExam.auscultation.renalArteryBruit, 
                                right: checked as boolean 
                              }
                            }
                          }
                        }))}
                      />
                      <Label htmlFor="renal-bruit-right" className="text-white">Soplo renal derecho</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="renal-bruit-left"
                        checked={phase2Data.abdominalExam.auscultation.renalArteryBruit.left}
                        onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                          ...prev, 
                          abdominalExam: { 
                            ...prev.abdominalExam, 
                            auscultation: { 
                              ...prev.abdominalExam.auscultation, 
                              renalArteryBruit: { 
                                ...prev.abdominalExam.auscultation.renalArteryBruit, 
                                left: checked as boolean 
                              }
                            }
                          }
                        }))}
                      />
                      <Label htmlFor="renal-bruit-left" className="text-white">Soplo renal izquierdo</Label>
                    </div>
                  </div>
                </div>

                {/* Palpación */}
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Palpación</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Palpación Superficial</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="superficial-tenderness"
                            checked={phase2Data.abdominalExam.palpation.superficial.tenderness}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  superficial: { 
                                    ...prev.abdominalExam.palpation.superficial, 
                                    tenderness: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="superficial-tenderness" className="text-white">Dolor superficial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="superficial-masses"
                            checked={phase2Data.abdominalExam.palpation.superficial.masses}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  superficial: { 
                                    ...prev.abdominalExam.palpation.superficial, 
                                    masses: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="superficial-masses" className="text-white">Masas superficiales</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Palpación Profunda</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="renal-mass-right"
                            checked={phase2Data.abdominalExam.palpation.deep.renalMasses.right}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  deep: { 
                                    ...prev.abdominalExam.palpation.deep, 
                                    renalMasses: { 
                                      ...prev.abdominalExam.palpation.deep.renalMasses, 
                                      right: checked as boolean 
                                    }
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="renal-mass-right" className="text-white">Masa renal derecha</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="renal-mass-left"
                            checked={phase2Data.abdominalExam.palpation.deep.renalMasses.left}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  deep: { 
                                    ...prev.abdominalExam.palpation.deep, 
                                    renalMasses: { 
                                      ...prev.abdominalExam.palpation.deep.renalMasses, 
                                      left: checked as boolean 
                                    }
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="renal-mass-left" className="text-white">Masa renal izquierda</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="suprapubic-pain"
                            checked={phase2Data.abdominalExam.palpation.deep.suprapubicPain}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  deep: { 
                                    ...prev.abdominalExam.palpation.deep, 
                                    suprapubicPain: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="suprapubic-pain" className="text-white">Dolor suprapúbico</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="bladder-globe"
                            checked={phase2Data.abdominalExam.palpation.deep.bladderGlobe}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                palpation: { 
                                  ...prev.abdominalExam.palpation, 
                                  deep: { 
                                    ...prev.abdominalExam.palpation.deep, 
                                    bladderGlobe: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="bladder-globe" className="text-white">Globo vesical</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Percusión */}
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-medium text-white">Percusión</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Puñopercusión Lumbar (Maniobra de Giordano)</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Lado derecho</Label>
                          <Select 
                            value={phase2Data.abdominalExam.percussion.costovertebralAngle.right} 
                            onValueChange={(value) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                percussion: { 
                                  ...prev.abdominalExam.percussion, 
                                  costovertebralAngle: { 
                                    ...prev.abdominalExam.percussion.costovertebralAngle, 
                                    right: value 
                                  }
                                }
                              }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Resultado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="negativo">Negativo</SelectItem>
                              <SelectItem value="positivo">Positivo</SelectItem>
                              <SelectItem value="dudoso">Dudoso</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Lado izquierdo</Label>
                          <Select 
                            value={phase2Data.abdominalExam.percussion.costovertebralAngle.left} 
                            onValueChange={(value) => setPhase2Data(prev => ({ 
                              ...prev, 
                              abdominalExam: { 
                                ...prev.abdominalExam, 
                                percussion: { 
                                  ...prev.abdominalExam.percussion, 
                                  costovertebralAngle: { 
                                    ...prev.abdominalExam.percussion.costovertebralAngle, 
                                    left: value 
                                  }
                                }
                              }
                            }))}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Resultado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="negativo">Negativo</SelectItem>
                              <SelectItem value="positivo">Positivo</SelectItem>
                              <SelectItem value="dudoso">Dudoso</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-white/60 text-xs">Esencial para detectar pielonefritis o hidronefrosis</p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Percusión Suprapúbica</h5>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="suprapubic-dullness"
                          checked={phase2Data.abdominalExam.percussion.suprapubicDullness}
                          onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                            ...prev, 
                            abdominalExam: { 
                              ...prev.abdominalExam, 
                              percussion: { 
                                ...prev.abdominalExam.percussion, 
                                suprapubicDullness: checked as boolean 
                              }
                            }
                          }))}
                        />
                        <Label htmlFor="suprapubic-dullness" className="text-white">Matidez suprapúbica</Label>
                      </div>
                      <p className="text-white/60 text-xs">Confirma globo vesical</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Exploración de la Región Inguinal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hand className="h-5 w-5 text-orange-300" />
                  Exploración de la Región Inguinal
                </h3>
                
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Hernias Inguinales</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hernia-right"
                            checked={phase2Data.inguinalExam.hernias.right}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inguinalExam: { 
                                ...prev.inguinalExam, 
                                hernias: { ...prev.inguinalExam.hernias, right: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="hernia-right" className="text-white">Hernia inguinal derecha</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="hernia-left"
                            checked={phase2Data.inguinalExam.hernias.left}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inguinalExam: { 
                                ...prev.inguinalExam, 
                                hernias: { ...prev.inguinalExam.hernias, left: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="hernia-left" className="text-white">Hernia inguinal izquierda</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Adenopatías</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="lymph-right"
                            checked={phase2Data.inguinalExam.lymphNodes.right}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inguinalExam: { 
                                ...prev.inguinalExam, 
                                lymphNodes: { ...prev.inguinalExam.lymphNodes, right: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="lymph-right" className="text-white">Adenopatías derechas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="lymph-left"
                            checked={phase2Data.inguinalExam.lymphNodes.left}
                            onCheckedChange={(checked) => setPhase2Data(prev => ({ 
                              ...prev, 
                              inguinalExam: { 
                                ...prev.inguinalExam, 
                                lymphNodes: { ...prev.inguinalExam.lymphNodes, left: checked as boolean }
                              }
                            }))}
                          />
                          <Label htmlFor="lymph-left" className="text-white">Adenopatías izquierdas</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 3: EXPLORACIÓN GENITOURINARIA ESPECÍFICA */}
        <Card data-testid="card-fase-3" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-orange-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <UserCheck className="h-6 w-6 text-orange-300" />
              Fase 3: Exploración Genitourinaria Específica
              <Badge className="ml-auto bg-orange-200/30 text-white border border-white/20">
                Exploración Específica por Género
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Selección de Género */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-300" />
                  Selección de Género para Exploración Específica
                </h3>
                <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                  <RadioGroup 
                    value={phase3Data.gender} 
                    onValueChange={(value) => setPhase3Data(prev => ({ ...prev, gender: value as "male" | "female" }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-white">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-white">Femenino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {phase3Data.gender === 'male' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Exploración Masculina</h3>
                  
                  {/* Exploración en Bipedestación */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Exploración en Bipedestación (De Pie)</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Inspección del Pene y Escroto</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="penis-lesions"
                              checked={phase3Data.maleExam.standing.penisInspection.lesions}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  standing: { 
                                    ...prev.maleExam.standing, 
                                    penisInspection: { 
                                      ...prev.maleExam.standing.penisInspection, 
                                      lesions: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="penis-lesions" className="text-white">Lesiones cutáneas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="phimosis"
                              checked={phase3Data.maleExam.standing.penisInspection.phimosis}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  standing: { 
                                    ...prev.maleExam.standing, 
                                    penisInspection: { 
                                      ...prev.maleExam.standing.penisInspection, 
                                      phimosis: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="phimosis" className="text-white">Fimosis</Label>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Posición del meato</Label>
                            <Select 
                              value={phase3Data.maleExam.standing.penisInspection.meatusPosition} 
                              onValueChange={(value) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  standing: { 
                                    ...prev.maleExam.standing, 
                                    penisInspection: { 
                                      ...prev.maleExam.standing.penisInspection, 
                                      meatusPosition: value 
                                    }
                                  }
                                }
                              }))}>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal (terminal)</SelectItem>
                                <SelectItem value="hipospadias">Hipospadias</SelectItem>
                                <SelectItem value="epispadias">Epispadias</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Evaluación de Varicocele</h5>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Grado del varicocele</Label>
                            <Select 
                              value={phase3Data.maleExam.standing.varicocele.grade.toString()} 
                              onValueChange={(value) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  standing: { 
                                    ...prev.maleExam.standing, 
                                    varicocele: { 
                                      ...prev.maleExam.standing.varicocele, 
                                      grade: Number(value) 
                                    }
                                  }
                                }
                              }))}>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="Grado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0 - No varicocele</SelectItem>
                                <SelectItem value="1">1 - Palpable con Valsalva</SelectItem>
                                <SelectItem value="2">2 - Palpable sin Valsalva</SelectItem>
                                <SelectItem value="3">3 - Visible</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="valsalva"
                              checked={phase3Data.maleExam.standing.varicocele.valsalva}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  standing: { 
                                    ...prev.maleExam.standing, 
                                    varicocele: { 
                                      ...prev.maleExam.standing.varicocele, 
                                      valsalva: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="valsalva" className="text-white">Maniobra de Valsalva positiva</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exploración en Decúbito Supino */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Exploración en Decúbito Supino</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Palpación del Pene</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="penis-plaques"
                              checked={phase3Data.maleExam.supine.penisPalpation.plaques}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  supine: { 
                                    ...prev.maleExam.supine, 
                                    penisPalpation: { 
                                      ...prev.maleExam.supine.penisPalpation, 
                                      plaques: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="penis-plaques" className="text-white">Placas fibróticas (Peyronie)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="penis-induration"
                              checked={phase3Data.maleExam.supine.penisPalpation.induration}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  supine: { 
                                    ...prev.maleExam.supine, 
                                    penisPalpation: { 
                                      ...prev.maleExam.supine.penisPalpation, 
                                      induration: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="penis-induration" className="text-white">Induración</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Palpación Testicular</h5>
                        <div className="grid grid-cols-2 gap-4">
                          {['right', 'left'].map((side) => (
                            <div key={side} className="space-y-2">
                              <h6 className="text-white text-sm font-medium">
                                Testículo {side === 'right' ? 'derecho' : 'izquierdo'}
                              </h6>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <Label className="text-white text-xs">Tamaño</Label>
                                  <Select 
                                    value={phase3Data.maleExam.supine.testicular[side as keyof typeof phase3Data.maleExam.supine.testicular].size} 
                                    onValueChange={(value) => setPhase3Data(prev => ({ 
                                      ...prev, 
                                      maleExam: { 
                                        ...prev.maleExam, 
                                        supine: { 
                                          ...prev.maleExam.supine, 
                                          testicular: { 
                                            ...prev.maleExam.supine.testicular, 
                                            [side]: { 
                                              ...prev.maleExam.supine.testicular[side as keyof typeof prev.maleExam.supine.testicular], 
                                              size: value 
                                            }
                                          }
                                        }
                                      }
                                    }))}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                      <SelectValue placeholder="Tamaño" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="aumentado">Aumentado</SelectItem>
                                      <SelectItem value="disminuido">Disminuido</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-white text-xs">Consistencia</Label>
                                  <Select 
                                    value={phase3Data.maleExam.supine.testicular[side as keyof typeof phase3Data.maleExam.supine.testicular].consistency} 
                                    onValueChange={(value) => setPhase3Data(prev => ({ 
                                      ...prev, 
                                      maleExam: { 
                                        ...prev.maleExam, 
                                        supine: { 
                                          ...prev.maleExam.supine, 
                                          testicular: { 
                                            ...prev.maleExam.supine.testicular, 
                                            [side]: { 
                                              ...prev.maleExam.supine.testicular[side as keyof typeof prev.maleExam.supine.testicular], 
                                              consistency: value 
                                            }
                                          }
                                        }
                                      }
                                    }))}>
                                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                      <SelectValue placeholder="Consistencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="dura">Dura</SelectItem>
                                      <SelectItem value="blanda">Blanda</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`testicular-tenderness-${side}`}
                                    checked={phase3Data.maleExam.supine.testicular[side as keyof typeof phase3Data.maleExam.supine.testicular].tenderness}
                                    onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                      ...prev, 
                                      maleExam: { 
                                        ...prev.maleExam, 
                                        supine: { 
                                          ...prev.maleExam.supine, 
                                          testicular: { 
                                            ...prev.maleExam.supine.testicular, 
                                            [side]: { 
                                              ...prev.maleExam.supine.testicular[side as keyof typeof prev.maleExam.supine.testicular], 
                                              tenderness: checked as boolean 
                                            }
                                          }
                                        }
                                      }
                                    }))}
                                  />
                                  <Label htmlFor={`testicular-tenderness-${side}`} className="text-white text-xs">Dolor</Label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Transiluminación</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="transillumination"
                            checked={phase3Data.maleExam.supine.transillumination.performed}
                            onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                              ...prev, 
                              maleExam: { 
                                ...prev.maleExam, 
                                supine: { 
                                  ...prev.maleExam.supine, 
                                  transillumination: { 
                                    ...prev.maleExam.supine.transillumination, 
                                    performed: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="transillumination" className="text-white">Transiluminación realizada</Label>
                        </div>
                        {phase3Data.maleExam.supine.transillumination.performed && (
                          <div className="space-y-2">
                            <Label className="text-white text-sm">Resultados</Label>
                            <Input
                              value={phase3Data.maleExam.supine.transillumination.results}
                              onChange={(e) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  supine: { 
                                    ...prev.maleExam.supine, 
                                    transillumination: { 
                                      ...prev.maleExam.supine.transillumination, 
                                      results: e.target.value 
                                    }
                                  }
                                }
                              }))}
                              placeholder="Hidrocele, quiste, tumor..."
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tacto Rectal */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Tacto Rectal (Decúbito Lateral Izquierdo)</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Inspección y Evaluación Neurológica</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="perianal-lesions"
                              checked={phase3Data.maleExam.rectalExam.perianal.lesions}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    perianal: { 
                                      ...prev.maleExam.rectalExam.perianal, 
                                      lesions: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="perianal-lesions" className="text-white">Lesiones perianales</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="perineal-sensation"
                              checked={phase3Data.maleExam.rectalExam.neurological.perinealSensation}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    neurological: { 
                                      ...prev.maleExam.rectalExam.neurological, 
                                      perinealSensation: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="perineal-sensation" className="text-white">Sensibilidad perineal normal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="anal-reflex"
                              checked={phase3Data.maleExam.rectalExam.neurological.analReflex}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    neurological: { 
                                      ...prev.maleExam.rectalExam.neurological, 
                                      analReflex: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="anal-reflex" className="text-white">Reflejo anal presente</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="bulbocavernosus-reflex"
                              checked={phase3Data.maleExam.rectalExam.neurological.bulbocavernosusReflex}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    neurological: { 
                                      ...prev.maleExam.rectalExam.neurological, 
                                      bulbocavernosusReflex: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="bulbocavernosus-reflex" className="text-white">Reflejo bulbocavernoso presente</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Evaluación de la Próstata</h5>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label className="text-white text-sm">Tono del esfínter</Label>
                            <Select 
                              value={phase3Data.maleExam.rectalExam.digitalRectal.sphincterTone} 
                              onValueChange={(value) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    digitalRectal: { 
                                      ...prev.maleExam.rectalExam.digitalRectal, 
                                      sphincterTone: value 
                                    }
                                  }
                                }
                              }))}>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="disminuido">Disminuido</SelectItem>
                                <SelectItem value="aumentado">Aumentado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Tamaño</Label>
                              <Select 
                                value={phase3Data.maleExam.rectalExam.digitalRectal.prostate.size} 
                                onValueChange={(value) => setPhase3Data(prev => ({ 
                                  ...prev, 
                                  maleExam: { 
                                    ...prev.maleExam, 
                                    rectalExam: { 
                                      ...prev.maleExam.rectalExam, 
                                      digitalRectal: { 
                                        ...prev.maleExam.rectalExam.digitalRectal, 
                                        prostate: { 
                                          ...prev.maleExam.rectalExam.digitalRectal.prostate, 
                                          size: value 
                                        }
                                      }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Tamaño" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal (20-25g)</SelectItem>
                                  <SelectItem value="levemente-aumentada">Leve aumento (25-40g)</SelectItem>
                                  <SelectItem value="moderadamente-aumentada">Moderado aumento (40-80g)</SelectItem>
                                  <SelectItem value="muy-aumentada">Muy aumentada (&gt;80g)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-white text-xs">Consistencia</Label>
                              <Select 
                                value={phase3Data.maleExam.rectalExam.digitalRectal.prostate.consistency} 
                                onValueChange={(value) => setPhase3Data(prev => ({ 
                                  ...prev, 
                                  maleExam: { 
                                    ...prev.maleExam, 
                                    rectalExam: { 
                                      ...prev.maleExam.rectalExam, 
                                      digitalRectal: { 
                                        ...prev.maleExam.rectalExam.digitalRectal, 
                                        prostate: { 
                                          ...prev.maleExam.rectalExam.digitalRectal.prostate, 
                                          consistency: value 
                                        }
                                      }
                                    }
                                  }
                                }))}>
                                <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Consistencia" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="elástica">Elástica (normal)</SelectItem>
                                  <SelectItem value="firme">Firme</SelectItem>
                                  <SelectItem value="dura">Dura</SelectItem>
                                  <SelectItem value="blanda">Blanda</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="central-groove"
                                checked={phase3Data.maleExam.rectalExam.digitalRectal.prostate.centralGroove}
                                onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                  ...prev, 
                                  maleExam: { 
                                    ...prev.maleExam, 
                                    rectalExam: { 
                                      ...prev.maleExam.rectalExam, 
                                      digitalRectal: { 
                                        ...prev.maleExam.rectalExam.digitalRectal, 
                                        prostate: { 
                                          ...prev.maleExam.rectalExam.digitalRectal.prostate, 
                                          centralGroove: checked as boolean 
                                        }
                                      }
                                    }
                                  }
                                }))}
                              />
                              <Label htmlFor="central-groove" className="text-white text-xs">Surco medio presente</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="prostate-nodules"
                                checked={phase3Data.maleExam.rectalExam.digitalRectal.prostate.nodules}
                                onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                  ...prev, 
                                  maleExam: { 
                                    ...prev.maleExam, 
                                    rectalExam: { 
                                      ...prev.maleExam.rectalExam, 
                                      digitalRectal: { 
                                        ...prev.maleExam.rectalExam.digitalRectal, 
                                        prostate: { 
                                          ...prev.maleExam.rectalExam.digitalRectal.prostate, 
                                          nodules: checked as boolean 
                                        }
                                      }
                                    }
                                  }
                                }))}
                              />
                              <Label htmlFor="prostate-nodules" className="text-white text-xs">Nódulos</Label>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="prostate-pain"
                              checked={phase3Data.maleExam.rectalExam.digitalRectal.prostate.pain}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                maleExam: { 
                                  ...prev.maleExam, 
                                  rectalExam: { 
                                    ...prev.maleExam.rectalExam, 
                                    digitalRectal: { 
                                      ...prev.maleExam.rectalExam.digitalRectal, 
                                      prostate: { 
                                        ...prev.maleExam.rectalExam.digitalRectal.prostate, 
                                        pain: checked as boolean 
                                      }
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="prostate-pain" className="text-white text-xs">Dolorosa a la palpación</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {phase3Data.gender === 'female' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Exploración Femenina</h3>
                  
                  {/* Exploración en Posición de Litotomía */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Exploración en Posición de Litotomía (Ginecológica)</h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Genitales Externos</h5>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label className="text-white text-sm">Vulva</Label>
                            <Input
                              value={phase3Data.femaleExam.lithotomy.externalGenitalia.vulva}
                              onChange={(e) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    externalGenitalia: { 
                                      ...prev.femaleExam.lithotomy.externalGenitalia, 
                                      vulva: e.target.value 
                                    }
                                  }
                                }
                              }))}
                              placeholder="Descripción de hallazgos"
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-white text-sm">Meato uretral</Label>
                            <Input
                              value={phase3Data.femaleExam.lithotomy.externalGenitalia.urethralMeatus}
                              onChange={(e) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    externalGenitalia: { 
                                      ...prev.femaleExam.lithotomy.externalGenitalia, 
                                      urethralMeatus: e.target.value 
                                    }
                                  }
                                }
                              }))}
                              placeholder="Carúnculas, prolapsos..."
                              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Prolapso de Órganos Pélvicos (POP)</h5>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <Label className="text-white text-sm">Cistocele (0-4)</Label>
                            <Slider
                              value={[phase3Data.femaleExam.lithotomy.pelvicOrganProlapse.cystocele]}
                              onValueChange={(value) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    pelvicOrganProlapse: { 
                                      ...prev.femaleExam.lithotomy.pelvicOrganProlapse, 
                                      cystocele: value[0] 
                                    }
                                  }
                                }
                              }))}
                              max={4}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-white text-xs text-center">
                              Grado: {phase3Data.femaleExam.lithotomy.pelvicOrganProlapse.cystocele}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-white text-sm">Rectocele (0-4)</Label>
                            <Slider
                              value={[phase3Data.femaleExam.lithotomy.pelvicOrganProlapse.rectocele]}
                              onValueChange={(value) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    pelvicOrganProlapse: { 
                                      ...prev.femaleExam.lithotomy.pelvicOrganProlapse, 
                                      rectocele: value[0] 
                                    }
                                  }
                                }
                              }))}
                              max={4}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-white text-xs text-center">
                              Grado: {phase3Data.femaleExam.lithotomy.pelvicOrganProlapse.rectocele}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Prueba de Esfuerzo</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="stress-test"
                              checked={phase3Data.femaleExam.lithotomy.stressTest.performed}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    stressTest: { 
                                      ...prev.femaleExam.lithotomy.stressTest, 
                                      performed: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="stress-test" className="text-white">Prueba de esfuerzo realizada</Label>
                          </div>
                          {phase3Data.femaleExam.lithotomy.stressTest.performed && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="stress-positive"
                                  checked={phase3Data.femaleExam.lithotomy.stressTest.positive}
                                  onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                    ...prev, 
                                    femaleExam: { 
                                      ...prev.femaleExam, 
                                      lithotomy: { 
                                        ...prev.femaleExam.lithotomy, 
                                        stressTest: { 
                                          ...prev.femaleExam.lithotomy.stressTest, 
                                          positive: checked as boolean 
                                        }
                                      }
                                    }
                                  }))}
                                />
                                <Label htmlFor="stress-positive" className="text-white">Resultado positivo</Label>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-white text-sm">Tipo de fuga</Label>
                                <Input
                                  value={phase3Data.femaleExam.lithotomy.stressTest.leakageType}
                                  onChange={(e) => setPhase3Data(prev => ({ 
                                    ...prev, 
                                    femaleExam: { 
                                      ...prev.femaleExam, 
                                      lithotomy: { 
                                        ...prev.femaleExam.lithotomy, 
                                        stressTest: { 
                                          ...prev.femaleExam.lithotomy.stressTest, 
                                          leakageType: e.target.value 
                                        }
                                      }
                                    }
                                  }))}
                                  placeholder="Gotas, chorro..."
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Test del Q-tip (Hisopo)</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="qtip-test"
                              checked={phase3Data.femaleExam.lithotomy.qtipTest.performed}
                              onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                                ...prev, 
                                femaleExam: { 
                                  ...prev.femaleExam, 
                                  lithotomy: { 
                                    ...prev.femaleExam.lithotomy, 
                                    qtipTest: { 
                                      ...prev.femaleExam.lithotomy.qtipTest, 
                                      performed: checked as boolean 
                                    }
                                  }
                                }
                              }))}
                            />
                            <Label htmlFor="qtip-test" className="text-white">Test realizado</Label>
                          </div>
                          {phase3Data.femaleExam.lithotomy.qtipTest.performed && (
                            <div className="space-y-1">
                              <Label className="text-white text-sm">Ángulo (grados)</Label>
                              <Input
                                type="number"
                                value={phase3Data.femaleExam.lithotomy.qtipTest.angle || ''}
                                onChange={(e) => setPhase3Data(prev => ({ 
                                  ...prev, 
                                  femaleExam: { 
                                    ...prev.femaleExam, 
                                    lithotomy: { 
                                      ...prev.femaleExam.lithotomy, 
                                      qtipTest: { 
                                        ...prev.femaleExam.lithotomy.qtipTest, 
                                        angle: Number(e.target.value) 
                                      }
                                    }
                                  }
                                }))}
                                placeholder="Ángulo de hipermovilidad"
                                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                              />
                              <p className="text-white/60 text-xs">&gt;30° indica hipermovilidad uretral</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Tacto Vaginal</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-white text-sm">Fuerza suelo pélvico (0-5)</Label>
                          <Slider
                            value={[phase3Data.femaleExam.lithotomy.vaginalExam.pelvicFloorStrength]}
                            onValueChange={(value) => setPhase3Data(prev => ({ 
                              ...prev, 
                              femaleExam: { 
                                ...prev.femaleExam, 
                                lithotomy: { 
                                  ...prev.femaleExam.lithotomy, 
                                  vaginalExam: { 
                                    ...prev.femaleExam.lithotomy.vaginalExam, 
                                    pelvicFloorStrength: value[0] 
                                  }
                                }
                              }
                            }))}
                            max={5}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-white text-xs text-center">
                            Fuerza: {phase3Data.femaleExam.lithotomy.vaginalExam.pelvicFloorStrength}/5
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="anterior-wall-pain"
                            checked={phase3Data.femaleExam.lithotomy.vaginalExam.anteriorWallPain}
                            onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                              ...prev, 
                              femaleExam: { 
                                ...prev.femaleExam, 
                                lithotomy: { 
                                  ...prev.femaleExam.lithotomy, 
                                  vaginalExam: { 
                                    ...prev.femaleExam.lithotomy.vaginalExam, 
                                    anteriorWallPain: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="anterior-wall-pain" className="text-white">Dolor pared anterior</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="urethral-diverticula"
                            checked={phase3Data.femaleExam.lithotomy.vaginalExam.urethralDiverticula}
                            onCheckedChange={(checked) => setPhase3Data(prev => ({ 
                              ...prev, 
                              femaleExam: { 
                                ...prev.femaleExam, 
                                lithotomy: { 
                                  ...prev.femaleExam.lithotomy, 
                                  vaginalExam: { 
                                    ...prev.femaleExam.lithotomy.vaginalExam, 
                                    urethralDiverticula: checked as boolean 
                                  }
                                }
                              }
                            }))}
                          />
                          <Label htmlFor="urethral-diverticula" className="text-white">Divertículos uretrales</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FASE 4: PRUEBAS COMPLEMENTARIAS EN CONSULTA Y SÍNTESIS */}
        <Card data-testid="card-fase-4" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-purple-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="h-6 w-6 text-purple-300" />
              Fase 4: Pruebas Complementarias en Consulta y Síntesis
              <Badge className="ml-auto bg-purple-200/30 text-white border border-white/20">
                Diagnóstico Final
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Cuestionarios Validados */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-purple-300" />
                  Cuestionarios Validados
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* IPSS */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Escala IPSS (International Prostate Symptom Score)</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'incompleteEmptying', label: 'Sensación de vaciado incompleto' },
                        { key: 'frequency', label: 'Frecuencia' },
                        { key: 'intermittency', label: 'Intermitencia' },
                        { key: 'urgency', label: 'Urgencia' },
                        { key: 'weakStream', label: 'Flujo débil' },
                        { key: 'straining', label: 'Pujo' },
                        { key: 'nocturia', label: 'Nocturia' }
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <Label className="text-white text-sm">{item.label}</Label>
                          <Slider
                            value={[phase4Data.questionnaires.ipss[item.key as keyof typeof phase4Data.questionnaires.ipss]]}
                            onValueChange={(value) => setPhase4Data(prev => ({ 
                              ...prev, 
                              questionnaires: { 
                                ...prev.questionnaires, 
                                ipss: { 
                                  ...prev.questionnaires.ipss, 
                                  [item.key]: value[0] 
                                }
                              }
                            }))}
                            max={5}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-white text-xs text-center">
                            {phase4Data.questionnaires.ipss[item.key as keyof typeof phase4Data.questionnaires.ipss]}/5
                          </div>
                        </div>
                      ))}
                      <div className="space-y-1">
                        <Label className="text-white text-sm">Calidad de vida</Label>
                        <Slider
                          value={[phase4Data.questionnaires.ipss.qualityOfLife]}
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            questionnaires: { 
                              ...prev.questionnaires, 
                              ipss: { ...prev.questionnaires.ipss, qualityOfLife: value[0] }
                            }
                          }))}
                          max={6}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-white text-xs text-center">
                          {phase4Data.questionnaires.ipss.qualityOfLife}/6
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-white">
                        <div className="font-bold">Puntuación IPSS: {ipssResult.score}</div>
                        <div className="text-sm">Severidad: {ipssResult.severity}</div>
                        <div className="text-xs text-white/80">{ipssResult.recommendation}</div>
                      </div>
                    </div>
                  </div>

                  {/* ICIQ-SF */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">ICIQ-SF (Incontinence Quality of Life)</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'frequency', label: 'Frecuencia de pérdidas' },
                        { key: 'amount', label: 'Cantidad de orina' },
                        { key: 'impact', label: 'Impacto en vida diaria' }
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <Label className="text-white text-sm">{item.label}</Label>
                          <Slider
                            value={[phase4Data.questionnaires.iciq[item.key as keyof typeof phase4Data.questionnaires.iciq]]}
                            onValueChange={(value) => setPhase4Data(prev => ({ 
                              ...prev, 
                              questionnaires: { 
                                ...prev.questionnaires, 
                                iciq: { 
                                  ...prev.questionnaires.iciq, 
                                  [item.key]: value[0] 
                                }
                              }
                            }))}
                            max={item.key === 'impact' ? 10 : 5}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-white text-xs text-center">
                            {phase4Data.questionnaires.iciq[item.key as keyof typeof phase4Data.questionnaires.iciq]}/{item.key === 'impact' ? 10 : 5}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                      <div className="text-white">
                        <div className="font-bold">Puntuación ICIQ: {iciqResult.score}</div>
                        <div className="text-sm">Severidad: {iciqResult.severity}</div>
                        <div className="text-xs text-white/80">{iciqResult.recommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IIEF-5 (solo para hombres) */}
                {phase3Data.gender === 'male' && (
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">IIEF-5 (Función Eréctil - Solo Hombres)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { key: 'confidence', label: 'Confianza' },
                        { key: 'firmness', label: 'Firmeza' },
                        { key: 'maintenance', label: 'Mantenimiento' },
                        { key: 'satisfaction', label: 'Satisfacción' },
                        { key: 'frequency', label: 'Frecuencia' }
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <Label className="text-white text-sm">{item.label}</Label>
                          <Slider
                            value={[phase4Data.questionnaires.iief5[item.key as keyof typeof phase4Data.questionnaires.iief5]]}
                            onValueChange={(value) => setPhase4Data(prev => ({ 
                              ...prev, 
                              questionnaires: { 
                                ...prev.questionnaires, 
                                iief5: { 
                                  ...prev.questionnaires.iief5, 
                                  [item.key]: value[0] 
                                }
                              }
                            }))}
                            max={5}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-white text-xs text-center">
                            {phase4Data.questionnaires.iief5[item.key as keyof typeof phase4Data.questionnaires.iief5]}/5
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {iiefResult && (
                      <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                        <div className="text-white">
                          <div className="font-bold">Puntuación IIEF-5: {iiefResult.score}</div>
                          <div className="text-sm">Función eréctil: {iiefResult.severity}</div>
                          <div className="text-xs text-white/80">{iiefResult.recommendation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator className="border-white/20" />

              {/* Pruebas Complementarias */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-300" />
                  Pruebas Complementarias en Consulta
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Uroanálisis */}
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                    <h4 className="font-medium text-white">Uroanálisis con Tira Reactiva</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Color</Label>
                        <Select 
                          value={phase4Data.urinalysis.color} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, color: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amarillo-claro">Amarillo claro</SelectItem>
                            <SelectItem value="amarillo">Amarillo</SelectItem>
                            <SelectItem value="ambar">Ámbar</SelectItem>
                            <SelectItem value="rojo">Rojo</SelectItem>
                            <SelectItem value="marron">Marrón</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Claridad</Label>
                        <Select 
                          value={phase4Data.urinalysis.clarity} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, clarity: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Claridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clara">Clara</SelectItem>
                            <SelectItem value="turbia">Turbia</SelectItem>
                            <SelectItem value="muy-turbia">Muy turbia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Proteína</Label>
                        <Select 
                          value={phase4Data.urinalysis.protein} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, protein: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Proteína" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="negativo">Negativo</SelectItem>
                            <SelectItem value="trazas">Trazas</SelectItem>
                            <SelectItem value="1+">1+</SelectItem>
                            <SelectItem value="2+">2+</SelectItem>
                            <SelectItem value="3+">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Sangre</Label>
                        <Select 
                          value={phase4Data.urinalysis.blood} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, blood: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Sangre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="negativo">Negativo</SelectItem>
                            <SelectItem value="trazas">Trazas</SelectItem>
                            <SelectItem value="1+">1+</SelectItem>
                            <SelectItem value="2+">2+</SelectItem>
                            <SelectItem value="3+">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Leucocitos</Label>
                        <Select 
                          value={phase4Data.urinalysis.leukocytes} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, leukocytes: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Leucocitos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="negativo">Negativo</SelectItem>
                            <SelectItem value="trazas">Trazas</SelectItem>
                            <SelectItem value="1+">1+</SelectItem>
                            <SelectItem value="2+">2+</SelectItem>
                            <SelectItem value="3+">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Nitritos</Label>
                        <Select 
                          value={phase4Data.urinalysis.nitrites} 
                          onValueChange={(value) => setPhase4Data(prev => ({ 
                            ...prev, 
                            urinalysis: { ...prev.urinalysis, nitrites: value }
                          }))}>
                          <SelectTrigger className="bg-white/5 border-white/20 text-white text-xs">
                            <SelectValue placeholder="Nitritos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="negativo">Negativo</SelectItem>
                            <SelectItem value="positivo">Positivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Flujometría y POCUS */}
                  <div className="space-y-4">
                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                      <h4 className="font-medium text-white">Flujometría Urinaria</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="uroflowmetry"
                          checked={phase4Data.uroflowmetry.performed}
                          onCheckedChange={(checked) => setPhase4Data(prev => ({ 
                            ...prev, 
                            uroflowmetry: { ...prev.uroflowmetry, performed: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="uroflowmetry" className="text-white">Flujometría realizada</Label>
                      </div>
                      {phase4Data.uroflowmetry.performed && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-white text-xs">Flujo máximo (ml/s)</Label>
                            <Input
                              type="number"
                              value={phase4Data.uroflowmetry.maxFlow || ''}
                              onChange={(e) => setPhase4Data(prev => ({ 
                                ...prev, 
                                uroflowmetry: { ...prev.uroflowmetry, maxFlow: Number(e.target.value) }
                              }))}
                              className="bg-white/5 border-white/20 text-white text-xs"
                              placeholder="ml/s"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-white text-xs">Residuo post-miccional (ml)</Label>
                            <Input
                              type="number"
                              value={phase4Data.uroflowmetry.postVoidResidual || ''}
                              onChange={(e) => setPhase4Data(prev => ({ 
                                ...prev, 
                                uroflowmetry: { ...prev.uroflowmetry, postVoidResidual: Number(e.target.value) }
                              }))}
                              className="bg-white/5 border-white/20 text-white text-xs"
                              placeholder="ml"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                      <h4 className="font-medium text-white">Ecografía POCUS</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-white text-xs">Riñón derecho (cm)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={phase4Data.pocus.kidneys.right.size || ''}
                            onChange={(e) => setPhase4Data(prev => ({ 
                              ...prev, 
                              pocus: { 
                                ...prev.pocus, 
                                kidneys: { 
                                  ...prev.pocus.kidneys, 
                                  right: { 
                                    ...prev.pocus.kidneys.right, 
                                    size: Number(e.target.value) 
                                  }
                                }
                              }
                            }))}
                            className="bg-white/5 border-white/20 text-white text-xs"
                            placeholder="11.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-white text-xs">Residuo vesical (ml)</Label>
                          <Input
                            type="number"
                            value={phase4Data.pocus.bladder.postVoidResidual || ''}
                            onChange={(e) => setPhase4Data(prev => ({ 
                              ...prev, 
                              pocus: { 
                                ...prev.pocus, 
                                bladder: { 
                                  ...prev.pocus.bladder, 
                                  postVoidResidual: Number(e.target.value) 
                                }
                              }
                            }))}
                            className="bg-white/5 border-white/20 text-white text-xs"
                            placeholder="< 50 ml normal"
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

        {/* Botón de Finalizar */}
        <div className="text-center">
          <Button 
            onClick={handleComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            data-testid="button-complete-exam"
          >
            <Users className="h-5 w-5 mr-2" />
            Completar Examen Urológico Optimizado
          </Button>
        </div>
      </div>
    </div>
  );
}