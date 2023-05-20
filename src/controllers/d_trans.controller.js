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
const Usage = require("../models/usage")(database);

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
self.getDtrans = async (id_htrans) => {
	let d_trans = await D_trans.findAll({
		attributes: ["id", "id_htrans", "id_usage", "subtotal", "status"],
		include: [
			{
				model: Usage,
				attributes: ["id", "id_pricelist", "date", "subtotal"],
			},
		],
	});

	let result_dtrans = [];
	for (let i = 0; i < d_trans.length; i++) {
		if (d_trans[i].id_htrans == id_htrans) {
			const pricelist = await PriceList.findOne({
				where: {
					id: d_trans[i].Usage.id_pricelist,
				},
			});
			result_dtrans.push({
				id: d_trans[i].id,
				usage: {
					id: d_trans[i].Usage.id,
					pricelist: {
						id: d_trans[i].Usage.id_pricelist,
						feature_name: pricelist.feature_name,
						url_endpoint: pricelist.url_endpoint,
						price: formatRupiah(pricelist.price),
					},
					date: formattedStringDate(d_trans[i].Usage.date),
					subtotal: formatRupiah(d_trans[i].subtotal),
				},
				subtotal: formatRupiah(d_trans[i].subtotal),
			});
		}
	}

	return result_dtrans;
};

module.exports = self;
