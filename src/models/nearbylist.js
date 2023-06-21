"use strict";

const { DataTypes, Model } = require("sequelize");
const User = require("./user");
const Accommodation = require("./accommodation");

module.exports = (sequelize) => {
	class NearbyList extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: "id_user",
			});

			this.belongsTo(models.Accommodation, {
				foreignKey: "id_accommodation",
			});
		}
	}

	NearbyList.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			id_user: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id",
				},
			},
			id_accommodation: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Accommodation,
					key: "id",
				},
			},
			center_coordinate: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize: sequelize,
			modelName: "NearbyList",
			tableName: "nearbylists",
			paranoid: true,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: "deleted_at",
		}
	);

	return NearbyList;
};
