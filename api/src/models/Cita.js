const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');
const Profesional = require('./Profesional');

const Cita = sequelize.define('Cita', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  profesional_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false },
  motivo: { type: DataTypes.STRING(255) },
  notas: { type: DataTypes.TEXT },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'confirmada', 'completada', 'cancelada'), 
    defaultValue: 'pendiente' 
  },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'citas',
  timestamps: false,
});

Cita.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Cita.belongsTo(Profesional, { foreignKey: 'profesional_id' });
Paciente.hasMany(Cita, { foreignKey: 'paciente_id' });
Profesional.hasMany(Cita, { foreignKey: 'profesional_id' });

module.exports = Cita;
