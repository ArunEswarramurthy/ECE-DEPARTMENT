import React, { useState, useEffect } from 'react';
import '../../components/styles/NotesManagement.css';

const NotesManagement = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    name: '',
    description: '',
    courseCode: '',
    faculty: '',
    fileUrl: '',
    fileType: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    // Load notes data from localStorage
    const storedNotes = localStorage.getItem('notesData');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }

    // Load faculty data
    const storedFaculty = localStorage.getItem('facultyData');
    if (storedFaculty) {
      const parsedFaculty = JSON.parse(storedFaculty);
      setFacultyList(parsedFaculty.map(faculty => faculty.name));
    }
  }, []);

  // Save to localStorage whenever notes data changes
  useEffect(() => {
    localStorage.setItem('notesData', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({ ...currentNote, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // For this demo, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      const fileExtension = file.name.split('.').pop().toLowerCase();
      let fileType = '';
      
      if (['pdf'].includes(fileExtension)) {
        fileType = 'PDF';
      } else if (['doc', 'docx'].includes(fileExtension)) {
        fileType = 'Word';
      } else if (['ppt', 'pptx'].includes(fileExtension)) {
        fileType = 'PowerPoint';
      } else if (['xls', 'xlsx'].includes(fileExtension)) {
        fileType = 'Excel';
      } else if (['txt'].includes(fileExtension)) {
        fileType = 'Text';
      } else {
        fileType = 'Other';
      }
      
      setCurrentNote({ 
        ...currentNote, 
        fileUrl: fakeUrl, 
        fileName: file.name,
        fileType: fileType
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editing) {
      // Update existing note
      const updatedNotes = [...notes];
      updatedNotes[currentIndex] = currentNote;
      setNotes(updatedNotes);
      setEditing(false);
    } else {
      // Add new note
      setNotes([...notes, currentNote]);
    }
    
    // Reset form
    setCurrentNote({
      name: '',
      description: '',
      courseCode: '',
      faculty: '',
      fileUrl: '',
      fileType: ''
    });
    setCurrentIndex(null);
  };

  const handleEdit = (index) => {
    setCurrentNote(notes[index]);
    setCurrentIndex(index);
    setEditing(true);
  };

  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

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

  return (
    <div className="notes-management">
      <h1>Notes Management</h1>
      
      <div className="card">
        <h2>{editing ? 'Edit Note' : 'Add New Note'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Note Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={currentNote.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="courseCode" className="form-label">Course Code</label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              className="form-control"
              value={currentNote.courseCode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="faculty" className="form-label">Faculty Name</label>
            <select
              id="faculty"
              name="faculty"
              className="form-control"
              value={currentNote.faculty}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Faculty</option>
              {facultyList.map((faculty, index) => (
                <option key={index} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={currentNote.description}
              onChange={handleInputChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="file" className="form-label">Upload File</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="file"
                name="file"
                className="form-control file-input"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
                required={!editing || !currentNote.fileUrl}
              />
              <div className="file-types">
                Supported formats: PDF, Word, PowerPoint, Excel, Text
              </div>
            </div>
            {currentNote.fileName && (
              <div className="selected-file">
                <span className="file-icon">{getFileIcon(currentNote.fileType)}</span>
                <span className="file-name">{currentNote.fileName}</span>
                <span className="file-type">({currentNote.fileType})</span>
              </div>
            )}
          </div>
          
          <button type="submit" className="btn">
            {editing ? 'Update Note' : 'Add Note'}
          </button>
          
          {editing && (
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => {
                setEditing(false);
                setCurrentNote({
                  name: '',
                  description: '',
                  courseCode: '',
                  faculty: '',
                  fileUrl: '',
                  fileType: ''
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      
      <h2>Notes List</h2>
      {notes.length === 0 ? (
        <div className="card">
          <p>No notes added yet.</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map((note, index) => (
            <div className="card" key={index}>
              <div className="note-header">
                <h3>{note.name}</h3>
                <div className="note-actions">
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
              
              <div className="note-details">
                <p><strong>Course Code:</strong> {note.courseCode}</p>
                <p><strong>Faculty:</strong> {note.faculty}</p>
                <p><strong>Description:</strong> {note.description}</p>
                {note.fileUrl && (
                  <div className="note-file">
                    <span className="file-icon">{getFileIcon(note.fileType)}</span>
                    <a 
                      href={note.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn"
                    >
                      Download {note.fileType} File
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

export default NotesManagement;