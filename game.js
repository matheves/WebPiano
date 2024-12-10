class GuitarHeroGame {
    constructor(piano) {
        this.piano = piano;
        this.isPlaying = false;
        this.score = 0;
        this.noteSpeed = 2; // Vitesse de défilement des notes (en secondes)
        this.hitWindow = 300; // Fenêtre de temps pour toucher la note (en ms)
        this.notes = [];
        this.currentSong = null;
        
        // Définition des positions des touches et leurs labels
        this.keyPositions = [
            { note: 'C', x: 0, width: 120, label: 'Q', color: 'white' },
            { note: 'C#', x: 120, width: 80, label: 'Z', color: 'black' },
            { note: 'D', x: 200, width: 120, label: 'S', color: 'white' },
            { note: 'D#', x: 320, width: 80, label: 'E', color: 'black' },
            { note: 'E', x: 400, width: 120, label: 'D', color: 'white' },
            { note: 'F', x: 520, width: 120, label: 'F', color: 'white' },
            { note: 'F#', x: 640, width: 80, label: 'R', color: 'black' },
            { note: 'G', x: 720, width: 120, label: 'G', color: 'white' },
            { note: 'G#', x: 840, width: 80, label: 'T', color: 'black' },
            { note: 'A', x: 920, width: 120, label: 'H', color: 'white' },
            { note: 'A#', x: 1040, width: 80, label: 'Y', color: 'black' },
            { note: 'B', x: 1120, width: 120, label: 'J', color: 'white' }
        ];
        
        // Chansons disponibles
        this.songs = {
            'doReMi': [
                { note: 'C', time: 0 },
                { note: 'D', time: 1000 },
                { note: 'E', time: 2000 },
                { note: 'F', time: 3000 },
                { note: 'G', time: 4000 },
                { note: 'A', time: 5000 },
                { note: 'B', time: 6000 },
                { note: 'C', time: 7000 }
            ],
            'furElise': [
                { note: 'E', time: 0 },
                { note: 'D#', time: 500 },
                { note: 'E', time: 1000 },
                { note: 'D#', time: 1500 },
                { note: 'E', time: 2000 },
                { note: 'B', time: 2500 },
                { note: 'D', time: 3000 },
                { note: 'C', time: 3500 },
                { note: 'A', time: 4000 },
                { note: 'C', time: 5000 },
                { note: 'E', time: 5500 },
                { note: 'A', time: 6000 },
                { note: 'B', time: 6500 },
                { note: 'E', time: 7500 },
                { note: 'G#', time: 8000 },
                { note: 'B', time: 8500 },
                { note: 'C', time: 9000 }
            ],
            'jingleBells': [
                { note: 'E', time: 0 },
                { note: 'E', time: 500 },
                { note: 'E', time: 1000 },
                { note: 'E', time: 1500 },
                { note: 'E', time: 2000 },
                { note: 'E', time: 2500 },
                { note: 'E', time: 3000 },
                { note: 'G', time: 3500 },
                { note: 'C', time: 4000 },
                { note: 'D', time: 4500 },
                { note: 'E', time: 5000 },
                { note: 'F', time: 6000 },
                { note: 'F', time: 6500 },
                { note: 'F', time: 7000 },
                { note: 'F', time: 7500 },
                { note: 'F', time: 8000 },
                { note: 'E', time: 8500 },
                { note: 'E', time: 9000 },
                { note: 'E', time: 9500 },
                { note: 'E', time: 10000 },
                { note: 'D', time: 10500 },
                { note: 'D', time: 11000 },
                { note: 'E', time: 11500 },
                { note: 'D', time: 12000 },
                { note: 'G', time: 12500 }
            ],
            'canonInD': [
                { note: 'D', time: 0 },
                { note: 'A', time: 500 },
                { note: 'B', time: 1000 },
                { note: 'F#', time: 1500 },
                { note: 'G', time: 2000 },
                { note: 'D', time: 2500 },
                { note: 'G', time: 3000 },
                { note: 'A', time: 3500 },
                { note: 'D', time: 4000 },
                { note: 'A', time: 4500 },
                { note: 'B', time: 5000 },
                { note: 'F#', time: 5500 },
                { note: 'G', time: 6000 },
                { note: 'D', time: 6500 },
                { note: 'G', time: 7000 },
                { note: 'A', time: 7500 },
                { note: 'D', time: 8000 },
                { note: 'A', time: 8500 },
                { note: 'B', time: 9000 },
                { note: 'F#', time: 9500 },
                { note: 'G', time: 10000 },
                { note: 'D', time: 10500 },
                { note: 'G', time: 11000 },
                { note: 'A', time: 11500 }
            ],
            'canonInDHard': [
                // Thème principal rapide
                { note: 'D', time: 0 },
                { note: 'F#', time: 200 },
                { note: 'A', time: 400 },
                { note: 'D', time: 600 },
                { note: 'C#', time: 800 },
                { note: 'B', time: 1000 },
                { note: 'A', time: 1200 },
                { note: 'G', time: 1400 },
                
                // Variation avec des triolets
                { note: 'F#', time: 1600 },
                { note: 'A', time: 1700 },
                { note: 'D', time: 1800 },
                { note: 'F#', time: 1900 },
                { note: 'A', time: 2000 },
                { note: 'D', time: 2100 },
                
                // Passage rapide descendant
                { note: 'B', time: 2300 },
                { note: 'A', time: 2400 },
                { note: 'G', time: 2500 },
                { note: 'F#', time: 2600 },
                { note: 'E', time: 2700 },
                { note: 'D', time: 2800 },
                
                // Motif complexe
                { note: 'A', time: 3000 },
                { note: 'E', time: 3100 },
                { note: 'A', time: 3200 },
                { note: 'C#', time: 3300 },
                { note: 'E', time: 3400 },
                { note: 'A', time: 3500 },
                
                // Séquence rapide alternée
                { note: 'D', time: 3700 },
                { note: 'F#', time: 3800 },
                { note: 'D', time: 3900 },
                { note: 'A', time: 4000 },
                { note: 'F#', time: 4100 },
                { note: 'D', time: 4200 },
                
                // Passage chromatique
                { note: 'G#', time: 4400 },
                { note: 'A', time: 4500 },
                { note: 'A#', time: 4600 },
                { note: 'B', time: 4700 },
                
                // Arpèges rapides
                { note: 'D', time: 4900 },
                { note: 'F#', time: 5000 },
                { note: 'A', time: 5100 },
                { note: 'D', time: 5200 },
                { note: 'F#', time: 5300 },
                { note: 'A', time: 5400 },
                
                // Final complexe
                { note: 'B', time: 5600 },
                { note: 'G', time: 5700 },
                { note: 'E', time: 5800 },
                { note: 'C#', time: 5900 },
                { note: 'A', time: 6000 },
                { note: 'F#', time: 6100 },
                { note: 'D', time: 6200 },
                { note: 'B', time: 6300 },
                { note: 'G', time: 6400 },
                { note: 'E', time: 6500 },
                { note: 'C#', time: 6600 },
                { note: 'A', time: 6700 },
                
                // Finale
                { note: 'D', time: 6900 },
                { note: 'A', time: 7000 },
                { note: 'F#', time: 7100 },
                { note: 'D', time: 7200 }
]
        };

        this.init();
    }

    init() {
        this.createGameInterface();
        this.setupEventListeners();
    }

    createGameInterface() {
        const gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';
        
        const songSelect = document.createElement('select');
        songSelect.id = 'song-select';
        Object.keys(this.songs).forEach(song => {
            const option = document.createElement('option');
            option.value = song;
            option.textContent = song;
            songSelect.appendChild(option);
        });

        const startButton = document.createElement('button');
        startButton.id = 'start-game';
        startButton.textContent = 'Démarrer le jeu';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.textContent = 'Score: 0';

        const noteCanvas = document.createElement('canvas');
        noteCanvas.id = 'note-canvas';
        noteCanvas.width = 1240; // Largeur augmentée pour accommoder toutes les touches
        noteCanvas.height = 600; // Hauteur augmentée pour une meilleure visibilité

        gameContainer.appendChild(songSelect);
        gameContainer.appendChild(startButton);
        gameContainer.appendChild(scoreDisplay);
        gameContainer.appendChild(noteCanvas);

        document.querySelector('.container').insertBefore(
            gameContainer,
            document.getElementById('piano')
        );
    }

    setupEventListeners() {
        const startButton = document.getElementById('start-game');
        startButton.addEventListener('click', () => this.startGame());

        document.addEventListener('keydown', (e) => {
            if (this.isPlaying) {
                this.checkNoteHit(e.key.toUpperCase());
            }
        });
    }

    startGame() {
        const songSelect = document.getElementById('song-select');
        const selectedSong = songSelect.value;
        
        this.isPlaying = true;
        this.score = 0;
        this.updateScore();
        
        const startTime = Date.now();
        this.currentSong = this.songs[selectedSong].map(note => ({
            ...note,
            time: startTime + note.time + 3000 // 3 secondes de délai pour mieux anticiper
        }));
        
        this.startNoteAnimation();
    }

    startNoteAnimation() {
        const canvas = document.getElementById('note-canvas');
        const ctx = canvas.getContext('2d');
        
        const animate = () => {
            if (!this.isPlaying) {
                this.piano.cleanupAllSounds();
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.drawKeyColumns(ctx, canvas);
            this.drawHitZone(ctx, canvas);
            this.drawHitLine(ctx, canvas);
            this.drawKeyLabels(ctx, canvas);
            
            this.currentSong.forEach((note) => {
                const keyInfo = this.keyPositions.find(k => k.note === note.note);
                if (!keyInfo) return;
                
                const timeUntilHit = note.time - Date.now();
                const y = canvas.height - 100 - (timeUntilHit * (canvas.height / (this.noteSpeed * 1000)));
                
                // Dessiner la note avec la couleur correspondante
                ctx.fillStyle = keyInfo.color === 'black' ? '#666' : '#4CAF50';
                const noteWidth = keyInfo.width * 0.8; // Note légèrement plus étroite que la colonne
                const noteX = keyInfo.x + (keyInfo.width - noteWidth) / 2;
                ctx.fillRect(noteX, y, noteWidth, 20);
            });

            // Supprimer les notes manquées
            this.currentSong = this.currentSong.filter(note => 
                note.time > Date.now() - this.hitWindow
            );

            if (this.currentSong.length === 0) {
                this.endGame();
            } else {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    drawHitZone(ctx, canvas) {
        // Dessiner la zone de frappe plus haut
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        const zoneHeight = 40;
        const zoneY = canvas.height - 120; // Déplacé plus haut
        ctx.fillRect(0, zoneY, canvas.width, zoneHeight);
        
        // Ajouter des bordures à la zone
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, zoneY, canvas.width, zoneHeight);
    }

    drawHitLine(ctx, canvas) {
        // Dessiner la ligne de jauge plus haut
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 100); // Déplacé plus haut
        ctx.lineTo(canvas.width, canvas.height - 100);
        ctx.stroke();
    }

    drawKeyColumns(ctx, canvas) {
        // Dessiner les colonnes des touches
        this.keyPositions.forEach(keyInfo => {
            // Dessiner la colonne avec la couleur appropriée
            ctx.fillStyle = keyInfo.color === 'black' 
                ? 'rgba(100, 100, 100, 0.7)' 
                : 'rgba(240, 240, 240, 0.7)';
            ctx.fillRect(keyInfo.x, 0, keyInfo.width, canvas.height);
            
            // Dessiner la bordure
            ctx.strokeStyle = '#ddd';
            ctx.beginPath();
            ctx.moveTo(keyInfo.x, 0);
            ctx.lineTo(keyInfo.x, canvas.height);
            ctx.stroke();
        });
    }

    drawKeyLabels(ctx, canvas) {
        this.keyPositions.forEach(keyInfo => {
            // Couleur du texte basée sur la couleur de la touche
            ctx.fillStyle = keyInfo.color === 'black' ? '#fff' : '#666';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            
            // Position du texte centrée dans la touche
            const textX = keyInfo.x + keyInfo.width/2;
            ctx.fillText(keyInfo.label, textX, canvas.height - 40);
            
            // Ajouter le nom de la note en dessous
            ctx.font = '14px Arial';
            ctx.fillText(keyInfo.note, textX, canvas.height - 20);
        });
    }

    getNoteXPosition(note) {
        const keyInfo = this.keyPositions.find(k => k.note === note);
        return keyInfo ? keyInfo.x : 0;
    }

    checkNoteHit(key) {
        if (!this.piano.notes.has(key)) return;

        const noteHit = this.piano.notes.get(key);
        const currentTime = Date.now();

        const hitNote = this.currentSong.find(note => {
            const timeDiff = Math.abs(currentTime - note.time);
            return note.note === noteHit && timeDiff < this.hitWindow;
        });

        if (hitNote) {
            this.score += this.calculatePoints(Math.abs(currentTime - hitNote.time));
            this.updateScore();
            this.currentSong = this.currentSong.filter(note => note !== hitNote);

            if (this.currentSong.length === 0) {
                setTimeout(() => {
                    const keyElement = this.piano.findKeyElement(noteHit);
                    if (keyElement) {
                        this.piano.stopNote(keyElement);
                    }
                }, 300);
            }
        }
    }

    calculatePoints(timeDiff) {
        if (timeDiff < 50) return 100;
        if (timeDiff < 100) return 75;
        if (timeDiff < 200) return 50;
        return 25;
    }

    updateScore() {
        document.getElementById('score-display').textContent = `Score: ${this.score}`;
    }

    endGame() {
        this.isPlaying = false;
        
        if (this.piano && this.piano.activeOscillators.size > 0) {
            this.piano.cleanupAllSounds();
        }
        
        alert(`Jeu terminé ! Score final : ${this.score}`);
    }
} 