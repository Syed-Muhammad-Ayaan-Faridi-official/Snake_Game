const board = document.querySelector(".board");
const blockheight = 30;
const blockwidth = 30;
const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

const StartButton = document.querySelector(".btn-start");
const RestartButton = document.querySelector(".btn-restart");

const HighScore = document.querySelector("#HighScore");
const Score = document.querySelector("#score");
const time = document.querySelector("#time");

let head = null;
let hs = 0;
let score = 0;
let direction = "right";
let IntervalID = null;
let TimeID =null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
let blocks = [];
const snake = [{x: 9, y: 9,}, {x: 9, y: 8,}];

localStorage.setItem("HighScore",hs);

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function renderSnake() {
    blocks[`${food.x}-${food.y}`].classList.add("goal");
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(IntervalID);
        clearInterval(TimeID);
        document.querySelector(".model").style.display = "flex";
        document.querySelector(".start-game").style.display = "none";
        document.querySelector(".game-over").style.display = "flex";
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("goal");
        snake.push({ x: food.x, y: food.y });
        Score.textContent = ++score;
        calculateHighScore();
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("goal");
    }

    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
    })
    snake.unshift(head);
    snake.pop();

    snake.forEach(element => {
        blocks[`${element.x}-${element.y}`].classList.add("fill");
    });
}

function Movement() {
    addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            direction = "up";
        } else if (event.key === "ArrowDown") {
            direction = "down";
        } else if (event.key === "ArrowRight") {
            direction = "right";
        } else if (event.key === "ArrowLeft") {
            direction = "left";
        }
    });
}

function calculateHighScore() {
    if (score >= localStorage.getItem("HighScore")) {
        hs = score;
        localStorage.setItem("HighScore",hs);
    }
}

StartButton.addEventListener("click", (event) => {
    document.querySelector(".model").classList.add("hide");
    // Rendering snake initially
    snake.forEach(element => {
        blocks[`${element.x}-${element.y}`].classList.add("fill");
    });
    //Add interval
    IntervalID = setInterval(() => {
        Movement();
        renderSnake();
    }, 300);
    TimeID = setInterval(()=>{
        let [min,sec] = time.textContent.split("-").map(Number)
        if (sec == 59) {
            min+=1;
            sec = 0;
        }else{
            sec+=1;
        }
        time.textContent = `${min}-${sec}`;
    },1000);
})

RestartButton.addEventListener("click", () => {
    clearInterval(IntervalID);

    document.querySelector(".model").style.display = "none";
    HighScore.textContent = localStorage.getItem("HighScore");
    // Clear board
    Object.values(blocks).forEach(block => {
        block.classList.remove("fill", "goal");
    });

    // Reset snake
    snake.length = 0;
    snake.push(
        { x: 9, y: 9 },
        { x: 9, y: 8 }
    );

    // Reset state
    direction = "right";
    score = 0;
    Score.textContent = score;
    time.textContent = `00-00`;

    // New food
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    // Draw initial snake
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.add("fill");
    });

    blocks[`${food.x}-${food.y}`].classList.add("goal");

    // Start game again
    IntervalID = setInterval(() => {
        renderSnake();
    }, 300);

    TimeID = setInterval(()=>{
        let [min,sec] = time.textContent.split("-").map(Number)
        if (sec == 59) {
            min+=1;
            sec = 0;
        }else{
            sec+=1;
        }
        time.textContent = `${min}-${sec}`;
    },1000);
});