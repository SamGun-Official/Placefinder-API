const self = require('../controllers/user.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

//Models:
const transaction = require('../models/transaction');
const notification = require('../models/notification');
const accomodation = require('../models/accomodation');

const router = express.Router();