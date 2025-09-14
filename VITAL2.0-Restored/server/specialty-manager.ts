import { db } from './db';
import { specialties } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface MedicalField {
  id: string;
  name: string;
  type: 'checkbox' | 'text' | 'number' | 'select' | 'slider' | 'textarea';
  label: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  validation?: string;
  dependsOn?: string[];
  mutuallyExclusive?: string[];
}

export interface TemplateSection {
  id: string;
  name: string;
  icon: string;
  order: number;
  fields: MedicalField[];
  calculations?: CalculationRule[];
  triggers?: ConditionalTrigger[];
}

export interface CalculationRule {
  id: string;
  name: string;
  formula: string;
  inputFields: string[];
  outputField: string;
  classification?: { ranges: Array<{ min: number; max: number; label: string; color: string }> };
}

export interface ConditionalTrigger {
  id: string;
  condition: string;
  action: 'show' | 'hide' | 'require' | 'auto-select';
  targetFields: string[];
}

export interface ConsultationTemplate {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  requiredFields: string[];
  customFields: MedicalField[];
  templates: ConsultationTemplate[];
  createdAt: string;
  updatedAt: string;
  replitMetadata: {
    deploymentUrl?: string;
    createdBy: string;
    environment: string;
  };
}

export interface ConsultationData {
  id: string;
  specialtyId: string;
  templateId: string;
  patientId: string;
  doctorId: string;
  formData: Record<string, any>;
  calculations: Record<string, any>;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  replitMetadata: {
    deploymentUrl?: string;
    savedAt: string;
    version: string;
  };
}

export class SpecialtyManager {
  private static instance: SpecialtyManager;

  public static getInstance(): SpecialtyManager {
    if (!SpecialtyManager.instance) {
      SpecialtyManager.instance = new SpecialtyManager();
    }
    return SpecialtyManager.instance;
  }

  private constructor() {
    // Don't block construction on async initialization
    this.initializeSpecialties().catch(err => {
      console.error('Non-blocking specialty initialization error:', err);
    });
  }

  private async initializeSpecialties(): Promise<void> {
    try {
      console.log('Starting safe specialty initialization...');
      
      // First, ensure we have a clean slate by forcefully clearing any corrupted data
      await this.clearAllSpecialtyData();
      
      // Set up an empty active array to prevent crashes
      await this.ensureValidActiveArray();
      
      // Only proceed with initialization if the basic structure is stable
      try {
        // Test if we can safely read the active array
        const testRead = await this.safeGetActiveIds();
        if (testRead === null) {
          throw new Error('Cannot establish stable database connection for specialties');
        }
        
        console.log('Database connection stable, proceeding with initialization...');
        await this.createPredefinedSpecialties();
        
        // Final verification
        const finalCheck = await this.safeGetActiveIds();
        if (finalCheck && finalCheck.length > 0) {
          console.log(`Specialties initialized successfully: ${finalCheck.length} active specialties`);
        } else {
          console.warn('Initialization completed but no active specialties found');
        }
        
      } catch (initError) {
        console.error('Failed to initialize predefined specialties:', initError);
        // Don't throw here, let the app continue with empty specialties
      }
      
    } catch (error) {
      console.error('Critical error during specialty initialization setup:', error);
      // Attempt final fallback setup
      await this.ensureValidActiveArray();
    }
  }

  private async clearAllSpecialtyData(): Promise<void> {
    try {
      console.log('Clearing all specialty data for clean initialization...');
      
      // Clear specialties from PostgreSQL
      await db.delete(specialties);
      
      console.log('Specialty data cleanup completed');
    } catch (error) {
      console.warn('Error during specialty data cleanup:', error);
      // Don't throw, continue with initialization
    }
  }

  private async ensureValidActiveArray(): Promise<void> {
    try {
      // For PostgreSQL, we don't need to maintain a separate active array
      // Active specialties are determined by the isActive field in the specialties table
      console.log('PostgreSQL specialties table ready for active specialties');
    } catch (error) {
      console.error('CRITICAL: Cannot establish valid active specialties array:', error);
      throw error;
    }
  }

  private async safeGetActiveIds(): Promise<string[] | null> {
    try {
      // Get active specialties from PostgreSQL
      const result = await db.select({ id: specialties.id })
        .from(specialties)
        .where(eq(specialties.isActive, true));
      
      const activeIds = result.map(row => row.id);
      console.log(`Found ${activeIds.length} active specialties in PostgreSQL`);
      return activeIds;
    } catch (error) {
      console.error('Error safely reading active IDs from PostgreSQL:', error);
      return null;
    }
  }

