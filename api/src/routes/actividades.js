const express = require('express');
const router = express.Router();
const actividadCtrl = require('../controllers/actividadController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Lectura: admin/healthcare/paciente (paciente solo las suyas)
router.get('/', authMiddleware, requireRole('admin', 'healthcare', 'paciente'), actividadCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('admin', 'healthcare', 'paciente'), actividadCtrl.getById);

// Gestión: admin/healthcare
router.post('/', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.remove);

// Entrega de actividad por paciente
router.patch('/:id', authMiddleware, requireRole('paciente'), actividadCtrl.complete);

module.exports = router;
