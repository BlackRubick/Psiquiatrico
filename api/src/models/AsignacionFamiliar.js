const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');

const AsignacionFamiliar = sequelize.define('AsignacionFamiliar', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  familiar_usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  fecha_asignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'asignaciones_paciente_familiar',
  timestamps: false,
});

AsignacionFamiliar.belongsTo(Usuario, { foreignKey: 'familiar_usuario_id', as: 'Familiar' });
AsignacionFamiliar.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Usuario.hasOne(AsignacionFamiliar, { foreignKey: 'familiar_usuario_id', as: 'AsignacionFamiliar' });
Paciente.hasOne(AsignacionFamiliar, { foreignKey: 'paciente_id' });

module.exports = AsignacionFamiliar;
