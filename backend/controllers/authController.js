const { User, Patient } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// registers a new patient and creates linked user
exports.register = async (req, res) => {
  const {
    email,
    password,
    firstname,
    lastname,
    phone,
    address,
    personalcode
  } = req.body;

  // input validation
  if (!email || !password || !firstname || !lastname || !personalcode) {
    return res.status(400).json({
      message: 'Please fill in all required fields (email, password, firstname, lastname, personalcode).'
    });
  }

  try {
    // check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'This Email already in use.' });
    }
    // check if personal code is already registered
    const existingPatient = await Patient.findOne({ where: { personalcode } });
    if (existingPatient) {
      return res.status(400).json({ message: 'A user with this personal code already exists. Check your input or contact support.' });
    }
    // hash the password before saving
    const hash = await bcrypt.hash(password, 10);
    // create user account with role "patient"
    const user = await User.create({
      email,
      password: hash,
      role: 'patient' });
    // create patient profile and link it to the user account
    const patient = await Patient.create({
      firstname,
      lastname,
      email,
      phone,
      address,
      personalcode,
      userid: user.userid });
    // generate jwt token for authentication
    const token = jwt.sign(
      { userid: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // send back patient info and login token
    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration error', error: err.message });
  }};

// logs in an existing user (admin, doctor, or patient)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('login attempt:', { email });
    // find user with the given email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('user not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    // compare given password with hashed one
    const match = await bcrypt.compare(password, user.password);
    console.log('password match:', match);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // generate new jwt token
    const token = jwt.sign(
      { userid: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' });
    // send token and basic user info
    res.json({
      token,
      user: {
        userid: user.userid,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ message: 'Login error', error: err.message });
  }};
