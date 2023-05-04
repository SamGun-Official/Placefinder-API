'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    for (let i = 1; i <= 50; i++) {
      users.push({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: faker.datatype.number({ min: 1, max: 3 }),
        saldo: faker.datatype.number({ min: 100000, max: 10000000 }),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
        tanggal_lahir: faker.date.between('1980-01-01', '2003-12-31'),
        id_card_number: '32' + faker.datatype.number({ min: 10, max: 99 }) + faker.date.past(60).getFullYear().toString().slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 12 })).slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 28 })).slice(-2) + faker.datatype.number({ min: 1000, max: 9999 }),
        is_id_card_verified: faker.datatype.number({ min: 0, max: 1 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
