# VITAL 2.0 - Sistema Médico Integral

## 📋 Descripción

VITAL 2.0 es un sistema médico integral desarrollado con tecnologías modernas que permite la gestión completa de pacientes, especialidades médicas y reportes clínicos. El sistema incluye funcionalidades avanzadas para gastroenterología, endocrinología y otras especialidades médicas.

## 🚀 Características Principales

- **Gestión de Pacientes**: Sistema completo de registro y seguimiento de pacientes
- **Especialidades Médicas**: Soporte para múltiples especialidades con formularios dinámicos
- **Reportes Clínicos**: Generación automática de reportes médicos profesionales
- **Calculadoras Médicas**: Implementación de scores clínicos (Glasgow-Blatchford, Rockall, Child-Pugh)
- **Sistema de Alertas**: Alertas automáticas basadas en parámetros clínicos
- **Autenticación Segura**: Sistema de autenticación JWT con roles de usuario
- **Base de Datos Robusta**: PostgreSQL con esquemas optimizados

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Lucide React** para iconografía
- **React Hook Form** para manejo de formularios

### Backend
- **Node.js** con Express
- **TypeScript** para tipado estático
- **Drizzle ORM** para manejo de base de datos
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas

### Base de Datos
- **PostgreSQL** como base de datos principal
- **Replit Database** como alternativa para desarrollo

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd VITAL2.0
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/vital_db
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=development
   PORT=8080
   ```

4. **Configurar la base de datos**
   ```bash
   # Crear la base de datos
   createdb vital_db
   
   # Ejecutar migraciones
   npm run db:migrate
   
   # Poblar datos iniciales
   npm run db:seed
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🗄️ Estructura del Proyecto

```
VITAL2.0/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── contexts/      # Contextos de React
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── services/      # Servicios API
│   │   ├── types/         # Definiciones TypeScript
│   │   └── utils/         # Utilidades
│   └── index.html
├── server/                # Backend Node.js
│   ├── routes/           # Rutas API
│   ├── middleware/       # Middlewares
│   ├── database/         # Configuración DB
│   └── auth/            # Autenticación
├── shared/              # Código compartido
│   └── schema.ts        # Esquemas Drizzle
└── backups/            # Backups del sistema
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run db:migrate` - Ejecuta migraciones de base de datos
- `npm run db:seed` - Pobla la base de datos con datos iniciales
- `npm run backup` - Crea backup completo del sistema

## 🏥 Especialidades Médicas Soportadas

### Gastroenterología
- Calculadora Glasgow-Blatchford
- Score de Rockall
- Clasificación Child-Pugh
- Reportes especializados

### Endocrinología
- Cálculos metabólicos
- Seguimiento hormonal
- Reportes endocrinológicos

## 🔐 Seguridad

- Autenticación JWT con tokens seguros
- Encriptación de contraseñas con bcrypt
- Validación de datos en frontend y backend
- Rate limiting para prevenir ataques
- Variables de entorno para datos sensibles

## 📊 Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:
- `users` - Usuarios del sistema
- `patients` - Información de pacientes
- `specialties` - Especialidades médicas
- `reports` - Reportes clínicos
- `notifications` - Sistema de notificaciones

## 🚀 Despliegue

### Producción
1. Configurar variables de entorno de producción
2. Ejecutar `npm run build`
3. Configurar servidor web (nginx/apache)
4. Configurar base de datos PostgreSQL
5. Ejecutar migraciones en producción

### Replit
El proyecto está configurado para desplegarse fácilmente en Replit con la configuración incluida en `.replit`.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas, por favor abre un issue en el repositorio.

## 🔄 Changelog

### v2.0.0
- Sistema completo de gestión médica
- Soporte para múltiples especialidades
- Calculadoras médicas integradas
- Sistema de reportes avanzado
- Autenticación y autorización completa

---

**VITAL 2.0** - Sistema Médico Integral desarrollado con ❤️ para profesionales de la salud.