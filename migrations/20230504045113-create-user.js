'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      saldo: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull:false
      },
      tanggal_lahir: {
        type: Sequelize.DATE,
        allowNull:false
      },
      id_card_number: {
        type: Sequelize.STRING,
        allowNull:false
      },
      is_id_card_verified: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};