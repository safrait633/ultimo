import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Heart, Users, Calendar, BarChart3, FileText, X, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Dashboard Médico",
      description: "Visualiza métricas clave de tu práctica médica",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Consultas Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">24</div>
                <p className="text-xs text-blue-600">+15% vs ayer</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Pacientes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">847</div>
                <p className="text-xs text-green-600">+32 este mes</p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Próximas Consultas</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-900">María González</p>
                  <p className="text-xs text-gray-500">Cardiología - Control rutinario</p>
                </div>
                <Badge variant="outline" className="text-xs">10:30 AM</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-900">Juan Pérez</p>
                  <p className="text-xs text-gray-500">Neurología - Seguimiento</p>
                </div>
                <Badge variant="outline" className="text-xs">11:15 AM</Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Gestión de Pacientes",
      description: "Busca y gestiona historiales médicos completos",
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Buscar paciente por nombre, ID o teléfono..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                defaultValue="María González"
              />
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      MG
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">María González López</h4>
                      <p className="text-sm text-blue-700">ID: 12345 • Edad: 45 años</p>
                      <p className="text-xs text-blue-600">Última consulta: 15 Ene 2025</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong className="text-blue-900">Teléfono:</strong> +34 666 123 456
                  </div>
                  <div>
                    <strong className="text-blue-900">Email:</strong> maria.g@email.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Consulta Médica",
      description: "Formularios inteligentes por especialidad",
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Nueva Consulta - Cardiología</h4>
              <Badge className="bg-red-100 text-red-800">
                <Heart className="w-3 h-3 mr-1" />
                Cardiología
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presión Sistólica</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  defaultValue="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presión Diastólica</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  defaultValue="80"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Cálculo Automático:</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                PA Media: 93 mmHg • Clasificación: Normal • Riesgo: Bajo
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas de la consulta</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none h-20"
                defaultValue="Paciente presenta valores normales de presión arterial. Continuar con tratamiento actual..."
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Reportes y Análisis",
      description: "Genera reportes automáticos y analiza tendencias",
      content: (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Reporte Médico Generado</h4>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="text-sm space-y-2">
                <div><strong>Paciente:</strong> María González López</div>
                <div><strong>Fecha:</strong> 17 Agosto 2025</div>
                <div><strong>Especialidad:</strong> Cardiología</div>
                <div><strong>Médico:</strong> Dr. Juan Pérez</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Hallazgos Principales:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Presión arterial: 120/80 mmHg (Normal)</li>
                <li>• Frecuencia cardíaca: 72 bpm (Normal)</li>
                <li>• ECG: Ritmo sinusal normal</li>
                <li>• Auscultación: Ruidos cardíacos normales</li>
              </ul>
              
              <h5 className="font-medium text-gray-900 mt-4 mb-2">Recomendaciones:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Continuar con medicación actual</li>
                <li>• Control en 3 meses</li>
                <li>• Mantener dieta baja en sodio</li>
                <li>• Ejercicio moderado 30 min/día</li>
              </ul>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="w-4 h-4 mr-1" />
                Exportar PDF
              </Button>
              <Button size="sm" variant="outline">
                Enviar por Email
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Ver Demo en Vivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#DC2626] rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span>Demo Interactivo de VITAL</span>
          </DialogTitle>
          <DialogDescription>
            Explora las características principales del sistema médico inteligente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center">
            {demoSteps.map((_, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < demoSteps.length - 1 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div 
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-[#10B981]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {demoSteps[currentStep].title}
              </h3>
              <p className="text-gray-600 mt-1">
                {demoSteps[currentStep].description}
              </p>
            </div>
            
            {demoSteps[currentStep].content}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Anterior</span>
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{currentStep + 1} de {demoSteps.length}</span>
            </div>

            {currentStep < demoSteps.length - 1 ? (
              <Button 
                onClick={nextStep}
                className="bg-[#10B981] hover:bg-[#059669] text-white flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center space-x-2"
              >
                <Heart className="w-4 h-4" fill="currentColor" />
                <span>Comenzar con VITAL</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}