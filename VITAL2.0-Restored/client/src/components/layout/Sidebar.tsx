import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  UserCheck,
  Heart,
  Stethoscope,
  Search,
  Plus,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles?: string[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    id: 'nueva-consulta',
    label: 'Nueva Consulta',
    icon: Plus,
    href: '/nueva-consulta'
  },
  {
    id: 'historial-consultas',
    label: 'Historial de Consultas',
    icon: FileText,
    href: '/historial-consultas',
    badge: 4
  },
  {
    id: 'patients',
    label: 'Pacientes',
    icon: Users,
    href: '/patients'
  },
  {
    id: 'search',
    label: 'Búsqueda',
    icon: Search,
    href: '/search'
  },
  {
    id: 'specialties',
    label: 'Especialidades',
    icon: Heart,
    href: '/specialties'
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: BarChart3,
    href: '/reports'
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: Settings,
    href: '/admin',
    roles: ['super_admin']
  }
];

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || 'medico')
  );

  const handleNavigation = (href: string) => {
    setLocation(href);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex-shrink-0",
          "h-full overflow-y-auto",
          collapsed ? "w-[60px]" : "w-[220px]",
          // Mobile: fixed positioning with overlay
          "md:relative md:translate-x-0",
          mobileOpen ? "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] translate-x-0" : "hidden md:block"
        )}
      >
        {/* User Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10 ring-2 ring-emerald-500/20">
              <AvatarImage src={undefined} alt={user?.firstName} />
              <AvatarFallback className="bg-emerald-500 text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Dr. {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.specialty}
                </div>
                <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  En línea
                </div>
              </div>
            )}
          </div>
          
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <p className="px-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-2">
            Navegación Principal
          </p>
          
          <nav className="flex flex-col space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = location === item.href;
              const IconComponent = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors relative",
                    isActive
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <Stethoscope className="w-4 h-4" />
              <span>VITAL v2.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}