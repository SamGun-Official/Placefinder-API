const self = require('../controllers/usage.controller');
const {response} = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const db = require('../config/sequelize');
const Joi = require("joi").extend(require("@joi/date"));


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
        const payload = jwt.verify(token,AUTHTOKEN);

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


router.get('/developer',[authenticate(1,"role tidak sesuai")], async function (req,res){
    const username = req.body.username;

    const user = await User.findOne({
        where: {
            username: username
        }
    });

    const usages = await self.getAllUserUsage(user.id);

    return res.status(200).send({
        usages: usages
    });
});

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
        const result_usages =[];
        for(let i=0;i<usages.length;i++){
            result_usages.push(usages[i]);
        }
        
        return res.status(200).send({
            subtotal: subtotal,
            usages: result_usages
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
            
        }else if(status=="unpaid"){
            
        }
    }

});

module.exports = router;