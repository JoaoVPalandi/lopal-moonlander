//MoonLander. Um jogo de alunissagem.
//João Vitor Palandi (https://github.com/JoaoVPalandi).
//28/03/2025
//Versão 0.1

/** @type {HTMLCanvasElement} */

//Seleção de Modelagem de dados
let canvas = document.querySelector("#jogo"); // Seleciona o elemento canvas do HTML
let contexto = canvas.getContext("2d"); // Obtém o contexto 2D para desenhar no canvas

let moduloLunar = {
    posicao: {
        x: 100, // Posição inicial no eixo X
        y: 100  // Posição inicial no eixo Y
    },
    angulo: 0, // Ângulo de rotação do módulo
    largura: 20, // Largura do módulo
    altura: 20, // Altura do módulo
    cor: "lightgray", // Cor do módulo
    motorligado: false, // Estado do motor
    velocidade: {
        x: 0, // Velocidade no eixo X
        y: 0  // Velocidade no eixo Y
    },
    combustivel: 1000
}

// Função para desenhar o módulo lunar na tela
function desenharModuloLunar() {
    contexto.save(); // Salva o estado do contexto
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y); // Move o contexto para a posição do módulo
    contexto.rotate(moduloLunar.angulo); // Aplica rotação ao módulo
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura); // Desenha o módulo
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorligado) {
        desenharChama(); // Se o motor estiver ligado, desenha a chama
    }

    contexto.restore(); // Restaura o contexto salvo
}

// Função para desenhar a chama quando o motor do módulo está ligado
function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 100);
    contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidade() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade: ${(10 * moduloLunar.velocidade.y).toFixed(2)}`;
    contexto.fillText(velocidade, 100, 60);
}
function mostrarCombustivel() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let combustivel = `Combustível: ${(moduloLunar.combustivel).toFixed(0)}`;
    contexto.fillText(combustivel, 100, 80);
}

// Função que atualiza o combustível, diminuindo quando o motor estiver ligado
function atualizarCombustivel() {
    if (moduloLunar.motorligado && moduloLunar.combustivel > 0) {
        moduloLunar.combustivel -= 0.1; // Consome combustível enquanto o motor está ligado
    }

    // Verifica se o combustível chegou a zero e desliga o motor
    if (moduloLunar.combustivel <= 0) {
        moduloLunar.combustivel = 0;  // Garante que o combustível não fique negativo
        moduloLunar.motorligado = false; // Desliga o motor quando o combustível acaba, 
        // pois atribuimos falso ao motor ligado

    }
    //
}

// Função principal de desenho, que atualiza e renderiza os elementos na tela
function desenhar() {
    // Limpa a tela antes de redesenhar
    contexto.clearRect(0, 0, canvas.width, canvas.height);

    //está função atualiza a posição do módulo lunae em função da gravidade
    atracaoGravitacional(); // Aplica gravidade ao módulo lunar
    mostrarVelocidade(); //Mostra a velocidade do módulo Lunar
    mostrarCombustivel(); //Mostra o combustível do módiulo lunar
    desenharModuloLunar(); //Desenha o módulo lunar
    atualizarCombustivel(); //Atualiza o combustivel

    if (moduloLunar.posicao.y + moduloLunar.altura >= canvas.height) {
        
        if (moduloLunar.velocidade.y >= 0.5) {
            return alert("Você morreu na queda");
        } else {
            return alert("Você conseguiu pousar")
        }
    }


    requestAnimationFrame(desenhar); // Chama a função novamente para animação 
}

//Secção de controle

// Evento de teclado: detectar quando uma tecla é pressionada
function teclaPressionada(evento) {
    if (evento.keyCode == 38) { // Se a tecla pressionada for a seta para cima
        moduloLunar.motorligado = true; // Liga o motor
    }
}

document.addEventListener("keydown", teclaPressionada);

document.addEventListener("keyup", teclaSolta);

// Evento de teclado: detectar quando uma tecla é solta
function teclaSolta(evento) {
    if (evento.keyCode == 38) { // Se a tecla solta for a seta para cima
        moduloLunar.motorligado = false; // Desliga o motor
    }
}

let gravidade = 0.1; // Valor da força gravitacional

// Função que simula a atração gravitacional no módulo lunar
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x; // Atualiza posição no eixo X
    moduloLunar.posicao.y += moduloLunar.velocidade.y; // Atualiza posição no eixo Y
    if (moduloLunar.motorligado) {
        moduloLunar.velocidade.y -= 0.2; // Impulso para cima ao ativar o motor
    }
    moduloLunar.velocidade.y += gravidade; // Aplica a gravidade ao módulo


}

// Inicia a animação
desenhar();
