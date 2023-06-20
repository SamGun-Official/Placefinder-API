const self = require("../controllers/usage.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE, Sequelize, DOUBLE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");
const axios = require('axios');
const fetch = require('node-fetch');
const { getNumberByCurrentDate } = require("../controllers/formatting.controller");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

const serverKey = "SB-Mid-server-vMhuJY92Ihr9yLQcbX0Nnn9u";
const clientKey = "SB-Mid-client-sNFHj-ePZOzmxetY";

const removePreviousVirtualAccount = async (orderId) => {
	const url = `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`;
	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			authorization: 'Basic U0ItTWlkLXNlcnZlci12TWh1Slk5Mklocjl5TFFjYlgwTm5uOXU6'
		}
	};

	fetch(url, options)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
};

const payment_status = {
	unpaid: 0,
	pending: 1,
	verified: 2,
	failed: 3,
};

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

async function checkUserExistById(id_user) {
	let user = await models.User.findByPk(id_user);
	if (!user) {
		throw Error("Id User tidak ditemukan!");
	}
	return true;
}

const midtransClient = require("midtrans-client");
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
	isProduction: false,
	serverKey: serverKey,
	clientKey: clientKey,
});

const router = express.Router();
router.get("/developer/total", [auth.authenticate("developer", "role tidak sesuai")], async function (req, res) {
	const status = req.query.status;
	//hanya ada paid dan unpaid
	const username = auth.payload.username;
	const user = await models.User.findOne({
		where: {
			username: username,
		},
	});

	if (!status) {
		const usages = await self.getAllUserUsage(user.id);
		const subtotal = await self.getUsageTotal(user.id);
		return res.status(200).send({
			subtotal: formatRupiah(subtotal),
			usages: usages,
		});
	} else {
		const validator = Joi.string().valid("paid", "unpaid");
		const validate = validator.validate(status);

		if (validate.error) {
			return res.status(400).send({
				message: validate.error.message.toString(),
			});
		}


		if (status == "paid") {
			const usages = await self.getUsagePaid(user.id);
			const subtotal = await self.getUsageTotalPaid(user.id);

			const result_usages = [];
			for (let i = 0; i < usages.length; i++) {
				result_usages.push(usages[i]);
			}

			if (result_usages.length > 0) {
				return res.status(200).send({
					subtotal: formatRupiah(subtotal),
					usages: result_usages,
				});
			} else {
				return res.status(200).send({
					subtotal: formatRupiah(0),
					usages: result_usages,
				});
			}
		} else if (status == "unpaid") {
			const usages = await self.getUsageUnpaid(user.id);
			const subtotal = await self.getUsageTotalUnpaid(user.id);

			const result_usages = [];
			for (let i = 0; i < usages.length; i++) {
				result_usages.push(usages[i]);
			}

			if (result_usages.length > 0) {
				return res.status(200).send({
					subtotal: formatRupiah(subtotal),
					usages: result_usages,
				});
			} else {
				return res.status(200).send({
					subtotal: formatRupiah(0),
					usages: result_usages,
				});
			}
		}
	}
});
router.get("/provider/total", [auth.authenticate("provider", "role tidak sesuai")], async function (req, res) {
	const status = req.query.status;
	//hanya ada paid dan unpaid
	const username = auth.payload.username;
	const user = await models.User.findOne({
		where: {
			username: username,
		},
	});

	if (!status) {
		const usages = await self.getAllUserUsage(user.id);
		const subtotal = await self.getUsageTotal(user.id);
		return res.status(200).send({
			subtotal: formatRupiah(subtotal),
			usages: usages,
		});
	} else {
		const validator = Joi.string().valid("paid", "unpaid");
		const validate = validator.validate(status);

		if (validate.error) {
			return res.status(400).send({
				message: validate.error.message.toString(),
			});
		}


		if (status == "paid") {
			const usages = await self.getUsagePaid(user.id);
			const subtotal = await self.getUsageTotalPaid(user.id);

			const result_usages = [];
			for (let i = 0; i < usages.length; i++) {
				result_usages.push(usages[i]);
			}

			if (result_usages.length > 0) {
				return res.status(200).send({
					subtotal: formatRupiah(subtotal),
					usages: result_usages,
				});
			} else {
				return res.status(200).send({
					subtotal: formatRupiah(0),
					usages: result_usages,
				});
			}
		} else if (status == "unpaid") {
			const usages = await self.getUsageUnpaid(user.id);
			const subtotal = await self.getUsageTotalUnpaid(user.id);

			const result_usages = [];
			for (let i = 0; i < usages.length; i++) {
				result_usages.push(usages[i]);
			}

			if (result_usages.length > 0) {
				return res.status(200).send({
					subtotal: formatRupiah(subtotal),
					usages: result_usages,
				});
			} else {
				return res.status(200).send({
					subtotal: formatRupiah(0),
					usages: result_usages,
				});
			}
		}
	}
});
router.get("/developer/:id?", [auth.authenticate("developer", "role tidak sesuai")], async function (req, res) {
	const id = req.params.id;
	const username = auth.payload.username;
	console.log(username);

	const user = await models.User.findOne({
		where: {
			username: username,
		},
	});

	if (!id) {
		const usages = await self.getAllUserUsage(user.id);
		return res.status(200).send({
			usages: usages,
		});
	} else {
		const usage = await self.getUsageById(id, user.id);
		if (usage.id != undefined) {
			if (usage.id_user != user.id) {
				return res.status(404).send({
					message: "usage bukan milik developer yang sedang login!"
				});
			}
			return res.status(200).send({
				usage: usage,
			});
		} else {
			return res.status(404).send({
				message: "tidak ada hasil pencarian",
			});
		}
	}
});

router.get("/", [auth.authenticate(["provider"])], async function (req, res) {
	let user = await models.User.findOne({ where: { username: auth.payload.username } });
	return res.status(200).send(await self.getAllUsagesByIdUser(user.id));
});

router.get("/admin/all", [auth.authenticate(["admin"])], async function (req, res) {
	return res.status(200).send(await self.getAllUsages());
});

router.get("/admin/:user_id", [auth.authenticate(["admin"])], async function (req, res) {
	const user_id = req.params.user_id;
	return res.status(200).send(await self.getAllUserUsage(user_id));
});

module.exports = router;
