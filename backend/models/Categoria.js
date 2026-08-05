const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Categoria = sequelize.define('Categoria', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: true
    }
    }
}, {
    tableName: 'Categorias',
    timestamps: true
});

return Categoria;
};