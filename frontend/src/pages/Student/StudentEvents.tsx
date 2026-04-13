import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventByRoll } from "../../services/api";
import { useStudent } from "../../contexts/StudentContext";
import Toast from "../../components/Toast";
import "./StudentEvents.css";

const StudentEvents: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, studentData, logout, rNo } = useStudent();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setToast({
        show: true,
        message: 'Please login to access your events',
        type: 'error'
      });
      setTimeout(() => {
        navigate("/student/login");
      }, 1500);
    } else if (rNo) {
      loadEvent();
    }
  }, [isAuthenticated, navigate, rNo]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      console.log(`Fetching event for roll number: ${rNo}`);
      const res = await getEventByRoll(Number(rNo));
      console.log('Event response:', res.data);
      setEvent(res.data);
      
      // If no event found
      if (!res.data || Object.keys(res.data).length === 0) {
        setToast({
          show: true,
          message: 'No events found for your roll number',
          type: 'info'
        });
      }
    } catch (error: any) {
      console.error('Error loading event:', error);
      
      // Handle 404 specifically
      if (error.response?.status === 404) {
        setEvent(null);
        setToast({
          show: true,
          message: 'No events registered for your account yet',
          type: 'info'
        });
      } else {
        setToast({
          show: true,
          message: error.message || 'Failed to load events. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setToast({
      show: true,
      message: 'Logged out successfully',
      type: 'success'
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg spinner-dark"></div>
        <p>Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="student-events-container fade-in">
      <div className="container">
        <div className="events-header">
          <div className="header-with-logout">
            <div>
              <h1 className="events-title">My Events</h1>
              <p className="events-subtitle">Welcome, {studentData?.name || 'Student'}! View your registered events</p>
            </div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {event && event.eventName ? (
          <div className="event-card-detailed">
            <div className="event-card-badge">Active Registration</div>
            <div className="event-card-content">
              <h2 className="event-name">{event.eventName}</h2>
              <div className="event-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">👤</div>
                  <div>
                    <div className="detail-label">Student</div>
                    <div className="detail-value">{event.studentName}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">🎓</div>
                  <div>
                    <div className="detail-label">Roll Number</div>
                    <div className="detail-value">{event.rNo}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📍</div>
                  <div>
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{event.eventLocation}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">📅</div>
                  <div>
                    <div className="detail-label">Date</div>
                    <div className="detail-value">
                      {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Date not specified'}
                    </div>
                  </div>
                </div>
              </div>
              {event.eventDescription && (
                <div className="event-description-section">
                  <h3>Description</h3>
                  <p>{event.eventDescription}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Events Found</h3>
            <p>You haven't registered for any events yet</p>
            <p className="contact-message">Please contact your faculty to register for events</p>
            <button className="btn btn-primary" onClick={loadEvent}>
              Refresh
            </button>
          </div>
        )}
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

export default StudentEvents;