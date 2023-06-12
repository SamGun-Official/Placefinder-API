const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//functions
function formattedStringDate(ts) {
	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	return year + "-" + month + "-" + date;
}

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

let self = {};
self.getAllUserUsage = async (id) => {
	let usages = await models.Usage.findAll({
		attributes: ["id", "id_pricelist", "id_user", "date", "subtotal", "status"],
		include: [
			{
				model: models.PriceList,
				attributes: ["id", "price", "url_endpoint", "feature_name"],
			},
			{
				model: models.User,
				attributes: ["id", "username"],
			},
		],
	});

	let usages_result = [];
	for (let i = 0; i < usages.length; i++) {
		if (usages[i].id_user == id) {
			usages_result.push({
				id: usages[i].id,
				user: {
					id: usages[i].User.id,
					username: usages[i].User.username,
				},
				date: formattedStringDate(usages[i].date),
				pricelist: {
					id: usages[i].id_pricelist,
					feature_name: usages[i].Pricelist.feature_name,
					url_endpoint: usages[i].Pricelist.url_endpoint,
					price: formatRupiah(usages[i].Pricelist.price),
				},
				subtotal: formatRupiah(usages[i].subtotal),
			});
		}
	}

	return usages_result;
};
self.getUsageTotal = async (id) => {
	let usages = await models.Usage.sum("subtotal", {
		where: {
			id_user: id,
		},
	});
	return usages;
};
self.getUsageTotalPaid = async (id) => {
	let usages = await models.Usage.sum("subtotal", {
		where: {
			id_user: id,
			status: 0,
		},
	});
	return usages;
};
self.getUsageTotalUnpaid = async (id) => {
	let usages = await models.Usage.sum("subtotal", {
		where: {
			id_user: id,
			status: 1,
		},
	});
	return usages;
};
self.getUsagePaid = async (id) => {
	let usages = await models.Usage.findAll({
		attributes: ["id", "id_pricelist", "id_user", "date", "subtotal", "status"],
		include: [
			{
				model: models.PriceList,
				attributes: ["id", "price", "url_endpoint", "feature_name"],
			},
			{
				model: models.User,
				attributes: ["id", "username"],
			},
		],
	});

	let usages_result = [];
	for (let i = 0; i < usages.length; i++) {
		if (usages[i].id_user == id && usages[i].status == 0) {
			usages_result.push({
				id: usages[i].id,
				user: {
					id: usages[i].User.id,
					username: usages[i].User.username,
				},
				date: formattedStringDate(usages[i].date),
				pricelist: {
					id: usages[i].id_pricelist,
					feature_name: usages[i].Pricelist.feature_name,
					url_endpoint: usages[i].Pricelist.url_endpoint,
					price: formatRupiah(usages[i].Pricelist.price),
				},
				subtotal: formatRupiah(usages[i].subtotal),
			});
		}
	}

	return usages_result;
};
self.getUsageUnpaid = async (id) => {
	let usages = await models.Usage.findAll({
		attributes: ["id", "id_pricelist", "id_user", "date", "subtotal", "status"],
		include: [
			{
				model: models.PriceList,
				attributes: ["id", "price", "url_endpoint", "feature_name"],
			},
			{
				model: models.User,
				attributes: ["id", "username"],
			},
		],
	});

	let usages_result = [];
	for (let i = 0; i < usages.length; i++) {
		if (usages[i].id_user == id && usages[i].status == 1) {
			usages_result.push({
				id: usages[i].id,
				user: {
					id: usages[i].User.id,
					username: usages[i].User.username,
				},
				date: formattedStringDate(usages[i].date),
				pricelist: {
					id: usages[i].id_pricelist,
					feature_name: usages[i].Pricelist.feature_name,
					url_endpoint: usages[i].Pricelist.url_endpoint,
					price: formatRupiah(usages[i].Pricelist.price),
				},
				subtotal: formatRupiah(usages[i].subtotal),
			});
		}
	}

	return usages_result;
};
self.getUsageById = async (id, id_user) => {
	let usages = await models.Usage.findAll({
		attributes: ["id", "id_pricelist", "id_user", "date", "subtotal", "status"],
		include: [
			{
				model: models.PriceList,
				attributes: ["id", "price", "url_endpoint", "feature_name"],
			},
			{
				model: models.User,
				attributes: ["id", "username"],
			},
		],
	});

	let usages_result = {};
	for (let i = 0; i < usages.length; i++) {
		if (usages[i].id_user == id_user && usages[i].id == id) {
			usages_result = {
				id: usages[i].id,
				user: {
					id: usages[i].User.id,
					username: usages[i].User.username,
				},
				date: formattedStringDate(usages[i].date),
				pricelist: {
					id: usages[i].id_pricelist,
					feature_name: usages[i].Pricelist.feature_name,
					url_endpoint: usages[i].Pricelist.url_endpoint,
					price: formatRupiah(usages[i].Pricelist.price),
				},
				subtotal: formatRupiah(usages[i].subtotal),
			};
		}
	}

	return usages_result;
};
self.getAllUsagesByIdUser = async (id_user) => {
	return (usages = await models.Usage.findAll({
		where: {
			id_user: id_user,
		},
		include: [
			{
				model: models.PriceList,
				attributes: ["feature_name", "url_endpoint", "price"],
			},
		],
	}));
};

module.exports = self;
