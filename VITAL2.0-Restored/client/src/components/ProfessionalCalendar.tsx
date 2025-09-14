import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ArrowLeft,
  Save,
  X,
  CalendarDays,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  format, 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears,
  startOfWeek, 
  endOfWeek, 
  startOfMonth,
  endOfMonth,
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  startOfDay,
  setHours,
  setMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'exam' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
}

const appointmentTypes = {
  consultation: { label: 'Consulta', color: 'bg-blue-500' },
  exam: { label: 'Examen', color: 'bg-green-500' },
  'follow-up': { label: 'Seguimiento', color: 'bg-yellow-500' },
  emergency: { label: 'Emergencia', color: 'bg-red-500' }
};

const appointmentStatuses = {
  scheduled: { label: 'Programada', color: 'bg-gray-500' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-500' },
  completed: { label: 'Completada', color: 'bg-green-500' },
  cancelled: { label: 'Cancelada', color: 'bg-red-500' }
};

// Formulario para nueva cita
interface NewAppointmentForm {
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'exam' | 'follow-up' | 'emergency';
  notes: string;
  location: string;
}

export default function ProfessionalCalendar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointmentForm, setNewAppointmentForm] = useState<NewAppointmentForm>({
    patientName: '',
    patientPhone: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 30,
    type: 'consultation',
    notes: '',
    location: 'Consultorio Principal'
  });

  // Obtener citas del doctor
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', user?.id],
    enabled: !!user,
  });

  // Mutación para crear nueva cita
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: NewAppointmentForm) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...appointmentData,
          doctorId: user?.id,
          status: 'scheduled'
        })
      });
      if (!response.ok) throw new Error('Error al crear la cita');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments', user?.id] });
      setShowNewAppointment(false);
      setNewAppointmentForm({
        patientName: '',
        patientPhone: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        duration: 30,
        type: 'consultation',
        notes: '',
        location: 'Consultorio Principal'
      });
      toast({
        title: "Cita creada",
        description: "La nueva cita ha sido programada exitosamente",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cita",
        variant: "destructive"
      });
    }
  });

  const handleCreateAppointment = () => {
    if (!newAppointmentForm.patientName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del paciente es requerido",
        variant: "destructive"
      });
      return;
    }
    createAppointmentMutation.mutate(newAppointmentForm);
  };

  // Generar días de la semana
  const weekStart = startOfWeek(currentDate, { locale: es });
  const weekEnd = endOfWeek(currentDate, { locale: es });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Horario de trabajo con intervalos de 15 minutos (9:00 - 18:00)
  const workingHours = Array.from({ length: 36 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 15; // Empezar a las 9:00 y agregar 15 min por cada índice
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || appointment.type === filterType;
    return matchesSearch && matchesType;
  });

  // Obtener citas para una fecha específica
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  // Obtener citas para una hora específica
  const getAppointmentsForTime = (date: Date, time: string) => {
    return filteredAppointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date) && appointment.time === time
    );
  };

  // Funciones de navegación
  const goToPrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, -1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, -1));
        break;
      case 'year':
        setCurrentDate(prev => addYears(prev, -1));
        break;
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'year':
        setCurrentDate(prev => addYears(prev, 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Obtener título según el modo de vista
  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'EEEE, dd MMMM yyyy', { locale: es });
      case 'week':
        const weekStart = startOfWeek(currentDate, { locale: es });
        const weekEnd = endOfWeek(currentDate, { locale: es });
        return `${format(weekStart, 'dd MMM', { locale: es })} - ${format(weekEnd, 'dd MMM yyyy', { locale: es })}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: es });
      case 'year':
        return format(currentDate, 'yyyy', { locale: es });
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-['Manrope']">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Calendario Profesional
                </h1>
                <p className="text-slate-300">
                  Gestión de citas y consultas médicas
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewAppointment(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </div>

          {/* Controles de navegación */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={goToToday}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-semibold text-white">
                {getViewTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Filtros */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white" />
                <Input
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 w-48"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="consultation">Consultas</SelectItem>
                  <SelectItem value="exam">Exámenes</SelectItem>
                  <SelectItem value="follow-up">Seguimientos</SelectItem>
                  <SelectItem value="emergency">Emergencias</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setViewMode(value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white w-32">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Día</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Calendario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          {viewMode === 'week' ? (
            /* Vista Semanal */
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header de días */}
                <div className="grid grid-cols-8 border-b border-white/20">
                  <div className="p-4 border-r border-white/20">
                    <span className="text-slate-300 text-sm font-medium">Hora</span>
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={day.toISOString()}
                      className={`p-4 border-r border-white/20 text-center ${
                        isToday(day) ? 'bg-blue-500/20' : ''
                      }`}
                    >
                      <div className="text-white font-medium">
                        {format(day, 'EEE', { locale: es })}
                      </div>
                      <div className={`text-2xl font-bold mt-1 ${
                        isToday(day) ? 'text-blue-400' : 'text-white'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {getAppointmentsForDate(day).length} citas
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grid de horarios */}
                <div className="max-h-[600px] overflow-y-auto">
                  {workingHours.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b border-white/10">
                      <div className="p-3 border-r border-white/20 bg-white/5">
                        <span className="text-slate-300 text-sm font-medium">{time}</span>
                      </div>
                      {weekDays.map((day) => {
                        const dayAppointments = getAppointmentsForTime(day, time);
                        return (
                          <div
                            key={`${day.toISOString()}-${time}`}
                            className="p-1 border-r border-white/10 min-h-[60px] relative"
                          >
                            {dayAppointments.map((appointment) => (
                              <motion.div
                                key={appointment.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`${appointmentTypes[appointment.type].color} rounded-lg p-2 mb-1 cursor-pointer hover:shadow-lg transition-all`}
                                onClick={() => setSelectedDate(day)}
                              >
                                <div className="text-white text-xs font-medium truncate">
                                  {appointment.patientName}
                                </div>
                                <div className="text-white/80 text-xs truncate">
                                  {appointmentTypes[appointment.type].label}
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`${appointmentStatuses[appointment.status].color} text-white text-xs mt-1`}
                                >
                                  {appointmentStatuses[appointment.status].label}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Vista Diaria */
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
                </h3>
                <p className="text-slate-300">
                  {getAppointmentsForDate(selectedDate).length} citas programadas
                </p>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {getAppointmentsForDate(selectedDate).map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${appointmentTypes[appointment.type].color}`}></div>
                        <div>
                          <h4 className="text-white font-medium">{appointment.patientName}</h4>
                          <p className="text-slate-300 text-sm">{appointmentTypes[appointment.type].label}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${appointmentStatuses[appointment.status].color} text-white`}
                      >
                        {appointmentStatuses[appointment.status].label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4" />
                        {appointment.time} ({appointment.duration} min)
                      </div>
                      {appointment.patientPhone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-4 h-4" />
                          {appointment.patientPhone}
                        </div>
                      )}
                      {appointment.location && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-4 h-4" />
                          {appointment.location}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-slate-300 text-sm">{appointment.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {getAppointmentsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 text-lg">No hay citas programadas para este día</p>
                    <Button
                      onClick={() => setShowNewAppointment(true)}
                      className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Programar Cita
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
        >
          {[
            { label: 'Citas de Hoy', value: getAppointmentsForDate(new Date()).length, color: 'bg-blue-500' },
            { label: 'Confirmadas', value: filteredAppointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500' },
            { label: 'Pendientes', value: filteredAppointments.filter(a => a.status === 'scheduled').length, color: 'bg-yellow-500' },
            { label: 'Esta Semana', value: filteredAppointments.filter(a => {
              const appointmentDate = new Date(a.date);
              return appointmentDate >= weekStart && appointmentDate <= weekEnd;
            }).length, color: 'bg-purple-500' }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <div>
                    <p className="text-slate-300 text-sm">{stat.label}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Modal Nueva Cita */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Nueva Cita Médica
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName" className="text-white">Nombre del Paciente *</Label>
                <Input
                  id="patientName"
                  value={newAppointmentForm.patientName}
                  onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, patientName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Nombre completo del paciente"
                />
              </div>
              
              <div>
                <Label htmlFor="patientPhone" className="text-white">Teléfono</Label>
                <Input
                  id="patientPhone"
                  value={newAppointmentForm.patientPhone}
                  onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, patientPhone: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Número de contacto"
                />
              </div>
              
              <div>
                <Label htmlFor="appointmentDate" className="text-white">Fecha *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={newAppointmentForm.date}
                  onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="appointmentTime" className="text-white">Hora *</Label>
                <Select 
                  value={newAppointmentForm.time} 
                  onValueChange={(value) => setNewAppointmentForm(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {workingHours.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="appointmentType" className="text-white">Tipo de Cita *</Label>
                <Select 
                  value={newAppointmentForm.type} 
                  onValueChange={(value: 'consultation' | 'exam' | 'follow-up' | 'emergency') => 
                    setNewAppointmentForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consulta</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                    <SelectItem value="follow-up">Seguimiento</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration" className="text-white">Duración (minutos)</Label>
                <Select 
                  value={newAppointmentForm.duration.toString()} 
                  onValueChange={(value) => setNewAppointmentForm(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1.5 horas</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-white">Ubicación</Label>
                <Input
                  id="location"
                  value={newAppointmentForm.location}
                  onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  placeholder="Consultorio o ubicación"
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-white">Notas</Label>
                <Textarea
                  id="notes"
                  value={newAppointmentForm.notes}
                  onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 resize-none"
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/20">
            <Button
              onClick={() => setShowNewAppointment(false)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAppointment}
              disabled={createAppointmentMutation.isPending}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {createAppointmentMutation.isPending ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin border-2 border-white/30 border-t-white rounded-full" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear Cita
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}