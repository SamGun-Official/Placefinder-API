const self = require('../controllers/usage.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const db = require('../config/sequelize');
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key";

//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const Accomodation = require('../models/accomodation');
const H_trans = require('../models/h_trans');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');

const router = express.Router();

//middleware :
function authenticate(role,message="Unauthorized"){

    return (req,res,next)=>{
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).send("Unauthorized");
        }
        const payload = jwt.verify(token,JWT_KEY);

        console.log(payload.role)
        if(role == "ALL" || role == payload.role){
            req.body = {...req.body,...payload};
            next();
        }
        else {
            return res.status(401).send(message);
        }
    }
}


function formatRupiah(amount){
    let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    return formattedAmount
}


router.get('/developer/total',[authenticate(1,"role tidak sesuai")], async function (req,res) {

    const status = req.query.status;
    //hanya ada paid dan unpaid 
    const username = req.body.username;
    const user = await User.findOne({
        where:{
            username: username
        }
    });

    if(!status){
        const usages = await self.getAllUserUsage(user.id);
        const subtotal = await self.getUsageTotal(user.id);
        return res.status(200).send({
            subtotal: subtotal,
            usages: usages
        });
    }else{
        const validator = Joi.string().valid('paid','unpaid');
        const validate = validator.validate(status);

        if(validate.error){
            return res.status(400).send({
                message: validate.error.message.toString()
            });
        }

        if(status=="paid"){
            const usages = await self.getUsagePaid(user.id);
            const subtotal = await self.getUsageTotalPaid(user.id);
            const result_usages =[];
            for(let i=0;i<usages.length;i++){
                result_usages.push(usages[i]);
            }
            
            if(result_usages.length>0){
                return res.status(200).send({
                    subtotal: formatRupiah(subtotal),
                    usages: result_usages
                });
            }else{
                return res.status(200).send({
                    subtotal: formatRupiah(0),
                    usages: result_usages
                });
            }
        }else if(status=="unpaid"){
            const usages = await self.getUsageUnpaid(user.id);
            const subtotal = await self.getUsageTotalUnpaid(user.id);
            const result_usages =[];
            for(let i=0;i<usages.length;i++){
                result_usages.push(usages[i]);
            }
            
            if(result_usages.length>0){
                return res.status(200).send({
                    subtotal: formatRupiah(subtotal),
                    usages: result_usages
                });
            }else{
                return res.status(200).send({
                    subtotal: formatRupiah(0),
                    usages: result_usages
                });
            }
        }
    }
});

//get specify usage 
router.get('/developer/:id?',[authenticate(1,"role tidak sesuai")], async function (req,res){
    const id = req.params.id;
    const username = req.body.username;

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    if(!id){
        const usages = await self.getAllUserUsage(user.id);
        return res.status(200).send({
            usages: usages
        });
    }else{
        const usage= await self.getUsageById(id, user.id);
        if(usage){
            return res.status(200).send({
                usage: usage
            });
        }else{
            return res.status(404).send({
                message: "tidak ada hasil pencarian"
            });
        }
        
    }
});

module.exports = router;