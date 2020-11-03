const Enlaces = require('../models/Enlace')
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.nuevoEnlace = async (req,res,next) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});

    }

    // console.log(req.body);

    //creacion objecto enlace
    const {nombre_original, nombre} = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    

    //si usuario esta autenticado
    if(req.usuario){
        //si esta autenticado puede decidir por cantidad de descargar y contraseñas
        const {password, descargas} = req.body;

        //asignar a enlace el num de descargas
        if(descargas){
            enlace.descargas = descargas;
        }
        //asignar un password
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password,salt);
        }

        //asignar autor
        enlace.autor = req.usuario.id 
    }

    //almacenar en la BD
    try {
        await enlace.save();
        res.json({msg: `${enlace.url}`})
    } catch (error) {
        console.log(error);
        
    }
}

//retorna si el enlace tiene password o no
exports.tienePassword = async (req,res,next) => {

        const {url} = req.params;
        console.log(url);

        //verificar si existe el enlace
        const enlace = await Enlaces.findOne({url});

        if(!enlace){
            res.status(404).json({msg: 'Ese enlace no existe'});
            return next();
        }

        if(enlace.password) {
            return res.json({password: true, enlace: enlace.url});
        }

        next();
   
}

//verifica si el password es correcto
exports.verificarPassword = async (req,res,next) => {
    
    const {url} = req.params;
    const {password} = req.body;
    //consultar por el enlace
    const enlace = await Enlaces.findOne({url});


    // verificar el password 
    if(bcrypt.compareSync(password, enlace.password)){
        //permitirle al usuario descargar el archivo
        next();
    } else {
        return res.status(401).json({msg: 'contraseña incorrecta'});
    }

    
    console.log(req.params);
    console.log(req.body);
}

//get link
exports.obtenerEnlace = async (req,res, next) => {

    const {url} = req.params;

    const enlace = await Enlaces.findOne({ url});

    if(!enlace){
        res.status(404).json({msg: 'El enlace no existe'});
        return next();
    }

    //si existe el link obtengo el nombre del archivo según su url
    //password paso como false al obtener el enlace queda como no tengo password o esta correcto
    res.json({archivo: enlace.nombre, password: false})

    //return; //evitar la eliminacion de la url
    //al tener permitido una descarga luego de visitarla se borra
    next();
}

//obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req,res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}

