const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const axios = require("axios");
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

function calculateRadius(centerCoordinate, radiusInMeters, targetCoordinate) {
	// Helper function to convert degrees to radians
	function toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	function isCoordinateWithinRadius(center, radius, target) {
		// Radius of the Earth in meters
		const earthRadius = 6378000;

		// Convert degrees to radians
		const centerLatRad = toRadians(center.latitude);
		const centerLngRad = toRadians(center.longitude);
		const targetLatRad = toRadians(target.latitude);
		const targetLngRad = toRadians(target.longitude);

		// Calculate the differences between the coordinates
		const latDiff = targetLatRad - centerLatRad;
		const lngDiff = targetLngRad - centerLngRad;

		// Calculate the Haversine distance
		const a = Math.sin(latDiff / 2) ** 2 + Math.cos(centerLatRad) * Math.cos(targetLatRad) * Math.sin(lngDiff / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;

		return distance <= radius;
	}

	return isCoordinateWithinRadius(centerCoordinate, radiusInMeters, targetCoordinate);
}

async function insertUsageOnFilter(user_data, url) {
	const pricelist_data = await models.PriceList.findOne({
		where: {
			url_endpoint: url,
		},
	});

	return await models.Usage.create({
		id_pricelist: pricelist_data.id,
		id_user: user_data.id,
		date: new Date(),
		subtotal: pricelist_data.price,
		status: 1,
	});
}

let self = {};
self.getAll = async (req, res) => {
	let accommodations = await models.Accommodation.findAll();
	return accommodations;
};
self.getAccommodationById = async (id) => {
	return await models.Accommodation.findByPk(id);
};
self.getAccommodationsByName = async (name) => {
	return await models.Accommodation.findAll({
		where: {
			name: {
				[Op.like]: `%${name}%`,
			},
		},
	});
};
self.getAccommodationsByAddress = async (address) => {
	return await models.Accommodation.findAll({
		where: {
			address: {
				[Op.like]: `%${address}%`,
			},
		},
	});
};
self.add = async (req, username) => {
	const owner_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});
	const geocoding_data = await fetchAddressCoordinate(req.body.address);
	const pricelist_data = await models.PriceList.findOne({
		where: {
			url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/provider",
		},
	});

	return {
		accommodation_data: await models.Accommodation.create({
			name: req.body.name,
			address: req.body.address,
			price: parseInt(req.body.price),
			owner: parseInt(owner_data.id),
			description: !req.body.description ? null : req.body.description,
			rating: null,
			coordinate: geocoding_data,
			status: 1,
			type: req.body.type,
			capacity: parseInt(req.body.capacity),
		}),
		usage_data: await models.Usage.create({
			id_pricelist: pricelist_data.id,
			id_user: owner_data.id,
			date: new Date(),
			subtotal: pricelist_data.price,
			status: 1,
		}),
	};
};
self.update = async (accommodation_id, req, username) => {
	const accommodation_data = await models.Accommodation.findByPk(accommodation_id);
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
			username: {
				[Op.eq]: username,
			},
		},
	});
	if (parseInt(accommodation_data.owner) !== parseInt(user_data.id) && user_data.username !== "admin") {
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

	let geocoding_data = null;
	let usage_data = null;
	if (accommodation_data.address !== req.body.address) {
		geocoding_data = await fetchAddressCoordinate(req.body.address);
		if (user_data.username !== "admin") {
			const pricelist_data = await models.PriceList.findOne({
				where: {
					url_endpoint: "https://samgun-official.my.id/placefinder/api/accommodations/provider",
				},
			});
			usage_data = await models.Usage.create({
				id_pricelist: pricelist_data.id,
				id_user: user_data.id,
				date: new Date(),
				subtotal: pricelist_data.price,
				status: 1,
			});
		}
	}

	const arguments = {
		name: req.body.name,
		address: req.body.address,
		price: parseInt(req.body.price),
		description: !req.body.description ? null : req.body.description,
		coordinate: geocoding_data,
		status: req.body.status === "Open" ? 1 : 0,
		type: req.body.type,
		capacity: parseInt(req.body.capacity),
	};
	if (!geocoding_data) {
		delete arguments.address;
		delete arguments.coordinate;
	}

	await models.Accommodation.update(arguments, {
		where: {
			id: accommodation_id,
		},
	});

	return usage_data;
};
self.delete = async (accommodation_id, username) => {
	const accommodation_data = await models.Accommodation.findByPk(accommodation_id);
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
			username: {
				[Op.eq]: username,
			},
		},
	});
	if (parseInt(accommodation_data.owner) !== parseInt(user_data.id) && user_data.username !== "admin") {
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

	await models.Accommodation.destroy({
		where: {
			id: accommodation_id,
		},
	});
};
self.getAllOwnAccommodations = async (username) => {
	const owner_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});
	const own_accommodations = await models.Accommodation.findAll({
		where: {
			owner: {
				[Op.eq]: owner_data.id,
			},
		},
	});

	return own_accommodations;
};
self.getOwnAccommodationsByAvailability = async (username, status) => {
	const owner_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});
	const own_accommodations = await models.Accommodation.findAll({
		where: {
			owner: owner_data.id,
			status: status === "Open" ? 1 : 0,
		},
	});

	return own_accommodations;
};
self.getAccommodationsByFilter = async (query, username) => {
	const { origin, radius, max_price, type } = query;
	let accommodation_data = await models.Accommodation.findAll();
	const user_data = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});

	let usage_data = null;
	let usages = [];
	if (origin && radius) {
		const geocoding_data = await fetchAddressCoordinate(origin);
		const center_coordinate = geocoding_data.split(",");

		accommodation_data = accommodation_data.filter((data) => {
			const target_coordinate = data.coordinate.split(",");
			const coveraged_address = calculateRadius(
				{
					latitude: parseFloat(center_coordinate[0]),
					longitude: parseFloat(center_coordinate[1]),
				},
				radius,
				{
					latitude: parseFloat(target_coordinate[0]),
					longitude: parseFloat(target_coordinate[1]),
				}
			);
			if (coveraged_address) {
				return true;
			}

			return false;
		});
		if (accommodation_data.length > 0) {
			usage_data = await insertUsageOnFilter(user_data, "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?origin=ORIGIN&radius=RADIUS");
			usages.push(usage_data);
		}
	}
	if (max_price) {
		accommodation_data = accommodation_data.filter((data) => parseInt(data.price) <= max_price);
		if (accommodation_data.length > 0) {
			usage_data = await insertUsageOnFilter(user_data, "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?max_price=MAX_PRICE");
			usages.push(usage_data);
		}
	}
	if (type) {
		accommodation_data = accommodation_data.filter((data) => data.type.toUpperCase() === type.toUpperCase());
		if (accommodation_data.length > 0) {
			usage_data = await insertUsageOnFilter(user_data, "https://samgun-official.my.id/placefinder/api/accommodations/developer/all?type=TYPE");
			usages.push(usage_data);
		}
	}

	return {
		accommodation_data: accommodation_data,
		usage_data: usages,
	};
};

module.exports = self;
