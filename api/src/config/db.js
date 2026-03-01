const { Sequelize } = require('sequelize');

// Las variables de entorno deben estar ya cargadas por el archivo que llama a este módulo
console.log('✓ Conectando a BD con dialect:', process.env.DB_DIALECT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

module.exports = sequelize;
