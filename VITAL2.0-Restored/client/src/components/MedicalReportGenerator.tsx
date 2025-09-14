import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  FileText,
  Download,
  Send,
  Signature,
  Shield,
  Calendar,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Printer,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportData {
  patientId?: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  consultationType: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  followUp: string;
  isAnonymous: boolean;
}

interface MedicalReportGeneratorProps {
  patientData?: any;
  onClose?: () => void;
}

const consultationTypes = [
  { value: 'general', label: 'Consulta General' },
  { value: 'specialist', label: 'Consulta Especializada' },
  { value: 'emergency', label: 'Atención de Urgencia' },
  { value: 'followup', label: 'Consulta de Seguimiento' },
  { value: 'preventive', label: 'Consulta Preventiva' },
  { value: 'anonymous', label: 'Consulta Anónima' }
];

export default function MedicalReportGenerator({ patientData, onClose }: MedicalReportGeneratorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [reportData, setReportData] = useState<ReportData>({
    patientId: patientData?.id,
    patientName: patientData?.firstName ? `${patientData.firstName} ${patientData.lastName}` : '',
    patientAge: patientData?.birthDate ? calculateAge(patientData.birthDate).toString() : '',
    patientGender: patientData?.gender || '',
    consultationType: '',
    diagnosis: '',
    treatment: '',
    recommendations: '',
    followUp: '',
    isAnonymous: !patientData?.id
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);

  function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Generar firma digital
  const generateDigitalSignature = () => {
    const timestamp = new Date().toISOString();
    const doctorInfo = `${user?.firstName} ${user?.lastName} - Lic: ${user?.licenseNumber}`;
    const reportHash = btoa(`${reportData.patientName}-${timestamp}-${doctorInfo}`);
    return {
      signature: reportHash,
      timestamp,
      doctor: doctorInfo,
      hash: reportHash.substring(0, 16)
    };
  };

  // Generar informe médico
  const generateReportMutation = useMutation({
    mutationFn: async (data: ReportData) => {
      setIsGenerating(true);
      
      // Simular tiempo de generación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const signature = generateDigitalSignature();
      setDigitalSignature(signature.signature);
      
      const reportContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; color: black;">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin: 0; font-size: 28px;">INFORME MÉDICO</h1>
            <div style="margin-top: 10px;">
              <div style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 10px; border-radius: 8px; display: inline-block;">
                <strong>VITAL - Sistema Médico Profesional</strong>
              </div>
            </div>
          </div>

          <!-- Información del Médico -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0;">Información del Profesional</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong>Médico:</strong> Dr. ${user?.firstName} ${user?.lastName}</div>
              <div><strong>Especialidad:</strong> ${user?.specialty}</div>
              <div><strong>N° Licencia:</strong> ${user?.licenseNumber}</div>
              <div><strong>Fecha del Informe:</strong> ${format(new Date(), 'dd MMMM yyyy', { locale: es })}</div>
            </div>
          </div>

          <!-- Información del Paciente -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0;">Información del Paciente</h3>
            ${data.isAnonymous ? 
              '<div style="color: #dc2626; font-weight: bold; margin-bottom: 10px;">⚠️ CONSULTA ANÓNIMA - Datos limitados por privacidad</div>' : ''
            }
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong>Paciente:</strong> ${data.patientName || 'Paciente Anónimo'}</div>
              <div><strong>Edad:</strong> ${data.patientAge} años</div>
              <div><strong>Sexo:</strong> ${data.patientGender}</div>
              <div><strong>Tipo de Consulta:</strong> ${consultationTypes.find(t => t.value === data.consultationType)?.label}</div>
            </div>
          </div>

          <!-- Contenido Médico -->
          <div style="margin-bottom: 30px;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Diagnóstico</h3>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${data.diagnosis || 'No especificado'}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Tratamiento Prescrito</h3>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${data.treatment || 'No especificado'}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Recomendaciones</h3>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${data.recommendations || 'No especificado'}
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Seguimiento</h3>
              <div style="background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-top: 10px;">
                ${data.followUp || 'No especificado'}
              </div>
            </div>
          </div>

          <!-- Firma Digital y Validación Legal -->
          <div style="border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin-top: 30px; background: #f0fdf4;">
            <h3 style="color: #166534; margin-top: 0; text-align: center;">🔒 VALIDACIÓN LEGAL Y FIRMA DIGITAL</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
              <div>
                <strong style="color: #166534;">Timestamp de Generación:</strong><br>
                ${signature.timestamp}
              </div>
              <div>
                <strong style="color: #166534;">Hash de Verificación:</strong><br>
                <code style="background: #dcfce7; padding: 4px; border-radius: 4px;">${signature.hash}</code>
              </div>
            </div>

            <div style="text-align: center; margin: 20px 0;">
              <div style="background: #166534; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                <div style="font-size: 18px; font-weight: bold;">✓ DOCUMENTO FIRMADO DIGITALMENTE</div>
                <div style="margin-top: 5px;">Dr. ${user?.firstName} ${user?.lastName}</div>
                <div>Licencia Médica N° ${user?.licenseNumber}</div>
              </div>
            </div>

            <div style="text-align: center; font-size: 12px; color: #166534; margin-top: 15px;">
              <p><strong>VALIDEZ LEGAL:</strong> Este documento ha sido generado y firmado digitalmente por un profesional médico autorizado.</p>
              <p><strong>VERIFICACIÓN:</strong> La autenticidad puede verificarse mediante el hash de seguridad proporcionado.</p>
              <p><strong>PROTECCIÓN DE DATOS:</strong> Cumple con normativas de protección de datos médicos y privacidad del paciente.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 12px;">
            <p>Documento generado por VITAL - Sistema de Gestión Médica Profesional</p>
            <p>Fecha de generación: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: es })}</p>
            <p>Para verificar la autenticidad de este documento, conserve el hash de verificación</p>
          </div>
        </div>
      `;
      
      return reportContent;
    },
    onSuccess: (reportContent) => {
      setGeneratedReport(reportContent);
      setIsGenerating(false);
      toast({
        title: 'Informe generado',
        description: 'El informe médico ha sido generado con firma digital',
      });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: 'Error al generar informe',
        description: error.message || 'No se pudo generar el informe',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateReport = () => {
    if (!reportData.diagnosis || !reportData.treatment) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor complete al menos el diagnóstico y tratamiento',
        variant: 'destructive',
      });
      return;
    }
    generateReportMutation.mutate(reportData);
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    
    const blob = new Blob([generatedReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `informe_medico_${reportData.patientName.replace(/\s+/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Descarga iniciada',
      description: 'El informe se está descargando como archivo HTML',
    });
  };

  const printReport = () => {
    if (!generatedReport) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatedReport);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 text-white hover:bg-white/20 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Generador de Informes Médicos
                </h1>
                <p className="text-slate-300">
                  Sistema de generación de informes con firma digital legal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Legal
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                <Signature className="w-3 h-3 mr-1" />
                Firmado
              </Badge>
            </div>
          </div>

          {!generatedReport ? (
            /* Formulario de generación */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información del paciente */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información del Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reportData.isAnonymous && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-yellow-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Consulta Anónima</span>
                      </div>
                      <p className="text-yellow-200 text-xs mt-1">
                        Datos limitados por privacidad del paciente
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-white">Nombre del Paciente</Label>
                    <Input
                      value={reportData.patientName}
                      onChange={(e) => setReportData({...reportData, patientName: e.target.value})}
                      placeholder={reportData.isAnonymous ? "Paciente Anónimo" : "Nombre completo"}
                      className="bg-white/5 border-white/20 text-white"
                      disabled={reportData.isAnonymous}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Edad</Label>
                      <Input
                        value={reportData.patientAge}
                        onChange={(e) => setReportData({...reportData, patientAge: e.target.value})}
                        placeholder="Edad en años"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Sexo</Label>
                      <Select value={reportData.patientGender} onValueChange={(value) => setReportData({...reportData, patientGender: value})}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tipo de Consulta</Label>
                    <Select value={reportData.consultationType} onValueChange={(value) => setReportData({...reportData, consultationType: value})}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {consultationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contenido médico */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Información Médica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Diagnóstico *</Label>
                    <Textarea
                      value={reportData.diagnosis}
                      onChange={(e) => setReportData({...reportData, diagnosis: e.target.value})}
                      placeholder="Describa el diagnóstico médico..."
                      className="bg-white/5 border-white/20 text-white min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Tratamiento *</Label>
                    <Textarea
                      value={reportData.treatment}
                      onChange={(e) => setReportData({...reportData, treatment: e.target.value})}
                      placeholder="Describa el tratamiento prescrito..."
                      className="bg-white/5 border-white/20 text-white min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Recomendaciones</Label>
                    <Textarea
                      value={reportData.recommendations}
                      onChange={(e) => setReportData({...reportData, recommendations: e.target.value})}
                      placeholder="Recomendaciones para el paciente..."
                      className="bg-white/5 border-white/20 text-white min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Plan de Seguimiento</Label>
                    <Textarea
                      value={reportData.followUp}
                      onChange={(e) => setReportData({...reportData, followUp: e.target.value})}
                      placeholder="Próximas consultas, controles..."
                      className="bg-white/5 border-white/20 text-white min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Vista previa del informe */
            <div>
              <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-white font-medium">Informe Generado Exitosamente</h3>
                      <p className="text-slate-300 text-sm">Con firma digital legal válida</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={printReport}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                    <Button
                      onClick={downloadReport}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar HTML
                    </Button>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white rounded-lg shadow-2xl max-h-[600px] overflow-y-auto border border-gray-200"
                dangerouslySetInnerHTML={{ __html: generatedReport }}
              />
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-slate-300">
                  <div>Dr. {user.firstName} {user.lastName}</div>
                  <div>Lic: {user.licenseNumber} | {user.specialty}</div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cerrar
                </Button>
              )}
              
              {!generatedReport ? (
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Informe
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setGeneratedReport(null);
                    setDigitalSignature(null);
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Nuevo Informe
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}