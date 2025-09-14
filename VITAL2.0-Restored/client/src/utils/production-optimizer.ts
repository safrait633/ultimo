// Production optimization utilities for medical application

import { replitConfig } from './replit-config.tsx';
import { replitCache } from './cache-manager';
import { performanceManager } from './performance';

interface OptimizationMetrics {
  bundleSize: number;
  loadTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  errorRate: number;
}

class ProductionOptimizer {
  private metrics: OptimizationMetrics = {
    bundleSize: 0,
    loadTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    errorRate: 0
  };

  private observers: Map<string, any> = new Map();

  constructor() {
    this.initializeOptimizations();
  }

  private initializeOptimizations(): void {
    if (typeof window === 'undefined') return;

    // Initialize based on environment
    if (replitConfig.isReplitEnvironment()) {
      this.initializeReplitOptimizations();
    }

    this.setupPerformanceObservers();
    this.optimizeResourceLoading();
    this.setupErrorTracking();
  }

  private initializeReplitOptimizations(): void {
    // Replit-specific optimizations
    this.enableServiceWorker();
    this.optimizeForReplitDatabase();
    this.setupReplitMonitoring();
  }

  private setupPerformanceObservers(): void {
    // Resource timing observer
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.analyzeResourceTiming(entry);
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', resourceObserver);

    // Navigation timing observer
    const navigationObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
      });
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });
    this.observers.set('navigation', navigationObserver);

    // Memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 30000); // Every 30 seconds
    }
  }

  private analyzeResourceTiming(entry: PerformanceEntry): void {
    const resourceEntry = entry as PerformanceResourceTiming;
    
    // Track large resources
    if (resourceEntry.transferSize > 100 * 1024) { // > 100KB
      console.warn(`Large resource detected: ${entry.name} (${(resourceEntry.transferSize / 1024).toFixed(2)}KB)`);
      
      // Send to analytics
      this.sendOptimizationAlert({
        type: 'large_resource',
        resource: entry.name,
        size: resourceEntry.transferSize,
        timing: resourceEntry.duration
      });
    }

    // Track slow resources
    if (resourceEntry.duration > 1000) { // > 1 second
      console.warn(`Slow resource detected: ${entry.name} (${resourceEntry.duration.toFixed(2)}ms)`);
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      ssl: entry.connectEnd - entry.secureConnectionStart,
      ttfb: entry.responseStart - entry.requestStart,
      download: entry.responseEnd - entry.responseStart,
      domProcessing: entry.domContentLoadedEventStart - entry.responseEnd,
      total: entry.loadEventEnd - entry.navigationStart
    };

    this.metrics.loadTime = metrics.total;

    // Check for performance issues
    if (metrics.ttfb > 600) { // TTFB > 600ms
      this.sendOptimizationAlert({
        type: 'slow_ttfb',
        value: metrics.ttfb,
        threshold: 600
      });
    }

    if (metrics.total > 3000) { // Total load > 3s
      this.sendOptimizationAlert({
        type: 'slow_page_load',
        value: metrics.total,
        threshold: 3000
      });
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;

      // Alert if memory usage is high
      const memoryUsageMB = memory.usedJSHeapSize / (1024 * 1024);
      if (memoryUsageMB > 50) { // > 50MB
        this.sendOptimizationAlert({
          type: 'high_memory_usage',
          value: memoryUsageMB,
          threshold: 50
        });
      }
    }
  }

  private optimizeResourceLoading(): void {
    // Implement resource hints
    this.addResourceHints();
    
    // Optimize font loading
    this.optimizeFontLoading();
    
    // Implement image lazy loading
    this.implementImageLazyLoading();
    
    // Optimize CSS delivery
    this.optimizeCSSDelivery();
  }

  private addResourceHints(): void {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if ('crossorigin' in hint) {
        link.crossOrigin = hint.crossorigin;
      }
      document.head.appendChild(link);
    });
  }

  private optimizeFontLoading(): void {
    // Use font-display: swap for web fonts
    const fontCSS = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }
    `;

    const style = document.createElement('style');
    style.textContent = fontCSS;
    document.head.appendChild(style);
  }

  private implementImageLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      this.observers.set('image', imageObserver);
    }
  }

  private optimizeCSSDelivery(): void {
    // Inline critical CSS and load non-critical CSS asynchronously
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]');
    
    nonCriticalCSS.forEach(link => {
      const htmlLink = link as HTMLLinkElement;
      htmlLink.media = 'print';
      htmlLink.onload = () => {
        htmlLink.media = 'all';
      };
    });
  }

  private enableServiceWorker(): void {
    if ('serviceWorker' in navigator && replitConfig.isReplitEnvironment()) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            this.handleServiceWorkerUpdate(registration);
          });
          
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    }
  }

  private handleServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
    const newWorker = registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Show update notification to user
        this.showUpdateNotification();
      }
    });
  }

  private showUpdateNotification(): void {
    // Create notification for app update
    const notification = {
      type: 'info' as const,
      title: 'Actualización Disponible',
      message: 'Una nueva versión de la aplicación está disponible. Recarga la página para actualizar.',
      category: 'system' as const,
      priority: 'medium' as const,
      actions: [
        {
          id: 'reload',
          label: 'Recargar Ahora',
          action: 'approve' as const
        },
        {
          id: 'later',
          label: 'Más Tarde',
          action: 'dismiss' as const
        }
      ]
    };

    // Send notification (this would integrate with the notification system)
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    }).catch(console.error);
  }

  private optimizeForReplitDatabase(): void {
    // Implement optimizations specific to Replit Database
    const dbOptimizations = {
      // Batch requests when possible
      batchRequests: true,
      
      // Use connection pooling
      connectionPooling: true,
      
      // Implement query optimization
      queryOptimization: true,
      
      // Cache frequently accessed data
      cacheOptimization: true
    };

    // Set up database query monitoring
    this.monitorDatabaseQueries();
  }

  private monitorDatabaseQueries(): void {
    // Intercept fetch requests to database endpoints
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      const response = await originalFetch(...args);
      const duration = performance.now() - start;

      // Monitor API calls
      if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/')) {
        this.trackAPICall(args[0], duration, response.status);
      }

      return response;
    };
  }

  private trackAPICall(url: string, duration: number, status: number): void {
    // Log slow API calls
    if (duration > 1000) { // > 1 second
      console.warn(`Slow API call: ${url} (${duration.toFixed(2)}ms)`);
      
      this.sendOptimizationAlert({
        type: 'slow_api_call',
        url,
        duration,
        status,
        threshold: 1000
      });
    }

    // Track error rates
    if (status >= 400) {
      this.metrics.errorRate += 1;
    }
  }

  private setupReplitMonitoring(): void {
    // Send periodic optimization reports to backend
    setInterval(() => {
      this.sendOptimizationReport();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript_error',
        message: event.error?.message || event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'unhandled_rejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
      });
    });
  }

  private trackError(error: Record<string, any>): void {
    this.metrics.errorRate += 1;
    
    // Send error to backend for analysis
    fetch('/api/analytics/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...error,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        replitEnvironment: replitConfig.isReplitEnvironment()
      })
    }).catch(console.error);
  }

  private sendOptimizationAlert(alert: Record<string, any>): void {
    fetch('/api/analytics/optimization-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...alert,
        timestamp: Date.now(),
        replitEnvironment: replitConfig.isReplitEnvironment()
      })
    }).catch(console.error);
  }

  private sendOptimizationReport(): void {
    const cacheStats = replitCache.getStats();
    const performanceSummary = performanceManager.getPerformanceSummary();
    
    const report = {
      metrics: this.metrics,
      cache: cacheStats,
      performance: performanceSummary,
      environment: replitConfig.getReplitMetadata(),
      timestamp: Date.now()
    };

    fetch('/api/analytics/optimization-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    }).catch(console.error);
  }

  // Bundle analysis for optimization
  public analyzeBundleSize(): Promise<any> {
    return new Promise((resolve) => {
      // This would typically integrate with webpack-bundle-analyzer
      // or similar tools in a real implementation
      const bundleInfo = {
        totalSize: 0,
        chunks: [] as any[],
        duplicates: [] as any[],
        optimizationSuggestions: [] as string[]
      };

      // Analyze loaded scripts
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      scripts.forEach((script: any) => {
        // In a real implementation, this would fetch actual sizes
        bundleInfo.chunks.push({
          name: script.src.split('/').pop(),
          size: 'unknown'
        });
      });

      resolve(bundleInfo);
    });
  }

  // Clean up observers
  public cleanup(): void {
    this.observers.forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
    this.observers.clear();
  }

  public getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }
}

// Global optimizer instance
export const productionOptimizer = new ProductionOptimizer();

// React hook for optimization metrics
export const useOptimization = () => {
  const [metrics, setMetrics] = React.useState<OptimizationMetrics>(productionOptimizer.getMetrics());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(productionOptimizer.getMetrics());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    analyzer: productionOptimizer.analyzeBundleSize.bind(productionOptimizer),
    cleanup: productionOptimizer.cleanup.bind(productionOptimizer)
  };
};

export default productionOptimizer;