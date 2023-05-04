"use strict";
const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transactions = [];
    for (let i = 1; i <= 50; i++) {
      const check_in_date = faker.date.between('2022-01-01', '2022-12-31');
      const check_out_date = faker.date.between(check_in_date, '2023-12-31');
      let trans = {
        number: `BK-${i.toString().padStart(3, "0")}`,
        id_accomodation: Math.floor(Math.random() * 10) + 1,
        id_user: Math.floor(Math.random() * 10) + 1,
        date: new Date(),
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        price: Math.floor(Math.random() * 5000000) + 1000000,
        subtotal: Math.floor(Math.random() * 500000) + 100000,
        status: 1,
        is_check_out: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      transactions.push(trans);
    }
    await queryInterface.bulkInsert("transactions", transactions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactions", null, {});
  },
};
