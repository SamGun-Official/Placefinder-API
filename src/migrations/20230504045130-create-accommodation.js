"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("accommodations", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			address: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			owner: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "users",
					key: "id",
				},
			},
			description: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			coordinate: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			capacity: {
				type: Sequelize.INTEGER,
				allowNull: true,
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
		await queryInterface.dropTable("accommodations");
	},
};
