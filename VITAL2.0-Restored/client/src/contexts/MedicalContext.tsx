import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useReplitCache } from '@/utils/cache-manager';
import { useMedicalPerformance } from '@/utils/performance';

// Medical state interfaces
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  medicalRecord: string;
  birthDate: string;
  lastVisit: string;
}

interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  specialtyId: string;
  templateId: string;
  formData: Record<string, any>;
  calculations: Record<string, any>;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface MedicalTemplate {
  id: string;
  name: string;
  description: string;
  specialtyId: string;
  sections: any[];
  version: string;
}

// Medical state structure
interface MedicalState {
  patients: {
    items: Patient[];
    loading: boolean;
    error: string | null;
    selectedPatient: Patient | null;
    searchQuery: string;
    filters: Record<string, any>;
  };
  consultations: {
    items: Consultation[];
    loading: boolean;
    error: string | null;
    currentConsultation: Consultation | null;
    drafts: Record<string, any>;
  };
  specialties: {
    items: Specialty[];
    loading: boolean;
    error: string | null;
    selectedSpecialty: string | null;
    templates: Record<string, MedicalTemplate[]>;
  };
  ui: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
    performance: {
      enabled: boolean;
      metrics: Record<string, number>;
    };
  };
}

// Action types
type MedicalAction =
  // Patient actions
  | { type: 'LOAD_PATIENTS_START' }
  | { type: 'LOAD_PATIENTS_SUCCESS'; payload: Patient[] }
  | { type: 'LOAD_PATIENTS_ERROR'; payload: string }
  | { type: 'SELECT_PATIENT'; payload: Patient | null }
  | { type: 'SET_PATIENT_SEARCH'; payload: string }
  | { type: 'SET_PATIENT_FILTERS'; payload: Record<string, any> }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: string }
  
  // Consultation actions
  | { type: 'LOAD_CONSULTATIONS_START' }
  | { type: 'LOAD_CONSULTATIONS_SUCCESS'; payload: Consultation[] }
  | { type: 'LOAD_CONSULTATIONS_ERROR'; payload: string }
  | { type: 'SET_CURRENT_CONSULTATION'; payload: Consultation | null }
  | { type: 'UPDATE_CONSULTATION_DRAFT'; payload: { id: string; data: any } }
  | { type: 'SAVE_CONSULTATION'; payload: Consultation }
  | { type: 'DELETE_CONSULTATION_DRAFT'; payload: string }
  
  // Specialty actions
  | { type: 'LOAD_SPECIALTIES_START' }
  | { type: 'LOAD_SPECIALTIES_SUCCESS'; payload: Specialty[] }
  | { type: 'LOAD_SPECIALTIES_ERROR'; payload: string }
  | { type: 'SELECT_SPECIALTY'; payload: string | null }
  | { type: 'LOAD_SPECIALTY_TEMPLATES'; payload: { specialtyId: string; templates: MedicalTemplate[] } }
  
  // UI actions
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'es' | 'en' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'UPDATE_PERFORMANCE_METRICS'; payload: Record<string, number> };

// Initial state
const initialState: MedicalState = {
  patients: {
    items: [],
    loading: false,
    error: null,
    selectedPatient: null,
    searchQuery: '',
    filters: {}
  },
  consultations: {
    items: [],
    loading: false,
    error: null,
    currentConsultation: null,
    drafts: {}
  },
  specialties: {
    items: [],
    loading: false,
    error: null,
    selectedSpecialty: null,
    templates: {}
  },
  ui: {
    sidebarCollapsed: false,
    theme: 'dark',
    language: 'es',
    notifications: true,
    performance: {
      enabled: true,
      metrics: {}
    }
  }
};

