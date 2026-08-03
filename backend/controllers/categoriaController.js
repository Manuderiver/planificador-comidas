const { Categoria } = require('../models');

async function listar(req, res) {
try {
    const categorias = await Categoria.findAll({
    order: [['nombre', 'ASC']]
    });
    res.status(200).json({ categorias });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
}
}

module.exports = { listar };