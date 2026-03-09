const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.get('/', authMiddleware, requireRole('admin'), usuarioCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('admin'), usuarioCtrl.getById);
router.post('/', authMiddleware, requireRole('admin', 'healthcare'), usuarioCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), usuarioCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin'), usuarioCtrl.remove);

module.exports = router;
