const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};

module.exports = self;
