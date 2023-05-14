'use strict';
const { faker } = require('@faker-js/faker');
const db = require('../config/sequelize');
const models = require('../models/models');
const H_trans = require('../models/h_trans');
const { Op } = require("sequelize");

//functions
function formattedStringDate(ts) {

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  if (month.toString().length == 1) {
    if (date.toString().length == 1) {
      return (year + "-0" + month + "-0" + date);
    } else {
      return (year + "-0" + month + "-" + date);
    }
  } else {
    if (date.toString().length == 1) {
      return (year + "-" + month + "-0" + date);
    } else {
      return (year + "-" + month + "-" + date);
    }
  }

}


function generateInvoiceNumber(h_trans, date) {
  let invoiceNumber = "";
  let clearDate = formattedStringDate(date);
  const clear_date = clearDate.replace(/-/g, '');
  let jumlah = 0;
  for (let i = 0; i < h_trans.length; i++) {
    if (h_trans[i].number.includes(clear_date)) {
      jumlah = jumlah + 1;
    }
  }

  invoiceNumber = clear_date + ((jumlah + 1) + "").padStart(3, "0");

  return invoiceNumber;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const h_trans = [];
    for (let i = 1; i <= 20; i++) {
      let new_date = faker.date.between('2022-01-01', '2022-12-31');
      const uniqueInvoiceNumber = generateInvoiceNumber(h_trans, new_date);

      // let[result, metadata] = await db.sequelize.query("SELECT * FROM USAGES");
      // const usages= result;
      const usages = await models.Usage.findAll();
      const usage = usages[Math.floor(Math.random() * usages.length)];

      h_trans.push({
        number: uniqueInvoiceNumber,
        id_user: usage.id_user,
        date: new_date,
        total: Math.floor(Math.random() * 500000) + 100000,
        payment_status: faker.datatype.number({ min: 0, max: 3 }),
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('h_trans', h_trans, {});
  }
  ,
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('h_trans', null, {});
  }
};
