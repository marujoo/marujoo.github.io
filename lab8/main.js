const corTexto = document.querySelector('#corTexto');
const btnRed = document.querySelector('#btnRed');
const btnGreen = document.querySelector('#btnGreen');
const btnBlue = document.querySelector('#btnBlue');
const btnContador = document.querySelector('#btnContador');
const contador = document.querySelector('#contador');
const hoverText = document.querySelector('#hoverText');
const background = document.querySelector('#background');
let random = 0;
let count = 0;

function mudarCor(color) {
    corTexto.style.color = color;
}

    document.querySelectorAll("button[data-color]").forEach(function(button) {
        button.addEventListener('click', function() {
            const color = button.dataset.color;
            corTexto.style.color = color;
        });
    });

document.querySelector('#colorSelect').onchange = function() {
    document.body.style.backgroundColor = this.value;
};


btnContador.addEventListener('click', () => {
    count += 1;
    contador.textContent = count;
});

function textoHover() {
    hoverText.textContent = 'Obrigado, volte sempre';
}

function restaurarTexto() {
    hoverText.textContent = 'Passa por aqui';
}

function muda_aleatorio(){
    random++;
    if(random % 4 == 0) background.style.backgroundColor = 'grey'
    if(random % 4 == 1) background.style.backgroundColor = 'lightblue'
    if(random % 4 == 2) background.style.backgroundColor = 'salmon'
    if(random % 4 == 3) background.style.backgroundColor = 'khaki'

}

background.addEventListener('keyup', muda_aleatorio);

hoverText.addEventListener('mouseover', textoHover);
hoverText.addEventListener('mouseout', restaurarTexto);

let counter = 2; 
function count1() {
    counter++;
    document.querySelector('#autoCounter').textContent = counter;
}
setInterval(count1, 100);

document.querySelector('#submitBtn').addEventListener('click', function() {
    
    const nome = document.querySelector('#nome').value;
    const idade = document.querySelector('#idade').value;

    if (nome && idade) {
        
        const mensagem = `Olá, o ${nome} tem ${idade}!`;
        document.querySelector('#mensagem').textContent = mensagem;

    } else {
        document.querySelector('#mensagem').textContent = "Por favor, insira seu nome e idade.";
    }
});


