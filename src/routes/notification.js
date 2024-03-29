const self = require("../controllers/notification.controller");
const userController = require("../controllers/user.controller");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

//middleware :

//endpoints for admin:
const router = express.Router();
router.post("/admin/create", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	const description = req.body.description;
	const id_user = req.body.id_user;
	const id_accommodation = req.body.id_accommodation;

	const validator = Joi.object({
		description: Joi.string().required().messages({
			"any.required": "{{#label}} harus diisi",
		}),
		id_user: Joi.number()
			.min(1)
			.required()
			.external(async function () {
				const result = await models.User.findOne({
					where: {
						id: id_user,
					},
				});
				if (result.length <= 0) {
					throw Error("id user tidak ditemukan!");
				}
			})
			.messages({
				"any.required": "{{#label}} harus diisi",
				"number.min": "{{#label}} minimal 1",
			}),
		id_accommodation: Joi.number()
			.min(1)
			.required()
			.external(async function () {
				const result = await models.Accommodation.findOne({
					where: {
						id: id_accommodation,
					},
				});
				if (result.length <= 0) {
					throw Error("id accommodation tidak ditemukan");
				}
			})
			.messages({
				"any.required": "{{#label}} harus diisi",
				"number.min": "{{#label}} minimal 1",
			}),
	});

	try {
		await validator.validateAsync({ description, id_user, id_accommodation });
	} catch (e) {
		return res.status(400).send({
			message: e.message.toString().replace(/['"]/g, ""),
		});
	}

	const user = await models.User.findOne(
		{
			where: {
				id: id_user,
			},
		},
		{
			attributes: ["id", "username"],
		}
	);

	if (user.role == 0) {
		return res.status(400).send({
			message: "role hanya bisa penyedia tempat tinggal dan developer!",
		});
	}

	const insert_new_notification = await self.post(description, id_user, id_accommodation);
	if (insert_new_notification == "success") {
		return res.status(201).send({
			message: `berhasil membuat notifikasi untuk ${user.username}`,
			description: description,
			id_user: id_user,
			id_accommodation: id_accommodation,
		});
	} else {
		return res.status(500).send({
			message: insert_new_notification,
		});
	}
});

router.get("/admin", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	let notifications = await self.getAll();
	const notif_result = notifications.map((p) => ({
		id: p.id,
		user: {
			id: p.id_user,
			username: p.User.username,
		},
		message: p.description,
		accommodation: {
			id: p.id_accommodation,
			name: p.Accommodation.name,
			address: p.Accommodation.address,
		},
	}));
	return res.status(200).send({
		notification: notif_result,
	});
});

//get by id user
router.get("/admin/user/:id_user?", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	const id_user = req.params.id_user;
	let notifs = await self.getByUser(id_user);
	if(notifs.length==0){
		return res.status(404).send({
			message: "notif tidak ditemukan!"
		});
	}
	const notif_result = [];
	for (let i = 0; i < notifs.length; i++) {
		notif_result.push({
			id: notifs[i].id,
			user: {
				id: notifs[i].id_user,
				username: notifs[i].User.username,
			},
			message: notifs[i].description,
			accommodation: {
				id: notifs[i].id_accommodation,
				name: notifs[i].Accommodation.name,
				address: notifs[i].Accommodation.address,
			},
		});
	}
	return res.status(200).send({
		notification: notif_result,
	});
});

//get by id
router.get("/admin/:id?", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	const id = req.params.id;
	let notification = await self.get(id);
	if(!notification){
		return res.status(404).send({
			message: "notif tidak ditemukan!"
		});
	}
	const notif_result = {
		id: notification.id,
		user: {
			id: notification.id_user,
			username: notification.User.username,
		},
		message: notification.description,
		accommodation: {
			id: notification.id_accommodation,
			name: notification.Accommodation.name,
			address: notification.Accommodation.address,
		},
	};
	return res.status(200).send({
		notification: notif_result,
	});
});

//untuk penyedia tempat tinggal dan developer
router.get("/", [auth.authenticate(["provider", "developer"], "role tidak sesuai")], async function (req, res) {
	const username = auth.payload.username;
	const user = await userController.getByUsername(username);
	console.log("=========================");
	console.log("USER: " + username);
	console.log("ID:" + user.id);
	let notifs = await self.getByUser(user.id);

	if(notifs.length==0){
		return res.status(404).send({
			message: "notif tidak ditemukan!"
		});
	}

	const notif_result = [];
	for (let i = 0; i < notifs.length; i++) {
		notif_result.push({
			id: notifs[i].id,
			user: {
				id: notifs[i].id_user,
				username: notifs[i].User.username,
			},
			message: notifs[i].description,
			accommodation: {
				id: notifs[i].Accommodation.id,
				name: notifs[i].Accommodation.name,
				address: notifs[i].Accommodation.address,
			},
		});
	}
	return res.status(200).send({
		notifications: notif_result,
	});
});

// //select all notifications for developer
// router.get('/developer', [auth.authenticate("developer", "role tidak sesuai")], async function (req, res) {
//     const username = auth.payload.username;

//     const user = await userController.getByUsername(username);

//     let notifs = await self.getByUser(user.id);

//     const notif_result = [];
//     for (let i = 0; i < notifs.length; i++) {
//         notif_result.push({
//             id: notifs[i].id,
//             user: {
//                 id: notifs[i].id_user,
//                 username: notifs[i].User.username
//             },
//             message: notifs[i].description,
//             accommodation: {
//                 id: notifs[i].Accommodation.id,
//                 name: notifs[i].Accommodation.name,
//                 address: notifs[i].Accommodation.address
//             }
//         });
//     }
//     return res.status(200).send({
//         notification: notif_result
//     });
// });

module.exports = router;
