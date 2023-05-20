"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface
			.createTable("usages", {
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
				},
				id_pricelist: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "pricelists",
						key: "id",
					},
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
				subtotal: {
					type: Sequelize.INTEGER,
					allowNull: false,
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
			})
			.then(() =>
				queryInterface.addConstraint("d_trans", {
					type: "FOREIGN KEY",
					name: "FK_usageid_dtrans",
					fields: ["id_usage"],
					references: {
						table: "usages",
						field: "id",
					},
					onDelete: "NO ACTION",
					onUpdate: "NO ACTION",
				})
			);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint("d_trans", "FK_usageid_dtrans");
		await queryInterface.dropTable("usages");
	},
};
