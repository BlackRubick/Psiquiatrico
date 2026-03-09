const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, dashboardCtrl.getAll);
router.get('/:id', authMiddleware, dashboardCtrl.getById);
router.post('/', authMiddleware, dashboardCtrl.create);
router.put('/:id', authMiddleware, dashboardCtrl.update);
router.delete('/:id', authMiddleware, dashboardCtrl.remove);

module.exports = router;
