# BIOPSYCHE - Guía de Deployment a AWS EC2

> **Sistema de gestión psiquiátrica** con frontend React y API Node.js, listo para producción en AWS.

## 📋 Índice Rápido

| Documento | Contenido |
|-----------|----------|
| **QUICK_DEPLOY.md** | ⚡ Guía rápida (10-20 minutos) |
| **DEPLOYMENT_AWS_EC2.md** | 📚 Guía detallada (paso a paso) |
| **ARCHITECTURE.md** | 🏗️ Diagrama de arquitectura |
| **deploy.sh** | 🤖 Script automático |

---

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### Opción 1: Script Automático (Recomendado)

```bash
# 1. Conectarte a tu EC2
ssh -i tu-clave.pem ubuntu@tu-ip

# 2. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 3. Instalar Node.js, MySQL, Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server nginx

# 4. Clonar proyecto (si no está)
cd ~
git clone <tu-repo-url> Psiquiatrico
cd Psiquiatrico

# 5. Ejecutar script
chmod +x deploy.sh
bash deploy.sh

# ¡Listo! Tu aplicación está en http://tu-ip
```

### Opción 2: Manual (Más control)

Ver **QUICK_DEPLOY.md** para instrucciones paso a paso.

---

## ✅ Verificación Rápida

```bash
# ¿Procesos corriendo?
pm2 status

# ¿Logs sin errores?
pm2 logs

# ¿Nginx funcionando?
sudo systemctl status nginx

# ¿Base de datos conectada?
mysql -u biopsyche_user -p biopsyche_prod -e "SELECT 1;"
```

---

## 📱 Acceso a tu Aplicación

```
Frontend: http://tu-ip
API: http://tu-ip:4000
API Directa (test): http://tu-ip/api
```

### Datos de Prueba

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Admin | admin | admin123 |
| Doctor | doctor | doctor123 |
| Paciente | paciente | paciente123 |

---

## 🏗️ Estructura del Proyecto

```
psiquiatrico/
├── src/                    # Frontend React
│   ├── pages/             # Admin, Healthcare, Patient
│   ├── components/        # UI components
│   └── contexts/          # Auth context
├── api/                   # Backend Node.js
│   ├── src/
│   │   ├── models/        # Base de datos (Sequelize)
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── routes/        # API endpoints
│   │   └── middlewares/   # JWT, validación
│   └── .env              # Configuración (secreto!)
├── dist/                  # Frontend compilado
├── deploy.sh             # Script automático
├── ecosystem.config.js   # Configuración PM2
└── DEPLOYMENT_AWS_EC2.md # Guía detallada
```

---

## 🔧 Configuración Post-Deployment

### 1. Cambiar Credenciales (IMPORTANTE)

```bash
# Conectarse a MySQL
sudo mysql -u root

# Cambiar contraseña BD
ALTER USER 'biopsyche_user'@'localhost' IDENTIFIED BY 'nueva_contraseña_fuerte';
FLUSH PRIVILEGES;
EXIT;

# Actualizar .env
cd ~/Psiquiatrico/api
nano .env
# DB_PASSWORD=nueva_contraseña_fuerte

# Reiniciar API
pm2 restart biopsyche-api
```

### 2. Obtener Dominio y SSL (RECOMENDADO)

```bash
# Instalar certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado (reemplaza tu-dominio.com)
sudo certbot --nginx -d tu-dominio.com

# Auto-renovación (cron job automático)
sudo systemctl enable certbot.timer
```

### 3. Configurar Backups Automáticos

```bash
# Crear script de backup
nano ~/backup-db.sh
# (Ver contenido en DEPLOYMENT_AWS_EC2.md)

# Hacer ejecutable
chmod +x ~/backup-db.sh

# Agregar a cron (backup diario a las 2 AM)
crontab -e
# Añadir: 0 2 * * * /home/ubuntu/backup-db.sh
```

---

## 📊 Monitoreo Diario

```bash
# Ver procesos y estado
pm2 status

# Ver logs en tiempo real
pm2 logs

# Ver uso de recursos
pm2 monit

# Ver logs específicos
pm2 logs biopsyche-api
pm2 logs biopsyche-frontend

# Ver acceso web
sudo tail -f /var/log/nginx/access.log

# Ver errores
pm2 logs biopsyche-api | grep "error"
```

---

## 🆘 Problemas Comunes

### Error "Connection refused"
```bash
# Verificar MySQL
sudo systemctl status mysql
sudo systemctl start mysql

# Verificar API
pm2 logs biopsyche-api
```

