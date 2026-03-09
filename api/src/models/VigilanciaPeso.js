const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');

const VigilanciaPeso = sequelize.define('VigilanciaPeso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  peso: { type: DataTypes.DECIMAL(5, 2), allowNull: false }, // ej: 123.45 kg
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  notas: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'vigilancia_peso',
  timestamps: false,
});

VigilanciaPeso.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Paciente.hasMany(VigilanciaPeso, { foreignKey: 'paciente_id' });

module.exports = VigilanciaPeso;
