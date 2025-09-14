import { Router } from 'express';
import { db } from '../db';
import { anonymousPatients, insertAnonymousPatientSchema } from '@shared/schema';
import { requireAuth } from '../middleware/auth-middleware';
import { sql } from 'drizzle-orm';

const router = Router();

// Crear paciente anónimo (solo edad y sexo)
router.post('/', requireAuth, async (req, res) => {
  try {
    const patientData = insertAnonymousPatientSchema.parse(req.body);
    
    const [newPatient] = await db
      .insert(anonymousPatients)
      .values(patientData)
      .returning();

    res.status(201).json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    console.error('Error creating anonymous patient:', error);
    res.status(400).json({
      success: false,
      error: 'Error creating anonymous patient'
    });
  }
});

// Obtener estadísticas de pacientes anónimos
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await db
      .select({
        gender: anonymousPatients.gender,
        birthDate: anonymousPatients.birthDate,
        createdAt: anonymousPatients.createdAt
      })
      .from(anonymousPatients);

    const genderStats = stats.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calcular edad desde fecha de nacimiento
    const calculateAge = (birthDate: string): number => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    };

    const ageGroups = stats.reduce((acc, patient) => {
      const age = calculateAge(patient.birthDate);
      const ageGroup = age < 18 ? 'pediatric' : 
                     age < 65 ? 'adult' : 'elderly';
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        total: stats.length,
        genderStats,
        ageGroups
      }
    });
  } catch (error) {
    console.error('Error fetching anonymous patient stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching statistics'
    });
  }
});

export default router;