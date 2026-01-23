const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const deviceMenu = document.getElementById('device-menu');
const overlay = document.getElementById('overlay');
const imgLoader = document.getElementById('imageLoader');
const bgm = document.getElementById('bgm');
const gameContainer = document.getElementById('game-container');
const langBtn = document.getElementById('lang-btn');
const musicToggle = document.getElementById('music-toggle');

// Language System
let currentLanguage = 'en'; // en, fr, ar
const languages = {
    en: {
        'text-semester-intro': 'Forod ta3 Semester 1',
        'text-device-select': 'Select Your Device:',
        'text-device-pc': '🖥️ PC / Desktop',
        'text-device-mobile': '📱 Mobile / Tablet',
        'text-semester': 'Forod ta3 Semester 1',
        'text-gender': 'Gender:',
        'text-male': 'Male',
        'text-female': 'Female',
        'text-french': 'Speak French?',
        'text-yes': 'Yes',
        'text-no': 'No',
        'text-photo': 'Student Photo:',
        'text-choose-exam': 'Choose your Exam:',
        'text-retry': 'Retry Exam',
        'text-next': 'Next Exam',
        'text-reset': '🔄 Reset All Progress',
        'text-count-semester': '✅ Count ur Semester Forod',
        'text-count-semester-locked': '🔒 Count ur Semester Forod',
        'text-subjects-passed': 'Subjects Passed:',
        'text-subjects-failed': 'Subjects Failed:',
        'text-go-back': '← Go Back',
        'text-jump': 'JUMP'
    },
    fr: {
        'text-semester-intro': 'Forod ta3 Semestre 1',
        'text-device-select': 'Sélectionnez votre appareil:',
        'text-device-pc': '🖥️ PC / Bureau',
        'text-device-mobile': '📱 Mobile / Tablette',
        'text-semester': 'Forod ta3 Semestre 1',
        'text-gender': 'Sexe:',
        'text-male': 'Homme',
        'text-female': 'Femme',
        'text-french': 'Parlez français?',
        'text-yes': 'Oui',
        'text-no': 'Non',
        'text-photo': 'Photo étudiant:',
        'text-choose-exam': 'Choisissez votre examen:',
        'text-retry': 'Réessayer',
        'text-next': 'Examen suivant',
        'text-reset': '🔄 Réinitialiser tout le progrès',
        'text-count-semester': '✅ Calculez votre moyenne du semestre',
        'text-count-semester-locked': '🔒 Calculez votre moyenne du semestre',
        'text-subjects-passed': 'Matières réussies:',
        'text-subjects-failed': 'Matières échouées:',
        'text-go-back': '← Retour',
        'text-jump': 'SAUTER'
    },
    ar: {
        'text-semester-intro': 'Forod ta3 Semester 1',
        'text-device-select': 'اختر جهازك:',
        'text-device-pc': '🖥️ الكمبيوتر / سطح المكتب',
        'text-device-mobile': '📱 الهاتف / الجهاز اللوحي',
        'text-semester': 'Forod ta3 Semester 1',
        'text-gender': 'الجنس:',
        'text-male': 'ذكر',
        'text-female': 'أنثى',
        'text-french': 'هل تتحدث الفرنسية؟',
        'text-yes': 'نعم',
        'text-no': 'لا',
        'text-photo': 'صورة الطالب:',
        'text-choose-exam': 'اختر امتحانك:',
        'text-retry': 'أعد المحاولة',
        'text-next': 'الامتحان التالي',
        'text-reset': '🔄 إعادة تعيين كل التقدم',
        'text-count-semester': '✅ احسب معدل الفصل الدراسي',
        'text-count-semester-locked': '🔒 احسب معدل الفصل الدراسي',
        'text-subjects-passed': 'المواد الناجحة:',
        'text-subjects-failed': 'المواد الراسبة:',
        'text-go-back': '← رجوع',
        'text-jump': 'قفز'
    }
};

function changeLanguage() {
    const langs = ['en', 'fr', 'ar'];
    const idx = langs.indexOf(currentLanguage);
    currentLanguage = langs[(idx + 1) % 3];
    
    const langLabels = { en: '🌐 EN', fr: '🌐 FR', ar: '🌐 AR' };
    langBtn.textContent = langLabels[currentLanguage];
    
    applyLanguage();
}

function updateStatusText() {
    const text = languages[currentLanguage];
    const completedCount = document.getElementById('completed-count').textContent;
    const failedCount = document.getElementById('failed-count').textContent;
    
    const passedEl = document.getElementById('text-subjects-passed');
    const failedEl = document.getElementById('text-subjects-failed');
    
    if (passedEl) {
        passedEl.innerHTML = text['text-subjects-passed'] + ' <span id="completed-count">' + completedCount + '</span>/9';
    }
    if (failedEl) {
        failedEl.innerHTML = text['text-subjects-failed'] + ' <span id="failed-count">' + failedCount + '</span>';
    }
}

