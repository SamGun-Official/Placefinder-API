const self = require('../controllers/accomodation.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key";

const auth = require('../controllers/auth.controller');

//Models:
const User = require('../models/user');
const Notification = require('../models/notification');
const H_trans = require('../models/h_trans');
const D_trans = require('../models/d_trans');
const Pricelist = require('../models/pricelist');
const Usage = require('../models/usage');
const Accomodation = require('../models/accomodation');

const router = express.Router();

async function checkAccomodationExistById(id) {
    if (await Accomodation.findByPk(id)) {
        return true;
    }
    throw Error('ID Accomodation not found!');
}

router.get('/', async function (req, res) {
    let accomodations = await self.getAll();
    return res.status(200).send(accomodations);
});

router.get('/admin/search', auth.authenticate(["admin"]), async function (req, res) {
    let { id, name, address } = req.query;
    if (id) {
        const schema = Joi.object({
            id: Joi.number().external(checkAccomodationExistById)
        })
        try {
            await schema.validateAsync({ id });
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