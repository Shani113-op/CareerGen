// backend/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant", required: true },
    consultantEmail: { type: String, required: true },
    consultantName: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: "10:00 AM"
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
