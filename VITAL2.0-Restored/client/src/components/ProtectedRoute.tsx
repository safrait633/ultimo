import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-white animate-pulse" fill="currentColor" />
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando VITAL...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login will be handled by the route logic
    return null;
  }

  return <>{children}</>;
}