const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Booking = require('../models/booking.model'); // ✅ Keep only one import
const { auth, verifyAdmin } = require('../middleware/auth');

// ✅ Admin Dashboard Stats
router.get('/dashboard', auth, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'active' });
    const totalBookings = await Booking.countDocuments();

    res.json({
      totalUsers,
      totalEvents,
      activeEvents,
      totalBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET all users (no password included)
router.get('/users', auth, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user role
router.put('/users/:id/role', auth, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// ✅ Delete user
router.delete('/users/:id', auth, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
