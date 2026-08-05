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

const validarCrearReceta = [
body('nombre')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
body('categoriaId')
    .isInt()
    .withMessage('Debe indicar una categoría válida'),
body('pasos')
    .trim()
    .notEmpty()
    .withMessage('Los pasos de preparación son obligatorios'),
body('tiempoPreparacion')
    .isInt({ min: 1 })
    .withMessage('El tiempo de preparación debe ser un número mayor a 0'),
body('porciones')
    .isInt({ min: 1 })
    .withMessage('Las porciones deben ser un número mayor a 0'),
body('ingredientes')
    .isArray({ min: 1 })
    .withMessage('Debe indicar al menos un ingrediente'),
body('ingredientes.*.nombre')
    .trim()
    .notEmpty()
    .withMessage('Cada ingrediente debe tener un nombre'),
body('ingredientes.*.cantidad')
    .isFloat({ min: 0.01 })
    .withMessage('La cantidad de cada ingrediente debe ser mayor a 0'),
body('ingredientes.*.unidad')
    .trim()
    .notEmpty()
    .withMessage('Cada ingrediente debe indicar una unidad')
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

module.exports = { validarRegistro, validarLogin, validarCrearReceta, manejarErroresValidacion };