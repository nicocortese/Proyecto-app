const topoGameContainer = document.getElementById("topo-game-container");

let canvas;
let ctx;
let scoreDisplay;
let timeDisplay;
let startButton;
let mole;

const restartButton = document.getElementById("resetTopoGame");
const modalGameOver = document.getElementById("modalTopoGameover");
const gameOverMessage = document.getElementById("topoGameoverMsg");

//inicialización del juego
let gameInitialized = false;

const NUM_HOLES = 9;
const HOLE_RADIUS = 50;
const MOLE_SIZE = 40;
const CANVAS_SIZE = 450;
const GRID_ROWS_COLS = 3;

let score = 0;
let time = 60;
let gameInterval;
let moleInterval;
let activeMole = -1;
let gameRunning = false;

const holePositions = [];

// Funciones de creación de elementos y dibujo, reinicio de la interfaz

function createGameElements () {
    topoGameContainer.innerHTML = '';
    topoGameContainer.style.position = "relative";

    // div de info (puntuación y tiempo)
    const gameInfo = document.createElement("div");
    gameInfo.classList.add("gameInfo");

    const pScore = document.createElement("p");
    pScore.innerHTML = 'Puntaje: <span id="score-display">0</span>';
    scoreDisplay = pScore.querySelector("#score-display");

    const pTime = document.createElement("p");
    pTime.innerHTML = 'Tiempo: <span id="time-display">30</span>s';
    timeDisplay = pTime.querySelector("#time-display");

    gameInfo.appendChild(pScore);
    gameInfo.appendChild(pTime);



// creo el canvas
canvas = document.createElement("canvas");
canvas.id = 'gameCanvas';
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
ctx = canvas.getContext("2d");

// botón para comenzar el juego
startButton = document.createElement("button");
startButton.id = "startGame";
startButton.textContent = "Empezar juego";

//topo
mole = document.createElement("img");
mole.src = "src/assets/topo.png";
mole.classList.add("moleImg");
mole.style.position = "absolute";
mole.width = `${MOLE_SIZE}px`;
mole.height = `${MOLE_SIZE}px`;
mole.style.display = "none";
mole.style.pointerEvents = "auto";

// añado los elementos al contenedor principal
topoGameContainer.appendChild(gameInfo);
topoGameContainer.appendChild(canvas);
topoGameContainer.appendChild(startButton);
topoGameContainer.appendChild(mole);

mole.addEventListener('click', handleMoleClick);
}


function drawCircle (x, y, radius, color) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawHole (x, y) {
    drawCircle(x, y, HOLE_RADIUS, '#5A3825');
}


function drawGame() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    holePositions.forEach(({ x, y }) => drawHole(x, y));

}
// logica del juego, calculo y almaceno las posiciones centrales de cada hoyo en el canvas
function setupHoles() {
    holePositions.length = 0;
    const cellWidth = CANVAS_SIZE / GRID_ROWS_COLS;
    const cellHeight = CANVAS_SIZE / GRID_ROWS_COLS;

    for (let row = 0; row < GRID_ROWS_COLS; row++) {
        for (let col = 0; col < GRID_ROWS_COLS; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        holePositions.push({ x, y });
        }
    } 
}

function popUpMole () {
    if (!gameRunning) return;

    let newMole;
    do {
        newMole = Math.floor(Math.random() * NUM_HOLES);
    } while (newMole === activeMole);

    activeMole = newMole;

    //coordenadas donde aparecerá el topo
    const { x, y } = holePositions[activeMole];
    mole.style.left = `${x - MOLE_SIZE / 2}px`;
    mole.style.top = `${y - MOLE_SIZE / 2}px`;
    mole.style.display = "block";

    const popUpTime = Math.random() * 1000 + 500;
    setTimeout(() => {
        activeMole = -1
        mole.style.display = "none";
    }, popUpTime);
}

function handleMoleClick(event) {
    if (!gameRunning || activeMole === -1) return;

    score++;
    if (scoreDisplay) scoreDisplay.textContent = score;
    activeMole = -1;
    mole.style.display = "none";
}

function timer() {
    time = 60;
    if (timeDisplay) timeDisplay.textContent = time;
    gameInterval = setInterval(() => {
        time--;
        if (timeDisplay) timeDisplay.textContent = time;
        if (time <= 0) {
            finGame(true)
        }
    }, 1000) 
}

// nuevapartida 
function startGame() {
    score = 0;
    if (scoreDisplay) scoreDisplay.textContent = score;
    time = 60;
    if (timeDisplay) timeDisplay.textContent = time;
    gameRunning = true;
    if (startButton) startButton.disabled = true;
    modalGameOver.style.display = "none";

    clearInterval(gameInterval);
    clearInterval(moleInterval);

    timer();
    moleInterval = setInterval(popUpMole, Math.random() * 800 + 700);

    drawGame();
}
// fin de la partida
window.finGame = (finTime = false) => {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    activeMole = -1;
    if (mole) {
        mole.style.display = "none";
    }
    drawGame();

    if (startButton) startButton.disabled = false;

    if (finTime) {
        gameOverMessage.textContent = `¡Se te acabó el tiempo! Tu puntaje final es: ${score}`;
        modalGameOver.style.display = "flex";
    } else {
        modalGameOver.style.display = "none";
    }
}

//reseteo 
window.initScreen = () => {
    if (!gameInitialized) {
        createGameElements();
        setupHoles();
        gameInitialized = true;
    }

    score = 0;
    time = 60;
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (timeDisplay) timeDisplay.textContent = time;
    if (startButton) startButton.disabled = true;

    clearInterval(gameInterval);
    clearInterval(moleInterval);
    gameRunning = false;
    activeMole = -1;

    if(mole) {
        mole.style.display = "none";
    }
    drawGame();
    modalGameOver.style.display = "none";

    if (startButton) {
        startButton.removeEventListener("click", startGame);
        startButton.addEventListener("click", startGame);
    }
    if (restartButton) {
        restartButton.removeEventListener("click", startGame);
        restartButton.addEventListener("click", startGame);
    }
}
