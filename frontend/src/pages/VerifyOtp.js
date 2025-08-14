import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/VerifyOtp.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from query param
  const email = new URLSearchParams(location.search).get('email');

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Email verified successfully! Please log in.');
        navigate('/login');
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error. Try again.');
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-box">
        <h2>Email Verification</h2>
        <p>Enter the OTP sent to your email</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
