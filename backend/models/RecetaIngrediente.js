const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const RecetaIngrediente = sequelize.define('RecetaIngrediente', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    recetaId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    ingredienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
        min: 0.01
    }
    },
    unidad: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
        notEmpty: true
    }
    }
}, {
    tableName: 'RecetaIngredientes',
    timestamps: true
});

return RecetaIngrediente;
};