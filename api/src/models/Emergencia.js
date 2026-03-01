const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');
const Profesional = require('./Profesional');

const Emergencia = sequelize.define('Emergencia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  profesional_id: { type: DataTypes.INTEGER, allowNull: true },
  tipo_emergencia: { type: DataTypes.STRING(100) },
  descripcion: { type: DataTypes.TEXT },
  email_enviado_a: { type: DataTypes.STRING(100) },
  telefonico_enviado_a: { type: DataTypes.STRING(20) },
  estado: { type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelta'), defaultValue: 'pendiente' },
  actividades_calmantes_ofrecidas: { type: DataTypes.INTEGER },
  fecha_emergencia: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_resolucion: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'emergencias',
  timestamps: false,
});

Emergencia.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Emergencia.belongsTo(Profesional, { foreignKey: 'profesional_id' });
Paciente.hasMany(Emergencia, { foreignKey: 'paciente_id' });
Profesional.hasMany(Emergencia, { foreignKey: 'profesional_id' });

module.exports = Emergencia;