function applyLanguage() {
    const text = languages[currentLanguage];
    for (let key in text) {
        const el = document.getElementById(key);
        if (el) {
            // Skip status text - handled separately
            if (key === 'text-subjects-passed' || key === 'text-subjects-failed') {
                continue;
            }
            el.textContent = text[key];
        }
    }
    
    // Update status text with counts
    updateStatusText();
    
    // Update semester button text
    const calculateBtn = document.getElementById('calculate-semester-btn');
    if (calculateBtn) {
        if (calculateBtn.disabled) {
            calculateBtn.innerHTML = text['text-count-semester-locked'];
        } else {
            calculateBtn.innerHTML = text['text-count-semester'];
        }
    }
    
    if (currentLanguage === 'ar') {
        document.body.style.direction = 'rtl';
        isRTL = true; // Keep RTL for UI text direction, but gameplay is always LTR
    } else {
        document.body.style.direction = 'ltr';
        isRTL = false;
    }
}

langBtn.onclick = changeLanguage;

// Device Type
let isMobileDevice = false;
let isRTL = false;

// Configuration
let canvasWidth = 400;
let canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let gameRunning = false;
let score = 0;
let pipes = [];
let coins = [];
let particles = [];
let frameCount = 0;
let completedSubjects = [];
let failedSubjects = [];
let subjectScores = {}; // Store HIGHEST scores for each subject
let subjectRetries = {}; // Track retries per subject
let lockedSubjects = []; // Track locked subjects (retries exhausted)
let subjectAttempted = {}; // Track if subject was actually attempted (got a score)
let currentSubject = "";
let lastJumpTime = 0;
let jumpSoundDelay = 700; // milliseconds
let gameStarted = false; // Track if player has made first jump
let lastFinalScore = 0; // Store the last final score to check in backToMenu
let subjectLockStatus = {}; // Store pass/fail status for locked subjects: true = passed, false = failed
let currentIsFrench = false; // Track if player speaks French for current game

// Helper function to get max retries for a subject
function getMaxRetries(subject) {
    const isFrench = document.getElementById('french-skill').value === 'yes';
    // Math, Physics, and SVT (no French) get 3 retries, others get 2
    if (subject === 'Math' || subject === 'PC') {
        return 3;
    }
    if (subject === 'SVT' && !isFrench) {
        return 3;
    }
    return 2;
}

// Helper function to get pipe points for a subject
function getPipePoints(subject) {
    // All subjects get 1 point per pipe
    return 1;
}

// Subject multipliers
const subjectMultipliers = {
    'Math': 7,
    'SVT': 7,
    'PC': 7,
    'Sport': 4,
    'Francais': 4,
    'PH': 3,
    'English': 2,
    'Arabic': 2,
    'Islamic': 1
};
const totalMultiplier = 36;

// Difficulty Modifiers
let pipeSpeed = 2;
let gapSize = 160;
let pipeMoveSpeed = 0;
let spawnRate = 100;

// Student Physics
const student = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    gravity: 0.25, 
    lift: -6,      
    velocity: 0,
    img: null
};

imgLoader.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        student.img = img;
    };
    reader.readAsDataURL(e.target.files[0]);
};

function selectDevice(device) {
    isMobileDevice = (device === 'mobile');
    
    if (!isMobileDevice) {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.border = 'none';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    } else {
        gameContainer.style.width = 'auto';
        canvasWidth = 400;
        canvasHeight = 600;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    deviceMenu.classList.add('hidden');
    menu.classList.remove('hidden');
}

function jump() {
    if (!gameRunning) return;
    const now = Date.now();
    
    // Mark game as started on first jump
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('go-back-btn').classList.add('hidden');
    }
    
    student.velocity = student.lift;
    
    // Only play sound if last jump was more than jumpSoundDelay ago
    if (now - lastJumpTime > jumpSoundDelay) {
        playWhooshSound(); // Use whoosh sound for jumps
        lastJumpTime = now;
    }
}

