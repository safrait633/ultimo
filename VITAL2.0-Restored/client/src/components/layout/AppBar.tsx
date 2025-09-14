import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Menu, 
  ChevronRight, 
  Home,
  Bell,
  Globe,
  Moon,
  Sun,
  Settings,
  LogOut,
  User,
  Stethoscope
} from "lucide-react";
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AppBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

// Detect if running in Replit environment
const isReplitEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return (
    hostname.includes('.repl.co') ||
    hostname.includes('.replit.dev') ||
    hostname.includes('.replit.com') ||
    !!import.meta.env.VITE_REPL_SLUG ||
    !!import.meta.env.REPL_SLUG
  );
};

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }];
  
  const pathMap: Record<string, string> = {
    'patients': 'Pacientes',
    'consultations': 'Consultas',
    'specialties': 'Especialidades',
    'reports': 'Reportes',
    'admin': 'Administración',
    'profile': 'Perfil',
    'settings': 'Configuración'
  };

  segments.forEach((segment, index) => {
    const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const href = '/' + segments.slice(0, index + 1).join('/');
    breadcrumbs.push({ label, href });
  });

  return breadcrumbs;
};

export function AppBar({ onMenuClick, sidebarCollapsed }: AppBarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [notifications] = useState(3); // Mock notification count

  const breadcrumbs = getBreadcrumbs(location);
  const isReplit = isReplitEnvironment();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // TODO: Implement theme switching logic
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <header className="h-16 bg-[#0D1117] border-b border-[#21262D] flex items-center px-4 z-30 sticky top-0">
      {/* Left Section - Menu + Logo + Replit Badge */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="p-2 hover:bg-[#21262D]"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-3">
          {/* Medical Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#E6EDF3] hidden sm:block">
              MedSystem
            </span>
          </div>

          {/* Replit Badge */}
          {isReplit && (
            <Badge 
              variant="outline" 
              className="bg-[#238636]/10 border-[#238636]/30 text-[#238636] text-xs"
            >
              Powered by Replit
            </Badge>
          )}
        </div>
      </div>

      {/* Center Section - Breadcrumbs */}
      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-2 text-sm text-[#7D8590]">
          {breadcrumbs.map((crumb, index) => (
            <div key={`${crumb.href}-${index}`} className="flex items-center">
              <button
                onClick={() => setLocation(crumb.href)}
                className={cn(
                  "hover:text-[#E6EDF3] transition-colors",
                  index === breadcrumbs.length - 1 
                    ? "text-[#E6EDF3] font-medium" 
                    : "text-[#7D8590]"
                )}
              >
                {crumb.label}
              </button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Section - Actions + User */}
      <div className="flex items-center space-x-3">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-[#21262D]">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1C2128] border-[#374151]">
            <DropdownMenuItem className="hover:bg-[#21262D]">
              ☿ Español
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#21262D]">
              ♀ English
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#21262D]">
              ☿ Français
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme}
          className="p-2 hover:bg-[#21262D]"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-[#21262D]">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#da3633] text-white text-xs"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 hover:bg-[#21262D] rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={undefined} alt={user?.firstName} />
                <AvatarFallback className="bg-[#238636] text-white text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1C2128] border-[#374151]">
            <div className="px-3 py-2 text-sm">
              <div className="font-medium text-[#E6EDF3]">
                Dr. {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[#7D8590] text-xs">
                {user?.specialty}
              </div>
              <div className="text-[#7D8590] text-xs">
                {user?.email}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#374151]" />
            <DropdownMenuItem 
              onClick={() => setLocation('/profile')}
              className="hover:bg-[#21262D]"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLocation('/settings')}
              className="hover:bg-[#21262D]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#374151]" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-[#21262D] text-[#da3633]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}