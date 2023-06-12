"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("notifications", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			description: {
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
			id_accommodation: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "accommodations",
					key: "id",
				},
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
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
		await queryInterface.dropTable("notifications");
	},
};
