import express from 'express';
import SpecialtyManager from '../specialty-manager.js';

const router = express.Router();
const specialtyManager = SpecialtyManager.getInstance();

// Get all active specialties
router.get('/active', async (req, res) => {
  try {
    const specialties = await specialtyManager.getActiveSpecialties();
    res.json({
      success: true,
      data: specialties,
      count: specialties.length
    });
  } catch (error) {
    console.error('Error getting active specialties:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving specialties'
    });
  }
});

// Get specific specialty
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const specialty = await specialtyManager.getSpecialty(id);
    
    if (!specialty) {
      return res.status(404).json({
        success: false,
        error: 'Specialty not found'
      });
    }
    
    res.json({
      success: true,
      data: specialty
    });
  } catch (error) {
    console.error('Error getting specialty:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving specialty'
    });
  }
});

// Get templates for a specialty
router.get('/:id/templates', async (req, res) => {
  try {
    const { id } = req.params;
    const templates = await specialtyManager.getTemplatesBySpecialty(id);
    
    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving templates'
    });
  }
});

// Save consultation data
router.post('/:id/consultations', async (req, res) => {
  try {
    const { id: specialtyId } = req.params;
    const { templateId, patientId, doctorId, formData, calculations, status = 'draft' } = req.body;
    
    if (!templateId || !patientId || !doctorId || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: templateId, patientId, doctorId, formData'
      });
    }
    
    const consultationId = await specialtyManager.saveConsultationData({
      specialtyId,
      templateId,
      patientId,
      doctorId,
      formData,
      calculations: calculations || {},
      status
    });
    
    res.status(201).json({
      success: true,
      data: {
        consultationId,
        message: 'Consultation saved successfully'
      }
    });
  } catch (error) {
    console.error('Error saving consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Error saving consultation'
    });
  }
});

// Get consultation data
router.get('/consultations/:consultationId', async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await specialtyManager.getConsultation(consultationId);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error getting consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving consultation'
    });
  }
});

// Get daily metrics
router.get('/metrics/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { specialtyId } = req.query;
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    const metrics = await specialtyManager.getDailyMetrics(date, specialtyId as string);
    
    res.json({
      success: true,
      data: metrics,
      date
    });
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Error retrieving metrics'
    });
  }
});

export default router;