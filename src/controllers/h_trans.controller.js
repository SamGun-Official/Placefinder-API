const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dtransController = require("../controllers/d_trans.controller");
const moment = require("moment");

function formattedStringDate(ts) {
	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	return year + "-" + month + "-" + date;
}

async function formattedH_trans(h_trans) {
	let result_htrans = [];
	for (let i = 0; i < h_trans.length; i++) {
		let d_trans = await dtransController.getDtrans(h_trans[i].id);
		result_htrans.push({
			id: h_trans[i].id,
			number: h_trans[i].number,
			user: {
				id: h_trans[i].User.id,
				username: h_trans[i].User.username,
				name: h_trans[i].User.name,
				email: h_trans[i].User.email,
				phone_number: h_trans[i].User.phone_number,
			},
			transaction_date: formattedStringDate(h_trans[i].date),
			total: formatRupiah(h_trans[i].total),
			payment_status: PAYMENT_STATUS[h_trans[i].payment_status],
			transaction_detail: d_trans,
		});
	}
	return result_htrans;
}

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

const PAYMENT_STATUS = {
	0: "unpaid",
	1: "pending",
	2: "verified",
	3: "failed",
};

let self = {};
self.getAll = async () => {
	let h_trans = await models.H_trans.findAll({
		attributes: ["id", "number", "id_user", "date", "total", "payment_status", "status"],
		include: [
			{
				model: models.User,
				attributes: ["id", "username", "phone_number", "email", "name"],
			},
		],
	});

	//nb: total dihitung lagi karena di table itu berbeda
	return await formattedH_trans(h_trans);
};
self.getById = async () => {};
self.getByIdUser = async (id_user) => {
	let h_trans = await models.H_trans.findAll({
		attributes: ["id", "number", "id_user", "date", "total", "payment_status", "status"],
		include: [
			{
				model: models.User,
				attributes: ["id", "username", "phone_number", "email", "name"],
				where: {
					id_user: id_user,
				},
			},
		],
	});

	//nb: total dihitung lagi karena di table itu berbeda
	return await formattedH_trans(h_trans);
};
self.getByNumber = async (number) => {
	let h_trans = await models.H_trans.findAll({
		attributes: ["id", "number", "id_user", "date", "total", "payment_status", "status"],
		include: [
			{
				model: models.User,
				attributes: ["id", "username", "phone_number", "email", "name"],
			},
		],
		where: {
			number: {
				[Op.like]: `%${number}%`,
			},
		},
	});
	return await formattedH_trans(h_trans);
};
self.getByDate = async (start, end) => {
	let start_date, end_date;
	start_date = start ? moment(start, "DD/MM/YYYY").format("YYYY-MM-DD") : "2000-01-01";
	end_date = end ? moment(end, "DD/MM/YYYY").format("YYYY-MM-DD") : new Date();
	let h_trans = await models.H_trans.findAll({
		attributes: ["id", "number", "id_user", "date", "total", "payment_status", "status"],
		include: [
			{
				model: models.User,
				attributes: ["id", "username", "phone_number", "email", "name"],
			},
		],
		where: {
			date: {
				[Op.between]: [start_date, end_date],
			},
		},
	});
	return await formattedH_trans(h_trans);
};

module.exports = self;
