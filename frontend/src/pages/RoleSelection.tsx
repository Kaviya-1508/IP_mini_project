import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container fade-in">
      <div className="role-selection-card">
        <div className="role-header">
          <div className="role-icon">🎓</div>
          <h1 className="role-title">Welcome to EventHub</h1>
          <p className="role-subtitle">Choose your role to continue</p>
        </div>

        <div className="role-options">
          <div className="role-option" onClick={() => navigate('/faculty/login')}>
            <div className="role-option-icon">👨‍🏫</div>
            <h3>Faculty</h3>
            <p>Manage and create events for students</p>
            <button className="btn btn-primary">Continue as Faculty</button>
          </div>

          <div className="role-option" onClick={() => navigate('/student/login')}>
            <div className="role-option-icon">👨‍🎓</div>
            <h3>Student</h3>
            <p>View and register for events</p>
            <button className="btn btn-secondary">Continue as Student</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;