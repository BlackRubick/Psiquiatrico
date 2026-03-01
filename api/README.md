# BIOPSYCHE API

API RESTful en Node.js (Express) para el sistema de gestión psiquiátrica BIOPSYCHE.

## Estructura inicial
- Express
- JWT Auth
- MySQL/PostgreSQL
- CRUD para todas las entidades
- Validaciones y middlewares

## Instalación

```bash
cd api
npm install
```

## Uso

```bash
npm run dev
```

## Endpoints principales
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

## Notas
- Configura tu .env con las credenciales de la base de datos.
- Sigue el checklist en .github/copilot-instructions.md para el avance del backend.
