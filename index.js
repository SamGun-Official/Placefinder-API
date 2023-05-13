/* ===== SETUP ===== */
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== ORM ===== */
const User = require("./src/models/user");
const Accomodation = require("./src/models/accomodation");
const Notification = require("./src/models/notification");
const H_trans = require("./src/models/h_trans");
const D_trans = require("./src/models/d_trans");
const Pricelist = require("./src/models/pricelist");
const Usage = require("./src/models/usage");

User.associate({ Notification, Accomodation, H_trans, Usage });
Accomodation.associate({ Notification, User });
Notification.associate({ User, Accomodation });
H_trans.associate({ User, D_trans });
D_trans.associate({ H_trans, Usage });
Pricelist.associate({ Usage });
Usage.associate({ D_trans, Pricelist, User });

/* ===== ROUTES ===== */
const users = require("./src/routes/user");
const accomodations = require("./src/routes/accomodation");
const notifications = require("./src/routes/notification");
const h_trans = require("./src/routes/h_trans");
const d_trans = require("./src/routes/d_trans");
const pricelists = require("./src/routes/pricelist");
const usage = require("./src/routes/usage");

app.use("/api/users", users);
app.use("/api/accomodations", accomodations);
app.use("/api/notifications", notifications);
app.use("/api/transactions", h_trans);
app.use("/api/d_trans", d_trans);
app.use("/api/pricelists", pricelists);
app.use("/api/usages", usage);

/* ===== DEFAULT ===== */
const port = 3000;
app.listen(port, function () {
	console.log(`Connected! Server running on http://localhost:${port}`);
});

module.exports = app;
