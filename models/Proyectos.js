const sequelize = require('sequelize');
const slug = require('slug');
const db = require('../config/db');
const shorid = require('shortid');

const Proyectos = db.define('proyectos', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: sequelize.STRING,
    url: sequelize.STRING

}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLocaleLowerCase();
            proyecto.url = `${url}-${shorid.generate()}`;
        }
    }
});

module.exports = Proyectos;