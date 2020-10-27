const multer = require('multer');
const shortid = require('shortid');
const fs= require('fs');

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
exports.descargar = async (req,res) =>  {
    const archivo = __dirname + '/../uploads/' + req.params.archivo;
    res.download(archivo);
    // console.log(req.params.archivo);
}

