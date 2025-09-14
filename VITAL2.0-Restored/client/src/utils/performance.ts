// Performance utilities for medical application optimization in Replit

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  id: string;
  timestamp: number;
  context?: {
    page: string;
    userAgent: string;
    connection?: string;
    replitEnvironment: boolean;
  };
}

export interface MedicalPerformanceMarks {
  consultationFormLoad: number;
  patientSearchResponse: number;
  replitDatabaseQuery: number;
  medicalCalculation: number;
  specialtyTemplateLoad: number;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private metrics: WebVitalsMetric[] = [];
  private marks: Map<string, number> = new Map();
  private isReplitEnvironment: boolean;

  constructor() {
    this.isReplitEnvironment = this.detectReplitEnvironment();
    this.initializeWebVitals();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private detectReplitEnvironment(): boolean {
    if (typeof window === 'undefined') return false;
    
    const hostname = window.location.hostname;
    return (
      hostname.includes('.repl.co') ||
      hostname.includes('.replit.dev') ||
      hostname.includes('.replit.com') ||
      !!import.meta.env.VITE_REPL_SLUG ||
      !!import.meta.env.REPL_SLUG
    );
  }

  private initializeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Initialize Web Vitals monitoring
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
    this.observeFCP();
    this.observeTTFB();
  }

  private observeCLS(): void {
    let clsValue = 0;
    let clsEntries: LayoutShift[] = [];

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }

      this.recordMetric({
        name: 'CLS',
        value: clsValue,
        id: this.generateId(),
        timestamp: Date.now(),
        context: this.getContext()
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private observeFID(): void {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.recordMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          id: this.generateId(),
          timestamp: Date.now(),
          context: this.getContext()
        });
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  private observeLCP(): void {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        id: this.generateId(),
        timestamp: Date.now(),
        context: this.getContext()
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFCP(): void {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.recordMetric({
          name: 'FCP',
          value: entry.startTime,
          id: this.generateId(),
          timestamp: Date.now(),
          context: this.getContext()
        });
      }
    }).observe({ entryTypes: ['paint'] });
  }

  private observeTTFB(): void {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.recordMetric({
          name: 'TTFB',
          value: (entry as any).responseStart - (entry as any).requestStart,
          id: this.generateId(),
          timestamp: Date.now(),
          context: this.getContext()
        });
      }
    }).observe({ entryTypes: ['navigation'] });
  }

  private getContext() {
    return {
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
      replitEnvironment: this.isReplitEnvironment
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public recordMetric(metric: WebVitalsMetric): void {
    this.metrics.push(metric);
    
    // Send to analytics or logging service in Replit
    if (this.isReplitEnvironment) {
      this.sendToReplitAnalytics(metric);
    }
    
    // Log critical performance issues
    this.checkThresholds(metric);
  }

  private sendToReplitAnalytics(metric: WebVitalsMetric): void {
    // Send performance data to backend for storage in Replit Database
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        environment: 'replit',
        timestamp: Date.now()
      })
    }).catch(console.error);
  }

  private checkThresholds(metric: WebVitalsMetric): void {
    const thresholds = {
      CLS: 0.1,
      FID: 100,
      LCP: 2500,
      FCP: 1800,
      TTFB: 600
    };

    if (metric.value > thresholds[metric.name]) {
      console.warn(`Performance threshold exceeded: ${metric.name} = ${metric.value}`);
      
      // Send alert for critical medical application performance
      this.sendPerformanceAlert(metric);
    }
  }

  private sendPerformanceAlert(metric: WebVitalsMetric): void {
    // Create notification for performance issues in medical context
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'warning',
        title: 'Rendimiento del Sistema',
        message: `Métrica ${metric.name} excedió el umbral: ${metric.value.toFixed(2)}`,
        category: 'system',
        priority: 'high',
        data: { metric, threshold: true }
      })
    }).catch(console.error);
  }

  // Medical-specific performance marks
  public markMedicalOperation(operation: keyof MedicalPerformanceMarks): void {
    const markName = `medical-${operation}`;
    const timestamp = performance.now();
    
    performance.mark(markName);
    this.marks.set(markName, timestamp);
  }

  public measureMedicalOperation(operation: keyof MedicalPerformanceMarks, startMark?: string): number {
    const endMark = `medical-${operation}`;
    const startMarkName = startMark || `${endMark}-start`;
    
    try {
      performance.measure(`${operation}-duration`, startMarkName, endMark);
      
      const entries = performance.getEntriesByName(`${operation}-duration`);
      const duration = entries[entries.length - 1]?.duration || 0;
      
      // Log slow medical operations
      if (duration > 1000) { // More than 1 second
        console.warn(`Slow medical operation: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    } catch (error) {
      console.error('Error measuring medical operation:', error);
      return 0;
    }
  }

  // Bundle size analysis for Replit deployment
  public analyzeBundleSize(): void {
    if (typeof window === 'undefined') return;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    const bundleInfo = {
      scripts: scripts.map(script => ({
        src: (script as HTMLScriptElement).src,
        size: 'unknown' // Would need actual size from network
      })),
      styles: styles.map(style => ({
        href: (style as HTMLLinkElement).href,
        size: 'unknown'
      })),
      timestamp: Date.now(),
      replitEnvironment: this.isReplitEnvironment
    };

    // Send bundle analysis to backend
    fetch('/api/analytics/bundle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundleInfo)
    }).catch(console.error);
  }

  // Get performance summary for medical dashboard
  public getPerformanceSummary(): {
    averages: Record<string, number>;
    latest: WebVitalsMetric[];
    criticalIssues: number;
    replitOptimized: boolean;
  } {
    const averages: Record<string, number> = {};
    const metricsByName = this.groupMetricsByName();
    
    Object.entries(metricsByName).forEach(([name, metrics]) => {
      averages[name] = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    });

    const latest = this.metrics.slice(-10);
    const criticalIssues = this.metrics.filter(m => {
      const thresholds = { CLS: 0.1, FID: 100, LCP: 2500, FCP: 1800, TTFB: 600 };
      return m.value > thresholds[m.name];
    }).length;

    return {
      averages,
      latest,
      criticalIssues,
      replitOptimized: this.isReplitEnvironment
    };
  }

  private groupMetricsByName(): Record<string, WebVitalsMetric[]> {
    return this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, WebVitalsMetric[]>);
  }

  // Clear old metrics to prevent memory leaks
  public cleanup(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }
}

export const performanceManager = PerformanceManager.getInstance();

// Medical-specific performance hooks
export const useMedicalPerformance = () => {
  const markStart = (operation: keyof MedicalPerformanceMarks) => {
    performanceManager.markMedicalOperation(operation);
  };

  const markEnd = (operation: keyof MedicalPerformanceMarks, startMark?: string) => {
    return performanceManager.measureMedicalOperation(operation, startMark);
  };

  return { markStart, markEnd };
};

// Error boundary with performance context
export const trackError = (error: Error, context: Record<string, any> = {}) => {
  const performanceSummary = performanceManager.getPerformanceSummary();
  
  const errorReport = {
    message: error.message,
    stack: error.stack,
    context: {
      ...context,
      performance: performanceSummary,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }
  };

  // Send error report to backend
  fetch('/api/analytics/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorReport)
  }).catch(console.error);
};

export default performanceManager;