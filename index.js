/* ===== SETUP ===== */
require("dotenv").config();

const database = require("./src/config/sequelize");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ===== ORM ===== */
const User = require("./src/models/user")(database);
const Accomodation = require("./src/models/accomodation")(database);
const Notification = require("./src/models/notification")(database);
const H_trans = require("./src/models/h_trans")(database);
const D_trans = require("./src/models/d_trans")(database);
const PriceList = require("./src/models/pricelist")(database);
const Usage = require("./src/models/usage")(database);

User.associate({ Notification, Accomodation, H_trans, Usage });
Accomodation.associate({ Notification, User });
Notification.associate({ User, Accomodation });
H_trans.associate({ User, D_trans });
D_trans.associate({ H_trans, Usage });
PriceList.associate({ Usage });
Usage.associate({ D_trans, PriceList, User });

/* ===== ROUTES ===== */
const users = require("./src/routes/user");
const accomodations = require("./src/routes/accomodation");
const notifications = require("./src/routes/notification");
const h_trans = require("./src/routes/h_trans");
const d_trans = require("./src/routes/d_trans");
const pricelists = require("./src/routes/pricelist");
const usage = require("./src/routes/usage");

app.use(process.env.BASE_URL + "/api/users", users);
app.use(process.env.BASE_URL + "/api/accomodations", accomodations);
app.use(process.env.BASE_URL + "/api/notifications", notifications);
app.use(process.env.BASE_URL + "/api/transactions", h_trans);
app.use(process.env.BASE_URL + "/api/d_trans", d_trans);
app.use(process.env.BASE_URL + "/api/pricelists", pricelists);
app.use(process.env.BASE_URL + "/api/usages", usage);

app.get(process.env.BASE_URL, (req, res) => {
	return res.status(200).send({
		message: "This request has been made successfully!",
	});
});

/* ===== DEFAULT ===== */
const port = 3000;
app.listen(port, function () {
	console.log(`Connected! Server running on http://localhost:${port}`);
});

module.exports = app;
