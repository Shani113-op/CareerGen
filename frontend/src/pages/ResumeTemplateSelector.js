import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/PageLoader"; // ✅ Shared loader component!

// Example: adjust the paths to your actual image files
import template1Img from "../assets/template/resume1.png";
import template2Img from "../assets/template/resume2.png";
import template3Img from "../assets/template/resume3.png";

export default function ResumeTemplateSelector() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  const handleSelectTemplate = (templateId) => {
    navigate(`/resume-builder/${templateId}`);
  };

  // ✅ Show loader for a moment when page mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-blue-700 mt-10 mb-4">
        🎨 Pick Your Resume Template
      </h1>
      <p className="text-gray-600 max-w-xl text-center mb-10">
        Choose a design style that fits your personality & career.
        Each template is polished, easy to edit, and creates a standout impression.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Template Card 1 */}
        <div
          onClick={() => handleSelectTemplate(1)}
          className="group cursor-pointer relative p-8 border-2 border-blue-600 rounded-xl shadow-lg bg-white overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-blue-800"
        >
          <div className="absolute -top-8 -right-8 bg-blue-100 rounded-full w-32 h-32 opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center">
            ✨ Modern Clean
          </h2>
          <p className="text-gray-600 mb-4">
            Crisp blue lines, clean sections — our recommended modern style.
          </p>
          <img
            src={template1Img}
            alt="Modern Clean Resume Preview"
            className="w-full h-auto rounded shadow mb-4"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all">
            Use this Template
          </button>
        </div>

        {/* Template Card 2 */}
        <div
          onClick={() => handleSelectTemplate(2)}
          className="group cursor-pointer relative p-8 border-2 border-gray-700 rounded-xl shadow-lg bg-white overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-black"
        >
          <div className="absolute -top-8 -left-8 bg-gray-200 rounded-full w-32 h-32 opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            📜 Classic Professional
          </h2>
          <p className="text-gray-600 mb-4">
            Elegant serif fonts, neutral tones — perfect for traditional roles.
          </p>
          <img
            src={template2Img}
            alt="Classic Professional Resume Preview"
            className="w-full h-auto rounded shadow mb-4"
          />
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full shadow hover:bg-black transition-all">
            Use this Template
          </button>
        </div>

        {/* Template Card 3 */}
        <div
          onClick={() => handleSelectTemplate(3)}
          className="group cursor-pointer relative p-8 border-2 border-purple-600 rounded-xl shadow-lg bg-white overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-purple-800"
        >
          <div className="absolute -bottom-8 -right-8 bg-purple-200 rounded-full w-32 h-32 opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
          <h2 className="text-2xl font-bold text-purple-700 mb-2 flex items-center">
            🎨 Creative
          </h2>
          <p className="text-gray-600 mb-4">
            Colorful, visual-first — stand out for design or creative roles.
          </p>
          <img
            src={template3Img}
            alt="Creative Resume Preview"
            className="w-full h-auto rounded shadow mb-4"
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-800 transition-all">
            Use this Template
          </button>
        </div>


      </div>

      <p className="mt-16 text-sm text-gray-500">
        ✨ Pro Tip: You can explore all templates & switch anytime!
      </p>
    </div>
  );
}
