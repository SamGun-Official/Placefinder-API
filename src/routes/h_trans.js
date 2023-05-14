const self = require('../controllers/h_trans.controller');
const dtransController = require('../controllers/d_trans.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const db = require('../config/sequelize');
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_key";

const auth = require('../controllers/auth.controller');

//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const Accomodation = require('../models/accomodation');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');
const Usage = require('../models/usage');

const router = express.Router();

function formatRupiah(amount) {
    let formattedAmount = amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    return formattedAmount
}


router.get('/admin', [auth.authenticate("admin", "role tidak sesuai")], async function (req, res) {
    return res.status(200).send(await self.getAll());
});

router.get('/developer', [auth.authenticate("developer", "role tidak sesuai")], async function (req, res) {
    const username = req.body.username;
    const user = await User.findOne({
        where: {
            username: {
                [Op.eq]: username
            }
        }
    });

    if (!user) {
        return res.status(404).send({
            message: "username tidak terdaftar!"
        });
    }

    const htrans = await self.getByIdUser(user.id);
    if (htrans.length > 0) {
        return res.status(200).send(htrans);
    } else {
        return res.status(200).send({
            message: "belum ada transaksi"
        });
    }
});

router.get('/provider', [auth.authenticate("provider", "role tidak sesuai")], async function (req, res) {
    const username = req.body.username;
    const user = await User.findOne({
        where: {
            username: {
                [Op.eq]: username
            }
        }
    });

    if (!user) {
        return res.status(404).send({
            message: "username tidak terdaftar!"
        });
    }

    const htrans = await self.getByIdUser(user.id);
    if (htrans.length > 0) {
        return res.status(200).send(htrans);
    } else {
        return res.status(200).send({
            message: "belum ada transaksi"
        });
    }
});



module.exports = router;