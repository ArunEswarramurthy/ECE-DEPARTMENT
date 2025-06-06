import React, { useState, useEffect } from 'react';
import '../components/styles/Faculty.css';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

  // Format subjects for display - no longer needed as we'll display them individually
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
      <h1>Faculty Details</h1>
      
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
              <div className="faculty-banner"></div>
              <div className="faculty-image">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name || "Faculty"} 
                    style={{ objectPosition: member.photoPosition || 'center top' }}
                  />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              <div className="faculty-info">
                <div className="faculty-designation">{member.designation || "Faculty"}</div>
                <div className="faculty-name-display">{member.name || "Faculty Member"}</div>
                
                <div className="faculty-details">
                  <div className="faculty-row">
                    <div className="faculty-col">
                      <strong>Qualification:</strong>
                      <span>{member.qualification || "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="faculty-row">
                    <div className="faculty-col">
                      <strong>Experience:</strong>
                      <span>{member.experience ? `${member.experience} years` : "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="faculty-row subjects-row">
                    <strong>Subjects:</strong>
                    <div className="subjects-list-display">
                      {getSubjectsArray(member.subjects).length > 0 ? (
                        <ul>
                          {getSubjectsArray(member.subjects).map((subject, idx) => (
                            <li key={idx}>
                              <span className="course-code">{subject.courseCode}</span>
                              <span className="subject-name">{subject.subjectName}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="faculty-contact">
                  <a href={`mailto:${member.email || ""}`} title="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                  </a>
                  <a href={`tel:${member.phone || ""}`} title="Call">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
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