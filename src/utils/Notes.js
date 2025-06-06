import React, { useState, useEffect } from 'react';
import '../components/styles/Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use localStorage to get notes data
    const storedNotes = localStorage.getItem('notesData');
    
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      // Default data if nothing is stored yet
      setNotes([]);
    }
    
    setLoading(false);
  }, []);

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'PDF':
        return '📄';
      case 'Word':
        return '📝';
      case 'PowerPoint':
        return '📊';
      case 'Excel':
        return '📈';
      case 'Text':
        return '📃';
      default:
        return '📁';
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <h1>Course Notes</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by course name, code or faculty..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <p>No notes found matching your search.</p>
          ) : (
            <p>No notes available at the moment.</p>
          )}
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map((note, index) => (
            <div className="note-card" key={index}>
              <div className="note-header">
                <h3>{note.name}</h3>
              </div>
              <div className="note-details">
                <p><strong>Course Code:</strong> {note.courseCode}</p>
                <p><strong>Faculty:</strong> {note.faculty}</p>
                <div className="note-description">
                  <p>{note.description}</p>
                </div>
                {note.fileUrl && (
                  <div className="note-file">
                    <span className="file-icon">{getFileIcon(note.fileType || 'Other')}</span>
                    <a 
                      href={note.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="download-btn"
                    >
                      Download {note.fileType || 'File'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;