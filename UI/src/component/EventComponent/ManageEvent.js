import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageEvent.css';
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

function ManageEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching events: ' + error.message);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchEvents();
  }, [navigate, fetchEvents]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents(); // Refresh the list
    } catch (error) {
      setError('Error deleting event: ' + error.message);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'upcoming') return new Date(event.date) > new Date() && matchesSearch;
    if (filter === 'past') return new Date(event.date) < new Date() && matchesSearch;
    return matchesSearch;
  });

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-events-container" style={{ paddingTop: '100px' }}>
      <div className="manage-events-header">
        <h1>Manage Events</h1>
        <button onClick={() => navigate('/create-event')} className="create-event-btn">
          <IoMdAdd/> Create New Event
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
      </div>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>{event.capacity}</td>
                <td>{event.attendees?.length || 0}</td>
                <td className="action-buttons">
                  <button
                    onClick={() => handleViewDetails(event._id)}
                    className="view-btn"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(event._id)}
                    className="edit-btn"
                    title="Edit Event"
                  >
                    <FaRegEdit/>
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="delete-btn"
                    title="Delete Event"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEvent;
