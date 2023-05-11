const self = require('../controllers/accomodation.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");
const Joi = require("joi").extend(require("@joi/date"));

//Models:
const user = require('../models/user');
const notification = require('../models/notification');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const pricelist = require('../models/pricelist');
const usage = require('../models/usage');

const router = express.Router();

async function isAccomodationExistById(id){
    if(Accomodation.findByPk(id)){
        return true;
    }
    throw Error('Accomodation not found!');
}

router.get('/accomodations', async function (req, res) {
    let { id, name, address } = req.query;
    if (id) {
        const schema = Joi.object({
            id: Joi.number().external(isAccomodationExistById)
        })
        let accomodation = await self.getAccomodationsById(id);
        return res.status(200).send({
            accomodation
        });
    }
});

module.exports = router;