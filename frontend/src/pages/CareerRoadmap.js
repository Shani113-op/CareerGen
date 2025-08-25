// src/pages/CareerRoadmap.js
import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import careerData from "../data/careerData";
import { jsPDF } from "jspdf";
import "../styles/CareerDetail.css";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

export default function CareerRoadmap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safely pick career: static OR fallback from state
  const career =
    careerData.find((c) => c.id.toString() === id) || location.state?.career;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!career) return <div>Career not found</div>;

  // ✅ Capture UI as PDF
  const handleDownload = () => {
    const input = document.getElementById("career-roadmap");

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // If content is taller than one page, split into multiple pages
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`${career.title}_Roadmap.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10">
    <motion.div
  id="career-roadmap" // 🔹 This is only the content for PDF
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
>
  <h1 className="text-3xl font-bold mb-2 text-blue-700">{career.title}</h1>
  <p className="mb-6 text-gray-700">{career.description}</p>

  {/* Skills */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="mb-6"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      💡 Skills Required
    </h3>
    <ul className="list-disc pl-5 space-y-1 text-gray-700">
      {career.skills.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  </motion.div>

  {/* Education Roadmap */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="mb-6"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      🎓 Education Roadmap
    </h3>
    <ol className="list-decimal pl-5 space-y-1 text-gray-700">
      {career.roadmap.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  </motion.div>

  {/* Specializations */}
  {career.subcategories?.length > 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mb-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🔍 Specializations
      </h3>
      <div className="space-y-4">
        {career.subcategories.map((sub, i) => (
          <div
            key={i}
            className="border border-gray-200 p-4 rounded-md shadow-sm"
          >
            <h4 className="text-lg font-bold text-blue-600">{sub.name}</h4>
            <p className="text-gray-700 mb-2">{sub.description}</p>
            <ul className="list-disc pl-5 text-gray-700">
              {sub.roadmap.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )}

  {/* Salary */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1 }}
    className="mb-8"
  >
    <h4 className="text-xl font-semibold text-green-700">
      💰 Expected Salary:{" "}
      <span className="font-normal">{career.salary}</span>
    </h4>
  </motion.div>
</motion.div>

{/* 🔹 Buttons kept OUTSIDE so they won't appear in PDF */}
<div className="max-w-4xl mx-auto mt-6 flex gap-4 justify-center">
  <button
    onClick={handleDownload}
    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
  >
    📄 Download PDF
  </button>
  <button
    onClick={() => navigate(-1)}
    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow transition"
  >
    ⬅️ Back
  </button>
</div>

    </div>
  );
}
