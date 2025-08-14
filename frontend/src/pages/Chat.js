import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import '../styles/Chat.css';
import PremiumPopup from '../components/PremiumPlans';
import { staticColleges } from '../data/staticColleges';
import PageLoader from '../components/PageLoader'; // ✅ NEW

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I’m your AI Career Assistant. Ask me anything about careers, courses, or colleges.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // ✅ NEW
  const [messageCount, setMessageCount] = useState(0);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const messagesEndRef = useRef(null);

  const API = process.env.REACT_APP_API_URL;

  // ✅ Simulate page load for effect
  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 1200); // 1.2s fake load
    return () => clearTimeout(timeout);
  }, []);

  // 🔄 Keep user info updated from DB
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser?.email) {
      fetch(`${API}/api/user/${localUser.email}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setUser(localUser);
        });
    }
  }, [API]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newCount = messageCount + 1;
    if (!user?.isPremium && newCount > 2) {
      setShowPremiumPopup(true);
      return;
    }

    setMessageCount(newCount);

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    // ✅ Try static match first
    const inputLC = input.toLowerCase().trim();

    let matchedCollege = staticColleges.find(clg => {
      const nameLC = clg.name.toLowerCase();
      const aliasMatch = clg.aliases?.some(alias => inputLC.includes(alias));
      const nameMatch = inputLC.includes(nameLC) || nameLC.includes(inputLC);
      return aliasMatch || nameMatch;
    });

    if (matchedCollege) {
      let cutOffsFormatted = 'No cutoffs available';
      if (matchedCollege.cutOffs && Object.keys(matchedCollege.cutOffs).length > 0) {
        cutOffsFormatted = Object.entries(matchedCollege.cutOffs)
          .map(([branch, cutoff]) => `   • ${branch}: ${cutoff || '-'}`)
          .join('\n');
      }

      const staticReply = `
✅ *College Found: ${matchedCollege.name}*
• 📍 Location: ${matchedCollege.location}
• 🎓 Courses: ${matchedCollege.course}
• 🏫 Type: ${matchedCollege.type}
• 📘 Affiliation: ${matchedCollege.affiliation}
• 💸 Fees: ${matchedCollege.fees}
• 📈 Placement Rate: ${matchedCollege.placementRate}
• 💼 Recruiters: ${matchedCollege.topRecruiters?.join(', ') || '-'}
• 🧑‍🏫 Faculty: ${matchedCollege.faculty}
• 🏕️ Campus Life: ${matchedCollege.campusLife}
• 📝 Entrance Exam: ${matchedCollege.entranceExam}
• 📅 Admission Deadline: ${matchedCollege.admissionDeadline || '-'}
• 🌐 Website: ${matchedCollege.website}
📊 *Branch-wise CutOffs:* ${cutOffsFormatted}
      `.trim();

      setMessages((prev) => [...prev, { sender: 'bot', text: staticReply }]);
      setLoading(false);
      return;
    }

    // ✅ Else, fallback to API
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "⚠️ Sorry, I couldn't understand that." },
        ]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Error connecting to AI service.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (pageLoading) {
    return <PageLoader />; // ✅ Use same reusable loader
  }

  return (
    <div className="chat-container">
      <div className="chat-box-wrapper">
        <div className="chat-header">🎓 CareerGenAI Assistant</div>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <div className="bot-response-card">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') || line.startsWith('-') ? 'list-line' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="user-message">{msg.text}</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot">
              <div className="bot-response-card">⏳ Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            {loading ? '...' : <FiSend size={20} />}
          </button>
        </div>
      </div>

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setMessageCount(0);
            setShowPremiumPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
