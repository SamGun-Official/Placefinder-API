const self = require("../controllers/h_trans.controller");
const dtransController = require("../controllers/d_trans.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");
const { now } = require("moment");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

const PAYMENT_STATUS = [
	"unpaid",
	"pending",
	"verified",
	"failed"
]

function checkPaymentStatusExist(payment_status) {
	if (PAYMENT_STATUS.find(p => p == payment_status.toLowerCase())) {
		return true;
	}
	throw Error('payment_status tidak ditemukan!');
}

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

const router = express.Router();
router.get("/", [auth.authenticate(["developer", "admin", "provider"], "role tidak sesuai")], async function (req, res) {
	const username = auth.payload.username;
	console.log(username);
	const user = await models.User.findOne({
		where: {
			username: {
				[Op.eq]: username,
			},
		},
	});

	if (!user) {
		return res.status(404).send({
			message: "username tidak terdaftar!",
		});
	}

	if (user.role != 0) {
		const htrans = await self.getByIdUser(user.id);
		if (htrans.length > 0) {
			return res.status(200).send(htrans);
		} else {
			return res.status(200).send({
				message: "belum ada transaksi",
			});
		}
	} else {
		const htrans = await self.getAll();
		if (htrans.length > 0) {
			return res.status(200).send(htrans);
		} else {
			return res.status(200).send({
				message: "belum ada transaksi",
			});
		}
	}
});
router.get('/services', [auth.authenticate(["provider"])], async function (req, res) {

});
router.get("/search/", [auth.authenticate(["admin", "developer", 'provider'])], async function (req, res) {
	const validator = Joi.object({
		number: Joi.string().allow("", null),
		start_date: Joi.date().max("now").format("DD/MM/YYYY").allow("", null),
		end_date: Joi.date().max("now").format("DD/MM/YYYY").allow("", null),
	});
	const validator2 = Joi.object({
		payment_status: Joi.string().external(checkPaymentStatusExist).allow("", null),
		start_date: Joi.date().max("now").format("DD/MM/YYYY").allow("", null),
		end_date: Joi.date().max("now").format("DD/MM/YYYY").allow("", null),
	});
	if (auth.ROLE[auth.payload.role] == "admin") {
		let { number, start_date, end_date } = req.query;
		try {
			await validator.validateAsync(req.query);
		} catch (e) {
			return res.status(400).send({
				message: e.message.toString().replace(/['"]/g, ""),
			});
		}
		if (number) {
			return res.status(200).send(await self.getByNumber(number));
		} else if (start_date || end_date) {
			return res.status(200).send(await self.getByDate(start_date, end_date));
		} else {
			return res.status(200).send(await self.getAll());
		}
	}
	else if (auth.ROLE[auth.payload.role] == 'developer' || auth.ROLE[auth.payload.role] == 'provider') {
		let { payment_status, start_date, end_date } = req.query;
		try {
			await validator2.validateAsync(req.query);
		} catch (e) {
			return res.status(400).send({
				message: e.message.toString().replace(/['"]/g, ""),
			});
		}
		if (payment_status) {
			// return res.status(200).send(payment_status);
			return res.status(200).send(await self.getByPaymentStatus(payment_status));
		} else if (start_date || end_date) {
			return res.status(200).send(await self.getByDate(start_date, end_date));
		} else {
			return res.status(200).send(await self.getAll());
		}
	}
});


module.exports = router;
