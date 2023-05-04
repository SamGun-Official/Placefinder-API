'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_accomodation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'accomodations',
          key: 'id'
        }
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'users',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      check_in_date: {
        type: Sequelize.DATE,
        allowNull:true
      },
      check_out_date: {
        type: Sequelize.DATE,
        allowNull:true
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      subtotal: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      is_check_out: {
        type: Sequelize.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('transactions');
  }
};