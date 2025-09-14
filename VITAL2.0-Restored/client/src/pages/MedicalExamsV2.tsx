import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  ArrowLeft, 
  Stethoscope, 
  Activity, 
  Heart, 
  Brain, 
  Eye, 
  Ear, 
  Zap, 
  Wind, 
  Shield, 
  Bone, 
  Pill, 
  Microscope,
  User,
  Users,
  Baby,
  Thermometer,
  Radiation,
  ChevronDown,
  Search,
  X,
  Bookmark,
  BookmarkCheck,
  Filter,
  Sparkles,
  Waves,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import TemplateSourceSelector from '@/components/TemplateSourceSelector';


// Importar los demos
import CardiologyDemo from '@/components/medical-exam/AdvancedCardiologyForm';
import HematologyDemo from '@/components/medical-exam/AdvancedHematologyForm';
import NeurologyDemo from '@/components/medical-exam/AdvancedNeurologiaForm';
import EndocrinologyDemo from '@/components/medical-exam/AdvancedEndocrinologyForm';
import PneumologyDemo from '@/components/medical-exam/AdvancedPneumologyForm';
import DermatologyDemo from '@/components/medical-exam/AdvancedDermatologyForm';
import TraumatologyDemo from '@/components/medical-exam/AdvancedTraumatologyForm';
import OphthalmologyDemo from '@/components/medical-exam/AdvancedOphthalmologyForm';
import GastroenterologyDemo from '@/components/medical-exam/AdvancedGastroForm';
import GeriatricsDemo from '@/components/medical-exam/AdvancedGeriatricsForm';
import InfectiologyDemo from '@/components/medical-exam/AdvancedInfectiologyForm';
import OtolaryngologyDemo from '@/components/medical-exam/AdvancedOtolaryngologyForm';
import RheumatologyDemo from '@/components/medical-exam/AdvancedRheumatologyForm';
import UrologyDemo from '@/components/medical-exam/AdvancedUrologyForm';
import PsychiatryDemo from '@/components/medical-exam/AdvancedPsychiatryForm';

// Импорты для компонентов из medical-exams-v2
import CardiologyDemoV2 from '@/components/medical-exams-v2/CardiologyDemo';
import HematologyDemoV2 from '@/components/medical-exams-v2/HematologyDemo';
import NeurologyDemoV2 from '@/components/medical-exams-v2/NeurologyDemo';
import EndocrinologyDemoV2 from '@/components/medical-exams-v2/EndocrinologyDemo';
import PneumologyDemoV2 from '@/components/medical-exams-v2/PneumologyDemo';
import DermatologyDemoV2 from '@/components/medical-exams-v2/DermatologyDemo';
import TraumatologyDemoV2 from '@/components/medical-exams-v2/TraumatologyDemo';
import OphthalmologyDemoV2 from '@/components/medical-exams-v2/OphthalmologyDemo';
import GastroenterologyDemoV2 from '@/components/medical-exams-v2/GastroenterologyDemo';
import GeriatricsDemoV2 from '@/components/medical-exams-v2/GeriatricsDemo';
import InfectiologyDemoV2 from '@/components/medical-exams-v2/InfectiologyDemo';
import OtolaryngologyDemoV2 from '@/components/medical-exams-v2/OtolaryngologyDemo';
import RheumatologyDemoV2 from '@/components/medical-exams-v2/RheumatologyDemo';
import UrologyDemoV2 from '@/components/medical-exams-v2/UrologyDemo';
import PsychiatryDemoV2 from '@/components/medical-exams-v2/PsychiatryDemo';

interface PatientData {
  id: string;
  name?: string;
  age: number;
  gender: string;
  isAnonymous: boolean;
  birthDate: string;
}

// Función para obtener el componente correcto según la fuente
const getSpecialtyComponent = (specialtyId: string, source: 'v1' | 'v2') => {
  const componentsMap = {
    v1: {
      cardiologia: CardiologyDemo,
      hematologia: HematologyDemo,
      neurologia: NeurologyDemo,
      endocrinologia: EndocrinologyDemo,
      neumologia: PneumologyDemo,
      dermatologia: DermatologyDemo,
      traumatologia: TraumatologyDemo,
      oftalmologia: OphthalmologyDemo,
      gastroenterologia: GastroenterologyDemo,
      geriatria: GeriatricsDemo,
      infectologia: InfectiologyDemo,
      otorrinolaringologia: OtolaryngologyDemo,
      reumatologia: RheumatologyDemo,
      urologia: UrologyDemo,
      psiquiatria: PsychiatryDemo
    },
    v2: {
      cardiologia: CardiologyDemoV2,
      hematologia: HematologyDemoV2,
      neurologia: NeurologyDemoV2,
      endocrinologia: EndocrinologyDemoV2,
      neumologia: PneumologyDemoV2,
      dermatologia: DermatologyDemoV2,
      traumatologia: TraumatologyDemoV2,
      oftalmologia: OphthalmologyDemoV2,
      gastroenterologia: GastroenterologyDemoV2,
      geriatria: GeriatricsDemoV2,
      infectologia: InfectiologyDemoV2,
      otorrinolaringologia: OtolaryngologyDemoV2,
      reumatologia: RheumatologyDemoV2,
      urologia: UrologyDemoV2,
      psiquiatria: PsychiatryDemoV2
    }
  };
  
  return componentsMap[source][specialtyId as keyof typeof componentsMap.v1];
};

