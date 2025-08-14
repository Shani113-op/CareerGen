import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { motion } from 'framer-motion';
// Import images
import softwareEngineerImg from '../assets/software_engineer.jpg';
import uix_designer from '../assets/uix_designer.jpg';
import doctor from '../assets/doctor.jpg';
import teacher from '../assets/teacher.jpg';
import accountant from '../assets/accountant.jpg';
import research_scientist from '../assets/research_scientist.jpg';
import civil from '../assets/civil.jpg';
import journalist from '../assets/journalist.jpg';
import interior_designer from '../assets/interior_designer.jpg';
import business_analyst from '../assets/business_analyst.jpg';
import lawyer from '../assets/lawyer.jpg';
import chef from '../assets/chef.jpg';
import hero_section from '../assets/hero_section.jpg';
import { useNavigate } from 'react-router-dom';


import {
  Brain,
  Target,
  Users,
  BookOpen,
  MessageCircle,
  Star,
  ChevronRight,
  Code,
  Stethoscope,
  Calculator,
  Palette,
  Briefcase,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
// Mock data for careers
const mockCareers = [
  {
    title: "Software Engineer",
    description: "Design and develop software applications, websites, and systems using programming languages and frameworks.",
    icon: Code,
    growth: "22% growth",
    salary: "$95,000"
  },
  {
    title: "Data Scientist",
    description: "Analyze complex data to help organizations make informed business decisions and predictions.",
    icon: TrendingUp,
    growth: "31% growth",
    salary: "$126,000"
  },
  {
    title: "UX Designer",
    description: "Create intuitive and engaging user experiences for digital products and applications.",
    icon: Palette,
    growth: "13% growth",
    salary: "$85,000"
  },
  {
    title: "Medical Doctor",
    description: "Diagnose and treat illnesses, injuries, and other health conditions to improve patient outcomes.",
    icon: Stethoscope,
    growth: "7% growth",
    salary: "$208,000"
  },
  {
    title: "Financial Analyst",
    description: "Evaluate financial data and market trends to guide investment and business decisions.",
    icon: Calculator,
    growth: "6% growth",
    salary: "$83,000"
  },
  {
    title: "Marketing Manager",
    description: "Develop and execute marketing strategies to promote products and build brand awareness.",
    icon: Briefcase,
    growth: "10% growth",
    salary: "$135,000"
  }
];

const testimonials = [
  {
    name: "Amit Pandey",
    role: "Computer Science Student",
    content: "CareerGenAI helped me discover my passion for AI and machine learning. The personalized guidance was invaluable!",
    rating: 5
  },
  {
    name: "Shani Sharma",
    role: "Pre-Med Student",
    content: "The career roadmap feature showed me exactly what steps to take. I'm now confidently pursuing medicine.",
    rating: 5
  },
  {
    name: "Rahul Padwal",
    role: "Business Graduate",
    content: "I was confused about my career path after graduation. This platform gave me clarity and direction.",
    rating: 4
  }
];

const Home = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const navigate = useNavigate();

  const heroTexts = [
    "Dream Career",
    "Perfect Path",
    "Future Success"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  // Robust fuzzy matching for career titles
  const getImageForCareer = (title) => {
    const key = title?.toLowerCase().trim();

    if (key.includes('software') || key.includes('developer')) return softwareEngineerImg;
    if (key.includes('ui') || key.includes('ux') || key.includes('designer')) return uix_designer;
    if (key.includes('doctor') || key.includes('medical')) return doctor;
    if (key.includes('teacher') || key.includes('educator')) return teacher;
    if (key.includes('accountant') || key.includes('ca')) return accountant;
    if (key.includes('scientist') || key.includes('data') || key.includes('research')) return research_scientist;
    if (key.includes('civil')) return civil;
    if (key.includes('journalist') || key.includes('media')) return journalist;
    if (key.includes('interior')) return interior_designer;
    if (key.includes('analyst') || key.includes('business')) return business_analyst;
    if (key.includes('lawyer') || key.includes('legal')) return lawyer;
    if (key.includes('chef') || key.includes('cook')) return chef;

    return softwareEngineerImg; // Default fallback
  };

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API}/api/careers`)
      .then(res => res.json())
      .then(data => {
        setCareers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching careers:', err);
        setLoading(false);
      });
  }, [API]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${hero_section})` }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="mb-8 flex items-center justify-center gap-4">
            <Brain className="w-16 h-16 text-blue-400 animate-bounce" />
            {/* <img
    src="/robot.webp"
    alt="Robot Waving"
    className="absolute right-0 top-0 w-20 h-20 bg-[transparent]"
  /> */}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000">
              {heroTexts[currentText]}
            </span>
            <br />
            with AI Guidance
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-6 leading-relaxed text-center"
          >
            <motion.span
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1.2, 0.8, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent font-extrabold"
            >
              Free Admission Counselling
            </motion.span>{' '}
            for Engineering, MBBS, MBA, and Medical Courses.
          </motion.p>

          <div className="text-center">
            <a
              href="/consult"
              className="inline-block bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Book Now
            </a>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 
          hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all 
          duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3"
            onClick={() => {navigate('/services');  window.scrollTo(0, 0);}}
          >
            <Target className="w-5 h-5" />
            Explore Our Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 
          py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform 
          hover:scale-105 flex items-center gap-3"
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="w-5 h-5" />
            Chat with AI
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Share Your Interests",
      description: "Tell us what you love—be it coding, art, helping others, or solving complex problems.",
      icon: Lightbulb,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      title: "Get AI Suggestions",
      description: "Our advanced AI analyzes your profile and matches you with suitable careers and roadmaps.",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: 3,
      title: "Explore Opportunities",
      description: "Browse top courses, colleges, and career growth options tailored to your goals.",
      icon: BookOpen,
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent platform guides you through a personalized journey to discover your ideal career path
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.color} mb-4 text-center`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-400">
                  {/* <ChevronRight className="w-8 h-8" /> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CareerCard = ({ career, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
            <career.icon className="w-8 h-8" />
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600 font-semibold">{career.growth}</div>
            <div className="text-sm text-gray-500">{career.salary}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {career.title}
        </h3>

        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
          {career.description}
        </p>

        <div className={`flex items-center text-blue-600 font-semibold transition-all duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
          {/* <span>Learn More</span> */}
          {/* <ArrowRight className="w-4 h-4 ml-2" /> */}
        </div>
      </div>
    </div>
  );
};

