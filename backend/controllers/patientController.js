const { Patient, User } = require('../models');

// get all patients with associated user data
exports.getAllPatients = async (req, res) => {
  const patients = await Patient.findAll({ include: [{ model: User }] }); // assumes 'user' association is defined in the model
  res.json(patients);
};

// update patient information and email in user table
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { 
    firstname, 
    lastname, 
    email, 
    phone, 
    personalcode, 
    address } = req.body;

  // find patient by id
  const patient = await Patient.findByPk(id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  // update patient fields
  await patient.update({ firstname, lastname, phone, personalcode, address });

  // update user email if linked user exists
  const user = await User.findByPk(patient.userid);
  if (user) await user.update({ email }); // update user email too

  res.json({ message: 'Patient updated', patient });
};

// delete patient and the associated user
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // first delete patient
    await patient.destroy();

    // then user
    const user = await User.findByPk(patient.userid);
    if (user) {
      await user.destroy();
    }

    res.json({ message: 'Patient deleted' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ message: 'Failed to delete patient', error: err.message });
  }
};

