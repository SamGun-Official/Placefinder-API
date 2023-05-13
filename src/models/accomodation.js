const { Model, DataTypes, Op } = require("sequelize");
const User = require("./user");
const db = require("../config/sequelize");
const sequelize = db.sequelize;

class Accomodation extends Model {
	static associate(models) {
		this.belongsTo(models.User, {
			foreignKey: "owner",
		});

		this.hasMany(models.Notification, {
			foreignKey: "id_accomodation",
		});
	}

	// static associate(User) {
	// 	Accomodation.hasMany(User, {
	// 		foreignKey: "owner",
	// 	});
	// }

	// static associate(Notification) {
	// 	Accomodation.hasMany(Notification, {
	// 		foreignKey: "id_accomodation",
	// 	});
	// }
}
Accomodation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
		},
		owner: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			references: {
				model: User,
				key: "id",
			},
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			primaryKey: false,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: false,
		},
		coordinate: {
			type: DataTypes.STRING,
			allowNull: true,
			primaryKey: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			defaultValue: 1,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
			primaryKey: false,
		},
		capacity: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: false,
		},
		area: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: false,
		},
	},
	{
		sequelize,
		modelName: "Accomodation",
		tableName: "accomodations",
		paranoid: false,
		underscored: false,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);
module.exports = Accomodation;
