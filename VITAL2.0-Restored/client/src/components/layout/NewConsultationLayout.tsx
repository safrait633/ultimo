import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { AppBar } from "./AppBar";
import { ConsultationSidebar } from "./ConsultationSidebar";

interface NewConsultationLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  consultationData?: {
    code?: string;
    specialty?: string;
    age?: string;
    gender?: string;
    patientName?: string;
  };
}

export function NewConsultationLayout({ children, activeSection, onSectionChange, consultationData }: NewConsultationLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* AppBar */}
      <AppBar 
        onMenuClick={() => {
          if (window.innerWidth < 768) {
            setMobileMenuOpen(!mobileMenuOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Solo Consultation Sidebar - Sin navegación principal */}
        <ConsultationSidebar 
          collapsed={sidebarCollapsed}
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeSection={activeSection || 'vital-signs'}
          onSectionChange={onSectionChange || (() => {})}
          consultationData={consultationData}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}