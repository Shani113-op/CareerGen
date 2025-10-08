import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaCalendarCheck, FaHourglassHalf, FaChartBar, FaSignOutAlt } from "react-icons/fa"; // Using react-icons for a modern touch
import "../styles/ConsultantDashboard.css";

const ConsultantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const consultant = JSON.parse(localStorage.getItem("user"));
  const consultantId = consultant?.id;

  // --- Data Fetching and State Management ---
  useEffect(() => {
    if (!consultantId) {
      window.location.href = "/login";
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/consultant/${consultantId}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [consultantId]);

  // --- Derived State (Performance with useMemo) ---
  const bookingSummary = useMemo(() => {
    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const acceptedCount = bookings.filter(b => b.status === "accepted").length;
    const rejectedCount = bookings.filter(b => b.status === "rejected").length;
    const totalBookings = bookings.length;

    // Filter for upcoming bookings (e.g., next 7 days)
    const today = new Date();
    const upcoming = bookings
      .filter(b => b.status === "accepted" && new Date(b.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return { totalBookings, pendingCount, acceptedCount, rejectedCount, upcoming };
  }, [bookings]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const updateBookingStatus = async (id, action) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${id}/${action}`);
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: res.data.booking.status } : b)));
    } catch (err) {
      console.error("Error updating booking:", err.message);
      alert("Failed to update booking");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="consultant-dashboard-container">
      {/* Sidebar for Navigation (Placeholder) */}
      <aside className="dashboard-sidebar">
        <div className="logo-section">
          <FaChartBar size={32} />
          <h3>Consultant Hub</h3>
        </div>
        <nav>
          <ul>
            <li className="nav-item active">Dashboard</li>
            {/* <li className="nav-item">Calendar</li>
            <li className="nav-item">Clients</li>
            <li className="nav-item">Settings</li> */}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <motion.header
          className="dashboard-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="welcome-message">Welcome back, {consultant?.name}!</p>
          </div>
          <div className="header-right">
            <div className="user-profile-icon">
                <FaUserCircle size={28} />
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </motion.header>

        {/* Info Cards Section */}
        <section className="info-cards-section">
          <motion.div className="info-card total-bookings" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="card-icon"><FaCalendarCheck /></div>
            <div className="card-content">
              <h4>Total Bookings</h4>
              <p>{bookingSummary.totalBookings}</p>
            </div>
          </motion.div>
          <motion.div className="info-card pending-bookings" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="card-icon"><FaHourglassHalf /></div>
            <div className="card-content">
              <h4>Pending</h4>
              <p>{bookingSummary.pendingCount}</p>
            </div>
          </motion.div>
          <motion.div className="info-card accepted-bookings" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="card-icon"><FaCalendarCheck /></div>
            <div className="card-content">
              <h4>Accepted</h4>
              <p>{bookingSummary.acceptedCount}</p>
            </div>
          </motion.div>
        </section>

        {/* Upcoming Bookings Section */}
        <section className="upcoming-section">
          <h3 className="section-title">Upcoming Appointments</h3>
          <AnimatePresence>
            {bookingSummary.upcoming.length > 0 ? (
              <div className="upcoming-list">
                {bookingSummary.upcoming.slice(0, 3).map((b, index) => (
                  <motion.div
                    key={b._id}
                    className="upcoming-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="upcoming-info">
                      <div className="upcoming-date">{b.date}</div>
                      <div className="upcoming-details">
                        <p className="user-email">{b.userEmail}</p>
                        <p className="booking-time">{b.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No upcoming appointments scheduled.</p>
            )}
          </AnimatePresence>
        </section>

        {/* All Bookings (Interactive Table) Section */}
        <section className="bookings-section">
          <h3 className="section-title">All Bookings</h3>
          {bookings.length === 0 ? (
            <p className="empty-state">No bookings found.</p>
          ) : (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>User Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>{b.userEmail}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td className="table-actions">
                        {b.status === "pending" && (
                          <>
                            <button className="table-btn accept-btn" onClick={() => updateBookingStatus(b._id, "accept")}>
                              Accept
                            </button>
                            <button className="table-btn reject-btn" onClick={() => updateBookingStatus(b._id, "reject")}>
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ConsultantDashboard;