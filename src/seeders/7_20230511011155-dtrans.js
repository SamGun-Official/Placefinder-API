'use strict';
const db = require('../config/sequelize');

const { faker } = require('@faker-js/faker');
const H_trans = require('../models/h_trans');
const Usage = require('../models/usage');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    try {
    const d_trans = [];
    const h_transCount = await H_trans.count();
    const usageCount = await Usage.count();
    const h_transIds = await H_trans.findAll({ attributes: ['id'] });
   
  
      for (let i = 0; i < 20; i++) {
       
        const randomHtransId = h_transIds[faker.datatype.number(h_transCount - 1)].id;
        const h_trans =  await H_trans.findOne({where:{
          id: randomHtransId
        }});
        const id_user = h_trans.id_user;
        const usageIds = await Usage.findAll({where:{id_user:id_user}},{ attributes: ['id'] });

        const randomUsageId = usageIds[Math.floor(Math.random() * (usageCount-1))].id;
        const usage = usageIds[randomIndex];

        const newD_trans = {
          id_htrans: randomHtransId,
          id_usage:usage.id,
          subtotal: usage.subtotal,
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
