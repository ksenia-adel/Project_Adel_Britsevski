const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Admin = sequelize.define('admin', {
  adminid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'admin',
  schema: 'onlinedoc',
  timestamps: false
});

Admin.belongsTo(User, { foreignKey: 'userid' });

module.exports = Admin;
