import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
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
  BarChart3,
  PieChart,
  Zap,
  Target,
  User,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfessionalUserPanel from '@/components/ProfessionalUserPanel';

interface ProductivityAnalytics {
  dailyConsultations: number;
  monthlyConsultations: number;
  averageConsultationTime: string;
  completionRate: number;
  patientSatisfaction: number;
  monthlyGrowth: number;
}

interface TodayConsultation {
  id: string;
  patientName: string;
  type: string;
  completionTime: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
  scheduledTime: string;
}

interface TodaySchedule {
  time: string;
  patient: string;
  type: string;
  status: 'completed' | 'current' | 'upcoming';
}

const getScheduleStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-400';
    case 'current': return 'bg-blue-400 animate-pulse';
    case 'upcoming': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

export default function GlassMedicalDashboard() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Datos simulados para analytics de productividad
  const productivityData: ProductivityAnalytics = {
    dailyConsultations: 12,
    monthlyConsultations: 245,
    averageConsultationTime: "28 min",
    completionRate: 94.2,
    patientSatisfaction: 4.8,
    monthlyGrowth: 15.3
  };

  // Consultas de hoy completadas para descarga
  const todayConsultations: TodayConsultation[] = [
    {
      id: 'C001',
      patientName: 'María González',
      type: 'Cardiología',
      completionTime: '09:45',
      duration: '25 min',
      status: 'completed',
      scheduledTime: '09:00'
    },
    {
      id: 'C002',
      patientName: 'Carlos Ruiz',
      type: 'Neurología',
      completionTime: '11:20',
      duration: '35 min',
      status: 'completed',
      scheduledTime: '10:30'
    },
    {
      id: 'C003',
      patientName: 'Ana López',
      type: 'Dermatología',
      completionTime: '14:15',
      duration: '20 min',
      status: 'completed',
      scheduledTime: '14:00'
    },
    {
      id: 'C004',
      patientName: 'Pedro Martín',
      type: 'Gastroenterología',
      completionTime: '16:00',
      duration: '30 min',
      status: 'completed',
      scheduledTime: '15:30'
    }
  ];

  // Horario de hoy
  const todaySchedule: TodaySchedule[] = [
    { time: '09:00', patient: 'María González', type: 'Cardiología', status: 'completed' },
    { time: '10:30', patient: 'Carlos Ruiz', type: 'Neurología', status: 'completed' },
    { time: '12:00', patient: 'Lucia Fernández', type: 'Pediatría', status: 'current' },
    { time: '14:00', patient: 'Ana López', type: 'Dermatología', status: 'upcoming' },
    { time: '15:30', patient: 'Pedro Martín', type: 'Gastroenterología', status: 'upcoming' },
    { time: '17:00', patient: 'Sofia Rivera', type: 'Ginecología', status: 'upcoming' }
  ];

  const handleDownloadConsultations = () => {
    const csvContent = [
      ['Paciente', 'Tipo', 'Hora Programada', 'Hora Completada', 'Duración'].join(','),
      ...todayConsultations.map(c => 
        [c.patientName, c.type, c.scheduledTime, c.completionTime, c.duration].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `consultas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard de Productividad</h1>
                <p className="text-blue-200">Dr. {user?.firstName} {user?.lastName} - Analytics Médicas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
              </select>
              
              {/* Panel de Usuario Profesional */}
              <button
                onClick={() => setShowUserPanel(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">Dr. {user?.firstName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics de Productividad */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Consultas Diarias */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">+{productivityData.monthlyGrowth}%</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{productivityData.dailyConsultations}</h3>
            <p className="text-blue-200">Consultas Hoy</p>
            <div className="mt-2 text-xs text-gray-400">
              Meta mensual: {productivityData.monthlyConsultations}
            </div>
          </div>

          {/* Tiempo Promedio */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <User className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{productivityData.averageConsultationTime}</h3>
            <p className="text-blue-200">Tiempo Promedio</p>
            <div className="mt-2 text-xs text-gray-400">
              Eficiencia: {productivityData.completionRate}%
            </div>
          </div>

          {/* Satisfacción del Paciente */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-yellow-400">★</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{productivityData.patientSatisfaction}</h3>
            <p className="text-blue-200">Satisfacción</p>
            <div className="mt-2 text-xs text-gray-400">
              De 5.0 estrellas
            </div>
          </div>
        </motion.div>

        {/* 4 Paneles de Acciones Rápidas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Link href="/nuevo-paciente">
            <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-lg mb-3 w-fit">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-left">Nuevo Paciente</h3>
            </button>
          </Link>

          <Link href="/exam-dashboard">
            <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-lg mb-3 w-fit">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-left">Panel Exámenes</h3>
            </button>
          </Link>

          <Link href="/patients">
            <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg mb-3 w-fit">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-left">Pacientes</h3>
            </button>
          </Link>

          <Link href="/calendar">
            <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-lg mb-3 w-fit">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-left">Calendario</h3>
            </button>
          </Link>
        </motion.div>

        {/* Panel adicional de acciones - TEMPORALMENTE OCULTO */}
        {false && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            <Link href="/report-generator">
              <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-lg mb-3 w-fit">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-left">Generar Informe</h3>
                <p className="text-sm text-gray-300 text-left">Con firma legal</p>
              </button>
            </Link>

            <Link href="/search">
              <button className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-3 rounded-lg mb-3 w-fit">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-left">Búsqueda</h3>
                <p className="text-sm text-gray-300 text-left">Pacientes e historiales</p>
              </button>
            </Link>

            <button 
              onClick={() => setShowUserPanel(true)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-white"
            >
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-3 rounded-lg mb-3 w-fit">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-left">Mi Perfil</h3>
              <p className="text-sm text-gray-300 text-left">Configuración</p>
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Consultas de Hoy - Para Descarga */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Consultas Completadas Hoy</h3>
              <Button 
                onClick={handleDownloadConsultations}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
            
            <div className="space-y-3">
              {todayConsultations.map((consultation) => (
                <div key={consultation.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{consultation.patientName}</p>
                      <p className="text-sm text-blue-200">{consultation.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Programada: {consultation.scheduledTime}</p>
                      <p className="text-sm text-green-400">Completada: {consultation.completionTime}</p>
                      <p className="text-xs text-purple-400">Duración: {consultation.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Horario de Hoy */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Horario de Hoy</h3>
            <div className="space-y-4">
              {todaySchedule.map((appointment, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getScheduleStatusColor(appointment.status)}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{appointment.time}</span>
                      <span className="text-sm text-gray-400">{appointment.type}</span>
                    </div>
                    <p className="text-sm text-blue-200">{appointment.patient}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Panel de Usuario Profesional */}
      <ProfessionalUserPanel 
        isOpen={showUserPanel} 
        onClose={() => setShowUserPanel(false)} 
      />
    </div>
  );
}