const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const sendMail = require('../email.controller.js');
const config = require('../config'); // Ensure JWT_SECRET is stored here

const router = express.Router();

// ✅ Route for User Registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user with `verified` set to false
    const user = new User({ email, password, verified: false });
    await user.save();

    // Generate a verification token valid for 24 hours
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '1d' });

    // Send verification email
    sendMail(email, password);

    res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// ✅ Route for Email Verification
router.get('/verify/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Mark the user as verified
    user.verified = true;
    await user.save();

    res.redirect('http://localhost:3000/login'); // Redirect to login page
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ message: 'Verification failed.' });
  }
});

// ✅ Route for User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Login failed.' });
  }
});

module.exports = router;