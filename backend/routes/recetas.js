const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { validarCrearReceta, manejarErroresValidacion } = require('../middleware/validators');
const { crear, listar, obtener, actualizar, eliminar } = require('../controllers/recetaController');
const { agregar, quitar } = require('../controllers/favoritoController');

router.use(verificarToken);

router.post('/', validarCrearReceta, manejarErroresValidacion, crear);
router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', validarCrearReceta, manejarErroresValidacion, actualizar);
router.delete('/:id', eliminar);
router.post('/:id/favorito', agregar);
router.delete('/:id/favorito', quitar);

module.exports = router;