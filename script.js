const box = document.getElementById('box');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const timer = document.getElementById('timer');
const score = document.getElementById('score');
const appleName = document.getElementById('appleName');
const slashSound = new Audio('slash.mp3');

let intervalId;
let countdownInterval;
let gameOver = false;

// Returns a random alphabet (A-Z)
function getRandomAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Returns a random delay between 300ms and 1500ms
function getRandomDelay() {
    return Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
}

// Displays alphabets on screen at random intervals
function displayAlphabets() {
    function showAlphabet() {
        if (!gameOver) {
            const randomLetter = getRandomAlphabet();
            appleName.textContent = randomLetter;
            intervalId = setTimeout(showAlphabet, getRandomDelay());
        }
    }
    showAlphabet();
}

// Starts 60-second countdown
function countDown() {
    let timeLeft = 60;
    timer.innerHTML = `Time: ${timeLeft}`;

    countdownInterval = setInterval(() => {
        timeLeft--;
        timer.innerHTML = `Time: ${timeLeft}`;

        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            clearTimeout(intervalId);
            gameOver = true;
            startButton.disabled = false;
            alert('Time is up!');
        }
    }, 1000);
}

// Handle key presses and update score
function handleKeyPress(e) {
    if (gameOver) return;

    const currentLetter = appleName.textContent;
    if (currentLetter && e.key.toUpperCase() === currentLetter) {
        const currentScore = parseInt(score.innerHTML.replace('Score: ', '')) || 0;
        score.innerHTML = `Score: ${currentScore + 1}`;

        slashSound.currentTime = 0;
        slashSound.play();

        appleName.classList.add('strike');
        setTimeout(() => {
            appleName.classList.remove('strike');
        }, 400);
    }
}

// Start button functionality
startButton.addEventListener('click', () => {
    score.innerHTML = `Score: 0`;
    timer.innerHTML = `Time: 60`;
    appleName.textContent = '';
    gameOver = false;

    startButton.disabled = true;

    document.getElementById('mobileInput').focus();
    displayAlphabets();
    countDown();
});

// Reset button functionality
resetButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    clearTimeout(intervalId);
    gameOver = true;

    score.innerHTML = `Score: 0`;
    timer.innerHTML = `Time: 0`;
    appleName.textContent = '';

    startButton.disabled = false;
});

// Attach key listener once (not on every game start)
document.addEventListener('keydown', handleKeyPress);
