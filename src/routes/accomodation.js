const self = require('../controllers/accomodation.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key";

//Models:
const user = require('../models/user');
const notification = require('../models/notification');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const pricelist = require('../models/pricelist');
const usage = require('../models/usage');
const Accomodation = require('../models/accomodation');

const router = express.Router();

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

router.get('/search', async function (req, res) {
    let { id, name, address } = req.query;
    if (id) {
        const schema_id = Joi.object({
            id: Joi.number().external(isAccomodationExistById)
        })
        try {
            await schema_id.validateAsync({ id });
            let accomodation = await Accomodation.findByPk(id);
            return res.status(200).send(accomodation);
        } catch (e) {
            return res.status(404).send({ message: e.message });
        }
    }
    else if (name) {
        let accomodations = await Accomodation.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
        return res.status(200).send(accomodations);
    }
    else if (address) {
        let accomodations = await Accomodation.findAll({
            where: {
                address: {
                    [Op.like]: `%${address}%`
                }
            }
        });
        return res.status(200).send(accomodations);
    }
    return res.status(400).send({ message: "Wrong Input!" });
});



module.exports = router;