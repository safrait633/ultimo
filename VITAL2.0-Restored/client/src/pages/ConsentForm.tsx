import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Check, X, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface ConsentFormProps {
  patientData: {
    id: string;
    name?: string;
    age: number;
    gender: string;
    isAnonymous: boolean;
  };
  onConsentComplete: () => void;
}

export default function ConsentForm({ patientData, onConsentComplete }: ConsentFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [consents, setConsents] = useState({
    dataProcessing: false,
    medicalTreatment: false,
    dataSharing: false,
    photography: false,
    research: false
  });
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const allConsentsChecked = Object.values(consents).every(consent => consent);
  const hasSignature = signature.length > 0;

  // Firma digital
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#10B981';
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignature('');
  };

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/generate-consent-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientData,
          consents,
          signature,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error generando PDF');

      // El servidor está enviando HTML listo para imprimir
      const htmlContent = await response.text();
      
      // Crear nueva ventana con el documento para imprimir
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: 'Ventana bloqueada',
          description: 'Por favor, permite ventanas emergentes para descargar el PDF',
          variant: 'destructive',
        });
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // La ventana se auto-imprimirá según el JavaScript incluido en el HTML

      toast({
        title: 'Documento generado exitosamente',
        description: 'Se abrió una nueva ventana. Use Ctrl+P para guardar como PDF',
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error al generar documento',
        description: 'No se pudo crear el documento de consentimiento',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!allConsentsChecked) {
      toast({
        title: 'Formulario incompleto',
        description: 'Debe aceptar los consentimientos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    // Solo generar PDF y proceder al examen - el paciente YA está registrado
    await generatePDF();
    
    toast({
      title: 'Consentimiento confirmado',
      description: 'Procedera al examen físico',
    });
    
    // Directamente proceder al examen físico
    onConsentComplete();
  };

  const consentItems = [
    {
      key: 'dataProcessing',
      title: 'Procesamiento de Datos Personales',
      description: 'Acepto el procesamiento de mis datos personales para fines médicos según la Ley de Protección de Datos.'
    },
    {
      key: 'medicalTreatment',
      title: 'Consentimiento para Tratamiento Médico',
      description: 'Autorizo la realización del examen médico y los procedimientos diagnósticos necesarios.'
    },
    {
      key: 'dataSharing',
      title: 'Compartir Información Médica',
      description: 'Acepto que mi información médica pueda ser compartida con otros profesionales de la salud si es necesario.'
    },
    {
      key: 'photography',
      title: 'Fotografías Médicas (Opcional)',
      description: 'Autorizo la toma de fotografías con fines médicos y educativos, manteniendo la confidencialidad.'
    },
    {
      key: 'research',
      title: 'Participación en Investigación (Opcional)',
      description: 'Acepto que mis datos puedan ser utilizados para investigación médica de forma anónima.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader className="text-center border-b border-white/20">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Formulario de Consentimiento Informado
              </CardTitle>
              <p className="text-white/80 mt-2">
                {patientData.isAnonymous 
                  ? `Paciente Anónimo - ${patientData.age} años - ${patientData.gender}`
                  : `${patientData.name} - ${patientData.age} años - ${patientData.gender}`
                }
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Información Legal */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold text-lg mb-2 text-emerald-400">Información Importante</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Este documento establece su consentimiento para el tratamiento médico. 
                  Por favor, lea cuidadosamente cada sección y marque las casillas para 
                  confirmar su acuerdo. Su información será manejada con la máxima 
                  confidencialidad según las normativas vigentes de protección de datos.
                </p>
              </div>

              {/* Consentimientos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white mb-4">Consentimientos Requeridos</h3>
                {consentItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={item.key}
                        checked={consents[item.key as keyof typeof consents]}
                        onCheckedChange={(checked) => 
                          setConsents(prev => ({ ...prev, [item.key]: checked === true }))
                        }
                        className="mt-1 border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <div className="flex-1">
                        <label htmlFor={item.key} className="font-medium text-white cursor-pointer">
                          {item.title}
                        </label>
                        <p className="text-white/70 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Área de Firma */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-white flex items-center">
                    <Pen className="w-5 h-5 mr-2 text-emerald-400" />
                    Firma (Opcional)
                  </h3>
                  <Button
                    onClick={clearSignature}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                </div>
                
                <p className="text-white/70 text-sm mb-3">
                  Puede firmar digitalmente aquí o firmar en papel durante la consulta médica.
                </p>
                
                <div className="bg-white rounded-lg p-2">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full border border-gray-300 rounded cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Firme en el área blanca usando el ratón o touchpad
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/20">
                <Button
                  onClick={generatePDF}
                  disabled={!allConsentsChecked || !hasSignature}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!allConsentsChecked || !hasSignature}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar y Proceder al Examen
                </Button>
              </div>

              {/* Indicador de Estado */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Progreso del formulario:</span>
                  <div className="flex items-center space-x-4">
                    <span className={`flex items-center ${allConsentsChecked ? 'text-emerald-400' : 'text-white/60'}`}>
                      <Check className="w-4 h-4 mr-1" />
                      Consentimientos
                    </span>
                    <span className={`flex items-center ${hasSignature ? 'text-emerald-400' : 'text-white/60'}`}>
                      <Pen className="w-4 h-4 mr-1" />
                      Firma
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}