const self = require("../controllers/d_trans.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const models = require("../models/models");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");
function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

const router = express.Router();

module.exports = router;
