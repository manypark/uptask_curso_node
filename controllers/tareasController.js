const Proyectos = require('../models/Proyectos');
const proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // ! obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    // ! leer valor del input
    const { tarea } = req.body;

    const estado = 0;
    const proyectoId = proyecto.id;

    // ! insertar en la BD
    const result = await Tareas.create({ tarea, estado, proyectoId });

    !result ? next() : null;

    // ! redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res) => {
    
    const { id } = req.params;

    const tarea = await Tareas.findOne({ where: { id } });

    // ! cambiar estado
    let estado = 0;

    tarea.estado === estado ? estado = 1 : null ;

    tarea.estado = estado;

    const result = await tarea.save();

    !result ? next() : null;

    res.status(200).send('Actualizado');
    
}

exports.eliminarTarea = async (req, res, next) => {

    const { id } = req.params;

    const result = await Tareas.destroy({ where: { id } });

    !result ? next() : null;

    res.status(200).send('Eliminado..');
}



