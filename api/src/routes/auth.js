const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/authController');
const { resetPasswordRequest, resetPassword } = require('../controllers/passwordController');


router.post('/login', login);
router.post('/register', register);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);

module.exports = router;
