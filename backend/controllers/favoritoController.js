const { Receta, Favorito } = require('../models');

async function agregar(req, res, next) {
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
    next(error);
}
}

async function quitar(req, res, next) {
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
    next(error);
}
}

module.exports = { agregar, quitar };