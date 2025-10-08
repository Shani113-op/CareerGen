import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import './chatbot.css';

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

  // Minimal fallback responses - backend should handle most responses
  // const predefinedResponses = {
  //   'hello': "Hello! Welcome to CareerGenAI. I'm connecting to my AI brain to give you the best career guidance. How can I help you today?",
  //   'hi': "Hi there! I'm your CareerGenAI assistant. Let me connect to provide you with comprehensive career guidance. What would you like to know?",
  //   'hey': "Hey! Welcome to CareerGenAI! I'm getting ready to help you with career guidance. What can I assist you with?",
  //   'help': "I can help with CareerGenAI platform info, services, pricing, registration, and career guidance. What would you like to know?",
  //   'SHOW_MAIN_MENU': "Here are the main options you can choose from:"
  // };


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

    // Define backend URL outside try-catch for error message access
    const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'https://chatbot-python-backend-3.onrender.com';
    const backendUrl = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl;

    try {
      // Connect to Python FastAPI backend
      const response = await fetch(`${backendUrl}/chat`, {
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
1. Python backend is running: \`uvicorn chatbot:app --reload --port 8000\`
2. Backend is accessible at: ${backendUrl}
3. Check browser console for detailed errors

**Quick Fix:**
\`\`\`bash
cd careerGenAi/backend
pip install -r requirements.txt
uvicorn chatbot:app --reload --port 8000
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

  // Simple function to format message text with basic React elements
  const formatMessageSimple = (text) => {
    // Split text into lines and process each line
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Handle empty lines
      if (line.trim() === '') {
        return <br key={`br-${lineIndex}`} />;
      }
      
      // Process bold text and links in the line
      const parts = [];
      let partIndex = 0;
      
      // Simple bold text replacement
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the bold
        if (match.index > lastIndex) {
          const beforeText = line.slice(lastIndex, match.index);
          if (beforeText) {
            parts.push(<span key={`text-${lineIndex}-${partIndex++}`}>{beforeText}</span>);
          }
        }
        
        // Add bold text
        parts.push(
          <strong 
            key={`bold-${lineIndex}-${partIndex++}`} 
            style={{ fontWeight: '600', color: '#1F2937' }}
          >
            {match[1]}
          </strong>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        const remainingText = line.slice(lastIndex);
        if (remainingText) {
          parts.push(<span key={`text-${lineIndex}-${partIndex++}`}>{remainingText}</span>);
        }
      }
      
      // If no bold text found, just return the line
      if (parts.length === 0) {
        parts.push(<span key={`text-${lineIndex}-0`}>{line}</span>);
      }
      
      // Process links in the parts
      const finalParts = parts.map((part, index) => {
        if (typeof part.props.children === 'string') {
          const text = part.props.children;
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const urlMatch = urlRegex.exec(text);
          
          if (urlMatch) {
            const beforeUrl = text.slice(0, urlMatch.index);
            const url = urlMatch[0];
            const afterUrl = text.slice(urlMatch.index + url.length);
            
            return (
              <span key={`${part.key}-link`}>
                {beforeUrl}
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  {url}
                </a>
                {afterUrl}
              </span>
            );
          }
        }
        return part;
      });
      
      return (
        <div key={`line-${lineIndex}`} style={{ marginBottom: lineIndex < lines.length - 1 ? '0.5em' : '0' }}>
          {finalParts}
        </div>
      );
    });
  };

  // Function to render text with Markdown formatting and clickable links
  // const renderMessageWithFormatting = (text) => {
  //   // Handle line breaks and split into lines for processing
  //   const lines = text.split('\n');
    
  //   return lines.map((line, lineIndex) => {
  //     // Skip empty lines but add line break
  //     if (line.trim() === '') {
  //       return <br key={`br-${lineIndex}`} />;
  //     }
      
  //     // Process each line for inline formatting
  //     const segments = [];
  //     let currentIndex = 0;
      
  //     // Combined regex for bold, italic, links
  //     const combinedRegex = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s]+|\/[^\s]*)/g;
  //     let match;
      
  //     while ((match = combinedRegex.exec(line)) !== null) {
  //       // Add text before the match
  //       if (match.index > currentIndex) {
  //         segments.push({
  //           type: 'text',
  //           content: line.slice(currentIndex, match.index),
  //           key: `text-${lineIndex}-${segments.length}`
  //         });
  //       }
        
  //       const matchedText = match[0];
        
  //       // Check what type of formatting this is
  //       if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
  //         // Bold text
  //         segments.push({
  //           type: 'bold',
  //           content: matchedText.slice(2, -2),
  //           key: `bold-${lineIndex}-${segments.length}`
  //         });
  //       } else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
  //         // Italic text (but not bold)
  //         segments.push({
  //           type: 'italic',
  //           content: matchedText.slice(1, -1),
  //           key: `italic-${lineIndex}-${segments.length}`
  //         });
  //       } else if (matchedText.match(/https?:\/\/[^\s]+|\/[^\s]*/)) {
  //         // URL or relative path
  //         const isRelativePath = matchedText.startsWith('/');
  //         segments.push({
  //           type: 'link',
  //           content: matchedText,
  //           isRelativePath: isRelativePath,
  //           key: `link-${lineIndex}-${segments.length}`
  //         });
  //       }
        
  //       currentIndex = match.index + matchedText.length;
  //     }
      
  //     // Add remaining text
  //     if (currentIndex < line.length) {
  //       segments.push({
  //         type: 'text',
  //         content: line.slice(currentIndex),
  //         key: `text-${lineIndex}-${segments.length}`
  //       });
  //     }
      
  //     // If no formatting found in this line, return the original line with line break
  //     if (segments.length === 0) {
  //       return (
  //         <React.Fragment key={`line-${lineIndex}`}>
  //           {line}
  //           {lineIndex < lines.length - 1 && <br />}
  //         </React.Fragment>
  //       );
  //     }
      
  //     // Render the segments for this line
  //     const renderedLine = segments.map((segment) => {
  //       switch (segment.type) {
  //         case 'bold':
  //           return <strong key={segment.key} style={{ fontWeight: '600', color: '#374151' }}>{segment.content}</strong>;
  //         case 'italic':
  //           return <em key={segment.key} style={{ fontStyle: 'italic' }}>{segment.content}</em>;
  //         case 'link':
  //           return (
  //             <a
  //               key={segment.key}
  //               href={segment.content}
  //               target={segment.isRelativePath ? "_self" : "_blank"}
  //               rel={segment.isRelativePath ? "" : "noopener noreferrer"}
  //               style={{
  //                 color: '#007bff',
  //                 textDecoration: 'underline',
  //                 cursor: 'pointer'
  //               }}
  //             >
  //               {segment.content}
  //             </a>
  //           );
  //         case 'text':
  //         default:
  //           return segment.content;
  //       }
  //     });
      
  //     return (
  //       <React.Fragment key={`line-${lineIndex}`}>
  //         {renderedLine}
  //         {lineIndex < lines.length - 1 && <br />}
  //       </React.Fragment>
  //     );
  //   });
  // };


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
                  <div style={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: '1.5',
                    fontSize: '14px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}>
                    {formatMessageSimple(message.text)}
                  </div>

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