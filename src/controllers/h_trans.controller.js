const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//models
const H_trans = require('../models/h_trans');
const User = require('../models/user');
const D_trans = require('../models/d_trans');
const Accomodation = require('../models/accomodation');
const Notification = require('../models/notification');
const Usage = require('../models/usage');
const PriceList = require("../models/pricelist");

const dtransController = require('../controllers/d_trans.controller');

const {Op} = require('sequelize');
let self = {};

function formattedStringDate(ts){

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    
    return(year + "-" + month + "-" + date);
}


function formatRupiah(amount){
    let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    return formattedAmount
}

const PAYMENT_STATUS = {
    0: "unpaid",
    1: "pending",
    2: "verified",
    3: "failed"
}

self.get = async()=>{

}

self.getById = async() =>{

}

self.getByIdUser = async(id_user) =>{
    let h_trans = await H_trans.findAll({
        attributes: ['id', 'number', 'id_user', 'date', 'total', 'payment_status', 'status'],
        include: [
            {
                model: User,
                attributes: ['id', 'username','phone_number','email', 'name']
            }
        ]
    });

    //nb: total dihitung lagi karena di table itu berbeda
    let result_htrans = [];
    for(let i=0;i<h_trans.length;i++){    
        if(h_trans[i].id_user==id_user){
        let d_trans  = await dtransController.getDtrans(h_trans[i].id);
        result_htrans.push({
            id: h_trans[i].id,
            number: h_trans[i].number,
            user:{
                id: h_trans[i].User.id,
                username: h_trans[i].User.username,
                name: h_trans[i].User.name,
                email: h_trans[i].User.email,
                phone_number: h_trans[i].User.phone_number
            },
            transaction_date: formattedStringDate(h_trans[i].date),
            total: formatRupiah(h_trans[i].total),
            payment_status: PAYMENT_STATUS[h_trans[i].payment_status],
            transaction_detail: d_trans
        });
        }
    }
    return result_htrans;
}


module.exports = self;