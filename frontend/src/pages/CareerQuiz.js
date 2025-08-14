import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/CareerQuiz.css';
import PremiumPopup from '../components/PremiumPlans';
import PageLoader from '../components/PageLoader'; // ✅ Import

export default function CareerQuiz() {
  const [showIntro, setShowIntro] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // ✅ new page loader state

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 1500); // 1.5s fake page load
    return () => clearTimeout(timeout);
  }, []);

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
          console.error("User fetch error:", err);
          setUser(localUser);
        });
    }
  }, [API]);

  useEffect(() => {
    if (!showIntro) fetchQuestions();
  }, [showIntro]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API}/api/quiz-questions`);
      setQuestions(res.data.questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleOption = (option) => {
    const updated = [...answers, option];
    if (updated.length === questions.length) {
      generateResult(updated);
    } else {
      setAnswers(updated);
      setIndex(prev => prev + 1);
    }
  };

  const generateResult = (answers) => {
    const scores = { thinker: 0, creator: 0, helper: 0, builder: 0 };
    answers.forEach(ans => {
      const lower = ans.toLowerCase();
      if (lower.includes('data') || lower.includes('research')) scores.thinker++;
      else if (lower.includes('creative') || lower.includes('design')) scores.creator++;
      else if (lower.includes('help') || lower.includes('social')) scores.helper++;
      else scores.builder++;
    });

    const top = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const resultData = {
      thinker: {
        title: "🧠 The Analytical Thinker",
        traits: ["Logical", "Analytical", "Detail-Oriented"],
        suggestion: "Consider roles like Data Scientist, Analyst, or Researcher",
        roadmap: ["Learn Python or R", "Master data visualization tools", "Build ML projects"],
        colleges: ["IIT Bombay", "ISI Kolkata", "IISc Bangalore"],
        color: "#e0f2fe"
      },
      creator: {
        title: "🎨 The Creative Innovator",
        traits: ["Imaginative", "Expressive", "Curious"],
        suggestion: "Explore paths like UX Designer, Writer, or Animator",
        roadmap: ["Learn design software", "Build a strong portfolio", "Intern at creative agencies"],
        colleges: ["NID Ahmedabad", "Pearl Academy", "MIT ID Pune"],
        color: "#fef3c7"
      },
      helper: {
        title: "💬 The Compassionate Helper",
        traits: ["Empathetic", "Communicative", "Supportive"],
        suggestion: "Great fit for careers in Counseling, HR, or Social Work",
        roadmap: ["Pursue psychology or social work", "Volunteer for NGOs", "Get certified in counseling"],
        colleges: ["TISS Mumbai", "DU", "Jamia Millia Islamia"],
        color: "#dcfce7"
      },
      builder: {
        title: "🔧 The Practical Builder",
        traits: ["Hands-On", "Problem-Solver", "Inventive"],
        suggestion: "Fields like Engineering, Mechanic, or Hardware Dev suit you",
        roadmap: ["Learn core engineering subjects", "Work on real projects", "Join tech clubs or events"],
        colleges: ["IIT Delhi", "BITS Pilani", "NIT Trichy"],
        color: "#fef9c3"
      }
    };

    setResult(resultData[top]);
  };

  const downloadPDF = () => {
    const resultEl = document.getElementById("quiz-result");
    html2canvas(resultEl).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(img, "PNG", 10, 10, 190, 0);
      pdf.save("career_result.pdf");
    });
  };

  if (pageLoading) {
    return <PageLoader />; // ✅ Reusable loader
  }

  if (showIntro) {
    return (
      <div className="quiz-intro animate-fadein">
        <h2>✨ Discover Your Career Personality</h2>
        <p>Take a short AI-powered quiz to reveal your strengths, traits, and best-fit careers.</p>
        <ul className="quiz-benefits">
          <li>✅ Personalized suggestions</li>
          <li>✅ AI-generated questions</li>
          <li>✅ Roadmap & Colleges</li>
          <li>✅ Downloadable PDF</li>
        </ul>
        <button
          className="btn-primary"
          onClick={() => {
            if (!user?.isPremium) {
              setShowPremiumPopup(true);
            } else {
              setShowIntro(false);
            }
          }}
        >
          🚀 Start My Quiz
        </button>

        {showPremiumPopup && (
          <PremiumPopup
            onClose={() => setShowPremiumPopup(false)}
            onUpgrade={() => {
              const updatedUser = JSON.parse(localStorage.getItem("user"));
              setUser(updatedUser);
              setShowPremiumPopup(false);
              setShowIntro(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container animate-fadein">
      <h2>Career Personality Quiz</h2>
      {!result ? (
        questions.length > 0 ? (
          <div className="question-card">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(index + 1) / questions.length * 100}%` }} />
            </div>
            <p className="q-count">Question {index + 1} of {questions.length}</p>
            <h3>{questions[index].question}</h3>
            <div className="options">
              {questions[index].options.map((opt, i) => (
                <button key={i} onClick={() => handleOption(opt)}>{opt}</button>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )
      ) : (
        <div id="quiz-result" className="result-section" style={{ background: result.color }}>
          <h3>{result.title}</h3>
          <p className="traits">Traits: {result.traits.join(', ')}</p>
          <p className="suggestion">{result.suggestion}</p>

          <div className="modal-section">
            <strong>📌 Roadmap to Begin:</strong>
            <ul>
              {result.roadmap.map((step, i) => (
                <li key={i}>👉 {step}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <strong>🏫 Top Indian Colleges:</strong>
            <ul>
              {result.colleges.map((college, i) => (
                <li key={i}>🎓 {college}</li>
              ))}
            </ul>
          </div>

          <button className="btn-primary" onClick={downloadPDF}>📄 Download Result</button>
        </div>
      )}
    </div>
  );
}
