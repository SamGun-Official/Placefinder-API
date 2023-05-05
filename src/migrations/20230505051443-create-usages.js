'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_pricelist: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: 'pricelists',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE,
        allowNull:false
      },
      subtotal: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status:{
        type: Sequelize.INTEGER,
        allowNull: false,
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
    }).then(() => queryInterface.addConstraint('d_trans', {
      type: 'FOREIGN KEY',
      name: 'FK_usageid_dtrans', 
      fields: ['id_usage'],
      references: {
        table: 'usages',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }));
  },
  async down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('d_trans', 'FK_usageid_dtrans');
    await queryInterface.dropTable('usages');
    
  }
};