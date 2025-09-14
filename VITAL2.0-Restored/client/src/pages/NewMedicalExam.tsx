import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  User, 
  Calendar,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Weight,
  Ruler,
  Brain,
  Eye,
  Stethoscope,
  FileText,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string;
}

interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  bmi: number;
}

interface Examination {
  generalAppearance: string;
  skinExam: string;
  headNeckExam: string;
  cardiovascularExam: string;
  respiratoryExam: string;
  abdominalExam: string;
  neurologicalExam: string;
  musculoskeletalExam: string;
  notes: string;
}

interface Consultation {
  patientId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitalSigns: VitalSigns;
  physicalExamination: Examination;
  assessment: string;
  plan: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  followUp: string;
}

export default function NewMedicalExam() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  // Estados del formulario
  const [consultationData, setConsultationData] = useState<Consultation>({
    patientId: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    vitalSigns: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 36.5,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 70,
      height: 170,
      bmi: 24.2
    },
    physicalExamination: {
      generalAppearance: '',
      skinExam: '',
      headNeckExam: '',
      cardiovascularExam: '',
      respiratoryExam: '',
      abdominalExam: '',
      neurologicalExam: '',
      musculoskeletalExam: '',
      notes: ''
    },
    assessment: '',
    plan: '',
    medications: [],
    followUp: ''
  });

  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    bloodType: '',
    allergies: '',
    medicalHistory: ''
  });

  // Queries
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    enabled: !!user,
  });

  // Mutations
  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedPatient(data.patient);
      setConsultationData(prev => ({ ...prev, patientId: data.patient.id }));
      setShowNewPatientForm(false);
      setCurrentStep(2);
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({
        title: "Paciente creado",
        description: "El paciente ha sido registrado exitosamente.",
      });
    }
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (consultData: Consultation) => {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consulta guardada",
        description: "El examen médico ha sido guardado exitosamente.",
      });
      // Resetear formulario
      setCurrentStep(1);
      setSelectedPatient(null);
      setConsultationData({
        patientId: '',
        chiefComplaint: '',
        historyOfPresentIllness: '',
        vitalSigns: {
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          heartRate: 72,
          temperature: 36.5,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          weight: 70,
          height: 170,
          bmi: 24.2
        },
        physicalExamination: {
          generalAppearance: '',
          skinExam: '',
          headNeckExam: '',
          cardiovascularExam: '',
          respiratoryExam: '',
          abdominalExam: '',
          neurologicalExam: '',
          musculoskeletalExam: '',
          notes: ''
        },
        assessment: '',
        plan: '',
        medications: [],
        followUp: ''
      });
    }
  });

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Calcular BMI automáticamente
  useEffect(() => {
    const { weight, height } = consultationData.vitalSigns;
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      setConsultationData(prev => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          bmi: Math.round(bmi * 10) / 10
        }
      }));
    }
  }, [consultationData.vitalSigns.weight, consultationData.vitalSigns.height]);

  const addMedication = () => {
    setConsultationData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: '', dosage: '', frequency: '', duration: '' }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    setConsultationData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setConsultationData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const steps = [
    { number: 1, title: 'Seleccionar Paciente', icon: User },
    { number: 2, title: 'Historia Clínica', icon: FileText },
    { number: 3, title: 'Signos Vitales', icon: Heart },
    { number: 4, title: 'Examen Físico', icon: Stethoscope },
    { number: 5, title: 'Diagnóstico y Plan', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-['Manrope']">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nuevo Examen Médico</h1>
                <p className="text-blue-200">Dr. {user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.number ? 'text-white' : 'text-white/50'
                }`}>
                  <div className={`p-3 rounded-xl ${
                    currentStep >= step.number 
                      ? 'bg-blue-500/30 border border-blue-400/50' 
                      : 'bg-white/10 border border-white/20'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-xs opacity-75">Paso {step.number}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contenido del formulario */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Seleccionar Paciente</h2>
              
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar paciente por nombre o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>

                {searchTerm && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredPatients.map((patient) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white/5 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPatient?.id === patient.id
                            ? 'border-blue-400/50 bg-blue-500/20'
                            : 'border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setConsultationData(prev => ({ ...prev, patientId: patient.id }));
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <p className="text-blue-200 text-sm">
                              {patient.age} años • {patient.gender} • {patient.phone}
                            </p>
                          </div>
                          {selectedPatient?.id === patient.id && (
                            <CheckCircle className="w-6 h-6 text-blue-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => setShowNewPatientForm(true)}
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-3 text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Registrar Nuevo Paciente</span>
                  </button>
                </div>
              </div>

              {selectedPatient && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-xl px-6 py-3 text-white hover:bg-blue-500/40 transition-colors flex items-center space-x-2"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Resto de los pasos del formulario... */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Historia Clínica</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Motivo de Consulta</label>
                  <textarea
                    value={consultationData.chiefComplaint}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-24"
                    placeholder="Describa el motivo principal de la consulta..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Historia de la Enfermedad Actual</label>
                  <textarea
                    value={consultationData.historyOfPresentIllness}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-32"
                    placeholder="Describa detalladamente los síntomas actuales, inicio, evolución, factores que mejoran o empeoran..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-xl px-6 py-3 text-white hover:bg-blue-500/40 transition-colors flex items-center space-x-2"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Paso 3: Signos Vitales */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Signos Vitales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-red-400" />
                    <label className="text-white font-medium">Presión Arterial</label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={consultationData.vitalSigns.bloodPressureSystolic}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, bloodPressureSystolic: Number(e.target.value) }
                      }))}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                    />
                    <span className="text-white self-center">/</span>
                    <input
                      type="number"
                      value={consultationData.vitalSigns.bloodPressureDiastolic}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        vitalSigns: { ...prev.vitalSigns, bloodPressureDiastolic: Number(e.target.value) }
                      }))}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                    />
                  </div>
                  <p className="text-blue-200 text-xs mt-1">mmHg</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <label className="text-white font-medium">Frecuencia Cardíaca</label>
                  </div>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.heartRate}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, heartRate: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">bpm</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Thermometer className="w-5 h-5 text-orange-400" />
                    <label className="text-white font-medium">Temperatura</label>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={consultationData.vitalSigns.temperature}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, temperature: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">°C</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <label className="text-white font-medium">Frecuencia Respiratoria</label>
                  </div>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.respiratoryRate}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, respiratoryRate: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">rpm</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <label className="text-white font-medium">Saturación O₂</label>
                  </div>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.oxygenSaturation}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, oxygenSaturation: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">%</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Weight className="w-5 h-5 text-green-400" />
                    <label className="text-white font-medium">Peso</label>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={consultationData.vitalSigns.weight}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, weight: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">kg</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Ruler className="w-5 h-5 text-purple-400" />
                    <label className="text-white font-medium">Altura</label>
                  </div>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.height}
                    onChange={(e) => setConsultationData(prev => ({
                      ...prev,
                      vitalSigns: { ...prev.vitalSigns, height: Number(e.target.value) }
                    }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-center"
                  />
                  <p className="text-blue-200 text-xs mt-1">cm</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <label className="text-white font-medium">IMC</label>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{consultationData.vitalSigns.bmi}</span>
                    <p className="text-blue-200 text-xs mt-1">kg/m²</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-xl px-6 py-3 text-white hover:bg-blue-500/40 transition-colors flex items-center space-x-2"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Paso 4: Examen Físico */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Examen Físico</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Aspecto General</label>
                    <textarea
                      value={consultationData.physicalExamination.generalAppearance}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, generalAppearance: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Estado general, constitución, marcha..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Examen de Piel</label>
                    <textarea
                      value={consultationData.physicalExamination.skinExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, skinExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Color, textura, lesiones, cicatrices..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Cabeza y Cuello</label>
                    <textarea
                      value={consultationData.physicalExamination.headNeckExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, headNeckExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Ojos, oídos, nariz, garganta, cuello, ganglios..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Sistema Cardiovascular</label>
                    <textarea
                      value={consultationData.physicalExamination.cardiovascularExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, cardiovascularExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Ruidos cardíacos, soplos, pulsos..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Sistema Respiratorio</label>
                    <textarea
                      value={consultationData.physicalExamination.respiratoryExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, respiratoryExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Inspección, palpación, percusión, auscultación..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Sistema Abdominal</label>
                    <textarea
                      value={consultationData.physicalExamination.abdominalExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, abdominalExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Inspección, palpación, percusión, auscultación..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Sistema Neurológico</label>
                    <textarea
                      value={consultationData.physicalExamination.neurologicalExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, neurologicalExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Estado mental, reflejos, motricidad, sensibilidad..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Sistema Musculoesquelético</label>
                    <textarea
                      value={consultationData.physicalExamination.musculoskeletalExam}
                      onChange={(e) => setConsultationData(prev => ({
                        ...prev,
                        physicalExamination: { ...prev.physicalExamination, musculoskeletalExam: e.target.value }
                      }))}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-20"
                      placeholder="Articulaciones, músculos, deformidades..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-white font-medium mb-2">Notas Adicionales</label>
                <textarea
                  value={consultationData.physicalExamination.notes}
                  onChange={(e) => setConsultationData(prev => ({
                    ...prev,
                    physicalExamination: { ...prev.physicalExamination, notes: e.target.value }
                  }))}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-24"
                  placeholder="Observaciones adicionales del examen físico..."
                />
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-xl px-6 py-3 text-white hover:bg-blue-500/40 transition-colors flex items-center space-x-2"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Paso 5: Diagnóstico y Plan */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Diagnóstico y Plan de Tratamiento</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Evaluación/Diagnóstico</label>
                  <textarea
                    value={consultationData.assessment}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, assessment: e.target.value }))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-32"
                    placeholder="Diagnóstico presuntivo, diagnósticos diferenciales, impresión clínica..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Plan de Tratamiento</label>
                  <textarea
                    value={consultationData.plan}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-32"
                    placeholder="Plan terapéutico, estudios adicionales, recomendaciones..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-medium">Medicamentos</label>
                    <button
                      onClick={addMedication}
                      className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2 text-green-300 hover:bg-green-500/30 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {consultationData.medications.map((medication, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <input
                            type="text"
                            placeholder="Medicamento"
                            value={medication.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                          />
                          <input
                            type="text"
                            placeholder="Dosis"
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                          />
                          <input
                            type="text"
                            placeholder="Frecuencia"
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Duración"
                              value={medication.duration}
                              onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            />
                            <button
                              onClick={() => removeMedication(index)}
                              className="bg-red-500/20 border border-red-400/30 rounded-lg p-2 text-red-300 hover:bg-red-500/30 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Seguimiento</label>
                  <textarea
                    value={consultationData.followUp}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, followUp: e.target.value }))}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 h-24"
                    placeholder="Instrucciones de seguimiento, próxima cita, signos de alarma..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <button
                  onClick={() => createConsultationMutation.mutate(consultationData)}
                  disabled={createConsultationMutation.isPending}
                  className="bg-green-500/30 backdrop-blur-sm border border-green-400/50 rounded-xl px-6 py-3 text-white hover:bg-green-500/40 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {createConsultationMutation.isPending ? 'Guardando...' : 'Guardar Consulta'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal para nuevo paciente */}
        <AnimatePresence>
          {showNewPatientForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Registrar Nuevo Paciente</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={newPatient.firstName}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Apellido</label>
                    <input
                      type="text"
                      value={newPatient.lastName}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Edad</label>
                    <input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Género</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewPatientForm(false)}
                    className="bg-white/10 border border-white/20 rounded-lg px-6 py-2 text-white hover:bg-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => createPatientMutation.mutate(newPatient)}
                    disabled={createPatientMutation.isPending}
                    className="bg-blue-500/30 border border-blue-400/50 rounded-lg px-6 py-2 text-white hover:bg-blue-500/40 transition-colors"
                  >
                    {createPatientMutation.isPending ? 'Creando...' : 'Crear Paciente'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}