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
  AlertTriangle,
  Eye,
  Focus,
  Search,
  Activity,
  Target,
  CheckCircle,
  Calculator,
  Brain,
  FileText,
  TrendingUp,
  Zap,
  ShieldAlert,
  Camera,
  Lightbulb,
  Timer,
  Users,
  Stethoscope
} from "lucide-react";

interface AdvancedOphthalmologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface OphthalmologyData {
  phase1: any;
  phase2: any;
  phase3: any;
  phase4: any;
  phase5: any;
  alerts: any[];
  calculatedScores: any;
  aiSuggestions: any;
}

export default function AdvancedOphthalmologyForm({ 
  patientData, 
  onDataChange, 
  onComplete 
}: AdvancedOphthalmologyFormProps) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [formData, setFormData] = useState<OphthalmologyData>({
    phase1: {},
    phase2: {},
    phase3: {},
    phase4: {},
    phase5: {},
    alerts: [],
    calculatedScores: {},
    aiSuggestions: {}
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    checkIntelligentAlerts();
    calculateScores();
    generateAISuggestions();
  }, [formData]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const phases = [formData.phase1, formData.phase2, formData.phase3, formData.phase4, formData.phase5];
    const completedPhases = phases.filter(phase => Object.keys(phase).length > 0).length;
    return (completedPhases / 5) * 100;
  };

  const checkIntelligentAlerts = () => {
    const newAlerts = [];
    const { phase1, phase2, phase3 } = formData;

    // 🔴 ALERTAS CRÍTICAS ROJAS - EMERGENCIAS OFTALMOLÓGICAS
    // Pérdida visual súbita con DPAR positivo
    if (phase1.vision_loss === 'sudden' && 
        phase1.symptom_duration === 'acute' &&
        phase3.rapd_test === 'positive') {
      newAlerts.push({
        type: 'critical',
        title: '🚨 PÉRDIDA VISUAL SÚBITA',
        message: 'Pérdida visual aguda con DPAR positivo. Posible neuropatía óptica isquémica.',
        action: 'Derivación inmediata a emergencias - Ventana terapéutica crítica'
      });
    }

    // Glaucoma agudo de ángulo cerrado
    if (phase1.pain_severity >= 8 && 
        phase1.associated_symptoms?.includes('nausea_vomiting') &&
        phase3.iop_right >= 30 || phase3.iop_left >= 30) {
      newAlerts.push({
        type: 'critical',
        title: '👁️ GLAUCOMA AGUDO DE ÁNGULO',
        message: 'Dolor severo + náuseas + PIO >30mmHg. Glaucoma agudo probable.',
        action: 'Tratamiento urgente: Diamox IV + manitol + mióticos'
      });
    }

    // Papiledema bilateral
    if (phase3.optic_disc_color === 'swollen' &&
        phase1.associated_symptoms?.includes('severe_headache')) {
      newAlerts.push({
        type: 'critical',
        title: '🧠 PAPILEDEMA BILATERAL',
        message: 'Papiledema bilateral + cefalea. Hipertensión intracraneal sospechosa.',
        action: 'Neuroimagen urgente y punción lumbar'
      });
    }

    // Diplopia aguda con signos neurológicos
    if (phase1.main_symptom === 'diplopia' && 
        phase1.symptom_duration === 'acute' &&
        phase1.associated_symptoms?.includes('ptosis')) {
      newAlerts.push({
        type: 'critical',
        title: '⚡ PARÁLISIS OCULOMOTORA AGUDA',
        message: 'Diplopia aguda + ptosis. Posible aneurisma cerebral.',
        action: 'Neuroimagen urgente con angiografía'
      });
    }

    // Trauma penetrante ocular
    if (phase1.trauma_history === 'penetrating') {
      newAlerts.push({
        type: 'critical',
        title: '🎯 TRAUMA OCULAR PENETRANTE',
        message: 'Trauma penetrante confirmado o sospechado.',
        action: 'NO manipular. Protector rígido + cirugía urgente'
      });
    }

    // Quemadura química
    if (phase1.chemical_exposure === 'alkali' || phase1.chemical_exposure === 'acid') {
      newAlerts.push({
        type: 'critical',
        title: '⚗️ QUEMADURA QUÍMICA OCULAR',
        message: 'Exposición química confirmada.',
        action: 'Irrigación copiosa inmediata por 30 minutos mínimo'
      });
    }

    // Amaurosis fugax
    if (phase1.vision_loss === 'transient' && 
        phase1.associated_symptoms?.includes('jaw_claudication')) {
      newAlerts.push({
        type: 'critical',
        title: '🩸 AMAUROSIS FUGAX + CLAUDICACIÓN',
        message: 'Amaurosis fugax + claudicación mandibular. Arteritis células gigantes.',
        action: 'Corticoides urgentes + VSG/PCR + biopsia arteria temporal'
      });
    }

    // 🟡 ALERTAS AMARILLAS - ATENCIÓN PRIORITARIA
    // Alto riesgo de glaucoma
    if (calculateGlaucomaRisk() > 70) {
      newAlerts.push({
        type: 'warning',
        title: '⚠️ ALTO RIESGO GLAUCOMA',
        message: `Riesgo calculado: ${calculateGlaucomaRisk()}%. Múltiples factores de riesgo.`,
        action: 'Campo visual + OCT + seguimiento estrecho 3 meses'
      });
    }

    // Retinopatía diabética severa
    if (calculateDiabeticRetinopathyRisk() > 60) {
      newAlerts.push({
        type: 'warning',
        title: '🩸 RETINOPATÍA DIABÉTICA SEVERA',
        message: `Severidad calculada: ${calculateDiabeticRetinopathyRisk()}%. Riesgo de progresión.`,
        action: 'Fotocoagulación láser + anti-VEGF + control metabólico estricto'
      });
    }

    // DMAE avanzada
    if (calculateAMDRisk() > 50) {
      newAlerts.push({
        type: 'warning',
        title: '👁️ DMAE AVANZADA SOSPECHA',
        message: `Riesgo DMAE: ${calculateAMDRisk()}%. Metamorfopsia + drusen extensas.`,
        action: 'OCT macular + angiografía fluoresceínica + suplementos AREDS2'
      });
    }

    // Uveítis anterior aguda
    if (phase3.anterior_chamber_cells === '3+' || phase3.anterior_chamber_flare === '3+') {
      newAlerts.push({
        type: 'warning',
        title: '🔥 UVEÍTIS ANTERIOR AGUDA',
        message: 'Células y flare 3+ en cámara anterior.',
        action: 'Corticoides tópicos + midriáticos + estudio etiológico'
      });
    }

    // 🟢 ALERTAS VERDES - SEGUIMIENTO RUTINARIO
    if (phase1.main_symptom === 'routine_checkup' && !newAlerts.some(a => a.type === 'critical' || a.type === 'warning')) {
      newAlerts.push({
        type: 'info',
        title: '✅ EVALUACIÓN RUTINARIA',
        message: 'Examen oftalmológico de control sin hallazgos críticos.',
        action: 'Seguimiento según edad y factores de riesgo'
      });
    }

    setAlerts(newAlerts);
  };

  const calculateGlaucomaRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;

    // Factores de riesgo de glaucoma
    if (phase2.age && parseInt(phase2.age) > 60) risk += 15;
    if (phase2.family_history_glaucoma === 'present') risk += 25;
    if (phase3.iop_right > 21 || phase3.iop_left > 21) risk += 20;
    if (phase3.cup_disc_ratio > 0.6) risk += 25;
    if (phase3.central_corneal_thickness < 555) risk += 15;
    if (phase2.refractive_error === 'myopia_high') risk += 10;
    if (phase2.diabetes !== 'none') risk += 5;
    if (phase3.disc_hemorrhage === 'present') risk += 15;

    return Math.min(risk, 100);
  };

  const calculateDiabeticRetinopathyRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;

    if (phase2.diabetes_duration > 10) risk += 20;
    if (phase2.hba1c > 8) risk += 25;
    if (phase3.microaneurysms === 'present') risk += 15;
    if (phase3.hard_exudates === 'present') risk += 15;
    if (phase3.cotton_wool_spots === 'present') risk += 20;
    if (phase3.venous_beading === 'present') risk += 25;
    if (phase3.neovascularization === 'present') risk += 30;
    if (phase2.hypertension === 'uncontrolled') risk += 10;

    return Math.min(risk, 100);
  };

  const calculateAMDRisk = () => {
    let risk = 0;
    const { phase1, phase2, phase3 } = formData;

    if (phase2.age && parseInt(phase2.age) > 70) risk += 20;
    if (phase2.smoking_history === 'current') risk += 15;
    if (phase2.family_history_amd === 'present') risk += 20;
    if (phase3.drusen_type === 'large') risk += 25;
    if (phase3.pigment_changes === 'present') risk += 15;
    if (phase1.metamorphopsia === 'present') risk += 20;
    if (phase2.cardiovascular_disease === 'present') risk += 10;

    return Math.min(risk, 100);
  };

  const calculateScores = () => {
    const glaucomaRisk = calculateGlaucomaRisk();
    const diabeticRetinopathyRisk = calculateDiabeticRetinopathyRisk();
    const amdRisk = calculateAMDRisk();

    setFormData(prev => ({
      ...prev,
      calculatedScores: {
        glaucomaRisk,
        diabeticRetinopathyRisk,
        amdRisk
      }
    }));
  };

  const generateAISuggestions = () => {
    const suggestions: Array<{ category: string; suggestion: string; confidence: number }> = [];
    const { phase1, phase2, phase3, calculatedScores } = formData;

    // Sugerencias basadas en IA
    if (calculatedScores?.glaucomaRisk > 70) {
      suggestions.push({
        category: 'Diagnóstico',
        suggestion: 'Solicitar campo visual automatizado y OCT de papila urgente',
        confidence: 90
      });
    }

    if (phase1.vision_loss === 'sudden') {
      suggestions.push({
        category: 'Tratamiento',
        suggestion: 'Considerar corticoides IV si neuropatía óptica isquémica',
        confidence: 85
      });
    }

    if (calculatedScores?.diabeticRetinopathyRisk > 60) {
      suggestions.push({
        category: 'Manejo',
        suggestion: 'Referencia urgente a especialista en retina para láser/anti-VEGF',
        confidence: 95
      });
    }

    if ((phase3.iop_right && phase3.iop_right > 30) || (phase3.iop_left && phase3.iop_left > 30)) {
      suggestions.push({
        category: 'Emergencia',
        suggestion: 'Protocolo glaucoma agudo: Diamox 500mg IV + manitol 20%',
        confidence: 95
      });
    }

    setFormData(prev => ({
      ...prev,
      aiSuggestions: suggestions
    }));
  };

  const updateFormData = (phase: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase as keyof OphthalmologyData],
        [field]: value
      }
    }));
  };

  const renderPhase1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 1: TRIAGE OFTALMOLÓGICO INMEDIATO</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 2-5 minutos | Clasificación de urgencia ocular</p>
        </div>
      </div>

      <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>EMERGENCIAS OFTALMOLÓGICAS:</strong> Pérdida visual súbita, dolor + náuseas + PIO alta, trauma penetrante, quemadura química
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Clasificación de Urgencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nivel de urgencia oftalmológica</Label>
              <Select value={formData.phase1.urgency_level} onValueChange={(value) => updateFormData('phase1', 'urgency_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Clasificar urgencia..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level_1">🔴 Nivel 1: Pérdida súbita visión + dolor severo</SelectItem>
                  <SelectItem value="level_2">🟠 Nivel 2: Trauma ocular + síntomas neurológicos</SelectItem>
                  <SelectItem value="level_3">🟡 Nivel 3: Síntomas agudos &lt;72h</SelectItem>
                  <SelectItem value="level_4">🟢 Nivel 4: Síntomas subagudos</SelectItem>
                  <SelectItem value="level_5">⭕ Nivel 5: Control rutinario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Síntoma principal</Label>
              <Select value={formData.phase1.main_symptom} onValueChange={(value) => updateFormData('phase1', 'main_symptom', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Síntoma predominante..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vision_loss">Pérdida de visión</SelectItem>
                  <SelectItem value="eye_pain">Dolor ocular</SelectItem>
                  <SelectItem value="diplopia">Diplopía</SelectItem>
                  <SelectItem value="flashing_lights">Destellos/fotopsias</SelectItem>
                  <SelectItem value="metamorphopsia">Metamorfopsia</SelectItem>
                  <SelectItem value="visual_field_defect">Defecto campimétrico</SelectItem>
                  <SelectItem value="red_eye">Ojo rojo</SelectItem>
                  <SelectItem value="dry_eye">Ojo seco</SelectItem>
                  <SelectItem value="routine_checkup">Control rutinario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duración de síntomas</Label>
              <Select value={formData.phase1.symptom_duration} onValueChange={(value) => updateFormData('phase1', 'symptom_duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Temporalidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acute">🚨 Agudo (&lt; 24h)</SelectItem>
                  <SelectItem value="subacute">Subagudo (1-7 días)</SelectItem>
                  <SelectItem value="chronic">Crónico (&gt; 1 semana)</SelectItem>
                  <SelectItem value="intermittent">Intermitente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Intensidad del dolor ocular (0-10)</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.phase1.pain_severity || ''}
                onChange={(e) => updateFormData('phase1', 'pain_severity', parseInt(e.target.value) || 0)}
                placeholder="0 = sin dolor, 10 = insoportable"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Criterios de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de pérdida visual</Label>
              <Select value={formData.phase1.vision_loss} onValueChange={(value) => updateFormData('phase1', 'vision_loss', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Características..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin pérdida visual</SelectItem>
                  <SelectItem value="sudden">🔴 Súbita (&lt; 24h)</SelectItem>
                  <SelectItem value="gradual">Gradual (días-semanas)</SelectItem>
                  <SelectItem value="transient">🔴 Transitoria (amaurosis fugax)</SelectItem>
                  <SelectItem value="partial">Parcial (hemianopsia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Síntomas asociados</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'nausea_vomiting', label: '🤢 Náuseas/vómitos' },
                  { id: 'severe_headache', label: '🧠 Cefalea severa' },
                  { id: 'diplopia', label: '👁️ Diplopía' },
                  { id: 'ptosis', label: '😴 Ptosis' },
                  { id: 'jaw_claudication', label: '🦷 Claudicación mandibular' },
                  { id: 'temporal_tenderness', label: '😣 Dolor temporal' }
                ].map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom.id}
                      checked={formData.phase1.associated_symptoms?.includes(symptom.id)}
                      onCheckedChange={(checked) => {
                        const current = formData.phase1.associated_symptoms || [];
                        const updated = checked 
                          ? [...current, symptom.id]
                          : current.filter((s: string) => s !== symptom.id);
                        updateFormData('phase1', 'associated_symptoms', updated);
                      }}
                    />
                    <Label htmlFor={symptom.id} className="text-sm">{symptom.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Historia de trauma</Label>
              <Select value={formData.phase1.trauma_history} onValueChange={(value) => updateFormData('phase1', 'trauma_history', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de trauma..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin trauma</SelectItem>
                  <SelectItem value="blunt">Trauma contuso</SelectItem>
                  <SelectItem value="penetrating">🔴 Trauma penetrante</SelectItem>
                  <SelectItem value="chemical">🔴 Exposición química</SelectItem>
                  <SelectItem value="thermal">Quemadura térmica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exposición química (si aplica)</Label>
              <Select value={formData.phase1.chemical_exposure} onValueChange={(value) => updateFormData('phase1', 'chemical_exposure', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de químico..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No aplica</SelectItem>
                  <SelectItem value="alkali">🔴 Álcali (más grave)</SelectItem>
                  <SelectItem value="acid">🔴 Ácido</SelectItem>
                  <SelectItem value="solvent">Solvente</SelectItem>
                  <SelectItem value="unknown">Desconocido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 2: ANAMNESIS DIRIGIDA INTELIGENTE</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 8-15 minutos | Historia oftalmológica especializada</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Factores de Riesgo Oftalmológicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Edad del paciente</Label>
              <Input
                type="number"
                min="0"
                max="120"
                value={formData.phase2.age || ''}
                onChange={(e) => updateFormData('phase2', 'age', e.target.value)}
                placeholder="Edad en años"
              />
            </div>

            <div>
              <Label>Historia familiar oftalmológica</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="family_glaucoma"
                    checked={formData.phase2.family_history_glaucoma === 'present'}
                    onCheckedChange={(checked) => updateFormData('phase2', 'family_history_glaucoma', checked ? 'present' : 'absent')}
                  />
                  <Label htmlFor="family_glaucoma">Glaucoma familiar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="family_amd"
                    checked={formData.phase2.family_history_amd === 'present'}
                    onCheckedChange={(checked) => updateFormData('phase2', 'family_history_amd', checked ? 'present' : 'absent')}
                  />
                  <Label htmlFor="family_amd">Degeneración macular familiar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="family_high_myopia"
                    checked={formData.phase2.family_history_myopia === 'present'}
                    onCheckedChange={(checked) => updateFormData('phase2', 'family_history_myopia', checked ? 'present' : 'absent')}
                  />
                  <Label htmlFor="family_high_myopia">Miopía alta familiar</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Defecto refractivo</Label>
              <Select value={formData.phase2.refractive_error} onValueChange={(value) => updateFormData('phase2', 'refractive_error', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de refracción..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin defecto conocido</SelectItem>
                  <SelectItem value="myopia_low">Miopía leve (-0.5 a -3.0)</SelectItem>
                  <SelectItem value="myopia_moderate">Miopía moderada (-3.0 a -6.0)</SelectItem>
                  <SelectItem value="myopia_high">🔴 Miopía alta (&gt; -6.0)</SelectItem>
                  <SelectItem value="hyperopia">Hipermetropía</SelectItem>
                  <SelectItem value="astigmatism">Astigmatismo</SelectItem>
                  <SelectItem value="presbyopia">Presbicia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Historia de tabaquismo</Label>
              <Select value={formData.phase2.smoking_history} onValueChange={(value) => updateFormData('phase2', 'smoking_history', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado tabáquico..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca fumó</SelectItem>
                  <SelectItem value="former">Ex-fumador</SelectItem>
                  <SelectItem value="current">🔴 Fumador actual</SelectItem>
                  <SelectItem value="heavy">🔴 Fumador pesado (&gt; 20 cig/día)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Antecedentes Sistémicos Relevantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Diabetes mellitus</Label>
              <Select value={formData.phase2.diabetes} onValueChange={(value) => updateFormData('phase2', 'diabetes', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado diabético..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin diabetes</SelectItem>
                  <SelectItem value="type_1">Diabetes tipo 1</SelectItem>
                  <SelectItem value="type_2">Diabetes tipo 2</SelectItem>
                  <SelectItem value="gestational">Diabetes gestacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.phase2.diabetes !== 'none' && formData.phase2.diabetes && (
              <>
                <div>
                  <Label>Años de evolución diabetes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.phase2.diabetes_duration || ''}
                    onChange={(e) => updateFormData('phase2', 'diabetes_duration', parseInt(e.target.value) || 0)}
                    placeholder="Años desde diagnóstico"
                  />
                </div>

                <div>
                  <Label>HbA1c más reciente (%)</Label>
                  <Input
                    type="number"
                    min="4"
                    max="15"
                    step="0.1"
                    value={formData.phase2.hba1c || ''}
                    onChange={(e) => updateFormData('phase2', 'hba1c', parseFloat(e.target.value) || 0)}
                    placeholder="Hemoglobina glicosilada"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Hipertensión arterial</Label>
              <Select value={formData.phase2.hypertension} onValueChange={(value) => updateFormData('phase2', 'hypertension', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Control tensional..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin hipertensión</SelectItem>
                  <SelectItem value="controlled">Hipertensión controlada</SelectItem>
                  <SelectItem value="uncontrolled">🔴 Hipertensión no controlada</SelectItem>
                  <SelectItem value="malignant">🔴 Hipertensión maligna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Enfermedad cardiovascular</Label>
              <Select value={formData.phase2.cardiovascular_disease} onValueChange={(value) => updateFormData('phase2', 'cardiovascular_disease', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Antecedente cardiovascular..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin enfermedad cardiovascular</SelectItem>
                  <SelectItem value="coronary">Enfermedad coronaria</SelectItem>
                  <SelectItem value="stroke">Accidente cerebrovascular</SelectItem>
                  <SelectItem value="peripheral">Enfermedad vascular periférica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Medicación con efectos oculares</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'corticosteroids', label: 'Corticosteroides sistémicos' },
                  { id: 'chloroquine', label: 'Cloroquina/hidroxicloroquina' },
                  { id: 'amiodarone', label: 'Amiodarona' },
                  { id: 'tamoxifen', label: 'Tamoxifeno' },
                  { id: 'phenothiazines', label: 'Fenotiazinas' }
                ].map((med) => (
                  <div key={med.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={med.id}
                      checked={formData.phase2.ocular_toxic_meds?.includes(med.id)}
                      onCheckedChange={(checked) => {
                        const current = formData.phase2.ocular_toxic_meds || [];
                        const updated = checked 
                          ? [...current, med.id]
                          : current.filter((m: string) => m !== med.id);
                        updateFormData('phase2', 'ocular_toxic_meds', updated);
                      }}
                    />
                    <Label htmlFor={med.id} className="text-sm">{med.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPhase3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 3: EXPLORACIÓN FÍSICA SISTEMÁTICA AVANZADA</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 15-25 minutos | Examen oftalmológico completo</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Agudeza Visual y Refracción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Agudeza visual ojo derecho (OD)</Label>
              <Select value={formData.phase3.va_right} onValueChange={(value) => updateFormData('phase3', 'va_right', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="AV OD..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20/20">20/20 (1.0)</SelectItem>
                  <SelectItem value="20/25">20/25 (0.8)</SelectItem>
                  <SelectItem value="20/30">20/30 (0.67)</SelectItem>
                  <SelectItem value="20/40">20/40 (0.5)</SelectItem>
                  <SelectItem value="20/50">20/50 (0.4)</SelectItem>
                  <SelectItem value="20/70">20/70 (0.28)</SelectItem>
                  <SelectItem value="20/100">20/100 (0.2)</SelectItem>
                  <SelectItem value="20/200">20/200 (0.1)</SelectItem>
                  <SelectItem value="20/400">20/400 (0.05)</SelectItem>
                  <SelectItem value="count_fingers">Cuenta dedos</SelectItem>
                  <SelectItem value="hand_motion">Movimiento de mano</SelectItem>
                  <SelectItem value="light_perception">Percepción de luz</SelectItem>
                  <SelectItem value="no_light_perception">No percepción de luz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Agudeza visual ojo izquierdo (OI)</Label>
              <Select value={formData.phase3.va_left} onValueChange={(value) => updateFormData('phase3', 'va_left', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="AV OI..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20/20">20/20 (1.0)</SelectItem>
                  <SelectItem value="20/25">20/25 (0.8)</SelectItem>
                  <SelectItem value="20/30">20/30 (0.67)</SelectItem>
                  <SelectItem value="20/40">20/40 (0.5)</SelectItem>
                  <SelectItem value="20/50">20/50 (0.4)</SelectItem>
                  <SelectItem value="20/70">20/70 (0.28)</SelectItem>
                  <SelectItem value="20/100">20/100 (0.2)</SelectItem>
                  <SelectItem value="20/200">20/200 (0.1)</SelectItem>
                  <SelectItem value="20/400">20/400 (0.05)</SelectItem>
                  <SelectItem value="count_fingers">Cuenta dedos</SelectItem>
                  <SelectItem value="hand_motion">Movimiento de mano</SelectItem>
                  <SelectItem value="light_perception">Percepción de luz</SelectItem>
                  <SelectItem value="no_light_perception">No percepción de luz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Campo visual por confrontación</Label>
              <Select value={formData.phase3.visual_field} onValueChange={(value) => updateFormData('phase3', 'visual_field', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Campo visual..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal bilateral</SelectItem>
                  <SelectItem value="hemianopia_right">🔴 Hemianopia derecha</SelectItem>
                  <SelectItem value="hemianopia_left">🔴 Hemianopia izquierda</SelectItem>
                  <SelectItem value="quadrantanopia">Cuadrantanopia</SelectItem>
                  <SelectItem value="central_scotoma">Escotoma central</SelectItem>
                  <SelectItem value="peripheral_defect">Defecto periférico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Visión de colores (Ishihara)</Label>
              <Select value={formData.phase3.color_vision} onValueChange={(value) => updateFormData('phase3', 'color_vision', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Visión cromática..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="protanopia">Protanopia</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia</SelectItem>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Focus className="h-5 w-5" />
              Evaluación Pupilar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Test RAPD (Marcus Gunn)</Label>
              <Select value={formData.phase3.rapd_test} onValueChange={(value) => updateFormData('phase3', 'rapd_test', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="RAPD resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negative">Negativo (normal)</SelectItem>
                  <SelectItem value="right_positive">🔴 RAPD OD positivo</SelectItem>
                  <SelectItem value="left_positive">🔴 RAPD OI positivo</SelectItem>
                  <SelectItem value="not_performed">No realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Segmento Anterior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Células y flare en cámara anterior</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Células</Label>
                  <Select value={formData.phase3.anterior_chamber_cells} onValueChange={(value) => updateFormData('phase3', 'anterior_chamber_cells', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Células..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (normal)</SelectItem>
                      <SelectItem value="1+">1+ (5-10 células)</SelectItem>
                      <SelectItem value="2+">2+ (11-20 células)</SelectItem>
                      <SelectItem value="3+">🔴 3+ (21-50 células)</SelectItem>
                      <SelectItem value="4+">🔴 4+ (&gt; 50 células)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Flare</Label>
                  <Select value={formData.phase3.anterior_chamber_flare} onValueChange={(value) => updateFormData('phase3', 'anterior_chamber_flare', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Flare..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (normal)</SelectItem>
                      <SelectItem value="1+">1+ (leve)</SelectItem>
                      <SelectItem value="2+">2+ (moderado)</SelectItem>
                      <SelectItem value="3+">🔴 3+ (severo)</SelectItem>
                      <SelectItem value="4+">🔴 4+ (muy severo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Presión Intraocular
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>PIO ojo derecho (mmHg)</Label>
              <Input
                type="number"
                min="5"
                max="80"
                value={formData.phase3.iop_right || ''}
                onChange={(e) => updateFormData('phase3', 'iop_right', parseInt(e.target.value) || 0)}
                placeholder="Presión OD en mmHg"
              />
            </div>

            <div>
              <Label>PIO ojo izquierdo (mmHg)</Label>
              <Input
                type="number"
                min="5"
                max="80"
                value={formData.phase3.iop_left || ''}
                onChange={(e) => updateFormData('phase3', 'iop_left', parseInt(e.target.value) || 0)}
                placeholder="Presión OI en mmHg"
              />
            </div>

            <div>
              <Label>Relación copa/disco (C/D)</Label>
              <Select value={formData.phase3.cup_disc_ratio} onValueChange={(value) => updateFormData('phase3', 'cup_disc_ratio', parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="C/D..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (normal)</SelectItem>
                  <SelectItem value="0.2">0.2 (normal)</SelectItem>
                  <SelectItem value="0.3">0.3 (normal)</SelectItem>
                  <SelectItem value="0.4">0.4 (límite superior)</SelectItem>
                  <SelectItem value="0.5">0.5 (sospechoso)</SelectItem>
                  <SelectItem value="0.6">🟡 0.6 (sospechoso)</SelectItem>
                  <SelectItem value="0.7">🔴 0.7 (patológico)</SelectItem>
                  <SelectItem value="0.8">🔴 0.8 (patológico)</SelectItem>
                  <SelectItem value="0.9">🔴 0.9 (muy patológico)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color del disco óptico</Label>
              <Select value={formData.phase3.optic_disc_color} onValueChange={(value) => updateFormData('phase3', 'optic_disc_color', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Color..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pink">Rosado (normal)</SelectItem>
                  <SelectItem value="pale">🔴 Pálido (atrofia)</SelectItem>
                  <SelectItem value="swollen">🔴 Edematoso (papiledema)</SelectItem>
                  <SelectItem value="hyperemic">Hiperémico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPhase4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Calculator className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 4: EVALUACIÓN COMPLEMENTARIA ESPECIALIZADA</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 10-15 minutos | Escalas y calculadoras oftalmológicas</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadoras Dinámicas Oftalmológicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">👁️ Riesgo de Glaucoma</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-red-600">
                  {formData.calculatedScores?.glaucomaRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.glaucomaRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.glaucomaRisk || 0) > 70 && "🔴 ALTO - Campo visual + OCT urgente"}
                    {(formData.calculatedScores?.glaucomaRisk || 0) > 40 && (formData.calculatedScores?.glaucomaRisk || 0) <= 70 && "🟡 MODERADO - Seguimiento 6 meses"}
                    {(formData.calculatedScores?.glaucomaRisk || 0) <= 40 && "🟢 BAJO - Seguimiento anual"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">🩸 Retinopatía Diabética</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formData.calculatedScores?.diabeticRetinopathyRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.diabeticRetinopathyRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.diabeticRetinopathyRisk || 0) > 60 && "🔴 SEVERA - Láser + anti-VEGF"}
                    {(formData.calculatedScores?.diabeticRetinopathyRisk || 0) > 30 && (formData.calculatedScores?.diabeticRetinopathyRisk || 0) <= 60 && "🟡 MODERADA - Seguimiento 3-6 meses"}
                    {(formData.calculatedScores?.diabeticRetinopathyRisk || 0) <= 30 && "🟢 LEVE - Control metabólico"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">🟡 Riesgo DMAE</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-600">
                  {formData.calculatedScores?.amdRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.amdRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.amdRisk || 0) > 50 && "🔴 ALTO - OCT + angiografía + AREDS2"}
                    {(formData.calculatedScores?.amdRisk || 0) > 25 && (formData.calculatedScores?.amdRisk || 0) <= 50 && "🟡 MODERADO - Seguimiento semestral"}
                    {(formData.calculatedScores?.amdRisk || 0) <= 25 && "🟢 BAJO - Seguimiento anual"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Escalas Oftalmológicas Específicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Escala ETDRS (Retinopatía Diabética)</Label>
              <Select value={formData.phase4.etdrs_grade} onValueChange={(value) => updateFormData('phase4', 'etdrs_grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Grado ETDRS..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin retinopatía (10)</SelectItem>
                  <SelectItem value="mild">RD leve no proliferativa (20)</SelectItem>
                  <SelectItem value="moderate">RD moderada no proliferativa (47)</SelectItem>
                  <SelectItem value="severe">🟡 RD severa no proliferativa (53)</SelectItem>
                  <SelectItem value="very_severe">🔴 RD muy severa no proliferativa (61)</SelectItem>
                  <SelectItem value="proliferative">🔴 RD proliferativa (65+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Clasificación AREDS (DMAE)</Label>
              <Select value={formData.phase4.areds_category} onValueChange={(value) => updateFormData('phase4', 'areds_category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría AREDS..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category_1">Categoría 1: Sin drusen o &lt; 63 μm</SelectItem>
                  <SelectItem value="category_2">Categoría 2: Drusen medianas sin cambios pigmentarios</SelectItem>
                  <SelectItem value="category_3">🟡 Categoría 3: Drusen grandes o cambios pigmentarios</SelectItem>
                  <SelectItem value="category_4">🔴 Categoría 4: DMAE avanzada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPhase5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 5: SÍNTESIS Y DECISIONES CLÍNICAS</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 5-10 minutos | Correlación automática y IA diagnóstica</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Síntesis Diagnóstica IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Impresión diagnóstica principal</Label>
              <Textarea
                placeholder="Diagnóstico oftalmológico más probable basado en hallazgos..."
                value={formData.phase5.primary_diagnosis || ''}
                onChange={(e) => updateFormData('phase5', 'primary_diagnosis', e.target.value)}
              />
            </div>

            <div>
              <Label>Seguimiento programado</Label>
              <Select value={formData.phase5.follow_up} onValueChange={(value) => updateFormData('phase5', 'follow_up', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Intervalo seguimiento..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24_hours">24 horas (emergencia)</SelectItem>
                  <SelectItem value="1_week">1 semana</SelectItem>
                  <SelectItem value="2_weeks">2 semanas</SelectItem>
                  <SelectItem value="1_month">1 mes</SelectItem>
                  <SelectItem value="3_months">3 meses</SelectItem>
                  <SelectItem value="6_months">6 meses</SelectItem>
                  <SelectItem value="1_year">1 año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sugerencias de IA Oftalmológica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.aiSuggestions && formData.aiSuggestions.length > 0 ? (
              formData.aiSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{suggestion.category}</Badge>
                    <span className="text-xs text-gray-500">Confianza: {suggestion.confidence}%</span>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Complete las fases anteriores para generar sugerencias de IA</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 1: return renderPhase1();
      case 2: return renderPhase2();
      case 3: return renderPhase3();
      case 4: return renderPhase4();
      case 5: return renderPhase5();
      default: return renderPhase1();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header con estadísticas y alertas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Eye className="h-8 w-8 text-white" />
              </div>
              Sistema Oftalmológico Optimizado
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Evaluación oftalmológica integral con IA especializada</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
              <div className="text-xs text-gray-500">Tiempo transcurrido</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(calculateProgress())}%</div>
              <div className="text-xs text-gray-500">Progreso global</div>
            </div>
          </div>
        </div>

        {/* Alertas inteligentes */}
        {alerts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {alerts.slice(0, 2).map((alert, index) => (
              <Alert 
                key={index}
                className={
                  alert.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                  'border-green-500 bg-green-50 dark:bg-green-950'
                }
              >
                <AlertDescription>
                  <div className="font-semibold">{alert.title}</div>
                  <div className="text-sm mt-1">{alert.message}</div>
                  {alert.action && (
                    <div className="text-xs mt-2 font-medium">
                      🎯 {alert.action}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Progress bar de fases */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Progreso por fases</span>
            <span className="text-sm text-gray-500">Fase {currentPhase}/5</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          
          <div className="flex justify-between mt-4">
            {[
              { id: 1, name: 'Triage', icon: AlertTriangle, color: 'red' },
              { id: 2, name: 'Anamnesis', icon: Brain, color: 'blue' },
              { id: 3, name: 'Exploración', icon: Search, color: 'green' },
              { id: 4, name: 'Evaluación', icon: Calculator, color: 'purple' },
              { id: 5, name: 'Síntesis', icon: Zap, color: 'orange' }
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setCurrentPhase(phase.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  currentPhase === phase.id 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' 
                    : Object.keys(formData[`phase${phase.id}` as keyof OphthalmologyData] as object).length > 0
                      ? 'bg-green-100 dark:bg-green-900 text-green-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <phase.icon className="h-4 w-4" />
                <span className="text-xs">{phase.name}</span>
                {Object.keys(formData[`phase${phase.id}` as keyof OphthalmologyData] as object).length > 0 && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la fase actual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          {renderCurrentPhase()}
        </div>

        {/* Footer con navegación */}
        <div className="border-t p-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPhase(Math.max(1, currentPhase - 1))}
              disabled={currentPhase === 1}
            >
              ← Fase anterior
            </Button>
            
            <div className="flex gap-2">
              {currentPhase < 5 && (
                <Button
                  onClick={() => setCurrentPhase(Math.min(5, currentPhase + 1))}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Siguiente fase →
                </Button>
              )}
              
              {currentPhase === 5 && (
                <Button
                  onClick={() => onComplete?.(formData)}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar evaluación oftalmológica
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}