const Usuarios = require('../models/Usuarios');
const enviarEmails = require('../handler/email');

exports.formCrearCuenta = async (req, res) => {
    res.render('crearCuenta',  {
        nombrePagina: 'Crear cuenta en Uptaks'
    });
}

exports.formIniciarSesion = async (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion',  {
        nombrePagina: 'Iniciar sesion en Uptask',
        error
    });
}

exports.crearCuenta = async (req, res) => {
    // ! leer datos
    const { email, password } = req.body;

    try {
         // ! crear usuarios
        await Usuarios.create({
            email,
            password
        });

        // ! crear una URL de confirmar
        const confimarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // ! crear el objeto de usuario
        const usuario = {
            email
        };

        // ! enviar email
        await enviarEmails.enviar({
            usuario,
            subject: 'Confirmacion de correo',
            confimarUrl,
            archivo: 'confirmar-cuenta.pug'
        });

        // ! redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {

        req.flash('error', error.errors.map(err => err.message) );
        res.render('crearCuenta',  {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptaks',
            email,
            password
        });
    }
}

exports.formRestablecerPassword = async (req, res, next) => {
    res.render('restablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

exports.confirmarCuenta = async (req, res, next) => {
    
        const usuario = await Usuarios.findOne({
            where: {
                email: req.params.correo
            }
        });

        if(!usuario){
            req.flash('error', 'Correo no valido');
            res.redirect('/crear-cuenta');
        }

        usuario.activo = 1;
        await usuario.save();

        req.flash('correcto', 'Cuenta activada correctamente');
        res.redirect('/iniciar-sesion');
    
}