function playJumpSound() {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

window.addEventListener('keydown', (e) => { if(e.code === 'Space') jump(); });

function startGame(sub) {
    // Check if subject is locked
    if (lockedSubjects.includes(sub)) {
        alert('This exam is locked! You have exhausted all retry attempts.');
        return;
    }
    
    playClickSound();
    currentSubject = sub;
    initSubjectRetry(sub);
    const isFrench = document.getElementById('french-skill').value === 'yes';
    currentIsFrench = isFrench; // Store for later use
    const isMale = document.getElementById('gender').value === 'male';

    // Difficulty Settings (EASY, NORMAL, MEDIUM, HARD)
    switch(sub) {
        case 'English': // EASY
            pipeSpeed = 2; 
            gapSize = 200; 
            pipeMoveSpeed = 0;
            spawnRate = 130;
            break;
        case 'Islamic': // NORMAL
        case 'Arabic':
            pipeSpeed = 2.5; 
            gapSize = 180; 
            pipeMoveSpeed = 0.3;
            spawnRate = 110;
            break;
        case 'PH': // MEDIUM
            pipeSpeed = 3.5; 
            gapSize = 160; 
            pipeMoveSpeed = 0.8;
            spawnRate = 100;
            break;
        case 'Francais': // MEDIUM-HARD
            pipeSpeed = isFrench ? 3 : 4; 
            gapSize = 140; 
            pipeMoveSpeed = 1;
            spawnRate = 100;
            break;
        case 'SVT': // HARD
            pipeSpeed = isFrench ? 3.5 : 3.8; // Slower for better reaction time
            gapSize = isFrench ? 150 : 100; 
            pipeMoveSpeed = 1.8;
            spawnRate = 90;
            break;
        case 'PC': // HARD
        case 'Math':
            pipeSpeed = 3.8; // Slower for better reaction time
            gapSize = 100; // Same as SVT (no French)
            pipeMoveSpeed = 1.8;
            spawnRate = 90; // Same spacing as SVT (no French)
            break;
        case 'Sport': // EASY-MEDIUM
            pipeSpeed = isMale ? 2 : 3.5; 
            gapSize = isMale ? 200 : 150; 
            pipeMoveSpeed = 0;
            spawnRate = isMale ? 130 : 110;
            break;
    }

    resetGame();
    menu.classList.add('hidden');
    document.getElementById('mobile-jump').classList.remove('hidden');
    document.getElementById('go-back-btn').classList.remove('hidden');
    startMusic();
    gameRunning = true;
    animate();
}

function resetGame() {
    score = 0;
    pipes = [];
    coins = [];
    particles = [];
    frameCount = 0;
    student.y = 300;
    student.velocity = 0;
    lastJumpTime = 0;
    gameStarted = false; // Reset game started flag
    // Note: lastFinalScore is NOT reset here - it's used in backToMenu to check if subject should be locked
}

// Initialize retry count for subject if not exists
function initSubjectRetry(subject) {
    if (!subjectRetries[subject]) {
        subjectRetries[subject] = 0;
    }
}

function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 30,
            maxLife: 30,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

function retryExam() {
    playClickSound();
    stopDeathSound(); // Stop death sound when retrying
    
    initSubjectRetry(currentSubject);
    
    // Check if retry limit reached (varies by subject)
    const maxRetries = getMaxRetries(currentSubject);
    if (subjectRetries[currentSubject] >= maxRetries) {
        alert(`You have reached the maximum retry limit (${maxRetries} ${maxRetries === 1 ? 'retry' : 'retries'}) for this exam!`);
        // Lock the subject
        if (!lockedSubjects.includes(currentSubject)) {
            lockedSubjects.push(currentSubject);
        }
        backToMenu();
        return;
    }
    
    // Unlock the subject if it was locked (allows retry even if locked from "next exam")
    const lockIndex = lockedSubjects.indexOf(currentSubject);
    if (lockIndex > -1) {
        lockedSubjects.splice(lockIndex, 1);
    }
    
    subjectRetries[currentSubject]++;
    overlay.classList.add('hidden');
    resetGame();
    document.getElementById('mobile-jump').classList.remove('hidden');
    startMusic();
    gameRunning = true;
    animate();
}

function startMusic() {
    // Using local speedrun.mp3 file
    bgm.src = 'speedrun.mp3';
    bgm.loop = true; // Ensure it loops
    bgm.volume = 0.3;
    bgm.play().catch(e => {
        console.log('Music play failed:', e);
    });
}

// Sound effects functions using Web Audio API
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Click sound failed:', e);
    }
}

function playWhooshSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Whoosh effect - frequency sweep
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        console.log('Whoosh sound failed:', e);
    }
}

function playMemeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a funny meme-like sound (descending tones)
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 300 - (i * 50);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, i * 100);
        }
    } catch (e) {
        console.log('Meme sound failed:', e);
    }
}

// Death sounds array
const deathSounds = [
    'death sounds/ack.mp3',
    'death sounds/ayeh-ayeh-ayeh.mp3',
    'death sounds/metal-gear-solid-snake-death-scream-sound-effect_fR1Ryqk.mp3',
    'death sounds/perfect-fart.mp3',
    'death sounds/slm-3alaykom-ma3akom-yacine.mp3',
    'death sounds/toms-screams.mp3',
    'death sounds/undertakers-bell_2UwFCIe.mp3',
    'death sounds/wa-miiiii.mp3',
    'death sounds/wilhelmscream.mp3'
];

