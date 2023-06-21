const self = require("../controllers/nearbylist.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

function accommodationValidationSchema() {
	const messages = {
		id_accommodation: {
			"any.required": "Accommodation ID is required!",
			"number.base": "Accommodation ID must be a number!",
			"number.min": "Accommodation ID must be greater than or equal to 1!",
		},
		center_address: {
			"any.required": "Center address is required!",
		},
	};
	const schema = Joi.object({
		id_accommodation: Joi.number().min(1).required().messages(messages.id_accommodation),
		center_address: Joi.string().required().messages(messages.center_address),
	});

	return schema;
}

const router = express.Router();
router.get("/", auth.authenticate(["developer"]), async function (req, res) {
	const nearbylist_data = await self.getAllById(auth.payload.username);

	return res.status(200).send({
		data: nearbylist_data,
	});
});
router.post("/add", auth.authenticate(["developer"]), async function (req, res) {
	try {
		const schema = accommodationValidationSchema();
		const { id_accommodation, center_address } = await schema.validateAsync({
			id_accommodation: req.body.id_accommodation,
			center_address: req.body.center_address,
		});

		const new_nearbylists = await self.add(
			{
				id_accommodation: id_accommodation,
				center_address: center_address,
			},
			auth.payload.username
		);

		return res.status(201).send({
			message: "Successfully add new nearbylist data!",
			data: new_nearbylists,
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.put("/update/:id", auth.authenticate(["developer"]), async function (req, res) {
	try {
		const nearbylist_id = req.params.id;
		const schema = accommodationValidationSchema();
		const { id_accommodation, center_address } = await schema.validateAsync({
			id_accommodation: req.body.id_accommodation,
			center_address: req.body.center_address,
		});

		const new_usage = await self.update(
			nearbylist_id,
			{
				id_accommodation: id_accommodation,
				center_address: center_address,
			},
			auth.payload.username
		);

		return res.status(200).send({
			message: `Successfully update nearbylist data with ID ${nearbylist_id}!`,
			data: {
				nearbylist_data: await models.NearbyList.findOne({
					attributes: {
						exclude: ["created_at", "updated_at", "deleted_at"],
					},
					where: {
						id: nearbylist_id,
					},
				}),
				usage_data: new_usage,
			},
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});
router.delete("/delete/:id", auth.authenticate(["developer"]), async function (req, res) {
	try {
		await self.delete(req.params.id, auth.payload.username);

		return res.status(200).send({
			message: `Successfully delete nearbylist data with ID ${req.params.id}!`,
		});
	} catch (error) {
		return res.status(error.request ? error.request.res.statusCode : 400).send({ message: error.original ? error.original : error.message });
	}
});

module.exports = router;
