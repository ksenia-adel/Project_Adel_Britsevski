const { Doctor, Booking, Schedule, Patient, User, ServiceCatalog} = require('../models');
const bcrypt = require('bcrypt');

// generates a random password for the doctor
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

// creates a doctor and associated user
exports.createDoctor = async (req, res) => {
  const t = await require('../db').transaction();
  try {
    const { firstname, lastname, email, phone, specialty } = req.body;
    // check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const adminId = req.user.userid;
    // generate and hash password
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    // create user and doctor inside the transaction
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'doctor' }, { transaction: t });

    const doctor = await Doctor.create({
      firstname,
      lastname,
      email,
      phone,
      specialty,
      userid: user.userid,
      adminid: adminId }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor,
      login: {
        email,
        password: rawPassword }
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Doctor creation failed', error: err.message });
  }
};


// returns all doctors (open to all roles)
exports.getAllDoctors = async (req, res) => {
  const doctors = await Doctor.findAll();
  res.json(doctors);
};

// updates doctor info and user email
exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, specialty } = req.body;
  try {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // update doctor fields
    await doctor.update({ firstname, lastname, email, phone, specialty });
    // update user email linked to doctor
    const user = await User.findByPk(doctor.userid);
    if (user) {
      await user.update({ email }); // optionally update more fields
    }

    res.json({ message: 'Doctor updated', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }};

// deletes doctor and associated user
exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;
  const t = await require('../db').transaction();

  try {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      await t.rollback();
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // delete both doctor and user inside the same transaction
    await Doctor.destroy({ where: { doctorid: id }, transaction: t });
    await User.destroy({ where: { userid: doctor.userid }, transaction: t });
    await t.commit();
    res.json({ message: 'Doctor and associated user deleted' });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }};


// gets bookings for the logged-in doctor
exports.getDoctorBookings = async (req, res) => {
  try {
    const userid = req.user.userid;
    // find doctor by linked user id
    const doctor = await Doctor.findOne({ where: { userid } });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // fetch bookings where schedule matches doctor
    const bookings = await Booking.findAll({
      include: [
        { model: Schedule,
          as: 'scheduleSlot',
          where: { doctorid: doctor.doctorid }, },
        { model: Patient,
          attributes: ['firstname', 'lastname'], },
        { model: ServiceCatalog,
          as: 'serviceInfo', }
      ]});

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get doctor bookings', error: err.message });
  }};