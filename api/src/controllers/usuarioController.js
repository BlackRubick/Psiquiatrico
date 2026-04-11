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
    const { username, email, password, nombreCompleto, edad, telefono, tipo_usuario, estado, fecha_nacimiento } = req.body;
    const normalizedType = String(tipo_usuario || '').toLowerCase().trim();
    const normalizedAge = Number.isFinite(Number(edad)) ? Number(edad) : 0;

    if (!username || !email || !password || !nombreCompleto || !normalizedType) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para crear el usuario' });
    }

    if (req.user?.tipo_usuario === 'healthcare' && !['paciente', 'familiar'].includes(normalizedType)) {
      return res.status(403).json({ error: 'Solo puedes crear usuarios tipo paciente o familiar' });
    }

    const exists = await Usuario.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { username },
        ],
      },
    });

    if (exists) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo o nombre de usuario' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({
      username,
      email,
      password: hash,
      nombreCompleto,
      edad: normalizedAge,
      telefono,
      tipo_usuario: normalizedType,
      estado,
      fecha_nacimiento,
    });
    res.status(201).json({ id: user.id, nombre: user.nombreCompleto, tipo_usuario: user.tipo_usuario, email: user.email });
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.errors?.[0]?.message || err.message || 'Error de validación al crear usuario' });
    }
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      if (req.user?.tipo_usuario === 'healthcare' && user.tipo_usuario !== 'paciente' && user.tipo_usuario !== 'familiar') {
      return res.status(403).json({ error: 'Solo puedes actualizar usuarios tipo paciente o familiar' });
    }

    const { nombreCompleto, edad, telefono, tipo_usuario, estado, email, fecha_nacimiento, password } = req.body;

    const updatePayload = {
      nombreCompleto,
      edad,
      telefono,
      estado,
      email,
      fecha_nacimiento,
      ...(req.user?.tipo_usuario === 'admin' ? { tipo_usuario } : {}),
    };

    if (password) {
      updatePayload.password = await bcrypt.hash(password, 10);
    }

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
