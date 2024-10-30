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
}

    const initGame = () => {
        game.dados = [0, 0, 0, 0, 0];
        selectedDados = [false, false, false, false, false];
        game.turn = 1;
        game.moves = 1;

        document.querySelectorAll("#dados-container .dado").forEach(dadoElement => {
            dadoElement.addEventListener("click", () => toggleSelection(parseInt(dadoElement.getAttribute("class").replace("dado d", ""))));
        })

        drawDados();
        drawState();
    }

    const isGameMatch = regex => {
        return game.dados.slice().sort((d1, d2) => d1 - d2).join("").match(regex) !== null;
    }
    

    const drawDados = () => {
        game.dados.forEach((dado, i) => {
            const dadoElement = document.querySelector(`#dados-container .dado d${i}`);
            if (selectedDados[i]) {
                dadoElement.classList.add("selected");
            } else {
                dadoElement.classList.add("selected");
            }
            dadoElement.innerHTML = dado
        });
    }

   const drawState = () =>
    document.getElementById("jugador-generala").innerHTML = game.turn;
    document.getElementById("tiros-generala").innerHTML = game.moves;
   

    const tirarDados = () => {
        for (let i = 0; i < game.dados.length; i++) {
            if (game.moves === 1 || game.selectedDados[i]) {
                game.dados[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        selectedDados = [false, false, false, false, false] // Reseteo de selección 
        drawDados();

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

    const toggleSelection = dadoNumero => {
        selectedDados[dadoNumero] =! selectedDados[dadoNumero];
        const dadoElement = document.querySelector(`#dados-container .dado .d${dadoNumero}`);
        if (selectedDados[dadoNumero]) {
            dadoElement.classList.add("selected");
        } else {
            dadoElement.classList.remove("selected");
        }
    }

    const showDado = (contDiv, number) => {
        contDiv.innerHTML = null;
        let img = document.createElement("img");
        img.setAttribute("width", "" + DICE_SIZE);
        img.setAttribute("height", "" + DICE_SIZE);
        img.setAttribute("alt", `dado-${number}`);
        img.setAttribute("src", document.getElementById(`d${number}`).getAttribute("src"));
        contDiv.appendChild(img);
    }  

    document.getElementById("btn-tirar").addEventListener("click", tirarDados);

    document.addEventListener("DOMContentLoaded", () => { initGame(); });