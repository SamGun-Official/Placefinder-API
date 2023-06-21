"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		try {
			const priceList = [];

			for (let i = 0; i < 15; i++) {
				const newPriceList = {
					feature_name: faker.lorem.words(2),
					url_endpoint: faker.internet.url(),
					price: faker.datatype.number({ min: 10, max: 100 }),
					status: 1,
					created_at: new Date(),
					updated_at: new Date(),
				};

				priceList.push(newPriceList);
			}

			priceList.push({
				feature_name: "Change Accommodation Address",
				url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/provider",
				price: 1000,
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});
			priceList.push({
				feature_name: "Get Accommodation By Area Radius",
				url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?origin=ORIGIN&radius=RADIUS",
				price: 1000,
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});
			priceList.push({
				feature_name: "Get Accommodation By Price",
				url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?max_price=MAX_PRICE",
				price: 250,
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});
			priceList.push({
				feature_name: "Get Accommodation By Type",
				url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?type=TYPE",
				price: 250,
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});
			priceList.push({
				feature_name: "Insert Accommodation Nearby",
				url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/developer/add",
				price: 2000,
				status: 1,
				created_at: new Date(),
				updated_at: new Date(),
			});

			await queryInterface.bulkInsert("pricelists", priceList, {});
		} catch (error) {
			console.error("Error generating data:", error);
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("pricelists", null, {});
	},
};