### "502 Bad Gateway"
```bash
# Reiniciar API
pm2 restart biopsyche-api

# Ver logs
pm2 logs biopsyche-api
```

### Puerto 4000 en uso
```bash
# Ver quién lo usa
sudo lsof -i :4000

# Matar proceso
sudo kill -9 <PID>

# Reiniciar API
pm2 restart biopsyche-api
```

### Frontend no actualiza
```bash
# Reconstruir
cd ~/Psiquiatrico
npm run build

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🔄 Actualizar Código en Producción

```bash
# En tu máquina local
git add .
git commit -m "cambios"
git push origin main

# En el servidor
cd ~/Psiquiatrico
git pull

# Si hay cambios en API
cd api
npm install
pm2 restart biopsyche-api

# Si hay cambios en Frontend
cd ..
npm run build
sudo systemctl restart nginx

# Verificar
pm2 status
```

---

## 📈 Escalamiento Futuro

Cuando tu aplicación crezca:

1. **RDS (AWS)**: Usar MySQL administrado en lugar de instancia local
   ```bash
   Ventajas: Backups automáticos, replicación, failover
   ```

2. **CloudFront (AWS)**: Distribuir assets estáticos globalmente
   ```bash
   Ventajas: Más rápido, menos carga en servidor
   ```

3. **ElasticCache**: Cache en memoria (Redis/Memcached)
   ```bash
   Ventajas: Consultas más rápidas, menos carga BD
   ```

4. **Load Balancer**: Múltiples instancias EC2
   ```bash
   Ventajas: Mayor escalabilidad, redundancia
   ```

5. **Auto Scaling**: Escalar automáticamente según demanda
   ```bash
   Ventajas: Costo optimizado, alta disponibilidad
   ```

---

## 🔐 Checklist de Seguridad

- [ ] ✅ Cambiar contraseña de root MySQL
- [ ] ✅ Cambiar contraseña de usuario BD
- [ ] ✅ Cambiar JWT_SECRET en .env
- [ ] ✅ Cambiar credenciales de prueba
- [ ] ✅ SSH key-based auth (sin contraseña)
- [ ] ✅ Security Group: puertos restringidos
- [ ] ✅ Firewall: ufw habilitado
- [ ] ✅ SSL/HTTPS: certbot configurado
- [ ] ✅ Backups: automatizados
- [ ] ✅ Logs: monitoreados

---

## 📚 Documentación Completa

### Para empezar rápido
→ **QUICK_DEPLOY.md**

### Para entender todo
→ **DEPLOYMENT_AWS_EC2.md**

### Para ver arquitectura
→ **ARCHITECTURE.md**

### Para ver esquema BD
→ **DATABASE.md**

---

## 🤝 Soporte

### Comandos Útiles

```bash
# PM2
pm2 status          # Ver procesos
pm2 logs            # Ver logs
pm2 restart all     # Reiniciar todo
pm2 stop all        # Detener todo
pm2 flush           # Limpiar logs

# Nginx
sudo systemctl status nginx     # Estado
sudo systemctl restart nginx    # Reiniciar
sudo nginx -t                   # Probar config

# MySQL
sudo mysql -u root              # Conectar
mysqldump -u user -p db > backup.sql  # Backup
```

### Archivos Importantes

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| .env | ~/Psiquiatrico/api/ | Contraseñas y secretos |
| ecosystem.config.js | ~/Psiquiatrico/ | Configuración PM2 |
| Nginx config | /etc/nginx/sites-available/biopsyche | Proxy reverso |
| Logs | ~/Psiquiatrico/logs/ | Errores y output |

---

## 📞 Contacto & Ayuda

Si necesitas ayuda:
1. Revisa **DEPLOYMENT_AWS_EC2.md** (troubleshooting)
2. Ver logs: `pm2 logs`
3. Verificar procesos: `pm2 status`
4. Probar conectividad: `curl http://localhost:4000`

---

## 📅 Próximas Pasos

1. ✅ Ejecutar deploy.sh
2. ✅ Verificar que funciona
3. ✅ Cambiar credenciales
4. ✅ Obtener dominio
5. ✅ Configurar SSL/HTTPS
6. ✅ Configurar backups
7. ✅ Monitoreo 24/7

---

**¡Tu aplicación BIOPSYCHE está lista para producción! 🎉**

Version: 1.0  
Última actualización: Febrero 2026  
Stack: Node.js + Express + React + Vite + MySQL/PostgreSQL
