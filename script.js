class Piano {
    constructor() {
        // Simplified note mapping
        this.notes = new Map([
            ['Q', 'C'], ['Z', 'C#'], ['S', 'D'], ['E', 'D#'],
            ['D', 'E'], ['F', 'F'], ['R', 'F#'], ['G', 'G'],
            ['T', 'G#'], ['H', 'A'], ['Y', 'A#'], ['J', 'B']
        ]);
        
        // Enhanced ADSR for better sound
        this.adsr = {
            attack: 0.015,
            decay: 0.1,
            sustain: 0.8,
            release: 0.3
        };

        // Optimized harmonics for richer sound
        this.harmonics = [
            { frequency: 1, gain: 0.7 },    // Fundamental
            { frequency: 2, gain: 0.25 },   // 2nd harmonic
            { frequency: 3, gain: 0.15 },   // 3rd harmonic
            { frequency: 4, gain: 0.075 }   // 4th harmonic
        ];

        this.frequencies = new Map([
            ['C', 261.63], ['C#', 277.18],
            ['D', 293.66], ['D#', 311.13],
            ['E', 329.63], ['F', 349.23],
            ['F#', 369.99], ['G', 392.00],
            ['G#', 415.30], ['A', 440.00],
            ['A#', 466.16], ['B', 493.88]
        ]);

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterCompressor = this.createMasterCompressor();
        this.activeOscillators = new Map();
        this.pressedKeys = new Set();
        
        this.setupDOM();
        this.setupListeners();
    }

    setupDOM() {
        this.keyElements = document.querySelectorAll('.key');
        this.noteDisplay = document.getElementById('note-display');
    }

    setupListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            const key = e.key.toUpperCase();
            if (this.notes.has(key)) {
                this.playNote(this.notes.get(key));
                this.pressedKeys.add(key);
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toUpperCase();
            if (this.notes.has(key)) {
                this.pressedKeys.delete(key);
                this.stopNote(this.notes.get(key));
            }
        });

        // Mouse events
        this.keyElements.forEach(key => {
            key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
            key.addEventListener('mouseup', () => this.stopNote(key.dataset.note));
        });

        // Auto-resume AudioContext
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });

        window.addEventListener('blur', () => this.stopAllNotes());
    }

    createMasterCompressor() {
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
        compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
        compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
        compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
        compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
        compressor.connect(this.audioContext.destination);
        return compressor;
    }

    playNote(note, velocity = 0.8) {
        if (this.activeOscillators.has(note)) {
            this.stopNote(note);
        }

        const now = this.audioContext.currentTime;
        const frequency = this.frequencies.get(note);
        const masterGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Enhanced filter settings
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000 + (velocity * 6000), now);
        filter.Q.setValueAtTime(1.5, now);

        // Create and connect oscillators
        const oscillators = this.harmonics.map(({ frequency: freq, gain }) => {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency * freq, now);
            gainNode.gain.setValueAtTime(gain * velocity, now);
            
            osc.connect(gainNode);
            gainNode.connect(filter);
            osc.start(now);
            
            return { oscillator: osc, gainNode };
        });

        // Connect audio chain
        filter.connect(masterGain);
        masterGain.connect(this.masterCompressor);

        // Apply ADSR
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(velocity, now + this.adsr.attack);
        masterGain.gain.linearRampToValueAtTime(
            velocity * this.adsr.sustain,
            now + this.adsr.attack + this.adsr.decay
        );

        this.activeOscillators.set(note, { oscillators, masterGain, filter });
        this.updateUI(note, true);
    }

    stopNote(note) {
        const sound = this.activeOscillators.get(note);
        if (!sound) return;

        const now = this.audioContext.currentTime;
        const { oscillators, masterGain } = sound;

        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.linearRampToValueAtTime(0, now + this.adsr.release);

        setTimeout(() => {
            oscillators.forEach(({ oscillator, gainNode }) => {
                oscillator.stop();
                oscillator.disconnect();
                gainNode.disconnect();
            });
            masterGain.disconnect();
            this.activeOscillators.delete(note);
            this.updateUI(note, false);
        }, this.adsr.release * 1000);
    }

    stopAllNotes() {
        Array.from(this.activeOscillators.keys()).forEach(note => this.stopNote(note));
        this.pressedKeys.clear();
    }

    updateUI(note, isActive) {
        const keyElement = Array.from(this.keyElements)
            .find(key => key.dataset.note === note);
        if (keyElement) {
            keyElement.classList.toggle('active', isActive);
        }
        this.noteDisplay.textContent = isActive ? `Note: ${note}` : '';
    }
}

document.addEventListener('DOMContentLoaded', () => new Piano()); 