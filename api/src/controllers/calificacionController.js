const Calificacion = require('../models/Calificacion');
const Actividad = require('../models/Actividad');
const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const calificaciones = await Calificacion.findAll({ include: [Actividad, Paciente] });
    res.json(calificaciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

exports.getById = async (req, res) => {
  try {
    const calificacion = await Calificacion.findByPk(req.params.id, { include: [Actividad, Paciente] });
    if (!calificacion) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json(calificacion);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener calificación' });
  }
};

exports.create = async (req, res) => {
  try {
    const calificacion = await Calificacion.create(req.body);
    res.status(201).json(calificacion);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear calificación' });
  }
};

exports.update = async (req, res) => {
  try {
    const calificacion = await Calificacion.findByPk(req.params.id);
    if (!calificacion) return res.status(404).json({ error: 'Calificación no encontrada' });
    await calificacion.update(req.body);
    res.json({ message: 'Calificación actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar calificación' });
  }
};

exports.remove = async (req, res) => {
  try {
    const calificacion = await Calificacion.findByPk(req.params.id);
    if (!calificacion) return res.status(404).json({ error: 'Calificación no encontrada' });
    await calificacion.destroy();
    res.json({ message: 'Calificación eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar calificación' });
  }
};
