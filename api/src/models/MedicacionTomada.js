const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Medicamento = require('./Medicamento');
const Paciente = require('./Paciente');

const MedicacionTomada = sequelize.define('MedicacionTomada', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  medicamento_id: { type: DataTypes.INTEGER, allowNull: false },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  dia_semana: { type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'), allowNull: false },
  hora: { type: DataTypes.ENUM('morning', 'afternoon', 'night'), allowNull: false },
  tomado: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'medicacion_tomada',
  timestamps: false,
});

MedicacionTomada.belongsTo(Medicamento, { foreignKey: 'medicamento_id' });
MedicacionTomada.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Medicamento.hasMany(MedicacionTomada, { foreignKey: 'medicamento_id' });
Paciente.hasMany(MedicacionTomada, { foreignKey: 'paciente_id' });

module.exports = MedicacionTomada;
