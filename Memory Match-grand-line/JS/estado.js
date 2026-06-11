// Inicializamos el objeto en el navegador con la configuración inicial
window.gameState = {
    mode: 'solitario',
    difficulty: 'facil',
    theme: 'eastBlue',
    
    // Agregamos la estructura para los nombres y las puntuaciones iniciales
    // p1 será el Jugador 1 y p2 el Jugador 2 para el modo Versus
    players: {
        p1: { name: '', score: 0 },
        p2: { name: '', score: 0 }
    },

    cartasVolteadas: [], // Guardará máximo 2 cartas para compararlas
    tableroBloqueado: false, // Evita el "tercer clic" tramposo mientras validamos
    parejasEncontradas: 0 // Llevará la cuenta para saber cuándo termina la partida

};

// Mensaje de éxito actualizado
console.log("Estado global cargado con soporte de jugadores:", window.gameState);