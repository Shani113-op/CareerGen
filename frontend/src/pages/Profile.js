import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaCrown } from 'react-icons/fa';
import PageLoader from '../components/PageLoader'; // ✅ Reusable loader

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // ✅ New page loader state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

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

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar-wrapper">
          <FaUserCircle size={100} className="profile-avatar" />
        </div>
        <h2>{user.name}</h2>
        <div className="profile-info">
          <p><FaEnvelope className="icon" /> {user.email}</p>
          <p><FaPhone className="icon" /> {user.mobile}</p>
          <p className={`badge ${user.isPremium ? 'premium' : 'free'}`}>
            <FaCrown className="icon" />
            {user.isPremium ? 'Premium User' : 'Free User'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
