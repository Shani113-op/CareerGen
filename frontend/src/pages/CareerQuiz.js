import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Trophy,
  BookOpen,
  Play,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect } from "react";



const CareerQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const navigate = useNavigate();
  


 useEffect(() => {
    const savedResult = localStorage.getItem("careerQuizResult");
    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      setShowResults(parsed);
      setCurrentScreen("results");
    }
  }, []);

  // ✅ Add this below your existing useEffect
  const quotes = [
    "“Your career journey begins with understanding yourself.”",
    "“Every answer brings you closer to your true calling.”",
    "“Trust your instincts — they know the way.”",
    "“Be honest with yourself, that’s where clarity begins.”",
    "“Your passion is waiting for your courage to catch up.”"
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  const questions = [
    {
      id: 1,
      text: "I enjoy solving logical or technical problems using computers or tools.",
      personality: "Introvert",
      bestPaths: ["Technology & Engineering"]
    },
    {
      id: 2,
      text: "I like organizing people, planning projects, or leading teams.",
      personality: "Extrovert",
      bestPaths: ["Business & Management"]
    },
    {
      id: 3,
      text: "I find joy in creating designs, music, or visual art to express ideas.",
      personality: "Introvert",
      bestPaths: ["Creative Arts & Design"]
    },
    {
      id: 4,
      text: "I feel fulfilled when helping others improve their health or well-being.",
      personality: "Extrovert",
      bestPaths: ["Healthcare & Medicine"]
    },
    {
      id: 5,
      text: "I like explaining concepts clearly and helping others learn something new.",
      personality: "Extrovert",
      bestPaths: ["Teaching & Education"]
    },
    {
      id: 6,
      text: "I enjoy debating, solving conflicts, or standing up for justice.",
      personality: "Extrovert",
      bestPaths: ["Law & Public Service"]
    },
    {
      id: 7,
      text: "I feel connected to nature and enjoy activities like farming, gardening, or working outdoors.",
      personality: "Introvert",
      bestPaths: ["Environment & Agriculture"]
    },
    {
      id: 8,
      text: "I like analyzing data, managing money, or planning financial strategies.",
      personality: "Introvert",
      bestPaths: ["Finance & Accounting"]
    },
    {
      id: 9,
      text: "I am passionate about sports, fitness, or maintaining a healthy lifestyle.",
      personality: "Extrovert",
      bestPaths: ["Sports & Fitness"]
    },
    {
      id: 10,
      text: "I enjoy sharing ideas, writing, or speaking in front of audiences.",
      personality: "Extrovert",
      bestPaths: ["Media & Communication"]
    },
    {
      id: 11,
      text: "I often experiment with coding, gadgets, or digital systems for fun.",
      personality: "Introvert",
      bestPaths: ["Technology & Engineering"]
    },
    {
      id: 12,
      text: "I feel motivated when managing or marketing a new product or service.",
      personality: "Extrovert",
      bestPaths: ["Business & Management", "Media & Communication"]
    },
    {
      id: 13,
      text: "I pay attention to small details and like working with numbers or reports.",
      personality: "Introvert",
      bestPaths: ["Finance & Accounting", "Technology & Engineering"]
    },
    {
      id: 14,
      text: "I enjoy designing posters, logos, videos, or other creative content.",
      personality: "Introvert",
      bestPaths: ["Creative Arts & Design", "Media & Communication"]
    },
    {
      id: 15,
      text: "I am interested in learning how the human body or mind works.",
      personality: "Introvert",
      bestPaths: ["Healthcare & Medicine", "Teaching & Education"]
    },
    {
      id: 16,
      text: "I like helping people make better life, career, or personal decisions.",
      personality: "Extrovert",
      bestPaths: ["Teaching & Education", "Law & Public Service"]
    },
    {
      id: 17,
      text: "I would enjoy working with plants, animals, or sustainable environmental projects.",
      personality: "Introvert",
      bestPaths: ["Environment & Agriculture"]
    },
    {
      id: 18,
      text: "I am confident in speaking, convincing others, or presenting new ideas.",
      personality: "Extrovert",
      bestPaths: ["Business & Management", "Media & Communication"]
    },
    {
      id: 19,
      text: "I enjoy working independently and focusing on deep problem-solving tasks.",
      personality: "Introvert",
      bestPaths: ["Technology & Engineering", "Finance & Accounting"]
    },
    {
      id: 20,
      text: "I prefer practical, hands-on activities over sitting at a desk all day.",
      personality: "Extrovert",
      bestPaths: ["Sports & Fitness", "Environment & Agriculture"]
    },
    {
      id: 21,
      text: "I like researching laws, government policies, or social issues.",
      personality: "Introvert",
      bestPaths: ["Law & Public Service"]
    },
    {
      id: 22,
      text: "I am comfortable working in a fast-paced, competitive business environment.",
      personality: "Extrovert",
      bestPaths: ["Business & Management", "Finance & Accounting"]
    },
    {
      id: 23,
      text: "I enjoy mentoring or guiding younger students or teammates.",
      personality: "Extrovert",
      bestPaths: ["Teaching & Education", "Sports & Fitness"]
    },
    {
      id: 24,
      text: "I stay updated on new technologies, gadgets, or software trends.",
      personality: "Introvert",
      bestPaths: ["Technology & Engineering"]
    },
    {
      id: 25,
      text: "I often think about how art, design, or media can influence society.",
      personality: "Introvert",
      bestPaths: ["Creative Arts & Design", "Media & Communication"]
    }
  ];


  const calculateResults = () => {
  let introvertScore = 0;
  let extrovertScore = 0;
  const pathScores = {};

  Object.entries(answers).forEach(([id, value]) => {
    const q = questions.find((x) => x.id === parseInt(id));
    if (q) {
      if (q.personality === "Introvert") introvertScore += value;
      else extrovertScore += value;

      q.bestPaths.forEach((path) => {
        if (!pathScores[path]) pathScores[path] = 0;
        pathScores[path] += value;
      });
    }
  });

  const personalityType =
    introvertScore >= extrovertScore ? "Introvert" : "Extrovert";

  const maxScore = Math.max(...Object.values(pathScores));
  const percentageScores = Object.entries(pathScores).map(([k, v]) => [
    k,
    Math.round((v / maxScore) * 100),
  ]);

  const topPaths = percentageScores.sort(([, a], [, b]) => b - a).slice(0, 5);

  const resultData = {
    personalityType,
    topPaths,
    allScores: percentageScores,
  };

  // ✅ Save to localStorage
  localStorage.setItem("careerQuizResult", JSON.stringify(resultData));

  setShowResults(resultData);
  setCurrentScreen("results");
};


  const startQuiz = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentScreen("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (id, val) => setAnswers({ ...answers, [id]: val });
  const nextQuestion = () =>
    currentQuestion < shuffledQuestions.length - 1
      ? setCurrentQuestion(currentQuestion + 1)
      : calculateResults();
  const prevQuestion = () =>
    currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1);
  const goToHome = () => {
    setCurrentScreen("home");
    setAnswers({});
    setCurrentQuestion(0);
  };

  const pathDescriptions = {
    Technology:
      "Strong aptitude for tech careers such as software development, AI, or cybersecurity.",
    Media:
      "Excellent communication and creativity skills — ideal for journalism, content, or PR.",
    Healthcare:
      "Empathetic and caring — perfect for nursing, medicine, or therapy careers.",
    Business:
      "Natural leader and strategist — great for entrepreneurship, management, or marketing.",
    Science:
      "Analytical mindset — ideal for research, lab work, or scientific innovation.",
    Teaching:
      "Motivator and communicator — perfect for education, training, or mentoring roles.",
    Engineering:
      "Logical problem solver — suitable for mechanical, civil, or software engineering.",
    Writing:
      "Creative thinker with expression — careers in content, copywriting, or publishing.",
    Research:
      "Curious and data-driven — explore research, analytics, or scientific exploration.",
    Management:
      "Leadership and structure — roles in operations, HR, and project management.",
  };

  if (currentScreen === "home") {
  const domains = [
    "Technology",
    "Creative",
    "Healthcare",
    "Education",
    "Finance",
    "Science",
    "Engineering",
    "Media",
    "Design",
    "Business",
    "Legal",
    "Culinary",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100">
      
      {/* HERO SECTION */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-snug animate-fadeInUp">
          🚀 Discover Your <span className="text-indigo-600">Perfect Career Path</span>
        </h1>
        <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
          Take our fun and insightful quiz to uncover your strengths, interests, and the career
          path that truly fits you. Your dream career is just a few clicks away!
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 max-w-5xl w-full">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              What You'll Get
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✨ Personalized career recommendations</li>
              <li>📊 Compatibility scores & analysis</li>
              <li>🎯 Expert guidance tailored to your profile</li>
              <li>🌍 Insights across 12 exciting career domains</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quiz Details
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>🕐 Estimated Time: <b>5–7 minutes</b></li>
              <li>📋 Total Questions: <b>22</b></li>
              <li>💡 Career Domains: <b>12</b></li>
              <li>🎓 Format: <b>Multiple Choice</b></li>
            </ul>
          </div>
        </div>

        {/* Domains Section */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-10 border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 text-center">
            Career Domains Covered
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {domains.map((domain) => (
              <span
                key={domain}
                className="text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl py-2 px-3 text-center shadow-sm hover:shadow-md transition-all"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* MOTIVATIONAL QUOTE SECTION */}
        <div className="text-center mb-10">
          <p className="text-lg sm:text-xl italic text-gray-700 font-medium shimmer-text">
            “The future depends on what you do today — take your first step toward it now.”
          </p>
        </div>

        {/* TESTIMONIALS / SUCCESS STORIES */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-10">
          <h3 className="text-lg font-semibold text-indigo-700 text-center mb-4">
            Real Students. Real Success. 🌟
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-800 font-semibold">97%</p>
              <p className="text-gray-600 text-sm">Found clearer direction</p>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">50K+</p>
              <p className="text-gray-600 text-sm">Students guided successfully</p>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">4.9★</p>
              <p className="text-gray-600 text-sm">User satisfaction rating</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg py-4 px-10 rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 animate-bounce"
          >
            <Play className="w-5 h-5" />
            Start Your Career Quiz
          </button>
        </div>
      </div>

      {/* Animated Bottom Banner */}
      <div className="mt-10 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg animate-pulse">
        <p className="text-sm sm:text-base font-medium">
          🔥 Your dream career is waiting — take the quiz and unlock your potential!
        </p>
      </div>
    </div>
  );
}



  if (currentScreen === "results") {
    const { topPaths, allScores, personalityType } = showResults;
    const top5ChartData = [...allScores]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, score]) => ({ name, score }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <Trophy className="w-14 h-14 text-yellow-500 mx-auto mb-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Your Career Quiz Results
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Here are your top career matches and detailed domain scores.
            </p>
          </div>

          {/* Top 3 Career Cards */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 text-center">
              🌟 Your Ideal Career Domains
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {topPaths.slice(0, 3).map(([domain], i) => (
                <div
                  key={domain}
                  className="bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-indigo-600 text-4xl mb-3">
                    <Trophy className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{domain}</h3>
                  <p className="text-sm text-gray-600">
                    {pathDescriptions[domain] || "A field aligned with your strengths and personality."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What This Means For You */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              What This Means for You
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Your responses suggest you have a strong interest in <b>{topPaths[0][0]}</b> and related fields. You’re naturally inclined toward tasks that match your <b>{personalityType}</b> nature. Consider exploring career paths, internships, or academic courses that develop these skills.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Left: Top 3 Matches (detailed) */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Top 3 Matches
              </h2>
              {topPaths.slice(0, 3).map(([domain, score], i) => (
                <div
                  key={domain}
                  className={`mb-4 p-5 border rounded-xl ${i === 0
                    ? "border-green-200 bg-green-50"
                    : i === 1
                      ? "border-blue-200 bg-blue-50"
                      : "border-orange-200 bg-orange-50"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {i + 1}. {domain}
                    </h3>
                    <span
                      className={`font-bold text-base sm:text-lg ${i === 0
                        ? "text-green-600"
                        : i === 1
                          ? "text-blue-600"
                          : "text-orange-600"
                        }`}
                    >
                      {score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {pathDescriptions[domain] ||
                      "A field aligned with your strengths and personality."}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: All Domain Scores */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                All Domain Scores
              </h2>
              <div className="space-y-3">
                {[...allScores]
                  .sort(([, a], [, b]) => b - a)
                  .map(([domain, score]) => (
                    <div
                      key={domain}
                      className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        {domain}
                      </span>
                      <div className="flex items-center w-32 sm:w-40">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full mr-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">
                          {score}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" /> Top 5 Domain Comparison
            </h3>
            <div className="w-full min-h-[260px] sm:min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={top5ChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                    interval={0}
                    angle={-10}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: "#4B5563" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {top5ChartData.map((entry, i) => {
                      const domainColors = {
                        "Technology & Engineering": "#6366F1",   // Indigo
                        "Business & Management": "#EF4444",     // Red
                        "Creative Arts & Design": "#F59E0B",    // Amber
                        "Healthcare & Medicine": "#10B981",     // Green
                        "Teaching & Education": "#F97316",      // Orange
                        "Law & Public Service": "#3B82F6",      // Blue
                        "Environment & Agriculture": "#22C55E", // Emerald
                        "Finance & Accounting": "#8B5CF6",      // Violet
                        "Sports & Fitness": "#EAB308",          // Yellow
                        "Media & Communication": "#D946EF"      // Pink/Purple
                      };

                      return (
                        <Cell
                          key={`cell-${i}`}
                          fill={domainColors[entry.name] || "#9CA3AF"}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" /> Next Steps for You
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm sm:text-base">
              <li>Explore online courses related to your top domains.</li>
              <li>Participate in projects, clubs, or competitions in these fields.</li>
              <li>Connect with mentors or professionals in your chosen path.</li>
              <li>Take our <b>Career Interest Form</b> to get personalized guidance.</li>
            </ul>
          </div>

          {/* Motivational Quote */}
          <div className="mt-10 text-center italic text-gray-600 text-sm sm:text-base">
            “Choose a job you love, and you will never have to work a day in your life.”
            <br />– Confucius
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-10 flex-nowrap overflow-hidden">
            <button
              onClick={startQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm sm:text-base"
            >
              Retake Quiz
            </button>
            <button
              onClick={goToHome}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm sm:text-base"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/interest-form')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm sm:text-base"
            >
              Get Report
            </button>
          </div>
        </div>
      </div>
    );
  }



  const question = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  if (!question)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading quiz...
      </div>
    );

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 px-4 py-6 flex items-center justify-center">
    <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[85vh] overflow-hidden">

      {/* LEFT SIDE — Quiz Questions */}
      <div className="flex flex-col justify-between h-full">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </span>
            <span className="text-xs sm:text-sm text-indigo-600 font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((value, index) => {
            const isSelected = answers[question.id] === value;
            const optionLabels = [
              "Strongly Agree",
              "Agree",
              "Neutral",
              "Disagree",
              "Strongly Disagree",
            ];
            const optionLetters = ["A", "B", "C", "D", "E"];
            const labelText = optionLabels[5 - value];
            const letter = optionLetters[index];

            return (
              <label
                key={value}
                className={`flex items-center justify-between w-full border-2 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-green-500 border-green-500 text-white shadow-md scale-[1.02]"
                    : "border-gray-300 hover:border-green-400 bg-white text-gray-800"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 ${
                      isSelected
                        ? "bg-white border-green-500 text-green-600 font-bold"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {isSelected ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold">{letter}</span>
                    )}
                  </div>

                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={value}
                    checked={isSelected}
                    onChange={(e) =>
                      handleAnswer(question.id, parseInt(e.target.value))
                    }
                    className="hidden"
                  />

                  <span
                    className={`text-xs sm:text-sm md:text-base font-medium ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {labelText}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 sm:mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold disabled:opacity-50 hover:bg-gray-200 transition-all duration-200 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={!answers[question.id]}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all duration-200 ${
              !answers[question.id]
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-md"
            }`}
          >
            {currentQuestion === shuffledQuestions.length - 1
              ? "Get Results"
              : "Next"}
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — Engaging Section */}
      <div className="relative rounded-2xl overflow-hidden flex flex-col justify-between items-center p-4 sm:p-6 text-center text-gray-800 h-full">

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-100 to-indigo-300 animate-gradientMove opacity-80"></div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 sm:space-y-6 flex-grow">
          {/* Avatar */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
            alt="Quiz Mascot"
            className="w-16 sm:w-24 h-16 sm:h-24 object-contain animate-float"
          />

          {/* Animated Quote */}
          <p className="italic text-gray-700 text-sm sm:text-base md:text-lg font-medium animate-fade-in px-2">
            {quotes[currentQuoteIndex]}
          </p>

          {/* Career Preview */}
          <div className="bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 w-full">
            <h4 className="text-indigo-700 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              Possible Career Matches 🔍
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You might align with creative, analytical, or leadership paths.
              Complete the quiz to reveal your top 5 personalized careers!
            </p>
          </div>

          {/* Tip */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium shadow-sm flex items-center gap-2">
            <span>✨</span>
            <p>Be honest — there are no right or wrong answers!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);




};

export default CareerQuiz;
