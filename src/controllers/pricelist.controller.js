const database = require("../config/sequelize");
const express = require("express");
const { Op } = require("sequelize");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require("../models/user")(database);
const Accomodation = require("../models/accomodation")(database);
const Notification = require("../models/notification")(database);
const H_trans = require("../models/h_trans")(database);
const D_trans = require("../models/d_trans")(database);
const PriceList = require("../models/pricelist")(database);

let self = {};
self.addPricelist = async (feature_name, url_endpoint, price) => {
	return await PriceList.create({
		feature_name: feature_name,
		url_endpoint: url_endpoint,
		price: price,
		status: 1,
	});
};
self.updatePricelist = async (id, feature_name, url_endpoint, price) => {
	let pricelist = await PriceList.findByPk(id);
	pricelist.feature_name = feature_name || pricelist.feature_name;
	pricelist.url_endpoint = url_endpoint || pricelist.url_endpoint;
	pricelist.price = price || pricelist.price;
	await pricelist.save();
	return pricelist;
};

module.exports = self;
