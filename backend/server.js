const authMiddleware = require('./middleware/auth.js'); // ✅ Adjust the path if different
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const verifyToken = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const sendEmail = require('./utils/sendEmail'); // update path as per your folder structure
const Consultant = require('./models/Consultant');
const ApiKey = require('./models/ApiKey'); // adjust the path if needed
const fs = require('fs');
const path = require('path');
const Booking = require('./models/Booking');
const cron = require('node-cron');
const moment = require('moment');


// Load env variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
    origin: 'https://www.careergenai.in',
    credentials: true
  }
));


// Middleware
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Atlas connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ User model
const User = require('./models/user');

// ✅ OTP storage (in-memory)
const otpStore = new Map();

// ✅ Register with OTP email
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password,
      isPremium: false // ✅ Ensure this is set
    });

    await newUser.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // Nodemailer code (same as yours)...
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CareerGenAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CareerGenAI OTP Verification',
      html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
        <h2 style="color: #007bff;">🔐 Email Verification (OTP)</h2>

        <p>Hi there,</p>
        <p>Thank you for signing up with <strong>CareerGenAI</strong> — your AI-powered career companion.</p>

        <p>To complete your registration, please use the OTP below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 24px; font-weight: bold; background: #e7f1ff; color: #007bff; padding: 15px 30px; border-radius: 8px; display: inline-block;">
            ${otp}
          </p>
        </div>

        <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

        <h3 style="color: #007bff;">Why CareerGenAI?</h3>
        <ul style="padding-left: 20px; line-height: 1.7;">
          <li>🎯 Personalized Career Guidance with AI</li>
          <li>🤖 Smart Chatbot to answer all your career doubts</li>
          <li>📄 Access roadmaps, salary insights & skill paths</li>
          <li>🎓 Free College Admission Counseling</li>
        </ul>

        <a href="https://www.careergenai.in" target="_blank" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 6px;">
          Explore Now
        </a>

        <p style="margin-top: 40px; font-size: 13px; color: #666;">Need help? Reach us at <a href="mailto:careergenai9@gmail.com">careergenai9@gmail.com</a></p>
        <p style="font-size: 12px; color: #999;">— Team CareerGenAI</p>
      </div>
    </div>
  `

    });

    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ OTP Verification
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (storedOtp === otp) {
    await User.findOneAndUpdate({ email }, { isVerified: true });
    otpStore.delete(email);
    res.json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});


// ✅ Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // 🔐 Optional: check if verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isPremium: !!user.premiumPlan && new Date(user.premiumExpiresAt) > new Date()
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/premium-status', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const isActive = user.premiumPlan && new Date(user.premiumExpiresAt) > new Date();
  res.json({ isPremium: isActive });
});


// ✅ Static career data
const careers = [
  {
    title: "Software Developer",
    image: "http://localhost:3000/images/software-dev.jpg",
    description: "Create powerful applications and shape the digital future."
  },
  {
    title: "Doctor",
    image: "http://localhost:3000/images/doctor.jpg",
    description: "Diagnose and treat patients, saving lives every day."
  },
  {
    title: "Chartered Accountant",
    image: "http://localhost:3000/images/ca.jpg",
    description: "Manage finances, audits, and ensure compliance."
  },
  {
    title: "Data Scientist",
    image: "http://localhost:3000/images/data-science.jpg",
    description: "Analyze complex data to uncover business insights."
  },
  {
    title: "UX Designer",
    image: "http://localhost:3000/images/ux-designer.jpg",
    description: "Design intuitive and engaging digital experiences."
  },
  {
    title: "Entrepreneur",
    image: "http://localhost:3000/images/entrepreneur.jpg",
    description: "Launch and scale your own successful venture."
  }
];



// ✅ Chat using OpenRouter API
// Existing career route

// ✅ Updated chat route with full context
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Message history is required' });
  }

  // Convert messages to OpenRouter format
  const formattedMessages = messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // or any model you prefer
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "⚠️ No reply from AI.";
    res.json({ reply });

  } catch (error) {
    console.error('OpenRouter Chat Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'OpenRouter chat failed' });
  }
});


// ✅ Career Recommendation using OpenRouter
app.post('/api/recommend', async (req, res) => {
  const { interests } = req.body;

  if (!interests || interests.length === 0) {
    return res.status(400).json({ error: 'Interests are required' });
  }

  const prompt = `Suggest 10 suitable career options for a student with the following interests: ${interests.join(', ')}.
