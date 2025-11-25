// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBrain,
  FaChartLine,
  FaRobot,
  FaUserTie,
  FaDownload,
  FaUserCircle,
  FaUniversity,
  FaFileAlt,
  FaBalanceScale,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const phases = [
  { name: "Self-Assessment", icon: <FaBrain /> },
  { name: "Exploration", icon: <FaChartLine /> },
  { name: "Planning", icon: <FaDownload /> },
  { name: "Execution", icon: <FaUserTie /> },
];

const services = {
  "Self-Assessment": [
    {
      icon: <FaBrain />,
      title: "Career Assessment",
      description: "Get AI-powered career suggestions based on your interests.",
      path: "/interest-form",
    },
    {
      icon: <FaChartLine />,
      title: "Personality Quiz",
      description: "Know your personality type and find matching careers.",
      path: "/careerQuiz",
    },
    {
      icon: <FaUserCircle />,
      title: "Skill Assessment",
      description: "Evaluate your skills and identify areas for growth.",
      path: "/student-guidance",
    }
  ],
  Exploration: [
    {
      icon: <FaRobot />,
      title: "AI Chatbot",
      description: "Chat with our 24/7 AI career assistant.",
      path: "/chat",
      badge: "New",
    },
    {
      icon: <FaUniversity />,
      title: "Top Colleges",
      description: "Explore top colleges based on your selected field.",
      path: "/college",
    },
    {
      icon: <FaBalanceScale />,
      title: "Career Comparison Tool",
      description: "Compare salaries, demand, skills & scope between careers.",
      path: "/compare",
      badge: "New",
    },
  ],
  Planning: [
    {
      icon: <FaDownload />,
      title: "Career Roadmaps",
      description: "Download step-by-step guides for your dream career.",
      path: "/careerDetail",
    },
    {
      icon: <FaUserCircle />,
      title: "Profile Builder",
      description: "Create your complete student career profile.",
      path: "/profile-builder",
    },
    {
      icon: <FaUniversity />,
      title: "Scholarship Finder",
      description: "Find scholarships that match your profile and goals.",
      path: "/edu-tutor",
    }
  ],
  Execution: [
    {
      icon: <FaFileAlt />,
      title: "Resume Builder",
      description: "Create modern, ATS-friendly resumes using smart templates.",
      path: "/resume-templates",
    },
    {
      icon: <FaUserTie />,
      title: "Career Counselling",
      description: "Book one-on-one sessions with certified career experts.",
      path: "/consult",
    },
  ],
};

// Motivational quotes and descriptions for each phase
const phaseDetails = {
  "Self-Assessment": {
    description:
      "Understand your strengths, interests, and potential paths before taking your first step.",
    quote: "“Knowing yourself is the beginning of all wisdom.” – Aristotle",
  },
  Exploration: {
    description:
      "Dive deep into industries, roles, and real-world opportunities that align with your vision.",
    quote: "“Explore before you decide — clarity comes from curiosity.”",
  },
  Planning: {
    description:
      "Set your direction with a plan that blends passion, skill, and opportunity.",
    quote: "“A goal without a plan is just a wish.” – Antoine de Saint-Exupéry",
  },
  Execution: {
    description:
      "Now it’s time to put your vision into motion — apply, build, and grow with confidence.",
    quote: "“Dream big. Start small. Act now.” – Robin Sharma",
  },
};

const ServicesPage = () => {
  const [activePhase, setActivePhase] = useState("Self-Assessment");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Background gradient based on current phase
  const getBackgroundGradient = () => {
    switch (activePhase) {
      case "Self-Assessment":
        return "from-indigo-100 to-blue-50";
      case "Exploration":
        return "from-blue-100 to-green-50";
      case "Planning":
        return "from-green-100 to-yellow-50";
      case "Execution":
        return "from-yellow-100 to-pink-50";
      default:
        return "from-gray-50 to-white";
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden`}>
      {/* Animated background */}
      <motion.div
        key={activePhase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-700 -z-10`}
      ></motion.div>

      {/* Header */}
      <div className="px-6 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-3">
          Explore Your Career Journey
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Move step-by-step through your personalized career growth path — from
          self-discovery to real-world success.
        </p>
      </div>

      {/* Phase Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 px-4">
        {phases.map((phase) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            key={phase.name}
            onClick={() => setActivePhase(phase.name)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all ${
              activePhase === phase.name
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
            }`}
          >
            <span className="text-xl">{phase.icon}</span>
            {phase.name}
          </motion.button>
        ))}
      </div>

      {/* Phase Description */}
      <motion.div
        key={activePhase + "-desc"}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mb-8 px-4"
      >
        <p className="text-gray-700 text-lg mb-2">
          {phaseDetails[activePhase].description}
        </p>
        <em className="text-gray-500 text-sm">
          {phaseDetails[activePhase].quote}
        </em>
      </motion.div>

      {/* Animated Service Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6"
        >
          {services[activePhase].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={service.path}
                onClick={() => window.scrollTo(0, 0)}
                className="group"
              >
                <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 relative overflow-hidden">
                  <div className="text-3xl mb-3 text-indigo-600">
                    {service.icon}
                  </div>
                  {service.badge && (
                    <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {service.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                    → Start Now
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mt-10 w-full max-w-md px-6">
        <div className="flex justify-between text-gray-500 text-sm mb-1">
          <span>{activePhase}</span>
          <span>
            {phases.findIndex((p) => p.name === activePhase) + 1} /{" "}
            {phases.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-2 bg-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${
                ((phases.findIndex((p) => p.name === activePhase) + 1) /
                  phases.length) *
                100
              }%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center max-w-3xl px-6 pb-10"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Need More Guidance?
        </h2>
        <p className="text-gray-600 mb-6">
          Learn from real experts and explore curated resources designed to help
          you succeed.
        </p>
        <NavLink
          to="/consult"
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          Talk to a Career Mentor
        </NavLink>
      </motion.div>
    </div>
  );
};

export default ServicesPage;
