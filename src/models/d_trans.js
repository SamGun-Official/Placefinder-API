"use strict";

const { DataTypes, Model } = require("sequelize");
const H_trans = require("./h_trans");
const Usage = require("./usage");

module.exports = (sequelize) => {
	class D_trans extends Model {
		static associate(models) {
			this.belongsTo(models.H_trans, {
				foreignKey: "id_htrans",
			});

			this.belongsTo(models.Usage, {
				foreignKey: "id_usage",
			});
		}
	}

	D_trans.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			id_htrans: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: H_trans,
					key: "id",
				},
			},
			id_usage: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Usage,
					key: "id",
				},
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
			modelName: "D_trans",
			tableName: "d_trans",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return D_trans;
};
