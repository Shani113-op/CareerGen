import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/CareerCompare.css';
// import PremiumPopup from '../components/PremiumPlans';
import PageLoader from '../components/PageLoader'; // ✅ Reusable loader

const CareerCompare = () => {
  const [course1, setCourse1] = useState('');
  const [course2, setCourse2] = useState('');
  const [comparison, setComparison] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // ✅ Page loader state
  const [error, setError] = useState('');
  const [, setUser] = useState(null);
  // const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  // ✅ Load updated user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      fetch(`${API}/api/user/${storedUser.email}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error('Failed to fetch user:', err));
    }

    // ✅ Fake page load
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [API]);

  const handleCompare = async () => {
    // if (!user?.isPremium) {
    //   setShowPremiumPopup(true);
    //   return;
    // }

    if (!course1 || !course2) {
      return alert('Please enter both courses to compare.');
    }

    setLoading(true);
    setComparison('');
    setError('');

    try {
      const res = await axios.post(`${API}/api/compare-courses`, {
        course1,
        course2,
      });

      const table = res.data.table?.trim();

      if (!table || !table.includes('|')) {
        setError('⚠️ Invalid comparison data received.');
      } else {
        setComparison(table);
      }
    } catch (err) {
      console.error('Compare Error:', err);
      setError('⚠️ Error fetching comparison. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Page loader
  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="compare-wrapper">
      <h1>⚖️ Compare Two Courses</h1>
      <p>Understand key differences and make the right academic choice.</p>

      <div className="compare-inputs">
        <input
          type="text"
          placeholder="Enter first course (e.g. MBA)"
          value={course1}
          onChange={(e) => setCourse1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter second course (e.g. BBA)"
          value={course2}
          onChange={(e) => setCourse2(e.target.value)}
        />
        <button
          className={`compare-btn ${loading ? 'loading' : ''}`}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner">
              <span className="bar bar1"></span>
              <span className="bar bar2"></span>
              <span className="bar bar3"></span>
            </div>
          ) : (
            '🔍 Compare Now'
          )}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {comparison && (
        <div className="comparison-result markdown-table">
          <ReactMarkdown
            children={comparison}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          />
        </div>
      )}

      {/* {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setShowPremiumPopup(false);
          }}
        />
      )} */}
    </div>
  );
};

export default CareerCompare;