Return ONLY a JSON array like this (no explanation, no markdown):

[
  {
    "title": "Career Title",
    "category": "Category",
    "description": "Short description",
    "skills": ["Skill1", "Skill2"],
    "roadmap": ["Step1", "Step2"],
    "salary": "₹X–Y LPA",
    "colleges": ["College1", "College2"]
  }
]`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content.trim();
    raw = raw.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

    try {
      const parsedCareers = JSON.parse(raw);
      res.json({ careers: parsedCareers });
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      res.status(500).json({ error: '❌ AI response was not valid JSON.', rawText: raw });
    }

  } catch (error) {
    console.error('OpenRouter Recommend Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// ✅ TOP COLLEGES ROUTE using OpenRouter
app.post('/api/colleges', async (req, res) => {
  const { course, location, collegeName, percentile } = req.body;

  if ((!course || !location) && !collegeName) {
    return res.status(400).json({
      error: '❌ Please provide either Course & Location OR College Name.'
    });
  }

  const collegeTemplate = `
[
  {
    "name": "College Name",
    "location": "City/State",
    "course": "Popular Course",
    "type": "Government / Private",
    "affiliation": "UGC / AICTE / Autonomous",
    "ranking": "NIRF 2024 Rank: #X",
    "fees": "₹X lakhs per year",
    "placementRate": "XX%",
    "topRecruiters": ["Company A", "Company B", "Company C"],
    "faculty": "Highly qualified with PhDs and industry experience",
    "campusLife": "Modern infrastructure, clubs, and events",
    "entranceExam": "JEE / CAT / NEET / Others",
    "admissionDeadline": "DD-MM-YYYY",
    "cutOffs": {
      "Computer Science": "98 percentile",
      "Information Technology": "96 percentile",
      "Artificial Intelligence": "94 percentile"
    },
    "website": "https://examplecollege.edu.in"
  }
]
`;

  // 📌 Build prompt based on input
  const prompt = collegeName
    ? `Give complete detailed information about the college "${collegeName}" in valid JSON format including branch-wise cutoffs like:\n${collegeTemplate}`
    : `Suggest top 10 reputed colleges in ${location} that offer a degree or specialization in "${course}". Return ONLY valid JSON with branch-wise cutoffs like:\n${collegeTemplate}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let raw = response.data.choices[0].message.content.trim();

    raw = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^\s*Here (is|are).*?:\s*/i, '')
      .trim();

    let parsed;
    if (raw.startsWith('[')) {
      parsed = JSON.parse(raw);
    } else {
      const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('No valid JSON array found in response');
      }
    }

    const allColleges = Array.isArray(parsed) ? parsed : [parsed];

    // ✅ Optional: Filter based on percentile
    let filteredColleges = allColleges;
    if (percentile && !collegeName) {
      const numericPercentile = parseFloat(percentile);
      filteredColleges = allColleges.filter((clg) => {
        if (!clg.cutOffs) return false;
        return Object.values(clg.cutOffs).some((cutoff) => {
          const cutoffNum = parseFloat(cutoff);
          return !isNaN(cutoffNum) && numericPercentile >= cutoffNum;
        });
      });
    }

    res.json({ colleges: filteredColleges });

  } catch (err) {
    console.error('❌ Error:', err.message || err);
    if (err.response?.data?.error?.message === 'timeout') {
      return res.status(408).json({ error: 'OpenRouter request timed out.' });
    }
    res.status(500).json({
      error: 'Failed to retrieve valid college data from OpenRouter.',
      details: err.message || err,
    });
  }
});


