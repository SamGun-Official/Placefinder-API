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
	return res.status(200).send(accommodations);
});

module.exports = router;
