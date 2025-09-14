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
import { 
  Stethoscope,
  Search, 
  AlertTriangle, 
  Target,
  CheckCircle,
  FileText,
  Activity,
  Hand,
  Clock,
  Heart,
  Zap,
  Eye,
  User
} from "lucide-react";

interface AdvancedDermatologyFormProps {
  patientData?: any;
  onDataChange?: (data: any) => void;
  onComplete?: (data: any) => void;
}

const AdvancedDermatologyForm = ({ patientData, onDataChange, onComplete }: AdvancedDermatologyFormProps) => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    action?: string;
  }>>([]);

  const [formData, setFormData] = useState({
    // FASE 1: EVALUACIÓN INICIAL Y TRIAGE
    phase1: {
      // Clasificación de gravedad inmediata
      urgency_level: '',
      main_complaint: '',
      symptom_duration: '',
      body_surface_affected: '',
      vital_signs_altered: '',
      general_condition: '',
      
      // Detección de emergencias dermatológicas
      suspected_emergency: '',
      stevens_johnson_signs: '',
      anaphylaxis_signs: '',
      necrotizing_fasciitis_signs: '',
      erythroderma_signs: '',
      
      // Signos de alarma
      fever_present: '',
      systemic_compromise: '',
      respiratory_distress: '',
      hemodynamic_instability: '',
      altered_consciousness: '',
      
      // Evaluación inicial de superficie corporal
      affected_percentage: '',
      distribution_pattern: '',
      morphology_primary: '',
      associated_symptoms: [] as string[]
    },

    // FASE 2: ANAMNESIS DIRIGIDA INTELIGENTE  
    phase2: {
      // Síntomas principales con validación
      pruritus_intensity: '0',
      pruritus_pattern: '',
      pain_characteristics: '',
      morphological_changes: '',
      systemic_symptoms: '',
      
      // Antecedentes relevantes para dermatología
      personal_dermatologic_history: [] as string[],
      family_history_skin: [] as string[],
      skin_cancer_history: '',
      phototype: '',
      chronic_sun_exposure: '',
      occupational_exposures: [] as string[],
      recent_travels: '',
      geographic_exposures: '',
      
      // Factores de riesgo específicos
      cardiovascular_risk: '',
      sti_risk_factors: [] as string[],
      sexual_history_detailed: '',
      immunosuppression_risk: '',
      nutritional_status: '',
      psychosocial_impact: '',
      
      // Medicación actual y alergias
      current_medications: [] as string[],
      drug_induced_reactions: '',
      previous_treatments: [] as string[],
      known_allergies: [] as string[],
      adverse_reactions: '',
      topical_medications: '',
      
      // Evaluación de contactos/exposiciones
      similar_cases_contacts: '',
      occupational_allergens: '',
      sexual_contacts: '',
      zoonotic_exposure: '',
      community_outbreaks: ''
    },

    // FASE 3: EXPLORACIÓN FÍSICA SISTEMÁTICA
    phase3: {
      // Exploración dermatológica general
      general_inspection: '',
      distribution_anatomical: '',
      morphology_detailed: '',
      palpation_findings: '',
      surface_area_calculation: '',
      photographic_documentation: '',
      
      // Exploración dirigida por sospecha diagnóstica
      psoriasis_specific_areas: '',
      atopic_dermatitis_areas: '',
      genital_examination: '',
      lymph_nodes_evaluation: '',
      malignancy_evaluation: '',
      
      // Maniobras específicas de dermatología
      dermoscopy_findings: '',
      dermatologic_signs: '',
      provocation_tests: '',
      diascopy_results: '',
      vitropression_findings: '',
      
      // Anexos cutáneos
      nail_examination: '',
      hair_evaluation: '',
      mucous_membranes: '',
      
      // Búsqueda dirigida de complicaciones
      bacterial_superinfection: '',
      lymphangitis_adenitis: '',
      systemic_manifestations: '',
      ocular_complications: '',
      joint_involvement: ''
    },

    // FASE 4: EVALUACIÓN COMPLEMENTARIA
    phase4: {
      // Escalas específicas calculadas automáticamente
      pasi_score: 0,
      scorad_score: 0,
      dlqi_score: 0,
      vas_pruritus: '',
      global_severity_index: 0,
      
      // Calculadoras de riesgo
      cardiovascular_psoriasis_risk: 0,
      melanoma_progression_risk: 0,
      sti_risk_calculation: 0,
      adverse_drug_reactions_risk: 0,
      
      // Criterios diagnósticos automáticos
      psoriasis_criteria_met: false,
      atopic_dermatitis_criteria: false,
      cutaneous_lupus_criteria: false,
      sti_criteria: false,
      
      // Índices pronósticos
      treatment_response_prediction: 0,
      recurrence_risk: 0,
      remission_probability: 0,
      poor_prognosis_factors: []
    },

    // FASE 5: SÍNTESIS Y DECISIONES
    phase5: {
      // Correlación clínica automática
      symptom_finding_concordance: '',
      diagnostic_validation: '',
      inconsistencies_detected: [],
      additional_evaluation_suggested: '',
      
      // Estratificación final de riesgo
      immediate_risk: '',
      progression_risk: '',
      transmission_risk: '',
      recurrence_risk: '',
      
      // Recomendaciones de manejo automáticas
      therapeutic_protocol: '',
      specialist_referral_criteria: '',
      complementary_studies: [] as string[],
      specific_preventive_measures: '',
      
      // Criterios de seguimiento
      follow_up_frequency: '',
      monitoring_parameters: [] as string[],
      improvement_criteria: '',
      re_evaluation_indications: ''
    },

    // Puntajes calculados automáticamente
    calculatedScores: {
      pasiScore: 0,
      scoradScore: 0,
      dlqiScore: 0,
      cardiovascularRisk: 0,
      melanomaRisk: 0,
      stiRisk: 0
    },

    // Sugerencias IA
    aiSuggestions: [] as Array<{category: string, suggestion: string, confidence: number}>
  });

  const updateFormData = (phase: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        [field]: value
      }
    }));
  };

  // SISTEMAS INTELIGENTES ESPECÍFICOS

  // 1. ALERTAS AUTOMÁTICAS ESPECIALIZADAS
  const checkEmergencyAlerts = () => {
    const newAlerts = [];
    const { phase1, phase2, phase3 } = formData;

    // ALERTAS ROJAS - Derivación Inmediata
    if (phase1.stevens_johnson_signs === 'present' && 
        phase1.fever_present === 'yes' &&
        phase3.mucous_membranes === 'affected') {
      newAlerts.push({
        id: 'stevens_johnson',
        type: 'critical' as const,
        message: 'EMERGENCIA: Posible Síndrome Stevens-Johnson/NET - Derivación inmediata urgente',
        action: 'Referir inmediatamente a centro especializado'
      });
    }

    if (phase1.anaphylaxis_signs === 'present' && 
        phase1.systemic_compromise === 'severe' &&
        phase1.respiratory_distress === 'yes') {
      newAlerts.push({
        id: 'anaphylaxis',
        type: 'critical' as const,
        message: 'EMERGENCIA: Anafilaxia/Angioedema agudo - Manejo inmediato',
        action: 'Adrenalina IM, corticoides IV, antihistamínicos'
      });
    }

    if (phase1.necrotizing_fasciitis_signs === 'present' && 
        phase1.fever_present === 'yes' &&
        phase3.bacterial_superinfection === 'severe') {
      newAlerts.push({
        id: 'necrotizing_fasciitis',
        type: 'critical' as const,
        message: 'EMERGENCIA: Sospecha fascitis necrotizante - Cirugía urgente',
        action: 'Derivación inmediata a cirugía + antibióticos IV'
      });
    }

    if (phase1.erythroderma_signs === 'present' && 
        phase1.affected_percentage >= '90' &&
        phase1.systemic_compromise === 'present') {
      newAlerts.push({
        id: 'erythroderma',
        type: 'critical' as const,
        message: 'EMERGENCIA: Eritrodermia con compromiso sistémico',
        action: 'Hospitalización inmediata + manejo multidisciplinar'
      });
    }

    if (phase3.dermoscopy_findings === 'melanoma_suspicious' && 
        phase3.lymph_nodes_evaluation === 'enlarged') {
      newAlerts.push({
        id: 'melanoma_progression',
        type: 'critical' as const,
        message: 'EMERGENCIA: Melanoma con signos de progresión',
        action: 'Biopsia inmediata + estadificación urgente'
      });
    }

    // ALERTAS AMARILLAS - Evaluación Urgente
    if (phase1.affected_percentage >= '30' && 
        phase1.general_condition === 'compromised') {
      newAlerts.push({
        id: 'extensive_involvement',
        type: 'warning' as const,
        message: 'URGENTE: Superficie corporal &gt;30% afectada',
        action: 'Evaluación especializada urgente'
      });
    }

    if (phase1.fever_present === 'yes' && 
        phase1.main_complaint === 'rash' &&
        phase2.systemic_symptoms === 'present') {
      newAlerts.push({
        id: 'fever_rash',
        type: 'warning' as const,
        message: 'URGENTE: Fiebre + erupción cutánea - Descartar causa sistémica',
        action: 'Hemocultivos + evaluación infectológica'
      });
    }

    if (phase3.lymph_nodes_evaluation === 'multiple_enlarged' && 
        phase3.general_inspection === 'suspicious_lesions') {
      newAlerts.push({
        id: 'lymphadenopathy',
        type: 'warning' as const,
        message: 'URGENTE: Adenopatías múltiples + lesiones cutáneas',
        action: 'Biopsia ganglionar + estudios hematológicos'
      });
    }

    if (formData.calculatedScores.pasiScore > 20) {
      newAlerts.push({
        id: 'severe_psoriasis',
        type: 'warning' as const,
        message: 'URGENTE: PASI &gt;20 - Psoriasis severa',
        action: 'Terapia sistémica + evaluación cardiovascular'
      });
    }

    if (phase3.genital_examination === 'ulcerative_lesions' && 
        phase2.sti_risk_factors.length > 0) {
      newAlerts.push({
        id: 'genital_ulcers',
        type: 'warning' as const,
        message: 'URGENTE: Lesiones genitales ulcerativas con factores de riesgo',
        action: 'Serologías ITS + PCR específicas'
      });
    }

    // ALERTAS VERDES - Seguimiento Estrecho
    if (phase3.dermoscopy_findings === 'changing_lesions') {
      newAlerts.push({
        id: 'changing_pigmented_lesions',
        type: 'info' as const,
        message: 'SEGUIMIENTO: Cambios en lesiones pigmentadas',
        action: 'Mappeo corporal + control dermatoscópico 3-6 meses'
      });
    }

    if (formData.calculatedScores.cardiovascularRisk > 15) {
      newAlerts.push({
        id: 'cv_risk_psoriasis',
        type: 'info' as const,
        message: 'SEGUIMIENTO: Psoriasis con factores de riesgo cardiovascular',
        action: 'Evaluación cardiológica + control factores riesgo'
      });
    }

    setAlerts(newAlerts);
  };

  // 2. CALCULADORAS DINÁMICAS

  const calculatePASI = () => {
    const { phase3 } = formData;
    let score = 0;
    
    // Simplificado para demostración - en realidad sería más complejo
    if (phase3.distribution_anatomical === 'extensive') score += 20;
    if (phase3.morphology_detailed === 'thick_plaques') score += 15;
    if (phase3.palpation_findings === 'infiltrated') score += 10;
    
    return Math.min(score, 72); // PASI máximo es 72
  };

  const calculateSCORAD = () => {
    const { phase1, phase2, phase3 } = formData;
    let score = 0;
    
    if (phase1.affected_percentage) score += parseInt(phase1.affected_percentage) * 0.2;
    if (phase2.pruritus_intensity) score += parseInt(phase2.pruritus_intensity) * 2;
    if (phase3.morphology_detailed === 'eczematous') score += 10;
    
    return Math.min(score, 103); // SCORAD máximo es 103
  };

  const calculateDLQI = () => {
    const { phase2 } = formData;
    let score = 0;
    
    // Simplificado - basado en impacto psicosocial reportado
    if (phase2.psychosocial_impact === 'severe') score += 15;
    if (phase2.psychosocial_impact === 'moderate') score += 10;
    if (phase2.psychosocial_impact === 'mild') score += 5;
    
    return Math.min(score, 30); // DLQI máximo es 30
  };

  const calculateCardiovascularRisk = () => {
    let risk = 0;
    const { phase2, phase4 } = formData;
    
    // Factores de riesgo cardiovascular en psoriasis
    if (phase4.pasi_score > 15) risk += 20;
    if (phase2.personal_dermatologic_history.includes('psoriasis_arthropathic')) risk += 15;
    if (phase2.cardiovascular_risk === 'high') risk += 25;
    if (phase2.occupational_exposures.includes('smoking')) risk += 10;
    
    return Math.min(risk, 100);
  };

  const calculateMelanomaRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;
    
    // Factores ABCDE y otros
    if (phase2.phototype <= '2') risk += 15;
    if (phase2.chronic_sun_exposure === 'high') risk += 20;
    if (phase2.family_history_skin.includes('melanoma')) risk += 25;
    if (phase3.dermoscopy_findings === 'asymmetric_lesions') risk += 20;
    if (phase3.dermoscopy_findings === 'irregular_borders') risk += 15;
    if (phase3.dermoscopy_findings === 'color_variation') risk += 15;
    
    return Math.min(risk, 100);
  };

  const calculateSTIRisk = () => {
    let risk = 0;
    const { phase2, phase3 } = formData;
    
    // Factores de riesgo para ITS
    if (phase2.sti_risk_factors.includes('multiple_partners')) risk += 25;
    if (phase2.sti_risk_factors.includes('unprotected_sex')) risk += 20;
    if (phase2.sti_risk_factors.includes('previous_sti')) risk += 15;
    if (phase3.genital_examination === 'ulcerative_lesions') risk += 20;
    if (phase3.lymph_nodes_evaluation === 'inguinal_enlarged') risk += 10;
    
    return Math.min(risk, 100);
  };

  const calculateScores = () => {
    const pasiScore = calculatePASI();
    const scoradScore = calculateSCORAD();
    const dlqiScore = calculateDLQI();
    const cardiovascularRisk = calculateCardiovascularRisk();
    const melanomaRisk = calculateMelanomaRisk();
    const stiRisk = calculateSTIRisk();

    setFormData(prev => ({
      ...prev,
      calculatedScores: {
        pasiScore,
        scoradScore,
        dlqiScore,
        cardiovascularRisk,
        melanomaRisk,
        stiRisk
      }
    }));
  };

  const generateAISuggestions = () => {
    const suggestions: Array<{ category: string; suggestion: string; confidence: number }> = [];
    const { phase1, phase2, phase3, calculatedScores } = formData;

    // Sugerencias basadas en IA para dermatología
    if (calculatedScores?.pasiScore > 15) {
      suggestions.push({
        category: 'Diagnóstico',
        suggestion: 'PASI severo - Considerar terapia biológica (anti-TNF, anti-IL17/23)',
        confidence: 92
      });
    }

    if (phase3.dermoscopy_findings === 'melanoma_suspicious') {
      suggestions.push({
        category: 'Urgente',
        suggestion: 'Lesión sospechosa de melanoma - Biopsia excisional inmediata',
        confidence: 95
      });
    }

    if (calculatedScores?.cardiovascularRisk > 20) {
      suggestions.push({
        category: 'Manejo',
        suggestion: 'Riesgo cardiovascular elevado - Evaluación cardiológica + estatinas',
        confidence: 88
      });
    }

    if (phase2.sti_risk_factors.length > 2) {
      suggestions.push({
        category: 'Prevención',
        suggestion: 'Alto riesgo ITS - Screening completo + consejería preventiva',
        confidence: 90
      });
    }

    if (calculatedScores?.dlqiScore > 15) {
      suggestions.push({
        category: 'Calidad de Vida',
        suggestion: 'Impacto severo en calidad de vida - Apoyo psicológico + optimizar tratamiento',
        confidence: 85
      });
    }

    if (phase1.affected_percentage >= '30') {
      suggestions.push({
        category: 'Tratamiento',
        suggestion: 'Afectación extensa - Considerar hospitalización o hospital de día',
        confidence: 87
      });
    }

    setFormData(prev => ({
      ...prev,
      aiSuggestions: suggestions
    }));
  };

  // 3. FLUJOS ADAPTATIVOS Y VALIDACIÓN CRUZADA
  const validateClinicalCorrelation = () => {
    const inconsistencies = [];
    const { phase1, phase2, phase3 } = formData;

    // Validaciones cruzadas específicas de dermatología
    if (phase1.main_complaint === 'severe_pruritus' && 
        phase3.general_inspection === 'no_visible_lesions') {
      inconsistencies.push('Prurito severo sin lesiones visibles - Investigar causas sistémicas');
    }

    if (phase2.personal_dermatologic_history.includes('psoriasis') && 
        phase3.distribution_anatomical !== 'extensor_surfaces') {
      inconsistencies.push('Historia de psoriasis con distribución atípica - Reevaluar diagnóstico');
    }

    if (phase2.phototype <= '2' && 
        phase2.chronic_sun_exposure === 'minimal' &&
        phase3.dermoscopy_findings === 'solar_damage') {
      inconsistencies.push('Fotodaño con exposición solar mínima - Revisar historia');
    }

    if (phase3.genital_examination === 'ulcerative_lesions' && 
        phase2.sti_risk_factors.length === 0) {
      inconsistencies.push('Úlceras genitales sin factores de riesgo ITS - Historia sexual incompleta');
    }

    return inconsistencies;
  };

  useEffect(() => {
    checkEmergencyAlerts();
    calculateScores();
    generateAISuggestions();
  }, [formData]);

  const getPhaseProgress = () => {
    const phases = [formData.phase1, formData.phase2, formData.phase3, formData.phase4, formData.phase5];
    const currentPhaseData = phases[currentPhase - 1];
    const filledFields = Object.values(currentPhaseData).filter(value => 
      value !== '' && value !== 0 && value !== false && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    const totalFields = Object.keys(currentPhaseData).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const handlePhaseComplete = () => {
    if (currentPhase < 5) {
      setCurrentPhase(currentPhase + 1);
    } else {
      onComplete?.(formData);
    }
  };

  const getPhaseBadgeColor = (phase: number) => {
    if (phase < currentPhase) return "default";
    if (phase === currentPhase) return "secondary";
    return "outline";
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';  
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-800">
            <Stethoscope className="h-6 w-6" />
            Sistema Avanzado de Dermatología y Venereología
          </CardTitle>
          <p className="text-emerald-600 text-sm">
            Evaluación integral con 5 fases especializadas | Inteligencia clínica adaptativa
          </p>
          {patientData && (
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {patientData.name} {patientData.surname}
                </span>
                {patientData.age && (
                  <span className="text-sm">({patientData.age} años)</span>
                )}
                {patientData.gender && (
                  <span className="text-sm">- {patientData.gender}</span>
                )}
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Alertas Críticas */}
      {alerts.length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-white border-l-4 border-red-400">
                <Badge variant={getPriorityColor(alert.type) as any} className="mt-0.5">
                  {alert.type.toUpperCase()}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  {alert.action && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Acción:</strong> {alert.action}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navegación de Fases */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((phase) => (
              <Button
                key={phase}
                variant={getPhaseBadgeColor(phase) as any}
                onClick={() => setCurrentPhase(phase)}
                className="min-w-[120px]"
                data-testid={`button-phase-${phase}`}
              >
                Fase {phase}
                {phase === currentPhase && (
                  <Badge variant="secondary" className="ml-2">
                    {getPhaseProgress()}%
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
            <Clock className="h-4 w-4" />
            <span>
              Tiempo estimado: 
              {currentPhase === 1 && " 5-10 min"}
              {currentPhase === 2 && " 15-20 min"} 
              {currentPhase === 3 && " 20-30 min"}
              {currentPhase === 4 && " 10-15 min"}
              {currentPhase === 5 && " 5-10 min"}
            </span>
          </div>

          <Progress value={getPhaseProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* Contenido de la Fase Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentPhase === 1 && <Target className="h-5 w-5" />}
            {currentPhase === 2 && <Search className="h-5 w-5" />}
            {currentPhase === 3 && <Hand className="h-5 w-5" />}
            {currentPhase === 4 && <Activity className="h-5 w-5" />}
            {currentPhase === 5 && <CheckCircle className="h-5 w-5" />}
            
            {currentPhase === 1 && "Fase 1: Evaluación Inicial y Triage"}
            {currentPhase === 2 && "Fase 2: Anamnesis Dirigida Inteligente"}
            {currentPhase === 3 && "Fase 3: Exploración Física Sistemática"}
            {currentPhase === 4 && "Fase 4: Evaluación Complementaria"}
            {currentPhase === 5 && "Fase 5: Síntesis y Decisiones"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* FASE 1: EVALUACIÓN INICIAL Y TRIAGE */}
          {currentPhase === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clasificación de gravedad inmediata */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-800">Clasificación de Gravedad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="urgency-level">Nivel de Urgencia</Label>
                      <Select value={formData.phase1.urgency_level} onValueChange={(value) => updateFormData('phase1', 'urgency_level', value)}>
                        <SelectTrigger data-testid="select-urgency-level">
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergencia (minutos)</SelectItem>
                          <SelectItem value="urgent">Urgente (&lt; 2 horas)</SelectItem>
                          <SelectItem value="less_urgent">Menos urgente (&lt; 6 horas)</SelectItem>
                          <SelectItem value="routine">Rutinario (&lt; 24 horas)</SelectItem>
                          <SelectItem value="scheduled">Programado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="main-complaint">Motivo de Consulta Principal</Label>
                      <Select value={formData.phase1.main_complaint} onValueChange={(value) => updateFormData('phase1', 'main_complaint', value)}>
                        <SelectTrigger data-testid="select-main-complaint">
                          <SelectValue placeholder="Seleccionar síntoma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rash">Erupción cutánea</SelectItem>
                          <SelectItem value="severe_pruritus">Prurito severo</SelectItem>
                          <SelectItem value="skin_lesion">Lesión cutánea nueva</SelectItem>
                          <SelectItem value="changing_mole">Lunar que cambió</SelectItem>
                          <SelectItem value="ulcer">Úlcera cutánea</SelectItem>
                          <SelectItem value="hair_loss">Pérdida de cabello</SelectItem>
                          <SelectItem value="nail_changes">Cambios ungueales</SelectItem>
                          <SelectItem value="genital_lesion">Lesión genital</SelectItem>
                          <SelectItem value="routine_checkup">Control rutinario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="symptom-duration">Duración de Síntomas</Label>
                      <Select value={formData.phase1.symptom_duration} onValueChange={(value) => updateFormData('phase1', 'symptom_duration', value)}>
                        <SelectTrigger data-testid="select-symptom-duration">
                          <SelectValue placeholder="Seleccionar duración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutos</SelectItem>
                          <SelectItem value="hours">Horas</SelectItem>
                          <SelectItem value="days">Días</SelectItem>
                          <SelectItem value="weeks">Semanas</SelectItem>
                          <SelectItem value="months">Meses</SelectItem>
                          <SelectItem value="years">Años</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="body-surface">Superficie Corporal Afectada (%)</Label>
                      <Input
                        id="body-surface"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.phase1.affected_percentage}
                        onChange={(e) => updateFormData('phase1', 'affected_percentage', e.target.value)}
                        placeholder="0-100%"
                        data-testid="input-body-surface"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Detección de emergencias dermatológicas */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-800">Emergencias Dermatológicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>¿Sospecha de Stevens-Johnson/NET?</Label>
                      <Select value={formData.phase1.stevens_johnson_signs} onValueChange={(value) => updateFormData('phase1', 'stevens_johnson_signs', value)}>
                        <SelectTrigger data-testid="select-stevens-johnson">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="absent">Ausente</SelectItem>
                          <SelectItem value="possible">Posible</SelectItem>
                          <SelectItem value="present">Presente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Signos de anafilaxia/angioedema?</Label>
                      <Select value={formData.phase1.anaphylaxis_signs} onValueChange={(value) => updateFormData('phase1', 'anaphylaxis_signs', value)}>
                        <SelectTrigger data-testid="select-anaphylaxis">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="absent">Ausente</SelectItem>
                          <SelectItem value="possible">Posible</SelectItem>
                          <SelectItem value="present">Presente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Sospecha fascitis necrotizante?</Label>
                      <Select value={formData.phase1.necrotizing_fasciitis_signs} onValueChange={(value) => updateFormData('phase1', 'necrotizing_fasciitis_signs', value)}>
                        <SelectTrigger data-testid="select-necrotizing">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="absent">Ausente</SelectItem>
                          <SelectItem value="possible">Posible</SelectItem>
                          <SelectItem value="present">Presente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Eritrodermia con compromiso sistémico?</Label>
                      <Select value={formData.phase1.erythroderma_signs} onValueChange={(value) => updateFormData('phase1', 'erythroderma_signs', value)}>
                        <SelectTrigger data-testid="select-erythroderma">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="absent">Ausente</SelectItem>
                          <SelectItem value="possible">Posible</SelectItem>
                          <SelectItem value="present">Presente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Signos de alarma */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-amber-800">Signos de Alarma</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>¿Fiebre presente?</Label>
                      <Select value={formData.phase1.fever_present} onValueChange={(value) => updateFormData('phase1', 'fever_present', value)}>
                        <SelectTrigger data-testid="select-fever">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="low_grade">Febrícula (37.1-38°C)</SelectItem>
                          <SelectItem value="moderate">Fiebre moderada (38.1-39°C)</SelectItem>
                          <SelectItem value="high">Fiebre alta (&gt;39°C)</SelectItem>
                          <SelectItem value="hyperpyrexia">Hipertermia (&gt;40°C)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Compromiso sistémico?</Label>
                      <Select value={formData.phase1.systemic_compromise} onValueChange={(value) => updateFormData('phase1', 'systemic_compromise', value)}>
                        <SelectTrigger data-testid="select-systemic-compromise">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="absent">Ausente</SelectItem>
                          <SelectItem value="mild">Leve</SelectItem>
                          <SelectItem value="moderate">Moderado</SelectItem>
                          <SelectItem value="severe">Severo</SelectItem>
                          <SelectItem value="critical">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Dificultad respiratoria?</Label>
                      <Select value={formData.phase1.respiratory_distress} onValueChange={(value) => updateFormData('phase1', 'respiratory_distress', value)}>
                        <SelectTrigger data-testid="select-respiratory-distress">
                          <SelectValue placeholder="Evaluar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="mild">Leve</SelectItem>
                          <SelectItem value="moderate">Moderada</SelectItem>
                          <SelectItem value="severe">Severa</SelectItem>
                          <SelectItem value="yes">Sí</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Síntomas asociados */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800">Síntomas Asociados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Seleccionar síntomas presentes:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'pruritus', label: 'Prurito' },
                        { id: 'burning', label: 'Ardor' },
                        { id: 'pain', label: 'Dolor' },
                        { id: 'swelling', label: 'Hinchazón' },
                        { id: 'discharge', label: 'Secreción' },
                        { id: 'bleeding', label: 'Sangrado' },
                        { id: 'fever', label: 'Fiebre' },
                        { id: 'malaise', label: 'Malestar general' },
                        { id: 'lymph_nodes', label: 'Ganglios inflamados' },
                        { id: 'joint_pain', label: 'Dolor articular' }
                      ].map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={formData.phase1.associated_symptoms?.includes(symptom.id)}
                            onCheckedChange={(checked) => {
                              const current = formData.phase1.associated_symptoms || [];
                              const updated = checked
                                ? [...current, symptom.id]
                                : current.filter(s => s !== symptom.id);
                              updateFormData('phase1', 'associated_symptoms', updated);
                            }}
                            data-testid={`checkbox-symptom-${symptom.id}`}
                          />
                          <Label htmlFor={symptom.id} className="text-sm">{symptom.label}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* FASE 2: ANAMNESIS DIRIGIDA INTELIGENTE */}
          {currentPhase === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Síntomas principales con validación */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-800">Síntomas Principales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="pruritus-intensity">Intensidad del Prurito (0-10)</Label>
                      <Input
                        id="pruritus-intensity"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.phase2.pruritus_intensity || ''}
                        onChange={(e) => updateFormData('phase2', 'pruritus_intensity', e.target.value)}
                        placeholder="0 = Sin prurito, 10 = Insoportable"
                        data-testid="input-pruritus-intensity"
                      />
                    </div>

                    <div>
                      <Label>Patrón Temporal del Prurito</Label>
                      <Select value={formData.phase2.pruritus_pattern} onValueChange={(value) => updateFormData('phase2', 'pruritus_pattern', value)}>
                        <SelectTrigger data-testid="select-pruritus-pattern">
                          <SelectValue placeholder="Seleccionar patrón" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="constant">Constante</SelectItem>
                          <SelectItem value="intermittent">Intermitente</SelectItem>
                          <SelectItem value="nocturnal">Nocturno</SelectItem>
                          <SelectItem value="diurnal">Diurno</SelectItem>
                          <SelectItem value="seasonal">Estacional</SelectItem>
                          <SelectItem value="triggered">Desencadenado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Características del Dolor</Label>
                      <Select value={formData.phase2.pain_characteristics} onValueChange={(value) => updateFormData('phase2', 'pain_characteristics', value)}>
                        <SelectTrigger data-testid="select-pain-characteristics">
                          <SelectValue placeholder="Describir dolor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin dolor</SelectItem>
                          <SelectItem value="burning">Ardoroso</SelectItem>
                          <SelectItem value="stabbing">Punzante</SelectItem>
                          <SelectItem value="throbbing">Pulsátil</SelectItem>
                          <SelectItem value="cramping">Calambres</SelectItem>
                          <SelectItem value="dull">Sordo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cambios Morfológicos</Label>
                      <Textarea
                        value={formData.phase2.morphological_changes}
                        onChange={(e) => updateFormData('phase2', 'morphological_changes', e.target.value)}
                        placeholder="Describir evolución de las lesiones..."
                        className="h-20"
                        data-testid="textarea-morphological-changes"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Antecedentes relevantes para dermatología */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800">Antecedentes Dermatológicos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Historia Personal Dermatológica</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {[
                          { id: 'atopic_dermatitis', label: 'Dermatitis atópica' },
                          { id: 'psoriasis', label: 'Psoriasis' },
                          { id: 'psoriasis_arthropathic', label: 'Psoriasis artropática' },
                          { id: 'basal_cell_carcinoma', label: 'Carcinoma basocelular' },
                          { id: 'squamous_cell_carcinoma', label: 'Carcinoma escamocelular' },
                          { id: 'melanoma', label: 'Melanoma' },
                          { id: 'vitiligo', label: 'Vitíligo' },
                          { id: 'alopecia_areata', label: 'Alopecia areata' }
                        ].map((condition) => (
                          <div key={condition.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={condition.id}
                              checked={formData.phase2.personal_dermatologic_history?.includes(condition.id)}
                              onCheckedChange={(checked) => {
                                const current = formData.phase2.personal_dermatologic_history || [];
                                const updated = checked
                                  ? [...current, condition.id]
                                  : current.filter(c => c !== condition.id);
                                updateFormData('phase2', 'personal_dermatologic_history', updated);
                              }}
                              data-testid={`checkbox-personal-history-${condition.id}`}
                            />
                            <Label htmlFor={condition.id} className="text-sm">{condition.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Fototipo de Piel</Label>
                      <Select value={formData.phase2.phototype} onValueChange={(value) => updateFormData('phase2', 'phototype', value)}>
                        <SelectTrigger data-testid="select-phototype">
                          <SelectValue placeholder="Seleccionar fototipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Tipo I: Muy clara, siempre se quema</SelectItem>
                          <SelectItem value="2">Tipo II: Clara, se quema fácil</SelectItem>
                          <SelectItem value="3">Tipo III: Intermedia, se broncea gradual</SelectItem>
                          <SelectItem value="4">Tipo IV: Oliva, se broncea fácil</SelectItem>
                          <SelectItem value="5">Tipo V: Oscura, raramente se quema</SelectItem>
                          <SelectItem value="6">Tipo VI: Muy oscura, nunca se quema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Exposición Solar Crónica</Label>
                      <Select value={formData.phase2.chronic_sun_exposure} onValueChange={(value) => updateFormData('phase2', 'chronic_sun_exposure', value)}>
                        <SelectTrigger data-testid="select-sun-exposure">
                          <SelectValue placeholder="Evaluar exposición" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Mínima (&lt; 2 hrs/día)</SelectItem>
                          <SelectItem value="moderate">Moderada (2-6 hrs/día)</SelectItem>
                          <SelectItem value="high">Alta (&gt; 6 hrs/día)</SelectItem>
                          <SelectItem value="extreme">Extrema (ocupacional)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Factores de riesgo específicos */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-800">Factores de Riesgo Específicos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Riesgo Cardiovascular</Label>
                      <Select value={formData.phase2.cardiovascular_risk} onValueChange={(value) => updateFormData('phase2', 'cardiovascular_risk', value)}>
                        <SelectTrigger data-testid="select-cardiovascular-risk">
                          <SelectValue placeholder="Evaluar riesgo CV" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Bajo</SelectItem>
                          <SelectItem value="moderate">Moderado</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                          <SelectItem value="very_high">Muy alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Factores de Riesgo para ITS</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {[
                          { id: 'multiple_partners', label: 'Múltiples parejas sexuales' },
                          { id: 'unprotected_sex', label: 'Relaciones sin protección' },
                          { id: 'previous_sti', label: 'ITS previa' },
                          { id: 'immunocompromised', label: 'Inmunocompromiso' },
                          { id: 'drug_use', label: 'Uso de drogas IV' },
                          { id: 'sex_work', label: 'Trabajo sexual' }
                        ].map((factor) => (
                          <div key={factor.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={factor.id}
                              checked={formData.phase2.sti_risk_factors?.includes(factor.id)}
                              onCheckedChange={(checked) => {
                                const current = formData.phase2.sti_risk_factors || [];
                                const updated = checked
                                  ? [...current, factor.id]
                                  : current.filter(f => f !== factor.id);
                                updateFormData('phase2', 'sti_risk_factors', updated);
                              }}
                              data-testid={`checkbox-sti-risk-${factor.id}`}
                            />
                            <Label htmlFor={factor.id} className="text-sm">{factor.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Impacto Psicosocial</Label>
                      <Select value={formData.phase2.psychosocial_impact} onValueChange={(value) => updateFormData('phase2', 'psychosocial_impact', value)}>
                        <SelectTrigger data-testid="select-psychosocial-impact">
                          <SelectValue placeholder="Evaluar impacto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin impacto</SelectItem>
                          <SelectItem value="mild">Impacto leve</SelectItem>
                          <SelectItem value="moderate">Impacto moderado</SelectItem>
                          <SelectItem value="severe">Impacto severo</SelectItem>
                          <SelectItem value="devastating">Devastador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Exposiciones ocupacionales */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-800">Exposiciones Ocupacionales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Exposiciones Laborales</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {[
                          { id: 'chemicals', label: 'Químicos industriales' },
                          { id: 'solvents', label: 'Solventes orgánicos' },
                          { id: 'metals', label: 'Metales pesados' },
                          { id: 'latex', label: 'Látex' },
                          { id: 'cement', label: 'Cemento/construcción' },
                          { id: 'cosmetics', label: 'Cosméticos/peluquería' },
                          { id: 'healthcare', label: 'Sanitario (desinfectantes)' },
                          { id: 'agriculture', label: 'Agricultura (pesticidas)' },
                          { id: 'smoking', label: 'Tabaquismo' }
                        ].map((exposure) => (
                          <div key={exposure.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={exposure.id}
                              checked={formData.phase2.occupational_exposures?.includes(exposure.id)}
                              onCheckedChange={(checked) => {
                                const current = formData.phase2.occupational_exposures || [];
                                const updated = checked
                                  ? [...current, exposure.id]
                                  : current.filter(e => e !== exposure.id);
                                updateFormData('phase2', 'occupational_exposures', updated);
                              }}
                              data-testid={`checkbox-occupational-${exposure.id}`}
                            />
                            <Label htmlFor={exposure.id} className="text-sm">{exposure.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Viajes Recientes</Label>
                      <Textarea
                        value={formData.phase2.recent_travels}
                        onChange={(e) => updateFormData('phase2', 'recent_travels', e.target.value)}
                        placeholder="Describir destinos y fechas de viajes recientes..."
                        className="h-16"
                        data-testid="textarea-recent-travels"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* FASE 3: EXPLORACIÓN FÍSICA SISTEMÁTICA */}
          {currentPhase === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exploración dermatológica general */}
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-indigo-800">Exploración General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Inspección General</Label>
                      <Select value={formData.phase3.general_inspection} onValueChange={(value) => updateFormData('phase3', 'general_inspection', value)}>
                        <SelectTrigger data-testid="select-general-inspection">
                          <SelectValue placeholder="Evaluar aspecto general" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal_skin">Piel normal</SelectItem>
                          <SelectItem value="localized_lesions">Lesiones localizadas</SelectItem>
                          <SelectItem value="generalized_rash">Erupción generalizada</SelectItem>
                          <SelectItem value="suspicious_lesions">Lesiones sospechosas</SelectItem>
                          <SelectItem value="multiple_lesions">Lesiones múltiples</SelectItem>
                          <SelectItem value="no_visible_lesions">Sin lesiones visibles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Distribución Anatómica</Label>
                      <Select value={formData.phase3.distribution_anatomical} onValueChange={(value) => updateFormData('phase3', 'distribution_anatomical', value)}>
                        <SelectTrigger data-testid="select-anatomical-distribution">
                          <SelectValue placeholder="Describir distribución" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="localized">Localizada</SelectItem>
                          <SelectItem value="regional">Regional</SelectItem>
                          <SelectItem value="generalized">Generalizada</SelectItem>
                          <SelectItem value="symmetric">Simétrica</SelectItem>
                          <SelectItem value="asymmetric">Asimétrica</SelectItem>
                          <SelectItem value="flexural">Flexural</SelectItem>
                          <SelectItem value="extensor_surfaces">Superficies extensoras</SelectItem>
                          <SelectItem value="photo_distributed">Fotodistribuida</SelectItem>
                          <SelectItem value="dermatomal">Dermatómica</SelectItem>
                          <SelectItem value="extensive">Extensa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Morfología Detallada</Label>
                      <Select value={formData.phase3.morphology_detailed} onValueChange={(value) => updateFormData('phase3', 'morphology_detailed', value)}>
                        <SelectTrigger data-testid="select-morphology-detailed">
                          <SelectValue placeholder="Describir morfología" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="macular">Macular</SelectItem>
                          <SelectItem value="papular">Papular</SelectItem>
                          <SelectItem value="vesicular">Vesicular</SelectItem>
                          <SelectItem value="bullous">Ampollar</SelectItem>
                          <SelectItem value="pustular">Pustular</SelectItem>
                          <SelectItem value="nodular">Nodular</SelectItem>
                          <SelectItem value="ulcerative">Ulcerativo</SelectItem>
                          <SelectItem value="thick_plaques">Placas gruesas</SelectItem>
                          <SelectItem value="scaling">Descamativo</SelectItem>
                          <SelectItem value="eczematous">Eccematoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Hallazgos de Palpación</Label>
                      <Select value={formData.phase3.palpation_findings} onValueChange={(value) => updateFormData('phase3', 'palpation_findings', value)}>
                        <SelectTrigger data-testid="select-palpation">
                          <SelectValue placeholder="Evaluar palpación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soft">Blando</SelectItem>
                          <SelectItem value="firm">Firme</SelectItem>
                          <SelectItem value="hard">Duro</SelectItem>
                          <SelectItem value="infiltrated">Infiltrado</SelectItem>
                          <SelectItem value="mobile">Móvil</SelectItem>
                          <SelectItem value="fixed">Fijo</SelectItem>
                          <SelectItem value="tender">Doloroso</SelectItem>
                          <SelectItem value="non_tender">No doloroso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Exploración dirigida por sospecha diagnóstica */}
                <Card className="border-cyan-200 bg-cyan-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-cyan-800">Exploración Dirigida</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Áreas Específicas Psoriasis</Label>
                      <Select value={formData.phase3.psoriasis_specific_areas} onValueChange={(value) => updateFormData('phase3', 'psoriasis_specific_areas', value)}>
                        <SelectTrigger data-testid="select-psoriasis-areas">
                          <SelectValue placeholder="Evaluar áreas típicas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_lesions">Sin lesiones típicas</SelectItem>
                          <SelectItem value="scalp_involved">Cuero cabelludo afectado</SelectItem>
                          <SelectItem value="elbows_knees">Codos y rodillas</SelectItem>
                          <SelectItem value="sacral_area">Área sacra</SelectItem>
                          <SelectItem value="intergluteal">Interglúteo</SelectItem>
                          <SelectItem value="nails_affected">Uñas afectadas</SelectItem>
                          <SelectItem value="widespread">Diseminado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Examen Genital</Label>
                      <Select value={formData.phase3.genital_examination} onValueChange={(value) => updateFormData('phase3', 'genital_examination', value)}>
                        <SelectTrigger data-testid="select-genital-exam">
                          <SelectValue placeholder="Examinar área genital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="ulcerative_lesions">Lesiones ulcerativas</SelectItem>
                          <SelectItem value="vesicular_lesions">Lesiones vesiculares</SelectItem>
                          <SelectItem value="warts">Verrugas</SelectItem>
                          <SelectItem value="discharge">Secreción</SelectItem>
                          <SelectItem value="inflammation">Inflamación</SelectItem>
                          <SelectItem value="not_examined">No examinado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Evaluación Ganglionar</Label>
                      <Select value={formData.phase3.lymph_nodes_evaluation} onValueChange={(value) => updateFormData('phase3', 'lymph_nodes_evaluation', value)}>
                        <SelectTrigger data-testid="select-lymph-nodes">
                          <SelectValue placeholder="Evaluar ganglios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normales</SelectItem>
                          <SelectItem value="localized_enlarged">Aumentados localizados</SelectItem>
                          <SelectItem value="multiple_enlarged">Múltiples aumentados</SelectItem>
                          <SelectItem value="inguinal_enlarged">Inguinales aumentados</SelectItem>
                          <SelectItem value="axillary_enlarged">Axilares aumentados</SelectItem>
                          <SelectItem value="cervical_enlarged">Cervicales aumentados</SelectItem>
                          <SelectItem value="enlarged">Aumentados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Evaluación de Malignidad</Label>
                      <Select value={formData.phase3.malignancy_evaluation} onValueChange={(value) => updateFormData('phase3', 'malignancy_evaluation', value)}>
                        <SelectTrigger data-testid="select-malignancy">
                          <SelectValue placeholder="Evaluar signos malignidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_suspicious">Sin signos sospechosos</SelectItem>
                          <SelectItem value="suspicious_lesion">Lesión sospechosa</SelectItem>
                          <SelectItem value="ulceration">Ulceración</SelectItem>
                          <SelectItem value="bleeding">Sangrado</SelectItem>
                          <SelectItem value="irregular_borders">Bordes irregulares</SelectItem>
                          <SelectItem value="rapid_growth">Crecimiento rápido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Maniobras específicas de dermatología */}
                <Card className="border-teal-200 bg-teal-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-teal-800">Maniobras Específicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Hallazgos Dermoscópicos</Label>
                      <Select value={formData.phase3.dermoscopy_findings} onValueChange={(value) => updateFormData('phase3', 'dermoscopy_findings', value)}>
                        <SelectTrigger data-testid="select-dermoscopy">
                          <SelectValue placeholder="Evaluar dermoscopia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_performed">No realizada</SelectItem>
                          <SelectItem value="benign_pattern">Patrón benigno</SelectItem>
                          <SelectItem value="melanoma_suspicious">Sospechoso de melanoma</SelectItem>
                          <SelectItem value="asymmetric_lesions">Lesiones asimétricas</SelectItem>
                          <SelectItem value="irregular_borders">Bordes irregulares</SelectItem>
                          <SelectItem value="color_variation">Variación de color</SelectItem>
                          <SelectItem value="changing_lesions">Lesiones que cambian</SelectItem>
                          <SelectItem value="solar_damage">Daño solar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Signos Dermatológicos</Label>
                      <Select value={formData.phase3.dermatologic_signs} onValueChange={(value) => updateFormData('phase3', 'dermatologic_signs', value)}>
                        <SelectTrigger data-testid="select-dermatologic-signs">
                          <SelectValue placeholder="Evaluar signos específicos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          <SelectItem value="nikolsky_positive">Nikolsky positivo</SelectItem>
                          <SelectItem value="koebner_phenomenon">Fenómeno de Köbner</SelectItem>
                          <SelectItem value="darier_sign">Signo de Darier</SelectItem>
                          <SelectItem value="auspitz_sign">Signo de Auspitz</SelectItem>
                          <SelectItem value="dermographism">Dermografismo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Resultados Diascopia</Label>
                      <Select value={formData.phase3.diascopy_results} onValueChange={(value) => updateFormData('phase3', 'diascopy_results', value)}>
                        <SelectTrigger data-testid="select-diascopy">
                          <SelectValue placeholder="Evaluar diascopia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_performed">No realizada</SelectItem>
                          <SelectItem value="blanching">Palidez con presión</SelectItem>
                          <SelectItem value="no_blanching">Sin palidez</SelectItem>
                          <SelectItem value="granulomatous_pattern">Patrón granulomatoso</SelectItem>
                          <SelectItem value="vascular_pattern">Patrón vascular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Anexos cutáneos */}
                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-pink-800">Anexos Cutáneos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Examen Ungueal</Label>
                      <Select value={formData.phase3.nail_examination} onValueChange={(value) => updateFormData('phase3', 'nail_examination', value)}>
                        <SelectTrigger data-testid="select-nail-exam">
                          <SelectValue placeholder="Evaluar uñas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normales</SelectItem>
                          <SelectItem value="pitting">Pitting (psoriasis)</SelectItem>
                          <SelectItem value="onycholysis">Onicólisis</SelectItem>
                          <SelectItem value="dystrophy">Distrofia</SelectItem>
                          <SelectItem value="fungal_infection">Infección fúngica</SelectItem>
                          <SelectItem value="melanoma_suspicious">Sospechoso melanoma</SelectItem>
                          <SelectItem value="clubbing">Acropaquia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Evaluación Capilar</Label>
                      <Select value={formData.phase3.hair_evaluation} onValueChange={(value) => updateFormData('phase3', 'hair_evaluation', value)}>
                        <SelectTrigger data-testid="select-hair-eval">
                          <SelectValue placeholder="Evaluar cabello" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="alopecia_areata">Alopecia areata</SelectItem>
                          <SelectItem value="androgenetic_alopecia">Alopecia androgenética</SelectItem>
                          <SelectItem value="diffuse_thinning">Adelgazamiento difuso</SelectItem>
                          <SelectItem value="trichotillomania">Tricotilomanía</SelectItem>
                          <SelectItem value="telogen_effluvium">Efluvio telógeno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Mucosas</Label>
                      <Select value={formData.phase3.mucous_membranes} onValueChange={(value) => updateFormData('phase3', 'mucous_membranes', value)}>
                        <SelectTrigger data-testid="select-mucous-membranes">
                          <SelectValue placeholder="Evaluar mucosas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normales</SelectItem>
                          <SelectItem value="affected">Afectadas</SelectItem>
                          <SelectItem value="oral_lesions">Lesiones orales</SelectItem>
                          <SelectItem value="genital_lesions">Lesiones genitales</SelectItem>
                          <SelectItem value="ulcerative">Ulcerativas</SelectItem>
                          <SelectItem value="vesicular">Vesiculares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* FASE 4: EVALUACIÓN COMPLEMENTARIA */}
          {currentPhase === 4 && (
            <div className="space-y-6">
              {/* Escalas y Calculadoras */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* PASI Score */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">PASI Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {formData.calculatedScores.pasiScore}
                      </div>
                      <div className="text-xs text-green-600">
                        {formData.calculatedScores.pasiScore < 10 ? "Leve" :
                         formData.calculatedScores.pasiScore < 20 ? "Moderada" : "Severa"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rango: 0-72
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SCORAD */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">SCORAD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {formData.calculatedScores.scoradScore}
                      </div>
                      <div className="text-xs text-blue-600">
                        {formData.calculatedScores.scoradScore < 25 ? "Leve" :
                         formData.calculatedScores.scoradScore < 50 ? "Moderado" : "Severo"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rango: 0-103
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* DLQI */}
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">DLQI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {formData.calculatedScores.dlqiScore}
                      </div>
                      <div className="text-xs text-purple-600">
                        {formData.calculatedScores.dlqiScore < 6 ? "Sin impacto" :
                         formData.calculatedScores.dlqiScore < 11 ? "Impacto pequeño" :
                         formData.calculatedScores.dlqiScore < 21 ? "Impacto moderado" : "Impacto muy grande"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rango: 0-30
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Riesgo Cardiovascular */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">Riesgo CV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700">
                        {formData.calculatedScores.cardiovascularRisk}%
                      </div>
                      <div className="text-xs text-red-600">
                        {formData.calculatedScores.cardiovascularRisk < 15 ? "Bajo" :
                         formData.calculatedScores.cardiovascularRisk < 30 ? "Moderado" : "Alto"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Psoriasis
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Riesgo Melanoma */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-800">Riesgo Melanoma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-700">
                        {formData.calculatedScores.melanomaRisk}%
                      </div>
                      <div className="text-xs text-orange-600">
                        {formData.calculatedScores.melanomaRisk < 20 ? "Bajo" :
                         formData.calculatedScores.melanomaRisk < 50 ? "Moderado" : "Alto"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ABCDE + Factores
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Riesgo ITS */}
                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-pink-800">Riesgo ITS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-700">
                        {formData.calculatedScores.stiRisk}%
                      </div>
                      <div className="text-xs text-pink-600">
                        {formData.calculatedScores.stiRisk < 20 ? "Bajo" :
                         formData.calculatedScores.stiRisk < 50 ? "Moderado" : "Alto"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Factores de riesgo
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Criterios Diagnósticos */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Criterios Diagnósticos Automáticos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${formData.phase4.psoriasis_criteria_met ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className="text-sm">Criterios Psoriasis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${formData.phase4.atopic_dermatitis_criteria ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className="text-sm">Dermatitis Atópica</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${formData.phase4.cutaneous_lupus_criteria ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className="text-sm">Lupus Cutáneo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${formData.phase4.sti_criteria ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className="text-sm">Criterios ITS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FASE 5: SÍNTESIS Y DECISIONES */}
          {currentPhase === 5 && (
            <div className="space-y-6">
              {/* Correlación clínica */}
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">Correlación Clínica Automática</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Concordancia Síntomas-Hallazgos</Label>
                    <Select value={formData.phase5.symptom_finding_concordance} onValueChange={(value) => updateFormData('phase5', 'symptom_finding_concordance', value)}>
                      <SelectTrigger data-testid="select-symptom-concordance">
                        <SelectValue placeholder="Evaluar concordancia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excelente concordancia</SelectItem>
                        <SelectItem value="good">Buena concordancia</SelectItem>
                        <SelectItem value="moderate">Concordancia moderada</SelectItem>
                        <SelectItem value="poor">Pobre concordancia</SelectItem>
                        <SelectItem value="inconsistent">Inconsistente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Inconsistencias Detectadas</Label>
                    <Textarea
                      value={validateClinicalCorrelation().join('\n')}
                      readOnly
                      className="h-16 bg-gray-50"
                      placeholder="No se detectaron inconsistencias clínicas"
                      data-testid="textarea-inconsistencies"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Estratificación final de riesgo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Estratificación Final de Riesgo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Riesgo Inmediato</Label>
                      <Select value={formData.phase5.immediate_risk} onValueChange={(value) => updateFormData('phase5', 'immediate_risk', value)}>
                        <SelectTrigger data-testid="select-immediate-risk">
                          <SelectValue placeholder="Evaluar riesgo inmediato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin riesgo</SelectItem>
                          <SelectItem value="low">Bajo riesgo</SelectItem>
                          <SelectItem value="moderate">Riesgo moderado</SelectItem>
                          <SelectItem value="high">Alto riesgo</SelectItem>
                          <SelectItem value="critical">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Riesgo de Progresión</Label>
                      <Select value={formData.phase5.progression_risk} onValueChange={(value) => updateFormData('phase5', 'progression_risk', value)}>
                        <SelectTrigger data-testid="select-progression-risk">
                          <SelectValue placeholder="Evaluar progresión" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin riesgo</SelectItem>
                          <SelectItem value="low">Bajo riesgo</SelectItem>
                          <SelectItem value="moderate">Riesgo moderado</SelectItem>
                          <SelectItem value="high">Alto riesgo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Riesgo de Transmisión</Label>
                      <Select value={formData.phase5.transmission_risk} onValueChange={(value) => updateFormData('phase5', 'transmission_risk', value)}>
                        <SelectTrigger data-testid="select-transmission-risk">
                          <SelectValue placeholder="Evaluar transmisión" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin riesgo</SelectItem>
                          <SelectItem value="low">Bajo riesgo</SelectItem>
                          <SelectItem value="moderate">Riesgo moderado</SelectItem>
                          <SelectItem value="high">Alto riesgo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Recomendaciones de Manejo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Protocolo Terapéutico</Label>
                      <Select value={formData.phase5.therapeutic_protocol} onValueChange={(value) => updateFormData('phase5', 'therapeutic_protocol', value)}>
                        <SelectTrigger data-testid="select-therapeutic-protocol">
                          <SelectValue placeholder="Seleccionar protocolo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="topical">Terapia tópica</SelectItem>
                          <SelectItem value="systemic">Terapia sistémica</SelectItem>
                          <SelectItem value="biologic">Terapia biológica</SelectItem>
                          <SelectItem value="combination">Terapia combinada</SelectItem>
                          <SelectItem value="observation">Observación</SelectItem>
                          <SelectItem value="emergency">Manejo de emergencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Criterios de Derivación</Label>
                      <Select value={formData.phase5.specialist_referral_criteria} onValueChange={(value) => updateFormData('phase5', 'specialist_referral_criteria', value)}>
                        <SelectTrigger data-testid="select-referral-criteria">
                          <SelectValue placeholder="Evaluar derivación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin derivación</SelectItem>
                          <SelectItem value="routine_dermatology">Dermatología rutina</SelectItem>
                          <SelectItem value="urgent_dermatology">Dermatología urgente</SelectItem>
                          <SelectItem value="dermatopathology">Dermatopatología</SelectItem>
                          <SelectItem value="oncology">Oncología</SelectItem>
                          <SelectItem value="rheumatology">Reumatología</SelectItem>
                          <SelectItem value="emergency">Emergencias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Frecuencia de Seguimiento</Label>
                      <Select value={formData.phase5.follow_up_frequency} onValueChange={(value) => updateFormData('phase5', 'follow_up_frequency', value)}>
                        <SelectTrigger data-testid="select-followup-frequency">
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Inmediato (&lt; 24h)</SelectItem>
                          <SelectItem value="1_week">1 semana</SelectItem>
                          <SelectItem value="2_weeks">2 semanas</SelectItem>
                          <SelectItem value="1_month">1 mes</SelectItem>
                          <SelectItem value="3_months">3 meses</SelectItem>
                          <SelectItem value="6_months">6 meses</SelectItem>
                          <SelectItem value="annual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sugerencias IA */}
              {formData.aiSuggestions.length > 0 && (
                <Card className="border-violet-200 bg-violet-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-800">
                      <Zap className="h-5 w-5" />
                      Sugerencias de Inteligencia Artificial ({formData.aiSuggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white border-l-4 border-violet-400">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{suggestion.suggestion}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-xs text-gray-500">
                              Confianza: {suggestion.confidence}%
                            </div>
                            <div className="h-1 w-12 bg-gray-200 rounded">
                              <div 
                                className="h-1 bg-violet-500 rounded" 
                                style={{ width: `${suggestion.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPhase(Math.max(1, currentPhase - 1))}
              disabled={currentPhase === 1}
              data-testid="button-previous-phase"
            >
              Fase Anterior
            </Button>

            <div className="text-sm text-gray-500">
              Fase {currentPhase} de 5 - {getPhaseProgress()}% completado
            </div>

            <Button
              onClick={handlePhaseComplete}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-next-phase"
            >
              {currentPhase === 5 ? "Completar Evaluación" : "Siguiente Fase"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDermatologyForm;