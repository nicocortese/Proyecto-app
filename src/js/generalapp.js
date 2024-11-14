const DICE_SIZE = 80; // Tamaño de los dados (80px).

const DOT_RADIUS = 0.1 * DICE_SIZE; // Calcula el radio de los puntos en los dados como el 10% del tamaño del dado.

const AT_QUARTER = 0.25 * DICE_SIZE; // Define la posición de 1/4 del tamaño del dado.
const AT_HALF = 0.5 * DICE_SIZE; // Define la posición de 1/2 del tamaño del dado.
const AT_3QUARTER = 0.75 * DICE_SIZE; // Define la posición de 3/4 del tamaño del dado.

// Modals
const modalTachar = document.getElementById("modal-tachar"); // Obtiene el modal para tachar una jugada.
const tacharJugada = document.getElementById("tachar"); // Obtiene el botón para tachar la jugada.
const noTacharJugada = document.getElementById("seguir"); // Obtiene el botón para no tachar la jugada y seguir jugando.

const modalTGenerala = document.getElementById("modalt-generala"); // Obtiene el modal para la Generala.
const tGeneralaClose = document.getElementById("cerrarModalTGenerala"); // Obtiene el botón para cerrar el modal de Generala.

const anotarGenerala = document.getElementById("anotar-generala"); // Obtiene el botón para anotar la Generala.
const closeAGenerala = document.getElementById("cerrarAnotarGenerala"); // Obtiene el botón para cerrar la ventana de anotar Generala.

const celdaOcupada = document.getElementById("celda-ocupada"); // Obtiene el modal que indica que la celda está ocupada.
const cerrarOcupada = document.getElementById("cerrarOcupada"); // Obtiene el botón para cerrar el modal de celda ocupada.

const reEscalera = /12345|23456|13456/; // Expresión regular para verificar combinaciones de escalera.
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/; // Expresión regular para verificar una generala (5 dados iguales).
const rePoker = /1{4}[23456]|12{4}|2{4}[3456]|[12]3{4}|3{4}[456]|[123]4{4}|4{4}[56]|[1234]5{4}|5{4}6|[12345]6{4}/; // Expresión regular para verificar una mano de poker.
const reFull = /1{3}(2{2}|3{2}|4{2}|5{2}|6{2})|1{2}(2{3}|3{3}|4{3}|5{3}|6{3})|2{3}(3{2}|4{2}|5{2}|6{2})|2{2}(3{3}|4{3}|5{3}|6{3})|3{3}(4{2}|5{2}|6{2})|3{2}(4{3}|5{3}|6{3})|4{3}(5{2}|6{2})|4{2}(5{3}|6{3})|5{3}6{2}|5{2}6{3}/; // Expresión regular para verificar un Full (tres dados iguales y dos iguales).

// Objeto principal del juego
const game = {
    dados: [0, 0, 0, 0, 0], // Arreglo con los valores de los dados, inicializados en 0.
    selectedDados: [false, false, false, false, false], // Arreglo de booleanos que indica si un dado está seleccionado o no.
    players: 2, // Número de jugadores (en este caso 2 jugadores).
    turn: 1, // El turno actual (inicia en el turno 1).
    moves: 1, // Número de movimientos disponibles en el turno (inicia en 1).
    scores: [], // Arreglo vacío para los puntajes de los jugadores.
    round: 1 // Ronda actual del juego (inicia en la ronda 1).
};

// Función para inicializar el juego
const initGame = () => {
    game.dados = [0, 0, 0, 0, 0]; // Reinicia los valores de los dados.
    game.selectedDados = [false, false, false, false, false]; // Reinicia las selecciones de los dados.
    game.turn = 1; // Reinicia el turno a 1.
    game.moves = 1; // Reinicia los movimientos a 1.
    game.scores = []; // Reinicia los puntajes.

    /*for (let i = 0; i < game.players; i++){
        game.scores.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", 0]);
    }*/
   for (let p = 0; p < game.players; p++){ // Recorre cada jugador.
    game.scores[p] = Array(12).fill(" "); // Rellena el arreglo de puntajes con 12 espacios vacíos para cada jugador.
    game.scores[p][11] = 0; // Establece el puntaje total (última posición) en 0.
   }

   // Agrega un evento de click a cada dado
   document.querySelectorAll(".dados-container .dado").forEach((dadoElement, i) => {
    dadoElement.addEventListener("click", () => toggleDadoSelection(i)); // Permite seleccionar o deseleccionar un dado al hacer clic en él.
   });

   // Deshabilita botones
   document.getElementById("btn-j2-back").disabled = true; // Deshabilita el botón de regreso para el jugador 2.
   document.getElementById("resetG").disabled = true; // Deshabilita el botón de reiniciar el juego.

   drawDados(); // Dibuja los dados en la interfaz.
   drawState(); // Dibuja el estado actual del juego.
   drawScores(); // Dibuja los puntajes actuales de los jugadores.
}


const drawScores = () => {
    // Encabezado tabla
    const contHeader = document.querySelector("#j2 .scores table thead tr"); // Selecciona el encabezado de la tabla de puntajes.
    contHeader.innerHTML = null; // Borra cualquier contenido previo del encabezado.

    const cellGame = document.createElement("th"); // Crea una celda de encabezado para la columna "Juego".
    cellGame.innerHTML = "Juego"; // Asigna el nombre "Juego" al encabezado.
    contHeader.appendChild(cellGame); // Agrega la celda al encabezado.

    // Crea encabezados para cada jugador.
    for (let i = 0; i < game.players; i++) {
        const cellPlayerName = document.createElement("th"); // Crea una celda de encabezado para el nombre del jugador.
        cellPlayerName.innerHTML = `J${i + 1}`; // Asigna "J1", "J2", etc., según el número de jugador.
        
        if (i + 1 === game.turn) { // Si es el turno del jugador, cambia el estilo.
            cellPlayerName.classList.add("turnoColor");
        } else {
            cellPlayerName.classList.remove("turnoColor");
        }
        
        contHeader.appendChild(cellPlayerName); // Agrega la celda del jugador al encabezado.
    }

    // Filas de juegos y puntajes
    const contGames = document.querySelector("#j2 .scores table tbody"); // Selecciona el cuerpo de la tabla donde se mostrarán los puntajes.
    contGames.innerHTML = null; // Borra cualquier contenido previo de las filas de puntajes.

    // Recorre las 11 categorías de juego (por ejemplo, "Escalera", "Generala", etc.).
    for (let i = 0; i < 11; i++) {
        const contGame = document.createElement("tr"); // Crea una fila para el juego actual.
        const cellGameName = document.createElement("th"); // Crea una celda para el nombre del juego.
        cellGameName.innerHTML = getGameName(i); // Obtiene el nombre del juego correspondiente a la categoría actual (por ejemplo, "Escalera").
        contGame.appendChild(cellGameName); // Agrega la celda del nombre del juego a la fila.

        // Recorre los jugadores para mostrar sus puntajes.
        for (let p = 0; p < game.players; p++) {
            const cellPlayerScore = document.createElement("td"); // Crea una celda para el puntaje del jugador.
            cellPlayerScore.innerHTML = game.scores[p][i]; // Asigna el puntaje correspondiente del jugador y categoría.
            
            // Si el puntaje no está vacío, aplica la clase "casilleroOcupado" para marcar la celda como ocupada.
            if(game.scores[p][i] !== " " && game.scores[p][i] !== null){
                cellPlayerScore.classList.add("casilleroOcupado");
            } else {
                cellPlayerScore.classList.remove("casilleroOcupado"); // Asegura que las celdas vacías no tengan la clase "casilleroOcupado".
            }
            
            // Si es el turno del jugador, cambia el estilo de la celda.
            if (p + 1 === game.turn) {
                cellPlayerScore.classList.add("turnoColor");
            } else {
                cellPlayerScore.classList.remove("turnoColor");
            }
            
            contGame.appendChild(cellPlayerScore); // Agrega la celda de puntaje al juego actual.
        }
        contGames.appendChild(contGame); // Agrega la fila de puntajes al cuerpo de la tabla.

        // Agrega un evento de clic para cada fila de juego.
        contGame.addEventListener("click", () => {
            if (game.dados.some(dado => dado === 0)) { // Si hay dados con valor 0, no se puede anotar el puntaje.
                return;
            }
            
            if (game.scores[game.turn - 1][i] !== " ") { // Si el puntaje ya está anotado, muestra un mensaje de celda ocupada.
                celdaOcupada.style.display = "block";
                return;
            } else {
                const score = calculateScore(i); // Calcula el puntaje de la categoría actual.

                if (score === 0) { // Si el puntaje es 0, muestra la opción de tachar la jugada.
                    if (game.scores[game.turn - 1][i] !== "X") {
                        modalTachar.style.display = "block"; // Muestra el modal de "tachar".

                        tacharJugada.onclick = () => {
                            modalTachar.style.display = "none"; // Cierra el modal de tachar.
                            game.scores[game.turn - 1][i] = "X"; // Marca la jugada como tachada.
                            changePlayerTurn(); // Cambia al siguiente jugador.
                            drawScores(); // Vuelve a dibujar los puntajes.
                        };
                        
                        noTacharJugada.onclick = () => {
                            modalTachar.style.display = "none"; // Si no se quiere tachar, cierra el modal.
                        };

                        // Si el juego es "Generala", muestra un modal especial.
                        if (getGameName(i) === "Generala" && game.scores[game.turn - 1][10] !== "X") {
                            modalTGenerala.style.display = "block"; // Muestra el modal de Generala.
                            tGeneralaClose.onclick = () => {
                                modalTGenerala.style.display = "none"; // Cierra el modal de Generala.
                            };
                            modalTachar.style.display = "none"; // Cierra el modal de tachar.
                        }
                    }
                } else {
                    // Si el puntaje no es 0, lo asigna y suma al total del jugador.
                    if (getGameName(i) === "Doble" && game.scores[game.turn - 1][9] === " ") {
                        anotarGenerala.style.display = "block"; // Muestra el modal para anotar la Generala si es la categoría "Doble".
                        closeAGenerala.onclick = () => {
                            anotarGenerala.style.display = "none"; // Cierra el modal de anotar Generala.
                        };
                        return;
                    } else {
                        game.scores[game.turn - 1][i] = score; // Asigna el puntaje al jugador en la categoría.
                        game.scores[game.turn - 1][11] += score; // Suma el puntaje al total del jugador.
                        changePlayerTurn(); // Cambia al siguiente jugador.
                        drawScores(); // Vuelve a dibujar los puntajes.
                    }
                }
            }
        });  
    }      

    // Fila de Totales
    const contTotal = document.createElement("tr"); // Crea una fila para los totales.
    const cellTotalName = document.createElement("th"); // Crea una celda para el nombre "Total".
    cellTotalName.innerHTML = "Total"; // Asigna el nombre "Total" a la celda.
    contTotal.appendChild(cellTotalName); // Agrega la celda "Total" a la fila.

    // Recorre los jugadores para mostrar sus totales.
    for (let p = 0; p < game.players; p++) {
        const cellPlayerTotal = document.createElement("td"); // Crea una celda para el total del jugador.
        cellPlayerTotal.innerHTML = game.scores[p][11]; // Asigna el total del puntaje al jugador.
        
        // Si es el turno del jugador, cambia el estilo de la celda.
        if ( p + 1 === game.turn) {
            cellPlayerTotal.classList.add("turnoColor");
        } else {
            cellPlayerTotal.classList.remove("turnoColor");
        }
        contTotal.appendChild(cellPlayerTotal); // Agrega la celda del total al "Total".
    }
    contGames.appendChild(contTotal); // Agrega la fila de totales al cuerpo de la tabla.
};


    cerrarOcupada.onclick = () => {
        celdaOcupada.style.display = "none"
    }

    window.onclick = (event) => {
        if (event.target === celdaOcupada) {
            celdaOcupada.style.display = "none"
        }
    }

   // verifico si los valores actuales de los dados coinciden con regex
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
    //y si es primer tiro devuelve 25, sino 20
    break;
    case 7: 
    if (isGameMatch(reFull)) {
        score = game.moves === 2 ? 35 : 30;
    }
    //si conincide con el reFull
    //y si es primer tiro devuelve 35, sino 30
        break;
    case 8: 
    if (isGameMatch(rePoker)) {
        score = game.moves === 2 ? 45 : 40;
    }
    //si conincide con el rePoker
    //y si es primer tiro devuelve 45, sino 40
        break;
    case 9: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 55 : 50;
    }
    //si conincide con la reGenerala
    //y si es primer tiro devuelve 55, sino 50
        break;
    case 10: 
    if (isGameMatch(reGenerala)) {
        score = game.moves === 2 ? 105 : 100;
    }
    //si conincide con la reGenerala
    //y si es primer tiro devuelve 105, sino 100
        break;

        default: // Números 1-6
        // puntaje para los valores numéricos específicos de los dados 
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
    document.getElementById("ronda-generala").innerHTML = game.round;  // Actualizar la ronda actual

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

    let juegoCompleto = true;

    for(let p = 0; p < game.players; p++) {
        for (let i = 0; i < 11; i++) {
            if (game.scores[p][i] === " ") {
                juegoCompleto = false;
                break;
            }
        }
    }

    if (juegoCompleto){
        gameOver();
        return;
    }

    game.dados = [0, 0, 0, 0, 0];
    game.selectedDados = [false, false, false, false, false];
    game.moves = 1;
    game.turn++;
        if (game.turn > game.players) {
            game.turn = 1;
            game.round++;
        }
            if (game.round > 11){
                gameOver();
                return;
            }

        document.getElementById("btn-tirar").removeAttribute("disabled");
        drawDados();
        drawState();
        drawScores();
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
    document.getElementById("resetG").disabled = false;
    document.getElementById("resetG").style.display = "block"; // Habilitar el botón "Reiniciar"
    let winner = 0;
    let winningScore = 0;
    for (let i = 0; i < game.players; i++) {
        if (game.scores[i][11] > winningScore) {
            winningScore = game.scores[i][11];
            winner = i + 1;
        }
    }
    // Mostrar modal de ganador
    document.getElementById("nameWinner").innerText = `J${winner} `;
    document.getElementById("scoreWinner").innerText = `${winningScore} puntos`;
    document.getElementById("modal-winner").style.display = "block";

    // Habilitar el botón de reinicio

    document.getElementById("btn-j2-back").removeAttribute("disabled"); // Aquí habilitamos el botón
}
const resetGame = () => {
    game.round = 1;
    game.turn = 1;
    initGame();
    document.getElementById("modal-winner").style.display = "none";
    document.getElementById("resetG").style.display = "none";
    document.getElementById("resetG").disabled = true; // Deshabilita el botón de reinicio
    document.getElementById("btn-tirar").removeAttribute("disabled");
  
}

document.getElementById("resetG").addEventListener("click", resetGame);


/* Draw dices code begins */
const drawDot = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#EABE3F";
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