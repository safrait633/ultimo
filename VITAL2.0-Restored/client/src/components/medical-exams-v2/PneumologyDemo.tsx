import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { 
  Wind, 
  Activity,
  Target,
  AlertTriangle,
  Stethoscope,
  Timer
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

export default function PneumologyDemo({ patientData, onComplete }: any) {
  
  const [examData, setExamData] = useState({
    symptoms: {
      dyspnea: false,
      dyspneaType: "",
      cough: false,
      coughType: "",
      chestPain: false,
      sputum: false,
      sputumColor: "",
      wheezing: false,
      hemoptysis: false
    },
    physicalExam: {
      inspection: "",
      palpation: "",
      percussion: "",
      auscultation: "",
      oxygenSaturation: ""
    },
    respiratoryHistory: {
      smoking: false,
      asthma: false,
      copd: false,
      allergies: false,
      occupationalExposure: false
    }
  });

  const [alerts, setAlerts] = useState<any[]>([]);
  const [medicalScales, setMedicalScales] = useState<any[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    calculateProgress();
    generateAlerts();
    calculateScales();
  }, [examData]);

  const calculateProgress = () => {
    const totalFields = 16;
    let completedFields = 0;

    Object.values(examData.symptoms).forEach(value => {
      if (value && value !== "") completedFields++;
    });
    Object.values(examData.physicalExam).forEach(value => {
      if (value && value !== "") completedFields++;
    });
    Object.values(examData.respiratoryHistory).forEach(value => {
      if (value) completedFields++;
    });

    const percentage = Math.round((completedFields / totalFields) * 100);
    setProgressPercentage(percentage);
  };

  const generateAlerts = () => {
    const newAlerts: any[] = [];

    if (examData.symptoms.hemoptysis) {
      newAlerts.push({
        id: "hemoptysis",
        type: "critical",
        message: "🚨 HEMOPTISIS - Descartar cáncer pulmonar/TEP",
        timestamp: new Date()
      });
    }

    if (examData.symptoms.dyspnea && examData.symptoms.dyspneaType === "sudden") {
      newAlerts.push({
        id: "sudden-dyspnea",
        type: "urgent",
        message: "⚠️ DISNEA SÚBITA - Descartar TEP/neumotórax",
        timestamp: new Date()
      });
    }

    if (examData.physicalExam.oxygenSaturation === "low") {
      newAlerts.push({
        id: "hypoxemia",
        type: "urgent",
        message: "⚠️ HIPOXEMIA - Oxigenoterapia y evaluación urgente",
        timestamp: new Date()
      });
    }

    setAlerts(newAlerts);
  };

  const calculateScales = () => {
    const scales: any[] = [];

    // Score de riesgo respiratorio
    let respiratoryRisk = 0;
    if (examData.respiratoryHistory.smoking) respiratoryRisk += 2;
    if (examData.respiratoryHistory.copd) respiratoryRisk += 2;
    if (examData.symptoms.dyspnea) respiratoryRisk += 1;
    if (examData.symptoms.hemoptysis) respiratoryRisk += 3;

    if (respiratoryRisk > 0) {
      scales.push({
        name: "Riesgo Respiratorio",
        score: respiratoryRisk,
        interpretation: respiratoryRisk >= 5 ? "Alto riesgo" : respiratoryRisk >= 3 ? "Riesgo moderado" : "Riesgo bajo",
        riskLevel: respiratoryRisk >= 5 ? "high" : respiratoryRisk >= 3 ? "intermediate" : "low",
        recommendations: [
          respiratoryRisk >= 4 ? "Imagen torácica urgente" : "Espirometría",
          "Seguimiento neumológico"
        ]
      });
    }

    setMedicalScales(scales);
  };

  const handleComplete = () => {
    onComplete?.({
      examData, alerts, medicalScales, progressPercentage, timestamp: new Date()
    });
  };

  const progressSections = {
    síntomas: Object.values(examData.symptoms).some(v => v && v !== ""),
    físico: Object.values(examData.physicalExam).some(v => v !== ""),
    historia: Object.values(examData.respiratoryHistory).some(Boolean)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800">
      
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-cyan-500/20 rounded-full border border-cyan-500/30">
              <Wind className="h-8 w-8 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Neumología</h1>
              <p className="text-white/70">Evaluación del sistema respiratorio</p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                Demo Interactivo
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        <div className="flex-1 space-y-6">
          
          {/* Síntomas Respiratorios */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-cyan-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wind className="h-5 w-5 text-cyan-300" />
                  Síntomas Respiratorios
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Disnea */}
                  <div className="space-y-4 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
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
                      <Label htmlFor="dyspnea" className="text-white font-medium cursor-pointer">
                        Disnea 🫁
                      </Label>
                    </div>
                    
                    {examData.symptoms.dyspnea && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 ml-6"
                      >
                        <Label className="text-white text-sm mb-2 block">Tipo de disnea:</Label>
                        <RadioGroup
                          value={examData.symptoms.dyspneaType}
                          onValueChange={(value) =>
                            setExamData(prev => ({
                              ...prev,
                              symptoms: { ...prev.symptoms, dyspneaType: value }
                            }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exertion" id="dyspnea-exertion" />
                            <Label htmlFor="dyspnea-exertion" className="text-white text-sm cursor-pointer">
                              De esfuerzo 🏃
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rest" id="dyspnea-rest" />
                            <Label htmlFor="dyspnea-rest" className="text-white text-sm cursor-pointer">
                              De reposo 🛏️
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sudden" id="dyspnea-sudden" />
                            <Label htmlFor="dyspnea-sudden" className="text-white text-sm cursor-pointer">
                              Súbita ⚡
                            </Label>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    )}
                  </div>

                  {/* Tos */}
                  <div className="space-y-4 p-4 bg-orange-500/5 rounded-xl border border-orange-500/20">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cough"
                        checked={examData.symptoms.cough}
                        onCheckedChange={(checked) =>
                          setExamData(prev => ({
                            ...prev,
                            symptoms: { ...prev.symptoms, cough: checked as boolean }
                          }))
                        }
                      />
                      <Label htmlFor="cough" className="text-white font-medium cursor-pointer">
                        Tos 😤
                      </Label>
                    </div>
                    
                    {examData.symptoms.cough && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 ml-6"
                      >
                        <Label className="text-white text-sm mb-2 block">Tipo de tos:</Label>
                        <RadioGroup
                          value={examData.symptoms.coughType}
                          onValueChange={(value) =>
                            setExamData(prev => ({
                              ...prev,
                              symptoms: { ...prev.symptoms, coughType: value }
                            }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dry" id="cough-dry" />
                            <Label htmlFor="cough-dry" className="text-white text-sm cursor-pointer">
                              Seca 🏜️
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="productive" id="cough-productive" />
                            <Label htmlFor="cough-productive" className="text-white text-sm cursor-pointer">
                              Productiva 💧
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nocturnal" id="cough-nocturnal" />
                            <Label htmlFor="cough-nocturnal" className="text-white text-sm cursor-pointer">
                              Nocturna 🌙
                            </Label>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { key: "chestPain", label: "Dolor Torácico", icon: "💔" },
                    { key: "wheezing", label: "Sibilancias", icon: "🎵" },
                    { key: "sputum", label: "Expectoración", icon: "💧" },
                    { key: "hemoptysis", label: "Hemoptisis", icon: "🩸" }
                  ].map((symptom) => (
                    <div key={symptom.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
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
                      <Label htmlFor={symptom.key} className="text-white cursor-pointer text-sm">
                        {symptom.icon} {symptom.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Examen Físico Respiratorio */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-blue-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Stethoscope className="h-5 w-5 text-blue-300" />
                  Examen Físico Respiratorio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Auscultación pulmonar:</Label>
                      <RadioGroup
                        value={examData.physicalExam.auscultation}
                        onValueChange={(value) =>
                          setExamData(prev => ({
                            ...prev,
                            physicalExam: { ...prev.physicalExam, auscultation: value }
                          }))
                        }
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="ausc-normal" />
                          <Label htmlFor="ausc-normal" className="text-white text-sm cursor-pointer">
                            Normal ✅
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="crackles" id="ausc-crackles" />
                          <Label htmlFor="ausc-crackles" className="text-white text-sm cursor-pointer">
                            Crepitantes 💧
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="wheezes" id="ausc-wheezes" />
                          <Label htmlFor="ausc-wheezes" className="text-white text-sm cursor-pointer">
                            Sibilancias 🎵
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="decreased" id="ausc-decreased" />
                          <Label htmlFor="ausc-decreased" className="text-white text-sm cursor-pointer">
                            Disminuidos 📉
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Saturación O₂:</Label>
                      <RadioGroup
                        value={examData.physicalExam.oxygenSaturation}
                        onValueChange={(value) =>
                          setExamData(prev => ({
                            ...prev,
                            physicalExam: { ...prev.physicalExam, oxygenSaturation: value }
                          }))
                        }
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="sat-normal" />
                          <Label htmlFor="sat-normal" className="text-white text-sm cursor-pointer">
                            Normal (&gt;95%) ✅
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mild" id="sat-mild" />
                          <Label htmlFor="sat-mild" className="text-white text-sm cursor-pointer">
                            Leve (90-95%) 🟡
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="sat-low" />
                          <Label htmlFor="sat-low" className="text-white text-sm cursor-pointer">
                            Baja (&lt;90%) 🔴
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <MedicalDashboard 
          alerts={alerts}
          medicalScales={medicalScales}
          progressPercentage={progressPercentage}
          progressSections={progressSections}
          onComplete={handleComplete}
          specialty="Neumología"
        />
      </div>
    </div>
  );
}