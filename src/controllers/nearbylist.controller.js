const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const { default: axios } = require("axios");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function fetchAddressCoordinate(address) {
	return await axios
		.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${address}`)
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
}

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
		attributes: {
			exclude: ["created_at", "updated_at", "deleted_at"],
		},
		where: {
			id_user: user_data.id,
		},
	});

	const pricelist_data = await models.PriceList.findOne({
		where: {
			url_endpoint: "https://samgun-official.my.id/placefinder/api/nearbylists",
		},
	});
	const new_usage = await models.Usage.create({
		id_pricelist: pricelist_data.id,
		id_user: user_data.id,
		date: new Date(),
		subtotal: pricelist_data.price,
		status: 1,
	});

	return {
		nearbylist_data: nearbylists,
		usage_data: await models.Usage.findOne({
			attributes: {
				exclude: ["created_at", "updated_at", "deleted_at"],
			},
			where: {
				id: new_usage.id,
			},
		}),
	};
};
self.add = async (body, username) => {
	const user_data = await models.User.findOne({
		where: {
			username: username,
		},
	});
	const geocoding_data = await fetchAddressCoordinate(body.center_address);
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

	const new_nearbylist = await models.NearbyList.create({
		id_user: user_data.id,
		id_accommodation: body.id_accommodation,
		center_coordinate: geocoding_data,
	});
	const new_usage = await models.Usage.create({
		id_pricelist: pricelist_data.id,
		id_user: user_data.id,
		date: new Date(),
		subtotal: pricelist_data.price,
		status: 1,
	});

	return {
		nearbylist_data: await models.NearbyList.findOne({
			attributes: {
				exclude: ["created_at", "updated_at", "deleted_at"],
			},
			where: {
				id: new_nearbylist.id,
			},
		}),
		usage_data: await models.Usage.findOne({
			attributes: {
				exclude: ["created_at", "updated_at", "deleted_at"],
			},
			where: {
				id: new_usage.id,
			},
		}),
	};
};
self.update = async (nearbylist_id, body, username) => {
	const nearbylist_data = await models.NearbyList.findByPk(nearbylist_id);
	if (!nearbylist_data) {
		throw {
			request: {
				res: {
					statusCode: 404 ?? 500,
				},
			},
			original: "Nearbylist is not found!" ?? "Unexpected error!",
			message: "Nearbylist is not found!" ?? "Unexpected error!",
		};
	}

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

	const user_data = await models.User.findOne({
		where: {
			username: username,
		},
	});
	if (parseInt(nearbylist_data.id_user) !== parseInt(user_data.id)) {
		throw {
			request: {
				res: {
					statusCode: 401 ?? 500,
				},
			},
			original: "Cannot change data that isn't your data!" ?? "Unexpected error!",
			message: "Cannot change data that isn't your data!" ?? "Unexpected error!",
		};
	}

	const geocoding_data = await fetchAddressCoordinate(body.center_address);
	const pricelist_data = await models.PriceList.findOne({
		where: {
			url_endpoint: "https://samgun-official.my.id/placefinder/api/nearbylists/address",
		},
	});
	const new_usage = await models.Usage.create({
		id_pricelist: pricelist_data.id,
		id_user: user_data.id,
		date: new Date(),
		subtotal: pricelist_data.price,
		status: 1,
	});
	const usage_data = await models.Usage.findOne({
		attributes: {
			exclude: ["created_at", "updated_at", "deleted_at"],
		},
		where: {
			id: new_usage.id,
		},
	});

	await models.NearbyList.update(
		{
			id_accommodation: body.id_accommodation,
			center_coordinate: geocoding_data,
		},
		{
			where: {
				id: nearbylist_id,
			},
		}
	);

	return usage_data;
};
self.delete = async (nearbylist_id, username) => {
	const nearbylist_data = await models.NearbyList.findByPk(nearbylist_id);
	if (!nearbylist_data) {
		throw {
			request: {
				res: {
					statusCode: 404 ?? 500,
				},
			},
			original: "Nearbylist is not found!" ?? "Unexpected error!",
			message: "Nearbylist is not found!" ?? "Unexpected error!",
		};
	}

	const user_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});
	if (parseInt(nearbylist_data.id_user) !== parseInt(user_data.id)) {
		throw {
			request: {
				res: {
					statusCode: 401 ?? 500,
				},
			},
			original: "Cannot change data that isn't your data!" ?? "Unexpected error!",
			message: "Cannot change data that isn't your data!" ?? "Unexpected error!",
		};
	}

	await models.NearbyList.destroy({
		where: {
			id: nearbylist_id,
		},
	});
};

module.exports = self;
