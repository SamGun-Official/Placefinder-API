const self = require("../controllers/user.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

//npx sequelize-cli db:migrate:undo:all
//npx sequelize-cli db:migrate
//npx sequelize-cli db:seed:all

// function authenticate(roles, message = "Unauthorized") {
//   return (req, res, next) => {
//     const token = req.header("x-auth-token");
//     if (!token) {
//       return res.status(401).send(message);
//     }
//     const payload = jwt.verify(token, JWT_KEY);

//     if (roles.includes("ALL") || roles.includes(payload.role)) {
//       req.body = { ...req.body, ...payload };
//       next();
//     } else {
//       return res.status(401).send(message);
//     }
//   };
// }

const IS_VERIFIED = {
	0: "not verified",
	1: "verified",
};
const ROLE = ["Admin", "Developer", "Penyedia tempat tinggal"];

const router = express.Router();
router.get("/", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	let name = req.query.name ?? "";
	const users = await self.getAll(name);
	return res.status(200).send(users);
});
router.post("/login", async function (req, res) {
	let { username, password } = req.body;
	const schema = Joi.object({
		username: Joi.string()
			.required()
			.external(async function () {
				let user_with_username = await models.User.findOne({
					where: {
						username: {
							[Op.eq]: username,
						},
					},
				});
				if (user_with_username == null) {
					throw Error("Username tidak ditemukan");
				}
				if (user_with_username.password != password) {
					throw Error("Password salah");
				}
			}),
		password: Joi.string().min(5).required(),
	});
	try {
		await schema.validateAsync(req.body);
		let user = await self.login(req, res);
		if (user) {
			return res.status(200).send({
				message: "Berhasil login!",
				user: {
					username: user.username,
					email: user.email,
					role: ROLE[user.role],
					token: user.token,
				},
			});
		}

		return res.status(400).send({
			message: "Gagal login!",
		});
	} catch (e) {
		return res.status(400).send({
			message: e.message,
		});
	}
});
router.get("/:id", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	let id = req.params.id;
	let user = await self.getById(id);
	if (user) {
		return res.status(200).send(user);
	} else {
		//not found
		return res.status(404).send({ message: "User tidak ditemukan!" });
	}
});

