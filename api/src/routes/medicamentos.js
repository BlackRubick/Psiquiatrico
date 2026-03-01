const express = require('express');
const router = express.Router();
const medicamentoCtrl = require('../controllers/medicamentoController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Admin/healthcare/paciente (paciente solo sus propios medicamentos)
router.get('/', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'patient'), medicamentoCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'patient'), medicamentoCtrl.getById);
router.post('/', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'patient'), medicamentoCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'patient'), medicamentoCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'patient'), medicamentoCtrl.remove);

module.exports = router;
