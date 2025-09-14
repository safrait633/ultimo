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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Activity, 
  Stethoscope, 
  Calculator, 
  AlertTriangle,
  TrendingUp,
  Timer,
  BarChart3,
  User,
  Zap,
  Eye,
  Hand,
  Thermometer,
  Target,
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface AdvancedCardiologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface PulseEvaluation {
  [key: string]: number;
}

interface VitalSigns {
  systolic: number;
  diastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
}

export default function AdvancedCardiologyForm({
  patientData,
  onDataChange,
  onComplete
}: AdvancedCardiologyFormProps) {
  
  // Estados principales del examen cardiológico
  const [examData, setExamData] = useState({
    // SÍNTOMAS CARDIOVASCULARES
    symptoms: {
      chestPain: false,
      chestPainDetails: {
        character: "",
        intensity: "",
        location: "",
        radiation: "",
        duration: "",
        triggers: [],
        relievers: []
      },
      dyspnea: false,
      dyspneaDetails: {
        type: "", // esfuerzo, reposo, ortopnea, paroxística
        severity: "",
        triggers: []
      },
      palpitations: false,
      syncope: false,
      presyncope: false,
      orthopnea: false,
      paroxysmalNocturnal: false,
      lowerExtremityEdema: false,
      fatigue: false,
      claudication: false
    },
    
    // FACTORES DE RIESGO CARDIOVASCULAR - NUEVOS ELEMENTOS HTML AÑADIDOS
    riskFactors: {
      hypertension: false,
      diabetes: false,
      dyslipidemia: false,
      smoking: false,
      familyHistory: false,
      sedentarism: false,
      obesity: false,
      stress: false,
      alcoholism: false,
      age: "",
      gender: ""
    },
    
    // SIGNOS VITALES
    vitalSigns: {
      systolic: 0,
      diastolic: 0,
      heartRate: 0,
      respiratoryRate: 0,
      temperature: 0,
      oxygenSaturation: 0,
      pulseQuality: "",
      rhythm: ""
    },
    
    // INSPECCIÓN GENERAL
    generalInspection: {
      habitus: "",
      hydration: "",
      cyanosis: false,
      pallor: false,
      dyspneaAtRest: false,
      distress: false,
      jugularDistension: false,
      peripheralEdema: false
    },
    
    // EXAMEN FÍSICO CARDIOVASCULAR
    cardiovascularExam: {
      // Inspección del tórax
      chestInspection: {
        shape: "",
        deformities: [],
        visiblePulsations: false,
        scars: []
      },
      
      // Palpación cardíaca
      palpation: {
        apicalImpulse: {
          location: "",
          diameter: "",
          amplitude: "",
          duration: "",
          displaced: false
        },
        thrills: {
          systolic: false,
          diastolic: false,
          location: ""
        },
        paresternalLift: false,
        p2Palpable: false
      },
      
      // Auscultación por focos
      auscultation: {
        aortic: {
          s1: "",
          s2: "",
          systolicMurmur: {
            present: false,
            grade: "",
            character: "",
            radiation: ""
          },
          diastolicMurmur: {
            present: false,
            grade: "",
            character: "",
            radiation: ""
          }
        },
        pulmonary: {
          s1: "",
          s2: "",
          s2Split: false,
          systolicMurmur: {
            present: false,
            grade: "",
            character: "",
            radiation: ""
          }
        },
        tricuspid: {
          s1: "",
          s2: "",
          systolicMurmur: {
            present: false,
            grade: "",
            character: "",
            radiation: ""
          }
        },
        mitral: {
          s1: "",
          s2: "",
          systolicMurmur: {
            present: false,
            grade: "",
            character: "",
            radiation: ""
          },
          diastolicMurmur: {
            present: false,
            grade: "",
            character: ""
          }
        },
        additionalSounds: {
          s3: false,
          s4: false,
          openingSnap: false,
          pericardialFriction: false,
          gallop: false,
          click: false
        }
      }
    },
    
    // EXAMEN VASCULAR PERIFÉRICO - NUEVOS ELEMENTOS HTML AÑADIDOS
    vascularExam: {
      pulses: {
        carotid: { right: "", left: "", bruits: false },
        radial: { right: "", left: "" },
        brachial: { right: "", left: "" },
        femoral: { right: "", left: "" },
        popliteal: { right: "", left: "" },
        posteriorTibial: { right: "", left: "" },
        dorsalisPedis: { right: "", left: "" }
      },
      bloodPressure: {
        rightArm: { systolic: 0, diastolic: 0 },
        leftArm: { systolic: 0, diastolic: 0 },
        ankleIndex: 0
      }
    }
  });

  // Handler para cambios en murmullos
  const handleMurmurToggle = (focus: string, type: "systolic" | "diastolic", checked: boolean) => {
    setExamData(prev => ({
      ...prev,
      cardiovascularExam: {
        ...prev.cardiovascularExam,
        auscultation: {
          ...prev.cardiovascularExam.auscultation,
          [focus]: {
            ...prev.cardiovascularExam.auscultation[focus as keyof typeof prev.cardiovascularExam.auscultation],
            [`${type}Murmur`]: {
              ...prev.cardiovascularExam.auscultation[focus as keyof typeof prev.cardiovascularExam.auscultation][`${type}Murmur` as keyof any],
              present: checked
            }
          }
        }
      }
    }));
  };

  // Handler para completar el examen
  const handleComplete = () => {
    if (onComplete) {
      onComplete(examData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-red-300" />
            <h1 className="text-4xl font-bold text-white">Exploración Cardiovascular Optimizada</h1>
          </div>
          <p className="text-white/80 text-lg">Protocolo clínico de 4 fases basado en posición del paciente</p>
          {patientData && (
            <div className="flex items-center justify-center gap-3 mt-4 bg-white/10 rounded-xl px-4 py-2 border border-white/20">
              <User className="h-5 w-5 text-blue-200" />
              <span className="text-white font-semibold">
                {patientData.name} {patientData.surname}
                {patientData.age && (
                  <span className="ml-2 text-white/70 font-normal">({patientData.age} años{patientData.gender ? `, ${patientData.gender}` : ""})</span>
                )}
              </span>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <Badge className="bg-blue-500/30 text-white border border-white/20">Fase 1: Sentado</Badge>
            <Badge className="bg-green-500/30 text-white border border-white/20">Fase 2: 30-45°</Badge>
            <Badge className="bg-orange-500/30 text-white border border-white/20">Fase 3: 0°</Badge>
            <Badge className="bg-purple-500/30 text-white border border-white/20">Fase 4: Post-Examen</Badge>
          </div>
        </div>

        {/* FASE 1: CONTACTO INICIAL (PACIENTE SENTADO) */}
        <Card data-testid="card-fase-1" className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-blue-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-6 w-6 text-blue-300" />
              Fase 1: Contacto Inicial (Paciente Sentado)
              <Badge className="ml-auto bg-blue-200/30 text-white border border-white/20">
                Evaluación Inicial
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              
              {/* Síntomas Cardiovasculares Principales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  Síntomas Cardiovasculares Principales
                </h3>
                
                {/* Dolor Torácico - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chest-pain"
                      checked={examData.symptoms.chestPain}
                      onCheckedChange={(checked) =>
                        setExamData(prev => ({
                          ...prev,
                          symptoms: { ...prev.symptoms, chestPain: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="chest-pain" className="text-white cursor-pointer">
                      Dolor Torácico 💔
                    </Label>
                  </div>
                  
                  {/* Detalles del dolor torácico */}
                  {examData.symptoms.chestPain && (
                    <div className="ml-6 space-y-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      {/* Características del dolor - RADIO GROUP EXISTENTE MANTENIDO */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Características del dolor:</Label>
                        <RadioGroup
                          value={examData.symptoms.chestPainDetails.character}
                          onValueChange={(value) => 
                            setExamData(prev => ({
                              ...prev,
                              symptoms: {
                                ...prev.symptoms,
                                chestPainDetails: { ...prev.symptoms.chestPainDetails, character: value }
                              }
                            }))
                          }
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="opresivo" id="opresivo" />
                            <Label htmlFor="opresivo" className="text-xs cursor-pointer text-white">
                              Opresivo 💪
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="punzante" id="punzante" />
                            <Label htmlFor="punzante" className="text-xs cursor-pointer text-white">
                              Punzante ⚡
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="urente" id="urente" />
                            <Label htmlFor="urente" className="text-xs cursor-pointer text-white">
                              Urente 🔥
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="constrictivo" id="constrictivo" />
                            <Label htmlFor="constrictivo" className="text-xs cursor-pointer text-white">
                              Constrictivo 🤏
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* NUEVOS ELEMENTOS HTML AÑADIDOS - Intensidad del Dolor */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-white">Intensidad del dolor (1-10):</Label>
                        <RadioGroup
                          value={examData.symptoms.chestPainDetails.intensity}
                          onValueChange={(value) => 
                            setExamData(prev => ({
                              ...prev,
                              symptoms: {
                                ...prev.symptoms,
                                chestPainDetails: { ...prev.symptoms.chestPainDetails, intensity: value }
                              }
                            }))
                          }
                          className="flex flex-wrap gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-3" id="intensity-low" />
                            <Label htmlFor="intensity-low" className="text-xs cursor-pointer text-green-300">
                              Leve (1-3) 😌
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4-6" id="intensity-moderate" />
                            <Label htmlFor="intensity-moderate" className="text-xs cursor-pointer text-yellow-300">
                              Moderado (4-6) 😐
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="7-8" id="intensity-severe" />
                            <Label htmlFor="intensity-severe" className="text-xs cursor-pointer text-orange-300">
                              Intenso (7-8) 😣
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="9-10" id="intensity-extreme" />
                            <Label htmlFor="intensity-extreme" className="text-xs cursor-pointer text-red-300">
                              Severo (9-10) 😫
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* NUEVOS ELEMENTOS HTML AÑADIDOS - Localización del Dolor */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-white">Localización:</Label>
                        <RadioGroup
                          value={examData.symptoms.chestPainDetails.location}
                          onValueChange={(value) => 
                            setExamData(prev => ({
                              ...prev,
                              symptoms: {
                                ...prev.symptoms,
                                chestPainDetails: { ...prev.symptoms.chestPainDetails, location: value }
                              }
                            }))
                          }
                          className="flex flex-wrap gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="retroesternal" id="retroesternal" />
                            <Label htmlFor="retroesternal" className="text-xs cursor-pointer text-white">
                              Retroesternal 🎯
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="precordial" id="precordial" />
                            <Label htmlFor="precordial" className="text-xs cursor-pointer text-white">
                              Precordial 💓
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lateral" id="lateral" />
                            <Label htmlFor="lateral" className="text-xs cursor-pointer text-white">
                              Lateral 👈
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="epigastrico" id="epigastrico" />
                            <Label htmlFor="epigastrico" className="text-xs cursor-pointer text-white">
                              Epigástrico 🔻
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </div>

                {/* Disnea - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dyspnea"
                      checked={examData.symptoms.dyspnea}
                      onCheckedChange={(checked) =>
                        setExamData(prev => ({
                          ...prev,
                          symptoms: { ...prev.symptoms, dyspnea: checked as boolean }
                        }))
                      }
                    />
                    <Label htmlFor="dyspnea" className="text-white cursor-pointer">
                      Disnea 🫁
                    </Label>
                  </div>

                  {/* NUEVOS ELEMENTOS HTML AÑADIDOS - Tipo de Disnea */}
                  {examData.symptoms.dyspnea && (
                    <div className="ml-6 space-y-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <Label className="text-xs font-medium text-white">Tipo de disnea:</Label>
                      <RadioGroup
                        value={examData.symptoms.dyspneaDetails.type}
                        onValueChange={(value) => 
                          setExamData(prev => ({
                            ...prev,
                            symptoms: {
                              ...prev.symptoms,
                              dyspneaDetails: { ...prev.symptoms.dyspneaDetails, type: value }
                            }
                          }))
                        }
                        className="flex flex-wrap gap-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="esfuerzo" id="dyspnea-effort" />
                          <Label htmlFor="dyspnea-effort" className="text-xs cursor-pointer text-white">
                            De esfuerzo 🏃
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reposo" id="dyspnea-rest" />
                          <Label htmlFor="dyspnea-rest" className="text-xs cursor-pointer text-white">
                            De reposo 🛋️
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ortopnea" id="dyspnea-ortho" />
                          <Label htmlFor="dyspnea-ortho" className="text-xs cursor-pointer text-white">
                            Ortopnea 🛏️
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paroxistica" id="dyspnea-parox" />
                          <Label htmlFor="dyspnea-parox" className="text-xs cursor-pointer text-white">
                            Paroxística nocturna 🌙
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>

              {/* Otros síntomas cardiovasculares - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-300" />
                  Otros Síntomas Cardiovasculares
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "palpitations", label: "Palpitaciones 💓" },
                    { key: "syncope", label: "Síncope 😵" },
                    { key: "presyncope", label: "Presíncope 😴" },
                    { key: "orthopnea", label: "Ortopnea 🛏️" },
                    { key: "paroxysmalNocturnal", label: "Disnea paroxística nocturna 🌙" },
                    { key: "lowerExtremityEdema", label: "Edema MMII 🦵" },
                    { key: "fatigue", label: "Fatiga 😴" },
                    { key: "claudication", label: "Claudicación 🚶" }
                  ].map((symptom) => (
                    <div key={symptom.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom.key}
                        checked={examData.symptoms[symptom.key as keyof typeof examData.symptoms] as boolean}
                        onCheckedChange={(checked) =>
                          setExamData(prev => ({
                            ...prev,
                            symptoms: { ...prev.symptoms, [symptom.key]: checked }
                          }))
                        }
                      />
                      <Label htmlFor={symptom.key} className="text-white text-sm cursor-pointer">
                        {symptom.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* NUEVOS ELEMENTOS HTML AÑADIDOS - Factores de Riesgo Cardiovascular */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-300" />
                  Factores de Riesgo Cardiovascular
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "hypertension", label: "HTA 🩺" },
                    { key: "diabetes", label: "DM 🍯" },
                    { key: "dyslipidemia", label: "Dislipidemia 🧈" },
                    { key: "smoking", label: "Tabaquismo 🚬" },
                    { key: "familyHistory", label: "Antec. Familiares 👪" },
                    { key: "sedentarism", label: "Sedentarismo 🛋️" },
                    { key: "obesity", label: "Obesidad ⚖️" },
                    { key: "stress", label: "Estrés 😰" },
                    { key: "alcoholism", label: "Alcoholismo 🍺" }
                  ].map((risk) => (
                    <div key={risk.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`risk-${risk.key}`}
                        checked={examData.riskFactors[risk.key as keyof typeof examData.riskFactors] as boolean}
                        onCheckedChange={(checked) =>
                          setExamData(prev => ({
                            ...prev,
                            riskFactors: { ...prev.riskFactors, [risk.key]: checked }
                          }))
                        }
                      />
                      <Label htmlFor={`risk-${risk.key}`} className="text-white text-xs cursor-pointer">
                        {risk.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signos Vitales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-300" />
                  Signos Vitales
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Presión Arterial (mmHg)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Sistólica"
                        value={examData.vitalSigns.systolic || ""}
                        onChange={(e) => setExamData(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, systolic: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                      <Input
                        type="number"
                        placeholder="Diastólica"
                        value={examData.vitalSigns.diastolic || ""}
                        onChange={(e) => setExamData(prev => ({
                          ...prev,
                          vitalSigns: { ...prev.vitalSigns, diastolic: parseInt(e.target.value) || 0 }
                        }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Frecuencia Cardíaca (lpm)</Label>
                    <Input
                      type="number"
                      placeholder="FC"
                      value={examData.vitalSigns.heartRate || ""}
                      onChange={(e) => setExamData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, heartRate: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Saturación O₂ (%)</Label>
                    <Input
                      type="number"
                      placeholder="SatO₂"
                      value={examData.vitalSigns.oxygenSaturation || ""}
                      onChange={(e) => setExamData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, oxygenSaturation: parseInt(e.target.value) || 0 }
                      }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                {/* NUEVOS ELEMENTOS HTML AÑADIDOS - Ritmo Cardíaco */}
                <div className="space-y-2">
                  <Label className="text-white text-sm">Ritmo cardíaco:</Label>
                  <RadioGroup
                    value={examData.vitalSigns.rhythm}
                    onValueChange={(value) => 
                      setExamData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, rhythm: value }
                      }))
                    }
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regular" id="rhythm-regular" />
                      <Label htmlFor="rhythm-regular" className="text-white text-sm cursor-pointer">
                        Regular 📊
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="irregular" id="rhythm-irregular" />
                      <Label htmlFor="rhythm-irregular" className="text-white text-sm cursor-pointer">
                        Irregular 📈
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fibrilacion" id="rhythm-afib" />
                      <Label htmlFor="rhythm-afib" className="text-white text-sm cursor-pointer">
                        Fibrilación 🌊
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Inspección General - NUEVOS ELEMENTOS HTML AÑADIDOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-300" />
                  Inspección General
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Hábito Constitucional</Label>
                    <RadioGroup
                      value={examData.generalInspection.habitus}
                      onValueChange={(value) => 
                        setExamData(prev => ({
                          ...prev,
                          generalInspection: { ...prev.generalInspection, habitus: value }
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normosomico" id="habitus-normal" />
                        <Label htmlFor="habitus-normal" className="text-white text-sm cursor-pointer">
                          Normosómico 👤
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="astenico" id="habitus-thin" />
                        <Label htmlFor="habitus-thin" className="text-white text-sm cursor-pointer">
                          Asténico 🪶
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="picnico" id="habitus-robust" />
                        <Label htmlFor="habitus-robust" className="text-white text-sm cursor-pointer">
                          Pícnico 🫃
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white">Signos Observables</Label>
                    <div className="space-y-2">
                      {[
                        { key: "cyanosis", label: "Cianosis 🟦" },
                        { key: "pallor", label: "Palidez ⚪" },
                        { key: "dyspneaAtRest", label: "Disnea en reposo 😮‍💨" },
                        { key: "distress", label: "Distress respiratorio 😰" },
                        { key: "jugularDistension", label: "Distensión yugular 🗼" },
                        { key: "peripheralEdema", label: "Edema periférico 💧" }
                      ].map((sign) => (
                        <div key={sign.key} className="flex items-center space-x-2">
                          <Checkbox 
                            id={sign.key} 
                            checked={examData.generalInspection[sign.key as keyof typeof examData.generalInspection] as boolean}
                            onCheckedChange={(checked) => setExamData(prev => ({ 
                              ...prev, 
                              generalInspection: { ...prev.generalInspection, [sign.key]: checked as boolean }
                            }))}
                          />
                          <Label htmlFor={sign.key} className="text-white text-sm cursor-pointer">{sign.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 2: AUSCULTACIÓN CARDÍACA DETALLADA */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-green-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Stethoscope className="h-6 w-6 text-green-300" />
              Fase 2: Auscultación Cardíaca por Focos
              <Badge className="ml-auto bg-green-200/30 text-white border border-white/20">
                Examen Detallado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              
              {/* Focos de auscultación - ELEMENTOS HTML EXISTENTES MANTENIDOS Y MEJORADOS */}
              {[
                { name: "aortic", label: "Foco Aórtico (2° EIC derecho)", icon: "🎯", color: "red" },
                { name: "pulmonary", label: "Foco Pulmonar (2° EIC izquierdo)", icon: "🫁", color: "blue" },
                { name: "tricuspid", label: "Foco Tricúspide (4° EIC izquierdo)", icon: "🔺", color: "green" },
                { name: "mitral", label: "Foco Mitral (5° EIC izquierdo/ápex)", icon: "💎", color: "purple" }
              ].map((focus) => (
                <div key={focus.name} className={`space-y-4 p-6 bg-${focus.color}-500/10 rounded-xl border border-${focus.color}-500/20`}>
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>{focus.icon}</span>
                    {focus.label}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* R1 */}
                    <div className="space-y-2">
                      <Label className="text-sm text-white">R1:</Label>
                      <Select 
                        value={examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation]?.s1 || ""}
                        onValueChange={(value) => 
                          setExamData(prev => ({
                            ...prev,
                            cardiovascularExam: {
                              ...prev.cardiovascularExam,
                              auscultation: {
                                ...prev.cardiovascularExam.auscultation,
                                [focus.name]: {
                                  ...prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation],
                                  s1: value
                                }
                              }
                            }
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="R1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="hipofonético">Hipofonético</SelectItem>
                          <SelectItem value="hiperfonético">Hiperfonético</SelectItem>
                          <SelectItem value="abolido">Abolido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* R2 */}
                    <div className="space-y-2">
                      <Label className="text-sm text-white">R2:</Label>
                      <Select 
                        value={examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation]?.s2 || ""}
                        onValueChange={(value) => 
                          setExamData(prev => ({
                            ...prev,
                            cardiovascularExam: {
                              ...prev.cardiovascularExam,
                              auscultation: {
                                ...prev.cardiovascularExam.auscultation,
                                [focus.name]: {
                                  ...prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation],
                                  s2: value
                                }
                              }
                            }
                          }))
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="R2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="hipofonético">Hipofonético</SelectItem>
                          <SelectItem value="hiperfonético">Hiperfonético</SelectItem>
                          <SelectItem value="abolido">Abolido</SelectItem>
                          <SelectItem value="desdoblado">Desdoblado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Espacio para mantener diseño */}
                    <div></div>
                  </div>
                  
                  {/* Soplos - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
                  <div className="space-y-4">
                    {/* Soplo Sistólico */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-white">Soplo sistólico:</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.systolicMurmur?.present || false}
                            onCheckedChange={(checked) => handleMurmurToggle(focus.name, "systolic", checked as boolean)}
                          />
                          {(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.systolicMurmur?.present && (
                            <Select
                              value={(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.systolicMurmur?.grade || ""}
                              onValueChange={(value) => 
                                setExamData(prev => ({
                                  ...prev,
                                  cardiovascularExam: {
                                    ...prev.cardiovascularExam,
                                    auscultation: {
                                      ...prev.cardiovascularExam.auscultation,
                                      [focus.name]: {
                                        ...prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation],
                                        systolicMurmur: {
                                          ...(prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation] as any).systolicMurmur,
                                          grade: value
                                        }
                                      }
                                    }
                                  }
                                }))
                              }
                            >
                              <SelectTrigger className="w-20 text-xs bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="-" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">I/VI</SelectItem>
                                <SelectItem value="2">II/VI</SelectItem>
                                <SelectItem value="3">III/VI</SelectItem>
                                <SelectItem value="4">IV/VI</SelectItem>
                                <SelectItem value="5">V/VI</SelectItem>
                                <SelectItem value="6">VI/VI</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Soplo Diastólico (solo para Aórtico y Mitral) - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
                    {(focus.name === "aortic" || focus.name === "mitral") && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-white">Soplo diastólico:</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.diastolicMurmur?.present || false}
                              onCheckedChange={(checked) => handleMurmurToggle(focus.name, "diastolic", checked as boolean)}
                            />
                            {(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.diastolicMurmur?.present && (
                              <Select
                                value={(examData.cardiovascularExam.auscultation[focus.name as keyof typeof examData.cardiovascularExam.auscultation] as any)?.diastolicMurmur?.grade || ""}
                                onValueChange={(value) => 
                                  setExamData(prev => ({
                                    ...prev,
                                    cardiovascularExam: {
                                      ...prev.cardiovascularExam,
                                      auscultation: {
                                        ...prev.cardiovascularExam.auscultation,
                                        [focus.name]: {
                                          ...prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation],
                                          diastolicMurmur: {
                                            ...(prev.cardiovascularExam.auscultation[focus.name as keyof typeof prev.cardiovascularExam.auscultation] as any).diastolicMurmur,
                                            grade: value
                                          }
                                        }
                                      }
                                    }
                                  }))
                                }
                              >
                                <SelectTrigger className="w-20 text-xs bg-white/5 border-white/20 text-white">
                                  <SelectValue placeholder="-" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">I/VI</SelectItem>
                                  <SelectItem value="2">II/VI</SelectItem>
                                  <SelectItem value="3">III/VI</SelectItem>
                                  <SelectItem value="4">IV/VI</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Desdoblamiento R2 (solo para pulmonar) - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
                    {focus.name === "pulmonary" && (
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-white">Desdoblamiento R2:</Label>
                        <Checkbox
                          checked={examData.cardiovascularExam.auscultation.pulmonary.s2Split}
                          onCheckedChange={(checked) => 
                            setExamData(prev => ({
                              ...prev,
                              cardiovascularExam: {
                                ...prev.cardiovascularExam,
                                auscultation: {
                                  ...prev.cardiovascularExam.auscultation,
                                  pulmonary: { 
                                    ...prev.cardiovascularExam.auscultation.pulmonary, 
                                    s2Split: checked as boolean 
                                  }
                                }
                              }
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Ruidos adicionales - ELEMENTOS HTML EXISTENTES MANTENIDOS */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-300" />
                  Ruidos Adicionales
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: "s3", label: "R3 (Galope ventricular)", icon: "3️⃣" },
                    { key: "s4", label: "R4 (Galope auricular)", icon: "4️⃣" },
                    { key: "openingSnap", label: "Chasquido de apertura", icon: "🔊" },
                    { key: "pericardialFriction", label: "Roce pericárdico", icon: "🎵" },
                    { key: "gallop", label: "Ritmo de galope", icon: "🐎" },
                    { key: "click", label: "Click sistólico", icon: "🔘" }
                  ].map((sound) => (
                    <div key={sound.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={sound.key}
                        checked={examData.cardiovascularExam.auscultation.additionalSounds[sound.key as keyof typeof examData.cardiovascularExam.auscultation.additionalSounds] as boolean}
                        onCheckedChange={(checked) =>
                          setExamData(prev => ({
                            ...prev,
                            cardiovascularExam: {
                              ...prev.cardiovascularExam,
                              auscultation: {
                                ...prev.cardiovascularExam.auscultation,
                                additionalSounds: { 
                                  ...prev.cardiovascularExam.auscultation.additionalSounds, 
                                  [sound.key]: checked 
                                }
                              }
                            }
                          }))
                        }
                      />
                      <Label htmlFor={sound.key} className="text-white text-sm cursor-pointer">
                        {sound.icon} {sound.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FASE 3: NUEVOS ELEMENTOS HTML AÑADIDOS - Examen Vascular Periférico */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="backdrop-blur-sm bg-orange-500/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Hand className="h-6 w-6 text-orange-300" />
              Fase 3: Examen Vascular Periférico
              <Badge className="ml-auto bg-orange-200/30 text-white border border-white/20">
                Pulsos y Circulación
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              
              {/* Evaluación de Pulsos */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-300" />
                  Evaluación de Pulsos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "carotid", label: "Carótida", sides: ["right", "left"] },
                    { key: "radial", label: "Radial", sides: ["right", "left"] },
                    { key: "brachial", label: "Braquial", sides: ["right", "left"] },
                    { key: "femoral", label: "Femoral", sides: ["right", "left"] },
                    { key: "popliteal", label: "Poplítea", sides: ["right", "left"] },
                    { key: "posteriorTibial", label: "Tibial Posterior", sides: ["right", "left"] },
                    { key: "dorsalisPedis", label: "Pedia", sides: ["right", "left"] }
                  ].map((pulse) => (
                    <div key={pulse.key} className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="font-medium text-white">{pulse.label}</h5>
                      <div className="grid grid-cols-2 gap-4">
                        {pulse.sides.map((side) => (
                          <div key={side} className="space-y-2">
                            <Label className="text-white text-sm">{side === "right" ? "Derecho" : "Izquierdo"}</Label>
                            <RadioGroup
                              value={examData.vascularExam.pulses[pulse.key as keyof typeof examData.vascularExam.pulses][side as "right" | "left"]}
                              onValueChange={(value) => 
                                setExamData(prev => ({
                                  ...prev,
                                  vascularExam: {
                                    ...prev.vascularExam,
                                    pulses: {
                                      ...prev.vascularExam.pulses,
                                      [pulse.key]: {
                                        ...prev.vascularExam.pulses[pulse.key as keyof typeof prev.vascularExam.pulses],
                                        [side]: value
                                      }
                                    }
                                  }
                                }))
                              }
                              className="flex flex-col gap-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id={`${pulse.key}-${side}-0`} />
                                <Label htmlFor={`${pulse.key}-${side}-0`} className="text-xs cursor-pointer text-white">
                                  Ausente (0) ❌
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id={`${pulse.key}-${side}-1`} />
                                <Label htmlFor={`${pulse.key}-${side}-1`} className="text-xs cursor-pointer text-white">
                                  Débil (1+) 🟡
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id={`${pulse.key}-${side}-2`} />
                                <Label htmlFor={`${pulse.key}-${side}-2`} className="text-xs cursor-pointer text-white">
                                  Normal (2+) 🟢
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id={`${pulse.key}-${side}-3`} />
                                <Label htmlFor={`${pulse.key}-${side}-3`} className="text-xs cursor-pointer text-white">
                                  Amplio (3+) 🔴
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                      
                      {/* Soplos en carótidas */}
                      {pulse.key === "carotid" && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="carotid-bruits"
                              checked={examData.vascularExam.pulses.carotid.bruits}
                              onCheckedChange={(checked) =>
                                setExamData(prev => ({
                                  ...prev,
                                  vascularExam: {
                                    ...prev.vascularExam,
                                    pulses: {
                                      ...prev.vascularExam.pulses,
                                      carotid: { ...prev.vascularExam.pulses.carotid, bruits: checked as boolean }
                                    }
                                  }
                                }))
                              }
                            />
                            <Label htmlFor="carotid-bruits" className="text-white text-sm cursor-pointer">
                              Soplos carotídeos 🎵
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de completar - MANTENIDO */}
        <div className="flex justify-center">
          <Button 
            onClick={handleComplete}
            size="lg" 
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Completar Examen Cardiovascular
          </Button>
        </div>
      </div>
    </div>
  );
}