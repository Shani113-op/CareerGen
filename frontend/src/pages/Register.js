import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!acceptedPolicy) {
      setErrorMsg(
        <>
          Please accept our{" "}
          <a
            href="https://drive.google.com/file/d/1t0TgLDb_IUDdGhKndtAkM60IjokU_Jw8/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>{" "}
          and Terms & Conditions.
        </>
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, isPremium: false }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ OTP sent to your email!");
        navigate(`/verify-otp?email=${formData.email}`);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-wrapper">
    <div className="register-container">
      {/* Left Side */}
      <div className="register-info">
        <h1>Welcome to CareerGenAI 🚀</h1>
        <p>
          Create your account and start your journey. Unlock career growth
          with AI-driven guidance!
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="illustration"
          className="register-illustration"
        />
      </div>

      {/* Right Side - Form */}
      <div className="register-box">
        <h2>Create an Account</h2>
        <p className="subtitle">Join CareerGenAI today</p>

        <form onSubmit={handleRegister}>
          <div className="form-grid">
            {/* Full Name */}
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                pattern="\d{10}"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="privacy-check">
            <input
              type="checkbox"
              id="privacyPolicy"
              checked={acceptedPolicy}
              onChange={(e) => setAcceptedPolicy(e.target.checked)}
            />
            <label htmlFor="privacyPolicy">
              I agree to the Terms & Conditions and Privacy Policy
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              className="error-msg"
              style={{ color: "blue", marginBottom: "10px" }}
            >
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button className="sub-btn" disabled={isSubmitting}>
            {isSubmitting ? <div className="loader"></div> : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Register;
