import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/styles/Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Manage faculty details, feedback, notes, and achievements.</p>
      
      <div className="dashboard-grid">
        <Link to="/admin/faculty" className="dashboard-card">
          <div className="dashboard-icon">👨‍🏫</div>
          <h3>Faculty Management</h3>
          <p>Add, edit, or remove faculty details</p>
        </Link>
        
        <Link to="/admin/feedback" className="dashboard-card">
          <div className="dashboard-icon">📝</div>
          <h3>Feedback Management</h3>
          <p>View feedback statistics and export data</p>
        </Link>
        
        <Link to="/admin/notes" className="dashboard-card">
          <div className="dashboard-icon">📚</div>
          <h3>Notes Management</h3>
          <p>Upload and manage course notes</p>
        </Link>
        
        <Link to="/admin/achievements" className="dashboard-card">
          <div className="dashboard-icon">🏆</div>
          <h3>Achievements Management</h3>
          <p>Add and update department achievements</p>
        </Link>
        
        <Link to="/admin/settings" className="dashboard-card">
          <div className="dashboard-icon">⚙️</div>
          <h3>Site Settings</h3>
          <p>Change logo and site name</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;