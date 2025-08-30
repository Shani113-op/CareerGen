import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      showQuickReplies: true,
      showQuickActions: true,
      showMainMenuButton: false // Don't show main menu button on initial message since we have quick actions
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const optionsRef = useRef(null);

  const quickReplies = [
    "What services do you offer?",
    "How to get started?",
    "Pricing plans",
    "FREE admission counselling"
  ];

  const quickActions = [
    { text: "Our 10 Services", message: "What services do you offer?" },
    { text: "FREE Counselling", message: "Tell me about FREE admission counselling" },
    { text: "Career Assessment", message: "How does career assessment work?" },
    { text: "Resume Builder", message: "Tell me about resume builder" },
    { text: "College Search", message: "How to find colleges?" },
    { text: "Pricing Plans", message: "What are your pricing plans?" },
    { text: "Register Account", message: "How do I register and start?" },
    { text: "Contact Numbers", message: "What are your contact numbers?" },
    { text: "📋 Main Menu", message: "SHOW_MAIN_MENU" }
  ];

  const mainMenuOptions = [
    { text: "🎯 Our Services", message: "What services do you offer?" },
    { text: "💰 Pricing Plans", message: "What are your pricing plans?" },
    { text: "🚀 Get Started", message: "How do I register and start?" },
    { text: "📞 Contact Us", message: "What are your contact numbers?" },
    { text: "🆓 FREE Counselling", message: "Tell me about FREE admission counselling" },
    { text: "❓ Help & Support", message: "I need help with CareerGenAI platform" }
  ];

  const menuOptions = [
    { text: "Career Assessment (FREE)", icon: "🎯" },
    { text: "Personality Quiz (FREE)", icon: "🧠" },
    { text: "Resume Builder (FREE)", icon: "📄" },
    { text: "Top Colleges Search", icon: "🏛️" },
    { text: "Expert Consultations", icon: "👨‍💼" },
    { text: "Premium Features", icon: "⭐" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Priority scrolling: Always scroll to show the latest answer first
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    // Enhanced fallback responses - comprehensive coverage
    'hello': "Hello! Welcome to CareerGenAI - your AI-powered career companion. I can help you with our 10 services including Career Assessment, Personality Quiz, AI Chat, Expert Consultations, College Search, Resume Building, and FREE Admission Counselling. What interests you?",
    'hi': "Hi there! I'm your CareerGenAI assistant. Ready to explore our services? We offer everything from AI career guidance to expert consultations and college recommendations. How can I help?",
    'hey': "Hey! Welcome to CareerGenAI! I can guide you through our platform's features like Career Assessment, Resume Builder, College Search, and booking FREE admission counselling. What would you like to explore?",

    // Services
    'services': `🎯 CAREERGENAI - 10 COMPREHENSIVE SERVICES:\n\n🆓 FREE SERVICES (8 total) - Registration Required, No Money:\n🎯 Career Assessment - Get AI-powered career suggestions based on your interests\n🧠 Personality Quiz - Know your personality type and find matching careers\n🤖 AI Chatbot - Chat with our 24/7 AI career assistant [NEW]\n👨‍💼 Career Counselling - Book one-on-one sessions with certified career experts\n👤 Profile Builder - Create your complete student career profile\n🏛️ Top Colleges - Explore top colleges based on your selected field\n⚖️ Career Comparison Tool - Compare salaries, demand, skills & scope between careers [NEW]\n📄 Resume Builder - Create modern, ATS-friendly resumes using smart templates [AI]\n\n💎 PREMIUM SERVICES (2 total) - Paid Subscription:\n📋 Career Roadmaps - Download step-by-step guides for your dream career [PREMIUM]\n💎 Premium Resume Builder - Create modern, ATS-friendly Premium resumes using smart templates [PREMIUM]\n\n🎁 BONUS: FREE Admission Counselling for Engineering, MBBS, MBA, Medical courses (no registration required)!\n\n🔗 Quick Links:\n• Register Free: https://careergenai.com/register\n• Career Assessment: https://careergenai.com/interest-form\n• Resume Builder: https://careergenai.com/resume-templates\n• College Search: https://careergenai.com/colleges\n\nTO GET STARTED: Register (free, no payment) → Login → Access 8 Services\nPREMIUM PLANS: ₹1999 (1 month), ₹2999 (3 months), ₹3999 (1 year)\n\nWhich service would you like to explore first?`,

    'what services do you offer': `🎯 CAREERGENAI'S COMPLETE SERVICE PORTFOLIO:\n\n🆓 FREE SERVICES (8 total) - Registration Required, No Money:\n1. Career Assessment - Get AI-powered career suggestions based on your interests\n2. Personality Quiz - Know your personality type and find matching careers\n3. AI Chatbot - Chat with our 24/7 AI career assistant [NEW]\n4. Career Counselling - Book one-on-one sessions with certified career experts\n5. Profile Builder - Create your complete student career profile\n6. Top Colleges - Explore top colleges based on your selected field\n7. Career Comparison Tool - Compare salaries, demand, skills & scope between careers [NEW]\n8. Resume Builder - Create modern, ATS-friendly resumes using smart templates [AI]\n\n💎 PREMIUM SERVICES (2 total) - Paid Subscription:\n9. Career Roadmaps - Download step-by-step guides for your dream career [PREMIUM]\n10. Premium Resume Builder - Create modern, ATS-friendly Premium resumes using smart templates [PREMIUM]\n\n🎁 BONUS: FREE Admission Counselling (Engineering/MBBS/MBA/Medical) - no registration required!\n\n🔗 Quick Access:\n• Register Free: https://careergenai.com/register\n• Career Assessment: https://careergenai.com/interest-form\n• Resume Builder: https://careergenai.com/resume-templates\n• College Search: https://careergenai.com/colleges\n\nGETTING STARTED: Register free (no payment) → Login → Access 8 free services immediately\nPREMIUM UPGRADE: Unlock 2 additional premium features\nCONTACT: +91 8657869659, +91 9619901999\n\nWhich service interests you most?`,

    // Career Assessment
    'career assessment': `🎯 CAREER ASSESSMENT - AI-Powered Career Discovery (FREE!):\n\n🧠 How It Works:\n• Choose from 18 career interests: Mathematics, Designing, Helping People, Coding, Writing, Nature, Management, Science, Art, Technology, Health, Business, Communication, Research, Analysis, Problem Solving, Teaching, Creativity\n• AI analyzes your selections using advanced algorithms\n• Get personalized career recommendations\n\n📊 What You Receive:\n• Career categories matching your interests\n• Detailed career descriptions\n• Required skills for each path\n• Education roadmap\n• Salary expectations\n• Top colleges for each field\n\n🆓 Access: Services → Career Assessment (FREE for all users)\n\nReady to discover your ideal career path?`,

    'career': `🎯 CAREERGENAI'S CAREER GUIDANCE SYSTEM:\n\n🎯 CAREER ASSESSMENT (FREE!)\n• Get AI-powered career suggestions based on your interests\n• Select from 18 interests and get detailed recommendations\n• Includes career categories, skills, education roadmap, salary expectations\n\n📊 PERSONALITY QUIZ (FREE!)\n• Discover your personality type: Analytical Thinker, Creative Innovator, Compassionate Helper, or Practical Builder\n• Get matching career suggestions and downloadable PDF results\n\n⚖️ CAREER COMPARISON TOOL (FREE!)\n• Compare salaries, demand, skills & scope between careers\n• Analyze duration, colleges, fees, placement scope, job roles\n\nAll career guidance tools are completely FREE for registered users!`,

    // Resume Builder
    'resume': `📄 CAREERGENAI RESUME BUILDERS:\n\n📄 STANDARD RESUME BUILDER (FREE)\n• Professional templates\n• ATS-friendly formats\n• Basic customization\n• PDF download\n• Access via 'Resume Templates' menu\n\n💎 PREMIUM RESUME BUILDER (Premium)\n• 6+ advanced templates with AI assistance\n• Smart content suggestions\n• Industry-specific optimization\n• Advanced customization options\n\n🎨 AVAILABLE TEMPLATES:\n• Template 1 - Professional & Clean\n• Template 2 - Creative & Modern\n• Template 3 - Elegant & Sophisticated\n• Template 4 - Contemporary & Bold\n• Template 5 - Minimalist & Professional\n• Template 6 - Executive & Premium\n\nAll templates are ATS-friendly and mobile responsive. Ready to create your professional resume?`,

    'resume builder': "We have both Standard (FREE) and Premium Resume Builders! The standard version offers professional templates, while Premium includes 6+ advanced templates with AI assistance. Visit 'Resume Templates' for standard or 'Premium Resume Builder' for advanced features.",

    // College Search
    'college': `🏛️ TOP COLLEGES SEARCH - Find Your Perfect College (FREE!):\n\n🔍 Two Search Methods:\n\nMethod 1: By Criteria\n• Enter percentile (e.g., 92.5)\n• Enter course (e.g., MBA, B.Tech, B.E)\n• Enter location (e.g., Mumbai)\n• Get filtered results based on eligibility\n\nMethod 2: By College Name\n• Enter specific college name\n• Get detailed information\n\n📊 Information Provided:\n• College rankings and location\n• Course offerings and fees\n• Placement rates and top recruiters\n• Faculty quality and campus life\n• Entrance requirements and cutoffs\n• Official website links\n\n🆓 Access: Services → Top Colleges (FREE for all users)\n\nWhich colleges are you interested in exploring?`,

    'top colleges': `🏛️ TOP COLLEGES SEARCH - Explore top colleges based on your selected field:\n\n🔍 SEARCH METHOD 1: By Criteria\n• Enter your percentile (e.g., 92.5)\n• Enter course (e.g., MBA, B.Tech, B.E)\n• Enter location (e.g., Mumbai)\n• Get filtered results based on your eligibility\n\n🏫 SEARCH METHOD 2: By College Name\n• Enter specific college name or location\n• Get detailed information about that college\n\n📊 DETAILED INFORMATION PROVIDED:\n• College ranking and location\n• Course offerings and fees structure\n• Placement rates and top recruiters\n• Faculty quality and campus life details\n• Entrance exam requirements\n• Admission deadlines\n• Branch-wise cutoffs (percentile requirements)\n• Official website links\n\n💡 HOW IT WORKS:\n1. Register/Login to your account\n2. Go to 'Services' → 'Top Colleges'\n3. Enter your search criteria\n4. Click 'Find Colleges'\n5. Browse detailed results\n\n🆓 This service is completely FREE for all registered users! Which colleges are you interested in exploring?`,

    // Pricing
    'pricing plans': `💰 CAREERGENAI PRICING STRUCTURE:\n\n🆓 FREE SERVICES (8 total) - Registration Required, No Money\n✅ Career Assessment - AI-powered career suggestions\n✅ Personality Quiz - Know your personality type\n✅ AI Chatbot - 24/7 AI career assistant\n✅ Career Counselling - Book sessions with experts\n✅ Profile Builder - Complete student profile\n✅ Top Colleges - Explore colleges by field\n✅ Career Comparison Tool - Compare career paths\n✅ Resume Builder - ATS-friendly templates\n✅ FREE Admission Counselling - Engineering/MBBS/MBA/Medical (No registration needed!)\n\n💎 PREMIUM PLANS (2 Additional Services) - Paid Subscription\n📋 Career Roadmaps - Step-by-step career guides\n💎 Premium Resume Builder - 6+ AI-powered templates\n\n💰 Premium Subscription Options:\n🥉 1 Month - ₹1999 (Quick exploration)\n🥈 3 Months - ₹2999 (MOST POPULAR - Save 33%)\n🥇 1 Year - ₹3999 (BEST VALUE - Save 83%)\n\n🔗 Get Started:\n• Register Free: https://careergenai.com/register\n• View Pricing: https://careergenai.com/pricing\n\n🔒 Secure payment • Cancel anytime\nReady to explore our free services?`,

    'price': "CareerGenAI offers 8 FREE services including Career Assessment, Personality Quiz, AI Chatbot, College Search, and Resume Builder. Only 2 features are Premium: Career Roadmaps and Premium Resume Builder. Premium plans: ₹1999 (1 month), ₹2999 (3 months), ₹3999 (1 year).",

    // Contact & Registration
    'contact': "📞 Contact CareerGenAI: +91 8657869659, +91 9619901999 (clickable in website header). For FREE admission counselling, click 'Book Now' on homepage. Available for Engineering, MBBS, MBA, Medical courses.",

    'how do i register': `📝 REGISTRATION & GETTING STARTED (Step-by-Step):\n\n1️⃣ Free Registration (No Payment Required)\n• Visit: https://careergenai.com/register\n• Fill: Name, Email, Mobile, Password\n• Click 'Register' button\n\n2️⃣ Email Verification\n• Check email for 6-digit OTP\n• Enter OTP on verification page\n• Account activated instantly\n\n3️⃣ Login & Access\n• Visit: https://careergenai.com/login\n• Access all 8 FREE services immediately (no money required)\n\n4️⃣ Explore Services\n• Career Assessment: https://careergenai.com/interest-form\n• Resume Builder: https://careergenai.com/resume-templates\n• College Search: https://careergenai.com/colleges\n• Expert Counselling: https://careergenai.com/consult\n\n🔗 Quick Links:\n• Register: https://careergenai.com/register\n• Login: https://careergenai.com/login\n\n📞 Need help? Call +91 8657869659 or +91 9619901999\nReady to start your career journey?`,

    'register': "Registration is 100% FREE (no payment required)! Visit https://careergenai.com/register, provide name, email, mobile, password. You'll receive OTP via email for verification. Once verified, access all 8 free services immediately.",

    // Free Services
    'free': "Yes! 8 services are completely FREE (just register, no payment): Career Assessment, Personality Quiz, AI Chatbot, Career Counselling, Profile Builder, Top Colleges, Career Comparison Tool, Resume Builder, and FREE Admission Counselling (no registration needed).",

    'free admission counselling': `🆓 FREE ADMISSION COUNSELLING (Completely Free!):\n\n🎓 Available For:\n• Engineering courses (B.Tech, B.E)\n• MBBS (Medical courses)\n• MBA (Management courses)\n• Medical entrance preparation\n\n👨‍🎓 What You Get:\n• Expert guidance on course selection\n• College recommendations based on your profile\n• Admission process support and strategy\n• Entrance exam preparation tips\n• Application assistance\n\n📍 How to Book:\n1. Visit CareerGenAI homepage\n2. Click green "Book Now" button\n3. Schedule your FREE session\n4. Get expert consultation at zero cost\n\n📞 Direct Contact: +91 8657869659, +91 9619901999\n\nNo registration required for this service!`,

    // Premium
    'premium': "Only 2 features require Premium: Career Roadmaps (downloadable step-by-step guides) and Premium Resume Builder (6+ AI-powered templates). Plans: ₹1999 (1 month), ₹2999 (3 months), ₹3999 (1 year). All other 8 services are FREE!",

    // Help & Menu
    'help': "I can help with CareerGenAI platform info: our 10 services, pricing (8 FREE + 2 Premium), registration process, contact numbers, and how to access features. What would you like to know?",

    'SHOW_MAIN_MENU': "Here are the main options you can choose from:"
  };


  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    // Remove quick replies from previous messages
    const updatedMessages = messages.map(msg => ({
      ...msg,
      showQuickReplies: false,
      showQuickActions: false,
      showMainMenu: false,
      showMainMenuButton: false
    }));
    setMessages([...updatedMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowMenu(false);

    try {
      // Connect to Python FastAPI backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI Response:', data); // Debug log

        const isShowingMainMenu = messageToSend === "SHOW_MAIN_MENU";
        const botResponse = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bot',
          timestamp: new Date(),
          showMenu: false, // Disable old menu system
          showMainMenuButton: true,
          showMainMenu: isShowingMainMenu,
          // Add AI metadata if available
          intent: data.intent,
          confidence: data.confidence,
          suggestions: data.suggestions
        };
        setMessages(prev => [...prev, botResponse]);
        setShowMenu(false);
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend connection error:', error);

      // Show connection error message instead of fallback
      const errorResponse = {
        id: Date.now() + 1,
        text: `🔌 **Connection Issue**: I'm having trouble connecting to my AI brain! 

**Please ensure:**
1. Python backend is running: \`uvicorn chatbot:app --reload\`
2. Backend is accessible at: http://localhost:5000
3. Check browser console for detailed errors

**Quick Fix:**
\`\`\`bash
cd careerGenAi/backend
pip install -r requirements.txt
uvicorn chatbot:app --reload
\`\`\`

Once the backend is running, I'll provide intelligent, personalized career guidance! 🤖✨`,
        sender: 'bot',
        timestamp: new Date(),
        showMenu: false,
        showMainMenuButton: false,
        showMainMenu: false
      };
      setMessages(prev => [...prev, errorResponse]);
      setShowMenu(false);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleQuickAction = (message) => {
    handleSendMessage(message);
  };

  const handleMenuOption = (option) => {
    handleSendMessage(option.text);
  };

  const handleMainMenuOption = (option) => {
    handleSendMessage(option.message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to render text with Markdown formatting and clickable links
  const renderMessageWithFormatting = (text) => {
    // Handle line breaks and split into lines for processing
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Skip empty lines
      if (line.trim() === '') {
        return <br key={`br-${lineIndex}`} />;
      }
      
      // Process each line for inline formatting
      const segments = [];
      let currentIndex = 0;
      
      // Combined regex for bold, italic, links
      const combinedRegex = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s]+|\/[^\s]*)/g;
      let match;
      
      while ((match = combinedRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > currentIndex) {
          segments.push({
            type: 'text',
            content: line.slice(currentIndex, match.index),
            key: `text-${lineIndex}-${segments.length}`
          });
        }
        
        const matchedText = match[0];
        
        // Check what type of formatting this is
        if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
          // Bold text
          segments.push({
            type: 'bold',
            content: matchedText.slice(2, -2),
            key: `bold-${lineIndex}-${segments.length}`
          });
        } else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
          // Italic text (but not bold)
          segments.push({
            type: 'italic',
            content: matchedText.slice(1, -1),
            key: `italic-${lineIndex}-${segments.length}`
          });
        } else if (matchedText.match(/https?:\/\/[^\s]+|\/[^\s]*/)) {
          // URL or relative path
          const isRelativePath = matchedText.startsWith('/');
          segments.push({
            type: 'link',
            content: matchedText,
            isRelativePath: isRelativePath,
            key: `link-${lineIndex}-${segments.length}`
          });
        }
        
        currentIndex = match.index + matchedText.length;
      }
      
      // Add remaining text
      if (currentIndex < line.length) {
        segments.push({
          type: 'text',
          content: line.slice(currentIndex),
          key: `text-${lineIndex}-${segments.length}`
        });
      }
      
      // If no formatting found in this line, return the original line
      if (segments.length === 0) {
        return <span key={`line-${lineIndex}`}>{line}</span>;
      }
      
      // Render the segments for this line
      const renderedLine = segments.map((segment) => {
        switch (segment.type) {
          case 'bold':
            return <strong key={segment.key} style={{ fontWeight: '600', color: '#374151' }}>{segment.content}</strong>;
          case 'italic':
            return <em key={segment.key} style={{ fontStyle: 'italic' }}>{segment.content}</em>;
          case 'link':
            return (
              <a
                key={segment.key}
                href={segment.content}
                target={segment.isRelativePath ? "_self" : "_blank"}
                rel={segment.isRelativePath ? "" : "noopener noreferrer"}
                style={{
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {segment.content}
              </a>
            );
          case 'text':
          default:
            return segment.content;
        }
      });
      
      return <span key={`line-${lineIndex}`}>{renderedLine}</span>;
    });
  };


  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="chatbot-toggle">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chatbot-toggle-btn"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar-header">
              <div className="chatbot-bot-avatar">
                🤖
              </div>
              <div className="chatbot-header-text">
                <h3>CareerGenAI</h3>
                <p>You can ask me anything</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages-area">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message-wrapper ${message.sender}`}>
                {message.sender === 'bot' && (
                  <div className="chatbot-message-avatar">
                    <div className="chatbot-bot-icon">🤖</div>
                  </div>
                )}

                <div className={`chatbot-message-bubble ${message.sender}`}>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    {renderMessageWithFormatting(message.text)}
                  </p>

                  {/* Quick Reply Buttons */}
                  {message.showQuickReplies && (
                    <div className="chatbot-quick-replies">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="chatbot-quick-reply-btn"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  {message.showQuickActions && (
                    <div className="chatbot-quick-actions">
                      <div className="chatbot-quick-actions-label">Quick actions:</div>
                      <div className="chatbot-quick-actions-grid">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(action.message)}
                            className="chatbot-quick-action-button"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Menu Options - Only shown when specifically requested */}
                  {message.showMainMenu && (
                    <div className="chatbot-main-menu">
                      <div className="chatbot-main-menu-label">📋 Main Menu - Choose an option:</div>
                      <div className="chatbot-main-menu-grid">
                        {mainMenuOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleMainMenuOption(option)}
                            className="chatbot-main-menu-button"
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Menu Button - Single button option after answers */}
                  {message.showMainMenuButton && (
                    <div className="chatbot-main-menu-single">
                      <button
                        onClick={() => handleQuickAction("SHOW_MAIN_MENU")}
                        className="chatbot-main-menu-single-button"
                      >
                        📋 Main Menu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Menu Options */}
            {showMenu && (
              <div className="chatbot-menu-options">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuOption(option)}
                    className="chatbot-menu-option"
                  >
                    <span className="chatbot-menu-icon">{option.icon}</span>
                    <span className="chatbot-menu-text">{option.text}</span>
                    <ChevronRight size={16} className="chatbot-menu-arrow" />
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chatbot-message-wrapper bot">
                <div className="chatbot-message-avatar">
                  <div className="chatbot-bot-icon">🤖</div>
                </div>
                <div className="chatbot-typing-indicator">
                  <div className="chatbot-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            <div ref={optionsRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="chatbot-input-field"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="chatbot-send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;