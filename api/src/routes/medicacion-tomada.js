const express = require('express');
const router = express.Router();
const medicacionCtrl = require('../controllers/medicacionTomadaController');
const { authMiddleware } = require('../middlewares/auth');

// Paciente puede crear, healthcare/admin pueden ver y editar
router.get('/', authMiddleware, medicacionCtrl.getAll);
router.get('/:id', authMiddleware, medicacionCtrl.getById);
router.post('/', authMiddleware, medicacionCtrl.create);
router.put('/:id', authMiddleware, medicacionCtrl.update);
router.delete('/:id', authMiddleware, medicacionCtrl.remove);

module.exports = router;
