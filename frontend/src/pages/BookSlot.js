// src/pages/BookSlot.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion"

const BookSlot = () => {
  const { consultantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const consultant = location.state?.consultant;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const API = process.env.REACT_APP_API_URL;


  useEffect(() => {
    if (!consultant) {
      navigate('/consult'); // redirect if consultant data is missing
    }
    // Fetch logged-in user's email from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.email) {
      setUserEmail(userData.email);
    }
  }, [consultant, navigate]);

  useEffect(() => {
    if (date) {
      fetchBookedSlots();
    }
  }, [date]);

  const fetchBookedSlots = async () => {
    try {
      const res = await axios.get(
        `${API}/api/booked-slots?consultantId=${consultantId}&date=${date}`
      );
      setBookedTimes(res.data.bookedTimes || []);
    } catch (err) {
      console.error('❌ Failed to fetch booked slots:', err.message);
      setBookedTimes([]);
    }
  };

  const handleBooking = async () => {
    if (!date || !time) return alert('Please select date and time');
    setIsBooking(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        return;
      }

      const res = await axios.post(
        `${API}/api/book-consultant`,
        {
          consultantId,
          consultantEmail: consultant.email,
          consultantName: consultant.name,
          date,
          time,
          userEmail, // ✅ Sending userEmail for backend requirement
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.message?.includes('Email sent')) {
        alert('✅ Appointment booked successfully!');
        navigate('/consult');
      } else {
        alert(res.data?.message || '❌ Something went wrong');
      }
    } catch (err) {
      console.error('Booking error:', err.message);
      alert('Slot already booked');
    } finally {
      setIsBooking(false);
    }
  };

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-200"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Book Slot with <span className="text-blue-600">{consultant?.name}</span>
        </h1>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            📅 Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Time Slots */}
        {date && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-3">
              ⏰ Select Time
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableTimes.map((t) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={t}
                  disabled={bookedTimes.includes(t)}
                  onClick={() => setTime(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition
                ${bookedTimes.includes(t)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : time === t
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
                    }`}
                >
                  {t} {bookedTimes.includes(t) && "❌"}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <motion.div
          whileHover={{ scale: !isBooking ? 1.05 : 1 }}
          whileTap={{ scale: !isBooking ? 0.95 : 1 }}
          className="text-center"
        >
          <button
            onClick={handleBooking}
            disabled={isBooking}
            className={`px-6 py-2 rounded-lg font-semibold shadow-sm transition text-sm
          ${isBooking
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isBooking ? "Booking..." : "✅ Confirm Appointment"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookSlot;
