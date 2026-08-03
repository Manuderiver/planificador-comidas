const express = require('express');
const router = express.Router();
const { listar } = require('../controllers/categoriaController');

// GET /api/categorias - Listar todas las categorías (pública)
router.get('/', listar);

module.exports = router;