// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import Chatbot from './components/Chatbot';
// import MobileCSS from './components/MobileCSS';
import Home from './pages/Home';
import Chat from './pages/Chat';
import InterestForm from './pages/InterestForm';
import CareerDetail from './pages/CareerDetail';
import Consult from './pages/Consult';
import Login from './pages/Login';
import Register from './pages/Register';
import CareerQuiz from './pages/CareerQuiz';
import VerifyOtp from './pages/VerifyOtp';
import PremiumPlans from './components/PremiumPlans';
import CollegesByLocation from './pages/CollegesByLocation';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import Services from './pages/ServicesPage';
import CareerCompare from './pages/CareerCompare';
import ResumeBuilder from './pages/templates/ResumeBuilder';
import QrPopup from './components/QrPopup';
import AdminDashboard from './pages/AdminDashboard';
import UploadReceipt from './components/UploadReceipt';
import History from './pages/History';
import RegisterConsultant from './pages/RegisterConsultant';
import CareerRoadmap from "./pages/CareerRoadmap";
import ResumeTemplateSelector from "./pages/ResumeTemplateSelector";
import ResumeBuilder2 from "./pages/templates/ResumeBuilder2";
import ResumeBuilder3 from "./pages/templates/ResumeBuilder3";
import ProfileBuilder from "./pages/ProfileBuilder";
import LinkedInBuilder from "./pages/templates/LinkedInBuilder";
import NaukriBuilder from "./pages/templates/NaukriBuilder";
import ResumeBuilderGuide from './pages/templates/ResumeBuilderGuide';
import GitHubBuilder from './pages/templates/GitHubBuilder';
import PortfolioBuilder from './pages/templates/PortfolioBuilder';
import CoverLetterBuilder from './pages/templates/CoverLetterBuilder';
import { ResumeProvider } from './context/ResumeContext';
import BookSlot from './pages/BookSlot';
import ForgotPassword from "./pages/ForgotPassword"; // adjust path


// Import from cleaned AllComponents.jsx
import { ResumeBuilderPage, Template1, Template2, Template3, Template4, Template5, Template6 } from './AllComponents';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/interest-form" element={<PrivateRoute><InterestForm /></PrivateRoute>} />
          <Route path="/careerQuiz" element={<PrivateRoute><CareerQuiz /></PrivateRoute>} />
          <Route path="/careerDetail" element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
          <Route path="/consult" element={<PrivateRoute><Consult /></PrivateRoute>} />
          <Route path="/college" element={<PrivateRoute><CollegesByLocation /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/pricing" element={<PremiumPlans />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
          <Route path="/compare" element={<PrivateRoute><CareerCompare /></PrivateRoute>} />
          <Route path="/resume-builder/1" element={<ResumeBuilder />} />
          <Route path="/qr-popup" element={<QrPopup />} />
          <Route path="/upload-receipt" element={<UploadReceipt />} />
          <Route path="/history" element={<History />} />
          <Route path="/register-consultant" element={<RegisterConsultant />} />
          <Route path="/roadmap/:id" element={<CareerRoadmap />} />
          <Route path="/resume-templates" element={<ResumeTemplateSelector />} />
          <Route path="/resume-builder/2" element={<ResumeBuilder2 />} />
          <Route path="/resume-builder/3" element={<ResumeBuilder3 />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/templates/linkedin-builder" element={<LinkedInBuilder />} />
          <Route path="/templates/naukri-builder" element={<NaukriBuilder />} />
          <Route path="/templates/resume-builder-guide" element={<ResumeBuilderGuide />} />
          <Route path="/templates/github-builder" element={<GitHubBuilder />} />
          <Route path="/templates/portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="/templates/coverletter-builder" element={<CoverLetterBuilder />} />
          <Route path="/book-slot/:consultantId" element={<BookSlot />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Premium Resume Builder Route */}
          <Route
            path="/AllComponents"
            element={
              <ResumeProvider>
                <ResumeBuilderPage
                  getTemplateComponent={(id) => {
                    const templates = {
                      template1: Template1,
                      template2: Template2,
                      template3: Template3,
                      template4: Template4,
                      template5: Template5,
                      template6: Template6,
                    };
                    return templates[id] || null;
                  }}
                  templates={[
                    { id: 'template1', name: 'Template 1', preview: 'template 1.png', category: 'Professional' },
                    { id: 'template2', name: 'Template 2', preview: 'template 2.png', category: 'Creative' },
                    { id: 'template3', name: 'Template 3', preview: 'template 3.png', category: 'Modern' },
                    { id: 'template4', name: 'Template 4', preview: 'template 4.png', category: 'Elegant' },
                    { id: 'template5', name: 'Template 5', preview: 'template 5.png', category: 'Elegant' },
                    { id: 'template6', name: 'Template 6', preview: 'template 6.png', category: 'Elegant' }

                  ]}
                />
              </ResumeProvider>
            }
          />


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {isHomePage && <Footer />}
    
    </>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Layout />} />
    </Routes>
  </Router>
);

export default App;
