import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Favorite {
  id: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
}

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  addToFavorites: (resourceType: string, resourceId: string) => Promise<boolean>;
  removeFromFavorites: (favoriteId: string) => Promise<boolean>;
  removeByResource: (resourceType: string, resourceId: string) => Promise<boolean>;
  isFavorite: (resourceType: string, resourceId: string) => boolean;
  checkIsFavorite: (resourceType: string, resourceId: string) => Promise<boolean>;
  getFavoritesByType: (resourceType: string) => Favorite[];
  refreshFavorites: () => Promise<void>;
}

const API_BASE_URL = '/api';

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  // Obtener headers de autenticación
  const getAuthHeaders = () => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Cargar favoritos del usuario
  const loadFavorites = async () => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al cargar favoritos');
      }

      const data = await response.json();
      if (data.success) {
        setFavorites(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar favoritos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar a favoritos
  const addToFavorites = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user || !token) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          resourceType,
          resourceId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Agregar el nuevo favorito al estado local
        setFavorites(prev => [...prev, data.data]);
        return true;
      } else {
        setError(data.message || 'Error al agregar a favoritos');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding favorite:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar de favoritos por ID
  const removeFromFavorites = async (favoriteId: string): Promise<boolean> => {
    if (!user || !token) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Eliminar del estado local
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        return true;
      } else {
        setError(data.message || 'Error al eliminar de favoritos');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing favorite:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar de favoritos por tipo y ID de recurso
  const removeByResource = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user || !token) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${resourceType}/${resourceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Eliminar del estado local
        setFavorites(prev => prev.filter(fav => 
          !(fav.resourceType === resourceType && fav.resourceId === resourceId)
        ));
        return true;
      } else {
        setError(data.message || 'Error al eliminar de favoritos');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing favorite by resource:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un recurso está en favoritos (local)
  const isFavorite = (resourceType: string, resourceId: string): boolean => {
    return favorites.some(fav => 
      fav.resourceType === resourceType && fav.resourceId === resourceId
    );
  };

  // Verificar si un recurso está en favoritos (servidor)
  const checkIsFavorite = async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user || !token) return false;

    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/check/${resourceType}/${resourceId}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.success && data.isFavorite;
      }
      return false;
    } catch (err) {
      console.error('Error checking favorite:', err);
      return false;
    }
  };

  // Obtener favoritos por tipo
  const getFavoritesByType = (resourceType: string): Favorite[] => {
    return favorites.filter(fav => fav.resourceType === resourceType);
  };

  // Refrescar favoritos
  const refreshFavorites = async (): Promise<void> => {
    await loadFavorites();
  };

  // Cargar favoritos al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user && token) {
      loadFavorites();
    } else {
      setFavorites([]);
      setError(null);
    }
  }, [user, token]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    removeByResource,
    isFavorite,
    checkIsFavorite,
    getFavoritesByType,
    refreshFavorites
  };
};

export default useFavorites;