// Game configuration
const GRID_SIZE = 20;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

let gameState = 'menu'; // menu, playing, gameOver
let winCondition = 100;

// Player 1 - Red (Arrow Keys)
let snake1 = [
    { x: 8, y: 15 },
    { x: 7, y: 15 },
    { x: 6, y: 15 }
];
let snake1Direction = { x: 1, y: 0 };
let snake1NextDirection = { x: 1, y: 0 };
let score1 = 0;

// Player 2 - Cyan (WASD)
let snake2 = [
    { x: 22, y: 15 },
    { x: 23, y: 15 },
    { x: 24, y: 15 }
];
let snake2Direction = { x: -1, y: 0 };
let snake2NextDirection = { x: -1, y: 0 };
let score2 = 0;

// Food
let food = generateFood();

// Game loop
let gameSpeed = 100; // milliseconds
let lastMoveTime = 0;
let gameLoopId = null;

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');
const winConditionDisplay = document.getElementById('winCondition');
const winnerAnnouncement = document.getElementById('winnerAnnouncement');
const finalScores = document.getElementById('finalScores');

// Event listeners for difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        winCondition = parseInt(e.target.dataset.points);
    });
});

// Set default selection
document.querySelector('[data-points="100"]').click();

// Start button
startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', returnToMenu);

// Keyboard controls
document.addEventListener('keydown', handleKeydown);

function handleKeydown(event) {
    if (gameState !== 'playing') return;

    const key = event.key.toLowerCase();

    // Player 1 - Arrow keys
    if (event.key === 'ArrowUp' && snake1Direction.y === 0) {
        snake1NextDirection = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && snake1Direction.y === 0) {
        snake1NextDirection = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && snake1Direction.x === 0) {
        snake1NextDirection = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && snake1Direction.x === 0) {
        snake1NextDirection = { x: 1, y: 0 };
    }

    // Player 2 - WASD keys
    if (key === 'w' && snake2Direction.y === 0) {
        snake2NextDirection = { x: 0, y: -1 };
    } else if (key === 's' && snake2Direction.y === 0) {
        snake2NextDirection = { x: 0, y: 1 };
    } else if (key === 'a' && snake2Direction.x === 0) {
        snake2NextDirection = { x: -1, y: 0 };
    } else if (key === 'd' && snake2Direction.x === 0) {
        snake2NextDirection = { x: 1, y: 0 };
    }
}

function startGame() {
    gameState = 'playing';
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Reset game state
    snake1 = [{ x: 8, y: 15 }, { x: 7, y: 15 }, { x: 6, y: 15 }];
    snake1Direction = { x: 1, y: 0 };
    snake1NextDirection = { x: 1, y: 0 };
    score1 = 0;

    snake2 = [{ x: 22, y: 15 }, { x: 23, y: 15 }, { x: 24, y: 15 }];
    snake2Direction = { x: -1, y: 0 };
    snake2NextDirection = { x: -1, y: 0 };
    score2 = 0;

    food = generateFood();
    
    winConditionDisplay.textContent = `${winCondition} to win`;
    updateScoreDisplay();

    // Start game loop
    if (gameLoopId) clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    // Update directions
    snake1Direction = snake1NextDirection;
    snake2Direction = snake2NextDirection;

    // Move snakes
    moveSnake(snake1, snake1Direction);
    moveSnake(snake2, snake2Direction);

    // Check food collision
    checkFoodCollision();

    // Check collisions
    if (checkSelfCollision(snake1) || checkBoundaryCollision(snake1)) {
        endGame(2); // Player 2 wins
        return;
    }

    if (checkSelfCollision(snake2) || checkBoundaryCollision(snake2)) {
        endGame(1); // Player 1 wins
        return;
    }

    // Check win condition
    if (score1 >= winCondition) {
        endGame(1);
        return;
    }

    if (score2 >= winCondition) {
        endGame(2);
        return;
    }

    // Draw
    draw();
}

function moveSnake(snake, direction) {
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    snake.unshift(newHead);
    snake.pop();
}

