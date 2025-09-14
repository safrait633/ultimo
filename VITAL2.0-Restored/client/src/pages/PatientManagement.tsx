import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Eye,
  Calendar,
  Phone,
  Mail,
  User,
  Heart,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Upload,
  MoreVertical,
  Activity,
  TrendingUp,
  Users,
  Stethoscope,
  ArrowLeft
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  birthDate: string;
  documentNumber: string;
  email?: string;
  phone?: string;
  medicalHistory?: string;
  insurancePolicyNumber?: string;
  insuranceProvider?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status?: 'stable' | 'critical' | 'observation';
}

interface PatientStats {
  total: number;
  new: number;
  critical: number;
  scheduled: number;
}

// Helper function to calculate age from birth date
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export default function PatientManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  // Queries with search
  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients', searchTerm],
    queryFn: async () => {
      const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(`/api/patients${searchParam}`);
      if (!response.ok) throw new Error('Error al cargar pacientes');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: patientStats } = useQuery<PatientStats>({
    queryKey: ['/api/patients/stats'],
    enabled: !!user,
  });

  // Filtrar y ordenar pacientes (backend ya filtra por búsqueda)
  const filteredPatients = patients
    .filter(patient => {
      const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
      return matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'observation':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'stable':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Crítico';
      case 'observation':
        return 'Observación';
      case 'stable':
        return 'Estable';
      default:
        return 'Desconocido';
    }
  };

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
              <button 
                onClick={() => setLocation('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Pacientes</h1>
                <p className="text-blue-200">Administrar información de pacientes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors">
                <Upload className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setLocation('/nuevo-paciente')}
                className="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 rounded-xl px-4 py-2 text-white hover:bg-blue-500/40 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Paciente</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Pacientes</p>
                <p className="text-3xl font-bold text-white mt-1">{patientStats?.total || 0}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+5%</span>
              <span className="text-blue-200 ml-1">este mes</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Nuevos</p>
                <p className="text-3xl font-bold text-white mt-1">{patientStats?.new || 0}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Plus className="w-6 h-6 text-green-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Calendar className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-200">últimos 7 días</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Críticos</p>
                <p className="text-3xl font-bold text-white mt-1">{patientStats?.critical || 0}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Heart className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400">requieren atención</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Programados</p>
                <p className="text-3xl font-bold text-white mt-1">{patientStats?.scheduled || 0}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Clock className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-purple-400">próximas citas</span>
            </div>
          </div>
        </motion.div>

        {/* Filtros y Búsqueda */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                />
              </div>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="stable">Estable</option>
              <option value="observation">Observación</option>
              <option value="critical">Crítico</option>
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="all">Todos los géneros</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="lastVisit">Última visita</option>
              <option value="name">Nombre</option>
              <option value="age">Edad</option>
              <option value="consultations">Consultas</option>
            </select>
          </div>
        </motion.div>

        {/* Lista de Pacientes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Lista de Pacientes</h2>
              <span className="text-blue-200 text-sm">{filteredPatients.length} pacientes</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white/60">Cargando pacientes...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No se encontraron pacientes</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {patient.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-blue-200 text-sm">
                            Doc: {patient.documentNumber}
                          </span>
                          {patient.insurancePolicyNumber && (
                            <span className="text-blue-200 text-sm">
                              Póliza: {patient.insurancePolicyNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {patient.phone && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Phone className="w-4 h-4 text-blue-400" />
                            <span className="text-white text-sm">{patient.phone}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-200 text-sm">{patient.email}</span>
                          </div>
                        )}
                      </div>

                      {patient.status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                          {getStatusText(patient.status)}
                        </span>
                      )}

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Store patient data for the physical exam
                            localStorage.setItem('currentPatientData', JSON.stringify({
                              id: patient.id,
                              name: patient.name,
                              age: calculateAge(patient.birthDate),
                              gender: 'no especificado', // Default - can be enhanced
                              documentNumber: patient.documentNumber
                            }));
                            setLocation('/medical-exams-v2');
                          }}
                          className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-2 text-blue-300 hover:bg-blue-500/30 transition-colors"
                          title="Nuevo examen físico interactivo"
                        >
                          <Stethoscope className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                            setShowPatientDetails(true);
                          }}
                          className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-2 text-green-300 hover:bg-green-500/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Agregar funcionalidad del menú
                            toast({
                              title: "Menú del paciente",
                              description: `Opciones para ${patient.name}`,
                            });
                          }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                          title="Más opciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {patient.medicalHistory && (
                    <div className="mt-3 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm">
                        Historia médica disponible
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Modal de Detalles del Paciente */}
        <AnimatePresence>
          {showPatientDetails && selectedPatient && (
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
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedPatient.name}
                  </h3>
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Información Personal</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Documento:</span>
                          <span className="text-white">{selectedPatient.documentNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Fecha de nacimiento:</span>
                          <span className="text-white">{selectedPatient.birthDate}</span>
                        </div>
                        {selectedPatient.phone && (
                          <div className="flex justify-between">
                            <span className="text-blue-200">Teléfono:</span>
                            <span className="text-white">{selectedPatient.phone}</span>
                          </div>
                        )}
                        {selectedPatient.email && (
                          <div className="flex justify-between">
                            <span className="text-blue-200">Email:</span>
                            <span className="text-white">{selectedPatient.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedPatient.insurancePolicyNumber && (
                      <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
                        <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Información de Seguro
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-200">Póliza:</span>
                            <span className="text-white">{selectedPatient.insurancePolicyNumber}</span>
                          </div>
                          {selectedPatient.insuranceProvider && (
                            <div className="flex justify-between">
                              <span className="text-blue-200">Proveedor:</span>
                              <span className="text-white">{selectedPatient.insuranceProvider}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">Historial Médico</h4>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {selectedPatient.medicalHistory || 'No hay historial médico registrado.'}
                      </p>
                    </div>

                    {selectedPatient.address && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-3">Información de Contacto</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-200">Dirección:</span>
                            <span className="text-white">{selectedPatient.address}</span>
                          </div>
                          {selectedPatient.city && (
                            <div className="flex justify-between">
                              <span className="text-blue-200">Ciudad:</span>
                              <span className="text-white">{selectedPatient.city}</span>
                            </div>
                          )}
                          {selectedPatient.postalCode && (
                            <div className="flex justify-between">
                              <span className="text-blue-200">Código postal:</span>
                              <span className="text-white">{selectedPatient.postalCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    onClick={() => {
                      // Store patient data for the physical exam
                      localStorage.setItem('currentPatientData', JSON.stringify({
                        id: selectedPatient.id,
                        name: selectedPatient.name,
                        age: calculateAge(selectedPatient.birthDate),
                        gender: 'no especificado', // Default - can be enhanced
                        documentNumber: selectedPatient.documentNumber
                      }));
                      setLocation('/medical-exams-v2');
                    }}
                    className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-6 py-2 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Nuevo Examen</span>
                  </button>
                  <button className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-6 py-2 text-green-300 hover:bg-green-500/30 transition-colors flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg px-6 py-2 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Historial</span>
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