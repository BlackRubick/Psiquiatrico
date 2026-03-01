#!/bin/bash

# Script para crear el archivo .env manualmente en el servidor

echo "=========================================="
echo "Creando archivo .env para BIOPSYCHE API"
echo "=========================================="
echo ""

# Ir a la carpeta api
cd ~/Psiquiatrico/api

echo "Ubicación actual: $(pwd)"
echo ""

# Verificar si .env ya existe
if [ -f .env ]; then
    echo "⚠️ Archivo .env ya existe. Contenido:"
    cat .env
    read -p "¿Deseas sobrescribirlo? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Operación cancelada"
        exit 0
    fi
fi

# Solicitar credenciales
read -p "Usuario de MySQL (default: biopsyche_user): " DB_USER
DB_USER=${DB_USER:-biopsyche_user}

read -p "Nombre de BD (default: biopsyche_prod): " DB_NAME
DB_NAME=${DB_NAME:-biopsyche_prod}

read -sp "Contraseña de BD: " DB_PASSWORD
echo ""

# Generar JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)

# Obtener IP
IP=$(hostname -I | awk '{print $1}')

# Crear archivo .env
cat > .env <<EOF
# Configuración de Base de Datos
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

# Configuración de Seguridad
JWT_SECRET=$JWT_SECRET

# Configuración del Servidor
PORT=4000
NODE_ENV=production

# URLs
FRONTEND_URL=http://$IP:5173
API_URL=http://$IP:4000
EOF

echo ""
echo "✓ Archivo .env creado exitosamente!"
echo ""
echo "Contenido:"
echo "=========================================="
cat .env
echo "=========================================="
echo ""

# Verificar que se creó
if [ -f .env ]; then
    echo "✓ Verificación: Archivo existe en $(pwd)/.env"
else
    echo "❌ ERROR: No se creó el archivo .env"
    exit 1
fi

# Hacer el archivo más seguro (solo el usuario puede leerlo)
chmod 600 .env
echo "✓ Permisos configurados (600)"

echo ""
echo "Próximo paso: ejecuta 'node src/sync.js' para crear las tablas"
