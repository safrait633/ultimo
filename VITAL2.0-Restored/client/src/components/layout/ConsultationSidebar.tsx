import { useAuth } from "@/hooks/use-auth";
import { 
  Heart,
  Stethoscope,
  BarChart3,
  FileText,
  Brain,
  Baby,
  Bone,
  Eye,
  Scissors,
  Users,
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConsultationSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  consultationData?: {
    code?: string;
    specialty?: string;
    age?: string;
    gender?: string;
    patientName?: string;
  };
}

// Configuración de secciones por especialidad
const getFormSectionsBySpecialty = (specialty: string) => {
  const specialtyConfig: { [key: string]: any[] } = {
    'Cardiología': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'anamnesis', label: 'Anamnesis', icon: FileText },
      { id: 'physical-exam', label: 'Examen Físico', icon: Stethoscope },
      { id: 'auscultacion', label: 'Auscultación', icon: Stethoscope },
      { id: 'circulacion-periferica', label: 'Circulación', icon: Activity },
      { id: 'vascular-exam', label: 'Examen Vascular (ITB)', icon: BarChart3 },
      { id: 'electrocardiograma', label: 'ECG', icon: Activity },
      { id: 'escalas-riesgo', label: 'Escalas de Riesgo', icon: BarChart3 },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ],
    'Neurología': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'neurological-exam', label: 'Examen Neurológico', icon: Brain },
      { id: 'cognitive-assessment', label: 'Evaluación Cognitiva', icon: Brain },
      { id: 'motor-function', label: 'Función Motora', icon: Activity },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ],
    'Pediatría': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'growth-development', label: 'Crecimiento y Desarrollo', icon: Baby },
      { id: 'physical-exam', label: 'Examen Físico Pediátrico', icon: Stethoscope },
      { id: 'vaccination', label: 'Esquema de Vacunación', icon: Users },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ],
    'Traumatología': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'musculoskeletal', label: 'Examen Musculoesquelético', icon: Bone },
      { id: 'joint-mobility', label: 'Movilidad Articular', icon: Activity },
      { id: 'imaging-studies', label: 'Estudios de Imagen', icon: Eye },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ],
    'Cirugía General': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'physical-exam', label: 'Examen Físico', icon: Stethoscope },
      { id: 'surgical-assessment', label: 'Evaluación Quirúrgica', icon: Scissors },
      { id: 'preoperative', label: 'Evaluación Preoperatoria', icon: BarChart3 },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ],
    'Ginecología': [
      { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
      { id: 'gynecological-exam', label: 'Examen Ginecológico', icon: Users },
      { id: 'reproductive-health', label: 'Salud Reproductiva', icon: Heart },
      { id: 'screening', label: 'Tamizajes', icon: Eye },
      { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
    ]
  };

  // Secciones por defecto para especialidades no configuradas
  return specialtyConfig[specialty] || [
    { id: 'vital-signs', label: 'Signos Vitales', icon: Heart },
    { id: 'physical-exam', label: 'Examen Físico', icon: Stethoscope },
    { id: 'clinical-assessment', label: 'Evaluación Clínica', icon: Activity },
    { id: 'diagnosis', label: 'Diagnóstico y Plan', icon: FileText }
  ];
};

export function ConsultationSidebar({ collapsed, mobileOpen, onClose, activeSection, onSectionChange, consultationData }: ConsultationSidebarProps) {
  const { user } = useAuth();
  
  // Obtener secciones específicas para la especialidad
  const formSections = getFormSectionsBySpecialty(consultationData?.specialty || 'Medicina General');

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex-shrink-0",
          "h-full overflow-y-auto",
          collapsed ? "w-[60px]" : "w-[220px]",
          // Mobile: fixed positioning with overlay
          "md:relative md:translate-x-0",
          mobileOpen ? "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] translate-x-0" : "hidden md:block"
        )}
      >
        {/* User Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10 ring-2 ring-emerald-500/20">
              <AvatarImage src={undefined} alt={user?.firstName} />
              <AvatarFallback className="bg-emerald-500 text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Dr. {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.specialty}
                </div>
                <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  En línea
                </div>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {consultationData?.patientName || 'Paciente'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consulta {consultationData?.code || 'P009'} - {consultationData?.specialty || 'Medicina General'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {consultationData?.age || '0'} años • {consultationData?.gender === 'M' ? 'Masculino' : 'Femenino'}
              </p>
            </div>
          )}
        </div>

        {/* Secciones del formulario */}
        <div className="flex-1 p-4">
          <p className="px-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-2">
            Secciones del Formulario
          </p>
          
          <nav className="flex flex-col space-y-1 overflow-y-auto">
            {formSections.map((section) => {
              const IconComponent = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    isActive 
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{section.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Botones de acción */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Finalizar Consulta
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold py-2 px-4 rounded-lg transition-colors text-gray-900 dark:text-gray-100">
            Guardar Borrador
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <Stethoscope className="w-4 h-4" />
              <span>VITAL v2.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}