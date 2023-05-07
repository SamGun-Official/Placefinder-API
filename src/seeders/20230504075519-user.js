'use strict';
const { faker } = require('@faker-js/faker');

const generateRandomToken = () => {
  const tokenLength = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

function checkKey(users, token){
    
  const result = users.find(p=>p.token==token);

  if(!result){
      return true;
  }else{
      return false;
  }
}

function checkIDCard(users, idcard){
    
  const result = users.find(p=>p.id_card_number==idcard);

  if(!result){
      return true;
  }else{
      return false;
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    for (let i = 1; i <= 50; i++) {
      //generate random string
      let apikey = generateRandomToken();
      do{
          apikey = generateRandomToken();
      }while(checkKey(users,apikey)==false);

      let id_card_number = '32' + faker.datatype.number({ min: 10, max: 99 }) + faker.date.past(60).getFullYear().toString().slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 12 })).slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 28 })).slice(-2) + faker.datatype.number({ min: 1000, max: 9999 });

      do{
        id_card_number = '32' + faker.datatype.number({ min: 10, max: 99 }) + faker.date.past(60).getFullYear().toString().slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 12 })).slice(-2) + ('0' + faker.datatype.number({ min: 1, max: 28 })).slice(-2) + faker.datatype.number({ min: 1000, max: 9999 });
        
      }while(checkIDCard(users,id_card_number)==false);

      const is_verified = faker.datatype.number({ min: 0, max: 1 });
      if(is_verified==0){
        id_card_number = null;
      }

      users.push({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: faker.datatype.number({ min: 1, max: 3 }),
        saldo: faker.datatype.number({ min: 100000, max: 10000000 }),
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

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
