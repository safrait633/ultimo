import { Router } from 'express';
import { z } from 'zod';
import { insertUserFavoriteSchema } from '@shared/schema';

const router = Router();

// Middleware para autenticación (simplificado)
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || "medical_app_secret_key";
    const decoded = jwt.default.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Obtener favoritos del usuario
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq } = await import('drizzle-orm');

    const favorites = await db.select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, req.user.userId));

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener favoritos'
    });
  }
});

// Obtener favoritos por tipo de recurso
router.get('/:resourceType', authenticateToken, async (req: any, res) => {
  try {
    const { resourceType } = req.params;
    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq, and } = await import('drizzle-orm');

    const favorites = await db.select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, req.user.userId),
        eq(userFavorites.resourceType, resourceType)
      ));

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener favoritos por tipo'
    });
  }
});

// Agregar a favoritos
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { resourceType, resourceId } = req.body;
    
    // Validar datos de entrada
    const favoriteData = {
      userId: req.user.userId,
      resourceType,
      resourceId
    };

    const validatedData = insertUserFavoriteSchema.parse(favoriteData);

    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq, and } = await import('drizzle-orm');

    // Verificar si ya existe
    const existing = await db.select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, req.user.userId),
        eq(userFavorites.resourceType, resourceType),
        eq(userFavorites.resourceId, resourceId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Ya está en favoritos'
      });
    }

    // Insertar nuevo favorito
    const [newFavorite] = await db.insert(userFavorites)
      .values(validatedData)
      .returning();

    res.status(201).json({
      success: true,
      data: newFavorite,
      message: 'Agregado a favoritos'
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: error.errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al agregar a favoritos'
    });
  }
});

// Eliminar de favoritos
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq, and } = await import('drizzle-orm');

    // Verificar que el favorito pertenece al usuario
    const [deleted] = await db.delete(userFavorites)
      .where(and(
        eq(userFavorites.id, id),
        eq(userFavorites.userId, req.user.userId)
      ))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorito no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Eliminado de favoritos'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar de favoritos'
    });
  }
});

// Eliminar por tipo y ID de recurso
router.delete('/:resourceType/:resourceId', authenticateToken, async (req: any, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq, and } = await import('drizzle-orm');

    const [deleted] = await db.delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, req.user.userId),
        eq(userFavorites.resourceType, resourceType),
        eq(userFavorites.resourceId, resourceId)
      ))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorito no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Eliminado de favoritos'
    });
  } catch (error) {
    console.error('Error removing favorite by resource:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar de favoritos'
    });
  }
});

// Verificar si un recurso está en favoritos
router.get('/check/:resourceType/:resourceId', authenticateToken, async (req: any, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { db } = await import('../db.js');
    const { userFavorites } = await import('@shared/schema');
    const { eq, and } = await import('drizzle-orm');

    const [favorite] = await db.select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, req.user.userId),
        eq(userFavorites.resourceType, resourceType),
        eq(userFavorites.resourceId, resourceId)
      ))
      .limit(1);

    res.json({
      success: true,
      isFavorite: !!favorite,
      data: favorite || null
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar favorito'
    });
  }
});

export default router;