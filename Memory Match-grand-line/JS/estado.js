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
    }
};

// Mensaje de éxito actualizado
console.log("Estado global cargado con soporte de jugadores:", window.gameState);