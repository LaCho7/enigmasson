import React, { useState, useEffect } from 'react';
import styles from '../styles/EnigmaMachine.module.css';
import { EnigmaMachine, alphabet } from '../utils/enigma';
import Rotor from './Rotor';
import Plugboard from './Plugboard';
import Keyboard from './Keyboard';
import NotificationMessage from './NotificationMessage'; // Import avec le nouveau nom

const EnigmaMachineComponent = () => {
  const [enigma] = useState(() => new EnigmaMachine());
  const [rotorPositions, setRotorPositions] = useState([0, 0, 0]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [plugs, setPlugs] = useState({});
  const [notification, setNotification] = useState({ message: '', isVisible: false });

  useEffect(() => {
    enigma.setRotorPositions(...rotorPositions);
  }, [rotorPositions, enigma]);

  const showNotification = (message) => {
    setNotification({ message, isVisible: true });
  };

  const hideNotification = () => {
    setNotification({ message: '', isVisible: false });
  };

  const updateRotorPosition = (rotorIndex, delta) => {
    const newPositions = [...rotorPositions];
    newPositions[rotorIndex] = (newPositions[rotorIndex] + delta + 26) % 26;
    setRotorPositions(newPositions);
  };

  const handlePlugChange = (plug, value) => {
    if (value === '' || (alphabet.includes(value) && value !== plug)) {
      setPlugs(prev => ({
        ...prev,
        [plug]: value || undefined
      }));
    }
  };

  const setupPlugboard = () => {
    const plugboard = {};
    Object.entries(plugs).forEach(([key, value]) => {
      if (value && alphabet.includes(value)) {
        plugboard[key] = value;
      }
    });
    enigma.setPlugboard(plugboard);
  };

  const handleEncrypt = () => {
    setupPlugboard();
    if (inputText.trim() === '') {
      showNotification('Veuillez entrer un message à chiffrer.');
      return;
    }
    const encrypted = enigma.encrypt(inputText);
    setOutputText(encrypted);
    showNotification('Message chiffré avec succès!');
  };

  const handleDecrypt = () => {
    setupPlugboard();
    if (inputText.trim() === '') {
      showNotification('Veuillez entrer un message à déchiffrer.');
      return;
    }
    const decrypted = enigma.encrypt(inputText);
    setOutputText(decrypted);
    showNotification('Message déchiffré avec succès!');
  };

  const handleKeyClick = (key) => {
    setInputText(prev => prev + key);
    setupPlugboard();
    const encryptedChar = enigma.encryptChar(key);
    setOutputText(prev => prev + encryptedChar);
    setRotorPositions([enigma.rotor1Pos, enigma.rotor2Pos, enigma.rotor3Pos]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Machine Enigma</h1>
        <p className={styles.subtitle}>Simulation de la machine de chiffrement utilisée pendant la Seconde Guerre mondiale</p>
      </header>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Comment utiliser cette simulation</h3>
        <p>1. Configurez les 3 rotors en ajustant leur position initiale.</p>
        <p>2. Optionnellement, configurez le tableau de connexion (plugboard) pour échanger 3 paires de lettres.</p>
        <p>3. Tapez votre message dans la zone de texte et cliquez sur "Chiffrer" pour le coder.</p>
        <p>4. Pour déchiffrer, collez le message chiffré et cliquez sur "Déchiffrer" avec la même configuration.</p>
      </div>

      <div className={styles.enigmaMachine}>
        <div className={styles.rotorsContainer}>
          <Rotor
            position={rotorPositions[0]}
            onUp={() => updateRotorPosition(0, 1)}
            onDown={() => updateRotorPosition(0, -1)}
            title="Rotor 1 (Gauche)"
            type="I"
          />
          <Rotor
            position={rotorPositions[1]}
            onUp={() => updateRotorPosition(1, 1)}
            onDown={() => updateRotorPosition(1, -1)}
            title="Rotor 2 (Milieu)"
            type="II"
          />
          <Rotor
            position={rotorPositions[2]}
            onUp={() => updateRotorPosition(2, 1)}
            onDown={() => updateRotorPosition(2, -1)}
            title="Rotor 3 (Droite)"
            type="III"
          />
        </div>

        <Plugboard plugs={plugs} onChange={handlePlugChange} />

        <div className={styles.inputOutputSection}>
          <div className={styles.inputSection}>
            <h3 className={styles.sectionTitle}>Message d'entrée</h3>
            <textarea
              className={styles.textarea}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tapez votre message ici..."
            />
          </div>
          <div className={styles.outputSection}>
            <h3 className={styles.sectionTitle}>Message de sortie</h3>
            <textarea
              className={`${styles.textarea} ${styles.outputTextarea}`}
              value={outputText}
              readOnly
              placeholder="Le message chiffré/déchiffré apparaîtra ici..."
            />
          </div>
        </div>

        <div className={styles.controls}>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleEncrypt}>
            Chiffrer
          </button>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleDecrypt}>
            Déchiffrer
          </button>
        </div>

        <Keyboard onKeyClick={handleKeyClick} />
      </div>

      <NotificationMessage  // Utilisation du nouveau nom
        message={notification.message}
        isVisible={notification.isVisible}
        onHide={hideNotification}
      />
    </div>
  );
};

export default EnigmaMachineComponent;