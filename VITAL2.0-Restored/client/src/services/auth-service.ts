import axios, { AxiosInstance } from 'axios';

// Types for medical authentication
export interface MedicalUser {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  role: 'medico' | 'super_admin';
  specialty: string;
  licenseNumber: string;
  hospitalId: string | null;
  isActive: boolean;
  isVerified: boolean;
  preferencias: {
    idioma: string;
    tema: string;
    notificaciones: boolean;
  };
  replitMetadata: {
    deploymentUrl: string;
    lastActiveSession: string | null;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  code: string;
  data: {
    user: MedicalUser;
    tokens: AuthTokens;
    session?: {
      id: string;
      expiresAt: string;
    };
  };
}

export interface UserPermissions {
  canViewPatients: boolean;
  canEditPatients: boolean;
  canCreateConsultations: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canManageTemplates: boolean;
  canAccessAdminPanel: boolean;
}

// Secure storage utilities with basic encryption
class SecureStorage {
  private static key = 'medical_auth_key';

  static encrypt(data: string): string {
    // Simple XOR encryption for localStorage (not for production security)
    return btoa(data.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(i % this.key.length))
    ).join(''));
  }

  static decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData);
      return data.split('').map((char, i) => 
        String.fromCharCode(char.charCodeAt(0) ^ this.key.charCodeAt(i % this.key.length))
      ).join('');
    } catch {
      return '';
    }
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(key, this.encrypt(value));
  }

  static getItem(key: string): string | null {
    const item = localStorage.getItem(key);
    return item ? this.decrypt(item) : null;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    const keysToRemove = [
      'medical_access_token',
      'medical_refresh_token',
      'medical_user_data',
      'medical_session_id',
      'medical_token_expiry'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

// Authentication service class
export class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

  constructor() {
    // Configure Axios for dynamic Replit URLs
    this.api = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupInactivityTracking();
    this.setupTokenRefreshTimer();
    this.setupTabSynchronization();
  }

  private getBaseURL(): string {
    // Dynamic URL detection for Replit environment
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      
      // Check if running in Replit environment
      if (hostname.includes('.replit.dev') || hostname.includes('.repl.co')) {
        return `${protocol}//${hostname}`;
      }
    }
    
    // Fallback to environment variables or localhost
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  private setupInterceptors(): void {
    // Request interceptor - automatically add token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor - handle 401/403 with automatic refresh
    this.api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthenticationFailure();
            return Promise.reject(refreshError);
          }
        }
        
        if (error.response?.status === 403) {
          // Insufficient permissions
          this.notifyInsufficientPermissions();
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/api/auth/login', credentials);
      
      if (response.data.success) {
        this.storeAuthData(response.data.data);
        this.setupTokenRefreshTimer();
        this.resetInactivityTimer();
        this.broadcastAuthChange('login', response.data.data.user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('[AUTH SERVICE] Login error:', error);
      throw new Error(error.response?.data?.message || 'Error de autenticación');
    }
  }

  async logout(): Promise<void> {
    try {
      const sessionId = SecureStorage.getItem('medical_session_id');
      
      await this.api.post('/api/auth/logout', { sessionId });
    } catch (error) {
      console.error('[AUTH SERVICE] Logout error:', error);
    } finally {
      this.clearAuthData();
      this.clearTimers();
      this.broadcastAuthChange('logout', null);
    }
  }

  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<AuthResponse>(
        `${this.getBaseURL()}/api/auth/refresh`,
        { refreshToken },
        { timeout: 10000 }
      );

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data.tokens;
        
        // Store new tokens
        SecureStorage.setItem('medical_access_token', accessToken);
        SecureStorage.setItem('medical_refresh_token', newRefreshToken);
        SecureStorage.setItem('medical_token_expiry', (Date.now() + expiresIn * 1000).toString());
        
        this.setupTokenRefreshTimer();
        return accessToken;
      }
      
      throw new Error('Token refresh failed');
    } catch (error: any) {
      console.error('[AUTH SERVICE] Token refresh error:', error);
      this.handleAuthenticationFailure();
      throw error;
    }
  }

  async validateSession(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      const response = await this.api.get('/api/auth/me');
      return response.status === 200;
    } catch (error) {
      console.error('[AUTH SERVICE] Session validation error:', error);
      return false;
    }
  }

  // Token and user data management
  private storeAuthData(authData: AuthResponse['data']): void {
    const { user, tokens, session } = authData;
    
    SecureStorage.setItem('medical_access_token', tokens.accessToken);
    SecureStorage.setItem('medical_refresh_token', tokens.refreshToken);
    SecureStorage.setItem('medical_user_data', JSON.stringify(user));
    SecureStorage.setItem('medical_token_expiry', (Date.now() + tokens.expiresIn * 1000).toString());
    
    if (session) {
      SecureStorage.setItem('medical_session_id', session.id);
    }
  }

  private clearAuthData(): void {
    SecureStorage.clear();
  }

  getAccessToken(): string | null {
    return SecureStorage.getItem('medical_access_token');
  }

  getRefreshToken(): string | null {
    return SecureStorage.getItem('medical_refresh_token');
  }

  getCurrentUser(): MedicalUser | null {
    const userData = SecureStorage.getItem('medical_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    const expiry = SecureStorage.getItem('medical_token_expiry');
    
    if (!token || !user || !expiry) return false;
    
    // Check if token is expired
    return Date.now() < parseInt(expiry);
  }

  getUserPermissions(user?: MedicalUser): UserPermissions {
    const currentUser = user || this.getCurrentUser();
    
    if (!currentUser) {
      return {
        canViewPatients: false,
        canEditPatients: false,
        canCreateConsultations: false,
        canViewReports: false,
        canManageUsers: false,
        canManageTemplates: false,
        canAccessAdminPanel: false,
      };
    }

    const isAdmin = currentUser.role === 'super_admin';
    const isMedico = currentUser.role === 'medico';
    const isActive = currentUser.isActive && currentUser.isVerified;

    return {
      canViewPatients: isActive && (isMedico || isAdmin),
      canEditPatients: isActive && (isMedico || isAdmin),
      canCreateConsultations: isActive && (isMedico || isAdmin),
      canViewReports: isActive && (isMedico || isAdmin),
      canManageUsers: isActive && isAdmin,
      canManageTemplates: isActive && (isMedico || isAdmin),
      canAccessAdminPanel: isActive && isAdmin,
    };
  }

  // Automatic token refresh timer
  private setupTokenRefreshTimer(): void {
    this.clearTokenRefreshTimer();
    
    const expiry = SecureStorage.getItem('medical_token_expiry');
    if (!expiry) return;

    const expiryTime = parseInt(expiry);
    const refreshTime = expiryTime - this.TOKEN_REFRESH_BUFFER;
    const timeUntilRefresh = refreshTime - Date.now();

    if (timeUntilRefresh > 0) {
      this.tokenRefreshTimer = setTimeout(async () => {
        try {
          await this.refreshAccessToken();
          console.log('[AUTH SERVICE] Token auto-refreshed');
        } catch (error) {
          console.error('[AUTH SERVICE] Auto-refresh failed:', error);
        }
      }, timeUntilRefresh);
    }
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  // Inactivity tracking
  private setupInactivityTracking(): void {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer(), true);
    });
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.handleInactivityTimeout();
    }, this.INACTIVITY_TIMEOUT);
  }

  private handleInactivityTimeout(): void {
    console.log('[AUTH SERVICE] Session expired due to inactivity');
    this.logout();
    this.notifySessionExpired();
  }

  // Tab synchronization
  private setupTabSynchronization(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key === 'medical_auth_event') {
        const authEvent = JSON.parse(event.newValue || '{}');
        this.handleCrossTabAuthEvent(authEvent);
      }
    });
  }

  private broadcastAuthChange(type: 'login' | 'logout', user: MedicalUser | null): void {
    if (typeof window === 'undefined') return;

    const authEvent = {
      type,
      user,
      timestamp: Date.now(),
    };

    localStorage.setItem('medical_auth_event', JSON.stringify(authEvent));
    
    // Clean up the event after broadcasting
    setTimeout(() => {
      localStorage.removeItem('medical_auth_event');
    }, 1000);
  }

  private handleCrossTabAuthEvent(event: any): void {
    if (event.type === 'logout') {
      this.clearAuthData();
      this.clearTimers();
      window.location.href = '/replit-login';
    }
  }

  // Event handlers
  private handleAuthenticationFailure(): void {
    this.clearAuthData();
    this.clearTimers();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/replit-login';
    }
  }

  private notifyInsufficientPermissions(): void {
    // This would typically integrate with a toast notification system
    console.warn('[AUTH SERVICE] Insufficient permissions for this action');
  }

  private notifySessionExpired(): void {
    // This would typically show a user-friendly notification
    console.log('[AUTH SERVICE] Session expired, redirecting to login');
  }

  private clearTimers(): void {
    this.clearTokenRefreshTimer();
    
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // Utility methods
  getRedirectPath(user: MedicalUser): string {
    // Smart redirection based on user role and status
    if (!user.isActive || !user.isVerified) {
      return '/account-verification';
    }

    switch (user.role) {
      case 'super_admin':
        return '/admin/dashboard';
      case 'medico':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }

  // Cleanup method
  destroy(): void {
    this.clearTimers();
  }
}

// Singleton instance
export const authService = new AuthService();