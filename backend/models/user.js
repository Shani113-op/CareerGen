const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false }, // ✅ For OTP verification
  otp: { type: String },
  otpExpiresAt: { type: Date },

  // ✅ Premium access flags
  isPremium: { type: Boolean, default: false },
  premiumPlan: { type: String, default: null }, // '1month', '2months', '3months'
  premiumStartAt: { type: Date, default: null }, // ✅ <-- Add this field
  premiumExpiresAt: { type: Date, default: null },

  // ✅ Receipt and verification
  receiptUrl: { type: String, default: null },
  receiptStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
