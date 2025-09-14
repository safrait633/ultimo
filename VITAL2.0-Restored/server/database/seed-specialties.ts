import { db } from '../db.js';
import { specialties } from '@shared/schema';
import { eq } from 'drizzle-orm';

type SpecialtyData = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

const MEDICAL_SPECIALTIES: SpecialtyData[] = [
  {
    name: 'Cardiología',
    slug: 'cardiologia',
    description: 'Especialidad médica que se ocupa de las afecciones del corazón y el sistema cardiovascular',
    icon: 'Heart'
  },
  {
    name: 'Neumología',
    slug: 'neumologia',
    description: 'Especialidad médica que se ocupa del estudio y tratamiento de las enfermedades del aparato respiratorio',
    icon: 'Lungs'
  },
  {
    name: 'Gastroenterología',
    slug: 'gastroenterologia',
    description: 'Especialidad médica que se ocupa del estudio, diagnóstico y tratamiento de las enfermedades del aparato digestivo',
    icon: 'Soup'
  },
  {
    name: 'Endocrinología',
    slug: 'endocrinologia',
    description: 'Especialidad médica que estudia las glándulas endocrinas y las hormonas que producen',
    icon: 'Dna'
  },
  {
    name: 'Hematología',
    slug: 'hematologia',
    description: 'Especialidad médica que se dedica al tratamiento de pacientes con enfermedades hematológicas',
    icon: 'Droplet'
  },
  {
    name: 'Neurología',
    slug: 'neurologia',
    description: 'Especialidad médica que trata los trastornos del sistema nervioso',
    icon: 'Brain'
  },
  {
    name: 'Oftalmología',
    slug: 'oftalmologia',
    description: 'Especialidad médica que se ocupa de las enfermedades y cirugía ocular',
    icon: 'Eye'
  },
  {
    name: 'Otorrinolaringología',
    slug: 'otorrinolaringologia',
    description: 'Especialidad médica que se ocupa de la prevención, diagnóstico médico, médico-quirúrgico y tratamiento de las enfermedades del oído, las vías aéreo-respiratorias superiores y parte de las inferiores',
    icon: 'Ear'
  },
  {
    name: 'Reumatología',
    slug: 'reumatologia',
    description: 'Especialidad médica dedicada a los trastornos médicos del aparato locomotor y del tejido conectivo',
    icon: 'Bone'
  },
  {
    name: 'Dermatología',
    slug: 'dermatologia',
    description: 'Especialidad médica que se ocupa del conocimiento y estudio de la piel humana y de las enfermedades que la afectan',
    icon: 'Fingerprint'
  },
  {
    name: 'Medicina Musculoesquelética',
    slug: 'medicina-musculoesqueletica',
    description: 'Especialidad que se enfoca en el diagnóstico, tratamiento y prevención de trastornos del sistema musculoesquelético',
    icon: 'Activity'
  },
  {
    name: 'Urología',
    slug: 'urologia',
    description: 'Especialidad médico-quirúrgica que se ocupa del estudio, diagnóstico y tratamiento de las patologías que afectan al aparato urinario, glándulas suprarrenales y aparato genital masculino',
    icon: 'Beaker'
  },
  {
    name: 'Medicina Interna',
    slug: 'medicina-interna',
    description: 'Especialidad médica que se dedica a la atención integral del adulto enfermo, enfocada en el diagnóstico y el tratamiento no quirúrgico de las enfermedades que afectan a sus órganos y sistemas internos',
    icon: 'Stethoscope'
  },
  {
    name: 'Medicina Familiar',
    slug: 'medicina-familiar',
    description: 'Especialidad médica que proporciona atención sanitaria continua e integral al individuo y la familia',
    icon: 'Users'
  },
  {
    name: 'Pediatría',
    slug: 'pediatria',
    description: 'Especialidad médica que estudia al niño y sus enfermedades',
    icon: 'Baby'
  },
  {
    name: 'Ginecología y Obstetricia',
    slug: 'ginecologia-obstetricia',
    description: 'Especialidad médico-quirúrgica que se ocupa de todo lo relacionado con el aparato reproductor femenino y el proceso obstétrico',
    icon: 'Heart'
  },
  {
    name: 'Cirugía General',
    slug: 'cirugia-general',
    description: 'Especialidad médica de clase quirúrgica que abarca las operaciones del aparato digestivo incluyendo el tracto biliar, el sistema endocrino, las mamas, la piel y los tejidos blandos',
    icon: 'Scissors'
  },
  {
    name: 'Oncología',
    slug: 'oncologia',
    description: 'Especialidad médica que estudia y trata las neoplasias; tumores benignos y malignos, pero con especial atención a los malignos, esto es, al cáncer',
    icon: 'Shield'
  },
  {
    name: 'Radiología',
    slug: 'radiologia',
    description: 'Especialidad médica que se ocupa de generar imágenes del interior del cuerpo mediante diferentes agentes físicos y de utilizar estas imágenes para el diagnóstico y, en menor medida, para el pronóstico y el tratamiento de las enfermedades',
    icon: 'Scan'
  },
  {
    name: 'Psiquiatría',
    slug: 'psiquiatria',
    description: 'Especialidad de la medicina dedicada al estudio de la mente con el objetivo de prevenir, evaluar, diagnosticar, tratar y rehabilitar a las personas con trastornos mentales y desviaciones de lo óptimo',
    icon: 'HeadSide'
  },
  {
    name: 'Anestesiología',
    slug: 'anestesiologia',
    description: 'Especialidad médica dedicada, junto con la medicina perioperatoria, al alivio del dolor y al cuidado total del paciente quirúrgico, antes, durante y después de la cirugía',
    icon: 'Syringe'
  },
  {
    name: 'Medicina de Emergencia',
    slug: 'medicina-emergencia',
    description: 'Especialidad médica que abarca la atención de pacientes adultos y pediátricos con enfermedades y lesiones agudas no diagnosticadas que requieren atención médica inmediata',
    icon: 'Zap'
  }
];

export async function seedSpecialties() {
  console.log('🩺 Seeding medical specialties...');
  
  try {
    for (const specialtyData of MEDICAL_SPECIALTIES) {
      // Check if specialty already exists
      const [existingSpecialty] = await db
        .select()
        .from(specialties)
        .where(eq(specialties.slug, specialtyData.slug))
        .limit(1);

      if (existingSpecialty) {
        console.log(`✓ Specialty ${specialtyData.name} already exists`);
        continue;
      }

      // Create new specialty
      const [newSpecialty] = await db
        .insert(specialties)
        .values(specialtyData)
        .returning();

      console.log(`✓ Created specialty: ${newSpecialty.name} (${newSpecialty.slug})`);
    }

    // Get count of specialties
    const allSpecialties = await db.select().from(specialties);
    console.log(`\n📊 Total specialties in database: ${allSpecialties.length}`);
    
    console.log('\n🩺 Medical specialties seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding specialties:', error);
    throw error;
  }
}

// If run directly
if (require.main === module) {
  seedSpecialties().catch(console.error);
}