// 1. Capturamos los dos elementos del HTML que necesitamos manipular

const selectorModo = document.getElementById('modo-juego');
const bloqueJugador2 = document.getElementById('bloque-jugador2');

// 2. Le añadimos un "escuchador" al selector. 
// El evento 'change' se dispara cada vez que el usuario selecciona una opción distinta.
selectorModo.addEventListener('change', function(evento) {
    
    // 'evento.target.value' nos dice cuál es el 'value' de la opción que el usuario eligió
    const modoSeleccionado = evento.target.value;

    console.log("El usuario cambió el modo a:", modoSeleccionado);

    // 3. Tomamos una decisión lógica basada en la selección
    if (modoSeleccionado === 'pvp') {
        // Si eligió PvP (Versus), cambiamos el estilo a 'block' para que sea visible
        bloqueJugador2.style.display = 'block';
    } else {
        // Si eligió cualquier otro modo (Solitario o Libre), lo volvemos a ocultar
        bloqueJugador2.style.display = 'none';
    }
});