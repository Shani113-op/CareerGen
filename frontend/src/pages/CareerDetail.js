import { useState, useEffect, useMemo, useCallback  } from 'react';
import { Search, Book, Briefcase, DollarSign, Scale, Stethoscope, Code, Palette, ChefHat, Microscope, Star, ArrowRight, CheckCircle } from 'lucide-react';
// Note: In a real React app, you would install these packages:
// npm install html2canvas jspdf
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CareerPathWebsite = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState(''); 
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Add your Gemini API key here
  const GEMINI_API_KEY = 'AIzaSyDsy3SmY3xLp1-RHvx2xXDx0PTgVxe9e3M';

  const categories = useMemo(() => [
    { name: 'All', icon: Star },
    { name: 'Technology', icon: Code },
    { name: 'Creative', icon: Palette },
    { name: 'Healthcare', icon: Stethoscope },
    { name: 'Education', icon: Book },
    { name: 'Finance', icon: DollarSign },
    { name: 'Science', icon: Microscope },
    { name: 'Engineering', icon: Code },
    { name: 'Media', icon: Palette },
    { name: 'Design', icon: Palette },
    { name: 'Business', icon: Briefcase },
    { name: 'Legal', icon: Scale },
    { name: 'Culinary', icon: ChefHat }
  ], []); // ✅ only created once



  // Category click handler that clears search
  // const handleCategoryClick = (categoryName) => {
  //   setActiveCategory(categoryName);
  //   setSearchInputValue('');     
  //   setSearchQuery('');          
  //   setSearchResults([]);        
  // };

  // Function to call Gemini API with better error handling
  const callGeminiAPI = useCallback(async (prompt) => {
    try {
      console.log('Calling Gemini API with prompt:', prompt);
      
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('API key not configured properly');
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response error:', errorText);
        
        if (response.status === 400) {
          throw new Error('Invalid API request. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('API access denied. Please verify your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Gemini API response:', JSON.stringify(data, null, 2));

      if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
        const content = data.candidates.map(candidate => {
          if (candidate.content && Array.isArray(candidate.content.parts)) {
            return candidate.content.parts.map(part => part.text).join(' ');
          } else {
            console.warn('Invalid candidate structure:', JSON.stringify(candidate));
            return '';
          }
        }).join(' ');
        
        if (!content.trim()) {
          throw new Error('Empty response from API');
        }
        
        return content;
      } else {
        console.error('No valid candidates in response:', JSON.stringify(data, null, 2));
        throw new Error('No valid response from API');
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }, [GEMINI_API_KEY]);

  // Function to fetch careers for a specific category (FETCHES 10 CAREERS)
  const fetchCategoryData = useCallback(async (categoryName) => {
    if (categoryName === 'All' || categoryData[categoryName]) return;

    setCategoryLoading(prev => ({ ...prev, [categoryName]: true }));
    
    try {
      const prompt = `Find 10 specific career paths in the ${categoryName} industry. For each career, provide:
1. Job title
2. Brief description (1-2 sentences)
3. Required skills (comma-separated list)
4. Salary range in USD
5. Growth outlook (Very High/High/Moderate/Stable)
6. Relevant emoji for the career

Format the response as a JSON array of objects, with each object representing a career. Example format:
\`\`\`json
[
  {
    "title": "Job Title 1",
    "description": "Brief description...",
    "skills": ["skill1", "skill2"],
    "salary": "$Range",
    "growth": "Outlook",
    "emoji": "💡"
  },
  {
    "title": "Job Title 2",
    "description": "Brief description...",
    "skills": ["skill1", "skill2"],
    "salary": "$Range",
    "growth": "Outlook",
    "emoji": "🚀"
  }
]
\`\`\`
Ensure the response is ONLY the JSON content, without any additional text or explanation.`;

      const responseText = await callGeminiAPI(prompt);
      
      let careers = [];
      try {
        const jsonText = responseText.replace(/``````/g, '').trim();
        careers = JSON.parse(jsonText);
        console.log('Parsed category data:', careers);

      } catch (parseError) {
        console.error('Failed to parse JSON, falling back to regex:', parseError);
        
        const careerRegex = /"title":\s*"(.*?)",\s*"description":\s*"(.*?)",\s*"skills":\s*\[(.*?)\],\s*"salary":\s*"(.*?)",\s*"growth":\s*"(.*?)",\s*"emoji":\s*"(.*?)"/g;
        let match;
        while ((match = careerRegex.exec(responseText)) !== null) {
          careers.push({
            id: `${categoryName}-${careers.length + 1}`,
            title: match[1],
            description: match[2],
            skills: match[3].replace(/"/g, '').split(',').map(skill => skill.trim()),
            salary: match[4],
            growth: match[5],
            image: match[6],
            category: categoryName
          });
        }
      }
      
      careers = careers.map((c, index) => ({
        ...c,
        id: `${categoryName}-${index + 1}`,
        category: categoryName,
        image: c.emoji || c.image || '💼'
      }));

      const numToGenerate = 10 - careers.length;
      for (let i = 0; i < numToGenerate; i++) {
        careers.push({
          id: `${categoryName}-fallback-${i}`,
          title: `${categoryName} Specialist ${i + 1}`,
          description: `A specialized role within the ${categoryName} field.`,
          skills: ['Creativity', 'Adaptability', 'Problem-solving'],
          salary: '$55,000 - $110,000',
          growth: 'Moderate',
          image: '💡',
          category: categoryName,
        });
      }

      setCategoryData(prev => ({ ...prev, [categoryName]: careers }));
    } catch (error) {
      console.error(`Failed to fetch ${categoryName} careers:`, error);
      setCategoryData(prev => ({ 
        ...prev, 
        [categoryName]: Array.from({ length: 10 }, (_, i) => ({
          id: `${categoryName}-fallback-${i}`,
          title: `${categoryName} Professional ${i + 1}`,
          description: `Professional role in the ${categoryName} field.`,
          skills: ['Problem-solving', 'Communication', 'Technical skills'],
          salary: '$60,000 - $120,000',
          growth: 'Moderate',
          image: '💼',
          category: categoryName
        }))
      }));
    } finally {
      setCategoryLoading(prev => ({ ...prev, [categoryName]: false }));
    }
  },[callGeminiAPI, categoryData]);

  // Auto-fetch all categories on initial load
  useEffect(() => {
    const fetchAllCategories = async () => {
      console.log('Starting to fetch all categories...');
      const categoriesToFetch = categories.filter(cat => cat.name !== 'All');
      
      const loadingState = {};
      categoriesToFetch.forEach(cat => {
        loadingState[cat.name] = true;
      });
      setCategoryLoading(loadingState);

      try {
        for (const category of categoriesToFetch) {
          await fetchCategoryData(category.name);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('All categories fetched successfully');
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setInitialLoadComplete(true);
        const clearedLoadingState = {};
        categoriesToFetch.forEach(cat => {
          clearedLoadingState[cat.name] = false;
        });
        setCategoryLoading(clearedLoadingState);
      }
    };

    fetchAllCategories();
  }, [categories, fetchCategoryData]);

  useEffect(() => {
    if (activeCategory !== 'All' && initialLoadComplete) {
      fetchCategoryData(activeCategory);
    }
  }, [activeCategory, initialLoadComplete, fetchCategoryData]);

  const getAllCareers = () => {
    if (activeCategory === 'All') {
      return Object.values(categoryData).flat();
    }
    return categoryData[activeCategory] || [];
  };

  // SEARCH FUNCTION TO FETCH 10 CAREERS
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchResults([]);
    setSelectedCareer(null);
    
    try {
      console.log('Search query:', searchQuery);
      
      const prompt = `You are a real-time career data analyst with access to current job market information. Based on the search term "${searchQuery}", provide exactly 10 highly specific and current career paths with real market data.

STRICT REQUIREMENTS:
- All data must be based on current 2024-2025 job market trends
- Use real job titles from actual job postings on LinkedIn, Indeed, Glassdoor
- Salary ranges must reflect current market rates (post-inflation, 2024-2025)
- Skills must be the most current and in-demand technologies/tools
- Growth outlook must reference current industry trends and market analysis

SEARCH CONTEXT: "${searchQuery}"

Provide 10 specific careers that are:
1. Currently being actively hired for (high job posting volume)
2. Have real, specific job titles (not generic ones)
3. Include current salary data from major markets (US/Global)
4. List in-demand skills that employers are seeking RIGHT NOW
5. Reference current growth trends (AI impact, remote work, market changes)

Be extremely specific with job titles - use exact titles that appear on job boards today.

Examples of specificity:
- Instead of "Software Developer" → "Senior React Developer" or "Full Stack Engineer (Node.js/React)"
- Instead of "Data Analyst" → "Business Intelligence Analyst" or "SQL Data Analyst"
- Instead of "Designer" → "Senior UX Designer (SaaS)" or "Product Designer (Mobile Apps)"

FORMAT AS JSON ARRAY - RESPONSE MUST BE ONLY VALID JSON:
[
  {
    "title": "Exact Job Title (as seen on job boards)",
    "description": "What they do with current tools and methodologies (1-2 sentences)",
    "skills": ["Current Tech/Tool 1", "In-Demand Skill 2", "Popular Framework 3", "Essential Skill 4", "Market-Relevant Skill 5"],
    "salary": "$XX,000 - $XXX,000 (current 2024-2025 market rates)",
    "category": "Industry Category",
    "growth": "Growth Level with current market reason",
    "emoji": "📱"
  }
]

CRITICAL: Your entire response must be ONLY the JSON array. No explanatory text before or after. Start with [ and end with ].`;

      const responseText = await callGeminiAPI(prompt);
      console.log('Raw search API response:', responseText);
      
      let results = [];
      
      try {
        let jsonText = responseText.trim();
        jsonText = jsonText.replace(/``````\s*\n?/g, '');
        
        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
        
        results = JSON.parse(jsonText);
        console.log('Successfully parsed search results:', results);
        
        results = results.filter(career => 
          career.title && 
          career.description && 
          career.skills && 
          Array.isArray(career.skills) && 
          career.salary &&
          career.category &&
          career.growth &&
          career.emoji
        );
        
      } catch (parseError) {
        console.error('Failed to parse JSON for search, trying fallback generation:', parseError);
        results = [];
      }
      
      results = results.map((career, index) => ({
        ...career,
        id: `search-${index + 1}`,
        image: career.emoji || '💼',
        skills: Array.isArray(career.skills) ? career.skills : 
                (typeof career.skills === 'string' ? 
                  career.skills.split(',').map(s => s.trim().replace(/"/g, '')) : 
                  ['Professional Skills'])
      }));
      
      const numToGenerate = 10 - results.length;
      if (numToGenerate > 0) {
        const fallbackCareers = generateSearchFallbacks(searchQuery, numToGenerate);
        results = [...results, ...fallbackCareers];
      }
      
      results = results.slice(0, 10);
      
      setSearchResults(results);
      
    } catch (error) {
      console.error('Search completely failed:', error);
      const fallbackCareers = generateSearchFallbacks(searchQuery, 10);
      setSearchResults(fallbackCareers);
    } finally {
      setLoading(false);
    }
  };

  const generateSearchFallbacks = (searchTerm, count) => {
    const fallbacks = [];
    for (let i = 0; i < count; i++) {
      fallbacks.push({
        id: `search-fallback-${i}`,
        title: `${searchTerm} Specialist ${i + 1}`,
        description: `A professional role specializing in ${searchTerm} with current market expertise.`,
        skills: ['Problem-solving', 'Communication', 'Technical expertise', 'Leadership', 'Innovation'],
        salary: '$55,000 - $120,000',
        category: 'General',
        growth: 'High',
        image: '💼'
      });
    }
    return fallbacks;
  };

  // FIXED GETROADMAP FUNCTION WITH PROPER DEBUG
  const getRoadmap = async (career) => {
    setSelectedCareer(career);
    setLoading(true);
    try {
      console.log('Selected career for roadmap:', career);

      const prompt = `Create a detailed career roadmap for becoming a ${career.title}. Structure your response EXACTLY as follows:

PHASE 1: BEGINNER (0-1 years)
1. [Specific actionable step with timeline]
2. [Specific actionable step with timeline]
3. [Specific actionable step with timeline]
4. [Specific actionable step with timeline]
5. [Specific actionable step with timeline]
6. [Specific actionable step with timeline]

PHASE 2: INTERMEDIATE (1-3 years)
1. [Specific actionable step with timeline]
2. [Specific actionable step with timeline]
3. [Specific actionable step with timeline]
4. [Specific actionable step with timeline]
5. [Specific actionable step with timeline]
6. [Specific actionable step with timeline]

PHASE 3: ADVANCED (3-5 years)
1. [Specific actionable step with timeline]
2. [Specific actionable step with timeline]
3. [Specific actionable step with timeline]
4. [Specific actionable step with timeline]
5. [Specific actionable step with timeline]
6. [Specific actionable step with timeline]

PHASE 4: EXPERT/PROFESSIONAL (5+ years)
1. [Specific actionable step for career advancement]
2. [Specific actionable step for career advancement]
3. [Specific actionable step for career advancement]
4. [Specific actionable step for career advancement]
5. [Specific actionable step for career advancement]
6. [Specific actionable step for career advancement]

RECOMMENDATIONS:
• [Best practice or important tip]
• [Common mistake to avoid]
• [Industry trend or future outlook]
• [Networking or professional development advice]
• [Skill development recommendation]
• [Career progression tip]

Requirements:
- Each step must be specific and actionable (not vague advice)
- Include specific tools, technologies, certifications, or qualifications
- Mention realistic timelines
- Focus on practical skills and real-world experience
- Include learning resources where relevant (courses, certifications, books)
- Make steps progressive and build upon each other`;

      const responseText = await callGeminiAPI(prompt);
      console.log('Raw API response:', responseText);

      // Enhanced parsing logic to clean up symbols and add bullet points
      const parseRoadmap = (text) => {
        const cleanedText = text.replace(/\*\*|#/g, '•'); // Replace ** and # with bullet points

        const phases = [];
        const phaseRegex = /PHASE\s+(\d+):\s*([^(]+)\([^)]+\)([\s\S]*?)(?=PHASE\s+\d+:|RECOMMENDATIONS:|$)/gi;
        const recommendationsMatch = cleanedText.match(/RECOMMENDATIONS:([\s\S]*?)$/i);
        
        let match;
        while ((match = phaseRegex.exec(cleanedText)) !== null) {
          const phaseNumber = match[1];
          const phaseName = match[2].trim();
          const phaseContent = match[3].trim();
          
          // Extract numbered steps
          const steps = [];
          const lines = phaseContent.split('\n');
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            // Look for numbered items (1., 2., etc.) or bullet points
            if (/^\d+\./.test(trimmedLine) || /^[-•]/.test(trimmedLine)) {
              const step = trimmedLine.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
              if (step.length > 10) { // Ensure meaningful content
                steps.push(step);
              }
            }
          }

          // Ensure we have at least 6 steps
          while (steps.length < 6) {
            steps.push(`Continue developing skills and gaining experience in ${career.title} field`);
          }

          phases.push({
            phase: `${phaseName} (Phase ${phaseNumber})`,
            tasks: steps.slice(0, 6) // Limit to 6 steps
          });
        }

        // Parse recommendations
        let recommendations = [];
        if (recommendationsMatch) {
          const recText = recommendationsMatch[1];
          const recLines = recText.split('\n');
          
          for (const line of recLines) {
            const trimmedLine = line.trim();
            if (/^[•\-*]/.test(trimmedLine)) {
              const rec = trimmedLine.replace(/^[•\-*]\s*/, '').trim();
              if (rec.length > 10) {
                recommendations.push(rec);
              }
            }
          }

        }

        // Ensure we have phases
        if (phases.length === 0) {
          // Fallback parsing if structured format fails
          const fallbackSteps = cleanedText.split('\n')
            .filter(line => line.trim().length > 20)
            .slice(0, 24); // 6 steps per phase * 4 phases

          for (let i = 0; i < 4; i++) {
            const phaseNames = ['Beginner (0-1 years)', 'Intermediate (1-3 years)', 'Advanced (3-5 years)', 'Expert (5+ years)'];
            const phaseSteps = fallbackSteps.slice(i * 6, (i + 1) * 6);
            
            if (phaseSteps.length > 0) {
              phases.push({
                phase: phaseNames[i],
                tasks: phaseSteps.length >= 6 ? phaseSteps : [
                  ...phaseSteps,
                  ...Array(6 - phaseSteps.length).fill(`Continue learning and practicing ${career.title} skills`)
                ]
              });
            }
          }
        }

        return { phases, recommendations };
      };

      const roadmapData = parseRoadmap(responseText);
      console.log('Parsed roadmap data:', roadmapData);

      if (!roadmapData.phases || roadmapData.phases.length === 0) {
        throw new Error('Invalid roadmap data');
      }

      setRoadmap(roadmapData);
    } catch (error) {
      console.error('Failed to get roadmap:', error);
      alert('Failed to fetch roadmap. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // PDF Download functionality
  const downloadRoadmapAsPDF = async () => {
    try {
      const roadmapElement = document.getElementById('roadmap-section');
      if (!roadmapElement) {
        alert('Roadmap section not found!');
        return;
      }

      window.scrollTo(0, 0);

      const canvas = await html2canvas(roadmapElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: roadmapElement.scrollHeight,
        width: roadmapElement.scrollWidth,
        windowWidth: roadmapElement.scrollWidth,
        windowHeight: roadmapElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${selectedCareer?.title || 'Career'}_Roadmap.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const careersToDisplay = searchResults.length > 0 ? searchResults : getAllCareers();
  const isLoadingCategory = activeCategory !== 'All' && categoryLoading[activeCategory];
  const isInitialLoading = !initialLoadComplete && Object.keys(categoryData).length === 0;

  if (roadmap) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ marginBottom: '40px' }}>
            <button
              onClick={() => {
                setRoadmap(null);
                setSelectedCareer(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#2563eb',
                fontWeight: '600',
                marginBottom: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <ArrowRight style={{ width: '16px', height: '16px', marginRight: '8px', transform: 'rotate(180deg)' }} />
              Back to Careers
            </button>
            <button
              onClick={downloadRoadmapAsPDF}
              style={{
                marginBottom: '32px',
                padding: '12px 24px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Download Roadmap as PDF
            </button>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
              {selectedCareer?.title} Career Roadmap
            </h1>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>Your personalized path to success</p>
          </div>

          <div id="roadmap-section" style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gap: '48px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {roadmap.phases.map((phase, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '32px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      marginRight: '16px',
                      fontSize: '16px'
                    }}>
                      {index + 1}
                    </div>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: '#111827', 
                      margin: 0,
                      lineHeight: '1.2'
                    }}>
                      {phase.phase}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {phase.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <CheckCircle style={{ 
                          width: '20px', 
                          height: '20px', 
                          color: '#10b981', 
                          marginRight: '16px', 
                          marginTop: '2px', 
                          flexShrink: 0 
                        }} />
                        <p style={{ 
                          color: '#374151', 
                          margin: 0,
                          fontSize: '15px',
                          lineHeight: '1.6'
                        }}>
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '32px',
              position: 'sticky',
              top: '32px',
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'auto'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                padding: '32px',
                border: '1px solid #f3f4f6'
              }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#111827', 
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  Career Overview
                </h3>
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  {selectedCareer?.image}
                </div>
                <h4 style={{ 
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '12px',
                  fontSize: '20px',
                  textAlign: 'center'
                }}>
                  {selectedCareer?.title}
                </h4>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '24px',
                  lineHeight: '1.6',
                  textAlign: 'center'
                }}>
                  {selectedCareer?.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Salary Range:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{selectedCareer?.salary}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Growth:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{selectedCareer?.growth}</span>
                  </div>
                </div>
              </div>

              {roadmap.recommendations && roadmap.recommendations.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '32px',
                  border: '1px solid #f3f4f6'
                }}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    marginBottom: '24px'
                  }}>
                    Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {roadmap.recommendations.map((rec, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        padding: '16px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '12px',
                        border: '1px solid #f59e0b'
                      }}>
                        <Star style={{ 
                          width: '18px', 
                          height: '18px', 
                          color: '#f59e0b', 
                          marginRight: '16px', 
                          marginTop: '2px', 
                          flexShrink: 0 
                        }} />
                        <p style={{ 
                          color: '#92400e', 
                          fontSize: '14px', 
                          margin: 0,
                          lineHeight: '1.5',
                          fontWeight: '500'
                        }}>
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Explore Career Paths</h1>
        <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '32px' }}>Discover careers that fit your passion and skills</p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-3 sm:space-y-0 relative">
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type="text"
        placeholder="Search careers..."
        value={searchInputValue}
        onChange={(e) => {
          setSearchInputValue(e.target.value);
          setSearchQuery(e.target.value);
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none text-base sm:text-lg shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
      />
    </div>

    <button
      onClick={handleSearch}
      disabled={loading}
      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
      }`}
    >
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>
</div>

      </div>

      {/* Category Filters */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px 32px", textAlign: "center" }}>
      <select
        value={activeCategory}
        onChange={(e) => setActiveCategory(e.target.value)}
        style={{
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
          maxWidth: "300px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "500" }}>
        ✅ Selected Category: {activeCategory}
      </div>
    </div>

      {/* Career Cards - FIXED WITH PROPER CLICK HANDLER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 48px' }}>
        {loading || isLoadingCategory || isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              border: '4px solid #3b82f6',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '16px' }}>
              {isInitialLoading ? 'Loading all career categories...' : loading ? 'Processing your request...' : 'Loading careers...'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {careersToDisplay.length > 0 ? (
              careersToDisplay.map((career) => (
                <div key={career.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '24px',
                  border: '1px solid #f3f4f6',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                }}
                >
                  <div style={{ 
                    position: 'relative',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{career.image}</div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
                    {career.title}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px', textAlign: 'center', minHeight: '48px' }}>
                    {career.description}
                  </p>
                  <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: '#e0f2fe', 
                      color: '#0369a1', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      marginRight: '8px'
                    }}>
                      {career.salary}
                    </span>
                    <span style={{ 
                      backgroundColor: '#f0fdf4', 
                      color: '#166534', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      marginRight: '8px'
                    }}>
                      {career.growth} Growth
                    </span>
                    {career.category && (
                      <span style={{ 
                        backgroundColor: '#fef3c7', 
                        color: '#92400e', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600'
                      }}>
                        {career.category}
                      </span>
                    )}
                  </div>
                  
                  {/* FIXED BUTTON WITH PROPER CLICK HANDLER AND DEBUG */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      console.log('Button clicked for career:', career); // DEBUG
                      getRoadmap(career); // Call getRoadmap with the career object
                    }}
                    disabled={loading}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      padding: '12px 24px',
                      backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      width: '100%',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                      }
                    }}
                  >
                    {loading ? 'Loading...' : 'View Roadmap'}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '48px 0',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>No careers found</h3>
                <p>Try selecting a different category or search for specific careers.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading indicator styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          #roadmap-section {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          
          .sticky-sidebar {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CareerPathWebsite;
