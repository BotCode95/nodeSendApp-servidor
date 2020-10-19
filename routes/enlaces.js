const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const {check} = require('express-validator');
const auth = require('../middleware/auth')

//api/auth
router.post('/',
    auth,
    enlacesController.nuevoEnlace,
);

// router.get('/',
//     auth,
//     enlacesController.obtenerEnlace
// );

module.exports = router;