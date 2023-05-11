const self = require('../controllers/accomodation.controller');
const { response } = require("express");
const express = require("express");
const { Op, DATE } = require("sequelize");

//Models:
const user = require('../models/user');
const notification = require('../models/notification');
const h_trans = require('../models/h_trans');
const d_trans = require('../models/d_trans');
const pricelist = require('../models/pricelist');
const usage = require('../models/usage');

const router = express.Router();


router.get('/', async function (req,res){
   let accomodations=  await self.getAll();
   return res.status(200).send(accomodations); 
});

router.get('/accomodations', async function (req, res) {
    let { id, name, address } = req.query;
    if (id) {
        let accomodation = await self.getAccomodationsById(id);
        return res.status(200).send({
            accomodation
        });
    }
});



module.exports = router;