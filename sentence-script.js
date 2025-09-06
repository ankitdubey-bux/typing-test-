const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const resetButton = document.getElementById('reset-button');

let startTime;
let typedCharacters = 0;
let correctCharacters = 0;
let totalCharacters = 0;
let currentText = '';

const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "The early bird catches the worm, but the second mouse gets the cheese.",
    "Innovation distinguishes between a leader and a follower.",
    "The only way to do great work is to love what you do.",
    "Life is what happens when you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Strive not to be a success, but rather to be of value.",
    "The mind is everything. What you think you become.",
    "Eighty percent of success is showing up."
];

function getRandomSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}

function loadNewText() {
    currentText = getRandomSentence();
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textDisplay.appendChild(span);
    });
    totalCharacters += currentText.length;
}

function resetGame() {
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    startTime = null;
    typedCharacters = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    wpmSpan.textContent = '0';
    accuracySpan.textContent = '100';
    loadNewText();
}

textInput.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date().getTime();
    }

    const typedValue = textInput.value;
    const textSpans = textDisplay.querySelectorAll('span');
    let correctCount = 0;

    typedCharacters = typedValue.length;

    textSpans.forEach((charSpan, index) => {
        const char = currentText[index];
        if (index < typedValue.length) {
            if (typedValue[index] === char) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correctCount++;
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
            }
        } else {
            charSpan.classList.remove('correct', 'incorrect');
        }
    });

    correctCharacters = correctCount;

    // Calculate WPM
    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 60000; // in minutes
    if (timeElapsed > 0) {
        const wpm = Math.round((correctCharacters / 5) / timeElapsed);
        wpmSpan.textContent = wpm;
    }

    // Calculate Accuracy
    if (typedCharacters > 0) {
        const accuracy = Math.round((correctCharacters / typedCharacters) * 100);
        accuracySpan.textContent = accuracy;
    } else {
        accuracySpan.textContent = '100';
    }

    // If user has typed all characters in the current text, load new text
    if (typedValue.length === currentText.length) {
        textInput.value = '';
        loadNewText();
    }
});

resetButton.addEventListener('click', resetGame);

// Initial load
loadNewText();