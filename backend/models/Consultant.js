const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false }); // Optional: disable _id for subdocs

const consultantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  availability: [{ type: String, required: true }],
  bookings: [bookingSchema] // 🆕 Add this array field
}, { timestamps: true });

module.exports = mongoose.model('Consultant', consultantSchema);
