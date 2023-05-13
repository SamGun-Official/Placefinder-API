const { Model, DataTypes, Op } = require("sequelize");
const Accomodation = require("./accomodation");
const User = require("./user");
const H_trans = require("./h_trans");

const db = require("../config/sequelize");
const PriceList = require("./pricelist");
const sequelize = db.sequelize;

class Usage extends Model {
	//association
	static associate(models) {
		this.hasOne(models.D_trans, {
			foreignKey: "id_usage",
		});

		this.belongsTo(models.Pricelist, {
			foreignKey: "id_pricelist",
		});

		this.belongsTo(models.User, {
			foreignKey: "id_user",
		});
	}
	// static associate(D_trans) {
	// 	Usage.hasOne(D_trans, {
	// 		foreignKey: "id_usage",
	// 	});
	// }

	// static associate(PriceList) {
	// 	Usage.belongsTo(PriceList, {
	// 		foreignKey: "id_pricelist",
	// 	});
	// }

	// static associate(User) {
	// 	Usage.belongsTo(User, {
	// 		foreignKey: "id_user",
	// 	});
	// }
}

Usage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		id_pricelist: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
			references: {
				model: PriceList,
				key: "id",
			},
		},
		id_user: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
			references: {
				model: User,
				key: "id",
			},
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
			primaryKey: false,
			autoIncrement: false,
		},
		subtotal: {
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

module.exports = Usage;