  private async createPredefinedSpecialties(): Promise<void> {
    const specialties: Omit<Specialty, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'cardiologia',
        name: 'Cardiología',
        description: 'Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.',
        icon: 'FavoriteIcon',
        color: '#FF6B6B',
        isActive: true,
        requiredFields: ['presion_arterial', 'frecuencia_cardiaca', 'electrocardiograma'],
        customFields: [],
        templates: [await this.createCardiologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'dermatologia',
        name: 'Dermatología',
        description: 'Especialidad médica que se encarga del estudio de la estructura y función de la piel, así como de las enfermedades que la afectan.',
        icon: 'SpaIcon',
        color: '#4ECDC4',
        isActive: true,
        requiredFields: ['inspeccion_piel', 'lesiones_cutaneas'],
        customFields: [],
        templates: [await this.createDermatologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'gastroenterologia',
        name: 'Gastroenterología',
        description: 'Especialidad médica que estudia el sistema digestivo y sus enfermedades.',
        icon: 'RestaurantIcon',
        color: '#45B7D1',
        isActive: true,
        requiredFields: ['abdomen', 'habitos_intestinales'],
        customFields: [],
        templates: [await this.createGastroenterologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'traumatologia',
        name: 'Traumatología',
        description: 'Especialidad médica que se dedica al estudio de las lesiones del aparato locomotor.',
        icon: 'HealingIcon',
        color: '#96CEB4',
        isActive: true,
        requiredFields: ['examen_articular', 'movilidad'],
        customFields: [],
        templates: [await this.createTraumatologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'endocrinologia',
        name: 'Endocrinología',
        description: 'Especialidad médica que estudia las hormonas y las glándulas que las producen.',
        icon: 'BiotechIcon',
        color: '#FFEAA7',
        isActive: true,
        requiredFields: ['glucemia', 'tiroides'],
        customFields: [],
        templates: [await this.createEndocrinologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'neurologia',
        name: 'Neurología',
        description: 'Especialidad médica que trata los trastornos del sistema nervioso.',
        icon: 'PsychologyIcon',
        color: '#DDA0DD',
        isActive: true,
        requiredFields: ['examen_neurologico', 'reflejos'],
        customFields: [],
        templates: [await this.createNeurologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'urologia',
        name: 'Urología',
        description: 'Especialidad médico-quirúrgica que se ocupa del estudio, diagnóstico y tratamiento de las patologías que afectan al aparato urinario, glándulas suprarrenales y aparato genital masculino.',
        icon: 'WaterDropIcon',
        color: '#17A2B8',
        isActive: true,
        requiredFields: ['examen_genital', 'analisis_orina', 'funcion_renal'],
        customFields: [],
        templates: [await this.createUrologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      },
      {
        id: 'infectologia',
        name: 'Infectología',
        description: 'Especialidad médica que se dedica al diagnóstico y tratamiento de enfermedades infecciosas causadas por virus, bacterias, hongos y parásitos.',
        icon: 'ShieldIcon',
        color: '#FF7043',
        isActive: true,
        requiredFields: ['fiebre', 'cultivos', 'marcadores_inflamatorios'],
        customFields: [],
        templates: [await this.createInfectiologyTemplate()],
        replitMetadata: {
          deploymentUrl: process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : undefined,
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development'
        }
      }
    ];

    console.log('Creating predefined specialties in PostgreSQL...');
    
    // TODO: Implement PostgreSQL insertion for predefined specialties
    // For now, we'll use the existing seeder or let the database handle specialty creation
    console.log('Predefined specialties creation - using PostgreSQL seeder instead');
    
    // The specialties will be managed through the PostgreSQL database
    // Active specialties are determined by the isActive field in the specialties table
  }

  private async createCardiologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'cardio_consultation',
      name: 'Consulta Cardiológica',
      description: 'Plantilla estándar para consultas de cardiología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'sin_quejas',
              name: 'sin_quejas',
              type: 'checkbox',
              label: 'Sin quejas',
              required: false,
              mutuallyExclusive: ['dolor_toracico', 'disnea', 'palpitaciones']
            },
            {
              id: 'dolor_toracico',
              name: 'dolor_toracico',
              type: 'checkbox',
              label: 'Dolor torácico',
              required: false
            },
            {
              id: 'disnea',
              name: 'disnea',
              type: 'checkbox',
              label: 'Disnea',
              required: false
            },
            {
              id: 'palpitaciones',
              name: 'palpitaciones',
              type: 'checkbox',
              label: 'Palpitaciones',
              required: false
            }
          ],
          triggers: [
            {
              id: 'dolor_trigger',
              condition: 'dolor_toracico === true',
              action: 'show',
              targetFields: ['caracterizacion_dolor']
            }
          ]
        },
        {
          id: 'caracterizacion_dolor',
          name: 'Caracterización del Dolor',
          icon: 'PainIcon',
          order: 2,
          fields: [
            {
              id: 'localizacion_dolor',
              name: 'localizacion_dolor',
              type: 'select',
              label: 'Localización',
              required: true,
              options: ['Retroesternal', 'Precordial', 'Epigástrico', 'Brazo izquierdo', 'Mandíbula']
            },
            {
              id: 'irradiacion',
              name: 'irradiacion',
              type: 'select',
              label: 'Irradiación',
              required: false,
              options: ['Brazo izquierdo', 'Brazo derecho', 'Cuello', 'Mandíbula', 'Espalda', 'Sin irradiación']
            },
            {
              id: 'intensidad_dolor',
              name: 'intensidad_dolor',
              type: 'slider',
              label: 'Intensidad del dolor (0-10)',
              required: true,
              min: 0,
              max: 10
            },
            {
              id: 'factores_desencadenantes',
              name: 'factores_desencadenantes',
              type: 'select',
              label: 'Factores desencadenantes',
              required: false,
              options: ['Ejercicio', 'Estrés', 'Frío', 'Comida', 'Reposo', 'Ninguno']
            }
          ]
        },
        {
          id: 'examen_fisico',
          name: 'Examen Físico',
          icon: 'TouchAppIcon',
          order: 3,
          fields: [
            {
              id: 'presion_sistolica',
              name: 'presion_sistolica',
              type: 'number',
              label: 'Presión arterial sistólica',
              required: true,
              min: 50,
              max: 300,
              unit: 'mmHg'
            },
            {
              id: 'presion_diastolica',
              name: 'presion_diastolica',
              type: 'number',
              label: 'Presión arterial diastólica',
              required: true,
              min: 30,
              max: 200,
              unit: 'mmHg'
            },
            {
              id: 'frecuencia_cardiaca',
              name: 'frecuencia_cardiaca',
              type: 'number',
              label: 'Frecuencia cardíaca',
              required: true,
              min: 30,
              max: 250,
              unit: 'lpm'
            },
            {
              id: 'peso',
              name: 'peso',
              type: 'number',
              label: 'Peso',
              required: true,
              min: 20,
              max: 300,
              unit: 'kg'
            },
            {
              id: 'talla',
              name: 'talla',
              type: 'number',
              label: 'Talla',
              required: true,
              min: 100,
              max: 250,
              unit: 'cm'
            }
          ],
          calculations: [
            {
              id: 'pa_media',
              name: 'Presión Arterial Media',
              formula: '(presion_sistolica + 2 * presion_diastolica) / 3',
              inputFields: ['presion_sistolica', 'presion_diastolica'],
              outputField: 'pa_media',
              classification: {
                ranges: [
                  { min: 0, max: 70, label: 'Hipotensión', color: '#FF6B6B' },
                  { min: 70, max: 100, label: 'Normal', color: '#4ECDC4' },
                  { min: 100, max: 110, label: 'Elevada', color: '#FFE66D' },
                  { min: 110, max: 999, label: 'Hipertensión', color: '#FF6B6B' }
                ]
              }
            },
            {
              id: 'imc',
              name: 'Índice de Masa Corporal',
              formula: 'peso / ((talla/100) * (talla/100))',
              inputFields: ['peso', 'talla'],
              outputField: 'imc',
              classification: {
                ranges: [
                  { min: 0, max: 18.5, label: 'Bajo peso', color: '#FFE66D' },
                  { min: 18.5, max: 25, label: 'Normal', color: '#4ECDC4' },
                  { min: 25, max: 30, label: 'Sobrepeso', color: '#FFE66D' },
                  { min: 30, max: 999, label: 'Obesidad', color: '#FF6B6B' }
                ]
              }
            }
          ]
        },
        {
          id: 'diagnosticos',
          name: 'Pruebas Diagnósticas',
          icon: 'ScienceIcon',
          order: 4,
          fields: [
            {
              id: 'electrocardiograma',
              name: 'electrocardiograma',
              type: 'select',
              label: 'Electrocardiograma',
              required: true,
              options: ['Normal', 'Arritmia', 'Isquemia', 'Infarto', 'Bloqueo', 'No realizado']
            },
            {
              id: 'ecocardiograma',
              name: 'ecocardiograma',
              type: 'select',
              label: 'Ecocardiograma',
              required: false,
              options: ['Normal', 'Disfunción sistólica', 'Disfunción diastólica', 'Valvulopatía', 'No realizado']
            }
          ]
        },
        {
          id: 'conclusiones',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 5,
          fields: [
            {
              id: 'diagnostico_principal',
              name: 'diagnostico_principal',
              type: 'text',
              label: 'Diagnóstico principal',
              required: true
            },
            {
              id: 'plan_tratamiento',
              name: 'plan_tratamiento',
              type: 'textarea',
              label: 'Plan de tratamiento',
              required: true
            },
            {
              id: 'seguimiento',
              name: 'seguimiento',
              type: 'text',
              label: 'Seguimiento',
              required: false
            }
          ]
        }
      ]
    };
  }

  private async createDermatologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'derma_consultation',
      name: 'Consulta Dermatológica',
      description: 'Plantilla estándar para consultas de dermatología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_derma',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'motivo_consulta_derma',
              name: 'motivo_consulta_derma',
              type: 'textarea',
              label: 'Motivo de consulta',
              required: true
            },
            {
              id: 'tiempo_evolucion',
              name: 'tiempo_evolucion',
              type: 'text',
              label: 'Tiempo de evolución',
              required: true
            },
            {
              id: 'antecedentes_cutaneos',
              name: 'antecedentes_cutaneos',
              type: 'textarea',
              label: 'Antecedentes cutáneos',
              required: false
            }
          ]
        },
        {
          id: 'examen_dermatologico',
          name: 'Examen Dermatológico',
          icon: 'TouchAppIcon',
          order: 2,
          fields: [
            {
              id: 'tipo_lesion',
              name: 'tipo_lesion',
              type: 'select',
              label: 'Tipo de lesión',
              required: true,
              options: ['Mácula', 'Pápula', 'Vesícula', 'Pústula', 'Nódulo', 'Tumor', 'Úlcera', 'Costra']
            },
            {
              id: 'localizacion_lesion',
              name: 'localizacion_lesion',
              type: 'text',
              label: 'Localización',
              required: true
            },
            {
              id: 'tamaño_lesion',
              name: 'tamaño_lesion',
              type: 'text',
              label: 'Tamaño',
              required: true
            },
            {
              id: 'color_lesion',
              name: 'color_lesion',
              type: 'text',
              label: 'Color',
              required: true
            }
          ]
        },
        {
          id: 'conclusiones_derma',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 3,
          fields: [
            {
              id: 'diagnostico_dermatologico',
              name: 'diagnostico_dermatologico',
              type: 'text',
              label: 'Diagnóstico dermatológico',
              required: true
            },
            {
              id: 'tratamiento_derma',
              name: 'tratamiento_derma',
              type: 'textarea',
              label: 'Tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  private async createGastroenterologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'gastro_consultation',
      name: 'Consulta Gastroenterológica',
      description: 'Plantilla estándar para consultas de gastroenterología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_gastro',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'dolor_abdominal',
              name: 'dolor_abdominal',
              type: 'checkbox',
              label: 'Dolor abdominal',
              required: false
            },
            {
              id: 'nauseas',
              name: 'nauseas',
              type: 'checkbox',
              label: 'Náuseas',
              required: false
            },
            {
              id: 'vomitos',
              name: 'vomitos',
              type: 'checkbox',
              label: 'Vómitos',
              required: false
            },
            {
              id: 'melena',
              name: 'melena',
              type: 'checkbox',
              label: 'Melena',
              required: false
            }
          ],
          triggers: [
            {
              id: 'melena_trigger',
              condition: 'melena === true',
              action: 'auto-select',
              targetFields: ['heces_negras']
            }
          ]
        },
        {
          id: 'examen_abdominal',
          name: 'Examen Abdominal',
          icon: 'TouchAppIcon',
          order: 2,
          fields: [
            {
              id: 'inspeccion_abdomen',
              name: 'inspeccion_abdomen',
              type: 'select',
              label: 'Inspección del abdomen',
              required: true,
              options: ['Normal', 'Distendido', 'Excavado', 'Asimétrico']
            },
            {
              id: 'palpacion_abdomen',
              name: 'palpacion_abdomen',
              type: 'select',
              label: 'Palpación',
              required: true,
              options: ['Blando', 'Rígido', 'Doloroso', 'Masas palpables']
            },
            {
              id: 'heces_negras',
              name: 'heces_negras',
              type: 'checkbox',
              label: 'Heces negras',
              required: false,
              dependsOn: ['melena']
            }
          ]
        },
        {
          id: 'conclusiones_gastro',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 3,
          fields: [
            {
              id: 'diagnostico_gastro',
              name: 'diagnostico_gastro',
              type: 'text',
              label: 'Diagnóstico gastroenterológico',
              required: true
            },
            {
              id: 'tratamiento_gastro',
              name: 'tratamiento_gastro',
              type: 'textarea',
              label: 'Tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  private async createTraumatologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'trauma_consultation',
      name: 'Consulta Traumatológica',
      description: 'Plantilla estándar para consultas de traumatología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_trauma',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'mecanismo_lesion',
              name: 'mecanismo_lesion',
              type: 'select',
              label: 'Mecanismo de lesión',
              required: true,
              options: ['Traumatismo directo', 'Caída', 'Accidente vehicular', 'Lesión deportiva', 'Sobrecarga']
            },
            {
              id: 'localizacion_dolor_trauma',
              name: 'localizacion_dolor_trauma',
              type: 'text',
              label: 'Localización del dolor',
              required: true
            }
          ]
        },
        {
          id: 'examen_articular',
          name: 'Examen Articular',
          icon: 'TouchAppIcon',
          order: 2,
          fields: [
            {
              id: 'movilidad_articular',
              name: 'movilidad_articular',
              type: 'select',
              label: 'Movilidad articular',
              required: true,
              options: ['Normal', 'Limitada', 'Bloqueada', 'Inestable']
            },
            {
              id: 'edema',
              name: 'edema',
              type: 'checkbox',
              label: 'Edema',
              required: false
            },
            {
              id: 'deformidad',
              name: 'deformidad',
              type: 'checkbox',
              label: 'Deformidad',
              required: false
            }
          ]
        },
        {
          id: 'conclusiones_trauma',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 3,
          fields: [
            {
              id: 'diagnostico_trauma',
              name: 'diagnostico_trauma',
              type: 'text',
              label: 'Diagnóstico traumatológico',
              required: true
            },
            {
              id: 'tratamiento_trauma',
              name: 'tratamiento_trauma',
              type: 'textarea',
              label: 'Tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  private async createEndocrinologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'endo_consultation',
      name: 'Consulta Endocrinológica',
      description: 'Plantilla estándar para consultas de endocrinología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_endo',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'poliuria',
              name: 'poliuria',
              type: 'checkbox',
              label: 'Poliuria',
              required: false
            },
            {
              id: 'polidipsia',
              name: 'polidipsia',
              type: 'checkbox',
              label: 'Polidipsia',
              required: false
            },
            {
              id: 'perdida_peso',
              name: 'perdida_peso',
              type: 'checkbox',
              label: 'Pérdida de peso',
              required: false
            }
          ]
        },
        {
          id: 'laboratorio_endo',
          name: 'Laboratorio',
          icon: 'ScienceIcon',
          order: 2,
          fields: [
            {
              id: 'glucemia_ayunas',
              name: 'glucemia_ayunas',
              type: 'number',
              label: 'Glucemia en ayunas',
              required: true,
              min: 50,
              max: 500,
              unit: 'mg/dL'
            },
            {
              id: 'hba1c',
              name: 'hba1c',
              type: 'number',
              label: 'HbA1c',
              required: false,
              min: 4,
              max: 15,
              unit: '%'
            }
          ]
        },
        {
          id: 'conclusiones_endo',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 3,
          fields: [
            {
              id: 'diagnostico_endo',
              name: 'diagnostico_endo',
              type: 'text',
              label: 'Diagnóstico endocrinológico',
              required: true
            },
            {
              id: 'tratamiento_endo',
              name: 'tratamiento_endo',
              type: 'textarea',
              label: 'Tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  private async createNeurologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'neuro_consultation',
      name: 'Consulta Neurológica',
      description: 'Plantilla estándar para consultas de neurología',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_neuro',
          name: 'Anamnesis',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'cefalea',
              name: 'cefalea',
              type: 'checkbox',
              label: 'Cefalea',
              required: false
            },
            {
              id: 'mareos',
              name: 'mareos',
              type: 'checkbox',
              label: 'Mareos',
              required: false
            },
            {
              id: 'alteracion_memoria',
              name: 'alteracion_memoria',
              type: 'checkbox',
              label: 'Alteración de memoria',
              required: false
            }
          ]
        },
        {
          id: 'examen_neurologico',
          name: 'Examen Neurológico',
          icon: 'TouchAppIcon',
          order: 2,
          fields: [
            {
              id: 'estado_conciencia',
              name: 'estado_conciencia',
              type: 'select',
              label: 'Estado de conciencia',
              required: true,
              options: ['Alerta', 'Somnoliento', 'Estuporoso', 'Comatoso']
            },
            {
              id: 'reflejos_osteotendinosos',
              name: 'reflejos_osteotendinosos',
              type: 'select',
              label: 'Reflejos osteotendinosos',
              required: true,
              options: ['Normales', 'Aumentados', 'Disminuidos', 'Ausentes']
            }
          ]
        },
        {
          id: 'conclusiones_neuro',
          name: 'Conclusiones',
          icon: 'AssignmentTurnedInIcon',
          order: 3,
          fields: [
            {
              id: 'diagnostico_neuro',
              name: 'diagnostico_neuro',
              type: 'text',
              label: 'Diagnóstico neurológico',
              required: true
            },
            {
              id: 'tratamiento_neuro',
              name: 'tratamiento_neuro',
              type: 'textarea',
              label: 'Tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  private async createUrologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'urology_consultation',
      name: 'Consulta Urológica',
      description: 'Plantilla estándar para consultas de urología con análisis de gaps clínicos',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'anamnesis_urologica',
          name: 'Anamnesis Urológica',
          icon: 'HistoryIcon',
          order: 1,
          fields: [
            {
              id: 'disuria',
              name: 'disuria',
              type: 'checkbox',
              label: 'Disuria (dolor al orinar)',
              required: false
            },
            {
              id: 'polaquiuria',
              name: 'polaquiuria',
              type: 'checkbox',
              label: 'Polaquiuria (micción frecuente)',
              required: false
            },
            {
              id: 'hematuria',
              name: 'hematuria',
              type: 'checkbox',
              label: 'Hematuria (sangre en orina)',
              required: false
            },
            {
              id: 'retencion_urinaria',
              name: 'retencion_urinaria',
              type: 'checkbox',
              label: 'Retención urinaria',
              required: false
            },
            {
              id: 'incontinencia',
              name: 'incontinencia',
              type: 'checkbox',
              label: 'Incontinencia urinaria',
              required: false
            },
            {
              id: 'dolor_lumbar',
              name: 'dolor_lumbar',
              type: 'checkbox',
              label: 'Dolor lumbar',
              required: false
            }
          ],
          triggers: [
            {
              id: 'hematuria_trigger',
              condition: 'hematuria === true',
              action: 'require',
              targetFields: ['caracterizacion_hematuria']
            },
            {
              id: 'retencion_trigger',
              condition: 'retencion_urinaria === true',
              action: 'show',
              targetFields: ['tiempo_retencion']
            }
          ]
        },
        {
          id: 'examen_fisico_urologia',
          name: 'Examen Físico Urológico',
          icon: 'TouchAppIcon',
          order: 2,
          fields: [
            {
              id: 'palpacion_renal',
              name: 'palpacion_renal',
              type: 'select',
              label: 'Palpación renal',
              required: true,
              options: ['Normal', 'Dolor a la palpación', 'Masa palpable', 'Riñón aumentado']
            },
            {
              id: 'puño_percusion',
              name: 'puño_percusion',
              type: 'select',
              label: 'Puño percusión',
              required: true,
              options: ['Negativa', 'Positiva bilateral', 'Positiva derecha', 'Positiva izquierda']
            },
            {
              id: 'palpacion_vejiga',
              name: 'palpacion_vejiga',
              type: 'select',
              label: 'Palpación vesical',
              required: true,
              options: ['No palpable', 'Globo vesical', 'Dolor suprapúbico', 'Masa pélvica']
            },
            {
              id: 'examen_genital',
              name: 'examen_genital',
              type: 'select',
              label: 'Examen genital',
              required: true,
              options: ['Normal', 'Alteraciones', 'Pendiente', 'No realizado']
            }
          ]
        },
        {
          id: 'escalas_urologia',
          name: 'Escalas Urológicas',
          icon: 'AssessmentIcon',
          order: 3,
          fields: [
            {
              id: 'ipss_score',
              name: 'ipss_score',
              type: 'number',
              label: 'IPSS Score (0-35)',
              required: false,
              min: 0,
              max: 35
            },
            {
              id: 'iciq_score',
              name: 'iciq_score',
              type: 'number',
              label: 'ICIQ-SF Score (0-21)',
              required: false,
              min: 0,
              max: 21
            },
            {
              id: 'iief_score',
              name: 'iief_score',
              type: 'number',
              label: 'IIEF-5 Score (5-25)',
              required: false,
              min: 5,
              max: 25
            }
          ],
          calculations: [
            {
              id: 'ipss_classification',
              name: 'Clasificación IPSS',
              formula: 'ipss_score',
              inputFields: ['ipss_score'],
              outputField: 'ipss_class',
              classification: {
                ranges: [
                  { min: 0, max: 7, label: 'Síntomas leves', color: '#4ECDC4' },
                  { min: 8, max: 19, label: 'Síntomas moderados', color: '#FFE66D' },
                  { min: 20, max: 35, label: 'Síntomas severos', color: '#FF6B6B' }
                ]
              }
            }
          ]
        },
        {
          id: 'diagnostico_urologia',
          name: 'Diagnóstico y Plan',
          icon: 'AssignmentTurnedInIcon',
          order: 4,
          fields: [
            {
              id: 'diagnostico_urologico',
              name: 'diagnostico_urologico',
              type: 'text',
              label: 'Diagnóstico urológico',
              required: true
            },
            {
              id: 'estudios_solicitados',
              name: 'estudios_solicitados',
              type: 'textarea',
              label: 'Estudios solicitados',
              required: false
            },
            {
              id: 'tratamiento_urologia',
              name: 'tratamiento_urologia',
              type: 'textarea',
              label: 'Plan de tratamiento',
              required: true
            }
          ]
        }
      ]
    };
  }

  // Public methods
  public async getSpecialty(specialtyId: string): Promise<Specialty | null> {
    try {
      const result = await db.select()
        .from(specialties)
        .where(eq(specialties.id, specialtyId))
        .limit(1);
      
      if (result.length > 0) {
        return result[0] as Specialty;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting specialty from PostgreSQL:', error);
      return null;
    }
  }

  public async getActiveSpecialties(): Promise<Specialty[]> {
    try {
      // Use the safe method to get active IDs
      const activeIds = await this.safeGetActiveIds();
      
      // Handle null result (database corruption or error)
      if (activeIds === null) {
        console.error('Cannot safely read active specialties, attempting database recovery');
        // Try to recover by reinitializing the database
        try {
          await this.initializeSpecialties();
          // Retry once after recovery attempt
          const retryIds = await this.safeGetActiveIds();
          if (retryIds === null || !Array.isArray(retryIds)) {
            console.error('Database recovery failed, returning empty array');
            return [];
          }
          // Use recovered IDs
          return this.processActiveIds(retryIds);
        } catch (recoveryError) {
          console.error('Error during database recovery:', recoveryError);
          return [];
        }
      }
      
      // Ensure activeIds is iterable before processing
      if (!Array.isArray(activeIds)) {
        console.error('activeIds is not an array:', typeof activeIds, activeIds);
        return [];
      }
      
      return this.processActiveIds(activeIds);
    } catch (error) {
      console.error('Critical error getting active specialties:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  private async processActiveIds(activeIds: string[]): Promise<Specialty[]> {
    try {
      if (activeIds.length === 0) {
        console.log('No active specialty IDs found');
        return [];
      }
      
      // Filter out any invalid IDs (defensive programming)
      const validIds = activeIds.filter(id => typeof id === 'string' && id.length > 0);
      
      if (validIds.length !== activeIds.length) {
        console.warn(`Filtered out ${activeIds.length - validIds.length} invalid specialty IDs`);
      }
      
      if (validIds.length === 0) {
        console.warn('No valid specialty IDs found after filtering');
        return [];
      }
      
      const specialties: Specialty[] = [];
      
      // Retrieve each specialty safely with error isolation
      for (const id of validIds) {
        try {
          const specialty = await this.getSpecialty(id);
          if (specialty) {
            specialties.push(specialty);
          } else {
            console.warn(`Specialty with ID ${id} not found in database`);
          }
        } catch (specialtyError) {
          console.error(`Error retrieving specialty ${id}:`, specialtyError);
          // Continue with other specialties - don't let one failure break the rest
        }
      }
      
      return specialties;
    } catch (error) {
      console.error('Error processing active IDs:', error);
      return [];
    }
  }

  public async getTemplatesBySpecialty(specialtyId: string): Promise<ConsultationTemplate[]> {
    try {
      const specialty = await this.getSpecialty(specialtyId);
      return specialty?.templates || [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  public async saveConsultationData(consultationData: Omit<ConsultationData, 'id' | 'createdAt' | 'updatedAt' | 'replitMetadata'>): Promise<string> {
    try {
      const consultationId = `CONS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Consultation data would be saved with ID:', consultationId);
      // TODO: Implement consultation saving to PostgreSQL
      return consultationId;
    } catch (error) {
      console.error('Error saving consultation:', error);
      throw error;
    }
  }

  private async updateMetrics(specialtyId: string): Promise<void> {
    try {
      console.log('Metrics would be updated for specialty:', specialtyId);
      // TODO: Implement metrics update in PostgreSQL
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  public async getConsultation(consultationId: string): Promise<ConsultationData | null> {
    try {
      console.log('Would retrieve consultation with ID:', consultationId);
      // TODO: Implement consultation retrieval from PostgreSQL
      return null;
    } catch (error) {
      console.error('Error getting consultation:', error);
      return null;
    }
  }

  public async getDailyMetrics(date: string, specialtyId?: string): Promise<any> {
    try {
      console.log('Would retrieve metrics for date:', date, 'specialty:', specialtyId);
      // TODO: Implement metrics retrieval from PostgreSQL
      return specialtyId ? { count: 0, date, specialtyId } : {};
    } catch (error) {
      console.error('Error getting metrics:', error);
      return {};
    }
  }

  private async createInfectiologyTemplate(): Promise<ConsultationTemplate> {
    return {
      id: 'infectology_consultation',
      name: 'Consulta Infectológica',
      description: 'Plantilla estándar para consultas de infectología con evaluación de fiebre y manejo antimicrobiano',
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'evaluacion_fiebre',
          name: 'Evaluación de Fiebre',
          icon: 'LocalFireDepartmentIcon',
          order: 1,
          fields: [
            {
              id: 'fiebre_presente',
              name: 'fiebre_presente',
              type: 'checkbox',
              label: 'Fiebre presente',
              required: false
            },
            {
              id: 'temperatura_maxima',
              name: 'temperatura_maxima',
              type: 'number',
              label: 'Temperatura máxima (°C)',
              required: false,
              min: 35,
              max: 45,
              unit: '°C'
            },
            {
              id: 'patron_febril',
              name: 'patron_febril',
              type: 'select',
              label: 'Patrón febril',
              required: false,
              options: ['Continua', 'Intermitente', 'Remitente', 'Recurrente', 'Bifásica', 'Irregular']
            },
            {
              id: 'duracion_fiebre',
              name: 'duracion_fiebre',
              type: 'select',
              label: 'Duración de la fiebre',
              required: false,
              options: ['< 3 días', '3-7 días', '1-2 semanas', '2-3 semanas', '> 3 semanas (FOD)']
            }
          ]
        },
        {
          id: 'foco_infeccioso',
          name: 'Foco Infeccioso',
          icon: 'CoronavirusIcon',
          order: 2,
          fields: [
            {
              id: 'foco_respiratorio',
              name: 'foco_respiratorio',
              type: 'checkbox',
              label: 'Foco respiratorio',
              required: false
            },
            {
              id: 'foco_urinario',
              name: 'foco_urinario',
              type: 'checkbox',
              label: 'Foco urinario',
              required: false
            },
            {
              id: 'foco_gastrointestinal',
              name: 'foco_gastrointestinal',
              type: 'checkbox',
              label: 'Foco gastrointestinal',
              required: false
            }
          ]
        },
        {
          id: 'marcadores_inflamatorios',
          name: 'Marcadores Inflamatorios',
          icon: 'ScienceIcon',
          order: 3,
          fields: [
            {
              id: 'leucocitos',
              name: 'leucocitos',
              type: 'number',
              label: 'Leucocitos (×10³/µL)',
              required: false,
              min: 0.5,
              max: 50,
              unit: '×10³/µL'
            },
            {
              id: 'pcr',
              name: 'pcr',
              type: 'number',
              label: 'PCR (mg/L)',
              required: false,
              min: 0,
              max: 500,
              unit: 'mg/L'
            }
          ]
        },
        {
          id: 'tratamiento_antimicrobiano',
          name: 'Tratamiento Antimicrobiano',
          icon: 'MedicationIcon',
          order: 4,
          fields: [
            {
              id: 'antibiotico_empirico',
              name: 'antibiotico_empirico',
              type: 'text',
              label: 'Antibiótico empírico',
              required: false
            },
            {
              id: 'duracion_tratamiento',
              name: 'duracion_tratamiento',
              type: 'select',
              label: 'Duración del tratamiento',
              required: false,
              options: ['7-10 días', '10-14 días', '14-21 días', 'Según evolución']
            }
          ]
        }
      ]
    };
  }
}

export default SpecialtyManager;