// Reducer function
function medicalReducer(state: MedicalState, action: MedicalAction): MedicalState {
  switch (action.type) {
    // Patient reducers
    case 'LOAD_PATIENTS_START':
      return {
        ...state,
        patients: { ...state.patients, loading: true, error: null }
      };
    
    case 'LOAD_PATIENTS_SUCCESS':
      return {
        ...state,
        patients: { ...state.patients, loading: false, items: action.payload }
      };
    
    case 'LOAD_PATIENTS_ERROR':
      return {
        ...state,
        patients: { ...state.patients, loading: false, error: action.payload }
      };
    
    case 'SELECT_PATIENT':
      return {
        ...state,
        patients: { ...state.patients, selectedPatient: action.payload }
      };
    
    case 'SET_PATIENT_SEARCH':
      return {
        ...state,
        patients: { ...state.patients, searchQuery: action.payload }
      };
    
    case 'SET_PATIENT_FILTERS':
      return {
        ...state,
        patients: { ...state.patients, filters: action.payload }
      };
    
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          items: [...state.patients.items, action.payload]
        }
      };
    
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          items: state.patients.items.map(patient =>
            patient.id === action.payload.id ? action.payload : patient
          )
        }
      };
    
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          items: state.patients.items.filter(patient => patient.id !== action.payload)
        }
      };

    // Consultation reducers
    case 'LOAD_CONSULTATIONS_START':
      return {
        ...state,
        consultations: { ...state.consultations, loading: true, error: null }
      };
    
    case 'LOAD_CONSULTATIONS_SUCCESS':
      return {
        ...state,
        consultations: { ...state.consultations, loading: false, items: action.payload }
      };
    
    case 'LOAD_CONSULTATIONS_ERROR':
      return {
        ...state,
        consultations: { ...state.consultations, loading: false, error: action.payload }
      };
    
    case 'SET_CURRENT_CONSULTATION':
      return {
        ...state,
        consultations: { ...state.consultations, currentConsultation: action.payload }
      };
    
    case 'UPDATE_CONSULTATION_DRAFT':
      return {
        ...state,
        consultations: {
          ...state.consultations,
          drafts: {
            ...state.consultations.drafts,
            [action.payload.id]: action.payload.data
          }
        }
      };
    
    case 'SAVE_CONSULTATION':
      return {
        ...state,
        consultations: {
          ...state.consultations,
          items: state.consultations.items.some(c => c.id === action.payload.id)
            ? state.consultations.items.map(c => c.id === action.payload.id ? action.payload : c)
            : [...state.consultations.items, action.payload],
          drafts: Object.fromEntries(
            Object.entries(state.consultations.drafts).filter(([id]) => id !== action.payload.id)
          )
        }
      };

    // Specialty reducers
    case 'LOAD_SPECIALTIES_START':
      return {
        ...state,
        specialties: { ...state.specialties, loading: true, error: null }
      };
    
    case 'LOAD_SPECIALTIES_SUCCESS':
      return {
        ...state,
        specialties: { ...state.specialties, loading: false, items: action.payload }
      };
    
    case 'SELECT_SPECIALTY':
      return {
        ...state,
        specialties: { ...state.specialties, selectedSpecialty: action.payload }
      };
    
    case 'LOAD_SPECIALTY_TEMPLATES':
      return {
        ...state,
        specialties: {
          ...state.specialties,
          templates: {
            ...state.specialties.templates,
            [action.payload.specialtyId]: action.payload.templates
          }
        }
      };

    // UI reducers
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
      };
    
    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        ui: { ...state.ui, language: action.payload }
      };
    
    case 'UPDATE_PERFORMANCE_METRICS':
      return {
        ...state,
        ui: {
          ...state.ui,
          performance: {
            ...state.ui.performance,
            metrics: { ...state.ui.performance.metrics, ...action.payload }
          }
        }
      };

    default:
      return state;
  }
}

