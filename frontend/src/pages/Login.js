import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import '../styles/Register.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = res.data;

      // ✅ Save token, user info and email for booking
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', user.email);

      alert('✅ Login successful!');
      console.log('User:', user);

      if (email === 'arprs9076@gmail.com' && password === 'Admin@123' || email === 'careergenai9@gmail.com' && password === 'Admin@123') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/';
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrorMsg(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your CareerGenAI account</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="sub-btn" disabled={isSubmitting} type="submit">
            {isSubmitting ? <div className="loader"></div> : 'Login'}
          </button>
        </form>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <p className="register-link">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
