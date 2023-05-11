const self = require('../controllers/notification.controller');
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));
const db = require('../config/sequelize');

//Models:
const user = require('../models/user');
const accomodation = require('../models/accomodation');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const pricelist = require('../models/pricelist');
const usage = require('../models/usage');
const notification = require('../models/notification');
const User = require('../models/user');
const Accomodation = require('../models/accomodation');

const router = express.Router();

//endpoints for admin:
router.post('/admin/create', async function (req,res){
   const description = req.body.description;
   const id_user = req.body.id_user;
   const id_accomodation = req.body.id_accomodation;

   const validator = Joi.object({
        description: Joi.string().required().messages({
            "any.required": "{{#label}} harus diisi",
          }),
        id_user: Joi.number().min(1).required().external(
            async function (){
                let[result, metadata] = await db.sequelize.query("SELECT * FROM USERS WHERE id = ?", {
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
           let[result, metadata] = await db.sequelize.query("SELECT * FROM ACCOMODATIONS where id = ?", {
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

    const user = await User.findByPk(id_user,{
        attributes: ['id', 'username'],
    });
    
    if(user.role==1){
        return res.status(400).send({
            message: "role hanya bisa penyedia tempat tinggal dan developer!"
        });
    }
    
   
    const insert_new_notification = await self.post(description, id_user, id_accomodation); 
    if(insert_new_notification=="success"){
        return res.status(200).send({
            message: `berhasil membuat notifikasi untuk ${user.username}`,
            description: description,
            id_user: id_user,
            id_accomodation: id_accomodation
        });
    }else{
        return res.status(500).send({
            message: insert_new_notification
        });
    }
});

router.get('/admin', async function (req,res){
    let notifications = await self.getAll();
    const notif_result = notifications.map(p=>({
        id: p.id,
        user: {
            id: p.id_user,
            username: p.username
        },
        message: p.description,
        accomodation:{
            id: p.id_accomodation,
            name: p.name
        }
    }));
    return res.status(200).send({
        notification: notif_result
    });
});

//get by id 
router.get('/admin/:id?', async function (req,res){
   const id = req.params.id;
   let notification = await self.get(id);
   const notif_result = {
    id: notification.id,
    user:{
        id: notification.id_user,
        username: notification.username
    },
    message: notification.description,
    accomodation:{
        id: notification.id,
        name: notification.name
    }
   }
   return res.status(200).send({
    notification: notif_result
   });
});

//get by id user 
router.get('/admin/user/:id_user?', async function (req,res){
    const id_user = req.params.id_user;
    let notifs = await self.getByUser(id_user);
    const notif_result = [];
    for(let i=0;i<notifs.length;i++){
        notif_result.push({
            id: notifs[i].id,
            user:{
                id: notifs[i].id_user,
                username: notifs[i].username
            },
            message: notifs[i].description,
            accomodation:{
                id: notifs[i].id,
                name: notifs[i].name
            }
           });
    }
    return res.status(200).send({
        notification: notif_result
    });
});

//untuk penyedia tempat tinggal
router.get('/provider', async function(req,res){
    
});

module.exports = router;