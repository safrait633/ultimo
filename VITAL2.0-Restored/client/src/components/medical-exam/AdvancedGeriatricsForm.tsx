import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Brain, 
  Heart, 
  Pill,
  Target,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  Activity
} from "lucide-react";

interface AdvancedGeriatricsFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface FormSection {
  id: string;
  title: string;
  icon: any;
  fields: any[];
  completed: boolean;
  critical?: boolean;
}

const GERIATRICS_SECTIONS: FormSection[] = [
  {
    id: "functionalAssessment",
    title: "Evaluación Funcional",
    icon: Activity,
    completed: false,
    critical: true,
    fields: [
      {
        id: "adl",
        label: "Actividades de la Vida Diaria (ADL)",
        type: "object",
        subfields: [
          {
            id: "bathing",
            label: "Bañarse",
            type: "select",
            options: ["Independiente", "Requiere ayuda", "Dependiente"]
          },
          {
            id: "dressing",
            label: "Vestirse",
            type: "select",
            options: ["Independiente", "Requiere ayuda", "Dependiente"]
          },
          {
            id: "toileting",
            label: "Uso del baño",
            type: "select",
            options: ["Independiente", "Requiere ayuda", "Dependiente"]
          },
          {
            id: "transfers",
            label: "Transferencias",
            type: "select",
            options: ["Independiente", "Requiere ayuda", "Dependiente"]
          },
          {
            id: "continence",
            label: "Continencia",
            type: "select",
            options: ["Continente", "Incontinencia ocasional", "Incontinencia frecuente"]
          },
          {
            id: "feeding",
            label: "Alimentación",
            type: "select",
            options: ["Independiente", "Requiere ayuda", "Dependiente"]
          }
        ]
      },
      {
        id: "iadl",
        label: "Actividades Instrumentales (IADL)",
        type: "object",
        subfields: [
          {
            id: "telephone",
            label: "Uso del teléfono",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "shopping",
            label: "Hacer compras",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "cooking",
            label: "Preparar comida",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "housework",
            label: "Tareas domésticas",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "laundry",
            label: "Lavar ropa",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "medications",
            label: "Manejo de medicamentos",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          },
          {
            id: "finances",
            label: "Manejo del dinero",
            type: "select",
            options: ["Independiente", "Dificultad", "Incapaz"]
          }
        ]
      }
    ]
  },
  {
    id: "cognitiveAssessment",
    title: "Evaluación Cognitiva",
    icon: Brain,
    completed: false,
    critical: true,
    fields: [
      {
        id: "miniMentalState",
        label: "Mini Mental State (MMSE)",
        type: "object",
        subfields: [
          {
            id: "orientation",
            label: "Orientación (0-10)",
            type: "number",
            min: 0,
            max: 10
          },
          {
            id: "registration",
            label: "Registro (0-3)",
            type: "number",
            min: 0,
            max: 3
          },
          {
            id: "attention",
            label: "Atención y cálculo (0-5)",
            type: "number",
            min: 0,
            max: 5
          },
          {
            id: "recall",
            label: "Recuerdo (0-3)",
            type: "number",
            min: 0,
            max: 3
          },
          {
            id: "language",
            label: "Lenguaje (0-9)",
            type: "number",
            min: 0,
            max: 9
          }
        ]
      },
      {
        id: "clockTest",
        label: "Test del Reloj",
        type: "select",
        options: ["Normal (6-10)", "Deterioro leve (4-5)", "Deterioro moderado (2-3)", "Deterioro severo (0-1)"]
      },
      {
        id: "memoryComplaints",
        label: "Quejas de Memoria",
        type: "multiselect",
        options: [
          "Sin quejas",
          "Olvido de nombres",
          "Olvido de citas",
          "Extravío de objetos",
          "Repetición de preguntas",
          "Desorientación temporal",
          "Desorientación espacial"
        ]
      },
      {
        id: "behavioralChanges",
        label: "Cambios Conductuales",
        type: "multiselect",
        options: [
          "Ausentes",
          "Agitación",
          "Agresividad",
          "Apatía",
          "Desinhibición",
          "Alucinaciones",
          "Delirios",
          "Trastornos del sueño"
        ]
      }
    ]
  },
  {
    id: "mobilityGait",
    title: "Movilidad y Marcha",
    icon: Users,
    completed: false,
    fields: [
      {
        id: "fallRisk",
        label: "Riesgo de Caídas",
        type: "object",
        subfields: [
          {
            id: "fallHistory",
            label: "Historia de caídas (último año)",
            type: "select",
            options: ["Ninguna", "1 caída", "2 caídas", "3 o más caídas"]
          },
          {
            id: "fearOfFalling",
            label: "Miedo a caer",
            type: "boolean"
          },
          {
            id: "gaitSpeed",
            label: "Velocidad de marcha",
            type: "select",
            options: ["Normal", "Lentificada", "Muy lenta", "Con ayuda", "No camina"]
          },
          {
            id: "balance",
            label: "Equilibrio",
            type: "select",
            options: ["Estable", "Inestable ocasional", "Inestable frecuente", "Muy inestable"]
          }
        ]
      },
      {
        id: "mobilityAids",
        label: "Ayudas para la Movilidad",
        type: "multiselect",
        options: [
          "Ninguna",
          "Bastón",
          "Andador",
          "Silla de ruedas ocasional",
          "Silla de ruedas permanente",
          "Otros dispositivos"
        ]
      },
      {
        id: "timedUpAndGo",
        label: "Test Timed Up and Go (segundos)",
        type: "number",
        min: 5,
        max: 120
      }
    ]
  },
  {
    id: "nutritionalAssessment",
    title: "Evaluación Nutricional",
    icon: Target,
    completed: false,
    fields: [
      {
        id: "weightChanges",
        label: "Cambios de Peso",
        type: "object",
        subfields: [
          {
            id: "recentWeightLoss",
            label: "Pérdida de peso reciente",
            type: "select",
            options: ["No", "1-3 kg en 6 meses", "3-5 kg en 6 meses", ">5 kg en 6 meses"]
          },
          {
            id: "bmi",
            label: "IMC",
            type: "select",
            options: ["<18.5 (Bajo peso)", "18.5-24.9 (Normal)", "25-29.9 (Sobrepeso)", "≥30 (Obesidad)"]
          }
        ]
      },
      {
        id: "appetiteChanges",
        label: "Cambios en el Apetito",
        type: "select",
        options: ["Sin cambios", "Disminución leve", "Disminución moderada", "Disminución severa", "Anorexia"]
      },
      {
        id: "eatingDifficulties",
        label: "Dificultades para Comer",
        type: "multiselect",
        options: [
          "Ninguna",
          "Problemas de masticación",
          "Problemas de deglución",
          "Falta de apetito",
          "Náuseas/vómitos",
          "Restricciones dietéticas",
          "Problemas económicos"
        ]
      },
      {
        id: "hydration",
        label: "Estado de Hidratación",
        type: "select",
        options: ["Adecuado", "Leve deshidratación", "Deshidratación moderada", "Deshidratación severa"]
      }
    ]
  },
  {
    id: "medicationReview",
    title: "Revisión de Medicamentos",
    icon: Pill,
    completed: false,
    critical: true,
    fields: [
      {
        id: "polypharmacy",
        label: "Número de Medicamentos",
        type: "select",
        options: ["0-4", "5-9", "10-14", "≥15 (Polifarmacia severa)"]
      },
      {
        id: "potentiallyInappropriate",
        label: "Medicamentos Potencialmente Inapropiados",
        type: "multiselect",
        options: [
          "Ninguno identificado",
          "Benzodiacepinas de acción prolongada",
          "Antihistamínicos sedantes",
          "Relajantes musculares",
          "Antipsicóticos",
          "AINEs crónicos",
          "Duplicidad terapéutica"
        ]
      },
      {
        id: "adherence",
        label: "Adherencia al Tratamiento",
        type: "select",
        options: ["Buena", "Regular", "Mala", "No evaluable"]
      },
      {
        id: "adverseEffects",
        label: "Efectos Adversos Reportados",
        type: "multiselect",
        options: [
          "Ninguno",
          "Somnolencia",
          "Mareos",
          "Caídas",
          "Confusión",
          "Problemas gastrointestinales",
          "Otros"
        ]
      },
      {
        id: "drugInteractions",
        label: "Interacciones Medicamentosas",
        type: "select",
        options: ["No identificadas", "Leves", "Moderadas", "Severas"]
      }
    ]
  },
  {
    id: "socialAssessment",
    title: "Evaluación Social",
    icon: Heart,
    completed: false,
    fields: [
      {
        id: "socialSupport",
        label: "Red de Apoyo Social",
        type: "object",
        subfields: [
          {
            id: "livingArrangement",
            label: "Situación de vivienda",
            type: "select",
            options: ["Vive solo", "Vive con familia", "Residencia asistida", "Hogar de ancianos"]
          },
          {
            id: "caregiver",
            label: "Cuidador principal",
            type: "select",
            options: ["Ninguno", "Esposo/a", "Hijo/a", "Otro familiar", "Cuidador pagado"]
          },
          {
            id: "caregiverBurden",
            label: "Sobrecarga del cuidador",
            type: "select",
            options: ["No aplica", "Leve", "Moderada", "Severa"]
          }
        ]
      },
      {
        id: "economicStatus",
        label: "Situación Económica",
        type: "select",
        options: ["Adecuada", "Limitaciones leves", "Limitaciones moderadas", "Limitaciones severas"]
      },
      {
        id: "socialActivities",
        label: "Actividades Sociales",
        type: "multiselect",
        options: [
          "Mantiene actividades sociales",
          "Reducción de actividades",
          "Aislamiento social",
          "Participación en grupos",
          "Actividades religiosas",
          "Voluntariado"
        ]
      }
    ]
  },
  {
    id: "preventiveHealth",
    title: "Salud Preventiva",
    icon: Target,
    completed: false,
    fields: [
      {
        id: "screenings",
        label: "Tamizajes Apropiados para la Edad",
        type: "object",
        subfields: [
          {
            id: "mammography",
            label: "Mamografía (mujeres)",
            type: "select",
            options: ["Al día", "Retraso <2 años", "Retraso >2 años", "No indicada"]
          },
          {
            id: "cervicalCancer",
            label: "Citología cervical (mujeres)",
            type: "select",
            options: ["Al día", "Retraso", "No indicada por edad"]
          },
          {
            id: "prostateScreening",
            label: "Tamizaje prostático (hombres)",
            type: "select",
            options: ["Al día", "Retraso", "No indicado por edad"]
          },
          {
            id: "colonoscopy",
            label: "Colonoscopia",
            type: "select",
            options: ["Al día", "Retraso <5 años", "Retraso >5 años", "No indicada"]
          }
        ]
      },
      {
        id: "vaccinations",
        label: "Vacunaciones",
        type: "object",
        subfields: [
          {
            id: "influenza",
            label: "Influenza anual",
            type: "boolean"
          },
          {
            id: "pneumococcal",
            label: "Neumococo",
            type: "boolean"
          },
          {
            id: "shingles",
            label: "Herpes zóster",
            type: "boolean"
          },
          {
            id: "covid19",
            label: "COVID-19",
            type: "boolean"
          }
        ]
      }
    ]
  },
  {
    id: "assessment",
    title: "Evaluación Geriátrica Integral",
    icon: CheckCircle,
    completed: false,
    fields: [
      {
        id: "overallFunctionalStatus",
        label: "Estado Funcional Global",
        type: "select",
        options: [
          "Independiente",
          "Dependencia leve",
          "Dependencia moderada",
          "Dependencia severa",
          "Dependencia total"
        ]
      },
      {
        id: "frailtyLevel",
        label: "Nivel de Fragilidad",
        type: "select",
        options: ["Robusto", "Pre-frágil", "Frágil", "Muy frágil"]
      },
      {
        id: "priorityProblems",
        label: "Problemas Prioritarios",
        type: "multiselect",
        options: [
          "Deterioro cognitivo",
          "Riesgo de caídas",
          "Polifarmacia",
          "Malnutrición",
          "Aislamiento social",
          "Depresión",
          "Dolor crónico",
          "Incontinencia",
          "Insomnio"
        ]
      },
      {
        id: "interventionPlan",
        label: "Plan de Intervención",
        type: "textarea",
        placeholder: "Plan integral de cuidados geriátricos"
      },
      {
        id: "prognosisGoals",
        label: "Pronóstico y Objetivos",
        type: "select",
        options: [
          "Mantenimiento funcional",
          "Mejoría esperada",
          "Prevención de deterioro",
          "Cuidados paliativos",
          "Cuidados de confort"
        ]
      },
      {
        id: "followUpInterval",
        label: "Intervalo de Seguimiento",
        type: "select",
        options: [
          "1 mes",
          "3 meses",
          "6 meses",
          "Según necesidad",
          "Referencia especializada"
        ]
      }
    ]
  }
];

