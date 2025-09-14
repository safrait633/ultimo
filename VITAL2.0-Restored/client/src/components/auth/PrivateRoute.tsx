import { ReactNode, useEffect } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireVerification?: boolean;
  fallbackPath?: string;
}

interface LoadingScreenProps {
  message?: string;
}

interface AccessDeniedProps {
  reason: string;
  suggestions?: string[];
}

// Loading screen component
function LoadingScreen({ message = "Verificando credenciales médicas..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        {/* Medical loading animation */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#238636]/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#238636] animate-spin"></div>
          <Shield className="absolute inset-0 m-auto w-8 h-8 text-[#238636]" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#E6EDF3] font-mono">
            Sistema Médico
          </h2>
          <p className="text-[#7D8590] text-sm">
            {message}
          </p>
        </div>
        
        {/* Pulsing dots animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-[#238636] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#238636] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#238636] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Access denied screen component
function AccessDenied({ reason, suggestions = [] }: AccessDeniedProps) {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center p-4">
      <div className="bg-[#1C2128] border border-[#30363d] rounded-lg p-8 max-w-md w-full text-center space-y-6">
        {/* Warning icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#da3633]/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-[#da3633]" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#E6EDF3]">
            Acceso Denegado
          </h2>
          <p className="text-[#7D8590] text-sm">
            {reason}
          </p>
        </div>
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#E6EDF3]">
              Sugerencias:
            </h3>
            <ul className="text-xs text-[#7D8590] space-y-1 text-left">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-1 h-1 bg-[#238636] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => setLocation('/dashboard')}
            className="w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-colors text-sm font-medium"
            data-testid="button-dashboard"
          >
            Ir al Dashboard
          </button>
          <button
            onClick={() => setLocation('/replit-login')}
            className="w-full px-4 py-2 border border-[#30363d] text-[#7D8590] hover:text-[#E6EDF3] hover:border-[#7D8590] rounded-md transition-colors text-sm"
            data-testid="button-login"
          >
            Iniciar Sesión Nuevamente
          </button>
        </div>
      </div>
    </div>
  );
}

// Main PrivateRoute component
export function PrivateRoute({ 
  children, 
  requiredPermissions = [], 
  requireVerification = true,
  fallbackPath = '/replit-login'
}: PrivateRouteProps) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    permissions, 
    isSessionValid 
  } = useAuth();
  
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated and loading is complete
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation(fallbackPath);
    }
  }, [isLoading, isAuthenticated, fallbackPath, setLocation]);

  // Show loading screen while authentication is being verified
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect to={fallbackPath} />;
  }

  // Check if session is still valid
  if (!isSessionValid) {
    return (
      <AccessDenied 
        reason="Su sesión médica ha expirado o es inválida"
        suggestions={[
          "Inicie sesión nuevamente con sus credenciales médicas",
          "Verifique su conexión a internet",
          "Contacte al administrador si el problema persiste"
        ]}
      />
    );
  }

  // Check if user account is active
  if (!user?.isActive) {
    return (
      <AccessDenied 
        reason="Su cuenta médica está inactiva"
        suggestions={[
          "Contacte al administrador del sistema",
          "Verifique el estado de su licencia médica",
          "Revise su correo electrónico para instrucciones"
        ]}
      />
    );
  }

  // Check if verification is required
  if (requireVerification && !user?.isVerified) {
    return (
      <AccessDenied 
        reason="Su cuenta médica requiere verificación"
        suggestions={[
          "Complete el proceso de verificación médica",
          "Proporcione los documentos requeridos",
          "Contacte al departamento de credenciales"
        ]}
      />
    );
  }

  // Check specific permissions if required
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      permissions[permission as keyof typeof permissions]
    );

    if (!hasRequiredPermissions) {
      return (
        <AccessDenied 
          reason="No tiene permisos suficientes para acceder a esta sección"
          suggestions={[
            "Verifique que su rol médico tenga los permisos necesarios",
            "Contacte al administrador para solicitar acceso",
            "Revise la documentación de permisos del sistema"
          ]}
        />
      );
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
}

// Role-based route component
interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: ('medico' | 'super_admin')[];
  fallbackPath?: string;
}

export function RoleRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verificando permisos de rol..." />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/replit-login" />;
  }

  const hasAllowedRole = allowedRoles.includes(user.role);

  if (!hasAllowedRole) {
    return (
      <AccessDenied 
        reason={`Esta sección es solo para ${allowedRoles.join(' y ')}`}
        suggestions={[
          "Verifique que está accediendo con el rol correcto",
          "Contacte al administrador si necesita cambiar su rol",
          "Regrese al dashboard principal"
        ]}
      />
    );
  }

  return <>{children}</>;
}

// Higher-order component for route protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiredPermissions?: string[];
    requireVerification?: boolean;
    allowedRoles?: ('medico' | 'super_admin')[];
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const content = <Component {...props} />;

    if (options.allowedRoles) {
      return (
        <RoleRoute allowedRoles={options.allowedRoles}>
          <PrivateRoute
            requiredPermissions={options.requiredPermissions}
            requireVerification={options.requireVerification}
          >
            {content}
          </PrivateRoute>
        </RoleRoute>
      );
    }

    return (
      <PrivateRoute
        requiredPermissions={options.requiredPermissions}
        requireVerification={options.requireVerification}
      >
        {content}
      </PrivateRoute>
    );
  };
}