
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
    const estado = window.gameState;
    
    // A. Capturamos el contenedor del tablero que dejamos vacío en el HTML
    const contenedorTablero = document.getElementById('contenedor-tablero');
    
    // B. Limpiamos el contenedor por si había una partida vieja guardada
    contenedorTablero.innerHTML = '';

    // C. Configuramos la cuadrícula de forma dinámica según la dificultad
    const dificultad = estado.difficulty;
    contenedorTablero.className = `tablero-${dificultad}`;

    //  Nadie puede hacer clics rápidos durante el vistazo previo
    estado.tableroBloqueado = true;

    // D. Recorremos el mazo de cartas barajadas para fabricar cada carta en la pantalla
    cartas.forEach((carta, indice) => {
        
        // 1. Creamos el div principal que representará la carta física
        const divCarta = document.createElement('div');
        divCarta.classList.add('carta'); 
        // --- CAMBIO: Forzamos la clase 'volteada' un milisegundo después ---
        setTimeout(() => divCarta.classList.add('volteada'), 1);
        
        // Guardamos el índice de la posición de la carta en un atributo de datos nativo ('data-')
        divCarta.dataset.indice = indice;

        // 2. Creamos la "Estructura Interna" de la carta respetando tus clases originales
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

    console.log(`¡Tablero visual renderizado con éxito para el modo ${dificultad}! Iniciando vistazo...`);

    
    //  MECANISMO DEL VISTAZO INICIAL (3.5 Segundos de cortesía)
    
    setTimeout(() => {
        // Buscamos todas las cartas que creamos en el DOM y les removemos la clase para ocultarlas
        const todasLasCartas = document.querySelectorAll('.carta');
        todasLasCartas.forEach(cartaHTML => {
            cartaHTML.classList.remove('volteada');
        });

        // Desbloqueamos el control lógico del juego para permitir los clics
        estado.tableroBloqueado = false;
        console.log("⚔️ ¡Vistazo terminado! Haki de observación activado. ¡A jugar!");

        // REGLA DEL CRONÓMETRO: Si es modo solitario
        if (estado.mode === 'solitario') {
            document.getElementById('segundos').textContent = '0'; 
            iniciarCronometro(); // Esta función viene de tiempo.js
        }

    }, 3500); // 3500 milisegundos = 3.5 segundos 
    // ==========================================================================
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

        if (estado.mode === 'pvp') {
            estado.players[estado.turnoActual].score++;
            actualizarHudVersus(); // Refrescamos los números en la pantalla de inmediato
        }

        // Calculamos cuántas parejas requiere la dificultad actual para declarar victoria
        let parejasTotales = 8; // Fácil por defecto (4x4)
        if (estado.difficulty === 'intermedio') parejasTotales = 18; // Intermedio (6x6)
        if (estado.difficulty === 'dificil') parejasTotales = 32;    // Difícil (8x8)

        // Limpiamos la bolsa de control para el próximo turno y desbloqueamos antes de evaluar victoria
        estado.cartasVolteadas = [];
        estado.tableroBloqueado = false;

        // VALIDACIÓN DE VICTORIA BLINDADA
        if (estado.parejasEncontradas === parejasTotales) {
            if (estado.mode === 'solitario') {
                detenerCronometro(); 
            }
            // Le damos 300 milisegundos para que el usuario vea su última pareja completada
            // y el HUD se actualice antes de cambiar de pantalla abruptamente
            setTimeout(() => {
                finalizarPartida(); 
            }, 300);
        }    
    } 
    else {
        // CASO ERROR: Son diferentes
        console.log("❌ No coinciden. Volviendo a ocultar...");

        if (estado.mode === 'pvp') {
            estado.players[estado.turnoActual].fails++;
        } else {
            estado.players.p1.fails++; 
        }

        if (estado.mode === 'pvp') {
            estado.turnoActual = (estado.turnoActual === 'p1') ? 'p2' : 'p1';
            actualizarHudVersus(); 
        }

        // Usamos setTimeout para darle 1.2 segundos al usuario para memorizar
        setTimeout(() => {
            carta1.html.classList.remove('volteada');
            carta2.html.classList.remove('volteada');

            // Una vez que se ocultaron visualmente, limpiamos la memoria y desbloqueamos el tablero
            estado.cartasVolteadas = [];
            estado.tableroBloqueado = false;
        }, 1200); 
    }
}
// 6. FUNCIÓN AUXILIAR PARA EL MODO VERSUS
function actualizarHudVersus() {
    const estado = window.gameState;
    
    // Actualizamos los números de los puntos en pantalla
    document.getElementById('score-hud-p1').textContent = estado.players.p1.score;
    document.getElementById('score-hud-p2').textContent = estado.players.p2.score;

    // Cambiamos el brillo dorado según quién tenga el turno actual
    const divP1 = document.getElementById('hud-p1');
    const divP2 = document.getElementById('hud-p2');

    if (estado.turnoActual === 'p1') {
        divP1.classList.add('activo');
        divP2.classList.remove('activo');
    } else {
        divP2.classList.add('activo');
        divP1.classList.remove('activo');
    }
}

