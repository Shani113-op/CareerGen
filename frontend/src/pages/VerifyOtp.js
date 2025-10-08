// src/pages/VerifyOtp.js
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get("email");

  const verifyOtp = async (enteredOtp) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: enteredOtp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Email verified successfully! Please log in.");
        navigate("/login");
      } else {
        alert(data.error || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus(); // reset to first box
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error. Try again.");
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }

      // If all digits are filled → auto verify
      if (newOtp.every((digit) => digit !== "")) {
        const enteredOtp = newOtp.join("");
        verifyOtp(enteredOtp);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-box">
        <h2>Email Verification</h2>
        <p>Enter the 6-digit OTP sent to your email</p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-box"
              required
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
