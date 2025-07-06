const Event = require('../models/event.model');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured events
exports.getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isFeatured: true })
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .limit(6);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    console.log('Create event request received');
    console.log('User:', req.user);
    console.log('Request body:', req.body);

    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      console.log('User is not admin, role:', req.user?.role);
      return res.status(403).json({ message: 'Only admins can create events' });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'capacity', 'category'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Create new event with organizer
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      time: req.body.time,
      location: req.body.location,
      capacity: parseInt(req.body.capacity),
      category: req.body.category,
      organizer: req.user._id,
      isFeatured: req.body.isFeatured || false
    });

    console.log('Created event object:', event);

    const newEvent = await event.save();
    console.log('Event saved successfully:', newEvent);
    
    // Populate organizer details
    await newEvent.populate('organizer', 'name email');
    console.log('Event populated with organizer:', newEvent);
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Event creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin or event organizer can update
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    await updatedEvent.populate('organizer', 'name email');
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin or event organizer can delete
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    
    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's events
exports.getUserEvents = async (req, res) => {
  try {
    const [organizingEvents, attendingEvents] = await Promise.all([
      // Get events user is organizing
      Event.find({ organizer: req.user._id })
        .populate('organizer', 'name email')
        .sort({ date: 1 }),
      
      // Get events user is attending
      Event.find({ 
        attendees: req.user._id,
        organizer: { $ne: req.user._id } // Exclude events user is organizing
      })
        .populate('organizer', 'name email')
        .sort({ date: 1 })
    ]);
    
    res.json({
      organizing: organizingEvents,
      attending: attendingEvents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
