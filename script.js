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
        
        // Paramètres ADSR ajustés pour un son plus naturel
        this.adsr = {
            attack: 0.005,  // Plus rapide pour une réponse immédiate
            decay: 0.1,     // Déclin rapide
            sustain: 0.3,   // Niveau de sustain plus bas
            release: 0.3    // Release plus court
        };

        // Harmoniques ajustées pour un son plus riche
        this.harmonics = [
            { frequency: 1, gain: 0.7 },    // Fondamentale
            { frequency: 2, gain: 0.15 },   // Première harmonique
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

        this.pressedKeys = new Set();
        this.activeOscillators = new Map();
        this.velocities = new Map(); // Pour stocker la vélocité des notes
        
        // Mise en place des écouteurs d'événements clavier
        this.setupKeyboardListeners();
        
        this.init();
    }

    init() {
        // Gestion des clics sur les touches
        this.keyElements.forEach(key => {
            key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
            key.addEventListener('mouseup', () => this.stopNote(key));
        });

        // Ajout de l'initialisation du contexte audio au premier clic
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            
            const key = e.key.toUpperCase();
            if (!this.notes.has(key)) return;

            const note = this.notes.get(key);
            
            // Si la note est déjà active, on la redéclenche
            if (this.activeOscillators.has(note)) {
                this.retrigerNote(note);
            } else {
                this.playNote(note);
            }
            
            this.pressedKeys.add(key);
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toUpperCase();
            if (!this.notes.has(key)) return;

            this.pressedKeys.delete(key);
            const note = this.notes.get(key);
            const keyElement = this.findKeyElement(note);
            
            if (keyElement) {
                this.releaseNote(note, keyElement);
            }
        });

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

    playNote(note) {
        this.noteDisplay.textContent = `Note: ${note}`;
        this.activateKey(note);

        const frequency = this.frequencies.get(note);
        const { masterGain, oscillators } = this.createPianoSound(frequency);

        const now = this.audioContext.currentTime;
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(1, now + this.adsr.attack);
        masterGain.gain.linearRampToValueAtTime(
            this.adsr.sustain,
            now + this.adsr.attack + this.adsr.decay
        );

        // Connexion au contexte audio avec filtre
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5000, now);
        filter.Q.setValueAtTime(1, now);

        masterGain.connect(filter);
        filter.connect(this.audioContext.destination);

        oscillators.forEach(({ oscillator }) => oscillator.start());

        this.activeOscillators.set(note, { 
            oscillators, 
            masterGain,
            filter,
            startTime: now
        });
    }

    stopNote(keyElement) {
        if (keyElement) {
            const note = keyElement.dataset.note;
            if (!this.pressedKeys.has(note)) {
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
                        this.activeOscillators.delete(note);
                    }
                }
                
                keyElement.classList.remove('active');
            }
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

    forceStopNote(note) {
        const sound = this.activeOscillators.get(note);
        if (sound) {
            const { oscillators, masterGain, filter } = sound;
            
            // Arrêt immédiat du son
            oscillators.forEach(({ oscillator }) => {
                try {
                    oscillator.stop();
                    oscillator.disconnect();
                } catch (e) {
                    console.log('Oscillator already stopped');
                }
            });

            if (masterGain) masterGain.disconnect();
            if (filter) filter.disconnect();
            
            this.activeOscillators.delete(note);
        }

        const keyElement = this.findKeyElement(note);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }

    cleanupAllSounds() {
        // Nettoie tous les timeouts
        this.noteTimeouts.forEach((timeout) => clearTimeout(timeout));
        this.noteTimeouts.clear();

        // Arrête tous les sons actifs
        this.activeOscillators.forEach((_, note) => {
            this.forceStopNote(note);
        });
        
        this.pressedKeys.clear();
        this.activeOscillators.clear();
        
        this.keyElements.forEach(key => {
            key.classList.remove('active');
        });
    }

    retrigerNote(note) {
        const sound = this.activeOscillators.get(note);
        if (!sound) return;

        const now = this.audioContext.currentTime;
        const { masterGain } = sound;

        // Réinitialisation rapide du gain pour simuler une nouvelle frappe
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(1, now + 0.005);
        masterGain.gain.linearRampToValueAtTime(
            this.adsr.sustain,
            now + this.adsr.attack + this.adsr.decay
        );
    }

    releaseNote(note, keyElement) {
        const sound = this.activeOscillators.get(note);
        if (!sound) return;

        const now = this.audioContext.currentTime;
        const { masterGain } = sound;

        // Application d'un release naturel
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0, now + this.adsr.release);

        // Nettoyage après le release
        setTimeout(() => {
            if (!this.pressedKeys.has(note)) {
                this.cleanupNote(note);
                keyElement.classList.remove('active');
            }
        }, this.adsr.release * 1000);
    }

    cleanupNote(note) {
        const sound = this.activeOscillators.get(note);
        if (sound) {
            const { oscillators, masterGain, filter } = sound;
            oscillators.forEach(({ oscillator }) => {
                oscillator.stop();
                oscillator.disconnect();
            });
            if (masterGain) masterGain.disconnect();
            if (filter) filter.disconnect();
            this.activeOscillators.delete(note);
        }
    }
}

// Initialisation du piano
document.addEventListener('DOMContentLoaded', () => {
    const piano = new Piano();
}); 