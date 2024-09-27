let currentQuestion = 0;
let timeLeft = 5;
let quizTitle = "";
let questions = [];
let timerInterval;

function initializeQuiz() {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startButton = document.getElementById('start-button');
    const quizTitleInput = document.getElementById('quiz-title');
    const quizTitleDisplay = document.getElementById('quiz-title-display');

    // Load questions from local JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            startButton.disabled = false;
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Failed to load quiz questions. Please try again later.');
        });

    startButton.addEventListener('click', () => {
        quizTitle = quizTitleInput.value.trim() || "Custom Quiz";
        quizTitleDisplay.textContent = quizTitle;
        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        loadQuestion();
    });
}

// Remove handleFileUpload function as it's no longer needed

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const questionEl = document.querySelector('.question');
    const optionsEl = document.querySelector('.options');
    const timerBar = document.querySelector('.timer-bar');

    if (!questionEl || !optionsEl || !timerBar) {
        console.error('Required elements not found');
        return;
    }

    questionEl.textContent = questions[currentQuestion].question;
    optionsEl.innerHTML = '';

    questions[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsEl.appendChild(button);
    });

    startTimer(); // Start the timer for each question
}

function startTimer() {
    const timerBar = document.querySelector('.timer-bar');
    if (!timerBar) {
        console.error('Timer bar element not found');
        return;
    }
    
    // Reset the timer bar
    timerBar.style.transition = 'none';
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = '#4CAF50'; // Green
    
    // Force a reflow to ensure the reset is applied
    timerBar.offsetHeight;
    
    // Start the animation
    timerBar.style.transition = 'width 5s linear, background-color 0.5s ease';
    timerBar.style.width = '0%';

    timeLeft = 5;
    clearInterval(timerInterval); // Clear any existing interval
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerColor(timerBar, timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(-1); // Time's up, move to next question
        }
    }, 1000);
}

function updateTimerColor(timerBar, timeLeft) {
    if (timeLeft <= 1) {
        timerBar.style.backgroundColor = '#FF0000'; // Red
    } else if (timeLeft <= 3) {
        timerBar.style.backgroundColor = '#FFA500'; // Yellow
    }
}

function checkAnswer(selectedIndex) {
    clearInterval(timerInterval); // Stop the timer
    const timerBar = document.querySelector('.timer-bar');
    if (timerBar) {
        timerBar.style.transition = 'none';
        timerBar.style.width = '0%';
        timerBar.style.backgroundColor = '#FF0000'; // Red when time's up
    }

    const options = document.querySelectorAll('.option');
    const correctIndex = questions[currentQuestion].correctAnswer;

    options[correctIndex].classList.add('correct');

    if (selectedIndex === correctIndex) {
        // Correct answer logic
    } else {
        // Incorrect answer logic
    }

    // Disable all options after an answer is selected
    options.forEach(option => option.disabled = true);

    // Display the image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const image = document.createElement('img');
    image.src = questions[currentQuestion].image;
    image.alt = 'Question Image';
    imageContainer.appendChild(image);
    document.querySelector('.quiz-container').appendChild(imageContainer);

    setTimeout(() => {
        currentQuestion++;
        // Remove the image before loading the next question
        imageContainer.remove();
        loadQuestion();
    }, 2000);
}

function endQuiz() {
    const quizScreen = document.getElementById('quiz-screen');
    quizScreen.innerHTML = '<h1>Quiz Completed!</h1><p>Thank you for playing!</p>';
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);