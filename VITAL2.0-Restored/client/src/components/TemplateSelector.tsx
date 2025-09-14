import React from 'react';
import { Heart, FileText, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface FormTemplate {
  id: string;
  name: string;
  specialty: string;
  description?: string;
  isActive: boolean;
  version?: string;
  createdAt?: string;
}

interface TemplateSelectorProps {
  templates: FormTemplate[];
  selectedTemplate: FormTemplate | null;
  onTemplateSelect: (template: FormTemplate) => void;
  isLoading?: boolean;
}

export function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect, 
  isLoading = false 
}: TemplateSelectorProps) {
  const { user } = useAuth();
  const { 
    favorites, 
    loading: favoritesLoading, 
    addToFavorites, 
    removeByResource, 
    isFavorite 
  } = useFavorites();

  const handleFavoriteToggle = async (template: FormTemplate, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se seleccione la plantilla
    
    if (!user?.id) return;

    try {
      if (isFavorite('template', template.id)) {
        await removeByResource('template', template.id);
      } else {
        await addToFavorites('template', template.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Plantillas Disponibles
        </h3>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Plantillas Disponibles
        </h3>
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              No hay plantillas disponibles para esta especialidad
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-white">
        Plantillas Disponibles ({templates.length})
      </h3>
      
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          const isFav = isFavorite('template', template.id);
          
          return (
            <Card 
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected 
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {template.name}
                    </CardTitle>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 hover:bg-transparent",
                      isFav ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
                    )}
                    onClick={(e) => handleFavoriteToggle(template, e)}
                    disabled={favoritesLoading}
                  >
                    <Heart 
                      className={cn(
                        "w-4 h-4 transition-all",
                        isFav ? "fill-current" : ""
                      )} 
                    />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {template.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {template.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {template.isActive ? (
                      <Badge variant="default" className="text-xs">
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Inactiva
                      </Badge>
                    )}
                    
                    {template.version && (
                      <Badge variant="outline" className="text-xs">
                        v{template.version}
                      </Badge>
                    )}
                  </div>
                  
                  {template.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      ✓ Plantilla seleccionada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Mostrar favoritos al inicio */}
      {favorites.filter(f => f.resourceType === 'template').length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 mb-2">
            💖 {favorites.filter(f => f.resourceType === 'template').length} plantillas en favoritos
          </p>
        </div>
      )}
    </div>
  );
}