// Track current death sound to stop it if needed
let currentDeathSound = null;

// Function to play random death sound
function playRandomDeathSound() {
    try {
        // Stop any currently playing death sound
        if (currentDeathSound) {
            currentDeathSound.pause();
            currentDeathSound.currentTime = 0;
        }
        
        const randomIndex = Math.floor(Math.random() * deathSounds.length);
        currentDeathSound = new Audio(deathSounds[randomIndex]);
        currentDeathSound.volume = 0.7;
        currentDeathSound.play().catch(e => {
            console.log('Death sound play failed:', e);
        });
    } catch (e) {
        console.log('Death sound failed:', e);
    }
}

// Function to stop death sound
function stopDeathSound() {
    if (currentDeathSound) {
        currentDeathSound.pause();
        currentDeathSound.currentTime = 0;
        currentDeathSound = null;
    }
}

function toggleMusic() {
    if (bgm.paused) {
        bgm.play();
        musicToggle.textContent = '🔊';
    } else {
        bgm.pause();
        musicToggle.textContent = '🔇';
    }
}

function setVolume(val) {
    bgm.volume = val / 100;
}

function animate() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Show "Click Jump to Start" message if game hasn't started
    if (!gameStarted) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Click JUMP to Start", canvas.width / 2, canvas.height / 2);
        ctx.font = "18px Arial";
        ctx.fillText("(Spacebar or Click JUMP button)", canvas.width / 2, canvas.height / 2 + 40);
        ctx.restore();
        requestAnimationFrame(animate);
        return; // Don't run game logic until first jump
    }

    // Physics
    student.velocity += student.gravity;
    student.y += student.velocity;

    // Draw Student with rotation
    ctx.save();
    const rotation = Math.min(Math.max(student.velocity * 0.1, -0.5), 0.5);
    ctx.translate(student.x + student.width/2, student.y + student.height/2);
    ctx.rotate(rotation);
    
    if (student.img) {
        ctx.drawImage(student.img, -student.width/2, -student.height/2, student.width, student.height);
    } else {
        // Draw a better default student shape
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(0, 0, student.width/2, 0, Math.PI * 2);
        ctx.fill();
        // Add eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(-8, -5, 4, 0, Math.PI * 2);
        ctx.arc(8, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(-8, -5, 2, 0, Math.PI * 2);
        ctx.arc(8, -5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Spawn Pipes and Coins
    if (frameCount % spawnRate === 0) {
        let topH = Math.random() * (canvas.height - gapSize - 100) + 50;
        pipes.push({ x: canvas.width, top: topH, passed: false, angle: 0 });
        
        // For Math and Physics: 50/50% chance of blue coin vs regular coin
        // For other subjects: always regular coin
        const isBlueCoin = (currentSubject === 'Math' || currentSubject === 'PC') && Math.random() < 0.5;
        coins.push({ x: canvas.width + 60, y: topH + gapSize/2, collected: false, isBlue: isBlueCoin });
    }

    // Pipes Logic - Always move left to right (ignore RTL for gameplay)
    pipes.forEach((p, i) => {
        p.x -= pipeSpeed; // Always left to right
        
        if (pipeMoveSpeed > 0) {
            p.angle += 0.05;
            p.top += Math.sin(p.angle) * pipeMoveSpeed;
        }

        // Draw pipes with gradient and border
        const pipeColor = (score >= 10) ? "#27ae60" : "#e74c3c";
        
        // Top pipe
        const topGradient = ctx.createLinearGradient(p.x, 0, p.x + 50, 0);
        topGradient.addColorStop(0, pipeColor);
        topGradient.addColorStop(1, score >= 10 ? "#2ecc71" : "#c0392b");
        ctx.fillStyle = topGradient;
        ctx.fillRect(p.x, 0, 50, p.top);
        
        // Pipe cap
        ctx.fillStyle = score >= 10 ? "#229954" : "#a93226";
        ctx.fillRect(p.x - 5, p.top - 20, 60, 20);
        
        // Bottom pipe
        const bottomGradient = ctx.createLinearGradient(p.x, p.top + gapSize, p.x + 50, canvas.height);
        bottomGradient.addColorStop(0, pipeColor);
        bottomGradient.addColorStop(1, score >= 10 ? "#2ecc71" : "#c0392b");
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(p.x, p.top + gapSize, 50, canvas.height);
        
        // Bottom pipe cap
        ctx.fillStyle = score >= 10 ? "#229954" : "#a93226";
        ctx.fillRect(p.x - 5, p.top + gapSize, 60, 20);
        
        // Pipe border
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, 0, 50, p.top);
        ctx.strokeRect(p.x, p.top + gapSize, 50, canvas.height);

        // Collision
        if (student.x < p.x + 50 && student.x + student.width > p.x &&
            (student.y < p.top || student.y + student.height > p.top + gapSize)) {
            createParticles(student.x + student.width/2, student.y + student.height/2, "#e74c3c", 20);
            playRandomDeathSound(); // Play random death sound on collision
            endGame();
        }

        // Scoring - All subjects give 1 point per pipe
        const pipePoints = getPipePoints(currentSubject);
        if (p.x + 50 < student.x && !p.passed) {
            score = Math.min(20, score + pipePoints);
            p.passed = true;
            createParticles(p.x + 25, p.top + gapSize/2, "#27ae60", 15);
        }
    });

    // Coins Logic - Always move left to right (ignore RTL for gameplay)
    coins.forEach(c => {
        c.x -= pipeSpeed; // Always left to right
        
        if (!c.collected) {
            // Animated coin with rotation
            const coinRotation = frameCount * 0.1;
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(coinRotation);
            
            if (c.isBlue) {
                // Blue coin gradient (for Math/Physics bonus coins)
                const blueCoinGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
                blueCoinGradient.addColorStop(0, "#4169E1");
                blueCoinGradient.addColorStop(0.5, "#1E90FF");
                blueCoinGradient.addColorStop(1, "#0000CD");
                ctx.fillStyle = blueCoinGradient;
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI*2);
                ctx.fill();
                
                // Blue coin shine
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.beginPath();
                ctx.arc(-3, -3, 4, 0, Math.PI*2);
                ctx.fill();
                
                // Blue coin border
                ctx.strokeStyle = "#0000CD";
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Regular coin gradient
                const coinGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
                coinGradient.addColorStop(0, "#FFD700");
                coinGradient.addColorStop(0.5, "#FFA500");
                coinGradient.addColorStop(1, "#FF8C00");
                ctx.fillStyle = coinGradient;
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI*2);
                ctx.fill();
                
                // Coin shine
                ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                ctx.beginPath();
                ctx.arc(-3, -3, 4, 0, Math.PI*2);
                ctx.fill();
                
                // Coin border
                ctx.strokeStyle = "#FF8C00";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            ctx.restore();

            let dx = student.x + 20 - c.x;
            let dy = student.y + 20 - c.y;
            if (Math.sqrt(dx*dx + dy*dy) < 30) {
                // Blue coins: 0.5 points, Yellow coins: 0.25 points
                const coinPoints = c.isBlue ? 0.5 : 0.25;
                score = Math.min(20, score + coinPoints);
                c.collected = true;
                createParticles(c.x, c.y, c.isBlue ? "#4169E1" : "#FFD700", 12);
            }
        }
    });
    
    // Update and draw particles
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life--;
        
        const alpha = p.life / p.maxLife;
        if (p.color.startsWith('#')) {
            const r = parseInt(p.color.slice(1, 3), 16);
            const g = parseInt(p.color.slice(3, 5), 16);
            const b = parseInt(p.color.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
            ctx.fillStyle = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        return p.life > 0;
    });

    // Clean up - Always left to right
    pipes = pipes.filter(p => p.x > -50);
    coins = coins.filter(c => c.x > -50);

    // Ceiling/Floor
    if (student.y > canvas.height || student.y < 0) {
        playRandomDeathSound(); // Play random death sound on ceiling/floor collision
        endGame();
    }
    
    // Auto-stop when reaching 20/20
    if (score >= 20) {
        endGame();
    }

    // UI Score with better styling
    ctx.save();
    // Score background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(15, 15, 150, 35);
    ctx.fillRect(canvas.width - 120, 15, 110, 35);
    
    // Score text - translate "Grade" based on language
    const gradeText = currentLanguage === 'ar' ? 'النقطة' : (currentLanguage === 'fr' ? 'Note' : 'Grade');
    ctx.fillStyle = score >= 10 ? "#27ae60" : "#e74c3c";
    // Use font that supports Arabic characters
    if (currentLanguage === 'ar') {
        ctx.font = "bold 22px 'Segoe UI', 'Arial Unicode MS', 'Tahoma', Arial, sans-serif";
    } else {
        ctx.font = "bold 22px Arial";
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`${gradeText}: ${score.toFixed(1)}/20`, 20, 32);
    
    ctx.fillStyle = "#2c3e50";
    if (currentLanguage === 'ar') {
        ctx.font = "bold 18px 'Segoe UI', 'Arial Unicode MS', 'Tahoma', Arial, sans-serif";
    } else {
        ctx.font = "bold 18px Arial";
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    // Keep exam names as they are (don't translate in Arabic)
    const subjectDisplayName = getDisplayName(currentSubject);
    ctx.fillText(subjectDisplayName, canvas.width - 115, 32);
    ctx.restore();

    frameCount++;
    requestAnimationFrame(animate);
}

function endGame() {
    gameRunning = false;
    bgm.pause();
    bgm.currentTime = 0;
    document.getElementById('mobile-jump').classList.add('hidden');
    overlay.classList.remove('hidden');
    
    const finalScore = Math.min(20, Math.max(0, score));
    lastFinalScore = finalScore; // Store the final score for backToMenu check
    
    // Translate "Final Grade" based on language
    const gradeText = currentLanguage === 'ar' ? 'النقطة النهائية' : (currentLanguage === 'fr' ? 'Note finale' : 'Final Grade');
    document.getElementById('result-score').innerText = `${gradeText}: ${finalScore.toFixed(1)}/20`;
    
    // Mark subject as attempted (only if score > 0, meaning they actually played)
    if (finalScore > 0 || gameStarted) {
        subjectAttempted[currentSubject] = true;
    }
    
    // Store the HIGHEST score for this subject (not just the last one)
    if (!subjectScores[currentSubject] || finalScore > subjectScores[currentSubject]) {
        subjectScores[currentSubject] = finalScore;
    }
    
    // Show best score if different from current
    if (subjectScores[currentSubject] > finalScore) {
        const bestText = currentLanguage === 'ar' ? 'أفضل' : (currentLanguage === 'fr' ? 'Meilleur' : 'Best');
        document.getElementById('result-score').innerText += ` (${bestText}: ${subjectScores[currentSubject].toFixed(1)}/20)`;
    }

    if (finalScore >= 10) {
        document.getElementById('snd-pass').play();
        document.getElementById('result-title').innerText = "Njahti! 🎉";
        if (!completedSubjects.includes(currentSubject)) {
            completedSubjects.push(currentSubject);
            // Remove from failed if it was there
            const failedIndex = failedSubjects.indexOf(currentSubject);
            if (failedIndex > -1) {
                failedSubjects.splice(failedIndex, 1);
            }
            document.getElementById('completed-count').innerText = completedSubjects.length;
            document.getElementById('failed-count').innerText = failedSubjects.length;
            updateStatusText();
        }
    } else {
        playMemeSound(); // Play meme sound on fail
        document.getElementById('snd-fail').play();
        document.getElementById('result-title').innerText = "Nari zbaltha fl fard 💀";
        document.getElementById('meme-text').innerText = "";
        if (!failedSubjects.includes(currentSubject) && !completedSubjects.includes(currentSubject)) {
            failedSubjects.push(currentSubject);
            document.getElementById('failed-count').innerText = failedSubjects.length;
            updateStatusText();
        }
    }
    
    // Update retry button text
    initSubjectRetry(currentSubject);
    const retryBtn = document.getElementById('text-retry');
    const maxRetries = getMaxRetries(currentSubject);
    const retriesLeft = maxRetries - subjectRetries[currentSubject];
    const text = languages[currentLanguage];
    const retryText = text['text-retry'];
    
    if (retriesLeft > 0) {
        // Translate "left" based on language
        const leftText = currentLanguage === 'ar' ? 'متبقي' : (currentLanguage === 'fr' ? 'restant' : 'left');
        if (currentLanguage === 'ar') {
            retryBtn.textContent = `${retryText} (${retriesLeft} ${leftText})`;
        } else {
            retryBtn.textContent = `${retryText} (${retriesLeft} ${leftText})`;
        }
        retryBtn.disabled = false;
        retryBtn.style.opacity = '1';
        retryBtn.style.cursor = 'pointer';
    } else {
        // Translate "No retries left" based on language
        const noRetriesText = currentLanguage === 'ar' ? 'لا محاولات متبقية' : (currentLanguage === 'fr' ? 'Aucune tentative restante' : 'No retries left');
        retryBtn.textContent = `${retryText} (${noRetriesText})`;
        retryBtn.disabled = true;
        retryBtn.style.opacity = '0.5';
        retryBtn.style.cursor = 'not-allowed';
        
        // Lock the subject ONLY if it was actually attempted (not just clicked "next exam")
        if (subjectAttempted[currentSubject] && !lockedSubjects.includes(currentSubject)) {
            lockedSubjects.push(currentSubject);
        }
    }
    
    updateSemesterButton();
    updateSubjectButtons();
}

function backToMenu() {
    playClickSound();
    stopDeathSound(); // Stop death sound when going to next exam
    
    // Always lock the subject when clicking "Next Exam" (regardless of pass/fail)
    if (lastFinalScore > 0 && currentSubject) {
        // Lock the subject - they can only retry using the retry button
        if (!lockedSubjects.includes(currentSubject)) {
            lockedSubjects.push(currentSubject);
        }
        // Store whether the exam was passed (>=10) or failed (<10)
        subjectLockStatus[currentSubject] = lastFinalScore >= 10;
        // Mark as attempted so it stays locked
        subjectAttempted[currentSubject] = true;
    }
    
    overlay.classList.add('hidden');
    menu.classList.remove('hidden');
    document.getElementById('mobile-jump').classList.add('hidden');
    document.getElementById('go-back-btn').classList.add('hidden');
    updateSubjectButtons();
    updateSemesterButton();
    
    // Reset retry button state
    const retryBtn = document.getElementById('text-retry');
    retryBtn.disabled = false;
    retryBtn.style.opacity = '1';
    const text = languages[currentLanguage];
    retryBtn.textContent = text['text-retry'];
    
    // Stop game if it's running
    gameRunning = false;
    bgm.pause();
    bgm.currentTime = 0;
    resetGame();
    lastFinalScore = 0; // Reset the stored score
}

function goBackFromGame() {
    playClickSound();
    stopDeathSound(); // Stop death sound when going back
    gameRunning = false;
    bgm.pause();
    bgm.currentTime = 0;
    document.getElementById('mobile-jump').classList.add('hidden');
    document.getElementById('go-back-btn').classList.add('hidden');
    menu.classList.remove('hidden');
    resetGame();
    updateSubjectButtons();
}

function updateSubjectButtons() {
    const subjectButtons = document.querySelectorAll('#subject-list button');
    subjectButtons.forEach(btn => {
        // Get original subject name from onclick attribute or text
        let subjectKey = null;
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/startGame\('([^']+)'\)/);
            if (match) {
                subjectKey = match[1];
            }
        }
        
        if (!subjectKey) {
            // Fallback: extract from text (remove lock symbols and checkmarks)
            const subjectName = btn.textContent.replace(' 🔒', '').replace(' ✓', '').replace(' ✓ 🔒', '').replace(' 🔒 ✓', '').trim();
            subjectKey = getSubjectKey(subjectName);
        }
        
        // Check if locked
        if (lockedSubjects.includes(subjectKey)) {
            // Color based on pass/fail status
            const passed = subjectLockStatus[subjectKey] === true;
            if (passed) {
                // Green for passed exam
                btn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
            } else {
                // Red for failed exam
                btn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            }
            btn.style.opacity = '0.8';
            btn.style.cursor = 'not-allowed';
            const displayName = getDisplayName(subjectKey);
            const lockText = passed ? ' ✓ 🔒' : ' 🔒';
            btn.innerHTML = displayName + lockText;
            const alertText = currentLanguage === 'ar' 
                ? (passed ? 'نجحت في هذا الامتحان!' : 'رسبت في هذا الامتحان!')
                : (passed ? 'You passed this exam!' : 'You failed this exam!');
            btn.setAttribute('onclick', `alert('${alertText}');`);
        } else if (completedSubjects.includes(subjectKey)) {
            btn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
            btn.style.opacity = '0.9';
            btn.style.cursor = 'pointer';
            const displayName = getDisplayName(subjectKey);
            btn.innerHTML = displayName + ' ✓';
            btn.setAttribute('onclick', `startGame('${subjectKey}')`);
        } else {
            btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            const displayName = getDisplayName(subjectKey);
            btn.innerHTML = displayName;
            btn.setAttribute('onclick', `startGame('${subjectKey}')`);
        }
    });
}

