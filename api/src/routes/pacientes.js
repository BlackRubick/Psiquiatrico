const express = require('express');
const router = express.Router();
const pacienteCtrl = require('../controllers/pacienteController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Solo admin y healthcare pueden ver y crear pacientes
router.get('/', authMiddleware, requireRole('healthcare'), pacienteCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('healthcare'), pacienteCtrl.getById);
router.post('/', authMiddleware, requireRole('healthcare'), pacienteCtrl.create);
router.put('/:id', authMiddleware, requireRole('healthcare'), pacienteCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), pacienteCtrl.remove);

module.exports = router;
