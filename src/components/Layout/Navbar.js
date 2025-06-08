import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteName, setSiteName] = useState('ECE Department Portal');
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };
    
    // Initial check
    checkAdminStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkAdminStatus);
    
    // Load site name from localStorage if available
    const storedName = localStorage.getItem('siteName');
    if (storedName) {
      setSiteName(storedName);
    }
    
    // Load logo from localStorage if available
    const storedLogo = localStorage.getItem('siteLogo');
    if (storedLogo) {
      setLogo(storedLogo);
    }
    
    // Clean up event listener
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    // Close menu after logout
    setIsOpen(false);
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {logo ? (
            <img src={logo} alt={siteName} className="site-logo" />
          ) : (
            <span className="logo-text">ECE</span>
          )}
          <span className="site-name">{siteName}</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/faculty" className="nav-link" onClick={() => setIsOpen(false)}>
              Faculty
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link" onClick={() => setIsOpen(false)}>
              Feedback
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/notes" className="nav-link" onClick={() => setIsOpen(false)}>
              Notes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/achievements" className="nav-link" onClick={() => setIsOpen(false)}>
              Achievements
            </Link>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link admin-link" onClick={() => setIsOpen(false)}>
                Admin Dashboard
              </Link>
            </li>
          )}
          {isAdmin ? (
            <li className="nav-item">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link login-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;