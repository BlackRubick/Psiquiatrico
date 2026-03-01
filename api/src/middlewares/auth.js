const jwt = require('jsonwebtoken');

function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  if (value === 'patient') return 'paciente';
  if (value === 'doctor') return 'healthcare';
  return value;
}

function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.tipo_usuario);
    const allowedRoles = roles.map(normalizeRole);

    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
