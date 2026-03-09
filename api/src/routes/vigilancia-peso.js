const express = require('express');
const router = express.Router();
const vigilanciaPesoCtrl = require('../controllers/vigilanciaPesoController');
const { authMiddleware } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.get('/', authMiddleware, vigilanciaPesoCtrl.getAll);
router.get('/:id', authMiddleware, vigilanciaPesoCtrl.getById);
router.post('/', authMiddleware, vigilanciaPesoCtrl.create);
router.put('/:id', authMiddleware, vigilanciaPesoCtrl.update);
router.delete('/:id', authMiddleware, vigilanciaPesoCtrl.remove);

module.exports = router;
