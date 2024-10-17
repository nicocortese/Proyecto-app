let dados;

const initGame = () => {
    dados = [0, 0, 0, 0, 0]
}

/*const drawDados = () => {
    dados.forEach((dados, i) => document.querySelector (`.dados-container .dados.d))
}*/



/*const tirarDado() {
    for (let i = 1; i <= 5; i++) {
        dados[i] = Math.floor(Math.random() * 6) + 1);
        document.getElementById(`dados${i}`).textContent = dadoValue;
    }
}
*/document.getElementById("btn-tirar").addEventListener('click', tirarDado);+


document.addEventListener("DOMContentLoaded", () => { initGame() });