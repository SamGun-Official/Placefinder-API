/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accomodations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      location: {
        type: Sequelize.STRING,
        allowNull:false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      owner: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: 'users',
          key: 'id'
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull:true
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull:true
      },
      coordinate: {
        type: Sequelize.STRING,
        allowNull:true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      type: {
        type: Sequelize.STRING,
        allowNull:true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull:true
      },
      area: {
        type: Sequelize.INTEGER,
        allowNull:true
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
    await queryInterface.dropTable('accomodations');
  }
};