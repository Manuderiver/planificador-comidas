const { Op } = require('sequelize');
const { sequelize, Receta, Categoria, Ingrediente, RecetaIngrediente, Favorito } = require('../models');

async function crear(req, res, next) {
const { nombre, descripcion, categoriaId, pasos, tiempoPreparacion, porciones, imagenUrl, ingredientes } = req.body;

const transaction = await sequelize.transaction();
try {
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
    await transaction.rollback();
    return res.status(404).json({ error: 'La categoría indicada no existe' });
    }

    const receta = await Receta.create({
    userId: req.user.id,
    categoriaId,
    nombre,
    descripcion,
    pasos,
    tiempoPreparacion,
    porciones,
    imagenUrl
    }, { transaction });

    for (const item of ingredientes) {
    const [ingrediente] = await Ingrediente.findOrCreate({
        where: { nombre: item.nombre.trim() },
        transaction
    });

    await RecetaIngrediente.create({
        recetaId: receta.id,
        ingredienteId: ingrediente.id,
        cantidad: item.cantidad,
        unidad: item.unidad
    }, { transaction });
    }

    await transaction.commit();

    const recetaCompleta = await Receta.findByPk(receta.id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente }]
    });

    res.status(201).json({ message: 'Receta creada exitosamente', receta: recetaCompleta });
} catch (error) {
    await transaction.rollback();
    next(error);
}
}

async function listar(req, res, next) {
try {
    const { categoriaId, busqueda, misRecetas, favoritas } = req.query;
    const where = {};

    if (misRecetas === 'true') {
    where.userId = req.user.id;
    }
    if (categoriaId) {
    where.categoriaId = categoriaId;
    }
    if (busqueda) {
    where.nombre = { [Op.iLike]: `%${busqueda}%` };
    }
    if (favoritas === 'true') {
    const favoritos = await Favorito.findAll({
        where: { userId: req.user.id },
        attributes: ['recetaId']
    });
    where.id = { [Op.in]: favoritos.map(f => f.recetaId) };
    }

    const recetas = await Receta.findAll({
    where,
    include: [{ model: Categoria, as: 'categoria' }],
    order: [['createdAt', 'DESC']]
    });

    const misFavoritos = await Favorito.findAll({
    where: { userId: req.user.id },
    attributes: ['recetaId']
    });
    const idsFavoritos = new Set(misFavoritos.map(f => f.recetaId));

    const recetasConFavorito = recetas.map(receta => ({
    ...receta.toJSON(),
    esFavorita: idsFavoritos.has(receta.id),
    esPropia: receta.userId === req.user.id
    }));

    res.status(200).json({ recetas: recetasConFavorito });
} catch (error) {
    next(error);
}
}

async function obtener(req, res, next) {
try {
    const receta = await Receta.findByPk(req.params.id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente }]
    });

    if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const favorito = await Favorito.findOne({
    where: { userId: req.user.id, recetaId: receta.id }
    });

    res.status(200).json({
    receta: {
        ...receta.toJSON(),
        esFavorita: !!favorito,
        esPropia: receta.userId === req.user.id
    }
    });
} catch (error) {
    next(error);
}
}

async function actualizar(req, res, next) {
const { nombre, descripcion, categoriaId, pasos, tiempoPreparacion, porciones, imagenUrl, ingredientes } = req.body;

const transaction = await sequelize.transaction();
try {
    const receta = await Receta.findByPk(req.params.id, { transaction });

    if (!receta) {
    await transaction.rollback();
    return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (receta.userId !== req.user.id) {
    await transaction.rollback();
    return res.status(403).json({ error: 'No tenés permiso para editar esta receta' });
    }

    const categoria = await Categoria.findByPk(categoriaId, { transaction });
    if (!categoria) {
    await transaction.rollback();
    return res.status(404).json({ error: 'La categoría indicada no existe' });
    }

    await receta.update({
    categoriaId,
    nombre,
    descripcion,
    pasos,
    tiempoPreparacion,
    porciones,
    imagenUrl
    }, { transaction });

    await RecetaIngrediente.destroy({ where: { recetaId: receta.id }, transaction });

    for (const item of ingredientes) {
    const [ingrediente] = await Ingrediente.findOrCreate({
        where: { nombre: item.nombre.trim() },
        transaction
    });

    await RecetaIngrediente.create({
        recetaId: receta.id,
        ingredienteId: ingrediente.id,
        cantidad: item.cantidad,
        unidad: item.unidad
    }, { transaction });
    }

    await transaction.commit();

    const recetaActualizada = await Receta.findByPk(receta.id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente }]
    });

    res.status(200).json({ message: 'Receta actualizada exitosamente', receta: recetaActualizada });
} catch (error) {
    await transaction.rollback();
    next(error);
}
}

async function eliminar(req, res, next) {
try {
    const receta = await Receta.findByPk(req.params.id);

    if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (receta.userId !== req.user.id) {
    return res.status(403).json({ error: 'No tenés permiso para eliminar esta receta' });
    }

    await receta.destroy();
    res.status(204).send();
} catch (error) {
    next(error);
}
}

module.exports = { crear, listar, obtener, actualizar, eliminar };