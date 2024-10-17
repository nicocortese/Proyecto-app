document.getElementById("btn-tirar").addEventListener('click', tirarDado);

function tirarDado() {
    for (let i = 1; i <= 5; i++) {
        const dadoValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById(`dado${i}`).textContent = dadoValue;
    }
}