const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const ActividadCalma = sequelize.define('ActividadCalma', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  duracion_minutos: { type: DataTypes.INTEGER },
  categoria: { type: DataTypes.STRING(100) },
  instrucciones: { type: DataTypes.TEXT },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  activa: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'actividades_calma',
  timestamps: false,
});

module.exports = ActividadCalma;
