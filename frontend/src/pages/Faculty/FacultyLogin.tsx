import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { facultyLogin } from "../../services/api";
import { useFaculty } from "../../contexts/FacultyContext";
import Toast from "../../components/Toast";
import "./FacultyLogin.css";

const FacultyLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setFacultyData } = useFaculty();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setToast({
        show: true,
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await facultyLogin(form);
      setFacultyData(res.data);

      // ✅ Store the MongoDB _id (not facultyId)
      if (res.data.id) {
        localStorage.setItem("facultyId", res.data.id);
        console.log('✅ Stored faculty MongoDB _id:', res.data.id);
      } else {
        console.error('❌ No id in response:', res.data);
      }

      setToast({
        show: true,
        message: `Welcome back, ${res.data.facultyName}! Login successful.`,
        type: 'success'
      });
      setTimeout(() => {
        navigate("/faculty/events");
      }, 1500);
    } catch (error: any) {
      console.error('Login error:', error);
      setToast({
        show: true,
        message: error.response?.data?.message || 'Invalid email or password',
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
          <div className="auth-icon">👨‍🏫</div>
          <h1 className="auth-title">Faculty Login</h1>
          <p className="auth-subtitle">Welcome back! Please login to your account</p>
        </div>

        <div className="auth-body">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="faculty@university.edu"
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
          <p>Don't have an account? <Link to="/faculty/register">Register here</Link></p>
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

export default FacultyLogin;