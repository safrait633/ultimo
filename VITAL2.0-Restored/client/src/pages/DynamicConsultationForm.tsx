import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ChevronLeft, Save, Heart, Stethoscope, Activity, Calculator, AlertCircle, Volume2, Droplets, Zap, BarChart3, FileText } from "lucide-react";

// Interfaces para el sistema dinámico
interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string;
  validation?: string;
  calculation?: string;
  unit?: string;
  order: number;
  isRequired: boolean;
  isCalculated: boolean;
  conditions?: string;
  helpText?: string;
}

interface FormSection {
  id: string;
  name: string;
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
  conditions?: string;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  specialty: string;
  description?: string;
  isActive: boolean;
  sections: FormSection[];
}

interface Specialty {
  id: string;
  name: string;
  description?: string;
}

interface DynamicSidebar {
  specialty: string;
  sections: Array<{
    name: string;
    title: string;
    icon: React.ComponentType;
    items: Array<{
      name: string;
      label: string;
      type: string;
    }>;
  }>;
}

// Función para obtener el icono según el tipo de sección
const getSectionIcon = (sectionName: string) => {
  switch (sectionName) {
    case 'antecedentes':
    case 'anamnesis':
      return Heart;
    case 'signos_vitales':
    case 'vitales':
      return Activity;
    case 'examen_fisico':
    case 'exploracion_cardiaca':
    case 'exploracion':
      return Stethoscope;
    case 'auscultacion':
      return Volume2;
    case 'circulacion':
      return Droplets;
    case 'vascular':
      return Zap;
    case 'ecg':
      return BarChart3;
    case 'escalas_riesgo':
    case 'calculos_riesgo':
    case 'calculos':
    case 'scores':
      return Calculator;
    default:
      return FileText;
  }
};

