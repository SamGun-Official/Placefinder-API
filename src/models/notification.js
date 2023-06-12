"use strict";

const { DataTypes, Model } = require("sequelize");
const User = require("../models/user");
const Accommodation = require("./accommodation");

module.exports = (sequelize) => {
	class Notification extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: "id_user",
			});

			this.belongsTo(models.Accommodation, {
				foreignKey: "id_accommodation",
			});
		}
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
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			sequelize: sequelize,
			modelName: "Notification",
			tableName: "notifications",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return Notification;
};
