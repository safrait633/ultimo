import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar,
  User,
  FileText,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Save,
  UserX,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import GlassmorphismDatePicker from '@/components/GlassmorphismDatePicker';

// Esquemas de validación
const patientSchema = z.object({
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  secondLastName: z.string().optional(),
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.string().min(1, 'Sexo requerido'),
  documentNumber: z.string().min(8, 'Documento debe tener al menos 8 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(9, 'Teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  postalCode: z.string().min(5, 'Código postal requerido'),
  insurancePolicyNumber: z.string().optional(),
  insuranceProvider: z.string().optional(),
  
  // Antecedentes médicos
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  allergies: z.boolean().default(false),
  cancer: z.boolean().default(false),
  asthma: z.boolean().default(false),
  kidneyDisease: z.boolean().default(false),
  liverDisease: z.boolean().default(false),
  thyroidDisease: z.boolean().default(false),
  mentalHealth: z.boolean().default(false),
  surgeries: z.boolean().default(false),
  medications: z.boolean().default(false),
  smoking: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  drugs: z.boolean().default(false),
  
  // Notas médicas
  medicalNotes: z.string().optional(),
  allergiesDetails: z.string().optional(),
  medicationsDetails: z.string().optional(),
  surgeriesDetails: z.string().optional(),
  familyHistory: z.string().optional(),
});

const anonymousPatientSchema = z.object({
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.string().min(1, 'Sexo requerido'),
});

export default function ImprovedPatientFormClean() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Formularios separados
  const patientForm = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      secondLastName: '',
      birthDate: '',
      gender: '',
      documentNumber: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      insurancePolicyNumber: '',
      insuranceProvider: '',
      
      // Antecedentes médicos por defecto en false
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      allergies: false,
      cancer: false,
      asthma: false,
      kidneyDisease: false,
      liverDisease: false,
      thyroidDisease: false,
      mentalHealth: false,
      surgeries: false,
      medications: false,
      smoking: false,
      alcohol: false,
      drugs: false,
      
      // Notas médicas
      medicalNotes: '',
      allergiesDetails: '',
      medicationsDetails: '',
      surgeriesDetails: '',
      familyHistory: '',
    }
  });

  const anonymousForm = useForm({
    resolver: zodResolver(anonymousPatientSchema),
    defaultValues: {
      birthDate: '',
      gender: '',
    }
  });

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Mutación para crear paciente regular
  const createPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear paciente');
      }
      
      return response.json();
    },
    onSuccess: (newPatient) => {
      toast({
        title: 'Paciente registrado exitosamente',
        description: 'El paciente ha sido creado en el sistema',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      
      // Limpiar formulario y datos
      patientForm.reset();
      localStorage.removeItem('currentPatientData');
      
      // Redirigir al dashboard
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al crear paciente',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutación para crear paciente anónimo
  const createAnonymousPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/anonymous-patients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear paciente anónimo');
      }
      
      return response.json();
    },
    onSuccess: (newPatient) => {
      toast({
        title: 'Paciente anónimo registrado',
        description: 'El paciente ha sido creado de forma anónima',
      });
      
      // Limpiar formulario y datos
      anonymousForm.reset();
      localStorage.removeItem('currentPatientData');
      
      // Redirigir al dashboard
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al crear paciente anónimo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Función para enviar formulario de paciente regular
  const onSubmitPatient = (data: any) => {
    const age = calculateAge(data.birthDate);
    const patientData = {
      ...data,
      age,
      isAnonymous: false
    };
    
    // Primero ir al consentimiento, luego registrar
    localStorage.setItem('currentPatientData', JSON.stringify(patientData));
    setLocation('/consent-form');
  };

  // Función para enviar formulario de paciente anónimo
  const onSubmitAnonymous = (data: any) => {
    const age = calculateAge(data.birthDate);
    const patientData = {
      ...data,
      age,
      isAnonymous: true
    };
    
    // Primero ir al consentimiento, luego registrar
    localStorage.setItem('currentPatientData', JSON.stringify(patientData));
    setLocation('/consent-form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-['Manrope']">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header con botón Atrás */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setLocation('/patients')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              {isAnonymous ? 'Consulta Anónima' : 'Paciente Registrado'}
            </Badge>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isAnonymous ? 'Nueva Consulta Anónima' : 'Nuevo Paciente'}
            </h1>
            <p className="text-blue-200">
              {isAnonymous ? 'Solo se requiere edad y sexo' : 'Registra un nuevo paciente en el sistema'}
            </p>
          </div>
        </motion.div>

        {/* Selector de tipo de consulta */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Tipo de Consulta</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="anonymous-mode"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="anonymous-mode" className="text-white font-medium">
                Consulta Anónima
              </Label>
            </div>
            {isAnonymous && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                <UserX className="w-3 h-3 mr-1" />
                Solo edad y sexo
              </Badge>
            )}
          </div>
          <p className="text-blue-200 text-sm mt-3">
            {isAnonymous
              ? 'Modo anónimo: Solo se registrará la fecha de nacimiento y sexo del paciente'
              : 'Modo completo: Se registrarán todos los datos del paciente incluidos datos de contacto y seguro médico'
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isAnonymous ? (
            // Formulario Anónimo
            <motion.div
              key="anonymous"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500/20 backdrop-blur-sm p-3 rounded-xl">
                  <UserX className="w-6 h-6 text-yellow-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Paciente Anónimo</h2>
              </div>
              
              <form onSubmit={anonymousForm.handleSubmit(onSubmitAnonymous)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Fecha de Nacimiento */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Nacimiento
                    </Label>
                    <GlassmorphismDatePicker
                      value={anonymousForm.watch('birthDate')}
                      onChange={(date) => anonymousForm.setValue('birthDate', date)}
                      placeholder="dd/mm/aaaa"
                    />
                    {anonymousForm.formState.errors.birthDate && (
                      <p className="text-red-400 text-sm">
                        {anonymousForm.formState.errors.birthDate.message}
                      </p>
                    )}
                    {anonymousForm.watch('birthDate') && (
                      <p className="text-green-400 text-sm">
                        Edad: {calculateAge(anonymousForm.watch('birthDate'))} años
                      </p>
                    )}
                  </div>

                  {/* Sexo */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sexo
                    </Label>
                    <Select
                      value={anonymousForm.watch('gender')}
                      onValueChange={(value) => anonymousForm.setValue('gender', value)}
                    >
                      <SelectTrigger className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-emerald-400/50">
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl">
                        <SelectItem value="masculino" className="text-white hover:bg-white/10 focus:bg-white/10">Masculino</SelectItem>
                        <SelectItem value="femenino" className="text-white hover:bg-white/10 focus:bg-white/10">Femenino</SelectItem>
                        <SelectItem value="otro" className="text-white hover:bg-white/10 focus:bg-white/10">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {anonymousForm.formState.errors.gender && (
                      <p className="text-red-400 text-sm">
                        {anonymousForm.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={createAnonymousPatientMutation.isPending}
                    className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-xl px-8 py-3 text-white hover:bg-emerald-500/30 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-emerald-500/20"
                  >
                    {createAnonymousPatientMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Crear Paciente Anónimo</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            // Formulario Completo de Paciente
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-xl">
                  <User className="w-6 h-6 text-blue-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Registro Completo de Paciente</h2>
              </div>
              
              <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-8">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                      <Input
                        {...patientForm.register('name')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="Nombre y apellidos"
                      />
                      {patientForm.formState.errors.name && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha de Nacimiento
                      </Label>
                      <GlassmorphismDatePicker
                        value={patientForm.watch('birthDate')}
                        onChange={(date) => patientForm.setValue('birthDate', date)}
                        placeholder="dd/mm/aaaa"
                      />
                      {patientForm.formState.errors.birthDate && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.birthDate.message}
                        </p>
                      )}
                      {patientForm.watch('birthDate') && (
                        <p className="text-green-400 text-sm">
                          Edad: {calculateAge(patientForm.watch('birthDate'))} años
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentNumber" className="text-white">Número de Documento</Label>
                      <Input
                        {...patientForm.register('documentNumber')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="DNI, NIE, Pasaporte..."
                      />
                      {patientForm.formState.errors.documentNumber && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.documentNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Teléfono
                      </Label>
                      <Input
                        {...patientForm.register('phone')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="+34 600 000 000"
                      />
                      {patientForm.formState.errors.phone && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="text-white flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email (Opcional)
                      </Label>
                      <Input
                        {...patientForm.register('email')}
                        type="email"
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="correo@ejemplo.com"
                      />
                      {patientForm.formState.errors.email && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Dirección
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-white">Dirección</Label>
                      <Input
                        {...patientForm.register('address')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="Calle, número, piso..."
                      />
                      {patientForm.formState.errors.address && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-white">Código Postal</Label>
                      <Input
                        {...patientForm.register('postalCode')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="28001"
                      />
                      {patientForm.formState.errors.postalCode && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">Ciudad</Label>
                      <Input
                        {...patientForm.register('city')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="Madrid"
                      />
                      {patientForm.formState.errors.city && (
                        <p className="text-red-400 text-sm">
                          {patientForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información de Seguro */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Seguro Médico (Opcional)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider" className="text-white">Proveedor de Seguro</Label>
                      <Input
                        {...patientForm.register('insuranceProvider')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="Sanitas, Adeslas, DKV..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurancePolicyNumber" className="text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Número de Póliza
                      </Label>
                      <Input
                        {...patientForm.register('insurancePolicyNumber')}
                        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300"
                        placeholder="Número de póliza"
                      />
                    </div>
                  </div>
                </div>

                {/* Historia Médica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Historia Médica (Opcional)
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory" className="text-white">Antecedentes y notas médicas</Label>
                    <Textarea
                      {...patientForm.register('medicalHistory')}
                      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:ring-2 focus:ring-emerald-400/50 hover:bg-white/10 transition-all duration-300 min-h-[100px] resize-none"
                      placeholder="Alergias, medicamentos, cirugías previas, enfermedades crónicas..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={createPatientMutation.isPending}
                    className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-xl px-8 py-3 text-white hover:bg-emerald-500/30 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-emerald-500/20"
                  >
                    {createPatientMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Registrar Paciente</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}