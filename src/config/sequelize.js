const Sequelize = require('sequelize');
const db = {}
const sequelize = new Sequelize(
    'project_web_service',
    'root',
    '',
    {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        logging: console.log,
        timezone: '+07:00',
    }
)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db