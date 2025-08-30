import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ for navigation
import '../styles/Register.css';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ hook for navigation

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verifyfp-otp`,
        { email, otp }
      );
      setMessage(res.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      setMessage(res.data.message);

      if (res.data.message.toLowerCase().includes("success")) {
        alert("✅ Password updated successfully!");
        navigate("/login"); // ✅ redirect to login
      }

      // Reset state
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Forgot Password</h2>

        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center"
            >
              {loading ? <div className="loader"></div> : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password + Confirm Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border p-2 rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
