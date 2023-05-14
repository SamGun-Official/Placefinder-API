const self = require('../controllers/accomodation.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key";

//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const H_trans = require('../models/h_trans');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');
const Usage = require('../models/usage');
const Accomodation = require('../models/accomodation');

const router = express.Router();

let payload;
const ROLE = ["Admin", "Developer", "Penyedia tempat tinggal"];
function authenticate(role, message = "Unauthorized") {
    return (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).send(message);
        }
        payload = jwt.verify(token, JWT_KEY);

        if(role == "ALL" || role == payload.role){
            next();
        } else {
            return res.status(401).send(message);
        }
    };
}

async function isAccomodationExistById(id) {
    if (await Accomodation.findByPk(id)) {
        return true;
    }
    throw Error('ID Accomodation not found!');
}

router.get('/', async function (req, res) {
    let accomodations = await self.getAll();
    return res.status(200).send(accomodations);
});

router.get('/search', authenticate(0), async function (req, res) {
    let { id, name, address } = req.query;
    if (id) {
        const schema_id = Joi.object({
            id: Joi.number().external(isAccomodationExistById)
        })
        try {
            await schema_id.validateAsync({ id });
            return res.status(200).send(await self.getAccomodationById(id));
        } catch (e) {
            return res.status(404).send({ message: e.message });
        }
    }
    else if (name) {
        return res.status(200).send(await self.getAccomodationsByName(name));
    }
    else if (address) {
        return res.status(200).send(await self.getAccomoddationsByAddress(address));
    }
    return res.status(400).send({ message: "Please fill field id or name or address!" });
});

module.exports = router;