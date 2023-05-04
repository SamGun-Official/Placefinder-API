const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const User = require('./user');
const sequelize = getDB();


class Accomodation extends Model {
   //association
  }
  Accomodation.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      primaryKey:false
    },
    location: {
      type: DataTypes.STRING,
      allowNull:false,
      primaryKey:false
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false
    },
    owner: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      references:{
        model: User,
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull:true,
      primaryKey:false
    },
    rating: {
      type:DataTypes.INTEGER,
      allowNull:true,
      primaryKey:false
    },
    coordinate: {
      type:DataTypes.STRING,
      allowNull:true,
      primaryKey:false
    },
    status: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:false,
      defaultValue:1
    },
    type:{
      type: DataTypes.STRING,
      allowNull:true,
      primaryKey:false
    },
    capacity: {
      type:DataTypes.INTEGER,
      allowNull:true,
      primaryKey:false
    },
    area:{
      type: DataTypes.INTEGER,
      allowNull:true,
      primaryKey:false
    }
  }, {
    sequelize,
    modelName: 'Accomodation',
    tableName: 'accomodations',
    paranoid:false,
    underscored:false,
    timestamps:true
  });
module.exports = Accomodation;

