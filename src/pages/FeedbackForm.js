import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../components/styles/FeedbackForm.css';

const FeedbackForm = () => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // Department options
  const departmentOptions = [
    "ECE - I",
    "ECE - II",
    "ECE - Pre-Final Year",
    "ECE - Final Year"
  ];

  useEffect(() => {
    // Load faculty data to populate the dropdown
    try {
      const storedFaculty = localStorage.getItem('facultyData');
      if (storedFaculty) {
        const parsedFaculty = JSON.parse(storedFaculty);
        setFacultyList(parsedFaculty.map(faculty => ({
          id: faculty.name,
          name: faculty.name
        })));
      }
    } catch (error) {
      console.error("Error loading faculty data:", error);
      setFacultyList([]);
    }
    
    // Load faculty-subject mappings
    try {
      const storedMappings = localStorage.getItem('facultySubjectMappings');
      if (storedMappings) {
        const mappings = JSON.parse(storedMappings);
        setSubjectsList(mappings);
      }
    } catch (error) {
      console.error("Error loading faculty-subject mappings:", error);
      setSubjectsList([]);
    }
    
    // Load feedback questions
    try {
      const storedQuestions = localStorage.getItem('feedbackQuestions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        // Default questions if none are defined
        setQuestions([
          { id: 1, text: "How would you rate the teaching quality?", type: "rating" },
          { id: 2, text: "How would you rate the course content?", type: "rating" },
          { id: 3, text: "How would you rate faculty interaction & availability?", type: "rating" },
          { id: 4, text: "How would you rate the overall experience?", type: "rating" },
          { id: 5, text: "Any additional comments or suggestions?", type: "text" }
        ]);
      }
    } catch (error) {
      console.error("Error loading feedback questions:", error);
    }
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    // In a real application, this would verify against a database
    // For now, we'll just accept any non-empty register number and department
    if (registerNumber.trim() !== '' && department !== '') {
      setIsVerified(true);
    } else {
      alert("Please enter your register number and select your department");
    }
  };
  
  // Get subjects for selected faculty and department
  const getSubjectsForFaculty = (facultyName) => {
    return subjectsList
      .filter(mapping => mapping.faculty === facultyName && mapping.department === department)
      .map(mapping => mapping.subject);
  };
  
  // Handle faculty selection change
  const handleFacultyChange = (e, setFieldValue) => {
    const faculty = e.target.value;
    setSelectedFaculty(faculty);
    setFieldValue('facultyName', faculty);
    setFieldValue('subject', ''); // Reset subject when faculty changes
  };

  const initialValues = {
    facultyName: '',
    subject: '',
    teachingRating: '',
    contentRating: '',
    interactionRating: '',
    overallRating: '',
    comments: ''
  };

  // Dynamically generate validation schema based on questions
  const generateValidationSchema = () => {
    const schemaObj = {
      facultyName: Yup.string().required('Faculty name is required'),
      subject: Yup.string().required('Subject is required')
    };
    
    // Add validation for each rating question
    questions.forEach(question => {
      if (question.type === 'rating') {
        const fieldName = `question_${question.id}`;
        schemaObj[fieldName] = Yup.number()
          .required('Rating is required')
          .min(1, 'Rating must be at least 1')
          .max(5, 'Rating cannot be more than 5');
      }
    });
    
    return Yup.object(schemaObj);
  };

  const validationSchema = generateValidationSchema();

  const handleSubmit = (values, { resetForm }) => {
    try {
      // Map the dynamic question ratings to the expected format for charts
      const teachingQuestion = questions.find(q => q.text.toLowerCase().includes('teaching'));
      const contentQuestion = questions.find(q => q.text.toLowerCase().includes('content'));
      const interactionQuestion = questions.find(q => q.text.toLowerCase().includes('interaction'));
      const overallQuestion = questions.find(q => q.text.toLowerCase().includes('overall'));
      
      // Create new feedback object with the expected structure for charts
      const newFeedback = {
        registerNumber,
        department,
        facultyName: values.facultyName,
        subject: values.subject,
        teachingRating: teachingQuestion ? values[`question_${teachingQuestion.id}`] : "0",
        contentRating: contentQuestion ? values[`question_${contentQuestion.id}`] : "0",
        interactionRating: interactionQuestion ? values[`question_${interactionQuestion.id}`] : "0",
        overallRating: overallQuestion ? values[`question_${overallQuestion.id}`] : "0",
        comments: values.comments || "",
        timestamp: new Date().toISOString()
      };
      
      // Get existing feedback data
      const feedbackData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
      
      // Add new feedback
      feedbackData.push(newFeedback);
      
      // Save back to localStorage
      localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
      
      resetForm();
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  if (submitSuccess) {
    return (
      <div className="feedback-container">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <h1>Student Feedback Form</h1>
      
      {!isVerified ? (
        <div className="feedback-card">
          <h3>Verify Your Details</h3>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                id="department"
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="registerNumber" className="form-label">Register Number</label>
              <input
                type="text"
                id="registerNumber"
                className="form-control"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Verify</button>
          </form>
        </div>
      ) : (
        <div className="feedback-card">
          <h3>Submit Your Feedback</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="facultyName" className="form-label">Faculty Name</label>
                  <Field name="facultyName">
                    {({ field }) => (
                      <select 
                        {...field}
                        className="form-control"
                        onChange={(e) => handleFacultyChange(e, setFieldValue)}
                      >
                        <option value="">Select Faculty</option>
                        {facultyList.map(faculty => (
                          <option key={faculty.id} value={faculty.name}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <ErrorMessage name="facultyName" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <Field name="subject" as="select" className="form-control">
                    <option value="">Select Subject</option>
                    {getSubjectsForFaculty(values.facultyName).map((subject, idx) => (
                      <option key={idx} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="subject" component="div" className="error-message" />
                </div>
                
                {questions.map(question => (
                  <div className="form-group" key={question.id}>
                    <label className="form-label">{question.text}</label>
                    {question.type === 'rating' ? (
                      <>
                        <Field name={`question_${question.id}`} as="select" className="form-control">
                          <option value="">Select Rating</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Field>
                        <div className="rating-group">
                          <span className="rating-label">Poor</span>
                          <span className="rating-label">Excellent</span>
                        </div>
                        <ErrorMessage name={`question_${question.id}`} component="div" className="error-message" />
                      </>
                    ) : (
                      <Field name={`question_${question.id}`} as="textarea" className="form-control" rows="4" />
                    )}
                  </div>
                ))}
                
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;