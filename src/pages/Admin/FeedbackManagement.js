import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import '../../components/styles/FeedbackManagement.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState('responses');
  
  // Form settings state
  const [questions, setQuestions] = useState([
    { id: 1, text: "How would you rate the teaching quality?", type: "rating" },
    { id: 2, text: "How would you rate the course content?", type: "rating" },
    { id: 3, text: "How would you rate faculty interaction & availability?", type: "rating" },
    { id: 4, text: "How would you rate the overall experience?", type: "rating" },
    { id: 5, text: "Any additional comments or suggestions?", type: "text" }
  ]);
  const [newQuestion, setNewQuestion] = useState({ text: "", type: "rating" });
  
  // Faculty-subject mapping state
  const [facultySubjectMappings, setFacultySubjectMappings] = useState([]);
  const [currentMapping, setCurrentMapping] = useState({
    department: '',
    faculty: '',
    subject: ''
  });
  
  // Department options
  const departmentOptions = [
    "ECE - I",
    "ECE - II",
    "ECE - Pre-Final Year",
    "ECE - Final Year"
  ];

  // Load feedback data
  const loadFeedbackData = () => {
    try {
      const feedbackData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error loading feedback data:", error);
      setFeedback([]);
    }
  };

  useEffect(() => {
    // Load feedback data
    loadFeedbackData();

    // Load faculty data
    try {
      const facultyData = JSON.parse(localStorage.getItem('facultyData') || '[]');
      setFacultyList(facultyData.map(faculty => faculty.name));
    } catch (error) {
      console.error("Error loading faculty data:", error);
      setFacultyList([]);
    }
    
    // Load questions
    try {
      const storedQuestions = localStorage.getItem('feedbackQuestions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      }
    } catch (error) {
      console.error("Error loading feedback questions:", error);
    }
    
    // Load faculty-subject mappings
    try {
      const storedMappings = localStorage.getItem('facultySubjectMappings');
      if (storedMappings) {
        setFacultySubjectMappings(JSON.parse(storedMappings));
      }
    } catch (error) {
      console.error("Error loading faculty-subject mappings:", error);
    }
    
    setLoading(false);
  }, []);

  // Save questions to localStorage
  useEffect(() => {
    localStorage.setItem('feedbackQuestions', JSON.stringify(questions));
  }, [questions]);
  
  // Save faculty-subject mappings to localStorage
  useEffect(() => {
    localStorage.setItem('facultySubjectMappings', JSON.stringify(facultySubjectMappings));
  }, [facultySubjectMappings]);

  // Filter feedback by selected faculty, department, and date range
  const filteredFeedback = feedback.filter(item => {
    const facultyMatch = selectedFaculty === 'all' || item.facultyName === selectedFaculty;
    const departmentMatch = selectedDepartment === 'all' || item.department === selectedDepartment;
    
    // Date filtering
    let dateMatch = true;
    if (startDate && endDate) {
      const feedbackDate = new Date(item.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the entire end day
      dateMatch = feedbackDate >= start && feedbackDate <= end;
    }
    
    return facultyMatch && departmentMatch && dateMatch;
  });

  // Calculate average ratings
  const calculateAverages = () => {
    if (filteredFeedback.length === 0) return { teaching: 0, content: 0, interaction: 0, overall: 0 };
    
    const sum = filteredFeedback.reduce((acc, item) => {
      return {
        teaching: acc.teaching + Number(item.teachingRating || 0),
        content: acc.content + Number(item.contentRating || 0),
        interaction: acc.interaction + Number(item.interactionRating || 0),
        overall: acc.overall + Number(item.overallRating || 0)
      };
    }, { teaching: 0, content: 0, interaction: 0, overall: 0 });
    
    return {
      teaching: (sum.teaching / filteredFeedback.length).toFixed(1),
      content: (sum.content / filteredFeedback.length).toFixed(1),
      interaction: (sum.interaction / filteredFeedback.length).toFixed(1),
      overall: (sum.overall / filteredFeedback.length).toFixed(1)
    };
  };

  const averages = calculateAverages();

  // Prepare data for pie chart
  const pieData = {
    labels: ['Teaching', 'Content', 'Interaction', 'Overall'],
    datasets: [
      {
        data: [averages.teaching, averages.content, averages.interaction, averages.overall],
        backgroundColor: [
          'rgba(43, 122, 120, 0.9)',  // Teal
          'rgba(58, 175, 169, 0.9)',  // Aqua
          'rgba(0, 123, 255, 0.9)',   // Electric Blue
          'rgba(255, 165, 0, 0.9)'    // Orange
        ],
        borderColor: [
          'rgba(43, 122, 120, 1)',
          'rgba(58, 175, 169, 1)',
          'rgba(0, 123, 255, 1)',
          'rgba(255, 165, 0, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for bar chart
  const barData = {
    labels: ['Teaching', 'Content', 'Interaction', 'Overall'],
    datasets: [
      {
        label: 'Avg Rating',
        data: [averages.teaching, averages.content, averages.interaction, averages.overall],
        backgroundColor: [
          'rgba(43, 122, 120, 0.9)',  // Teal
          'rgba(58, 175, 169, 0.9)',  // Aqua
          'rgba(0, 123, 255, 0.9)',   // Electric Blue
          'rgba(255, 165, 0, 0.9)'    // Orange
        ],
        borderColor: [
          'rgba(43, 122, 120, 1)',
          'rgba(58, 175, 169, 1)',
          'rgba(0, 123, 255, 1)',
          'rgba(255, 165, 0, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add header information to a separate sheet
    const headerData = [
      ['SRI SHANMUGHA COLLEGE OF ENGINEERING AND TECHNOLOGY'],
      ['ECE DEPARTMENT'],
      [''],
      ['Feedback Summary Report'],
      [''],
      [`Department: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}`],
      [`Faculty: ${selectedFaculty === 'all' ? 'All Faculty' : selectedFaculty}`],
      [''],
      [`Total Responses: ${filteredFeedback.length}`],
      [''],
      ['Average Ratings:'],
      [`Teaching: ${averages.teaching}/5`],
      [`Content: ${averages.content}/5`],
      [`Interaction: ${averages.interaction}/5`],
      [`Overall: ${averages.overall}/5`],
      [''],
      [`Generated on: ${new Date().toLocaleDateString()}`]
    ];
    
    const headerSheet = XLSX.utils.aoa_to_sheet(headerData);
    XLSX.utils.book_append_sheet(workbook, headerSheet, 'Summary');
    
    // Add feedback data to another sheet
    const worksheet = XLSX.utils.json_to_sheet(filteredFeedback);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback Data');
    
    const fileName = `feedback_data_${selectedDepartment === 'all' ? 'all_departments' : selectedDepartment}_${selectedFaculty === 'all' ? 'all_faculty' : selectedFaculty}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add college and department header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SRI SHANMUGHA COLLEGE OF ENGINEERING AND TECHNOLOGY', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('ECE DEPARTMENT', 105, 30, { align: 'center' });
    
    // Add a line
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Feedback Summary Report', 105, 45, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Department: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}`, 20, 60);
    doc.text(`Faculty: ${selectedFaculty === 'all' ? 'All Faculty' : selectedFaculty}`, 20, 70);
    
    doc.text(`Total Responses: ${filteredFeedback.length}`, 20, 85);
    doc.text(`Average Ratings:`, 20, 95);
    doc.text(`- Teaching: ${averages.teaching}/5`, 30, 105);
    doc.text(`- Content: ${averages.content}/5`, 30, 115);
    doc.text(`- Interaction: ${averages.interaction}/5`, 30, 125);
    doc.text(`- Overall: ${averages.overall}/5`, 30, 135);
    
    // Add date
    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 20, 150);
    
    const fileName = `feedback_report_${selectedDepartment === 'all' ? 'all_departments' : selectedDepartment}_${selectedFaculty === 'all' ? 'all_faculty' : selectedFaculty}.pdf`;
    doc.save(fileName);
  };

  // Delete a single feedback response
  const handleDeleteFeedback = (index) => {
    const updatedFeedback = [...feedback];
    updatedFeedback.splice(index, 1);
    setFeedback(updatedFeedback);
    localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
  };

  // Reset all feedback data
  const handleResetAllFeedback = () => {
    setFeedback([]);
    localStorage.setItem('feedbackData', JSON.stringify([]));
    setShowConfirmReset(false);
  };

  // Refresh feedback data
  const handleRefresh = () => {
    loadFeedbackData();
  };
  
  // Add new question
  const handleAddQuestion = () => {
    if (newQuestion.text.trim() === '') return;
    
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { ...newQuestion, id: newId }]);
    setNewQuestion({ text: "", type: "rating" });
  };
  
  // Delete question
  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  // Add faculty-subject mapping
  const handleAddMapping = () => {
    if (!currentMapping.department || !currentMapping.faculty || !currentMapping.subject) {
      alert("Please fill in all fields");
      return;
    }
    
    setFacultySubjectMappings([...facultySubjectMappings, { ...currentMapping }]);
    setCurrentMapping({ department: '', faculty: '', subject: '' });
  };
  
  // Delete faculty-subject mapping
  const handleDeleteMapping = (index) => {
    const updatedMappings = [...facultySubjectMappings];
    updatedMappings.splice(index, 1);
    setFacultySubjectMappings(updatedMappings);
  };

  if (loading) {
    return <div>Loading feedback data...</div>;
  }

  return (
    <div className="feedback-management">
      <h1>Feedback Management</h1>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`} 
          onClick={() => setActiveTab('responses')}
        >
          Feedback Responses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} 
          onClick={() => setActiveTab('questions')}
        >
          Manage Questions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mappings' ? 'active' : ''}`} 
          onClick={() => setActiveTab('mappings')}
        >
          Faculty-Subject Mappings
        </button>
      </div>
      
      {activeTab === 'responses' && (
        <div className="tab-content">
          <div className="card">
            <h2>Feedback Statistics</h2>
            
            <div className="filter-container">
              <div className="filter-group">
                <label htmlFor="departmentFilter" className="form-label">Department:</label>
                <select 
                  id="departmentFilter" 
                  className="form-control"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departmentOptions.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="facultyFilter" className="form-label">Faculty:</label>
                <select 
                  id="facultyFilter" 
                  className="form-control"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="all">All Faculty</option>
                  {facultyList.map((faculty, index) => (
                    <option key={index} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="startDate" className="form-label">From:</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="endDate" className="form-label">To:</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <button className="btn refresh-btn" onClick={handleRefresh}>
                Refresh Data
              </button>
            </div>
            
            <p>Total responses: {filteredFeedback.length}</p>
            
            {filteredFeedback.length === 0 ? (
              <p>No feedback data available yet.</p>
            ) : (
              <div className="charts-container">
                <div className="chart-card">
                  <h3>Average Ratings (Pie)</h3>
                  <div className="chart">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Average Ratings (Bar)</h3>
                  <div className="chart">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              <div className="export-buttons">
                <button 
                  className="btn" 
                  onClick={exportToExcel}
                  disabled={filteredFeedback.length === 0}
                >
                  Export to Excel
                </button>
                <button 
                  className="btn" 
                  onClick={exportToPDF}
                  disabled={filteredFeedback.length === 0}
                >
                  Export to PDF
                </button>
              </div>
              
              <div className="reset-button">
                <button 
                  className="btn btn-danger" 
                  onClick={() => setShowConfirmReset(true)}
                  disabled={feedback.length === 0}
                >
                  Reset All Feedback
                </button>
              </div>
            </div>
            
            {showConfirmReset && (
              <div className="confirm-reset">
                <p>Are you sure you want to delete all feedback data? This action cannot be undone.</p>
                <div className="confirm-buttons">
                  <button className="btn btn-danger" onClick={handleResetAllFeedback}>
                    Yes, Delete All
                  </button>
                  <button className="btn" onClick={() => setShowConfirmReset(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="card">
            <h2>Feedback Responses</h2>
            {filteredFeedback.length === 0 ? (
              <p>No feedback responses yet.</p>
            ) : (
              <div className="feedback-list">
                {filteredFeedback.map((item, index) => (
                  <div className="feedback-item" key={index}>
                    <div className="feedback-header">
                      <p><strong>Register Number:</strong> {item.registerNumber}</p>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteFeedback(index)}
                        title="Delete this feedback"
                      >
                        ×
                      </button>
                    </div>
                    <p><strong>Department:</strong> {item.department || 'N/A'}</p>
                    <p><strong>Faculty:</strong> {item.facultyName}</p>
                    <p><strong>Subject:</strong> {item.subject || item.courseCode}</p>
                    <p><strong>Teaching:</strong> {item.teachingRating}/5</p>
                    <p><strong>Content:</strong> {item.contentRating}/5</p>
                    <p><strong>Interaction:</strong> {item.interactionRating}/5</p>
                    <p><strong>Overall:</strong> {item.overallRating}/5</p>
                    {item.comments && <p><strong>Comments:</strong> {item.comments}</p>}
                    <p><strong>Submitted:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'questions' && (
        <div className="tab-content">
          <div className="card">
            <h2>Manage Feedback Questions</h2>
            
            <div className="add-question-form">
              <div className="form-group">
                <label htmlFor="questionText" className="form-label">Question Text:</label>
                <input
                  type="text"
                  id="questionText"
                  className="form-control"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter question text"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="questionType" className="form-label">Question Type:</label>
                <select
                  id="questionType"
                  className="form-control"
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                >
                  <option value="rating">Rating (1-5)</option>
                  <option value="text">Text Input</option>
                </select>
              </div>
              
              <button className="btn" onClick={handleAddQuestion}>Add Question</button>
            </div>
            
            <div className="questions-list">
              <h3>Current Questions</h3>
              {questions.length === 0 ? (
                <p>No questions defined yet.</p>
              ) : (
                <ul>
                  {questions.map((question) => (
                    <li key={question.id} className="question-item">
                      <div className="question-content">
                        <p><strong>{question.text}</strong></p>
                        <p className="question-type">Type: {question.type === 'rating' ? 'Rating (1-5)' : 'Text Input'}</p>
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteQuestion(question.id)}
                        title="Delete this question"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'mappings' && (
        <div className="tab-content">
          <div className="card">
            <h2>Faculty-Subject Mappings</h2>
            
            <div className="add-mapping-form">
              <div className="form-group">
                <label htmlFor="mappingDepartment" className="form-label">Department:</label>
                <select
                  id="mappingDepartment"
                  className="form-control"
                  value={currentMapping.department}
                  onChange={(e) => setCurrentMapping({...currentMapping, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="mappingFaculty" className="form-label">Faculty:</label>
                <select
                  id="mappingFaculty"
                  className="form-control"
                  value={currentMapping.faculty}
                  onChange={(e) => setCurrentMapping({...currentMapping, faculty: e.target.value})}
                >
                  <option value="">Select Faculty</option>
                  {facultyList.map((faculty, index) => (
                    <option key={index} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="mappingSubject" className="form-label">Subject:</label>
                <input
                  type="text"
                  id="mappingSubject"
                  className="form-control"
                  value={currentMapping.subject}
                  onChange={(e) => setCurrentMapping({...currentMapping, subject: e.target.value})}
                  placeholder="Enter subject name"
                />
              </div>
              
              <button className="btn" onClick={handleAddMapping}>Add Mapping</button>
            </div>
            
            <div className="mappings-list">
              <h3>Current Mappings</h3>
              {facultySubjectMappings.length === 0 ? (
                <p>No mappings defined yet.</p>
              ) : (
                <table className="mappings-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Faculty</th>
                      <th>Subject</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultySubjectMappings.map((mapping, index) => (
                      <tr key={index}>
                        <td>{mapping.department}</td>
                        <td>{mapping.faculty}</td>
                        <td>{mapping.subject}</td>
                        <td>
                          <button 
                            className="delete-btn-small" 
                            onClick={() => handleDeleteMapping(index)}
                            title="Delete this mapping"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;