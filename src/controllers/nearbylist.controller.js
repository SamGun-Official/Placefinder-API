const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const { default: axios } = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let self = {};
self.getAllById = async (username) => {
	const user_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});
	const nearbylists = await models.NearbyList.findAll({
		where: {
			id_user: user_data.id,
		},
	});

	return nearbylists;
};
self.add = async (body, username) => {
	const user_data = await models.User.findOne({
		where: {
			username: username,
		},
	});
	const geocoding_data = await axios
		.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${body.center_address}`)
		.then(async (response) => {
			if (response.data.results[0].locations[0].source === "FALLBACK") {
				throw {
					request: {
						res: {
							statusCode: 404,
						},
					},
					original: "Address is not found!",
					message: "Address is not found!",
				};
			}
			return `${response.data.results[0].locations[0].latLng.lat},${response.data.results[0].locations[0].latLng.lng}`;
		})
		.catch((error) => {
			throw {
				request: {
					res: {
						statusCode: error.request.res.statusCode ?? 500,
					},
				},
				original: error.message ?? "Unexpected error!",
				message: error.message ?? "Unexpected error!",
			};
		});
	const pricelist_data = await models.PriceList.findOne({
		where: {
			url_endpoint: "https://samgun-official.my.id/placefinder/api/nearbylists/address",
		},
	});
	const accommodation_data = await models.Accommodation.findByPk(body.id_accommodation);
	if (!accommodation_data) {
		throw {
			request: {
				res: {
					statusCode: 404 ?? 500,
				},
			},
			original: "Accommodation is not found!" ?? "Unexpected error!",
			message: "Accommodation is not found!" ?? "Unexpected error!",
		};
	}

	return {
		accommodation_data: await models.NearbyList.create({
			id_user: user_data.id,
			id_accommodation: body.id_accommodation,
			center_coordinate: geocoding_data,
		}),
		usage_data: await models.Usage.create({
			id_pricelist: pricelist_data.id,
			id_user: user_data.id,
			date: new Date(),
			subtotal: pricelist_data.price,
			status: 1,
		}),
	};
};

module.exports = self;
