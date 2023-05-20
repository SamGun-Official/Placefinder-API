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
self.post = async (description, id_user, id_accomodation) => {
	try {
		await Notification.create({
			description: description,
			id_user: id_user,
			id_accomodation: id_accomodation,
		});
		return "success";
	} catch (e) {
		return e.toString();
	}
};
self.getAll = async (req, res) => {
	let notifications = await Notification.findAll({
		attributes: ["id", "description", "id_user", "id_accomodation", "status"],
		include: [
			{
				model: Accomodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: User,
				attributes: ["username"],
			},
		],
	});
	return notifications;
};
self.get = async (id) => {
	let notif = await Notification.findByPk(id, {
		attributes: ["id", "description", "id_user", "id_accomodation", "status"],
		include: [
			{
				model: Accomodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: User,
				attributes: ["username"],
			},
		],
	});
	return notif;
};
self.getByUser = async (id_user) => {
	let notif = await Notification.findAll({
		attributes: ["id", "description", "id_user", "id_accomodation", "status"],
		include: [
			{
				model: Accomodation,
				attributes: ["name", "address", "id"],
			},
			{
				model: User,
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
