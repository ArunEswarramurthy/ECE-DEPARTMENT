import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import defaultLogo from '../../logo/ECE.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [menuActive, setMenuActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [logo, setLogo] = useState(defaultLogo);
  const [siteName, setSiteName] = useState('ECE Department Portal');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Load custom logo and site name if available
    const storedLogo = localStorage.getItem('siteLogo');
    const storedName = localStorage.getItem('siteName');
    
    if (storedLogo) {
      setLogo(storedLogo);
    }
    
    if (storedName) {
      setSiteName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" height="40" />
          {siteName}
        </Link>
        
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
        
        <div className={`navbar-menu ${menuActive ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={() => setMenuActive(false)}>Home</Link>
          <Link to="/faculty" className="navbar-item" onClick={() => setMenuActive(false)}>Faculty</Link>
          <Link to="/feedback" className="navbar-item" onClick={() => setMenuActive(false)}>Feedback</Link>
          <Link to="/notes" className="navbar-item" onClick={() => setMenuActive(false)}>Notes</Link>
          <Link to="/achievements" className="navbar-item" onClick={() => setMenuActive(false)}>Achievements</Link>
          
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="navbar-item" onClick={() => setMenuActive(false)}>Admin Dashboard</Link>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="navbar-button" onClick={() => setMenuActive(false)}>Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;