function getDisplayName(subjectKey) {
    const mapping = {
        'English': 'English',
        'Islamic': 'Islamic',
        'Arabic': 'Arabic',
        'PH': 'Philosophy',
        'Francais': 'French',
        'SVT': 'SVT',
        'PC': 'Physics',
        'Math': 'Math',
        'Sport': 'Sport'
    };
    
    const name = mapping[subjectKey] || subjectKey;
    
    // Keep exam names as they are in Arabic (don't translate)
    // Only translate for French
    if (currentLanguage === 'fr') {
        const frNames = {
            'English': 'Anglais',
            'Islamic': 'Islamique',
            'Arabic': 'Arabe',
            'Philosophy': 'Philosophie',
            'French': 'Français',
            'SVT': 'SVT',
            'Physics': 'Physique',
            'Math': 'Mathématiques',
            'Sport': 'Sport'
        };
        return frNames[name] || name;
    }
    
    // For Arabic and English, keep names as they are
    return name;
}

function getSubjectKey(displayName) {
    const mapping = {
        'English': 'English',
        'Islamic': 'Islamic',
        'Arabic': 'Arabic',
        'Philosophy': 'PH',
        'French': 'Francais',
        'SVT': 'SVT',
        'Physics': 'PC',
        'Math': 'Math',
        'Sport': 'Sport'
    };
    return mapping[displayName] || displayName;
}

