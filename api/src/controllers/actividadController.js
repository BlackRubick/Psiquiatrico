const Actividad = require('../models/Actividad');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Calificacion = require('../models/Calificacion');

const isPacienteRole = (role) => {
  const r = String(role || '').toLowerCase();
  return r === 'paciente' || r === 'patient';
};

exports.getAll = async (req, res) => {
  try {
    const where = {};

    // Si llega filtro explícito por paciente
    if (req.query.paciente_id) {
      where.paciente_id = Number(req.query.paciente_id);
    }

    // Si el usuario es paciente, solo puede ver sus propias actividades
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      where.paciente_id = paciente.id;
    }

    const actividades = await Actividad.findAll({
      where,
      include: [Paciente, Profesional, Calificacion],
      order: [['fecha_asignacion', 'DESC']],
    });

    // Compatibilidad con frontend (campos calculados en raíz)
    const payload = actividades.map((a) => {
      const raw = a.toJSON();
      return {
        ...raw,
        calificacion: raw.Calificacion?.calificacion || 0,
        comentario: raw.Calificacion?.comentario_sentimiento || '',
      };
    });

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};

exports.getById = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id, { include: [Paciente, Profesional, Calificacion] });
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || actividad.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    res.json(actividad);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividad' });
  }
};

exports.create = async (req, res) => {
  try {
    const actividad = await Actividad.create(req.body);
    res.status(201).json(actividad);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear actividad' });
  }
};

exports.update = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    await actividad.update(req.body);
    res.json({ message: 'Actividad actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar actividad' });
  }
};

exports.remove = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    await actividad.destroy();
    res.json({ message: 'Actividad eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar actividad' });
  }
};

exports.complete = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

    const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    if (actividad.paciente_id !== paciente.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const rating = Number(req.body.rating || 0);
    const comment = req.body.comment || '';

    await actividad.update({
      completada: true,
      fecha_completacion: new Date(),
    });

    const existing = await Calificacion.findOne({ where: { actividad_id: actividad.id } });
    if (existing) {
      await existing.update({
        paciente_id: paciente.id,
        calificacion: rating,
        comentario_sentimiento: comment,
      });
    } else {
      await Calificacion.create({
        actividad_id: actividad.id,
        paciente_id: paciente.id,
        calificacion: rating,
        comentario_sentimiento: comment,
      });
    }

    res.json({ message: 'Actividad completada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al completar actividad' });
  }
};
