# Guía Completa de Deployment - BIOPSYCHE en AWS EC2

## Estado Actual de tu Proyecto
✅ Frontend: React + Vite + Tailwind CSS  
✅ Backend API: Node.js + Express + Sequelize  
✅ Base de datos: Configurada para MySQL o PostgreSQL  
✅ Autenticación: JWT con roles (admin, healthcare, patient)  
✅ Repositorio Git: Clonado en `/home/ubuntu/Psiquiatrico`

---

## FASE 1: PREPARAR EL SERVIDOR EC2 (Ubuntu)

### 1.1 Conectarse al servidor
```bash
ssh -i "tu-clave.pem" ubuntu@ip-172-31-13-27
# O como lo tienes:
# ubuntu@ip-172-31-13-27:~/Psiquiatrico$
```

### 1.2 Actualizar el sistema
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Instalar Node.js y npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### 1.4 Instalar Git (si no está)
```bash
sudo apt install -y git
```

### 1.5 Instalar MySQL Server (para la BD)
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
# Configura contraseña root y opciones de seguridad
```

### 1.6 Verificar instalaciones
```bash
node -v      # v20.x.x
npm -v       # 10.x.x
mysql -V     # mysql Ver
```

---

## FASE 2: CLONAR Y PREPARAR EL PROYECTO

### 2.1 Clonar el repositorio (ya hecho)
```bash
cd ~
# Si no lo has hecho:
# git clone <tu-repo-url> Psiquiatrico
cd Psiquiatrico
```

### 2.2 Verificar estructura del proyecto
```bash
ls -la
# Deberías ver: api/ src/ package.json vite.config.js DATABASE.md .git etc.
```

### 2.3 Crear y configurar variables de entorno para la API
```bash
# Ir a la carpeta de la API
cd api

# Ver el archivo .env.example
cat .env.example

# Crear archivo .env con configuración de producción
nano .env
```

### 2.4 Contenido del archivo `.api/.env` (para producción)
```dotenv
# Base de datos
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=biopsyche_user
DB_PASSWORD=cambiar_contraseña_fuerte_aqui
DB_NAME=biopsyche_prod

# JWT
JWT_SECRET=cambiar_jwt_secreto_largo_y_seguro_aqui

# Servidor
PORT=4000
NODE_ENV=production

# URLs (después lo cambiarás a tu dominio)
FRONTEND_URL=http://ip-172-31-13-27:5173
API_URL=http://ip-172-31-13-27:4000
```

Presiona: `Ctrl+O`, `Enter`, `Ctrl+X` para guardar en nano.

### 2.5 Crear usuario de base de datos
```bash
sudo mysql -u root -p
# Ingresa contraseña root que configuraste

# Dentro de MySQL:
CREATE DATABASE biopsyche_prod;
CREATE USER 'biopsyche_user'@'localhost' IDENTIFIED BY 'cambiar_contraseña_fuerte_aqui';
GRANT ALL PRIVILEGES ON biopsyche_prod.* TO 'biopsyche_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## FASE 3: INSTALAR DEPENDENCIAS Y PREPARAR API

### 3.1 Instalar dependencias del API
```bash
cd ~/Psiquiatrico/api
npm install
```

### 3.2 Sincronizar modelos de Sequelize con BD (crear tablas)
```bash
node src/sync.js
# Debería crear todas las tablas automáticamente
```

### 3.3 Crear usuario admin de prueba
```bash
node create-admin.js
# Ingresa datos para el usuario admin
```

### 3.4 Probar que la API funciona en desarrollo
```bash
npm run dev
# Debería salir: "Servidor ejecutándose en puerto 4000"
```

Presiona `Ctrl+C` para detener.

---

## FASE 4: INSTALAR Y CONFIGURAR FRONTEND

### 4.1 Instalar dependencias del frontend
```bash
cd ~/Psiquiatrico
npm install
```

