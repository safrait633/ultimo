import React, { useState, useEffect } from 'react';
import { Search, Bookmark, ChevronDown, Heart, Brain, Eye, Baby, Stethoscope, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  patientCount: number;
  isPopular?: boolean;
  isFavorite?: boolean;
}

interface SpecialtySelectorProps {
  specialties: Specialty[];
  selectedSpecialty: Specialty | null;
  onSelect: (specialty: Specialty) => void;
  loading?: boolean;
}

const iconMap: Record<string, any> = {
  'Heart': Heart,
  'Brain': Brain,
  'Eye': Eye,
  'Baby': Baby,
  'Stethoscope': Stethoscope,
  'Shield': Shield,
};

export default function SpecialtySelector({ 
  specialties, 
  selectedSpecialty, 
  onSelect, 
  loading = false 
}: SpecialtySelectorProps) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    filterSpecialties();
  }, [specialties, search]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = localStorage.getItem('specialty_favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const filterSpecialities = () => {
    if (!specialties) return;
    
    let filtered = specialties.filter(specialty => 
      specialty.name.toLowerCase().includes(search.toLowerCase()) ||
      specialty.description.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenar por favoritas primero, luego por popularidad
    filtered.sort((a, b) => {
      if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
      if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredSpecialties(filtered);
  };

  const filterSpecialties = filterSpecialities;

  const toggleFavorite = async (specialtyId: string) => {
    const newFavorites = favorites.includes(specialtyId)
      ? favorites.filter(id => id !== specialtyId)
      : [...favorites, specialtyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('specialty_favorites', JSON.stringify(newFavorites));
    filterSpecialities();
  };

  const popularSpecialties = specialties?.filter(s => s.isPopular || s.patientCount > 100).slice(0, 6) || [];

  return (
    <div className="specialty-selector relative">
      {/* Selector Principal */}
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={loading}
        >
          <div className="flex items-center space-x-3">
            {selectedSpecialty ? (
              <>
                {React.createElement(iconMap[selectedSpecialty.icon] || Stethoscope, { 
                  className: "w-5 h-5" 
                })}
                <span>{selectedSpecialty.name}</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5" />
                <span>{loading ? 'Cargando especialidades...' : 'Seleccionar Especialidad'}</span>
              </>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Dropdown */}
        {showDropdown && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-800 border-slate-700 max-h-96 overflow-hidden">
            <CardContent className="p-4">
              {/* Búsqueda */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar especialidad..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {/* Lista de Especialidades */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredSpecialties.map((specialty) => {
                  const IconComponent = iconMap[specialty.icon] || Stethoscope;
                  const isFavorite = favorites.includes(specialty.id);
                  
                  return (
                    <div
                      key={specialty.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors group"
                      onClick={() => {
                        onSelect(specialty);
                        setShowDropdown(false);
                        setSearch('');
                      }}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <IconComponent className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium truncate">
                              {specialty.name}
                            </span>
                            {specialty.isPopular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {specialty.description}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(specialty.id);
                        }}
                      >
                        <Star 
                          className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                        />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {filteredSpecialties.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron especialidades</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Especialidades Disponibles - Diseño mejorado para Desktop */}
      {!selectedSpecialty && !showDropdown && filteredSpecialties.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="text-white font-medium mb-6 text-lg">Especialidades Disponibles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
            {filteredSpecialties.map((specialty) => {
              const IconComponent = iconMap[specialty.icon] || Stethoscope;
              const isFavorite = favorites.includes(specialty.id);
              
              return (
                <button
                  key={specialty.id}
                  className="flex flex-col items-center justify-center p-6 lg:p-8 rounded-xl bg-white/8 backdrop-blur-sm border border-white/15 hover:bg-white/20 hover:border-white/40 hover:scale-105 cursor-pointer transition-all duration-300 group w-full relative min-h-[140px] lg:min-h-[160px] text-center"
                  onClick={() => onSelect(specialty)}
                >
                  {/* Icono de favorito */}
                  {isFavorite && (
                    <Bookmark className="absolute top-4 right-4 w-5 h-5 fill-blue-400 text-blue-400" />
                  )}
                  
                  {/* Badge Popular */}
                  {specialty.isPopular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}

                  {/* Icono de especialidad */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-blue-300 group-hover:text-white transition-colors" />
                  </div>

                  {/* Información de especialidad */}
                  <div className="flex-1">
                    <h4 className="text-white text-lg lg:text-xl font-bold group-hover:text-blue-200 transition-colors">
                      {specialty.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside para cerrar dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}