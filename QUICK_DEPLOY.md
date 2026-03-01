# 📋 DEPLOYMENT RÁPIDO - CHECKLIST

## ✅ PASO 1: CONECTARTE AL SERVIDOR

```bash
ssh -i tu-clave.pem ubuntu@ip-172-31-13-27
```

## ✅ PASO 2: ACTUALIZAR SISTEMA (1-2 minutos)

```bash
sudo apt update && sudo apt upgrade -y
```

## ✅ PASO 3: INSTALAR DEPENDENCIAS (5-10 minutos)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL
sudo apt install -y mysql-server

# Nginx
sudo apt install -y nginx

# Verificar
node -v && npm -v && mysql -V
```

## ✅ PASO 4: CLONAR PROYECTO (si aún no está)

```bash
cd ~
git clone <tu-repo-url> Psiquiatrico
cd Psiquiatrico
```

## ✅ PASO 5: EJECUTAR SCRIPT DE DEPLOYMENT (5-15 minutos)

```bash
# Hacer el script ejecutable
chmod +x deploy.sh

# Ejecutar
bash deploy.sh
```

El script automáticamente:
- ✓ Instala dependencias del frontend y API
- ✓ Compila el frontend (build)
- ✓ Crea base de datos MySQL
- ✓ Configura variables de entorno (.env)
- ✓ Sincroniza tablas (Sequelize)
- ✓ Crea usuario admin
- ✓ Configura Nginx como proxy reverso
- ✓ Inicia aplicaciones con PM2

## ✅ PASO 6: VERIFICAR QUE FUNCIONA (1-2 minutos)

```bash
# Ver estado de procesos
pm2 status

# Ver logs
pm2 logs

# Verificar Nginx
sudo systemctl status nginx
```

## ✅ PASO 7: ACCEDER A LA APLICACIÓN

Abre en el navegador:
```
http://ip-172-31-13-27
```

Debería cargar el login con los datos de prueba:
- Admin: `admin` / `admin123`
- Doctor: `doctor` / `doctor123`
- Paciente: `paciente` / `paciente123`

---

## 🔧 CONFIGURACIÓN IMPORTANTE

### Cambiar contraseña de base de datos (SEGURIDAD)

```bash
# Conectarse a MySQL
sudo mysql -u root

# Cambiar contraseña del usuario biopsyche_user
ALTER USER 'biopsyche_user'@'localhost' IDENTIFIED BY 'nueva_contraseña_fuerte';
FLUSH PRIVILEGES;
EXIT;

# Actualizar .env
cd ~/Psiquiatrico/api
nano .env
# Cambiar: DB_PASSWORD=nueva_contraseña_fuerte

# Reiniciar API
pm2 restart biopsyche-api
```

### Cambiar secreto JWT (SEGURIDAD)

```bash
cd ~/Psiquiatrico/api
nano .env

# Generar nuevo secreto:
# openssl rand -base64 32
# Copiar resultado y pegar en JWT_SECRET

pm2 restart biopsyche-api
```

---

## 📊 MONITOREO DIARIO

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs

# Ver uso de CPU, memoria
pm2 monit

# Ver logs específicos
pm2 logs biopsyche-api
pm2 logs biopsyche-frontend
```

---

## 🚨 TROUBLESHOOTING

### "Error: listen EADDRINUSE: address already in use"
```bash
# Mata el proceso en el puerto
sudo lsof -i :4000
sudo kill -9 <PID>

# Reinicia
pm2 restart biopsyche-api
```

### "Cannot find module 'express'"
```bash
cd ~/Psiquiatrico/api
npm install
pm2 restart biopsyche-api
```

### "Connection refused" a base de datos
```bash
# Verifica MySQL está corriendo
sudo systemctl status mysql

# Inicia MySQL si está parado
sudo systemctl start mysql

# Verifica credenciales en .env
cat .env | grep DB_
```

### "Error 502 Bad Gateway"
```bash
# Verifica que API está corriendo
pm2 logs biopsyche-api

# Verifica Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📱 FLUJO COMPLETO DE PRUEBA

1. **Accede a http://ip-172-31-13-27**
2. **Login como Admin** (admin/admin123)
3. **Gestiona usuarios** → Crear, editar, eliminar
4. **Crear paciente** → Los datos se guardan en MySQL
5. **Login como Doctor** (doctor/doctor123)
6. **Asignar actividades** a pacientes → Se guardan en API/BD
7. **Ver dashboards** de pacientes → Datos de la API

---

## 🔐 SECURITY CHECKLIST

- [ ] Cambiar contraseña de root MySQL
- [ ] Cambiar contraseña del usuario biopsyche_user
- [ ] Cambiar JWT_SECRET en .env
- [ ] Cambiar credenciales de prueba del login
- [ ] Habilitar SSH key-based auth (deshabilitar password)
- [ ] Configurar Security Group en AWS (restringir puertos)
- [ ] Obtener dominio y configurar SSL con certbot
- [ ] Configurar backups automáticos de BD

---

## 📈 ESCALAMIENTO FUTURO

Cuando crezcas:
1. Usar **RDS** en lugar de MySQL local (Managed Database)
2. Usar **CloudFront** para servir assets estáticos
3. Usar **Load Balancer** si necesitas múltiples instancias
4. Usar **SES** para envío de emails
5. Configurar **CloudWatch** para monitoreo y alertas

---

## 📚 DOCUMENTACIÓN COMPLETA

Ver archivo `DEPLOYMENT_AWS_EC2.md` para detalles completos y configuraciones avanzadas.
