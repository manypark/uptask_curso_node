export const actualizarAvance = () => {
    // ! seleccionar las tareas existente
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length) {
        // ! seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');

        // ! calcular avance
        const avance = Math.round( ( tareasCompletadas.length / tareas.length) * 100 );
    
        // ! mostrar avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';
    }

}