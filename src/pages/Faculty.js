import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Faculty.css';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    // In a real application, this would be an API call
    // For now, we'll use localStorage to get faculty data
    try {
      const storedFaculty = localStorage.getItem('facultyData');
      if (storedFaculty) {
        const parsedFaculty = JSON.parse(storedFaculty);
        console.log("Loaded faculty data:", parsedFaculty);
        setFaculty(parsedFaculty);
      } else {
        console.log("No faculty data found");
        setFaculty([]);
      }
    } catch (error) {
      console.error("Error loading faculty data:", error);
      setFaculty([]);
    }
    
    setLoading(false);
  }, []);

  // Format subjects for display
  const getSubjectsArray = (subjects) => {
    if (!subjects) return [];
    
    if (Array.isArray(subjects)) {
      return subjects;
    }
    
    // Handle legacy format (string)
    return subjects ? [{ courseCode: '', subjectName: subjects }] : [];
  };

  // Filter faculty based on search term
  const filteredFaculty = faculty.filter(member => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const subjectsArray = getSubjectsArray(member.subjects);
    const subjectsMatch = subjectsArray.some(subject => 
      (subject.courseCode && subject.courseCode.toLowerCase().includes(searchLower)) ||
      (subject.subjectName && subject.subjectName.toLowerCase().includes(searchLower))
    );
    
    return (
      (member.name && member.name.toLowerCase().includes(searchLower)) ||
      (member.designation && member.designation.toLowerCase().includes(searchLower)) ||
      subjectsMatch
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="faculty-container">
      <h1>Faculty Directory</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, designation or subjects..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredFaculty.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <p>No faculty members match your search.</p>
          ) : (
            <p>No faculty information available at the moment.</p>
          )}
        </div>
      ) : (
        <div className="faculty-grid">
          {filteredFaculty.map((member, index) => (
            <div className="faculty-card" key={index}>
              <div className="faculty-banner">
                <div className="faculty-image">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name || "Faculty"} 
                      style={{ objectPosition: member.photoPosition || 'center' }}
                    />
                  ) : (
                    <div className="placeholder-image">Profile Picture</div>
                  )}
                </div>
              </div>
              <div className="faculty-info">
                <div className="faculty-designation">{member.designation || "Faculty"}</div>
                <div className="faculty-name-display">{member.name || "Faculty Member"}</div>
                
                <div className="faculty-details">
                  <div className="faculty-detail-item">
                    <div className="faculty-detail-icon">📚</div>
                    <div className="faculty-detail-content">
                      <div className="faculty-detail-label">Qualification</div>
                      <div className="faculty-detail-value">{member.qualification || "N/A"}</div>
                    </div>
                  </div>
                  
                  <div className="faculty-detail-item">
                    <div className="faculty-detail-icon">⏱</div>
                    <div className="faculty-detail-content">
                      <div className="faculty-detail-label">Experience</div>
                      <div className="faculty-detail-value">{member.experience ? `${member.experience} years` : "N/A"}</div>
                    </div>
                  </div>
                  
                  <div className="faculty-detail-item">
                    <div className="faculty-detail-icon">📝</div>
                    <div className="faculty-detail-content">
                      <div className="faculty-detail-label">Courses</div>
                      <div className="faculty-detail-value">
                        {getSubjectsArray(member.subjects).length > 0 ? (
                          <div className="courses-list">
                            {getSubjectsArray(member.subjects).map((subject, idx) => (
                              <div key={idx} className="course-item">
                                {subject.courseCode && (
                                  <span className="course-code">{subject.courseCode}</span>
                                )}
                                <span className="course-name">{subject.subjectName}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="contact-container">
                  <a href={`mailto:${member.email || ""}`} className="contact-icon" title={member.email || "Email"}>
                    <span className="icon">✉️</span>
                    <span>{member.email || "Email"}</span>
                  </a>
                  <a href={`tel:${member.phone || ""}`} className="contact-icon" title={member.phone || "Phone"}>
                    <span className="icon">📞</span>
                    <span>{member.phone || "Phone"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;