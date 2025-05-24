const { Booking, Patient, Schedule, ServiceCatalog, Doctor } = require('../models');
const Log = require('../models/logModel');


// make new booking for a patient
exports.createBooking = async (req, res) => {
  try {
    const { servicecatalogid, scheduleid } = req.body;
    const userid = req.user.userid;
    const patient = await Patient.findOne({ where: { userid } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    // check if slot is already taken
    const existing = await Booking.findOne({ where: { scheduleid } });
    if (existing) return res.status(400).json({ message: 'Schedule slot already booked' });
    // get service and schedule info
    const service = await ServiceCatalog.findByPk(servicecatalogid);
    const schedule = await Schedule.findByPk(scheduleid);
    if (!service || !schedule) {
      return res.status(404).json({ message: 'Service or schedule not found' });
    }
    // check if time is enough
    const start = new Date(`1970-01-01T${schedule.starttime}`);
    const end = new Date(`1970-01-01T${schedule.endtime}`);
    const diffInMinutes = (end - start) / (1000 * 60);
    if (diffInMinutes < service.duration) {
      return res.status(400).json({
        message: `Selected time slot (${diffInMinutes} min) is too short for this service (${service.duration} min)`
      });
    }

    // save booking
    const booking = await Booking.create({
      patientid: patient.patientid,
      servicecatalogid,
      scheduleid });

      // MongoDB
    await Log.create({
      action: 'Booking created',
      patientEmail: patient.email,
      doctorId: schedule.doctorid,
      scheduleId: scheduleid
    });


    res.status(201).json({ message: 'Booking created', booking });

  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

// get all bookings for this patient
exports.getMyBookings = async (req, res) => {
  try {
    const userid = req.user.userid;
    const patient = await Patient.findOne({ where: { userid } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const bookings = await Booking.findAll({
      where: { patientid: patient.patientid },
      include: [
        { model: Schedule,
          as: 'scheduleSlot',
          include: [{ model: Doctor }] },
        { model: ServiceCatalog,
          as: 'serviceInfo' }
      ]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get bookings', error: err.message });
  }};

// cancel booking (only own)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.userid;
    const patient = await Patient.findOne({ where: { userid } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // can cancel only own booking
    if (booking.patientid !== patient.patientid) {
      return res.status(403).json({ message: 'Cannot cancel other patient\'s booking' });
    }

    await booking.destroy();
    res.json({ message: 'Booking cancelled' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }};

// mark booking as paid
exports.payForBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.userid;
    const patient = await Patient.findOne({ where: { userid } });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // only own booking
    if (booking.patientid !== patient.patientid) {
      return res.status(403).json({ message: 'You cannot pay for someone else’s booking' });
    }
    // already paid
    if (booking.ispaid) {
      return res.status(400).json({ message: 'Booking already paid' });}
    await booking.update({ ispaid: true });
    res.json({ message: 'Booking is paid', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to pay for booking', error: err.message });
  }};

// get all bookings for doctor
exports.getDoctorBookings = async (req, res) => {
  try {
    const userid = req.user.userid;
    if (!userid) {
      return res.status(400).json({ message: 'Missing user ID in token' });
    }
    const doctor = await Doctor.findOne({ where: { userid } });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const bookings = await Booking.findAll({
      include: [
        { model: Schedule,
          as: 'scheduleSlot',
          where: { doctorid: doctor.doctorid },
          include: [{ model: Doctor }] },
        { model: Patient,
          as: 'patient',
          attributes: ['firstname', 'lastname'] },
        { model: ServiceCatalog,
          as: 'serviceInfo' }
      ]
    });
    res.json(bookings);

  } catch (err) {
    console.error('getDoctorBookings crashed:', err);
    res.status(500).json({ message: 'Failed to get doctor bookings', error: err.message });
  }};
