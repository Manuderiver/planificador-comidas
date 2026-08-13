const { Op } = require('sequelize');
const { PlanificadorSlot, Receta, Categoria, Ingrediente } = require('../models');
const { DIAS, COMIDAS } = require('../utils/constantes');

async function obtener(req, res) {
try {
    const slots = await PlanificadorSlot.findAll({
    where: { userId: req.user.id },
    include: [{
        model: Receta,
        as: 'receta',
        include: [{ model: Categoria, as: 'categoria' }]
    }]
    });

    const semana = {};
    for (const dia of DIAS) {
    semana[dia] = {};
    for (const comida of COMIDAS) {
        const slot = slots.find(s => s.dia === dia && s.comida === comida);
        semana[dia][comida] = slot ? slot.receta : null;
    }
    }

    res.status(200).json({ semana });
} catch (error) {
    res.status(500).json({ error: 'Error al obtener el planificador' });
}
}

async function asignar(req, res) {
try {
    const { dia, comida } = req.params;
    const { recetaId } = req.body;

    const receta = await Receta.findByPk(recetaId);
    if (!receta) {
    return res.status(404).json({ error: 'La receta indicada no existe' });
    }

    const [slot] = await PlanificadorSlot.findOrCreate({
    where: { userId: req.user.id, dia, comida },
    defaults: { recetaId }
    });

    if (slot.recetaId !== Number(recetaId)) {
    await slot.update({ recetaId });
    }

    res.status(200).json({ message: 'Receta asignada correctamente' });
} catch (error) {
    res.status(500).json({ error: 'Error al asignar la receta' });
}
}

async function quitar(req, res) {
try {
    const { dia, comida } = req.params;

    await PlanificadorSlot.destroy({
    where: { userId: req.user.id, dia, comida }
    });

    res.status(200).json({ message: 'Casillero vaciado correctamente' });
} catch (error) {
    res.status(500).json({ error: 'Error al vaciar el casillero' });
}
}

async function listaIngredientes(req, res) {
try {
    const slots = await PlanificadorSlot.findAll({
    where: { userId: req.user.id }
    });

    const recetaIds = [...new Set(slots.map(s => s.recetaId))];

    if (recetaIds.length === 0) {
    return res.status(200).json({ ingredientes: [] });
    }

    const recetas = await Receta.findAll({
    where: { id: { [Op.in]: recetaIds } },
    include: [{ model: Ingrediente }]
    });

    const agrupado = {};
    for (const receta of recetas) {
    for (const ingrediente of receta.Ingredientes) {
        const { cantidad, unidad } = ingrediente.RecetaIngrediente;
        const clave = `${ingrediente.nombre}__${unidad}`;

        if (!agrupado[clave]) {
        agrupado[clave] = { ingrediente: ingrediente.nombre, unidad, cantidad: 0 };
        }
        agrupado[clave].cantidad += cantidad;
    }
    }

    const ingredientes = Object.values(agrupado)
    .sort((a, b) => a.ingrediente.localeCompare(b.ingrediente));

    res.status(200).json({ ingredientes });
} catch (error) {
    res.status(500).json({ error: 'Error al generar la lista de ingredientes' });
}
}

module.exports = { obtener, asignar, quitar, listaIngredientes };