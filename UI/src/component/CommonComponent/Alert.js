import React, { useState, useEffect } from 'react';
import './Alert.css';

function Alert({ message, type = 'info', duration = 12000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`custom-alert ${type}`} style={{ paddingTop: '80px' }}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        <button className="close-button" onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}>
          ×
        </button>
      </div>
    </div>
  );
}

export default Alert;
