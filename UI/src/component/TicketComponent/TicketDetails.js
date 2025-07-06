import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetails.css';
import { FaUserAlt } from "react-icons/fa";
import { IoMailOpenOutline } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoPrintSharp } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching ticket details: ' + error.message);
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/tickets/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/my-tickets');
    } catch (error) {
      setError('Error cancelling ticket: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading ticket details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ticket) return <div className="error">Ticket not found</div>;

  return (
    <div className="ticket-details-container" style={{ paddingTop: '80px' }}>
      <div className="ticket-card">
        <div className="ticket-header">
          <h1>{ticket.event.title}</h1>
          <span className={`status ${ticket.status}`}>{ticket.status}</span>
        </div>

        <div className="ticket-info">
          <div className="ticket-info-section">
            <h2>Ticket Information</h2>
            <p className="ticket-number">Ticket #{ticket.ticketNumber}</p>
            <p>
              <FaUserAlt/>
              <span>{ticket.user.name}</span>
            </p>
            <p>
              <IoMailOpenOutline/>
              <span>{ticket.user.email}</span>
            </p>
            <p>
              <FaCalendarAlt/>
              <span>
                Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()}
              </span>
            </p>
            {ticket.price > 0 && (
              <p>
                <i className="fas fa-tag"></i>
                <span>${ticket.price.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="event-details">
            <h2>Event Details</h2>
            <p>
              <FaCalendarAlt/>
              <span>
                {new Date(ticket.event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </p>
            <p>
              <FaClock/>
              <span>{ticket.event.time}</span>
            </p>
            <p>
              <FaLocationDot/>
              <span>{ticket.event.location}</span>
            </p>
          </div>
        </div>

        <div className="ticket-actions">
          <button onClick={() => window.print()} className="print-btn">
            <IoPrintSharp/> Print Ticket
          </button>
          {ticket.status === 'active' && (
            <button onClick={handleCancelTicket} className="cancel-btn">
              <i className="fas fa-times"></i> Cancel Ticket
            </button>
          )}
          <button onClick={() => navigate('/my-tickets')} className="back-btn">
            <IoMdArrowRoundBack/> Back to My Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
