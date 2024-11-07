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
    round: 1,
}

const initGame = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.selectedDados = [false, false, false, false, false];
    game.turn = 1;
    game.moves = 0;
    game.scores = [];

    /*for (let p = 0; i < game.players; i++){
        game.scores.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 0]);
    }*/
   for (let p = 0; p < game.players; p++){
    game.scores[p] = Array(12).fill ("-"); // Arreglo para cada jugador con 12 espacios vacíos
    game.scores[p][11] = 0; // Establecer el total (última posición) en 0
   }

   document.querySelectorAll(".dados-container .dado").forEach((dadoElement, i) => {
    dadoElement.addEventListener("click", () => toggleDadoSelection(i));
    /*document.querySelectorAll(".dado-container .dado").forEach(dadoElement => {
        dadoElement.addEventListener("click", () => toggleDadoSelection(parseInt(dadoElement.getAttribute("class").replace("dado d", ""))));*/

});

    drawDados();
    drawState();
    drawScores();
}

const drawScores = () => {
    // Encabezado tabla
    const contHeader = document.querySelector("#j2 .scores table thead tr");
    contHeader.innerHTML = null;
    const cellGame = document.createElement("th");
    cellGame.innerHTML = "Juego";
    contHeader.appendChild(cellGame);

    for (let i = 0; i < game.players; i++) {
        const cellPlayerName = document.createElement("th");
        cellPlayerName.innerHTML = `J${i + 1}`; // Usa el nick guardado en la app en vez de `J1`
        contHeader.appendChild(cellPlayerName);
    }

    // Filas de juegos y puntajes
    const contGames = document.querySelector("#j2 .scores table tbody");
    contGames.innerHTML = null;

    for (let i = 0; i < 11; i++) {
        const contGame = document.createElement("tr");
        const cellGameName = document.createElement("th");
        cellGameName.innerHTML = getGameName(i);
        contGame.appendChild(cellGameName);

        for (let p = 0; p < game.players; p++) {
            const cellPlayerScore = document.createElement("td");
            cellPlayerScore.innerHTML = game.scores[p][i];
            contGame.appendChild(cellPlayerScore);
        }
        contGames.appendChild(contGame);
        contGame.addEventListener("click", () => {
            if(game.dados.some(dado => dado === 0)) { // Todavía no se tiraron los dados
                return;
            }
            if (game.scores[game.turn - 1][i] !== "-") { // Juego ya anotado
                alert(`Ya se anotó el juego ${getGameName(i)}`);
                return;
            } else {
                const score = calculateScore(i);
                game.scores[game.turn - 1][i] = score === 0 ? "X" : score; // Puntaje del juego
                game.scores[game.turn -1][11] += score; // Puntaje total del jugador
                drawScores();
                changePlayerTurn();
            }
        })
    }

    // Total
    const contTotal = document.createElement("tr");
    const cellTotalName = document.createElement("th");
    cellTotalName.innerHTML = "Total";
    contTotal.appendChild(cellTotalName);

    for (let p = 0; p < game.players; p++) {
        const cellPlayerTotal = document.createElement("td");
        cellPlayerTotal.innerHTML = game.scores[p][11];
        contTotal.appendChild(cellPlayerTotal);
    }
    contGames.appendChild(contTotal);
};


const isGameMatch = regex => {
    return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
}

const drawDados = () => {
    game.dados.forEach((dado, i) => {
        const dadoElement = document.querySelector(`.dados-container .dado.d${i}`);
        if (game.selectedDados[i]) {
            dadoElement.classList.add("selected");
        } else {
            dadoElement.classList.remove("selected");
        }
        showDado(dadoElement, dado);
    });
}


