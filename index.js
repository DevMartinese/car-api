'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3001;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://devmartinese:cmave016@ds233571.mlab.com:33571/heroku_7fwbg5p2', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
           console.log('La conexion a la BBDD se realizo con exito');

           //Creación del servidor
           app.listen(port, () => {
               console.log(`Servidor conrriendo en http://localhost:${port}`);
           });
        });