export function DynamicConsultationForm() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados para el formulario dinámico
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [calculatedFields, setCalculatedFields] = useState<Record<string, any>>({});

  // Datos básicos de la consulta
  const [basicData, setBasicData] = useState({
    age: "",
    gender: "",
    reason: ""
  });

  // Query para obtener especialidades desde la base de datos
  const { data: specialties, isLoading: loadingSpecialties, error: specialtiesError } = useQuery({
    queryKey: ["/api/specialties"],
    queryFn: async () => {
      console.log('Fetching specialties...');
      const response = await fetch("/api/specialties", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Specialties data:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000
  });

  // Query para obtener templates por especialidad
  const { data: templates, isLoading: loadingTemplates, error: templatesError } = useQuery({
    queryKey: ["/api/form-templates/specialty", selectedSpecialty],
    queryFn: async () => {
      if (!selectedSpecialty) return [];
      console.log(`Fetching templates for specialty: ${selectedSpecialty}`);
      const response = await fetch(`/api/form-templates/specialty/${selectedSpecialty}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(`Templates for ${selectedSpecialty}:`, data);
      return data;
    },
    enabled: !!selectedSpecialty
  });

  // Query para obtener formulario completo cuando se selecciona template
  const { data: completeForm, isLoading: loadingForm } = useQuery({
    queryKey: ["/api/forms/complete", selectedTemplate?.id],
    queryFn: async () => {
      if (!selectedTemplate?.id) return null;
      console.log(`Fetching complete form for template: ${selectedTemplate.id}`);
      
      // Get template
      const template = selectedTemplate;
      
      // Get sections
      const token = localStorage.getItem('medical_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const sectionsResponse = await fetch(`/api/form-sections/${selectedTemplate.id}`, { headers });
      if (!sectionsResponse.ok) throw new Error(`Error loading sections: ${sectionsResponse.status}`);
      const sections = await sectionsResponse.json();
      
      // Get fields for each section
      const sectionsWithFields = await Promise.all(
        sections.map(async (section: any) => {
          const fieldsResponse = await fetch(`/api/form-fields/${section.id}`, { headers });
          if (!fieldsResponse.ok) throw new Error(`Error loading fields for section ${section.id}`);
          const fields = await fieldsResponse.json();
          return {
            ...section,
            fields: fields.sort((a: any, b: any) => a.order - b.order)
          };
        })
      );

      // Sort sections by order
      sectionsWithFields.sort((a: any, b: any) => a.order - b.order);

      const completeForm = {
        ...template,
        sections: sectionsWithFields
      };

      console.log(`Complete form loaded:`, completeForm);
      return completeForm;
    },
    enabled: !!selectedTemplate?.id
  });

  // Mutation para crear consulta
  const createConsultationMutation = useMutation({
    mutationFn: async (consultationData: any) => {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(consultationData)
      });
      if (!response.ok) throw new Error("Failed to create consultation");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Consulta creada exitosamente",
        description: `Consulta ${data.code} guardada correctamente`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error al crear consulta",
        description: "No se pudo guardar la consulta",
        variant: "destructive"
      });
      console.error("Error creating consultation:", error);
    }
  });

  // Mutation para guardar respuestas del formulario
  const saveResponsesMutation = useMutation({
    mutationFn: async (responseData: any) => {
      const response = await fetch("/api/consultation-responses/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(responseData)
      });
      if (!response.ok) throw new Error("Failed to save responses");
      return response.json();
    }
  });

  // Efecto para limpiar template seleccionado cuando cambia la especialidad
  useEffect(() => {
    if (templates && Array.isArray(templates) && templates.length > 0) {
      // Limpiar selección para que el usuario elija manualmente
      setSelectedTemplate(null);
      console.log(`Templates available for ${selectedSpecialty}:`, templates.length);
    }
  }, [templates, selectedSpecialty]);

  // Función para manejar selección manual de plantilla
  const handleTemplateSelect = (template: FormTemplate) => {
    console.log('Manually selected template:', template.name);
    setSelectedTemplate(template);
  };

  // Efecto para actualizar template cuando se completa la carga del formulario
  useEffect(() => {
    if (completeForm && completeForm.sections && completeForm.sections.length > 0) {
      console.log('Setting complete form with sections:', completeForm.sections.length);
      setSelectedTemplate(completeForm);
    }
  }, [completeForm]);

  // Efecto para cargar el formulario completo
  useEffect(() => {
    if (completeForm && typeof completeForm === 'object') {
      setSelectedTemplate(completeForm as FormTemplate);
      // Inicializar formData con valores por defecto
      const initialData: Record<string, any> = {};
      if ((completeForm as FormTemplate).sections) {
        (completeForm as FormTemplate).sections.forEach((section: FormSection) => {
          section.fields?.forEach((field: FormField) => {
            if (field.defaultValue) {
              initialData[field.name] = field.defaultValue;
            }
          });
        });
      }
      setFormData(initialData);
    }
  }, [completeForm]);

  // Función para manejar cambios en campos del formulario
  const handleFieldChange = (fieldName: string, value: any, field: FormField) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    // Procesar cálculos automáticos
    if (selectedTemplate) {
      const newCalculatedFields = { ...calculatedFields };
      
      selectedTemplate.sections.forEach(section => {
        section.fields.forEach(calcField => {
          if (calcField.isCalculated && calcField.calculation) {
            try {
              const calculation = JSON.parse(calcField.calculation);
              const calculatedValue = performCalculation(calculation, newFormData);
              if (calculatedValue !== undefined) {
                newCalculatedFields[calcField.name] = calculatedValue;
                newFormData[calcField.name] = calculatedValue;
              }
            } catch (error) {
              console.error("Error in calculation:", error);
            }
          }
        });
      });
      
      setCalculatedFields(newCalculatedFields);
      setFormData(newFormData);
    }
  };

  // Función para realizar cálculos automáticos
  const performCalculation = (calculation: any, data: Record<string, any>): any => {
    try {
      if (calculation.formula === "presion_sistolica - presion_diastolica") {
        const sistolica = parseFloat(data.presion_sistolica) || 0;
        const diastolica = parseFloat(data.presion_diastolica) || 0;
        return sistolica - diastolica;
      }
      
      // Aquí puedes agregar más cálculos específicos según las necesidades
      if (calculation.formula === "calculateCHA2DS2VAScScore") {
        return calculateCHA2DS2VAScScore(data);
      }

      return undefined;
    } catch (error) {
      console.error("Calculation error:", error);
      return undefined;
    }
  };

  // Función para calcular CHA2DS2-VASc Score
  const calculateCHA2DS2VAScScore = (data: Record<string, any>): number => {
    let score = 0;
    
    // C - Congestive heart failure (1 point)
    if (data.insuficiencia_cardiaca === "Sí") score += 1;
    
    // H - Hypertension (1 point)
    if (data.hipertension === "Sí") score += 1;
    
    // A2 - Age ≥75 years (2 points)
    const age = parseInt(basicData.age) || 0;
    if (age >= 75) score += 2;
    else if (age >= 65) score += 1; // A - Age 65-74 years (1 point)
    
    // D - Diabetes mellitus (1 point)
    if (data.diabetes === "Sí") score += 1;
    
    // S2 - Prior stroke/TIA/thromboembolism (2 points)
    if (data.ictus_previo === "Sí") score += 2;
    
    // V - Vascular disease (1 point)
    if (data.cardiopatia_isquemica?.includes("IAM previo") || 
        data.cardiopatia_isquemica?.includes("Revascularización")) score += 1;
    
    // S - Sex category (female) (1 point)
    if (basicData.gender === "F") score += 1;
    
    return score;
  };

  // Función para agrupar y renderizar campos dinámicamente basado en metadatos de BD
  const renderGroupedFields = (fields: FormField[]) => {
    // Filtrar campos que deben mostrarse (considerando condicionales)
    const visibleFields = fields.filter(field => {
      // Las columnas vienen en snake_case desde la BD
      const conditionalField = (field as any).conditional_field;
      const conditionalValue = (field as any).conditional_value;
      
      // Si no tiene condición, siempre mostrar
      if (!conditionalField || !conditionalValue) return true;
      
      // Si tiene condición, verificar si se cumple
      const triggerValue = formData[conditionalField];
      console.log(`Conditional check: ${field.label} depends on ${conditionalField}=${conditionalValue}, current value: ${triggerValue}`);
      return triggerValue === conditionalValue;
    });

    // Agrupar dinámicamente por field_group desde la base de datos
    const fieldGroups = visibleFields.reduce((groups: Record<string, FormField[]>, field) => {
      const groupKey = (field as any).field_group || 'otros';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(field);
      return groups;
    }, {});

    // Configuración de grupos desde BD
    const groupConfig: Record<string, { title: string; borderColor: string; icon?: string }> = {
      'sintomas_cardiovasculares': { 
        title: 'Síntomas Cardiovasculares', 
        borderColor: 'border-l-blue-600',
        icon: '💙'
      },
      'antecedentes_medicos': { 
        title: 'Antecedentes Médicos', 
        borderColor: 'border-l-blue-500',
        icon: '📋'
      },
      'signos_vitales': { 
        title: 'Signos Vitales', 
        borderColor: 'border-l-blue-400',
        icon: '📊'
      },
      'examen_fisico': { 
        title: 'Examen Físico', 
        borderColor: 'border-l-blue-300',
        icon: '🩺'
      },
      'otros': { 
        title: 'Información Adicional', 
        borderColor: 'border-l-blue-200',
        icon: '📝'
      }
    };

    return (
      <div className="space-y-6">
        {Object.entries(fieldGroups).map(([groupKey, groupFields]) => {
          const config = groupConfig[groupKey] || groupConfig['otros'];
          const compactFields = groupFields.filter(field => 
            (field as any).display_style === 'compact_checkbox'
          );
          const normalFields = groupFields.filter(field => 
            (field as any).display_style !== 'compact_checkbox'
          );

          return (
            <div key={groupKey}>
              {/* Campos compactos (checkboxes) */}
              {compactFields.length > 0 && (
                <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 border-l-4 ${config.borderColor} mb-4`}>
                  <h4 className="font-semibold text-blue-800 text-sm mb-3 pb-2 border-b border-blue-300 flex items-center gap-2">
                    <span>{config.icon}</span>
                    {config.title}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {compactFields.sort((a, b) => a.order - b.order).map(field => renderCompactCheckbox(field))}
                  </div>
                </div>
              )}

              {/* Campos normales */}
              {normalFields.length > 0 && (
                <div className="space-y-4">
                  {normalFields.sort((a, b) => a.order - b.order).map(field => renderDynamicField(field))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Función para renderizar checkboxes compactos
  const renderCompactCheckbox = (field: FormField) => {
    const value = formData[field.name] || "";
    const isChecked = value === "sí" || value === true;
    
    return (
      <div key={field.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
        <Checkbox
          id={field.name}
          checked={isChecked}
          onCheckedChange={(checked) => {
            console.log(`Checkbox ${field.label} changed to:`, checked);
            handleFieldChange(field.name, checked ? "sí" : "no", field);
          }}
          className="shrink-0"
          data-testid={`field-${field.name}`}
        />
        <Label 
          htmlFor={field.name} 
          className="text-sm cursor-pointer leading-tight text-gray-700 hover:text-gray-900"
        >
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
    );
  };

  // Función para renderizar campo dinámico
  const renderDynamicField = (field: FormField) => {
    const value = formData[field.name] || "";
    const isCalculated = field.isCalculated;
    
    // Parsear opciones si existen
    let options: string[] = [];
    if (field.options) {
      if (typeof field.options === 'string') {
        // Primero intentar como string separado por comas
        if (field.options.includes(',')) {
          options = field.options.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } else {
          // Si no tiene comas, intentar JSON.parse
          try {
            const parsed = JSON.parse(field.options);
            if (Array.isArray(parsed)) {
              options = parsed;
            } else {
              // Si no es array, usar como opción única
              options = [field.options];
            }
          } catch (error) {
            // Si falla el JSON, usar como opción única
            options = [field.options];
          }
        }
      } else if (Array.isArray(field.options)) {
        options = field.options;
      }
    }

    // Parsear validación si existe
    let validation: any = {};
    if (field.validation) {
      try {
        validation = JSON.parse(field.validation);
      } catch (error) {
        console.error("Error parsing validation:", error);
      }
    }

    const commonProps = {
      "data-testid": `field-${field.name}`,
      disabled: isCalculated
    };

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.isRequired && <span className="text-red-500">*</span>}
              {field.unit && <Badge variant="outline">{field.unit}</Badge>}
            </Label>
            <Input
              id={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
              required={field.isRequired}
              {...commonProps}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.isRequired && <span className="text-red-500">*</span>}
              {field.unit && <Badge variant="outline">{field.unit}</Badge>}
              {isCalculated && <Badge variant="secondary">Calculado</Badge>}
            </Label>
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
              required={field.isRequired}
              min={validation.min}
              max={validation.max}
              {...commonProps}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.name, newValue, field)}
              {...commonProps}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Seleccionar ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.length > 0 ? options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                )) : (
                  <SelectItem value="sin-opciones">Sin opciones disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.name, newValue, field)}
              {...commonProps}
            >
              {options.length > 0 ? options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.name}-${index}`} />
                  <Label htmlFor={`${field.name}-${index}`}>{option}</Label>
                </div>
              )) : (
                <div className="text-sm text-muted-foreground">Sin opciones disponibles</div>
              )}
            </RadioGroup>
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case "checkbox":
        // Para checkbox, si hay opciones, mostrar múltiples checkboxes
        if (options.length > 0) {
          const selectedValues = Array.isArray(value) ? value : (value ? value.split(',') : []);
          return (
            <div key={field.id} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label}
                {field.isRequired && <span className="text-red-500">*</span>}
              </Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.name}-${index}`}
                      checked={selectedValues.includes(option)}
                      onCheckedChange={(checked) => {
                        let newValues = [...selectedValues];
                        if (checked && !newValues.includes(option)) {
                          newValues.push(option);
                        } else if (!checked) {
                          newValues = newValues.filter(v => v !== option);
                        }
                        handleFieldChange(field.name, newValues.join(','), field);
                      }}
                      {...commonProps}
                    />
                    <Label htmlFor={`${field.name}-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
              {field.helpText && (
                <p className="text-sm text-muted-foreground">{field.helpText}</p>
              )}
            </div>
          );
        } else {
          // Checkbox simple (sin opciones) - para síntomas cardiovasculares
          return (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={value === "true" || value === true || value === "sí"}
                  onCheckedChange={(checked) => {
                    console.log(`Checkbox ${field.label} changed to:`, checked);
                    handleFieldChange(field.name, checked ? "sí" : "no", field);
                  }}
                  {...commonProps}
                />
                <Label htmlFor={field.name} className="flex items-center gap-2 cursor-pointer">
                  {field.label}
                  {field.isRequired && <span className="text-red-500">*</span>}
                </Label>
              </div>
              {field.helpText && (
                <p className="text-sm text-muted-foreground mt-1">{field.helpText}</p>
              )}
            </div>
          );
        }

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
              required={field.isRequired}
              {...commonProps}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Función para generar sidebar dinámico
  const generateDynamicSidebar = (): DynamicSidebar | null => {
    if (!selectedTemplate || !selectedTemplate.sections) return null;

    return {
      specialty: selectedTemplate.specialty,
      sections: selectedTemplate.sections.map(section => ({
        name: section.name,
        title: section.title,
        icon: getSectionIcon(section.name),
        items: section.fields ? section.fields.map(field => ({
          name: field.name,
          label: field.label,
          type: field.type
        })) : []
      }))
    };
  };

  // Función para guardar consulta
  const handleSaveConsultation = async () => {
    console.log('Validating form data...');
    console.log('Basic data:', basicData);
    console.log('Selected specialty:', selectedSpecialty);
    console.log('Selected template:', selectedTemplate);
    console.log('Form data:', formData);

    if (!basicData.age || !basicData.gender || !selectedSpecialty) {
      console.log('Validation failed - missing basic data');
      toast({
        title: "Datos incompletos", 
        description: "Complete los datos básicos y seleccione una especialidad",
        variant: "destructive"
      });
      return;
    }

    console.log('Validation passed, proceeding with consultation creation...');

    try {
      // Crear consulta
      const consultationData = {
        doctorId: user?.id || "",
        age: parseInt(basicData.age),
        gender: basicData.gender,
        specialty: selectedTemplate?.specialty || selectedSpecialty,
        reason: basicData.reason || "Consulta de rutina",
        status: "in-progress",
        vitalSigns: JSON.stringify(formData),
        physicalExam: JSON.stringify(formData)
      };

      await createConsultationMutation.mutateAsync(consultationData);

    } catch (error) {
      console.error("Error saving consultation:", error);
    }
  };

  // Renderizar sidebar dinámico
  const dynamicSidebar = generateDynamicSidebar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Sidebar dinámico específico por especialidad */}
        <aside className="w-80 bg-white dark:bg-gray-900 shadow-xl border-r">
          <div className="p-6 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="mb-4"
              data-testid="button-back"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nueva Consulta
            </h2>
            {selectedTemplate && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedTemplate.name}
              </p>
            )}
          </div>

          <div className="p-6 space-y-4">
            {/* Selección de especialidad */}
            <div className="space-y-2">
              <Label>Especialidad Médica</Label>
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
                data-testid="select-specialty"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(specialties) && specialties.length > 0 ? 
                    specialties.map((specialty: Specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="loading" disabled>
                        {loadingSpecialties ? "Cargando especialidades..." : "No hay especialidades disponibles"}
                      </SelectItem>
                    )
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Selector de plantillas */}
            {selectedSpecialty && templates && (
              <div className="space-y-4">
                <Separator />
                <TemplateSelector
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  isLoading={loadingTemplates}
                />
              </div>
            )}

            {/* Navegación del formulario dinámico */}
            {selectedTemplate && dynamicSidebar && dynamicSidebar.sections && (
              <div className="space-y-4">
                <Separator />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Secciones del Formulario
                </h3>
                {dynamicSidebar.sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.name}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        currentSection === index
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      data-testid={`button-section-${section.name}`}
                    >
                      {Icon && React.createElement(Icon, { size: 20 })}
                      <div className="text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">
                          {section.items.length} campos
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Contenido principal del formulario */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Datos básicos */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Datos Básicos del Paciente</CardTitle>
                <CardDescription>
                  Información general requerida para la consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Edad *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Edad del paciente"
                    value={basicData.age}
                    onChange={(e) => setBasicData(prev => ({ ...prev, age: e.target.value }))}
                    required
                    data-testid="input-age"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Género *</Label>
                  <RadioGroup
                    value={basicData.gender}
                    onValueChange={(value) => setBasicData(prev => ({ ...prev, gender: value }))}
                    className="flex gap-6"
                    data-testid="radio-gender"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="gender-m" />
                      <Label htmlFor="gender-m">♂ Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="gender-f" />
                      <Label htmlFor="gender-f">♀ Femenino</Label>
                    </div>
                  </RadioGroup>
                </div>

              </CardContent>
            </Card>



            {/* Formulario dinámico por secciones - Estilo médico profesional */}
            {selectedTemplate && selectedTemplate.sections && selectedTemplate.sections.length > 0 && (
              <div className="space-y-4">
                {selectedTemplate.sections.map((section, sectionIndex) => {
                  const Icon = getSectionIcon(section.name || "");
                  const isExpanded = currentSection === sectionIndex;
                  const completedFields = section.fields?.filter(field => 
                    formData[field.name] && formData[field.name] !== "" && formData[field.name] !== "no"
                  ) || [];
                  const completionPercentage = section.fields?.length > 0 
                    ? Math.round((completedFields.length / section.fields.length) * 100) 
                    : 0;

                  return (
                    <div key={section.id} className={`border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                    }`}>
                      {/* Header de sección colapsable */}
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                        onClick={() => setCurrentSection(sectionIndex)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="font-semibold text-base">{section.title}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              completionPercentage === 100 ? 'bg-green-500' : 'bg-white bg-opacity-20'
                            }`}>
                              {completionPercentage === 100 ? '✓' : `${completionPercentage}%`}
                            </div>
                          </div>
                          <div className={`text-lg transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Contenido de sección expandible */}
                      <div className={`transition-all duration-500 overflow-hidden ${
                        isExpanded ? 'max-h-none bg-white' : 'max-h-0'
                      }`}>
                        {isExpanded && (
                          <div className="p-5">
                            {section.description && (
                              <p className="text-gray-600 mb-4 text-sm italic">{section.description}</p>
                            )}
                            
                            {/* Agrupar campos por tipo/categoría */}
                            {renderGroupedFields(section.fields || [])}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Navegación entre secciones */}
            {selectedTemplate && selectedTemplate.sections && selectedTemplate.sections.length > 1 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  data-testid="button-previous-section"
                >
                  Sección Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  {selectedTemplate.sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentSection ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentSection(Math.min(selectedTemplate.sections.length - 1, currentSection + 1))}
                  disabled={currentSection === selectedTemplate.sections.length - 1}
                  data-testid="button-next-section"
                >
                  Siguiente Sección
                </Button>
              </div>
            )}

            {/* Botón de guardar */}
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleSaveConsultation}
                disabled={createConsultationMutation.isPending || saveResponsesMutation.isPending}
                className="px-8"
                data-testid="button-save-consultation"
              >
                <Save className="w-4 h-4 mr-2" />
                {createConsultationMutation.isPending ? "Guardando..." : "Guardar Consulta"}
              </Button>
            </div>

            {/* Estado de carga y errores */}
            {loadingSpecialties && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando especialidades...</p>
              </div>
            )}
            
            {specialtiesError && (
              <div className="text-center py-8">
                <p className="text-red-600">Error cargando especialidades: {String(specialtiesError)}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-2"
                >
                  Recargar
                </Button>
              </div>
            )}

            {(loadingTemplates || loadingForm) && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando formulario dinámico...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}