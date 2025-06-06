import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize localStorage with default values if they don't exist
const initializeLocalStorage = () => {
  // Faculty data
  if (!localStorage.getItem('facultyData')) {
    localStorage.setItem('facultyData', JSON.stringify([]));
  }
  
  // Feedback data
  if (!localStorage.getItem('feedbackData')) {
    localStorage.setItem('feedbackData', JSON.stringify([]));
  }
  
  // Notes data
  if (!localStorage.getItem('notesData')) {
    localStorage.setItem('notesData', JSON.stringify([]));
  }
  
  // Achievements data
  if (!localStorage.getItem('achievementsData')) {
    localStorage.setItem('achievementsData', JSON.stringify([]));
  }
};

// Call the initialization function
initializeLocalStorage();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();