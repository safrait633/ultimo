# 🏥 VITAL 3.0 - Parte 3: Componentes Médicos y Templates
## 💊 Sistema de Componentes y Templates Inteligentes - Prompt Final en Español

> **OBJETIVO**: Crear el sistema completo de componentes médicos, templates inteligentes, formularios dinámicos y funcionalidades avanzadas con glassmorphism estilo Apple Health Records.

---

## 🩺 PASO 7: SISTEMA DE TEMPLATES INTELIGENTES

### 🧠 Prompt para Template Engine con IA

```markdown
Crea el sistema de templates médicos inteligentes para VITAL 3.0:

- Cada template debe tener: nombre, descripción, especialidad, tipo (quick/standard/comprehensive), tiempo estimado, campos dinámicos, condiciones, uso de IA para sugerencias.
- Los campos pueden ser: texto, select, checkbox, número, textarea, vital-signs, ICD-10.
- Las condiciones permiten mostrar/ocultar campos, requerir datos o sugerir acciones según respuestas.
- El sistema debe filtrar templates por especialidad, búsqueda y si usan IA.
- Ejemplo de template:
{
  "id": "cardio-chest-pain",
  "name": "Dolor Torácico - Cardiología",
  "description": "Evaluación rápida de dolor torácico con sugerencias de IA",
  "specialty": "cardiology",
  "type": "quick",
  "estimatedTime": 8,
  "usageCount": 456,
  "aiSuggestions": true,
  "fields": [
    { "id": "chief_complaint", "type": "textarea", "label": "Motivo de consulta", "required": true, "aiPowered": true },
    { "id": "pain_characteristics", "type": "select", "label": "Características del dolor", "options": ["Opresivo", "Punzante"], "required": true }
  ],
  "conditions": [
    { "field": "pain_intensity", "operator": "greater", "value": 7, "action": "suggest", "target": ["ecg_immediate"] }
  ]
}
```

---

## 🫀 PASO 8: COMPONENTES MÉDICOS ESPECIALIZADOS

### 💓 Prompt para Panel Universal de Signos Vitales

```markdown
Crea un componente universal VitalSignsPanel para VITAL 3.0:

- Debe mostrar y editar: presión arterial, frecuencia cardíaca, temperatura, saturación de oxígeno, peso, altura, IMC, dolor.
- Calcula alertas automáticas (ej: hipertensión, fiebre, hipoxemia, IMC alto/bajo).
- Visualiza cada parámetro con icono, color y alerta.
- Permite edición rápida y visualización responsive.
- Ejemplo de estructura:
{
  "bloodPressure": { "systolic": 120, "diastolic": 80, "unit": "mmHg" },
  "heartRate": { "value": 72, "unit": "bpm", "rhythm": "regular" },
  "temperature": { "value": 36.6, "unit": "celsius" },
  "oxygenSaturation": { "value": 98, "unit": "%", "onAir": true },
  "weight": { "value": 70, "unit": "kg" },
  "height": { "value": 175, "unit": "cm" },
  "bmi": 22.9,
  "pain": { "level": 3, "scale": "0-10" }
}
```

---

## 🔍 PASO 9: Selector Inteligente de Síntomas

```markdown
Crea un componente SymptomSelector para VITAL 3.0:

- Permite buscar, seleccionar y editar síntomas por categoría, severidad, duración, localización.
- Incluye síntomas predefinidos y opción de agregar personalizados.
- Visualiza red flags y sugerencias relacionadas.
- Filtra síntomas por especialidad y búsqueda.
- Ejemplo de síntoma:
{
  "id": "headache",
  "name": "Cefalea",
  "category": "neurological",
  "severity": "moderate",
  "duration": "2 días",
  "location": "frontal",
  "description": "Dolor de cabeza frontal",
  "icd10Codes": ["G44.9"],
  "redFlags": false
}
```

---

## 🤖 PASO 10: Asistente de Diagnóstico con IA

```markdown
Crea un DiagnosisAssistant para VITAL 3.0:

- Recibe síntomas, signos vitales y examen físico.
- Sugiere diagnósticos probables con probabilidad, confianza, razonamiento y evidencia.
- Muestra red flags y urgencias.
- Recomienda pruebas y diagnósticos diferenciales.
- Ejemplo de sugerencia:
{
  "id": "angina",
  "icd10Code": "I20.9",
  "name": "Angina de pecho",
  "probability": 82,
  "confidence": "high",
  "reasoning": ["Dolor opresivo", "Disnea de esfuerzo"],
  "supportingEvidence": ["ECG alterado", "Troponinas negativas"],
  "contradictingEvidence": [],
  "recommendedTests": ["ECG", "Troponinas"],
  "urgency": "high",
  "differentialDiagnoses": ["Infarto", "Pericarditis"]
}
```

---

## 📋 PASO 11: Generador de Reportes Médicos

```markdown
Crea un ReportGenerator para VITAL 3.0:

- Genera reportes médicos en PDF y vista previa.
- Incluye datos de hospital, médico, paciente, examen, diagnóstico y tratamiento.
- Permite elegir tipo de reporte (consulta, diagnóstico, receta, derivación) y plantilla (estándar, detallada, resumen).
- Opciones: incluir imágenes, firma, recomendaciones.
- Ejemplo de contenido:
{
  "header": { "hospitalName": "Centro Médico VITAL", "doctorInfo": {...}, "patientInfo": {...}, "examDate": "2025-09-13" },
  "body": { "chiefComplaint": "...", "historyPresent": "...", "vitalSigns": {...}, "diagnosis": {...}, "treatment": {...} },
  "footer": { "doctorSignature": "...", "medicalLicense": "...", "timestamp": "..." }
}
```

---

## 🔧 PASO 12: Hooks y Utilidades Médicas

```markdown
Crea hooks personalizados para VITAL 3.0:

- useAutoSave: autoguardado cada 3 segundos, solo si hay cambios.
- usePatientSearch: búsqueda inteligente con debounce y pacientes recientes.
- useSpecialtyForm: carga dinámica de campos por especialidad, progreso y validación.
- useDebounce: utilidad para retrasar ejecución.
- Todos los hooks deben ser optimizados para SPA y glassmorphism.
```

---

## 📱 PASO 13: Layout Responsive para Tablets

```markdown
Crea un ResponsiveLayout para VITAL 3.0:

- Detecta desktop, tablet y móvil.
- Sidebar colapsable, topbar adaptativo.
- Indicador visual del tipo de dispositivo.
- Optimizado para tablets médicos (10-13 pulgadas).
- Ejemplo de uso:
<ResponsiveLayout
  sidebar={<Sidebar />}
  topbar={<TopBar />}
>
  {children}
</ResponsiveLayout>
```

---

## ✅ RESUMEN

Este prompt define el sistema completo de componentes médicos, templates inteligentes, formularios dinámicos y funcionalidades avanzadas para VITAL 3.0, integrando glassmorphism, IA y UX optimizado para médicos.

