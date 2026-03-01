const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Actividad = require('./Actividad');
const Paciente = require('./Paciente');

const Calificacion = sequelize.define('Calificacion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  actividad_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  calificacion: { type: DataTypes.INTEGER, allowNull: false },
  comentario_sentimiento: { type: DataTypes.TEXT },
  archivo_subido: { type: DataTypes.STRING(255) },
  fecha_calificacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'calificaciones_actividades',
  timestamps: false,
});

Calificacion.belongsTo(Actividad, { foreignKey: 'actividad_id' });
Calificacion.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Actividad.hasOne(Calificacion, { foreignKey: 'actividad_id' });
Paciente.hasMany(Calificacion, { foreignKey: 'paciente_id' });

module.exports = Calificacion;
