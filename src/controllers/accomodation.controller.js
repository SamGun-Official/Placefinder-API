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

let self = {};
self.getAll = async (req, res) => {
	let accomodations = await Accomodation.findAll();
	return accomodations;
};
self.getAccomodationById = async (id) => {
	return await Accomodation.findByPk(id);
};
self.getAccomodationsByName = async (name) => {
	return await Accomodation.findAll({
		where: {
			name: {
				[Op.like]: `%${name}%`,
			},
		},
	});
};
self.getAccomoddationsByAddress = async (address) => {
	return await Accomodation.findAll({
		where: {
			address: {
				[Op.like]: `%${address}%`,
			},
		},
	});
};
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};

module.exports = self;
