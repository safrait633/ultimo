import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Heart,
  Brain,
  Bone,
  Activity,
  Baby,
  Target,
  Soup,
  Dna,
  Droplet,
  Ear,
  Fingerprint,
  Beaker,
  Users,
  HeartHandshake,
  Scissors,
  ShieldAlert,
  Scan,
  Syringe,
  Ambulance
} from 'lucide-react';
import axios from 'axios';
import { medicalIcons } from '@/components/icons/MedicalIcons';

// Icon mapping for specialties
const iconMap: Record<string, any> = {
  'Heart': Heart,
  'Lungs': Activity,
  'Stomach': Soup,
  'Dna': Dna,
  'Droplets': Droplet,
  'Brain': Brain,
  'Eye': Eye,
  'Ear': Ear,
  'Bone': Bone,
  'Scan': Fingerprint,
  'Kidney': Beaker,
  'Stethoscope': Stethoscope,
  'Users': Users,
  'Baby': Baby,
  'HeartHandshake': HeartHandshake,
  'Scissors': Scissors,
  'ShieldAlert': ShieldAlert,
  'ScanLine': Scan,
  'HeadIcon': Brain,
  'Syringe': Syringe,
  'Ambulance': Ambulance
};

// Registration schema
const registerSchema = z.object({
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Debe contener mayúscula, minúscula y número"),
  confirmPassword: z.string(),
  specialty: z.string().min(1, "Selecciona una especialidad"),
  licenseNumber: z.string().min(4, "Número de colegiatura debe tener al menos 4 caracteres"),
  acceptTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function GlassRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialtiesLocal, setSpecialtiesLocal] = useState<any[]>([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Load specialties on mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        console.log('Loading specialties directly...');
        const response = await fetch('/api/specialties');
        const data = await response.json();
        console.log('Direct fetch response:', data);
        setSpecialtiesLocal(data || []);
      } catch (error) {
        console.error('Error loading specialties:', error);
      }
    };
    loadSpecialties();
  }, []);

  // Fetch specialties from database using React Query as backup
  const { data: specialtiesData, isLoading: specialtiesLoading, error } = useQuery({
    queryKey: ['/api/specialties'],
    queryFn: async () => {
      console.log('React Query: Fetching specialties...');
      const response = await fetch('/api/specialties');
      const data = await response.json();
      console.log('React Query response:', data);
      return data || [];
    },
    enabled: specialtiesLocal.length === 0 // Only use if direct fetch failed
  });

  // Use direct state or fallback to React Query data
  const rawSpecialties = specialtiesLocal.length > 0 ? specialtiesLocal : (specialtiesData || []);
  
  // Convert database specialties to component format
  const allSpecialties = rawSpecialties.map((spec: any) => ({
    value: spec.name,
    label: spec.name,
    icon: iconMap[spec.icon] || Stethoscope
  }));

  // Filter specialties based on search
  const specialties = allSpecialties.filter(spec =>
    spec.label.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  // Debug logs can be removed in production
  // console.log('Final converted specialties:', specialties.length);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialty: "",
      licenseNumber: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        specialty: data.specialty,
        licenseNumber: data.licenseNumber,
        acceptTerms: data.acceptTerms,
      });

      if (response.status === 201) {
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada. Puedes iniciar sesión ahora.",
        });
        setLocation('/login');
      }
    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.response?.data?.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="background-shapes">
        <div className="shape1"></div>
        <div className="shape2"></div>
        <div className="shape3"></div>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-lg relative z-10">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-green-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" data-testid="register-title">
              Crear Cuenta
            </h1>
            <p className="text-gray-400">
              Únete a la plataforma médica
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Nombre</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input
                            {...field}
                            className="glass-input pl-10 text-white"
                            placeholder="Tu nombre"
                            data-testid="input-firstName"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Apellido</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input
                            {...field}
                            className="glass-input pl-10 text-white"
                            placeholder="Tu apellido"
                            data-testid="input-lastName"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email profesional</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <Input
                          {...field}
                          type="email"
                          className="glass-input pl-10 text-white"
                          placeholder="medico@hospital.com"
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="glass-input pl-10 pr-12 text-white"
                            placeholder="Mínimo 8 caracteres"
                            data-testid="input-password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="toggle-password"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirmar contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            className="glass-input pl-10 pr-12 text-white"
                            placeholder="Confirma tu contraseña"
                            data-testid="input-confirmPassword"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            data-testid="toggle-confirmPassword"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Specialty Search */}
              <div className="space-y-2">
                <FormLabel className="text-gray-300">Especialidad</FormLabel>
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar especialidad..."
                    value={specialtySearch}
                    onChange={(e) => setSpecialtySearch(e.target.value)}
                    className="glass-input pl-10 text-white w-full"
                    data-testid="input-specialty-search"
                  />
                </div>
                
                {/* Specialty Selector */}
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-input text-white" data-testid="select-specialty">
                            <SelectValue 
                              placeholder={
                                specialtiesLoading 
                                  ? "Cargando especialidades..." 
                                  : specialties.length === 0 && specialtySearch
                                    ? "No se encontraron especialidades"
                                    : "Selecciona tu especialidad"
                              } 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-gray-600 max-h-60">
                          {specialtiesLoading ? (
                            <SelectItem value="loading" disabled className="text-gray-400">
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cargando especialidades...
                              </div>
                            </SelectItem>
                          ) : specialties.length === 0 ? (
                            <SelectItem value="no-results" disabled className="text-gray-400">
                              <div className="flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                {specialtySearch ? 'No se encontraron especialidades' : 'No hay especialidades disponibles'}
                              </div>
                            </SelectItem>
                          ) : (
                            specialties.map((specialty) => {
                              const IconComponent = specialty.icon;
                              return (
                                <SelectItem 
                                  key={specialty.value} 
                                  value={specialty.value}
                                  className="text-white hover:bg-slate-700"
                                >
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    {specialty.label}
                                  </div>
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* License Number */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Número de colegiatura</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AlertCircle className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <Input
                          {...field}
                          className="glass-input pl-10 text-white"
                          placeholder="Ej: 12345, CG12345"
                          data-testid="input-licenseNumber"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                        data-testid="checkbox-acceptTerms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-gray-300">
                        Acepto los{" "}
                        <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline">
                          términos y condiciones
                        </Link>{" "}
                        y la{" "}
                        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
                          política de privacidad
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-red-400" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-green-500 hover:from-indigo-600 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Crear cuenta médica
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}