const sequelize = require('./config/db');
const Usuario = require('./models/Usuario');
const Paciente = require('./models/Paciente');
const Profesional = require('./models/Profesional');
const Asignacion = require('./models/Asignacion');
const Actividad = require('./models/Actividad');
const Calificacion = require('./models/Calificacion');
const Medicamento = require('./models/Medicamento');
const MedicacionTomada = require('./models/MedicacionTomada');
const EmocionDiaria = require('./models/EmocionDiaria');
const Emergencia = require('./models/Emergencia');
const ActividadCalma = require('./models/ActividadCalma');
const DashboardMensual = require('./models/DashboardMensual');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('¡Todas las tablas han sido creadas o actualizadas!');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
    process.exit(1);
  }
})();
