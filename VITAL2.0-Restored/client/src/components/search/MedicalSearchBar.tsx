import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, FileDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  text: string;
  category: 'patients' | 'consultations' | 'diagnoses' | 'medical_codes';
}

interface SearchFilters {
  dateRange?: { start: string; end: string };
  specialties?: string[];
  status?: string[];
  doctors?: string[];
  hospitals?: string[];
  type?: string[];
}

interface MedicalSearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  onExport: () => void;
  filters: SearchFilters;
  resultCount: number;
  isLoading: boolean;
  className?: string;
}

export default function MedicalSearchBar({
  onSearch,
  onFiltersChange,
  onExport,
  filters,
  resultCount,
  isLoading,
  className = ''
}: MedicalSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        onSearch(query, filters);
        fetchSuggestions(query);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query, filters]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        const categorizedSuggestions = data.data.map((text: string) => ({
          text,
          category: getCategoryFromText(text)
        }));
        setSuggestions(categorizedSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const getCategoryFromText = (text: string): SearchSuggestion['category'] => {
    if (text.match(/^[A-Z]\d+/)) return 'medical_codes';
    if (text.includes('@')) return 'patients';
    if (text.includes('MED') || text.includes('PAT')) return 'patients';
    if (['Cardiología', 'Dermatología', 'Gastroenterología'].some(s => text.includes(s))) {
      return 'consultations';
    }
    return 'diagnoses';
  };

  const getCategoryLabel = (category: SearchSuggestion['category']) => {
    const labels = {
      patients: 'Pacientes',
      consultations: 'Consultas', 
      diagnoses: 'Diagnósticos',
      medical_codes: 'Códigos CIE-10'
    };
    return labels[category];
  };

  const getCategoryColor = (category: SearchSuggestion['category']) => {
    const colors = {
      patients: 'bg-blue-500/10 text-blue-600',
      consultations: 'bg-green-500/10 text-green-600',
      diagnoses: 'bg-yellow-500/10 text-yellow-600',
      medical_codes: 'bg-purple-500/10 text-purple-600'
    };
    return colors[category];
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text, filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch(query, filters);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('', filters);
    inputRef.current?.focus();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange) count++;
    if (filters.specialties?.length) count += filters.specialties.length;
    if (filters.status?.length) count += filters.status.length;
    if (filters.doctors?.length) count += filters.doctors.length;
    if (filters.hospitals?.length) count += filters.hospitals.length;
    if (filters.type?.length) count += filters.type.length;
    return count;
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const removeFilter = (filterType: keyof SearchFilters, value?: string) => {
    const newFilters = { ...filters };
    
    if (filterType === 'dateRange') {
      delete newFilters.dateRange;
    } else if (value && Array.isArray(newFilters[filterType])) {
      newFilters[filterType] = (newFilters[filterType] as string[]).filter(v => v !== value);
      if (newFilters[filterType]?.length === 0) {
        delete newFilters[filterType];
      }
    }
    
    onFiltersChange(newFilters);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7D8590] w-5 h-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar pacientes, consultas, diagnósticos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="pl-10 pr-20 h-12 text-base bg-[#1C2128] border-[#374151] text-[#E6EDF3] placeholder-[#7D8590]"
            data-testid="search-input"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-[#7D8590] hover:text-[#E6EDF3]"
              data-testid="clear-search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#238636] w-5 h-5 animate-spin" />
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1C2128] border-[#374151] shadow-lg">
            <CardContent className="p-2">
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#21262D] transition-colors text-left"
                    data-testid={`suggestion-${index}`}
                  >
                    <span className="text-[#E6EDF3] flex-1">
                      {suggestion.text}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getCategoryColor(suggestion.category))}
                    >
                      {getCategoryLabel(suggestion.category)}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters and Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "border-[#374151] text-[#E6EDF3]",
              activeFiltersCount > 0 && "border-[#238636] text-[#238636]"
            )}
            data-testid="toggle-filters"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-[#238636] text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Clear All Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-[#7D8590] hover:text-[#E6EDF3]"
              data-testid="clear-filters"
            >
              Limpiar filtros
            </Button>
          )}

          {/* Results Count */}
          <span className="text-sm text-[#7D8590]">
            {resultCount > 0 ? `${resultCount} resultados` : 'Sin resultados'}
          </span>
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={resultCount === 0 || isLoading}
          className="border-[#374151] text-[#E6EDF3] hover:border-[#238636]"
          data-testid="export-button"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* Date Range */}
          {filters.dateRange && (
            <Badge 
              variant="outline" 
              className="border-[#238636] text-[#238636] bg-[#238636]/10"
            >
              {new Date(filters.dateRange.start).toLocaleDateString()} - {new Date(filters.dateRange.end).toLocaleDateString()}
              <button
                onClick={() => removeFilter('dateRange')}
                className="ml-2 hover:text-[#da3633]"
                data-testid="remove-date-filter"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {/* Specialties */}
          {filters.specialties?.map((specialty) => (
            <Badge 
              key={specialty}
              variant="outline" 
              className="border-blue-500 text-blue-400 bg-blue-500/10"
            >
              {specialty}
              <button
                onClick={() => removeFilter('specialties', specialty)}
                className="ml-2 hover:text-[#da3633]"
                data-testid={`remove-specialty-${specialty}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {/* Status */}
          {filters.status?.map((status) => (
            <Badge 
              key={status}
              variant="outline" 
              className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
            >
              {status}
              <button
                onClick={() => removeFilter('status', status)}
                className="ml-2 hover:text-[#da3633]"
                data-testid={`remove-status-${status}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {/* Doctors */}
          {filters.doctors?.map((doctor) => (
            <Badge 
              key={doctor}
              variant="outline" 
              className="border-green-500 text-green-400 bg-green-500/10"
            >
              {doctor}
              <button
                onClick={() => removeFilter('doctors', doctor)}
                className="ml-2 hover:text-[#da3633]"
                data-testid={`remove-doctor-${doctor}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}

          {/* Type */}
          {filters.type?.map((type) => (
            <Badge 
              key={type}
              variant="outline" 
              className="border-purple-500 text-purple-400 bg-purple-500/10"
            >
              {type}
              <button
                onClick={() => removeFilter('type', type)}
                className="ml-2 hover:text-[#da3633]"
                data-testid={`remove-type-${type}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-[#1C2128] border-[#374151]">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E6EDF3]">Rango de fechas</label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      dateRange: {
                        start: e.target.value,
                        end: filters.dateRange?.end || e.target.value
                      }
                    })}
                    className="bg-[#0F1419] border-[#374151]"
                    data-testid="date-start"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      dateRange: {
                        start: filters.dateRange?.start || e.target.value,
                        end: e.target.value
                      }
                    })}
                    className="bg-[#0F1419] border-[#374151]"
                    data-testid="date-end"
                  />
                </div>
              </div>

              {/* Quick Date Presets */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E6EDF3]">Presets rápidos</label>
                <div className="space-y-1">
                  {[
                    { label: 'Hoy', days: 0 },
                    { label: 'Esta semana', days: 7 },
                    { label: 'Este mes', days: 30 }
                  ].map(preset => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const end = new Date().toISOString().split('T')[0];
                        const start = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        onFiltersChange({
                          ...filters,
                          dateRange: { start, end }
                        });
                      }}
                      className="w-full justify-start text-[#7D8590] hover:text-[#E6EDF3]"
                      data-testid={`preset-${preset.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E6EDF3]">Tipo de búsqueda</label>
                <div className="space-y-1">
                  {[
                    { value: 'patient', label: 'Pacientes' },
                    { value: 'consultation', label: 'Consultas' },
                    { value: 'diagnosis', label: 'Diagnósticos' },
                    { value: 'medical_code', label: 'Códigos CIE-10' }
                  ].map(type => (
                    <label key={type.value} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type.value) || false}
                        onChange={(e) => {
                          const currentTypes = filters.type || [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, type.value]
                            : currentTypes.filter(t => t !== type.value);
                          onFiltersChange({
                            ...filters,
                            type: newTypes.length > 0 ? newTypes : undefined
                          });
                        }}
                        className="text-[#238636]"
                        data-testid={`type-${type.value}`}
                      />
                      <span className="text-[#E6EDF3]">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}