export default function AdvancedGeriatricsForm({ patientData, onDataChange, onComplete }: AdvancedGeriatricsFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [sections, setSections] = useState(GERIATRICS_SECTIONS);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value } as any;
    setFormData(newFormData);
    onDataChange?.(newFormData);
  };

  const handleObjectFieldChange = (parentId: string, subFieldId: string, value: any) => {
    const currentObjectValue = (formData as any)[parentId] || {};
    const newObjectValue = { ...currentObjectValue, [subFieldId]: value };
    handleFieldChange(parentId, newObjectValue);
  };

  const calculateMMSE = () => {
    const mmse = (formData as any).miniMentalState;
    if (!mmse) return 0;
    
    const orientation = parseInt(mmse.orientation || '0');
    const registration = parseInt(mmse.registration || '0');
    const attention = parseInt(mmse.attention || '0');
    const recall = parseInt(mmse.recall || '0');
    const language = parseInt(mmse.language || '0');
    
    return orientation + registration + attention + recall + language;
  };

  const checkHighRiskStatus = () => {
    const adlDependence = Object.values((formData as any).adl || {}).filter(val => val === 'Dependiente').length;
    const fallHistory = (formData as any).fallRisk?.fallHistory;
    const mmseTotal = calculateMMSE();
    
    return adlDependence >= 3 || fallHistory === "3 o más caídas" || mmseTotal <= 18;
  };

  const handleSectionComplete = () => {
    const updatedSections = [...sections];
    updatedSections[currentSection].completed = true;
    setSections(updatedSections);

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete?.(formData);
    }
  };

  const calculateProgress = () => {
    const completedSections = sections.filter(s => s.completed).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const getCurrentSection = () => sections[currentSection];
  const section = getCurrentSection();
  const mmseTotal = calculateMMSE();

  const renderField = (field: any) => {
    const value = (formData as any)[field.id] || (field.type === 'object' ? {} : '');

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              data-testid={`checkbox-${field.id}`}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleFieldChange(field.id, newValue)}
            >
              <SelectTrigger data-testid={`select-${field.id}`}>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">{field.label}</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {field.options.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      handleFieldChange(field.id, newValues);
                    }}
                    data-testid={`checkbox-${field.id}-${option}`}
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              min={field.min}
              max={field.max}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              data-testid={`input-${field.id}`}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="min-h-20"
              data-testid={`textarea-${field.id}`}
            />
          </div>
        );

      case 'object':
        return (
          <div key={field.id} className="space-y-3">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Card className="p-4 border-dashed">
              <div className="space-y-3">
                {field.subfields.map((subfield: any) => {
                  const subValue = value[subfield.id] || '';
                  
                  switch (subfield.type) {
                    case 'select':
                      return (
                        <div key={subfield.id} className="space-y-1">
                          <Label className="text-xs text-gray-600">{subfield.label}</Label>
                          <Select
                            value={subValue}
                            onValueChange={(newValue) => handleObjectFieldChange(field.id, subfield.id, newValue)}
                          >
                            <SelectTrigger className="h-8 text-sm" data-testid={`select-${field.id}-${subfield.id}`}>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {subfield.options.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );

                    case 'boolean':
                      return (
                        <div key={subfield.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field.id}-${subfield.id}`}
                            checked={subValue}
                            onCheckedChange={(checked) => handleObjectFieldChange(field.id, subfield.id, checked)}
                            data-testid={`checkbox-${field.id}-${subfield.id}`}
                          />
                          <Label htmlFor={`${field.id}-${subfield.id}`} className="text-xs">
                            {subfield.label}
                          </Label>
                        </div>
                      );

                    case 'number':
                      return (
                        <div key={subfield.id} className="space-y-1">
                          <Label className="text-xs text-gray-600">{subfield.label}</Label>
                          <Input
                            type="number"
                            min={subfield.min}
                            max={subfield.max}
                            value={subValue}
                            onChange={(e) => handleObjectFieldChange(field.id, subfield.id, e.target.value)}
                            className="h-8 text-sm"
                            data-testid={`input-${field.id}-${subfield.id}`}
                          />
                        </div>
                      );

                    default:
                      return (
                        <div key={subfield.id} className="space-y-1">
                          <Label className="text-xs text-gray-600">{subfield.label}</Label>
                          <Input
                            value={subValue}
                            onChange={(e) => handleObjectFieldChange(field.id, subfield.id, e.target.value)}
                            placeholder={subfield.placeholder}
                            className="h-8 text-sm"
                            data-testid={`input-${field.id}-${subfield.id}`}
                          />
                        </div>
                      );
                  }
                })}
                
                {/* MMSE Total */}
                {field.id === 'miniMentalState' && mmseTotal > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800">Total MMSE:</span>
                      <Badge 
                        variant={mmseTotal <= 18 ? "destructive" : mmseTotal <= 24 ? "secondary" : "default"}
                        className="text-lg"
                      >
                        {mmseTotal}/30
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              data-testid={`input-${field.id}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Evaluación Geriátrica Integral</CardTitle>
            <Badge variant="outline">{calculateProgress()}% completado</Badge>
          </div>
          {patientData && (
            <div className="flex items-center gap-3 mt-4 bg-purple-100/40 rounded-xl px-4 py-2 border border-purple-200">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-gray-900 font-semibold">
                {patientData.name} {patientData.surname}
                {patientData.age && (
                  <span className="ml-2 text-gray-700 font-normal">({patientData.age} años{patientData.gender ? `, ${patientData.gender}` : ""})</span>
                )}
              </span>
            </div>
          )}
          <Progress value={calculateProgress()} className="mt-2" />
        </CardHeader>
      </Card>

      {/* High Risk Alert */}
      {checkHighRiskStatus() && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>PACIENTE DE ALTO RIESGO</strong><br />
            Considerar evaluación geriátrica especializada urgente.
          </AlertDescription>
        </Alert>
      )}

      {/* MMSE Alert */}
      {mmseTotal > 0 && mmseTotal <= 18 && (
        <Alert className="border-orange-500 bg-orange-50">
          <Brain className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <strong>DETERIORO COGNITIVO SIGNIFICATIVO</strong><br />
            MMSE {mmseTotal}/30 - Considerar evaluación neurológica.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <section.icon className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-xl">{section.title}</CardTitle>
            {section.critical && (
              <Badge variant="destructive" className="ml-auto">
                <AlertTriangle className="h-3 w-3 mr-1" />
                CRÍTICO
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {section.fields.map(renderField)}
          
          <Separator className="my-4" />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              data-testid="button-previous"
            >
              Anterior
            </Button>
            <Button 
              onClick={handleSectionComplete}
              data-testid="button-next"
            >
              {currentSection < sections.length - 1 ? 'Siguiente' : 'Completar Evaluación'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Progreso por Secciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sections.map((sec, index) => (
              <Button
                key={sec.id}
                variant={index === currentSection ? "default" : sec.completed ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(index)}
                className="text-xs p-2 h-auto"
                data-testid={`button-section-${index}`}
              >
                <div className="flex items-center space-x-1">
                  {sec.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <sec.icon className="h-3 w-3" />
                  )}
                  <span className="truncate">{sec.title.split(' ')[0]}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}