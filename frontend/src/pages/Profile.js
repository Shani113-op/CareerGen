// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import { FaUserCircle, FaEnvelope, FaPhone, FaCrown, FaEdit } from "react-icons/fa";
import PageLoader from "../components/PageLoader";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profileImage: null,
  });
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      setFormData({
        name: storedUser.name,
        email: storedUser.email,
        mobile: storedUser.mobile,
        profileImage: storedUser.profileImage || null,
      });
    }

    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) return <PageLoader />;
  if (!user)
    return (
      <div className="profile-page">
        <p>⚠️ No user data found.</p>
      </div>
    );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files[0]) {
      setFormData({ ...formData, profileImage: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(`${API}/api/user/update-profile`, {
        userId: storedUser.id || storedUser._id,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        profileImage: formData.profileImage,
      });

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsEditing(false);
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Failed to update profile");
    }
  };

  return (
    <div className="profile-page">
      {/* 🎨 Floating Emoji Background */}
      <div className="floating-bg">
        <span>🎓</span>
        <span>🚀</span>
        <span>💡</span>
        <span>📚</span>
        <span>✨</span>
      </div>

      <div className="profile-container animate-fade-in">
        {/* Left section - Avatar & name */}
        <div className="profile-left animate-float">
          <div className="avatar-wrapper">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <FaUserCircle size={120} className="profile-avatar-icon" />
            )}
          </div>
          <h2 className="profile-name">👋 Hi, {user.name}!</h2>
          <p className="profile-tagline">✨ Ready to achieve something great today?</p>
          <p className={`badges ${user.isPremium ? "premiums" : "frees"}`}>
            <FaCrown className="icon" />
            {user.isPremium ? "Premium User 🚀" : "Free User 🎯"}
          </p>
        </div>

        {/* Right section - Info & Edit */}
        <div className="profile-right">
          {!isEditing ? (
            <div className="profile-info">
              <p><FaEnvelope className="icon" /> {user.email}</p>
              <p><FaPhone className="icon" /> {user.mobile}</p>

              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSave}>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile"
              />
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
