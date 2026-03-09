const express = require('express');
const router = express.Router();
const emocionCtrl = require('../controllers/emocionController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, emocionCtrl.getAll);
router.get('/:id', authMiddleware, emocionCtrl.getById);
router.post('/', authMiddleware, emocionCtrl.create);
router.put('/:id', authMiddleware, emocionCtrl.update);
router.delete('/:id', authMiddleware, emocionCtrl.remove);

module.exports = router;
