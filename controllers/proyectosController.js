const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    // ! lo que el usuario escribe
    const { nombre } = req.body;
    let errores = [];
    
    // ! validar que no se mande vacio
    !nombre ? errores.push({ 'texto' : 'Agrega un nombre al proyecto.' }) : null;

    if(errores.length > 0) {
        res.render('nuevoProyecto', { nombrePagina: 'Nuevo Proyecto', errores, proyectos })
    } else {
        const usuarioId = res.locals.usuario.id;
        Proyectos.create({ nombre, usuarioId }), res.redirect('/');
    }
};

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    const proyecto  = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    // ! consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }
    });

    !proyecto ? next() : null;

    res.render('tareas', {
        nombrePagina: 'Tareas de Proyecto',
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({ where: { usuarioId }});
    const proyectoPromise  = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    // ! lo que el usuario escribe
    const { nombre } = req.body;
    let errores = [];
    
    // ! validar que no se mande vacio
    !nombre ? errores.push({ 'texto' : 'Agrega un nombre al proyecto.' }) : null;

    errores.length > 0 ? res.render('nuevoProyecto', { nombrePagina: 'Nuevo Proyecto', errores, proyectos }) :
     (await Proyectos.update(
         { nombre: nombre },
         { where: { id: req.params.id } }
     ), res.redirect('/')  );
}

exports.eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;

    const result = await Proyectos.destroy({ where: { url: urlProyecto }});

    !result ? next() : null;

    res.send('Proyecto eliminado correctamente');
};