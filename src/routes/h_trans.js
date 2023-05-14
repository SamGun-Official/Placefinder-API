const self = require('../controllers/h_trans.controller');
const dtransController = require('../controllers/d_trans.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const db = require('../config/sequelize');
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";


//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const Accomodation = require('../models/accomodation');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');
const Usage = require('../models/usage');

const router = express.Router();

//middleware :
function authenticate(role, message = "Unauthorized") {

    return (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        const payload = jwt.verify(token, JWT_KEY);

        console.log(payload.role)
        if (role == "ALL" || role == payload.role) {
            req.body = { ...req.body, ...payload };
            next();
        }
        else {
            return res.status(401).send(message);
        }
    }
}

function formatRupiah(amount) {
    let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    return formattedAmount
}


router.get('/developer', [authenticate(1,"role tidak sesuai")],async function (req,res){
   const username = req.body.username;
   const user = await User.findOne({
    where:{
        username: {
            [Op.eq]: username
        }
    }
    }); 
    console.log("=======================");
    console.log(user);
    const htrans = await self.getByIdUser(user.id);
    return res.status(200).send(htrans);
});


module.exports = router;