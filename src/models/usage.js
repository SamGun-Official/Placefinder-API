const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const Accomodation = require('./accomodation');
const User = require('./user');
const H_trans = require('./h_trans');
const sequelize = getDB();


class Usage extends Model {
   //association
   static associate(D_trans) {
    Usage.hasOne(D_trans);
  }

  static associate(PriceList) {
    Usage.belongsTo(PriceList);
  }

  }

  Usage.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    id_pricelist:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:false,
      autoIncrement:false
    },
    date: {
      type: DataTypes.DATE,
      allowNull:false,
      primaryKey:false,
      autoIncrement:false,
    },
    subtotal: {
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
    modelName: 'Pricelist',
    tableName: 'pricelists',
    paranoid:false,
    underscored:false,
    timestamps:true
  });

module.exports = Usage;