// Lista de especialidades disponibles con sus demos
const AVAILABLE_SPECIALTIES = [
  {
    id: 'cardiologia',
    name: 'Cardiología',
    component: CardiologyDemo, // Компонент по умолчанию для отображения в списке
    description: 'Evaluación cardiovascular completa',
    icon: Heart,
    color: 'from-red-400/80 to-pink-500/80'
  },
  {
    id: 'hematologia',
    name: 'Hematología',
    component: HematologyDemo,
    description: 'Sistema hematológico inteligente',
    icon: Activity,
    color: 'from-purple-400/80 to-indigo-500/80'
  },
  {
    id: 'neurologia',
    name: 'Neurología',
    component: NeurologyDemo,
    description: 'Evaluación neurológica sistemática',
    icon: Brain,
    color: 'from-indigo-400/80 to-blue-500/80'
  },
  {
    id: 'endocrinologia',
    name: 'Endocrinología',
    component: EndocrinologyDemo,
    description: 'Evaluación del sistema endocrino',
    icon: Zap,
    color: 'from-yellow-400/80 to-orange-500/80'
  },
  {
    id: 'neumologia',
    name: 'Neumología',
    component: PneumologyDemo,
    description: 'Evaluación del sistema respiratorio',
    icon: Wind,
    color: 'from-cyan-400/80 to-blue-500/80'
  },
  {
    id: 'dermatologia',
    name: 'Dermatología',
    component: DermatologyDemo,
    description: 'Evaluación dermatológica especializada',
    icon: Shield,
    color: 'from-orange-400/80 to-red-500/80'
  },
  {
    id: 'traumatologia',
    name: 'Traumatología',
    component: TraumatologyDemo,
    description: 'Sistema musculoesquelético',
    icon: Bone,
    color: 'from-gray-400/80 to-slate-500/80'
  },
  {
    id: 'oftalmologia',
    name: 'Oftalmología',
    component: OphthalmologyDemo,
    description: 'Evaluación visual completa',
    icon: Eye,
    color: 'from-blue-400/80 to-indigo-500/80'
  },
  {
    id: 'gastroenterologia',
    name: 'Gastroenterología',
    component: GastroenterologyDemo,
    description: 'Evaluación gastrointestinal con escalas de riesgo',
    icon: Stethoscope,
    color: 'from-yellow-400/80 to-orange-500/80'
  },
  {
    id: 'geriatria',
    name: 'Geriatría',
    component: GeriatricsDemo,
    description: 'Evaluación geriátrica integral y síndromes geriátricos',
    icon: User,
    color: 'from-gray-400/80 to-blue-500/80'
  },
  {
    id: 'infectologia',
    name: 'Infectología',
    component: InfectiologyDemo,
    description: 'Diagnóstico y manejo de enfermedades infecciosas',
    icon: Shield,
    color: 'from-red-400/80 to-orange-500/80'
  },
  {
    id: 'otorrinolaringologia',
    name: 'Otorrinolaringología',
    component: OtolaryngologyDemo,
    description: 'Evaluación de oído, nariz y garganta',
    icon: Ear,
    color: 'from-blue-400/80 to-purple-500/80'
  },
  {
    id: 'reumatologia',
    name: 'Reumatología',
    component: RheumatologyDemo,
    description: 'Evaluación reumatológica y enfermedades autoinmunes',
    icon: Bone,
    color: 'from-purple-600 to-indigo-500'
  },
  {
    id: 'urologia',
    name: 'Urología',
    component: UrologyDemo,
    description: 'Evaluación urológica y sistema genitourinario',
    icon: Activity,
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: 'psiquiatria',
    name: 'Psiquiatría',
    component: PsychiatryDemo,
    description: 'Evaluación de salud mental',
    icon: User,
    color: 'from-green-500 to-emerald-500'
  }
];

