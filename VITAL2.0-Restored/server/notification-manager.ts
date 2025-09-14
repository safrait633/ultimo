import Database from '@replit/database';

const db = new Database();

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'critical' | 'medical';

export type NotificationStatus = 'new' | 'read' | 'archived';

export interface MedicalNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'appointment' | 'lab_result' | 'system' | 'protocol' | 'patient' | 'backup';
  data?: Record<string, any>;
  actions?: NotificationAction[];
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  expiresAt?: string;
  replitMetadata: {
    deploymentUrl?: string;
    environment: string;
    triggeredBy: string;
  };
}

export interface NotificationAction {
  id: string;
  label: string;
  action: 'view' | 'approve' | 'dismiss' | 'navigate';
  url?: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  enableToast: boolean;
  enablePush: boolean;
  enableSound: boolean;
  soundLevel: number;
  doNotDisturbStart?: string;
  doNotDisturbEnd?: string;
  categories: {
    appointment: boolean;
    lab_result: boolean;
    system: boolean;
    protocol: boolean;
    patient: boolean;
    backup: boolean;
  };
  criticalOverride: boolean;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<string, number>;
  recent: number;
}

export class NotificationManager {
  private static instance: NotificationManager;

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private constructor() {
    this.initializeNotificationSystem();
  }

  private async initializeNotificationSystem(): Promise<void> {
    try {
      // Clean up expired notifications periodically
      setInterval(async () => {
        await this.cleanupExpiredNotifications();
      }, 60000); // Every minute

      console.log('Notification system initialized');
    } catch (error) {
      console.error('Error initializing notification system:', error);
    }
  }

