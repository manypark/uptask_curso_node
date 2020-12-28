const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// ! Referencia la modelo que vamos autenticar
const Usuarios = require('../models/Usuarios');

// ! local strategy - login con credenciales
passport.use(
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                // ! usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done({
                        message: 'Password incorrecto'
                    });    
                }

                return done(null, usuario);

            } catch (error) {
                // ! usuario no existe
                return done({
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
);

// ! serializar usuario
    passport.serializeUser((usuario, callback) => {
        callback(null, usuario);
    });

// ! deserializar usuario
    passport.deserializeUser((usuario, callback) => {
        callback(null, usuario);
    });

module.exports = passport;