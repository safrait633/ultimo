import { useState } from "react";
import { Link } from "wouter";
import { Heart, Shield, Zap, Stethoscope, Activity, Users } from "lucide-react";

export default function GlassMedicalLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-gray-200 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="background-shapes">
        <div className="shape1"></div>
        <div className="shape2"></div>
        <div className="shape3"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-nav">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="font-bold text-2xl flex items-center gap-2 text-white"
            data-testid="logo-link"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-green-400 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            Vital
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              data-testid="nav-login"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="glass-button text-white font-bold py-2 px-4 rounded-lg"
              data-testid="nav-register"
            >
              Registrarse Gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            data-testid="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card m-4 rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <Link href="/login" className="text-indigo-400 font-semibold">Iniciar Sesión</Link>
              <Link href="/register" className="glass-button text-white font-bold py-2 px-4 rounded-lg text-center">
                Registrarse Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-6" data-testid="hero-title">
            Consultas médicas digitales <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-indigo-400 animate-gradient-text">
              100% anonimizadas
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed" data-testid="hero-subtitle">
            Protocolos médicos completos sin comprometer la privacidad del paciente. 
            Toda la información clínica, cero datos personales.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="glass-button text-white font-bold py-3 px-8 rounded-lg text-lg inline-block"
              data-testid="cta-primary"
            >
              Comenzar ahora
            </Link>
            <Link 
              href="/demo" 
              className="glass-card text-indigo-300 font-bold py-3 px-8 rounded-lg border border-indigo-400/30 hover:border-indigo-400/50 transition-all inline-block"
              data-testid="cta-secondary"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2" data-testid="stat-consultations">
                  2,847+
                </div>
                <div className="text-gray-400">Consultas realizadas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2" data-testid="stat-doctors">
                  156+
                </div>
                <div className="text-gray-400">Médicos activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2" data-testid="stat-privacy">
                  100%
                </div>
                <div className="text-gray-400">Privacidad garantizada</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="features-title">
              ¿Por qué elegir Vital?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Una plataforma diseñada específicamente para profesionales médicos que priorizan la eficiencia y la privacidad.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-speed">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Consultas 5x más rápidas</h3>
              <p className="text-sm text-gray-400">
                Formularios inteligentes y dinámicos que se adaptan a cada especialidad médica.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-privacy">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Datos Anonimizados</h3>
              <p className="text-sm text-gray-400">
                Nunca guardamos nombres, DNI, o teléfonos. Solo datos clínicos esenciales.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-protocols">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Protocolos Completos</h3>
              <p className="text-sm text-gray-400">
                Registre toda la información relevante de la consulta sin riesgos de privacidad.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-compliance">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Cumplimiento Automático</h3>
              <p className="text-sm text-gray-400">
                Diseñado para cumplir con normativas como HIPAA y GDPR desde el núcleo.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-specialties">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Multi-especialidad</h3>
              <p className="text-sm text-gray-400">
                Formularios adaptables para cardiología, dermatología, pediatría y más.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-300" data-testid="feature-collaboration">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-3">Colaboración Segura</h3>
              <p className="text-sm text-gray-400">
                Comparta casos clínicos con colegas sin exponer información personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-testid="cta-title">
              Únete a la nueva era de consultas médicas
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Más de 150 médicos ya confían en Vital para sus consultas diarias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="glass-button text-white font-bold py-3 px-8 rounded-lg text-lg inline-block"
                data-testid="final-cta"
              >
                Empezar gratis hoy
              </Link>
              <Link 
                href="/contact" 
                className="text-indigo-400 hover:text-indigo-300 font-semibold py-3 px-8 transition-colors inline-block"
                data-testid="contact-link"
              >
                Contactar ventas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-green-400 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Vital</span>
              </div>
              <p className="text-gray-400 max-w-md">
                La plataforma médica que prioriza la privacidad del paciente sin comprometer la calidad de la atención.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Seguridad</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Centro de ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Vital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}