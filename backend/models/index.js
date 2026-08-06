// backend/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

// Carga de modelos
const User = require('./User')(sequelize);
const Categoria = require('./Categoria')(sequelize);
const Ingrediente = require('./Ingrediente')(sequelize);
const Receta = require('./Receta')(sequelize);
const RecetaIngrediente = require('./RecetaIngrediente')(sequelize);
const Favorito = require('./Favorito')(sequelize);

// Asociaciones

// Un usuario tiene muchas recetas; una receta pertenece a un usuario
User.hasMany(Receta, { foreignKey: 'userId' });
Receta.belongsTo(User, { foreignKey: 'userId' });

// Una categoría tiene muchas recetas; una receta pertenece a una categoría
Categoria.hasMany(Receta, { foreignKey: 'categoriaId', as: 'recetas' });
Receta.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// Muchos a muchos entre Receta e Ingrediente, con datos extra (cantidad, unidad)
// guardados en la tabla intermedia RecetaIngrediente
Receta.belongsToMany(Ingrediente, {
  through: RecetaIngrediente,
  foreignKey: 'recetaId',
  otherKey: 'ingredienteId'
});
Ingrediente.belongsToMany(Receta, {
  through: RecetaIngrediente,
  foreignKey: 'ingredienteId',
  otherKey: 'recetaId'
});

// Muchos a muchos entre User y Receta a través de Favorito:
// un usuario puede favoritear muchas recetas, una receta puede ser
// favorita de muchos usuarios distintos
User.belongsToMany(Receta, {
  through: Favorito,
  foreignKey: 'userId',
  otherKey: 'recetaId',
  as: 'recetasFavoritas'
});
Receta.belongsToMany(User, {
  through: Favorito,
  foreignKey: 'recetaId',
  otherKey: 'userId',
  as: 'usuariosQueFavoritearon'
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Categoria,
  Ingrediente,
  Receta,
  RecetaIngrediente,
  Favorito
};