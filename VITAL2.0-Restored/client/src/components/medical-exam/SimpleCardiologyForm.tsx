import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, AlertTriangle, CheckCircle, Stethoscope, FileText, Save
} from 'lucide-react';

interface SimpleCardiologyFormProps {
  patientData: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  onComplete: (data: any) => void;
}

interface FormSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: Array<{
    id: string;
    question: string;
    type: 'select' | 'scale' | 'text' | 'checkbox';
    options?: string[];
    scale?: { min: number; max: number; labels: string[] };
  }>;
}

const CARDIOLOGY_SECTIONS: FormSection[] = [
  {
    id: 'symptoms',
    title: 'Síntomas Cardiovasculares',
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: 'chest_pain',
        question: '¿Presenta dolor en el pecho?',
        type: 'select',
        options: [
          'No hay dolor',
          'Dolor leve ocasional',
          'Dolor moderado',
          'Dolor severo',
          'Dolor opresivo/angina'
        ]
      },
      {
        id: 'shortness_breath',
        question: '¿Tiene dificultad para respirar?',
        type: 'select',
        options: [
          'No',
          'Solo con ejercicio intenso',
          'Con ejercicio moderado',
          'En reposo ocasionalmente',
          'En reposo frecuentemente'
        ]
      },
      {
        id: 'palpitations',
        question: '¿Siente palpitaciones o latidos irregulares?',
        type: 'select',
        options: ['No', 'Ocasionalmente', 'Frecuentemente', 'Constantemente']
      }
    ]
  },
  {
    id: 'examination',
    title: 'Examen Cardiovascular',
    icon: <Stethoscope className="w-5 h-5" />,
    questions: [
      {
        id: 'blood_pressure',
        question: 'Presión arterial (aprox. mmHg)',
        type: 'select',
        options: [
          'Normal (120/80)',
          'Elevada (130-139/80-89)',
          'Hipertensión grado 1 (140-159/90-99)',
          'Hipertensión grado 2 (≥160/≥100)',
          'Crisis hipertensiva (>180/120)'
        ]
      },
      {
        id: 'heart_rate',
        question: 'Frecuencia cardíaca aproximada',
        type: 'select',
        options: [
          'Normal (60-100 lpm)',
          'Bradicardia (<60 lpm)',
          'Taquicardia leve (100-120 lpm)',
          'Taquicardia moderada (120-150 lpm)',
          'Taquicardia severa (>150 lpm)'
        ]
      },
      {
        id: 'heart_sounds',
        question: 'Ruidos cardíacos',
        type: 'select',
        options: [
          'Normales',
          'Soplo leve',
          'Soplo moderado',
          'Soplo severo',
          'Arritmia audible'
        ]
      }
    ]
  },
  {
    id: 'assessment',
    title: 'Evaluación y Riesgo',
    icon: <FileText className="w-5 h-5" />,
    questions: [
      {
        id: 'risk_level',
        question: '¿Nivel de riesgo cardiovascular?',
        type: 'select',
        options: [
          'Riesgo bajo',
          'Riesgo moderado',
          'Riesgo alto',
          'Riesgo muy alto',
          'Emergencia cardiovascular'
        ]
      },
      {
        id: 'immediate_action',
        question: '¿Requiere acción inmediata?',
        type: 'select',
        options: [
          'Seguimiento rutinario',
          'Control en 1 semana',
          'Control en 24-48 horas',
          'Referencia urgente a cardiología',
          'Hospitalización inmediata'
        ]
      },
      {
        id: 'recommendations',
        question: 'Recomendaciones principales',
        type: 'checkbox',
        options: [
          'Dieta baja en sodio',
          'Ejercicio moderado',
          'Medicación antihipertensiva',
          'ECG de control',
          'Ecocardiograma',
          'Consulta cardiología'
        ]
      }
    ]
  }
];

export default function SimpleCardiologyForm({ patientData, onComplete }: SimpleCardiologyFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentSection < CARDIOLOGY_SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const examData = {
      patientId: patientData.id,
      specialty: 'cardiologia',
      type: 'simple_exam',
      data: formData,
      completedAt: new Date().toISOString(),
      summary: generateSummary()
    };
    
    onComplete(examData);
  };

  const generateSummary = () => {
    return `Examen cardiovascular para ${patientData.name} (${patientData.age} años). 
            Dolor en pecho: ${formData.chest_pain || 'No especificado'}. 
            Presión arterial: ${formData.blood_pressure || 'No evaluado'}. 
            Riesgo: ${formData.risk_level || 'Por evaluar'}.`;
  };

  const renderQuestion = (question: any) => {
    const value = formData[question.id];

    switch (question.type) {
      case 'select':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  value === option 
                    ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-400 dark:text-red-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label
                key={option}
                className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      handleAnswer(question.id, [...currentValues, option]);
                    } else {
                      handleAnswer(question.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Examen Cardiovascular Completado</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              La evaluación cardíaca ha sido completada exitosamente
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Resumen:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {generateSummary()}
              </p>
            </div>
            <Button onClick={handleComplete} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Guardar Examen Cardiovascular
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const section = CARDIOLOGY_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / CARDIOLOGY_SECTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      {/* Header con información del paciente */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{patientData.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {patientData.age} años • {patientData.gender}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary">Cardiología</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso del examen</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentSection + 1} de {CARDIOLOGY_SECTIONS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección actual */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
              {section.icon}
            </div>
            <CardTitle>{section.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {section.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {question.question}
              </h3>
              {renderQuestion(question)}
            </div>
          ))}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              Anterior
            </Button>
            <Button onClick={handleNext}>
              {currentSection === CARDIOLOGY_SECTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}