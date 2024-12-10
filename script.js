class Piano {
    constructor() {
        this.notes = new Map([
            ['Q', 'C'], ['Z', 'C#'], ['S', 'D'], ['E', 'D#'],
            ['D', 'E'], ['F', 'F'], ['R', 'F#'], ['G', 'G'],
            ['T', 'G#'], ['H', 'A'], ['Y', 'A#'], ['J', 'B']
        ]);
        
        this.keyElements = document.querySelectorAll('.key');
        this.noteDisplay = document.getElementById('note-display');
        
        // Initialisation du contexte audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Paramètres ADSR (en secondes)
        this.adsr = {
            attack: 0.02,
            decay: 0.2,
            sustain: 0.7,
            release: 0.5
        };

        // Harmoniques pour enrichir le son
        this.harmonics = [
            { frequency: 1, gain: 0.7 },    // Fondamentale
            { frequency: 2, gain: 0.2 },    // Première harmonique
            { frequency: 3, gain: 0.1 },    // Deuxième harmonique
            { frequency: 4, gain: 0.05 }    // Troisième harmonique
        ];

        this.frequencies = new Map([
            ['C', 261.63], ['C#', 277.18],
            ['D', 293.66], ['D#', 311.13],
            ['E', 329.63],
            ['F', 349.23], ['F#', 369.99],
            ['G', 392.00], ['G#', 415.30],
            ['A', 440.00], ['A#', 466.16],
            ['B', 493.88]
        ]);

        // Stockage des oscillateurs actifs
        this.activeOscillators = new Map();
        
        // Ajout d'un Map pour suivre l'état des touches
        this.pressedKeys = new Map();
        
        this.init();
    }

    init() {
        // Gestion des clics sur les touches
        this.keyElements.forEach(key => {
            key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
            key.addEventListener('mouseup', () => this.stopNote(key));
        });

        // Gestion du clavier physique
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            // Éviter la répétition automatique du clavier
            if (e.repeat) return;
            
            if (this.notes.has(key) && !this.pressedKeys.has(key)) {
                const note = this.notes.get(key);
                this.pressedKeys.set(key, true);
                this.playNote(note);
                this.activateKey(note);
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toUpperCase();
            if (this.notes.has(key)) {
                const note = this.notes.get(key);
                this.pressedKeys.delete(key);
                this.stopNote(this.findKeyElement(note));
            }
        });

        // Ajout de l'initialisation du contexte audio au premier clic
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });

        // Ajout d'un gestionnaire pour nettoyer les sons si la fenêtre perd le focus
        window.addEventListener('blur', () => {
            this.cleanupAllSounds();
        });
    }

    createPianoSound(frequency) {
        const masterGain = this.audioContext.createGain();
        const oscillators = [];

        // Création des harmoniques
        this.harmonics.forEach(harmonic => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Configuration de l'oscillateur
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(
                frequency * harmonic.frequency,
                this.audioContext.currentTime
            );

            // Application du gain pour l'harmonique
            gainNode.gain.setValueAtTime(harmonic.gain, this.audioContext.currentTime);

            // Connexion oscillateur -> gain -> master
            oscillator.connect(gainNode);
            gainNode.connect(masterGain);
            
            oscillators.push({ oscillator, gainNode });
        });

        return { masterGain, oscillators };
    }

    applyADSR(gainNode) {
        const now = this.audioContext.currentTime;
        const { attack, decay, sustain, release } = this.adsr;

        gainNode.gain.setValueAtTime(0, now);
        
        // Attack
        gainNode.gain.linearRampToValueAtTime(1, now + attack);
        
        // Decay et Sustain
        gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);

        return gainNode;
    }

    playNote(note) {
        // Nettoyage de l'ancien son si existant
        if (this.activeOscillators.has(note)) {
            const keyElement = this.findKeyElement(note);
            this.stopNote(keyElement);
        }

        this.noteDisplay.textContent = `Note: ${note}`;
        this.activateKey(note);

        const frequency = this.frequencies.get(note);
        const { masterGain, oscillators } = this.createPianoSound(frequency);

        // Application de l'enveloppe ADSR
        this.applyADSR(masterGain);

        // Connexion au contexte audio
        masterGain.connect(this.audioContext.destination);

        // Démarrage de tous les oscillateurs
        oscillators.forEach(({ oscillator }) => oscillator.start());

        // Ajout d'un filtre passe-bas dynamique
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(1, this.audioContext.currentTime);

        // Insertion du filtre dans la chaîne audio
        masterGain.disconnect(this.audioContext.destination);
        masterGain.connect(filter);
        filter.connect(this.audioContext.destination);

        // Stockage des références
        this.activeOscillators.set(note, { 
            oscillators, 
            masterGain,
            filter
        });
    }

    stopNote(keyElement) {
        if (keyElement) {
            const note = keyElement.dataset.note;
            const sound = this.activeOscillators.get(note);
            
            if (sound) {
                const { oscillators, masterGain } = sound;
                const now = this.audioContext.currentTime;
                
                try {
                    // Application du release
                    masterGain.gain.cancelScheduledValues(now);
                    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
                    masterGain.gain.linearRampToValueAtTime(0, now + this.adsr.release);

                    // Arrêt des oscillateurs après le release
                    setTimeout(() => {
                        oscillators.forEach(({ oscillator }) => {
                            try {
                                oscillator.stop();
                                oscillator.disconnect();
                            } catch (e) {
                                console.log('Oscillator already stopped');
                            }
                        });
                        masterGain.disconnect();
                        this.activeOscillators.delete(note);
                    }, this.adsr.release * 1000);
                } catch (e) {
                    console.log('Error stopping note:', e);
                    // Nettoyage forcé en cas d'erreur
                    this.activeOscillators.delete(note);
                }
            }
            
            keyElement.classList.remove('active');
        }
    }

    activateKey(note) {
        const keyElement = this.findKeyElement(note);
        if (keyElement) {
            keyElement.classList.add('active');
        }
    }

    findKeyElement(note) {
        return Array.from(this.keyElements)
            .find(key => key.dataset.note === note);
    }

    // Ajout d'une méthode pour ajuster la brillance du son en fonction de la vélocité
    adjustBrightness(velocity = 0.5) {
        const minFreq = 2000;
        const maxFreq = 8000;
        const filterFreq = minFreq + (velocity * (maxFreq - minFreq));
        
        this.activeOscillators.forEach(({ filter }) => {
            if (filter) {
                filter.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime);
            }
        });
    }

    cleanupAllSounds() {
        // Arrête tous les sons actifs
        this.activeOscillators.forEach((sound, note) => {
            const keyElement = this.findKeyElement(note);
            this.stopNote(keyElement);
        });
        this.pressedKeys.clear();
        this.activeOscillators.clear();
        
        // Réinitialise l'affichage visuel
        this.keyElements.forEach(key => {
            key.classList.remove('active');
        });
    }
}

// Initialisation du piano
document.addEventListener('DOMContentLoaded', () => {
    const piano = new Piano();
}); 