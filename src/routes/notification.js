const self = require('../controllers/notification.controller');
const {response} = require("express");
const { query } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

//Models:
const user = require('../models/user');
const accomodation = require('../models/accomodation');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const pricelist = require('../models/pricelist');
const usage = require('../models/usage');
const notification = require('../models/notification');
const sequelize = require('../config/sequelize');
const User = require('../models/user');
const Accomodation = require('../models/accomodation');

const router = express.Router();

router.post('/create', async function (req,res){
   const description = req.body.description;
   const id_user = req.body.id_user;
   const id_accomodation = req.body.id_accomodation;

   const validator = Joi.object({
        description: Joi.string().required().messages({
            "any.required": "{{#label}} harus diisi",
          }),
        id_user: Joi.number().min(1).required().external(
            async function (){
                let[result, metadata] = await sequelize.query("SELECT * FROM  USERS WHERE id = ?", {
                    replacements:[id_user]
                });  
                if(result.length<=0){
                    throw Error("id user tidak ditemukan!");
                }             
            }
            
        ).messages({
          "any.required": "{{#label}} harus diisi",
          "number.min": "{{#label}} minimal 1",
        }),
        id_accomodation: Joi.number().min(1).required().external(
            async function () {
           let[result, metadata] = await sequelize.query("SELECT * FROM ACCOMODATIONS where id = ?", {
            replacements: [id_accomodation]
           });
           if(result.length<=0){
            throw Error("id accomodation tidak ditemukan")
           }
        }).messages({
            "any.required": "{{#label}} harus diisi",
            "number.min": "{{#label}} minimal 1",
          }),
    });

    try{
        await validator.validateAsync(req.body);
    }catch(e){
        return res.status(400).send({
            message: e.message.toString().replace(/['"]/g, '')
        });
    }

    const user = await User.findByPk(id_user);
    const accomodation = await Accomodation.findByPk(id_accomodation);
    
    await Accomodation.create({
        description: description,
        id_user: id_user,
        id_accomodation: id_accomodation,
    });

    return res.status(200).send({
        message: `berhasil membuat notifikasi untuk${user.username}`,
        description: description,
        id_user: id_user,
        id_accomodation: id_accomodation
    });
});

router.get('/', async function (req,res){
    let notifications = await self.getAll();
    const notif_result = notifications.map(p=>({
        id: p.id,
        user: {
            id: p.id_user,
            username: p.username
        },
        message: p.description,
    }));
    return res.status(200).send(notifications);
});


module.exports = router;