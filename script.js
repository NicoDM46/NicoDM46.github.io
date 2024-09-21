// Preguntas y respuestas (puedes añadir más)
const preguntas = [
    {
        pregunta: "¿Cuál es la capital de Francia?",
        opciones: ["Madrid", "París", "Londres", "Roma"],
        respuesta: "París"
    },
    {
        pregunta: "¿Quién escribió 'Cien años de soledad'?",
        opciones: ["Pablo Neruda", "Jorge Luis Borges", "Gabriel García Márquez", "Mario Vargas Llosa"],
        respuesta: "Gabriel García Márquez"
    },
    // Añadir más preguntas aquí
];

let puntaje = 0;
let tiempoRestante = 60;
let preguntaActual = 0;
let intervalo;
let ranking = [];

const preguntaElemento = document.getElementById("question");
const opcionesElemento = document.getElementById("options");
const puntajeElemento = document.getElementById("score");
const timerElemento = document.getElementById("timer");
const rankingElemento = document.getElementById("ranking-list");
const startBtn = document.getElementById("start-btn");

// Función para iniciar el juego
function iniciarJuego() {
    puntaje = 0;
    tiempoRestante = 60;
    preguntaActual = 0;
    puntajeElemento.textContent = puntaje;
    timerElemento.textContent = tiempoRestante;
    startBtn.style.display = 'none';  // Esconder botón de inicio
    siguientePregunta();
    intervalo = setInterval(actualizarTiempo, 1000);  // Comienza el temporizador
}

// Mostrar la siguiente pregunta
function siguientePregunta() {
    if (preguntaActual < preguntas.length) {
        const pregunta = preguntas[preguntaActual];
        preguntaElemento.textContent = pregunta.pregunta;
        opcionesElemento.innerHTML = '';
        pregunta.opciones.forEach(opcion => {
            const button = document.createElement('button');
            button.textContent = opcion;
            button.onclick = () => verificarRespuesta(opcion);
            opcionesElemento.appendChild(button);
        });
    } else {
        finalizarJuego();
    }
}

// Verificar si la respuesta es correcta
function verificarRespuesta(opcionSeleccionada) {
    const pregunta = preguntas[preguntaActual];
    if (opcionSeleccionada === pregunta.respuesta) {
        puntaje += 10;
        puntajeElemento.textContent = puntaje;
    }
    preguntaActual++;
    siguientePregunta();
}

// Actualizar el temporizador
function actualizarTiempo() {
    tiempoRestante--;
    timerElemento.textContent = tiempoRestante;
    if (tiempoRestante === 0) {
        finalizarJuego();
    }
}

// Finalizar el juego y mostrar ranking
function finalizarJuego() {
    clearInterval(intervalo);
    const nombreJugador = prompt("Juego terminado. Ingresa tu nombre:");
    ranking.push({ nombre: nombreJugador, puntaje });
    mostrarRanking();
    startBtn.style.display = 'block';  // Mostrar botón de inicio
}

// Mostrar el ranking en la lista
function mostrarRanking() {
    ranking.sort((a, b) => b.puntaje - a.puntaje);  // Ordenar por puntaje
    rankingElemento.innerHTML = '';
    ranking.forEach(jugador => {
        const li = document.createElement('li');
        li.textContent = `${jugador.nombre} - ${jugador.puntaje} puntos`;
        rankingElemento.appendChild(li);
    });
}

startBtn.addEventListener('click', iniciarJuego);
