import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, deleteEvent } from "../../services/api";
import { useFaculty } from "../../contexts/FacultyContext";
import Toast from "../../components/Toast";
import "./ViewEvents.css";

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

const ViewEvents: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, facultyData, logout } = useFaculty();
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
        message: 'Please login to access this page',
        type: 'error'
      });
      setTimeout(() => {
        navigate("/faculty/login");
      }, 1500);
    } else {
      loadEvents();
    }
  }, [isAuthenticated, navigate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      console.log('Events response:', res.data);
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error("Failed to load events:", error);
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

  // ✅ FIXED: Delete by event ID
  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const facultyId = localStorage.getItem("facultyId") || "";

      if (!facultyId) {
        setToast({
          show: true,
          message: 'Faculty ID not found. Please login again.',
          type: 'error'
        });
        return;
      }

      try {
        await deleteEvent(eventId, facultyId);
        setToast({
          show: true,
          message: 'Event deleted successfully!',
          type: 'success'
        });
        loadEvents();
      } catch (error: any) {
        console.error('Delete error:', error);
        setToast({
          show: true,
          message: error.response?.data || error.message || 'Failed to delete event',
          type: 'error'
        });
      }
    }
  };

  const handleEdit = (event: Event) => {
    navigate("/faculty/edit-event", { state: { event } });
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("facultyId");
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
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="view-events-container fade-in">
      <div className="container">
        <div className="events-header">
          <div className="header-with-logout">
            <div>
              <h1 className="events-title">All Events</h1>
              <p className="events-subtitle">Welcome, {facultyData?.facultyName}! Manage all student events</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/faculty/add-event")}
              >
                + Add New Event
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Events Found</h3>
            <p>Start by creating your first event</p>
            <button className="btn btn-primary" onClick={() => navigate("/faculty/add-event")}>
              Create Event
            </button>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event, index) => {
              const isOwnEvent = event.facultyId === facultyData?.id;

              return (
                <div key={event.id || index} className={`event-item ${isOwnEvent ? 'own-event' : 'other-event'}`}>
                  <div className="event-item-header">
                    <div className="event-badge">
                      <span className="badge-icon">🎯</span>
                      <span className="badge-text">{event.eventName}</span>
                    </div>
                    <div className="event-actions">
                      {isOwnEvent && (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(event)}>
                            ✏️ Edit
                          </button>
                          {/* ✅ FIXED: Pass event.id */}
                          <button className="delete-btn" onClick={() => handleDelete(event.id!)}>
                            🗑️ Delete
                          </button>
                        </>
                      )}
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
                      <div className="info-row">
                        <span className="info-label">Created By:</span>
                        <span className="info-value">
                          {isOwnEvent ? "You" : "Other Faculty"}
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
              );
            })}
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

export default ViewEvents;