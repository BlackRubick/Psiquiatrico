# 🏗️ ARQUITECTURA DE DEPLOYMENT - BIOPSYCHE

## Diagrama de la Arquitectura en AWS EC2

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO/CLIENTE                              │
│                      (Navegador Web)                                 │
└───────────────────────────────────────┬─────────────────────────────┘
                                        │
                                        │ HTTP/HTTPS (Puerto 80/443)
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS SECURITY GROUP                                 │
│  ✓ Aceptar puerto 80 (HTTP) desde 0.0.0.0/0                          │
│  ✓ Aceptar puerto 443 (HTTPS) desde 0.0.0.0/0                        │
│  ✓ Aceptar puerto 22 (SSH) desde tu IP                               │
└───────────────────────────────────────┬─────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS EC2 INSTANCE (Ubuntu)                          │
│                   ip-172-31-13-27:~/Psiquiatrico                      │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  NGINX (Reverse Proxy & Load Balancer)                        │ │
│  │  - Puerto 80: Escucha tráfico HTTP                            │ │
│  │  - Sirve archivos estáticos del frontend (dist/)              │ │
│  │  - Redirige /api/ → Backend API                               │ │
│  └────────┬──────────────────────┬──────────────────────────────┘ │
│           │                       │                                 │
│           │ /index.html, /js/...  │ /api/users, /api/patients...  │
│           │                       │                                 │
│  ┌────────▼───────────┐ ┌─────────▼──────────────────────────┐   │
│  │  FRONTEND SERVER    │ │    API SERVER (Node.js/Express)    │   │
│  │  (React Build)      │ │  PM2: biopsyche-api                │   │
│  │  - dist/            │ │  Puerto 4000                       │   │
│  │  - npm run preview  │ │  ✓ Autenticación JWT              │   │
│  │  Puerto 5173        │ │  ✓ Rutas CRUD para todas entidades │   │
│  │                     │ │  ✓ Validaciones                    │   │
│  │  Assets estáticos   │ │  ✓ Control de roles                │   │
│  │  - CSS              │ │                                     │   │
│  │  - JS               │ │  Entidades principales:             │   │
│  │  - Imágenes         │ │  - usuarios (admin, doctor, patient)│   │
│  │                     │ │  - pacientes                       │   │
│  │                     │ │  - profesionales_salud             │   │
│  │                     │ │  - actividades                     │   │
│  │                     │ │  - medicamentos                    │   │
│  │                     │ │  - emociones_diarias               │   │
│  │                     │ │  - emergencias                     │   │
│  │                     │ │  - calificaciones_actividades      │   │
│  │                     │ │  - dashboards_mensuales            │   │
│  └─────────────────────┘ └────────┬──────────────────────────┘   │
│                                    │                               │
│                                    │ Conexión TCP (localhost)       │
│                                    ▼                               │
│                         ┌──────────────────────┐                  │
│                         │   MYSQL DATABASE     │                  │
│                         │   Puerto 3306        │                  │
│                         │                      │                  │
│                         │ DB: biopsyche_prod   │                  │
│                         │ User: biopsyche_user │                  │
│                         │                      │                  │
│                         │ Tablas:              │                  │
│                         │ - usuarios           │                  │
│                         │ - pacientes          │                  │
│                         │ - actividades        │                  │
│                         │ - medicamentos       │                  │
│                         │ - emociones_diarias  │                  │
│                         │ - emergencias        │                  │
│                         │ - dashboards_mensuales│                  │
│                         │ - ... (más tablas)   │                  │
│                         └──────────────────────┘                  │
│                                                                    │
│  PM2 (Process Manager)                                            │
│  ├─ biopsyche-api (Node.js/Express)                              │
│  └─ Auto-reinicia si falla                                        │
│  └─ Logs: ~/Psiquiatrico/logs/                                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas en EC2

