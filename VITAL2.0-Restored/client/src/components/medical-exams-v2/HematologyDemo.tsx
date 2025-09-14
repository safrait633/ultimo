import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { 
  Droplets, 
  Activity, 
  Target,
  AlertTriangle,
  Microscope,
  Search,
  Thermometer
} from "lucide-react";
import MedicalDashboard from "./MedicalDashboard";

interface HematologyDemoProps {
  patientData?: any;
  onComplete?: (data: any) => void;
}

export default function HematologyDemo({ patientData, onComplete }: HematologyDemoProps) {
  
  // Estados principales
  const [examData, setExamData] = useState({
    bSymptoms: {
      fever: false,
      nightSweats: false,
      weightLoss: false,
      fatigue: false
    },
    bleeding: {
      petechiae: false,
      bruising: false,
      nosebleeds: false,
      gingivalBleeding: false,
      heavyPeriods: false
    },
    physicalExam: {
      pallor: "",
      lymphNodes: false,
      splenomegaly: false,
      hepatomegaly: false,
      bonePain: false
    },
    hematologicHistory: {
      anemiaHistory: false,
      bleedingDisorders: false,
      familyHistory: false,
      medications: false
    }
  });

  // Estados para dashboard
  const [alerts, setAlerts] = useState<any[]>([]);
  const [medicalScales, setMedicalScales] = useState<any[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Calcular progreso automáticamente
  useEffect(() => {
    calculateProgress();
    generateAlerts();
    calculateScales();
  }, [examData]);

  const calculateProgress = () => {
    const totalFields = 16;
    let completedFields = 0;

    // Contar campos completados
    Object.values(examData.bSymptoms).forEach(value => {
      if (value) completedFields++;
    });
    Object.values(examData.bleeding).forEach(value => {
      if (value) completedFields++;
    });
    Object.values(examData.physicalExam).forEach(value => {
      if (value && value !== "") completedFields++;
    });
    Object.values(examData.hematologicHistory).forEach(value => {
      if (value) completedFields++;
    });

    const percentage = Math.round((completedFields / totalFields) * 100);
    setProgressPercentage(percentage);
  };

  const generateAlerts = () => {
    const newAlerts: any[] = [];

    // Síntomas B completos (sospecha de neoplasia hematológica)
    const bCount = Object.values(examData.bSymptoms).filter(Boolean).length;
    if (bCount >= 3) {
      newAlerts.push({
        id: "b-symptoms",
        type: "critical",
        message: "🚨 SÍNTOMAS B COMPLETOS - Sospecha de neoplasia hematológica",
        timestamp: new Date()
      });
    }

    // Sangrado múltiple (sospecha diátesis hemorrágica)
    const bleedingCount = Object.values(examData.bleeding).filter(Boolean).length;
    if (bleedingCount >= 3) {
      newAlerts.push({
        id: "bleeding-disorder",
        type: "urgent",
        message: "⚠️ SANGRADO MÚLTIPLE - Evaluar diátesis hemorrágica",
        timestamp: new Date()
      });
    }

    // Organomegalia
    if (examData.physicalExam.splenomegaly && examData.physicalExam.hepatomegaly) {
      newAlerts.push({
        id: "hepatosplenomegaly",
        type: "urgent",
        message: "⚠️ HEPATOESPLENOMEGALIA - Requiere evaluación urgente",
        timestamp: new Date()
      });
    }

    setAlerts(newAlerts);
  };

  const calculateScales = () => {
    const scales: any[] = [];

    // Escala de sangrado simplificada
    const bleedingCount = Object.values(examData.bleeding).filter(Boolean).length;
    if (bleedingCount > 0) {
      scales.push({
        name: "Riesgo de Sangrado",
        score: `${bleedingCount}/5`,
        interpretation: bleedingCount >= 4 ? "Alto riesgo" : bleedingCount >= 2 ? "Riesgo moderado" : "Riesgo bajo",
        riskLevel: bleedingCount >= 4 ? "high" : bleedingCount >= 2 ? "intermediate" : "low",
        recommendations: [
          bleedingCount >= 3 ? "Estudios de coagulación urgentes" : "Historia clínica detallada",
          "Evitar anticoagulantes hasta descartar patología"
        ]
      });
    }

    // Score de sospecha hematológica
    let hematScore = 0;
    if (Object.values(examData.bSymptoms).filter(Boolean).length >= 2) hematScore += 3;
    if (examData.physicalExam.lymphNodes) hematScore += 2;
    if (examData.physicalExam.splenomegaly) hematScore += 2;
    if (examData.hematologicHistory.familyHistory) hematScore += 1;

    if (hematScore > 0) {
      scales.push({
        name: "Sospecha Hematológica",
        score: hematScore,
        interpretation: hematScore >= 6 ? "Alta sospecha" : hematScore >= 3 ? "Sospecha moderada" : "Baja sospecha",
        riskLevel: hematScore >= 6 ? "high" : hematScore >= 3 ? "intermediate" : "low",
        recommendations: [
          hematScore >= 6 ? "Interconsulta hematología urgente" : "Laboratorios hematológicos completos",
          "Seguimiento estrecho"
        ]
      });
    }

    setMedicalScales(scales);
  };

  const handleComplete = () => {
    const completeData = {
      examData,
      alerts,
      medicalScales,
      progressPercentage,
      timestamp: new Date()
    };
    
    if (onComplete) {
      onComplete(completeData);
    }
  };

  const progressSections = {
    síntomas: Object.values(examData.bSymptoms).some(Boolean),
    sangrado: Object.values(examData.bleeding).some(Boolean),
    físico: Object.values(examData.physicalExam).some(v => v !== "" && v !== false),
    historia: Object.values(examData.hematologicHistory).some(Boolean)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      
      {/* Header moderno */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Droplets className="h-8 w-8 text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hematología</h1>
              <p className="text-white/70">Sistema hematológico inteligente</p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-purple-500/20 text-purple-200 border border-purple-500/30">
                Demo Interactivo
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex gap-6 p-6">
        {/* Contenido principal */}
        <div className="flex-1 space-y-6">
          
          {/* Síntomas B */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-red-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Thermometer className="h-5 w-5 text-red-300" />
                  Síntomas B (Sospecha Neoplasia)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "fever", label: "Fiebre", icon: "🌡️", desc: ">38°C recurrente" },
                    { key: "nightSweats", label: "Sudores Nocturnos", icon: "💧", desc: "Empapan ropa de cama" },
                    { key: "weightLoss", label: "Pérdida de Peso", icon: "⚖️", desc: ">10% en 6 meses" },
                    { key: "fatigue", label: "Fatiga Severa", icon: "😴", desc: "Limitante actividad" }
                  ].map((symptom) => (
                    <motion.div
                      key={symptom.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-red-500/5 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={symptom.key}
                          checked={examData.bSymptoms[symptom.key as keyof typeof examData.bSymptoms]}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              bSymptoms: { ...prev.bSymptoms, [symptom.key]: checked }
                            }))
                          }
                        />
                        <Label htmlFor={symptom.key} className="text-white font-medium cursor-pointer">
                          {symptom.icon} {symptom.label}
                        </Label>
                      </div>
                      <p className="text-red-300 text-xs ml-6">{symptom.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Manifestaciones Hemorrágicas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-pink-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-pink-300" />
                  Manifestaciones Hemorrágicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "petechiae", label: "Petequias", icon: "⭕", desc: "Puntitos rojos <3mm" },
                    { key: "bruising", label: "Equimosis Fáciles", icon: "🟣", desc: "Moretones espontáneos" },
                    { key: "nosebleeds", label: "Epistaxis", icon: "👃", desc: "Sangrados nasales" },
                    { key: "gingivalBleeding", label: "Sangrado Gingival", icon: "🦷", desc: "Encías sangrantes" },
                    { key: "heavyPeriods", label: "Menorragia", icon: "🩸", desc: "Periodos abundantes" }
                  ].map((bleeding) => (
                    <motion.div
                      key={bleeding.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-pink-500/5 rounded-xl border border-pink-500/20 hover:bg-pink-500/10 transition-all"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={bleeding.key}
                          checked={examData.bleeding[bleeding.key as keyof typeof examData.bleeding]}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              bleeding: { ...prev.bleeding, [bleeding.key]: checked }
                            }))
                          }
                        />
                        <Label htmlFor={bleeding.key} className="text-white font-medium cursor-pointer">
                          {bleeding.icon} {bleeding.label}
                        </Label>
                      </div>
                      <p className="text-pink-300 text-xs ml-6">{bleeding.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Examen Físico */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-blue-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Search className="h-5 w-5 text-blue-300" />
                  Examen Físico Hematológico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Palidez */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Evaluación de Palidez
                    </h4>
                    <div>
                      <Label className="text-white text-sm mb-2 block">Grado de palidez:</Label>
                      <RadioGroup
                        value={examData.physicalExam.pallor}
                        onValueChange={(value) =>
                          setExamData(prev => ({
                            ...prev,
                            physicalExam: { ...prev.physicalExam, pallor: value }
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id="pallor-absent" />
                          <Label htmlFor="pallor-absent" className="text-white text-sm cursor-pointer">
                            Ausente ✅
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mild" id="pallor-mild" />
                          <Label htmlFor="pallor-mild" className="text-white text-sm cursor-pointer">
                            Leve 🟡
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="pallor-moderate" />
                          <Label htmlFor="pallor-moderate" className="text-white text-sm cursor-pointer">
                            Moderada 🟠
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="severe" id="pallor-severe" />
                          <Label htmlFor="pallor-severe" className="text-white text-sm cursor-pointer">
                            Severa 🔴
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Hallazgos físicos */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Microscope className="h-4 w-4" />
                      Hallazgos Físicos
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: "lymphNodes", label: "Adenopatías", icon: "🔍", desc: "Ganglios palpables" },
                        { key: "splenomegaly", label: "Esplenomegalia", icon: "🫘", desc: "Bazo palpable" },
                        { key: "hepatomegaly", label: "Hepatomegalia", icon: "🫀", desc: "Hígado palpable" },
                        { key: "bonePain", label: "Dolor Óseo", icon: "🦴", desc: "Dolor esquelético" }
                      ].map((finding) => (
                        <div key={finding.key} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <Checkbox
                            id={finding.key}
                            checked={examData.physicalExam[finding.key as keyof typeof examData.physicalExam] as boolean}
                            onCheckedChange={(checked) =>
                              setExamData(prev => ({
                                ...prev,
                                physicalExam: { ...prev.physicalExam, [finding.key]: checked }
                              }))
                            }
                          />
                          <div className="flex flex-col">
                            <Label htmlFor={finding.key} className="text-white cursor-pointer">
                              {finding.icon} {finding.label}
                            </Label>
                            <span className="text-white/60 text-xs ml-6">{finding.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Historia Hematológica */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader className="bg-green-500/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-green-300" />
                  Historia Hematológica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "anemiaHistory", label: "Anemia Previa", icon: "📋" },
                    { key: "bleedingDisorders", label: "Trastornos Sangrado", icon: "🩸" },
                    { key: "familyHistory", label: "Historia Familiar", icon: "👪" },
                    { key: "medications", label: "Medicamentos", icon: "💊" }
                  ].map((history) => (
                    <motion.div
                      key={history.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 p-3 bg-green-500/5 rounded-lg border border-green-500/20 hover:bg-green-500/10 transition-all"
                    >
                      <Checkbox
                        id={history.key}
                        checked={examData.hematologicHistory[history.key as keyof typeof examData.hematologicHistory]}
                        onCheckedChange={(checked) =>
                          setExamData(prev => ({
                            ...prev,
                            hematologicHistory: { ...prev.hematologicHistory, [history.key]: checked }
                          }))
                        }
                      />
                      <Label htmlFor={history.key} className="text-white cursor-pointer text-sm">
                        {history.icon} {history.label}
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Dashboard lateral */}
        <MedicalDashboard 
          alerts={alerts}
          medicalScales={medicalScales}
          progressPercentage={progressPercentage}
          progressSections={progressSections}
          onComplete={handleComplete}
          specialty="Hematología"
        />
      </div>
    </div>
  );
}