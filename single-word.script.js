const words = [
    "apple", "banana", "orange", "grape", "strawberry",
    "computer", "keyboard", "mouse", "monitor", "headphone",
    "programming", "javascript", "python", "html", "css",
    "developer", "engineer", "designer", "analyst", "manager"
];

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');

const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let currentWordIndex = 0;
let score = 0;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function displayWord() {
    const word = getRandomWord();
    wordDisplay.innerHTML = '';
    word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        wordDisplay.appendChild(charSpan);
    });
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    wordInput.value = '';
    wordInput.focus();
    startButton.disabled = true;
    displayWord();
}

wordInput.addEventListener('input', () => {
    const typedValue = wordInput.value;
    const currentWordSpans = wordDisplay.querySelectorAll('span');
    let correct = true;

    currentWordSpans.forEach((charSpan, index) => {
        const char = charSpan.textContent;
        if (typedValue[index] === char) {
            charSpan.className = 'correct';
        } else if (typedValue[index] === undefined) {
            charSpan.className = '';
        } else {
            charSpan.className = 'incorrect';
            correct = false;
        }
    });

    if (typedValue.length === currentWordSpans.length && correct) {
        score++;
        scoreDisplay.textContent = score;
        wordInput.value = '';
        displayWord();
    }
});

startButton.addEventListener('click', startGame);

// Initial display
displayWord();