  public async createNotification(notification: Omit<MedicalNotification, 'id' | 'createdAt' | 'replitMetadata'>): Promise<string> {
    try {
      const notificationId = `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const fullNotification: MedicalNotification = {
        ...notification,
        id: notificationId,
        createdAt: now,
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          environment: process.env.NODE_ENV || 'development',
          triggeredBy: 'system'
        }
      };

      // Set expiration if not provided (default 30 days)
      if (!fullNotification.expiresAt) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        fullNotification.expiresAt = expirationDate.toISOString();
      }

      await db.set(`notifications:${notification.userId}:${notificationId}`, fullNotification);
      
      // Update user notification stats
      await this.updateUserStats(notification.userId);
      
      return notificationId;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  public async getUserNotifications(
    userId: string, 
    options: {
      status?: NotificationStatus;
      category?: string;
      limit?: number;
      offset?: number;
      sortBy?: 'createdAt' | 'priority';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ notifications: MedicalNotification[]; total: number }> {
    try {
      const { status, category, limit = 50, offset = 0, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      // Get all notification keys for user
      const allNotifications: MedicalNotification[] = [];
      
      // This is simplified - in production you'd use proper indexing
      const keys = await this.getNotificationKeysForUser(userId);
      
      for (const key of keys) {
        const notification = await db.get(key);
        if (notification) {
          allNotifications.push(notification);
        }
      }

      // Apply filters
      let filteredNotifications = allNotifications;
      
      if (status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === status);
      }
      
      if (category) {
        filteredNotifications = filteredNotifications.filter(n => n.category === category);
      }

      // Sort notifications
      filteredNotifications.sort((a, b) => {
        let compareValue = 0;
        
        if (sortBy === 'priority') {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          compareValue = priorityOrder[b.priority] - priorityOrder[a.priority];
        } else {
          compareValue = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        
        return sortOrder === 'desc' ? compareValue : -compareValue;
      });

      const total = filteredNotifications.length;
      const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

      return {
        notifications: paginatedNotifications,
        total
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return { notifications: [], total: 0 };
    }
  }

  public async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      const key = `notifications:${userId}:${notificationId}`;
      const notification = await db.get(key);
      
      if (!notification) {
        return false;
      }

      notification.status = 'read';
      notification.readAt = new Date().toISOString();
      
      await db.set(key, notification);
      await this.updateUserStats(userId);
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  public async markAsArchived(userId: string, notificationId: string): Promise<boolean> {
    try {
      const key = `notifications:${userId}:${notificationId}`;
      const notification = await db.get(key);
      
      if (!notification) {
        return false;
      }

      notification.status = 'archived';
      notification.archivedAt = new Date().toISOString();
      
      await db.set(key, notification);
      await this.updateUserStats(userId);
      
      return true;
    } catch (error) {
      console.error('Error marking notification as archived:', error);
      return false;
    }
  }

  public async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    try {
      const key = `notifications:${userId}:${notificationId}`;
      await db.delete(key);
      await this.updateUserStats(userId);
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  public async getUserStats(userId: string): Promise<NotificationStats> {
    try {
      const statsKey = `notification_stats:${userId}`;
      const stats = await db.get(statsKey);
      
      if (stats) {
        return stats;
      }

      // Calculate stats if not cached
      return await this.calculateUserStats(userId);
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {} as Record<NotificationType, number>,
        byCategory: {},
        recent: 0
      };
    }
  }

  public async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const prefsKey = `notification_prefs:${userId}`;
      const prefs = await db.get(prefsKey);
      
      if (prefs) {
        return prefs;
      }

      // Return default preferences
      const defaultPrefs: NotificationPreferences = {
        userId,
        enableToast: true,
        enablePush: true,
        enableSound: true,
        soundLevel: 50,
        categories: {
          appointment: true,
          lab_result: true,
          system: true,
          protocol: true,
          patient: true,
          backup: true
        },
        criticalOverride: true,
        updatedAt: new Date().toISOString()
      };

      await this.updateUserPreferences(userId, defaultPrefs);
      return defaultPrefs;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }

  public async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const prefsKey = `notification_prefs:${userId}`;
      const currentPrefs = await this.getUserPreferences(userId);
      
      const updatedPrefs: NotificationPreferences = {
        ...currentPrefs,
        ...preferences,
        userId,
        updatedAt: new Date().toISOString()
      };

      await db.set(prefsKey, updatedPrefs);
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  public async createMedicalNotifications(): Promise<void> {
    // Create sample medical notifications for demonstration
    const sampleNotifications = [
      {
        userId: 'user1',
        type: 'warning' as NotificationType,
        title: 'Paciente en sala de espera',
        message: 'María González está esperando en sala 3 desde hace 15 minutos.',
        status: 'new' as NotificationStatus,
        priority: 'high' as const,
        category: 'patient' as const,
        actions: [
          { id: 'view', label: 'Ver Paciente', action: 'navigate' as const, url: '/patients/PAT001' },
          { id: 'dismiss', label: 'Marcar como vista', action: 'dismiss' as const }
        ]
      },
      {
        userId: 'user1',
        type: 'info' as NotificationType,
        title: 'Resultados de laboratorio',
        message: 'Nuevos resultados disponibles para Carlos Rodríguez.',
        status: 'new' as NotificationStatus,
        priority: 'medium' as const,
        category: 'lab_result' as const,
        actions: [
          { id: 'view', label: 'Ver Resultados', action: 'navigate' as const, url: '/lab-results/LAB001' }
        ]
      },
      {
        userId: 'user1',
        type: 'success' as NotificationType,
        title: 'Backup completado',
        message: 'El respaldo diario se completó exitosamente a las 02:00.',
        status: 'new' as NotificationStatus,
        priority: 'low' as const,
        category: 'backup' as const
      },
      {
        userId: 'user1',
        type: 'critical' as NotificationType,
        title: 'Consulta atrasada',
        message: 'La consulta de las 14:30 lleva 20 minutos de retraso.',
        status: 'new' as NotificationStatus,
        priority: 'critical' as const,
        category: 'appointment' as const,
        actions: [
          { id: 'reschedule', label: 'Reprogramar', action: 'navigate' as const, url: '/appointments/reschedule' },
          { id: 'notify', label: 'Notificar Paciente', action: 'approve' as const }
        ]
      }
    ];

    for (const notification of sampleNotifications) {
      await this.createNotification(notification);
    }
  }

  private async getNotificationKeysForUser(userId: string): Promise<string[]> {
    // Simplified implementation - in production use proper indexing
    return [];
  }

  private async updateUserStats(userId: string): Promise<void> {
    try {
      const stats = await this.calculateUserStats(userId);
      const statsKey = `notification_stats:${userId}`;
      await db.set(statsKey, stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  private async calculateUserStats(userId: string): Promise<NotificationStats> {
    try {
      const { notifications } = await this.getUserNotifications(userId, { limit: 1000 });
      
      const stats: NotificationStats = {
        total: notifications.length,
        unread: notifications.filter(n => n.status === 'new').length,
        byType: {} as Record<NotificationType, number>,
        byCategory: {},
        recent: 0
      };

      // Calculate by type and category
      notifications.forEach(notification => {
        // By type
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
        
        // By category
        stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1;
        
        // Recent (last 24 hours)
        const notificationDate = new Date(notification.createdAt);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (notificationDate > oneDayAgo) {
          stats.recent++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {} as Record<NotificationType, number>,
        byCategory: {},
        recent: 0
      };
    }
  }

  private async cleanupExpiredNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      // This is simplified - in production you'd use proper indexing
      // and batch operations for better performance
      console.log('Cleaning up expired notifications...');
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
    }
  }
}

export default NotificationManager;