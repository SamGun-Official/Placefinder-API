const self = require("../controllers/pricelist.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

async function checkUrlEndpointExistInPricelist(url_endpoint) {
	let pricelist = await models.PriceList.findOne({
		where: {
			url_endpoint: url_endpoint,
		},
	});
	if (pricelist) {
		throw Error("url_endpoint sudah ada!");
	}
	return true;
}

async function checkIdExistInPricelist(id) {
	let pricelist = await models.PriceList.findByPk(id);
	if (pricelist) {
		return true;
	}
	throw Error("id pricelist tidak ditemukan!");
}

async function checkUrlEndpointAndIdInPricelist({ url_endpoint, id }) {
	let pricelists = await models.PriceList.findAll({
		where: {
			[Op.and]: {
				url_endpoint: url_endpoint,
				id: {
					[Op.ne]: id,
				},
			},
		},
	});
	if (pricelists.length == 0) {
		return true;
	}
	throw Error("pricelist can't have the same url_endpoint");
}

const router = express.Router();
router.post("/add", auth.authenticate("admin"), async function (req, res) {
	let { feature_name, url_endpoint, price } = req.body;
	const validator = Joi.object({
		feature_name: Joi.string().required(),
		url_endpoint: Joi.string().required().external(checkUrlEndpointExistInPricelist),
		price: Joi.number().min(1).required(),
	});
	try {
		await validator.validateAsync(req.body);
	} catch (e) {
		return res.status(400).send({
			message: e.message.toString().replace(/['"]/g, ""),
		});
	}
	return res.status(201).send(await self.addPricelist(feature_name, url_endpoint, price));
});
router.put("/update/:id", auth.authenticate("admin"), async function (req, res) {
	let { id } = req.params;
	let { feature_name, url_endpoint, price } = req.body;
	if(!feature_name && !url_endpoint && !price){
		return res.status(400).send({
			message: 'Harap isi field minimal satu dari feature_name, url_endpoint, dan price'
		});
	}
	feature_name = feature_name == undefined ? null : feature_name;
	url_endpoint = url_endpoint == undefined ? null : url_endpoint;
	price = price == undefined ? null : price;
	let url_endpoint_and_id = { url_endpoint, id };
	const validator = Joi.object({
		id: Joi.number().external(checkIdExistInPricelist),
		feature_name: Joi.string().allow("", null),
		url_endpoint: Joi.string().allow("", null),
		price: Joi.number().min(1).allow("", null),
		url_endpoint_and_id: Joi.any().external(checkUrlEndpointAndIdInPricelist),
	});

	try {
		await validator.validateAsync({ id, feature_name, url_endpoint, price, url_endpoint_and_id });
	} catch (e) {
		return res.status(400).send({
			message: e.message.toString().replace(/['"]/g, ""),
		});
	}
	return res.status(200).send({ message: "Berhasil update pricelist", pricelist: await self.updatePricelist(id, feature_name, url_endpoint, price) });
});

module.exports = router;
