import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import SpecialtySelector from '@/components/specialty/SpecialtySelector';
import { 
  History,
  Hand,
  Microscope,
  ClipboardCheck,
  Save,
  Copy,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MedicalField {
  id: string;
  name: string;
  type: 'checkbox' | 'text' | 'number' | 'select' | 'slider' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  validation?: string;
  dependsOn?: string[];
  mutuallyExclusive?: string[];
}

interface TemplateSection {
  id: string;
  name: string;
  icon: string;
  order: number;
  fields: MedicalField[];
  calculations?: CalculationRule[];
  triggers?: ConditionalTrigger[];
}

interface CalculationRule {
  id: string;
  name: string;
  formula: string;
  inputFields: string[];
  outputField: string;
  classification?: { ranges: Array<{ min: number; max: number; label: string; color: string }> };
}

interface ConditionalTrigger {
  id: string;
  condition: string;
  action: 'show' | 'hide' | 'require' | 'auto-select';
  targetFields: string[];
}

interface ConsultationTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  version: string;
}

const iconMapping: Record<string, React.ComponentType<{ className?: string }>> = {
  'HistoryIcon': History,
  'TouchAppIcon': Hand,
  'ScienceIcon': Microscope,
  'AssignmentTurnedInIcon': ClipboardCheck,
  'PainIcon': AlertCircle
};

