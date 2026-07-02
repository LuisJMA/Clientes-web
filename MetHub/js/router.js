// js/router.js

/**
 * Creamos un objeto global llamado Router.
 * Centralizar la navegación aquí evita tener variables sueltas por todo el proyecto
 * y hace que nuestro código sea modular y fácil de mantener.
 */
const Router = {
    
    /**
     * 1. EL DICCIONARIO DE RUTAS (O MAPA DE LA APP)
     * Aquí definimos qué función de JavaScript se debe ejecutar según el Hash (#) 
     * que aparezca en la URL del navegador.
     */
    routes: {
        '#home': () => renderHome(),
        '#explore': () => renderExplore(),
        '#detail': (id) => renderDetail(id),
        '#departments': () => renderDepartments(),
        '#compare': () => renderCompare()
    },

    /**
     * 2. EL INICIALIZADOR:
     * Esta función se ejecuta una sola vez cuando la aplicación arranca.
     * Su trabajo es poner al navegador a escuchar los clics del usuario en el menú.
     */
    init() {
        // Le decimos al navegador: "Cada vez que el 'hash' (#) de la URL cambie,
        // ejecuta automáticamente nuestra función 'handleRoute'".
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Ejecutamos 'handleRoute' manualmente la primera vez que se carga el archivo.
        // ¿Por qué? Porque si el usuario escribe en la barra directamente "methub.com/#explore",
        // la página debe cargar la pantalla de exploración de inmediato sin esperar a que haga clic en nada.
        this.handleRoute();
    },

};