// PANTALLA DE RESULTADOS Y FIN DE JUEGO
function finalizarPartida() {
    const estado = window.gameState;
    const bloqueEstadisticas = document.getElementById('bloque-estadisticas');
    let tituloGanador = "";
    let tablaResultados = "";

    if (estado.mode === 'pvp') {
        const p1 = estado.players.p1;
        const p2 = estado.players.p2;

        if (p1.score > p2.score) {
            tituloGanador = `👑 ¡El Rey de los Piratas es ${p1.name}! 👑`;
        } else if (p2.score > p1.score) {
            tituloGanador = `👑 ¡El Rey de los Piratas es ${p2.name}! 👑`;
        } else {
            tituloGanador = "🏴‍☠️ ¡Un empate en Grand Line! Ambos son formidables 🏴‍☠️";
        }

        tablaResultados = `
            <div class="cuadro-estadisticas">
                <h3>${tituloGanador}</h3>
                <hr>
                <p><strong>🏴‍☠️ ${p1.name}:</strong> ${p1.score} parejas | ❌ ${p1.fails} fallos</p>
                <p><strong>⚔️ ${p2.name}:</strong> ${p2.score} parejas | ❌ ${p2.fails} fallos</p>
            </div>
        `;
    } else {
        tituloGanador = `🏆 ¡Travesía Completada, ${estado.players.p1.name}! 🏆`;
        const tiempoTexto = (estado.mode === 'solitario') ? `<p>⏱️ <strong>Tiempo:</strong> ${estado.tiempoTranscurrido}s</p>` : '';
        tablaResultados = `
            <div class="cuadro-estadisticas">
                <h3>${tituloGanador}</h3>
                <hr>
                ${tiempoTexto}
                <p>❌ <strong>Fallos totales:</strong> ${estado.players.p1.fails}</p>
            </div>
        `;
    }

    bloqueEstadisticas.innerHTML = `
        ${tablaResultados}
        <div class="contenedor-botones-final">
            <button id="btn-revancha" class="btn-final">🔄 Revancha Rápida</button>
            <button id="btn-menu" class="btn-final">🏠 Volver al Menú</button>
        </div>
    `;

    document.getElementById('btn-revancha').addEventListener('click', iniciarRevancha);
    document.getElementById('btn-menu').addEventListener('click', volverAlMenuPrincipal);
    document.getElementById('pantalla-juego').style.display = 'none';
    document.getElementById('pantalla-resultados').style.display = 'block';
}

function iniciarRevancha() {
    const estado = window.gameState;
    estado.parejasEncontradas = 0;
    estado.tiempoTranscurrido = 0;
    estado.tableroBloqueado = false;
    estado.cartasVolteadas = [];
    estado.turnoActual = 'p1';
    estado.players.p1.score = 0;
    estado.players.p1.fails = 0;
    estado.players.p2.score = 0;
    estado.players.p2.fails = 0;

    const nuevasCartas = inicializarCartas();
    renderizarTablero(nuevasCartas);

    if (estado.mode === 'solitario') {
        iniciarCronometro(); 
    } else if (estado.mode === 'pvp') {
        actualizarHudVersus();
    }

    document.getElementById('pantalla-resultados').style.display = 'none';
    document.getElementById('pantalla-juego').style.display = 'block';
}

function volverAlMenuPrincipal() {
    document.getElementById('pantalla-resultados').style.display = 'none';
    document.getElementById('pantalla-menu').style.display = 'block';
    document.getElementById('formulario-config').reset();
    document.getElementById('bloque-jugador2').style.display = 'none';
    document.getElementById('nombre-p2').required = false;
}