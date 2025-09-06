const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const typingInput = document.getElementById('typing-input');
const difficultySelect = document.getElementById('difficulty');

let score = 0;
let gameInterval;
let bubbles = [];
let missedWordsBuffer = []; // New: Buffer for missed words
let processedWordsCount = 0; // New: Counter for processed words
const wordsToProcessBeforeReappear = 20; // New: Threshold for re-adding missed words
const allWords = [
    // Sports Names (filtered for <= 7 chars)
    'tennis', 'cricket', 'soccer', 'rugby', 'hockey', 'golf',
    'boxing', 'cycling', 'skiing', 'judo', 'fencing',

    // Fruit Names (filtered for <= 7 chars)
    'apple', 'banana', 'orange', 'grape', 'mango', 'kiwi', 'peach', 'pear',
    'cherry', 'lemon', 'lime', 'coconut', 'avocado', 'fig', 'plum',

    // Small Country Names (filtered for <= 7 chars)
    'monaco', 'nauru', 'tuvalu', 'malta', 'andorra', 'fiji', 'qatar', 'samoa', 'tonga',

    // Vegetable Names (filtered for <= 7 chars)
    'carrot', 'spinach', 'potato', 'tomato', 'onion', 'garlic', 'lettuce', 'pepper',
    'cabbage', 'radish', 'celery', 'beetroot', 'corn', 'pea', 'bean',

    // Equipment / Small Electronic Items (filtered for <= 7 chars)
    'hammer', 'wrench', 'pliers', 'drill', 'saw', 'tape', 'ruler', 'level',
    'mouse', 'speaker', 'charger', 'tablet', 'webcam', 'usb'
];
let availableWords = [...allWords]; // Copy allWords to availableWords

const rainbowColors = ['#d1e381ff', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#1E90FF', '#3CB371']; // Red, Green, Blue, Indigo, Violet, DodgerBlue, MediumSeaGreen

function createBubble() {
    if (bubbles.length >= 4) { // Only create a new bubble if there are less than 4 on screen
        return;
    }

    if (availableWords.length === 0) {
        availableWords = [...allWords]; // Replenish if all words have been used
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords.splice(randomIndex, 1)[0]; // Get word and remove it from available

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    // Wrap each letter in a span for individual highlighting
    word.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        bubble.appendChild(span);
    });
    gameArea.appendChild(bubble);

    // Calculate bubble width after it's in the DOM (even if not visible yet)
    const bubbleWidth = bubble.offsetWidth; 

    let newLeft;
    let attempts = 0;
    const maxAttempts = 50; // Limit attempts to find a non-overlapping position
    const minHorizontalSpacing = 20; // Minimum space between bubbles

    do {
        newLeft = Math.random() * (gameArea.clientWidth - bubbleWidth - 20); // 20 for padding/margin
        let overlaps = false;
        for (const existingBubble of bubbles) {
            const existingLeft = parseFloat(existingBubble.element.style.left);
            const existingWidth = existingBubble.element.offsetWidth;

            // Check for horizontal overlap
            if (newLeft < existingLeft + existingWidth + minHorizontalSpacing &&
                newLeft + bubbleWidth + minHorizontalSpacing > existingLeft) {
                overlaps = true;
                break;
            }
        }
        if (!overlaps) {
            break; // Found a non-overlapping position
        }
        attempts++;
    } while (attempts < maxAttempts);

    bubble.style.left = `${newLeft}px`;
    bubble.style.backgroundColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    bubbles.push({ element: bubble, word: word });

    bubble.addEventListener('animationend', () => {
        console.log("Animation ended for bubble: " + bubble.textContent);
        // Check if the bubble was not typed (i.e., still exists in the bubbles array)
        const missedBubbleIndex = bubbles.findIndex(b => b.element === bubble);
        if (missedBubbleIndex !== -1) {
            console.log("Bubble missed: " + bubble.textContent + ", Clearing input.");
            bubble.remove();
            bubbles.splice(missedBubbleIndex, 1);
            missedWordsBuffer.push(word); // Add missed word to buffer
            typingInput.value = ''; // Clear input box if a bubble is missed
        } else {
            console.log("Bubble was typed: " + bubble.textContent);
        }
        processedWordsCount++; // Increment counter for any processed word
        checkAndReplenishMissedWords();
    });
}

