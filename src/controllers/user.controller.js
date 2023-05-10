const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const d_trans = require("../models/d_trans");
const h_trans = require("../models/d_trans");
const notification = require("../models/notification");
const accomodation = require("../models/accomodation");

const { Op } = require("sequelize");
const User = require("../models/user");
const moment = require("moment");
let self = {};

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

self.getAll = async (req, res) => {};
self.get = async (id) => {};
self.login = async (req, res) => {
    let { username, password } = req.body;
    let user = await User.findOne({
        where: {
          username: username,
        },
    });
    return user;
};

self.register = async (req, res) => {
  let { username, password, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;

  //sign
  let token = jwt.sign(
    {
      username: username,
      role:role,
    },
    JWT_KEY
  );

  const newUser = User.create({
    username: username,
    password: password,
    role: role,
    saldo: 0,
    email: email,
    phone_number: phone_number,
    tanggal_lahir: moment(tanggal_lahir, "DD/MM/YYYY").format("YYYY-MM-DD"),
    id_card_number: id_card_number,
    is_id_card_verified: 0,
    token: token,
  });
  if (newUser) {
    return true;
  }
  return false;
};
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};
module.exports = self;
