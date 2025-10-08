import React, { useState } from 'react';
import { Search, Zap, AlertCircle, Brain, Target, Lightbulb, Star, Users, TrendingUp } from 'lucide-react';

const CareerDifferencesAnalyzer = () => {
  // Replace with your actual API key
  const GEMINI_API_KEY = 'AIzaSyCuB6uytiwKSubeURXEW-YQOfvu-hagPgk';
  
  const [career1, setCareer1] = useState('');
  const [career2, setCareer2] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [careerSuggestions] = useState([
    'Software Engineer', 'Data Scientist', 'Product Manager', 'UX/UI Designer', 'DevOps Engineer',
    'Marketing Manager', 'Sales Representative', 'Business Analyst', 'Project Manager', 'HR Manager',
    'Financial Analyst', 'Investment Banker', 'Accountant', 'Management Consultant', 'Operations Manager',
    'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Chemical Engineer', 'Aerospace Engineer',
    'Doctor (MBBS)', 'Nurse', 'Pharmacist', 'Physiotherapist', 'Dentist', 'Veterinarian',
    'Teacher', 'Professor', 'School Principal', 'Educational Counselor', 'Researcher',
    'Lawyer', 'Judge', 'Legal Advisor', 'Paralegal', 'Court Reporter',
    'Graphic Designer', 'Web Developer', 'Mobile App Developer', 'Game Developer', 'Cybersecurity Analyst',
    'Digital Marketing Specialist', 'Content Writer', 'Social Media Manager', 'SEO Specialist', 'Photographer',
    'Architect', 'Interior Designer', 'Fashion Designer', 'Industrial Designer', 'Landscape Architect',
    'Chef', 'Restaurant Manager', 'Hotel Manager', 'Travel Agent', 'Event Planner',
    'Journalist', 'News Anchor', 'Public Relations Specialist', 'Radio Jockey', 'Film Director',
    'Real Estate Agent', 'Bank Manager', 'Insurance Agent', 'Stock Broker', 'Credit Analyst',
    'Police Officer', 'Firefighter', 'Military Officer', 'Government Officer', 'Diplomat',
    'Psychologist', 'Social Worker', 'Counselor', 'Therapist', 'Life Coach',
    'Entrepreneur', 'Business Owner', 'Startup Founder', 'Freelancer', 'Consultant', 'Mbbs', 'Engineering'
  ]);

  const [filteredSuggestions1, setFilteredSuggestions1] = useState([]);
  const [filteredSuggestions2, setFilteredSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);

  const filterSuggestions = (input, setFiltered, setShow) => {
    if (input.length > 0) {
      const filtered = careerSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      );
      setFiltered(filtered.slice(0, 8));
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleCareer1Change = (e) => {
    const value = e.target.value;
    setCareer1(value);
    filterSuggestions(value, setFilteredSuggestions1, setShowSuggestions1);
  };

  const handleCareer2Change = (e) => {
    const value = e.target.value;
    setCareer2(value);
    filterSuggestions(value, setFilteredSuggestions2, setShowSuggestions2);
  };

  const selectSuggestion1 = (suggestion) => {
    setCareer1(suggestion);
    setShowSuggestions1(false);
  };

  const selectSuggestion2 = (suggestion) => {
    setCareer2(suggestion);
    setShowSuggestions2(false);
  };

  const generateDifferences = async () => {
    if (!career1.trim() || !career2.trim()) {
      setError('Please enter both career fields to compare');
      return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setError('Please set a valid Gemini API key');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      console.log('Starting API call...');
      
      const prompt = `Compare these two career fields: "${career1}" vs "${career2}". Focus on job roles, career paths, and professional fields.

Provide exactly 10 important career-specific differences for each field in this EXACT JSON format (no additional text, just valid JSON):
{
  "career1": {
    "name": "${career1}",
    "differences": [
      "Career-specific difference 1 about ${career1}",
      "Career-specific difference 2 about ${career1}",
      "Career-specific difference 3 about ${career1}",
      "Career-specific difference 4 about ${career1}",
      "Career-specific difference 5 about ${career1}",
      "Career-specific difference 6 about ${career1}",
      "Career-specific difference 7 about ${career1}",
      "Career-specific difference 8 about ${career1}",
      "Career-specific difference 9 about ${career1}",
      "Career-specific difference 10 about ${career1}"
    ]
  },
  "career2": {
    "name": "${career2}",
    "differences": [
      "Career-specific difference 1 about ${career2}",
      "Career-specific difference 2 about ${career2}",
      "Career-specific difference 3 about ${career2}",
      "Career-specific difference 4 about ${career2}",
      "Career-specific difference 5 about ${career2}",
      "Career-specific difference 6 about ${career2}",
      "Career-specific difference 7 about ${career2}",
      "Career-specific difference 8 about ${career2}",
      "Career-specific difference 9 about ${career2}",
      "Career-specific difference 10 about ${career2}"
    ]
  },
  "summary": "Brief 2-3 sentence summary of the main career distinctions between these two fields",
  "keyInsight": "One key insight about the most significant career difference between these fields"
}

Focus on: job responsibilities, daily tasks, work environment, career progression, required education, salary potential, job market, industry trends, required skills, work-life balance, and professional challenges. Return ONLY valid JSON.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No text content received from Gemini API');
      }

      console.log('Raw API text:', text);

      // Clean the response text to extract JSON
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON content between braces
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in API response');
      }
      
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
      console.log('Cleaned text for parsing:', cleanedText);

      try {
        const analysisData = JSON.parse(cleanedText);
        console.log('Parsed analysis data:', analysisData);

        // Validate the structure
        if (!analysisData.career1 || !analysisData.career2 || 
            !analysisData.career1.differences || !analysisData.career2.differences ||
            !analysisData.summary || !analysisData.keyInsight) {
          throw new Error('Incomplete data structure received from API');
        }

        // Ensure we have exactly 10 differences for each career
        if (analysisData.career1.differences.length !== 10 || 
            analysisData.career2.differences.length !== 10) {
          console.warn('Not exactly 10 differences received, but proceeding...');
        }

        setAnalysis(analysisData);
        console.log('Analysis set successfully');
        
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Text that failed to parse:', cleanedText);
        throw new Error('Failed to parse AI response. The API returned invalid JSON format.');
      }
      
    } catch (err) {
      console.error('Full error details:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const DifferenceCard = ({ career, isFirst }) => (
    <div className={`career-card ${isFirst ? 'career-card-first' : 'career-card-second'}`}>
      
      {/* Header */}
      <div className="career-header">
        <div className={`career-icon ${isFirst ? 'career-icon-first' : 'career-icon-second'}`}>
          {isFirst ? <Users className="icon-large" /> : <TrendingUp className="icon-large" />}
        </div>
        <h3 className="career-title">{career.name}</h3>
        <div className={`career-badge ${isFirst ? 'career-badge-first' : 'career-badge-second'}`}>
          Career Field {isFirst ? 'A' : 'B'}
        </div>
      </div>

      {/* Differences List */}
      <div className="differences-section">
        <h4 className={`differences-title ${isFirst ? 'differences-title-first' : 'differences-title-second'}`}>
          <Lightbulb className={`icon-medium ${isFirst ? 'text-blue-600' : 'text-purple-600'}`} />
          10 Career Differences
        </h4>
        
        {career.differences?.map((difference, index) => (
          <div key={index} className="difference-item">
            <div className="difference-content">
              <div className={`difference-number ${isFirst ? 'difference-number-first' : 'difference-number-second'}`}>
                {index + 1}
              </div>
              <div className="difference-text">
                <p className="difference-description">{difference}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Accent */}
      <div className={`career-accent ${isFirst ? 'career-accent-first' : 'career-accent-second'}`}></div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <Users className="icon-large" />
          </div>
          <h1 className="main-title">
            Courses and Career Fields Analyzer
          </h1>
          <p className="main-subtitle">
            Compare Courses and Career fields and discover 10 key differences with AI-powered insights
          </p>
        </div>

        {/* Search Form */}
        <div className="search-form-container">
          <div className="search-form">
            <div className="search-inputs">
              {/* Career 1 */}
              <div className="input-group">
                <label className="input-label">
                  First Career Field
                </label>
                <div className="input-wrapper">
                  <Search className="input-icon" />
                  <input
                    type="text"
                    value={career1}
                    onChange={handleCareer1Change}
                    onFocus={() => filterSuggestions(career1, setFilteredSuggestions1, setShowSuggestions1)}
                    onBlur={() => setTimeout(() => setShowSuggestions1(false), 200)}
                    placeholder="e.g., Software Engineer, Doctor, Teacher"
                    className="search-input search-input-first"
                  />
                </div>
                {showSuggestions1 && filteredSuggestions1.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredSuggestions1.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion1(suggestion)}
                        className="suggestion-item suggestion-item-first"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Career 2 */}
              <div className="input-group">
                <label className="input-label">
                  Second Career Field
                </label>
                <div className="input-wrapper">
                  <Search className="input-icon" />
                  <input
                    type="text"
                    value={career2}
                    onChange={handleCareer2Change}
                    onFocus={() => filterSuggestions(career2, setFilteredSuggestions2, setShowSuggestions2)}
                    onBlur={() => setTimeout(() => setShowSuggestions2(false), 200)}
                    placeholder="e.g., Data Scientist, Lawyer, Marketing Manager"
                    className="search-input search-input-second"
                  />
                </div>
                {showSuggestions2 && filteredSuggestions2.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredSuggestions2.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion2(suggestion)}
                        className="suggestion-item suggestion-item-second"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={generateDifferences}
              disabled={loading}
              className="generate-button"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing Career Differences...
                </>
              ) : (
                <>
                  <Zap className="icon-medium" />
                  Generate Career Differences
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-container">
            <div className="error-message">
              <div className="error-content">
                <AlertCircle className="error-icon" />
                <p className="error-text">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && analysis.career1 && analysis.career2 && analysis.summary && analysis.keyInsight && (
          <div className="results-container">
            {/* Summary Section */}
            <div className="summary-section">
              <div className="summary-content">
                <h2 className="summary-title">
                  <Brain className="icon-large summary-icon" />
                  AI Career Analysis Results
                </h2>
                <div className="summary-box">
                  <p className="summary-text">{analysis.summary}</p>
                </div>
                
                {/* Key Insight */}
                <div className="insight-box">
                  <h3 className="insight-title">
                    <Star className="icon-medium" />
                    Key Career Insight
                  </h3>
                  <p className="insight-text">{analysis.keyInsight}</p>
                </div>
              </div>
            </div>

            {/* Comparison Title */}
            <div className="comparison-title">
              <h2 className="vs-title">
                <span className="career-name-first">
                  {career1}
                </span>
                <span className="vs-text">vs</span>
                <span className="career-name-second">
                  {career2}
                </span>
              </h2>
              <div className="title-divider">
                <div className="divider-line"></div>
              </div>
            </div>

            {/* Differences Cards - Side by Side with Partition */}
            <div className="comparison-grid">
              {/* Left Side - Career 1 */}
              <div className="career-column">
                <DifferenceCard 
                  career={analysis.career1} 
                  isFirst={true}
                />
              </div>

              {/* Vertical Partition */}
              <div className="vertical-partition">
                <div className="partition-line"></div>
                <div className="partition-icon">
                  <Target className="icon-medium text-white" />
                </div>
              </div>

              {/* Right Side - Career 2 */}
              <div className="career-column">
                <DifferenceCard 
                  career={analysis.career2} 
                  isFirst={false}
                />
              </div>
            </div>

          </div>
        )}
      </div>
      
      <style jsx>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
        }

        /* App Container */
        .app-container {
          min-height: 100vh;
          background: #fff;
          position: relative;
          overflow-x: hidden;
        }

        /* Removed .animated-bg and pulse animation */

        .main-content {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 8px;
        }

        /* Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 50%;
          margin-bottom: 16px;
          box-shadow: none;
        }

        .main-title {
          font-size: 2.25rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 12px;
          background: none;
          line-height: 1.2;
        }

        .main-subtitle {
          font-size: 1rem;
          color: #555;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Search Form */
        .search-form-container {
          max-width: 1000px;
          margin: 0 auto 48px;
        }

        .search-form {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #eee;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .search-inputs {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .input-group {
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #222;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 16px;
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          background: #f9fafb;
          border: 1px solid #ddd;
          border-radius: 10px;
          font-size: 1rem;
          color: #222;
          box-shadow: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #e0e7ef;
        }

        .search-input-first:focus {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
        }

        .search-input-second:focus {
          box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.5);
        }

        .search-input::placeholder {
          color: #6b7280;
        }

        /* Suggestions Dropdown */
        .suggestions-dropdown {
          position: absolute;
          z-index: 20;
          width: 100%;
          margin-top: 8px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestion-item {
          padding: 10px 14px;
          cursor: pointer;
          color: #222;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.15s;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item-first:hover {
          background-color: #f3f4f6;
        }

        .suggestion-item-second:hover {
          background-color: #f3f4f6;
        }

        /* Generate Button */
        .generate-button {
          width: 100%;
          background: #2563eb;
          color: #fff;
          padding: 12px 0;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          transform: translateY(0);
        }

        .generate-button:hover:not(:disabled) {
          background: #174ea6;
          box-shadow: none;
          transform: translateY(-1px);
        }

        .generate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error Message */
        .error-container {
          max-width: 1000px;
          margin: 0 auto 32px;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(239, 68, 68, 0.5);
          border-radius: 16px;
          padding: 24px;
        }

        .error-content {
          display: flex;
          align-items: center;
        }

        .error-icon {
          width: 24px;
          height: 24px;
          color: #fca5a5;
          margin-right: 12px;
        }

        .error-text {
          color: #fecaca;
          font-size: 1.125rem;
        }

        /* Results Container */
        .results-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Summary Section */
        .summary-section {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #eee;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .summary-content {
          text-align: center;
          margin-bottom: 32px;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-icon {
          margin-right: 12px;
          color: #60a5fa;
        }

        .summary-box {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          backdrop-filter: blur(8px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 24px;
        }

        .summary-text {
          color: #444;
          font-size: 1rem;
          line-height: 1.6;
        }

        .insight-box {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
        }

        .insight-title {
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-text {
          color: #444;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Comparison Title */
        .comparison-title {
          text-align: center;
          margin-bottom: 32px;
        }

        .vs-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .career-name-first {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .vs-text {
          color: #d1d5db;
          margin: 0 16px;
        }

        .career-name-second {
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .divider-line {
          height: 4px;
          width: 128px;
          background: linear-gradient(135deg, #3b82f6, #7c3aed);
          border-radius: 2px;
        }

        /* Comparison Grid with Partition */
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 32px;
          margin-bottom: 32px;
          position: relative;
        }

        @media (max-width: 1024px) {
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .career-column {
          display: flex;
          flex-direction: column;
        }

        /* Vertical Partition */
        .vertical-partition {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 4px;
        }

        @media (max-width: 1024px) {
          .vertical-partition {
            display: none;
          }
        }

        .partition-line {
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.3) 80%, transparent 100%);
          border-radius: 2px;
          position: absolute;
          top: 0;
        }

        .partition-icon {
          background: linear-gradient(135deg, #3b82f6, #7c3aed);
          border-radius: 50%;
          padding: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
          z-index: 10;
          position: relative;
        }

        /* Career Cards */
        .career-card {
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 32px;
          transition: all 0.3s ease;
          position: relative;
          height: fit-content;
        }

        .career-card:hover {
          box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .career-card-first {
          background: #fff;
          border: 1px solid #eee;
        }

        .career-card-second {
          background: #fff;
          border: 1px solid #eee;
        }

        /* Career Header */
        .career-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .career-icon {
          display: inline-flex;
          padding: 16px;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .career-icon-first {
          background: #3b82f6;
        }

        .career-icon-second {
          background: #7c3aed;
        }

        .career-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 6px;
        }

        .career-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .career-badge-first {
          background: #f3f4f6;
          color: #222;
        }

        .career-badge-second {
          background: #f3f4f6;
          color: #222;
        }

        /* Differences Section */
        .differences-section {
          margin-bottom: 32px;
        }

        .differences-title {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #222;
          margin-bottom: 16px;
          font-size: 1rem;
        }

        .differences-title-first .icon-medium {
          color: #3b82f6;
          margin-right: 8px;
        }

        .differences-title-second .icon-medium {
          color: #7c3aed;
          margin-right: 8px;
        }

        .difference-item {
          background: #f9fafb;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #eee;
          margin-bottom: 10px;
          transition: background 0.2s;
        }

        .difference-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
        }

        .difference-content {
          display: flex;
          align-items: flex-start;
        }

        .difference-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          margin-right: 16px;
          margin-top: 4px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .difference-item:hover .difference-number {
          transform: scale(1.1);
        }

        .difference-number-first {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .difference-number-second {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
        }

        .difference-text {
          flex: 1;
        }

        .difference-description {
          color: #444;
          line-height: 1.6;
          font-weight: 400;
          font-size: 0.95rem;
        }

        /* Career Accent */
        .career-accent {
          margin-top: 32px;
          height: 8px;
          border-radius: 4px;
        }

        .career-accent-first {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
        }

        .career-accent-second {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 48px;
        }

        .footer-text {
          color: #888;
          font-size: 0.95rem;
        }

        /* Icon Sizes */
        .icon-large {
          width: 32px;
          height: 32px;
          color: #174ea6;
        }

        .icon-medium {
          width: 24px;
          height: 24px;
          color: #174ea6;
        }

        .icon-small {
          width: 20px;
          height: 20px;
          color: #174ea6;
        }

        /* Utility Classes */
        .text-blue-600 {
          color: #2563eb;
        }

        .text-purple-600 {
          color: #7c3aed;
        }

        .text-white {
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-title {
            font-size: 2.5rem;
          }
          
          .main-content {
            padding: 32px 16px;
          }
          
          .search-form {
            padding: 24px;
          }
          
          .career-card {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 2rem;
          }
          
          .main-subtitle {
            font-size: 1.125rem;
          }
          
          .search-inputs {
            gap: 20px;
          }
          
          .generate-button {
            font-size: 1rem;
            padding: 14px 24px;
          }
          
          .career-title {
            font-size: 1.25rem;
          }
          
          .differences-title {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 24px 12px;
          }
          
          .search-form {
            padding: 20px;
          }
          
          .career-card {
            padding: 20px;
          }
          
          .difference-item {
            padding: 16px;
          }
          
          .difference-number {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CareerDifferencesAnalyzer;