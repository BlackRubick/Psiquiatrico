const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');

const DashboardMensual = sequelize.define('DashboardMensual', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  mes: { type: DataTypes.INTEGER, allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false },
  medicamentos_tomados: { type: DataTypes.INTEGER, defaultValue: 0 },
  actividades_completadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  presiones_emergencia: { type: DataTypes.INTEGER, defaultValue: 0 },
  emocion_predominante: { type: DataTypes.STRING(50) },
  calificacion_promedio_actividades: { type: DataTypes.DECIMAL(3,2) },
  fecha_generacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'dashboards_mensuales',
  timestamps: false,
});

DashboardMensual.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Paciente.hasMany(DashboardMensual, { foreignKey: 'paciente_id' });

module.exports = DashboardMensual;
