const self = require('../controllers/d_trans.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require('../controllers/auth.controller');

//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const Accomodation = require('../models/accomodation');
const H_trans = require('../models/h_trans');
const Pricelist = require('../models/pricelist');
const Usage = require('../models/usage');

const router = express.Router();

function formatRupiah(amount){
    let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    return formattedAmount
}



module.exports = router;