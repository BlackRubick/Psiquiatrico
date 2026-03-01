const Medicamento = require('../models/Medicamento');
const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({ include: [Paciente] });
    res.json(medicamentos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener medicamentos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id, { include: [Paciente] });
    if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' });
    res.json(medicamento);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener medicamento' });
  }
};

exports.create = async (req, res) => {
  try {
    const medicamento = await Medicamento.create(req.body);
    res.status(201).json(medicamento);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear medicamento' });
  }
};

exports.update = async (req, res) => {
  try {
    const medicamento = await Medicamento.findByPk(req.params.id);
    if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' });
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
    await medicamento.destroy();
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar medicamento' });
  }
};
