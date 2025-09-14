import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Thermometer, Scale, Ruler, Eye, Stethoscope, Brain, Activity, Save, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Clock, AlertTriangle } from 'lucide-react';
import SimpleUrologyForm from './SimpleUrologyForm';
import SimpleCardiologyForm from './SimpleCardiologyForm';
import SimpleTraumatologyForm from './SimpleTraumatologyForm';
import AdvancedCardiologyForm from './AdvancedCardiologyForm';
import AdvancedGastroForm from './AdvancedGastroForm';
import AdvancedUrologyForm from './AdvancedUrologyForm';
import AdvancedPneumologyForm from './AdvancedPneumologyForm';
import AdvancedEndocrinologyForm from './AdvancedEndocrinologyForm';
import AdvancedTraumatologyForm from './AdvancedTraumatologyForm';
import AdvancedDermatologyForm from './AdvancedDermatologyForm';
import AdvancedNeurologiaForm from './AdvancedNeurologiaForm';
import AdvancedOphthalmologyForm from './AdvancedOphthalmologyForm';
import AdvancedRheumatologyForm from './AdvancedRheumatologyForm';
import AdvancedGeriatricsForm from './AdvancedGeriatricsForm';
import AdvancedHematologyForm from './AdvancedHematologyForm';
import AdvancedInfectiologyForm from './AdvancedInfectiologyForm';
import AdvancedOtolaryngologyForm from './AdvancedOtolaryngologyForm';
import AdvancedPsychiatryForm from './AdvancedPsychiatryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExamData {
  [key: string]: any;
}

interface InteractiveExamFormProps {
  specialty: {
    id: string;
    name: string;
    slug: string;
  } | null;
  mode: string;
  patientData: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  onDataChange: (data: ExamData) => void;
  onComplete: (data: ExamData) => void;
}

