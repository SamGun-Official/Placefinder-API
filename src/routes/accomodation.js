const self = require('../controllers/accomodation.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

//Models:
const user = require('../models/user');
const notification = require('../models/notification');
const transaction = require('../models/transaction');

const router = express.Router();