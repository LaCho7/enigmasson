import React, { useEffect } from 'react';
import styles from '../styles/EnigmaMachine.module.css';

const NotificationMessage = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div className={`${styles.notification} ${isVisible ? styles.show : ''}`}>
      {message}
    </div>
  );
};

export default NotificationMessage;