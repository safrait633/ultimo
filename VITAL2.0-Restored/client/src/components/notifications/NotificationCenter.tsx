import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Settings,
  Archive,
  Trash2,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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
}

export interface NotificationAction {
  id: string;
  label: string;
  action: 'view' | 'approve' | 'dismiss' | 'navigate';
  url?: string;
  data?: Record<string, any>;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<string, number>;
  recent: number;
}

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MedicalNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadStats();
      
      // Set up periodic refresh
      const interval = setInterval(() => {
        loadNotifications();
        loadStats();
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, filter]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const statusFilter = filter === 'unread' ? 'new' : undefined;
      const priorityFilter = filter === 'critical' ? 'critical' : undefined;
      
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('status', statusFilter);
      if (priorityFilter) queryParams.append('priority', priorityFilter);
      queryParams.append('limit', '50');
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('sortOrder', 'desc');

      const response = await fetch(`/api/notifications?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date().toISOString() }
              : notification
          )
        );
        loadStats();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAsArchived = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/archive`, {
        method: 'PUT'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
        loadStats();
      }
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType, priority: string) => {
    const iconClass = cn(
      "w-5 h-5",
      priority === 'critical' && "animate-pulse"
    );

    switch (type) {
      case 'success':
        return <CheckCircle className={cn(iconClass, "text-[#34D399]")} />;
      case 'error':
      case 'critical':
        return <AlertCircle className={cn(iconClass, "text-[#F87171]")} />;
      case 'warning':
        return <AlertTriangle className={cn(iconClass, "text-[#FBBF24]")} />;
      case 'info':
      case 'medical':
        return <Info className={cn(iconClass, "text-[#60A5FA]")} />;
      default:
        return <Bell className={cn(iconClass, "text-[#7D8590]")} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-[#F87171] bg-[#F87171]/5';
      case 'high': return 'border-l-[#FBBF24] bg-[#FBBF24]/5';
      case 'medium': return 'border-l-[#60A5FA] bg-[#60A5FA]/5';
      default: return 'border-l-[#7D8590] bg-[#7D8590]/5';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      appointment: 'Cita',
      lab_result: 'Laboratorio',
      system: 'Sistema',
      protocol: 'Protocolo',
      patient: 'Paciente',
      backup: 'Respaldo'
    };
    return labels[category] || category;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleActionClick = (action: NotificationAction, notification: MedicalNotification) => {
    switch (action.action) {
      case 'navigate':
        if (action.url) {
          window.location.href = action.url;
        }
        break;
      case 'dismiss':
        markAsRead(notification.id);
        break;
      case 'view':
        markAsRead(notification.id);
        break;
      case 'approve':
        // Handle approval logic
        markAsRead(notification.id);
        break;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return notification.status === 'new';
      case 'critical': return notification.priority === 'critical';
      default: return true;
    }
  });

  const unreadCount = stats?.unread || 0;

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-[#7D8590] hover:text-[#E6EDF3] hover:bg-[#21262D]"
            data-testid="notification-bell"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge 
                className={cn(
                  "absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs px-1 bg-[#F87171] text-white border-0",
                  unreadCount > 9 && "px-1.5",
                  stats?.byType?.critical > 0 && "animate-pulse"
                )}
                data-testid="notification-badge"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-96 p-0 bg-[#1C2128] border-[#374151]" 
          align="end"
          data-testid="notification-dropdown"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#E6EDF3]">
                  Notificaciones
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-[#E6EDF3]">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-[#0F1419] rounded-lg p-1">
                {[
                  { key: 'all', label: 'Todas', count: stats?.total || 0 },
                  { key: 'unread', label: 'No leídas', count: stats?.unread || 0 },
                  { key: 'critical', label: 'Críticas', count: stats?.byType?.critical || 0 }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm rounded-md transition-colors text-center",
                      filter === tab.key
                        ? "bg-[#238636] text-white"
                        : "text-[#7D8590] hover:text-[#E6EDF3] hover:bg-[#21262D]"
                    )}
                    data-testid={`filter-${tab.key}`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1 text-xs opacity-75">
                        ({tab.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardHeader>
            
            <Separator className="bg-[#374151]" />
            
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-[#7D8590]">Cargando...</div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                    <Bell className="w-8 h-8 text-[#7D8590] mb-2" />
                    <p className="text-[#7D8590] text-sm">
                      {filter === 'all' 
                        ? 'No hay notificaciones'
                        : filter === 'unread'
                        ? 'No hay notificaciones sin leer'
                        : 'No hay notificaciones críticas'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-lg border-l-4 transition-colors cursor-pointer",
                          getPriorityColor(notification.priority),
                          notification.status === 'new' && "bg-[#238636]/5",
                          "hover:bg-[#21262D]"
                        )}
                        onClick={() => notification.status === 'new' && markAsRead(notification.id)}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className={cn(
                                    "text-sm font-medium truncate",
                                    notification.status === 'new' ? "text-[#E6EDF3]" : "text-[#7D8590]"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  {notification.status === 'new' && (
                                    <div className="w-2 h-2 bg-[#238636] rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                
                                <p className="text-xs text-[#7D8590] mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs border-[#374151] text-[#7D8590]"
                                    >
                                      {getCategoryLabel(notification.category)}
                                    </Badge>
                                    <span className="text-xs text-[#7D8590]">
                                      {getTimeAgo(notification.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                {notification.actions && notification.actions.length > 0 && (
                                  <div className="flex items-center space-x-2 mt-3">
                                    {notification.actions.map((action) => (
                                      <Button
                                        key={action.id}
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleActionClick(action, notification);
                                        }}
                                        className="text-xs h-7 border-[#374151] text-[#E6EDF3] hover:border-[#238636]"
                                        data-testid={`action-${action.id}`}
                                      >
                                        {action.action === 'navigate' && <ExternalLink className="w-3 h-3 mr-1" />}
                                        {action.action === 'view' && <Eye className="w-3 h-3 mr-1" />}
                                        {action.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Quick Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {notification.status === 'new' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1 h-6 w-6 text-[#7D8590] hover:text-[#238636]"
                                    data-testid={`mark-read-${notification.id}`}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsArchived(notification.id);
                                  }}
                                  className="p-1 h-6 w-6 text-[#7D8590] hover:text-[#FBBF24]"
                                  data-testid={`archive-${notification.id}`}
                                >
                                  <Archive className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 h-6 w-6 text-[#7D8590] hover:text-[#F87171]"
                                  data-testid={`delete-${notification.id}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}