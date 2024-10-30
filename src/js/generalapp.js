let dados;
let selectedDados;


    const initGame = () => {
        dados = [0, 0, 0, 0, 0];
        selectedDados = [false, false, false, false, false];

        document.querySelectorAll("#dados-container .dado").forEach(dadoElement => {
            dadoElement.addEventListener("click", () => toggleSelection(parseInt(dadoElement.getAttribute("class").replace("dado d", ""))));
        })

        drawDados;
    };

    const drawDados = () => {
        dados.forEach((dado, i) => {
            const dadoElement = document.querySelector(`#dados-container .dado d${i}`);
            if (selectedDados[i]) {
                dadoElement.classList.add("selected");
            } else {
                dadoElement.classList.add("selected");
            }
            dadoElement.innerHTML = dado
        });
    }

   

    const tirarDados = () => {
        for (let i = 0; i < dados.length; i++) {
            if (selectedDados[i]) {
                dados[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        selectedDados = [false, false, false, false, false] // Reseteo de selección 
        drawDados();
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


    document.getElementById("btn-tirar").addEventListener("click", tirarDados);

    document.addEventListener("DOMContentLoaded", () => { initGame(); });