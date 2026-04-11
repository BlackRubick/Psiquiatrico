const express = require('express');
const router = express.Router();
const familiarCtrl = require('../controllers/familiarController');
const { authMiddleware, requireRole } = require('../middlewares/auth');

router.get('/mi-paciente', authMiddleware, requireRole('familiar'), familiarCtrl.getMyPatient);
router.get('/dashboard', authMiddleware, requireRole('familiar'), familiarCtrl.getDashboard);
router.get('/asignaciones', authMiddleware, requireRole('admin', 'healthcare'), familiarCtrl.getAssignments);
router.post('/asignar', authMiddleware, requireRole('admin', 'healthcare'), familiarCtrl.assignPatient);
router.delete('/asignar/:id', authMiddleware, requireRole('admin', 'healthcare'), familiarCtrl.removeAssignment);

module.exports = router;
