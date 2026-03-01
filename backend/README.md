# BIOPSYCHE Backend API

API RESTful en Node.js (Express) para el sistema de gestión psiquiátrica BIOPSYCHE.

## Estructura inicial
- Express.js
- Modelos para: usuarios, pacientes, profesionales de salud, actividades, calificaciones, medicamentos, emociones, emergencias, dashboards mensuales
- Middlewares de autenticación y validación
- Conexión a base de datos relacional (MySQL o PostgreSQL)

## Instalación rápida

```bash
cd backend
npm install
npm run dev
```

## Endpoints principales (borrador)
- /api/auth (login, registro, roles)
- /api/usuarios
- /api/pacientes
- /api/profesionales
- /api/actividades
- /api/calificaciones
- /api/medicamentos
- /api/emociones
- /api/emergencias
- /api/dashboards

## .env ejemplo
```
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=biopsyche
JWT_SECRET=supersecreto
```

---

Este backend está diseñado para integrarse con el frontend React de BIOPSYCHE.