function generateFood() {
    let newFood;
    let validPosition = false;

    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };

        // Check if food is not on any snake body
        const onSnake1 = snake1.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        const onSnake2 = snake2.some(segment => segment.x === newFood.x && segment.y === newFood.y);

        validPosition = !onSnake1 && !onSnake2;
    }

    return newFood;
}

function checkFoodCollision() {
    // Check player 1
    if (snake1[0].x === food.x && snake1[0].y === food.y) {
        score1++;
        updateScoreDisplay();
        // Grow snake 1
        const tail = snake1[snake1.length - 1];
        snake1.push({ x: tail.x, y: tail.y });
        food = generateFood();
        return;
    }

    // Check player 2
    if (snake2[0].x === food.x && snake2[0].y === food.y) {
        score2++;
        updateScoreDisplay();
        // Grow snake 2
        const tail = snake2[snake2.length - 1];
        snake2.push({ x: tail.x, y: tail.y });
        food = generateFood();
    }
}

function checkSelfCollision(snake) {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function checkBoundaryCollision(snake) {
    const head = snake[0];
    return head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT;
}

function updateScoreDisplay() {
    score1Display.textContent = score1;
    score2Display.textContent = score2;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgb(26, 26, 46)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add subtle grid
    drawGrid();

    // Draw snakes
    drawSnake(snake1, '#FF6B6B', '#FF4444');
    drawSnake(snake2, '#4ECDC4', '#2DB8A6');

    // Draw food
    drawFood();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
}

function drawSnake(snake, color, darkColor) {
    snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;

        if (index === 0) {
            // Head
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
            ctx.shadowBlur = 0;

            // Eyes
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 5;

            if (snake === snake1) {
                if (snake1Direction.x > 0) { // Moving right
                    ctx.fillRect(x + eyeOffset + 3, y + 4, eyeSize, eyeSize);
                    ctx.fillRect(x + eyeOffset + 3, y + GRID_SIZE - 7, eyeSize, eyeSize);
                } else if (snake1Direction.x < 0) { // Moving left
                    ctx.fillRect(x + eyeOffset - 3, y + 4, eyeSize, eyeSize);
                    ctx.fillRect(x + eyeOffset - 3, y + GRID_SIZE - 7, eyeSize, eyeSize);
                } else if (snake1Direction.y > 0) { // Moving down
                    ctx.fillRect(x + 4, y + eyeOffset + 3, eyeSize, eyeSize);
                    ctx.fillRect(x + GRID_SIZE - 7, y + eyeOffset + 3, eyeSize, eyeSize);
                } else { // Moving up
                    ctx.fillRect(x + 4, y + eyeOffset - 3, eyeSize, eyeSize);
                    ctx.fillRect(x + GRID_SIZE - 7, y + eyeOffset - 3, eyeSize, eyeSize);
                }
            }
        } else {
            // Body - gradient effect
            const opacity = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
            ctx.fillRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);

            // Body outline
            ctx.strokeStyle = darkColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
        }
    });
}

function drawFood() {
    const x = food.x * GRID_SIZE;
    const y = food.y * GRID_SIZE;

    // Glowing effect
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 + 3, 0, Math.PI * 2);
    ctx.fill();

    // Food apple
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFA500';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x + GRID_SIZE / 2 - 2, y + GRID_SIZE / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function endGame(winner) {
    clearInterval(gameLoopId);
    gameState = 'gameOver';

    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');

    const winnerText = winner === 1 ? 'Player 1 Wins! 🎉' : 'Player 2 Wins! 🎉';
    const winnerClass = winner === 1 ? 'player1' : 'player2';

    winnerAnnouncement.textContent = winnerText;
    winnerAnnouncement.className = `winner-announcement ${winnerClass}`;

    finalScores.innerHTML = `
        <div>Player 1 (Red): <strong>${score1}</strong> points</div>
        <div>Player 2 (Cyan): <strong>${score2}</strong> points</div>
        <div style="margin-top: 20px; font-size: 1.1em;">Win Condition: <strong>${winCondition}</strong> points</div>
    `;
}

function returnToMenu() {
    gameState = 'menu';
    gameOverScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    clearInterval(gameLoopId);
}

// Initial draw
draw();
