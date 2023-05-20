const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let self = {};
self.getAll = async (req, res) => {
	let accomodations = await models.Accomodation.findAll();
	return accomodations;
};
self.getAccomodationById = async (id) => {
	return await models.Accomodation.findByPk(id);
};
self.getAccomodationsByName = async (name) => {
	return await models.Accomodation.findAll({
		where: {
			name: {
				[Op.like]: `%${name}%`,
			},
		},
	});
};
self.getAccomoddationsByAddress = async (address) => {
	return await models.Accomodation.findAll({
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
