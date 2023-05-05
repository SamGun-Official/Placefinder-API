const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const Accomodation = require('./accomodation');
const User = require('./user');
const sequelize = getDB();


class H_trans extends Model {
   //association
  }

  H_trans.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    number:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey:false,
      autoIncrement:false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false,
      references:{
        model: User,
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false
    },
    total: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false
    },
    payment_status: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false
    }
  }, {
    sequelize,
    modelName: 'H_trans',
    tableName: 'h_trans',
    paranoid:false,
    underscored:false,
    timestamps:true
  });

module.exports = H_trans;

