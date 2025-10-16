import React from 'react';
import styles from '../styles/EnigmaMachine.module.css';

const Plugboard = ({ plugs, onChange }) => {
  const handlePlugChange = (plug, value) => {
    onChange(plug, value.toUpperCase());
  };

  return (
    <div className={styles.plugboard}>
      <h3 className={styles.plugboardTitle}>Tableau de connexion (Plugboard)</h3>
      <div className={styles.plugboardControls}>
        {['A', 'B', 'C'].map(plug => (
          <div key={plug} className={styles.plugInput}>
            <label>{plug} ↔</label>
            <input
              type="text"
              className={styles.plugInputField}
              value={plugs[plug] || ''}
              onChange={(e) => handlePlugChange(plug, e.target.value)}
              maxLength={1}
              pattern="[A-Z]"
            />
          </div>
        ))}
      </div>
      <p>Configurez 3 paires de lettres à échanger avant le chiffrement.</p>
    </div>
  );
};

export default Plugboard;