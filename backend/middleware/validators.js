const { body, validationResult } = require('express-validator');

const validarRegistro = [
body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validarLogin = [
body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

function manejarErroresValidacion(req, res, next) {
const errores = validationResult(req);
if (!errores.isEmpty()) {
    return res.status(400).json({
    error: 'Datos inválidos',
    detalles: errores.array().map(e => ({ campo: e.path, mensaje: e.msg }))
    });
}
next();
}

module.exports = { validarRegistro, validarLogin, manejarErroresValidacion };