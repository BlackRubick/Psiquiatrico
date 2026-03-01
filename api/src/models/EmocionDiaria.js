const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Paciente = require('./Paciente');

const EmocionDiaria = sequelize.define('EmocionDiaria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  emocion: { type: DataTypes.STRING(50), allowNull: false },
  intensidad: { type: DataTypes.INTEGER },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  comentario: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'emociones_diarias',
  timestamps: false,
});

EmocionDiaria.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Paciente.hasMany(EmocionDiaria, { foreignKey: 'paciente_id' });

module.exports = EmocionDiaria;
