import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle,
  Calculator,
  TrendingUp,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";

// 🎯 INTERFACES PARA EL DASHBOARD MÉDICO
interface MedicalAlert {
  id: string;
  type: 'critical' | 'urgent' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface MedicalScale {
  name: string;
  score: number | string;
  interpretation: string;
  riskLevel: 'low' | 'intermediate' | 'high' | 'critical';
  recommendations: string[];
}

interface MedicalDashboardProps {
  alerts?: MedicalAlert[];
  medicalScales?: MedicalScale[];
  progressPercentage?: number;
  onComplete?: () => void;
  specialty?: string;
  progressSections?: {
    [key: string]: boolean;
  };
}

const MedicalDashboard: React.FC<MedicalDashboardProps> = ({
  alerts = [],
  medicalScales = [],
  progressPercentage = 0,
  onComplete,
  specialty = "Examen Médico",
  progressSections = {}
}) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  
  // Filtros para alertas y escalas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || alert.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredScales = medicalScales.filter(scale => 
    scale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scale.interpretation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="w-80 space-y-4">
      
      {/* 🔍 BUSCADOR CON GLASSMORPHISM */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar alertas, escalas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterType === 'all' 
                    ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30' 
                    : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('critical')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterType === 'critical' 
                    ? 'bg-red-500/30 text-red-200 border border-red-400/30' 
                    : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                }`}
              >
                Críticas
              </button>
              <button
                onClick={() => setFilterType('urgent')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterType === 'urgent' 
                    ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30' 
                    : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                }`}
              >
                Urgentes
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Alertas Activas con Glassmorphism */}
      {filteredAlerts.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Alertas Activas
              {criticalAlerts.length > 0 && (
                <Badge className="bg-red-500/30 text-red-200 border border-red-400/30 text-xs ml-1">
                  {criticalAlerts.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredAlerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className={`rounded-xl backdrop-blur-sm ${
                alert.type === 'critical' ? 'border-red-400/50 bg-red-500/20' :
                alert.type === 'urgent' ? 'border-yellow-400/50 bg-yellow-500/20' :
                alert.type === 'warning' ? 'border-orange-400/50 bg-orange-500/20' :
                'border-blue-400/50 bg-blue-500/20'
              }`}>
                <AlertDescription className={`text-xs ${
                  alert.type === 'critical' ? 'text-red-200' :
                  alert.type === 'urgent' ? 'text-yellow-200' : 
                  alert.type === 'warning' ? 'text-orange-200' : 'text-blue-200'
                }`}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
            {filteredAlerts.length > 5 && (
              <div className="text-center text-blue-200 text-xs bg-white/10 rounded-xl p-2 backdrop-blur-sm">
                +{filteredAlerts.length - 5} alertas más
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Panel de Escalas Médicas con Glassmorphism */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Calculator className="h-4 w-4 text-purple-400" />
            Escalas Médicas
            {medicalScales.length > 0 && (
              <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs ml-1">
                {filteredScales.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredScales.map((scale, index) => (
            <div key={index} className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-medium">{scale.name}</span>
                <Badge className={`text-xs backdrop-blur-sm ${
                  scale.riskLevel === 'critical' ? 'bg-red-500/30 text-red-200 border-red-400/30' :
                  scale.riskLevel === 'high' ? 'bg-orange-500/30 text-orange-200 border-orange-400/30' :
                  scale.riskLevel === 'intermediate' ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/30' :
                  'bg-green-500/30 text-green-200 border-green-400/30'
                }`}>
                  {scale.score}
                </Badge>
              </div>
              <p className="text-blue-200 text-xs mb-2">{scale.interpretation}</p>
              {(scale.recommendations || []).length > 0 && (
                <ul className="space-y-1">
                  {(scale.recommendations || []).slice(0, 2).map((rec, i) => (
                    <li key={i} className="text-blue-200/80 text-xs flex items-start gap-1">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                  {(scale.recommendations || []).length > 2 && (
                  <li className="text-blue-200/60 text-xs bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                    +{(scale.recommendations || []).length - 2} recomendaciones más
                  </li>
                )}
                </ul>
              )}
            </div>
          ))}
          
          {filteredScales.length === 0 && (medicalScales || []).length === 0 && (
            <div className="text-center py-6">
              <Calculator className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-200 text-xs">Escalas aparecerán aquí conforme completes el examen</p>
            </div>
          )}

          {filteredScales.length === 0 && (medicalScales || []).length > 0 && (
            <div className="text-center py-4">
              <p className="text-blue-200 text-xs bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                No se encontraron escalas con "{searchTerm}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de Progreso con Glassmorphism */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            Progreso del Examen
            <div className="ml-auto">
              <Badge className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs">
                {progressPercentage}%
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-xs">Completado</span>
              <span className="text-white text-sm font-bold">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/20 rounded-xl" />
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(progressSections || {}).map(([section, completed]) => (
                <div key={section} className={`flex items-center justify-between p-2 rounded-lg backdrop-blur-sm ${
                  completed ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/10 border border-white/20'
                }`}>
                  <span className={`capitalize ${completed ? 'text-green-200' : 'text-blue-200/60'}`}>
                    {section}
                  </span>
                  <span className={completed ? 'text-green-300' : 'text-white/40'}>
                    {completed ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>

            {/* Estadísticas adicionales */}
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-white">{Object.values(progressSections || {}).filter(Boolean).length}</div>
                  <div className="text-xs text-blue-200">Secciones</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{(alerts || []).length}</div>
                  <div className="text-xs text-blue-200">Alertas</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{(medicalScales || []).length}</div>
                  <div className="text-xs text-blue-200">Escalas</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de acción principal con Glassmorphism */}
      <Button 
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-700/90 backdrop-blur-xl border border-white/20 text-white font-bold py-4 shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl"
        size="lg"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Finalizar {specialty}
      </Button>
    </div>
  );
};

export default MedicalDashboard;