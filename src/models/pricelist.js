"use strict";

const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PriceList extends Model {
		static associate(models) {
			this.hasOne(models.Usage, {
				foreignKey: "id_pricelist",
			});
		}
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
			},
			url_endpoint: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
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
			modelName: "Pricelist",
			tableName: "pricelists",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return PriceList;
};
