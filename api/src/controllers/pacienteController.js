const Paciente = require('../models/Paciente');
const Usuario = require('../models/Usuario');

exports.getAll = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({ include: [{ model: Usuario, attributes: { exclude: ['password'] } }] });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

exports.getById = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id, { include: [{ model: Usuario, attributes: { exclude: ['password'] } }] });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
};

exports.getByUsuarioId = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuario_id);

    if (req.user?.tipo_usuario === 'paciente' && req.user.id !== usuarioId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const paciente = await Paciente.findOne({
      where: { usuario_id: usuarioId },
      include: [{ model: Usuario, attributes: { exclude: ['password'] } }],
    });

    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
};

exports.create = async (req, res) => {
  try {
    // Se espera que el usuario ya exista y se pase usuario_id
    const { usuario_id, ...rest } = req.body;
    const paciente = await Paciente.create({ usuario_id, ...rest });
    res.status(201).json(paciente);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear paciente' });
  }
};

exports.update = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    await paciente.update(req.body);
    res.json({ message: 'Paciente actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
};

exports.remove = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    await paciente.destroy();
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
};
