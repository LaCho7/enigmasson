import React from 'react';
import styles from '../styles/EnigmaMachine.module.css';

const Keyboard = ({ onKeyClick }) => {
  const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'P',
    'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'L'
  ];

  return (
    <div className={styles.keyboard}>
      {keys.map(key => (
        <div
          key={key}
          className={styles.key}
          onClick={() => onKeyClick(key)}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;