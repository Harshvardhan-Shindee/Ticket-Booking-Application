const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
const Event = require('../models/event.model');
const { auth } = require('../middleware/auth'); // ✅ FIXED: Destructured auth correctly

// Register for an event
router.post('/events/:eventId/register', auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingTicket = await Ticket.findOne({ event: eventId, user: userId });
    if (existingTicket) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    const ticketCount = await Ticket.countDocuments({ event: eventId, status: 'active' });
    if (ticketCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const ticketNumber = parseInt(Date.now().toString().slice(-6) + Math.floor(Math.random() * 100));

    const ticket = new Ticket({
      event: eventId,
      user: userId,
      ticketNumber
    });

    await ticket.save();

    event.attendees.push(userId);
    await event.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('event', 'title date time location')
      .populate('user', 'name email');

    res.status(201).json(populatedTicket);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Error registering for event' });
  }
});

// Get user's tickets
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event', 'title date time location')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

// Get ticket by ID
router.get('/tickets/:ticketId', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('event', 'title date time location description')
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Error fetching ticket' });
  }
});

// Cancel ticket
router.post('/tickets/:ticketId/cancel', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this ticket' });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    const event = await Event.findById(ticket.event);
    event.attendees = event.attendees.filter(id => id.toString() !== req.user._id.toString());
    await event.save();

    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    res.status(500).json({ message: 'Error cancelling ticket' });
  }
});

module.exports = router;
