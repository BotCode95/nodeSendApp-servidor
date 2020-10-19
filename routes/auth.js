const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');
const auth = require('../middleware/auth')

//api/auth
router.post('/',
    [
        check('email', 'agrega un email válido').isEmail(),
        check('password', 'El password es necesario').not().isEmpty()
    ],
    authController.autenticarUsuario,
);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;