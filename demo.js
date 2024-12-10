class PianoDemo {
    constructor(piano, game) {
        this.piano = piano;
        this.game = game;
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        this.noteTimeouts = new Set();
        this.selectedSong = 'canonInDHard'; // Chanson par défaut
        
        this.init();
    }

    init() {
        this.createDemoInterface();
        this.setupEventListeners();
    }

    createDemoInterface() {
        const demoContainer = document.createElement('div');
        demoContainer.id = 'demo-container';
        demoContainer.style.margin = '10px';

        // Création du sélecteur de chanson
        const songSelect = document.createElement('select');
        songSelect.id = 'demo-song-select';
        songSelect.style.marginRight = '10px';
        songSelect.style.padding = '5px';

        // Ajout des options basées sur les chansons disponibles
        for (const songName in this.game.songs) {
            const option = document.createElement('option');
            option.value = songName;
            option.textContent = this.formatSongName(songName);
            songSelect.appendChild(option);
        }

        const startButton = document.createElement('button');
        startButton.id = 'start-demo';
        startButton.textContent = 'Démarrer la démo';
        startButton.style.marginRight = '10px';

        const stopButton = document.createElement('button');
        stopButton.id = 'stop-demo';
        stopButton.textContent = 'Arrêter la démo';
        stopButton.disabled = true;

        demoContainer.appendChild(songSelect);
        demoContainer.appendChild(startButton);
        demoContainer.appendChild(stopButton);

        document.querySelector('.container').insertBefore(
            demoContainer,
            document.getElementById('piano')
        );
    }

    formatSongName(songName) {
        // Convertit camelCase en texte lisible
        return songName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    setupEventListeners() {
        const startButton = document.getElementById('start-demo');
        const stopButton = document.getElementById('stop-demo');
        const songSelect = document.getElementById('demo-song-select');

        songSelect.addEventListener('change', (e) => {
            this.selectedSong = e.target.value;
        });

        startButton.addEventListener('click', () => {
            startButton.disabled = true;
            stopButton.disabled = false;
            songSelect.disabled = true;
            this.startDemo();
        });

        stopButton.addEventListener('click', () => {
            startButton.disabled = false;
            stopButton.disabled = true;
            songSelect.disabled = false;
            this.stopDemo();
        });
    }

    startDemo() {
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        this.playSelectedSong();
    }

    stopDemo() {
        this.isPlaying = false;
        this.noteTimeouts.forEach(timeout => clearTimeout(timeout));
        this.noteTimeouts.clear();
        this.piano.cleanupAllSounds();
    }

    playSelectedSong() {
        const song = this.game.songs[this.selectedSong];
        let lastTime = 0;

        song.forEach((note, index) => {
            if (!this.isPlaying) return;

            const timeout = setTimeout(() => {
                if (this.isPlaying) {
                    this.piano.playNote(note.note);
                    
                    const releaseTimeout = setTimeout(() => {
                        if (this.isPlaying) {
                            const keyElement = this.piano.findKeyElement(note.note);
                            if (keyElement) {
                                this.piano.stopNote(keyElement);
                            }
                        }
                    }, 300);

                    this.noteTimeouts.add(releaseTimeout);
                }
            }, note.time);

            this.noteTimeouts.add(timeout);
            lastTime = Math.max(lastTime, note.time);
        });

        setTimeout(() => {
            if (this.isPlaying) {
                this.stopDemo();
                document.getElementById('start-demo').disabled = false;
                document.getElementById('stop-demo').disabled = true;
                document.getElementById('demo-song-select').disabled = false;
            }
        }, lastTime + 500);
    }
} 