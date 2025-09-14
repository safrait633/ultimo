import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, type MedicalUser, type UserPermissions, type LoginCredentials } from '../services/auth-service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  // User state
  user: MedicalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: UserPermissions;
  
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  
  // User info helpers
  getFullName: () => string;
  getDisplayRole: () => string;
  getHospitalInfo: () => string;
  
  // Session management
  isSessionValid: boolean;
  sessionExpiresAt: Date | null;
  timeUntilExpiry: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MedicalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Session monitoring
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      updateSessionInfo();
      checkSessionValidity();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  // Warning for session expiry
  useEffect(() => {
    if (!timeUntilExpiry) return;

    // Show warning when 5 minutes remain
    if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 4 * 60 * 1000) {
      toast({
        title: "Sesión próxima a expirar",
        description: "Su sesión médica expirará en 5 minutos. La actividad la renovará automáticamente.",
        className: "bg-amber-500 text-white",
      });
    }

    // Show final warning when 1 minute remains
    if (timeUntilExpiry <= 60 * 1000 && timeUntilExpiry > 30 * 1000) {
      toast({
        title: "Sesión expirando",
        description: "Su sesión médica expirará en 1 minuto.",
        variant: "destructive",
      });
    }
  }, [timeUntilExpiry, toast]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is stored locally
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
        
        // Validate session with server
        const isValid = await authService.validateSession();
        setIsSessionValid(isValid);
        
        if (!isValid) {
          // Session invalid, try to refresh
          try {
            await authService.refreshAccessToken();
            setIsSessionValid(true);
          } catch (error) {
            // Refresh failed, clear auth state
            await logout();
          }
        }
      }
      
      updateSessionInfo();
    } catch (error) {
      console.error('[AUTH CONTEXT] Initialization error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionInfo = () => {
    const expiry = authService.getAccessToken() ? 
      localStorage.getItem('medical_token_expiry') : null;
    
    if (expiry) {
      const expiryDate = new Date(parseInt(expiry));
      setSessionExpiresAt(expiryDate);
      setTimeUntilExpiry(expiryDate.getTime() - Date.now());
    } else {
      setSessionExpiresAt(null);
      setTimeUntilExpiry(null);
    }
  };

  const checkSessionValidity = async () => {
    if (!user) return;

    try {
      const isValid = await authService.validateSession();
      setIsSessionValid(isValid);
      
      if (!isValid) {
        toast({
          title: "Sesión inválida",
          description: "Su sesión médica ha expirado. Por favor, inicie sesión nuevamente.",
          variant: "destructive",
        });
        await logout();
      }
    } catch (error) {
      console.error('[AUTH CONTEXT] Session validation error:', error);
      setIsSessionValid(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        setIsSessionValid(true);
        updateSessionInfo();
        
        toast({
          title: "Acceso autorizado",
          description: `Bienvenido/a Dr. ${response.data.user.nombres} ${response.data.user.apellidos}`,
          className: "bg-[#238636] text-white border-[#2ea043]",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Credenciales médicas inválidas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('[AUTH CONTEXT] Logout error:', error);
    } finally {
      setUser(null);
      setIsSessionValid(false);
      setSessionExpiresAt(null);
      setTimeUntilExpiry(null);
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      await authService.refreshAccessToken();
      updateSessionInfo();
      
      // Revalidate session
      const isValid = await authService.validateSession();
      setIsSessionValid(isValid);
      
      toast({
        title: "Sesión renovada",
        description: "Su sesión médica ha sido renovada exitosamente",
        className: "bg-[#238636] text-white",
      });
    } catch (error) {
      console.error('[AUTH CONTEXT] Session refresh error:', error);
      toast({
        title: "Error de renovación",
        description: "No se pudo renovar la sesión. Por favor, inicie sesión nuevamente.",
        variant: "destructive",
      });
      await logout();
    }
  };

  // Helper functions
  const getFullName = (): string => {
    if (!user) return '';
    return `Dr. ${user.nombres} ${user.apellidos}`;
  };

  const getDisplayRole = (): string => {
    if (!user) return '';
    
    switch (user.role) {
      case 'super_admin':
        return 'Super Administrador';
      case 'medico':
        return 'Médico';
      default:
        return 'Usuario';
    }
  };

  const getHospitalInfo = (): string => {
    if (!user) return '';
    
    if (user.hospitalId) {
      return `Hospital ${user.hospitalId}`;
    }
    
    return 'Práctica Privada';
  };

  // Computed values
  const isAuthenticated = !!user && authService.isAuthenticated();
  const permissions = authService.getUserPermissions(user || undefined);

  const contextValue: AuthContextType = {
    // User state
    user,
    isAuthenticated,
    isLoading,
    permissions,
    
    // Authentication actions
    login,
    logout,
    refreshSession,
    
    // User info helpers
    getFullName,
    getDisplayRole,
    getHospitalInfo,
    
    // Session management
    isSessionValid,
    sessionExpiresAt,
    timeUntilExpiry,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook for checking specific permissions
export function usePermissions() {
  const { permissions } = useAuth();
  
  return {
    ...permissions,
    hasAnyPermission: (requiredPermissions: (keyof UserPermissions)[]): boolean => {
      return requiredPermissions.some(permission => permissions[permission]);
    },
    hasAllPermissions: (requiredPermissions: (keyof UserPermissions)[]): boolean => {
      return requiredPermissions.every(permission => permissions[permission]);
    },
  };
}

// Hook for user display information
export function useUserInfo() {
  const { user, getFullName, getDisplayRole, getHospitalInfo } = useAuth();
  
  return {
    user,
    fullName: getFullName(),
    displayRole: getDisplayRole(),
    hospitalInfo: getHospitalInfo(),
    specialty: user?.specialty || '',
    licenseNumber: user?.licenseNumber || '',
    preferences: user?.preferencias || {
      idioma: 'es',
      tema: 'claro',
      notificaciones: true,
    },
  };
}