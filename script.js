class Piano {
    constructor() {
        this.notes = new Map([
            ['Q', 'C'], ['Z', 'C#'], ['S', 'D'], ['E', 'D#'],
            ['D', 'E'], ['F', 'F'], ['R', 'F#'], ['G', 'G'],
            ['T', 'G#'], ['H', 'A'], ['Y', 'A#'], ['J', 'B']
        ]);
        
        this.keyElements = document.querySelectorAll('.key');
        this.noteDisplay = document.getElementById('note-display');
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // ADSR amélioré pour un son plus naturel
        this.adsr = {
            attack: 0.02,    // Attaque plus progressive
            decay: 0.15,     // Déclin plus naturel
            sustain: 0.7,    // Niveau de sustain plus élevé
            release: 0.3     // Release progressif
        };

        // Harmoniques plus riches
        this.harmonics = [
            { frequency: 1, gain: 0.6 },     // Fondamentale
            { frequency: 2, gain: 0.2 },     // Première harmonique
            { frequency: 3, gain: 0.1 },     // Deuxième harmonique
            { frequency: 4, gain: 0.05 },    // Troisième harmonique
            { frequency: 5, gain: 0.025 }    // Quatrième harmonique
        ];

        this.frequencies = new Map([
            ['C', 261.63], ['C#', 277.18],
            ['D', 293.66], ['D#', 311.13],
            ['E', 329.63], ['F', 349.23],
            ['F#', 369.99], ['G', 392.00],
            ['G#', 415.30], ['A', 440.00],
            ['A#', 466.16], ['B', 493.88]
        ]);

        this.pressedKeys = new Set();
        this.activeOscillators = new Map();
        this.noteTimeouts = new Map();
        
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

    createPianoSound(frequency, velocity = 0.7) {
        const masterGain = this.audioContext.createGain();
        const oscillators = [];
        const now = this.audioContext.currentTime;

        // Création du filtre principal
        const mainFilter = this.audioContext.createBiquadFilter();
        mainFilter.type = 'lowpass';
        mainFilter.frequency.setValueAtTime(5000, now);
        mainFilter.Q.setValueAtTime(1, now);

        // Ajout d'un compresseur pour un son plus équilibré
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, now);
        compressor.knee.setValueAtTime(30, now);
        compressor.ratio.setValueAtTime(12, now);
        compressor.attack.setValueAtTime(0.003, now);
        compressor.release.setValueAtTime(0.25, now);

        this.harmonics.forEach(harmonic => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(
                frequency * harmonic.frequency,
                now
            );

            // Ajustement du gain en fonction de la vélocité
            const harmonicGain = harmonic.gain * velocity;
            gainNode.gain.setValueAtTime(harmonicGain, now);

            oscillator.connect(gainNode);
            gainNode.connect(masterGain);
            
            oscillators.push({ oscillator, gainNode });
        });

        // Chaîne de traitement du son
        masterGain.connect(mainFilter);
        mainFilter.connect(compressor);
        compressor.connect(this.audioContext.destination);

        return { masterGain, oscillators, mainFilter, compressor };
    }

    playNote(note, velocity = 0.7) {
        this.noteDisplay.textContent = `Note: ${note}`;
        this.activateKey(note);

        // Si la note est déjà active, on la nettoie d'abord
        if (this.activeOscillators.has(note)) {
            this.cleanupNote(note);
        }

        const frequency = this.frequencies.get(note);
        const { masterGain, oscillators, mainFilter, compressor } = this.createPianoSound(frequency, velocity);

        const now = this.audioContext.currentTime;
        
        // Enveloppe ADSR améliorée
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(velocity, now + this.adsr.attack);
        masterGain.gain.linearRampToValueAtTime(
            velocity * this.adsr.sustain,
            now + this.adsr.attack + this.adsr.decay
        );

        // Ajustement du filtre en fonction de la vélocité
        const filterFreq = 2000 + (velocity * 6000);
        mainFilter.frequency.setValueAtTime(filterFreq, now);

        oscillators.forEach(({ oscillator }) => oscillator.start(now));

        this.activeOscillators.set(note, {
            oscillators,
            masterGain,
            mainFilter,
            compressor,
            startTime: now,
            velocity
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
        this.noteTimeouts.forEach(timeout => clearTimeout(timeout));
        this.noteTimeouts.clear();

        this.activeOscillators.forEach((_, note) => {
            this.cleanupNote(note);
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
        const { masterGain, velocity } = sound;

        // Release progressif
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0, now + this.adsr.release);

        // Nettoyage différé
        const timeout = setTimeout(() => {
            if (!this.pressedKeys.has(note)) {
                this.cleanupNote(note);
                keyElement.classList.remove('active');
            }
        }, this.adsr.release * 1000);

        this.noteTimeouts.set(note, timeout);
    }

    cleanupNote(note) {
        // Nettoyage du timeout existant
        if (this.noteTimeouts.has(note)) {
            clearTimeout(this.noteTimeouts.get(note));
            this.noteTimeouts.delete(note);
        }

        const sound = this.activeOscillators.get(note);
        if (sound) {
            const { oscillators, masterGain, mainFilter, compressor } = sound;
            
            oscillators.forEach(({ oscillator, gainNode }) => {
                try {
                    oscillator.stop();
                    oscillator.disconnect();
                    gainNode.disconnect();
                } catch (e) {
                    console.log('Oscillator cleanup error:', e);
                }
            });

            masterGain.disconnect();
            mainFilter.disconnect();
            compressor.disconnect();
            
            this.activeOscillators.delete(note);
        }
    }
}

// Initialisation du piano
document.addEventListener('DOMContentLoaded', () => {
    const piano = new Piano();
}); 