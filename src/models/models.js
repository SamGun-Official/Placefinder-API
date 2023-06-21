const database = require("../config/sequelize");

let self = {};
self.User = require("./user")(database);
self.Accommodation = require("./accommodation")(database);
self.Notification = require("./notification")(database);
self.H_trans = require("./h_trans")(database);
self.D_trans = require("./d_trans")(database);
self.PriceList = require("./pricelist")(database);
self.Usage = require("./usage")(database);
self.NearbyList = require("./nearbylist")(database);

module.exports = self;
