const database = require("../config/sequelize");
const self = require("../controllers/d_trans.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require("../controllers/auth.controller");

//Models:
const User = require("../models/user")(database);
const Accomodation = require("../models/accomodation")(database);
const Notification = require("../models/notification")(database);
const H_trans = require("../models/h_trans")(database);
const PriceList = require("../models/pricelist")(database);
const Usage = require("../models/usage")(database);

function formatRupiah(amount) {
	let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
	return formattedAmount;
}

const router = express.Router();

module.exports = router;
