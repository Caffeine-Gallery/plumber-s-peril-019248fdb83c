import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoresList = document.getElementById('highScoresList');

// Game variables
let player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    speed: 5,
    jumpForce: 10,
    velocityY: 0,
    isJumping: false
};

let platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 300, y: 200, width: 200, height: 20 },
    { x: 500, y: 100, width: 200, height: 20 }
];

let score = 0;
let gameLoop;

// Game functions
function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys.ArrowUp && !player.isJumping) {
        player.velocityY = -player.jumpForce;
        player.isJumping = true;
    }

    player.velocityY += 0.5; // Gravity
    player.y += player.velocityY;

    // Collision detection with platforms
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height
        ) {
            if (player.velocityY > 0) {
                player.isJumping = false;
                player.velocityY = 0;
                player.y = platform.y - player.height;
            }
        }
    });

    // Prevent player from falling through the bottom
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }
}

function updateScore() {
    score++;
    scoreElement.textContent = score;
}

function gameOver() {
    clearInterval(gameLoop);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    
    const playerName = prompt('Enter your name for the high score:');
    if (playerName) {
        backend.addHighScore(playerName, score).then(() => {
            updateHighScores();
        });
    }
}

function updateHighScores() {
    backend.getHighScores().then(highScores => {
        highScoresList.innerHTML = '';
        highScores.forEach(([name, score]) => {
            const li = document.createElement('li');
            li.textContent = `${name}: ${score}`;
            highScoresList.appendChild(li);
        });
    });
}

function gameUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    movePlayer();
    updateScore();

    if (player.y > canvas.height) {
        gameOver();
    }
}

// Keyboard input
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Start game
function startGame() {
    updateHighScores();
    gameLoop = setInterval(gameUpdate, 1000 / 60); // 60 FPS
}

startGame();