// Context creation
const MedicalContext = createContext<{
  state: MedicalState;
  dispatch: React.Dispatch<MedicalAction>;
  actions: {
    // Patient actions
    loadPatients: () => Promise<void>;
    selectPatient: (patient: Patient | null) => void;
    setPatientSearch: (query: string) => void;
    setPatientFilters: (filters: Record<string, any>) => void;
    addPatient: (patient: Patient) => void;
    updatePatient: (patient: Patient) => void;
    deletePatient: (patientId: string) => void;
    
    // Consultation actions
    loadConsultations: () => Promise<void>;
    setCurrentConsultation: (consultation: Consultation | null) => void;
    updateConsultationDraft: (id: string, data: any) => void;
    saveConsultation: (consultation: Consultation) => Promise<void>;
    
    // Specialty actions
    loadSpecialties: () => Promise<void>;
    selectSpecialty: (specialtyId: string | null) => void;
    loadSpecialtyTemplates: (specialtyId: string) => Promise<void>;
    
    // UI actions
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (language: 'es' | 'en') => void;
    updatePerformanceMetrics: (metrics: Record<string, number>) => void;
  };
} | null>(null);

// Provider component
export function MedicalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(medicalReducer, initialState);
  const cache = useReplitCache();
  const { markStart, markEnd } = useMedicalPerformance();

  // Load initial data on mount
  useEffect(() => {
    loadSpecialties();
    loadStoredSettings();
  }, []);

  // Persist UI settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medical-ui-settings', JSON.stringify(state.ui));
    }
  }, [state.ui]);

  // Auto-save consultation drafts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medical-consultation-drafts', JSON.stringify(state.consultations.drafts));
    }
  }, [state.consultations.drafts]);

  const loadStoredSettings = () => {
    if (typeof window === 'undefined') return;

    try {
      const storedSettings = localStorage.getItem('medical-ui-settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        Object.entries(settings).forEach(([key, value]) => {
          if (key === 'theme') dispatch({ type: 'SET_THEME', payload: value as 'light' | 'dark' });
          if (key === 'language') dispatch({ type: 'SET_LANGUAGE', payload: value as 'es' | 'en' });
        });
      }

      const storedDrafts = localStorage.getItem('medical-consultation-drafts');
      if (storedDrafts) {
        const drafts = JSON.parse(storedDrafts);
        Object.entries(drafts).forEach(([id, data]) => {
          dispatch({ type: 'UPDATE_CONSULTATION_DRAFT', payload: { id, data } });
        });
      }
    } catch (error) {
      console.error('Error loading stored settings:', error);
    }
  };

  // Patient actions
  const loadPatients = async () => {
    markStart('patientSearchResponse');
    dispatch({ type: 'LOAD_PATIENTS_START' });
    
    try {
      // Check cache first
      const cachedPatients = cache.getMedical<Patient[]>('patient', 'all');
      if (cachedPatients) {
        dispatch({ type: 'LOAD_PATIENTS_SUCCESS', payload: cachedPatients });
        markEnd('patientSearchResponse');
        return;
      }

      const response = await fetch('/api/patients');
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'LOAD_PATIENTS_SUCCESS', payload: data.data });
        cache.setMedical('patient', 'all', data.data);
      } else {
        dispatch({ type: 'LOAD_PATIENTS_ERROR', payload: data.error });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_PATIENTS_ERROR', payload: 'Error loading patients' });
    }
    
    markEnd('patientSearchResponse');
  };

  const selectPatient = (patient: Patient | null) => {
    dispatch({ type: 'SELECT_PATIENT', payload: patient });
  };

  const setPatientSearch = (query: string) => {
    dispatch({ type: 'SET_PATIENT_SEARCH', payload: query });
  };

  const setPatientFilters = (filters: Record<string, any>) => {
    dispatch({ type: 'SET_PATIENT_FILTERS', payload: filters });
  };

  const addPatient = (patient: Patient) => {
    dispatch({ type: 'ADD_PATIENT', payload: patient });
    cache.invalidateMedicalCategory('patient');
  };

  const updatePatient = (patient: Patient) => {
    dispatch({ type: 'UPDATE_PATIENT', payload: patient });
    cache.invalidateMedicalCategory('patient');
  };

  const deletePatient = (patientId: string) => {
    dispatch({ type: 'DELETE_PATIENT', payload: patientId });
    cache.invalidateMedicalCategory('patient');
  };

  // Consultation actions
  const loadConsultations = async () => {
    markStart('consultationFormLoad');
    dispatch({ type: 'LOAD_CONSULTATIONS_START' });
    
    try {
      const response = await fetch('/api/consultations');
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'LOAD_CONSULTATIONS_SUCCESS', payload: data.data });
        cache.setMedical('consultation', 'all', data.data);
      } else {
        dispatch({ type: 'LOAD_CONSULTATIONS_ERROR', payload: data.error });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_CONSULTATIONS_ERROR', payload: 'Error loading consultations' });
    }
    
    markEnd('consultationFormLoad');
  };

  const setCurrentConsultation = (consultation: Consultation | null) => {
    dispatch({ type: 'SET_CURRENT_CONSULTATION', payload: consultation });
  };

  const updateConsultationDraft = (id: string, data: any) => {
    dispatch({ type: 'UPDATE_CONSULTATION_DRAFT', payload: { id, data } });
  };

  const saveConsultation = async (consultation: Consultation) => {
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultation)
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'SAVE_CONSULTATION', payload: data.data });
        cache.invalidateMedicalCategory('consultation');
      }
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  };

  // Specialty actions
  const loadSpecialties = async () => {
    markStart('specialtyTemplateLoad');
    dispatch({ type: 'LOAD_SPECIALTIES_START' });
    
    try {
      const cachedSpecialties = cache.getMedical<Specialty[]>('specialty', 'all');
      if (cachedSpecialties) {
        dispatch({ type: 'LOAD_SPECIALTIES_SUCCESS', payload: cachedSpecialties });
        markEnd('specialtyTemplateLoad');
        return;
      }

      const response = await fetch('/api/specialties/active');
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'LOAD_SPECIALTIES_SUCCESS', payload: data.data });
        cache.setMedical('specialty', 'all', data.data);
      } else {
        dispatch({ type: 'LOAD_SPECIALTIES_ERROR', payload: data.error });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_SPECIALTIES_ERROR', payload: 'Error loading specialties' });
    }
    
    markEnd('specialtyTemplateLoad');
  };

  const selectSpecialty = (specialtyId: string | null) => {
    dispatch({ type: 'SELECT_SPECIALTY', payload: specialtyId });
    if (specialtyId) {
      loadSpecialtyTemplates(specialtyId);
    }
  };

  const loadSpecialtyTemplates = async (specialtyId: string) => {
    try {
      const cachedTemplates = cache.getMedical<MedicalTemplate[]>('template', specialtyId);
      if (cachedTemplates) {
        dispatch({ 
          type: 'LOAD_SPECIALTY_TEMPLATES', 
          payload: { specialtyId, templates: cachedTemplates } 
        });
        return;
      }

      const response = await fetch(`/api/specialties/${specialtyId}/templates`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({ 
          type: 'LOAD_SPECIALTY_TEMPLATES', 
          payload: { specialtyId, templates: data.data } 
        });
        cache.setMedical('template', specialtyId, data.data);
      }
    } catch (error) {
      console.error('Error loading specialty templates:', error);
    }
  };

  // UI actions
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setLanguage = (language: 'es' | 'en') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const updatePerformanceMetrics = (metrics: Record<string, number>) => {
    dispatch({ type: 'UPDATE_PERFORMANCE_METRICS', payload: metrics });
  };

  const actions = {
    loadPatients,
    selectPatient,
    setPatientSearch,
    setPatientFilters,
    addPatient,
    updatePatient,
    deletePatient,
    loadConsultations,
    setCurrentConsultation,
    updateConsultationDraft,
    saveConsultation,
    loadSpecialties,
    selectSpecialty,
    loadSpecialtyTemplates,
    toggleSidebar,
    setTheme,
    setLanguage,
    updatePerformanceMetrics
  };

  return (
    <MedicalContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </MedicalContext.Provider>
  );
}

// Hook to use medical context
export function useMedical() {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
}

export default MedicalContext;