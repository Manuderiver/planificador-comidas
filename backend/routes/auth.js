const express = require('express');
const router = express.Router();
const { register, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');
const { validarRegistro, validarLogin, manejarErroresValidacion } = require('../middleware/validators');

// POST /api/auth/register - Registro de usuario (pública)
router.post('/register', validarRegistro, manejarErroresValidacion, register);

// POST /api/auth/login - Inicio de sesión (pública)
router.post('/login', validarLogin, manejarErroresValidacion, login);

// GET /api/auth/perfil - Obtener perfil (protegida)
router.get('/perfil', verificarToken, perfil);

module.exports = router;