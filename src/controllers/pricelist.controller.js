const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let self = {};
self.addPricelist = async (feature_name, url_endpoint, price) => {
	return await models.PriceList.create({
		feature_name: feature_name,
		url_endpoint: url_endpoint,
		price: price,
		status: 1,
	});
};
self.updatePricelist = async (id, feature_name, url_endpoint, price) => {
	let pricelist = await models.PriceList.findByPk(id);
	pricelist.feature_name = feature_name || pricelist.feature_name;
	pricelist.url_endpoint = url_endpoint || pricelist.url_endpoint;
	pricelist.price = price || pricelist.price;
	await pricelist.save();
	return pricelist;
};

module.exports = self;
