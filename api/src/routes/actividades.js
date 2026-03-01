const express = require('express');
const router = express.Router();
const actividadCtrl = require('../controllers/actividadController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Lectura autenticada (el controlador aplica filtros por rol)
router.get('/', authMiddleware, actividadCtrl.getAll);
router.get('/:id', authMiddleware, actividadCtrl.getById);

// Gestión: admin/healthcare
router.post('/', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare'), actividadCtrl.remove);

// Entrega de actividad por paciente (validación en controlador)
router.patch('/:id', authMiddleware, actividadCtrl.complete);

module.exports = router;
