const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');

const Medicamento = sequelize.define('Medicamento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  dosis: { type: DataTypes.STRING(50) },
  frecuencia: { type: DataTypes.STRING(50) },
  fecha_inicio: { type: DataTypes.DATE },
  fecha_fin: { type: DataTypes.DATE },
}, {
  tableName: 'medicamentos',
  timestamps: false,
});

Medicamento.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Paciente.hasMany(Medicamento, { foreignKey: 'paciente_id' });

module.exports = Medicamento;