export default function ConsultationPage() {
  const { user } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [template, setTemplate] = useState<ConsultationTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [calculations, setCalculations] = useState<Record<string, any>>({});
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'incomplete' | 'in_progress' | 'complete' | 'with_findings'>>({});
  const [currentSection, setCurrentSection] = useState<string>('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        autoSave();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [formData]);

  // Load template when specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      loadTemplate();
    }
  }, [selectedSpecialty]);

  const loadTemplate = async () => {
    try {
      const response = await fetch(`/api/specialties/${selectedSpecialty}/templates`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const selectedTemplate = data.data[0]; // Use first template for now
        setTemplate(selectedTemplate);
        setCurrentSection(selectedTemplate.sections[0]?.id || '');
        
        // Initialize section status
        const initialStatus: Record<string, 'incomplete' | 'in_progress' | 'complete' | 'with_findings'> = {};
        selectedTemplate.sections.forEach((section: TemplateSection) => {
          initialStatus[section.id] = 'incomplete';
        });
        setSectionStatus(initialStatus);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleFieldChange = (fieldId: string, value: any, field: MedicalField) => {
    const newFormData = { ...formData, [fieldId]: value };
    
    // Handle mutually exclusive fields
    if (field.mutuallyExclusive && value === true) {
      field.mutuallyExclusive.forEach(exclusiveFieldId => {
        if (newFormData[exclusiveFieldId] === true) {
          newFormData[exclusiveFieldId] = false;
        }
      });
    }
    
    setFormData(newFormData);
    updateSectionStatus(getCurrentSectionId(), newFormData);
    performCalculations(newFormData);
    handleConditionalLogic(fieldId, value, newFormData);
  };

  const handleConditionalLogic = (fieldId: string, value: any, currentFormData: Record<string, any>) => {
    if (!template) return;
    
    template.sections.forEach(section => {
      section.triggers?.forEach(trigger => {
        // Simple condition evaluation for demonstration
        if (trigger.condition.includes(fieldId)) {
          if (trigger.action === 'auto-select' && value === true) {
            trigger.targetFields.forEach(targetField => {
              if (!currentFormData[targetField]) {
                setFormData(prev => ({ ...prev, [targetField]: true }));
              }
            });
          }
        }
      });
    });
  };

  const performCalculations = (currentFormData: Record<string, any>) => {
    if (!template) return;
    
    const newCalculations = { ...calculations };
    
    template.sections.forEach(section => {
      section.calculations?.forEach(calc => {
        const hasAllInputs = calc.inputFields.every(field => 
          currentFormData[field] !== undefined && currentFormData[field] !== null && currentFormData[field] !== ''
        );
        
        if (hasAllInputs) {
          try {
            let result = 0;
            
            // Simple formula evaluation
            if (calc.id === 'pa_media') {
              const sistolica = parseFloat(currentFormData['presion_sistolica']);
              const diastolica = parseFloat(currentFormData['presion_diastolica']);
              result = (sistolica + 2 * diastolica) / 3;
            } else if (calc.id === 'imc') {
              const peso = parseFloat(currentFormData['peso']);
              const talla = parseFloat(currentFormData['talla']) / 100; // Convert cm to m
              result = peso / (talla * talla);
            }
            
            newCalculations[calc.outputField] = {
              value: result,
              classification: getClassification(result, calc.classification)
            };
          } catch (error) {
            console.error('Calculation error:', error);
          }
        }
      });
    });
    
    setCalculations(newCalculations);
  };

  const getClassification = (value: number, classification?: { ranges: Array<{ min: number; max: number; label: string; color: string }> }) => {
    if (!classification) return null;
    
    const range = classification.ranges.find(r => value >= r.min && value < r.max);
    return range || null;
  };

  const updateSectionStatus = (sectionId: string, currentFormData: Record<string, any>) => {
    if (!template) return;
    
    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const totalFields = section.fields.length;
    const requiredFields = section.fields.filter(f => f.required);
    const completedRequired = requiredFields.filter(f => 
      currentFormData[f.id] !== undefined && 
      currentFormData[f.id] !== null && 
      currentFormData[f.id] !== ''
    );
    const completedTotal = section.fields.filter(f => 
      currentFormData[f.id] !== undefined && 
      currentFormData[f.id] !== null && 
      currentFormData[f.id] !== ''
    );
    
    let status: 'incomplete' | 'in_progress' | 'complete' | 'with_findings' = 'incomplete';
    
    if (completedRequired.length === requiredFields.length) {
      status = 'complete';
    } else if (completedTotal.length > 0) {
      status = 'in_progress';
    }
    
    // Check for significant findings
    const hasFindings = section.fields.some(field => {
      const value = currentFormData[field.id];
      if (field.type === 'checkbox' && value === true && 
          !field.name.includes('sin_') && !field.name.includes('normal')) {
        return true;
      }
      return false;
    });
    
    if (hasFindings && status === 'complete') {
      status = 'with_findings';
    }
    
    setSectionStatus(prev => ({ ...prev, [sectionId]: status }));
  };

  const getCurrentSectionId = () => {
    return currentSection || template?.sections[0]?.id || '';
  };

  const getCurrentSection = () => {
    return template?.sections.find(s => s.id === currentSection);
  };

  const autoSave = async () => {
    if (!selectedSpecialty || !template || Object.keys(formData).length === 0) return;
    
    setIsAutoSaving(true);
    try {
      const saveData = {
        templateId: template.id,
        patientId: 'PATIENT_001', // This should come from patient selection
        doctorId: user?.id || 'unknown',
        formData,
        calculations,
        status: 'draft'
      };
      
      let response;
      if (consultationId) {
        // Update existing consultation
        response = await fetch(`/api/specialties/consultations/${consultationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
      } else {
        // Create new consultation
        response = await fetch(`/api/specialties/${selectedSpecialty}/consultations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
      }
      
      const result = await response.json();
      if (result.success) {
        if (result.data.consultationId && !consultationId) {
          setConsultationId(result.data.consultationId);
        }
        setLastSaved(new Date());
        
        // Store in localStorage as backup
        localStorage.setItem('consultation_draft', JSON.stringify({
          specialtyId: selectedSpecialty,
          templateId: template.id,
          formData,
          calculations,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const generateReport = () => {
    if (!template) return '';
    
    let report = `CONSULTA ${template.name.toUpperCase()}\n`;
    report += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n`;
    report += `Médico: ${user?.nombres || user?.email} ${user?.apellidos || ''}\n\n`;
    
    template.sections.forEach(section => {
      const sectionData = section.fields.filter(field => 
        formData[field.id] !== undefined && 
        formData[field.id] !== null && 
        formData[field.id] !== ''
      );
      
      if (sectionData.length > 0) {
        report += `${section.name.toUpperCase()}:\n`;
        sectionData.forEach(field => {
          const value = formData[field.id];
          if (field.type === 'checkbox' && value === true) {
            report += `• ${field.label}\n`;
          } else if (field.type !== 'checkbox' && value) {
            report += `• ${field.label}: ${value}${field.unit ? ` ${field.unit}` : ''}\n`;
          }
        });
        report += '\n';
      }
    });
    
    // Add calculations
    const calcEntries = Object.entries(calculations);
    if (calcEntries.length > 0) {
      report += 'CÁLCULOS AUTOMÁTICOS:\n';
      calcEntries.forEach(([key, calc]: [string, any]) => {
        if (calc.value !== undefined) {
          report += `• ${key}: ${calc.value.toFixed(2)}`;
          if (calc.classification) {
            report += ` (${calc.classification.label})`;
          }
          report += '\n';
        }
      });
    }
    
    return report;
  };

  const copyReport = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-[#238636]" />;
      case 'with_findings': return <AlertCircle className="w-4 h-4 text-[#FF6B6B]" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-[#FFE66D]" />;
      default: return <AlertCircle className="w-4 h-4 text-[#7D8590]" />;
    }
  };

  const renderField = (field: MedicalField) => {
    const value = formData[field.id];
    const isRequired = field.required;
    const isCompleted = value !== undefined && value !== null && value !== '';
    
    switch (field.type) {
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked, field)}
              data-testid={`checkbox-${field.id}`}
            />
            <label 
              htmlFor={field.id} 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
            <Select value={value || ''} onValueChange={(val) => handleFieldChange(field.id, val, field)}>
              <SelectTrigger data-testid={`select-${field.id}`}>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'slider':
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {field.label}: {value || field.min || 0}
              {field.unit && ` ${field.unit}`}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
            <Slider
              value={[value || field.min || 0]}
              onValueChange={(vals) => handleFieldChange(field.id, vals[0], field)}
              min={field.min || 0}
              max={field.max || 10}
              step={1}
              className="w-full"
              data-testid={`slider-${field.id}`}
            />
            <div className="flex justify-between text-xs text-[#7D8590]">
              <span>{field.min || 0}</span>
              <span>{field.max || 10}</span>
            </div>
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
            <Textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field)}
              placeholder={`Ingrese ${field.label.toLowerCase()}...`}
              rows={3}
              data-testid={`textarea-${field.id}`}
            />
          </div>
        );
        
      case 'number':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {field.unit && ` (${field.unit})`}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '', field)}
              min={field.min}
              max={field.max}
              placeholder={`${field.min || 0} - ${field.max || ''}`}
              data-testid={`number-${field.id}`}
            />
          </div>
        );
        
      default:
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {field.label}
              {isRequired && <span className="text-[#FF6B6B] ml-1">*</span>}
              {isCompleted && <CheckCircle className="w-3 h-3 text-[#238636] ml-2 inline" />}
            </label>
            <Input
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field)}
              placeholder={`Ingrese ${field.label.toLowerCase()}...`}
              data-testid={`text-${field.id}`}
            />
          </div>
        );
    }
  };

  if (!selectedSpecialty) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-[#E6EDF3] mb-4">
            Nueva Consulta Médica
          </h1>
          <p className="text-[#7D8590] mb-8">
            Selecciona una especialidad para comenzar la consulta
          </p>
          <div className="max-w-md mx-auto">
            <SpecialtySelector 
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
            />
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = getCurrentSection();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E6EDF3]">
            {template?.name || 'Consulta Médica'}
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <SpecialtySelector 
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
              className="max-w-xs"
            />
            {lastSaved && (
              <div className="flex items-center text-xs text-[#7D8590]">
                <Save className="w-3 h-3 mr-1" />
                Guardado: {lastSaved.toLocaleTimeString()}
              </div>
            )}
            {isAutoSaving && (
              <div className="flex items-center text-xs text-[#238636]">
                <Clock className="w-3 h-3 mr-1 animate-spin" />
                Guardando...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={copyReport}>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Reporte
          </Button>
          <Button size="sm" className="bg-[#238636] hover:bg-[#2ea043]">
            <FileText className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1C2128] border-[#374151]">
            <CardHeader>
              <CardTitle className="text-[#E6EDF3] text-sm">Secciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {template?.sections.map((section) => {
                const IconComponent = iconMapping[section.icon] || AlertCircle;
                const status = sectionStatus[section.id] || 'incomplete';
                const isActive = section.id === currentSection;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                      isActive 
                        ? "bg-[#238636]/20 border border-[#238636]/30" 
                        : "hover:bg-[#21262D]"
                    )}
                    data-testid={`section-${section.id}`}
                  >
                    <IconComponent className="w-4 h-4 text-[#7D8590]" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#E6EDF3]">
                        {section.name}
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Calculations Display */}
          {Object.keys(calculations).length > 0 && (
            <Card className="bg-[#1C2128] border-[#374151] mt-4">
              <CardHeader>
                <CardTitle className="text-[#E6EDF3] text-sm flex items-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  Cálculos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(calculations).map(([key, calc]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs text-[#7D8590] uppercase tracking-wide">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#E6EDF3]">
                        {calc.value?.toFixed(2)}
                      </span>
                      {calc.classification && (
                        <Badge 
                          style={{ backgroundColor: calc.classification.color }}
                          className="text-white text-xs"
                        >
                          {calc.classification.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2">
          {currentSectionData && (
            <Card className="bg-[#1C2128] border-[#374151]">
              <CardHeader>
                <CardTitle className="text-[#E6EDF3] flex items-center">
                  {(() => {
                    const IconComponent = iconMapping[currentSectionData.icon] || AlertCircle;
                    return <IconComponent className="w-5 h-5 mr-3" />;
                  })()}
                  {currentSectionData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentSectionData.fields.map((field) => (
                  <div key={field.id}>
                    {renderField(field)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1C2128] border-[#374151]">
            <CardHeader>
              <CardTitle className="text-[#E6EDF3] text-sm">Reporte en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0F1419] border border-[#374151] rounded-lg p-4">
                <pre className="text-xs text-[#E6EDF3] whitespace-pre-wrap font-mono leading-relaxed">
                  {generateReport() || 'Comience a llenar los campos para ver el reporte...'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}