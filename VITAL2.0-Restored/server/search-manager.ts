import Database from '@replit/database';

const db = new Database();

export interface SearchResult {
  id: string;
  type: 'patient' | 'consultation' | 'diagnosis' | 'medical_code';
  title: string;
  subtitle: string;
  relevance: number;
  metadata: Record<string, any>;
  highlighted?: string;
}

export interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  specialties?: string[];
  status?: string[];
  doctors?: string[];
  hospitals?: string[];
  type?: string[];
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: SearchFilters;
  metadata: {
    searchTime: number;
    suggestion?: string;
    categories: {
      patients: number;
      consultations: number;
      diagnoses: number;
      medical_codes: number;
    };
  };
}

export class SearchManager {
  private static instance: SearchManager;

  public static getInstance(): SearchManager {
    if (!SearchManager.instance) {
      SearchManager.instance = new SearchManager();
    }
    return SearchManager.instance;
  }

  private constructor() {
    this.initializeSearchData();
  }

  private async initializeSearchData(): Promise<void> {
    try {
      // Initialize medical codes (CIE-10) if not exists
      const existingCodes = await db.get('medical_codes:initialized');
      if (!existingCodes) {
        await this.initializeMedicalCodes();
        await db.set('medical_codes:initialized', true);
      }

      // Initialize sample patients if not exists
      const existingPatients = await db.get('search_patients:initialized');
      if (!existingPatients) {
        await this.initializeSamplePatients();
        await db.set('search_patients:initialized', true);
      }
    } catch (error) {
      console.error('Error initializing search data:', error);
    }
  }

  private async initializeMedicalCodes(): Promise<void> {
    const medicalCodes = [
      { code: 'I20', description: 'Angina de pecho', category: 'Cardiología' },
      { code: 'I21', description: 'Infarto agudo del miocardio', category: 'Cardiología' },
      { code: 'I25', description: 'Enfermedad isquémica crónica del corazón', category: 'Cardiología' },
      { code: 'I10', description: 'Hipertensión esencial', category: 'Cardiología' },
      { code: 'I50', description: 'Insuficiencia cardíaca', category: 'Cardiología' },
      { code: 'L20', description: 'Dermatitis atópica', category: 'Dermatología' },
      { code: 'L30', description: 'Otras dermatitis', category: 'Dermatología' },
      { code: 'L40', description: 'Psoriasis', category: 'Dermatología' },
      { code: 'K29', description: 'Gastritis y duodenitis', category: 'Gastroenterología' },
      { code: 'K59', description: 'Otros trastornos funcionales del intestino', category: 'Gastroenterología' },
      { code: 'M79', description: 'Otros trastornos de los tejidos blandos', category: 'Traumatología' },
      { code: 'M25', description: 'Otros trastornos articulares', category: 'Traumatología' },
      { code: 'E11', description: 'Diabetes mellitus tipo 2', category: 'Endocrinología' },
      { code: 'E03', description: 'Otro hipotiroidismo', category: 'Endocrinología' },
      { code: 'G43', description: 'Migraña', category: 'Neurología' },
      { code: 'G47', description: 'Trastornos del sueño', category: 'Neurología' }
    ];

    for (const code of medicalCodes) {
      await db.set(`medical_codes:${code.code}`, {
        ...code,
        id: code.code,
        type: 'medical_code',
        createdAt: new Date().toISOString()
      });
    }
  }

  private async initializeSamplePatients(): Promise<void> {
    const samplePatients = [
      {
        id: 'PAT001',
        name: 'María González Pérez',
        email: 'maria.gonzalez@email.com',
        phone: '+34 612 345 678',
        medicalRecord: 'MED001',
        birthDate: '1978-05-15',
        lastVisit: '2024-01-15'
      },
      {
        id: 'PAT002',
        name: 'Carlos Rodríguez López',
        email: 'carlos.rodriguez@email.com',
        phone: '+34 687 123 456',
        medicalRecord: 'MED002',
        birthDate: '1991-03-22',
        lastVisit: '2024-01-12'
      },
      {
        id: 'PAT003',
        name: 'Ana Martín Silva',
        email: 'ana.martin@email.com',
        phone: '+34 654 987 321',
        medicalRecord: 'MED003',
        birthDate: '1995-08-10',
        lastVisit: '2024-01-10'
      },
      {
        id: 'PAT004',
        name: 'José Luis Fernández',
        email: 'joseluis.fernandez@email.com',
        phone: '+34 698 456 789',
        medicalRecord: 'MED004',
        birthDate: '1956-12-03',
        lastVisit: '2024-01-08'
      }
    ];

    for (const patient of samplePatients) {
      await db.set(`search_patients:${patient.id}`, {
        ...patient,
        type: 'patient',
        createdAt: new Date().toISOString()
      });
    }
  }

