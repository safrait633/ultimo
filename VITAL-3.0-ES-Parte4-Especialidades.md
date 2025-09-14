# 🩺 VITAL 3.0 - Parte 4: Especialidades Médicas y Expansión
## 🇪🇸 Prompt para crear y ampliar especialidades en la plataforma

> **OBJETIVO**: Definir cómo crear, personalizar y expandir nuevas especialidades médicas en VITAL 3.0, incluyendo campos, colores, iconos y plantillas rápidas.

---

## 🧩 PROMPT PARA GENERAR ESPECIALIDADES

```markdown
Crea una nueva especialidad médica para VITAL 3.0 con los siguientes parámetros:

- Nombre de la especialidad (multiidioma)
- Descripción breve
- Icono y color principal
- Campos clínicos principales (JSON)
- Campos obligatorios y opcionales
- Plantillas rápidas asociadas
- Reglas de validación y recomendaciones IA

EJEMPLO DE ESPECIALIDAD:

{
  "name": {
    "es": "Neumología",
    "en": "Pulmonology",
    "fr": "Pneumologie",
    "pt": "Pneumologia"
  },
  "slug": "pulmonology",
  "description": {
    "es": "Especialidad que estudia las enfermedades respiratorias",
    "en": "Specialty for respiratory diseases"
  },
  "icon": "lungs",
  "color_primary": "#0D9488",
  "fields": {
    "vitals": ["respiratory_rate", "oxygen_saturation", "temperature"],
    "examination": ["auscultation", "cough", "dyspnea", "spirometry"],
    "tests": ["chest_xray", "ct_scan", "blood_gas"]
  },
  "required_fields": ["respiratory_rate", "auscultation", "diagnosis"],
  "optional_fields": ["spirometry", "blood_gas"],
  "quick_templates": [
    {
      "name": "Neumonía aguda",
      "fields_prefilled": {
        "cough": "Productiva",
        "temperature": "38.5°C",
        "auscultation": "Crepitantes"
      },
      "ai_suggestions": ["Solicitar radiografía", "Iniciar antibióticos"]
    },
    {
      "name": "EPOC exacerbación",
      "fields_prefilled": {
        "dyspnea": "Aumentada",
        "oxygen_saturation": "88%"
      },
      "ai_suggestions": ["Broncodilatadores", "Oxigenoterapia"]
    }
  ]
}
```

---

## 🎨 COLORES Y ICONOS POR ESPECIALIDAD

- cardiology: '#DC2626', icon: 'heart'
- neurology: '#7C3AED', icon: 'brain'
- gastroenterology: '#059669', icon: 'activity'
- endocrinology: '#D97706', icon: 'zap'
- dermatology: '#EC4899', icon: 'droplet'
- orthopedics: '#1D4ED8', icon: 'bone'
- pulmonology: '#0D9488', icon: 'lungs'
- pediatrics: '#EA580C', icon: 'baby'
- psychiatry: '#7C2D12', icon: 'user'
- oncology: '#991B1B', icon: 'flask'

---

## 🛠️ INTEGRACIÓN EN LA PLATAFORMA

- Añadir especialidad en la tabla `medical_specialties` (MySQL)
- Definir campos en `template_fields` y `required_fields`
- Crear plantillas rápidas en `examination_templates`
- Añadir traducciones en `system_translations`
- Personalizar colores y iconos en frontend (Tailwind + Lucide)

---

## 🚀 BEST PRACTICES

- Usar nombres y descripciones multiidioma
- Definir mínimo 3 plantillas rápidas por especialidad
- Validar campos obligatorios en backend y frontend
- Actualizar documentación y ejemplos en cada expansión
- Sincronizar especialidades con base de patologías ICD-10

---

## 📦 EJEMPLO DE PROMPT PARA NUEVA ESPECIALIDAD

```
Crea la especialidad "Reumatología" para VITAL 3.0:

- Nombre multiidioma: Reumatología / Rheumatology / Rhumatologie / Reumatologia
- Icono: "bone"
- Color: "#7C3AED"
- Campos principales: dolor articular, inflamación, movilidad, pruebas de laboratorio
- Plantillas rápidas: "Artritis reumatoide", "Lupus eritematoso", "Gota aguda"
- Traducciones y campos obligatorios
```

---

## ✅ RESUMEN

Este prompt permite crear y expandir especialidades médicas en VITAL 3.0 de forma estructurada, rápida y multiidioma, integrando campos, colores, iconos y plantillas para mejorar el flujo de trabajo médico.

