import React, { useState, useEffect } from 'react';
import '../../components/styles/SiteSettings.css';

const SiteSettings = () => {
  const [logo, setLogo] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  const [siteName, setSiteName] = useState('ECE Department Portal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load site settings from localStorage
    const storedLogo = localStorage.getItem('siteLogo');
    const storedName = localStorage.getItem('siteName');
    
    if (storedLogo) {
      setCurrentLogo(storedLogo);
    }
    
    if (storedName) {
      setSiteName(storedName);
    }
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSiteNameChange = (e) => {
    setSiteName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save logo if a new one was uploaded
    if (logo) {
      localStorage.setItem('siteLogo', logo);
      setCurrentLogo(logo);
      
      // Update favicon
      const favicon = document.getElementById('favicon');
      if (favicon) {
        favicon.href = logo;
      }
    }
    
    // Save site name
    localStorage.setItem('siteName', siteName);
    
    // Update document title
    document.title = siteName;
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="site-settings">
      <h1>Site Settings</h1>
      
      <div className="card">
        <h2>Logo & Site Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="siteName" className="form-label">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              className="form-control"
              value={siteName}
              onChange={handleSiteNameChange}
              required
            />
            <small className="form-text">This name will appear in the browser tab and navigation bar.</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="logo" className="form-label">Site Logo</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="logo"
                name="logo"
                className="form-control file-input"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            <small className="form-text">This logo will appear in the navigation bar and browser tab.</small>
            
            <div className="logo-preview">
              <h3>Current Logo</h3>
              {currentLogo ? (
                <img 
                  src={currentLogo} 
                  alt="Current Logo" 
                  className="logo-image"
                />
              ) : (
                <div className="logo-placeholder">
                  <span>No custom logo set</span>
                </div>
              )}
              
              {logo && (
                <>
                  <h3>New Logo Preview</h3>
                  <img 
                    src={logo} 
                    alt="New Logo" 
                    className="logo-image"
                  />
                </>
              )}
            </div>
          </div>
          
          <button type="submit" className="btn">
            Save Changes
          </button>
          
          {saveSuccess && (
            <div className="success-message">
              Settings saved successfully! Refresh the page to see all changes.
            </div>
          )}
        </form>
      </div>
      
      <div className="card">
        <h2>Instructions</h2>
        <div className="instructions">
          <p>
            <strong>Logo Requirements:</strong>
          </p>
          <ul>
            <li>Recommended size: 200x200 pixels</li>
            <li>Supported formats: PNG, JPG, SVG</li>
            <li>Maximum file size: 5MB</li>
          </ul>
          <p>
            <strong>Note:</strong> Changes will take effect immediately after saving.
            You may need to refresh the page to see the updated logo in the navigation bar and browser tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;