function resetAllProgress() {
    if (!confirm('Are you sure you want to reset ALL progress? This will clear all scores, completed subjects, and retry counts.')) {
        return;
    }
    
    playClickSound();
    
    // Reset all progress
    completedSubjects = [];
    failedSubjects = [];
    subjectScores = {};
    subjectRetries = {};
    lockedSubjects = [];
    subjectAttempted = {}; // Reset attempted tracking
    subjectLockStatus = {}; // Reset lock status
    
    // Update UI
    document.getElementById('completed-count').innerText = '0';
    document.getElementById('failed-count').innerText = '0';
    updateStatusText();
    updateSubjectButtons();
    updateSemesterButton();
    
    alert('All progress has been reset!');
}

function updateSemesterButton() {
    const calculateBtn = document.getElementById('calculate-semester-btn');
    const bubble = document.getElementById('semester-bubble');
    const totalSubjects = 9;
    const completedCount = completedSubjects.length + failedSubjects.length;
    const text = languages[currentLanguage];
    
    if (completedCount >= totalSubjects) {
        calculateBtn.disabled = false;
        calculateBtn.style.opacity = '1';
        calculateBtn.style.cursor = 'pointer';
        calculateBtn.innerHTML = text['text-count-semester'];
        bubble.classList.add('hidden');
    } else {
        calculateBtn.disabled = true;
        calculateBtn.style.opacity = '0.5';
        calculateBtn.style.cursor = 'not-allowed';
        calculateBtn.innerHTML = text['text-count-semester-locked'];
    }
}

