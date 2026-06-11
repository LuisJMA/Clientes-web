// Creamos el catálogo global de temáticas inspiradas en One Piece
window.gameThemes = {
    eastBlue: {
        name: "Mar de la Supervivencia",
        cssClass: "saga-east-blue",
        // Lista base de 8 elementos de prueba (suficientes para el modo fácil 4x4)
        items: [
            { id: 'luffy', content: '👒' },
            { id: 'zoro', content: '⚔️' },
            { id: 'nami', content: '🍊' },
            { id: 'usopp', content: '🎯' },
            { id: 'sanji', content: '🚬' },
            { id: 'chopper', content: '🌸' },
            { id: 'ace', content: '🔥' },
            { id: 'ship', content: '🏴‍☠️' }
        ]
    },
    nuevoMundo: {
        name: "El Nuevo Mundo",
        cssClass: "saga-nuevo-mundo",
        items: [] // se completara más adelante
    },
    yonkos: {
        name: "Guerra de Yonkos",
        cssClass: "saga-yonkos",
        items: [] // Los completaremos más adelante
    }
};

console.log("¡Catálogo de Sagas cargado con éxito!", window.gameThemes);