```
/home/ubuntu/
├── Psiquiatrico/
│   ├── src/                          # Frontend React
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── healthcare/
│   │   │   └── patient/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   └── App.jsx
│   │
│   ├── api/                          # Backend Node.js
│   │   ├── src/
│   │   │   ├── index.js              # Entrada principal
│   │   │   ├── config/               # Configuración DB, auth
│   │   │   ├── models/               # Modelos Sequelize
│   │   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── routes/               # Rutas REST
│   │   │   ├── middlewares/          # JWT, validación
│   │   │   └── sync.js               # Sincronizar tablas
│   │   ├── .env                      # Variables de entorno (SECRETO)
│   │   ├── package.json
│   │   └── create-admin.js           # Script crear admin
│   │
│   ├── dist/                         # Frontend compilado
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   │
│   ├── logs/                         # Logs de PM2
│   │   ├── api-error.log
│   │   ├── api-out.log
│   │   ├── frontend-error.log
│   │   └── frontend-out.log
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── ecosystem.config.js           # Configuración PM2
│   ├── deploy.sh                     # Script deployment
│   ├── DATABASE.md                   # Esquema BD
│   ├── DEPLOYMENT_AWS_EC2.md         # Guía completa
│   └── QUICK_DEPLOY.md               # Guía rápida
│
├── backups/                          # Backups de BD
│   ├── biopsyche_2024-02-28.sql
│   └── ...
│
├── backup-db.sh                      # Script de backup
│
└── .ssh/
    └── authorized_keys               # Claves SSH
```

---

## 🔄 Flujo de Datos - Ejemplo: Crear un Paciente

```
1. USUARIO (Frontend)
   ├─ Llena formulario en "Crear Paciente"
   └─ Click en "Guardar"
   
2. FRONTEND (React)
   ├─ Valida datos en el cliente
   ├─ Envía POST request a http://localhost/api/patients
   │  Headers: { Authorization: "Bearer TOKEN_JWT" }
   │  Body: { name, age, email, phone, ... }
   └─ Espera respuesta
   
3. NGINX (Proxy Reverso)
   ├─ Recibe request en puerto 80
   ├─ Ve que empieza con /api/
   └─ Redirige a http://127.0.0.1:4000/patients
   
4. EXPRESS API (Node.js)
   ├─ Middleware: Verifica JWT token
   ├─ Middleware: Valida datos con express-validator
   ├─ Controller: Procesa lógica de negocio
   │  ├─ Hashea contraseña con bcryptjs
   │  ├─ Crea usuario en tabla usuarios
   │  ├─ Crea paciente en tabla pacientes
   │  └─ Retorna datos creados
   └─ Responde con status 201 + datos JSON
   
5. MYSQL DATABASE
   ├─ Recibe INSERT en tabla usuarios
   ├─ Recibe INSERT en tabla pacientes
   ├─ Confirma transacción
   └─ Retorna datos al API
   
6. FRONTEND (React)
   ├─ Recibe respuesta exitosa
   ├─ Muestra SweetAlert2 de éxito
   ├─ Actualiza lista de pacientes
   └─ Usuario ve el nuevo paciente en la tabla
```

---

## 🔐 Seguridad en Capas

```
┌─ Capa 1: Seguridad de Red (AWS)
│  ├─ Security Group: Aceptar solo puertos necesarios
│  ├─ SSH key-based auth (sin contraseña)
│  └─ VPC privada si es posible

├─ Capa 2: Servidor Web (Nginx)
│  ├─ HTTPS/SSL certificates (certbot)
│  ├─ Limitar tamaño de request (client_max_body_size)
│  ├─ Rate limiting
│  └─ Servir solo archivos necesarios

├─ Capa 3: API (Express)
│  ├─ JWT tokens con expiración
│  ├─ CORS configurado
│  ├─ Express-validator para todas las entradas
│  ├─ Bcryptjs para hashear contraseñas
│  ├─ Control de roles (middleware)
│  └─ Try-catch para manejo de errores

└─ Capa 4: Base de Datos (MySQL)
   ├─ Usuario específico con permisos limitados
   ├─ Contraseña fuerte
   ├─ Backups automáticos encriptados
   └─ No accesible desde internet (solo localhost)
```

---

## 📊 Flujo de Autenticación

