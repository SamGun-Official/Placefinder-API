const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const Accomodation = require('../models/accomodation');
const User = require('../models/user');
const sequelize = getDB();


class Notification extends Model {
  static associate(User) {
    Notification.belongsTo(User,{
      foreignKey: 'id_user'
    });
  }

  static associate(Accomodation){
    Notification.belongsTo(Accomodation,{
      foreignKey: 'id_accomodation'
    });
  }

  }
  Notification.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    description:{
      type: DataTypes.STRING,
      allowNull:false,
      primaryKey:false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      references: {
        model: User,
        key: 'id'
      }
    },
    id_accomodation: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      references:{
        model: Accomodation,
        key: 'id'
      }
    },
    status:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      defaultValue:1
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    paranoid:false,
    underscored:false,
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

module.exports = Notification;

