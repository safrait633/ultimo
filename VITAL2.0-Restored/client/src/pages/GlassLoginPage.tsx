import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Mail, Lock, Stethoscope, Loader2, AlertCircle } from "lucide-react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function GlassLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { login, isLoginLoading, user } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="background-shapes">
        <div className="shape1"></div>
        <div className="shape2"></div>
        <div className="shape3"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-green-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" data-testid="login-title">
              Iniciar Sesión
            </h1>
            <p className="text-gray-400">
              Accede a tu cuenta médica
            </p>
          </div>


          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="email"
                          placeholder="doctor@hospital.com"
                          className="glass-input pl-10 text-white placeholder-gray-500"
                          data-testid="input-email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="glass-input pl-10 pr-10 text-white placeholder-gray-500"
                          data-testid="input-password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoginLoading}
                className="w-full glass-button text-white font-semibold py-3 text-lg"
                data-testid="button-login"
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Error Message */}
              {form.formState.errors.root && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 text-sm">{form.formState.errors.root.message}</span>
                </div>
              )}
            </form>
          </Form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-4">
            <Link 
              href="/recovery" 
              className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
              data-testid="link-forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">¿No tienes cuenta?</span>
              <Link 
                href="/register" 
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                data-testid="link-register"
              >
                Registrarse
              </Link>
            </div>
          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white text-sm transition-colors"
            data-testid="link-home"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}