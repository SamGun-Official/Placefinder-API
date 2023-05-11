const { Model, DataTypes, Op } = require('sequelize');
const { getDB } = require("../config/sequelize");
const Accomodation = require('./accomodation');
const User = require('./user');
const H_trans = require('./h_trans');
const Usage = require('./usage');
const sequelize = getDB();


class D_trans extends Model {
  //association
  static associate(H_trans) {
    D_trans.belongsTo(H_trans,{
      foreignKey: 'id_htrans'
    });
  }

  static associate(Usage) {
    D_trans.belongsTo(Usage,{
      foreignKey: 'id_usage'
    });
  }

}

D_trans.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  id_htrans: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false,
    autoIncrement: false,
    references: {
      model: H_trans,
      key: 'id'
    }
  },
  id_usage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false,
    autoIncrement: false,
    references: {
      model: Usage,
      key: 'id'
    }
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false,
    autoIncrement: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false,
    autoIncrement: false
  }
}, {
  sequelize,
  modelName: 'D_trans',
  tableName: 'd_trans',
  paranoid: false,
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = D_trans;

