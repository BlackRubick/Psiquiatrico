const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');
const Profesional = require('./Profesional');

const Actividad = sequelize.define('Actividad', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  profesional_id: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(255), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  tipo: { type: DataTypes.ENUM('video', 'reading', 'writing', 'drawing'), allowNull: false },
  frecuencia: { type: DataTypes.ENUM('diaria', 'semanal', 'mensual'), allowNull: false },
  url_recurso: { type: DataTypes.STRING(255) },
  instrucciones_adicionales: { type: DataTypes.TEXT },
  completada: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha_asignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_completacion: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'actividades',
  timestamps: false,
});

Actividad.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Actividad.belongsTo(Profesional, { foreignKey: 'profesional_id' });
Paciente.hasMany(Actividad, { foreignKey: 'paciente_id' });
Profesional.hasMany(Actividad, { foreignKey: 'profesional_id' });

module.exports = Actividad;
