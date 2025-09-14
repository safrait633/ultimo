import { db } from "./db";
import { specialties } from "@shared/schema";
import { eq } from "drizzle-orm";

// Lista completa de 22 especialidades médicas con iconos apropiados
export const MEDICAL_SPECIALTIES = [
  {
    name: "Cardiología",
    slug: "cardiologia",
    description: "Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del aparato circulatorio.",
    icon: "Heart"
  },
  {
    name: "Neumología",
    slug: "neumologia", 
    description: "Especialidad médica que se encarga del estudio de las enfermedades del aparato respiratorio.",
    icon: "Lungs"
  },
  {
    name: "Gastroenterología",
    slug: "gastroenterologia",
    description: "Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del aparato digestivo.",
    icon: "Stomach"
  },
  {
    name: "Endocrinología",
    slug: "endocrinologia",
    description: "Especialidad médica que estudia las glándulas que producen las hormonas.",
    icon: "Dna"
  },
  {
    name: "Hematología",
    slug: "hematologia",
    description: "Especialidad médica que se encarga del estudio de la sangre y los órganos hematopoyéticos.",
    icon: "Droplets"
  },
  {
    name: "Neurología",
    slug: "neurologia",
    description: "Especialidad médica que trata los trastornos del sistema nervioso.",
    icon: "Brain"
  },
  {
    name: "Oftalmología",
    slug: "oftalmologia",
    description: "Especialidad médica que estudia las enfermedades de los ojos y su tratamiento.",
    icon: "Eye"
  },
  {
    name: "Otorrinolaringología",
    slug: "otorrinolaringologia",
    description: "Especialidad médica que se encarga de la prevención, diagnóstico y tratamiento de las enfermedades del oído, nariz y garganta.",
    icon: "Ear"
  },
  {
    name: "Reumatología",
    slug: "reumatologia",
    description: "Especialidad médica dedicada a los trastornos médicos del aparato locomotor y del tejido conectivo.",
    icon: "Bone"
  },
  {
    name: "Dermatología",
    slug: "dermatologia",
    description: "Especialidad médica que se encarga del estudio de la estructura y función de la piel.",
    icon: "Scan"
  },
  {
    name: "Medicina Musculoesquelética",
    slug: "medicina-musculoesqueletica",
    description: "Especialidad que se centra en el diagnóstico y tratamiento de lesiones y enfermedades del sistema musculoesquelético.",
    icon: "Bone"
  },
  {
    name: "Urología",
    slug: "urologia",
    description: "Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las patologías que afectan al aparato urinario y reproductor masculino.",
    icon: "Kidney"
  },
  {
    name: "Medicina Interna",
    slug: "medicina-interna",
    description: "Especialidad médica que se dedica a la atención integral del adulto enfermo, enfocada en el diagnóstico y el tratamiento no quirúrgico.",
    icon: "Stethoscope"
  },
  {
    name: "Medicina Familiar",
    slug: "medicina-familiar",
    description: "Especialidad médica que proporciona atención médica continua e integral al individuo y la familia.",
    icon: "Users"
  },
  {
    name: "Pediatría",
    slug: "pediatria",
    description: "Especialidad médica que estudia al niño y sus enfermedades.",
    icon: "Baby"
  },
  {
    name: "Ginecología y Obstetricia",
    slug: "ginecologia-obstetricia",
    description: "Especialidad médica que se encarga de todo lo relacionado con el aparato reproductor femenino y el proceso del embarazo.",
    icon: "HeartHandshake"
  },
  {
    name: "Cirugía General",
    slug: "cirugia-general",
    description: "Especialidad médica que abarca las operaciones del aparato digestivo, sistema hepatobiliar, sistema endocrino y otras áreas.",
    icon: "Scissors"
  },
  {
    name: "Oncología",
    slug: "oncologia",
    description: "Especialidad médica que se encarga del estudio, diagnóstico, tratamiento y seguimiento de los pacientes con cáncer.",
    icon: "ShieldAlert"
  },
  {
    name: "Radiología",
    slug: "radiologia",
    description: "Especialidad médica que se encarga del diagnóstico y tratamiento de enfermedades utilizando tecnologías de imagen.",
    icon: "ScanLine"
  },
  {
    name: "Psiquiatría",
    slug: "psiquiatria",
    description: "Especialidad médica dedicada al estudio, prevención, diagnóstico y tratamiento de los trastornos mentales.",
    icon: "HeadIcon"
  },
  {
    name: "Anestesiología",
    slug: "anestesiologia",
    description: "Especialidad médica dedicada al cuidado perioperatorio, manejo del dolor y cuidados críticos.",
    icon: "Syringe"
  },
  {
    name: "Medicina de Emergencia",
    slug: "medicina-emergencia",
    description: "Especialidad médica que se centra en el cuidado de pacientes en situaciones de emergencia médica.",
    icon: "Ambulance"
  },
  {
    name: "Traumatología",
    slug: "traumatologia",
    description: "Especialidad médica dedicada al diagnóstico y tratamiento de lesiones traumáticas del sistema musculoesquelético mediante exploración sistemática.",
    icon: "Bone"
  },
  {
    name: "Infectología",
    slug: "infectologia",
    description: "Especialidad médica que se dedica al diagnóstico y tratamiento de enfermedades infecciosas causadas por virus, bacterias, hongos y parásitos.",
    icon: "Shield"
  }
];

export async function seedSpecialties() {
  console.log("🏥 Iniciando siembra de especialidades médicas...");
  
  try {
    // Borrar especialidades existentes
    await db.delete(specialties);
    console.log("✓ Especialidades existentes eliminadas");
    
    // Insertar nuevas especialidades
    for (const specialty of MEDICAL_SPECIALTIES) {
      await db.insert(specialties).values({
        name: specialty.name,
        slug: specialty.slug,
        description: specialty.description,
        icon: specialty.icon,
        patientCount: 0,
        isActive: true
      });
    }
    
    console.log(`✓ ${MEDICAL_SPECIALTIES.length} especialidades médicas insertadas correctamente`);
    
    // Verificar la inserción
    const count = await db.select().from(specialties);
    console.log(`📊 Total de especialidades en base de datos: ${count.length}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error al sembrar especialidades:", error);
    return false;
  }
}

// Todas las especialidades que tienen archivos HTML y formularios React implementados
const IMPLEMENTED_SPECIALTIES = [
  'cardiologia',
  'dermatologia',
  'endocrinologia', 
  'gastroenterologia',
  'geriatria',
  'hematologia',
  'infectologia',
  'neurologia',
  'oftalmologia',
  'otorrinolaringologia',
  'neumologia',
  'psiquiatria',
  'reumatologia',
  'traumatologia',
  'urologia'
];

// Función para obtener solo las especialidades completamente implementadas
export async function getActiveSpecialties() {
  try {
    const activeSpecialties = await db
      .select()
      .from(specialties)
      .where(eq(specialties.isActive, true))
      .orderBy(specialties.name);
    
    // Filtrar solo las especialidades completamente implementadas
    const implementedSpecialties = activeSpecialties.filter(specialty => 
      IMPLEMENTED_SPECIALTIES.includes(specialty.slug)
    );
    
    return implementedSpecialties;
  } catch (error) {
    console.error("Error al obtener especialidades activas:", error);
    return [];
  }
}

// Función para obtener una especialidad por slug
export async function getSpecialtyBySlug(slug: string) {
  try {
    const specialty = await db
      .select()
      .from(specialties)
      .where(eq(specialties.slug, slug));
    
    return specialty[0] || null;
  } catch (error) {
    console.error("Error al obtener especialidad por slug:", error);
    return null;
  }
}