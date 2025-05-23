// DOM Elements
const box = document.getElementById('box');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const timer = document.getElementById('timer');
const score = document.getElementById('score');
const appleName = document.getElementById('appleName');
const mobileInput = document.getElementById('mobileInput')


// Sound File
const slashSound = new Audio('slash.mp3');


// Flag Variables
let keyLocked = false;
let gameOver = false;


// Utility: Wait using async/await
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Returns a random alphabet (A-Z)
function getRandomAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}


// Returns a random delay between 500ms and 1500ms
function getRandomDelay() {
    return Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
}


// Displays alphabets using async/await
async function displayAlphabets() {
    while (!gameOver) {
        const randomLetter = getRandomAlphabet();
        appleName.textContent = randomLetter;
        await wait(getRandomDelay());
    }
}


// 60-second countdown with async loop
async function countDown() {
    let timeLeft = 60;
    timer.innerHTML = `Time: ${timeLeft}`;

    while (timeLeft >= 0 && !gameOver) {
        await wait(1000);
        timeLeft--;
        timer.innerHTML = `Time: ${timeLeft}`;
    }

    if (!gameOver) {
        gameOver = true;
        startButton.disabled = false;
        timer.innerHTML = `Time: Over`;
        appleName.textContent = "";
    }
}


// Handle key presses using async
async function handleKeyPress(e) {
    if (gameOver || keyLocked) return;

    const inputChar = e.target.value.trim().toUpperCase();
    const currentLetter = appleName.textContent;

    if (!inputChar) return;

    if (inputChar === currentLetter) {
        keyLocked = true;

        const currentScore = parseInt(score.innerHTML.replace('Score: ', '')) || 0;
        score.innerHTML = `Score: ${currentScore + 1}`;

        slashSound.currentTime = 0;
        slashSound.play();

        appleName.classList.add('strike');

        await wait(300);

        appleName.classList.remove('strike');

        keyLocked = false;
    }

    //  Clear input for next round and refocus
    await wait(250);           // Replaces setTimeout
    e.target.value = '';       // Clear input after wait
    e.target.focus();          // Refocus
}


// Start button functionality
startButton.addEventListener('click', async () => {
    score.innerHTML = `Score: 0`;
    timer.innerHTML = `Time: 60`;
    appleName.textContent = '';

    gameOver = false;

    startButton.disabled = true;

    mobileInput.value = '';
    mobileInput.focus();

    displayAlphabets();  

    countDown();    
});

// Reset button functionality
resetButton.addEventListener('click', () => {
    gameOver = true;

    score.innerHTML = `Score: 0`;
    timer.innerHTML = `Time: 0`;
    appleName.textContent = '';

    mobileInput.value = '';
    mobileInput.blur();

    startButton.disabled = false;
});

// Attach key listener once (not on every game start)
mobileInput.addEventListener('input', handleKeyPress);