  public async performSearch(searchRequest: SearchRequest): Promise<SearchResponse> {
    const startTime = Date.now();
    const { query, filters = {}, page = 1, limit = 20, sortBy = 'relevance', sortOrder = 'desc' } = searchRequest;
    
    try {
      let allResults: SearchResult[] = [];

      // Search in different collections
      const [patientResults, consultationResults, medicalCodeResults] = await Promise.all([
        this.searchPatients(query, filters),
        this.searchConsultations(query, filters),
        this.searchMedicalCodes(query, filters)
      ]);

      allResults = [...patientResults, ...consultationResults, ...medicalCodeResults];

      // Apply additional filters
      allResults = this.applyFilters(allResults, filters);

      // Sort results
      allResults = this.sortResults(allResults, sortBy, sortOrder);

      // Calculate pagination
      const total = allResults.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = allResults.slice(startIndex, endIndex);

      // Calculate categories
      const categories = {
        patients: allResults.filter(r => r.type === 'patient').length,
        consultations: allResults.filter(r => r.type === 'consultation').length,
        diagnoses: allResults.filter(r => r.type === 'diagnosis').length,
        medical_codes: allResults.filter(r => r.type === 'medical_code').length
      };

      const searchTime = Date.now() - startTime;

      return {
        results: paginatedResults,
        total,
        page,
        limit,
        hasMore: endIndex < total,
        filters,
        metadata: {
          searchTime,
          suggestion: this.generateSuggestion(query, total),
          categories
        }
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private async searchPatients(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    try {
      // Get all patient keys
      const keys = await this.getKeysWithPrefix('search_patients:');
      
      for (const key of keys) {
        if (key === 'search_patients:initialized') continue;
        
        const patient = await db.get(key);
        if (!patient) continue;

        const relevance = this.calculateRelevance(query, [
          patient.name,
          patient.email,
          patient.medicalRecord,
          patient.phone
        ]);

        if (relevance > 0) {
          results.push({
            id: patient.id,
            type: 'patient',
            title: patient.name,
            subtitle: `${patient.medicalRecord} • ${patient.email}`,
            relevance,
            metadata: {
              phone: patient.phone,
              lastVisit: patient.lastVisit,
              birthDate: patient.birthDate
            },
            highlighted: this.highlightText(patient.name, query)
          });
        }
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }

    return results;
  }

  private async searchConsultations(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    try {
      // Get all consultation keys
      const keys = await this.getKeysWithPrefix('consultations:');
      
      for (const key of keys) {
        const consultation = await db.get(key);
        if (!consultation) continue;

        const searchableText = [
          consultation.specialtyId,
          consultation.status,
          JSON.stringify(consultation.formData),
          consultation.createdAt
        ];

        const relevance = this.calculateRelevance(query, searchableText);

        if (relevance > 0) {
          results.push({
            id: consultation.id,
            type: 'consultation',
            title: `Consulta ${consultation.specialtyId}`,
            subtitle: `Estado: ${consultation.status} • ${new Date(consultation.createdAt).toLocaleDateString('es-ES')}`,
            relevance,
            metadata: {
              specialtyId: consultation.specialtyId,
              status: consultation.status,
              doctorId: consultation.doctorId,
              patientId: consultation.patientId,
              createdAt: consultation.createdAt
            }
          });
        }
      }
    } catch (error) {
      console.error('Error searching consultations:', error);
    }

    return results;
  }

  private async searchMedicalCodes(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    try {
      // Get all medical code keys
      const keys = await this.getKeysWithPrefix('medical_codes:');
      
      for (const key of keys) {
        if (key === 'medical_codes:initialized') continue;
        
        const code = await db.get(key);
        if (!code) continue;

        const relevance = this.calculateRelevance(query, [
          code.code,
          code.description,
          code.category
        ]);

        if (relevance > 0) {
          results.push({
            id: code.code,
            type: 'medical_code',
            title: `${code.code} - ${code.description}`,
            subtitle: `Categoría: ${code.category}`,
            relevance,
            metadata: {
              code: code.code,
              category: code.category
            },
            highlighted: this.highlightText(code.description, query)
          });
        }
      }
    } catch (error) {
      console.error('Error searching medical codes:', error);
    }

    return results;
  }

  private async getKeysWithPrefix(prefix: string): Promise<string[]> {
    try {
      // This is a simplified version - in a real implementation,
      // you might need to maintain indexes or use a different approach
      return [];
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  private calculateRelevance(query: string, fields: string[]): number {
    if (!query || query.trim().length === 0) return 0;

    const queryLower = query.toLowerCase().trim();
    let relevance = 0;

    for (const field of fields) {
      if (!field) continue;
      
      const fieldLower = field.toLowerCase();
      
      // Exact match gets highest score
      if (fieldLower === queryLower) {
        relevance += 100;
      }
      // Starts with query gets high score
      else if (fieldLower.startsWith(queryLower)) {
        relevance += 80;
      }
      // Contains query gets medium score
      else if (fieldLower.includes(queryLower)) {
        relevance += 50;
      }
      // Word boundary match gets lower score
      else if (new RegExp(`\\b${queryLower}`, 'i').test(fieldLower)) {
        relevance += 30;
      }
    }

    return relevance;
  }

  private highlightText(text: string, query: string): string {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    let filtered = results;

    // Date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.metadata.createdAt || result.metadata.lastVisit);
        return resultDate >= startDate && resultDate <= endDate;
      });
    }

    // Specialties filter
    if (filters.specialties && filters.specialties.length > 0) {
      filtered = filtered.filter(result => 
        !result.metadata.specialtyId || 
        filters.specialties!.includes(result.metadata.specialtyId) ||
        !result.metadata.category ||
        filters.specialties!.includes(result.metadata.category)
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(result => 
        !result.metadata.status || 
        filters.status!.includes(result.metadata.status)
      );
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(result => 
        filters.type!.includes(result.type)
      );
    }

    return filtered;
  }

  private sortResults(results: SearchResult[], sortBy: string, sortOrder: string): SearchResult[] {
    return results.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'relevance':
          compareValue = b.relevance - a.relevance;
          break;
        case 'date':
          const dateA = new Date(a.metadata.createdAt || a.metadata.lastVisit || 0);
          const dateB = new Date(b.metadata.createdAt || b.metadata.lastVisit || 0);
          compareValue = dateB.getTime() - dateA.getTime();
          break;
        case 'name':
          compareValue = a.title.localeCompare(b.title);
          break;
        default:
          compareValue = b.relevance - a.relevance;
      }

      return sortOrder === 'desc' ? compareValue : -compareValue;
    });
  }

  private generateSuggestion(query: string, resultCount: number): string | undefined {
    if (resultCount === 0) {
      return `No se encontraron resultados para "${query}". Intenta con términos más generales.`;
    }
    
    if (resultCount < 3) {
      return `Pocos resultados para "${query}". Considera ampliar tu búsqueda.`;
    }

    return undefined;
  }

  public async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const suggestions: string[] = [];
    
    try {
      // Get suggestions from different sources
      const [patientNames, specialties, medicalCodes] = await Promise.all([
        this.getPatientSuggestions(query),
        this.getSpecialtySuggestions(query),
        this.getMedicalCodeSuggestions(query)
      ]);

      suggestions.push(...patientNames, ...specialties, ...medicalCodes);
      
      // Remove duplicates and limit to 10
      return [...new Set(suggestions)].slice(0, 10);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  private async getPatientSuggestions(query: string): Promise<string[]> {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    try {
      const keys = await this.getKeysWithPrefix('search_patients:');
      
      for (const key of keys) {
        if (key === 'search_patients:initialized') continue;
        
        const patient = await db.get(key);
        if (!patient) continue;

        if (patient.name.toLowerCase().includes(queryLower)) {
          suggestions.push(patient.name);
        }
        if (patient.medicalRecord.toLowerCase().includes(queryLower)) {
          suggestions.push(patient.medicalRecord);
        }
      }
    } catch (error) {
      console.error('Error getting patient suggestions:', error);
    }

    return suggestions;
  }

  private async getSpecialtySuggestions(query: string): Promise<string[]> {
    const specialties = ['Cardiología', 'Dermatología', 'Gastroenterología', 'Traumatología', 'Endocrinología', 'Neurología'];
    const queryLower = query.toLowerCase();
    
    return specialties.filter(specialty => 
      specialty.toLowerCase().includes(queryLower)
    );
  }

  private async getMedicalCodeSuggestions(query: string): Promise<string[]> {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    try {
      const keys = await this.getKeysWithPrefix('medical_codes:');
      
      for (const key of keys) {
        if (key === 'medical_codes:initialized') continue;
        
        const code = await db.get(key);
        if (!code) continue;

        if (code.code.toLowerCase().includes(queryLower) || 
            code.description.toLowerCase().includes(queryLower)) {
          suggestions.push(`${code.code} - ${code.description}`);
        }
      }
    } catch (error) {
      console.error('Error getting medical code suggestions:', error);
    }

    return suggestions;
  }
}

export default SearchManager;