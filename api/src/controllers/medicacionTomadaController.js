const MedicacionTomada = require('../models/MedicacionTomada');
const Medicamento = require('../models/Medicamento');
const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const registros = await MedicacionTomada.findAll({ include: [Medicamento, Paciente] });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener registros de medicación tomada' });
  }
};

exports.getById = async (req, res) => {
  try {
    const registro = await MedicacionTomada.findByPk(req.params.id, { include: [Medicamento, Paciente] });
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

exports.create = async (req, res) => {
  try {
    const registro = await MedicacionTomada.create(req.body);
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear registro' });
  }
};

exports.update = async (req, res) => {
  try {
    const registro = await MedicacionTomada.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    await registro.update(req.body);
    res.json({ message: 'Registro actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

exports.remove = async (req, res) => {
  try {
    const registro = await MedicacionTomada.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    await registro.destroy();
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};
