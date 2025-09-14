// Cache management optimized for Replit Database

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
  key: string;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number;
  enablePersistence: boolean;
  replitOptimized: boolean;
}

class ReplitCacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes default for Replit Database optimization
      maxSize: 1000,
      enablePersistence: true,
      replitOptimized: true,
      ...config
    };

    this.initializeCache();
  }

  private initializeCache(): void {
    // Load persisted cache from localStorage if enabled
    if (this.config.enablePersistence && typeof window !== 'undefined') {
      this.loadFromStorage();
    }

    // Set up automatic cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);

    // Clean up on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveToStorage();
        if (this.cleanupInterval) {
          clearInterval(this.cleanupInterval);
        }
      });
    }
  }

  public set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = now + (ttl || this.config.defaultTTL);

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiry,
      key
    };

    this.cache.set(key, entry);

    // Persist medical-critical data immediately
    if (this.isMedicalCritical(key)) {
      this.persistEntry(key, entry);
    }
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      return null;
    }

    return entry.data as T;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      return false;
    }

    return true;
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.removeFromStorage(key);
    return deleted;
  }

  public clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('replit-cache-')
      );
      keys.forEach(key => localStorage.removeItem(key));
    }
  }

  // Medical-specific cache methods
  public setMedicalData<T>(
    category: 'patient' | 'consultation' | 'specialty' | 'template',
    id: string,
    data: T,
    ttl?: number
  ): void {
    const key = `medical:${category}:${id}`;
    const medicalTTL = ttl || this.getMedicalTTL(category);
    this.set(key, data, medicalTTL);
  }

  public getMedicalData<T>(
    category: 'patient' | 'consultation' | 'specialty' | 'template',
    id: string
  ): T | null {
    const key = `medical:${category}:${id}`;
    return this.get<T>(key);
  }

  public invalidateMedicalCategory(
    category: 'patient' | 'consultation' | 'specialty' | 'template'
  ): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(`medical:${category}:`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  // Replit Database optimization methods
  public setReplitQuery<T>(
    collection: string,
    query: string,
    result: T,
    ttl?: number
  ): void {
    const key = `replit:${collection}:${this.hashQuery(query)}`;
    this.set(key, result, ttl || 2 * 60 * 1000); // 2 minutes for DB queries
  }

  public getReplitQuery<T>(collection: string, query: string): T | null {
    const key = `replit:${collection}:${this.hashQuery(query)}`;
    return this.get<T>(key);
  }

  public invalidateReplitCollection(collection: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(`replit:${collection}:`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  // Progressive Web App cache methods
  public setPWAResource(url: string, data: any, ttl?: number): void {
    const key = `pwa:resource:${url}`;
    this.set(key, data, ttl || 24 * 60 * 60 * 1000); // 24 hours for PWA resources
  }

  public getPWAResource(url: string): any | null {
    const key = `pwa:resource:${url}`;
    return this.get(key);
  }

  // Utility methods
  private getMedicalTTL(category: string): number {
    const ttlMap = {
      patient: 10 * 60 * 1000,     // 10 minutes - patients data changes frequently
      consultation: 5 * 60 * 1000,  // 5 minutes - consultations are time-sensitive
      specialty: 60 * 60 * 1000,    // 1 hour - specialties are relatively static
      template: 30 * 60 * 1000      // 30 minutes - templates change occasionally
    };

    return ttlMap[category as keyof typeof ttlMap] || this.config.defaultTTL;
  }

  private isMedicalCritical(key: string): boolean {
    return key.includes('medical:patient:') || 
           key.includes('medical:consultation:') ||
           key.includes('emergency:');
  }

  private hashQuery(query: string): string {
    // Simple hash function for query strings
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTimestamp = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp && !this.isMedicalCritical(key)) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));

    // Persist cache state after cleanup
    if (this.config.enablePersistence) {
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const serializable = Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        data: entry.data,
        timestamp: entry.timestamp,
        expiry: entry.expiry
      }));

      localStorage.setItem('replit-cache-state', JSON.stringify(serializable));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('replit-cache-state');
      if (!stored) return;

      const entries = JSON.parse(stored);
      const now = Date.now();

      entries.forEach((entry: any) => {
        // Only load non-expired entries
        if (now < entry.expiry) {
          this.cache.set(entry.key, {
            data: entry.data,
            timestamp: entry.timestamp,
            expiry: entry.expiry,
            key: entry.key
          });
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private persistEntry(key: string, entry: CacheEntry<any>): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `replit-cache-${key}`;
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to persist cache entry:', error);
    }
  }

  private removeFromStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `replit-cache-${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to remove cache entry from storage:', error);
    }
  }

  // Cache statistics for monitoring
  public getStats(): {
    size: number;
    hitRate: number;
    memoryUsage: string;
    oldestEntry: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let oldestTimestamp = now;
    let expiredCount = 0;

    this.cache.forEach((entry) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
      if (now > entry.expiry) {
        expiredCount++;
      }
    });

    return {
      size: this.cache.size,
      hitRate: 0, // Would need to track hits/misses
      memoryUsage: `~${(JSON.stringify(Array.from(this.cache.entries())).length / 1024).toFixed(2)} KB`,
      oldestEntry: now - oldestTimestamp,
      expiredEntries: expiredCount
    };
  }
}

// Global cache instance optimized for Replit
export const replitCache = new ReplitCacheManager({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
  enablePersistence: true,
  replitOptimized: true
});

// React hook for cache management
export const useReplitCache = () => {
  const set = <T>(key: string, data: T, ttl?: number) => {
    replitCache.set(key, data, ttl);
  };

  const get = <T>(key: string): T | null => {
    return replitCache.get<T>(key);
  };

  const invalidate = (key: string) => {
    replitCache.delete(key);
  };

  const setMedical = <T>(
    category: 'patient' | 'consultation' | 'specialty' | 'template',
    id: string,
    data: T,
    ttl?: number
  ) => {
    replitCache.setMedicalData(category, id, data, ttl);
  };

  const getMedical = <T>(
    category: 'patient' | 'consultation' | 'specialty' | 'template',
    id: string
  ): T | null => {
    return replitCache.getMedicalData<T>(category, id);
  };

  return {
    set,
    get,
    invalidate,
    setMedical,
    getMedical,
    clear: () => replitCache.clear(),
    stats: () => replitCache.getStats()
  };
};

export default replitCache;