const PopularCareersSection = () => {
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCareers(mockCareers);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Popular Career Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore trending careers with high growth potential and competitive salaries
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careers.map((career, index) => (
              <CareerCard key={index} career={career} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "AI-powered recommendations combined with human expert insights"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Database",
      description: "500+ career paths, colleges, and entrance exams in our database"
    },
    {
      icon: Users,
      title: "Student-Focused",
      description: "Designed specifically for students from Class 8th to Graduation"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Real-time AI chat and bookable sessions with career counselors"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose CareerGenAI ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of career guidance with our innovative platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Student Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from students who found their dream careers with CareerGenAI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



const CallToActionSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Your Journey ?
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of students who have discovered their perfect career path with CareerGenAI
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="group bg-white text-blue-600 px-8 py-4 rounded-full \
          font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform 
          hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            onClick={() => {navigate('/services');  window.scrollTo(0, 0);}}
          >
            <CheckCircle className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group border-2 border-white text-white px-8 py-4 rounded-full 
          font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 
          transform hover:scale-105 flex items-center justify-center gap-3"
            onClick={() => {navigate('/consult');  window.scrollTo(0, 0);}}
          >
            <Clock className="w-5 h-5" />
            Schedule Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="min-h-screen">
      <Home />
      <HowItWorksSection />
      <PopularCareersSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CallToActionSection />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