function calculateSemester() {
    playClickSound();
    
    // Check if all subjects are completed (both passed and failed count)
    const allSubjects = ['English', 'Islamic', 'Arabic', 'PH', 'Francais', 'SVT', 'PC', 'Math', 'Sport'];
    const completedCount = completedSubjects.length + failedSubjects.length;
    
    if (completedCount < 9) {
        alert('You need to complete all 9 subjects first!');
        return;
    }
    
    // Calculate semester result
    let totalScore = 0;
    let calculationDetails = [];
    
    allSubjects.forEach(subject => {
        const score = subjectScores[subject] || 0;
        const multiplier = subjectMultipliers[subject] || 1;
        const weightedScore = score * multiplier;
        totalScore += weightedScore;
        const status = score >= 10 ? '✓' : '✗';
        calculationDetails.push(`${status} ${subject}: ${score.toFixed(1)} × ${multiplier} = ${weightedScore.toFixed(1)}`);
    });
    
    const semesterResult = totalScore / totalMultiplier;
    
    // Show calculation in a more readable format
    let message = `═══════════════════════════════\n`;
    message += `   SEMESTER CALCULATION\n`;
    message += `═══════════════════════════════\n\n`;
    message += calculationDetails.join('\n');
    message += `\n\n───────────────────────────────\n`;
    message += `Total: ${totalScore.toFixed(1)} ÷ ${totalMultiplier} = ${semesterResult.toFixed(2)}/20\n`;
    message += `───────────────────────────────\n\n`;
    
    if (semesterResult >= 10) {
        message += '🎉 Wili wili, nja7t maymkench! 🎉';
        document.getElementById('snd-pass').play();
    } else {
        message += '😭 Nari dabart 3liha 3and malin dar, wakila 4adi ayssiftoni l5ayriya😭😭';
        playMemeSound();
        document.getElementById('snd-fail').play();
    }
    
    alert(message);
}

// Add hover event for bubble tooltip
window.addEventListener('load', () => {
    deviceMenu.classList.remove('hidden');
    applyLanguage();
    updateSubjectButtons();
    updateSemesterButton();
    
    const calculateBtn = document.getElementById('calculate-semester-btn');
    const bubble = document.getElementById('semester-bubble');
    
    calculateBtn.addEventListener('mouseenter', () => {
        if (calculateBtn.disabled) {
            bubble.classList.remove('hidden');
        }
    });
    
    calculateBtn.addEventListener('mouseleave', () => {
        setTimeout(() => bubble.classList.add('hidden'), 100);
    });
    
    // Also show bubble when button is focused (for accessibility)
    calculateBtn.addEventListener('focus', () => {
        if (calculateBtn.disabled) {
            bubble.classList.remove('hidden');
        }
    });
    
    calculateBtn.addEventListener('blur', () => {
        bubble.classList.add('hidden');
    });
    
    // Add click sounds to all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id !== 'music-toggle') {
                playClickSound();
            }
        });
    });
});