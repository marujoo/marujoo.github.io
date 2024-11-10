const text1 = document.querySelector("#text1");
const text2 = document.querySelector("#text2");
const inputField = document.querySelector("#inputField");
const formMessage = document.querySelector("#formMessage");
const myForm = document.querySelector("#myForm");

function mudarTexto() {
    text1.textContent = "Mal-educado";
}

function mudarCorDeFundo() {
    text2.style.backgroundColor = "aqua";
}

function restaurarCorDeFundo() {
    text2.style.backgroundColor = "";
}

function alternarVisibilidade() {
    if (text1.style.display === "none") {
        text1.style.display = "block";  
    } else {
        text1.style.display = "none";   
    }
}

function mostrarTeclaPressionada(event) {
    formMessage.textContent = "Tecla pressionada: " + event.key;
}

function enviarFormulario(event) {
    formMessage.textContent = "Boa man!";
}

text1.addEventListener("click", mudarTexto);
text2.addEventListener("mouseover", mudarCorDeFundo);
text2.addEventListener("mouseout", restaurarCorDeFundo);
text2.addEventListener("click", alternarVisibilidade);
inputField.addEventListener("keydown", mostrarTeclaPressionada);
myForm.addEventListener("submit", enviarFormulario);
