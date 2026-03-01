const express = require('express');
const router = express.Router();
const pacienteCtrl = require('../controllers/pacienteController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Admin puede todo; healthcare puede gestionar pacientes
router.get('/', authMiddleware, requireRole('admin', 'healthcare'), pacienteCtrl.getAll);
router.get('/usuario/:usuario_id', authMiddleware, requireRole('admin', 'healthcare', 'paciente'), pacienteCtrl.getByUsuarioId);
router.get('/:id', authMiddleware, requireRole('admin', 'healthcare'), pacienteCtrl.getById);
router.post('/', authMiddleware, requireRole('admin', 'healthcare'), pacienteCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), pacienteCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare'), pacienteCtrl.remove);

module.exports = router;