### 4.2 Configurar URL de API en el frontend
```bash
# Editar archivo .env (crear si no existe)
nano .env
```

Contenido:
```dotenv
VITE_API_URL=http://ip-172-31-13-27:4000
```

Presiona: `Ctrl+O`, `Enter`, `Ctrl+X` para guardar.

### 4.3 Editar `vite.config.js` para producción
Asegúrate que tenga:
```javascript
export default {
  base: '/',
  server: {
    port: 5173,
    host: '0.0.0.0' // Para permitir acceso desde otros hosts
  }
}
```

### 4.4 Compilar el frontend
```bash
npm run build
# Genera carpeta dist/ con los archivos optimizados
```

---

## FASE 5: CONFIGURAR SERVIDOR NGINX (PROXY REVERSO)

### 5.1 Instalar Nginx
```bash
sudo apt install -y nginx
```

### 5.2 Crear configuración para el proyecto
```bash
sudo nano /etc/nginx/sites-available/biopsyche
```

Pega este contenido:
```nginx
upstream api {
    server 127.0.0.1:4000;
}

upstream frontend {
    server 127.0.0.1:5173;
}

server {
    listen 80;
    server_name ip-172-31-13-27;  # O tu dominio después

    # Frontend React
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Servir archivos estáticos del build
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/ubuntu/Psiquiatrico/dist;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Presiona: `Ctrl+O`, `Enter`, `Ctrl+X` para guardar.

### 5.3 Activar la configuración
```bash
sudo ln -s /etc/nginx/sites-available/biopsyche /etc/nginx/sites-enabled/
sudo nginx -t  # Verifica que la configuración sea válida
sudo systemctl restart nginx
```

---

## FASE 6: CONFIGURAR PM2 (MANTENER PROCESOS EJECUTÁNDOSE)

### 6.1 Instalar PM2 globalmente
```bash
sudo npm install -g pm2
```

### 6.2 Crear archivo de configuración PM2
```bash
cd ~/Psiquiatrico
nano ecosystem.config.js
```

Contenido:
```javascript
module.exports = {
  apps: [
    {
      name: 'biopsyche-api',
      script: './api/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'biopsyche-frontend',
      script: 'npm run preview',
      cwd: '/home/ubuntu/Psiquiatrico',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### 6.3 Crear carpeta de logs
```bash
mkdir -p logs
```

### 6.4 Iniciar aplicaciones con PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Sigue las instrucciones que salgan
```

### 6.5 Verificar estado
```bash
pm2 status
pm2 logs
```

---

## FASE 7: CONFIGURAR SSL/HTTPS (OPCIONAL PERO RECOMENDADO)

### 7.1 Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com
# O si usas IP temporal:
# Espera a tener un dominio para ejecutar esto
```

---

## FASE 8: CONFIGURAR SECURITY GROUP EN AWS

En la consola de AWS EC2:
1. Ve a "Security Groups"
2. Edita las reglas de entrada (Inbound):
   - **HTTP (80)**: desde 0.0.0.0/0
   - **HTTPS (443)**: desde 0.0.0.0/0
   - **SSH (22)**: desde tu IP (restringido)
   - **Puerto 4000**: desde 0.0.0.0/0 (si accedes a la API directamente)

---

## FASE 9: RESPALDAR LA BASE DE DATOS

### 9.1 Crear script de backup automático
```bash
nano ~/backup-db.sh
```

Contenido:
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mysqldump -u biopsyche_user -p'cambiar_contraseña' biopsyche_prod > $BACKUP_DIR/biopsyche_$TIMESTAMP.sql
echo "Backup creado: biopsyche_$TIMESTAMP.sql"
```

### 9.2 Hacer el script ejecutable
```bash
chmod +x ~/backup-db.sh
```

### 9.3 Configurar cron job para backup diario
```bash
crontab -e
# Añade esta línea (backup cada día a las 2 AM):
0 2 * * * /home/ubuntu/backup-db.sh
```

---

## FASE 10: CONFIGURAR MONITOREO (OPCIONAL)

### 10.1 Ver logs en tiempo real
```bash
pm2 logs biopsyche-api
pm2 logs biopsyche-frontend
```

### 10.2 Monitorear recursos
```bash
pm2 monit
```

---

## CHECKLIST DE DEPLOYMENT

- [ ] Servidor EC2 Ubuntu creado y actualizado
- [ ] Node.js y npm instalados
- [ ] MySQL instalado y ejecutándose
- [ ] Repositorio clonado en `/home/ubuntu/Psiquiatrico`
- [ ] `.env` configurado en `api/`
- [ ] Base de datos creada y usuario configurado
- [ ] `sync.js` ejecutado (tablas creadas)
- [ ] Admin creado con `create-admin.js`
- [ ] Dependencias instaladas: `npm install` (frontend y api)
- [ ] Frontend compilado: `npm run build`
- [ ] Nginx instalado y configurado
- [ ] PM2 instalado y aplicaciones iniciadas
- [ ] Security Group configurado en AWS
- [ ] URLs de API actualizadas en el frontend
- [ ] Prueba: acceder a `http://ip-172-31-13-27` desde el navegador

---

## COMANDOS ÚTILES PARA PRODUCCIÓN

```bash
# Ver estado de procesos
pm2 status

# Reiniciar aplicaciones
pm2 restart all

# Ver logs
pm2 logs

# Detener aplicaciones
pm2 stop all

# Eliminar aplicaciones de PM2
pm2 delete all

# Verificar puertos activos
sudo netstat -tlnp | grep LISTEN

# Verificar espacio en disco
df -h

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver estado de Nginx
sudo systemctl status nginx

# Reconstruir frontend
cd ~/Psiquiatrico && npm run build

# Hacer backup manual
mysqldump -u biopsyche_user -p biopsyche_prod > backup.sql
```

---

## TROUBLESHOOTING

### La API no se conecta a la BD
```bash
# Verifica credenciales en .env
# Verifica que MySQL esté corriendo:
sudo systemctl status mysql
# Intenta conectar manualmente:
mysql -u biopsyche_user -p -h localhost biopsyche_prod
```

### El frontend no carga
```bash
# Verifica que Nginx está corriendo:
sudo systemctl status nginx
# Reconstruye:
cd ~/Psiquiatrico && npm run build
pm2 restart biopsyche-frontend
```

### Puerto 4000 ya está en uso
```bash
# Busca qué está usando el puerto:
sudo lsof -i :4000
# Mata el proceso:
sudo kill -9 <PID>
# O cambia el puerto en .env y reinicia
```

### PM2 no se inicia con el sistema
```bash
pm2 startup
pm2 save
# Sigue las instrucciones que salgan
```

---

## PRÓXIMOS PASOS RECOMENDADOS

1. **Obtener un dominio**: Usar Route53 (AWS) o cualquier registrador
2. **Configurar SSL**: Ejecutar `certbot --nginx -d tu-dominio.com`
3. **Email transaccional**: Integrar SES (AWS) para correos de recuperación de contraseña
4. **CDN**: CloudFront (AWS) para servir contenido estático más rápido
5. **Monitoreo**: CloudWatch (AWS) para alertas y métricas
6. **Base de datos**: RDS (AWS Managed Database) en lugar de instancia local
7. **Escalar**: Load Balancer si el tráfico crece

---

## SOPORTE Y DOCUMENTACIÓN

- Documentación de Sequelize: https://sequelize.org/
- Documentación de Express: https://expressjs.com/
- PM2 Docs: https://pm2.keymetrics.io/docs/usage/quick-start/
- Nginx Docs: https://nginx.org/en/docs/
- AWS EC2 Docs: https://docs.aws.amazon.com/ec2/
