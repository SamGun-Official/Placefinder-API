"use strict";

const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class User extends Model {
		static associate(models) {
			this.hasMany(models.Accommodation, {
				foreignKey: "owner",
			});

			this.hasMany(models.Notification, {
				foreignKey: "id_user",
			});

			this.hasMany(models.H_trans, {
				foreignKey: "id_user",
			});

			this.hasMany(models.Usage, {
				foreignKey: "id_user",
			});

			this.hasMany(models.NearbyList, {
				foreignKey: "id_user",
			});
		}
	}

	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tanggal_lahir: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			id_card_number: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			is_id_card_verified: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			sequelize: sequelize,
			modelName: "User",
			tableName: "users",
			paranoid: false,
			underscored: false,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	return User;
};
