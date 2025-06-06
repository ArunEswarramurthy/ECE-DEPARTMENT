import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/styles/Home.css';
import defaultLogo from '../logo/ECE.svg';

const Home = () => {
  const [logo, setLogo] = useState(defaultLogo);
  const [siteName, setSiteName] = useState('ECE Department Portal');

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

  return (
    <div className="home-container">
      <div className="welcome-section">
        <div className="logo-container">
          <img src={logo} alt="Department Logo" className="department-logo" />
        </div>
        <h1>Welcome to {siteName}</h1>
        <p>Your gateway to academic excellence and innovation</p>
      </div>
      
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-content">
              <h3>Faculty Profiles</h3>
              <p>Discover our expert educators and their specialized domains</p>
              <Link to="/faculty" className="feature-btn">Explore</Link>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-content">
              <h3>Student Feedback</h3>
              <p>Share your insights to help us enhance learning experiences</p>
              <Link to="/feedback" className="feature-btn">Contribute</Link>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-content">
              <h3>Course Materials</h3>
              <p>Access quality resources for your academic development</p>
              <Link to="/notes" className="feature-btn">Download</Link>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-content">
              <h3>Department Milestones</h3>
              <p>Celebrate our collective accomplishments and innovations</p>
              <Link to="/achievements" className="feature-btn">Discover</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;