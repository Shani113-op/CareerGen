// src/pages/ServicesPage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/ServicesPage.css';
import { NavLink } from 'react-router-dom';
import {
  FaBrain,
  FaChartLine,
  FaRobot,
  FaUserTie,
  FaDownload,
  FaUserCircle,
  FaUniversity,
  FaFileAlt,
  FaBalanceScale
} from 'react-icons/fa';

import Loader from '../components/PageLoader'; // ✅ import loader

const services = [
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
    icon: <FaRobot />,
    title: "AI Chatbot",
    description: "Chat with our 24/7 AI career assistant.",
    path: "/chat",
    badge: "New",
  },
  {
    icon: <FaUserTie />,
    title: "Career Counselling",
    description: "Book one-on-one sessions with certified career experts.",
    path: "/consult",
  },
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
  {
    icon: <FaFileAlt />,
    title: "Resume Builder",
    description: "Create modern, ATS-friendly resumes using smart templates.",
    path: "/resume-templates",
    badge: "AI",
  },
    {
    icon: <FaFileAlt />,
    title: "Premium Resume Builder",
    description: "Create ATS-friendly Premium resumes using smart templates.",
    path: "/AllComponents",
    badge: "Premium",
  },
];

const ServicesPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate slow load or do real data fetch if needed
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="services-container">
      <h1 className="services-title">Explore Our Services</h1>
      <p className="services-subtitle">
        Everything you need to make smarter, data-driven career choices.
      </p>
      <div className="services-grid">
        {services.map((service, index) => (
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            to={service.path}
            key={index}
            className="service-link"
          >
            <div className="service-card">
              <div className="icon">{service.icon}</div>
              {service.badge && (
                <div className={`badge ${service.badge.toLowerCase()}`}>
                  {service.badge}
                </div>
              )}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
