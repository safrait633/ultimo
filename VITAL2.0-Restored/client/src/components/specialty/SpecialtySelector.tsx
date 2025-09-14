import { useState, useEffect } from 'react';
import { 
  Heart,
  UserCheck,
  Coffee,
  Activity,
  Zap,
  Brain,
  ChevronDown,
  Check
} from 'lucide-react';
import './SpecialtySelector.css';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

const iconMapping: Record<string, React.ComponentType<{ className?: string }>> = {
  'FavoriteIcon': Heart,
  'SpaIcon': UserCheck,
  'RestaurantIcon': Coffee,
  'HealingIcon': Activity,
  'BiotechIcon': Zap,
  'PsychologyIcon': Brain
};

interface SpecialtySelectorProps {
  selectedSpecialty?: string;
  onSpecialtyChange: (specialtyId: string) => void;
  className?: string;
}

export default function SpecialtySelector({ 
  selectedSpecialty, 
  onSpecialtyChange, 
  className = '' 
}: SpecialtySelectorProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/specialties/active');
      const data = await response.json();
      
      if (data.success) {
        setSpecialties(data.data);
        // Auto-select first specialty if none selected
        if (!selectedSpecialty && data.data.length > 0) {
          onSpecialtyChange(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading specialties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedSpecialtyData = () => {
    return specialties.find(s => s.id === selectedSpecialty);
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    onSpecialtyChange(specialtyId);
  };

  const getIconForSpecialty = (iconName: string) => {
    const IconComponent = iconMapping[iconName] || Heart;
    return IconComponent;
  };

  const selectedData = getSelectedSpecialtyData();

  if (isLoading) {
    return (
      <div className="specialty-selector-loading">
        <div className="loading-spinner"></div>
        <span>Cargando especialidades...</span>
      </div>
    );
  }

  return (
    <div className={`specialty-selector group ${className}`}>
      {/* Selector Button */}
      <button className="specialty-selector-button">
        <div className="selector-content">
          {selectedData && (
            <>
              <div className="specialty-icon-wrapper">
                {(() => {
                  const IconComponent = getIconForSpecialty(selectedData.icon);
                  return <IconComponent className="specialty-icon" />;
                })()}
              </div>
              <div className="specialty-info">
                <span className="specialty-name">{selectedData.name}</span>
                <span className="specialty-description">
                  {selectedData.description.length > 50 
                    ? `${selectedData.description.substring(0, 50)}...` 
                    : selectedData.description
                  }
                </span>
              </div>
            </>
          )}
          {!selectedData && (
            <span className="no-specialty">Seleccionar Especialidad</span>
          )}
          <ChevronDown className="dropdown-arrow" />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div className="specialty-dropdown-menu">
        <div className="dropdown-content">
          <div className="dropdown-header">
            <span>Cambiar Especialidad</span>
          </div>
          
          <div className="specialties-list">
            {specialties.map((specialty) => {
              const IconComponent = getIconForSpecialty(specialty.icon);
              const isSelected = specialty.id === selectedSpecialty;
              
              return (
                <button
                  key={specialty.id}
                  className={`specialty-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSpecialtySelect(specialty.id)}
                  style={{ '--specialty-color': specialty.color } as React.CSSProperties}
                >
                  <div className="specialty-item-content">
                    <div 
                      className="specialty-item-icon"
                      style={{ color: specialty.color }}
                    >
                      <IconComponent />
                    </div>
                    
                    <div className="specialty-item-info">
                      <div className="specialty-item-name">
                        {specialty.name}
                      </div>
                      <div className="specialty-item-description">
                        {specialty.description.length > 80 
                          ? `${specialty.description.substring(0, 80)}...` 
                          : specialty.description
                        }
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="specialty-selected-indicator">
                        <Check className="check-icon" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}