const self = require("../controllers/user.controller");
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
//Models:
const notification = require("../models/notification");
const accomodation = require("../models/accomodation");
const h_trans = require("../models/h_trans");
const d_trans = require("../models/d_trans");
const pricelist = require("../models/pricelist");
const usage = require("../models/usage");
const User = require("../models/user");
const router = express.Router();

//npx sequelize-cli db:migrate:undo:all
//npx sequelize-cli db:migrate
//npx sequelize-cli db:seed:all

const ROLE = ["Admin","Developer","Penyedia tempat tinggal"];
router.post("/login", async function (req, res) {
    let { username, password } = req.body;
    const schema = Joi.object({
        username: Joi.string()
          .required()
          .external(async function () {
            let user_with_username = await User.findOne({
              where: {
                username: {
                  [Op.eq]: username,
                },
              },
            });
            if (user_with_username == null) {
              throw Error("Username tidak ditemukan");
            }
            if(user_with_username.password != password){
                throw Error("Password salah");
            }
          }),
        password: Joi.string().min(6).required(),
    });    
    try {
        await schema.validateAsync(req.body);
        let user = await self.login(req, res);
        if (user) {
          return res.status(201).send({message:"Berhasil login!",user:{
            username:user.username,
            email:user.email,
            role:ROLE[user.role],
            token:user.token
          }});
        }

        return res.status(400).send({
          message: "Gagal login!",
        });
      } catch (e) {
        return res.status(400).send({
          message: e.message,
        });
    }
});
router.post("/register", async function (req, res) {
  let { username, password, email, role, phone_number, tanggal_lahir, id_card_number } = req.body;
  //JOI validations
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .external(async function () {
        let user_with_username = await User.findOne({
          where: {
            username: {
              [Op.eq]: username,
            },
          },
        });
        if (user_with_username != null) {
          throw Error("Username harus unik");
        }
      }),
    password: Joi.string().min(6).required(),
    email: Joi.string()
      .email()
      .required()
      .external(async function () {
        let user_with_email = await User.findOne({
          where: {
            email: {
              [Op.eq]: email,
            },
          },
        });
        if (user_with_email != null) {
          throw Error("Email harus unik");
        }
      }),
    role: Joi.number().valid(2, 3).required(),
    phone_number: Joi.string().pattern(new RegExp("^[0-9]{10,12}$")).required(),
    tanggal_lahir: Joi.date().max("now").required().format("DD/MM/YYYY"),
    id_card_number: Joi.string()
      .pattern(new RegExp("^[0-9]{14}$"))
      .required()
      .external(async function () {
        let user_with_id_card_number = await User.findOne({
          where: {
            id_card_number: {
              [Op.eq]: id_card_number,
            },
          },
        });
        if (user_with_id_card_number != null) {
          throw Error("ID card number harus unik");
        }
      }),
  });

  try {
    await schema.validateAsync(req.body);
    let registerResult = await self.register(req, res);
    if (registerResult) {
      return res.status(201).send({ message: "Berhasil register!" });
    }
    return res.status(400).send({
      message: "Gagal register!",
    });
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
});

module.exports = router;
