import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User,
  Phone,
  Mail,
  Shield,
  Heart,
  Loader2,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import GlassmorphismDatePicker from '@/components/GlassmorphismDatePicker';

// Esquemas de validación
const patientSchema = z.object({
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  secondLastName: z.string().optional(),
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.string().min(1, 'Sexo requerido'),
  documentNumber: z.string().min(1, 'Documento requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
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
  
  // Detalles adicionales
  allergiesDetails: z.string().optional(),
  medicationsDetails: z.string().optional(),
  surgeriesDetails: z.string().optional(),
  familyHistory: z.string().optional(),
  medicalNotes: z.string().optional()
});

const anonymousPatientSchema = z.object({
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.string().min(1, 'Sexo requerido')
});

// Calcular edad
const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export default function ExpandedPatientRegistration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Datos demo para pruebas
  const fillDemoData = () => {
    const demoData = {
      firstName: 'María Carmen',
      lastName: 'García',
      secondLastName: 'López',
      birthDate: '1985-03-15',
      gender: 'femenino',
      documentNumber: '87654321Y',
      email: 'maria.garcia@email.com',
      phone: '+34 666 777 888',
      address: 'Calle Mayor 123, 2º A',
      city: 'Madrid',
      postalCode: '28001',
      insurancePolicyNumber: 'POL-2024-789456',
      insuranceProvider: 'Sanitas',
      diabetes: true,
      hypertension: false,
      heartDisease: false,
      allergies: true,
      cancer: false,
      asthma: false,
      kidneyDisease: false,
      liverDisease: false,
      thyroidDisease: false,
      mentalHealth: false,
      surgeries: true,
      medications: true,
      smoking: false,
      alcohol: false,
      drugs: false,
      allergiesDetails: 'Alérgica a la penicilina y a los frutos secos',
      medicationsDetails: 'Metformina 850mg cada 12 horas, Omeprazol 20mg en ayunas',
      surgeriesDetails: 'Apendicectomía en 2010, cesárea en 2018',
      familyHistory: 'Madre con diabetes tipo 2, padre con hipertensión',
      medicalNotes: 'Paciente colaboradora, acude regularmente a controles. Última analítica normal excepto glucemia elevada.'
    };
    
    Object.entries(demoData).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });
    
    toast({
      title: 'Datos demo cargados',
      description: 'Se han rellenado todos los campos con datos de ejemplo',
    });
  };

  // Formulario principal  
  const form = useForm({
    resolver: zodResolver(isAnonymous ? anonymousPatientSchema : patientSchema),
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
      allergiesDetails: '',
      medicationsDetails: '',
      surgeriesDetails: '',
      familyHistory: '',
      medicalNotes: ''
    }
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isAnonymous ? '/api/anonymous-patients' : '/api/patients';
      const response = await fetch(endpoint, {
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
      form.reset();
      localStorage.removeItem('currentPatientData');
      
      // Continuar al consentimiento
      localStorage.setItem('currentPatientData', JSON.stringify({
        ...newPatient,
        isAnonymous,
        name: isAnonymous ? 'Paciente Anónimo' : `${newPatient.firstName || newPatient.name} ${newPatient.lastName || ''}`.trim(),
        age: newPatient.age || calculateAge(newPatient.birthDate),
        gender: newPatient.gender
      }));
      
      setLocation('/consent-form');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al crear paciente',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    const age = calculateAge(data.birthDate);
    
    // Datos del paciente con la nueva estructura de base de datos
    const patientData = {
      ...data,
      age,
      // Asegurar compatibilidad con campo name existente
      name: isAnonymous ? 'Paciente Anónimo' : `${data.firstName} ${data.lastName}${data.secondLastName ? ' ' + data.secondLastName : ''}`.trim()
    };
    
    createPatientMutation.mutate(patientData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-300/20">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Registro de Paciente</h1>
          </div>
          
          {/* Toggle para paciente anónimo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Label htmlFor="anonymous-toggle" className="text-white">
              Paciente identificado
            </Label>
            <Switch
              id="anonymous-toggle"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label htmlFor="anonymous-toggle" className="text-white">
              Paciente anónimo
            </Label>
          </div>

          {/* Descripción del formulario */}
          <p className="text-white/80 text-center max-w-2xl mx-auto">
            {isAnonymous 
              ? 'Complete la información básica para registro anónimo'
              : 'Complete toda la información del paciente en un solo formulario'
            }
          </p>
          
          {/* Botón demo para desarrollo */}
          {!isAnonymous && (
            <Button
              type="button"
              onClick={fillDemoData}
              variant="outline"
              className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              🎯 Rellenar con Datos Demo
            </Button>
          )}
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Información Personal */}
            {isAnonymous ? (
              // Formulario anónimo simplificado
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">Información Básica</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthDate" className="text-white mb-2 block">
                      Fecha de Nacimiento *
                    </Label>
                    <GlassmorphismDatePicker
                      value={form.watch('birthDate')}
                      onChange={(date) => form.setValue('birthDate', date)}
                      placeholder="Seleccionar fecha"
                    />
                    {form.formState.errors.birthDate && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.birthDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-white mb-2 block">
                      Sexo *
                    </Label>
                    <Select 
                      value={form.watch('gender')} 
                      onValueChange={(value) => form.setValue('gender', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <p className="text-red-400 text-sm mt-1">
                        {form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botón de registro para anónimos */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={createPatientMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  >
                    {createPatientMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registrar Paciente Anónimo
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Formulario completo en una sola página
              <div className="space-y-8">
                {/* Sección 1: Información Personal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Información Personal</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white mb-2 block">
                        Nombre *
                      </Label>
                      <Input
                        {...form.register('firstName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Nombre"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-white mb-2 block">
                        Primer Apellido *
                      </Label>
                      <Input
                        {...form.register('lastName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Primer apellido"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="secondLastName" className="text-white mb-2 block">
                        Segundo Apellido (Opcional)
                      </Label>
                      <Input
                        {...form.register('secondLastName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Segundo apellido"
                      />
                    </div>

                    <div>
                      <Label htmlFor="birthDate" className="text-white mb-2 block">
                        Fecha de Nacimiento *
                      </Label>
                      <GlassmorphismDatePicker
                        value={form.watch('birthDate')}
                        onChange={(date) => form.setValue('birthDate', date)}
                        placeholder="Seleccionar fecha"
                      />
                      {form.formState.errors.birthDate && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.birthDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-white mb-2 block">
                        Sexo *
                      </Label>
                      <Select 
                        value={form.watch('gender')} 
                        onValueChange={(value) => form.setValue('gender', value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.gender && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="documentNumber" className="text-white mb-2 block">
                        Documento de Identidad *
                      </Label>
                      <Input
                        {...form.register('documentNumber')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="DNI/NIE"
                      />
                      {form.formState.errors.documentNumber && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.documentNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Sección 2: Información de Contacto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Información de Contacto</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white mb-2 block">
                        Email *
                      </Label>
                      <Input
                        {...form.register('email')}
                        type="email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="correo@ejemplo.com"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white mb-2 block">
                        Teléfono *
                      </Label>
                      <Input
                        {...form.register('phone')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="+34 XXX XXX XXX"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-white mb-2 block">
                        Dirección
                      </Label>
                      <Input
                        {...form.register('address')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Calle, número"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-white mb-2 block">
                        Ciudad
                      </Label>
                      <Input
                        {...form.register('city')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Ciudad"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-white mb-2 block">
                        Código Postal
                      </Label>
                      <Input
                        {...form.register('postalCode')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="00000"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Sección 3: Información del Seguro */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Información del Seguro Médico</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insuranceProvider" className="text-white mb-2 block">
                        Compañía de Seguros
                      </Label>
                      <Input
                        {...form.register('insuranceProvider')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Nombre de la compañía"
                      />
                    </div>

                    <div>
                      <Label htmlFor="insurancePolicyNumber" className="text-white mb-2 block">
                        Número de Póliza
                      </Label>
                      <Input
                        {...form.register('insurancePolicyNumber')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Número de póliza"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Sección 4: Antecedentes Médicos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-semibold text-white">Antecedentes Médicos</h2>
                  </div>

                  {/* Condiciones médicas con checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[
                      { key: 'diabetes', label: 'Diabetes' },
                      { key: 'hypertension', label: 'Hipertensión' },
                      { key: 'heartDisease', label: 'Enfermedad cardíaca' },
                      { key: 'allergies', label: 'Alergias' },
                      { key: 'cancer', label: 'Cáncer' },
                      { key: 'asthma', label: 'Asma' },
                      { key: 'kidneyDisease', label: 'Enfermedad renal' },
                      { key: 'liverDisease', label: 'Enfermedad hepática' },
                      { key: 'thyroidDisease', label: 'Enfermedad tiroidea' },
                      { key: 'mentalHealth', label: 'Salud mental' },
                      { key: 'surgeries', label: 'Cirugías previas' },
                      { key: 'medications', label: 'Medicamentos actuales' }
                    ].map((condition) => (
                      <div key={condition.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition.key}
                          checked={form.watch(condition.key as any) || false}
                          onCheckedChange={(checked) => 
                            form.setValue(condition.key as any, checked === true)
                          }
                          className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <Label 
                          htmlFor={condition.key} 
                          className="text-white text-sm cursor-pointer"
                        >
                          {condition.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Campos de texto adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="allergiesDetails" className="text-white mb-2 block">
                        Detalles de Alergias
                      </Label>
                      <Textarea
                        {...form.register('allergiesDetails')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Especificar alergias conocidas..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicationsDetails" className="text-white mb-2 block">
                        Medicamentos Actuales
                      </Label>
                      <Textarea
                        {...form.register('medicationsDetails')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Listar medicamentos actuales..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="familyHistory" className="text-white mb-2 block">
                        Antecedentes Familiares
                      </Label>
                      <Textarea
                        {...form.register('familyHistory')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Historial médico familiar relevante..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalNotes" className="text-white mb-2 block">
                        Notas Adicionales
                      </Label>
                      <Textarea
                        {...form.register('medicalNotes')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="Información médica adicional..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Hábitos */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Hábitos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { key: 'smoking', label: 'Fumador' },
                        { key: 'alcohol', label: 'Consume alcohol' },
                        { key: 'drugs', label: 'Consume drogas' }
                      ].map((habit) => (
                        <div key={habit.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={habit.key}
                            checked={form.watch(habit.key as any) || false}
                            onCheckedChange={(checked) => 
                              form.setValue(habit.key as any, checked === true)
                            }
                            className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <Label 
                            htmlFor={habit.key} 
                            className="text-white text-sm cursor-pointer"
                          >
                            {habit.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Botón de registro */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6"
                >
                  <Button
                    type="submit"
                    disabled={createPatientMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg"
                  >
                    {createPatientMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Registrar Paciente Completo
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}