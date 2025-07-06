import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResendVerification = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/users/resend-verification', { email });
      alert('Verification email has been resent. Please check your inbox.');
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/events');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData);
      
      // Make login request
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      console.log('Login response:', response.data);
      
      // Extract data from response
      const { token, userId, role, name, email } = response.data;
      
      // Store auth data in localStorage
      localStorage.setItem('token', token); 
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role || 'user');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      // Set default authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Stored credentials:', {
        token,
        userId,
        role: role || 'user'
      });
      
      // Clear any existing errors
      setError('');
      
      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle error messages from the backend
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      
      // Special handling for unverified users
      if (errorMessage.includes('verify your email')) {
        setError(
          <div>
            {errorMessage}<br/>
            <small>Please check your email for the verification link. 
              <button 
                onClick={() => handleResendVerification(formData.email)}
                className="btn btn-link p-0 ml-1"
              >
                Resend verification email
              </button>
            </small>
          </div>
        );
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