function getBubbleCreationInterval() {
    const selectedDifficulty = difficultySelect.value;
    switch (selectedDifficulty) {
        case 'easy':
            return 3000; // Slower for easy
        case 'normal':
            return 2200; // Default speed
        case 'hard':
            return 1500; // Faster for hard
        default:
            return 2200;
    }
}

function startGame() {
    console.log("startGame called");
    if (!gameInterval) {
        const fixedInterval = 2200; // Fixed interval for bubble creation (e.g., 2.2 seconds)
        gameInterval = setInterval(createBubble, fixedInterval); 
        startBtn.disabled = true;
        stopBtn.disabled = false;
        difficultySelect.disabled = true;
        typingInput.disabled = false;
        typingInput.focus();
        score = 0;
        scoreElement.textContent = score;
    }
}

function stopGame() {
    console.log("stopGame called");
    clearInterval(gameInterval);
    gameInterval = null;
    gameArea.innerHTML = ''; // Clear all bubbles from the game area
    bubbles = [];
    score = 0;
    scoreElement.textContent = score;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    difficultySelect.disabled = false;
    typingInput.disabled = true;
    typingInput.value = '';
}

typingInput.addEventListener('input', () => {
    const typedText = typingInput.value.trim().toLowerCase();
    console.log("Typed text: " + typedText);

    // Remove highlight from all bubbles first
    bubbles.forEach(bubble => {
        bubble.element.classList.remove('highlight');
    });

    let perfectMatchFound = false;
    for (const bubble of bubbles) {
        const bubbleWord = bubble.word.toLowerCase();
        const letterSpans = bubble.element.querySelectorAll('span');

        // Reset all letter colors first
        letterSpans.forEach(span => span.style.color = '');

        if (typedText === bubbleWord) {
            console.log("Perfect match found for: " + bubbleWord);
            bubble.element.classList.add('fade-out');
            setTimeout(() => {
                bubble.element.remove();
                bubbles = bubbles.filter(b => b !== bubble);
                availableWords.push(bubble.word); // Add word back to available words immediately
            }, 300); // Matches the fadeOut animation duration
            score++;
            scoreElement.textContent = score;
            typingInput.value = ''; // Clear input box on perfect match
            perfectMatchFound = true;
            processedWordsCount++; // Increment counter for typed word
            checkAndReplenishMissedWords();
            break; // Exit loop after finding a perfect match
        } else if (bubbleWord.startsWith(typedText) && typedText.length > 0) {
            // Partial match, highlight the bubble and specific letters
            bubble.element.classList.add('highlight');
            console.log("Partial match, highlighting: " + bubbleWord);

            for (let i = 0; i < typedText.length; i++) {
                if (letterSpans[i]) {
                    letterSpans[i].style.color = 'red'; // Highlight typed letters in red
                }
            }
        } else {
            // No match or partial match, remove highlight
            bubble.element.classList.remove('highlight');
        }
    }

    // If a perfect match was found, the input box is already cleared.
    // If no perfect match, but input is empty, ensure no highlights remain.
    if (!perfectMatchFound && typedText.length === 0) {
        bubbles.forEach(bubble => {
            bubble.element.classList.remove('highlight');
            bubble.element.querySelectorAll('span').forEach(span => span.style.color = ''); // Clear letter colors
        });
    }
});

function checkAndReplenishMissedWords() {
    if (processedWordsCount >= wordsToProcessBeforeReappear) {
        console.log(`Replenishing ${missedWordsBuffer.length} missed words.`);
        availableWords.push(...missedWordsBuffer);
        missedWordsBuffer = [];
        processedWordsCount = 0;
    }
}

startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);

console.log("Initial button states: Start disabled = " + startBtn.disabled + ", Stop disabled = " + stopBtn.disabled);
