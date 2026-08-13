const { DataTypes } = require('sequelize');
const { DIAS, COMIDAS } = require('../utils/constantes');

module.exports = (sequelize) => {
const PlanificadorSlot = sequelize.define('PlanificadorSlot', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    dia: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
        isIn: [DIAS]
    }
    },
    comida: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
        isIn: [COMIDAS]
    }
    },
    recetaId: {
    type: DataTypes.INTEGER,
    allowNull: false
    }
}, {
    tableName: 'PlanificadorSlots',
    timestamps: true
});

return PlanificadorSlot;
};