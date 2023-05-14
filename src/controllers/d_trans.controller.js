const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//models
const User = require('../models/user');
const H_trans = require('../models/h_trans');
const Accomodation = require('../models/accomodation');
const Notification = require('../models/notification');
const Usage = require('../models/usage');
const PriceList = require("../models/pricelist");
const D_trans = require("../models/d_trans");


const {Op} = require('sequelize');
let self = {};

self.getDtrans = async(id_htrans)=>{
    let d_trans = await D_trans.findAll({
        where:{
            id_htrans:{
                [Op.eq]: id_htrans
            }
        }
    });
    return d_trans;
}

module.exports = self;