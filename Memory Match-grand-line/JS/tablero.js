
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
            // Le pasamos el div físico (this) y los datos de la carta actual
            voltearCarta(this, carta);
        });

        // 4. Inyectamos la carta recién fabricada dentro de la caja madre en el HTML
        contenedorTablero.appendChild(divCarta);
    });

    console.log(`¡Tablero visual renderizado con éxito para el modo ${dificultad}!`);
}



// 4. CONTROL DE CLICS Y LÓGICA DE VOLTEO

function voltearCarta(elementoHtml, cartaObjeto) {
    const estado = window.gameState;

    // A. VALIDACIONES DE SEGURIDAD (Antitrampas)
    // 1. Si el tablero está bloqueado por validación activa, ignorar clic.
    // 2. Si la carta ya está volteada o ya fue encontrada, ignorar clic.
    if (estado.tableroBloqueado) return;
    if (elementoHtml.classList.contains('volteada')) return;

    // B. VOLTEO VISUAL TEMPORAL
    // Le agregamos la clase que el CSS usará para rotar la carta 180 grados
    elementoHtml.classList.contains('volteada'); 
    elementoHtml.classList.add('volteada');

    // C. REGISTRAR EN MEMORIA
    // Guardamos un objeto con la información física y lógica de la carta tocada
    estado.cartasVolteadas.push({
        html: elementoHtml,
        datos: cartaObjeto
    });

    // D. ¿ES LA SEGUNDA CARTA?
    // Si la bolsa de volteadas llegó a 2, es hora de evaluar
    if (estado.cartasVolteadas.length === 2) {
        verificarPareja();
    }
}


// 5. VALIDACIÓN DE PAREJAS (Coincide ID / No coincide)

function verificarPareja() {
    const estado = window.gameState;
    
    // Bloqueamos el tablero de inmediato para evitar el "tercer clic" rápido
    estado.tableroBloqueado = true;

    // Extraemos las dos cartas de la bolsa de control
    const [carta1, carta2] = estado.cartasVolteadas;

    // COMPARACIÓN LÓGICA: ¿Tienen el mismo ID de personaje?
    const esPareja = carta1.datos.id === carta2.datos.id;

    if (esPareja) {
        // CASO ÉXITO: Son iguales
        console.log("⚔️ ¡Excelente! Pareja encontrada:", carta1.datos.id);
        
        estado.parejasEncontradas++;

        // Calculamos cuántas parejas requiere la dificultad actual para declarar victoria
        let parejasTotales = 8; // Fácil por defecto (4x4)
        if (estado.difficulty === 'intermedio') parejasTotales = 18; // Intermedio (6x6)
        if (estado.difficulty === 'dificil') parejasTotales = 32;    // Difícil (8x8)

        // Si se encontraron todas las parejas y el modo es solitario, congelamos el tiempo
        if (estado.parejasEncontradas === parejasTotales && estado.mode === 'solitario') {
            detenerCronometro(); // Esta función viene de tiempo.js
            console.log(`🏆 ¡Felicidades! Completaste el tablero en ${estado.tiempoTranscurrido} segundos.`);
        }    

        // Limpiamos la bolsa de control para el próximo turno y desbloqueamos
        estado.cartasVolteadas = [];
        estado.tableroBloqueado = false;

        // Aquí inyectaremos más adelante el sistema de puntos de los modos de juego
    } 
    else {
        // CASO ERROR: Son diferentes
        console.log("❌ No coinciden. Volviendo a ocultar...");

        // Usamos setTimeout para darle 1.2 segundos al usuario para memorizar
        // antes de voltear las cartas boca abajo automáticamente
        setTimeout(() => {
            carta1.html.classList.remove('volteada');
            carta2.html.classList.remove('volteada');

            // Una vez que se ocultaron visualmente, limpiamos la memoria y desbloqueamos el tablero
            estado.cartasVolteadas = [];
            estado.tableroBloqueado = false;
        }, 1200); // 1200 milisegundos = 1.2 segundos
    }
}