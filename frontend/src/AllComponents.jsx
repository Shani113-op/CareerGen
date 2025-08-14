// src/AllComponents.jsx
// This file contains the Resume Builder logic and templates only (Header, Footer, and Landing Page removed)

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from "lucide-react"; // Icons
import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { generatePDF, generatePDFWithPuppeteer } from './utils';
import { useResumeContext } from './context/ResumeContext';
import { templatesMeta } from './templates/templatesArray';
import './styles/global.css';
import { motion } from "framer-motion";

// --- DEFAULT RESUME DATA ---
export const defaultResumeData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  experience: [
    {
      position: '',
      company: '',
      duration: '',
      description: ''
    }
  ],
  education: [
    {
      degree: '',
      school: '',
      year: ''
    }
  ],
  skills: [
    {
      name: '',
      level: 75
    }
  ],
  projects: [
    {
      name: '',
      description: '',
      technologies: []
    }
  ]
};


// --- Download Button ---
const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="flex space-x-3">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${isGenerating
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
      >
        {isGenerating ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : (
          'Download PDF'
        )}
      </button>
      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
        Save Draft
      </button>
    </div>
  );
};

// --- Resume Form ---
const ResumeForm = () => {
  const { resumeData, updateResumeData } = useResumeContext();
  const [activeSection, setActiveSection] = useState('personal');

  const handleInputChange = (section, field, value) => {
    updateResumeData({
      ...resumeData,
      [section]: {
        ...resumeData[section],
        [field]: value
      }
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updatedArray = [...(resumeData[section] || [])];
    updatedArray[index] = {
      ...updatedArray[index],
      [field]: value
    };
    updateResumeData({
      ...resumeData,
      [section]: updatedArray
    });
  };

  const addArrayItem = (section, newItem) => {
    updateResumeData({
      ...resumeData,
      [section]: [...(resumeData[section] || []), newItem]
    });
  };

  const removeArrayItem = (section, index) => {
    const updatedArray = (resumeData[section] || []).filter((_, i) => i !== index);
    updateResumeData({
      ...resumeData,
      [section]: updatedArray
    });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-4 font-medium whitespace-nowrap ${activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={resumeData.personal?.firstName || ''}
                  onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={resumeData.personal?.lastName || ''}
                  onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={resumeData.personal?.email || ''}
                onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={resumeData.personal?.phone || ''}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.personal?.location || ''}
                  onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                rows={4}
                value={resumeData.personal?.summary || ''}
                onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        {activeSection === 'experience' && (
          <div className="space-y-6">
            {(resumeData.experience || []).map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input type="text" value={exp.position || ''} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" value={exp.company || ''} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input type="text" value={exp.duration || ''} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={exp.description || ''} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="text-right">
                  <button onClick={() => removeArrayItem('experience', index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('experience', { position: '', company: '', duration: '', description: '' })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Experience</button>
          </div>
        )}
        {activeSection === 'education' && (
          <div className="space-y-6">
            {(resumeData.education || []).map((edu, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input type="text" value={edu.degree || ''} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                    <input type="text" value={edu.school || ''} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="text" value={edu.year || ''} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2020 - 2024" />
                </div>
                <div className="text-right">
                  <button onClick={() => removeArrayItem('education', index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Education</button>
          </div>
        )}
        {activeSection === 'skills' && (
          <div className="space-y-6">
            {(resumeData.skills || []).map((skill, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                  <input type="text" value={skill.name || ''} onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="text-right">
                  <button onClick={() => removeArrayItem('skills', index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('skills', { name: '' })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Skill</button>
          </div>
        )}
        {activeSection === 'projects' && (
          <div className="space-y-6">
            {(resumeData.projects || []).map((project, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input type="text" value={project.name || ''} onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={project.description || ''} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma-separated)</label>
                  <input type="text" value={(project.technologies || []).join(', ')} onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value.split(',').map(item => item.trim()))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="text-right">
                  <button onClick={() => removeArrayItem('projects', index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [] })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Project</button>
          </div>
        )}
        {activeSection === 'certifications' && (
          <div className="space-y-6">
            {(resumeData.certifications || []).map((cert, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                    <input type="text" value={cert.name || ''} onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                    <input type="text" value={cert.issuer || ''} onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Awarded</label>
                  <input type="text" value={cert.date || ''} onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., June 2023" />
                </div>
                <div className="text-right">
                  <button onClick={() => removeArrayItem('certifications', index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Certification</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Resume Preview ---
const ResumePreview = ({ templateComponent: TemplateComponent }) => {
  const { resumeData } = useResumeContext();
   const [zoom, setZoom] = useState(0.75); // default zoom

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2)); // limit max zoom
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5)); // limit min zoom

  return (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Live Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={zoomIn}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Zoom In
          </button>
          <button
            onClick={zoomOut}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Zoom Out
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="border border-gray-200 rounded-lg overflow-auto flex justify-center">
        <div
          id="resume-preview"
          className="bg-white p-4 sm:p-8 min-h-[11in] origin-top mx-auto"
          style={{
            width: "8.5in",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          {TemplateComponent ? (
            <TemplateComponent data={resumeData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-base sm:text-lg mb-2">
                  Select a template to see preview
                </p>
                <p className="text-sm">Choose from our professional templates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// const TemplateCard = ({ template }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//     <div className="relative">
//       <img src={template.preview} alt={template.name} className="w-full h-64 object-cover" />
//       <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
//         <Link to={`/builder/${template.id}`} className="bg-blue-600 text-white px-6 py-2 rounded-md opacity-0 hover:opacity-100 transition-opacity transform hover:scale-105">Use Template</Link>
//       </div>
//     </div>
//     <div className="p-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.name}</h3>
//       <p className="text-gray-600 text-sm">{template.description}</p>
//       <div className="mt-3 flex items-center justify-between">
//         <span className="text-sm text-gray-500">{template.category}</span>
//         <Link to={`/builder/${template.id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">Select →</Link>
//       </div>
//     </div>
//   </div>
// );
// --- Resume Builder Page ---
const ResumeBuilderPage = ({ getTemplateComponent, templates }) => {
  const { templateId } = useParams();
  const { selectedTemplate, setSelectedTemplate } = useResumeContext();

  useEffect(() => {
    if (templateId && templateId !== selectedTemplate) {
      const template = (templates || []).find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(templateId);
      }
    }
  }, [templateId, selectedTemplate, setSelectedTemplate, templates]);

  const TemplateComponent = getTemplateComponent
    ? getTemplateComponent(selectedTemplate)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container items-center mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Build Your Resume
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in your details, choose a template, and see your professional resume
            come to life in real-time.
          </p>
        </motion.div>

        {/* Step Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-blue-50 rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 Steps to Build</h2>
          <div className="grid md:grid-cols-4 gap-4 text-blue-700 text-sm">
            <div>① Choose your template</div>
            <div>② Fill in personal & professional info</div>
            <div>③ Preview in real-time</div>
            <div>④ Download as PDF</div>
          </div>
        </motion.div>

        {/* Template Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex flex-col items-center bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Your Template
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {(templates || []).map((template) => (
              <motion.button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                whileHover={{ scale: 1.03 }}
                className={`flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 space-x-0 p-6 rounded-2xl border-2 shadow-sm transition-all ${selectedTemplate === template.id
                    ? "border-blue-600 bg-blue-50 shadow-md hover:bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-white hover:border-[rgb(147,197,253)]"
                  }`}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-48 h-60 object-cover rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                  <p className="text-gray-600 text-sm">{template.category}</p>
                </div>
              </motion.button>
            ))}
          </div>


        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <ResumeForm />
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Export Resume
              </h2>
              <p className="text-gray-600 mb-4">
                Once satisfied, download your resume as a high-quality PDF file.
              </p>
              <DownloadButton />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:sticky lg:top-8"
          >
            <ResumePreview templateComponent={TemplateComponent} />
          </motion.div>
        </div>

        {/* Resume Tips */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-blue-50 rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Resume Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h3 className="font-semibold mb-1">✂ Keep it concise</h3>
              <p>Limit your resume to 1-2 pages and focus on relevant experience.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">⚡ Use action verbs</h3>
              <p>Start bullet points with strong action verbs like "Managed" or "Developed".</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📊 Quantify achievements</h3>
              <p>Show results with numbers and measurable impact.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🎯 Tailor to the job</h3>
              <p>Match your resume content to the specific job you’re applying for.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Templates ---
// Template1.jsx
const Template1 = ({ data }) => {
  const { personal, experience = [], education = [], skills = [], projects = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personal?.firstName || 'First'} {personal?.lastName || 'Last'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>{personal?.email || 'email@example.com'}</span>
          <span>{personal?.phone || '+1 (555) 123-4567'}</span>
          <span>{personal?.location || 'City, State'}</span>
        </div>
      </header>

      {/* Professional Summary */}
      {personal?.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">{exp.duration}</span>
              </div>
              <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
              <p className="text-gray-700 text-sm">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-600">{edu.year}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-300 pb-1">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-gray-700 text-sm">{project.description}</p>
              {project.technologies && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
const Icon = React.memo(({ name, className }) => {
  const icons = {
    email: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    phone: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    location: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  };
  return icons[name] || null;
});
const MainContentSection = React.memo(({ title, children }) => (
  <section className="mb-6 break-inside-avoid">
    <h2 className="text-2xl font-bold text-white mb-3 border-b-2 border-blue-400 pb-2">{title}</h2>
    {children}
  </section>
));
const SidebarSection = React.memo(({ title, children }) => (<section className="mb-6 break-inside-avoid"><h2 className="text-lg font-semibold mb-3 text-blue-300 uppercase tracking-wider">{title}</h2>{children}</section>));

const Template2 = ({ data }) => {
  const { personal, experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = () => {
    const element = printRef.current;
    if (!element || loading) return;

    setLoading(true);

    const doc = new jsPDF();
    doc.html(element, {
      callback: function (doc) {
        doc.save('resume.pdf');
        setLoading(false);
      },
      x: 10,
      y: 10
    });
  };

  return (
    <div className="bg-gray-200 p-4 sm:p-8 font-sans">
      {/* <div className="text-center mb-4">
                <button
                    onClick={handleDownloadPdf}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Downloading...' : 'Download as PDF'}
                </button>
            </div> */}

      <div className="max-w-4xl mx-auto">
        <div ref={printRef} className="bg-white shadow-lg">
          <div className="flex flex-row">
            <aside className="w-1/3 bg-slate-800 text-white p-6">
              <header className="mb-8"><h1 className="text-3xl font-bold text-white">{personal?.firstName || 'Your'} {personal?.lastName || 'Name'}</h1></header>
              <SidebarSection title="Contact">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3"><Icon name="email" className="text-blue-300 w-4 h-4 flex-shrink-0" /><a href={`mailto:${personal?.email}`} className="hover:text-blue-300 break-all">{personal?.email || 'email@example.com'}</a></li>
                  <li className="flex items-center gap-3"><Icon name="phone" className="text-blue-300 w-4 h-4 flex-shrink-0" /><a href={`tel:${personal?.phone}`} className="hover:text-blue-300">{personal?.phone || '(123) 456-7890'}</a></li>
                  <li className="flex items-center gap-3"><Icon name="location" className="text-blue-300 w-4 h-4 flex-shrink-0" /><span>{personal?.location || 'City, Country'}</span></li>
                </ul>
              </SidebarSection>
              {skills.length > 0 && <SidebarSection title="Skills"><ul className="text-sm space-y-1">{skills.map((skill, index) => (<li key={index} className="flex items-start"><span className="text-blue-300 mr-2 font-bold">•</span><span>{skill.name}</span></li>))}</ul></SidebarSection>}
              {education.length > 0 && <SidebarSection title="Education"><ul className="space-y-4">{education.map((edu, index) => (<li key={index} className="text-sm"><h3 className="font-semibold text-white">{edu.degree}</h3><p className="text-slate-300">{edu.school}</p><p className="text-slate-400 text-xs">{edu.year}</p></li>))}</ul></SidebarSection>}
            </aside>

            {/* --- MAIN CONTENT: MODIFIED FOR DARK THEME --- */}
            <main className="w-2/3 bg-slate-800 p-8">
              {personal?.summary && <MainContentSection title="About Me"><p className="text-slate-300 text-sm" style={{ whiteSpace: 'pre-line' }}>{personal.summary}</p></MainContentSection>}
              {experience.length > 0 && <MainContentSection title="Experience"><ul className="space-y-4">{experience.map((exp, index) => (<li key={index} className="border-l-2 border-blue-400 pl-4"><h3 className="text-lg font-semibold text-white">{exp.position}</h3><p className="text-slate-300 font-medium">{exp.company}</p><span className="text-sm text-slate-400">{exp.duration}</span><p className="text-slate-300 text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{exp.description}</p></li>))}</ul></MainContentSection>}
              {projects.length > 0 && <MainContentSection title="Projects"><ul className="space-y-4">{projects.map((project, index) => (<li key={index} className="border-l-2 border-blue-400 pl-4"><h3 className="text-lg font-semibold text-white">{project.name}</h3><p className="text-slate-300 text-sm my-2" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>{project.technologies?.length > 0 && (<div className="mt-2"><p className="text-slate-300 text-sm font-medium mb-1">Technologies:</p><p className="text-slate-200 text-sm">{project.technologies.join(' • ')}</p></div>)}</li>))}</ul></MainContentSection>}
              {certifications.length > 0 && <MainContentSection title="Certifications"><ul className="space-y-4">{certifications.map((cert, index) => (<li key={index} className="border-l-2 border-blue-400 pl-4"><h3 className="text-lg font-semibold text-white">{cert.name}</h3><p className="text-slate-300 font-medium">{cert.issuer}</p><span className="text-sm text-slate-400">{cert.date}</span></li>))}</ul></MainContentSection>}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
// Template3.jsx
const Template3 = ({ data }) => {
  const { personal, experience = [], education = [], skills = [], projects = [] } = data || {};
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element || loading) return;

    setLoading(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // --- FIX STARTS HERE ---

      // 1. Get the page width from the jsPDF instance.
      const pdfPageWidth = doc.internal.pageSize.getWidth();

      // 2. Get the width of the HTML content. We use the same width as our
      //    Tailwind class 'max-w-4xl' for consistency, which is 896px.
      //    We'll use a virtual window to render it.
      const contentWidth = 1200; // windowWidth for rendering

      // 3. Define the desired width of your content on the PDF.
      //    Let's use 90% of the page width for some nice margins.
      const pdfContentWidth = pdfPageWidth * 0.9;

      // 4. Calculate the horizontal margin to center the content.
      const xMargin = (pdfPageWidth - pdfContentWidth) / 2;

      // The .html() method returns a promise, so we can use await.
      await doc.html(element, {
        x: xMargin, // Apply the calculated margin
        y: 20,      // Add a small top margin
        // Options for html2canvas to improve rendering quality.
        html2canvas: {
          scale: pdfContentWidth / contentWidth, // Adjust scale for better quality
          useCORS: true, // Needed if your template includes images from other domains.
        },
        autoPaging: 'text', // Automatically creates new pages
        width: pdfContentWidth, // Set the width of the content on the PDF
        windowWidth: contentWidth, // A wider virtual window to render layout correctly
      });

      // --- FIX ENDS HERE ---

      doc.save('resume.pdf');

    } catch (error) {
      console.error("An error occurred while generating the PDF:", error);
    } finally {
      // Ensure the loading state is reset even if an error occurs.
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="text-center mb-4">
        <button
          onClick={handleDownloadPdf}
          className="px-6 py-2 mb-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Downloading...' : 'Download as PDF'}
        </button>
      </div> */}

      {/* Adding padding (p-8) to this container creates a nice margin in the final PDF file. */}
      <div ref={printRef} className="max-w-4xl mx-auto bg-white text-gray-900 leading-relaxed font-light p-8">

        {/* Header */}
        <header className="text-center py-8 border-b border-gray-200">
          <h1 className="text-4xl font-thin mb-4 tracking-wide">
            {personal?.firstName || 'First'} <span className="font-normal">{personal?.lastName || 'Last'}</span>
          </h1>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <span>{personal?.email || 'email@example.com'}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{personal?.phone || '+1 (555) 123-4567'}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{personal?.location || 'City, State'}</span>
          </div>
        </header>

        {/* Professional Summary */}
        {personal?.summary && (
          <section className="py-8">
            <p className="text-center text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h2 className="text-center text-sm font-semibold text-gray-800 tracking-widest mb-8 uppercase">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{exp.position}</h3>
                  <p className="text-gray-600 mb-2">{exp.company} • {exp.duration}</p>
                  <p className="text-gray-700 text-sm max-w-2xl mx-auto leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h2 className="text-center text-sm font-semibold text-gray-800 tracking-widest mb-8 uppercase">
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h2 className="text-center text-sm font-semibold text-gray-800 tracking-widest mb-8 uppercase">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="py-8 border-t border-gray-100">
            <h2 className="text-center text-sm font-semibold text-gray-800 tracking-widest mb-8 uppercase">
              Projects
            </h2>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-700 text-sm max-w-2xl mx-auto mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

// Template4.jsx
// Use the Icon component defined above (or memoized version if present)
const Template4 = ({ data }) => {
  const { personal, experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element || loading) return;
    setLoading(true);
    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: 'resume-template4.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Styles for A4 sizing and page breaks */}
      <style>{`
        .preview-container {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background: white;
          font-family: Arial, sans-serif;
          padding: 2rem;
          box-sizing: border-box;
          text-align: center;
        }
        .section {
          margin-bottom: 1.2rem;
          break-inside: avoid;
        }
        .section-header {
          background: #1e3a8a;
          color: white;
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          font-size: 1.17rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          min-height: 36px;
        }
        .section-header span, .section-header svg {
          display: flex;
          align-items: center;
        }
        .section-header svg {
          vertical-align: middle;
          margin-bottom: 0 !important;
        }
        .section-header svg {
          vertical-align: middle;
          margin-bottom: 0;
        }
        .content-item {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 0.75rem;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          min-height: 56px;
          gap: 8px;
          line-height: 1.25;
        }
        .content-item svg {
          vertical-align: middle;
          margin-bottom: 0 !important;
        }
        .content-item span, .content-item p, .content-item h4, .content-item div {
          vertical-align: middle;
          margin: 0 !important;
        }
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .project-item {
          break-inside: avoid;
          margin-bottom: 1rem;
        }
        .contact-info {
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
        }
        .contact-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }
        .contact-table td {
          text-align: center;
          padding: 0 1rem;
          vertical-align: top;
        }
        .contact-item {
          display: block;
          text-align: center;
        }
        .contact-item svg {
          display: inline;
          margin-right: 0.5rem;
          vertical-align: text-bottom;
        }
        @media print {
          body {
            background: white !important;
          }
          .preview-container {
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* <div className="text-center my-4 no-print">
        <button
          onClick={handleDownloadPdf}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Downloading...' : 'Download as PDF'}
        </button>
      </div> */}
      <div ref={printRef} className="preview-container">
        <header className="section">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {personal?.firstName || 'First'} {personal?.lastName || 'Last name'}
          </h1>
          <div className="contact-info">
            <table className="contact-table">
              <tr>
                <td>
                  <div className="contact-item">
                    <Icon name="email" />
                    <a href={`mailto:${personal?.email}`} className="hover:text-blue-600">{personal?.email || 'email@example.com'}</a>
                  </div>
                </td>
                <td>
                  <div className="contact-item">
                    <Icon name="phone" />
                    <a href={`tel:${personal?.phone}`} className="hover:text-blue-600">{personal?.phone || '+91'}</a>
                  </div>
                </td>
                <td>
                  <div className="contact-item">
                    <Icon name="location" />
                    <span>{personal?.location || 'City, State'}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </header>

        {personal?.summary && (
          <section className="section">
            <div className="section-header">
              <span>About Me</span>
            </div>
            <div className="content-item">
              <p className="text-slate-700" style={{ whiteSpace: 'pre-line' }}>
                {personal.summary}
              </p>
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="section">
            <div className="section-header">
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Icon name="experience" className="text-white" />
                <span style={{ fontWeight: 'bold', marginTop: '0.1rem' }}>Experience</span>
              </span>
            </div>
            {experience.map((exp, index) => (
              <div key={index} className="content-item">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{exp.position}</h4>
                <p className="text-blue-600 font-medium mb-1">{exp.company}</p>
                <p className="text-sm text-slate-500 mb-3">{exp.duration}</p>
                <p className="text-slate-700 text-sm" style={{ whiteSpace: 'pre-line' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </section>
        )}

        <div className="two-column">
          {education.length > 0 && (
            <section className="section">
              <div className="section-header">
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <Icon name="education" className="text-white" />
                  <span style={{ fontWeight: 'bold', marginTop: '0.1rem' }}>Education</span>
                </span>
              </div>
              {education.map((edu, index) => (
                <div key={index} className="content-item">
                  <h4 className="font-semibold text-slate-900 mb-1">{edu.degree}</h4>
                  <p className="text-blue-600 font-medium mb-1">{edu.school}</p>
                  <p className="text-sm text-slate-500">{edu.year}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className="section">
              <div className="section-header">
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <Icon name="skills" className="text-white" />
                  <span style={{ fontWeight: 'bold', marginTop: '0.1rem' }}>Skills</span>
                </span>
              </div>
              <div className="content-item">
                <span className="text-slate-700 text-sm">
                  {skills.map((skill, index) => (
                    <span key={index}>
                      {index > 0 && " • "}
                      {skill.name}
                    </span>
                  ))}
                </span>
              </div>
            </section>
          )}
        </div>

        {projects.length > 0 && (
          <section className="section">
            <div className="section-header">
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Icon name="projects" className="text-white" />
                <span style={{ fontWeight: 'bold', marginTop: '0.1rem' }}>Projects</span>
              </span>
            </div>
            {projects.map((project, index) => (
              <div key={index} className="content-item project-item">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h4>
                <p className="text-slate-700 text-sm mb-3">{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Technologies:</p>
                    <p className="text-slate-700 text-sm">
                      {project.technologies.join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certificates Section Below Projects */}
        {certifications.length > 0 && (
          <section className="section">
            <div className="section-header">
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Icon name="certificate" className="text-white" />
                <span style={{ fontWeight: 'bold', marginTop: '0.1rem' }}>Certificates</span>
              </span>
            </div>
            {certifications.map((cert, idx) => (
              <div key={idx} className="content-item project-item">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{cert.name}</h4>
                <p className="text-slate-700 text-sm mb-1">{cert.issuer}</p>
                <p className="text-sm text-slate-500">{cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
// Template5.jsx
const Template5 = ({ data }) => {
  const { personal, experience = [], education = [], skills = [], projects = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 leading-relaxed">
      {/* Header */}
      <header className="bg-green-700 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {personal?.firstName || 'First'} {personal?.lastName || 'Last'}
            </h1>
            <div className="space-y-1 text-green-100">
              <p>✉ {personal?.email || 'email@example.com'}</p>
              <p>📞 {personal?.phone || '+1 (555) 123-4567'}</p>
              <p>📍 {personal?.location || 'City, State'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Professional Summary */}
        {personal?.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4 pb-2 border-b-2 border-green-200">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-6 pb-2 border-b-2 border-green-200">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-green-400 pl-6">
                  <div className="bg-gray-50 p-6 rounded-r-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-green-600 font-medium text-lg">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-4 pb-2 border-b border-green-200">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600 font-medium">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-4 pb-2 border-b border-green-200">
                Core Skills
              </h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <span className="text-sm text-green-600 font-semibold">{skill.level || 75}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level || 75}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-green-700 mb-6 pb-2 border-b-2 border-green-200">
              Key Projects
            </h2>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{project.name}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
// Template6.jsx
const Section = React.memo(({ title, children }) => (
  <section className="mb-6">
    <div className="flex items-center mb-4">
      <span style={{ backgroundColor: '#0891B2', height: '24px', width: '4px' }} className="mr-3"></span>
      <h2 style={{ color: '#0891B2' }} className="text-xl font-bold">{title}</h2>
    </div>
    {/* The children will now be a UL, so no extra padding needed here */}
    <div>
      {children}
    </div>
  </section>
));

const Template6 = ({ data }) => {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  const { personal, experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};

  // PDF generation logic updated for bullet points
  const handleDownloadPdf = () => {
    if (loading) return;
    setLoading(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      let currentY = 0;

      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const leftMargin = 15;
      const textIndent = leftMargin + 5; // Indent for text after a bullet
      const contentWidth = pageWidth - (leftMargin * 2);
      const FONT_COLOR = '#0D0D0D';
      const ACCENT_COLOR_BLUE = '#2563EB';
      const ACCENT_COLOR_CYAN = '#0891B2';

      const checkPageBreak = (y, heightNeeded = 10) => {
        if (y + heightNeeded > pageHeight - 20) {
          doc.addPage();
          return 20;
        }
        return y;
      };

      // --- Header ---
      const headerHeight = 35;
      doc.setFillColor(ACCENT_COLOR_BLUE);
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor('#FFFFFF');
      doc.text(`${personal?.firstName || 'First'} ${personal?.lastName || 'Last'}`, leftMargin, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const contactInfo = [
        personal?.email || 'email@example.com',
        personal?.phone || '+1 (555) 123-4567',
        personal?.location || 'City, State'
      ].join('  |  ');
      doc.text(contactInfo, leftMargin, 28);
      currentY = headerHeight + 15;

      const drawSectionTitle = (title) => {
        currentY = checkPageBreak(currentY, 15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(ACCENT_COLOR_CYAN);
        doc.setFillColor(ACCENT_COLOR_CYAN);
        doc.rect(leftMargin, currentY - 4, 1.5, 8, 'F');
        doc.text(title, leftMargin + 5, currentY + 2);
        currentY += 12;
      };

      // --- About Section (No bullets here) ---
      if (personal?.summary) {
        drawSectionTitle('About');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(FONT_COLOR);
        const summaryLines = doc.splitTextToSize(personal.summary, contentWidth);
        summaryLines.forEach(line => {
          currentY = checkPageBreak(currentY, 5);
          doc.text(line, leftMargin, currentY);
          currentY += 5;
        });
        currentY += 5;
      }

      // --- Experience Section (with bullets) ---
      if (experience.length > 0) {
        drawSectionTitle('Experience');
        experience.forEach(exp => {
          currentY = checkPageBreak(currentY, 20);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(FONT_COLOR);
          doc.text('•', leftMargin, currentY);
          doc.text(exp.position, textIndent, currentY);

          doc.setFont('helvetica', 'normal');
          doc.text(exp.duration, pageWidth - leftMargin, currentY, { align: 'right' });
          currentY += 5;

          doc.setFontSize(11);
          doc.setTextColor(ACCENT_COLOR_BLUE);
          doc.text(exp.company, textIndent, currentY);
          currentY += 6;

          doc.setFontSize(10);
          doc.setTextColor(FONT_COLOR);
          const descLines = doc.splitTextToSize(exp.description, pageWidth - textIndent - leftMargin);
          descLines.forEach(line => {
            currentY = checkPageBreak(currentY, 5);
            doc.text(line, textIndent, currentY);
            currentY += 5;
          });
          currentY += 8;
        });
      }

      // --- Education Section (with bullets) ---
      if (education.length > 0) {
        drawSectionTitle('Education');
        education.forEach(edu => {
          currentY = checkPageBreak(currentY, 15);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(FONT_COLOR);
          doc.text('•', leftMargin, currentY);
          doc.text(edu.degree, textIndent, currentY);

          doc.setFont('helvetica', 'normal');
          doc.text(edu.year, pageWidth - leftMargin, currentY, { align: 'right' });
          currentY += 5;

          doc.setFontSize(11);
          doc.setTextColor(ACCENT_COLOR_BLUE);
          doc.text(edu.school, textIndent, currentY);
          currentY += 10;
        });
      }

      // --- Skills Section (with bullets) ---
      if (skills.length > 0) {
        drawSectionTitle('Skills');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(FONT_COLOR);

        // Create a bulleted list of skills
        skills.forEach(skill => {
          currentY = checkPageBreak(currentY, 6);
          doc.text('•', leftMargin, currentY);
          doc.text(skill.name, textIndent, currentY);
          currentY += 6;
        });
        currentY += 5;
      }

      // --- Projects Section (with bullets) ---
      if (projects.length > 0) {
        drawSectionTitle('Projects');
        projects.forEach(project => {
          currentY = checkPageBreak(currentY, 15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(FONT_COLOR);
          doc.text('•', leftMargin, currentY);
          doc.text(project.name, textIndent, currentY);
          currentY += 6;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          const descLines = doc.splitTextToSize(project.description, pageWidth - textIndent - leftMargin);
          descLines.forEach(line => {
            currentY = checkPageBreak(currentY, 5);
            doc.text(line, textIndent, currentY);
            currentY += 5;
          });

          if (project.technologies && project.technologies.length > 0) {
            currentY = checkPageBreak(currentY, 5);
            doc.setFont('helvetica', 'bold');
            doc.text(`Technologies:`, textIndent, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(project.technologies.join(', '), textIndent + 25, currentY);
            currentY += 5;
          }
          currentY += 8;
        });
      }

      // --- Certifications Section (with bullets) ---
      if (certifications.length > 0) {
        drawSectionTitle('Certifications');
        certifications.forEach(cert => {
          currentY = checkPageBreak(currentY, 15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(FONT_COLOR);
          doc.text('•', leftMargin, currentY);
          doc.text(cert.name, textIndent, currentY);

          doc.setFont('helvetica', 'normal');
          doc.text(cert.date, pageWidth - leftMargin, currentY, { align: 'right' });
          currentY += 5;

          doc.setFontSize(11);
          doc.setTextColor(ACCENT_COLOR_BLUE);
          doc.text(cert.issuer, textIndent, currentY);
          currentY += 10;
        });
      }
      doc.save('resume.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- JSX Live Preview Updated for Bullet Points ---
  return (
    <>
      {/* <div className="text-center mb-4 no-print">
                <button
                    onClick={handleDownloadPdf}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Downloading...' : 'Download PDF'}
                </button>
            </div> */}

      <div ref={printRef} style={{ width: '210mm', minHeight: '297mm' }} className="p-0 mx-auto bg-white text-gray-800 shadow-lg">
        <header style={{ backgroundColor: '#2563EB' }} className="p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            {personal?.firstName || 'First'} {personal?.lastName || 'Last'}
          </h1>
          <p className="text-sm">
            <span>{personal?.email || 'email@example.com'}</span>
            <span className="mx-2">|</span>
            <span>{personal?.phone || '+1 (555) 123-4567'}</span>
            <span className="mx-2">|</span>
            <span>{personal?.location || 'City, State'}</span>
          </p>
        </header>

        <div className="p-8">
          {personal?.summary && (
            <Section title="About">
              <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {personal.summary}
              </p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience">
              <ul className="list-disc pl-5 space-y-5">
                {experience.map((exp, index) => (
                  <li key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{exp.position}</h3>
                      <p className="text-sm text-gray-600">{exp.duration}</p>
                    </div>
                    <p style={{ color: '#2563EB' }} className="font-semibold">{exp.company}</p>
                    <p className="text-sm mt-2 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              <ul className="list-disc pl-5 space-y-4">
                {education.map((edu, index) => (
                  <li key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.year}</p>
                    </div>
                    <p style={{ color: '#2563EB' }} className="font-semibold">{edu.school}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              <ul className="list-disc pl-5 space-y-1">
                {skills.map((skill, index) => (
                  <li key={index} className="text-sm">{skill.name}</li>
                ))}
              </ul>
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              <ul className="list-disc pl-5 space-y-5">
                {projects.map((project, index) => (
                  <li key={index}>
                    <h3 className="text-lg font-bold">{project.name}</h3>
                    <p className="text-sm mt-2 mb-2 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <p className="text-sm">
                        <span className="font-bold">Technologies: </span>
                        {project.technologies.join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              <ul className="list-disc pl-5 space-y-4">
                {certifications.map((cert, index) => (
                  <li key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.date}</p>
                    </div>
                    <p style={{ color: '#2563EB' }} className="font-semibold">{cert.issuer}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
};

const Template6Alt = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    link: '',
    education: '',
    skills: '',
    experience: '',
    projects: '',
    summary: '',
    awards: '',
    certifications: '',
    languages: '',
    interests: '',
    objective: '',
  });
  const [resumeMd, setResumeMd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResumeMd('');
    try {
      await new Promise((r) => setTimeout(r, 500));
      setResumeMd('✅ Your AI-powered resume is ready!');
    } catch (err) {
      console.error(err);
      setError('⚠️ Error generating resume.');
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(2);
    doc.line(20, 15, 190, 15);
    doc.setFontSize(22);
    doc.setFont("times new roman", "bold");
    doc.setTextColor(0, 102, 204);
    doc.text(form.name || 'Your Name', 20, 30);
    doc.setFont("times new roman", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const contactDetails = `${form.phone} | ${form.email} | ${form.link}`;
    doc.text(contactDetails, 20, 37);
    let currentY = 47;
    const blockGap = 2;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginBottom = 20;
    const addSection = (title, content, isLast = false) => {
      if (content) {
        doc.setFont("times new roman", "bold");
        doc.setFontSize(14);
        doc.setLineHeightFactor(1.5);
        if (currentY + 10 >= pageHeight - marginBottom) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(`${title}:`, 20, currentY);
        currentY += 6;
        doc.setFont("times new roman", "normal");
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(content, 180);
        lines.forEach(line => {
          if (currentY + lineHeight >= pageHeight - marginBottom) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, 20, currentY);
          currentY += lineHeight;
        });
        currentY += blockGap;
        if (!isLast) {
          if (currentY + 5 >= pageHeight - marginBottom) {
            doc.addPage();
            currentY = 20;
          }
          doc.setDrawColor(0, 102, 204);
          doc.setLineWidth(0.5);
          doc.line(20, currentY, 190, currentY);
          currentY += 7;
        }
      }
    };
    addSection('Objective', form.objective);
    addSection('Professional Summary', form.summary);
    addSection('Skills', form.skills);
    addSection('Experience', form.experience);
    addSection('Education', form.education);
    addSection('Projects', form.projects);
    addSection('Certifications', form.certifications);
    addSection('Languages', form.languages);
    addSection('Interests', form.interests);
    addSection('Awards', form.awards, true);
    addSection('Objective', form.objective);
    addSection('Professional Summary', form.summary);
    addSection('Skills', form.skills);
    addSection('Experience', form.experience);
    addSection('Education', form.education);
    addSection('Projects', form.projects);
    addSection('Certifications', form.certifications);
    addSection('Languages', form.languages);
    addSection('Interests', form.interests);
    addSection('Awards', form.awards, true);
    doc.save(`${form.name}_Resume.pdf`);
  };
  return (
    <div className="resume-builder-container">
      <h1 className="resume-title">📝 AI-Powered Resume Builder</h1>
      <p className="resume-subtitle">Generate a professional resume instantly.</p>
      <div className="resume-form">
        {Object.entries(form).map(([key, value]) => {
          let placeholder = `Enter your ${key}`;
          let helper = "";
          let inputType = "text";
          if (key === "email") {
            inputType = "email";
            placeholder = "e.g. john@example.com";
          }
          if (key === "phone") {
            inputType = "tel";
            placeholder = "e.g. +91 1234567890";
          }
          if (key === "link") {
            inputType = "url";
            placeholder = "e.g. LinkedIn, GitHub, Portfolio";
            helper = "Add your LinkedIn, GitHub or portfolio URL here.";
          }
          if (key === "skills") {
            placeholder = "e.g. HTML, CSS, JavaScript";
            helper = "Separate skills with commas.";
          }
          if (["education", "experience", "projects", "interests", "languages", "certifications", "awards"].includes(key)) {
            placeholder = `Use bullet points or numbers for ${key}`;
            helper = "Add multiple items using bullets or numbers.";
          }
          if (key === "objective") {
            placeholder = "Write your career objective";
          }
          if (key === "summary") {
            placeholder = "Write a short professional summary";
          }
          if (key === "name") {
            placeholder = "Your full name";
          }
          const isTextarea = [
            "education",
            "experience",
            "projects",
            "interests",
            "languages",
            "certifications",
            "awards",
            "objective",
            "summary",
          ].includes(key);
          return (
            <div key={key} className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {isTextarea ? (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleChange}
                  rows={key === "summary" ? 4 : 2}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              ) : (
                <input
                  type={inputType}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              )}
              {helper && (
                <span className="text-xs text-gray-500 block mt-1">{helper}</span>
              )}
            </div>
          );
        })}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-btn mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {resumeMd && (
        <div className="resume-preview-section">
          <h2>📄 Resume Preview</h2>
          <div className="resume-preview" id="resume-preview">
            <div className="top-line"></div>
            <h1 className="resume-name">{form.name || 'Your Name'}</h1>
            <p className="resume-contact">📞 {form.phone} | ✉️ {form.email} | {form.link}</p>
            {[
              { label: 'Objective', key: 'objective' },
              { label: 'Professional Summary', key: 'summary' },
              { label: 'Skills', key: 'skills' },
              { label: 'Experience', key: 'experience' },
              { label: 'Education', key: 'education' },
              { label: 'Projects', key: 'projects' },
              { label: 'Certifications', key: 'certifications' },
              { label: 'Languages', key: 'languages' },
              { label: 'Interests', key: 'interests' },
              { label: 'Awards', key: 'awards' },
            ].map(({ label, key }) =>
              form[key] ? (
                <div key={key}>
                  <h3 className="section-heading">{label}</h3>
                  <p>{form[key]}</p>
                  <div className="blue-line"></div>
                </div>
              ) : null
            )}
          </div>
          <button onClick={handleDownload} className="download-btn mt-4">Download PDF</button>
        </div>
      )}
    </div>
  );
};

const Router = ({ getTemplateComponent, templates }) => (
  <Routes>
    {/* <Route path="/" element={<LandingPage templates={templates} />} /> */}
    <Route path="/builder" element={<ResumeBuilderPage getTemplateComponent={getTemplateComponent} templates={templates} />} />
    <Route path="/builder/:templateId" element={<ResumeBuilderPage getTemplateComponent={getTemplateComponent} templates={templates} />} />

  </Routes>
);

const componentMap = {
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
};

export const templates = templatesMeta.map(t => ({
  ...t,
  component: componentMap[t.componentId]
}));

const templateMap = {};
templates.forEach(t => {
  templateMap[t.id] = t.component;
});

export const getTemplateComponent = (templateId) => {
  return templateMap[templateId] || null;
};

export {
  DownloadButton,
  ResumeForm,
  ResumePreview,
  // TemplateCard,
  ResumeBuilderPage,
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template6Alt,
  Router
};
