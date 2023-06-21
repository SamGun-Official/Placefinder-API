const self = require("../controllers/accommodation.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

async function checkAccommodationExistById(id) {
	if (await models.Accommodation.findByPk(id)) {
		return true;
	}
	throw Error("ID Accommodation tidak ditemukan!");
}

function accommodationValidationSchema() {
	const messages = {
		name: {
			"any.required": "Name is required!",
		},
		address: {
			"any.required": "Address is required!",
		},
		price: {
			"any.required": "Price is required!",
			"number.min": "Minimum value of price is Rp.100.000!",
		},
		status: {
			"any.only": "Valid values are 'Open', 'Closed'!",
		},
		type: {
			"any.required": "Type is required!",
			"any.only": "Valid values are 'House', 'Apartment', 'Condominium', 'Townhouse', 'Villa', 'Loft', 'Duplex', and 'Cottage'!",
		},
		capacity: {
			"any.required": "Capacity is required!",
			"number.min": "Minimum value of capacity is 1!",
		},
	};
	const schema = Joi.object({
		name: Joi.string().required().messages(messages.name),
		address: Joi.string().required().messages(messages.address),
		price: Joi.number().min(50000).required().messages(messages.price),
		description: Joi.string(),
		status: Joi.string().valid("Open", "Closed"),
		type: Joi.string().valid("House", "Apartment", "Condominium", "Townhouse", "Villa", "Loft", "Duplex", "Cottage").required().messages(messages.type),
		capacity: Joi.number().min(1).required().messages(messages.capacity),
	});

	return schema;
}

const router = express.Router();
router.get("/", async function (req, res) {
	let accommodations = await self.getAll();
	return res.status(200).send(accommodations);
});
router.get("/search", auth.authenticate(["admin"]), async function (req, res) {
	let { id, name, address } = req.query;
	if (id) {
		const schema = Joi.object({
			id: Joi.number().external(checkAccommodationExistById),
		});
		try {
			await schema.validateAsync({ id });
			return res.status(200).send(await self.getAccommodationById(id));
		} catch (e) {
			return res.status(404).send({ message: e.message });
		}
	} else if (name) {
		return res.status(200).send(await self.getAccommodationsByName(name));
	} else if (address) {
		return res.status(200).send(await self.getAccommodationsByAddress(address));
	}
	return res.status(200).send(await self.getAll());
});
router.post("/add", auth.authenticate(["provider"]), async function (req, res) {
	try {
		const schema = accommodationValidationSchema();
		const { name, address, price, description, type, capacity } = await schema.validateAsync({
			name: req.body.name,
			address: req.body.address,
			price: req.body.price,
			description: req.body.description,
			type: req.body.type,
			capacity: req.body.capacity,
		});
		const new_accommodation = await self.add(
			{
				body: {
					name: name,
					address: address,
					price: price,
					description: description,
					type: type,
					capacity: capacity,
				},
			},
			auth.payload.username
		);

		return res.status(201).send({
			message: "Successfully add new accommodation data!",
			data: new_accommodation,
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.put("/update/:id", auth.authenticate(["admin", "provider"]), async function (req, res) {
	try {
		const accommodation_id = req.params.id;
		const schema = accommodationValidationSchema();
		const { name, address, price, description, status, type, capacity } = await schema.validateAsync({
			name: req.body.name,
			address: req.body.address,
			price: req.body.price,
			description: req.body.description,
			status: req.body.status,
			type: req.body.type,
			capacity: req.body.capacity,
		});

		const new_usage = await self.update(
			accommodation_id,
			{
				body: {
					name: name,
					address: address,
					price: price,
					description: description,
					status: status,
					type: type,
					capacity: capacity,
				},
			},
			auth.payload.username
		);

		return res.status(200).send({
			message: `Successfully update accommodation data with ID ${accommodation_id}!`,
			data: {
				accommodation_data: await models.Accommodation.findByPk(accommodation_id),
				usage_data: new_usage,
			},
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.delete("/delete/:id", auth.authenticate(["admin", "provider"]), async function (req, res) {
	try {
		await self.delete(req.params.id, auth.payload.username);

		return res.status(200).send({
			message: `Successfully delete accommodation data with ID ${req.params.id}!`,
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.get("/provider/detail/all", auth.authenticate(["provider"]), async function (req, res) {
	try {
		return res.status(200).send(await self.getAllOwnAccommodations(auth.payload.username));
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.get("/provider/detail", auth.authenticate(["provider"]), async function (req, res) {
	const messages = {
		status: {
			"any.required": "Status is required!",
			"any.only": "Valid values are 'Open', 'Closed'!",
		},
	};
	const schema = Joi.object({
		status: Joi.string().valid("Open", "Closed").required().messages(messages.status),
	});

	try {
		const { status } = await schema.validateAsync({
			status: req.query.status,
		});

		return res.status(200).send(await self.getOwnAccommodationsByAvailability(auth.payload.username, status));
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.get("/developer/all", auth.authenticate(["developer"]), async function (req, res) {
	const messages = {
		origin: {
			"any.required": "Address is required!",
		},
		radius: {
			"number.base": "Radius must be a number!",
			"number.min": "Radius must be greater than or equal to 0.1!",
			"number.max": "Radius must be less than or equal to 10!",
		},
		max_price: {
			"number.min": "Minimum value of max price is Rp.100.000!",
		},
		type: {
			"any.only": "Valid values are 'House', 'Apartment', 'Condominium', 'Townhouse', 'Villa', 'Loft', 'Duplex', and 'Cottage'!",
		},
	};
	const schema = Joi.object({
		origin: Joi.string().required().messages(messages.origin),
		radius: Joi.number().min(1).max(10000).messages(messages.radius),
		max_price: Joi.number().min(50000).messages(messages.radius),
		type: Joi.string().valid("House", "Apartment", "Condominium", "Townhouse", "Villa", "Loft", "Duplex", "Cottage").messages(messages.type),
	});

	try {
		const { origin, radius, max_price, type } = await schema.validateAsync({
			origin: req.query.origin,
			radius: req.query.radius,
			max_price: req.query.max_price,
			type: req.query.type,
		});

		const results = await self.getAccommodationsByFilter(
			{
				origin: origin,
				radius: radius,
				max_price: max_price,
				type: type,
			},
			auth.payload.username
		);

		return res.status(200).send({
			data: results,
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.get("/admin/all", auth.authenticate(["developer"]), async function (req, res) {});

module.exports = router;
