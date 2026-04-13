import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { studentLogin } from "../../services/api";
import { useStudent } from "../../contexts/StudentContext";
import Toast from "../../components/Toast";
import "../Faculty/FacultyLogin.css";

const StudentLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setStudentData } = useStudent();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleSubmit = async () => {
    if (!form.email.trim()) {
      setToast({
        show: true,
        message: 'Please enter your email address',
        type: 'error'
      });
      return;
    }
    
    if (!form.password) {
      setToast({
        show: true,
        message: 'Please enter your password',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login for:', form.email);
      const res = await studentLogin({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      
      console.log('✅ Login response:', res.data);
      
      // Store student data in context
      setStudentData(res.data);
      
      setToast({
        show: true,
        message: `Welcome back, ${res.data.name || 'Student'}! Login successful.`,
        type: 'success'
      });
      
      setTimeout(() => {
        navigate("/student/events");
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Invalid email or password';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 404) {
          errorMessage = 'Student not found. Please register first.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid request. Please check your input.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the backend is running.';
      }
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👨‍🎓</div>
          <h1 className="auth-title">Student Login</h1>
          <p className="auth-subtitle">Welcome back! Access your events dashboard</p>
        </div>

        <div className="auth-body">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="student@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button 
            className="btn btn-primary btn-block" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/student/register">Register here</Link></p>
          <p><Link to="/">← Back to Role Selection</Link></p>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default StudentLogin;