app.get('/api/quiz-questions', async (req, res) => {
  const count = parseInt(req.query.count) || 10;

  const prompt = `
Generate ${count} personality quiz questions for students, each with 4 multiple-choice options.
Return a JSON array like:
[
  {
    "question": "What do you enjoy doing the most?",
    "options": ["Solving puzzles", "Helping friends", "Drawing and painting", "Building models"]
  }
]
Only return valid JSON. No explanation or markdown.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content.trim();
    raw = raw.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
      // Validate structure
      const valid = Array.isArray(parsed) &&
        parsed.every(q =>
          q.question && Array.isArray(q.options) && q.options.length === 4
        );

      if (!valid) {
        throw new Error('Invalid question format from AI');
      }

      res.json({ questions: parsed });
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr);
      console.log('Raw output (truncated):', raw.slice(0, 300));
      res.status(500).json({ error: 'Failed to parse quiz questions from AI response.' });
    }

  } catch (err) {
    console.error('Quiz Question Fetch Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch questions from AI.' });
  }
});

app.post('/api/compare-courses', async (req, res) => {
  const { course1, course2 } = req.body;

  if (!course1 || !course2) {
    return res.status(400).json({ error: "Both course1 and course2 are required" });
  }

  const prompt = `Compare the following two courses: "${course1}" vs "${course2}".
Return ONLY a markdown table comparing these two courses on the following parameters:
- Duration
- Popular colleges
- Fees
- Placement scope
- Job roles
- Skills required
- Entrance exams
- Industry demand

Format:
| Parameter | ${course1} | ${course2} |
|-----------|------------|------------|
| ...       | ...        | ...        |

Strictly return the markdown table. No explanations or headings or markdown fences like \`\`\`.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let raw = response.data.choices?.[0]?.message?.content?.trim() || '';

    // Clean up extra markdown or heading text
    raw = raw
      .replace(/^```(?:markdown)?/gi, '')
      .replace(/```$/gi, '')
      .replace(/^(Here (is|are)[^\n]*\n|Below[^\n]*\n)/i, '')
      .trim();

    // Log output for debugging
    console.log('\n--- AI Raw Output Start ---\n');
    console.log(raw);
    console.log('\n--- AI Raw Output End ---\n');

    // Check if it's a valid markdown table
    const hasTableSyntax = raw.includes('|') && raw.includes('---');
    if (!hasTableSyntax) {
      return res.status(500).json({
        error: '⚠️ Invalid comparison data received.',
        debug: raw
      });
    }

    res.json({ table: raw });

  } catch (error) {
    console.error('❌ Course Comparison Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch course comparison from AI.' });
  }
});

app.post('/api/generate-resume', async (req, res) => {
  const {
    name,
    email,
    phone,
    education,
    skills,
    experience,
    projects,
    summary,
  } = req.body;

  const prompt = `
Use the following user details to generate a clean, ATS-friendly resume in professional tone and markdown format.

Full Name: ${name}
Email: ${email}
Phone: ${phone}
Summary: ${summary}
Education: ${education}
Skills: ${skills}
Experience: ${experience}
Projects: ${projects}

Return only the resume in markdown format. No introduction or explanation.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const aiReply = response.data.choices?.[0]?.message?.content?.trim();

    if (!aiReply) {
      return res.status(500).json({ error: 'Empty response from OpenRouter.' });
    }

    res.json({ resume: aiReply });
  } catch (err) {
    console.error('Resume Generation Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate resume from AI.' });
  }
});


