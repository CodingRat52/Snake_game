const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let part of snake) {
        ctx.fillStyle = "lime";
        ctx.fillRect(part.x, part.y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let head = { ...snake[0] };
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snake.some(s => s.x === head.x && s.y === head.y)) {
        clearInterval(game);
        submitScore(score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = spawnFood();
    } else {
        snake.pop();
    }

    drawHighScores();
}

const game = setInterval(draw, 100);

function submitScore(score) {
    fetch('/submit_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: score })
    });
}

function drawHighScores() {
    fetch('/high_scores')
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("highScores");
            ul.innerHTML = "";
            data.forEach(score => {
                const li = document.createElement("li");
                li.innerText = score;
                ul.appendChild(li);
            });
        });
}
