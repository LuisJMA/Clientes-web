
//  EL ALGORITMO DE BARAJADO (Fisher-Yates)

// cada vez que el usuario reinicie 
// el juego, necesitaremos mezclar las cartas de nuevo. Recibe un arreglo y lo desordena.
function barajarCartas(arreglo) {
    // Recorremos el arreglo de atrás hacia adelante
    for (let i = arreglo.length - 1; i > 0; i--) {
        // Generamos un índice al azar entre 0 e 'i' usando matemática de probabilidades
        const j = Math.floor(Math.random() * (i + 1));
        
        // Intercambiamos los elementos en la posición 'i' y 'j' 
        // Es como mover la carta de la posición derecha a la izquierda de un solo golpe
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
    return arreglo;
}


// 2. PREPARACIÓN DE LA BARAJAS 

function inicializarCartas() {
    //  Extraemos la configuración actual que el usuario guardó en la bitácora
    const sagaElegida = window.gameState.theme; 
    const dificultad = window.gameState.difficulty;

    //  Buscamos en el catálogo externo (sagas.js) los elementos que corresponden a esa saga
    const datosSaga = window.gameThemes[sagaElegida];
    
    //  Definimos cuántas PAREJAS necesitamos según la dificultad elegida
    let cantidadParejas = 8; // Por defecto: Fácil (4x4 = 16 cartas = 8 parejas)
    if (dificultad === 'intermedio') cantidadParejas = 18; // (6x6 = 36 cartas = 18 parejas)
    if (dificultad === 'dificil') cantidadParejas = 32;    // (8x8 = 64 cartas = 32 parejas)

    //  Cortamos el arreglo de la saga para usar solo los elementos necesarios para la partida
    // Usamos '.slice()' para sacar una copia limpia del catálogo sin romper la base de datos original
    const elementosSeleccionados = datosSaga.items.slice(0, cantidadParejas);

    //  Para un juego de memoria necesitamos parejas de cartas
    // Recorremos los elementos seleccionados uno por uno usando un bucle forEach
    let barajaCompleta = [];
    elementosSeleccionados.forEach(elemento => {
        // Creamos la primera carta de la pareja y la metemos a la bolsa
        barajaCompleta.push({ id: elemento.id, content: elemento.content });
        // Creamos la segunda carta exactamente igual y la metemos a la misma bolsa
        barajaCompleta.push({ id: elemento.id, content: elemento.content });
    });

    //  Mezclamos la baraja usando nuestro algoritmo de barajado de arriba
    const barajaMezclada = barajarCartas(barajaCompleta);

    console.log("🎲 Cartas duplicadas y barajadas con éxito para la partida:", barajaMezclada);
    return barajaMezclada;
}