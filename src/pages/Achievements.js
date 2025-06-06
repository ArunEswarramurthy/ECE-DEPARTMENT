import React, { useState, useEffect } from 'react';
import '../components/styles/Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use localStorage to get achievements data
    const storedAchievements = localStorage.getItem('achievementsData');
    
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      // Default data if nothing is stored yet
      setAchievements([]);
    }
    
    setLoading(false);
  }, []);

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(achievement => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (achievement.title && achievement.title.toLowerCase().includes(searchLower)) ||
      (achievement.description && achievement.description.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-page">
      <div className="achievements-container">
        <h1>Department Achievements</h1>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search achievements..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredAchievements.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? (
              <p>No achievements match your search.</p>
            ) : (
              <p>No achievements available at the moment.</p>
            )}
          </div>
        ) : (
          <div className="achievements-timeline">
            {filteredAchievements
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((achievement, index) => (
                <div className="achievement-card" key={index}>
                  <div className="achievement-image-container">
                    <div className="achievement-image">
                      {achievement.photo ? (
                        <img src={achievement.photo} alt={`Achievement ${index + 1}`} />
                      ) : (
                        <img src="https://via.placeholder.com/800x600/3AAFA9/ffffff?text=ECE+Achievement" alt="Default" />
                      )}
                    </div>
                  </div>
                  <div className="achievement-content">
                    <div className="achievement-date">{formatDate(achievement.date)}</div>
                    <h3 className="achievement-title">{achievement.title || `Achievement ${index + 1}`}</h3>
                    <div className="achievement-description">
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;