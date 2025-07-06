const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { auth } = require('../middleware/auth'); // ✅ FIXED: properly destructured

// Log middleware for debugging
router.use((req, res, next) => {
  console.log('Event route accessed:', req.method, req.path);
  next();
});

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/featured', eventController.getFeaturedEvents);
router.get('/:id', eventController.getEventById);

// Protected routes - require authentication
router.use(auth); // ✅ FIXED: using the function, not the whole object

// Admin routes
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// User routes
router.post('/:id/register', eventController.registerForEvent);
router.get('/user/events', eventController.getUserEvents);

module.exports = router;
