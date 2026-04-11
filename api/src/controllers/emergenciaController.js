const Emergencia = require('../models/Emergencia');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');

exports.getAll = async (req, res) => {
  try {
    const emergencias = await Emergencia.findAll({ include: [Paciente, Profesional] });
    res.json(emergencias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener emergencias' });
  }
};

exports.getById = async (req, res) => {
  try {
    const emergencia = await Emergencia.findByPk(req.params.id, { include: [Paciente, Profesional] });
    if (!emergencia) return res.status(404).json({ error: 'Emergencia no encontrada' });
    res.json(emergencia);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener emergencia' });
  }
};

exports.create = async (req, res) => {
  try {
    const emergencia = await Emergencia.create(req.body);

    const patient = await Paciente.findByPk(emergencia.paciente_id, {
      include: [{ model: require('../models/Usuario'), attributes: { exclude: ['password'] } }],
    });

    if (patient?.contacto_emergencia) {
      await emergencia.update({ telefonico_enviado_a: patient.contacto_emergencia });
    }

    res.status(201).json(emergencia);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear emergencia' });
  }
};

exports.update = async (req, res) => {
  try {
    const emergencia = await Emergencia.findByPk(req.params.id);
    if (!emergencia) return res.status(404).json({ error: 'Emergencia no encontrada' });
    await emergencia.update(req.body);
    res.json({ message: 'Emergencia actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar emergencia' });
  }
};

exports.remove = async (req, res) => {
  try {
    const emergencia = await Emergencia.findByPk(req.params.id);
    if (!emergencia) return res.status(404).json({ error: 'Emergencia no encontrada' });
    await emergencia.destroy();
    res.json({ message: 'Emergencia eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar emergencia' });
  }
};
