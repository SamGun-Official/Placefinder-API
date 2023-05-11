const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes:
const users = require("./src/routes/user");
const accomodations = require("./src/routes/accomodation");
const notifications = require("./src/routes/notification");
const h_trans = require("./src/routes/h_trans");
const d_trans =require("./src/routes/d_trans");
const pricelist = require("./src/routes/pricelist");
const usage = require("./src/routes/usage");

//models:
const User = require('./src/models/user');
const Accomodation = require('./src/models/accomodation');
const Notification = require('./src/models/notification');
const H_trans =  require('./src/models/h_trans');
const D_trans =  require('./src/models/d_trans');
const Pricelist = require('./src/models/pricelist');
const Usage =  require('./src/models/usage');

User.associate(Notification);
Notification.associate(User);

Notification.associate(Accomodation);
Accomodation.associate(Notification);

User.associate(Accomodation);
Accomodation.associate(User);

User.associate(H_trans);
H_trans.associate(User);

H_trans.associate(D_trans);
D_trans.associate(H_trans);

D_trans.associate(Usage);
Usage.associate(D_trans);

Usage.associate(Pricelist);
Pricelist.associate(Usage);


app.use("/api/users", users);
app.use("/api/accomodations", accomodations);
app.use("/api/notifications", notifications);
app.use("/api/h_trans", h_trans);
app.use("/api/d_trans", d_trans);
app.use("/api/pricelist", pricelist);
app.use("/api/usage", usage);

const port = 3000;
app.listen(port, function (){
   console.log(`Listening on port ${3000}`); 
});


module.exports = app;