router.post("/register", async function (req, res) {
	let { username, password, name, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;
	//JOI validations
	const schema = Joi.object({
		username: Joi.string()
			.required()
			.external(async function () {
				let user_with_username = await models.User.findOne({
					where: {
						username: {
							[Op.eq]: username,
						},
					},
				});
				if (user_with_username != null) {
					throw Error("Username harus unik");
				}
			}),
		password: Joi.string().min(6).required(),
		name: Joi.string().required(),
		email: Joi.string()
			.email()
			.required()
			.external(async function () {
				let user_with_email = await models.User.findOne({
					where: {
						email: {
							[Op.eq]: email,
						},
					},
				});
				if (user_with_email != null) {
					throw Error("Email harus unik");
				}
			}),

		role: Joi.number().valid(1, 2).required(),
		phone_number: Joi.string().pattern(new RegExp("^[0-9]{10,13}$")).required(),
		tanggal_lahir: Joi.date().max("now").required().format("DD/MM/YYYY"),
		id_card_number: Joi.string()
			.pattern(new RegExp("^[0-9]{16}$"))
			.required()
			.external(async function () {
				let user_with_id_card_number = await models.User.findOne({
					where: {
						id_card_number: {
							[Op.eq]: id_card_number,
						},
					},
				});
				if (user_with_id_card_number != null) {
					throw Error("ID card number harus unik");
				}
			}),
	});

	try {
		await schema.validateAsync(req.body);
		let registerResult = await self.register(req, res);
		if (registerResult) {
			return res.status(201).send({ message: "Berhasil register!", user: registerResult });
		}
		return res.status(400).send({
			message: "Gagal register!",
		});
	} catch (e) {
		return res.status(400).send({
			message: e.message,
		});
	}
});
router.put("/:id/edit", [auth.authenticate(["admin", "developer", "provider"], "role tidak sesuai")], async function (req, res) {
	let id = req.params.id;
	let { username, password, name, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;
	//JOI validations
	const schema = Joi.object({
		username: Joi.string()
			.external(async function () {
				let user_with_username = await models.User.findOne({
					where: {
						username: {
							[Op.eq]: username,
						},
						id: {
							[Op.ne]: id,
						},
					},
				});
				console.log(user_with_username);
				if (user_with_username != null) {
					throw Error("Username harus unik");
				}
			})
			.allow("", null),
		password: Joi.string().min(6).allow("", null),
		name: Joi.string().allow("", null),
		email: Joi.string()
			.email()
			.external(async function () {
				let user_with_email = await models.User.findOne({
					where: {
						email: {
							[Op.eq]: email,
						},
						id: {
							[Op.ne]: id,
						},
					},
				});
				if (user_with_email != null) {
					throw Error("Email harus unik");
				}
			})
			.allow("", null),
		role: Joi.number().valid(1, 2).allow("", null),
		phone_number: Joi.string().pattern(new RegExp("^[0-9]{10,12}$")).allow("", null),
		tanggal_lahir: Joi.date().max("now").format("DD/MM/YYYY").allow("", null),
		id_card_number: Joi.string()
			.pattern(new RegExp("^[0-9]{16}$"))
			.external(async function () {
				let user_with_id_card_number = await models.User.findOne({
					where: {
						id_card_number: {
							[Op.eq]: id_card_number,
						},
						id: {
							[Op.ne]: id,
						},
					},
				});
				if (user_with_id_card_number != null) {
					throw Error("ID card number harus unik");
				}
			})
			.allow("", null),
	});
	try {
		await schema.validateAsync(req.body);
		let edited_user = await self.edit(id, req);
		return res.status(200).send({ message: "Berhasil edit!", user: edited_user });
	} catch (e) {
		return res.status(400).send({
			message: e.message,
		});
	}
});
router.post("/:id/verify", [auth.authenticate(["developer", "provider"], "role tidak sesuai")], async function (req, res) {
	let id = req.params.id;
	let id_card_number = req.body.id_card_number;
	let user_with_id;
	const schema = Joi.object({
		id: Joi.number()
			.required()
			.external(async function () {
				user_with_id = await models.User.findOne({
					where: {
						id: {
							[Op.eq]: id,
						},
					},
				});
				if (user_with_id == null) {
					throw Error("ID tidak ditemukan");
				}
			}),
		id_card_number: Joi.string().required().pattern(new RegExp("^[0-9]{16}$")),
	});

	try {
		await schema.validateAsync({ id, id_card_number });
		let verifyResult = await self.verify(id, req, res);
		if (verifyResult) {
			if (user_with_id.id_card_number == id_card_number) {
				return res.status(200).send({ message: "Berhasil upload!" });
			}
		}
		return res.status(400).send({
			message: "Gagal upload!",
		});
	} catch (e) {
		return res.status(400).send({
			message: e.message,
		});
	}
});
router.put("/:id/verify/confirm", [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
	const id = req.params.id;
	const validator = Joi.number()
		.min(1)
		.required()
		.external(async function () {
			let user_with_id = await models.User.findOne({
				where: {
					id: {
						[Op.eq]: id,
					},
				},
			});
			if (user_with_id == null) {
				throw Error("ID tidak ditemukan");
			}
		})
		.messages({
			"any.required": "{{#label}} harus diisi",
			"number.min": "{{#label}} minimal 1",
		});

	try {
		await validator.validateAsync(id);
	} catch (e) {
		return res.status(400).send({
			message: e.message.toString().replace(/['"]/g, ""),
		});
	}

	const user = await models.User.findOne({
		where: {
			id: id,
		},
	});
	if (user.role == 0) {
		return res.status(400).send({
			message: "role tidak valid untuk dikonfirmasi",
		});
	}

	//check apakah sudah pernah dikonfirmasi atau belum
	if (user.is_id_card_verified == 1) {
		return res.status(400).send({
			message: "id card sudah di verifikasi",
		});
	}

	if (user.id_card_number == null) {
		return res.status(404).send({
			message: "id card tidak dapat ditemukan",
		});
	}

	//verify (update)
	await self.updateUserConfirm(user.username);

	return res.status(200).send({
		message: `berhasil mengkonfirmasi pengguna dengan username ${user.username}`,
		user: {
			id: user.id,
			username: user.username,
			name: user.name,
			role: ROLE[user.role],
			email: user.email,
			phone_number: user.phone_number,
			tanggal_lahir: user.tanggal_lahir,
			id_card: {
				number: user.id_card_number,
				status: "verified",
			},
			token: user.token,
			status: user.status,
		},
	});
});

module.exports = router;