export default function MedicalExamsV2() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const searchParams = useSearch();
  const specialty = new URLSearchParams(searchParams).get('specialty');
  const source = new URLSearchParams(searchParams).get('source') as 'v1' | 'v2' || 'v1';
  
  // Estados para búsqueda y favoritos
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Estados para el selector de fuente de plantillas
  const [isTemplateSourceSelectorOpen, setIsTemplateSourceSelectorOpen] = useState(false);
  const [selectedSpecialtyForTemplate, setSelectedSpecialtyForTemplate] = useState<string>('');

  
  // Obtener datos del paciente del localStorage (temporal)
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Intentar obtener datos del paciente del localStorage
    const savedPatient = localStorage.getItem('currentPatientData');
    if (savedPatient) {
      try {
        const patientInfo = JSON.parse(savedPatient);
        setPatientData({
          id: patientInfo.id,
          name: patientInfo.name,
          age: patientInfo.age,
          gender: patientInfo.gender || 'no especificado',
          isAnonymous: false,
          birthDate: patientInfo.birthDate || '1989-01-01'
        });
      } catch (error) {
        console.error('Error parsing patient data:', error);
        // Datos por defecto
        setPatientData({
          id: 'demo-patient',
          name: 'Paciente Demo',
          age: 35,
          gender: 'M',
          isAnonymous: false,
          birthDate: '1989-01-01'
        });
      }
    } else {
      // Datos por defecto para demo
      setPatientData({
        id: 'demo-patient',
        name: 'Paciente Demo',
        age: 35,
        gender: 'M',
        isAnonymous: false,
        birthDate: '1989-01-01'
      });
    }
    
    // Cargar favoritos del localStorage
    loadFavorites();
  }, []);
  
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('specialty_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };
  
  const toggleFavorite = (specialtyId: string) => {
    const newFavorites = favorites.includes(specialtyId)
      ? favorites.filter(id => id !== specialtyId)
      : [...favorites, specialtyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('specialty_favorites', JSON.stringify(newFavorites));
  };

  const handleBack = () => {
    if (specialty) {
      // Si estamos en una especialidad, volver al selector
      setLocation('/medical-exams-v2');
    } else {
      // Si estamos en el selector, volver a la página de pacientes
      setLocation('/patients');
    }
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialtyForTemplate(specialtyId);
    setIsTemplateSourceSelectorOpen(true);
  };
  
  const handleTemplateSourceSelect = (sourceType: 'v1' | 'v2', specialtyId: string) => {
    // Добавляем параметр source к URL для указания источника шаблонов
    setLocation(`/medical-exams-v2?specialty=${specialtyId}&source=${sourceType}`);
    setIsTemplateSourceSelectorOpen(false);
    setSelectedSpecialtyForTemplate('');
  };
  
  const handleTemplateSourceClose = () => {
    setIsTemplateSourceSelectorOpen(false);
    setSelectedSpecialtyForTemplate('');
  };

  const handleExamComplete = (examData: any) => {
    console.log('Exam completed:', examData);
    // Aquí podrías guardar los datos del examen
    alert('🎉 ¡Examen completado! Los datos se han guardado correctamente.');
    setLocation('/medical-exams-v2'); // Volver al selector
  };

  // Filtrar especialidades basado en búsqueda y favoritos
  const filteredSpecialties = AVAILABLE_SPECIALTIES.filter(specialty => {
    const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOnlyFavorites) {
      return matchesSearch && favorites.includes(specialty.id);
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    // Ordenar favoritos primero
    if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
    if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchTerm('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Cargando datos del paciente...</div>
      </div>
    );
  }

  // Si se especifica una especialidad, mostrar el demo correspondiente
  if (specialty) {
    const selectedSpecialty = AVAILABLE_SPECIALTIES.find(s => s.id === specialty);
    
    if (selectedSpecialty) {
      const SpecialtyComponent = getSpecialtyComponent(specialty, source);
      if (!SpecialtyComponent) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Demo en desarrollo</h2>
              <Button onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al selector
              </Button>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          {/* Header simple */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Badge 
              className={`${
                source === 'v2' 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              } backdrop-blur-md`}
            >
              {source === 'v2' ? '📁 Расширенные шаблоны' : '📁 Классические шаблоны'}
            </Badge>
          </div>
          
          <SpecialtyComponent 
            patientData={patientData}
            onComplete={handleExamComplete}
          />
        </div>
      );
    } else {
      // Especialidad no encontrada
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Especialidad no encontrada</h2>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al selector
            </Button>
          </div>
        </div>
      );
    }
  }

  // Mostrar selector de especialidades
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header con glassmorphism - consistente en toda la aplicación */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200 bg-white/5 backdrop-blur-sm rounded-lg mr-2 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Exámenes Médicos v2.0</h1>
                <p className="text-blue-200">Dr. {user?.firstName || user?.name || 'Usuario'} {user?.lastName || ''} - Sistema Médico</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.div>
      


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Información del paciente y buscador */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center justify-between mb-8"
         >
           <div className="flex items-center space-x-4">
             <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
               <Stethoscope className="w-8 h-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-white">
                 Seleccionar Especialidad
               </h1>
               <p className="text-white/80">
                 {patientData.isAnonymous 
                   ? `Paciente Anónimo - ${patientData.age} años`
                   : `${patientData.name} - ${patientData.age} años`
                 }
               </p>
             </div>
           </div>
           
           {/* Controles de búsqueda y filtros */}
           <div className="flex items-center space-x-3">
             {/* Botón de filtro de favoritos */}
             <Button
               onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
               variant={showOnlyFavorites ? "default" : "outline"}
               size="sm"
               className={`${showOnlyFavorites 
                 ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                 : 'text-white border-white/30 hover:bg-white/20 hover:border-white/50 bg-white/5'
               } backdrop-blur-sm rounded-lg transition-all duration-200`}
             >
               <Filter className="h-4 w-4 mr-2" />
               {showOnlyFavorites ? 'Mostrando favoritos' : 'Mostrar favoritos'}
               {favorites.length > 0 && (
                 <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                   {favorites.length}
                 </span>
               )}
             </Button>
             
             {/* Buscador de especialidades */}
             <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
               <Search className="h-4 w-4 text-white/70" />
               <Input
                 type="text"
                 placeholder="Buscar especialidades..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-transparent border-none text-white placeholder-white/90 focus:ring-0 w-64 text-white"
               />
               {searchTerm && (
                 <Button
                   onClick={clearSearch}
                   variant="ghost"
                   size="sm"
                   className="text-white/70 hover:text-white p-1"
                 >
                   <X className="h-4 w-4" />
                 </Button>
               )}
             </div>
           </div>
         </motion.div>

      {/* Mostrar resultados de búsqueda o filtros */}
      {(searchTerm || showOnlyFavorites) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">
                {showOnlyFavorites && searchTerm 
                  ? `Favoritos que coinciden con "${searchTerm}" (${filteredSpecialties.length})`
                  : showOnlyFavorites 
                  ? `Especialidades favoritas (${filteredSpecialties.length})`
                  : `Resultados para "${searchTerm}" (${filteredSpecialties.length})`
                }
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearSearch();
                  setShowOnlyFavorites(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {filteredSpecialties.length === 0 && (
              <p className="text-slate-400 text-sm">
                {showOnlyFavorites 
                  ? 'No tienes especialidades marcadas como favoritas aún.'
                  : 'No se encontraron especialidades que coincidan con tu búsqueda.'
                }
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Grid de especialidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpecialties.map((specialty, index) => (
          <motion.div
            key={specialty.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group relative ${
                !specialty.component ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                favorites.includes(specialty.id) ? 'ring-2 ring-blue-400/50' : ''
              }`}
              onClick={() => specialty.component && handleSpecialtySelect(specialty.id)}
            >
              {/* Botón de favorito */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(specialty.id);
                }}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 p-2 hover:bg-white/20 transition-colors duration-200 z-10"
              >
                {favorites.includes(specialty.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-400 fill-blue-400" />
                ) : (
                  <Bookmark className="w-5 h-5 text-white/60 hover:text-blue-400 transition-colors duration-200" />
                )}
              </Button>
              
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  
                  {/* Ícono con efecto glassmorfismo */}
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${specialty.color} backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <specialty.icon className="w-8 h-8 text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Información */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {specialty.name}
                    </h3>
                  </div>
                  

                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}


      </div>

      {/* Footer informativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-white/60 space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Sistema de Examen Médico v2.0</span>
        </div>
        <p className="text-sm">
          Nuevos demos con mejor UX/UI • Sistema de favoritos • Filtros avanzados • Animaciones suaves • Gradientes por especialidad
        </p>
      </motion.div>
      
      {/* Selector de fuente de plantillas */}
      <TemplateSourceSelector
        isOpen={isTemplateSourceSelectorOpen}
        onClose={handleTemplateSourceClose}
        onSelectSource={handleTemplateSourceSelect}
        specialtyName={AVAILABLE_SPECIALTIES.find(s => s.id === selectedSpecialtyForTemplate)?.name || ''}
        specialtyId={selectedSpecialtyForTemplate}
      />
      </div>
    </div>
  );
}