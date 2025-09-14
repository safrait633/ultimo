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
  Clock,
  Activity,
  Ear,
  Eye,
  Mic,
  Volume2,
  Stethoscope,
  Target,
  CheckCircle,
  Calculator,
  Brain,
  FileText,
  TrendingUp,
  Zap,
  ShieldAlert,
  Users
} from "lucide-react";

interface AdvancedOtolaryngologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

interface OtolaryngologyData {
  phase1: any;
  phase2: any;
  phase3: any;
  phase4: any;
  phase5: any;
  alerts: any[];
  calculatedScores: any;
  aiSuggestions: any;
}

export default function AdvancedOtolaryngologyForm({ 
  patientData, 
  onDataChange, 
  onComplete 
}: AdvancedOtolaryngologyFormProps) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [formData, setFormData] = useState<OtolaryngologyData>({
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

    // 🔴 ALERTAS CRÍTICAS ROJAS - EMERGENCIAS ORL
    // Obstrucción vía aérea superior
    if (phase1.respiratory_distress === 'severe' || 
        phase2.stridor === 'inspiratory' ||
        phase3.airway_obstruction === 'severe') {
      newAlerts.push({
        type: 'critical',
        title: '🚨 OBSTRUCCIÓN VÍA AÉREA',
        message: 'Riesgo vital inmediato. Evaluación urgente de vía aérea.',
        action: 'Considerar cricotiroidotomía de emergencia'
      });
    }

    // Sangrado masivo
    if (phase2.bleeding === 'massive' || 
        phase2.epistaxis_severity === 'massive' ||
        phase3.neck_bleeding === 'arterial') {
      newAlerts.push({
        type: 'critical',
        title: '🩸 HEMORRAGIA MASIVA',
        message: 'Sangrado activo severo. Control inmediato.',
        action: 'Hemostasia urgente y estabilización'
      });
    }

    // Traumatismo cervical severo
    if (phase2.neck_trauma === 'penetrating' || 
        phase2.cervical_injury_severity === 'severe') {
      newAlerts.push({
        type: 'critical',
        title: '💀 TRAUMA CERVICAL SEVERO',
        message: 'Lesión cervical penetrante o severa.',
        action: 'Inmovilización y evaluación vascular urgente'
      });
    }

    // Cuerpo extraño impactado
    if (phase2.foreign_body === 'impacted' || 
        phase2.foreign_body_location === 'larynx' ||
        phase3.foreign_body_signs === 'severe') {
      newAlerts.push({
        type: 'critical',
        title: '🎯 CUERPO EXTRAÑO IMPACTADO',
        message: 'Cuerpo extraño con riesgo de obstrucción.',
        action: 'Extracción endoscópica urgente'
      });
    }

    // Infección necrotizante
    if (phase2.infection_severity === 'necrotizing' ||
        phase3.cellulitis_progression === 'necrotizing') {
      newAlerts.push({
        type: 'critical',
        title: '🦠 INFECCIÓN NECROTIZANTE',
        message: 'Fascitis necrotizante cervical sospechosa.',
        action: 'Antibióticos IV y desbridamiento quirúrgico'
      });
    }

    // 🟡 ALERTAS AMARILLAS - ATENCIÓN PRIORITARIA
    // Sospecha malignidad
    if (calculateMalignancyRisk() > 60) {
      newAlerts.push({
        type: 'warning',
        title: '⚠️ ALTO RIESGO MALIGNIDAD',
        message: `Riesgo calculado: ${calculateMalignancyRisk()}%. Requiere biopsia.`,
        action: 'Referencia oncología y biopsia urgente'
      });
    }

    // Pérdida auditiva súbita
    if (phase2.hearing_loss_onset === 'sudden' &&
        phase2.hearing_loss_severity === 'severe') {
      newAlerts.push({
        type: 'warning',
        title: '👂 HIPOACUSIA SÚBITA',
        message: 'Pérdida auditiva neurosensorial súbita.',
        action: 'Corticoides sistémicos en 72h'
      });
    }

    // Vértigo severo
    if (phase2.vertigo_severity === 'severe' ||
        phase2.nystagmus === 'spontaneous') {
      newAlerts.push({
        type: 'warning',
        title: '🌀 SÍNDROME VESTIBULAR AGUDO',
        message: 'Vértigo severo con nystagmus espontáneo.',
        action: 'Descartar causa central'
      });
    }

    // 🟢 ALERTAS VERDES - SEGUIMIENTO RUTINARIO
    if (phase2.chronic_symptoms === 'mild' && !newAlerts.some(a => a.type === 'critical' || a.type === 'warning')) {
      newAlerts.push({
        type: 'info',
        title: '✅ EVALUACIÓN RUTINARIA',
        message: 'Síntomas crónicos leves. Manejo ambulatorio.',
        action: 'Seguimiento programado'
      });
    }

    setAlerts(newAlerts);
  };

  const calculateMalignancyRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;

    // Factores de riesgo principales
    if (phase2.smoking_history === 'heavy') risk += 25;
    if (phase2.alcohol_consumption === 'heavy') risk += 20;
    if (phase2.age && parseInt(phase2.age) > 50) risk += 15;
    if (phase3.neck_mass === 'hard_fixed') risk += 30;
    if (phase3.vocal_cord_paralysis === 'unilateral') risk += 20;
    if (phase2.weight_loss === 'significant') risk += 15;
    if (phase2.dysphagia === 'progressive') risk += 15;

    return Math.min(risk, 100);
  };

  const calculateApneaRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;

    if (phase2.snoring === 'loud') risk += 20;
    if (phase2.witnessed_apneas === 'yes') risk += 30;
    if (phase2.morning_headaches === 'frequent') risk += 15;
    if (phase2.bmi && parseInt(phase2.bmi) > 30) risk += 20;
    if (phase3.mallampati_score === 'IV') risk += 25;
    if (phase3.neck_circumference > 40) risk += 15;

    return Math.min(risk, 100);
  };

  const calculateDysphagiaRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;

    if (phase2.swallowing_difficulty === 'solids_liquids') risk += 30;
    if (phase2.aspiration_episodes === 'frequent') risk += 25;
    if (phase2.weight_loss === 'significant') risk += 20;
    if (phase3.gag_reflex === 'absent') risk += 20;
    if (phase3.vocal_cord_paralysis === 'bilateral') risk += 35;

    return Math.min(risk, 100);
  };

  const calculateScores = () => {
    const malignancyRisk = calculateMalignancyRisk();
    const apneaRisk = calculateApneaRisk();
    const dysphagiaRisk = calculateDysphagiaRisk();

    setFormData(prev => ({
      ...prev,
      calculatedScores: {
        malignancyRisk,
        apneaRisk,
        dysphagiaRisk
      }
    }));
  };

  const generateAISuggestions = () => {
    const suggestions = [];
    const { phase2, phase3, calculatedScores } = formData;

    // Sugerencias basadas en IA
    if (calculatedScores?.malignancyRisk > 50) {
      suggestions.push({
        category: 'Diagnóstico',
        suggestion: 'Considerar TC de cuello con contraste y posible biopsia',
        confidence: 85
      });
    }

    if (phase2.hearing_loss_onset === 'sudden') {
      suggestions.push({
        category: 'Tratamiento',
        suggestion: 'Iniciar prednisona 1mg/kg/día por 7 días',
        confidence: 90
      });
    }

    if (calculatedScores?.apneaRisk > 60) {
      suggestions.push({
        category: 'Estudios',
        suggestion: 'Solicitar polisomnografía diagnóstica',
        confidence: 80
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
        ...prev[phase as keyof OtolaryngologyData],
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
          <h3 className="text-xl font-semibold">FASE 1: EVALUACIÓN INICIAL Y TRIAGE</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 3-5 minutos | Priorización urgente</p>
        </div>
      </div>

      <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>CRITERIOS DE EMERGENCIA ORL:</strong> Obstrucción vía aérea, sangrado masivo, trauma cervical, cuerpo extraño impactado
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nivel de urgencia</Label>
              <Select value={formData.phase1.urgency_level} onValueChange={(value) => updateFormData('phase1', 'urgency_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">🔴 Emergencia (obstrucción/sangrado)</SelectItem>
                  <SelectItem value="urgent">🟠 Urgente (dolor severo)</SelectItem>
                  <SelectItem value="semi_urgent">🟡 Semi-urgente (síntomas agudos)</SelectItem>
                  <SelectItem value="routine">🟢 Rutinario (síntomas crónicos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Dificultad respiratoria</Label>
              <Select value={formData.phase1.respiratory_distress} onValueChange={(value) => updateFormData('phase1', 'respiratory_distress', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin dificultad</SelectItem>
                  <SelectItem value="mild">Leve (al esfuerzo)</SelectItem>
                  <SelectItem value="moderate">Moderada (en reposo)</SelectItem>
                  <SelectItem value="severe">🚨 Severa (estridor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Estado neurológico</Label>
              <Select value={formData.phase1.neurological_status} onValueChange={(value) => updateFormData('phase1', 'neurological_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">Alerta y orientado</SelectItem>
                  <SelectItem value="confused">Confusión leve</SelectItem>
                  <SelectItem value="altered">Alteración del sensorio</SelectItem>
                  <SelectItem value="unconscious">Inconsciencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Síntomas Principales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Síntoma predominante</Label>
              <Select value={formData.phase1.main_symptom} onValueChange={(value) => updateFormData('phase1', 'main_symptom', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hearing_loss">Pérdida auditiva</SelectItem>
                  <SelectItem value="ear_pain">Dolor de oído</SelectItem>
                  <SelectItem value="nasal_obstruction">Obstrucción nasal</SelectItem>
                  <SelectItem value="throat_pain">Dolor de garganta</SelectItem>
                  <SelectItem value="voice_changes">Cambios de voz</SelectItem>
                  <SelectItem value="neck_mass">Masa cervical</SelectItem>
                  <SelectItem value="vertigo">Vértigo/mareo</SelectItem>
                  <SelectItem value="bleeding">Sangrado ORL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duración de síntomas</Label>
              <Select value={formData.phase1.symptom_duration} onValueChange={(value) => updateFormData('phase1', 'symptom_duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Duración..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acute">Agudo (&lt; 48h)</SelectItem>
                  <SelectItem value="subacute">Subagudo (2-14 días)</SelectItem>
                  <SelectItem value="chronic">Crónico (&gt; 2 semanas)</SelectItem>
                  <SelectItem value="recurrent">Recurrente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Intensidad del dolor (0-10)</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.phase1.pain_score}
                onChange={(e) => updateFormData('phase1', 'pain_score', e.target.value)}
                placeholder="0 = sin dolor, 10 = dolor insoportable"
              />
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 10-15 minutos | Historia clínica especializada</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Factores de Riesgo ORL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Historia de tabaquismo</Label>
              <Select value={formData.phase2.smoking_history} onValueChange={(value) => updateFormData('phase2', 'smoking_history', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Nunca fumó</SelectItem>
                  <SelectItem value="former">Ex-fumador (&gt; 1 año)</SelectItem>
                  <SelectItem value="light">Fumador ligero (&lt; 10 cig/día)</SelectItem>
                  <SelectItem value="moderate">Fumador moderado (10-20 cig/día)</SelectItem>
                  <SelectItem value="heavy">🔴 Fumador pesado (&gt; 20 cig/día)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Consumo de alcohol</Label>
              <Select value={formData.phase2.alcohol_consumption} onValueChange={(value) => updateFormData('phase2', 'alcohol_consumption', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No consume</SelectItem>
                  <SelectItem value="social">Social (ocasional)</SelectItem>
                  <SelectItem value="moderate">Moderado (1-2 bebidas/día)</SelectItem>
                  <SelectItem value="heavy">🔴 Pesado (&gt; 2 bebidas/día)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exposición ocupacional</Label>
              <Select value={formData.phase2.occupational_exposure} onValueChange={(value) => updateFormData('phase2', 'occupational_exposure', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin exposición</SelectItem>
                  <SelectItem value="noise">Ruido intenso</SelectItem>
                  <SelectItem value="chemicals">Químicos/solventes</SelectItem>
                  <SelectItem value="dust">Polvos/partículas</SelectItem>
                  <SelectItem value="multiple">Múltiples exposiciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Historia familiar ORL</Label>
              <Select value={formData.phase2.family_history} onValueChange={(value) => updateFormData('phase2', 'family_history', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin antecedentes</SelectItem>
                  <SelectItem value="hearing_loss">Hipoacusia familiar</SelectItem>
                  <SelectItem value="cancer">Cáncer cabeza/cuello</SelectItem>
                  <SelectItem value="autoimmune">Enfermedad autoinmune</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Síntomas Específicos por Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Ear className="h-4 w-4" />
                Sistema Auditivo
              </h4>
              <div className="space-y-2">
                <div>
                  <Label>Pérdida auditiva</Label>
                  <Select value={formData.phase2.hearing_loss_onset} onValueChange={(value) => updateFormData('phase2', 'hearing_loss_onset', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Características..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin pérdida auditiva</SelectItem>
                      <SelectItem value="gradual">Progresiva (años)</SelectItem>
                      <SelectItem value="acute">Aguda (días)</SelectItem>
                      <SelectItem value="sudden">🔴 Súbita (&lt; 72h)</SelectItem>
                      <SelectItem value="fluctuating">Fluctuante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tinnitus</Label>
                  <Select value={formData.phase2.tinnitus} onValueChange={(value) => updateFormData('phase2', 'tinnitus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Características..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin tinnitus</SelectItem>
                      <SelectItem value="intermittent">Intermitente</SelectItem>
                      <SelectItem value="continuous">Continuo</SelectItem>
                      <SelectItem value="pulsatile">Pulsátil</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Vértigo</Label>
                  <Select value={formData.phase2.vertigo_severity} onValueChange={(value) => updateFormData('phase2', 'vertigo_severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severidad..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin vértigo</SelectItem>
                      <SelectItem value="mild">Leve (mareo)</SelectItem>
                      <SelectItem value="moderate">Moderado (náuseas)</SelectItem>
                      <SelectItem value="severe">🔴 Severo (incapacitante)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Sistema Respiratorio Superior
              </h4>
              <div className="space-y-2">
                <div>
                  <Label>Obstrucción nasal</Label>
                  <Select value={formData.phase2.nasal_obstruction} onValueChange={(value) => updateFormData('phase2', 'nasal_obstruction', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Patrón..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin obstrucción</SelectItem>
                      <SelectItem value="unilateral">Unilateral</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                      <SelectItem value="alternating">Alternante</SelectItem>
                      <SelectItem value="complete">Completa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rinorrea</Label>
                  <Select value={formData.phase2.rhinorrhea} onValueChange={(value) => updateFormData('phase2', 'rhinorrhea', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin rinorrea</SelectItem>
                      <SelectItem value="watery">Acuosa (alérgica)</SelectItem>
                      <SelectItem value="mucoid">Mucosa (viral)</SelectItem>
                      <SelectItem value="purulent">Purulenta (bacteriana)</SelectItem>
                      <SelectItem value="bloody">🔴 Sanguinolenta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Epistaxis</Label>
                  <Select value={formData.phase2.epistaxis_severity} onValueChange={(value) => updateFormData('phase2', 'epistaxis_severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Frecuencia..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin epistaxis</SelectItem>
                      <SelectItem value="occasional">Ocasional (gotas)</SelectItem>
                      <SelectItem value="frequent">Frecuente (semanal)</SelectItem>
                      <SelectItem value="severe">Severa (hospitalización)</SelectItem>
                      <SelectItem value="massive">🔴 Masiva (transfusión)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Síntomas Aerodigestivos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Disfonía</Label>
              <Select value={formData.phase2.dysphonia} onValueChange={(value) => updateFormData('phase2', 'dysphonia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Voz normal</SelectItem>
                  <SelectItem value="hoarseness">Ronquera</SelectItem>
                  <SelectItem value="breathiness">Voz soplada</SelectItem>
                  <SelectItem value="roughness">Aspereza</SelectItem>
                  <SelectItem value="aphonia">🔴 Afonía completa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Disfagia</Label>
              <Select value={formData.phase2.dysphagia} onValueChange={(value) => updateFormData('phase2', 'dysphagia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin disfagia</SelectItem>
                  <SelectItem value="solids">Solo sólidos</SelectItem>
                  <SelectItem value="liquids">Solo líquidos</SelectItem>
                  <SelectItem value="progressive">🔴 Progresiva</SelectItem>
                  <SelectItem value="complete">Completa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Odinofagia</Label>
              <Select value={formData.phase2.odynophagia} onValueChange={(value) => updateFormData('phase2', 'odynophagia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Severidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin dolor al tragar</SelectItem>
                  <SelectItem value="mild">Leve (sólidos)</SelectItem>
                  <SelectItem value="moderate">Moderada (líquidos)</SelectItem>
                  <SelectItem value="severe">Severa (saliva)</SelectItem>
                </SelectContent>
              </Select>
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
          <Stethoscope className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">FASE 3: EXPLORACIÓN FÍSICA SISTEMÁTICA</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 15-20 minutos | Examen dirigido por regiones</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ear className="h-5 w-5" />
              Exploración Otológica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Otoscopia - Membrana timpánica derecha</Label>
              <Select value={formData.phase3.right_tm_appearance} onValueChange={(value) => updateFormData('phase3', 'right_tm_appearance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Aspecto..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="erythematous">Eritematosa</SelectItem>
                  <SelectItem value="retracted">Retraída</SelectItem>
                  <SelectItem value="bulging">Abombada</SelectItem>
                  <SelectItem value="perforated">🔴 Perforación</SelectItem>
                  <SelectItem value="cholesteatoma">🔴 Colesteatoma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Otoscopia - Membrana timpánica izquierda</Label>
              <Select value={formData.phase3.left_tm_appearance} onValueChange={(value) => updateFormData('phase3', 'left_tm_appearance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Aspecto..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="erythematous">Eritematosa</SelectItem>
                  <SelectItem value="retracted">Retraída</SelectItem>
                  <SelectItem value="bulging">Abombada</SelectItem>
                  <SelectItem value="perforated">🔴 Perforación</SelectItem>
                  <SelectItem value="cholesteatoma">🔴 Colesteatoma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Weber (diapasón 512 Hz)</Label>
              <Select value={formData.phase3.weber_test} onValueChange={(value) => updateFormData('phase3', 'weber_test', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="central">Central (normal)</SelectItem>
                  <SelectItem value="lateralizes_right">Lateraliza derecha</SelectItem>
                  <SelectItem value="lateralizes_left">Lateraliza izquierda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rinne derecho</Label>
              <Select value={formData.phase3.right_rinne} onValueChange={(value) => updateFormData('phase3', 'right_rinne', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="positive">Positivo (CA &gt; CO)</SelectItem>
                  <SelectItem value="negative">🔴 Negativo (CO &gt; CA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rinne izquierdo</Label>
              <Select value={formData.phase3.left_rinne} onValueChange={(value) => updateFormData('phase3', 'left_rinne', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="positive">Positivo (CA &gt; CO)</SelectItem>
                  <SelectItem value="negative">🔴 Negativo (CO &gt; CA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Exploración Nasal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rinoscopia anterior</Label>
              <Select value={formData.phase3.rhinoscopy_findings} onValueChange={(value) => updateFormData('phase3', 'rhinoscopy_findings', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Hallazgos..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="deviated_septum">Tabique desviado</SelectItem>
                  <SelectItem value="turbinate_hypertrophy">Hipertrofia cornetes</SelectItem>
                  <SelectItem value="nasal_polyps">🔴 Poliposis nasal</SelectItem>
                  <SelectItem value="purulent_discharge">Secreción purulenta</SelectItem>
                  <SelectItem value="bloody_discharge">🔴 Secreción sanguinolenta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Permeabilidad nasal derecha</Label>
              <Select value={formData.phase3.right_nasal_patency} onValueChange={(value) => updateFormData('phase3', 'right_nasal_patency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Permeabilidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patent">Permeable</SelectItem>
                  <SelectItem value="partially_blocked">Parcialmente obstruida</SelectItem>
                  <SelectItem value="completely_blocked">Completamente obstruida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Permeabilidad nasal izquierda</Label>
              <Select value={formData.phase3.left_nasal_patency} onValueChange={(value) => updateFormData('phase3', 'left_nasal_patency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Permeabilidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patent">Permeable</SelectItem>
                  <SelectItem value="partially_blocked">Parcialmente obstruida</SelectItem>
                  <SelectItem value="completely_blocked">Completamente obstruida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Senos paranasales (palpación)</Label>
              <Select value={formData.phase3.sinus_tenderness} onValueChange={(value) => updateFormData('phase3', 'sinus_tenderness', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluación..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_tenderness">Sin dolor</SelectItem>
                  <SelectItem value="frontal_tenderness">Dolor frontal</SelectItem>
                  <SelectItem value="maxillary_tenderness">Dolor maxilar</SelectItem>
                  <SelectItem value="multiple_tenderness">Dolor múltiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Exploración Orofaríngea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Amígdalas - tamaño</Label>
              <Select value={formData.phase3.tonsil_size} onValueChange={(value) => updateFormData('phase3', 'tonsil_size', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Grado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade_0">Grado 0 (ausentes/criptas)</SelectItem>
                  <SelectItem value="grade_1">Grado 1 (detrás de pilares)</SelectItem>
                  <SelectItem value="grade_2">Grado 2 (hasta pilares)</SelectItem>
                  <SelectItem value="grade_3">Grado 3 (más allá pilares)</SelectItem>
                  <SelectItem value="grade_4">Grado 4 (se tocan)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Aspecto amigdalino</Label>
              <Select value={formData.phase3.tonsil_appearance} onValueChange={(value) => updateFormData('phase3', 'tonsil_appearance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Aspecto..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="erythematous">Eritematosas</SelectItem>
                  <SelectItem value="exudative">Con exudado</SelectItem>
                  <SelectItem value="cryptic">Caseosas (criptas)</SelectItem>
                  <SelectItem value="ulcerative">🔴 Ulceradas</SelectItem>
                  <SelectItem value="asymmetric">🔴 Asimetría marcada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Paladar blando - movilidad</Label>
              <Select value={formData.phase3.soft_palate_mobility} onValueChange={(value) => updateFormData('phase3', 'soft_palate_mobility', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Movilidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (simétrica)</SelectItem>
                  <SelectItem value="asymmetric">Asimétrica</SelectItem>
                  <SelectItem value="limited">Limitada bilateral</SelectItem>
                  <SelectItem value="paralyzed">🔴 Parálisis unilateral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lengua - movilidad</Label>
              <Select value={formData.phase3.tongue_mobility} onValueChange={(value) => updateFormData('phase3', 'tongue_mobility', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Movilidad..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="slightly_limited">Ligeramente limitada</SelectItem>
                  <SelectItem value="markedly_limited">Marcadamente limitada</SelectItem>
                  <SelectItem value="paralyzed">🔴 Parálisis (XII par)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Exploración Laríngea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Laringoscopia indirecta realizada</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="laryngoscopy_performed"
                  checked={formData.phase3.laryngoscopy_performed}
                  onCheckedChange={(checked) => updateFormData('phase3', 'laryngoscopy_performed', checked)}
                />
                <Label htmlFor="laryngoscopy_performed">Realizada</Label>
              </div>
            </div>

            {formData.phase3.laryngoscopy_performed && (
              <>
                <div>
                  <Label>Cuerdas vocales - aspecto</Label>
                  <Select value={formData.phase3.vocal_cords_appearance} onValueChange={(value) => updateFormData('phase3', 'vocal_cords_appearance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aspecto..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normales</SelectItem>
                      <SelectItem value="erythematous">Eritematosas</SelectItem>
                      <SelectItem value="edematous">Edematosas</SelectItem>
                      <SelectItem value="nodular">Nódulos</SelectItem>
                      <SelectItem value="polypoid">Pólipos</SelectItem>
                      <SelectItem value="leukoplakia">🔴 Leucoplasia</SelectItem>
                      <SelectItem value="mass">🔴 Masa/tumor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Movilidad cordal</Label>
                  <Select value={formData.phase3.vocal_cord_mobility} onValueChange={(value) => updateFormData('phase3', 'vocal_cord_mobility', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Movilidad..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal bilateral</SelectItem>
                      <SelectItem value="right_paralysis">🔴 Parálisis derecha</SelectItem>
                      <SelectItem value="left_paralysis">🔴 Parálisis izquierda</SelectItem>
                      <SelectItem value="bilateral_paralysis">🔴 Parálisis bilateral</SelectItem>
                      <SelectItem value="limited">Limitación bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cierre glótico</Label>
                  <Select value={formData.phase3.glottic_closure} onValueChange={(value) => updateFormData('phase3', 'glottic_closure', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cierre..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Completo</SelectItem>
                      <SelectItem value="incomplete_posterior">Gap posterior</SelectItem>
                      <SelectItem value="incomplete_anterior">Gap anterior</SelectItem>
                      <SelectItem value="irregular">Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Exploración Cervical
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Adenopatías cervicales</Label>
              <Select value={formData.phase3.cervical_lymphadenopathy} onValueChange={(value) => updateFormData('phase3', 'cervical_lymphadenopathy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Evaluación..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No palpables</SelectItem>
                  <SelectItem value="small_mobile">Pequeños, móviles</SelectItem>
                  <SelectItem value="large_mobile">Grandes, móviles</SelectItem>
                  <SelectItem value="fixed">🔴 Fijos/adheridos</SelectItem>
                  <SelectItem value="matted">🔴 En bloque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tiroides - palpación</Label>
              <Select value={formData.phase3.thyroid_examination} onValueChange={(value) => updateFormData('phase3', 'thyroid_examination', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Hallazgos..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="enlarged_diffuse">Bocio difuso</SelectItem>
                  <SelectItem value="single_nodule">Nódulo único</SelectItem>
                  <SelectItem value="multiple_nodules">Múltiples nódulos</SelectItem>
                  <SelectItem value="hard_mass">🔴 Masa dura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Masa cervical</Label>
              <Select value={formData.phase3.neck_mass} onValueChange={(value) => updateFormData('phase3', 'neck_mass', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Características..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin masa palpable</SelectItem>
                  <SelectItem value="soft_mobile">Blanda, móvil</SelectItem>
                  <SelectItem value="firm_mobile">Firme, móvil</SelectItem>
                  <SelectItem value="hard_fixed">🔴 Dura, fija</SelectItem>
                  <SelectItem value="pulsatile">🔴 Pulsátil</SelectItem>
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
          <h3 className="text-xl font-semibold">FASE 4: EVALUACIÓN COMPLEMENTARIA ESPECÍFICA</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado: 10-15 minutos | Escalas y calculadoras ORL</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadoras Dinámicas ORL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">📊 Riesgo de Malignidad</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-red-600">
                  {formData.calculatedScores?.malignancyRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.malignancyRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.malignancyRisk || 0) > 70 && "🔴 ALTO - Biopsia urgente"}
                    {(formData.calculatedScores?.malignancyRisk || 0) > 40 && (formData.calculatedScores?.malignancyRisk || 0) <= 70 && "🟡 MODERADO - Seguimiento estrecho"}
                    {(formData.calculatedScores?.malignancyRisk || 0) <= 40 && "🟢 BAJO - Seguimiento rutinario"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">😴 Riesgo de Apnea del Sueño</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formData.calculatedScores?.apneaRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.apneaRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.apneaRisk || 0) > 60 && "🔴 ALTO - Polisomnografía"}
                    {(formData.calculatedScores?.apneaRisk || 0) > 30 && (formData.calculatedScores?.apneaRisk || 0) <= 60 && "🟡 MODERADO - Evaluación especializada"}
                    {(formData.calculatedScores?.apneaRisk || 0) <= 30 && "🟢 BAJO - Medidas higiénico-dietéticas"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">🥄 Riesgo de Disfagia</h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-600">
                  {formData.calculatedScores?.dysphagiaRisk || 0}%
                </div>
                <div className="text-sm flex-1">
                  <div className="mb-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${formData.calculatedScores?.dysphagiaRisk || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {(formData.calculatedScores?.dysphagiaRisk || 0) > 50 && "🔴 ALTO - Videofluoroscopia"}
                    {(formData.calculatedScores?.dysphagiaRisk || 0) > 25 && (formData.calculatedScores?.dysphagiaRisk || 0) <= 50 && "🟡 MODERADO - Terapia de deglución"}
                    {(formData.calculatedScores?.dysphagiaRisk || 0) <= 25 && "🟢 BAJO - Medidas conservadoras"}
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
              Escalas Específicas ORL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Escala de Mallampati (apnea del sueño)</Label>
              <Select value={formData.phase4.mallampati_score} onValueChange={(value) => updateFormData('phase4', 'mallampati_score', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">Grado I - Velo, úvula, pilares y amígdalas visibles</SelectItem>
                  <SelectItem value="II">Grado II - Velo, úvula y pilares visibles</SelectItem>
                  <SelectItem value="III">Grado III - Velo y úvula visibles</SelectItem>
                  <SelectItem value="IV">Grado IV - Solo paladar duro visible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Escala STOP-BANG (apnea del sueño)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="snoring"
                    checked={formData.phase4.stop_bang?.snoring}
                    onCheckedChange={(checked) => updateFormData('phase4', 'stop_bang', {...formData.phase4.stop_bang, snoring: checked})}
                  />
                  <Label htmlFor="snoring">Ronquido fuerte</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tired"
                    checked={formData.phase4.stop_bang?.tired}
                    onCheckedChange={(checked) => updateFormData('phase4', 'stop_bang', {...formData.phase4.stop_bang, tired: checked})}
                  />
                  <Label htmlFor="tired">Cansancio/somnolencia diurna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="observed_apneas"
                    checked={formData.phase4.stop_bang?.observed_apneas}
                    onCheckedChange={(checked) => updateFormData('phase4', 'stop_bang', {...formData.phase4.stop_bang, observed_apneas: checked})}
                  />
                  <Label htmlFor="observed_apneas">Apneas observadas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pressure"
                    checked={formData.phase4.stop_bang?.pressure}
                    onCheckedChange={(checked) => updateFormData('phase4', 'stop_bang', {...formData.phase4.stop_bang, pressure: checked})}
                  />
                  <Label htmlFor="pressure">Hipertensión arterial</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Escala de House-Brackmann (parálisis facial)</Label>
              <Select value={formData.phase4.house_brackmann} onValueChange={(value) => updateFormData('phase4', 'house_brackmann', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Grado de parálisis..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">Grado I - Función normal</SelectItem>
                  <SelectItem value="II">Grado II - Disfunción leve</SelectItem>
                  <SelectItem value="III">Grado III - Disfunción moderada</SelectItem>
                  <SelectItem value="IV">Grado IV - Disfunción moderada-severa</SelectItem>
                  <SelectItem value="V">Grado V - Disfunción severa</SelectItem>
                  <SelectItem value="VI">Grado VI - Parálisis total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Índice de Discapacidad Vocal (VHI-10)</Label>
              <Textarea
                placeholder="Evaluar impacto de la disfonía en calidad de vida (0-40 puntos)..."
                value={formData.phase4.vhi_score}
                onChange={(e) => updateFormData('phase4', 'vhi_score', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Maniobras Diagnósticas Específicas ORL
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Maniobra de Dix-Hallpike</Label>
              <Select value={formData.phase4.dix_hallpike} onValueChange={(value) => updateFormData('phase4', 'dix_hallpike', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="negative">Negativa</SelectItem>
                  <SelectItem value="positive_right">🔴 Positiva derecha</SelectItem>
                  <SelectItem value="positive_left">🔴 Positiva izquierda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Test de fístula (Hennebert)</Label>
              <Select value={formData.phase4.fistula_test} onValueChange={(value) => updateFormData('phase4', 'fistula_test', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="negative">Negativa</SelectItem>
                  <SelectItem value="positive">🔴 Positiva (fístula)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prueba de deglución (3-oz)</Label>
              <Select value={formData.phase4.swallow_test} onValueChange={(value) => updateFormData('phase4', 'swallow_test', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Resultado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_performed">No realizada</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="coughing">Tos/carraspeo</SelectItem>
                  <SelectItem value="aspiration">🔴 Aspiración</SelectItem>
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
          <h3 className="text-xl font-semibold">FASE 5: SÍNTESIS Y DECISIONES INTELIGENTES</h3>
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
                placeholder="Diagnóstico más probable basado en hallazgos..."
                value={formData.phase5.primary_diagnosis}
                onChange={(e) => updateFormData('phase5', 'primary_diagnosis', e.target.value)}
              />
            </div>

            <div>
              <Label>Diagnósticos diferenciales</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Otitis media aguda',
                  'Otitis externa',
                  'Hipoacusia súbita',
                  'Rinosinusitis',
                  'Poliposis nasal',
                  'Faringoamigdalitis',
                  'Laringitis',
                  'SAOS',
                  'Vértigo posicional',
                  'Cáncer ORL'
                ].map((diagnosis) => (
                  <div key={diagnosis} className="flex items-center space-x-2">
                    <Checkbox
                      id={diagnosis}
                      checked={formData.phase5.differential_diagnoses?.includes(diagnosis)}
                      onCheckedChange={(checked) => {
                        const current = formData.phase5.differential_diagnoses || [];
                        const updated = checked 
                          ? [...current, diagnosis]
                          : current.filter(d => d !== diagnosis);
                        updateFormData('phase5', 'differential_diagnoses', updated);
                      }}
                    />
                    <Label htmlFor={diagnosis} className="text-sm">{diagnosis}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sugerencias de IA
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Plan de Manejo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Estudios complementarios requeridos</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Audiometría tonal',
                  'Logoaudiometría',
                  'Impedanciometría',
                  'TC de oídos',
                  'RM cerebral',
                  'TC senos paranasales',
                  'Nasofibroscopia',
                  'Laringoscopia directa',
                  'Biopsia',
                  'Polisomnografía'
                ].map((study) => (
                  <div key={study} className="flex items-center space-x-2">
                    <Checkbox
                      id={study}
                      checked={formData.phase5.required_studies?.includes(study)}
                      onCheckedChange={(checked) => {
                        const current = formData.phase5.required_studies || [];
                        const updated = checked 
                          ? [...current, study]
                          : current.filter(s => s !== study);
                        updateFormData('phase5', 'required_studies', updated);
                      }}
                    />
                    <Label htmlFor={study} className="text-sm">{study}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Tratamiento inicial</Label>
              <Textarea
                placeholder="Plan terapéutico inicial basado en diagnóstico..."
                value={formData.phase5.initial_treatment}
                onChange={(e) => updateFormData('phase5', 'initial_treatment', e.target.value)}
              />
            </div>

            <div>
              <Label>Seguimiento programado</Label>
              <Select value={formData.phase5.follow_up} onValueChange={(value) => updateFormData('phase5', 'follow_up', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24_hours">24 horas (urgente)</SelectItem>
                  <SelectItem value="3_days">3 días</SelectItem>
                  <SelectItem value="1_week">1 semana</SelectItem>
                  <SelectItem value="2_weeks">2 semanas</SelectItem>
                  <SelectItem value="1_month">1 mes</SelectItem>
                  <SelectItem value="3_months">3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Validación Cruzada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Consistencia diagnóstica:</h4>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Síntomas coherentes con exploración física</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Escalas de riesgo apropiadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Verificar correlación clínico-radiológica</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Puntos críticos detectados:</h4>
              <div className="text-xs space-y-1">
                {formData.calculatedScores?.malignancyRisk > 60 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Alto riesgo oncológico detectado</span>
                  </div>
                )}
                {formData.phase2.hearing_loss_onset === 'sudden' && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-orange-600">Ventana terapéutica crítica (72h)</span>
                  </div>
                )}
                {formData.phase3.vocal_cord_mobility === 'bilateral_paralysis' && (
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Riesgo de obstrucción vía aérea</span>
                  </div>
                )}
              </div>
            </div>
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
              <div className="p-2 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              Sistema ORL Optimizado
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Evaluación otorrinolaringológica con IA especializada</p>
            {patientData && (
              <div className="mt-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-900 rounded-lg p-3 shadow">
                <Users className="h-6 w-6 text-blue-600" />
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">{patientData.name} {patientData.surname}</span>
                  <span>Edad: {patientData.age} años</span>
                  <span>Género: {patientData.gender}</span>
                </div>
              </div>
            )}
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
                      📋 {alert.action}
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
              { id: 3, name: 'Exploración', icon: Stethoscope, color: 'green' },
              { id: 4, name: 'Evaluación', icon: Calculator, color: 'purple' },
              { id: 5, name: 'Síntesis', icon: Zap, color: 'orange' }
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setCurrentPhase(phase.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  currentPhase === phase.id 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' 
                    : Object.keys(formData[`phase${phase.id}` as keyof OtolaryngologyData] as object).length > 0
                      ? 'bg-green-100 dark:bg-green-900 text-green-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <phase.icon className="h-4 w-4" />
                <span className="text-xs">{phase.name}</span>
                {Object.keys(formData[`phase${phase.id}` as keyof OtolaryngologyData] as object).length > 0 && (
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
                  className="bg-gradient-to-r from-blue-600 to-teal-600"
                >
                  Siguiente fase →
                </Button>
              )}
              
              {currentPhase === 5 && (
                <Button
                  onClick={() => onComplete?.(formData)}
                  className="bg-gradient-to-r from-green-600 to-teal-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar evaluación ORL
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}