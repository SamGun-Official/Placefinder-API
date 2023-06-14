"use strict";

const { DataTypes, Model } = require("sequelize");
const User = require("./user");

module.exports = (sequelize) => {
	class H_trans extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: "id_user",
			});

			this.hasMany(models.D_trans, {
				foreignKey: "id_htrans",
			});
		}
	}

	H_trans.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			number: {
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
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			total: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			payment_status: {
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
			modelName: "H_trans",
			tableName: "h_trans",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return H_trans;
};