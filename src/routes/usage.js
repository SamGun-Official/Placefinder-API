const self = require('../controllers/usage.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const db = require('../config/sequelize');


//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const Accomodation = require('../models/accomodation');
const H_trans = require('../models/h_trans');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');

const router = express.Router();

router.get('/developer', async function (req,res){
    
});

module.exports = router;