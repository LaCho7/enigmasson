// Configuration des rotors de la machine Enigma
export const rotorConfigs = {
  'I': { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  'II': { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  'III': { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  'IV': { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  'V': { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' }
};

// Réflecteur
export const reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

// Alphabet
export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// État de la machine Enigma
export class EnigmaMachine {
  constructor() {
    this.rotor1Pos = 0;
    this.rotor2Pos = 0;
    this.rotor3Pos = 0;
    this.rotor1Type = 'I';
    this.rotor2Type = 'II';
    this.rotor3Type = 'III';
    this.plugboard = {};
    this.initialRotor1Pos = 0;
    this.initialRotor2Pos = 0;
    this.initialRotor3Pos = 0;
  }

  // Définir la position des rotors
  setRotorPositions(pos1, pos2, pos3) {
    this.rotor1Pos = pos1;
    this.rotor2Pos = pos2;
    this.rotor3Pos = pos3;
    this.initialRotor1Pos = pos1;
    this.initialRotor2Pos = pos2;
    this.initialRotor3Pos = pos3;
  }

  // Définir le type des rotors
  setRotorTypes(type1, type2, type3) {
    this.rotor1Type = type1;
    this.rotor2Type = type2;
    this.rotor3Type = type3;
  }

  // Définir le tableau de connexion
  setPlugboard(plugboard) {
    this.plugboard = plugboard;
  }

  // Réinitialiser les rotors à leur position initiale
  resetRotors() {
    this.rotor1Pos = this.initialRotor1Pos;
    this.rotor2Pos = this.initialRotor2Pos;
    this.rotor3Pos = this.initialRotor3Pos;
  }

  // Faire tourner les rotors
  stepRotors() {
    // Le rotor 3 tourne à chaque pression de touche
    this.rotor3Pos = (this.rotor3Pos + 1) % 26;

    // Vérifier si le rotor 3 a atteint sa position de encoche
    const rotor3Notch = rotorConfigs[this.rotor3Type].notch;
    if (alphabet[this.rotor3Pos] === rotor3Notch) {
      // Faire tourner le rotor 2
      this.rotor2Pos = (this.rotor2Pos + 1) % 26;

      // Vérifier si le rotor 2 a atteint sa position de encoche
      const rotor2Notch = rotorConfigs[this.rotor2Type].notch;
      if (alphabet[this.rotor2Pos] === rotor2Notch) {
        // Faire tourner le rotor 1
        this.rotor1Pos = (this.rotor1Pos + 1) % 26;
      }
    }
  }

  // Passer à travers le tableau de connexion
  passThroughPlugboard(char) {
    if (this.plugboard[char]) {
      return this.plugboard[char];
    }
    // Vérifier si le caractère est la deuxième partie d'une paire
    for (const key in this.plugboard) {
      if (this.plugboard[key] === char) {
        return key;
      }
    }
    return char;
  }

  // Passer à travers un rotor (avant)
  passThroughRotorForward(char, rotorType, rotorPos) {
    const wiring = rotorConfigs[rotorType].wiring;
    const charIndex = alphabet.indexOf(char);
    const shiftedIndex = (charIndex + rotorPos) % 26;
    const wiredChar = wiring[shiftedIndex];
    const resultIndex = (alphabet.indexOf(wiredChar) - rotorPos + 26) % 26;
    return alphabet[resultIndex];
  }

  // Passer à travers un rotor (arrière)
  passThroughRotorBackward(char, rotorType, rotorPos) {
    const wiring = rotorConfigs[rotorType].wiring;
    const charIndex = alphabet.indexOf(char);
    const shiftedIndex = (charIndex + rotorPos) % 26;
    
    // Trouver l'index dans le câblage qui correspond au caractère
    let wiredIndex = -1;
    for (let i = 0; i < 26; i++) {
      if (wiring[i] === alphabet[shiftedIndex]) {
        wiredIndex = i;
        break;
      }
    }
    
    const resultIndex = (wiredIndex - rotorPos + 26) % 26;
    return alphabet[resultIndex];
  }

  // Passer à travers le réflecteur
  passThroughReflector(char) {
    const charIndex = alphabet.indexOf(char);
    return reflector[charIndex];
  }

  // Chiffrer un caractère
  encryptChar(char) {
    // Faire tourner les rotors
    this.stepRotors();

    // Passer à travers le tableau de connexion
    let result = this.passThroughPlugboard(char);

    // Passer à travers les rotors (avant)
    result = this.passThroughRotorForward(result, this.rotor3Type, this.rotor3Pos);
    result = this.passThroughRotorForward(result, this.rotor2Type, this.rotor2Pos);
    result = this.passThroughRotorForward(result, this.rotor1Type, this.rotor1Pos);

    // Passer à travers le réflecteur
    result = this.passThroughReflector(result);

    // Passer à travers les rotors (arrière)
    result = this.passThroughRotorBackward(result, this.rotor1Type, this.rotor1Pos);
    result = this.passThroughRotorBackward(result, this.rotor2Type, this.rotor2Pos);
    result = this.passThroughRotorBackward(result, this.rotor3Type, this.rotor3Pos);

    // Passer à travers le tableau de connexion à nouveau
    result = this.passThroughPlugboard(result);

    return result;
  }

  // Chiffrer un message
  encrypt(message) {
    // Réinitialiser les rotors à leur position initiale avant de commencer
    this.resetRotors();
    
    let result = '';
    for (let i = 0; i < message.length; i++) {
      const char = message[i].toUpperCase();
      if (alphabet.includes(char)) {
        result += this.encryptChar(char);
      } else {
        result += char; // Conserver les caractères non alphabétiques
      }
    }
    return result;
  }
}