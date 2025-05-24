const User = require('./user');
const Admin = require('./admin');
const Doctor = require('./doctor');
const Patient = require('./patient');
const ServiceCatalog = require('./servicecatalog');
const DoctorService = require('./doctorservice');
const Schedule = require('./schedule');
const Booking = require('./booking');
const Statistic = require('./statistic');

// booking → schedule (with alias)
Booking.belongsTo(Schedule, { foreignKey: 'scheduleid', as: 'scheduleSlot' });
Schedule.hasMany(Booking, { foreignKey: 'scheduleid', as: 'scheduleBookings' });

// booking → patient
// booking → patient
Booking.belongsTo(Patient, { foreignKey: 'patientid', as: 'patient' }); 
Patient.hasMany(Booking, { foreignKey: 'patientid', as: 'patientBookings' }); 

// booking → service
Booking.belongsTo(ServiceCatalog, {
  foreignKey: 'servicecatalogid',
  as: 'serviceInfo'
});
ServiceCatalog.hasMany(Booking, {
  foreignKey: 'servicecatalogid',
  as: 'bookings'
});

// schedule → doctor
Schedule.belongsTo(Doctor, { foreignKey: 'doctorid' });
Doctor.hasMany(Schedule, { foreignKey: 'doctorid' });

// doctorservice → servicecatalog
DoctorService.belongsTo(ServiceCatalog, {
  foreignKey: 'servicecatalogid',
  as: 'service',
});
ServiceCatalog.hasMany(DoctorService, {
  foreignKey: 'servicecatalogid',
  as: 'linkedDoctors',
});

// doctor → user
Doctor.belongsTo(User, { foreignKey: 'userid', as: 'doctorUser' });
User.hasOne(Doctor, { foreignKey: 'userid', as: 'doctorProfile' });

module.exports = {
  User,
  Admin,
  Doctor,
  Patient,
  ServiceCatalog,
  DoctorService,
  Schedule,
  Booking,
  Statistic,
};
