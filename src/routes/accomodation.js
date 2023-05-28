const self = require("../controllers/accomodation.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

async function checkAccomodationExistById(id) {
	if (await models.Accomodation.findByPk(id)) {
		return true;
	}
	throw Error("ID Accomodation tidak ditemukan!");
}

const router = express.Router();
router.get("/", async function (req, res) {
	let accomodations = await self.getAll();
	return res.status(200).send(accomodations);
});
router.get("/search", auth.authenticate(["admin"]), async function (req, res) {
	let { id, name, address } = req.query;
	if (id) {
		const schema = Joi.object({
			id: Joi.number().external(checkAccomodationExistById),
		});
		try {
			await schema.validateAsync({ id });
			return res.status(200).send(await self.getAccomodationById(id));
		} catch (e) {
			return res.status(404).send({ message: e.message });
		}
	} else if (name) {
		return res.status(200).send(await self.getAccomodationsByName(name));
	} else if (address) {
		return res.status(200).send(await self.getAccomoddationsByAddress(address));
	}
	return res.status(400).send({ message: "Harap isi field id or name or address!" });
});

module.exports = router;
