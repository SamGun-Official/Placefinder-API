'use strict';
const db = require('../config/sequelize');

const { faker } = require('@faker-js/faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    try {
    const d_trans = [];
  
      for (let i = 0; i < 20; i++) {
        
        let usages = [];
        let id_htrans = faker.datatype.number({ min: 1, max: 10 });

        let[result, metadata] = await db.sequelize.query("SELECT * FROM H_TRANS WHERE id = ?",{
          replacements: [id_htrans]
        });

        let h_trans = result[0];

        [result, metadata] = await db.sequelize.query("SELECT * FROM USAGES WHERE id_user = ?", {
          replacements: [h_trans.id_user]
        });

        usages = result;

        do{
         
          id_htrans = faker.datatype.number({ min: 1, max: 10 });

          [result, metadata] = await db.sequelize.query("SELECT * FROM H_TRANS WHERE id = ?",{
            replacements: [id_htrans]
          });
  
          h_trans = result[0];
  
          [result, metadata] = await db.sequelize.query("SELECT * FROM USAGES WHERE id_user = ?", {
            replacements: [h_trans.id_user]
          });

          usages = result;

          if(usages.length>0){
            break;
          }
        }while(usages.length==0);

        var randomIndex = Math.floor(Math.random() * usages.length);

        const usage = usages[randomIndex];

        const newD_trans = {
          id_htrans: id_htrans,
          id_usage: usage.id,
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
