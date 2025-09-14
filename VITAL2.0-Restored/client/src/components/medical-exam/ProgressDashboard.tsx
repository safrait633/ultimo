import React from 'react';
import { Clock, Target, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ProgressDashboardProps {
  specialty: any;
  progress: number;
  currentSection: string | null;
  startTime: Date | null;
  speedMode: string;
  predictions?: any;
  totalSections?: number;
  completedSections?: number;
}

export default function ProgressDashboard({
  specialty,
  progress,
  currentSection,
  startTime,
  speedMode,
  predictions,
  totalSections = 7,
  completedSections = 0
}: ProgressDashboardProps) {
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000 / 60) : 0;
  const estimatedTotal = predictions?.estimatedTime || 30;
  const efficiency = elapsedTime > 0 ? Math.round((progress / elapsedTime) * 100) / 100 : 0;

  const speedModeConfig = {
    express: { label: 'Express', color: 'bg-red-500', target: 10 },
    lightning: { label: 'Lightning', color: 'bg-yellow-500', target: 15 },
    fast_track: { label: 'Fast-Track', color: 'bg-blue-500', target: 20 },
    comprehensive: { label: 'Comprehensive', color: 'bg-green-500', target: 45 }
  };

  const currentMode = speedModeConfig[speedMode as keyof typeof speedModeConfig] || speedModeConfig.fast_track;

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Progreso General */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="text-white text-base lg:text-lg flex items-center">
            <Target className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="hidden sm:inline">Progreso del Examen</span>
            <span className="sm:hidden">Progreso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 lg:p-6">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-300">Completado</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 lg:h-3" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{completedSections}/{totalSections} secc.</span>
              <span className="truncate max-w-20 sm:max-w-full">{currentSection || 'Sin sección'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiempo y Velocidad */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Tiempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Transcurrido</span>
              <span className="text-white font-mono">{elapsedTime}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Estimado total</span>
              <span className="text-white font-mono">{estimatedTotal}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Modo velocidad</span>
              <Badge className={`${currentMode.color} text-white`}>
                {currentMode.label}
              </Badge>
            </div>
            {efficiency > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Eficiencia</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{efficiency}%/min</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado Actual */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Estado Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Especialidad</span>
              <span className="text-white text-sm font-medium">
                {specialty?.name || 'No seleccionada'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Sección</span>
              <span className="text-white text-sm">
                {currentSection || 'Ninguna'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Estado</span>
              <div className="flex items-center space-x-1">
                {progress > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm">En progreso</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-yellow-400 text-sm">Esperando</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predicciones y Sugerencias */}
      {predictions && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Predicciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">
                Tiempo restante estimado: 
                <span className="text-white ml-1">{predictions.remainingTime || 'N/A'}</span>
              </div>
              <div className="text-gray-300">
                Siguiente sección sugerida: 
                <span className="text-blue-400 ml-1">{predictions.nextSection || 'N/A'}</span>
              </div>
              {predictions.suggestions && predictions.suggestions.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <div className="text-gray-300 mb-1">Sugerencias:</div>
                  <ul className="space-y-1">
                    {predictions.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                      <li key={index} className="text-xs text-blue-300 flex items-start">
                        <span className="mr-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}