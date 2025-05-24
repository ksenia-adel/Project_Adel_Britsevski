const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Patient = sequelize.define('patient', {
  patientid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  personalcode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: DataTypes.STRING,
  address: DataTypes.STRING
}, {
  tableName: 'patient',
  schema: 'onlinedoc',
  timestamps: false
});

Patient.belongsTo(User, { foreignKey: 'userid', onDelete: 'CASCADE' });

module.exports = Patient;
