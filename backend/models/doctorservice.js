const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Doctor = require('./doctor');
const ServiceCatalog = require('./servicecatalog');

const DoctorService = sequelize.define('doctorservice', {
  doctorserviceid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctorid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  servicecatalogid: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  tableName: 'doctorservice',
  schema: 'onlinedoc',
  timestamps: false
});

DoctorService.belongsTo(Doctor, { foreignKey: 'doctorid' });
DoctorService.belongsTo(ServiceCatalog, { foreignKey: 'servicecatalogid' });

module.exports = DoctorService;
