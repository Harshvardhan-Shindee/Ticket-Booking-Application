import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineEventNote } from "react-icons/md";
import { LuSwatchBook } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalUsers: 0,
    totalBookings: 0
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="admin-dashboard" style={{ paddingTop: '100px' }}>
      <h1>Admin Dashboard</h1>
      <div className="stats-container">
        {[
          ['Total Events', stats.totalEvents, ],
          ['Active Events', stats.activeEvents, ],
          ['Total Users', stats.totalUsers, ],
          ['Total Bookings', stats.totalBookings, ]
        ].map(([label, count, icon]) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon"><i className={`fas ${icon}`}></i></div>
            <div className="stat-info">
              <h3>{label}</h3>
              <p>{count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/create-event')} className="action-btn">
          <IoMdAdd/>Create Event
          </button>
          <button onClick={() => navigate('/admin/events')} className="action-btn">
            <MdOutlineEventNote /> Manage Events
          </button>
          <button onClick={() => navigate('/admin/users')} className="action-btn">
            <FaUsers /> Manage Users
          </button>
          <button onClick={() => navigate('/admin/bookings')} className="action-btn">
            <LuSwatchBook /> View Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
