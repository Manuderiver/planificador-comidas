'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlanificadorSlots', {
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
      dia: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      comida: {
        type: Sequelize.STRING(10),
        allowNull: false
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

    await queryInterface.addConstraint('PlanificadorSlots', {
      fields: ['userId', 'dia', 'comida'],
      type: 'unique',
      name: 'planificador_user_dia_comida_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlanificadorSlots');
  }
};