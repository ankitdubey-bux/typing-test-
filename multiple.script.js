const words = [
    "the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog",
    "apple", "banana", "orange", "grape", "strawberry", "blueberry",
    "computer", "keyboard", "mouse", "monitor", "headphone", "speaker",
    "program", "code", "developer", "website", "application", "software",
    "internet", "network", "server", "client", "database", "security",
    "algorithm", "data", "structure", "function", "variable", "constant",
    "language", "python", "javascript", "html", "css", "react", "angular",
    "vue", "node", "express", "django", "flask", "java", "csharp", "ruby",
    "php", "swift", "kotlin", "android", "ios", "linux", "windows", "mac",
    "cloud", "devops", "agile", "scrum", "kanban", "testing", "debug",
    "deploy", "version", "control", "git", "github", "gitlab", "bitbucket"
];

const wordDisplay = document.getElementById('word-display');
const textInput = document.getElementById('text-input');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button'); // Get reference to stop button
const timeSpan = document.getElementById('time');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');

let currentWords = [];
let currentWordIndex = 0;
let startTime;
let timerInterval;
let correctWordsCount = 0;
let totalWordsAttempted = 0;

function getRandomWords(num) {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function displayWords() {
    wordDisplay.innerHTML = '';
    currentWords.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');
        wordSpan.textContent = word;
        wordDisplay.appendChild(wordSpan);
    });
}

function startGame() {
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    startButton.disabled = true;
    stopButton.disabled = false; // Enable stop button
    
    currentWords = getRandomWords(20); // Display 20 words at a time
    currentWordIndex = 0;
    correctWordsCount = 0;
    totalWordsAttempted = 0;

    displayWords();

    // Highlight the first word
    if (wordDisplay.children[0]) {
        wordDisplay.children[0].classList.add('current');
    }

    startTime = new Date().getTime();
    timeSpan.textContent = 0;
    wpmSpan.textContent = 0;
    accuracySpan.textContent = 100;

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timeSpan.textContent = elapsedTime;
    calculateResults();
}

function calculateResults() {
    const currentTime = new Date().getTime();
    const elapsedTimeInMinutes = (currentTime - startTime) / 1000 / 60;
    
    if (elapsedTimeInMinutes > 0) {
        const wpm = Math.round(correctWordsCount / elapsedTimeInMinutes);
        wpmSpan.textContent = wpm;
    }

    if (totalWordsAttempted === 0) {
        accuracySpan.textContent = 100;
    } else {
        const accuracy = Math.round((correctWordsCount / totalWordsAttempted) * 100);
        accuracySpan.textContent = accuracy;
    }
}

function endGame() {
    clearInterval(timerInterval);
    textInput.disabled = true;
    startButton.disabled = false;
    stopButton.disabled = true; // Disable stop button
    calculateResults();
}

textInput.addEventListener('input', (e) => {
    const inputText = textInput.value;
    const currentWord = currentWords[currentWordIndex];
    const currentWordSpan = wordDisplay.children[currentWordIndex];

    if (!currentWord) return; // No more words to type

    // Update highlighting for the current word based on typing
    if (currentWordSpan) {
        currentWordSpan.classList.remove('incorrect-typing');
        if (!currentWord.startsWith(inputText)) {
            currentWordSpan.classList.add('incorrect-typing');
        }
    }

    // Handle space press (word completion)
    if (e.data === ' ') {
        const typedWord = inputText.trim();

        if (typedWord === '') { // Ignore multiple spaces
            textInput.value = '';
            return;
        }

        totalWordsAttempted++;

        if (typedWord === currentWord) {
            correctWordsCount++;
            if (currentWordSpan) {
                currentWordSpan.classList.add('correct');
            }
        } else {
            if (currentWordSpan) {
                currentWordSpan.classList.add('incorrect');
            }
        }

        textInput.value = ''; // Clear input for the next word
        
        // Remove 'current' class from the previous word
        if (currentWordSpan) {
            currentWordSpan.classList.remove('current', 'incorrect-typing');
        }

        currentWordIndex++;
        calculateResults();

        if (currentWordIndex >= currentWords.length) {
            endGame();
        } else {
            // Highlight the next word
            if (wordDisplay.children[currentWordIndex]) {
                wordDisplay.children[currentWordIndex].classList.add('current');
            }
        }
    }
});

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', endGame); // Add event listener for stop button
