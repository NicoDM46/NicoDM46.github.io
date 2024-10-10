// Importar funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCTzY_bR-zF0-VSw90v0zYr7jganu9gCGI",
    authDomain: "victoria-juego.firebaseapp.com",
    databaseURL: "https://victoria-juego-default-rtdb.firebaseio.com",
    projectId: "victoria-juego",
    storageBucket: "victoria-juego.appspot.com",
    messagingSenderId: "98502758232",
    appId: "1:98502758232:web:622ac55c37465a38839f2d"
  };

// Inicializar Firebase y la base de datos
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variables del DOM
const preguntaElemento = document.getElementById("question");
const opcionesElemento = document.getElementById("options");
const puntajeElemento = document.getElementById("score");
const timerElemento = document.getElementById("timer");
const rankingElemento = document.getElementById("ranking-list");
const startBtn = document.getElementById("start-btn");

let puntaje = 0;
let tiempoRestante = 60;
let preguntaActual = 0;
let intervalo;
let nombreJugador = '';

// Preguntas y respuestas
const preguntas = [
    {
        pregunta: "¿Cuando se asigna la hoja de ruta? ",
        opciones: ["Al inicio de cada turno", "En el medio de la jornada", "Cada que el camión vuelve al depósito"],
        respuesta: "Al inicio de cada turno"
    },
    {
        pregunta: "¿Hasta cuantos trabajadores se recomienda que sean asignados a cada camión?",
        opciones: ["Solamente un chófer", "Un chófer y un ayudante", "Un chófer y dos ayudantes"],
        respuesta: "Un chófer y dos ayudantes"
    },
    {
        pregunta: "Los trabajadores deben encargarse de cargar el camión con los productos",
        opciones: ["Si, deben llegar antes de su jornada para cargar los productos ", "No, los productos ya están cargados en el camión pata cuando llegan", "Si, cargar los productos es parte de su jornada " , "¿Que productos?"],
        respuesta: "No, los productos ya están cargados en el camión pata cuando llegan"
    },
    {
        pregunta: "¿La faja lumbar es obligatoria para los trabajadores?",
        opciones: ["No, es una ayuda opcional", "Si, es obligatoria"],
        respuesta: "No, es una ayuda opcional"
    },
    {
        pregunta: "Los trabajadores deben encargarse de cargar el camión con los productos",
        opciones: ["No, es una ayuda opcional", "Si, es obligatoria"],
        respuesta: "No, es una ayuda opcional"
    },
];

// Función para iniciar el juego
function iniciarJuego() {
    console.log("El juego ha comenzado");
    nombreJugador = prompt("Por favor, ingresa tu nombre para comenzar:");
    if (!nombreJugador) {
        alert("Debes ingresar un nombre para jugar.");
        return;
    }

    puntaje = 0;
    tiempoRestante = 120;
    preguntaActual = 0;
    puntajeElemento.textContent = puntaje;
    timerElemento.textContent = tiempoRestante;
    startBtn.style.display = 'none';  // Ocultar botón de inicio
    siguientePregunta();
    intervalo = setInterval(actualizarTiempo, 1000);  // Iniciar el temporizador
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

// Finalizar el juego y mostrar el ranking
function finalizarJuego() {
    clearInterval(intervalo);
    guardarRanking(nombreJugador, puntaje, tiempoRestante);  // Guardar puntaje y tiempo en Firebase
    cargarRanking();  // Mostrar ranking actualizado
    startBtn.style.display = 'block';  // Mostrar botón de inicio
}

// Guardar puntaje y tiempo en Firebase
function guardarRanking(nombreJugador, puntaje, tiempo) {
    const nuevoJugador = {
        nombre: nombreJugador,
        puntaje: puntaje,
        tiempo: 120 - tiempo // Guardar el tiempo utilizado
    };
    const rankingRef = ref(database, 'ranking');
    push(rankingRef, nuevoJugador)  // Agregar puntaje a Firebase
        .then(() => {
            console.log("Datos guardados en Firebase:", nuevoJugador);
        })
        .catch((error) => {
            console.error("Error al guardar datos en Firebase:", error);
        });
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
        // Ordenar por puntaje de mayor a menor
        jugadores.sort((a, b) => b.puntaje - a.puntaje);

        // Mostrar la lista de jugadores con el mayor puntaje primero
        jugadores.forEach(jugador => {
            const li = document.createElement('li');
            li.textContent = `${jugador.nombre} - ${jugador.puntaje} puntos - ${jugador.tiempo} segundos`;
            rankingElemento.appendChild(li);
        });
    });
}

// Asignar el evento al botón de iniciar juego
if (startBtn) {
    startBtn.addEventListener('click', iniciarJuego);
} else {
    console.error('El botón de iniciar no se encontró en el DOM');
}

// Cargar el ranking automáticamente al inicio
document.addEventListener("DOMContentLoaded", function() {
    cargarRanking();
});
