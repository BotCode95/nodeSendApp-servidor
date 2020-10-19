const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

module.exports = (req,res, next) => {
    const authHeader = req.get('Authorization');
    
    if(authHeader){
        //get token
        const token = authHeader.split(' ')[1]; // [0]: Bearer ,  [1]: token

        //comprobar JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA);
            //asignar usuario
            req.usuario= usuario;
            // res.json({usuario})
        } catch (error) {
            console.log(error);
            console.log('JWT no válido');
        }
    }
    //cuando finaliza la ejecución del middleware pase al siguiente
    return next();
}