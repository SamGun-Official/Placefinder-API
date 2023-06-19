const express = require("express");
const models = require("../models/models");
const self = {};

const ROLE = ["admin", "developer", "provider"];
const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

self.ROLE = ROLE;
self.payload = null;

self.authenticate = (role, message = "Unauthorized") => {
	return async (req, res, next) => {
		const token = req.header("x-auth-token");
		if (!token) {
			return res.status(401).send({ message: "Unauthorized" });
		}
		try {
			const user = await models.User.findOne({
				where: {
					token: token,
				},
			});
			if (!user) {
				return res.status(404).send({
					message: "token tidak dapat ditemukan!",
				});
			}

			self.payload = jwt.verify(token, JWT_KEY);
		} catch (error) {
			return res.status(400).send({ message: "Invalid JWT Key" });
		}
		if (role.includes("all") || role.includes(self.ROLE[self.payload.role])) {
			next();
		} else {
			return res.status(401).send({ message });
		}
	};
};

module.exports = self;
