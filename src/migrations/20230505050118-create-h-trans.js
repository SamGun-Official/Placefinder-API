"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("h_trans", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			id_user: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			total: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			payment_status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			status: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("h_trans");
	},
};
