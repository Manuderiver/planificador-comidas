'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RecetaIngredientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      recetaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recetas',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ingredienteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ingredientes',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      unidad: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RecetaIngredientes');
  }
};