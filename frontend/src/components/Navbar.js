import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


const handleLogout = () => {
  setShowLogoutConfirm(true);
};

const confirmLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('👋 You have been logged out.');
  navigate('/login');
  setDropdownOpen(false);
  setMobileMenuOpen(false);
  setShowLogoutConfirm(false);
};


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
          <NavLink to="/" className="logo-link">
    <img
      src="logo.png" // ✅ Use your correct path
      alt="CareerGenAI Logo"
      className="logo-image"
    />
    <span className="logo-text">CareerGenAI</span>
  </NavLink>
      </div>

      {/* Desktop Links */}
      <ul className="navbar-links desktop">
        <li><NavLink to="/" end>Home</NavLink></li>
        {user && <li><NavLink to="/services">Services</NavLink></li>}
      </ul>

      {/* Desktop Profile */}
      <div className="navbar-auth desktop" ref={profileRef}>
        {/* {!user && (
          <NavLink
            to="/register-consultant"
            className="auth-button register"
            style={{ marginRight: '1rem' }}
          >
            Register as Consultant
          </NavLink>
        )} */}

        <div className="flex flex-row items-center gap-2 text-white text-lg font-medium">
          <a href="tel:+918657869659" className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V8a1 1 0 01-.293.707L8 10l6 6 1.293-1.293A1 1 0 0116 14h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
            </svg>
            +91 9619901999
          </a>
          <a href="tel:+919619901999" className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V8a1 1 0 01-.293.707L8 10l6 6 1.293-1.293A1 1 0 0116 14h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
            </svg>
            +91 8657869659
          </a>
        </div>

        {!user ? (
          <>
            <NavLink to="/login" className="auth-button">Login</NavLink>
            <NavLink to="/register" className="auth-button register">Register</NavLink>
          </>
        ) : (
          <>
            <FaUserCircle
              className="profile-icon"
              size={28}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')}>👤 See Profile</button>
                <button onClick={() => navigate('/history')}>📜 History</button>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul>
            <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
            {user && <li><NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>Services</NavLink></li>}

            {/* {!user && (
              <li>
                <NavLink
                  to="/register-consultant"
                  className="auth-button register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register as Consultant
                </NavLink>
              </li>
            )} */}

            {user ? (
              <div className="mobile-profile" ref={profileRef}>
                <li onClick={() => setMobileProfileOpen(!mobileProfileOpen)}>Profile</li>
                {mobileProfileOpen && (
                  <div className="mobile-submenu">
                    <li onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                      setMobileProfileOpen(false);
                    }}>👤 See Profile</li>
                    <li onClick={() => {
                      navigate('/history');
                      setMobileMenuOpen(false);
                      setMobileProfileOpen(false);
                    }}>📜 History</li>
                    <li onClick={() => {
                      handleLogout();
                      setMobileProfileOpen(false);
                    }}>🚪 Logout</li>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 text-white text-lg font-medium">
                  <a href="tel:+918657869659" className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V8a1 1 0 01-.293.707L8 10l6 6 1.293-1.293A1 1 0 0116 14h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                    </svg>
                    +91 8657869659
                  </a>
                  <a href="tel:+919619901999" className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V8a1 1 0 01-.293.707L8 10l6 6 1.293-1.293A1 1 0 0116 14h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                    </svg>
                    +91 9619901999
                  </a>
                </div>
              </div>
            ) : (
              <div className="mobile-profile">
                <NavLink to="/login" className="auth-button" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className="auth-button register" onClick={() => setMobileMenuOpen(false)}>Register</NavLink>
              </div>
            )}
          </ul>
        </div>
      )}
      {showLogoutConfirm && (
  <div className="logout-confirm-overlay">
    <div className="logout-confirm-box">
      <p>Are you sure you want to logout?</p>
      <div className="logout-buttons">
        <button className='yes-btn bg-red-500 hover:bg-red-600' onClick={confirmLogout}>Yes</button>
        <button onClick={() => setShowLogoutConfirm(false)}>No</button>
      </div>
    </div>
  </div>
)}
    </nav>
    
  );
  
};
export default Navbar;
