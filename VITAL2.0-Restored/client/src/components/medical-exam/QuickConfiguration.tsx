import React, { useState } from 'react';
import { Settings, Zap, Mic, Smartphone, Type, Eye, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface QuickConfigurationProps {
  configuration: {
    speedMode: string;
    voiceRecognition: boolean;
    mobileGestures: boolean;
    autoComplete: boolean;
    realTimeValidation: boolean;
  };
  onChange: (config: any) => void;
  operationMode: string;
  onModeChange: (mode: string) => void;
}

export default function QuickConfiguration({
  configuration,
  onChange,
  operationMode,
  onModeChange
}: QuickConfigurationProps) {
  const [showConfig, setShowConfig] = useState(false);

  const speedModes = [
    { value: 'express', label: 'Express', description: '< 10 min', color: 'bg-red-500' },
    { value: 'lightning', label: 'Lightning', description: '< 15 min', color: 'bg-yellow-500' },
    { value: 'fast_track', label: 'Fast-Track', description: '< 20 min', color: 'bg-blue-500' },
    { value: 'comprehensive', label: 'Comprehensive', description: '< 45 min', color: 'bg-green-500' }
  ];

  const operationModes = [
    { value: 'demonstration', label: 'Demostración', icon: Eye, description: 'Testing sin guardar datos' },
    { value: 'practice', label: 'Práctica', icon: User, description: 'Entrenamiento médico' },
    { value: 'production', label: 'Producción', icon: Zap, description: 'Consultas reales' }
  ];

  const updateConfig = (key: string, value: any) => {
    onChange({
      ...configuration,
      [key]: value
    });
  };

  const currentSpeedMode = speedModes.find(mode => mode.value === configuration.speedMode) || speedModes[2];
  const currentOperationMode = operationModes.find(mode => mode.value === operationMode) || operationModes[0];

  return (
    <div className="relative">
      {/* Botón principal de configuración - Responsive */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Modo de operación actual - Hidden en móvil muy pequeño */}
        <Badge variant="outline" className="bg-white/10 border-white/20 text-white hidden sm:flex">
          {React.createElement(currentOperationMode.icon, { className: "w-3 h-3 mr-1" })}
          <span className="hidden lg:inline">{currentOperationMode.label}</span>
        </Badge>

        {/* Modo de velocidad actual */}
        <Badge className={`${currentSpeedMode.color} text-white text-xs sm:text-sm`}>
          <Zap className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">{currentSpeedMode.label}</span>
          <span className="sm:hidden">{currentSpeedMode.label.charAt(0)}</span>
        </Badge>

        {/* Botón de configuración */}
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-auto"
          onClick={() => setShowConfig(!showConfig)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Panel de configuración - Responsive */}
      {showConfig && (
        <>
          <Card className="absolute top-full right-0 mt-2 w-80 sm:w-96 z-50 bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuración Rápida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Modo de Operación */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Modo de Operación
                </label>
                <Select value={operationMode} onValueChange={onModeChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {operationModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value} className="text-white">
                        <div className="flex items-center space-x-2">
                          {React.createElement(mode.icon, { className: "w-4 h-4" })}
                          <span>{mode.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  {currentOperationMode.description}
                </p>
              </div>

              {/* Modo de Velocidad */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Modo de Velocidad
                </label>
                <Select 
                  value={configuration.speedMode} 
                  onValueChange={(value) => updateConfig('speedMode', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {speedModes.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value} className="text-white">
                        <div className="flex items-center justify-between w-full">
                          <span>{mode.label}</span>
                          <Badge className={`${mode.color} text-white text-xs ml-2`}>
                            {mode.description}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Características Avanzadas */}
              <div className="space-y-3">
                <h4 className="text-white text-sm font-medium">Características</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Reconocimiento de voz</span>
                  </div>
                  <Switch
                    checked={configuration.voiceRecognition}
                    onCheckedChange={(checked) => updateConfig('voiceRecognition', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Gestos móviles</span>
                  </div>
                  <Switch
                    checked={configuration.mobileGestures}
                    onCheckedChange={(checked) => updateConfig('mobileGestures', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Autocompletado</span>
                  </div>
                  <Switch
                    checked={configuration.autoComplete}
                    onCheckedChange={(checked) => updateConfig('autoComplete', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-white text-sm">Validación en tiempo real</span>
                  </div>
                  <Switch
                    checked={configuration.realTimeValidation}
                    onCheckedChange={(checked) => updateConfig('realTimeValidation', checked)}
                  />
                </div>
              </div>

              {/* Ayuda */}
              <div className="pt-3 border-t border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-700"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ver guía de configuración
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overlay para cerrar */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowConfig(false)}
          />
        </>
      )}
    </div>
  );
}