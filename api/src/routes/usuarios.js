const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Solo admin puede ver, crear, editar y eliminar usuarios
router.get('/', authMiddleware, requireRole('admin'), usuarioCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('admin'), usuarioCtrl.getById);
router.post('/', authMiddleware, requireRole('admin'), usuarioCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin'), usuarioCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), usuarioCtrl.remove);

module.exports = router;
