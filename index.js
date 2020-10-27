const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');


//servidor
const app = express();

//conectar a la base de datos
conectarDB();


//habilitar cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));
//puerto
const port = process.env.PORT || 4000;

//habilitar leer los valores de un body
app.use(express.json());

//habilitar carpeta pública
app.use(express.static('uploads'));

//rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//init
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})
