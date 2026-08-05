const { Op } = require('sequelize');
const { sequelize, Receta, Categoria, Ingrediente, RecetaIngrediente } = require('../models');

async function crear(req, res) {
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
    res.status(500).json({ error: 'Error al crear la receta' });
}
}

async function listar(req, res) {
try {
    const { categoriaId, busqueda } = req.query;
    const where = { userId: req.user.id };

    if (categoriaId) where.categoriaId = categoriaId;
    if (busqueda) where.nombre = { [Op.iLike]: `%${busqueda}%` };

    const recetas = await Receta.findAll({
    where,
    include: [{ model: Categoria, as: 'categoria' }],
    order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ recetas });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas' });
}
}

async function obtener(req, res) {
try {
    const receta = await Receta.findByPk(req.params.id, {
    include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente }]
    });

    if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
    }
    if (receta.userId !== req.user.id) {
    return res.status(403).json({ error: 'No tenés permiso para ver esta receta' });
    }

    res.status(200).json({ receta });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener la receta' });
}
}

async function actualizar(req, res) {
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
    res.status(500).json({ error: 'Error al actualizar la receta' });
}
}

async function eliminar(req, res) {
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
    res.status(500).json({ error: 'Error al eliminar la receta' });
}
}

module.exports = { crear, listar, obtener, actualizar, eliminar };