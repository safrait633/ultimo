import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import MedicalSearchBar from '@/components/search/MedicalSearchBar';
import { 
  Search, 
  Users, 
  Calendar, 
  FileText, 
  Eye, 
  ExternalLink,
  Grid,
  List,
  Table,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'patient' | 'consultation' | 'diagnosis' | 'medical_code';
  title: string;
  subtitle: string;
  relevance: number;
  metadata: Record<string, any>;
  highlighted?: string;
}

interface SearchFilters {
  dateRange?: { start: string; end: string };
  specialties?: string[];
  status?: string[];
  doctors?: string[];
  hospitals?: string[];
  type?: string[];
}

interface SearchResponse {
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

type ViewMode = 'list' | 'grid' | 'table';

export default function SearchPage() {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const performSearch = async (query: string, searchFilters: SearchFilters, pageNum = 1) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setLastQuery(query);
    
    try {
      const searchRequest = {
        query,
        filters: searchFilters,
        page: pageNum,
        limit: 20,
        sortBy,
        sortOrder
      };

      const response = await fetch('/api/search/medical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchRequest)
      });

      const data = await response.json();
      
      if (data.success) {
        if (pageNum === 1) {
          setSearchResults(data.data);
        } else {
          // Append results for pagination
          setSearchResults(prev => prev ? {
            ...data.data,
            results: [...prev.results, ...data.data.results]
          } : data.data);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (lastQuery) {
      setPage(1);
      performSearch(lastQuery, newFilters, 1);
    }
  };

  const handleExport = async () => {
    if (!searchResults || !lastQuery) return;

    setIsExporting(true);
    try {
      const searchRequest = {
        query: lastQuery,
        filters,
        page: 1,
        limit: searchResults.total, // Export all results
        sortBy,
        sortOrder
      };

      const response = await fetch('/api/search/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchRequest,
          format: 'csv' // Default format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `search_results_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const loadMore = () => {
    if (searchResults && searchResults.hasMore && lastQuery) {
      performSearch(lastQuery, filters, page + 1);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'patient': return <Users className="w-5 h-5 text-blue-500" />;
      case 'consultation': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'diagnosis': return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'medical_code': return <FileText className="w-5 h-5 text-purple-500" />;
      default: return <Search className="w-5 h-5 text-[#7D8590]" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      patient: 'Paciente',
      consultation: 'Consulta',
      diagnosis: 'Diagnóstico',
      medical_code: 'Código CIE-10'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      patient: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      consultation: 'bg-green-500/10 text-green-600 border-green-500/20',
      diagnosis: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      medical_code: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const renderResultItem = (result: SearchResult) => {
    return (
      <Card 
        key={result.id} 
        className="bg-[#1C2128] border-[#374151] hover:border-[#238636] transition-colors cursor-pointer"
        data-testid={`result-${result.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getResultIcon(result.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 
                      className="font-medium text-[#E6EDF3] truncate"
                      dangerouslySetInnerHTML={{ 
                        __html: result.highlighted || result.title 
                      }}
                    />
                    <Badge 
                      variant="outline"
                      className={cn("text-xs", getTypeBadgeColor(result.type))}
                    >
                      {getTypeLabel(result.type)}
                    </Badge>
                    <span className="text-xs text-[#7D8590]">
                      {result.relevance}% relevancia
                    </span>
                  </div>
                  
                  <p className="text-sm text-[#7D8590] mb-3">
                    {result.subtitle}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-[#7D8590]">
                    {result.metadata.createdAt && (
                      <span>
                        Creado: {new Date(result.metadata.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    )}
                    {result.metadata.lastVisit && (
                      <span>
                        Última visita: {new Date(result.metadata.lastVisit).toLocaleDateString('es-ES')}
                      </span>
                    )}
                    {result.metadata.specialtyId && (
                      <Badge variant="outline" className="text-xs">
                        {result.metadata.specialtyId}
                      </Badge>
                    )}
                    {result.metadata.status && (
                      <Badge variant="outline" className="text-xs">
                        {result.metadata.status}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-[#E6EDF3]">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-[#E6EDF3]">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderGridView = () => {
    if (!searchResults) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.results.map(renderResultItem)}
      </div>
    );
  };

  const renderListView = () => {
    if (!searchResults) return null;

    return (
      <div className="space-y-3">
        {searchResults.results.map(renderResultItem)}
      </div>
    );
  };

  const renderTableView = () => {
    if (!searchResults) return null;

    return (
      <Card className="bg-[#1C2128] border-[#374151]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Tipo</th>
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Título</th>
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Descripción</th>
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Relevancia</th>
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Fecha</th>
                  <th className="text-left p-4 text-[#E6EDF3] font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.results.map((result) => (
                  <tr 
                    key={result.id} 
                    className="border-b border-[#374151] hover:bg-[#21262D] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getResultIcon(result.type)}
                        <span className="text-[#E6EDF3] text-sm">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="text-[#E6EDF3] font-medium"
                        dangerouslySetInnerHTML={{ 
                          __html: result.highlighted || result.title 
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-[#7D8590] text-sm">{result.subtitle}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {result.relevance}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-[#7D8590] text-sm">
                        {result.metadata.createdAt && 
                          new Date(result.metadata.createdAt).toLocaleDateString('es-ES')
                        }
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-[#E6EDF3]">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-[#7D8590] hover:text-[#E6EDF3]">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#E6EDF3]">
          Búsqueda Médica Avanzada
        </h1>
        <p className="text-[#7D8590] mt-1">
          Busca pacientes, consultas, diagnósticos y códigos médicos
        </p>
      </div>

      {/* Search Bar */}
      <MedicalSearchBar
        onSearch={performSearch}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        filters={filters}
        resultCount={searchResults?.total || 0}
        isLoading={isLoading}
      />

      {/* Results Section */}
      {searchResults && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-[#E6EDF3]">
                Resultados de búsqueda
              </h2>
              
              {searchResults.metadata.suggestion && (
                <div className="text-sm text-[#FBBF24]">
                  💡 {searchResults.metadata.suggestion}
                </div>
              )}
              
              <div className="text-sm text-[#7D8590]">
                Búsqueda completada en {searchResults.metadata.searchTime}ms
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sort Options */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-[#1C2128] border-[#374151]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-[#374151] rounded-lg">
                {[
                  { mode: 'list' as ViewMode, icon: List },
                  { mode: 'grid' as ViewMode, icon: Grid },
                  { mode: 'table' as ViewMode, icon: Table }
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === mode 
                        ? "bg-[#238636] text-white" 
                        : "text-[#7D8590] hover:text-[#E6EDF3] hover:bg-[#21262D]"
                    )}
                    data-testid={`view-${mode}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'table' && renderTableView()}
          </div>

          {/* Load More / Pagination */}
          {searchResults.hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoading}
                className="border-[#374151] text-[#E6EDF3] hover:border-[#238636]"
                data-testid="load-more"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más resultados'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!searchResults && !isLoading && (
        <Card className="bg-[#1C2128] border-[#374151]">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-[#7D8590] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#E6EDF3] mb-2">
              Búsqueda Médica Avanzada
            </h3>
            <p className="text-[#7D8590] mb-4">
              Utiliza la barra de búsqueda para encontrar pacientes, consultas, diagnósticos y códigos médicos.
            </p>
            <div className="text-sm text-[#7D8590]">
              <p>Ejemplos de búsqueda:</p>
              <ul className="mt-2 space-y-1">
                <li>• "María González" - Buscar paciente por nombre</li>
                <li>• "I20" - Buscar código CIE-10</li>
                <li>• "Cardiología" - Buscar por especialidad</li>
                <li>• "MED001" - Buscar por número de historia</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}