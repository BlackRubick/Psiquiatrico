const express = require('express');
const router = express.Router();
const medicamentoCtrl = require('../controllers/medicamentoController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Solo healthcare y admin pueden gestionar medicamentos
router.get('/', authMiddleware, requireRole('healthcare'), medicamentoCtrl.getAll);
router.get('/:id', authMiddleware, requireRole('healthcare'), medicamentoCtrl.getById);
router.post('/', authMiddleware, requireRole('healthcare'), medicamentoCtrl.create);
router.put('/:id', authMiddleware, requireRole('healthcare'), medicamentoCtrl.update);
router.delete('/:id', authMiddleware, requireRole('healthcare'), medicamentoCtrl.remove);

module.exports = router;
