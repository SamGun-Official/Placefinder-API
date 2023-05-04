const express = require("express");
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes:
const users = require("./src/routes/user");
const transactions = require("./src/routes/transaction");
const accomodations = require("./src/routes/accomodation");
const notifications = require("./src/routes/notification");

//models:
const User = require('./src/models/user');
const Transaction = require('./src/models/transaction');
const Accomodation = require('./src/models/accomodation');
const Notification = require('./src/models/notification');

app.use("/users", users);
app.use("/transactions", transactions);
app.use("/accomodations", accomodations);
app.use("/notifications", notifications);

const port = 3000;
app.listen(port, function (){
   console.log(`Listening on port ${3000}`); 
});

module.exports = app;