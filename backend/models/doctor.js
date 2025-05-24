const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Doctor = sequelize.define('doctor', {
  doctorid: {
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
  specialty: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'doctor',
  schema: 'onlinedoc',
  timestamps: false
});


module.exports = Doctor;
