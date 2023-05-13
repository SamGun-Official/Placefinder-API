'use strict';
const { faker } = require('@faker-js/faker');
const User = require('../models/user');
const PriceList = require('../models/pricelist');
const db = require('../config/sequelize');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const usage = [];

    for (let i = 0; i < 20; i++) {
      let idx = faker.datatype.number({min:1,max:50});
      let user = null;
      do{
      idx = faker.datatype.number({min:1,max:50});
      user = await User.findOne({
        where: {
          id: idx,
          role: 1
        }
      });
    }while(user==null);
    
    const id_pricelist = faker.datatype.number({ min: 1, max: 20 });

    let[result, metadata] = await db.sequelize.query("SELECT * FROM PRICELISTS WHERE id = ?",{
      replacements: [id_pricelist]
    });

    const subtotal = result[0].price;
    
      const newUsage = {
        id_pricelist: id_pricelist,
        id_user: user.id,
        date: faker.date.between('2022-01-01', '2022-12-31'),
        subtotal: subtotal,
        status: faker.datatype.number({ min: 0, max: 1}),
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
