
function iniciarCronometro() {
    // Si por alguna razón ya había un reloj corriendo, lo apagamos para no duplicar procesos
    if (window.gameState.cronometroId !== null) {
        clearInterval(window.gameState.cronometroId);
    }

    const textoSegundos = document.getElementById('segundos');
    
    // Reseteamos el contador en el estado global y en la pantalla
    window.gameState.tiempoTranscurrido = 0;
    if (textoSegundos) textoSegundos.textContent = '0';

    // Guardamos el intervalo en el estado global para tener el control total
    window.gameState.cronometroId = setInterval(() => {
        window.gameState.tiempoTranscurrido++;
        
        // Si el elemento existe en el HTML, actualizamos el número en tiempo real
        if (textoSegundos) {
            textoSegundos.textContent = window.gameState.tiempoTranscurrido;
        }
    }, 1000); // 1000 milisegundos = 1 segundo
}

function detenerCronometro() {
    if (window.gameState.cronometroId !== null) {
        clearInterval(window.gameState.cronometroId);
        window.gameState.cronometroId = null; // Liberamos la variable
    }
}