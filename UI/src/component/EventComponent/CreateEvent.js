import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateEvent.css';

function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '100',
    category: 'general',
    isFeatured: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Check authentication and role
    const storedToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!storedToken) {
      setError('Please login first');
      navigate('/login');
      return;
    }

    setToken(storedToken);
    
    if (role !== 'admin') {
      setError('Unauthorized access');
      navigate('/');
      return;
    }

    // If editing an existing event, fetch its data
    if (id) {
      fetchEventData();
    }
  }, [id, navigate]);

  const fetchEventData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      const event = response.data;
      
      // Convert ISO date to YYYY-MM-DD format
      const date = new Date(event.date);
      const formattedDate = date.toISOString().split('T')[0];

      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        time: event.time,
        location: event.location,
        capacity: event.capacity.toString(),
        category: event.category,
        isFeatured: event.isFeatured
      });
    } catch (err) {
      setError('Error fetching event data: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No auth token found');
      }

      // Validate required fields
      const requiredFields = ['title', 'description', 'date', 'time', 'location', 'capacity', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Format the date
      const eventData = {
        ...formData,
        date: new Date(formData.date + 'T' + formData.time).toISOString(),
        capacity: parseInt(formData.capacity)
      };

      if (id) {
        // Update existing event
        await axios.put(
          `http://localhost:5000/api/events/${id}`,
          eventData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new event
        await axios.post(
          'http://localhost:5000/api/events',
          eventData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      navigate('/admin/events');
    } catch (err) {
      console.error('Error saving event:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save event';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h1>{id ? 'Edit Event' : 'Create New Event'}</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="general">General</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="concert">Concert</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Feature this event
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/events')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
