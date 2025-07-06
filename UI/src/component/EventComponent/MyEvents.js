import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyEvents.css';
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";

function MyEvents() {
  const [events, setEvents] = useState({ organizing: [], attending: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/user/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching your events');
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading your events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-events-container" style={{ paddingTop: '150px' }}>

      {/* <div className="events-section">
        <h2>Events I'm Organizing</h2>
        {events.organizing.length === 0 ? (
          <p className="no-events">You are not organizing any events yet.</p>
        ) : (
          <div className="events-grid">
            {events.organizing.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  <img src={event.image || 'https://via.placeholder.com/300x200'} alt={event.title} />
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="event-time">{event.time}</p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-capacity">
                    Attendees: {event.attendees.length}/{event.capacity}
                  </p>
                  <div className="event-actions">
                    <Link to={`/event/${event._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    <Link to={`/edit-event/${event._id}`} className="btn btn-secondary">
                      Edit Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div className="events-section">
        <h2>Events I'm Attending</h2>
        {events.attending.length === 0 ? (
          <p className="no-events">You are not registered for any events yet.</p>
        ) : (
          <div className="events-grid">
            {events.attending.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    <FaCalendarAlt/>
                    { new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="event-time"> <FaClock/> {event.time}</p>
                  <p className="event-location"> <FaLocationDot/> {event.location}</p>
                  <p className="event-organizer">
                    Organized by: {event.organizer.name}
                  </p>
                  <Link to={`/event/${event._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;
