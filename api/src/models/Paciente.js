const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const Usuario = require('./Usuario');

const Paciente = sequelize.define('Paciente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  direccion: { type: DataTypes.STRING(255) },
  nombre_tutor: { type: DataTypes.STRING(150) },
  celular_tutor: { type: DataTypes.STRING(20) },
  psicologo_tratante: { type: DataTypes.STRING(150) },
  fecha_diagnostico: { type: DataTypes.DATE },
  numero_sesiones_completadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  numero_emergencias: { type: DataTypes.INTEGER, defaultValue: 0 },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'pacientes',
  timestamps: false,
});

Paciente.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasOne(Paciente, { foreignKey: 'usuario_id' });

module.exports = Paciente;
