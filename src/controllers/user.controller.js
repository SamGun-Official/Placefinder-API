const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const transaction = require('../models/transaction');
const notification = require('../models/notification');
const accomodation = require('../models/accomodation');

const {Op} = require('sequelize');
let self = {};

self.getAll = async (req, res) => {}
self.get = async (id)=>{}
self.delete = async (req, res) => {}
self.deleteAll = async (req, res) => {}
module.exports = self;