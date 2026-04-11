const express = require('express');
const router = express.Router();
const emergenciaCtrl = require('../controllers/emergenciaController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.get('/', authMiddleware, requireRole('admin', 'healthcare'), emergenciaCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('admin', 'healthcare', 'familiar'), emergenciaCtrl.getById);
router.post('/', authMiddleware, requireRole('admin', 'healthcare', 'paciente', 'familiar'), emergenciaCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), emergenciaCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare'), emergenciaCtrl.remove);

module.exports = router;
