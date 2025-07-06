import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';

function VerifyPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await axios.get(`/api/auth/verify/${token}`);
        setStatus('Account verified successfully! You can now log in.');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('Verification failed. The token may be invalid or expired.');
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/verify/:token" element={<VerifyPage />} />
    </Routes>
  );
}

export default App;