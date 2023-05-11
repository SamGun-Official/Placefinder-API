'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const usage = [];

    for (let i = 0; i < 20; i++) {
      const newUsage = {
        id_pricelist: faker.datatype.number({ min: 1, max: 20 }),
        date: faker.date.between('2022-01-01', '2022-12-31'),
        subtotal: faker.datatype.number({ min: 100, max: 500 }),
        status: faker.datatype.number({ min: 0, max: 3 }),
        created_at: new Date(),
        updated_at: new Date()
      };

      usage.push(newUsage);
    }

    await  queryInterface.bulkInsert('usages',usage, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usages', null, {});
  }
};
