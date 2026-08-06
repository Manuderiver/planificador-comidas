const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Favorito = sequelize.define('Favorito', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    recetaId: {
    type: DataTypes.INTEGER,
    allowNull: false
    }
}, {
    tableName: 'Favoritos',
    timestamps: true
});

return Favorito;
};