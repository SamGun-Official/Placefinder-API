const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//models
const user = require('../models/user');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const accomodation = require('../models/accomodation');
const notification = require('../models/notification');

const {Op} = require('sequelize');
let self = {};

self.post = async (description, id_user, id_accomodation) => {
    try{
        await notification.create({
            description: description,
            id_user: id_user,
            id_accomodation: id_accomodation,
        });
        return "success";
    }catch(e){
        return e.toString();
    }
}

self.getAll = async (req, res) => {
    let notifications = await notification.findAll({
        attributes: ['id', 'description', 'id_user', 'id_accomodation', 'status'],
        include: [
            {
                model: accomodation, 
                attributes: ['name', 'location', 'id']
            },
            {
                model: user,
                attributes: ['username']
            }
        ],
    });
    return notifications;
}
self.get = async (id)=>{
    let notif = await notification.findByPk(id,{
        attributes: ['id', 'description', 'id_user', 'id_accomodation', 'status'],
        include: [
            {
                model: accomodation, 
                attributes: ['name', 'location', 'id']
            },
            {
                model: user,
                attributes: ['username']
            }
        ],
    });
    return notif;
}

self.getByUser = async (id_user) =>{
    let notif = notification.findAll({
        where:{
            id_user:{
                [Op.eq]:id_user
            }
        }
    },{
        attributes: ['id', 'description', 'id_user', 'id_accomodation', 'status'],
        include: [
            {
                model: accomodation, 
                attributes: ['name', 'location', 'id']
            },
            {
                model: user,
                attributes: ['username']
            }
        ],
    });
    return notif;
}

self.delete = async (req, res) => {}
self.deleteAll = async (req, res) => {}
module.exports = self;