import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { studentRegister } from "../../services/api";
import Toast from "../../components/Toast";
import "../Faculty/FacultyLogin.css";

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rNo: 0,
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
    // Validation
    if (!form.name.trim()) {
      setToast({
        show: true,
        message: 'Please enter your full name',
        type: 'error'
      });
      return;
    }
    
    if (!form.rNo || form.rNo <= 0) {
      setToast({
        show: true,
        message: 'Please enter a valid roll number',
        type: 'error'
      });
      return;
    }
    
    if (!form.email.trim()) {
      setToast({
        show: true,
        message: 'Please enter your email address',
        type: 'error'
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToast({
        show: true,
        message: 'Please enter a valid email address',
        type: 'error'
      });
      return;
    }
    
    if (!form.password) {
      setToast({
        show: true,
        message: 'Please enter a password',
        type: 'error'
      });
      return;
    }
    
    if (form.password.length < 6) {
      setToast({
        show: true,
        message: 'Password must be at least 6 characters long',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const studentData = {
        name: form.name.trim(),
        rNo: form.rNo,
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      
      console.log('📝 Sending registration data:', studentData);
      const response = await studentRegister(studentData);
      console.log('✅ Registration response:', response.data);
      
      setToast({
        show: true,
        message: 'Registration successful! Please login to continue.',
        type: 'success'
      });
      
      // Clear form
      setForm({
        name: "",
        rNo: 0,
        email: "",
        password: ""
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/student/login");
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid data. Please check your input.';
        } else if (error.response.status === 409) {
          errorMessage = 'Student already exists. Please login instead.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check if the backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'An error occurred. Please try again.';
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
          <div className="auth-icon">📝</div>
          <h1 className="auth-title">Student Registration</h1>
          <p className="auth-subtitle">Create your account to start participating</p>
        </div>

        <div className="auth-body">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your roll number"
              value={form.rNo || ''}
              onChange={(e) => setForm({ ...form, rNo: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="student@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a strong password (min. 6 characters)"
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
          <p>Already have an account? <Link to="/student/login">Login here</Link></p>
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

export default StudentRegister;