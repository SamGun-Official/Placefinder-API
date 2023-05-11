'use strict';
const { faker } = require('@faker-js/faker');

function generateInvoiceNumber(h_trans) {
  let invoiceNumber;
  let isUnique = false;

  while (!isUnique) {
    invoiceNumber = faker.datatype.uuid().toUpperCase();

    // Check if the generated invoice number already exists in h_trans
    const existingInvoice = h_trans.find((trans) => trans.number === invoiceNumber);
    
    // If the invoice number doesn't exist, it is unique
    if (!existingInvoice) {
      isUnique = true;
    }
  }

  return invoiceNumber;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const h_trans = [];
    for (let i = 1; i <= 20; i++) {
      let new_date = faker.date.between('2022-01-01', '2022-12-31');
      const uniqueInvoiceNumber = generateInvoiceNumber(h_trans);
     
      h_trans.push({
        number: uniqueInvoiceNumber,
        id_user: Math.floor(Math.random() * 10) + 1,
        date: new_date,
        total: Math.floor(Math.random() * 500000) + 100000,
        payment_status: faker.datatype.number({ min: 0, max: 3}),
        status:1,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await queryInterface.bulkInsert('h_trans',h_trans, {});
  }
}
,
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('h_trans', null, {});
  }
};
