const express = require('express');
const conectarDB = require('./config/db');


//servidor
const app = express();

//conectar a la base de datos
conectarDB();

//puerto
const port = process.env.PORT || 4000;

//habilitar leer los valores de un body
app.use(express.json());

//rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//init
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})
