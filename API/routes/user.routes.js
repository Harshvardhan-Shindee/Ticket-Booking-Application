const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth'); // ✅ Use destructured middleware

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify/:token', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
