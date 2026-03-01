const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario');

exports.getAll = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll({ include: [{ model: Usuario, attributes: { exclude: ['password'] } }] });
    res.json(profesionales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
};

exports.getById = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id, { include: [{ model: Usuario, attributes: { exclude: ['password'] } }] });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json(profesional);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener profesional' });
  }
};

exports.getByUsuarioId = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuario_id);

    if (req.user?.tipo_usuario === 'healthcare' && req.user.id !== usuarioId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    let profesional = await Profesional.findOne({
      where: { usuario_id: usuarioId },
      include: [{ model: Usuario, attributes: { exclude: ['password'] } }],
    });

    // Si el usuario logueado es healthcare y aún no tiene perfil profesional,
    // crearlo automáticamente para habilitar asignación de actividades.
    if (!profesional && req.user?.tipo_usuario === 'healthcare' && req.user.id === usuarioId) {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

      profesional = await Profesional.create({
        usuario_id: usuarioId,
        especialidad: 'General',
        cedula: `AUTO-${usuarioId}`,
      });

      const created = await Profesional.findByPk(profesional.id, {
        include: [{ model: Usuario, attributes: { exclude: ['password'] } }],
      });

      return res.status(201).json(created);
    }

    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json(profesional);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener profesional' });
  }
};

exports.create = async (req, res) => {
  try {
    // Se espera que el usuario ya exista y se pase usuario_id
    const { usuario_id, ...rest } = req.body;
    const profesional = await Profesional.create({ usuario_id, ...rest });
    res.status(201).json(profesional);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear profesional' });
  }
};

exports.update = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    await profesional.update(req.body);
    res.json({ message: 'Profesional actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar profesional' });
  }
};

exports.remove = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    await profesional.destroy();
    res.json({ message: 'Profesional eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar profesional' });
  }
};
