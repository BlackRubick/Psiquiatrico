const VigilanciaPeso = require('../models/VigilanciaPeso');
const Paciente = require('../models/Paciente');

const isPacienteRole = (role) => {
  const r = String(role || '').toLowerCase();
  return r === 'paciente' || r === 'patient';
};

exports.getAll = async (req, res) => {
  try {
    const where = {};

    if (req.query.paciente_id) {
      where.paciente_id = Number(req.query.paciente_id);
    }

    // Si es paciente, solo ver sus propios registros
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      where.paciente_id = paciente.id;
    }

    const registros = await VigilanciaPeso.findAll({
      where,
      include: [Paciente],
      order: [['fecha', 'DESC']],
    });

    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros de peso' });
  }
};

exports.getById = async (req, res) => {
  try {
    const registro = await VigilanciaPeso.findByPk(req.params.id, {
      include: [Paciente],
    });

    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });

    // Verificar acceso del paciente
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || registro.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    res.json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
};

exports.create = async (req, res) => {
  try {
    // Si es paciente, usar su propio paciente_id
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      req.body.paciente_id = paciente.id;
    }

    const registro = await VigilanciaPeso.create(req.body);
    res.status(201).json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear registro de peso' });
  }
};

exports.update = async (req, res) => {
  try {
    const registro = await VigilanciaPeso.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });

    // Verificar acceso del paciente
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || registro.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    await registro.update(req.body);
    res.json({ message: 'Registro actualizado', registro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
};

exports.remove = async (req, res) => {
  try {
    const registro = await VigilanciaPeso.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });

    // Verificar acceso del paciente
    if (isPacienteRole(req.user?.tipo_usuario)) {
      const paciente = await Paciente.findOne({ where: { usuario_id: req.user.id } });
      if (!paciente || registro.paciente_id !== paciente.id) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
    }

    await registro.destroy();
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
};
