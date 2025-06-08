import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Login.css';

const Login = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (adminId === '732722106004' && password === 'E22EC018') {
      localStorage.setItem('isAdmin', 'true');
      // Trigger storage event to update navbar
      window.dispatchEvent(new Event('storage'));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Login</h2>
        </div>
        
        <div className="login-body">
          {error && <div className="alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="adminId" className="form-label">Admin ID</label>
              <input
                type="text"
                id="adminId"
                className="form-control"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
        
        <div className="login-footer">
          <p>Enter your admin credentials to access the dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Login;