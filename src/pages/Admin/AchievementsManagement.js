import React, { useState, useEffect } from 'react';
import '../../components/styles/AchievementsManagement.css';

const AchievementsManagement = () => {
  const [achievements, setAchievements] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState({
    photo: '',
    date: '',
    description: '',
    title: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    // Load achievements data from localStorage
    const storedAchievements = localStorage.getItem('achievementsData');
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    }
  }, []);

  // Save to localStorage whenever achievements data changes
  useEffect(() => {
    localStorage.setItem('achievementsData', JSON.stringify(achievements));
  }, [achievements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAchievement({ ...currentAchievement, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Maximum size is 10MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentAchievement({ ...currentAchievement, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editing) {
      // Update existing achievement
      const updatedAchievements = [...achievements];
      updatedAchievements[currentIndex] = currentAchievement;
      setAchievements(updatedAchievements);
      setEditing(false);
    } else {
      // Add new achievement
      setAchievements([...achievements, currentAchievement]);
    }
    
    // Reset form
    setCurrentAchievement({
      photo: '',
      date: '',
      description: '',
      title: ''
    });
    setCurrentIndex(null);
  };

  const handleEdit = (index) => {
    setCurrentAchievement(achievements[index]);
    setCurrentIndex(index);
    setEditing(true);
  };

  const handleDelete = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="achievements-management">
      <h1>Achievements Management</h1>
      
      <div className="form-container">
        <div className="card">
          <h2>{editing ? 'Edit Achievement' : 'Add New Achievement'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={currentAchievement.title || ''}
                onChange={handleInputChange}
                placeholder="Achievement Title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={currentAchievement.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={currentAchievement.description}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="photo" className="form-label">Photo</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  className="form-control file-input"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <small className="form-text">Maximum file size: 10MB</small>
              {currentAchievement.photo && (
                <div className="photo-preview">
                  <img src={currentAchievement.photo} alt="Achievement" />
                </div>
              )}
            </div>
            
            <div className="btn-container">
              <button type="submit" className="btn">
                {editing ? 'Update Achievement' : 'Add Achievement'}
              </button>
              
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    setEditing(false);
                    setCurrentAchievement({
                      photo: '',
                      date: '',
                      description: '',
                      title: ''
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <h2>Achievements List</h2>
      {achievements.length === 0 ? (
        <div className="card">
          <p>No achievements added yet.</p>
        </div>
      ) : (
        <div className="achievements-list">
          {achievements
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((achievement, index) => (
              <div className="achievement-item" key={index}>
                <div className="achievement-header">
                  <h3>{achievement.title || `Achievement ${index + 1}`}</h3>
                  <div className="achievement-actions">
                    <button 
                      className="btn btn-sm" 
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="achievement-details">
                  <p><strong>Date:</strong> {formatDate(achievement.date)}</p>
                  {achievement.photo && (
                    <div className="achievement-image">
                      <img src={achievement.photo} alt={`Achievement ${index + 1}`} />
                    </div>
                  )}
                  <div className="achievement-description">
                    <p>{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsManagement;