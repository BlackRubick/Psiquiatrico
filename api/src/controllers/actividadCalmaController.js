const ActividadCalma = require('../models/ActividadCalma');

exports.getAll = async (req, res) => {
  try {
    const actividades = await ActividadCalma.findAll();
    res.json(actividades);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividades de calma' });
  }
};

exports.getById = async (req, res) => {
  try {
    const actividad = await ActividadCalma.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad de calma no encontrada' });
    res.json(actividad);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividad de calma' });
  }
};

exports.create = async (req, res) => {
  try {
    const actividad = await ActividadCalma.create(req.body);
    res.status(201).json(actividad);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear actividad de calma' });
  }
};

exports.update = async (req, res) => {
  try {
    const actividad = await ActividadCalma.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad de calma no encontrada' });
    await actividad.update(req.body);
    res.json({ message: 'Actividad de calma actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar actividad de calma' });
  }
};

exports.remove = async (req, res) => {
  try {
    const actividad = await ActividadCalma.findByPk(req.params.id);
    if (!actividad) return res.status(404).json({ error: 'Actividad de calma no encontrada' });
    await actividad.destroy();
    res.json({ message: 'Actividad de calma eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar actividad de calma' });
  }
};
