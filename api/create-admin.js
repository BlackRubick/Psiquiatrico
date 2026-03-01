// IMPORTANTE: Cargar dotenv PRIMERO antes de cualquier require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('✓ Dotenv cargado');
console.log('DEBUG DB_DIALECT:', process.env.DB_DIALECT);

const bcrypt = require('bcryptjs');
const Usuario = require('./src/models/Usuario');
const sequelize = require('./src/config/db');

(async () => {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('Admin123123', 10);
    const [admin, created] = await Usuario.findOrCreate({
      where: { email: 'admin@hotmail.com' },
      defaults: {
        username: 'admin',
        email: 'admin@hotmail.com',
        password: hash,
        nombreCompleto: 'admin',
        edad: 30,
        telefono: '0000000000',
        tipo_usuario: 'admin',
        estado: 'activo',
      }
    });
    if (created) {
      console.log('Usuario admin creado');
    } else {
      console.log('El usuario admin ya existe');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error al crear admin:', err);
    process.exit(1);
  }
})();