export default function InteractiveExamForm({ 
  specialty, 
  mode, 
  patientData, 
  onDataChange, 
  onComplete 
}: InteractiveExamFormProps) {
  // Verificar si se debe usar el formulario avanzado basándose en el modo
  const useAdvancedForm = mode === 'advanced' || mode === 'comprehensive';

  // Formularios de Urología
  if (specialty?.slug === 'urologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedUrologyForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    return (
      <SimpleUrologyForm
        patientData={patientData}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Cardiología  
  if (specialty?.slug === 'cardiologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedCardiologyForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    return (
      <SimpleCardiologyForm
        patientData={patientData}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Gastroenterología
  if (specialty?.slug === 'gastroenterologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedGastroForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    // Si no hay formulario simple, usar el avanzado por defecto
    return (
      <AdvancedGastroForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Neumología
  if (specialty?.slug === 'neumologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedPneumologyForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    // Si no hay formulario simple, usar el avanzado por defecto
    return (
      <AdvancedPneumologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Endocrinología
  if (specialty?.slug === 'endocrinologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedEndocrinologyForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    // Si no hay formulario simple, usar el avanzado por defecto
    return (
      <AdvancedEndocrinologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Traumatología
  if (specialty?.slug === 'traumatologia') {
    if (useAdvancedForm) {
      return (
        <AdvancedTraumatologyForm 
          patientData={patientData}
          onDataChange={onDataChange}
          onComplete={onComplete}
        />
      );
    }
    return (
      <SimpleTraumatologyForm
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Dermatología
  if (specialty?.slug === 'dermatologia') {
    return (
      <AdvancedDermatologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Neurología
  if (specialty?.slug === 'neurologia') {
    return (
      <AdvancedNeurologiaForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Oftalmología
  if (specialty?.slug === 'oftalmologia') {
    return (
      <AdvancedOphthalmologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Reumatología
  if (specialty?.slug === 'reumatologia') {
    return (
      <AdvancedRheumatologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Geriatría
  if (specialty?.slug === 'geriatria') {
    return (
      <AdvancedGeriatricsForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Hematología
  if (specialty?.slug === 'hematologia') {
    return (
      <AdvancedHematologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Infectología
  if (specialty?.slug === 'infectologia') {
    return (
      <AdvancedInfectiologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Otorrinolaringología
  if (specialty?.slug === 'otorrinolaringologia') {
    return (
      <AdvancedOtolaryngologyForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Formularios de Psiquiatría
  if (specialty?.slug === 'psiquiatria') {
    return (
      <AdvancedPsychiatryForm 
        patientData={patientData}
        onDataChange={onDataChange}
        onComplete={onComplete}
      />
    );
  }

  // Componente original para otras especialidades
  const [activeTab, setActiveTab] = useState('vital-signs');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ExamData>({});
  const [currentSection, setCurrentSection] = useState('vital-signs');
  const [configuration] = useState({ autoComplete: true });
  const [operationMode] = useState(mode);

  const examSections = [
    { 
      id: 'vital-signs', 
      title: 'Signos Vitales', 
      icon: Heart, 
      color: 'text-red-400',
      fields: ['bloodPressure', 'heartRate', 'temperature', 'weight', 'height', 'respiratoryRate', 'oxygenSaturation']
    },
    { 
      id: 'general-appearance', 
      title: 'Aspecto General', 
      icon: Eye, 
      color: 'text-blue-400',
      fields: ['generalAppearance', 'consciousness', 'posture', 'hygiene']
    },
    { 
      id: 'cardiovascular', 
      title: 'Cardiovascular', 
      icon: Heart, 
      color: 'text-red-400',
      fields: ['heartSounds', 'murmurs', 'rhythm', 'pulses', 'edema']
    },
    { 
      id: 'respiratory', 
      title: 'Respiratorio', 
      icon: Stethoscope, 
      color: 'text-cyan-400',
      fields: ['breathingSounds', 'chestExpansion', 'percussion', 'respiratoryPattern']
    },
    { 
      id: 'neurological', 
      title: 'Neurológico', 
      icon: Brain, 
      color: 'text-purple-400',
      fields: ['consciousness', 'orientation', 'reflexes', 'motorFunction', 'sensoryFunction']
    },
    { 
      id: 'abdominal', 
      title: 'Abdominal', 
      icon: Activity, 
      color: 'text-green-400',
      fields: ['inspection', 'palpation', 'percussion', 'bowelSounds']
    },
    { 
      id: 'musculoskeletal', 
      title: 'Musculoesquelético', 
      icon: Activity, 
      color: 'text-orange-400',
      fields: ['mobility', 'strength', 'deformities', 'painPoints']
    }
  ];

  const onSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const onProgressChange = (progress: number) => {
    // Update progress
  };

  useEffect(() => {
    if (currentSection) {
      setActiveTab(currentSection);
    } else if (examSections.length > 0) {
      setActiveTab(examSections[0].id);
      onSectionChange(examSections[0].id);
    }
  }, [currentSection]);

  useEffect(() => {
    calculateProgress();
  }, [formData, completedSections]);

  const calculateProgress = () => {
    const totalFields = examSections.reduce((total, section) => total + section.fields.length, 0);
    const completedFields = Object.keys(formData).filter(key => formData[key] && formData[key].toString().trim() !== '').length;
    const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    onProgressChange(progress);
  };

  const updateFormData = (field: string, value: any) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    onDataChange(newData);

    // Validación en tiempo real si está habilitada
    if (configuration.autoComplete) {
      validateField(field, value);
    }
  };

  const validateField = (field: string, value: any) => {
    const errors = { ...validationErrors };
    
    // Validaciones específicas según el campo
    switch (field) {
      case 'heartRate':
        if (value && (isNaN(value) || value < 30 || value > 200)) {
          errors[field] = 'Frecuencia cardíaca debe estar entre 30-200 lpm';
        } else {
          delete errors[field];
        }
        break;
      case 'temperature':
        if (value && (isNaN(value) || value < 32 || value > 45)) {
          errors[field] = 'Temperatura debe estar entre 32-45°C';
        } else {
          delete errors[field];
        }
        break;
      case 'bloodPressureSystolic':
        if (value && (isNaN(value) || value < 70 || value > 250)) {
          errors[field] = 'Presión sistólica debe estar entre 70-250 mmHg';
        } else {
          delete errors[field];
        }
        break;
      default:
        if (value && value.toString().trim() === '') {
          delete errors[field];
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const getSectionProgress = (sectionId: string) => {
    const section = examSections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const completedFields = section.fields.filter(field => 
      formData[field] && formData[field].toString().trim() !== ''
    ).length;
    
    return (completedFields / section.fields.length) * 100;
  };

  const isSectionComplete = (sectionId: string) => {
    return getSectionProgress(sectionId) === 100;
  };

  const goToNextSection = () => {
    const currentIndex = examSections.findIndex(s => s.id === activeTab);
    if (currentIndex < examSections.length - 1) {
      const nextSection = examSections[currentIndex + 1];
      setActiveTab(nextSection.id);
      onSectionChange(nextSection.id);
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = examSections.findIndex(s => s.id === activeTab);
    if (currentIndex > 0) {
      const prevSection = examSections[currentIndex - 1];
      setActiveTab(prevSection.id);
      onSectionChange(prevSection.id);
    }
  };

  const renderVitalSigns = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Presión Arterial (mmHg)</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Sistólica"
            value={formData.bloodPressureSystolic || ''}
            onChange={(e) => updateFormData('bloodPressureSystolic', e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
          <Input
            placeholder="Diastólica"
            value={formData.bloodPressureDiastolic || ''}
            onChange={(e) => updateFormData('bloodPressureDiastolic', e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-gray-300">Frecuencia Cardíaca (lpm)</Label>
        <Input
          type="number"
          value={formData.heartRate || ''}
          onChange={(e) => updateFormData('heartRate', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-gray-300">Temperatura (°C)</Label>
        <Input
          type="number"
          step="0.1"
          value={formData.temperature || ''}
          onChange={(e) => updateFormData('temperature', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-gray-300">Peso (kg)</Label>
        <Input
          type="number"
          value={formData.weight || ''}
          onChange={(e) => updateFormData('weight', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-gray-300">Altura (cm)</Label>
        <Input
          type="number"
          value={formData.height || ''}
          onChange={(e) => updateFormData('height', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-gray-300">Frecuencia Respiratoria (rpm)</Label>
        <Input
          type="number"
          value={formData.respiratoryRate || ''}
          onChange={(e) => updateFormData('respiratoryRate', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      <div>
        <Label className="text-gray-300">Saturación O2 (%)</Label>
        <Input
          type="number"
          value={formData.oxygenSaturation || ''}
          onChange={(e) => updateFormData('oxygenSaturation', e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
    </div>
  );

  const renderTextAreaSection = (fields: string[], title: string) => (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field}>
          <Label className="text-gray-300 capitalize">
            {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </Label>
          <Textarea
            value={formData[field] || ''}
            onChange={(e) => updateFormData(field, e.target.value)}
            className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            placeholder={`Describir hallazgos de ${field.toLowerCase()}...`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Stethoscope className="w-6 h-6 mr-2" />
            Examen Físico - {specialty?.name}
          </CardTitle>
          <Badge variant="secondary" className={`${
            operationMode === 'production' ? 'bg-green-600' :
            operationMode === 'practice' ? 'bg-blue-600' : 'bg-yellow-600'
          } text-white`}>
            {operationMode === 'production' ? 'Producción' :
             operationMode === 'practice' ? 'Práctica' : 'Demostración'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 w-full mb-6 bg-slate-800">
            {examSections.map((section) => {
              const IconComponent = section.icon;
              const progress = getSectionProgress(section.id);
              const isComplete = isSectionComplete(section.id);
              
              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="relative data-[state=active]:bg-slate-700 text-xs p-2"
                  onClick={() => onSectionChange(section.id)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <div className="relative">
                      <IconComponent className={`w-4 h-4 ${section.color}`} />
                      {isComplete && (
                        <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-400 bg-slate-800 rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight">
                      {section.title.split(' ').map(word => word.substring(0, 4)).join(' ')}
                    </span>
                    <Progress value={progress} className="w-full h-1" />
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="vital-signs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Signos Vitales
              </h3>
              {renderVitalSigns()}
            </motion.div>
          </TabsContent>

          {examSections.slice(1).map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white flex items-center">
                  {React.createElement(section.icon, { 
                    className: `w-5 h-5 mr-2 ${section.color}` 
                  })}
                  {section.title}
                </h3>
                {renderTextAreaSection(section.fields, section.title)}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Navegación entre secciones */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPreviousSection}
            disabled={examSections.findIndex(s => s.id === activeTab) === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={goToNextSection}
            disabled={examSections.findIndex(s => s.id === activeTab) === examSections.length - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Siguiente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}