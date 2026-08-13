const { Categoria } = require('../models');

async function listar(req, res, next) {
try {
    const categorias = await Categoria.findAll({
    order: [['nombre', 'ASC']]
    });
    res.status(200).json({ categorias });
} catch (error) {
    next(error);
}
}

module.exports = { listar };