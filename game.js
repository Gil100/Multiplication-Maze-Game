let playerName = '';
let currentLevel = '';
let score = 0;
let timer = 60; // דקה אחת = 60 שניות
let timerInterval;

$(document).ready(() => {
    $('#start-game').click(startGame);
    $('#play-again').click(() => location.reload());
});

function startGame() {
    playerName = $('#player-name').val();
    if (playerName) {
        $('#start-screen').addClass('hidden');
        $('#level-selection').removeClass('hidden');
        generateLevelOptions();
    } else {
        alert('אנא הכנס את שמך');
    }
}

function generateLevelOptions() {
    const levels = ['מתחיל', 'מתקדם', 'מאתגר', 'בונוס'];
    $('#level-options').empty();
    levels.forEach(level => {
        $('#level-options').append(`<div class="level-option" onclick="selectLevel('${level}')">${level}</div>`);
    });
}

function selectLevel(level) {
    currentLevel = level;
    $('#level-selection').addClass('hidden');
    $('#game-screen').removeClass('hidden');
    startLevel();
}

function startLevel() {
    startTimer();
    generateQuestion();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const seconds = timer % 60;
    $('#time').text(`0:${seconds.toString().padStart(2, '0')}`);
}

function generateQuestion() {
    let num1, num2;
    switch (currentLevel) {
        case 'מתחיל':
            num1 = Math.floor(Math.random() * 10) + 1; // 1-10
            num2 = Math.floor(Math.random() * 10) + 1; // 1-10
            break;
        case 'מתקדם':
            num1 = Math.floor(Math.random() * 6) + 5; // 5-10
            num2 = Math.floor(Math.random() * 6) + 5; // 5-10
            break;
        case 'מאתגר':
            num1 = Math.floor(Math.random() * 11) + 5; // 5-15
            num2 = Math.floor(Math.random() * 11) + 5; // 5-15
            break;
        case 'בונוס':
            num1 = Math.floor(Math.random() * 10) + 11; // 11-20
            num2 = Math.floor(Math.random() * 10) + 11; // 11-20
            break;
    }
    
    const correctAnswer = num1 * num2;
    const question = `${num1} × ${num2} = ?`;
    
    $('#question').text(question);
    
    const answers = generateAnswers(correctAnswer);
    $('#answers').empty();
    answers.forEach(answer => {
        $('#answers').append(`<button onclick="checkAnswer(${answer}, ${correctAnswer})">${answer}</button>`);
    });
}

function generateAnswers(correctAnswer) {
    let answers = [correctAnswer];
    while (answers.length < 4) {
        let wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    return answers.sort(() => Math.random() - 0.5);
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score += 50;
    } else {
        score = Math.max(0, score - 10);
    }
    $('#points').text(score);
    generateQuestion();
}

function endGame() {
    clearInterval(timerInterval);
    $('#game-screen').addClass('hidden');
    $('#end-screen').removeClass('hidden');
    $('#end-message').text(`כל הכבוד ${playerName}, בחרת רמת קושי ${currentLevel} והצלחת להשיג ${score} נקודות בדקה אחת!`);
}

function saveProgress() {
    const progress = {
        playerName,
        currentLevel,
        score
    };
    localStorage.setItem('multiplicationGameProgress', JSON.stringify(progress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('multiplicationGameProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        playerName = progress.playerName;
        currentLevel = progress.currentLevel;
        score = progress.score;
    }
}
