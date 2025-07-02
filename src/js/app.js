function hideAllSections() {
    Array.from(document.querySelectorAll(".game")).concat([document.getElementById("main")])
        .forEach(element => element.classList.add("nodisp"));
}

function showSection(sectionId) {
    document.getElementById(sectionId).classList.remove("nodisp");
}

function setupButtons() {
    document.querySelectorAll(".game")
    .forEach(gameElement => {
        const id = gameElement.getAttribute("id")
        document.getElementById(`btn-${id}`).addEventListener("click", () => {
            hideAllSections();
            showSection(id);
            if (id === "j1") {
                window.resetTateti();
                document.getElementById("reset").disabled = true;
                document.getElementById("btn-j1-back").disabled = true;
            } else if (id === "j2"){
                window.initGame();
                document.getElementById("btn-tirar").removeAttribute("disabled");
                document.getElementById("resetG").setAttribute("disabled", "disabled");
                document.getElementById("resetG").style.display = "none";
                document.getElementById("modal-winner").style.display = "none";
            } else if (id === "j3") {
                window.initScreen();
            }
        });
        document.getElementById(`btn-${id}-back`).addEventListener("click", () => {
            hideAllSections();
            showSection("main");

            if (id === "j1") {
                window.resetTateti();
                document.getElementById("reset").disabled = true;
                document.getElementById("btn-j1-back").disabled = true;
            } else if (id === "j2") {
                document.getElementById("btn-tirar").removeAttribute("disabled");
                document.getElementById("resetG").setAttribute("disabled", "disabled");
                document.getElementById("resetG").style.display = "none";
                document.getElementById("modal-winner").style.display = "none";
            } else if (id === "j3") {
                window.finGame();
            }
        });
    });
}

function initApp() {
    setupButtons();
    hideAllSections();
    showSection("main");
}


document.addEventListener("DOMContentLoaded", initApp());