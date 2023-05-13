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
    let usages = await Usage.findAll({
      where:{
        id_user: id
      }
    });

    return usages;
}


self.getUsageTotal = async(id)=>{
    let usages = await Usage.sum('subtotal', {
        where: {
            id_user: id,
        }
    });
    return usages;
}

self.getUsageTotalPaid = async(id) => {
    let usages = await Usage.sum('subtotal', {
        where: {
            id_user: id,
            status: 0
        }
    });
    return usages;
}

self.getUsageTotalUnpaid = async(id) => {
    let usages = await Usage.sum('subtotal', {
        where: {
            id_user: id,
            status: 1
        }
    });
    return usages;
}

self.getUsagePaid = async(id) =>{
    let usages = await Usage.findAll({
        where: {
            id_user: id,
            status: 0
        }
    },{

    });
    return usages;
}

self.getUsageUnpaid = async(id) => {
    let usages = await Usage.findAll({
        where: {
            id_user: id,
            status: 1
        }
    },{

    });
    return usages;
}

self.getUsageById = async(id, id_user)=>{
    let usage = await Usage.findOne({
        where: {
            id_user: id_user,
            id: id
        }
    });
    return usage;
}

module.exports = self;