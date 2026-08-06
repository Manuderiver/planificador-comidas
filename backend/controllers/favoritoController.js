const { Receta, Favorito } = require('../models');

async function agregar(req, res) {
try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
    }

    await Favorito.findOrCreate({
    where: { userId: req.user.id, recetaId: receta.id }
    });

    res.status(200).json({ message: 'Receta agregada a favoritos' });
} catch (error) {
    res.status(500).json({ error: 'Error al agregar a favoritos' });
}
}

async function quitar(req, res) {
try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
    }

    await Favorito.destroy({
    where: { userId: req.user.id, recetaId: receta.id }
    });

    res.status(200).json({ message: 'Receta quitada de favoritos' });
} catch (error) {
    res.status(500).json({ error: 'Error al quitar de favoritos' });
}
}

module.exports = { agregar, quitar };