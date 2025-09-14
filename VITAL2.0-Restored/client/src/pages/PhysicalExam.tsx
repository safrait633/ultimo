import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Settings, Clock, Stethoscope, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import SpecialtySelector from '@/components/medical-exam/SpecialtySelector';
import ProgressDashboard from '@/components/medical-exam/ProgressDashboard';
import QuickConfiguration from '@/components/medical-exam/QuickConfiguration';
import InteractiveExamForm from '@/components/medical-exam/InteractiveExamForm';

interface PatientData {
  id: string;
  name?: string;
  age: number;
  gender: string;
  isAnonymous: boolean;
  birthDate: string;
}

interface PhysicalExamProps {
  patientData: PatientData;
}

interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  patientCount: number;
}

export default function PhysicalExam({ patientData }: PhysicalExamProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estado principal
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [operationMode, setOperationMode] = useState('demonstration');
  const [configuration, setConfiguration] = useState({
    speedMode: 'fast_track',
    voiceRecognition: false,
    mobileGestures: true,
    autoComplete: true,
    realTimeValidation: true
  });

  // Estado del formulario
  const [formData, setFormData] = useState<any>({});
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cargar especialidades
  const { data: specialties = [], isLoading: specialtiesLoading } = useQuery({
    queryKey: ['/api/specialties'],
    queryFn: async () => {
      const response = await fetch('/api/specialties');
      return response.json();
    }
  });

  // Actualizar reloj
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inicializar cuando se selecciona especialidad
  useEffect(() => {
    if (selectedSpecialty && !startTime) {
      setStartTime(new Date());
      initializeFormForSpecialty(selectedSpecialty);
    }
  }, [selectedSpecialty]);

  const initializeFormForSpecialty = async (specialty: Specialty) => {
    // Resetear estado
    setFormData({});
    setCurrentSection(null);
    setProgress(0);

    // Aplicar datos de demostración si está en modo demo
    if (operationMode === 'demonstration') {
      applyDemoData(specialty);
    }
  };

  const applyDemoData = (specialty: Specialty) => {
    const demoData: Record<string, any> = {
      cardiologia: {
        heartRate: '72',
        bloodPressureSystolic: '120',
        bloodPressureDiastolic: '80',
        temperature: '36.5',
        generalAppearance: 'Paciente consciente, orientado, colaborador',
        cardiovascular: 'Ruidos cardíacos rítmicos, sin soplos audibles'
      },
      neurologia: {
        heartRate: '68',
        bloodPressureSystolic: '125',
        bloodPressureDiastolic: '85',
        temperature: '36.8',
        generalAppearance: 'Paciente alerta, responde apropiadamente',
        neurological: 'Funciones cognitivas preservadas, reflejos normales'
      },
      // Más datos de demo para otras especialidades...
    };

    const specialtyData = demoData[specialty.slug] || {};
    setFormData(specialtyData);
  };

  const saveExamMutation = useMutation({
    mutationFn: async (examData: any) => {
      const response = await fetch('/api/physical-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientData.id,
          specialtyId: selectedSpecialty?.id,
          formData: examData,
          operationMode,
          configuration
        })
      });
      
      if (!response.ok) {
        throw new Error('Error guardando examen');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Examen guardado",
        description: "El examen físico se guardó correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/physical-exams'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo guardar el examen físico",
        variant: "destructive",
      });
      console.error('Error saving exam:', error);
    }
  });

  const handleSaveExam = () => {
    if (!selectedSpecialty) {
      toast({
        title: "Error",
        description: "Selecciona una especialidad primero",
        variant: "destructive",
      });
      return;
    }

    saveExamMutation.mutate(formData);
  };

  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 lg:p-6">
      <div className="w-full">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] min-w-[44px] lg:min-h-[40px] lg:min-w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-0 lg:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center">
                <Stethoscope className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3" />
                <span className="hidden sm:inline">Examen Médico Interactivo</span>
                <span className="sm:hidden">Examen</span>
              </h1>
              <p className="text-sm lg:text-base text-white/80">
                {patientData.isAnonymous 
                  ? `Paciente Anónimo - ${patientData.age} años`
                  : `${patientData.name} - ${patientData.age} años`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between lg:justify-end space-x-2 lg:space-x-4">
            <div className="flex items-center text-white/80 text-sm lg:text-base order-2 lg:order-1">
              <Clock className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">{currentTime.toLocaleTimeString()}</span>
              <span className="sm:hidden">{currentTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="order-1 lg:order-2">
              <QuickConfiguration 
                configuration={configuration}
                onChange={setConfiguration}
                operationMode={operationMode}
                onModeChange={setOperationMode}
              />
            </div>
          </div>
        </motion.div>

        {/* Selector de Especialidad */}
        {!selectedSpecialty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 mb-4 md:mb-6">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl text-center">
                  Selecciona una Especialidad Médica
                </CardTitle>
                <p className="text-white/80 text-center text-sm md:text-base">
                  Elige la especialidad para cargar el formulario correspondiente
                </p>
              </CardHeader>
            </Card>
            
            <SpecialtySelector
              specialties={specialties}
              selectedSpecialty={selectedSpecialty}
              onSelect={handleSpecialtySelect}
              loading={specialtiesLoading}
            />
          </motion.div>
        )}

        {selectedSpecialty ? (
          <div className="flex flex-col xl:grid xl:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar - Dashboard de progreso (colapsable en móvil) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-1 order-2 xl:order-1"
            >
              <div className="sticky top-4">
                <ProgressDashboard 
                  specialty={selectedSpecialty}
                  progress={progress}
                  currentSection={currentSection}
                  startTime={startTime}
                  speedMode={configuration.speedMode}
                  predictions={{
                    estimatedTime: 25,
                    remainingTime: '18 min',
                    nextSection: 'Cardiovascular',
                    suggestions: [
                      'Completar signos vitales',
                      'Revisar antecedentes relevantes',
                      'Documentar hallazgos principales'
                    ]
                  }}
                />
              </div>
            </motion.div>

            {/* Área principal - Formulario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-3 order-1 xl:order-2"
            >
              <InteractiveExamForm 
                specialty={selectedSpecialty}
                mode='advanced'
                patientData={{
                  id: patientData.id,
                  name: patientData.name || 'Paciente Anónimo',
                  age: patientData.age,
                  gender: patientData.gender
                }}
                onDataChange={setFormData}
                onComplete={(examData) => {
                  console.log('Exam completed:', examData);
                  handleSaveExam();
                }}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-white/60 py-12"
          >
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl mb-2">Sistema de Examen Médico Avanzado</h3>
            <p className="max-w-2xl mx-auto">
              Plataforma interactiva con algoritmo ultra-rápido, navegación predictiva, 
              autocompletado inteligente y validación en tiempo real para optimizar 
              el proceso de documentación médica.
            </p>
          </motion.div>
        )}

        {/* Footer con acciones globales - Responsive */}
        {selectedSpecialty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 md:mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 space-y-4 lg:space-y-0"
          >
            {/* Info de estado - Móvil arriba */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-sm text-white/80 lg:hidden">
              <span>Modo: <strong>{operationMode}</strong></span>
              <span className="hidden sm:inline">|</span>
              <span>Velocidad: <strong>{configuration.speedMode}</strong></span>
            </div>

            {/* Controles principales */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              {/* Acciones secundarias */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px]"
                  onClick={() => {
                    setSelectedSpecialty(null);
                    setFormData({});
                    setStartTime(null);
                    setProgress(0);
                  }}
                >
                  🔄 <span className="hidden sm:inline ml-1">Cambiar Especialidad</span>
                  <span className="sm:hidden ml-1">Cambiar</span>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px]"
                >
                  📋 <span className="hidden sm:inline ml-1">Cargar Plantilla</span>
                  <span className="sm:hidden ml-1">Cargar</span>
                </Button>
              </div>

              {/* Info de estado - Desktop */}
              <div className="hidden lg:flex items-center space-x-2 text-white/80 text-sm">
                <span>Modo: <strong>{operationMode}</strong></span>
                <span>|</span>
                <span>Velocidad: <strong>{configuration.speedMode}</strong></span>
              </div>

              {/* Acciones principales */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] order-2 sm:order-1"
                >
                  💾 <span className="hidden sm:inline ml-1">Guardar Plantilla</span>
                  <span className="sm:hidden ml-1">Guardar</span>
                </Button>
                <Button
                  onClick={handleSaveExam}
                  disabled={saveExamMutation.isPending}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-h-[44px] order-1 sm:order-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveExamMutation.isPending ? 'Guardando...' : 'Finalizar Examen'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}