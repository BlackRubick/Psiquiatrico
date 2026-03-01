const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');
const Profesional = require('./Profesional');

const Asignacion = sequelize.define('Asignacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  profesional_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_asignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'asignaciones_paciente_profesional',
  timestamps: false,
});

Asignacion.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Asignacion.belongsTo(Profesional, { foreignKey: 'profesional_id' });
Paciente.hasMany(Asignacion, { foreignKey: 'paciente_id' });
Profesional.hasMany(Asignacion, { foreignKey: 'profesional_id' });

module.exports = Asignacion;
