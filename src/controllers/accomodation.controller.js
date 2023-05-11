const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const User = require('../models/user');
const Notification = require('../models/notification');
const D_trans = require('../models/d_trans');
const H_trans = require('../models/h_trans');
const Accomodation = require('../models/accomodation');

const {Op} = require('sequelize');
let self = {};  
self.getAll = async (req, res) => {
    let accomodations = await Accomodation.findAll();
    return accomodations;
}
self.getByName = async (id)=>{}
self.getByAddress = async (id)=>{}
self.delete = async (req, res) => {}
self.deleteAll = async (req, res) => {}
module.exports = self;