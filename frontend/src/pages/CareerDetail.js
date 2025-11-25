import React, { useState } from "react";
import {
  Briefcase,
  Laptop,
  Book,
  DollarSign,
  TrendingUp,
  Star,
  Search,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { roadmaps } from "../data/roadMap"; // ✅ Import all roadmap data

export default function CareerPaths() {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Extract dynamic careers directly from roadmaps
  const careers = Object.keys(roadmaps).map((key, index) => ({
    id: index + 1,
    title: roadmaps[key].title,
    field: roadmaps[key].field || "General",
    salary: roadmaps[key].salaryRange || "N/A",
    growth: roadmaps[key].growth || "Moderate",
    category: roadmaps[key].category || "General",
    emoji: roadmaps[key].emoji,
  }));

  // ✅ Category list
  const categories = [
    "All",
    "Technology",
    "AI & Machine Learning",
    "Creative",
    "Healthcare",
    "Education",
    "Finance",
    "Science",
    "Engineering",
    "Media",
    "Design",
    "Business",
    "Legal",
    "Culinary",
  ];

  // ✅ Filtering logic
  const filteredCareers = careers.filter((career) => {
    const matchCategory =
      selectedCategory === "All" || career.category === selectedCategory;
    const matchSearch = career.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // ✅ Handle view roadmap click
  const handleView = (title) => {
    const roadmapData = roadmaps[title];
    if (roadmapData) {
      setSelectedCareer(roadmapData);
      setTimeout(() => {
        document
          .getElementById("roadmap-content")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      alert("No roadmap data found for this career!");
    }
  };

  // ✅ Download as PDF
  const downloadPDF = async () => {
    const element = document.getElementById("roadmap-content");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${selectedCareer.title}_Roadmap.pdf`);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      {/* ---------- Header ---------- */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Career Paths
        </h1>
        <p className="text-gray-600 mt-2">
          Discover careers that fit your passion and skills
        </p>
      </div>

      {/* ---------- Search & Filter ---------- */}
      {!selectedCareer && (
        <>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center mb-10">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search career..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/3 border border-gray-300 rounded-lg py-2 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center mb-8">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✅ Selected Category: {selectedCategory}
            </span>
          </div>

          {/* ---------- Career Cards ---------- */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {filteredCareers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
              >
                <Briefcase className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {career.title} {career.emoji}
                </h3>
                <p className="text-gray-600 mb-4">
                  Professional role in the {career.field} field.
                </p>
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                  <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                    {career.salary}
                  </span>
                  <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full">
                    {career.growth}
                  </span>
                  <span className="bg-yellow-50 text-yellow-700 text-sm px-3 py-1 rounded-full">
                    {career.category}
                  </span>
                </div>
                <button
                  onClick={() => handleView(career.title)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Roadmap
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- Roadmap Section ---------- */}
      {selectedCareer && (
        <div
          id="roadmap-content"
          className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <Laptop className="w-8 h-8" /> {selectedCareer.title}{" "}
            {selectedCareer.emoji}
          </h1>
          <p className="text-gray-700 mb-8">{selectedCareer.overview}</p>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Book className="w-6 h-6" /> Education Path
            </h2>
            <ol className="list-decimal pl-6 space-y-1 text-gray-700">
              {selectedCareer.education.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </section>

          {/* Skills */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Skills Required
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-blue-600 font-bold mb-2">
                  🧠 Technical Skills
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedCareer.skills.technical.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-green-600 font-bold mb-2">💬 Soft Skills</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedCareer.skills.soft.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-purple-600 font-bold mb-2">🛠️ Tools</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedCareer.skills.tools.map((tool, i) => (
                    <li key={i}>{tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Salary */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" /> Salary Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-blue-50 text-gray-700">
                  <tr>
                    <th className="border px-4 py-2">Role</th>
                    <th className="border px-4 py-2">Experience</th>
                    <th className="border px-4 py-2">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCareer.salary.map((row, i) => (
                    <tr key={i} className="text-center text-gray-700">
                      <td className="border px-4 py-2">{row.role}</td>
                      <td className="border px-4 py-2">{row.experience}</td>
                      <td className="border px-4 py-2">{row.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Future Trends */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Future Trends
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {selectedCareer.futureTrends.map((trend, i) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </section>

          {/* Personality */}
          <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">
                Personality Type: {selectedCareer.personalityType}
              </h3>
            </div>
            <Star className="text-yellow-500 w-8 h-8" />
          </div>
        </div>
      )}

      {/* Buttons */}
      {selectedCareer && (
        <div className="max-w-5xl mx-auto flex justify-center gap-4 mt-8">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            📄 Download Roadmap as PDF
          </button>
          <button
            onClick={() => setSelectedCareer(null)}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
          >
            ⬅️ Back to Careers
          </button>
        </div>
      )}
    </div>
  );
}