const calculateScore = which => {
    let score = 0;
    switch (which) {
    case 6: 
    if (isGameMatch(reEscalera)) {
        score = game.moves === 2 ? 25 : 20;
    }
    //si conincide con la reEscalera
    //y si es primer tiro devuelve 25, sino 20
    break;
    case 7: 
    if (isGameMatch(reFull)) {
        score = game.moves === 2 ? 35 : 30;
    }
    //si conincide con el reFull
    //y si es primer tiro devuelve 35, sino 30
        break;
    case 8: 
    if (isGameMatch(rePoker)) {
        score = game.moves === 2 ? 45 : 40;
    }
    //si conincide con el rePoker
    //y si es primer tiro devuelve 45, sino 40
        break;
    case 9: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 55 : 50;
    }
    //si conincide con la reGenerala
    //y si es primer tiro devuelve 55, sino 50
        break;
    case 10: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 105 : 100;
    }
    //si conincide con la reGenerala
    //y si es primer tiro devuelve 105, sino 100
        break;
  
        default: // Números 1-6
        score = (which + 1) * game.dados.filter(dado => dado - 1 === which).length;
        // game.dados.filter(dado => dado === which + 1).reduce((acc, cur) => acc + cur, 0);
        // Selecciono los dados que quiero y los pone en otro array
        break;
    }
    return score;
}


const drawState = () => {
    document.getElementById("jugador-generala").innerHTML = game.turn;
    document.getElementById("tiros-generala").innerHTML = game.moves;
}



const tirarDados = () => {
    for (let i = 0; i < game.dados.length; i++) {
        if (game.moves === 0 || !game.selectedDados[i]) {
            game.dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
    game.selectedDados = [false, false, false, false, false]; // Reseteo de selección
    drawDados();

    console.log("---");
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(which => console.log(`Game ${getGameName(which)} Puntaje: ${calculateScore(which)}`));

    game.moves++;
    if (game.moves > 3) {
        document.getElementById("btn-tirar").setAttribute("disabled", "disabled");
    } else {
        drawState();
    }
}

const changePlayerTurn = () => {
    game.dados = [0, 0, 0, 0, 0];
    game.selectedDados = [false, false, false, false, false];
    game.moves = 1;
    game.turn++;
        if (game.turn > game.players) {
            game.turn = 1;
            game.round++;
            if (game.round > 11){
                gameOver();
            }
        }
        document.getElementById("btn-tirar").removeAttribute("disabled");
        drawDados();
        drawState();
    }
    

const getGameName = which => {
    const games = [`1`, `2`, `3`, `4`, `5`, `6`, `Escalera`, `Full`, `Póker`, `Generala`, `Doble`];
    return games[which];
}



const toggleDadoSelection = dadoNumber => {
    game.selectedDados[dadoNumber] = !game.selectedDados[dadoNumber];
    const dadoElement = document.querySelector(`.dados-container .dado.d${dadoNumber}`);
    if (game.selectedDados[dadoNumber]) {
        dadoElement.classList.add("selected");
    } else {
        dadoElement.classList.remove("selected");
    }
}

const gameOver = () => {
    document.getElementById("btn-tirar").setAttribute("disabled", "disabled");
    let winner = 0;
    let winningScore = 0;
    for (let i = 0; i < game.players; i++) {
        if (game.scores[i][11] > winningScore) {
            winningScore = game.scores[i][11];
            winner = i;
        }
    }
    alert(`J${winner} Ganó con ${winningScore} puntos`);
}

/* Draw dices code begins */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

const showDado = (contDiv, number) => {
  contDiv.innerHTML = ""; // Limpia el contenido
  let canvas = document.createElement("canvas");
  canvas.width = DICE_SIZE;
  canvas.height = DICE_SIZE;
  drawDado(canvas, number);
  contDiv.appendChild(canvas);
}

const drawDado = (cont, number) => {
  let ctx = cont.getContext("2d");

  // Borro
  ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

  // Dado
  ctx.beginPath();
  ctx.rect(0, 0, DICE_SIZE, DICE_SIZE);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();

  switch (number) {
    case 1:
      drawDot(ctx, AT_HALF, AT_HALF);
      break;
    case 2:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      break;
    case 3:
      drawDot(ctx, AT_HALF, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      break;
    case 4:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      break;
    case 5:
      drawDot(ctx, AT_HALF, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      break;
    case 6:
      drawDot(ctx, AT_3QUARTER, AT_QUARTER);
      drawDot(ctx, AT_QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_QUARTER);
      drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
      drawDot(ctx, AT_QUARTER, AT_HALF);
      drawDot(ctx, AT_3QUARTER, AT_HALF);
      break;
  }
}
/* Draw dices code ends */

document.getElementById("btn-tirar").addEventListener("click", tirarDados);

document.addEventListener("DOMContentLoaded", () => { initGame(); });
