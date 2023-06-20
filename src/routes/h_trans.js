const self = require("../controllers/h_trans.controller");
const dtransController = require("../controllers/d_trans.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE, Sequelize, DOUBLE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");
const { now } = require("moment");
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

const midtransClient = require("midtrans-client");
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
	isProduction: false,
	serverKey: serverKey,
	clientKey: clientKey,
});

function formatitem_details(item_details) {
	let result = [];
	for (const item_detail of item_details) {
		result.push({
			id: item_detail.id_pricelist,
			price: item_detail.price,
			quantity: item_detail.qty,
			name: item_detail.feature_name,
			brand: 'placefinder',
			category: 'service',
			merchant_name: 'placefinder',
			url: item_detail.Pricelist.url_endpoint
		});
	}
	return result;
}

// function formatitem_details(item_details) {
// 	let result = [];
// 	for (const item_detail of item_details) {
// 		result.push({
// 			id: item_detail.dataValues.id_pricelist,
// 			price: item_detail.dataValues.price,
// 			quantity: item_detail.dataValues.qty,
// 			name: item_detail.dataValues.feature_name,
// 			brand: 'placefinder',
// 			category: 'service',
// 			merchant_name: 'placefinder',
// 			url: item_detail.dataValues.Pricelist.url_endpoint
// 		});
// 	}
// 	return result;
// }

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

const PAYMENT_STATUS = [
	"unpaid",
	"pending",
	"verified",
	"failed"
]

function checkPaymentStatusExist(payment_status) {
	if (!payment_status) {
		return true;
	}
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
router.get("/search/", [auth.authenticate(["admin", "developer", 'provider'])], async function (req, res) {
	const user = await models.User.findOne({ where: { username: auth.payload.username } });
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
			return res.status(200).send(await self.getByPaymentStatus(payment_status, user.id));
		} else if (start_date || end_date) {
			return res.status(200).send(await self.getByDate(start_date, end_date, user.id));
		} else {
			return res.status(200).send(await self.getAll(user.id));
		}
	}
});



router.post("/checkout", [auth.authenticate(["developer", 'provider'], "role tidak sesuai")], async function (req, res) {
	let user = await models.User.findOne({ where: { username: auth.payload.username } });
	let h_trans = await models.H_trans.findAll({
		where: {
			number: {
				[Op.like]: `%${getNumberByCurrentDate()}%`,
			},
		},
	});
	// let item_details = await models.Usage.findAll({
	// 	attributes: [
	// 		'id',
	// 		[Sequelize.literal('PriceList.id'), 'id_pricelist'],
	// 		[Sequelize.literal('PriceList.feature_name'), 'feature_name'],
	// 		[Sequelize.literal('PriceList.url_endpoint'), 'url_endpoint'],
	// 		[Sequelize.literal('PriceList.price'), 'price'],
	// 		[Sequelize.literal('PriceList.status'), 'status'],
	// 		[Sequelize.literal('PriceList.created_at'), 'created_at'],
	// 		[Sequelize.literal('PriceList.updated_at'), 'updated_at'],
	// 		[Sequelize.fn('COUNT', Sequelize.col('id_pricelist')), 'qty'],
	// 		[Sequelize.fn('SUM', Sequelize.col('subtotal')), 'subtotal'],
	// 	],
	// 	include: [{
	// 		model: models.PriceList,
	// 		attributes: [
	// 			'url_endpoint'
	// 		],
	// 	}],
	// 	where: {
	// 		id_user: user.id,
	// 		status: 1,
	// 	},
	// 	group: ['PriceList.id', 'Usage.id_pricelist'],
	// });

	let item_details = await models.Usage.findAll({
		include: [{
			model: models.PriceList,
			attributes: [
				'feature_name',
				'url_endpoint',
				'price',
				'status',
				'created_at',
				'updated_at'
			],
		}],
		where: {
			id_user: user.id,
			status: 1,
		},
	});
	const transformedData = item_details.reduce((result, item) => {
		const existingItem = result.find(
			(resultItem) => resultItem.id_pricelist === item.id_pricelist
		);

		if (existingItem) {
			existingItem.qty += 1;
			existingItem.subtotal = (existingItem.qty * existingItem.price).toString();
		} else {
			const newItem = {
				id: item.id,
				id_pricelist: item.id_pricelist,
				feature_name: item.Pricelist.feature_name,
				url_endpoint: item.Pricelist.url_endpoint,
				price: item.Pricelist.price,
				status: item.Pricelist.status,
				created_at: item.Pricelist.created_at,
				updated_at: item.Pricelist.updated_at,
				qty: 1,
				subtotal: item.subtotal.toString(),
				Pricelist: {
					url_endpoint: item.Pricelist.url_endpoint
				}
			};

			result.push(newItem);
		}

		return result;
	}, []);

	console.log(transformedData);
	item_details = transformedData;

	let total = 0;
	for (const item_detail of item_details) {
		total += parseInt(item_detail.subtotal);
	}
	if (item_details.length == 0 || total == 0) {
		return res.status(404).send({
			message: "Belum pernah menggunakan service!",
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
		item_details: formatitem_details(item_details)
	};
	let usages = await models.Usage.findAll({
		where: {
			id_user: user.id,
			status: 1,
		},
	});
	coreApi
		.charge(parameter)
		.then(async (checkoutResponse) => {
			console.log("checkoutResponse", JSON.stringify(checkoutResponse));
			try {
				let old_h_trans = await models.H_trans.findOne({
					where: {
						[Op.and]: {
							id_user: user.id,
							payment_status: 1 //pending
						}
					}
				});
				if (old_h_trans) { //cek apakah ada h_trans yang masih pending, kalau ada yg lama, dianggap failed 
					await removePreviousVirtualAccount(old_h_trans.number);
					old_h_trans.payment_status = 3; //failed
					await old_h_trans.save();
				}
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
					item_details: item_details,
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
	// return res.status(200).send({ message: req.body });
	coreApi.transaction.notification(req.body)
		.then(async (statusResponse) => {
			const order_id = statusResponse.order_id;
			let transactionStatus = statusResponse.transaction_status;
			// Sample transactionStatus handling logic

			if (transactionStatus == "capture") {
				// capture only applies to card transaction, which you need to check for the fraudStatus
				if (fraudStatus == "challenge") {
					// TODO set transaction status on your databaase to 'challenge'
				} else if (fraudStatus == "accept") {
					// TODO set transaction status on your databaase to 'success'
				}
			} else if (transactionStatus == "settlement") {
				// TODO set transaction status on your databaase to 'success'
				await models.H_trans.update({
					payment_status: 2 //settlement
				}, {
					where: {
						number: order_id
					}
				});
				let h_trans = await models.H_trans.findOne({ where: { number: order_id } });
				let d_trans = await models.D_trans.findOne({ where: { id_htrans: h_trans.id } });
				for(const d of d_trans.dataValues){
					let usage = await models.Usage.findByPk(d.id_usage);
					usage.status = 0;
					await usage.save();
				}
			} else if (transactionStatus == "deny") {
				// TODO you can ignore 'deny', because most of the time it allows payment retries
				// and later can become success
			} else if (transactionStatus == "cancel" || transactionStatus == "expire") {
				// TODO set transaction status on your databaase to 'failure'
				await models.H_trans.update({
					payment_status: 3 //failed
				}, {
					where: {
						number: order_id
					}
				});
			} else if (transactionStatus == "pending") {
			}
		});
	return res.status(200).send("OK");
});

module.exports = router;
