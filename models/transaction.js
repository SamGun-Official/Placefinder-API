const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const User = require('./user');
const Accomodation = require('./accomodation');
const sequelize = getDB();


class Transaction extends Model {
   //association
  }
  Transaction.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    number: {
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:false
    },
    id_accomodation: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      references: {
        model: Accomodation,
        key: 'id'
      }
    },
    id_user: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      references: {
        model: User,
        key: 'id'
      }
    },
    date:{
      type: DataTypes.DATE,
      allowNull:false,
      primaryKey: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull:true,
      primaryKey:false
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull:true,
      primaryKey:false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      defaultValue:0
    },
    is_check_out: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    paranoid:false,
    underscored:false,
    timestamps:true
  });

module.exports = Transaction;

