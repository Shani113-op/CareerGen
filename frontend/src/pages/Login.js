import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
import "../styles/Register.css"; // reuse common styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ , setShowPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email: email.trim(),
        password: password.trim(),
      });

      const { token, user, role } = res.data;

      // ✅ Save token + user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('role', role);

      console.log('User:', user, 'Role:', role);

      // ✅ Show popup
      setShowPopup(true);

      // ✅ Redirect after 1 sec
      setTimeout(() => {
        if (
          (email === 'arprs9076@gmail.com' && password === 'Admin@123') ||
          (email === 'careergenai9@gmail.com' && password === 'Admin@123')
        ) {
          window.location.href = '/admin-dashboard';
        } else if (role === 'consultant') {
          window.location.href = '/consultant-dashboard';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrorMsg(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
    <div className="login-container">
      {/* Left Side */}
      <div className="login-info">
        <h1>Welcome Back 👋</h1>
        <p>
          Login to continue your journey with <b>CareerGenAI</b>.
          Access your dashboard and explore new opportunities.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="login illustration"
          className="login-illustration"
        />
      </div>

      {/* Right Side - Form */}
      <div className="login-box">
        <h2>Sign In</h2>
        <p className="subtitle">Access your CareerGenAI account</p>

        <form onSubmit={handleLogin}>
          <div className="form-grid">
            <div style={{ gridColumn: "span 2" }}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="sub-btn" disabled={isSubmitting} type="submit">
            {isSubmitting ? <div className="loader"></div> : "Login"}
          </button>

        </form>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <p className="register-link">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
        <p className="forgot-link">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
