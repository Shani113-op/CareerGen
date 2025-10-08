const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const consultantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // job role (Career Counselor, etc.)
  expertise: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // will be hashed before save
  image: { type: String, required: true },
  availability: [{ type: String, required: true }],
  bookings: [bookingSchema]
}, { timestamps: true });

/**
 * 🔐 Hash password before saving
 */
consultantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * 🔑 Helper method to compare plain text password with hash
 */
consultantSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Consultant', consultantSchema);
