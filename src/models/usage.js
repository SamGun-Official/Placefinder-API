"use strict";

const { DataTypes, Model } = require("sequelize");
const PriceList = require("./pricelist");
const User = require("./user");

module.exports = (sequelize) => {
	class Usage extends Model {
		static associate(models) {
			this.hasOne(models.D_trans, {
				foreignKey: "id_usage",
			});

			this.belongsTo(models.PriceList, {
				foreignKey: "id_pricelist",
			});

			this.belongsTo(models.User, {
				foreignKey: "id_user",
			});
		}
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
				references: {
					model: PriceList,
					key: "id",
				},
			},
			id_user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id",
				},
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			subtotal: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize: sequelize,
			modelName: "Usage",
			tableName: "usages",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return Usage;
};
