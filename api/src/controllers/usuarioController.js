const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const users = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.create = async (req, res) => {
  try {
    const { username, email, password, nombreCompleto, edad, telefono, tipo_usuario } = req.body;

    // Reglas de permisos:
    // - admin puede crear cualquier tipo
    // - healthcare solo puede crear pacientes
    if (req.user?.tipo_usuario === 'healthcare' && tipo_usuario !== 'paciente') {
      return res.status(403).json({ error: 'Solo puedes crear usuarios tipo paciente' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ username, email, password: hash, nombreCompleto, edad, telefono, tipo_usuario });
    res.status(201).json({ id: user.id, nombre: user.nombreCompleto, tipo_usuario: user.tipo_usuario, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Reglas de permisos:
    // - admin puede actualizar cualquiera
    // - healthcare solo puede actualizar pacientes
    if (req.user?.tipo_usuario === 'healthcare' && user.tipo_usuario !== 'paciente') {
      return res.status(403).json({ error: 'Solo puedes actualizar usuarios tipo paciente' });
    }

    const { nombreCompleto, edad, telefono, tipo_usuario, estado } = req.body;

    // healthcare no puede cambiar tipo_usuario
    const updatePayload = {
      nombreCompleto,
      edad,
      telefono,
      estado,
      ...(req.user?.tipo_usuario === 'admin' ? { tipo_usuario } : {}),
    };

    await user.update(updatePayload);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
