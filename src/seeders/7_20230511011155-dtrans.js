"use strict";

const { faker } = require("@faker-js/faker");
const models = require("../models/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		try {
			const d_trans = [];

			for (let i = 0; i < 20; i++) {
				// let[result, metadata] = await database.sequelize.query("SELECT * FROM H_TRANS");
				// const h_trans = result;
				const h_trans = await models.H_trans.findAll();
				const selected_h_trans = h_trans[Math.floor(Math.random() * h_trans.length)];

				// [result, metadata] = await database.sequelize.query("SELECT * FROM usages WHERE id_user = ?", {
				//   replacements:[selected_h_trans.id_user]
				// });
				// const usage = result[0];
				const usage = await models.Usage.findOne({
					where: {
						id_user: selected_h_trans.id_user,
					},
				});

				const newD_trans = {
					id_htrans: selected_h_trans.id,
					id_usage: usage.id,
					subtotal: usage.subtotal,
					status: faker.datatype.number({ min: 0, max: 3 }),
					created_at: new Date(),
					updated_at: new Date(),
				};

				d_trans.push(newD_trans);
			}

			await queryInterface.bulkInsert("d_trans", d_trans, {});
		} catch (e) {
			console.log("Error generating data: ", e);
		}
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("d_trans", null, {});
	},
};
