import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BarChart3, Trophy, BookOpen, Play, Home, X, TrendingUp } from 'lucide-react';

const CareerQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'quiz', 'results'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const domains = [
    'Technology', 'Creative', 'Healthcare', 'Education', 'Finance', 
    'Science', 'Engineering', 'Media', 'Design', 'Business', 'Legal', 'Culinary'
  ];

  const questions = [
    // Technology
    { id: 1, text: "I enjoy solving complex problems using logical thinking", domain: "Technology" },
    { id: 2, text: "I'm fascinated by the latest software and digital trends", domain: "Technology" },
    { id: 3, text: "I like building and coding applications or websites", domain: "Technology" },
    { id: 4, text: "I'm comfortable working with data and analytics", domain: "Technology" },
    { id: 5, text: "I enjoy learning about artificial intelligence and automation", domain: "Technology" },
    
    // Creative
    { id: 6, text: "I love expressing myself through art, music, or writing", domain: "Creative" },
    { id: 7, text: "I often come up with innovative and original ideas", domain: "Creative" },
    { id: 8, text: "I enjoy working on projects that require imagination", domain: "Creative" },
    { id: 9, text: "I'm drawn to storytelling and narrative creation", domain: "Creative" },
    { id: 10, text: "I like experimenting with different artistic mediums", domain: "Creative" },
    { id: 11, text: "I find inspiration in everyday experiences", domain: "Creative" },
    
    // Healthcare
    { id: 12, text: "I have a strong desire to help people improve their health", domain: "Healthcare" },
    { id: 13, text: "I'm interested in understanding how the human body works", domain: "Healthcare" },
    { id: 14, text: "I can handle stressful situations calmly", domain: "Healthcare" },
    { id: 15, text: "I'm comfortable with medical procedures and terminology", domain: "Healthcare" },
    { id: 16, text: "I enjoy working directly with patients or clients", domain: "Healthcare" },
    { id: 17, text: "I'm interested in disease prevention and wellness", domain: "Healthcare" },
    
    // Education
    { id: 18, text: "I enjoy explaining complex concepts to others", domain: "Education" },
    { id: 19, text: "I'm passionate about lifelong learning", domain: "Education" },
    { id: 20, text: "I like mentoring and guiding others", domain: "Education" },
    { id: 21, text: "I'm patient when working with people of different skill levels", domain: "Education" },
    { id: 22, text: "I enjoy developing curricula or training programs", domain: "Education" },
    { id: 23, text: "I find fulfillment in seeing others succeed", domain: "Education" },
    
    // Finance
    { id: 24, text: "I'm good with numbers and mathematical calculations", domain: "Finance" },
    { id: 25, text: "I enjoy analyzing market trends and investment opportunities", domain: "Finance" },
    { id: 26, text: "I'm interested in budgeting and financial planning", domain: "Finance" },
    { id: 27, text: "I like working with financial data and reports", domain: "Finance" },
    { id: 28, text: "I'm comfortable making decisions involving money", domain: "Finance" },
    
    // Science
    { id: 29, text: "I love conducting experiments and research", domain: "Science" },
    { id: 30, text: "I'm curious about how things work in the natural world", domain: "Science" },
    { id: 31, text: "I enjoy analyzing data to draw conclusions", domain: "Science" },
    { id: 32, text: "I like working in laboratories or field environments", domain: "Science" },
    { id: 33, text: "I'm interested in making discoveries that benefit society", domain: "Science" },
    { id: 34, text: "I enjoy reading scientific journals and publications", domain: "Science" },
    
    // Engineering
    { id: 35, text: "I enjoy designing and building things", domain: "Engineering" },
    { id: 36, text: "I like solving technical problems with practical solutions", domain: "Engineering" },
    { id: 37, text: "I'm good at visualizing how systems work together", domain: "Engineering" },
    { id: 38, text: "I enjoy working with tools and technical equipment", domain: "Engineering" },
    { id: 39, text: "I like optimizing processes for efficiency", domain: "Engineering" },
    
    // Media
    { id: 40, text: "I enjoy creating content for different audiences", domain: "Media" },
    { id: 41, text: "I'm interested in journalism and current events", domain: "Media" },
    { id: 42, text: "I like working with video, audio, or digital content", domain: "Media" },
    { id: 43, text: "I enjoy interviewing people and gathering stories", domain: "Media" },
    { id: 44, text: "I'm comfortable speaking in public or on camera", domain: "Media" },
    { id: 45, text: "I like staying updated with social media trends", domain: "Media" },
    
    // Design
    { id: 46, text: "I have a strong sense of visual aesthetics", domain: "Design" },
    { id: 47, text: "I enjoy creating user-friendly experiences", domain: "Design" },
    { id: 48, text: "I like working with colors, typography, and layouts", domain: "Design" },
    { id: 49, text: "I pay attention to small details in visual work", domain: "Design" },
    { id: 50, text: "I enjoy collaborating with clients on their vision", domain: "Design" },
    
    // Business
    { id: 51, text: "I enjoy leading teams and managing projects", domain: "Business" },
    { id: 52, text: "I'm interested in entrepreneurship and starting ventures", domain: "Business" },
    { id: 53, text: "I like analyzing market opportunities", domain: "Business" },
    { id: 54, text: "I enjoy networking and building professional relationships", domain: "Business" },
    { id: 55, text: "I'm comfortable making strategic decisions", domain: "Business" },
    { id: 56, text: "I like working in fast-paced, competitive environments", domain: "Business" },
    
    // Legal
    { id: 57, text: "I enjoy researching and analyzing complex information", domain: "Legal" },
    { id: 58, text: "I'm interested in justice and legal processes", domain: "Legal" },
    { id: 59, text: "I like debating and presenting arguments", domain: "Legal" },
    { id: 60, text: "I'm comfortable working with detailed documentation", domain: "Legal" },
    { id: 61, text: "I enjoy helping people navigate legal challenges", domain: "Legal" },
    
    // Culinary
    { id: 62, text: "I love cooking and experimenting with recipes", domain: "Culinary" },
    { id: 63, text: "I enjoy working in fast-paced kitchen environments", domain: "Culinary" },
    { id: 64, text: "I have a good sense of taste and flavor combinations", domain: "Culinary" },
    { id: 65, text: "I like creating memorable dining experiences", domain: "Culinary" },
    { id: 66, text: "I'm interested in food culture and culinary traditions", domain: "Culinary" }
  ];

  // Helper function to calculate results based on current answers
  const calculateResults = () => {
    const domainScores = {};
    domains.forEach(domain => {
      domainScores[domain] = 0;
    });

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && answer) {
        domainScores[question.domain] += answer;
      }
    });

    const maxPossibleScore = {};
    domains.forEach(domain => {
      // The total score is based on the number of questions in the *original* list that belong to the domain
      const domainQuestions = questions.filter(q => q.domain === domain).length;
      maxPossibleScore[domain] = domainQuestions * 5;
    });

    const percentageScores = {};
    Object.entries(domainScores).forEach(([domain, score]) => {
      // Calculate percentage based on the number of questions the user actually answered for that domain
      const answeredQuestionsInDomain = shuffledQuestions.filter(q => q.domain === domain).length;
      const maxScoreForAnswered = answeredQuestionsInDomain * 5;
      percentageScores[domain] = Math.round((score / maxScoreForAnswered) * 100) || 0;
    });

    setShowResults({ scores: percentageScores, raw: domainScores });
    setCurrentScreen('results');
    setShowExitModal(false);
  };

  const startQuiz = () => {
    // Create a copy of the questions array to shuffle
    const allQuestions = [...questions];
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Divide the shuffled array into 3 sets of 22 questions each
    const set1 = allQuestions.slice(0, 22);
    const set2 = allQuestions.slice(22, 44);
    const set3 = allQuestions.slice(44, 66);
    const allSets = [set1, set2, set3];

    // Randomly select one of the three sets for the quiz
    const randomSetIndex = Math.floor(Math.random() * allSets.length);
    setShuffledQuestions(allSets[randomSetIndex]);

    setCurrentScreen('quiz');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const endQuiz = () => {
    setShowExitModal(true);
  };

  const goToHome = () => {
    setCurrentScreen('home');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getTopDomains = (scores) => {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const getDomainDescription = (domain) => {
    const descriptions = {
      Technology: "You have a strong aptitude for tech careers. Consider roles in software development, data science, cybersecurity, or IT management.",
      Creative: "Your creative instincts are strong. Explore careers in graphic design, writing, music, film, or digital arts.",
      Healthcare: "You show great potential for healthcare careers. Consider medicine, nursing, therapy, or healthcare administration.",
      Education: "You have natural teaching abilities. Look into careers in teaching, training, educational administration, or curriculum development.",
      Finance: "You demonstrate strong financial acumen. Consider careers in banking, investment, accounting, or financial planning.",
      Science: "Your scientific curiosity is evident. Explore research, laboratory work, environmental science, or scientific writing.",
      Engineering: "You show strong engineering potential. Consider mechanical, electrical, software, or civil engineering careers.",
      Media: "You have media and communication strengths. Look into journalism, broadcasting, content creation, or public relations.",
      Design: "Your design sensibilities are strong. Consider UI/UX design, interior design, fashion, or product design.",
      Business: "You demonstrate business leadership potential. Explore management, consulting, entrepreneurship, or business development.",
      Legal: "You show aptitude for legal careers. Consider law, paralegal work, legal research, or compliance roles.",
      Culinary: "Your culinary interests are strong. Explore chef careers, restaurant management, food styling, or culinary education."
    };
    return descriptions[domain] || "Explore this field further to discover opportunities that match your interests.";
  };

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Career Domain Discovery Quiz
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover your ideal career path through our comprehensive assessment
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">What You'll Get</h3>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Personalized career recommendations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Detailed compatibility scores
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Professional guidance for your future
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Insights across 12 career domains
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quiz Details</h3>
                <div className="text-left space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-semibold">22 questions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span className="font-semibold">5-7 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Career Domains:</span>
                    <span className="font-semibold">12 domains</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-semibold">Multiple choice</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Domains Covered</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {domains.map((domain) => (
                  <span key={domain} className="bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center mx-auto"
            >
              <Play className="w-6 h-6 mr-3" />
              Start Your Career Quiz
            </button>

            <p className="text-sm text-gray-500 mt-6">
              You can end the quiz at any time and your progress will be saved for the current session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const topDomains = getTopDomains(showResults.scores);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Career Quiz Results</h1>
              <p className="text-gray-600">Based on your answers, here are your top career domain matches</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Top 3 Matches
                </h2>
                {topDomains.map(([domain, score], index) => (
                  <div key={domain} className={`mb-6 p-4 rounded-lg ${index === 0 ? 'bg-green-50 border-green-200' : index === 1 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border-2`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {index + 1}. {domain}
                      </h3>
                      <span className={`text-2xl font-bold ${index === 0 ? 'text-green-600' : index === 1 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-3 mb-3`}>
                      <div 
                        className={`h-3 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-700 text-sm">{getDomainDescription(domain)}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  All Domain Scores
                </h2>
                <div className="space-y-3">
                  {Object.entries(showResults.scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([domain, score]) => (
                    <div key={domain} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{domain}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 w-12">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Career Recommendations
              </h3>
              <p className="text-blue-700 mb-3">
                Your top domain is <strong>{topDomains[0][0]}</strong> with {topDomains[0][1]}% compatibility. 
                This suggests you would thrive in this field.
              </p>
              <p className="text-blue-700">
                Consider exploring opportunities that combine your top 2-3 domains for a unique career path. 
                Many modern careers blend multiple disciplines!
              </p>
            </div>

            <div className="text-center flex items-center space-x-4 gap-3">
              <button
                onClick={startQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Retake Quiz
              </button>
              <button
                onClick={goToHome}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center justify-center mx-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">End Quiz Early?</h3>
            <p className="text-gray-600 mb-6">
              You have answered {currentQuestion} out of {shuffledQuestions.length} questions. Ending now will show your results based on your current progress.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={calculateResults}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                End Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full sm:w-[90%] md:w-[85%] lg:max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Career Domain Quiz</h1>
              <span
                onClick={endQuiz}
                className="flex items-center text-red-600 hover:text-red-700 font-medium transition duration-200 cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" />
                End Quiz
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </span>
              <span className="text-sm font-medium text-gray-700">
                Progress: {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {question.text}
            </h2>
            
            <div className="space-y-3">
              {[
                { value: 5, label: "Strongly Agree" },
                { value: 4, label: "Agree" },
                { value: 3, label: "Neutral" },
                { value: 2, label: "Disagree" },
                { value: 1, label: "Strongly Disagree" }
              ].map((option) => (
                <label key={option.value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                  answers[question.id] === option.value 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                }`}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                    className="w-4 h-4 text-indigo-600 mr-3"
                  />
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={!answers[question.id]}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition duration-200"
            >
              {currentQuestion === shuffledQuestions.length - 1 ? 'Get Results' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerQuiz;