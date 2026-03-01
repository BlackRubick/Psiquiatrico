const express = require('express');
const router = express.Router();
const profesionalCtrl = require('../controllers/profesionalController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Solo admin puede ver, crear, editar y eliminar profesionales
router.get('/', authMiddleware, requireRole('admin'), profesionalCtrl.getAll);
router.get('/usuario/:usuario_id', authMiddleware, requireRole('admin', 'healthcare'), profesionalCtrl.getByUsuarioId);
router.get('/:id', authMiddleware, requireRole('admin'), profesionalCtrl.getById);
router.post('/', authMiddleware, requireRole('admin'), profesionalCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin'), profesionalCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), profesionalCtrl.remove);

module.exports = router;
