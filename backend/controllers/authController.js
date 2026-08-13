const { User } = require('../models');
const { generarToken } = require('../middleware/auth');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar que no exista un usuario con ese email
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const user = await User.create({ nombre, email, password });

    const token = generarToken(user);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await user.validarPassword(password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(user);

    res.json({
      message: 'Login exitoso',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

const perfil = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, perfil };