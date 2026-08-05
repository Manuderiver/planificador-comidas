const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { validarCrearReceta, manejarErroresValidacion } = require('../middleware/validators');
const { crear, listar, obtener, actualizar, eliminar } = require('../controllers/recetaController');

router.use(verificarToken);

router.post('/', validarCrearReceta, manejarErroresValidacion, crear);
router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', validarCrearReceta, manejarErroresValidacion, actualizar);
router.delete('/:id', eliminar);

module.exports = router;