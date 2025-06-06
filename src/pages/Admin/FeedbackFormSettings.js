import React, { useState, useEffect } from 'react';
import '../../components/styles/FeedbackFormSettings.css';

const FeedbackFormSettings = () => {
  const [formSettings, setFormSettings] = useState({
    title: 'Student Feedback Form',
    introText: 'Your input helps us improve our teaching and course content.',
    requireRegisterNumber: true,
    showTeachingRating: true,
    showContentRating: true,
    showInteractionRating: true,
    showOverallRating: true,
    showComments: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load form settings from localStorage
    const storedSettings = localStorage.getItem('feedbackFormSettings');
    if (storedSettings) {
      try {
        setFormSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Error loading form settings:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormSettings({
      ...formSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save settings to localStorage
    localStorage.setItem('feedbackFormSettings', JSON.stringify(formSettings));
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="feedback-form-settings">
      <h2>Feedback Form Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Form Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formSettings.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="introText" className="form-label">Introduction Text</label>
          <textarea
            id="introText"
            name="introText"
            className="form-control"
            value={formSettings.introText}
            onChange={handleInputChange}
            rows="2"
          ></textarea>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="requireRegisterNumber"
              checked={formSettings.requireRegisterNumber}
              onChange={handleInputChange}
            />
            Require Register Number Verification
          </label>
        </div>
        
        <h3>Form Fields</h3>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showTeachingRating"
              checked={formSettings.showTeachingRating}
              onChange={handleInputChange}
            />
            Show Teaching Quality Rating
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showContentRating"
              checked={formSettings.showContentRating}
              onChange={handleInputChange}
            />
            Show Course Content Rating
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showInteractionRating"
              checked={formSettings.showInteractionRating}
              onChange={handleInputChange}
            />
            Show Interaction & Availability Rating
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showOverallRating"
              checked={formSettings.showOverallRating}
              onChange={handleInputChange}
            />
            Show Overall Rating
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="showComments"
              checked={formSettings.showComments}
              onChange={handleInputChange}
            />
            Show Comments Field
          </label>
        </div>
        
        <button type="submit" className="btn">Save Settings</button>
        
        {saveSuccess && (
          <div className="success-message">
            Form settings saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedbackFormSettings;