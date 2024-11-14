const statusDisplay = document.querySelector(".ganador");
const cells = document.querySelectorAll(".celda");
const resetButton = document.getElementById("reset");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]; 

const modal = document.getElementById("modalGanador");
const mensajeModal = document.getElementById("mensaje-modal");
const cerrarModal = document.getElementById("cerrar-modal");

let jugador = "X";
let gameOver = false;

function tirarMoneda() { // probabilidad entre que empiece X u O despues de reiniciar
    return Math.random() > 0.5 ? 'X' : 'O';
}

cells.forEach(cell => { // bucle que recorre cada celda
    cell.addEventListener("click", handleCellClick); // habilita el mouse para poder jugar
});

function changeTurn() {
    jugador = jugador === "X" ? "O" : "X";
    document.getElementById("jugador").textContent = jugador; 
    const turnoJugador = document.getElementById("jugador");

    if (jugador === "X") {
        turnoJugador.classList.add("turno-x");
        turnoJugador.classList.remove("turno-o");
    } else {
        turnoJugador.classList.add("turno-o");
        turnoJugador.classList.remove("turno-x");
    }
}

resetButton.addEventListener("click", resetGame); // habilita el mouse para el boton de reseteo

function modalGanador(mensaje) {
    mensajeModal.textContent = mensaje;
    modal.style.display = "block";
    if (mensaje === "¡Empate!") {
        modal.style.backgroundColor = "#95a5a6"; // Gris si es empate:
        mensajeModal.style.color = "#2c3e50";
    }else if (jugador === "X") {
        modal.style.backgroundColor = "#e74c3c"; // Azul si gana X
    } else if (jugador === "O") {
        modal.style.backgroundColor = "#3498db"; // Rojo si gana O
    }
    
    const backButton = document.getElementById("btn-j1-back");
    const resetButton = document.getElementById ("reset");

    backButton.setAttribute("disabled", "disabled");
    resetButton.setAttribute("disabled", "disabled");

    backButton.classList.add("disabled");
    resetButton.classList.add("disabled");
}
        cerrarModal.addEventListener("click", () => {
            modal.style.display = "none"; // Oculta el modal si se hace clic fuera de él
            const backButton = document.getElementById("btn-j1-back");
            const resetButton = document.getElementById("reset");

            backButton.removeAttribute("disabled");
            resetButton.removeAttribute("disabled");
        
            backButton.classList.remove("disabled");
            resetButton.classList.remove("disabled");
    });
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";

                const backButton = document.getElementById("btn-j1-back");
                const resetButton = document.getElementById("reset");

                backButton.removeAttribute("disabled");
                resetButton.removeAttribute("disabled");
        
                backButton.classList.remove("disabled");
                resetButton.classList.remove("disabled");
            }
        })
    
        

function handleCellClick(event) { // funcion que se ejecuta al clickear la celda
    const cell = event.target; // celda en la que se clickeo|
    if (gameOver || cell.textContent !== "") { // chequea si el juego termino o si la celda se ocupo
        return; // si se cumple la condicion, termina
    }
    cell.textContent = jugador; // coloca al jugador (X u O)

    if (jugador === "X"){
        cell.classList.add("pintar-x");
    } else {
        cell.classList.add("pintar-o");
    }
    cell.classList.add('bloqueada'); // Bloquea la casilla

    if (checkWin()) { // verifica si el movimiento es una victoria
        gameOver = true; // si hay victoria, da como terminado el juego
        modalGanador(`¡${jugador} es el ganador!`); // mostramos el mensaje con el ganador
        resetButton.disabled = false; // habilita el boton de reseteo
        document.getElementById("btn-j1-back").disabled = false;
    } else if (checkTie()) { // si no hay victoria, verifica si hay empate
        gameOver = true; // si hay empate termina el juego
        modalGanador("¡Empate!"); 
        resetButton.disabled = false; // reseteo
        document.getElementById("btn-j1-back").disabled = false;
    } else { // si no hay victoria ni empate, el juego sigue
        changeTurn(); // cambia el turno del jugador
    }
  }
// verifica si un jugador gano el juego
function checkWin() {
  let isWin = false; // inicializa  como false para indicar si hay una condicion ganadora.

  winConditions.forEach(condition => { // Recorre cada combinacion de 'winConditions' usando 'forEach'. 
      if (cells[condition[0]].textContent === jugador && // verifica si la celda en la posicion 'condition[0]' tiene el mismo valor que 'jugador'.
          cells[condition[1]].textContent === jugador && // verifica si la celda en la posicion 'condition[1]' tiene el mismo valor que 'jugador'.
          cells[condition[2]].textContent === jugador) { // verifica si la celda en la posicion 'condition[2]' tiene el mismo valor que 'jugador'.
          isWin = true; // si las tres celdas coinciden con el valor de 'jugador', establece 'isWin' en 'true' para indicar que se ha encontrado una victoria.
          marcarCeldasGanadoras(condition); // llama a la funcion 'marcarCeldasGanadoras' y le pasa la condicion ganadora. Esta función se encargará de pintar las celdas ganadoras.
      }
  });

  return isWin; // devuelve 'true' si se encontro una victoria, o 'false' si no.
}

function marcarCeldasGanadoras(condition) {
  condition.forEach(index => {
      cells[index].style.backgroundColor = "lightblue"; // cambia el color de fondo de las celdas ganadoras
  });
}

// verifica si el juego termino en un empate
function checkTie() { 
    return Array.from(cells).every(cell => { // convierte el objeto cells en un array y aplica el metodo every() al array
        return cell.textContent !== ""; // accede a la propiedad textContent del elemento cell.textContent
    });
}

// muestra un mensaje en la pantalla del juego indicando el ganador
function mostrarMensaje(mensaje) { // declara una funcion llamada mostrarMensaje que toma un parametro mensaje.
    statusDisplay.textContent = mensaje; // asigna el valor del parametro mensaje a la propiedad textContent del elemento statusDisplay
    statusDisplay.style.display = 'block'; // establece la propiedad display del estilo del elemento statusDisplay en 'block'
}

document.addEventListener("DOMContentLoaded", () => { resetGame() });


// reinicia el juego a su estado inicial
function resetGame() { // declara una funcion llamada resetGame que no toma parametros
    cells.forEach(cell => { // itera sobre cada elemento del array cells y ejecuta la funcion de flecha para cada elemento.
        cell.textContent = ""; // borra cualquier texto contenido en la celda actual
        cell.style.backgroundColor = ""; // restaura el color de fondo al original
        cell.classList.remove('bloqueada'); // elimina la clase 'bloqueada' para desbloquear las celdas
        cell.classList.remove('pintar-x', 'pintar-o'); // Elimina las clases de color X y O
    });
    statusDisplay.style.display = 'none'; // hace que el elemento HTML con el id statusDisplay no sea visible en la pantalla escondiendo su contenido.
    jugador = tirarMoneda(); // devuelve un valor aleatorio que determina quien es el proximo jugador
    document.getElementById("jugador").textContent = jugador; // Actualizar el elemento HTML que muestra el turno
    gameOver = false; // establece la variable gameOver en false que indica que el juego no termino
    resetButton.disabled = true; // hace que el boton este deshabilitado y no se pueda clickear
    document.getElementById("btn-j1-back").disabled = true;
    const tablero = document.getElementById("tablero");
    tablero.style.width = "300px"; 
    tablero.style.height = "300px";
}

// inicializa el juego
resetButton.disabled = true;
