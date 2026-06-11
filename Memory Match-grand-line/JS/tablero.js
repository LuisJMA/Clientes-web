
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


// 3. RENDERIZADO VISUAL DEL TABLERO
function renderizarTablero(cartas) {
    // A. Capturamos el contenedor del tablero que dejamos vacío en el HTML
    const contenedorTablero = document.getElementById('contenedor-tablero');
    
    // B. Limpiamos el contenedor por si había una partida vieja guardada
    contenedorTablero.innerHTML = '';

    // C. Configuramos la cuadrícula de forma dinámica según la dificultad
    // Le aplicamos una clase CSS al contenedor para que luego el estilo sepa cuántas columnas estirar
    const dificultad = window.gameState.difficulty;
    contenedorTablero.className = `tablero-${dificultad}`;

    // D. Recorremos el mazo de cartas barajadas para fabricar cada carta en la pantalla
    cartas.forEach((carta, indice) => {
        
        // 1. Creamos el div principal que representará la carta física
        const divCarta = document.createElement('div');
        divCarta.classList.add('carta');
        
        // Guardamos el índice de la posición de la carta en un atributo de datos nativo ('data-')
        // Esto le servirá a la lógica de clics para saber exactamente cuál carta se tocó
        divCarta.dataset.indice = indice;

        // 2. Creamos la "Estructura Interna" de la carta (Efecto Sándwich para el giro 3D)
        // Cada carta tendrá una cara interna (boca abajo) y una externa (el emoji del personaje)
        divCarta.innerHTML = `
            <div class="carta-interna">
                <div class="cara-atras">🏴‍☠️</div>
                <div class="cara-frente">${carta.content}</div>
            </div>
        `;

        // 3. ¡EL ESCUCHADOR DE CLICS!: Le asignamos vida e interacción a la carta
        divCarta.addEventListener('click', function() {
            console.log(`Se hizo clic en la carta con ID: ${carta.id} en la posición: ${indice}`);
            // Aquí llamaremos más adelante a la función para voltear la carta
        });

        // 4. Inyectamos la carta recién fabricada dentro de la caja madre en el HTML
        contenedorTablero.appendChild(divCarta);
    });

    console.log(`¡Tablero visual renderizado con éxito para el modo ${dificultad}!`);
}