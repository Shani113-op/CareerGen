const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');


// Load environment variables
dotenv.config();

// keepalive ping
require('./models/keepalive');

// Import models
const User = require('./models/user');
const Consultant = require('./models/Consultant');
const Booking = require('./models/Booking');
const ApiKey = require('./models/ApiKey');
// const Profile = require('./models/Profile');

// Import middleware
const verifyToken = require('./middleware/auth');

// Import utilities
const sendEmail = require('./utils/sendEmail');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-photos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = 'uploads/profile-photos';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careergenai';

// Set mongoose options to prevent crashes
mongoose.set('bufferCommands', false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000, // 45 second timeout
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('⚠️  Backend will continue without database connection');
  console.log('💡 To fix: Install and start MongoDB or use MongoDB Atlas');
  console.log('💡 Database features will be limited until MongoDB is available');
});

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CareerGenAI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available. Please try again later.' });
    }

    const { name, email, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      mobile,
      password
    });

    await user.save();

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email
    await sendEmail(
      email,
      'CareerGenAI - Email Verification',
      `Your OTP is: ${otp}`,
      `<h2>CareerGenAI - Email Verification</h2><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    );

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email for OTP verification.',
      userId: user._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumPlan: user.premiumPlan
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get consultants
app.get('/api/consultants', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]); // Return empty array if database not connected
    }

    const consultants = await Consultant.find();
    res.json(consultants);
  } catch (error) {
    console.error('Get consultants error:', error);
    res.json([]); // Return empty array on error
  }
});

// Get booked slots for a consultant on a specific date
app.get('/api/booked-slots', async (req, res) => {
  try {
    const { consultantId, date } = req.query;
    
    if (!consultantId || !date) {
      return res.status(400).json({ error: 'Consultant ID and date are required' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({ bookedTimes: [] }); // Return empty array if database not connected
    }

    const bookings = await Booking.find({ 
      consultantId, 
      date 
    });

    const bookedTimes = bookings.map(booking => booking.time);
    
    res.json({ bookedTimes });
  } catch (error) {
    console.error('Get booked slots error:', error);
    res.json({ bookedTimes: [] }); // Return empty array on error
  }
});

// Book consultation
app.post('/api/book-consultant', verifyToken, async (req, res) => {
  try {
    const { consultantId, consultantEmail, consultantName, date, time, userEmail } = req.body;

    const booking = new Booking({
      consultantId,
      consultantEmail,
      consultantName,
      date,
      time,
      userEmail
    });

    await booking.save();

    // Send confirmation email
    await sendEmail(
      userEmail,
      'CareerGenAI - Consultation Booked',
      `Your consultation has been booked for ${date} at ${time}`,
      `<h2>CareerGenAI - Consultation Booked</h2><p>Your consultation with ${consultantName} has been booked for ${date} at ${time}.</p>`
    );

    res.status(201).json({ message: 'Consultation booked successfully', booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user bookings
app.get('/api/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Premium plan upgrade
app.post('/api/upgrade-premium', verifyToken, async (req, res) => {
  try {
    const { plan, receiptUrl } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumStartAt = new Date();
    user.receiptUrl = receiptUrl;
    user.receiptStatus = 'pending';

    // Calculate expiry date based on plan
    const expiryDate = new Date();
    switch (plan) {
      case '1month':
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case '3months':
        expiryDate.setMonth(expiryDate.getMonth() + 3);
        break;
      case '1year':
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan' });
    }
    user.premiumExpiresAt = expiryDate;

    await user.save();

    res.json({ message: 'Premium upgrade request submitted successfully' });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints
// Get users with receipts
app.get('/api/admin/receipts', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({ users: [] }); // Return empty array if database not connected
    }

    const users = await User.find({ 
      receiptUrl: { $exists: true, $ne: null } 
    }).select('name email receiptUrl receiptStatus premiumPlan premiumStartAt premiumExpiresAt');
    
    res.json({ users });
  } catch (error) {
    console.error('Get receipts error:', error);
    res.json({ users: [] }); // Return empty array on error
  }
});

// Save API key
app.post('/api/admin/save-api-key', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available. Please try again later.' });
    }

    const { apiKey } = req.body;
    
    // Find or create API key document
    let apiKeyDoc = await ApiKey.findOne();
    if (!apiKeyDoc) {
      apiKeyDoc = new ApiKey({ key: apiKey });
    } else {
      apiKeyDoc.key = apiKey;
    }
    
    await apiKeyDoc.save();
    
    res.json({ message: 'API key saved successfully' });
  } catch (error) {
    console.error('Save API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register consultant
app.post('/api/admin/register-consultant', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available. Please try again later.' });
    }

    const consultantData = req.body;
    
    const consultant = new Consultant(consultantData);
    await consultant.save();
    
    res.json({ message: 'Consultant registered successfully', consultant });
  } catch (error) {
    console.error('Register consultant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Profile Management Endpoints

// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      // Create default profile if doesn't exist
      profile = new Profile({
        userId,
        name: 'New User',
        status: 'Free User',
        avatar: 'https://placehold.co/200x200/E2E8F0/1A237E?text=U',
        role: 'Musician',
        experience: 'Beginner',
        artists: '',
        genre: '',
        software: '',
        mood: '',
        location: '',
        availability: 'Available',
        badges: '',
        tags: '',
        socialLinks: []
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Update profile
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...profileData, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // Also update user account with basic info (name, email, mobile)
    const userUpdateData = {};
    if (profileData.name) userUpdateData.name = profileData.name;
    if (profileData.email) userUpdateData.email = profileData.email;
    if (profileData.phone) userUpdateData.mobile = profileData.phone;
    if (profileData.avatar) userUpdateData.avatar = profileData.avatar;

    if (Object.keys(userUpdateData).length > 0) {
      const user = await User.findByIdAndUpdate(
        userId,
        { ...userUpdateData, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add social link
app.post('/api/profile/:userId/social-links', async (req, res) => {
  try {
    const { userId } = req.params;
    const { platform, url } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.socialLinks.push({ platform, url });
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    console.error('Add social link error:', error);
    res.status(500).json({ error: 'Failed to add social link' });
  }
});

// Remove social link
app.delete('/api/profile/:userId/social-links/:index', async (req, res) => {
  try {
    const { userId, index } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.socialLinks.splice(parseInt(index), 1);
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    console.error('Remove social link error:', error);
    res.status(500).json({ error: 'Failed to remove social link' });
  }
});

// Upload profile photo
app.post('/api/upload/profile-photo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { userId } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Create the image URL (you might want to use a CDN or cloud storage in production)
    const imageUrl = `/uploads/profile-photos/${req.file.filename}`;
    
    // Update both profile and user account with new avatar
    if (userId) {
      // Update profile
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { avatar: imageUrl, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      // Update user account
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: imageUrl, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    res.json({ 
      message: 'Profile photo uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Function to kill processes on specific ports
const killProcessOnPort = (port) => {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    
    // Find process using the port
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5 && parts[4] !== '0') {
            pids.add(parts[4]);
          }
        });
        
        if (pids.size > 0) {
          console.log(`🔪 Killing processes on port ${port}: ${Array.from(pids).join(', ')}`);
          pids.forEach(pid => {
            exec(`taskkill /F /PID ${pid}`, (err) => {
              if (err) {
                console.log(`⚠️  Could not kill process ${pid}: ${err.message}`);
              } else {
                console.log(`✅ Killed process ${pid}`);
              }
            });
          });
          
          // Wait a moment for processes to be killed
          setTimeout(resolve, 2000);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  });
};

// Start server strictly on port 8000
const startServer = async () => {
  try {
    // Kill any existing processes on port 8000
    await killProcessOnPort(8000);
    
    // Start server on port 8000
    const server = app.listen(8000, () => {
      console.log(`🚀 CareerGenAI Backend running on port 8000`);
      console.log(`📊 Health check: http://localhost:8000/api/health`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port 8000 is still in use after killing processes. Please manually kill the process and try again.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start server
let server;
startServer().then((srv) => {
  server = srv;
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('✅ Process terminated');
    });
  }
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('✅ Process terminated');
    });
  }
});

module.exports = app;
