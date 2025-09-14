import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, AlertTriangle, CheckCircle, Stethoscope, FileText, Save
} from 'lucide-react';

interface SimpleUrologyFormProps {
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

const SIMPLE_SECTIONS: FormSection[] = [
  {
    id: 'symptoms',
    title: 'Síntomas',
    icon: <AlertTriangle className="w-5 h-5" />,
    questions: [
      {
        id: 'main_complaint',
        question: 'Síntoma principal',
        type: 'select',
        options: [
          'Dolor al orinar',
          'Frecuencia urinaria',
          'Sangre en orina',
          'Dolor abdominal',
          'Dificultad para orinar'
        ]
      },
      {
        id: 'duration',
        question: 'Duración',
        type: 'select',
        options: ['1 día', '3 días', '1 semana', '1 mes+']
      }
    ]
  },
  {
    id: 'exam',
    title: 'Examen',
    icon: <Stethoscope className="w-5 h-5" />,
    questions: [
      {
        id: 'general_state',
        question: 'Estado general',
        type: 'select',
        options: ['Normal', 'Dolor', 'Malestar']
      },
      {
        id: 'palpation',
        question: 'Palpación abdominal',
        type: 'select',
        options: ['Normal', 'Dolor leve', 'Dolor severo']
      }
    ]
  },
  {
    id: 'plan',
    title: 'Plan',
    icon: <FileText className="w-5 h-5" />,
    questions: [
      {
        id: 'diagnosis',
        question: 'Diagnóstico probable',
        type: 'select',
        options: [
          'ITU',
          'Cistitis',
          'Cálculo renal',
          'Normal',
          'Requiere estudios'
        ]
      },
      {
        id: 'treatment',
        question: 'Tratamiento',
        type: 'select',
        options: [
          'Antibióticos',
          'Analgésicos',
          'Estudios adicionales',
          'Seguimiento'
        ]
      }
    ]
  }
];

export default function SimpleUrologyForm({ patientData, onComplete }: SimpleUrologyFormProps) {
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
    if (currentSection < SIMPLE_SECTIONS.length - 1) {
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
      specialty: 'urologia',
      type: 'simple_exam',
      data: formData,
      completedAt: new Date().toISOString(),
      summary: generateSummary()
    };
    
    onComplete(examData);
  };

  const generateSummary = () => {
    return `Examen de urología para ${patientData.name} (${patientData.age} años). 
            Síntoma principal: ${formData.main_complaint || 'No especificado'}. 
            Nivel de dolor: ${formData.pain_level || 0}/10. 
            Urgencia: ${formData.urgency || 'No especificado'}.`;
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
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{question.scale?.labels[0]}</span>
              <span>{question.scale?.labels[1]}</span>
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(question.id, i)}
                  className={`w-12 h-12 rounded-lg border font-medium transition-colors ${
                    value === i
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            <CardTitle>Examen Completado</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              El examen de urología ha sido completado exitosamente
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
              Guardar Examen
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const section = SIMPLE_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SIMPLE_SECTIONS.length) * 100;

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
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{patientData.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {patientData.age} años • {patientData.gender}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary">Urología</Badge>
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
              {currentSection + 1} de {SIMPLE_SECTIONS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sección actual */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
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
              {currentSection === SIMPLE_SECTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}