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

self.getAll = async (name) => {
  let users = await User.findAll({
    where:{
      name:{
        [Op.substring]:name
      }
    }
  });
  return users;
};
self.getById = async (id) => {
  let user = await User.findByPk(id)
  return user;
};
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
  let { username, password,name,email, role, phone_number, tanggal_lahir, id_card_number } = req.body;

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
    name:name,
    role: role,
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
self.edit = async (id,req,res) => {
  let {username, password,name,email,role, phone_number, tanggal_lahir, id_card_number } = req.body;
  let user = await User.findOne({
      where: {
        id: id,
      },
  });

  user.username = username || user.username;
  user.password = password || user.password;
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.phone_number = phone_number || user.phone_number;
  user.tanggal_lahir = tanggal_lahir || user.tanggal_lahir;
  user.id_card_number = id_card_number || user.id_card_number;
  
  const updatedUser = await user.save();

  return updatedUser;
};
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};
module.exports = self;
