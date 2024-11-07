const corTexto = document.querySelector('#corTexto');
const btnRed = document.querySelector('#btnRed');
const btnGreen = document.querySelector('#btnGreen');
const btnBlue = document.querySelector('#btnBlue');
const corInput = document.querySelector('#corInput');
const btnContador = document.querySelector('#btnContador');
const contador = document.querySelector('#contador');
const hoverText = document.querySelector('#hoverText');
const background = document.querySelector('#background');
let random = 0;
let count = 0;

function mudarCor(color) {
    corTexto.style.color = color;
}

btnRed.addEventListener('click', () => mudarCor('red'));
btnGreen.addEventListener('click', () => mudarCor('green'));
btnBlue.addEventListener('click', () => mudarCor('blue'));

function mudarCorDeFundo() {
    const color = document.querySelector('#corInput').value; 
    document.body.style.backgroundColor = color; 
}


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