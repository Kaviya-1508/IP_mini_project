import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventsByStudent } from "../../services/api";
import { useStudent } from "../../contexts/StudentContext";
import Toast from "../../components/Toast";
import "../Faculty/ViewEvents.css";

interface Event {
  id?: string;
  studentName: string;
  rNo: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventDescription: string;
  facultyId?: string;
}

const StudentEvents: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, studentData, logout } = useStudent();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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
    } else {
      loadEvents();
    }
  }, [isAuthenticated, navigate]);

  const loadEvents = async () => {
    const rNo = studentData?.rNo || localStorage.getItem("studentRNo");
    if (!rNo) {
      setLoading(false);
      return;
    }

    try {
      const res = await getEventsByStudent(Number(rNo));
      console.log('Events response:', res.data);
      setEvents(Array.isArray(res.data) ? res.data : []);

      if (res.data.length === 0) {
        setToast({
          show: true,
          message: 'No events found for your roll number',
          type: 'info'
        });
      }
    } catch (error: any) {
      console.error('Error loading events:', error);
      setToast({
        show: true,
        message: error.message || 'Failed to load events',
        type: 'error'
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentRNo");
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
    <div className="view-events-container fade-in">
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

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Events Found</h3>
            <p>You haven't registered for any events yet</p>
            <p className="contact-message">Please contact your faculty to register for events</p>
            <button className="btn btn-primary" onClick={loadEvents}>
              Refresh
            </button>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-item own-event">
                <div className="event-item-header">
                  <div className="event-badge">
                    <span className="badge-icon">🎯</span>
                    <span className="badge-text">{event.eventName}</span>
                  </div>
                </div>
                <div className="event-item-body">
                  <div className="event-info">
                    <div className="info-row">
                      <span className="info-label">Student:</span>
                      <span className="info-value">{event.studentName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Roll No:</span>
                      <span className="info-value">{event.rNo}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{event.eventLocation}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Date:</span>
                      <span className="info-value">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Not specified'}
                      </span>
                    </div>
                  </div>
                  {event.eventDescription && (
                    <div className="event-description">
                      <span className="info-label">Description:</span>
                      <p>{event.eventDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
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