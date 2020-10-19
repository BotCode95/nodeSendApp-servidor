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

    //creacion objecto enlace
    const {nombre_original, password} = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
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