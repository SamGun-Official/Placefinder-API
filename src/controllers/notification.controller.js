const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let self = {};
self.post = async (description, id_user, id_accommodation) => {
	try {
		await models.Notification.create({
			description: description,
			id_user: id_user,
			id_accommodation: id_accommodation,
		});
		return "success";
	} catch (e) {
		return e.toString();
	}
};
self.getAll = async (req, res) => {
	let notifications = await models.Notification.findAll({
		attributes: ["id", "description", "id_user", "id_accommodation", "status"],
		include: [
			{
				model: models.Accommodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: models.User,
				attributes: ["username"],
			},
		],
	});
	return notifications;
};
self.get = async (id) => {
	let notif = await models.Notification.findByPk(id, {
		attributes: ["id", "description", "id_user", "id_accommodation", "status"],
		include: [
			{
				model: models.Accommodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: models.User,
				attributes: ["username"],
			},
		],
	});
	return notif;
};
self.getByUser = async (id_user) => {
	let notif = await models.Notification.findAll({
		attributes: ["id", "description", "id_user", "id_accommodation", "status"],
		include: [
			{
				model: models.Accommodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: models.User,
				attributes: ["username"],
			},
		],
	});

	let filteredNotif = [];
	for (let i = 0; i < notif.length; i++) {
		if (notif[i].id_user == id_user) {
			filteredNotif.push(notif[i]);
		}
	}
	return filteredNotif;
};
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};

module.exports = self;
