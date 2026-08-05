const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Receta = sequelize.define('Receta', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
        notEmpty: true
    }
    },
    descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
    },
    pasos: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
        notEmpty: true
    }
    },
    tiempoPreparacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 1
    }
    },
    porciones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 1
    }
    },
    imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true
    }
}, {
    tableName: 'Recetas',
    timestamps: true
});

return Receta;
};