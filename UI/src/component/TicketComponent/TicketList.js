import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TicketList.css';
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching tickets: ' + error.message);
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/tickets/${ticketId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickets(); // Refresh the list
    } catch (error) {
      setError('Error cancelling ticket: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading tickets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ticket-list-container" style={{ paddingTop: '80px' }}>
      
      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't registered for any events yet.</p>
          <Link to="/events" className="browse-events-btn">Browse Events</Link>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event.title}</h3>
                <span className={`status ${ticket.status}`}>{ticket.status}</span>
              </div>
              
              <div className="ticket-details">
                <p>
                  <FaCalendarAlt/>
                  {new Date(ticket.event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p>
                  <FaClock/>
                  {ticket.event.time}
                </p>
                <p>
                  <FaLocationDot/>
                  {ticket.event.location}
                </p>
                <p>
                  <i className="fas fa-ticket-alt"></i>
                  Ticket #: {ticket.ticketNumber}
                </p>
              </div>

              <div className="ticket-actions">
                <Link to={`/ticket/${ticket._id}`} className="view-btn">
                  View Details
                </Link>
                {ticket.status === 'active' && (
                  <button
                    onClick={() => handleCancelTicket(ticket._id)}
                    className="cancel-btn"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
