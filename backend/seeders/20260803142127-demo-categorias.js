'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const ahora = new Date();

    await queryInterface.bulkInsert('Categorias', [
      { nombre: 'Desayuno', createdAt: ahora, updatedAt: ahora },
      { nombre: 'Almuerzo', createdAt: ahora, updatedAt: ahora },
      { nombre: 'Cena', createdAt: ahora, updatedAt: ahora },
      { nombre: 'Merienda', createdAt: ahora, updatedAt: ahora },
      { nombre: 'Postre', createdAt: ahora, updatedAt: ahora },
      { nombre: 'Bebidas', createdAt: ahora, updatedAt: ahora }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categorias', null, {});
  }
};