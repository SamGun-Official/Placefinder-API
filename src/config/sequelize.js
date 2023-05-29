require("dotenv").config();

const sequelize = require("sequelize");
const connection = new sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOSTNAME,
	port: 3306,
	dialect: process.env.DB_DIALECT,
	dialectOptions: {
		dateStrings: true,
		typeCast: true,
	},
	define: {
		charset: "utf8mb4",
		collate: "utf8mb4_general_ci",
	},
	timezone: process.env.DB_TIMEZONE,
});

module.exports = connection;
