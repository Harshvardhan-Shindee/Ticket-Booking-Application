const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(auth);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;