const { Model, DataTypes, Op } = require("sequelize");
const Accomodation = require("./accomodation");
const User = require("./user");
const H_trans = require("./h_trans");
const db = require("../config/sequelize");
const sequelize = db.sequelize;

class PriceList extends Model {
	//association
	static associate(models) {
		this.hasOne(models.Usage, {
			foreignKey: "id_pricelist",
		});
	}
	// static associate(Usage) {
	// 	PriceList.hasOne(Usage, {
	// 		foreignKey: "id_pricelist",
	// 	});
	// }
}

PriceList.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		feature_name: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
		},
		url_endpoint: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
		},
	},
	{
		sequelize,
		modelName: "Pricelist",
		tableName: "pricelists",
		paranoid: false,
		underscored: false,
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

module.exports = PriceList;
