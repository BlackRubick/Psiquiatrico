const Cita = require('../models/Cita');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario');
const { Op } = require('sequelize');

const isPacienteRole = (role) => {
  const r = String(role || '').toLowerCase();
  return r === 'paciente' || r === 'patient';
};

exports.getAll = async (req, res) => {
  try {
    const where = {};

    if (req.query.paciente_id) {
      where.paciente_id = Number(req.query.paciente_id);
    }

    if (req.query.fecha_inicio && req.query.fecha_fin) {
      where.fecha = {
        [require('sequelize').Op.between]: [req.query.fecha_inicio, req.query.fecha_fin]
      };
    }

    // Si es paciente, solo ver sus propias citas
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      where.paciente_id = paciente.id;
    }

    const citas = await Cita.findAll({
      where,
      include: [
        { 
          model: Paciente, 
          include: [{ model: Usuario, attributes: { exclude: ['password'] } }] 
        },
        { 
          model: Profesional, 
          include: [{ model: Usuario, attributes: { exclude: ['password'] } }] 
        }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']],
    });

    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, {
      include: [
        { 
          model: Paciente, 
          include: [{ model: Usuario, attributes: { exclude: ['password'] } }] 
        },
        { 
          model: Profesional, 
          include: [{ model: Usuario, attributes: { exclude: ['password'] } }] 
        }
      ],
    });

    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    // Verificar acceso del paciente
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || cita.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    res.json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cita' });
  }
};

exports.create = async (req, res) => {
  try {
    const { profesional_id, fecha, hora } = req.body;

    const citaExistente = await Cita.findOne({
      where: {
        profesional_id,
        fecha,
        hora,
        estado: { [Op.ne]: 'cancelada' },
      },
    });

    if (citaExistente) {
      return res.status(409).json({
        error: 'Ya existe una cita programada para ese profesional en la misma fecha y hora',
      });
    }

    const cita = await Cita.create(req.body);
    res.status(201).json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cita' });
  }
};

exports.update = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    const profesional_id = req.body.profesional_id ?? cita.profesional_id;
    const fecha = req.body.fecha ?? cita.fecha;
    const hora = req.body.hora ?? cita.hora;
    const estado = req.body.estado ?? cita.estado;

    if (estado !== 'cancelada') {
      const citaExistente = await Cita.findOne({
        where: {
          id: { [Op.ne]: cita.id },
          profesional_id,
          fecha,
          hora,
          estado: { [Op.ne]: 'cancelada' },
        },
      });

      if (citaExistente) {
        return res.status(409).json({
          error: 'Ya existe una cita programada para ese profesional en la misma fecha y hora',
        });
      }
    }

    await cita.update(req.body);
    res.json({ message: 'Cita actualizada', cita });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
};

exports.remove = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    await cita.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};
