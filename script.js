import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

let puntaje = 0;
let tiempoRestante = 60;
let preguntaActual = 0;
let intervalo;
let ranking = [];
let nombreJugador = ''; // Guardar el nombre del jugador aquí

const preguntaElemento = document.getElementById("question");
const opcionesElemento = document.getElementById("options");
const puntajeElemento = document.getElementById("score");
const timerElemento = document.getElementById("timer");
const rankingElemento = document.getElementById("ranking-list");
const startBtn = document.getElementById("start-btn");

// Preguntas y respuestas
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
];

// Inicializar Firebase Database
const database = getDatabase();

// Función para iniciar el juego
function iniciarJuego() {
    nombreJugador = prompt("Por favor, ingresa tu nombre para comenzar:");
    if (!nombreJugador) {
        alert("Debes ingresar un nombre para jugar.");
        return;
    }

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
// Finalizar el juego y mostrar ranking
function finalizarJuego() {
    clearInterval(intervalo);
    guardarRanking(nombreJugador, puntaje);  // Guardar el puntaje en Firebase
    cargarRanking();  // Mostrar el ranking actualizado

    // Mostrar un mensaje final y el ranking
    alert("¡Juego terminado! Revisa el ranking para ver tu posición.");
    startBtn.style.display = 'block';  // Mostrar botón de inicio
}


// Guardar puntaje en Firebase
function guardarRanking(nombreJugador, puntaje) {
    const nuevoJugador = {
        nombre: nombreJugador,
        puntaje: puntaje
    };
    const rankingRef = ref(database, 'ranking');
    push(rankingRef, nuevoJugador);  // Agregar puntaje a Firebase
}

// Cargar el ranking desde Firebase y mostrarlo
function cargarRanking() {
    const rankingRef = ref(database, 'ranking');
    onValue(rankingRef, (snapshot) => {
        rankingElemento.innerHTML = '';  // Limpiar la lista antes de actualizarla
        const jugadores = [];
        snapshot.forEach((childSnapshot) => {
            const jugador = childSnapshot.val();
            jugadores.push(jugador);
        });
        jugadores.sort((a, b) => b.puntaje - a.puntaje);  // Ordenar por puntaje de mayor a menor
        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} - ${jugador.puntaje} puntos`;
            rankingElemento.appendChild(li);
        });
    });
}

// Cargar el ranking al inicio
window.onload = cargarRanking;

// Agregar el evento al botón de iniciar juego
startBtn.addEventListener('click', iniciarJuego);