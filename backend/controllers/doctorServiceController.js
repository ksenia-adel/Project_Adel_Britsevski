const { Schedule, DoctorService, Doctor, Booking, ServiceCatalog } = require('../models');
const { Op } = require('sequelize');

// get services for a specific doctor by doctorid (for patient or admin)
exports.getDoctorServicesById = async (req, res) => {
  try {
    const { doctorid } = req.params;
    // find all services linked to the given doctor
    const services = await DoctorService.findAll({
      where: { doctorid },
      include: [{ model: ServiceCatalog, as: 'service' }]
    });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get doctor services', error: err.message });
  }};

// get services for the currently logged-in doctor
exports.getMyDoctorServices = async (req, res) => {
  try {
    const userid = req.user.userid;
    // find doctor linked to current user
    const doctor = await Doctor.findOne({ where: { userid } });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // find all services linked to that doctor
    const services = await DoctorService.findAll({
      where: { doctorid: doctor.doctorid },
      include: [{ model: ServiceCatalog, as: 'service' }]
    });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get your services', error: err.message });
  }};

// link a service to the logged-in doctor
exports.createDoctorService = async (req, res) => {
  try {
    const { servicecatalogid } = req.body;
    const userid = req.user.userid;
    // find doctor linked to current user
    const doctor = await Doctor.findOne({ where: { userid } });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // check if this doctor already has that service linked
    const exists = await DoctorService.findOne({
      where: { doctorid: doctor.doctorid, servicecatalogid }
    });
    if (exists) return res.status(400).json({ message: 'Service already linked to doctor' });
    // link the service to the doctor
    const linked = await DoctorService.create({
      doctorid: doctor.doctorid,
      servicecatalogid });

    res.status(201).json({ message: 'Service linked to doctor', linked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to link service', error: err.message });
  }};

// delete a doctor service (only if it belongs to the logged-in doctor)
exports.deleteDoctorService = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.userid;
    // find doctor linked to current user
    const doctor = await Doctor.findOne({ where: { userid } });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // find service by id
    const service = await DoctorService.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Doctor service not found' });
    // check if the service belongs to the logged-in doctor
    if (service.doctorid !== doctor.doctorid) {
      return res.status(403).json({ message: 'Access denied. This service does not belong to you.' });
    }

    // delete the service
    await service.destroy();
    res.json({ message: 'Doctor service unlinked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to unlink service', error: err.message });
  }};

// get available time slots for a given service
exports.getAvailableSlotsForService = async (req, res) => {
  try {
    const { servicecatalogid } = req.params;
    // find all doctors that provide this service
    const doctorServices = await DoctorService.findAll({
      where: { servicecatalogid },
      attributes: ['doctorid'] });

    const doctorIds = doctorServices.map(ds => ds.doctorid);
    if (doctorIds.length === 0) {
      return res.json([]);
    }

    // find schedules of those doctors
    const schedules = await Schedule.findAll({
      where: {doctorid: { [Op.in]: doctorIds }},
      include: [
        { model: Booking,
          as: 'scheduleBookings',
          required: false },
        { model: Doctor }
      ],
      order: [['date', 'ASC'], ['starttime', 'ASC']]
    });

    // filter free slots and format response
    const freeSlots = schedules
      .filter(s => s.scheduleBookings.length === 0)
      .map(s => ({
        scheduleid: s.scheduleid,
        date: s.date,
        starttime: s.starttime,
        endtime: s.endtime,
        doctor: {
          doctorid: s.doctor.doctorid,
          firstname: s.doctor.firstname,
          lastname: s.doctor.lastname,
          specialty: s.doctor.specialty
        }
      }));

    res.json(freeSlots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load available slots', error: err.message });
  }
};
