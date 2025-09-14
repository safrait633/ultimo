// Replit environment configuration and optimization

export interface ReplitConfig {
  environment: 'development' | 'production' | 'replit';
  deploymentUrl?: string;
  slug?: string;
  owner?: string;
  databaseUrl?: string;
  isReplitEnvironment: boolean;
  features: {
    notifications: boolean;
    performance: boolean;
    analytics: boolean;
    cache: boolean;
    pwa: boolean;
  };
}

class ReplitConfigManager {
  private config: ReplitConfig;

  constructor() {
    this.config = this.initializeConfig();
  }

  private initializeConfig(): ReplitConfig {
    const isReplit = this.detectReplitEnvironment();
    
    return {
      environment: this.getEnvironment(),
      deploymentUrl: this.getDeploymentUrl(),
      slug: this.getReplSlug(),
      owner: this.getReplOwner(),
      databaseUrl: this.getDatabaseUrl(),
      isReplitEnvironment: isReplit,
      features: {
        notifications: true,
        performance: isReplit,
        analytics: isReplit,
        cache: true,
        pwa: isReplit
      }
    };
  }

  private detectReplitEnvironment(): boolean {
    // Check multiple indicators of Replit environment
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('.repl.co') || 
          hostname.includes('.replit.dev') || 
          hostname.includes('.replit.com')) {
        return true;
      }
    }

    // Check environment variables
    return !!(
      import.meta.env.VITE_REPL_SLUG ||
      import.meta.env.REPL_SLUG ||
      import.meta.env.VITE_REPLIT_DEPLOYMENT ||
      process.env.REPL_SLUG
    );
  }

  private getEnvironment(): 'development' | 'production' | 'replit' {
    if (this.detectReplitEnvironment()) {
      return 'replit';
    }
    return import.meta.env.MODE === 'production' ? 'production' : 'development';
  }

  private getDeploymentUrl(): string | undefined {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    const slug = this.getReplSlug();
    const owner = this.getReplOwner();
    
    if (slug && owner) {
      return `https://${slug}.${owner}.repl.co`;
    }
    
    return undefined;
  }

  private getReplSlug(): string | undefined {
    return import.meta.env.VITE_REPL_SLUG || 
           import.meta.env.REPL_SLUG || 
           process.env.REPL_SLUG;
  }

  private getReplOwner(): string | undefined {
    return import.meta.env.VITE_REPL_OWNER || 
           import.meta.env.REPL_OWNER || 
           process.env.REPL_OWNER;
  }

  private getDatabaseUrl(): string | undefined {
    return import.meta.env.VITE_DATABASE_URL || 
           process.env.DATABASE_URL;
  }

  public getConfig(): ReplitConfig {
    return { ...this.config };
  }

  public isReplitEnvironment(): boolean {
    return this.config.isReplitEnvironment;
  }

  public getAPIBaseUrl(): string {
    if (this.config.isReplitEnvironment && this.config.deploymentUrl) {
      return `${this.config.deploymentUrl}/api`;
    }
    return '/api';
  }

  public getWebSocketUrl(): string {
    const baseUrl = this.config.deploymentUrl || window.location.origin;
    const wsProtocol = baseUrl.startsWith('https:') ? 'wss:' : 'ws:';
    return `${wsProtocol}//${baseUrl.replace(/^https?:\/\//, '')}/ws`;
  }

  public shouldEnableFeature(feature: keyof ReplitConfig['features']): boolean {
    return this.config.features[feature];
  }

  public getReplitMetadata(): Record<string, any> {
    return {
      environment: this.config.environment,
      slug: this.config.slug,
      owner: this.config.owner,
      deploymentUrl: this.config.deploymentUrl,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // Medical-specific Replit optimizations
  public getMedicalConfig(): {
    cacheTimeout: number;
    performanceTracking: boolean;
    offlineSupport: boolean;
    dataEncryption: boolean;
    auditLogging: boolean;
  } {
    const isProduction = this.config.environment === 'production' || this.config.environment === 'replit';
    
    return {
      cacheTimeout: isProduction ? 5 * 60 * 1000 : 2 * 60 * 1000, // 5min prod, 2min dev
      performanceTracking: this.config.isReplitEnvironment,
      offlineSupport: this.config.isReplitEnvironment,
      dataEncryption: isProduction,
      auditLogging: true
    };
  }

  // Production optimization settings
  public getOptimizationConfig(): {
    lazyLoading: boolean;
    codesplitting: boolean;
    bundleAnalysis: boolean;
    serviceWorker: boolean;
    compression: boolean;
  } {
    const isProduction = this.config.environment === 'production' || this.config.environment === 'replit';
    
    return {
      lazyLoading: true,
      codesplitting: true,
      bundleAnalysis: isProduction,
      serviceWorker: this.config.isReplitEnvironment,
      compression: isProduction
    };
  }

  // Security configuration for medical data
  public getSecurityConfig(): {
    tokenRefreshInterval: number;
    sessionTimeout: number;
    encryptionEnabled: boolean;
    auditLevel: 'basic' | 'detailed' | 'comprehensive';
    rateLimiting: boolean;
  } {
    const isProduction = this.config.environment === 'production' || this.config.environment === 'replit';
    
    return {
      tokenRefreshInterval: 14 * 60 * 1000, // 14 minutes
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      encryptionEnabled: isProduction,
      auditLevel: isProduction ? 'comprehensive' : 'detailed',
      rateLimiting: true
    };
  }

  // Monitoring and analytics configuration
  public getMonitoringConfig(): {
    errorTracking: boolean;
    performanceMonitoring: boolean;
    userAnalytics: boolean;
    medicalMetrics: boolean;
    replitIntegration: boolean;
  } {
    return {
      errorTracking: true,
      performanceMonitoring: this.config.isReplitEnvironment,
      userAnalytics: this.config.isReplitEnvironment,
      medicalMetrics: true,
      replitIntegration: this.config.isReplitEnvironment
    };
  }
}

// Global configuration instance
export const replitConfig = new ReplitConfigManager();

// React hook for accessing Replit configuration
export const useReplitConfig = () => {
  const config = replitConfig.getConfig();
  
  return {
    config,
    isReplit: replitConfig.isReplitEnvironment(),
    apiBaseUrl: replitConfig.getAPIBaseUrl(),
    wsUrl: replitConfig.getWebSocketUrl(),
    shouldEnableFeature: replitConfig.shouldEnableFeature.bind(replitConfig),
    medicalConfig: replitConfig.getMedicalConfig(),
    optimizationConfig: replitConfig.getOptimizationConfig(),
    securityConfig: replitConfig.getSecurityConfig(),
    monitoringConfig: replitConfig.getMonitoringConfig(),
    metadata: replitConfig.getReplitMetadata()
  };
};

// Performance and build optimization utilities
export const optimizeForReplit = {
  // Lazy load components for better initial load time
  lazyComponent: <T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    fallback?: React.ReactNode
  ) => {
    const LazyComponent = React.lazy(factory);
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} ref={ref} />
      </React.Suspense>
    ));
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    if (typeof window === 'undefined') return;

    // Preload critical CSS
    const criticalCSS = [
      '/assets/main.css',
      '/assets/medical.css'
    ];

    criticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });

    // Preload critical API endpoints
    const criticalEndpoints = [
      '/api/auth/me',
      '/api/specialties/active'
    ];

    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {});
    });
  },

  // Optimize images for Replit
  optimizeImages: () => {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img[data-optimize]');
    images.forEach(img => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            if (image.dataset.src) {
              image.src = image.dataset.src;
              observer.unobserve(image);
            }
          }
        });
      });
      observer.observe(img);
    });
  },

  // Service worker registration for PWA
  registerServiceWorker: () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    if (replitConfig.isReplitEnvironment()) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
};

export default replitConfig;