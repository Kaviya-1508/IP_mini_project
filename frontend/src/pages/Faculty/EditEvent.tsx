import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateEvent } from "../../services/api";
import { useFaculty } from "../../contexts/FacultyContext";
import Toast from "../../components/Toast";
import "./AddEvent.css";

const EditEvent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, facultyData } = useFaculty();
    const eventData = location.state?.event;

    const [event, setEvent] = useState({
        studentName: "",
        rNo: 0,
        eventName: "",
        eventLocation: "",
        eventDate: "",
        eventDescription: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/faculty/login");
        }

        // Load event data
        if (eventData) {
            setEvent({
                studentName: eventData.studentName,
                rNo: eventData.rNo,
                eventName: eventData.eventName,
                eventLocation: eventData.eventLocation,
                eventDate: eventData.eventDate?.split('T')[0] || "",
                eventDescription: eventData.eventDescription || ""
            });
        } else {
            navigate("/faculty/events");
        }
    }, [isAuthenticated, navigate, eventData]);

    const handleSubmit = async () => {
        if (!event.studentName || !event.rNo || !event.eventName || !event.eventLocation || !event.eventDate) {
            setToast({
                show: true,
                message: 'Please fill in all required fields',
                type: 'error'
            });
            return;
        }

        const facultyId = localStorage.getItem("facultyId") || "";
        setLoading(true);

        try {
            const eventData = {
                ...event,
                facultyId
            };
            console.log('Updating event:', eventData);
            await updateEvent(event.rNo, eventData);
            setToast({
                show: true,
                message: 'Event updated successfully!',
                type: 'success'
            });
            setTimeout(() => {
                navigate("/faculty/events");
            }, 1500);
        } catch (error: any) {
            console.error('Error updating event:', error);
            setToast({
                show: true,
                message: error.response?.data?.message || error.message || 'Error updating event',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="add-event-container fade-in">
            <div className="container">
                <div className="form-card">
                    <div className="form-header">
                        <h1 className="form-title">Edit Event</h1>
                        <p className="form-subtitle">Welcome, {facultyData?.facultyName}! Update event details</p>
                    </div>

                    <div className="form-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Student Name *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter student name"
                                    value={event.studentName}
                                    onChange={(e) => setEvent({ ...event, studentName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Roll Number *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter roll number"
                                    value={event.rNo || ''}
                                    onChange={(e) => setEvent({ ...event, rNo: Number(e.target.value) })}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Event Name *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter event name"
                                    value={event.eventName}
                                    onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter event location"
                                    value={event.eventLocation}
                                    onChange={(e) => setEvent({ ...event, eventLocation: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Event Date *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={event.eventDate}
                                    onChange={(e) => setEvent({ ...event, eventDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows={4}
                                    placeholder="Provide event details..."
                                    value={event.eventDescription}
                                    onChange={(e) => setEvent({ ...event, eventDescription: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => navigate("/faculty/events")}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? <span className="spinner"></span> : "Update Event"}
                            </button>
                        </div>
                    </div>
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

export default EditEvent;