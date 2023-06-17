const self = require("../controllers/usage.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE, Sequelize, DOUBLE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");
const { getNumberByCurrentDate } = require("../controllers/formatting.controller");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

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
	serverKey: "SB-Mid-server-vMhuJY92Ihr9yLQcbX0Nnn9u",
	clientKey: "SB-Mid-client-sNFHj-ePZOzmxetY",
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
			subtotal: subtotal,
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

router.post("/checkout", [auth.authenticate("developer", "role tidak sesuai")], async function (req, res) {
	let user = await models.User.findOne({ where: { username: auth.payload.username } });
	let h_trans = await models.H_trans.findAll({
		where: {
			number: {
				[Op.like]: `%${getNumberByCurrentDate()}%`,
			},
		},
	});
	// let usages = await models.Usage.findAll({
	// 	attributes: [
	// 		[Sequelize.literal('PriceList.id'), 'id_pricelist'],
	// 		[Sequelize.literal('PriceList.feature_name'), 'feature_name'],
	// 		[Sequelize.literal('PriceList.url_endpoint'), 'url_endpoint'],
	// 		[Sequelize.literal('PriceList.price'), 	'price'],
	// 		[Sequelize.literal('PriceList.status'), 'status'],
	// 		[Sequelize.literal('PriceList.created_at'), 'created_at'],
	// 		[Sequelize.literal('PriceList.updated_at'), 'updated_at'],
	// 		[Sequelize.fn('COUNT', Sequelize.col('id_pricelist')), 'qty'],
	// 		[Sequelize.fn('SUM', Sequelize.col('subtotal')), 'subtotal'],
	// 	],
	// 	include: [{
	// 		model: models.PriceList,
	// 		attributes: [],
	// 	}],
	// 	where: {
	// 		status: 1,
	// 		id_user: 38,
	// 	},
	// 	group: ['PriceList.id', 'Usage.id_pricelist'],
	// });
	let usages = await models.Usage.findAll({
		where: {
			id_user: user.id,
			status: 1,
		},
	});
	let total = 0;
	for (const usage of usages) {
		total += parseInt(usage.subtotal);
	}
	if (usages.length == 0 || total == 0) {
		return res.status(404).send({
			message: 'Belum pernah menggunakan service!'
		});
	}
	let number = getNumberByCurrentDate() + String(h_trans.length + 1).padStart(3, "0");
	let parameter = {
		payment_type: "bank_transfer",
		transaction_details: {
			gross_amount: total,
			order_id: number,
		},
		bank_transfer: {
			bank: "bca",
		},
		customer_details: {
			first_name: user.name,
			last_name: "",
			email: user.email,
			phone: user.phone_number,
		},
		// "order_id": number
		// "usages": usages
	};
	console.log(parameter);
	return res.status(400).send({
		message: parameter,
	});
	coreApi
		.charge(parameter)
		.then(async (checkoutResponse) => {
			console.log("checkoutResponse", JSON.stringify(checkoutResponse));
			try {
				const h_trans = await models.H_trans.create({
					number: number,
					id_user: user.id,
					date: new Date(),
					total: total,
					payment_status: payment_status["pending"],
					status: 1,
				});
				for (const usage of usages) {
					const d_trans = await models.D_trans.create({
						id_htrans: h_trans.id,
						id_usage: usage.id,
						subtotal: usage.subtotal,
						status: payment_status["pending"],
					});
				}
				return res.status(201).send({
					usages: usages,
					checkoutResponse: checkoutResponse,
				});
			} catch (e) {
				return res.status(500).send({
					message: e.message,
				});
			}
		})
		.catch((e) => {
			return res.status(500).send({
				message: e.message,
			});
		});
});

router.post("/notification/", async function (req, res) {
	coreApi.transaction.notification(req.body)
		.then((statusResponse) => {
			let order_id = statusResponse.order_id;
			let transactionStatus = statusResponse.transaction_status;
			// Sample transactionStatus handling logic

			if (transactionStatus == 'capture') {
				// capture only applies to card transaction, which you need to check for the fraudStatus
				if (fraudStatus == 'challenge') {
					// TODO set transaction status on your databaase to 'challenge'
				} else if (fraudStatus == 'accept') {
					// TODO set transaction status on your databaase to 'success'
				}
			} else if (transactionStatus == 'settlement') {
				// TODO set transaction status on your databaase to 'success'
			} else if (transactionStatus == 'deny') {
				// TODO you can ignore 'deny', because most of the time it allows payment retries
				// and later can become success
			} else if (transactionStatus == 'cancel' ||
				transactionStatus == 'expire') {
				// TODO set transaction status on your databaase to 'failure'
			} else if (transactionStatus == 'pending') {

			}
		});
	return res.status(200).send('OK');
});

router.get("/", [auth.authenticate(["provider"])], async function (req, res) {
	let user = await models.User.findOne({ where: { username: auth.payload.username } });
	return res.status(200).send(await self.getAllUsages());
	return res.status(200).send(await self.getAllUsagesByIdUser(user.id));
});

module.exports = router;
