#!/bin/bash

# Script automático para deployment de BIOPSYCHE en AWS EC2
# Ejecutar: bash deploy.sh

set -e  # Salir si hay error

echo "=========================================="
echo "DEPLOYMENT AUTOMÁTICO - BIOPSYCHE"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# FASE 1: Verificar instalaciones
log_info "Fase 1: Verificando instalaciones..."

if ! command -v node &> /dev/null; then
    log_error "Node.js no está instalado"
    echo "Instálalo con: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm no está instalado"
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    log_warning "MySQL no está instalado. Se instará..."
    sudo apt update
    sudo apt install -y mysql-server
fi

log_info "✓ Node.js $(node -v)"
log_info "✓ npm $(npm -v)"
log_info "✓ MySQL $(mysql -V)"

echo ""
log_info "Fase 2: Instalando dependencias del Frontend..."
cd ~/Psiquiatrico
npm install --legacy-peer-deps

echo ""
log_info "Fase 3: Compilando Frontend..."
npm run build
log_info "✓ Frontend compilado en dist/"

echo ""
log_info "Fase 4: Instalando dependencias de la API..."
cd api
npm install

echo ""
log_info "Fase 5: Creando base de datos..."

# Leer credenciales
read -p "Usuario de MySQL (default: biopsyche_user): " DB_USER
DB_USER=${DB_USER:-biopsyche_user}

read -sp "Contraseña MySQL root: " ROOT_PASSWORD
echo ""

read -sp "Contraseña para usuario $DB_USER (default: cambiar después): " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-biopsyche_pass123}
echo ""

# Crear base de datos
mysql -u root -p"$ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS biopsyche_prod;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON biopsyche_prod.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

log_info "✓ Base de datos creada"

echo ""
log_info "Fase 6: Configurando variables de entorno..."

if [ ! -f .env ]; then
    log_info "Creando archivo .env..."
    cat > .env <<EOF
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=biopsyche_prod
JWT_SECRET=$(openssl rand -base64 32)
PORT=4000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:4000
EOF
    log_info "✓ Archivo .env creado en api/.env"
    # Verificar que se creó
    if [ -f .env ]; then
        log_info "✓ Archivo .env verificado"
        cat .env | head -3
    else
        log_error "No se pudo crear .env"
        exit 1
    fi
else
    log_warning "Archivo .env ya existe, no se sobrescribió"
    log_info "Contenido actual:"
    cat .env | head -3
fi

echo ""
log_info "Fase 7: Sincronizando tablas de base de datos..."
log_info "Ejecutando: node src/sync.js desde $(pwd)"
node src/sync.js

echo ""
log_info "Fase 8: Creando usuario administrador..."
node create-admin.js

echo ""
log_info "Fase 9: Instalando PM2..."
sudo npm install -g pm2

echo ""
log_info "Fase 10: Configurando PM2..."

if [ ! -f ../ecosystem.config.js ]; then
    cat > ../ecosystem.config.js <<'EOF'
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
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false
    }
  ]
};
EOF
    log_info "✓ ecosystem.config.js creado"
fi

# Crear carpeta de logs
mkdir -p ~/Psiquiatrico/logs

echo ""
log_info "Fase 11: Instalando y configurando Nginx..."

if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
fi

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/biopsyche > /dev/null <<'EOF'
upstream api {
    server 127.0.0.1:4000;
}

server {
    listen 80 default_server;
    server_name _;

    client_max_body_size 50M;

    # Servir archivos estáticos del build del frontend
    location / {
        root /home/ubuntu/Psiquiatrico/dist;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # API proxy
    location /api/ {
        proxy_pass http://api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_buffering off;
    }

    # Assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/ubuntu/Psiquiatrico/dist;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Activar configuración
sudo ln -sf /etc/nginx/sites-available/biopsyche /etc/nginx/sites-enabled/biopsyche
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración
if sudo nginx -t; then
    sudo systemctl restart nginx
    log_info "✓ Nginx configurado y reiniciado"
else
    log_error "Error en configuración de Nginx"
    exit 1
fi

echo ""
log_info "Fase 12: Iniciando aplicaciones con PM2..."

cd ~/Psiquiatrico
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu

log_info "✓ Aplicaciones iniciadas con PM2"

echo ""
log_info "Fase 13: Verificando servicios..."

pm2 status

echo ""
echo "=========================================="
echo -e "${GREEN}DEPLOYMENT COMPLETADO!${NC}"
echo "=========================================="
echo ""
echo "URLs de acceso:"
echo "  • Frontend: http://tu-ip"
echo "  • API: http://tu-ip:4000"
echo ""
echo "Próximos pasos:"
echo "  1. Verifica que Nginx está corriendo: sudo systemctl status nginx"
echo "  2. Verifica PM2: pm2 status"
echo "  3. Accede a tu aplicación desde el navegador"
echo "  4. Si configuraste dominio, ejecuta: sudo certbot --nginx -d tu-dominio.com"
echo ""
echo "Comandos útiles:"
echo "  • Ver logs: pm2 logs"
echo "  • Reiniciar: pm2 restart all"
echo "  • Ver estado: pm2 status"
echo "  • Monitoreo: pm2 monit"
echo ""
