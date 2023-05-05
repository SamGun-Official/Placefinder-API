const self = require('../controllers/pricelist.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

//Models:
const user = require('../models/user');
const notification = require('../models/notification');
const accomodation = require('../models/accomodation');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const usage = require('../models/usage');

const router = express.Router();