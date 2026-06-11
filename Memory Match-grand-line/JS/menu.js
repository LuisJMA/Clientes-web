// 1. FASE DE CONFIGURACIÓN: LOCALIZACIÓN DE CAJAS
// Buscamos TODOS los elementos del HTML una sola vez al principio para ahorrar memoria.
const selectorModo = document.getElementById('modo-juego');
const selectorDificultad = document.getElementById('dificultad');
const selectorSaga = document.getElementById('saga-seleccionada');

const inputJugador1 = document.getElementById('nombre-p1');
const inputJugador2 = document.getElementById('nombre-p2');
const bloqueJugador2 = document.getElementById('bloque-jugador2');

const formulario = document.getElementById('formulario-config');
const pantallaMenu = document.getElementById('pantalla-menu');
const pantallaJuego = document.getElementById('pantalla-juego');


//  LÓGICA DE CONTROL VISUAL
function actualizarInterfazPorModo(modo) {
    if (modo === 'pvp') {
        bloqueJugador2.style.display = 'block';
        inputJugador2.required = true; 
    } else {
        bloqueJugador2.style.display = 'none';
        inputJugador2.required = false; 
        inputJugador2.value = ''; // Borramos texto oculto para evitar bugs
    }
}


// Escuchador para cuando el usuario cambia el selector
selectorModo.addEventListener('change', function(evento) {
    actualizarInterfazPorModo(evento.target.value);
});


// 3. FASE DE EJECUCIÓN: EXTRACCIÓN DE DATOS (SUBMIT)
// Ocurre SOLO cuando el usuario hace clic en el botón de iniciar travesía.
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Frenamos la recarga automática de la página

    // Ahora la extracción es 100% limpia y simétrica. 
    // Usamos las variables que ya teníamos guardadas arriba del todo.
    const nombre1 = inputJugador1.value;
    const nombre2 = inputJugador2.value;
    const dificultadSeleccionada = selectorDificultad.value;
    const sagaSeleccionada = selectorSaga.value;

    // Guardamos los datos recolectados en nuestra bitácora global
    window.gameState.mode = selectorModo.value;
    window.gameState.difficulty = dificultadSeleccionada;
    window.gameState.theme = sagaSeleccionada;
    
    window.gameState.players.p1.name = nombre1;
    
    // Si es PvP, guardamos al Jugador 2, si no, nos aseguramos de dejarlo vacío
    if (window.gameState.mode === 'pvp') {
        window.gameState.players.p2.name = nombre2 || "Capitán 2";
    } else {
        window.gameState.players.p2.name = "";
    }

    console.log("¡Bitácora Global Guardada con éxito!", window.gameState);


    // Invocamos la función que escribimos en tablero.js. 
    // Como está en el scope global del navegador, menu.js puede usarla libremente
    const cartasDeLaPartida = inicializarCartas();

    // Le pasamos las cartas recién mezcladas al constructor visual
    renderizarTablero(cartasDeLaPartida);

    // Intercambio de pantallas (Técnica SPA)
    pantallaMenu.style.display = 'none';
    pantallaJuego.style.display = 'block';

    console.log("Navegando al tablero...");
});

// 4. INICIALIZACIÓN AUTOMÁTICA
// Forzamos a la interfaz a configurarse según la opción por defecto del HTML
actualizarInterfazPorModo(selectorModo.value);