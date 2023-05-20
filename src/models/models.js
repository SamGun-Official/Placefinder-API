const database = require("../config/sequelize");

let self = {};
self.User = require("../models/user")(database);
self.Accomodation = require("../models/accomodation")(database);
self.Notification = require("../models/notification")(database);
self.H_trans = require("../models/h_trans")(database);
self.D_trans = require("../models/d_trans")(database);
self.PriceList = require("../models/pricelist")(database);
self.Usage = require("../models/usage")(database);

module.exports = self;
