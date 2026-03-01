const EmocionDiaria = require('../models/EmocionDiaria');
const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const emociones = await EmocionDiaria.findAll({ include: [Paciente] });
    res.json(emociones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener emociones' });
  }
};

exports.getById = async (req, res) => {
  try {
    const emocion = await EmocionDiaria.findByPk(req.params.id, { include: [Paciente] });
    if (!emocion) return res.status(404).json({ error: 'Emoción no encontrada' });
    res.json(emocion);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener emoción' });
  }
};

exports.create = async (req, res) => {
  try {
    const emocion = await EmocionDiaria.create(req.body);
    res.status(201).json(emocion);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear emoción' });
  }
};

exports.update = async (req, res) => {
  try {
    const emocion = await EmocionDiaria.findByPk(req.params.id);
    if (!emocion) return res.status(404).json({ error: 'Emoción no encontrada' });
    await emocion.update(req.body);
    res.json({ message: 'Emoción actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar emoción' });
  }
};

exports.remove = async (req, res) => {
  try {
    const emocion = await EmocionDiaria.findByPk(req.params.id);
    if (!emocion) return res.status(404).json({ error: 'Emoción no encontrada' });
    await emocion.destroy();
    res.json({ message: 'Emoción eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar emoción' });
  }
};