```
LOGIN:
┌─ Usuario entra username y password
├─ Frontend hace POST /api/auth/login
├─ API busca usuario en BD
├─ Compara password con bcryptjs
├─ Si es correcto: genera JWT token
├─ Retorna token al frontend
└─ Frontend guarda token en localStorage/context

CADA REQUEST:
┌─ Frontend envía Authorization: "Bearer TOKEN"
├─ Express verifica JWT no esté expirado
├─ Express decodifica payload del token
├─ Obtiene user_id y role
├─ Middleware verifica si tiene permiso
└─ Si todo OK: procesa la request

LOGOUT:
└─ Frontend borra token (localStorage)
```

---

## 🚀 Proceso de Deployment

```
PASO 1: DESARROLLO
└─ npm run dev (local, hot reload)

PASO 2: BUILD PARA PRODUCCIÓN
├─ Frontend: npm run build → genera dist/
└─ API: sin cambios (se corre con Node.js directo)

PASO 3: TRANSFERIR A EC2
├─ git push (opcional, si usas GitHub)
├─ git clone en EC2 (o git pull si ya existe)
└─ Archivos: dist/, api/, ecosystem.config.js

PASO 4: INSTALAR Y EJECUTAR
├─ npm install (frontend + api)
├─ node src/sync.js (crear tablas)
├─ npm run build (recompile frontend)
├─ pm2 start ecosystem.config.js (iniciar servicios)
└─ sudo systemctl restart nginx

PASO 5: VERIFICAR
├─ pm2 status (procesos corriendo)
├─ pm2 logs (sin errores)
├─ http://tu-ip (carga frontend)
├─ Prueba login (autentica correctamente)
└─ Prueba CRUD (crea/edita/elimina datos)
```

---

## 🔄 Actualización en Producción

```
1. En tu máquina local:
   └─ Haz cambios, commit, push

2. En el servidor EC2:
   ├─ cd ~/Psiquiatrico
   ├─ git pull (trae cambios)
   ├─ npm install (si hay nuevas dependencias)
   ├─ npm run build (compilar frontend)
   ├─ pm2 restart all (reinicia servicios)
   └─ Verifica: pm2 logs

3. Prueba en navegador:
   └─ http://tu-ip (debería ver cambios)
```

---

## 📈 Monitoreo en Producción

```
EN TIEMPO REAL:
├─ pm2 status              (lista de procesos)
├─ pm2 logs                (logs en vivo)
├─ pm2 monit               (CPU, memoria)
└─ sudo systemctl status nginx (estado web)

LOGS ALMACENADOS:
├─ API Error: ~/Psiquiatrico/logs/api-error.log
├─ API Output: ~/Psiquiatrico/logs/api-out.log
├─ Nginx: /var/log/nginx/error.log
└─ Nginx: /var/log/nginx/access.log

MYSQL:
└─ sudo systemctl status mysql (estado BD)
```

---

## 🛠️ Mantenimiento Recomendado

```
DIARIO:
└─ Ver logs: pm2 logs

SEMANAL:
├─ Verificar disco: df -h
├─ Verificar memoria: free -h
└─ Revisar errores en logs

MENSUAL:
├─ Actualizar sistema: sudo apt update && sudo apt upgrade
├─ Hacer backup manual: mysqldump ...
├─ Revisar credenciales (cambiar si es necesario)
└─ Verificar certificados SSL (si usan certbot)

CADA 3-6 MESES:
├─ Hacer backup a S3 (AWS)
├─ Auditar acceso (revisar /var/log/auth.log)
└─ Actualizar dependencias de Node.js
```

---

## 🆘 Soporte Rápido

| Problema | Solución |
|----------|----------|
| "502 Bad Gateway" | `pm2 logs` y verifica que API está corriendo |
| API no responde | `pm2 restart biopsyche-api` |
| BD desconectada | `sudo systemctl restart mysql` |
| Puertos en conflicto | `sudo lsof -i :4000` y mata el proceso |
| Nginx no reinicia | `sudo nginx -t` para ver errores |
| Sin acceso SSH | Verifica Security Group de AWS |
| Disco lleno | `df -h` y limpia logs: `pm2 flush` |

