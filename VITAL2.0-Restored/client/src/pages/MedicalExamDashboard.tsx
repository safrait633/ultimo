import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Heart, 
  Activity, 
  Users, 
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  Stethoscope,
  Brain,
  Eye,
  Search,
  Plus,
  Filter,
  Download,
  ArrowLeft
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  lastVisit: string;
  status: 'stable' | 'critical' | 'observation';
}

interface Consultation {
  id: string;
  patientName: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high';
}

interface VitalSigns {
  id: string;
  patientId: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  recordedAt: string;
}

export default function MedicalExamDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');

  // Queries para datos médicos
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients', selectedTimeframe],
    enabled: !!user,
  });

  const { data: consultations = [] } = useQuery<Consultation[]>({
    queryKey: ['/api/consultations', selectedTimeframe],
    enabled: !!user,
  });

  const { data: vitalSigns = [] } = useQuery<VitalSigns[]>({
    queryKey: ['/api/vital-signs', selectedTimeframe],
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
  });

  // Estadísticas calculadas
  const stats = {
    totalPatients: patients.length,
    todayConsultations: consultations.filter(c => c.status === 'pending').length,
    criticalPatients: patients.filter(p => p.status === 'critical').length,
    completedToday: consultations.filter(c => c.status === 'completed').length,
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityConsultations = consultations
    .filter(c => c.priority === 'high' || c.status === 'pending')
    .slice(0, 5);

  const recentVitals = vitalSigns
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-['Manrope']">
      {/* Header con glassmorphism */}
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
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Examen Médico</h1>
                <p className="text-blue-200">Dr. {user?.firstName} {user?.lastName} - {user?.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                />
              </div>
              
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas principales con glassmorphism */}
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
                <p className="text-3xl font-bold text-white mt-1">{stats.totalPatients}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-blue-200 ml-1">vs mes anterior</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Consultas Hoy</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.todayConsultations}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-green-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Clock className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400">{consultations.filter(c => c.status === 'in-progress').length}</span>
              <span className="text-blue-200 ml-1">en progreso</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Pacientes Críticos</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.criticalPatients}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Heart className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400">Requieren atención</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Completadas</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.completedToday}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <Activity className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">100%</span>
              <span className="text-blue-200 ml-1">de eficiencia</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultas Prioritarias */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Consultas Prioritarias</h2>
              <div className="flex space-x-2">
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLocation('/nuevo-paciente')}
                  className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-4 py-2 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Examen</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {priorityConsultations.map((consultation, index) => (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{consultation.patientName}</h3>
                        <p className="text-blue-200 text-sm">{consultation.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consultation.priority === 'high' 
                          ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                          : consultation.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          : 'bg-green-500/20 text-green-300 border border-green-400/30'
                      }`}>
                        {consultation.priority === 'high' ? 'Alta' : 
                         consultation.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'pending'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                          : consultation.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          : 'bg-green-500/20 text-green-300 border border-green-400/30'
                      }`}>
                        {consultation.status === 'pending' ? 'Pendiente' :
                         consultation.status === 'in-progress' ? 'En Progreso' : 'Completada'}
                      </span>
                      
                      <span className="text-blue-200 text-sm">{consultation.scheduledTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Signos Vitales Recientes */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Signos Vitales</h2>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white hover:bg-white/20 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentVitals.map((vital, index) => (
                <motion.div
                  key={vital.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">Paciente #{vital.patientId.slice(-4)}</h3>
                    <span className="text-blue-200 text-sm">{vital.recordedAt}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm font-medium">{vital.heartRate} bpm</span>
                      </div>
                      <p className="text-blue-200 text-xs mt-1">Frecuencia Cardíaca</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-medium">{vital.bloodPressure}</span>
                      </div>
                      <p className="text-blue-200 text-xs mt-1">Presión Arterial</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-medium">{vital.temperature}°C</span>
                      </div>
                      <p className="text-blue-200 text-xs mt-1">Temperatura</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-medium">{vital.oxygenSaturation}%</span>
                      </div>
                      <p className="text-blue-200 text-xs mt-1">Sat. Oxígeno</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Búsqueda de Pacientes */}
        {searchTerm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Resultados de Búsqueda</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{patient.firstName} {patient.lastName}</h3>
                      <p className="text-blue-200 text-sm">{patient.age} años</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-200 text-sm">Teléfono:</span>
                      <span className="text-white text-sm">{patient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200 text-sm">Última visita:</span>
                      <span className="text-white text-sm">{patient.lastVisit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 text-sm">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'critical' 
                          ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                          : patient.status === 'observation'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          : 'bg-green-500/20 text-green-300 border border-green-400/30'
                      }`}>
                        {patient.status === 'critical' ? 'Crítico' : 
                         patient.status === 'observation' ? 'Observación' : 'Estable'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Acciones Rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <button 
            onClick={() => setLocation('/nuevo-paciente')}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Nuevo Examen</h3>
                <p className="text-blue-200 text-sm">Sistema interactivo avanzado</p>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white hover:from-green-500/30 hover:to-teal-500/30 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Ver Historial</h3>
                <p className="text-blue-200 text-sm">Revisar consultas</p>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white hover:from-orange-500/30 hover:to-red-500/30 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Emergencias</h3>
                <p className="text-blue-200 text-sm">Atención urgente</p>
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}