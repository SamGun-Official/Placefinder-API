const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//models
const H_trans = require('../models/h_trans');
const User = require('../models/user');
const D_trans = require('../models/d_trans');
const Accomodation = require('../models/accomodation');
const Notification = require('../models/notification');
const Usage = require('../models/usage');

const {Op} = require('sequelize');
const PriceList = require("../models/pricelist");
let self = {};

self.get = async()=>{

}

self.getById = async() =>{

}

self.getByIdUser = async(id_user) =>{
    let h_trans = await H_trans.findAll({
        attributes: [],
        include: []
    });
    
}


module.exports = self;