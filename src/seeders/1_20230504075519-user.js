'use strict';
const { faker } = require('@faker-js/faker');

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const getToken = (username, role) => {

  let token = jwt.sign(
    {
      username: username,
      role: role,
    },
    JWT_KEY
  );
  return token;
};

function checkIDCard(users, idcard) {

  const result = users.find(p => p.id_card_number == idcard);

  if (!result) {
    return true;
  } else {
    return false;
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []; 
    const admin_apikey = getToken('admin',0);

    users.push({
      username: 'admin',
      password: 'admin',
      role: 0,
      email: 'admin@gmail.com',
      phone_number: faker.phone.number(),
      tanggal_lahir: faker.date.between('1980-01-01', '2003-12-31'),
      id_card_number: null,
      is_id_card_verified: 0,
      token: admin_apikey,
      created_at: new Date(),
      updated_at: new Date()
    });

    for (let i = 1; i <= 49; i++) {
      let username = faker.internet.userName();
      let role = faker.datatype.number({ min: 1, max:2 });
      let apikey = getToken(username, role);

      let id_card_number = '32' + faker.datatype.number({ min: 10, max: 99 }) + faker.date.past(60).getFullYear().toString().slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 12 })).slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 28 })).slice(-2) + faker.datatype.number({ min: 1000, max: 9999 });

      do {
        id_card_number = '32' + faker.datatype.number({ min: 10, max: 99 }) + faker.date.past(60).getFullYear().toString().slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 12 })).slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 28 })).slice(-2) + faker.datatype.number({ min: 1000, max: 9999 });

      } while (checkIDCard(users, id_card_number) == false);

      const is_verified = faker.datatype.number({ min: 0, max: 1 });
      if (is_verified == 0) {
        id_card_number = null;
      }

      users.push({
        username: username,
        password: faker.internet.password(),
        role: role,
        // saldo: faker.datatype.number({ min: 100000, max: 10000000 }),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
        tanggal_lahir: faker.date.between('1980-01-01', '2003-12-31'),
        id_card_number: id_card_number,
        is_id_card_verified: is_verified,
        token: apikey,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
