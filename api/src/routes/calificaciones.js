const express = require('express');
const router = express.Router();
const calificacionCtrl = require('../controllers/calificacionController');
const { authMiddleware } = require('../middlewares/auth');

// Paciente puede crear, healthcare/admin pueden ver y editar
router.get('/', authMiddleware, calificacionCtrl.getAll);
router.get('/:id', authMiddleware, calificacionCtrl.getById);
router.post('/', authMiddleware, calificacionCtrl.create);
router.put('/:id', authMiddleware, calificacionCtrl.update);
router.delete('/:id', authMiddleware, calificacionCtrl.remove);

module.exports = router;
