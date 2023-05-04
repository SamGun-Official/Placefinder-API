const {Model,DataTypes, Op} = require('sequelize');
const { getDB } = require("../config/sequelize");
const sequelize = getDB();


class User extends Model {
   //association
  }
  User.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement: true
    },
    username: {
      type:DataTypes.STRING,
      primaryKey:false,
      allowNull:false
    },
    password:{
      type: DataTypes.STRING,
      primaryKey: false,
      allowNull:false
    },
    role: {
      type:DataTypes.INTEGER,
      primaryKey:false,
      allowNull:false
    },
    saldo: {
      type:DataTypes.INTEGER,
      primaryKey:false,
      allowNull:false
    },
    email: {
      type:DataTypes.STRING,
      primaryKey:false,
      allowNull:false
    },
    phone_number: {
      type: DataTypes.STRING,
      primaryKey:false,
      allowNull: false
    },
    tanggal_lahir: {
      type: DataTypes.DATE,
      primaryKey: false,
      allowNull:false
    },
    id_card_number: {
      type:DataTypes.STRING,
      primaryKey:false,
      allowNull:false
    },
    is_id_card_verified:{
      type:DataTypes.INTEGER,
      primaryKey:false,
      allowNull:false
    },
    status: {
      type:DataTypes.INTEGER,
      primaryKey:false,
      allowNull:false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    paranoid:false,
    underscored:false,
    timestamps:true
  });


module.exports = User;

