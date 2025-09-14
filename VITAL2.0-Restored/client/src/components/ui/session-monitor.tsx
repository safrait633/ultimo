import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, Shield, AlertTriangle, RefreshCw } from 'lucide-react';

interface SessionMonitorProps {
  warningThreshold?: number; // minutes before expiry to show warning
  criticalThreshold?: number; // minutes before expiry to show critical warning
}

export function SessionMonitor({ 
  warningThreshold = 5, 
  criticalThreshold = 1 
}: SessionMonitorProps) {
  const { 
    timeUntilExpiry, 
    sessionExpiresAt, 
    refreshSession, 
    logout,
    isSessionValid 
  } = useAuth();
  
  const [showWarning, setShowWarning] = useState(false);
  const [showCritical, setShowCritical] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Handle session refresh
  const handleRefreshSession = async () => {
    try {
      setIsRefreshing(true);
      await refreshSession();
      setShowWarning(false);
      setShowCritical(false);
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setShowWarning(false);
    setShowCritical(false);
  };

  // Monitor session status
  useEffect(() => {
    if (!timeUntilExpiry || !isSessionValid) {
      setShowWarning(false);
      setShowCritical(false);
      return;
    }

    const minutesRemaining = timeUntilExpiry / 60000;

    // Show critical warning
    if (minutesRemaining <= criticalThreshold && minutesRemaining > 0) {
      setShowCritical(true);
      setShowWarning(false);
    }
    // Show warning
    else if (minutesRemaining <= warningThreshold && minutesRemaining > criticalThreshold) {
      setShowWarning(true);
      setShowCritical(false);
    }
    // Hide warnings
    else {
      setShowWarning(false);
      setShowCritical(false);
    }
  }, [timeUntilExpiry, warningThreshold, criticalThreshold, isSessionValid]);

  // Session warning dialog
  if (showWarning && timeUntilExpiry) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className="bg-[#1C2128] border-[#30363d] text-[#E6EDF3]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-[#f79000]">
              <Clock className="w-5 h-5" />
              <span>Sesión próxima a expirar</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#7D8590]">
              Su sesión médica expirará en{' '}
              <span className="font-semibold text-[#f79000]">
                {formatTimeRemaining(timeUntilExpiry)}
              </span>
              . ¿Desea renovar la sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-[#30363d] text-[#7D8590] hover:bg-[#30363d]"
              data-testid="button-logout-session"
            >
              Cerrar Sesión
            </Button>
            <AlertDialogAction
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="bg-[#238636] hover:bg-[#2ea043] text-white"
              data-testid="button-refresh-session"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Renovando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Renovar Sesión
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Critical session warning dialog
  if (showCritical && timeUntilExpiry) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className="bg-[#1C2128] border-[#da3633] text-[#E6EDF3]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-[#da3633]">
              <AlertTriangle className="w-5 h-5" />
              <span>Sesión expirando</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#7D8590]">
              ¡ATENCIÓN! Su sesión médica expirará en{' '}
              <span className="font-bold text-[#da3633]">
                {formatTimeRemaining(timeUntilExpiry)}
              </span>
              . Debe renovar ahora para evitar perder el acceso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-[#da3633] text-[#da3633] hover:bg-[#da3633]/10"
              data-testid="button-logout-critical"
            >
              Cerrar Sesión
            </Button>
            <AlertDialogAction
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="bg-[#da3633] hover:bg-[#f85149] text-white"
              data-testid="button-refresh-critical"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Renovando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Renovar Ahora
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
}

// Session status indicator component
export function SessionStatusIndicator() {
  const { 
    isSessionValid, 
    timeUntilExpiry, 
    sessionExpiresAt 
  } = useAuth();

  if (!isSessionValid || !timeUntilExpiry || !sessionExpiresAt) {
    return null;
  }

  const minutesRemaining = Math.floor(timeUntilExpiry / 60000);
  const isWarning = minutesRemaining <= 5;
  const isCritical = minutesRemaining <= 1;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
      isCritical 
        ? 'bg-[#da3633]/10 text-[#da3633] border border-[#da3633]/20' 
        : isWarning 
        ? 'bg-[#f79000]/10 text-[#f79000] border border-[#f79000]/20'
        : 'bg-[#238636]/10 text-[#238636] border border-[#238636]/20'
    }`}>
      <Shield className="w-3 h-3" />
      <span>
        Sesión: {minutesRemaining}m
      </span>
    </div>
  );
}