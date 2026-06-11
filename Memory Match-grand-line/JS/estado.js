// js/state.js

// Inicializamos el objeto en el navegador con la configuración inicial
window.gameState = {
    mode: 'solitario',
    difficulty: 'facil',
    theme: 'eastBlue'
};

// Enviamos un mensaje de prueba a la consola del navegador
console.log("¡El barco ha zarpado! Estado global cargado con éxito:", window.gameState);