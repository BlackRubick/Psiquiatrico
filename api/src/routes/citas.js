const express = require('express');
const router = express.Router();
const citaCtrl = require('../controllers/citaController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.get('/', authMiddleware, citaCtrl.getAll);
router.get('/:id', authMiddleware, citaCtrl.getById);

// Solo admin y healthcare pueden crear, actualizar y eliminar citas
router.post('/', authMiddleware, requireRole('admin', 'healthcare'), citaCtrl.create);
router.put('/:id', authMiddleware, requireRole('admin', 'healthcare'), citaCtrl.update);
router.delete('/:id', authMiddleware, requireRole('admin', 'healthcare'), citaCtrl.remove);

module.exports = router;
