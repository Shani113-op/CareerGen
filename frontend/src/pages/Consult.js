// src/pages/Consult.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Consult.css';
import axios from 'axios';
import PremiumPopup from '../components/PremiumPlans';
import Loader from '../components/PageLoader';
import { useNavigate } from 'react-router-dom';

const Consult = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/consultants`);
        const consultantList = Array.isArray(res.data) ? res.data : res.data.consultants || [];
        setConsultants(consultantList);
      } catch (err) {
        console.error('❌ Failed to fetch consultants:', err.message);
        setConsultants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const isPremiumConsultant = (consultant) => consultant.name === 'Personal Counselor';

  const handleBookClick = (consultant) => {
    if (isPremiumConsultant(consultant) && !user?.isPremium) {
      setShowPremiumPopup(true);
      return;
    }

    // ✅ Navigate to booking page with consultant details
    navigate(`/book-slot/${consultant._id}`, { state: { consultant } });
  };

  if (loading) return <Loader />;

  return (
    <div className="consult-page">
      <div className="consult-header">
        <h1>Meet Your Career Mentors</h1>
        <p>Our hand-picked experts are here to guide you at every stage of your journey.</p>
      </div>

      <div className="consultant-grid">
        {Array.isArray(consultants) && consultants.length > 0 ? (
          consultants.map((c) => (
            <div key={c._id} className="consultant-card">
              <div
                className="badge"
                style={{
                  backgroundColor: isPremiumConsultant(c) ? '#ffd700' : '#e6ffed',
                  color: isPremiumConsultant(c) ? '#000' : '#065f46',
                }}
              >
                {isPremiumConsultant(c) ? '👑 Premium User' : '🟢 Free User'}
              </div>

              <div className="img-container">
                <img
                  src={c.image || '/default-avatar.jpg'}
                  alt={c.name}
                  className="consultant-img"
                />
              </div>

              <h2>{c.name}</h2>
              <h4>{c.role}</h4>
              <p className="expertise">🎯 {c.expertise}</p>
              <p className="bio">{c.bio}</p>

              <div className="consult-footer">
                <span className="experience">🧠 {c.experience}</span>
                <button className="book-btn" onClick={() => handleBookClick(c)}>
                  📅 Book
                </button>
              </div>
            </div>
          ))
        ) : (
            <div className="bg-blue-100 border border-blue-400 text-black-700 px-4 py-3 rounded-md mt-4 text-center">
    😔 Our consultants are currently engaged in ongoing sessions. Please try booking your counseling session a little later. We appreciate your patience.<br /> 
  </div>
        )}
      </div>

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setShowPremiumPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Consult;
