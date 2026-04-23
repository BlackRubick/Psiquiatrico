const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Configuración de nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Debes poner esto en tu .env
    pass: process.env.GMAIL_PASS  // Contraseña de aplicación
  }
});

// Solicitud de recuperación: genera código y lo envía por email
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutos
    await user.update({ reset_code: code, reset_code_expiry: expiry });
    // Enviar email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Código de recuperación de contraseña',
      text: `Tu código de recuperación es: ${code}. Expira en 10 minutos.`
    });
    return res.json({ message: 'Código enviado a tu correo.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error en la solicitud de recuperación' });
  }
};

// Validar código
exports.validateResetCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email y código requeridos' });
  try {
    const user = await Usuario.findOne({ where: { email, reset_code: code } });
    if (!user) return res.status(400).json({ error: 'Código inválido' });
    if (!user.reset_code_expiry || new Date(user.reset_code_expiry) < new Date()) {
      return res.status(400).json({ error: 'Código expirado' });
    }
    return res.json({ message: 'Código válido' });
  } catch (err) {
    return res.status(500).json({ error: 'Error validando código' });
  }
};

// Restablecer contraseña usando código
exports.resetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) return res.status(400).json({ error: 'Datos requeridos' });
  try {
    const user = await Usuario.findOne({ where: { email, reset_code: code } });
    if (!user) return res.status(400).json({ error: 'Código inválido' });
    if (!user.reset_code_expiry || new Date(user.reset_code_expiry) < new Date()) {
      return res.status(400).json({ error: 'Código expirado' });
    }
    const hash = await bcrypt.hash(password, 10);
    await user.update({ password: hash, reset_code: null, reset_code_expiry: null });
    return res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};
