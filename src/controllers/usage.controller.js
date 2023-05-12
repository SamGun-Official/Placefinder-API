const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//models
const User = require('../models/user');
const H_trans = require('../models/h_trans');
const D_trans = require('../models/d_trans');
const Accomodation = require('../models/accomodation');
const Notification = require('../models/notification');
const Usage = require('../models/usage');

const {Op} = require('sequelize');
let self = {};


self.getAllUserUsage = async(id)=>{
    let usages = Usage.findAll({
      where:{
        id_user: id
      }
    });

    return usages;
}


self.getUsageTotal = async(id)=>{
    
}


module.exports = self;