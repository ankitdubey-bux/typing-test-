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
    "Internationally, the Institute promotes source water protection and “green infrastructure” solutions in order to increase the climate resiliency of water systems and improve ecosystem function. The Institute collects, catalogues, and shares good practice examples of nature-based solutions; catalyzes investment in green infrastructure projects; and connects stakeholders with a common interest in advancing nature-based solutions.",
    "After high school there are numerous things I want to do and accomplish in my life. I want to attend college and law school. After I start working for a few years, I plan to settle down, get married, and have children. I still want to have a career, but I want to raise a family too. I’m not sure what will happen after this or that even this will take place because I can’t really plan out my life",
    "Life is an unpredictable thing. There are many obstacles that may get in the way of perusing my goals. Some of the obstacles are college and law school. It takes a lot of studying, hard work, and determination in becoming a lawyer. With hard work and determinationI plan to accomplish my goals, whatever they may be, and live up to my full potential.",
    "Life in the city is full of activity. Early in the morning hundreds of people rush out of their homes in the manner ants do when theirnest is broken. Soon the streets are full of traffic. Shops and offices open, students flock to their schools and the day’s work begins. The city now throb with activity, and it isfull of noise. Hundreds of sight-seers, tourists and others visit many places of interest in the city while businessmen from various parts of the world arrive to transact business.Then towards evening, the offices and day schools begin to close.",
    "Many of the shops too close. There is now a rush for buses and other means of transport. Everyone seems to be in a hurry to reach home.As a result of this rush, many accidents occur. The city could, therefore, be described as a place of ceaseless activity. Here, the drama of life is enacted every day",
    "Living in a community where there are people of various races could be a rewarding and an exciting experience. Such a community is like a small world with many types and races of people in it. Everyone, young orold, enjoys listening to stories about people in other lands. We read books and newspapersto learn about the habits, customs and beliefs) of people who do not belong to our race, but when we live in a community composed of many races, we have the opportunity to meet and talk with people or various races",
    "A few months ago my father and I visited Singapore, one of the most famous cities in Asia. Singapore, a small island, lies at the southern and of West Malaysia. A long and narrow piece of land joins Singapore with Johore Hahru, the southern-most town of West Malaysia. Singapore is now an independent. The city of Singapore is extremely beautiful. It iswell known for its centres of business and other activities. There are many places of interest such as the Tiger Balm Garden, the Botanical Gardens and Raffles Museum.",
    "Seldom does one have opportunity of seeing a fight between a tiger and a crocodile. I, however, had this opportunity one day when I went with my father into a forest in search of some wild plants. I had never been to a forest before. Therefore, whatever I saw in the forest interested me greatly. I looked ạt the rich vegetation all round as well as the variety of colourful flowers and birds, large and small.",
    "A good library is an ocean of information, whose boundaries continue to extend with the endless contribution of the numerous streams of knowledge. Thus, it has a peculiar fascination for scholars, and all those whose thirst for knowledge is instable. The usefulness of libraries in the spread of knowledge has been proved through the years. The field of knowledge is so extensive and life is so brief that even the most avid reader can never expect to absorb it all. Those who have alove for knowledge, therefore, try to master only a small fraction of it. Even this requires reading of hundreds of books, cheap and expensive, new and old. But few people are ableto buy all the books on the subject in which they wish to attain proficiency. It is therefore necessary for them to visit a good library."
    
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

restBtn.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
      updateParagraph();
  }
});
