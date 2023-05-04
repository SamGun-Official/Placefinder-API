'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull:false
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'User',
          key: 'id'
        }
      },
      id_accomodation: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Accomodation',
          key: 'id'
        }
      },
      status:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
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
    await queryInterface.dropTable('notifications');
  }
};