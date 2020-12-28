const express       = require('express');
const routes        = require('./routes');
const path          = require('path');
const bodyParser    = require('body-parser');
const flash         = require('connect-flash');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const passport      = require('./config/passport');
require('dotenv');

// ! herlpers
const helpers = require('./helpers');

// ! crear conexion a db
const db = require('./config/db');

// ! importar modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync().then( () => {
    console.log('Servidor conectado');
})
.catch( (err) => console.log(err));

// ! crear una app express
const app = express();

// ! habiltar pug
app.set('view engine', 'pug');

// ! donde cargar los archivos staticos
app.use(express.static('public'));

// ! añadir carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// ! agregar flash messages
app.use(flash());

app.use(cookieParser());

// ! sesiones que nos permiten permanecer entre distintas paginas
app.use(session({
    secret: 'algobiensecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ! pasar vardump
app.use((req, res, next) => {
   res.locals.vardump = helpers.vardump;
   res.locals.mensajes = req.flash();
   res.locals.usuario = { ...req.user } || null;
   next();
});

// ! añadir body parser para leer los json
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes());

// ! servidor y puerto

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen( port, () => {
    console.log('Servidor corriendo en el puerto: ' + port);
});