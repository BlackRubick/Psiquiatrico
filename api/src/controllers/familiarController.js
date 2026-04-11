const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Asignacion = require('../models/Asignacion');
const AsignacionFamiliar = require('../models/AsignacionFamiliar');
const Actividad = require('../models/Actividad');
const EmocionDiaria = require('../models/EmocionDiaria');
const Emergencia = require('../models/Emergencia');
const MedicacionTomada = require('../models/MedicacionTomada');
const Cita = require('../models/Cita');

function getMonthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

async function findAssignedPatientByFamiliarUserId(familiarUserId) {
  return AsignacionFamiliar.findOne({
    where: { familiar_usuario_id: familiarUserId },
    include: [
      {
        model: Paciente,
        include: [{ model: Usuario, attributes: { exclude: ['password'] } }],
      },
      {
        model: Usuario,
        as: 'Familiar',
        attributes: { exclude: ['password'] },
      },
    ],
  });
}

async function buildDashboard(pacienteId) {
  const { start, end } = getMonthBounds();

  const [
    actividades,
    emociones,
    emergencias,
    medicaciones,
    citas,
    asignacionProfesional,
  ] = await Promise.all([
    Actividad.findAll({
      where: { paciente_id: pacienteId },
      order: [['fecha_asignacion', 'DESC']],
    }),
    EmocionDiaria.findAll({
      where: {
        paciente_id: pacienteId,
        fecha: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [['fecha', 'DESC']],
    }),
    Emergencia.findAll({
      where: {
        paciente_id: pacienteId,
        fecha_emergencia: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [['fecha_emergencia', 'DESC']],
    }),
    MedicacionTomada.findAll({
      where: {
        paciente_id: pacienteId,
        fecha: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [['fecha', 'DESC']],
    }),
    Cita.findAll({
      where: { paciente_id: pacienteId },
      order: [['fecha', 'ASC'], ['hora', 'ASC']],
      limit: 5,
    }),
    Asignacion.findOne({
      where: { paciente_id: pacienteId },
      include: [{ model: Profesional, include: [{ model: Usuario, attributes: { exclude: ['password'] } }] }],
    }),
  ]);

  const completedActivities = actividades.filter((actividad) => actividad.completada).length;
  const emotionSummary = emociones.reduce((acc, emocion) => {
    acc[emocion.emocion] = (acc[emocion.emocion] || 0) + 1;
    return acc;
  }, {});

  return {
    summary: {
      totalActivities: actividades.length,
      completedActivities,
      emergenciesCount: emergencias.length,
      emotionsCount: emociones.length,
      medicationRecords: medicaciones.length,
      upcomingAppointments: citas.length,
    },
    emotionSummary,
    recent: {
      activities: actividades.slice(0, 5),
      emotions: emociones.slice(0, 5),
      emergencies: emergencias.slice(0, 5),
      appointments: citas,
      medicationRecords: medicaciones.slice(0, 5),
    },
    professional: asignacionProfesional?.Profesional || null,
  };
}

exports.getMyPatient = async (req, res) => {
  try {
    const assignment = await findAssignedPatientByFamiliarUserId(req.user.id);
    if (!assignment) return res.status(404).json({ error: 'No tienes un paciente asignado' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener paciente asignado' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const assignment = await findAssignedPatientByFamiliarUserId(req.user.id);
    if (!assignment) return res.status(404).json({ error: 'No tienes un paciente asignado' });

    const dashboard = await buildDashboard(assignment.paciente_id);
    res.json({ assignment, dashboard });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener dashboard familiar' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await AsignacionFamiliar.findAll({
      include: [
        { model: Usuario, as: 'Familiar', attributes: { exclude: ['password'] } },
        { model: Paciente, include: [{ model: Usuario, attributes: { exclude: ['password'] } }] },
      ],
      order: [['fecha_asignacion', 'DESC']],
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asignaciones familiares' });
  }
};

exports.assignPatient = async (req, res) => {
  try {
    const { familiar_usuario_id, paciente_id } = req.body;
    const familiar = await Usuario.findByPk(familiar_usuario_id);
    const paciente = await Paciente.findByPk(paciente_id);

    if (!familiar || String(familiar.tipo_usuario).toLowerCase() !== 'familiar') {
      return res.status(400).json({ error: 'El usuario seleccionado no es familiar' });
    }
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const existingByPatient = await AsignacionFamiliar.findOne({ where: { paciente_id } });
    if (existingByPatient) {
      const sameFamily = existingByPatient.familiar_usuario_id === familiar_usuario_id;
      if (sameFamily) {
        return res.json(existingByPatient);
      }
      return res.status(409).json({ error: 'Ese paciente ya tiene un familiar asignado' });
    }

    const existingByFamily = await AsignacionFamiliar.findOne({ where: { familiar_usuario_id } });
    if (existingByFamily) {
      await existingByFamily.update({ paciente_id });
      return res.json(existingByFamily);
    }

    const assignment = await AsignacionFamiliar.create({ familiar_usuario_id, paciente_id });
    res.status(201).json(assignment);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Ya existe una asignación para ese familiar o paciente' });
    }
    console.error('Error al asignar paciente a familiar:', err);
    res.status(500).json({ error: 'Error al asignar paciente a familiar' });
  }
};

exports.removeAssignment = async (req, res) => {
  try {
    const assignment = await AsignacionFamiliar.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Asignación no encontrada' });
    await assignment.destroy();
    res.json({ message: 'Asignación eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar asignación' });
  }
};
