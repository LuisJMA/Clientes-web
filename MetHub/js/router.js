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
    }
};