import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Nav.css';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsLoggedIn(false);
      setUserRole(null);
    }

    updateNavigation();
  }, [location.pathname]);

  const updateNavigation = useCallback(() => {
    let navItems = [];
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) {
      navItems = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/about', label: 'About' }
      ];
      return setMenuItems(navItems);
    }

    if (role === 'admin') {
      navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/users', label: 'Manage Users' },
        { path: '/admin/events', label: 'Manage Events' },
        { path: '/create-event', label: 'Create Event' }
      ];
    } else {
      navItems = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/my-events', label: 'My Events' },
        { path: '/my-tickets', label: 'My Tickets' },
        { path: '/about', label: 'About' }
      ];
    }
    setMenuItems(navItems);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setUserRole(null);
    updateNavigation();
    navigate('/');
  };

  return (
    <div className="header-area">
      <nav className="main-nav">
        <div className="nav-left">
          <Link to={userRole === 'admin' ? '/admin/dashboard' : '/'} className="logo">
            Quick<em>Tickets</em>
          </Link>
        </div>

        <div className="nav-center">
          <ul className="nav">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
