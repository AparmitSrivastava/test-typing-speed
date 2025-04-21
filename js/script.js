const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector("button");


let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

//  RANDOM PARAGRAPH SETUP 
function randomParagraph() {
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";

    paragraphs[randIndex].split("").forEach(char => {
        typingText.innerHTML += `<span>${char}</span>`;
    });

    typingText.querySelectorAll("span")[0].classList.add("active");

    // Auto focus input on key press or click
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

//  MAIN TYPING FUNCTION 
function initTyping() {
    const characters = typingText.querySelectorAll("span");
    const typedChar = inpField.value.charAt(charIndex);

    // Stop typing if paragraph complete or time is up
    if (charIndex >= characters.length - 1 || timeLeft <= 0) {
        endTypingTest();
        return;
    }

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar === "") {
        handleBackspace(characters);
    } else {
        processTypedChar(typedChar, characters);
        charIndex++;
    }

    updateActiveChar(characters);
    updateStats();
}

//  HANDLE BACKSPACE 
function handleBackspace(characters) {
    if (charIndex > 0) charIndex--;

    const currentChar = characters[charIndex];

    if (currentChar.classList.contains("incorrect")) {
        mistakes--;
    }

    currentChar.classList.remove("correct", "incorrect");
}

//  VALIDATE TYPED CHARACTER 
function processTypedChar(typedChar, characters) {
    const currentChar = characters[charIndex];

    if (typedChar === currentChar.innerText) {
        currentChar.classList.add("correct");
    } else {
        currentChar.classList.add("incorrect");
        mistakes++;
    }
}

//  UPDATE ACTIVE CURSOR 
function updateActiveChar(characters) {
    characters.forEach(span => span.classList.remove("active"));
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    }
}

//  STATS CALCULATION 
function updateStats() {
    const timeSpent = maxTime - timeLeft;
    let wpm = Math.round((((charIndex - mistakes) / 5) / timeSpent) * 60);

    // Edge case handling
    if (wpm < 0 || !wpm || wpm === Infinity) wpm = 0;

    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
}

// TIMER FUNCTION 
function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

// END TYPING TEST 
function endTypingTest() {
    inpField.value = "";
    clearInterval(timer);
}

// RESET GAME FUNCTION 
function resetGame() {
    randomParagraph();
    inpField.value = "";
    clearInterval(timer);

    // Reset values
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;

    // Reset UI
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

// EVENT LISTENERS 
randomParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
