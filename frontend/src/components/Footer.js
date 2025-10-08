// src/components/Footer.js
import {
  Brain,
} from 'lucide-react';
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-6">
          <Brain className="w-8 h-8 text-blue-400 mr-3" />
          <span className="text-2xl font-bold">CareerGenAI</span>
        </div>
        <p className="text-gray-400 mb-6">
          Empowering students to discover their dream careers through AI-powered guidance
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <a href="https://drive.google.com/file/d/1t0TgLDb_IUDdGhKndtAkM60IjokU_Jw8/view?usp=sharing" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="https://drive.google.com/file/d/1_GDpU4WBO838DGWPJu7Ep-oGkTIg_31V/view?usp=sharing" className="text-gray-400 hover:text-blue-400 transition-colors">Terms & Service</a>
          <a href="/" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
          © {new Date().getFullYear()} CareerGenAI produce by Aryahas World InfoTech (OPC) Pvt. Ltd. . All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
