import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';
import { FaSpinner } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className={`verify-email-box ${status}`}>
        <div className="verify-email-icon">
          {status === 'verifying' && <FaSpinner/>}
          {status === 'success' && <FaCheckCircle/>}
          {status === 'error' && <FaTimesCircle/>}
        </div>
        <h2>{message}</h2>
        {status === 'success' && (
          <p>Redirecting to login page...</p>
        )}
        {status === 'error' && (
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
