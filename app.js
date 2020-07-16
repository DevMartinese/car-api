'use strict'

//Cargar modulos para crear el server
const express = require('express');
const bodyParser = require('body-parser');

//Ejechucón de express
const app = express();

//Cargar ficheros de rutas
const article_router = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir rutas
app.use('/api', article_router);

//Exportar modulo
module.exports = app;