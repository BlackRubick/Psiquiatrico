const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env');
console.log('Intentando cargar .env desde:', envPath);
console.log('Archivo existe:', fs.existsSync(envPath));

require('dotenv').config({ path: envPath });

console.log('DEBUG DB_DIALECT después de dotenv:', process.env.DB_DIALECT);
console.log('DEBUG DB_HOST:', process.env.DB_HOST);

if (!process.env.DB_DIALECT) {
  console.error('❌ ERROR: Variables de entorno no se cargaron correctamente');
  console.error('Asegúrate de que el archivo .env existe en:', envPath);
  process.exit(1);
}

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
const Cita = require('./models/Cita');
const VigilanciaPeso = require('./models/VigilanciaPeso');

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
