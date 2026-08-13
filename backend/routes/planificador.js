const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { validarAsignarSlot, validarSlotParams, manejarErroresValidacion } = require('../middleware/validators');
const { obtener, asignar, quitar } = require('../controllers/planificadorController');

router.use(verificarToken);

router.get('/', obtener);
router.put('/:dia/:comida', validarAsignarSlot, manejarErroresValidacion, asignar);
router.delete('/:dia/:comida', validarSlotParams, manejarErroresValidacion, quitar);

module.exports = router;