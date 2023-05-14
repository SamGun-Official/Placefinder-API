const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const User = require('../models/user');
const Notification = require('../models/notification');
const D_trans = require('../models/d_trans');
const H_trans = require('../models/h_trans');
const Accomodation = require('../models/accomodation');
const Pricelist = require('../models/pricelist');

const { Op } = require('sequelize');
let self = {};
self.addPricelist = async (feature_name, url_endpoint, price) => {
    return await Pricelist.create({
        feature_name: feature_name,
        url_endpoint: url_endpoint,
        price: price,
        status: 1
    });
}
self.updatePricelist = async (id, feature_name, url_endpoint, price) => {
    let pricelist = await Pricelist.findByPk(id);
    pricelist.feature_name = feature_name || pricelist.feature_name;
    pricelist.url_endpoint = url_endpoint || pricelist.url_endpoint;
    pricelist.price = price || pricelist.price;
    await pricelist.save();
    return pricelist;
}

module.exports = self;