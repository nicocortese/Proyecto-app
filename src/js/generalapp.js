let dados;
let selectedDados = [false, false, false, false, false];

    const initGame = () => {
        dados = [0, 0, 0, 0, 0];
        drawDados;
    };

    const drawDados = () => {
        dados.forEach((dado, i) => {
            document.getElementById(`dado${i + 1}`).innerHTML = dado;
        

    if (selectedDados[i]) {
        dadoElement.style.backgroundColor= "lightgreen";
    } else {
        dadoElement.style.backgroundColor= "red";
            }
        });
    };

const toggleSelection = (i) => {
    selectedDados[i] = !selectedDados[i]
    drawDados();
}

    const tirarDados = () => {
        for (let i = 0; i < dados.length; i++) {
            if (selectedDados[i]) {
            dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
        drawDados();
    };

    document.getElementById("btn-tirar").addEventListener("click", tirarDados);

    document.addEventListener("DOMContentLoaded", () => { initGame(); });