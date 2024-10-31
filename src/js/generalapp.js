const DICE_SIZE = 100;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25 * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;

const reEscalera = /12345|23456|13456/;
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/;
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/;

const game = {
    dados: [0, 0, 0, 0, 0],
    selectedDados : [false, false, false, false, false],
    players: 2,
    turn: 1,
    moves: 1,
    scores:[],
}

const initGame = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.selectedDados = [false, false, false, false, false];
    game.turn = 1;
    game.moves = 1;

    document.querySelectorAll("#dados-container .dado").forEach(dadoElement => {
        dadoElement.addEventListener("click", () => toggleSelection(parseInt(dadoElement.getAttribute("class").replace("dado d", ""))));
    })

    drawDados();
    drawState();
    drawScores();
}

const drawScores = () => {
    const cont = document.querySelector("#j2 .scores table thead tr");
    contHeader.innerHTML = null;
    const cellGameName = document.createElement("td");
    cellGameName.innerHTML = "Juego";
    contHeader.appendChild(cellGameName);
    for (let i = 0; i < game.players.lentgh; i++) {
        const cellPlayerName = document.createElement("th");
        cellPlayerName.innerHTML = `J${i + 1}`; // En la app, uso el nick del jugador guardado
        contHeader.appendChild(cellPlayerName);
    }
    //Juegos
    const contGames = document.querySelector("#j2 .score table tbody tr");
    for (let i = 0; i < 11; i++) {
        const cellGameName = document.createElement("td");
        cellGameName.innerHTML = getGameName(i);
        contGames.appendChild(cellGameName);
        for (let p = 0; p < game.players; p++) {
            const cellPlayerScore = document.createElement("td");
            cellPlayerScore.innerHTML = game.scores[p][i];
            contGames.appendChild(cellPlayerScore);
        }
        contGames.appendChild(contGame);
        contGame.addEventListener("click", () => {
            if (game.dados.some(dado => dado === 0)) { // Todavía no se tiran los dados
                return;
            }
            if (game.scores[game.turn - 1][i] !== " ") { // Juego ya anotado
                alert(`Ya se anotó el juego ${getGameName(i)}`);
                return;
            } else {
                const score = calculateScore(i);
                game.scores[game.turn - 1][i] = score === 0 ? "X" : score; // Puntaje del juego
                game.scores[game.turn]

                drawScores();
                changePlayerTurn();
            }
        }); 
    }
    //Total
    const contTotal = document.createElement("tr");
    const cellTotalName = document.createElement("th");
    cellTotalName.innerHTML = "Total";
    contTotal.appendChild(cellTotalName);
    for (let p = 0; p < game.players; p++) {
        const cellPlayerTotal = document.createElement("td");
        cellPlayerTotal.innerHTML = game.scores[p][11];
        contTotal.appendChild(cellPlayerTotal)
    }
    document.querySelector()
}

const isGameMatch = regex => {
    return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
}

const calculateScore = which => {
    let score = 0;
    switch (whichGame) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    //computar puntaje para los numeros
    break;
    case 6: 
    if (isGameMatch(reEscalera)) {
        score = game.moves === 2 ? 25 : 20;
    }
    break;
    case 7: 
    if (isGameMatch(reFull)) {
        score = game.moves === 1 ? 35 : 30;
    }
    break;
    case 8: 
    if (isGameMatch(rePoker)) {
        score = game.moves === 1 ? 45 : 40;
    }
    break;
    case 9: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 1 ? 55 : 50;
    }
    break;
    case 10: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 1 ? 105 : 100;
    }
    //si conincide con la reGenerala
    //y si es primer tiro devuelve 105, sino 100
    break;
default:
        // Números 1-6
        score = game.dados.filter(dado => dado === whichGame + 1).reduce((acc, cur) => acc + cur, 0);
        break;
    }
    return score;
}

const drawDados = () => {
    game.dados.forEach((dado, i) => {
        const dadoElement = document.querySelector(`#dados-container .d${i}`);
        if (game.selectedDados[i]) {
            dadoElement.classList.add("selected");
        } else {
            dadoElement.classList.remove("selected");
        }
        dadoElement.innerHTML = dado;
    });
}

const drawState = () => {
    document.getElementById("jugador-generala").innerHTML = game.turn;
    document.getElementById("tiros-generala").innerHTML = game.moves;
}


const showDados = (contDiv, number) => {
    contDiv.innerHTML = null;
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", "" + DICE_SIZE);
    canvas.setAttribute("height", "" + DICE_SIZE);
    drawDados(canvas, number);
    contDiv.appendChild(canvas);
}





const tirarDados = () => {
    for (let i = 0; i < game.dados.length; i++) {
        if (game.moves === 1 || game.selectedDados[i]) {
            game.dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
    game.selectedDados = [false, false, false, false, false]; // Reseteo de selección
    drawDados();

    console.log("---");
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(whichGame => console.log(`Game ${getGameName(whichGame)}`))

    game.moves++;
    if (game.moves > 3) {
        game.turn++;
        if (game.turn > game.players) {
            game.turn = 1;
        }
        game.moves = 1;
    }
    drawState();
};

const changePlayerTurn = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.selectedDados = [false, false, false, false, false];
    game.moves = 1;
    game.turn++;
    if (game.turn > game.players){
        game.turn = 1;
    }
    
}

const toggleSelection = dadoNumero => {
    game.selectedDados[dadoNumero] = !game.selectedDados[dadoNumero];
    const dadoElement = document.querySelector(`#dados-container .d${dadoNumero}`);
    if (game.selectedDados[dadoNumero]) {
        dadoElement.classList.add("selected");
    } else {
        dadoElement.classList.remove("selected");
    }
}


document.getElementById("btn-tirar").addEventListener("click", tirarDados);

document.addEventListener("DOMContentLoaded", () => { initGame(); });
