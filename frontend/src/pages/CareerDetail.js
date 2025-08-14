import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import careerData from "../data/careerData";
import PremiumPopup from "../components/PremiumPlans";
import { useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader"; // ✅ Import reusable loader

const categories = [
  "All", "Technology", "Creative", "Healthcare", "Education",
  "Finance", "Science", "Engineering", "Media",
  "Design", "Business", "Legal", "Culinary"
];

const CareerCard = ({ career, onGetRoadmap }) => (
  <div className="career-card premium">
    <img src={career.image} alt={career.title} className="career-image" />
    <div className="card-header">
      <h3>{career.title}</h3>
      <span className="badge">{career.category}</span>
    </div>
    <p className="desc">{career.description}</p>
    <div className="see-more-wrapper">
      <button className="see-more-btn" onClick={() => onGetRoadmap(career)}>
        Get Roadmap...
      </button>
    </div>
  </div>
);

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [careers, setCareers] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false); // ✅ for search/category
  const [pageLoading, setPageLoading] = useState(true); // ✅ new page loader
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const handleGetRoadmap = (career) => {
    if (!user?.isPremium) {
      setShowPremiumPopup(true);
      return;
    }
    navigate(`/roadmap/${career.id || career.title}`, { state: { career } });
  };

  // ✅ Load user once & fake page loader
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.email) {
      axios.get(`${API}/api/user/${stored.email}`)
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }

    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [API]);

  // ✅ Load careers based on search or category
  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);

      if (search.trim()) {
        // Check static first
        const local = careerData.filter(c =>
          c.title.toLowerCase().includes(search.toLowerCase())
        );
        if (local.length) {
          setCareers(local);
        } else {
          try {
            const res = await axios.get(`${API}/api/careers?search=${encodeURIComponent(search)}`);
            if (res.data?.careers?.length) {
              setCareers(res.data.careers);
            } else {
              setCareers([]);
            }
          } catch (err) {
            console.error("Search fetch error:", err);
            setCareers([]);
          }
        }
      } else {
        if (category === "All") {
          setCareers(careerData);
        } else {
          const local = careerData.filter(c => c.category === category);
          if (local.length) {
            setCareers(local);
          } else {
            try {
              const res = await axios.get(`${API}/api/careers?category=${encodeURIComponent(category)}`);
              if (res.data?.careers?.length) {
                setCareers(res.data.careers);
              } else {
                setCareers([]);
              }
            } catch (err) {
              console.error("Category fetch error:", err);
              setCareers([]);
            }
          }
        }
      }

      setLoading(false);
    };

    fetchCareers();
  }, [search, category, API]);

  if (pageLoading) {
    return <PageLoader />; // ✅ Show reusable wave balls loader
  }

  return (
    <div className="career-page">
      <section className="header">
        <h1>Explore Career Paths</h1>
        <p>Discover careers that fit your passion and skills</p>
      </section>

      <div className="controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                setSearch(""); // Clear search when switching category
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center my-6 text-lg font-semibold text-blue-600">
          Searching...
        </div>
      )}

      {!loading && careers.length === 0 && (
        <div className="text-center my-6 text-lg font-semibold text-red-600">
          No results found.
        </div>
      )}

      <div className="career-grid">
        {careers.map((career, i) => (
          <CareerCard key={i} career={career} onGetRoadmap={handleGetRoadmap} />
        ))}
      </div>

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updated = JSON.parse(localStorage.getItem("user"));
            setUser(updated);
            setShowPremiumPopup(false);
          }}
        />
      )}
    </div>
  );
}