app.post('/api/receipt', async (req, res) => {
  const { email, receiptUrl } = req.body;

  if (!email || !receiptUrl) {
    return res.status(400).json({ error: 'Email and receipt URL are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.receiptUrl = receiptUrl;
    user.receiptStatus = 'pending';
    await user.save();

    // ✅ Notify Admin
    const adminEmail = process.env.ADMIN_NOTIFY_TO || 'tech.aryahas@gmail.com';
    const subject = `📤 New Premium Request from ${user.name}`;
    const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f8fb; padding: 30px;">
    <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.08); overflow: hidden;">

      <!-- Header -->
      <div style="background-color: #10b981; padding: 20px 30px; color: white;">
        <h2 style="margin: 0;">📥 New Premium Receipt Submitted</h2>
        <p style="margin: 5px 0 0;">A user has submitted a receipt for premium access.</p>
      </div>

      <!-- User Details -->
      <div style="padding: 30px; font-size: 15px; line-height: 1.6; color: #333;">
        <p><strong>👤 Name:</strong> ${user.name}</p>
        <p><strong>📧 Email:</strong> ${user.email}</p>
        <p><strong>📱 Mobile:</strong> ${user.mobile || 'N/A'}</p>

        <p><strong>🧾 Receipt Uploaded:</strong></p>
        <div style="margin: 20px 0;">
          <img src="${receiptUrl}" alt="Receipt Image" style="max-width:100%; border:1px solid #ddd; border-radius:8px;" />
        </div>

        <p style="margin-top: 30px;">👉 <a href="https://www.careergenai.in/admin-dashboard" target="_blank" style="color: #3B82F6; font-weight: 500;">Review this submission in the Admin Dashboard</a></p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; font-size: 13px; color: #555;">
        <p style="margin: 0;">This is an automated notification from <strong>CareerGenAI</strong>.</p>
        <p style="margin: 5px 0;">Need help? <a href="mailto:support@careergenai.in" style="color: #3B82F6;">Contact Support</a></p>
        <p style="margin: 0;">© ${new Date().getFullYear()} CareerGenAI. All rights reserved.</p>
      </div>
    </div>
  </div>
`;


    await sendEmail(adminEmail, subject, '', html);

    res.json({ message: '✅ Receipt saved and admin notified successfully' });
  } catch (err) {
    console.error('❌ Receipt Save Error:', err.message);
    res.status(500).json({ error: 'Server error saving receipt' });
  }
});

app.post('/api/admin/save-api-key', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required.' });
  }

  try {
    // Save in DB
    let existing = await ApiKey.findOne();
    if (existing) {
      existing.key = apiKey;
      await existing.save();
    } else {
      await ApiKey.create({ key: apiKey });
    }

    // Write to .env
    const envPath = path.join(__dirname, '.env');
    let env = fs.readFileSync(envPath, 'utf8');

    // Replace the old key or add new
    const regex = /^OPENROUTER_API_KEY=.*$/m;
    if (regex.test(env)) {
      env = env.replace(regex, `OPENROUTER_API_KEY=${apiKey}`);
    } else {
      env += `\nOPENROUTER_API_KEY=${apiKey}\n`;
    }

    fs.writeFileSync(envPath, env);

    res.status(200).json({ message: 'API key saved and .env updated. Please restart your server!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving API key.' });
  }
});



// ✅ GET pending receipts only
// ✅ GET all users with receipts (pending + approved)
app.get('/api/admin/receipts', async (req, res) => {
  try {
    const users = await User.find({
      receiptUrl: { $exists: true, $ne: null },
      receiptStatus: { $in: ['pending', 'approved'] } // 🟡 Include both
    }).select('name email receiptUrl updatedAt receiptStatus');

    res.json({ users });
  } catch (err) {
    console.error('❌ Error fetching receipts:', err.message);
    res.status(500).json({ error: 'Server error fetching receipts' });
  }
});



app.post('/api/admin/approve', async (req, res) => {
  const { email, plan } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isPremium = true;
    user.premiumPlan = plan || 'manual';
    user.receiptStatus = 'approved';

    const planDuration = {
      '1month': 30,
      '3months': 90,
      '1year': 365,
      'manual': 365
    };
    const days = planDuration[user.premiumPlan] || 365;
    user.premiumExpiresAt = new Date(Date.now() + days * 86400000);

    await user.save();

    // Send approval email
    const subject = '🎉 Your Premium Plan Has Been Approved!';
    const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
      <h2 style="color: #28a745;">🎉 You're Now a CareerGenAI Premium Member!</h2>

      <p>Hi <strong>${user.name}</strong>,</p>

      <p>We're thrilled to inform you that your <strong>Premium Access</strong> has been <span style="color: #28a745; font-weight: bold;">approved</span>.</p>

      <ul style="line-height: 1.6; margin-top: 20px;">
        <li><strong>Plan:</strong> ${user.premiumPlan}</li>
        <li><strong>Expires on:</strong> ${new Date(user.premiumExpiresAt).toDateString()}</li>
      </ul>

      <p style="margin-top: 20px;">
        As a premium user, you now unlock access to:
      </p>

      <ul style="padding-left: 20px; line-height: 1.7;">
        <li>✅ <strong>Free Admission Counselling</strong> from experts</li>
        <li>🤖 AI-powered Career Chatbot to clear all your doubts</li>
        <li>📚 Smart career roadmaps, skill insights & salary info</li>
        <li>🏫 Explore top colleges, career paths, and eligibility</li>
      </ul>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://www.careergenai.in/history" target="_blank" style="padding: 14px 28px; background: #007bff; color: white; text-decoration: none; font-weight: bold; border-radius: 8px;">
          🚀 Start Exploring Careers Now
        </a>
      </div>

      <p style="margin-top: 20px; text-align: center; font-weight: bold; color: #dc3545;">
        🔥 Hurry! Book your free counselling session today!
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 13px; color: #666;">
        Have questions? Reach us at <a href="mailto:support@careergenai.com">support@careergenai.com</a>
      </p>

      <p style="font-size: 12px; color: #999; text-align: center;">
        — Team CareerGenAI | Your Smart Career Companion
      </p>
    </div>
  </div>
`;



    try {
      await sendEmail(user.email, subject, '', html);
    } catch (emailErr) {
      console.error('❌ Email sending failed:', emailErr.message);
    }

    res.json({ message: '✅ User approved and email sent' });
  } catch (err) {
    console.error('Approval error (stack):', err); // full error log
    res.status(500).json({ error: 'Server error approving user' });
  }
});


// Get booked slots for a specific consultant & date
app.post('/api/book-consultant', async (req, res) => {
  try {
    // 🔹 Verify token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    // 🔹 Extract booking data
    const { consultantEmail, consultantName, date, time, userEmail } = req.body;
    if (!consultantEmail || !date || !time || !userEmail) {
      return res.status(400).json({ message: 'Missing booking details' });
    }

    // 🔹 Find consultant
    const consultant = await Consultant.findOne({ email: consultantEmail });
    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    // 🔹 Check if the slot on that date is already booked
    const alreadyBooked = await Booking.findOne({
      consultantId: consultant._id,
      date,
      time
    });

    console.log(await Booking.find({ date, time, consultantId: consultant._id }));


    if (alreadyBooked) {
      return res.status(409).json({ message: 'This date & time slot is already booked.' });
    }

    // 🔹 Save booking in Booking collection
    const newBooking = new Booking({
      consultantId: consultant._id,
      consultantEmail,
      consultantName,
      date,
      time,
      userEmail
    });
    await newBooking.save();

    // 🔹 Send email (same format as yours)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Career GenAI" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || consultantEmail,
      subject: `New Appointment from CareerGenAI`,
      html: `<div style="max-width: 800px; font-family: 'Segoe UI', sans-serif; background-color: #f4f8fb; padding: 20px;">
  <div style="max-width: 800px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.08); overflow: hidden;">

    <!-- Header -->
    <div style="background-color: #3B82F6; padding: 20px 25px; color: white;">
      <h1 style="margin: 0; font-size: 24px;">🔔 New Booking Alert</h1>
      <p style="margin: 5px 0 0;">Appointment scheduled via <strong>CareerGenAI</strong></p>
    </div>

    <!-- Content -->
    <div style="padding: 25px;">
      <p style="font-size: 16px;">Hello <strong>${consultantName}</strong>,</p>
      <p style="font-size: 15px;">🎉 <strong>${user.name}</strong> has just booked a consultation session with you. Please find the appointment details below:</p>

      <!-- Details Table -->
      <table style="width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 15px; border-collapse: collapse;">
        <tr style="background-color: #f9fafb;">
          <td style="width: 45%; padding: 14px; border-bottom: 1px solid #e5e7eb; white-space: nowrap;">
            📇 <strong style="margin-left: 5px;">Client Name</strong>
          </td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; word-break: break-word; overflow-wrap: anywhere;">${user.name}</td>
        </tr>
        <tr>
          <td style="width: 45%; padding: 14px; border-bottom: 1px solid #e5e7eb; white-space: nowrap;">
            📧 <strong style="margin-left: 5px;">Email</strong>
          </td>
          <td style="padding: 14px; border-bottom: 1px solid #e5e7eb; word-break: break-word; overflow-wrap: anywhere;">${userEmail}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="width: 45%; padding: 14px; white-space: nowrap;">
            📅 <strong style="margin-left: 5px;">Date</strong>
          </td>
          <td style="padding: 14px;">${date}</td>
        </tr>
        <tr>
          <td style="width: 45%; padding: 14px; white-space: nowrap;">
            ⏰ <strong style="margin-left: 5px;">Time Slot</strong>
          </td>
          <td style="padding: 14px;">${time}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">📌 Please reach out to the client before the session to confirm any additional details or share prep materials.</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 20px 25px; text-align: center; font-size: 13px; color: #555;">
      <p style="margin: 0;">You're receiving this email because you're a consultant on <strong>CareerGenAI</strong>.</p>
      <p style="margin: 5px 0;">Need help? Contact us at <a href="mailto:support@careergenai.in" style="color: #3B82F6;">support@aryahsworld.com</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} CareerGenAI. All rights reserved.</p>
    </div>

  </div>
</div>
`
    };

    await transporter.sendMail(mailOptions);

    const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm A");
    const reminderDateTime = appointmentDateTime.clone().subtract(2, 'hours');

    // Convert to cron format: "m h D M *"
    const cronExpression = `${reminderDateTime.minute()} ${reminderDateTime.hour()} ${reminderDateTime.date()} ${reminderDateTime.month() + 1} *`;

    cron.schedule(cronExpression, async () => {
      try {
        const reminderMail = {
          from: process.env.EMAIL_USER,
          to: `${userEmail}, ${consultantEmail}`,
          subject: '⏰ Reminder: Your Counselling Session',
          html: `<div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3B82F6, #9333EA); padding: 18px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 22px;">⏰ Counselling Reminder</h1>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">Stay prepared for your upcoming session</p>
    </div>

    <!-- Body -->
    <div style="padding: 25px;">
      <p style="font-size: 16px; color: #333;">Hi,</p>
      <p style="font-size: 15px; color: #555;">
        This is a friendly reminder that your counselling session is scheduled for:
      </p>

      <!-- Appointment Card -->
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center;">
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">${time}</p>
        <p style="margin: 5px 0 0; font-size: 16px; color: #374151;">${date}</p>
      </div>

      <p style="font-size: 15px; color: #555;">Please ensure you are ready and available on time for the session.</p>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #555;">
      <p style="margin: 0;">Need help? Contact us at 
        <a href="mailto:support@careergenai.in" style="color: #3B82F6; text-decoration: none;">support@aryahsworld.com</a>
      </p>
      <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} CareerGenAI. All rights reserved.</p>
    </div>
  </div>
</div>
`
        };
        await transporter.sendMail(reminderMail);
        console.log(`✅ Reminder email sent for ${date} ${time}`);
      } catch (error) {
        console.error('❌ Error sending reminder email:', error.message);
      }
    });

    res.status(200).json({ message: 'Slot booked and email sent.' });

  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ message: 'Server error. Could not complete booking.' });
  }
});


