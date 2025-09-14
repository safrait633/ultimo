import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Eye, 
  Hand, 
  Activity, 
  Stethoscope,
  Clock,
  MapPin,
  Zap
} from "lucide-react";

interface SimpleTraumatologyFormProps {
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
}

const SIMPLE_SECTIONS: FormSection[] = [
  {
    id: "anamnesis",
    title: "Anamnesis y Mecanismo Lesional",
    icon: Clock,
    completed: false,
    fields: [
      {
        id: "injuryMechanism",
        label: "Mecanismo de Lesión",
        type: "select",
        options: [
          "Alta energía (accidente tráfico)",
          "Alta energía (caída altura)",
          "Baja energía (torcedura simple)",
          "Impacto directo",
          "Hiperextensión",
          "Movimiento en varus/valgus"
        ],
        required: true
      },
      {
        id: "hearSound",
        label: "¿Escuchó sonido en el momento de la lesión?",
        type: "select",
        options: [
          "No",
          "Chasquido (sugestivo rotura ligamentosa)",
          "Pop (sugestivo fractura)"
        ]
      },
      {
        id: "immediateFunctionality",
        label: "¿Pudo usar la extremidad inmediatamente después?",
        type: "boolean"
      },
      {
        id: "painIntensity",
        label: "Intensidad del Dolor (EVA 0-10)",
        type: "number",
        min: 0,
        max: 10
      },
      {
        id: "swellingType",
        label: "Tipo de Inflamación",
        type: "select",
        options: [
          "Sin inflamación",
          "Inmediata (hemartrosis)",
          "Tardía (derrame sinovial)"
        ]
      },
      {
        id: "instability",
        label: "¿Siente inestabilidad articular?",
        type: "boolean"
      }
    ]
  },
  {
    id: "look",
    title: "Look - Inspección",
    icon: Eye,
    completed: false,
    fields: [
      {
        id: "deformity",
        label: "Deformidad visible",
        type: "boolean"
      },
      {
        id: "deformityType",
        label: "Tipo de deformidad",
        type: "select",
        options: [
          "Sin deformidad",
          "Angular",
          "Acortamiento",
          "Rotacional"
        ]
      },
      {
        id: "skinCondition",
        label: "Estado de la piel",
        type: "multiselect",
        options: [
          "Normal",
          "Heridas (fractura abierta)",
          "Equimosis",
          "Flictenas (ampollas por edema)"
        ]
      },
      {
        id: "swelling",
        label: "Grado de tumefacción",
        type: "select",
        options: [
          "Sin edema",
          "Edema leve",
          "Edema moderado",
          "Edema severo"
        ]
      }
    ]
  },
  {
    id: "neurovascular",
    title: "Evaluación Neurovascular (PRIORITARIA)",
    icon: Zap,
    completed: false,
    fields: [
      {
        id: "distalPulses",
        label: "Pulsos distales",
        type: "select",
        options: [
          "Presentes y simétricos",
          "Disminuidos",
          "Ausentes - EMERGENCIA QUIRÚRGICA"
        ]
      },
      {
        id: "capillaryFill",
        label: "Llenado capilar",
        type: "select",
        options: [
          "Normal (< 2 segundos)",
          "Retardado (2-3 segundos)",
          "Muy retardado (> 3 segundos) - EMERGENCIA"
        ]
      },
      {
        id: "sensitivity",
        label: "Sensibilidad distal",
        type: "multiselect",
        options: [
          "Normal",
          "Hipoestesia (adormecimiento)",
          "Parestesias (hormigueo)",
          "Anestesia completa - EMERGENCIA"
        ]
      },
      {
        id: "distalMotor",
        label: "Motricidad distal",
        type: "select",
        options: [
          "Normal",
          "Débil",
          "Paralisis completa - EMERGENCIA"
        ]
      }
    ]
  },
  {
    id: "feel",
    title: "Feel - Palpación",
    icon: Hand,
    completed: false,
    fields: [
      {
        id: "temperature",
        label: "Temperatura local",
        type: "select",
        options: [
          "Normal",
          "Aumentada",
          "Disminuida"
        ]
      },
      {
        id: "bonyTenderness",
        label: "Puntos dolorosos óseos",
        type: "text",
        placeholder: "Localizar punto de máximo dolor"
      },
      {
        id: "softTissue",
        label: "Tensión de tejidos blandos",
        type: "select",
        options: [
          "Normal",
          "Tensión aumentada",
          "Tensión severa - Riesgo síndrome compartimental"
        ]
      },
      {
        id: "jointEffusion",
        label: "Derrame articular",
        type: "boolean"
      }
    ]
  },
  {
    id: "move",
    title: "Move - Movimiento",
    icon: Activity,
    completed: false,
    fields: [
      {
        id: "activeMovement",
        label: "Movilidad activa",
        type: "select",
        options: [
          "No evaluada (sospecha fractura)",
          "Normal",
          "Limitada por dolor",
          "Imposible"
        ]
      },
      {
        id: "passiveMovement",
        label: "Movilidad pasiva",
        type: "select",
        options: [
          "No evaluada (sospecha fractura)",
          "Normal",
          "Tope duro (óseo)",
          "Tope blando (tejido)"
        ]
      },
      {
        id: "rangeOfMotion",
        label: "Rango de movimiento (%)",
        type: "number",
        min: 0,
        max: 100
      }
    ]
  }
];

export default function SimpleTraumatologyForm({ patientData, onDataChange, onComplete }: SimpleTraumatologyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [sections, setSections] = useState(SIMPLE_SECTIONS);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value } as any;
    setFormData(newFormData);
    onDataChange?.(newFormData);
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

  const renderField = (field: any) => {
    const value = formData[field.id] || '';

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
            <div className="space-y-2">
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
            <CardTitle className="text-lg">Exploración Traumatológica</CardTitle>
            <Badge variant="outline">{calculateProgress()}% completado</Badge>
          </div>
          <Progress value={calculateProgress()} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Current Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <section.icon className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl">{section.title}</CardTitle>
            {section.id === 'neurovascular' && (
              <Badge variant="destructive" className="ml-auto">
                <AlertTriangle className="h-3 w-3 mr-1" />
                PRIORITARIO
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {currentSection < sections.length - 1 ? 'Siguiente' : 'Completar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      {((formData as any).distalPulses === "Ausentes - EMERGENCIA QUIRÚRGICA" ||
        (formData as any).capillaryFill === "Muy retardado (> 3 segundos) - EMERGENCIA" ||
        (formData as any).distalMotor === "Paralisis completa - EMERGENCIA" ||
        ((formData as any).sensitivity && (formData as any).sensitivity.includes("Anestesia completa - EMERGENCIA"))) && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">EMERGENCIA QUIRÚRGICA</h3>
                <p className="text-sm">Compromiso neurovascular detectado. Derivación urgente requerida.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}