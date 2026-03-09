# 🔧 Comandos Útiles - BIOPSYCHE

## 📦 Instalación Inicial (si es necesario)

### Backend
```bash
cd api
npm install
```

### Frontend
```bash
npm install
```

## 🗄️ Base de Datos

### Opción 1: Sincronización Automática (Recomendado)
```bash
cd api
npm run sync
```

### Opción 2: Script SQL Manual
```bash
# MySQL
mysql -u tu_usuario -p tu_base_de_datos < api/migrations/2026-03-09-nuevas-funcionalidades.sql

# O desde el cliente MySQL
mysql -u tu_usuario -p
USE tu_base_de_datos;
SOURCE api/migrations/2026-03-09-nuevas-funcionalidades.sql;
```

### Verificar Tablas Creadas
```sql
SHOW TABLES;
DESCRIBE citas;
DESCRIBE vigilancia_peso;
DESCRIBE pacientes;
```

## 🚀 Ejecutar el Proyecto

### Backend (Terminal 1)
```bash
cd api
npm run dev
```
El backend estará disponible en: `http://localhost:4000`

### Frontend (Terminal 2)
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:5173` (o el puerto que Vite asigne)

## 🧪 Testing

### Probar Endpoints con curl

#### Crear una Cita (requiere autenticación)
```bash
curl -X POST http://localhost:4000/api/citas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "paciente_id": 1,
    "profesional_id": 1,
    "fecha": "2026-03-15",
    "hora": "10:00:00",
    "motivo": "Consulta de seguimiento",
    "estado": "pendiente"
  }'
```

#### Obtener Citas
```bash
curl http://localhost:4000/api/citas \
  -H "Authorization: Bearer TU_TOKEN"
```

#### Crear Registro de Peso
```bash
curl -X POST http://localhost:4000/api/vigilancia-peso \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "paciente_id": 1,
    "peso": 70.5,
    "fecha": "2026-03-09",
    "notas": "Peso estable"
  }'
```

## 🔍 Verificación

### Ver Logs del Backend
```bash
cd api
npm run dev
# Los logs aparecerán en la terminal
```

### Verificar Modelos Sincronizados
En la terminal del backend verás:
```
¡Todas las tablas han sido creadas o actualizadas!
```

### Verificar Rutas Registradas
El backend debe mostrar:
```
Servidor API escuchando en puerto 4000
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
cd api
rm -rf node_modules package-lock.json
npm install

# En el frontend
cd ..
rm -rf node_modules package-lock.json
npm install
```

### Error: Base de Datos
```bash
# Verificar conexión
cd api
node -e "require('./src/config/db').authenticate().then(() => console.log('✅ Conectado')).catch(e => console.log('❌ Error:', e.message))"
```

### Error: Puerto en uso
```bash
# Matar proceso en puerto 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Matar proceso en puerto 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Limpiar Caché
```bash
# Frontend
rm -rf node_modules/.vite
npm run dev

# Backend
cd api
rm -rf node_modules
npm install
```

## 📊 Consultas SQL Útiles

### Ver todas las citas
```sql
SELECT 
  c.id,
  u_paciente.nombreCompleto AS paciente,
  u_profesional.nombreCompleto AS profesional,
  c.fecha,
  c.hora,
  c.motivo,
  c.estado
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN usuarios u_paciente ON p.usuario_id = u_paciente.id
JOIN profesionales prof ON c.profesional_id = prof.id
JOIN usuarios u_profesional ON prof.usuario_id = u_profesional.id
ORDER BY c.fecha DESC, c.hora DESC;
```

### Ver historial de peso de un paciente
```sql
SELECT 
  vp.id,
  u.nombreCompleto AS paciente,
  vp.peso,
  vp.fecha,
  vp.notas
FROM vigilancia_peso vp
JOIN pacientes p ON vp.paciente_id = p.id
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.id = 1
ORDER BY vp.fecha DESC;
```

### Ver pacientes con datos completos
```sql
SELECT 
  u.nombreCompleto,
  p.direccion,
  p.contacto_emergencia,
  p.nombre_contacto_emergencia,
  p.peso_actual,
  p.altura,
  ROUND(p.peso_actual / (p.altura * p.altura), 2) AS imc
FROM pacientes p
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.peso_actual IS NOT NULL 
  AND p.altura IS NOT NULL;
```

## 🔐 Obtener Token de Autenticación

### Login (para testing)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu_email@ejemplo.com",
    "password": "tu_password"
  }'
```

La respuesta incluirá el token que puedes usar en las peticiones.

## 📝 Variables de Entorno

Asegúrate de tener el archivo `.env` en la carpeta `api/`:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_base_datos
DB_DIALECT=mysql
PORT=4000
JWT_SECRET=tu_secret_key
```

## 🔄 Actualizar Código

### Cuando se hagan cambios en el backend
```bash
cd api
# Si cambiaron modelos
npm run sync
# Reiniciar servidor (Ctrl+C y luego)
npm run dev
```

### Cuando se hagan cambios en el frontend
El servidor de Vite recarga automáticamente. Si hay problemas:
```bash
# Ctrl+C para detener
npm run dev
```

## 📚 Estructura de Archivos Nuevos

```
api/
├── migrations/
│   └── 2026-03-09-nuevas-funcionalidades.sql
├── src/
│   ├── models/
│   │   ├── Cita.js ✨
│   │   └── VigilanciaPeso.js ✨
│   ├── controllers/
│   │   ├── citaController.js ✨
│   │   └── vigilanciaPesoController.js ✨
│   └── routes/
│       ├── citas.js ✨
│       └── vigilancia-peso.js ✨

src/
└── pages/
    ├── patient/
    │   ├── Appointments.jsx ✨
    │   └── WeightTracking.jsx ✨
    └── healthcare/
        ├── AppointmentForm.jsx ✨
        └── ManageActivities.jsx ✨

Documentación/
├── NUEVAS_FUNCIONALIDADES.md ✨
├── CHECKLIST_IMPLEMENTACION.md ✨
├── RESUMEN_EJECUTIVO.md ✨
└── COMANDOS_UTILES.md ✨ (este archivo)
```

✨ = Archivos nuevos

## 🎯 Flujo de Trabajo Recomendado

1. **Iniciar Backend**: `cd api && npm run dev`
2. **Iniciar Frontend**: `npm run dev` (en otra terminal)
3. **Navegar a**: `http://localhost:5173`
4. **Iniciar sesión** como paciente o profesional
5. **Probar las nuevas funcionalidades**

## 💡 Tips

- Usa **Chrome DevTools** para debugging del frontend
- Revisa la **consola del navegador** para errores JavaScript
- Revisa los **logs del terminal backend** para errores del servidor
- Usa **Thunder Client** o **Postman** para probar los endpoints API
- Mantén ambas terminales (backend y frontend) visibles

## 🆘 Soporte

Si encuentras algún problema:
1. Verifica que la base de datos esté corriendo
2. Verifica que las variables de entorno estén configuradas
3. Revisa los logs en ambas terminales
4. Consulta la documentación completa en `NUEVAS_FUNCIONALIDADES.md`

---

**¡Todo listo para usar! 🚀**
