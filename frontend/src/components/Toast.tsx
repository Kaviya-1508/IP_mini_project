import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={`toast toast-${type} slide-in-right`}>
      <div className="toast-content">
        <span className="toast-icon">{icons[type]}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Toast;