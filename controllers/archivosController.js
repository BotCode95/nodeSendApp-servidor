const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.subirArchivo = async (req,res) => {
    //req.file
    console.log(req.file);
}

exports.eliminarArchivo = async (req,res) => {

}