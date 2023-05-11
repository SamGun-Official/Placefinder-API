'use strict';

const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    try {
    const d_trans = [];
  
      for (let i = 0; i < 20; i++) {
        const newD_trans = {
          id_htrans: faker.datatype.number({ min: 1, max: 10 }),
          id_usage: faker.datatype.number({ min: 1, max: 10 }),
          subtotal: faker.datatype.number({ min: 100, max: 500 }),
          status: faker.datatype.number({ min: 0, max: 3 }),
          created_at: new Date(),
          updated_at: new Date()
        };
  
        d_trans.push(newD_trans);
      }

    await queryInterface.bulkInsert('d_trans',d_trans, {});
    }catch(e){
      console.log("Error generating data: ", e);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('d_trans', null, {});
  }
};
