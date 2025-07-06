import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../CommonComponent/Alert';
import './EventDetails.css';
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setIsRegistered(response.data.attendees.includes(userId));
        setIsOrganizer(response.data.organizer._id === userId);
        setLoading(false);
      } catch (err) {
        setAlert({ message: 'Error fetching event details', type: 'error' });
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, userId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleRegister = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      setAlert({
        message: 'Creating payment order...',
        type: 'info'
      });

      console.log('Starting payment process for event:', id);

      // Create payment order
      const orderResponse = await axios.post(
        'http://localhost:5000/api/payments/create-order',
        { 
          eventId: id,
          quantity: 1
        }
      );

      console.log('Payment order response:', orderResponse.data);

      if (!orderResponse.data.orderId) {
        throw new Error('Invalid response from server: missing order ID');
      }

      console.log('Order created:', orderResponse.data);
      const { orderId, amount, currency, keyId } = orderResponse.data;

      if (!keyId || !amount || !currency || !orderId) {
        console.error('Missing required payment details:', { keyId, amount, currency, orderId });
        throw new Error('Invalid payment configuration');
      }

      // Initialize Razorpay payment
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Quick Tickets',
        description: `Ticket for ${event.title}`,
        order_id: orderId,
        image: event.image || 'https://your-logo-url.png',
        prefill: {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail')
        },
        theme: {
          color: '#b145af'
        },
        modal: {
          confirm_close: true,
          escape: false,
          animation: true
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        notes: {
          eventName: event.title,
          userName: localStorage.getItem('userName')
        },
        handler: async (response) => {
          try {
            console.log('Payment successful, verifying...', response);
            
            // Verify payment
            const verifyResponse = await axios.post(
              'http://localhost:5000/api/payments/verify',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                eventId: id
              }
            );

            console.log('Verification response:', verifyResponse.data);

            if (verifyResponse.data.success) {
              setAlert({
                message: 'Payment successful! Ticket created.',
                type: 'success'
              });
              
              // Redirect to tickets page
              setTimeout(() => {
                navigate('/my-tickets');
              }, 2000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setAlert({
              message: 'Payment verification failed. Please contact support.',
              type: 'error'
            });
          }
        },
        prefill: {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail')
        },
        theme: {
          color: '#dc8cdb'
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        setAlert({
          message: `Payment failed: ${response.error.description}`,
          type: 'error'
        });
      });

      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to initiate payment. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to register for this event.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Event not found. Please refresh the page.';
      }
      
      setAlert({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/events');
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || 'Error deleting event',
        type: 'error'
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }



  if (!event) {
    return <div className="error">Event not found</div>;
  }

  const isFullyBooked = event.attendees.length >= event.capacity;

  return (
    <div className="event-details-container" style={{ paddingTop: '0px' }}>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="event-details">
        <div className="event-header">
          <div className="event-image">
            <img src="/assets/img/banner_bg.jpg" alt="Banner" />
          </div>
          <h1>{event.title}</h1>
          {isFullyBooked && <div className="fully-booked">Event Fully Booked</div>}
        </div>

        <div className="event-price">
          <h2>Price: {formatPrice(event.price)}</h2>
        </div>
        <div className="event-info-grid">
          <div className="event-info-item">
            <div>
              <h3>Date & Time</h3>
              <p>{new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p>{event.time}</p>
            </div>
          </div>

          <div className="event-info-item">
            <div>
              <h3>Location</h3>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="event-info-item">  
            <div>
              <h3>Capacity</h3>
              <p>{event.attendees.length} / {event.capacity} registered</p>
            </div>
          </div>

          <div className="event-info-item">
            <div>
              <h3>Category</h3>
              <p>{event.category}</p>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <div className="event-organizer">
          <h2>Organized by</h2>
          <p>{event.organizer.name}</p>
        </div>

        <div className="event-actions">
          {isOrganizer ? (
            <>
              <button onClick={() => navigate(`/edit-event/${id}`)} className="edit-btn">
                <FaRegEdit/> Edit Event
              </button>
              <button onClick={handleDelete} className="delete-btn">
                <MdDeleteForever /> Delete Event
              </button>
            </>
          ) : (
            <button
              onClick={handleRegister}
              className={`register-btn ${isRegistered || isFullyBooked ? 'disabled' : ''}`}
              disabled={isRegistered || isFullyBooked}
            >
              {isRegistered ? 'Already Registered' : isFullyBooked ? 'Event Full' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
