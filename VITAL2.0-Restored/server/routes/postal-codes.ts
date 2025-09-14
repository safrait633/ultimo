import { Router } from 'express';
import { db } from '../db';
import { postalCodes, insertPostalCodeSchema } from '@shared/schema';
import { requireAuth } from '../middleware/auth-middleware';
import { eq, like } from 'drizzle-orm';

const router = Router();

// Obtener todos los códigos postales
router.get('/', requireAuth, async (req, res) => {
  try {
    const allPostalCodes = await db.select().from(postalCodes).limit(1000);
    res.json(allPostalCodes);
  } catch (error) {
    console.error('Error fetching postal codes:', error);
    res.status(500).json({ message: 'Error al cargar códigos postales' });
  }
});

// Buscar código postal específico
router.get('/:code', requireAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const [postalCode] = await db
      .select()
      .from(postalCodes)
      .where(eq(postalCodes.postalCode, code))
      .limit(1);

    if (!postalCode) {
      return res.status(404).json({ message: 'Código postal no encontrado' });
    }

    res.json(postalCode);
  } catch (error) {
    console.error('Error fetching postal code:', error);
    res.status(500).json({ message: 'Error al buscar código postal' });
  }
});

// Buscar códigos postales por ciudad
router.get('/search/city/:city', requireAuth, async (req, res) => {
  try {
    const { city } = req.params;
    const results = await db
      .select()
      .from(postalCodes)
      .where(like(postalCodes.city, `%${city}%`))
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error('Error searching postal codes by city:', error);
    res.status(500).json({ message: 'Error al buscar por ciudad' });
  }
});

// Crear código postal (solo para administradores)
router.post('/', requireAuth, async (req, res) => {
  try {
    const postalCodeData = insertPostalCodeSchema.parse(req.body);
    
    const [newPostalCode] = await db
      .insert(postalCodes)
      .values(postalCodeData)
      .returning();

    res.status(201).json(newPostalCode);
  } catch (error) {
    console.error('Error creating postal code:', error);
    res.status(500).json({ 
      message: 'Error al crear código postal',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Poblar códigos postales de España (solo desarrollo)
router.post('/seed', requireAuth, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'No permitido en producción' });
    }

    // Algunos códigos postales de ejemplo de las principales ciudades españolas
    const samplePostalCodes = [
      { postalCode: '28001', city: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid' },
      { postalCode: '28002', city: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid' },
      { postalCode: '28003', city: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid' },
      { postalCode: '28004', city: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid' },
      { postalCode: '28005', city: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid' },
      { postalCode: '08001', city: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña' },
      { postalCode: '08002', city: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña' },
      { postalCode: '08003', city: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña' },
      { postalCode: '08004', city: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña' },
      { postalCode: '08005', city: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña' },
      { postalCode: '41001', city: 'Sevilla', province: 'Sevilla', autonomousCommunity: 'Andalucía' },
      { postalCode: '41002', city: 'Sevilla', province: 'Sevilla', autonomousCommunity: 'Andalucía' },
      { postalCode: '41003', city: 'Sevilla', province: 'Sevilla', autonomousCommunity: 'Andalucía' },
      { postalCode: '46001', city: 'Valencia', province: 'Valencia', autonomousCommunity: 'Comunidad Valenciana' },
      { postalCode: '46002', city: 'Valencia', province: 'Valencia', autonomousCommunity: 'Comunidad Valenciana' },
      { postalCode: '46003', city: 'Valencia', province: 'Valencia', autonomousCommunity: 'Comunidad Valenciana' },
      { postalCode: '48001', city: 'Bilbao', province: 'Vizcaya', autonomousCommunity: 'País Vasco' },
      { postalCode: '48002', city: 'Bilbao', province: 'Vizcaya', autonomousCommunity: 'País Vasco' },
      { postalCode: '48003', city: 'Bilbao', province: 'Vizcaya', autonomousCommunity: 'País Vasco' },
      { postalCode: '15001', city: 'A Coruña', province: 'A Coruña', autonomousCommunity: 'Galicia' },
      { postalCode: '15002', city: 'A Coruña', province: 'A Coruña', autonomousCommunity: 'Galicia' },
      { postalCode: '30001', city: 'Murcia', province: 'Murcia', autonomousCommunity: 'Región de Murcia' },
      { postalCode: '30002', city: 'Murcia', province: 'Murcia', autonomousCommunity: 'Región de Murcia' },
      { postalCode: '50001', city: 'Zaragoza', province: 'Zaragoza', autonomousCommunity: 'Aragón' },
      { postalCode: '50002', city: 'Zaragoza', province: 'Zaragoza', autonomousCommunity: 'Aragón' },
      { postalCode: '35001', city: 'Las Palmas de Gran Canaria', province: 'Las Palmas', autonomousCommunity: 'Canarias' },
      { postalCode: '35002', city: 'Las Palmas de Gran Canaria', province: 'Las Palmas', autonomousCommunity: 'Canarias' },
      { postalCode: '38001', city: 'Santa Cruz de Tenerife', province: 'Santa Cruz de Tenerife', autonomousCommunity: 'Canarias' },
      { postalCode: '38002', city: 'Santa Cruz de Tenerife', province: 'Santa Cruz de Tenerife', autonomousCommunity: 'Canarias' },
    ];

    const results = await db.insert(postalCodes).values(samplePostalCodes).returning();
    
    res.status(201).json({
      message: 'Códigos postales poblados exitosamente',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error seeding postal codes:', error);
    res.status(500).json({ 
      message: 'Error al poblar códigos postales',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;