const DashboardMensual = require('../models/DashboardMensual');
const Paciente = require('../models/Paciente');

exports.getAll = async (req, res) => {
  try {
    const dashboards = await DashboardMensual.findAll({ include: [Paciente] });
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener dashboards' });
  }
};

exports.getById = async (req, res) => {
  try {
    const dashboard = await DashboardMensual.findByPk(req.params.id, { include: [Paciente] });
    if (!dashboard) return res.status(404).json({ error: 'Dashboard no encontrado' });
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};

exports.create = async (req, res) => {
  try {
    const dashboard = await DashboardMensual.create(req.body);
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear dashboard' });
  }
};

exports.update = async (req, res) => {
  try {
    const dashboard = await DashboardMensual.findByPk(req.params.id);
    if (!dashboard) return res.status(404).json({ error: 'Dashboard no encontrado' });
    await dashboard.update(req.body);
    res.json({ message: 'Dashboard actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar dashboard' });
  }
};

exports.remove = async (req, res) => {
  try {
    const dashboard = await DashboardMensual.findByPk(req.params.id);
    if (!dashboard) return res.status(404).json({ error: 'Dashboard no encontrado' });
    await dashboard.destroy();
    res.json({ message: 'Dashboard eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar dashboard' });
  }
};
