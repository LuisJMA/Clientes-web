// js/views/explore.js

/**
 * Renderiza la interfaz base del buscador global.
 * Esta función destruye el cascarón antiguo y dibuja el formulario real.
 */
function renderExplore() {
    const app = document.getElementById('app');

    // 1. Inyectamos el esqueleto HTML del buscador de forma dinámica
    app.innerHTML = `
        <div class="explore-view">
            <header class="explore-header">
                <h2>Explorar la Colección</h2>
                <p>Busca entre más de 500,000 años de historia del arte universal.</p>
            </header>

            <!-- Formulario de Búsqueda -->
            <form id="search-form" class="search-box">
                <input 
                    type="text" 
                    id="search-input" 
                    placeholder="Ej: sunflowers, Rembrandt, Da Vinci, armor..." 
                    required
                    autocomplete="off"
                >
                <button type="submit" id="search-btn">Buscar</button>
            </form>

            <!-- Contenedor del Loader (Se mostrará mientras descarga de internet) -->
            <div id="search-loader" class="loader-container hidden">
                <div class="spinner"></div>
                <p>Viajando a los servidores del MET...</p>
            </div>

            <!-- Zona de Mensajes o Errores -->
            <div id="search-message" class="search-message"></div>

            <!-- Cuadrícula (Grid) donde se pintarán las tarjetas de las obras -->
            <div id="results-grid" class="results-grid"></div>
        </div>
    `;

    // 2. Capturamos los elementos recién creados en el DOM para asignarles lógica
    const searchForm = document.getElementById('search-form');
    
    // Escuchamos el evento 'submit' (cuando el usuario presiona Enter o hace clic en Buscar)
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue e interrumpa la SPA
        
        const query = document.getElementById('search-input').value.trim();
        
        if (query) {
            executeSearch(query);
        }
    });
}

/**
 * Función interna encargada de coordinar la búsqueda con la API (Cascarón inicial)
 */
function executeSearch(query) {
    const messageContainer = document.getElementById('search-message');
    const gridContainer = document.getElementById('results-grid');
    
    // Limpiamos pantallas anteriores
    gridContainer.textContent = '';
    
    // Mostramos un mensaje temporal antes de conectar la API real
    messageContainer.innerHTML = `<p>Buscando obras relacionadas con: <strong>"${query}"</strong>...</p>`;
}