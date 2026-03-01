const express = require('express');
const router = express.Router();
const emergenciaCtrl = require('../controllers/emergenciaController');
const { authMiddleware } = require('../middlewares/auth');

// Paciente puede crear, healthcare/admin pueden ver y editar
router.get('/', authMiddleware, emergenciaCtrl.getAll);
router.get('/:id', authMiddleware, emergenciaCtrl.getById);
router.post('/', authMiddleware, emergenciaCtrl.create);
router.put('/:id', authMiddleware, emergenciaCtrl.update);
router.delete('/:id', authMiddleware, emergenciaCtrl.remove);

module.exports = router;
