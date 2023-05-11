'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const priceList = [];
  
      for (let i = 0; i < 20; i++) {
        const newPriceList = {
          feature_name: faker.lorem.words(2),
          url_endpoint: faker.internet.url(),
          price: faker.datatype.number({ min: 10, max: 100 }),
          status: faker.datatype.number({ min: 0, max: 1 }),
          created_at: new Date(),
          updated_at: new Date()
        };
  
        priceList.push(newPriceList);
      }
  
      await queryInterface.bulkInsert('pricelists',priceList, {});
      console.log('Data successfully generated!');
    } catch (error) {
      console.error('Error generating data:', error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pricelists', null, {});
  }
};
