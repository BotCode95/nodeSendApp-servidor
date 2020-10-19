const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const enlacesSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    nombre_original: {
        type: String,
        required: true,
    },
    descargas: {
        type: Number,
        default: 1 //default 1 descarga max si no esta registrado
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        default: null //default no tiene autor
    },
    password: {
        type: String,
        default: null //default no tiene password
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Enlaces', enlacesSchema);