import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [usersWithReceipts, setUsersWithReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState(null);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');


  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.email === 'arprs9076@gmail.com' || user?.email === 'careergenai9@gmail.com') {
      fetchUsersWithReceipts();
    } else {
      navigate('/');
    }
  }, [navigate, user?.email]);


  const fetchUsersWithReceipts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/receipts`);
      const data = await res.json();
      setUsersWithReceipts(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('👋 Admin logged out');
    navigate('/login');
  };

  const handleApiKeySubmit = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/save-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput })
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ API key saved successfully');
        setApiKeyModal(false);
        setApiKeyInput('');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error saving API key:', err);
      alert('Error saving API key');
    }
  };


  const handleApprove = async (email, plan) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Approved ${email} as premium`);
        fetchUsersWithReceipts();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Error approving user');
    }
  };

  const handleDeny = async (email) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`🚫 Denied premium access for ${email}`);
        fetchUsersWithReceipts();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Deny error:', err);
      alert('Error denying user');
    }
  };

  const pendingReceipts = usersWithReceipts.filter(u => u.receiptStatus === 'pending');
  const approvedReceipts = usersWithReceipts.filter(u => u.receiptStatus === 'approved');

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>👑 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <button className="apikey-btn" onClick={() => setApiKeyModal(true)}>API Key</button>
          {/* 🔻 Removed Register Consultant Button */}
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-section">
          <h2>📥 Pending Receipts</h2>
          {loading ? (
            <p>Loading...</p>
          ) : pendingReceipts.length === 0 ? (
            <p>No pending receipts found.</p>
          ) : (
            <div className="receipt-grid">
              {pendingReceipts.map((u) => (
                <div key={u._id} className="receipt-card pending">
                  <img src={u.receiptUrl} alt="Receipt" className="receipt-img" onClick={() => setModalImg(u.receiptUrl)} />
                  <p><strong>{u.name}</strong></p>
                  <p>{u.email}</p>
                  <p>Status: <strong>⏳ Pending</strong></p>
                  <p><small>Uploaded: {new Date(u.updatedAt).toLocaleString()}</small></p>
                  <div className="action-buttons">
                    <button className="accept-btn" onClick={() => handleApprove(u.email, '1month')}>✅ Approve 1M</button>
                    <button className="accept-btn" onClick={() => handleApprove(u.email, '2months')}>✅ Approve 2M</button>
                    <button className="accept-btn" onClick={() => handleApprove(u.email, '3months')}>✅ Approve 3M</button>
                    <button className="deny-btn" onClick={() => handleDeny(u.email)}>🚫 Deny</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2>✅ Approved Receipts</h2>
          {approvedReceipts.length === 0 ? (
            <p>No approved receipts found.</p>
          ) : (
            <div className="receipt-grid">
              {approvedReceipts.map((u) => (
                <div key={u._id} className="receipt-card approved">
                  <img src={u.receiptUrl} alt="Approved Receipt" className="receipt-img" onClick={() => setModalImg(u.receiptUrl)} />
                  <p><strong>{u.name}</strong></p>
                  <p>{u.email}</p>
                  <p>Status: <strong>✅ Approved</strong></p>
                  <p><small>Updated: {new Date(u.updatedAt).toLocaleString()}</small></p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <div className="modal-content">
            <img src={modalImg} alt="Full Receipt" />
            <button onClick={() => setModalImg(null)} className="close-modal">✖</button>
          </div>
        </div>
      )}
      {apiKeyModal && (
        <div className="modal-overlay" onClick={() => setApiKeyModal(false)}>
          <div className="modal-content api-key-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🔑 Enter API Key</h3>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Your API Key"
            />
            <div className="modal-actions">
              <button className="submit-btn" onClick={handleApiKeySubmit}>Submit</button>
              <button className="close-btn" onClick={() => setApiKeyModal(false)}>X</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

