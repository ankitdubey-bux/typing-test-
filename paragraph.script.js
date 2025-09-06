const paragraphEl = document.getElementById('paragraph');
const inputEl = document.getElementById('input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');

let timer;
let time = 0;
let isTyping = false;

const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet. It is often used to test typewriters and computer keyboards.",
    "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages, such as Python, JavaScript, and C++.",
    "The sun is a star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process.",
    "Pollution is the introduction of substances that contaminate and poison the environment. Pollution can come from chemical waste dumped into rivers, factories spewing toxins into the air, scavengers burning e-waste to extract valuable components, industrial accidents, and many other sources.",
    "Pollution is a death sentence in poor countries, where poisoned communities cannot afford to clean up toxic pollution, cannot afford to move, and cannot afford to demand change.  Even if the cause of pollution, say a factory, is closed down, the contamination often remains. This is called legacy pollution pollution that continues to poison even through the source is gone.",
    "The world’s water resources are under increasing threat from the impacts of climate change, population growth, and pollution. As the global population grows, a persistent challenge is how to access enough water to meet humanity’s needs while also preserving the integrity of aquatic ecosystems. The Pacific Institute works on water resource issues around the globe, collaborating with stakeholders to ensure communities and nature have the water they need to thrive now and in the future.",
    "Internationally, the Institute promotes source water protection and “green infrastructure” solutions in order to increase the climate resiliency of water systems and improve ecosystem function. The Institute collects, catalogues, and shares good practice examples of nature-based solutions; catalyzes investment in green infrastructure projects; and connects stakeholders with a common interest in advancing nature-based solutions."
];

function getRandomParagraph() {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function updateParagraph() {
    const paragraph = getRandomParagraph();
    paragraphEl.innerHTML = '';
    paragraph.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        paragraphEl.appendChild(span);
    });
}

function startTimer() {
    isTyping = true;
    time = 0;
    timer = setInterval(() => {
        time++;
        timeEl.innerText = time;
        calculateWPM();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isTyping = false;
}

function calculateWPM() {
    const wordsTyped = inputEl.value.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / time) * 60);
    wpmEl.innerText = wpm || 0;
}

function calculateAccuracy() {
    const paragraphChars = paragraphEl.querySelectorAll('span');
    const inputChars = inputEl.value.split('');
    let correctChars = 0;

    paragraphChars.forEach((charSpan, index) => {
        if (inputChars[index] == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (inputChars[index] === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
        }
    });

    const accuracy = Math.round((correctChars / inputChars.length) * 100);
    accuracyEl.innerText = accuracy || 100;

    if (inputChars.length === paragraphChars.length) {
        stopTimer();
    }
}

function resetTest() {
    stopTimer();
    inputEl.value = '';
    timeEl.innerText = 0;
    wpmEl.innerText = 0;
    accuracyEl.innerText = 100;
    updateParagraph();
}

inputEl.addEventListener('input', () => {
    if (!isTyping) {
        startTimer();
    }
    calculateAccuracy();
});

resetBtn.addEventListener('click', resetTest);

updateParagraph();