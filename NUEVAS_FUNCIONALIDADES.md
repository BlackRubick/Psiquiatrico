# Nuevas Funcionalidades Implementadas - BIOPSYCHE

## 📋 Resumen de Cambios

Se han implementado las siguientes funcionalidades nuevas en el sistema BIOPSYCHE:

### 1. ✅ Calendario de Citas
- Sistema completo de gestión de citas médicas
- Vista de calendario mensual con todas las citas
- Los pacientes pueden ver sus citas programadas
- Los profesionales de salud pueden crear, editar y eliminar citas
- Estados de citas: pendiente, confirmada, completada, cancelada

### 2. ✅ Peso y Altura (Modificable)
- Campos agregados al perfil del paciente
- Peso actual y altura se muestran en el perfil
- Datos modificables por el profesional de salud

### 3. ✅ Vigilancia de Peso
- Sistema completo de monitoreo de peso
- Historial de registros de peso con fechas
- Cálculo automático de tendencias (subida/bajada)
- Cálculo de IMC (Índice de Masa Corporal)
- Gráficos de tendencias
- Información sobre efectos de medicamentos psiquiátricos en el peso

### 4. ✅ Número de Contacto de Emergencia
- Campo adicional para contacto de emergencia (tutor adicional)
- Nombre y teléfono del contacto de emergencia
- Visible en el perfil del paciente
- Útil cuando el paciente no contesta en emergencias

### 5. ✅ Dirección de Vivienda
- Campo de dirección actualizado y visible en el perfil
- Importante para actuar rápidamente en emergencias
- Especialmente útil en casos de intentos de suicidio

### 6. ✅ Gestión de Actividades (Editar/Borrar)
- Nueva página para gestionar actividades asignadas
- Los profesionales pueden editar actividades existentes
- Los profesionales pueden eliminar actividades subidas por error
- Filtro por paciente
- Confirmaciones de seguridad antes de eliminar

## 🗂️ Archivos Creados

### Backend:
- `api/src/models/Cita.js` - Modelo de citas
- `api/src/models/VigilanciaPeso.js` - Modelo de vigilancia de peso
- `api/src/controllers/citaController.js` - Controlador de citas
- `api/src/controllers/vigilanciaPesoController.js` - Controlador de vigilancia de peso
- `api/src/routes/citas.js` - Rutas de citas
- `api/src/routes/vigilancia-peso.js` - Rutas de vigilancia de peso
- `api/migrations/2026-03-09-nuevas-funcionalidades.sql` - Script de migración SQL

### Frontend:
- `src/pages/patient/Appointments.jsx` - Vista de calendario de citas para pacientes
- `src/pages/patient/WeightTracking.jsx` - Vigilancia de peso para pacientes
- `src/pages/healthcare/AppointmentForm.jsx` - Formulario de citas para profesionales
- `src/pages/healthcare/ManageActivities.jsx` - Gestión de actividades para profesionales

## 🗂️ Archivos Modificados

### Backend:
- `api/src/models/Paciente.js` - Agregados campos: contacto_emergencia, nombre_contacto_emergencia, peso_actual, altura
- `api/src/index.js` - Registradas nuevas rutas
- `api/src/sync.js` - Agregados nuevos modelos para sincronización

### Frontend:
- `src/App.jsx` - Agregadas rutas para todas las nuevas páginas
- `src/pages/patient/PatientDashboard.jsx` - Botones para calendario de citas y vigilancia de peso
- `src/pages/healthcare/HealthcareDashboard.jsx` - Botones para calendario de citas y gestión de actividades
- `src/pages/patient/Profile.jsx` - Mostrar nuevos campos (dirección, contacto de emergencia, peso, altura)
- `tailwind.config.js` - Agregados colores purple y pink

## 🚀 Instrucciones de Implementación

### 1. Backend (Base de Datos)

#### Opción A: Usar Sequelize (Recomendado)
```bash
cd api
npm run sync
```
Esto sincronizará automáticamente los modelos con la base de datos.

#### Opción B: Ejecutar SQL manualmente
Si prefieres ejecutar el SQL manualmente:
```bash
mysql -u cesar -p biopsyche < api/migrations/2026-03-09-nuevas-funcionalidades.sql
```

### 2. Reiniciar el Backend
```bash
cd api
npm run dev
```

### 3. Frontend
No se requieren pasos adicionales. Los cambios ya están incluidos.

```bash
npm run dev
```

## 📍 Rutas Nuevas

### Paciente:
- `/patient/appointments` - Ver calendario de citas
- `/patient/weight-tracking` - Vigilancia de peso

### Profesional de Salud:
- `/healthcare/appointments` - Ver calendario de citas
- `/healthcare/appointments/new` - Crear nueva cita
- `/healthcare/appointments/edit/:id` - Editar cita existente
- `/healthcare/manage-activities` - Gestionar actividades (editar/borrar)

