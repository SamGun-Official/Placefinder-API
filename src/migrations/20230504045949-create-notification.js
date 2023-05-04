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
          model:'users',
          key: 'id'
        }
      },
      id_accomodation: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'accomodations',
          key: 'id'
        }
      },
      status:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};