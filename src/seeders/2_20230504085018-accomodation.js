"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const accommodations = [];
		const types = ["House", "Apartment", "Condominium", "Townhouse", "Villa", "Loft", "Duplex", "Cottage"];

		// Loop sebanyak 10 kali untuk membuat 10 data akomodasi
		for (let i = 0; i < 10; i++) {
			accommodations.push({
				name: faker.company.name(),
				address: faker.address.city(),
				price: faker.datatype.number({ min: 50000, max: 200000 }),
				owner: faker.datatype.number({ min: 1, max: 10 }), // Mengambil referensi dari tabel users dengan id antara 1 sampai 10
				description: faker.lorem.paragraph(),
				rating: faker.datatype.number({ min: 1, max: 5 }),
				coordinate: faker.address.latitude() + "," + faker.address.longitude(),
				status: 1,
				type: types[faker.datatype.number({ min: 0, max: 7 })],
				capacity: faker.datatype.number({ min: 1, max: 5 }),
				area: faker.datatype.number({ min: 20, max: 100 }),
				created_at: new Date(),
				updated_at: new Date(),
			});
		}

		await queryInterface.bulkInsert("accomodations", accommodations, {});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("accomodations", null, {});
	},
};
