//Moonlander. Um jogo de alunissagem.
// João Vitor Palandi
//https://github.com/JoaoVPalandi
// 28/03/2025
// Versão 0.1

/** @type {HTMLCanvasElement} */

//Seção de Modelagem de dados
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let x;
let velocidadeX
let angulo

if (Math.round(Math.random()) == 0) {
    x = 100;
    velocidadeX = 2;
    angulo = -Math.PI / 2;
} else {
    x = 700;
    velocidadeX = -2;
    angulo = Math.PI / 2
}

let moduloLunar = {
    posicao: {
        x: x,
        y: 100
    },
    angulo: -Math.PI / 2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: velocidadeX,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntHoaraio: false,
    rotacaoHorario: false
}


let estrelas = [];
 
for( let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2 ),
        transparencia: 1.0,
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    };
}



//Seção de visualização
function desenharModuloLunar() {
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5,
        moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado) {
        desenharChama();
        consumoCombustivel();
    }

    contexto.restore();
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    //Determina o tamanho da chama
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 35);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidade() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade: ${(10 * moduloLunar.velocidade.y).toFixed(2)}`;
    contexto.fillText(velocidade, 100, 60);
}

function mostrarVelocidadeHorizontal() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let mostrarVelocidadeHorizontal = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(2)}`;
    contexto.fillText(mostrarVelocidadeHorizontal, 320, 80);
}
function mostrarAngulo() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let angulo = `Ângulo: ${(10 * moduloLunar.angulo).toFixed(0)}°`;
    contexto.fillText(angulo, 100, 80);
}

function mostrarCombustivel() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let combustivel = `Combustível: ${((moduloLunar.combustivel / 1000) * 100).toFixed(0)}%`;
    contexto.fillText(combustivel, 320, 60);
}

function mostrarAltitude() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let altitude = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)}`;
    contexto.fillText(altitude, 520, 60);

}

function desenharEstrelas(){
    for( let i; 0; i< estrelas.length, i++ ){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0,2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = "rgba( 255, 255, 255, " + estrela.transparencia +")";
        contexto.fill();
        contexto.restore();
 
    }
}


function desenhar() {
    //limpar a tela
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    //Esta função atualiza a posição do módulo lunar em função da gravidade

    atracaoGravitacional();
    desenharModuloLunar();
    mostrarVelocidade();
    mostrarAngulo();
    mostrarVelocidadeHorizontal();
    mostrarCombustivel();
    mostrarAltitude();
    desenharEstrelas();
    //Esta função repete a execução da função desenhar a cada quadro
    let centroX = canvas.width * 0.5; 
    let centroY = canvas.height * 0.5; 
    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {

        if (moduloLunar.velocidade.y >= 0.5 ||
            moduloLunar.velocidade.x >= 0.5 ||
            5 < moduloLunar.angulo ||
            moduloLunar.angulo < -5
        ) {
            contexto.font = "bold 32px Arial";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "Red";
            return contexto.fillText("VOCÊ PERDEU!", centroX, centroY);

        } else {
            contexto.font = "bold 32px Arial";
            contexto.textAlign = "center"
            contexto.textBaseLine = "midlle";
            contexto.fillStyle = "Green";
            return contexto.fillText("VOÇÊ CONSEGIU POUSAR!", centroX, centroY)

        }
    }
    requestAnimationFrame(desenhar);
}


//Seção de controle


//Pressionando a seta para cima para ligar o motor
document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento) {
    if (evento.keyCode == 38 && moduloLunar.combustivel > 0) {
        moduloLunar.motorLigado = true;

    }
    else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntHoaraio = true;

    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoHorario = true;

    }
}
//Soltando a seta para cima para desligar o motor
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntHoaraio = false;

    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoHorario = false;
    }
}

function consumoCombustivel() {
    if (moduloLunar.combustivel > 0) {
        moduloLunar.combustivel--;
    } else {
        moduloLunar.combustivel = 0;
        moduloLunar.motorLigado = false;
    }
}

let gravidade = 0.01;
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    if (moduloLunar.rotacaoAntHoaraio) {
        moduloLunar.angulo += Math.PI / 180;
    } else if (moduloLunar.rotacaoHorario) {
        moduloLunar.angulo -= Math.PI / 180
    }

    if (moduloLunar.motorLigado) {
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo);
    }
    moduloLunar.velocidade.y += gravidade;


}
desenhar();