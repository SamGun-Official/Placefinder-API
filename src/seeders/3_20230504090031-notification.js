"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const notifications = [];
		for (let i = 1; i <= 20; i++) {
			notifications.push({
				description: "This is a dummy notification!",
				id_user: faker.datatype.number({ min: 1, max: 10 }),
				id_accomodation: faker.datatype.number({ min: 1, max: 10 }),
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});
		}

		await queryInterface.bulkInsert("notifications", notifications, {});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("notifications", null, {});
	},
};
