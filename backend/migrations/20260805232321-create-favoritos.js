'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favoritos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      recetaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Recetas', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

    await queryInterface.addConstraint('Favoritos', {
      fields: ['userId', 'recetaId'],
      type: 'unique',
      name: 'favoritos_user_receta_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favoritos');
  }
};