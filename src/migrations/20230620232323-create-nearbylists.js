"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("nearbylists", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			id_user: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			id_accommodation: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			center_coordinate: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			},
			updated_at: {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			},
			deleted_at: {
				type: Sequelize.DATE,
				defaultValue: null,
				allowNull: true,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("nearbylists");
	},
};
