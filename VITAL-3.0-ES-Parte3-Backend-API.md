# 🛠️ VITAL 3.0 - Parte 3: Backend API y Servicios
## 🇪🇸 Arquitectura Express + TypeScript + MySQL

> **OBJETIVO**: Definir la arquitectura backend, endpoints RESTful, validaciones y ejemplos de integración para la plataforma médica VITAL 3.0.

---

## 🏗️ ARQUITECTURA BACKEND

- Node.js + Express + TypeScript
- MySQL2 + Knex para acceso a datos
- JWT para autenticación
- Validación con Zod y express-validator
- Estructura modular: routes, controllers, services, database, middleware, types

### 📁 Estructura de Carpetas

```
server/
├── src/
│   ├── routes/           # Endpoints API REST
│   ├── controllers/      # Lógica de negocio
│   ├── services/         # Servicios y helpers
│   ├── database/         # Conexión y migraciones
│   ├── middleware/       # Autenticación, validación
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilidades generales
│   └── index.ts          # Entry point Express
```

---

## 🔗 ENDPOINTS PRINCIPALES

### 👤 Usuarios y Autenticación

- `POST /api/v3/auth/login` — Login médico
- `POST /api/v3/auth/register` — Registro médico
- `GET /api/v3/users/me` — Perfil actual
- `PATCH /api/v3/users/:id` — Editar usuario

### 🧑‍⚕️ Pacientes

- `GET /api/v3/patients/search?q=texto` — Buscar pacientes
- `GET /api/v3/patients/recent` — Últimos pacientes
- `POST /api/v3/patients` — Crear paciente
- `POST /api/v3/patients/anonymous` — Crear paciente anónimo
- `GET /api/v3/patients/:id` — Obtener paciente

### 📋 Exámenes Médicos

- `POST /api/v3/examinations` — Crear examen
- `GET /api/v3/examinations/:id` — Obtener examen
- `PATCH /api/v3/examinations/:id` — Editar examen
- `PATCH /api/v3/examinations/:id/auto-save` — Autoguardado
- `GET /api/v3/examinations?doctor_id=...` — Listar exámenes

### 🧩 Plantillas y Especialidades

- `GET /api/v3/examination-templates?specialty=...` — Listar plantillas
- `POST /api/v3/examination-templates` — Crear plantilla
- `GET /api/v3/medical-specialties` — Listar especialidades

### 🩺 Patologías

- `GET /api/v3/pathologies?specialty=...` — Buscar patologías
- `GET /api/v3/pathologies/:id` — Detalle patología

---

## 📝 EJEMPLO DE ROUTE EXPRESS

```typescript
// server/src/routes/patients.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { PatientController } from '../controllers/patient.controller';

const router = Router();

router.get('/search', authenticate, PatientController.search);
router.get('/recent', authenticate, PatientController.recent);
router.post('/', authenticate, PatientController.create);
router.post('/anonymous', authenticate, PatientController.createAnonymous);
router.get('/:id', authenticate, PatientController.getById);

export default router;
```

---

## 🛡️ VALIDACIÓN Y TIPOS

```typescript
// server/src/types/patient.ts
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  documentNumber: string;
  email?: string;
  phone?: string;
  medicalHistory?: Record<string, any>;
}
```

```typescript
// server/src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { z } from 'zod';

const PatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  age: z.number().min(0).max(120),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  birthDate: z.string().optional(),
  documentNumber: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export class PatientController {
  static async create(req: Request, res: Response) {
    const result = PatientSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    // ...guardar paciente en DB...
    res.json({ success: true });
  }
  // ...otros métodos...
}
```

---

## ⚡ BEST PRACTICES

- Usar async/await y manejo centralizado de errores
- Validar todos los datos de entrada con Zod
- Autenticación JWT en todos los endpoints protegidos
- Respuestas consistentes: `{ success, data, error }`
- Paginación y filtros en endpoints de listado
- Logs y auditoría de acciones médicas

---

## 🔄 INTEGRACIÓN CON FRONTEND

- Todas las rutas devuelven JSON
- Códigos de estado HTTP estándar (200, 201, 400, 401, 403, 404, 500)
- Mensajes de error claros para frontend
- Ejemplo de respuesta:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

---

## ✅ RESUMEN

Este documento define la arquitectura backend, endpoints RESTful, validaciones y ejemplos de integración para VITAL 3.0. Permite construir una API robusta, segura y fácil de consumir desde el frontend glassmorphism.

