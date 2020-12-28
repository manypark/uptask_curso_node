const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const enviarEmails = require('../handler/email');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    failureMessage: 'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = async (req, res, next) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion');
    });   
}

// ! generar token si el usuario es valido
exports.enviarToken = async (req, res, next) => {
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(45).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // ! envia el correo con el token
    await enviarEmails.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reestablecerPassword.pug'
    });

    // ! terminar ejecucion
    req.flash('correcto', 'Se envio un mensjae a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res, next) => {
    
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // ! formulario valido
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    });
    
}

// ! actualizar password
exports.actualizarPassword = async (req, res, next) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // ! verificar si usuario existe
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // ! hashear password
    usuario.password = bcrypt.hashSync( req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    // ! se guarda el nuevo pasword
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
    
}


