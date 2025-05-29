const { Admin, User } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../db');

// generates a random password with 10 characters (letters and digits)
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

// creates a new admin and a related user account
exports.createAdmin = async (req, res) => {
  // begin database transaction to keep things atomic
  const t = await sequelize.transaction();

  try {
    const { firstname, lastname, email, phone } = req.body;
    // check if all required fields are provided
    if (!firstname || !lastname || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // check if the email is already in use by another user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    // generate a new password and hash it
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    // create the user account with role "admin"
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'admin' }, { transaction: t });
    // create the admin profile and link it to the created user
    const admin = await Admin.create({
      firstname,
      lastname,
      email,
      phone,
      userid: user.userid }, { transaction: t });

    // save changes to the database
    await t.commit();

    // send back the new admin data and the generated password for login
    res.status(201).json({
      message: 'Admin created successfully',
      admin,
      login: {
        email,
        password: rawPassword
      }
    });

  } catch (err) {
    // rollback any changes if an error occurs
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Admin creation failed', error: err.message });
  }};

// fetches and returns a list of all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get admins', error: err.message });
  }};

// updates the admin's info and (if needed) updates user's email too
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone } = req.body;
  const t = await sequelize.transaction();

  try {
    // find the admin by their ID
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    // update the admin's basic info
    await admin.update({ firstname, lastname, email, phone }, { transaction: t });
    // find the related user and update their email if changed
    const user = await User.findByPk(admin.userid);
    if (user && email) {
      // check if the new email is not already taken by someone else
      const duplicate = await User.findOne({ where: { email } });
      if (duplicate && duplicate.userid !== user.userid) {
        await t.rollback();
        return res.status(400).json({ message: 'This email is used by another user' });
      }

      await user.update({ email }, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Admin updated successfully', admin });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }};

// deletes an admin and their related user account
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();

  try {
    // find the admin to delete
    const admin = await Admin.findByPk(id);
    if (!admin) {
      await t.rollback();
      return res.status(404).json({ message: 'Admin not found' });
    }

    // delete both the admin and the linked user account
    await Admin.destroy({ where: { adminid: id }, transaction: t });
    await User.destroy({ where: { userid: admin.userid }, transaction: t });
    await t.commit();

    // return success status with no content
    res.status(204).send();
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'delete failed', error: err.message });
  }};
