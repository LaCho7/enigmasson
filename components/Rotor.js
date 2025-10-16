import React from 'react';
import styles from '../styles/EnigmaMachine.module.css';
import { alphabet } from '../utils/enigma';

const Rotor = ({ position, onUp, onDown, title, type }) => {
  return (
    <div className={styles.rotor}>
      <h3 className={styles.rotorTitle}>{title}</h3>
      <div className={styles.rotorDisplay}>{alphabet[position]}</div>
      <div className={styles.rotorControls}>
        <button className={styles.rotorButton} onClick={onDown}>▼</button>
        <button className={styles.rotorButton} onClick={onUp}>▲</button>
      </div>
      <div className={styles.rotorType}>Type {type}</div>
    </div>
  );
};

export default Rotor;