import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Faculty from './pages/Faculty';
import FeedbackForm from './pages/FeedbackForm';
import Notes from './pages/Notes';
import Achievements from './pages/Achievements';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import FacultyManagement from './pages/Admin/FacultyManagement';
import FeedbackManagement from './pages/Admin/FeedbackManagement';
import NotesManagement from './pages/Admin/NotesManagement';
import AchievementsManagement from './pages/Admin/AchievementsManagement';
import SiteSettings from './pages/Admin/SiteSettings';
import './App.css';

function App() {
  // Ensure localStorage data persists across page refreshes
  useEffect(() => {
    // Check if localStorage is working properly
    try {
      const testKey = 'test_localStorage';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Ensure all required data structures exist
      const requiredKeys = ['facultyData', 'feedbackData', 'notesData', 'achievementsData'];
      
      requiredKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          // If data is null or not valid JSON, initialize it
          if (!data) {
            localStorage.setItem(key, JSON.stringify([]));
          } else {
            // Try to parse it to ensure it's valid
            JSON.parse(data);
          }
        } catch (error) {
          console.error(`Error with ${key} in localStorage:`, error);
          localStorage.setItem(key, JSON.stringify([]));
        }
      });
    } catch (error) {
      console.error('localStorage is not available:', error);
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/faculty" element={<FacultyManagement />} />
        <Route path="/admin/feedback" element={<FeedbackManagement />} />
        <Route path="/admin/notes" element={<NotesManagement />} />
        <Route path="/admin/achievements" element={<AchievementsManagement />} />
        <Route path="/admin/settings" element={<SiteSettings />} />
      </Routes>
    </Router>
  );
}

export default App;