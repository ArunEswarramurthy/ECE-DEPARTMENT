import React, { useState, useEffect } from 'react';
import '../../components/styles/FacultyManagement.css';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [currentFaculty, setCurrentFaculty] = useState({
    name: '',
    photo: '',
    email: '',
    phone: '',
    experience: '',
    subjects: [],
    designation: '',
    qualification: '',
    photoPosition: 'center top' // Default photo position
  });
  const [currentSubject, setCurrentSubject] = useState({
    courseCode: '',
    subjectName: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const designationOptions = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Head of the Department (HOD)",
    "Dean",
    "Principal",
    "Vice Principal",
    "Lecturer",
    "Visiting Faculty",
    "Research Associate"
  ];

  // Load faculty data from localStorage
  const loadFacultyData = () => {
    try {
      const storedFaculty = localStorage.getItem('facultyData');
      if (storedFaculty) {
        setFaculty(JSON.parse(storedFaculty));
      }
    } catch (error) {
      console.error("Error loading faculty data:", error);
    }
  };

  useEffect(() => {
    // Load faculty data when component mounts
    loadFacultyData();
  }, []);

  // Save to localStorage whenever faculty data changes
  const saveFacultyData = (data) => {
    try {
      localStorage.setItem('facultyData', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving faculty data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaculty({ ...currentFaculty, [name]: value });
  };

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject({ ...currentSubject, [name]: value });
  };

  const handleAddSubject = () => {
    if (currentSubject.courseCode.trim() === '' || currentSubject.subjectName.trim() === '') {
      alert("Please enter both Course Code and Subject Name");
      return;
    }
    
    const newSubject = {
      courseCode: currentSubject.courseCode,
      subjectName: currentSubject.subjectName
    };
    
    setCurrentFaculty({
      ...currentFaculty,
      subjects: [...currentFaculty.subjects, newSubject]
    });
    
    // Reset subject inputs
    setCurrentSubject({
      courseCode: '',
      subjectName: ''
    });
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...currentFaculty.subjects];
    updatedSubjects.splice(index, 1);
    setCurrentFaculty({
      ...currentFaculty,
      subjects: updatedSubjects
    });
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
        setCurrentFaculty({ ...currentFaculty, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!currentFaculty.name.trim()) return false;
    if (!currentFaculty.designation.trim()) return false;
    if (!currentFaculty.qualification.trim()) return false;
    if (!currentFaculty.experience.trim()) return false;
    if (currentFaculty.subjects.length === 0) return false;
    if (!currentFaculty.email.trim()) return false;
    if (!currentFaculty.phone.trim()) return false;
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields and add at least one subject.");
      return;
    }
    
    let updatedFaculty;
    
    if (editing) {
      // Update existing faculty
      updatedFaculty = [...faculty];
      updatedFaculty[currentIndex] = currentFaculty;
    } else {
      // Add new faculty
      updatedFaculty = [...faculty, currentFaculty];
    }
    
    // Update state and save to localStorage
    setFaculty(updatedFaculty);
    saveFacultyData(updatedFaculty);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
    
    // Reset form
    setEditing(false);
    setCurrentFaculty({
      name: '',
      photo: '',
      email: '',
      phone: '',
      experience: '',
      subjects: [],
      designation: '',
      qualification: '',
      photoPosition: 'center top'
    });
    setCurrentIndex(null);
  };

  const handleEdit = (index) => {
    // Ensure subjects is an array
    const facultyToEdit = faculty[index];
    const subjectsArray = Array.isArray(facultyToEdit.subjects) 
      ? facultyToEdit.subjects 
      : facultyToEdit.subjects ? [{ courseCode: '', subjectName: facultyToEdit.subjects }] : [];
    
    setCurrentFaculty({
      ...facultyToEdit,
      subjects: subjectsArray
    });
    setCurrentIndex(index);
    setEditing(true);
  };

  const handleDelete = (index) => {
    const updatedFaculty = faculty.filter((_, i) => i !== index);
    setFaculty(updatedFaculty);
    saveFacultyData(updatedFaculty);
  };

  // This function was unused and has been removed

  return (
    <div className="faculty-management">
      <h1>Faculty Management</h1>
      
      <div className="card form-card">
        <h2>{editing ? 'Edit Faculty' : 'Add New Faculty'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={currentFaculty.name}
              onChange={handleInputChange}
              required
            />
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
            {currentFaculty.photo && (
              <div className="selected-file">
                <div className="preview-image-container">
                  <img 
                    src={currentFaculty.photo} 
                    alt="Faculty" 
                    className="preview-image"
                    style={{ objectPosition: currentFaculty.photoPosition }}
                  />
                </div>
                <span>Photo selected</span>
              </div>
            )}
          </div>
          
          {currentFaculty.photo && (
            <div className="form-group">
              <label htmlFor="photoPosition" className="form-label">Photo Position</label>
              <select
                id="photoPosition"
                name="photoPosition"
                className="form-control"
                value={currentFaculty.photoPosition}
                onChange={handleInputChange}
              >
                <option value="center top">Face at Top</option>
                <option value="center center">Face Centered</option>
                <option value="center bottom">Face at Bottom</option>
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="designation" className="form-label">Designation</label>
            <select
              id="designation"
              name="designation"
              className="form-control"
              value={currentFaculty.designation}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Designation</option>
              {designationOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="qualification" className="form-label">Qualification</label>
            <textarea
              id="qualification"
              name="qualification"
              className="form-control"
              value={currentFaculty.qualification}
              onChange={handleInputChange}
              rows="2"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="experience" className="form-label">Experience (years)</label>
            <input
              type="text"
              id="experience"
              name="experience"
              className="form-control"
              value={currentFaculty.experience}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Subjects Handling</label>
            <div className="subjects-input-container">
              <div className="subject-inputs">
                <input
                  type="text"
                  placeholder="Course Code"
                  name="courseCode"
                  value={currentSubject.courseCode}
                  onChange={handleSubjectInputChange}
                  className="form-control subject-input"
                />
                <input
                  type="text"
                  placeholder="Subject Name"
                  name="subjectName"
                  value={currentSubject.subjectName}
                  onChange={handleSubjectInputChange}
                  className="form-control subject-input"
                />
                <button 
                  type="button" 
                  className="btn btn-sm add-subject-btn"
                  onClick={handleAddSubject}
                >
                  Add
                </button>
              </div>
            </div>
            
            {currentFaculty.subjects.length > 0 && (
              <div className="subjects-list">
                <h4>Added Subjects:</h4>
                <ul>
                  {currentFaculty.subjects.map((subject, index) => (
                    <li key={index}>
                      <span>{subject.courseCode}: {subject.subjectName}</span>
                      <button 
                        type="button" 
                        className="btn-remove" 
                        onClick={() => handleRemoveSubject(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={currentFaculty.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              value={currentFaculty.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn">
              {editing ? 'Update Faculty' : 'Add Faculty'}
            </button>
            
            {editing && (
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => {
                  setEditing(false);
                  setCurrentFaculty({
                    name: '',
                    photo: '',
                    email: '',
                    phone: '',
                    experience: '',
                    subjects: [],
                    designation: '',
                    qualification: '',
                    photoPosition: 'center top'
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
          
          {saveSuccess && (
            <div className="success-message">
              Faculty information saved successfully!
            </div>
          )}
        </form>
      </div>
      
      <h2>Faculty List</h2>
      {faculty.length === 0 ? (
        <div className="card">
          <p>No faculty members added yet.</p>
        </div>
      ) : (
        <div className="admin-faculty-list">
          {faculty.map((member, index) => (
            <div className="admin-faculty-card" key={index}>
              <div className="admin-faculty-banner"></div>
              <div className="admin-faculty-image">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    style={{ objectPosition: member.photoPosition || 'center top' }}
                  />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              <div className="admin-faculty-content">
                <h3 className="admin-faculty-name">{member.name}</h3>
                <div className="admin-faculty-designation">{member.designation}</div>
                <div className="admin-faculty-actions">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;