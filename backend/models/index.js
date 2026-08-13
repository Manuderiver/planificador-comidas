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
const PlanificadorSlot = require('./PlanificadorSlot')(sequelize);

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

// Muchos a muchos entre User y Receta a través de Favorito
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

// Un usuario tiene muchos casilleros de planificador; cada casillero
// pertenece a un usuario y apunta a una receta
User.hasMany(PlanificadorSlot, { foreignKey: 'userId' });
PlanificadorSlot.belongsTo(User, { foreignKey: 'userId' });

Receta.hasMany(PlanificadorSlot, { foreignKey: 'recetaId' });
PlanificadorSlot.belongsTo(Receta, { foreignKey: 'recetaId', as: 'receta' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Categoria,
  Ingrediente,
  Receta,
  RecetaIngrediente,
  Favorito,
  PlanificadorSlot
};