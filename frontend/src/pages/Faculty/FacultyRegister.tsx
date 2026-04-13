import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { facultyRegister } from "../../services/api";
import Toast from "../../components/Toast";
import "./FacultyLogin.css";

const FacultyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    facultyId: "",
    facultyName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleSubmit = async () => {
    if (!form.facultyId || !form.facultyName || !form.email || !form.password) {
      setToast({
        show: true,
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await facultyRegister(form);
      setToast({
        show: true,
        message: 'Registration successful! Please login to continue.',
        type: 'success'
      });
      setTimeout(() => {
        navigate("/faculty/login");
      }, 2000);
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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
          <div className="auth-icon">📝</div>
          <h1 className="auth-title">Faculty Registration</h1>
          <p className="auth-subtitle">Join as a faculty member to manage events</p>
        </div>

        <div className="auth-body">
          <div className="form-group">
            <label className="form-label">Faculty ID</label>
            <input
              className="form-input"
              placeholder="Enter faculty ID"
              value={form.facultyId}
              onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="Enter your full name"
              value={form.facultyName}
              onChange={(e) => setForm({ ...form, facultyName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="faculty@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button 
            className="btn btn-primary btn-block" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Create Account"}
          </button>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/faculty/login">Login here</Link></p>
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

export default FacultyRegister;