const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario');

const Profesional = sequelize.define('Profesional', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  especialidad: { type: DataTypes.STRING(100) },
  cedula: { type: DataTypes.STRING(50) },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'profesionales_salud',
  timestamps: false,
});

Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(Profesional, { foreignKey: 'usuario_id' });

module.exports = Profesional;
