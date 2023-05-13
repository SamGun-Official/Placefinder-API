const { Model, DataTypes, Op } = require("sequelize");
const Accomodation = require("../models/accomodation");
const User = require("../models/user");
const db = require("../config/sequelize");
const sequelize = db.sequelize;

class Notification extends Model {
	static associate(models) {
	  this.belongsTo(models.User,{
	    foreignKey: 'id_user'
	  });
	  this.belongsTo(models.Accomodation,{
	    foreignKey: 'id_accomodation'
	  });
	}
	// static associate(User){
	//   Notification.belongsTo(User,{
	//     foreignKey: 'id_user'
	//   });
	// }
	// static associate(Accomodation){
	//   Notification.belongsTo(Accomodation,{
	//     foreignKey: 'id_accomodation'
	//   });
	// }
}
Notification.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: false,
		},
		id_user: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			references: {
				model: User,
				key: "id",
			},
		},
		id_accomodation: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			references: {
				model: Accomodation,
				key: "id",
			},
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			defaultValue: 1,
		},
	},
	{
		sequelize,
		modelName: "Notification",
		tableName: "notifications",
		paranoid: false,
		underscored: false,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

module.exports = Notification;
