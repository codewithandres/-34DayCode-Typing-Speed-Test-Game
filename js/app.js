// Importamos los párrafos desde el archivo "paragraf.js"
import { paragraphs } from "./paragraf.js";

// Seleccionamos los elementos del DOM que vamos a utilizar
const typingText = document.querySelector('.typingh-text p'),
    inputField = document.querySelector('.wrapper .input-field'),
    mistakeTag = document.querySelector('.mistake span'),
    wmpTag = document.querySelector('.wmp span'),
    cmpTag = document.querySelector('.cpm span'),
    timeTag = document.querySelector('.time span b'),
    traiganBtn = document.querySelector('button');

// Inicializamos las variables que vamos a utilizar
let mistakes, isTyping;
let timer,
    maxTime = 60,
    leftTimer = maxTime;
let chartIndex = mistakes = isTyping = 0;

// Función para seleccionar un párrafo aleatorio
const ramdomParagraf = () => {
    // Seleccionamos un índice aleatorio de los párrafos
    let ranIndex = Math.floor(Math.random() * paragraphs.length);

    // Limpiamos el texto actual
    typingText.innerHTML = '';
    // Dividimos el párrafo en caracteres y los añadimos al DOM
    paragraphs[ranIndex].split('').map(chart => {
        let spanTag = `<span>${chart}</span> `;
        typingText.innerHTML += spanTag;
    });
    // Marcamos el primer carácter como activo
    typingText.querySelectorAll('span')[0].classList.add('active');

    // Añadimos eventos para enfocar el campo de entrada al pulsar una tecla o hacer clic en el texto
    document.addEventListener('keydown', () => inputField.focus());
    typingText.addEventListener('click', inputField.focus());
};

// Función para iniciar la escritura
const initTyping = () => {
    // Obtenemos todos los caracteres del texto
    const characters = typingText.querySelectorAll('span');
    // Obtenemos el carácter actual del campo de entrada
    let typeChart = inputField.value.split('')[chartIndex];

    // Si aún quedan caracteres por escribir y queda tiempo
    if (chartIndex < characters.length - 1 && leftTimer > 0) {
        // Si no estamos escribiendo, iniciamos el temporizador
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        };

        // Si el carácter actual es nulo, retrocedemos un carácter
        if (typeChart == null) {
            chartIndex--;
            // Si el carácter era incorrecto, restamos un error
            if (characters[chartIndex].classList.contains('incorrect')) {
                mistakes--;
            };
            // Eliminamos las clases de correcto e incorrecto del carácter
            characters[chartIndex].classList.remove('correct', 'incorrect');

        } else {
            // Si el carácter es correcto, lo marcamos como tal
            if (characters[chartIndex].textContent === typeChart) {
                characters[chartIndex].classList.add('correct');
            } else {
                // Si el carácter es incorrecto, lo marcamos como tal y sumamos un error
                mistakes++;
                characters[chartIndex].classList.add('incorrect');
            };
            // Avanzamos al siguiente carácter
            chartIndex++;
        };
        // Eliminamos la clase activa de todos los caracteres y la añadimos al carácter actual
        [...characters].map(span => span.classList.remove('active'));
        characters[chartIndex].classList.add('active');

        // Calculamos las palabras por minuto, los errores y los caracteres correctos
        let wpm = Math.round((((chartIndex - mistakes) / 5) / (maxTime - leftTimer)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        // Actualizamos los contadores en el DOM
        wmpTag.textContent = wpm;
        mistakeTag.textContent = mistakes;
        cmpTag.textContent = chartIndex - mistakes;
    } else {
        // Si hemos terminado, limpiamos el campo de entrada y detenemos el temporizador
        inputField.value = '';
        clearInterval(timer);
    };
};

// Función para actualizar el temporizador
const initTimer = () => {
    // Si queda tiempo, lo restamos
    if (leftTimer > 0) {
        leftTimer--;
        timeTag.textContent = leftTimer;
    } else {
        // Si no queda tiempo, detenemos el temporizador
        clearInterval(timer)
    };
};

// Función para reiniciar el juego
const resetGame = () => {
    // Seleccionamos un nuevo párrafo aleatorio
    ramdomParagraf();

    // Limpiamos el campo de entrada y detenemos el temporizador
    inputField.value = '';
    clearInterval(timer)

    // Reiniciamos las variables
    leftTimer = maxTime,
        chartIndex = mistakes = isTyping;

    // Actualizamos los contadores en el DOM
    timeTag.textContent = leftTimer;
    mistakeTag.textContent = mistakes;
    wmpTag.textContent = 0;
    cmpTag.textContent = 0;
};

// Iniciamos el juego seleccionando un párrafo aleatorio
ramdomParagraf();
// Añadimos eventos para iniciar la escritura y reiniciar el juego
inputField.addEventListener('input', initTyping);
traiganBtn.addEventListener('click', resetGame);
