import React, { useEffect, useState } from 'react';
import '../styles/History.css';
import PageLoader from '../components/PageLoader'; // ✅ Reusable loader

const History = () => {
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [receiptStatus, setReceiptStatus] = useState(null);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState(null);
  const [premiumStartDate, setPremiumStartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImg, setModalImg] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.email) {
      fetchReceipt();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReceipt = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user.email}`);
      const data = await res.json();

      if (res.ok) {
        if (data.receiptStatus === 'denied') {
          await fetch(`${process.env.REACT_APP_API_URL}/api/user/delete-receipt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });

          setReceiptUrl(null);
          setReceiptStatus(null);
        } else {
          setReceiptUrl(data.receiptUrl);
          setReceiptStatus(data.receiptStatus);
          setPremiumPlan(data.premiumPlan);
          setPremiumExpiresAt(data.premiumExpiresAt);
          setPremiumStartDate(data.premiumStartDate || data.updatedAt || data.createdAt);
        }
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch receipt. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const parsed = new Date(date);
    if (parsed.toString() === 'Invalid Date') return 'N/A';
    return parsed.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysLeft = () => {
    if (!premiumExpiresAt) return null;
    const now = new Date();
    const end = new Date(premiumExpiresAt);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getPlanLabel = (key) => {
    switch (key) {
      case '1month':
        return '1 Month';
      case '2months':
        return '2 Months';
      case '3months':
        return '3 Months';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <PageLoader />; // ✅ Replaces old <p>Loading...</p>
  }

  return (
    <div className="history-container">
      <h2>🧾 Receipt History</h2>

      {error ? (
        <p className="error">{error}</p>
      ) : receiptUrl ? (
        <div className="receipt-card">
          <img
            src={receiptUrl}
            alt="Your uploaded receipt"
            className="receipt-image"
            onClick={() => setModalImg(receiptUrl)}
          />
          <p>
            Status:{' '}
            <strong className={receiptStatus === 'approved' ? 'status-approved' : 'status-pending'}>
              {receiptStatus === 'approved' ? '✅ Approved' : '⏳ Pending Approval'}
            </strong>
          </p>

          {receiptStatus === 'approved' && (
            <>
              <p>
                Plan: <strong>{getPlanLabel(premiumPlan)}</strong>
              </p>
              <p>
                Start Date: <strong>{formatDate(premiumStartDate)}</strong>
              </p>
              {premiumExpiresAt && (
                <>
                  <p>
                    End Date: <strong>{formatDate(premiumExpiresAt)}</strong>
                  </p>
                  <p>
                    ⏳ Days left:{' '}
                    <strong>{getDaysLeft()} {getDaysLeft() === 1 ? 'day' : 'days'}</strong>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <p>No receipt uploaded yet.</p>
      )}

      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImg} alt="Full receipt" />
            <button className="close-modal" onClick={() => setModalImg(null)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
