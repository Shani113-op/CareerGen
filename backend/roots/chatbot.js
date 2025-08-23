const express = require('express');
const router = express.Router();

// Enhanced chatbot route with more comprehensive responses
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase().trim();

    // Highly accurate responses based on actual CareerGenAI platform
    const responses = {
      // Greetings
      'hello': "Hello! Welcome to CareerGenAI - your AI-powered career companion. I can help you with our 10 services including Career Assessment, Personality Quiz, AI Chat, Expert Consultations, College Search, Resume Building, and FREE Admission Counselling. What interests you?",
      'hi': "Hi there! I'm your CareerGenAI assistant. Ready to explore our services? We offer everything from AI career guidance to expert consultations and college recommendations. How can I help?",
      'hey': "Hey! Welcome to CareerGenAI! I can guide you through our platform's features like Career Assessment, Resume Builder, College Search, and booking FREE admission counselling. What would you like to explore?",
      'good morning': "Good morning! Start your day right with CareerGenAI. Explore career paths, build resumes, or book FREE admission counselling for Engineering/MBBS/MBA/Medical courses. What interests you?",
      'good afternoon': "Good afternoon! Perfect time to advance your career with CareerGenAI. Try our Career Assessment, search colleges, or chat with our AI. How can I assist you today?",
      'good evening': "Good evening! Great time to plan your future with CareerGenAI. Explore our services, book consultations, or get career guidance. What can I help you with?",

      // Services - Exact match to ServicesPage.js
      'services': `🎯 CAREERGENAI - 10 COMPREHENSIVE SERVICES:\n\n🆓 FREE SERVICES (8 total):\n🎯 Career Assessment - Get AI-powered career suggestions based on your interests\n🧠 Personality Quiz - Know your personality type and find matching careers\n🤖 AI Chatbot - Chat with our 24/7 AI career assistant [NEW]\n👨‍💼 Career Counselling - Book one-on-one sessions with certified career experts\n👤 Profile Builder - Create your complete student career profile\n🏛️ Top Colleges - Explore top colleges based on your selected field\n⚖️ Career Comparison Tool - Compare salaries, demand, skills & scope between careers [NEW]\n📄 Resume Builder - Create modern, ATS-friendly resumes using smart templates [AI]\n\n💎 PREMIUM SERVICES (2 total):\n📋 Career Roadmaps - Download step-by-step guides for your dream career [PREMIUM]\n💎 Premium Resume Builder - Create modern, ATS-friendly Premium resumes using smart templates [PREMIUM]\n\n🎁 BONUS: FREE Admission Counselling for Engineering, MBBS, MBA, Medical courses (no registration required)!\n\nSERVICE BADGES:\n• 🆕 NEW - Recently added features\n• 💎 PREMIUM - Requires paid subscription\n• 🤖 AI - AI-powered functionality\n\nTO GET STARTED: Register (free) → Login → Access Services\nPREMIUM PLANS: ₹1999 (1 month), ₹2999 (3 months), ₹3999 (1 year)\n\nWhich service would you like to explore first?`,

      'what do you offer': "CareerGenAI offers 10 services: 8 FREE (Career Assessment, Personality Quiz, AI Chatbot, Career Counselling, Profile Builder, Top Colleges, Career Comparison Tool, Resume Builder) + 2 Premium (Career Roadmaps, Premium Resume Builder) + FREE Admission Counselling bonus!",

      'what services do you offer': `🎯 CAREERGENAI'S COMPLETE SERVICE PORTFOLIO:\n\n🆓 FREE SERVICES (8 total):\n1. Career Assessment - Get AI-powered career suggestions based on your interests\n2. Personality Quiz - Know your personality type and find matching careers\n3. AI Chatbot - Chat with our 24/7 AI career assistant [NEW]\n4. Career Counselling - Book one-on-one sessions with certified career experts\n5. Profile Builder - Create your complete student career profile\n6. Top Colleges - Explore top colleges based on your selected field\n7. Career Comparison Tool - Compare salaries, demand, skills & scope between careers [NEW]\n8. Resume Builder - Create modern, ATS-friendly resumes using smart templates [AI]\n\n💎 PREMIUM SERVICES (2 total):\n9. Career Roadmaps - Download step-by-step guides for your dream career [PREMIUM]\n10. Premium Resume Builder - Create modern, ATS-friendly Premium resumes using smart templates [PREMIUM]\n\n🎁 BONUS: FREE Admission Counselling (Engineering/MBBS/MBA/Medical) - no registration required!\n\nKEY FEATURES:\n• 🆕 NEW - Recently added features\n• 💎 PREMIUM - Requires subscription (₹1999-₹3999)\n• 🤖 AI - AI-powered functionality\n\nGETTING STARTED: Register free → Login → Access 8 free services immediately\nPREMIUM UPGRADE: Unlock 2 additional premium features\nCONTACT: +91 8657869659, +91 9619901999\n\nWhich service interests you most?`,

      // Resume Building - Based on actual features
      'resume': `📄 CAREERGENAI RESUME BUILDERS:\n\n📄 STANDARD RESUME BUILDER (Free/Basic)\n• Professional templates\n• ATS-friendly formats\n• Basic customization\n• PDF download\n• Access via 'Resume Templates' menu\n\n💎 PREMIUM RESUME BUILDER (Premium)\n• 6+ advanced templates with AI assistance\n• Smart content suggestions\n• Industry-specific optimization\n• Advanced customization options\n• Access via 'Premium Resume Builder'\n\n🎨 AVAILABLE TEMPLATES:\n• Template 1 - Professional & Clean\n• Template 2 - Creative & Modern\n• Template 3 - Elegant & Sophisticated\n• Template 4 - Contemporary & Bold\n• Template 5 - Minimalist & Professional\n• Template 6 - Executive & Premium\n\nAll templates are ATS-friendly and mobile responsive. Ready to create your professional resume?`,

      'resume builder': "We have both Standard and Premium Resume Builders! The standard version offers professional templates, while Premium includes 6+ advanced templates with AI assistance. Visit 'Resume Templates' for standard or 'Premium Resume Builder' for advanced features.",

      'templates': `🎨 CAREERGENAI - 6 PROFESSIONAL RESUME TEMPLATES:\n\n1. Template 1 - Professional & Clean\n2. Template 2 - Creative & Modern\n3. Template 3 - Elegant & Sophisticated\n4. Template 4 - Contemporary & Bold\n5. Template 5 - Minimalist & Professional\n6. Template 6 - Executive & Premium\n\n✅ All templates are ATS-friendly\n✅ Mobile responsive design\n✅ PDF download available\n✅ Customizable layouts\n\nPremium users get AI-powered content suggestions and advanced customization. Which template style interests you?`,

      // Career Guidance - Corrected based on actual platform behavior
      'career': `🎯 CAREERGENAI'S CAREER GUIDANCE SYSTEM:\n\n🎯 CAREER ASSESSMENT (FREE!)\n• Get AI-powered career suggestions based on your interests\n• Select from 18 interests: Mathematics, Designing, Helping People, Coding, Writing, Nature, Management, Science, Art, Technology, Health, Business, Communication, Research, Analysis, Problem Solving, Teaching, Creativity\n• AI analyzes your selections using OpenRouter API\n• Provides detailed career recommendations with career categories, required skills, education roadmap, salary expectations, and top colleges\n• Access: Services → Career Assessment (FREE for all users)\n\n📊 PERSONALITY QUIZ (FREE!)\n• Know your personality type and find matching careers\n• AI-generated personality questions discover your type: Analytical Thinker, Creative Innovator, Compassionate Helper, or Practical Builder\n• Provides personalized traits, career suggestions, roadmaps, and college recommendations\n• Downloadable PDF results\n• Access: Services → Personality Quiz (FREE for all users)\n\n⚖️ CAREER COMPARISON TOOL (FREE!)\n• Compare salaries, demand, skills & scope between careers\n• Analyzes: Duration, Colleges, Fees, Placement scope, Job roles, Skills required, Entrance exams, Industry demand\n• Access: Services → Career Comparison Tool\n\nAll three career guidance tools are completely FREE for all registered users!`,

      'career guidance': "CareerGenAI provides 3 FREE career guidance tools: Career Assessment (AI-powered suggestions based on interests), Personality Quiz (know your personality type and find matching careers), and Career Comparison Tool (compare salaries, demand, skills & scope). All are free for registered users!",

      'quiz': `**Personality Quiz Details** (FREE SERVICE):

🧠 **How it works:**
• Know your personality type and find matching careers
• AI generates personalized questions using our quiz API
• Questions assess your preferences and traits
• Takes about 10-15 minutes to complete

🎯 **Four Personality Types:**
1. **🧠 The Analytical Thinker** - Logical, Detail-Oriented → Data Scientist, Analyst, Researcher
2. **🎨 The Creative Innovator** - Imaginative, Expressive → UX Designer, Writer, Animator  
3. **💬 The Compassionate Helper** - Empathetic, Supportive → Counseling, HR, Social Work
4. **🔧 The Practical Builder** - Hands-On, Problem-Solver → Engineering, Mechanic, Hardware Dev

📋 **Results Include:**
• Your personality type and traits description
• Career suggestions matching your type
• Step-by-step roadmap to begin your career
• Top Indian colleges for your field
• Downloadable PDF report of your results

🆓 **FREE Access:**
• This service is completely FREE for all registered users
• No premium subscription required
• Available immediately after registration

🆓 **Access Process:**
1. Register/Login to CareerGenAI
2. Go to Services → Personality Quiz
3. Take the AI-generated quiz
4. Get your personality type and career recommendations
5. Download your personalized PDF report

**Ready to discover your personality type?** Register now and take the FREE quiz!`,

      // Consultations - Based on actual Consult.js and homepage
      'consultation': `CareerGenAI offers **TWO types of consultations**:

🆓 **FREE Admission Counselling** (Homepage)
• Available for: Engineering, MBBS, MBA, and Medical courses
• Expert guidance for course and college selection
• Admission process support and strategy
• **How to book:** Visit our homepage and click the green "Book Now" button
• Completely free for all users - no registration required

👨‍🎓 **Career Counselling Sessions** (Services Page)
• One-on-one sessions with certified career experts
• **Available Consultants:**
  - Regular consultants (Free for all users)
  - Personal Counselor (Premium users only - marked with 👑 Premium badge)

• **Booking process:**
  1. Login to your account
  2. Go to 'Services' → 'Career Counselling'
  3. Browse available consultants
  4. Click '📅 Book' on your preferred consultant
  5. You'll be redirected to booking page with consultant details
  6. Select date and time slot

💼 **Consultant Information Includes:**
• Name, role, and expertise area
• Professional bio and experience
• Consultant image and specialization
• Premium vs Free user access levels

📞 **Contact Numbers:**
• +91 8657869659
• +91 9619901999

**Note:** Some consultants require Premium subscription, while others are available to all users.

Which type of consultation interests you - FREE admission counselling or career counselling sessions?`,

      'expert': "CareerGenAI has certified career consultants available for both FREE admission counselling (Engineering/MBBS/MBA/Medical - book via homepage) and paid career counselling sessions (book via Services page). Contact: +91 8657869659 or +91 9619901999.",

      // Pricing - Corrected based on actual platform behavior
      'price': `💰 CAREERGENAI PRICING STRUCTURE:\n\n🆓 FREE SERVICES (8 total)\n• Career Assessment (Get AI-powered career suggestions based on your interests) - FREE\n• Personality Quiz (Know your personality type and find matching careers) - FREE\n• AI Chatbot (Chat with our 24/7 AI career assistant) - FREE\n• Career Counselling (Book one-on-one sessions with certified career experts) - FREE\n• Profile Builder (Create your complete student career profile) - FREE\n• Top Colleges (Explore top colleges based on your selected field) - FREE\n• Career Comparison Tool (Compare salaries, demand, skills & scope between careers) - FREE\n• Resume Builder (Create modern, ATS-friendly resumes using smart templates) - FREE\n\n💎 PREMIUM FEATURES (2 total)\n• Career Roadmaps (Download step-by-step guides for your dream career) - PREMIUM\n• Premium Resume Builder (Create modern, ATS-friendly Premium resumes using smart templates) - PREMIUM\n\n💰 PREMIUM PLANS\n• 1 Month - ₹1999 (Ideal for quick exploration)\n• 3 Months - ₹2999 (Most Popular - Save 33%)\n• 1 Year - ₹3999 (Best value for serious planning)\n\n🔒 100% secure payment via QR code • Cancel anytime\nVisit our 'Pricing' page for detailed comparisons!`,

      'pricing plans': `**CareerGenAI Pricing Plans** (Detailed):

🆓 **FREE TIER** - ₹0 (8 Services)
✅ Career Assessment - Get AI-powered career suggestions based on your interests
✅ Personality Quiz - Know your personality type and find matching careers
✅ AI Chatbot - Chat with our 24/7 AI career assistant
✅ Career Counselling - Book one-on-one sessions with certified career experts
✅ Profile Builder - Create your complete student career profile
✅ Top Colleges - Explore top colleges based on your selected field
✅ Career Comparison Tool - Compare salaries, demand, skills & scope between careers
✅ Resume Builder - Create modern, ATS-friendly resumes using smart templates
✅ FREE Admission Counselling (Engineering/MBBS/MBA/Medical) - Bonus service!

💎 **PREMIUM PLANS** (2 Additional Services)
📋 Career Roadmaps - Download step-by-step guides for your dream career
💎 Premium Resume Builder - Create modern, ATS-friendly Premium resumes using smart templates

**💰 Premium Subscription Options:**
🥉 **1 Month** - ₹1999
• Perfect for quick career exploration
• Immediate access to premium features

🥈 **3 Months** - ₹2999 (MOST POPULAR)
• Save ₹3000 compared to monthly
• Best for comprehensive career planning

🥇 **1 Year** - ₹3999 (BEST VALUE)
• Save ₹20,000+ compared to monthly
• Complete career transformation journey

🔒 **Payment:** Secure QR code system
📱 **Access:** Instant activation after payment
🔄 **Flexibility:** Cancel anytime, no hidden fees

**Ready to upgrade?** Visit our Pricing page!`,

      'cost': "CareerGenAI offers 8 FREE services including Career Assessment, Personality Quiz, AI Chatbot, College Search, and Resume Builder. Only 2 features are Premium: Career Roadmaps and Premium Resume Builder. Premium plans start from ₹1999/month.",
      'free': "Yes! CareerGenAI offers 8 extensive FREE services: Career Assessment, Personality Quiz, AI Chatbot, Profile Builder, Top Colleges search, Career Comparison Tool, Standard Resume Builder, and FREE Admission Counselling for Engineering/MBBS/MBA/Medical courses.",

      'free admission counselling': `**FREE Admission Counselling** (Completely Free!):

🎓 **Available For:**
• Engineering courses (B.Tech, B.E)
• MBBS (Medical courses)
• MBA (Management courses)  
• Medical entrance preparation

👨‍🎓 **What You Get:**
• Expert guidance on course selection
• College recommendations based on your profile
• Admission process support and strategy
• Entrance exam preparation tips
• Application assistance and documentation help
• Scholarship and financial aid guidance

📍 **How to Book:**
1. Visit CareerGenAI homepage
2. Look for the green "Book Now" button
3. Click to schedule your FREE session
4. Choose convenient date and time
5. Get expert consultation at zero cost

📞 **Direct Contact:**
• Call: +91 8657869659
• Call: +91 9619901999
• Available in website header for instant calling

💡 **Why It's FREE:**
We believe every student deserves quality career guidance regardless of financial background. This service helps you make informed decisions about your future education.

**Ready to book your FREE session?** Visit our homepage and click "Book Now"!`,

      'tell me about free admission counselling': `**FREE Admission Counselling Details:**

🆓 **Completely FREE Service** - No hidden charges!

🎯 **Specializations:**
• **Engineering** - B.Tech, B.E, Polytechnic courses
• **MBBS** - Medical college admissions, NEET guidance
• **MBA** - Management programs, entrance exam prep
• **Medical** - All medical courses and entrance exams

👨‍🎓 **Expert Counsellors Provide:**
• Personalized course recommendations
• College selection based on your marks/percentile
• Admission timeline and important dates
• Entrance exam strategies and preparation tips
• Documentation and application guidance
• Scholarship opportunities and financial aid
• State quota vs All India quota guidance

📱 **Easy Booking Process:**
1. Visit CareerGenAI homepage
2. Scroll to find the green "Book Now" button
3. Fill in your details and preferred time
4. Get confirmation call from our experts
5. Attend your FREE consultation session

📞 **Instant Contact:**
• +91 8657869659 (Click to call from website)
• +91 9619901999 (Available in header)

🏆 **Success Rate:** 95%+ students get admission in their preferred colleges

**Book your FREE session now!** No registration required for this service.`,

      'how does career assessment work': `**Career Assessment - AI-Powered Career Discovery** (FREE SERVICE):

🧠 **How It Works:**
1. **Interest Selection** - Choose from 18 career interests:
   • Mathematics, Designing, Helping People, Coding
   • Writing, Nature, Management, Science, Art
   • Technology, Health, Business, Communication
   • Research, Analysis, Problem Solving, Teaching, Creativity

2. **AI Analysis** - Our OpenRouter API analyzes your selections
3. **Personalized Results** - Get detailed career recommendations

📊 **What You Receive:**
• **Career Categories** - Multiple career options matching your interests
• **Detailed Descriptions** - What each career involves
• **Required Skills** - Skills needed for each career path
• **Education Roadmap** - Step-by-step educational requirements
• **Salary Expectations** - Expected income ranges
• **Top Colleges** - Best institutions for each field
• **Filter by Category** - Browse careers by different categories

🎯 **Assessment Features:**
• Takes 10-15 minutes to complete
• AI-powered recommendations using OpenRouter API
• Personalized to your unique interest combination
• Instant results with detailed career cards
• Filter and browse by career categories

🆓 **FREE Access:**
• This service is completely FREE for all registered users
• No premium subscription required
• Available immediately after registration

🆓 **Access Process:**
1. Register/Login to CareerGenAI
2. Go to Services → Career Assessment
3. Select your interests from 18 options
4. Get instant AI-powered career suggestions

**Ready to discover your ideal career?** Register now and take the FREE assessment!`,

      'tell me about resume builder': `**CareerGenAI Resume Builder** - Create Professional Resumes:

📄 **Standard Resume Builder** (FREE):
• **3 Professional Templates Available:**
  - ✨ Modern Clean - Crisp blue lines, clean sections (recommended)
  - 📜 Classic Professional - Elegant serif fonts, neutral tones
  - 🎨 Creative - Colorful, visual-first design for creative roles

✅ **Free Features:**
• ATS (Applicant Tracking System) friendly
• Mobile responsive design
• PDF download capability
• Easy-to-use interface
• Professional formatting
• Multiple sections: Contact, Summary, Experience, Education, Skills

💎 **Premium Resume Builder** (Premium Subscription):
• **6 Advanced Templates** with AI assistance:
  - Template 1: Professional & Clean
  - Template 2: Creative & Modern
  - Template 3: Elegant & Sophisticated
  - Template 4: Contemporary & Bold
  - Template 5: Minimalist & Professional
  - Template 6: Executive & Premium
• **AI-Powered Content Suggestions**
• **Advanced Customization Options**
• **Industry-Specific Optimization**

🚀 **How to Access:**
1. Login to your CareerGenAI account
2. **Free Version:** Services → Resume Builder → Choose from 3 templates
3. **Premium Version:** Services → Premium Resume Builder → 6 AI-powered templates
4. Fill in your information
5. Customize and download as PDF

📱 **Navigation:**
• **Free Templates:** /resume-templates
• **Premium Templates:** /AllComponents (requires Premium subscription)

**Start building your professional resume today!** Free version available to all users, Premium for advanced features.`,

      'how to find colleges': `**Top Colleges Search** - Find Your Perfect College (FREE SERVICE):

🔍 **Two Search Methods:**

**Method 1: Search by Criteria**
• Enter your **percentile** (e.g., 92.5, 85.2)
• Enter **course** (e.g., MBA, B.Tech, B.E, MBBS)
• Enter **location** (e.g., Mumbai, Delhi, Bangalore)
• Get filtered results based on your eligibility

**Method 2: Search by College Name**
• Enter specific college name or location
• Get detailed information about that institution

📊 **Detailed Information Provided:**
• **College Rankings** - National and state rankings
• **Location Details** - Address, campus facilities
• **Course Offerings** - All available programs
• **Fee Structure** - Semester/annual fees breakdown
• **Placement Statistics** - Placement rates and packages
• **Top Recruiters** - Companies that hire from the college
• **Faculty Quality** - Faculty-student ratio, qualifications
• **Campus Life** - Hostels, sports, cultural activities
• **Entrance Requirements** - Required exams and cutoffs
• **Admission Deadlines** - Important dates and timelines
• **Branch-wise Cutoffs** - Percentile requirements by branch
• **Official Links** - Direct links to college websites

🆓 **FREE Access:**
• This service is completely FREE for all registered users
• No premium subscription required
• Available immediately after registration

🎯 **How to Access:**
1. Register/Login to your CareerGenAI account
2. Go to Services → Top Colleges
3. Enter your criteria (percentile/course/location OR college name)
4. Click "Find Colleges" to get comprehensive results

**Ready to find your dream college?** Register now and start your FREE search!`,

      'how do i register and start': `**Registration & Getting Started Guide** (Step-by-Step):

📝 **Step 1: Free Registration**
• Click **'Register'** in the top navigation bar
• Fill in required details:
  - Full Name
  - Email Address
  - Mobile Number
  - Create Password
• Click **'Register'** button

📧 **Step 2: Email Verification**
• Check your email inbox for verification message
• You'll receive a **6-digit OTP code**
• Enter the OTP on the verification page
• Your account gets activated instantly

🔐 **Step 3: Login to Your Account**
• Click **'Login'** in the navigation bar
• Enter your registered email and password
• Access granted immediately after login

🎯 **Step 4: Explore Services**
• Click **'Services'** in the navigation menu
• You'll see all 10 services with badges:
  - 🆓 FREE services (8 available)
  - 💎 Premium services (2 available)
  - 🆕 New features marked
• Start with any FREE service immediately

🚀 **Step 5: Begin Your Journey**
• **Recommended First Steps:**
  1. Take the FREE Career Assessment
  2. Complete the Personality Quiz
  3. Search for colleges in your area
  4. Build your first resume
  5. Book FREE admission counselling if needed

💎 **Step 6: Upgrade When Ready** (Optional)
• Explore Premium features when you need advanced tools
• Secure payment via QR code system
• Instant access to premium content

📞 **Need Help?**
• Call: +91 8657869659 or +91 9619901999
• Available in website header for instant calling

**Ready to start?** Click 'Register' now and begin your career journey!`,

      'what are your contact numbers': `**CareerGenAI Contact Information:**

📞 **Primary Contact Numbers:**
• **+91 8657869659** - Main support line
• **+91 9619901999** - Alternative support line

📱 **How to Contact:**
• **Direct Calling:** Both numbers are clickable links in the website header
• **Available Hours:** Business hours for phone support
• **Response Time:** Immediate for calls, quick for other methods

💬 **24/7 Support Options:**
• **AI Chatbot** - That's me! Available 24/7 for instant help
• **Platform Queries** - Registration, login, service information
• **Technical Support** - Account issues, payment problems

🆓 **FREE Consultation Booking:**
• **Homepage Method:** Click the green "Book Now" button
• **Direct Call:** Use the numbers above
• **Available For:** Engineering, MBBS, MBA, Medical admissions

👨‍💼 **Paid Career Consultations:**
• **Booking:** Services → Career Counselling
• **Expert Selection:** Choose from available consultants
• **Scheduling:** Select convenient time slots

📧 **Other Contact Methods:**
• **Website Support:** Through the contact section
• **Service Inquiries:** Via the Services page
• **Account Help:** Through your profile section

🏢 **Office Information:**
• **Business Hours:** Standard business hours
• **Response Guarantee:** Quick response to all inquiries
• **Professional Support:** Trained career counselors available

**Need immediate help?** Call +91 8657869659 or chat with me right now!`,

      'premium': "Only 2 features require Premium: Career Roadmaps (downloadable guides) and Premium Resume Builder (6+ AI-powered templates). Plans: ₹1999 (1 month), ₹2999 (3 months), ₹3999 (1 year). All other 8 services are FREE!",

      // Technical - Based on actual platform
      'how it works': `Here's how **CareerGenAI** works:

1️⃣ **Register & Verify**
• Sign up for free with email verification
• Complete your profile information
• Access all free services immediately

2️⃣ **Explore Services**
• Take Career Assessment or Personality Quiz
• Get AI-powered career recommendations
• Chat with our AI assistant (that's me!)

3️⃣ **Discover Opportunities**
• Search top colleges by location and course
• Compare different career paths
• Build professional resumes

4️⃣ **Get Expert Guidance**
• Book FREE admission counselling
• Schedule paid career counselling sessions
• Download career roadmaps (Premium)

5️⃣ **Build Your Future**
• Follow personalized career paths
• Use our tools and resources
• Track your progress

Ready to start? Click 'Register' to begin your journey!`,

      'ai': "CareerGenAI uses advanced AI algorithms powered by OpenRouter API to analyze your interests, provide personalized career recommendations, generate resume content, suggest colleges, and offer 24/7 chat support through our intelligent chatbot system.",

      // Account - Based on actual registration process
      'account': `**Getting Started with CareerGenAI** (based on our actual registration process):

1️⃣ **Registration** (Completely Free!)
• Click 'Register' in the top navigation bar
• Fill in: Name, Email, Mobile Number, Password
• Click 'Register' button

2️⃣ **Email Verification** (Required)
• Check your email inbox for OTP verification
• You'll receive a 6-digit OTP code
• Enter the OTP on the verification page
• Account gets activated immediately

3️⃣ **Login & Access Services**
• Use 'Login' button with your email and password
• Access all 8 FREE services immediately
• No waiting period or approval needed

4️⃣ **Navigation**
• After login, you'll see 'Services' in the navigation
• Your profile icon appears in top-right corner
• Access Profile, History, and Logout options

5️⃣ **Premium Upgrade** (Optional)
• Upgrade anytime for Premium features
• Secure payment via QR code system
• Instant access to premium content

Ready to start? Click 'Register' in the top navigation!`,

      'login': "To login: Click 'Login' in the top navigation bar, enter your registered email and password. If you forgot password or don't have an account, click 'Register' to create a free account first.",
      'register': "Registration is 100% FREE! Click 'Register' in the navigation, provide your name, email, mobile, and password. You'll receive an OTP via email for verification. Once verified, you can access all free services immediately.",
      'signup': "Sign up process: 1) Click 'Register' 2) Fill name, email, mobile, password 3) Verify email with OTP 4) Login and access 8 FREE services: Career Assessment, Personality Quiz, AI Chatbot, Profile Builder, Top Colleges search, Career Comparison Tool, Standard Resume Builder, and FREE Admission Counselling.",

      // College Search - Corrected based on actual CollegesByLocation.js
      'college': `🏛️ TOP COLLEGES SEARCH - Explore top colleges based on your selected field:\n\n🔍 SEARCH METHOD 1: By Criteria\n• Enter your percentile (e.g., 92.5)\n• Enter course (e.g., MBA, B.Tech, B.E)\n• Enter location (e.g., Mumbai)\n• Get filtered results based on your eligibility\n\n🏫 SEARCH METHOD 2: By College Name\n• Enter specific college name or location\n• Get detailed information about that college\n\n📊 DETAILED INFORMATION PROVIDED:\n• College ranking and location\n• Course offerings and fees structure\n• Placement rates and top recruiters\n• Faculty quality and campus life details\n• Entrance exam requirements\n• Admission deadlines\n• Branch-wise cutoffs (percentile requirements)\n• Official website links\n\n💡 HOW IT WORKS:\n1. Register/Login to your account\n2. Go to 'Services' → 'Top Colleges'\n3. Enter your search criteria\n4. Click 'Find Colleges'\n5. Browse detailed results\n\n🆓 This service is completely FREE for all registered users! Which colleges are you interested in exploring?`,

      'top colleges': `🏛️ TOP COLLEGES SEARCH - Explore top colleges based on your selected field:\n\n🔍 SEARCH METHOD 1: By Criteria\n• Enter your percentile (e.g., 92.5)\n• Enter course (e.g., MBA, B.Tech, B.E)\n• Enter location (e.g., Mumbai)\n• Get filtered results based on your eligibility\n\n🏫 SEARCH METHOD 2: By College Name\n• Enter specific college name or location\n• Get detailed information about that college\n\n📊 DETAILED INFORMATION PROVIDED:\n• College ranking and location\n• Course offerings and fees structure\n• Placement rates and top recruiters\n• Faculty quality and campus life details\n• Entrance exam requirements\n• Admission deadlines\n• Branch-wise cutoffs (percentile requirements)\n• Official website links\n\n💡 HOW IT WORKS:\n1. Register/Login to your account\n2. Go to 'Services' → 'Top Colleges'\n3. Enter your search criteria\n4. Click 'Find Colleges'\n5. Browse detailed results\n\n🆓 This service is completely FREE for all registered users! Which colleges are you interested in exploring?`,

      'top colleges search': `🏛️ TOP COLLEGES SEARCH - Explore top colleges based on your selected field:\n\n🔍 SEARCH METHOD 1: By Criteria\n• Enter your percentile (e.g., 92.5)\n• Enter course (e.g., MBA, B.Tech, B.E)\n• Enter location (e.g., Mumbai)\n• Get filtered results based on your eligibility\n\n🏫 SEARCH METHOD 2: By College Name\n• Enter specific college name or location\n• Get detailed information about that college\n\n📊 DETAILED INFORMATION PROVIDED:\n• College ranking and location\n• Course offerings and fees structure\n• Placement rates and top recruiters\n• Faculty quality and campus life details\n• Entrance exam requirements\n• Admission deadlines\n• Branch-wise cutoffs (percentile requirements)\n• Official website links\n\n💡 HOW IT WORKS:\n1. Register/Login to your account\n2. Go to 'Services' → 'Top Colleges'\n3. Enter your search criteria\n4. Click 'Find Colleges'\n5. Browse detailed results\n\n🆓 This service is completely FREE for all registered users! Which colleges are you interested in exploring?`,

      'profile': `**Profile Builder** - Create your complete student career profile:

👤 **What You Can Build:**
• Personal Information & Contact Details
• Educational Background & Academic Records
• Skills & Competencies Assessment
• Career Interests & Goals
• Extracurricular Activities & Achievements
• Work Experience & Internships
• Projects & Portfolio Links

📊 **Profile Features:**
• Comprehensive student profile creation
• Track your academic and career progress
• Showcase your skills and achievements
• Connect with career opportunities
• Export profile for applications

🎯 **Benefits:**
• Organized career information in one place
• Better self - awareness of strengths
• Improved job / college application readiness
• Track your career development journey

🆓 **Access:** Services → Profile Builder(FREE for all users)

Ready to build your comprehensive career profile ? `,

      'comparison': `**Career Comparison Tool** - Compare salaries, demand, skills & scope between careers:

⚖️ **How It Works:**
• Select any 2 careers to compare side - by - side
• Get detailed analysis of both career paths
• Make informed decisions based on data

📊 **Comparison Categories:**
• **Duration** - Time required to establish career
• **Colleges** - Top institutions for each field
• **Fees** - Educational investment required
• **Placement Scope** - Job availability and market demand
• **Job Roles** - Specific positions and responsibilities
• **Skills Required** - Technical and soft skills needed
• **Entrance Exams** - Required tests and qualifications
• **Industry Demand** - Current and future market trends

💡 **Perfect For:**
• Students confused between 2 career options
• Understanding career trade - offs
• Making data - driven career decisions
• Comparing salary expectations

🆓 **Access:** Services → Career Comparison Tool(FREE for all users)

Which careers would you like to compare ? `,

      'premium resume': `**Premium Resume Builder** - Create modern, ATS - friendly Premium resumes:

💎 **Premium Features:**
• 6 + advanced professional templates
• AI - powered content suggestions
• Industry - specific optimization
• Advanced customization options
• Smart formatting and layout
• Enhanced design elements

🎨 **Premium Templates:**
• Template 1: Professional & Clean
• Template 2: Creative & Modern
• Template 3: Elegant & Sophisticated
• Template 4: Contemporary & Bold
• Template 5: Minimalist & Professional
• Template 6: Executive & Premium

🤖 **AI Assistance:**
• Smart content recommendations
• Industry - specific keywords
• Optimized for ATS systems
• Professional writing suggestions

💎 **Premium Access Required:**
• Requires Premium subscription
• Plans: ₹1999(1 month), ₹2999(3 months), ₹3999(1 year)

🚀 **Access:** Services → Premium Resume Builder

Ready to create a premium professional resume ? `,

      'roadmap': `**Career Roadmaps** provide:

🗺️ **Step - by - Step Guidance**
• Clear career progression paths
• Timeline for skill development
• Milestone achievements

📚 **Learning Resources**
• Recommended courses and certifications
• Books and online resources
• Practice projects and portfolios

💼 **Industry Insights**
• Current market trends
• Salary expectations
• Growth opportunities

🎯 **Personalized Plans**
• Based on your current level
• Customized to your goals
• Regular progress tracking

Which career field interests you most ? `,

      // Help and Support - Based on actual platform
      'help': `I can help you with CareerGenAI platform information:

🎯 **Our 10 Services**
• Career Assessment, Personality Quiz, AI Chatbot
• Career Counselling, Career Roadmaps, Profile Builder
• Top Colleges, Career Comparison, Resume Builders
• FREE Admission Counselling

📋 **Account Management**
• Registration process(free signup)
• Email verification with OTP
• Login / logout procedures
• Profile and history access

💰 **Pricing Information**
• Free services(8 available)
• Premium plans: ₹1999(1 month), ₹2999(3 months), ₹3999(1 year)
• Payment via QR code system

🔧 **Platform Navigation**
• How to access services after login
• Using the Services page
• Booking consultations
• Building resumes and profiles

📞 **Contact Information**
• Phone: +91 8657869659, +91 9619901999
• Available in top navigation bar

What specific aspect of CareerGenAI would you like to know about ? `,

      'contact': `**CareerGenAI Contact & Support**:

📞 **Phone Numbers** (Available in navigation bar)
• +91 8657869659
• +91 9619901999
• Direct calling links available on website

💬 **24 / 7 AI Support**
• This chatbot(available anytime)
• Instant responses about platform features
• No waiting time

🆓 **FREE Consultation Booking**
• Homepage → "Book Now" button
• Engineering, MBBS, MBA, Medical admission counselling
• Expert guidance available

👨‍💼 **Paid Career Consultations**
• Services → Career Counselling
• Choose from available expert consultants
• Book specific time slots

📧 **Platform Support**
• For technical issues with registration, login, or services
• Account - related queries
• Premium upgrade assistance

Which contact method works best for you ? `,

      // Common questions - Platform specific
      'how to start': "To get started with CareerGenAI: 1) Click 'Register' in navigation 2) Fill name, email, mobile, password 3) Verify email with OTP 4) Login with credentials 5) Access 'Services' to explore 8 free services 6) Upgrade to Premium for advanced features when ready!",
      'how to get started': `**Getting Started with CareerGenAI** (Step - by - step):

📝 **Step 1: Registration** (100 % Free)
• Click 'Register' in top navigation
• Fill: Name, Email, Mobile, Password
• Click 'Register' button

📧 **Step 2: Email Verification** • Check email for 6 - digit OTP
• Enter OTP on verification page
• Account activated instantly

🔐 **Step 3: Login**
• Click 'Login' in navigation
• Enter email + password
• Access granted immediately

🎯 **Step 4: Explore Services**
• Click 'Services' in navigation
• See all 10 services with badges(Free / Premium / New)
• Start with FREE Career Assessment or Personality Quiz

💡 **Step 5: Take Action**
• Complete assessments for career guidance
• Search colleges, build resumes
• Book FREE admission counselling
• Upgrade to Premium when ready

  **Ready to begin ?** Click 'Register' now and start your career journey!
    **Need help ?** Call + 91 8657869659 or + 91 9619901999`,
      'is it free': "Yes! CareerGenAI offers 8 completely FREE services: Career Assessment, Personality Quiz, AI Chatbot, Profile Builder, Top Colleges search, Career Comparison Tool, Standard Resume Builder, and FREE Admission Counselling. Only 2 features are Premium: Career Roadmaps and Premium Resume Builder.",
      'safe': "Yes! CareerGenAI uses secure registration with email verification (OTP system), secure login, and protected user data. Your information is safe and used only for providing career guidance services.",
      'mobile': "Yes! CareerGenAI is fully mobile-responsive. You can register, login, access all services, chat with AI, book consultations, and build resumes from your smartphone or tablet.",
      'navigation': "After login, you'll see: 1) 'Home' and 'Services' in navigation bar 2) Your profile icon (top-right) with Profile, History, Logout options 3) Phone numbers +91 8657869659, +91 9619901999 in header 4) Services page shows all 10 available services with badges (New, Premium, AI)",
      'website': "You're currently on CareerGenAI (www.careergenai.in) - an AI-powered career guidance platform for students from Class 8th to Graduation. We help with career decisions, college selection, resume building, and expert consultations.",

      'what are your contact numbers': `**CareerGenAI Contact Information:**

📞 **Primary Contact Numbers:**
• **+91 8657869659** - Main support line
• **+91 9619901999** - Alternative support line

📱 **How to Contact:**
• **Direct Calling:** Both numbers are clickable links in the website header
• **Available Hours:** Business hours for phone support
• **Response Time:** Immediate for calls, quick for other methods

💬 **24/7 Support Options:**
• **AI Chatbot** - That's me! Available 24/7 for instant help
• **Platform Queries** - Registration, login, service information
• **Technical Support** - Account issues, payment problems

🆓 **FREE Consultation Booking:**
• **Homepage Method:** Click the green "Book Now" button
• **Direct Call:** Use the numbers above
• **Available For:** Engineering, MBBS, MBA, Medical admissions

👨‍💼 **Paid Career Consultations:**
• **Booking:** Services → Career Counselling
• **Expert Selection:** Choose from available consultants
• **Scheduling:** Select convenient time slots

📧 **Other Contact Methods:**
• **Website Support:** Through the contact section
• **Service Inquiries:** Via the Services page
• **Account Help:** Through your profile section

🏢 **Office Information:**
• **Business Hours:** Standard business hours
• **Response Guarantee:** Quick response to all inquiries
• **Professional Support:** Trained career counselors available

  **Need immediate help?** Call +91 8657869659 or +91 9619901999 right now!`,

      // Goodbye
      'bye': "Goodbye! Feel free to return anytime for career guidance. Good luck with your career journey! 🚀",
      'thank you': "You're welcome! I'm here whenever you need career guidance. Best of luck with your professional journey! 😊",
      'thanks': "Happy to help! Don't hesitate to ask if you have more questions about your career path. 👍"
    };
    // Check for exact matches first
    if (responses[lowerMessage]) {
      return res.json({ reply: responses[lowerMessage] });
    }

    // Check for partial matches with priority - website specific
    const partialMatches = [
      // Exact phrase matches first (higher priority)
      { keywords: ['top colleges search'], response: responses['top colleges search'] },
      { keywords: ['top colleges'], response: responses['top colleges'] },
      { keywords: ['career assessment'], response: responses['how does career assessment work'] },
      { keywords: ['personality quiz'], response: responses['quiz'] },
      { keywords: ['resume builder'], response: responses['tell me about resume builder'] },
      { keywords: ['career counselling'], response: responses['consultation'] },
      { keywords: ['profile builder'], response: responses['profile'] },
      { keywords: ['career comparison'], response: responses['comparison'] },
      { keywords: ['ai chatbot'], response: responses['ai'] },
      { keywords: ['career roadmaps'], response: responses['roadmap'] },
      { keywords: ['premium resume'], response: responses['premium resume'] },
      { keywords: ['free admission counselling'], response: responses['free admission counselling'] },
      { keywords: ['pricing plans'], response: responses['pricing plans'] },
      { keywords: ['what services do you offer'], response: responses['what services do you offer'] },
      { keywords: ['what do you offer'], response: responses['what do you offer'] },
      { keywords: ['how do i register'], response: responses['how do i register and start'] },
      { keywords: ['contact numbers'], response: responses['what are your contact numbers'] },
      
      // General keyword matches (lower priority)
      { keywords: ['resume', 'cv', 'template'], response: responses['resume'] },
      { keywords: ['career', 'job', 'guidance'], response: responses['career'] },
      { keywords: ['price', 'cost', 'plan', 'premium', 'paid'], response: responses['price'] },
      { keywords: ['college', 'university', 'institution'], response: responses['college'] },
      { keywords: ['consultation', 'counselor', 'expert', 'counselling'], response: responses['consultation'] },
      { keywords: ['quiz', 'test', 'personality'], response: responses['quiz'] },
      { keywords: ['service', 'feature', 'offer'], response: responses['services'] },
      { keywords: ['help', 'support', 'assist'], response: responses['help'] },
      { keywords: ['contact', 'reach', 'phone', 'call'], response: responses['contact'] },
      { keywords: ['account', 'profile', 'register', 'signup', 'login'], response: responses['account'] },
      { keywords: ['free'], response: responses['free'] },
      { keywords: ['roadmap', 'path'], response: responses['roadmap'] }
    ];

    for (const match of partialMatches) {
      if (match.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return res.json({ reply: match.response });
      }
    }

    // Default response with CareerGenAI specific suggestions
    const defaultResponse = `🤖 I'd be happy to help with CareerGenAI! I can assist you with:\n\n🎯 OUR SERVICES - "What services do you offer?"\n📊 CAREER ASSESSMENT - "Tell me about career assessment"\n🧠 PERSONALITY QUIZ - "How does the personality quiz work?"\n🏛️ COLLEGE SEARCH - "How to find colleges?"\n📄 RESUME BUILDER - "How to build a resume?"\n👨‍💼 CONSULTATIONS - "Book FREE admission counselling"\n💰 PRICING - "What are your pricing plans?"\n📱 GETTING STARTED - "How do I register and start?"\n📞 CONTACT - "What are your contact numbers?"\n\nCould you please be more specific about what you'd like to know about CareerGenAI ? I'm here to help! 😊\n\nQUICK INFO: We offer 8 FREE services + 2 Premium services. Contact: +91 8657869659, +91 9619901999`;

res.json({ reply: defaultResponse });

  } catch (error) {
  console.error('Chatbot error:', error);
  res.status(500).json({
    error: 'Sorry, I encountered an error. Please try again or contact our support team.',
    reply: 'I apologize, but I\'m experiencing some technical difficulties. Please try asking your question again, or contact our support team at careergenai9@gmail.com for immediate assistance.'
  });
}
});

module.exports = router;