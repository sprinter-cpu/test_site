let currentQuestion = 0;
let timeLeft = 5;
let quizTitle = "";
let questions = [];

function initializeQuiz() {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startButton = document.getElementById('start-button');
    const quizTitleInput = document.getElementById('quiz-title');
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const quizFileInput = document.getElementById('quiz-file');

    quizFileInput.addEventListener('change', handleFileUpload);

    startButton.addEventListener('click', () => {
        if (questions.length > 0) {
            quizTitle = quizTitleInput.value.trim() || "Custom Quiz";
            quizTitleDisplay.textContent = quizTitle;
            startScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            loadQuestion();
        } else {
            alert('Please upload a valid JSON file with quiz questions before starting.');
        }
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            questions = JSON.parse(e.target.result);
            if (Array.isArray(questions) && questions.length > 0) {
                document.getElementById('start-button').disabled = false;
            } else {
                throw new Error('Invalid quiz format');
            }
        } catch (error) {
            alert('Invalid JSON file. Please upload a valid JSON file with quiz questions.');
            document.getElementById('start-button').disabled = true;
            questions = [];
        }
    };

    reader.readAsText(file);
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const questionEl = document.querySelector('.question');
    const optionsEl = document.querySelector('.options');
    const timerBar = document.querySelector('.timer-bar');

    questionEl.textContent = questions[currentQuestion].question;
    optionsEl.innerHTML = '';

    questions[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsEl.appendChild(button);
    });

    timeLeft = 5;
    timerBar.style.width = '100%';
    startTimer();
}

function startTimer() {
    const timerBar = document.querySelector('.timer-bar');
    timerBar.style.width = '0%';

    setTimeout(() => {
        if (timeLeft > 0) {
            timeLeft--;
            startTimer();
        } else {
            checkAnswer(-1);
        }
    }, 5000);
}

function checkAnswer(selectedIndex) {
    const options = document.querySelectorAll('.option');
    const correctIndex = questions[currentQuestion].correctAnswer;

    options[correctIndex].classList.add('correct');

    if (selectedIndex === correctIndex) {
        // Correct answer logic
    } else {
        // Incorrect answer logic
    }

    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 2000);
}

function endQuiz() {
    const quizScreen = document.getElementById('quiz-screen');
    quizScreen.innerHTML = '<h1>Quiz Completed!</h1><p>Thank you for playing!</p>';
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);