// POST /api/admin/deny
app.post('/api/admin/deny', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update receipt status
    user.receiptUrl = null;
    user.receiptStatus = 'denied';
    await user.save();

    // ✅ Send denial email to user
    const subject = '❌ Premium Request Denied';
    const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
      <h2 style="color: #d9534f;">🚫 Premium Request Denied</h2>
      <p>Hi <strong>${user.name}</strong>,</p>

      <p>We’ve carefully reviewed your submitted receipt for premium access on <strong>CareerGenAI</strong>, and unfortunately, it couldn’t be approved at this time.</p>

      <p>If you believe this was a mistake or need any help, feel free to reply to this email or reach out to our support team.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <h3 style="color: #007bff;">Why CareerGenAI?</h3>
      <ul style="padding-left: 20px; line-height: 1.7;">
        <li>🎯 <strong>AI-Powered Career Guidance</strong> tailored just for you</li>
        <li>🧠 Interactive AI Chatbot for instant answers</li>
        <li>🎓 Free Admission Counseling by Experts</li>
        <li>📄 Detailed Career Roadmaps & Top College Listings</li>
      </ul>

      <p>Join thousands of students discovering their dream careers with <strong>CareerGenAI</strong>.</p>

      <a href="https://www.careergenai.in" target="_blank" style="display: inline-block; margin-top: 15px; padding: 12px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 6px;">Explore Career Options</a>

      <p style="margin-top: 40px; font-size: 13px; color: #666;">Need help? Contact us at <a href="mailto:careergenai9@gmail.com">support@careergenai.com</a></p>

      <p style="margin-top: 10px; font-size: 12px; color: #999;">— The CareerGenAI Team</p>
    </div>
  </div>
`;


    await sendEmail(email, subject, '', html);

    res.json({ message: '🚫 Receipt denied and user notified via email' });
  } catch (err) {
    console.error('Deny error:', err.message);
    res.status(500).json({ error: 'Server error denying receipt' });
  }
});

// POST /api/user/delete-receipt
app.post('/api/user/delete-receipt', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.receiptUrl = null;
    user.receiptStatus = null;
    await user.save();

    res.json({ message: '🗑️ Receipt deleted successfully' });
  } catch (err) {
    console.error('❌ Receipt deletion error:', err.message);
    res.status(500).json({ error: 'Server error deleting receipt' });
  }
});




// GET /api/user/:email
app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Expiry logic
    if (user.isPremium && user.premiumExpiresAt && new Date() > user.premiumExpiresAt) {
      user.isPremium = false;
      user.premiumPlan = null;
      user.premiumExpiresAt = null;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// backend/routes/admin.js or similar

app.post('/api/admin/register-consultant', async (req, res) => {
  try {
    const consultantData = req.body;

    const consultant = new Consultant(consultantData);
    await consultant.save();

    res.status(201).json({ message: 'Consultant registered successfully' });
  } catch (error) {
    console.error('Consultant Registration Error:', error);
    res.status(500).json({ error: 'Server error while registering consultant' });
  }
});

app.get('/api/consultants', async (req, res) => {
  try {
    const consultants = await Consultant.find({});
    res.json({ consultants });
  } catch (err) {
    console.error('Failed to fetch consultants:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Chat using OpenRouter API
// Existing career route
// Example: GET /api/careers?search=doctor OR /api/careers?category=Engineering
app.get('/api/careers', async (req, res) => {
  const { search, category } = req.query;
  const query = search || category;

  const prompt = `
Return exactly 5 careers matching "${query}" in JSON:
[
  {
    "title": "",
    "category": "",
    "description": "",
    "skills": [],
    "roadmap": [],
    "salary": "",
    "subcategories": [
      {
        "name": "",
        "description": "",
        "roadmap": []
      }
    ]
  }
]
No explanation, only valid JSON. No markdown fences.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let raw = response.data.choices[0].message.content.trim();

    // 🧹 Strip any markdown fences or extra text:
    raw = raw.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    // Also: remove leading text before [
    raw = raw.replace(/^[^{\[]+/, '').trim();

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid JSON structure.');
    }

    res.json({ careers: parsed });
  } catch (err) {
    console.error('Career AI fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch careers from AI.' });
  }
});


// ✅ POST /api/premium/activate
app.post('/api/user/activate', async (req, res) => {
  try {
    const { email, plan, receiptUrl } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ success: false, message: 'Email and plan are required' });
    }

    // ✅ Validate plan key
    const validPlans = ['1month', '3months', '1year'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Calculate expiry date
    const now = new Date();
    let expiresAt = new Date(now);

    if (plan === '1month') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan === '3months') {
      expiresAt.setMonth(expiresAt.getMonth() + 3);
    } else if (plan === '1year') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // ✅ Update user
    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumStartDate = now;
    user.premiumExpiresAt = expiresAt;
    user.receiptStatus = 'approved';

    if (receiptUrl) {
      user.receiptUrl = receiptUrl;
    }

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('❌ Premium activation error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during premium activation' });
  }
});




// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
});
