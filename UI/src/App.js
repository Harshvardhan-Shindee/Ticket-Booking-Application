
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './component/HomeComponent/Home';
import Login from './component/LoginComponent/Login';
import Register from './component/RegisterComponent/Register';
import EventList from './component/EventComponent/EventList';
import EventDetails from './component/EventComponent/EventDetails';
import CreateEvent from './component/EventComponent/CreateEvent';
import ManageEvent from './component/EventComponent/ManageEvent';
import MyEvents from './component/EventComponent/MyEvents';
import TicketList from './component/TicketComponent/TicketList';
import TicketDetails from './component/TicketComponent/TicketDetails';
import About from './component/AboutComponent/About';
import Nav from './component/NavComponent/Nav';
import AdminDashboard from './component/AdminComponent/AdminDashboard';
import ManageUsers from './component/AdminComponent/ManageUsers';
import VerifyEmail from './component/AuthComponent/VerifyEmail';
import Footer from './component/FooterComponent/Footer';
import './App.css';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  console.log(token);
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token || role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Set up axios defaults
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add axios response interceptor for 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <div className="App">
      <Nav/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
        <Route path="/ticket/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><ManageEvent /></AdminRoute>} />
        <Route path="/create-event" element={<AdminRoute><CreateEvent /></AdminRoute>} />
        <Route path="/edit-event/:id" element={<AdminRoute><CreateEvent /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
