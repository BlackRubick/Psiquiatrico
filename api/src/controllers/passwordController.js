const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Solicitud de recuperación de contraseña
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos
    await user.update({ reset_token: token, reset_token_expiry: expiry });
    // En producción: enviar por correo. Aquí: devolver el token para pruebas
    return res.json({ message: 'Solicitud recibida. Usa el token para restablecer tu contraseña.', token });
  } catch (err) {
    return res.status(500).json({ error: 'Error en la solicitud de recuperación' });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
  try {
    const user = await Usuario.findOne({ where: { reset_token: token } });
    if (!user) return res.status(400).json({ error: 'Token inválido' });
    if (!user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ error: 'Token expirado' });
    }
    const hash = await bcrypt.hash(password, 10);
    await user.update({ password: hash, reset_token: null, reset_token_expiry: null });
    return res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};
