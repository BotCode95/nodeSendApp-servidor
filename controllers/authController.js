const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: 'variables.env'});
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req,res,next) => {
    //revisar errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //buscar el usuario -ver si esta registrado
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});
    // console.log(usuario);


    if(!usuario){
        //401 - error en credenciales
        res.status(401).json({ msg : 'El usuario no existe'});
        return next(); //evitar la ejecución de lo que continua
    }

    //verificar password y autenticar
    if(bcrypt.compareSync(password, usuario.password)) {
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        },process.env.SECRETA, {
                expiresIn:'8h'
        });
        res.json({token});
    }else {
        res.status(401).json({msg: 'Password Incorrecto'})
        return next();
        // console.log('Password incorrecto');
    }
}

exports.usuarioAutenticado = (req,res, next) => {
    res.json({usuario: req.usuario});
}