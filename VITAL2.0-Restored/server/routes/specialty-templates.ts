import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const router = Router();

// Schema para validar plantillas de especialidad
const SpecialtyTemplateSchema = z.object({
  specialtySlug: z.string(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string(),
    questions: z.array(z.object({
      id: z.string(),
      question: z.string(),
      type: z.enum(['select', 'scale', 'text', 'checkbox', 'radio']),
      options: z.array(z.string()).optional(),
      scale: z.object({
        min: z.number(),
        max: z.number(),
        labels: z.array(z.string())
      }).optional(),
      required: z.boolean().optional(),
      validation: z.any().optional()
    }))
  }))
});

// Obtener plantilla de una especialidad
router.get('/:specialtySlug', async (req, res) => {
  try {
    const { specialtySlug } = req.params;
    
    // Buscar plantillas para esta especialidad
    const templates = await storage.getFormTemplatesBySpecialty(specialtySlug);
    
    if (templates.length === 0) {
      return res.json({
        success: true,
        data: {
          specialtySlug,
          sections: [],
          message: 'No hay plantillas definidas para esta especialidad'
        }
      });
    }

    // Para cada template, obtener sus secciones y campos
    const templateData: any[] = [];
    for (const template of templates) {
      const sections = await storage.getFormSectionsByTemplate(template.id);
      const sectionsWithFields: any[] = [];
      
      for (const section of sections) {
        const fields = await storage.getFormFieldsBySection(section.id);
        sectionsWithFields.push({
          id: section.name,
          title: section.title,
          icon: 'Stethoscope', // Default, se puede personalizar
          questions: fields.map((field: any) => ({
            id: field.name,
            question: field.label,
            type: field.type,
            options: field.options ? JSON.parse(field.options) : undefined,
            required: field.isRequired,
            validation: field.validation ? JSON.parse(field.validation) : undefined
          }))
        });
      }
      
      templateData.push({
        id: template.id,
        name: template.name,
        description: template.description,
        sections: sectionsWithFields
      });
    }

    res.json({
      success: true,
      data: {
        specialtySlug,
        templates: templateData
      }
    });
  } catch (error) {
    console.error('Error getting specialty template:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving specialty template'
    });
  }
});

// Crear o actualizar plantilla de especialidad
router.post('/:specialtySlug', async (req, res) => {
  try {
    const { specialtySlug } = req.params;
    const templateData = SpecialtyTemplateSchema.parse(req.body);
    
    // Verificar que la especialidad existe
    const specialty = await storage.getSpecialtyBySlug(specialtySlug);
    if (!specialty) {
      return res.status(404).json({
        success: false,
        error: 'Specialty not found'
      });
    }

    // Crear template principal
    const template = await storage.createFormTemplate({
      name: `Examen de ${specialty.name}`,
      specialty: specialtySlug,
      description: `Plantilla simplificada para examen de ${specialty.name}`,
      createdBy: req.user?.id || 'system'
    });

    // Crear secciones y campos
    for (let index = 0; index < templateData.sections.length; index++) {
      const section = templateData.sections[index];
      const createdSection = await storage.createFormSection({
        templateId: template.id,
        name: section.id,
        title: section.title,
        description: `Sección de ${section.title}`,
        order: index + 1,
        isRequired: true
      });

      // Crear campos para esta sección
      for (let fieldIndex = 0; fieldIndex < section.questions.length; fieldIndex++) {
        const question = section.questions[fieldIndex];
        await storage.createFormField({
          sectionId: createdSection.id,
          name: question.id,
          label: question.question,
          type: question.type,
          options: question.options ? JSON.stringify(question.options) : null,
          validation: question.validation ? JSON.stringify(question.validation) : null,
          order: fieldIndex + 1,
          isRequired: question.required || false
        });
      }
    }

    res.json({
      success: true,
      data: {
        templateId: template.id,
        message: `Template created for ${specialty.name}`
      }
    });
  } catch (error) {
    console.error('Error creating specialty template:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template data',
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error creating specialty template'
    });
  }
});

// Eliminar plantilla de especialidad
router.delete('/:specialtySlug', async (req, res) => {
  try {
    const { specialtySlug } = req.params;
    
    // Buscar y eliminar todas las plantillas de esta especialidad
    const templates = await storage.getFormTemplatesBySpecialty(specialtySlug);
    
    for (const template of templates) {
      // Eliminar campos y secciones
      const sections = await storage.getFormSectionsByTemplate(template.id);
      for (const section of sections) {
        await storage.deleteFormFieldsBySection(section.id);
        await storage.deleteFormSection(section.id);
      }
      await storage.deleteFormTemplate(template.id);
    }

    res.json({
      success: true,
      message: `Templates deleted for ${specialtySlug}`
    });
  } catch (error) {
    console.error('Error deleting specialty template:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting specialty template'
    });
  }
});

// Listar todas las plantillas disponibles
router.get('/', async (req, res) => {
  try {
    const templates = await storage.getAllFormTemplates();
    
    const templatesWithSpecialty = templates.map((template: any) => ({
      id: template.id,
      name: template.name,
      specialty: template.specialty,
      description: template.description,
      version: template.version,
      createdAt: template.createdAt,
      isActive: template.isActive
    }));

    res.json({
      success: true,
      data: templatesWithSpecialty
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({
      success: false,
      error: 'Error listing templates'
    });
  }
});

export default router;