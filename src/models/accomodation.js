"use strict";

const { DataTypes, Model } = require("sequelize");
const User = require("./user");

module.exports = (sequelize) => {
	class Accomodation extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: "owner",
			});

			this.hasMany(models.Notification, {
				foreignKey: "id_accomodation",
			});
		}
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
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			owner: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: "id",
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			coordinate: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			area: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize: sequelize,
			modelName: "Accomodation",
			tableName: "accomodations",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return Accomodation;
};
