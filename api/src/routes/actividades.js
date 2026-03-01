const express = require('express');
const router = express.Router();
const actividadCtrl = require('../controllers/actividadController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Solo healthcare y admin pueden gestionar actividades
router.get('/', authMiddleware, requireRole('healthcare'), actividadCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('healthcare'), actividadCtrl.getById);
router.post('/', authMiddleware, requireRole('healthcare'), actividadCtrl.create);
router.put('/:id', authMiddleware, requireRole('healthcare'), actividadCtrl.update);
router.delete('/:id', authMiddleware, requireRole('healthcare'), actividadCtrl.remove);

module.exports = router;
