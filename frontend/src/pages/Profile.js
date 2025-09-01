// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaCrown, FaEdit } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profileImage: null,
  });
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
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

  if (pageLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <p>⚠️ No user data found.</p>
      </div>
    );
  }

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files[0]) {
      // Convert to preview URL
      setFormData({ ...formData, profileImage: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Handle form submit
const handleSave = async (e) => {
  e.preventDefault();
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const res = await axios.post(`${API}/api/user/update-profile`, {
      userId: storedUser.id || storedUser._id,   // ✅ send userId instead of only email
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
    console.error("Profile update error (frontend):", err.response?.data || err.message);
    alert(err.response?.data?.message || "❌ Failed to update profile");
  }
};


  return (
    <div className="profile-page">
      <div className="profile-card relative">
        {/* Edit Icon */}
        <button
          className="absolute top-3 left-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 text-blue-500 hover:text-blue-700 w-auto h-auto inline-flex items-center justify-center"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaEdit size={20} />
        </button>

        {/* Avatar */}
        <div className="avatar-wrapper">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle size={100} className="profile-avatar" />
          )}
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <>
            <h2>{user.name}</h2>
            <div className="profile-info">
              <p><FaEnvelope className="icon" /> {user.email}</p>
              <p><FaPhone className="icon" /> {user.mobile}</p>
              <p className={`badge ${user.isPremium ? 'premium' : 'free'}`}>
                <FaCrown className="icon" />
                {user.isPremium ? 'Premium User' : 'Free User'}
              </p>
            </div>
          </>
        ) : (
          /* Edit Mode */
          <form className="edit-form" onSubmit={handleSave}>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="mb-3"
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile"
              className="w-full border p-2 mb-3 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
