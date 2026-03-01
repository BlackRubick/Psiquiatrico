const express = require('express');
const router = express.Router();
const actividadCalmaCtrl = require('../controllers/actividadCalmaController');
const { authMiddleware } = require('../middlewares/auth');

// Healthcare/admin pueden ver y editar actividades de calma
router.get('/', authMiddleware, actividadCalmaCtrl.getAll);
router.get('/:id', authMiddleware, actividadCalmaCtrl.getById);
router.post('/', authMiddleware, actividadCalmaCtrl.create);
router.put('/:id', authMiddleware, actividadCalmaCtrl.update);
router.delete('/:id', authMiddleware, actividadCalmaCtrl.remove);

module.exports = router;