## 🔌 API Endpoints Nuevos

### Citas:
- `GET /api/citas` - Obtener todas las citas
- `GET /api/citas/:id` - Obtener cita por ID
- `POST /api/citas` - Crear nueva cita (solo admin/healthcare)
- `PUT /api/citas/:id` - Actualizar cita (solo admin/healthcare)
- `DELETE /api/citas/:id` - Eliminar cita (solo admin/healthcare)

### Vigilancia de Peso:
- `GET /api/vigilancia-peso` - Obtener registros de peso
- `GET /api/vigilancia-peso/:id` - Obtener registro por ID
- `POST /api/vigilancia-peso` - Crear nuevo registro
- `PUT /api/vigilancia-peso/:id` - Actualizar registro
- `DELETE /api/vigilancia-peso/:id` - Eliminar registro

### Actividades (Existentes, ahora con editar/borrar):
- `PUT /api/actividades/:id` - Actualizar actividad (solo admin/healthcare)
- `DELETE /api/actividades/:id` - Eliminar actividad (solo admin/healthcare)

## 🎨 Interfaz de Usuario

### Dashboard del Paciente:
- ✨ Nuevo botón: "CALENDARIO DE CITAS" (color púrpura)
- ✨ Nuevo botón: "VIGILANCIA DE PESO" (color rosa)

### Dashboard del Profesional:
- ✨ Nuevo botón: "GESTIONAR ACTIVIDADES" (color púrpura)
- ✨ Nuevo botón: "CALENDARIO DE CITAS" (color rosa)

### Perfil del Paciente:
- ✨ Mostrar dirección de vivienda
- ✨ Mostrar peso actual y altura
- ✨ Mostrar contacto de emergencia

## 🔐 Permisos y Seguridad

### Citas:
- **Pacientes**: Solo pueden ver sus propias citas
- **Profesionales**: Pueden ver, crear, editar y eliminar citas de sus pacientes
- **Admin**: Acceso completo

### Vigilancia de Peso:
- **Pacientes**: Pueden ver y crear sus propios registros
- **Profesionales**: Pueden ver registros de sus pacientes
- **Admin**: Acceso completo

### Actividades:
- **Pacientes**: Solo pueden ver y completar actividades asignadas a ellos
- **Profesionales**: Pueden crear, editar y eliminar actividades que ellos asignaron
- **Admin**: Acceso completo

## 📊 Características Destacadas

### Calendario de Citas:
- Vista mensual interactiva
- Navegación entre meses
- Indicadores visuales de estado (pendiente, confirmada, completada, cancelada)
- Lista detallada de citas del mes
- Múltiples citas por día

### Vigilancia de Peso:
- Cálculo automático de IMC
- Indicadores de tendencia (subida/bajada de peso)
- Porcentaje de cambio entre registros
- Alertas sobre efectos de medicación psiquiátrica
- Historial completo con fechas

### Gestión de Actividades:
- Filtro por paciente
- Edición inline de actividades
- Confirmación antes de eliminar
- Vista completa de todas las actividades asignadas

## ⚠️ Notas Importantes

1. **Migración de Datos**: Si ya tienes pacientes en la base de datos, los nuevos campos (contacto_emergencia, peso_actual, altura) estarán vacíos. Deberás actualizarlos manualmente.

2. **Compatibilidad**: Los cambios son totalmente compatibles con las funcionalidades existentes.

3. **Respaldo**: Se recomienda hacer un respaldo de la base de datos antes de ejecutar las migraciones.

## 🐛 Troubleshooting

### Error: "Table doesn't exist"
Ejecuta el script de sincronización: `npm run sync` en la carpeta api

### Error: "Cannot find module"
Verifica que todos los archivos nuevos estén creados correctamente y ejecuta:
```bash
npm install
```

### Los botones no aparecen en los dashboards
Verifica que los colores accent-purple y accent-pink estén definidos en tailwind.config.js

## ✅ Testing

Para probar las nuevas funcionalidades:

1. **Como Paciente**:
   - Ir a "CALENDARIO DE CITAS" y verificar que puedes ver tus citas
   - Ir a "VIGILANCIA DE PESO" y agregar un registro de peso
   - Ir a "PERFIL" y verificar que se muestran los nuevos campos

2. **Como Profesional**:
   - Ir a "CALENDARIO DE CITAS" y crear una nueva cita
   - Ir a "GESTIONAR ACTIVIDADES" y editar o eliminar una actividad
   - Verificar que puedes ver el historial de peso de tus pacientes

## 📝 Créditos

Implementación realizada el 9 de marzo de 2026
Sistema: BIOPSYCHE - Gestión de Salud Mental
