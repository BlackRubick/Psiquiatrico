const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  nombreCompleto: { type: DataTypes.STRING(150), allowNull: false },
  edad: { type: DataTypes.INTEGER, allowNull: true },
  telefono: { type: DataTypes.STRING(20), allowNull: true },
  tipo_usuario: { type: DataTypes.ENUM('paciente', 'healthcare', 'familiar', 'admin'), allowNull: false },
  estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_ultima_sesion: { type: DataTypes.DATE, allowNull: true },
  fecha_nacimiento: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
