import { useState } from 'react';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import MedicalDashboard from './MedicalDashboard';

interface OphthalmologyDemoProps {
  patientData: {
    id: string;
    name?: string;
    age: number;
    gender: string;
  };
  onComplete: (data: any) => void;
}

export default function OphthalmologyDemo({ patientData, onComplete }: OphthalmologyDemoProps) {
  const [examData, setExamData] = useState({
    clinicalHistory: {
      visionComplaint: '',
      familyHistory: false,
      diabetes: false,
      hypertension: false,
      currentMedications: ''
    },
    visualAcuity: {
      rightEye: '',
      leftEye: '',
      withCorrection: false
    },
    examination: {
      pupils: '',
      intraocularPressure: '',
      anteriorSegment: '',
      posteriorSegment: '',
      fundoscopy: ''
    },
    diagnosis: {
      primary: '',
      treatment: '',
      followUp: ''
    }
  });

  // Cálculo de progreso
  const progressPercentage = 85;
  const progressSections = {
    'Historia Ocular': true,
    'Agudeza Visual': true,
    'Examen Ocular': true,
    'Fondo de Ojo': false
  };

  // Alertas médicas
  const alerts = [
    {
      id: '1',
      type: 'critical' as const,
      message: 'Presión intraocular elevada - Riesgo de glaucoma',
      priority: 'high' as const,
timestamp: new Date()
    },
    {
      id: '2',
      type: 'warning' as const,
      message: 'Antecedentes diabéticos - Evaluar retinopatía',
      priority: 'medium' as const,
timestamp: new Date()
    }
  ];

  // Escalas médicas
  const medicalScales = [
    {
      name: 'Presión Intraocular',
      value: '18 mmHg OD, 17 mmHg OI',
      interpretation: 'Límite superior normal',
      score: 18,
      riskLevel: 'medium' as const,
      recommendations: ['Control en 3 meses', 'Campimetría']
    },
    {
      name: 'Agudeza Visual',
      value: '20/30 OD, 20/25 OI',
      interpretation: 'Leve disminución bilateral',
      score: 85,
      riskLevel: 'low' as const,
      recommendations: ['Refracción', 'Control anual']
    }
  ];

  const handleComplete = () => {
    const completedData = {
      specialty: 'Oftalmología',
      patientId: patientData.id,
      examData,
      completedAt: new Date().toISOString(),
      findings: 'Presión intraocular borderline con necesidad de seguimiento'
    };
    onComplete(completedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        
        {/* Dashboard lateral */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <div className="sticky top-6">
            <MedicalDashboard 
              alerts={alerts}
              medicalScales={medicalScales}
              progressPercentage={progressPercentage}
              progressSections={progressSections}
              onComplete={handleComplete}
            />
          </div>
        </div>

        {/* Formulario principal */}
        <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Evaluación Oftalmológica</h1>
            <p className="text-slate-300">
              Paciente: {patientData.name} • {patientData.age} años • Género: {patientData.gender}
            </p>
            <Badge className="mt-2 bg-slate-500/20 text-slate-300 border-slate-500/30">
              Sistema Visual Completo
            </Badge>
          </motion.div>

          {/* Historia Clínica Oftalmológica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  👁️ Historia Clínica Ocular
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Motivo de consulta visual:</Label>
                      <Textarea
                        value={examData.clinicalHistory.visionComplaint}
                        onChange={(e) =>
                          setExamData(prev => ({
                            ...prev,
                            clinicalHistory: { ...prev.clinicalHistory, visionComplaint: e.target.value }
                          }))
                        }
                        placeholder="Describe las molestias visuales del paciente..."
                        className="mt-2 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="family-history"
                          checked={examData.clinicalHistory.familyHistory}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              clinicalHistory: { ...prev.clinicalHistory, familyHistory: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="family-history" className="text-white text-sm cursor-pointer">
                          Antecedentes familiares de glaucoma/cataratas
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="diabetes"
                          checked={examData.clinicalHistory.diabetes}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              clinicalHistory: { ...prev.clinicalHistory, diabetes: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="diabetes" className="text-white text-sm cursor-pointer">
                          Diabetes mellitus
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hypertension"
                          checked={examData.clinicalHistory.hypertension}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              clinicalHistory: { ...prev.clinicalHistory, hypertension: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="hypertension" className="text-white text-sm cursor-pointer">
                          Hipertensión arterial
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Agudeza visual:</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label className="text-slate-300 text-sm">Ojo derecho:</Label>
                          <Input
                            value={examData.visualAcuity.rightEye}
                            onChange={(e) =>
                              setExamData(prev => ({
                                ...prev,
                                visualAcuity: { ...prev.visualAcuity, rightEye: e.target.value }
                              }))
                            }
                            placeholder="20/20"
                            className="mt-1 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300 text-sm">Ojo izquierdo:</Label>
                          <Input
                            value={examData.visualAcuity.leftEye}
                            onChange={(e) =>
                              setExamData(prev => ({
                                ...prev,
                                visualAcuity: { ...prev.visualAcuity, leftEye: e.target.value }
                              }))
                            }
                            placeholder="20/20"
                            className="mt-1 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <Checkbox
                          id="with-correction"
                          checked={examData.visualAcuity.withCorrection}
                          onCheckedChange={(checked) =>
                            setExamData(prev => ({
                              ...prev,
                              visualAcuity: { ...prev.visualAcuity, withCorrection: checked as boolean }
                            }))
                          }
                        />
                        <Label htmlFor="with-correction" className="text-white text-sm cursor-pointer">
                          Con corrección óptica
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Examen Ocular */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  🔍 Examen Oftalmológico Completo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Examen pupilar:</Label>
                      <RadioGroup
                        value={examData.examination.pupils}
                        onValueChange={(value) =>
                          setExamData(prev => ({
                            ...prev,
                            examination: { ...prev.examination, pupils: value }
                          }))
                        }
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="pupils-normal" />
                          <Label htmlFor="pupils-normal" className="text-white text-sm cursor-pointer">
                            Pupilas isocóricas y reactivas
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="anisocoria" id="pupils-aniso" />
                          <Label htmlFor="pupils-aniso" className="text-white text-sm cursor-pointer">
                            Anisocoria presente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="pupils-fixed" />
                          <Label htmlFor="pupils-fixed" className="text-white text-sm cursor-pointer">
                            Pupila fija/no reactiva
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-white font-medium">Presión intraocular:</Label>
                      <Input
                        value={examData.examination.intraocularPressure}
                        onChange={(e) =>
                          setExamData(prev => ({
                            ...prev,
                            examination: { ...prev.examination, intraocularPressure: e.target.value }
                          }))
                        }
                        placeholder="OD: 15 mmHg, OI: 16 mmHg"
                        className="mt-2 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Segmento anterior:</Label>
                      <Textarea
                        value={examData.examination.anteriorSegment}
                        onChange={(e) =>
                          setExamData(prev => ({
                            ...prev,
                            examination: { ...prev.examination, anteriorSegment: e.target.value }
                          }))
                        }
                        placeholder="Córnea, iris, cristalino..."
                        className="mt-2 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Fondo de ojo:</Label>
                      <Textarea
                        value={examData.examination.fundoscopy}
                        onChange={(e) =>
                          setExamData(prev => ({
                            ...prev,
                            examination: { ...prev.examination, fundoscopy: e.target.value }
                          }))
                        }
                        placeholder="Papila, mácula, vasos retinianos..."
                        className="mt-2 backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}