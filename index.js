/* ===== SETUP ===== */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* ===== ORM ===== */
const { User, Accommodation, Notification, H_trans, D_trans, PriceList, Usage } = require("./src/models/models");

User.associate({ Notification, Accommodation, H_trans, Usage });
Accommodation.associate({ Notification, User });
Notification.associate({ User, Accommodation });
H_trans.associate({ User, D_trans });
D_trans.associate({ H_trans, Usage });
PriceList.associate({ Usage });
Usage.associate({ D_trans, PriceList, User });

/* ===== ROUTES ===== */
const users = require("./src/routes/user");
const accommodations = require("./src/routes/accommodation");
const notifications = require("./src/routes/notification");
const h_trans = require("./src/routes/h_trans");
const d_trans = require("./src/routes/d_trans");
const pricelists = require("./src/routes/pricelist");
const usage = require("./src/routes/usage");

app.use(process.env.BASE_URL + "/api/users", users);
app.use(process.env.BASE_URL + "/api/accommodations", accommodations);
app.use(process.env.BASE_URL + "/api/notifications", notifications);
app.use(process.env.BASE_URL + "/api/transactions", h_trans);
app.use(process.env.BASE_URL + "/api/d_trans", d_trans);
app.use(process.env.BASE_URL + "/api/pricelists", pricelists);
app.use(process.env.BASE_URL + "/api/usages", usage);

app.get(process.env.BASE_URL, (req, res) => {
	return res.status(200).send({
		message: "This request has been made successfully!",
		url: {
			documentation: "-",
		},
		members: [
			{
				nrp: "220116905",
				name: "Angelita Jesslyn",
			},
			{
				nrp: "220116910",
				name: "Clarissa Gracienne",
			},
			{
				nrp: "220116923",
				name: "Jonathan Theja",
			},
			{
				nrp: "220116928",
				name: "Samuel Gunawan",
			},
		],
	});
});

/* ===== DEFAULT ===== */
const port = 3000;
app.listen(port, function () {
	console.log(`Connected! Server running on http://localhost:${port}`);
});

module.exports = app;
