const express = require("express");
const { Op } = require("sequelize");
const models = require("../models/models");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("public"));

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const moment = require("moment");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "./uploads",
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype != "image/png") {
      return cb(new Error("Wrong file type"), null);
    }
    cb(null, true);
  },
});

let self = {};
self.getAll = async (name) => {
  let users = await models.User.findAll({
    where: {
      name: {
        [Op.substring]: name,
      },
    },
    attributes: {
      exclude: ["password"],
    },
  });
  return users;
};
self.getById = async (id) => {
  let user = await models.User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });
  return user;
};
self.get = async (id) => {};
self.login = async (req, res) => {
  let { username, password } = req.body;
  let user = await models.User.findOne({
    where: {
      username: username,
    },
  });
  return user;
};
self.register = async (req, res) => {
  let { username, password, name, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;

  // Sign
  let token = jwt.sign(
    {
      username: username,
      role: role,
    },
    JWT_KEY
  );

  const newUser = await models.User.create(
    {
      username: username,
      password: password,
      name: name,
      role: role,
      email: email,
      phone_number: phone_number,
      tanggal_lahir: moment(tanggal_lahir, "DD/MM/YYYY").format("YYYY-MM-DD"),
      id_card_number: id_card_number,
      is_id_card_verified: 0,
      token: token,
    }
  );

  if (newUser) {
    newUser.password = undefined;
    return newUser;
  }

  return false;
};

self.edit = async (id, req) => {
  let { username, password, name, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;
  let user = await models.User.findOne({
    where: {
      id: id,
    },
  });

  // user.username = username || user.username;
  user.password = password || user.password;
  user.name = name || user.name;
  user.email = email || user.email;
  // user.role = role || user.role;
  user.phone_number = phone_number || user.phone_number;
  user.tanggal_lahir = tanggal_lahir || user.tanggal_lahir;
  user.id_card_number = id_card_number || user.id_card_number;

  const updatedUser = await user.save();

  return updatedUser;
};
self.delete = async (req, res) => {};
self.deleteAll = async (req, res) => {};
self.verify = async (id, req, res) => {
  const uploadFunc = upload.single("pp");
  uploadFunc(req, res, async function (err) {
    if (err) {
      return err;
    }
    let user = await models.User.findOne({
      where: {
        id: id,
      },
    });
    
    const fileExtension = path.extname(req.file.originalname);
    const newFilename = `${user.username}${fileExtension}`;
    fs.renameSync(`./uploads/${req.file.filename}`, `./uploads/${newFilename}`);
    return true;
  });
  return true;
};
self.getByUsername = async (username) => {
  let user = await models.User.findOne({
    where: {
      username: username,
    },
  });
  return user;
};

self.updateUserConfirm = async(username) =>{
  await User.update({
    is_id_card_verified: 1
  },{
    where:{
      username: username
    }
  });
}


module.exports = self;
