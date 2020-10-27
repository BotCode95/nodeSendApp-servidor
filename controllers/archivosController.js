const multer = require('multer');
const shortid = require('shortid');
const fs= require('fs');
const Enlaces = require('../models/Enlace')

exports.subirArchivo = async (req,res, next) => {
    
    const configuracionMulter = {
        //si esta autenticado 10MB sino 1MB
        limits: { fileSize: req.usuario ? 1024 *1024 * 10 : 1024 * 1024 }, 
        storage: fileStorage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req,file,cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                // mimetype.split('/')[1] //[0]image - [1]tipo de archivo
                cb(null, `${shortid.generate()}${extension}`);
            }
            //no aceptar un tipo de archivo seria 
            // fileFilter: (req,res,cb) => {
            //     if(file.mimetype === 'application/pdf') {
            //         return cb(null,true)
            //     }
            // }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');
    
    upload(req,res,async (error) => {

        console.log(req.file);
        if(!error){
            res.json({archivo: req.file.filename}); //nombre del archivo
        }else {
            console.log(error);
            return next();
        }
    })
   
}

exports.eliminarArchivo = async (req,res) => {
    console.log(req.archivo);
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
        
    } catch (error) {
        console.log(error);
    }
}

//descarga un archivo
exports.descargar = async (req,res, next) =>  {

    //obtiene el enlace 
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo});

    console.log(enlace);

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);
    

    //eliminar archivo y la entrada de la DB
    
    //si las descargas son igual a 1 se elimina el archivo
    const {descargas, nombre} = enlace;
    if(descargas === 1){
        // console.log('solo 1');

        //eliminar archivo
        req.archivo = nombre;
        
        //eliminar de bd
        //await Enlaces.findOneAndRemove(enlace.id);
        await Enlaces.findOneAndRemove({nombre: nombre}); //check eliminacion en db
        next(); //para pasar al siguiente controlador -> archivosController.eliminarArchivo

    }else {
         //si descargas > 1 restar descargas--
         enlace.descargas--;
         await enlace.save();
        // console.log('Aún hay descargas')
    }
}

