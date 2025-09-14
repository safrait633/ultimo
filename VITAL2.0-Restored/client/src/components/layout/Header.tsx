import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  title: string;
  description?: string;
  onNewConsultation?: () => void;
}

export function Header({ title, description, onNewConsultation }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-1" data-testid="page-description">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          {onNewConsultation && (
            <Button 
              onClick={onNewConsultation}
              className="bg-medical-blue text-white hover:bg-blue-700"
              data-testid="button-new-consultation"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Consultation
            </Button>
          )}
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
