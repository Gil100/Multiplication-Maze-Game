let playerName = '';
let currentLevel = '';
let score = 0;
let timer = 0;
let timerInterval;
let questionCount = 0;
let playerPosition = { x: 0, y: 0 }; // השחקן מתחיל בקצה הימני
let mazeSize = { width: 12, height: 1 }; // מבוך 12x1
let princessPosition = { x: 11, y: 0 }; // הנסיכה בצד שמאל

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
    resetPlayerPosition();
    generateMaze();
    startTimer();
    generateQuestion();
}

function resetPlayerPosition() {
    playerPosition = { x: 0, y: 0 }; // מאתחל את השחקן בקצה הימני
    questionCount = 0;
    updatePlayerPosition();
}

function generateMaze() {
    $('#maze').empty();
    $('#maze').append('<div id="player"></div>');
    $('#maze').append('<div id="princess"></div>');
    updatePlayerPosition();
    updatePrincessPosition();
}

function updatePlayerPosition() {
    const cellSize = 50; // פיקסלים
    $('#player').css({
        left: `${playerPosition.x * cellSize}px`,
        top: '0px'
    });
}

function updatePrincessPosition() {
    const cellSize = 50; // פיקסלים
    $('#princess').css({
        right: '0px',
        top: '0px'
    });
}

function startTimer() {
    timer = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        $('#time').text(timer);
    }, 1000);
}

function generateQuestion() {
    let num1, num2;
    switch (currentLevel) {
        case 'מתחיל':
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            break;
        case 'מתקדם':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case 'מאתגר':
            num1 = Math.floor(Math.random() * 6) + 5;
            num2 = Math.floor(Math.random() * 6) + 5;
            break;
        case 'בונוס':
            num1 = Math.floor(Math.random() * 11) + 5;
            num2 = Math.floor(Math.random() * 11) + 5;
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
        score += Math.max(100 - timer, 10);
        $('#points').text(score);
        movePlayerForward();
        questionCount++;
        if (questionCount >= 12 || playerReachedPrincess()) {
            endGame();
        } else {
            generateQuestion();
        }
    } else {
        alert('תשובה לא נכונה. נסה שוב!');
        movePlayerBackward();
    }
}

function movePlayerForward() {
    if (playerPosition.x < mazeSize.width - 1) {
        playerPosition.x++;
    }
    updatePlayerPosition();
}

function movePlayerBackward() {
    if (playerPosition.x > 0) {
        playerPosition.x--;
        updatePlayerPosition();
    }
}

function playerReachedPrincess() {
    return playerPosition.x === princessPosition.x;
}

function endGame() {
    clearInterval(timerInterval);
    $('#game-screen').addClass('hidden');
    $('#end-screen').removeClass('hidden');
    $('#end-message').text(`כל הכבוד ${playerName}! הצלחת להציל את הנסיכה`);
    $('#final-score').text(`השגת את הניקוד ${score}`);
}

function saveProgress() {
    const progress = {
        playerName,
        currentLevel,
        score,
        playerPosition,
        questionCount
    };
    localStorage.setItem('mazeGameProgress', JSON.stringify(progress));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('mazeGameProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        playerName = progress.playerName;
        currentLevel = progress.currentLevel;
        score = progress.score;
        playerPosition = progress.playerPosition;
        questionCount = progress.questionCount;
        updatePlayerPosition();
    }
}
