const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });
    await user.update({ fecha_ultima_sesion: new Date() });
    const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario, nombre: user.nombreCompleto }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, nombreCompleto: user.nombreCompleto, tipo_usuario: user.tipo_usuario, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, nombreCompleto, edad, telefono, tipo_usuario } = req.body;
  try {
    const exists = await Usuario.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ username, email, password: hash, nombreCompleto, edad, telefono, tipo_usuario });
    res.status(201).json({ id: user.id, nombreCompleto: user.nombreCompleto, tipo_usuario: user.tipo_usuario, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Error en registro' });
  }
};
