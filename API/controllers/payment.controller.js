const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/event.model');
const Ticket = require('../models/ticket.model');
const mongoose = require('mongoose');

// Initialize Razorpay with test credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_VKFnxqtJ8l0jcz',
  key_secret: 'yT7ayTE3syxlZfahDjfRX1Xy'
});

console.log('Razorpay initialized with test credentials');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new payment order
exports.createOrder = async (req, res) => {
  try {
    console.log('Create order request received:', {
      body: req.body,
      headers: req.headers,
      userId: req.user?._id
    });
    console.log('Create order request:', {
      body: req.body,
      user: req.user?._id
    });
    const { eventId, quantity = 1 } = req.body;
    
    if (!eventId || !isValidObjectId(eventId)) {
      console.log('Invalid or missing eventId:', eventId);
      return res.status(400).json({ message: 'Valid Event ID is required' });
    }

    if (!req.user || !req.user._id) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user._id;

    // Get event details
    console.log('Finding event:', { eventId });
    let event;
    try {
      event = await Event.findById(eventId);
    } catch (err) {
      console.error('Error finding event:', err);
      return res.status(500).json({ message: 'Error finding event' });
    }
    
    if (!event) {
      console.log('Event not found:', { eventId });
      return res.status(404).json({ message: 'Event not found' });
    }
    
    console.log('Event found:', {
      eventId: event._id,
      price: event.price,
      capacity: event.capacity,
      attendees: event.attendees.length
    });

    // Check if event is fully booked
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Check if user is already registered
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Set default price if not specified
    if (!event.price || typeof event.price !== 'number' || event.price <= 0) {
      console.log('Setting default price for event:', eventId);
      event.price = 100; // Default price in INR
      try {
        await Event.findByIdAndUpdate(eventId, { price: 100 });
        console.log('Default price saved successfully');
      } catch (err) {
        console.error('Error saving default price:', err);
        // Continue with default price even if save fails
      }
    }
    
    console.log('Event price:', event.price);

    // Calculate amount (in paise)
    const amount = Math.round(event.price * quantity * 100);
    console.log('Calculated amount:', { amount, price: event.price, quantity });

    // Create Razorpay order
    // Generate a shorter receipt ID
    const shortReceiptId = `r_${Date.now().toString(36)}`;

    const orderData = {
      amount: amount,
      currency: 'INR',
      receipt: shortReceiptId,
      notes: {
        eventId: eventId.toString(),
        userId: userId.toString(),
        quantity: quantity.toString()
      },
      payment_capture: 1
    };

    if (amount < 100) {
      console.log('Amount too low, setting minimum amount');
      orderData.amount = 100; // Minimum amount required by Razorpay
    }

    console.log('Creating Razorpay order:', orderData);

    let order;
    try {
      order = await razorpay.orders.create(orderData);
    } catch (err) {
      console.error('Razorpay order creation error:', err);
      return res.status(500).json({ 
        message: 'Error creating payment order',
        details: err.message
      });
    }

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpay.key_id
    });
  } catch (error) {
    console.error('Payment order creation error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user?._id
    });
    res.status(500).json({
      message: 'Error creating payment order',
      details: error.message
    });
  }
};

// Verify payment and create ticket
exports.verifyPayment = async (req, res) => {
  try {
    console.log('Payment verification request:', req.body);
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId
    } = req.body;
    
    if (!req.user || !req.user._id) {
      console.error('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user._id;
    console.log('Creating ticket for:', { userId, eventId });

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Get payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Generate ticket number
    const lastTicket = await Ticket.findOne({ event: eventId }).sort({ ticketNumber: -1 });
    const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      paymentId: razorpay_payment_id,
      amount: payment.amount / 100, // Convert from paise to rupees
      status: 'confirmed',
      createdAt: new Date(),
      orderId: razorpay_order_id,
      ticketNumber: ticketNumber
    });

    console.log('Saving ticket:', ticket);
    await ticket.save();
    console.log('Ticket saved successfully with number:', ticketNumber);

    // Update event attendees
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } },
      { new: true }
    );
    
    console.log('Updated event attendees:', {
      eventId,
      attendeesCount: updatedEvent.attendees.length
    });

    res.json({
      success: true,
      ticket: {
        id: ticket._id,
        event: eventId,
        amount: ticket.amount,
        status: ticket.status
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};
