const Medicamento = require('../models/Medicamento');
const Paciente = require('../models/Paciente');
const MedicacionTomada = require('../models/MedicacionTomada');
const sequelize = require('../config/db');

const isPacienteRole = (role) => {
  const r = String(role || '').toLowerCase();
  return r === 'paciente' || r === 'patient';
};

const parseSchedules = (frecuencia) => {
  if (!frecuencia) return { morning: false, afternoon: false, night: false };
  try {
    const parsed = typeof frecuencia === 'string' ? JSON.parse(frecuencia) : frecuencia;
    return {
      morning: !!parsed.morning,
      afternoon: !!parsed.afternoon,
      night: !!parsed.night,
    };
  } catch {
    return { morning: false, afternoon: false, night: false };
  }
};

exports.getAll = async (req, res) => {
  try {
    const where = {};

    if (req.query.paciente_id) {
      where.paciente_id = Number(req.query.paciente_id);
    }

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      where.paciente_id = paciente.id;
    }

    const medicamentos = await Medicamento.findAll({ where, include: [Paciente] });

    const payload = medicamentos.map((m) => {
      const raw = m.toJSON();
      return {
        ...raw,
        name: raw.nombre,
        schedules: parseSchedules(raw.frecuencia),
      };
    });

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener medicamentos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id, { include: [Paciente] });
    if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' });

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || medicamento.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    res.json(medicamento);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener medicamento' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      paciente_id,
      nombre,
      name,
      dosis,
      frecuencia,
      morning,
      afternoon,
      night,
      fecha_inicio,
      fecha_fin,
    } = req.body;

    let targetPacienteId = paciente_id ? Number(paciente_id) : null;

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      targetPacienteId = paciente.id;
    }

    const scheduleObj = {
      morning: !!morning,
      afternoon: !!afternoon,
      night: !!night,
    };

    const medicamento = await Medicamento.create({
      paciente_id: targetPacienteId,
      nombre: nombre || name,
      dosis,
      frecuencia: frecuencia || JSON.stringify(scheduleObj),
      fecha_inicio,
      fecha_fin,
    });

    const raw = medicamento.toJSON();
    res.status(201).json({
      ...raw,
      name: raw.nombre,
      schedules: parseSchedules(raw.frecuencia),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear medicamento' });
  }
};

exports.update = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' });

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || medicamento.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    await medicamento.update(req.body);
    res.json({ message: 'Medicamento actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar medicamento' });
  }
};

exports.remove = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' });

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || medicamento.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    await sequelize.transaction(async (t) => {
      await MedicacionTomada.destroy({
        where: { medicamento_id: medicamento.id },
        transaction: t,
      });

      await medicamento.destroy({ transaction: t });
    });

    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    res.status(500).json({
      error: 'Error al eliminar medicamento',
      detail: err?.message,
    });
  }
};
