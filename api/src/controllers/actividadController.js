const Actividad = require('../models/Actividad');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');

exports.getAll = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({ include: [Paciente, Profesional] });
    res.json(actividades);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};

exports.getById = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id, { include: [Paciente, Profesional] });
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
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
