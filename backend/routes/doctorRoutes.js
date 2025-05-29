const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// create a new doctor (only accessible by admin)
router.post('/', auth, permit('admin'), controller.createDoctor);

// get list of all doctors (open to all users)
router.get('/', auth, controller.getAllDoctors);

// update doctor by id (only accessible by admin)
router.put('/:id', auth, permit('admin'), controller.updateDoctor);

// delete doctor by id (only accessible by admin)
router.delete('/:id', auth, permit('admin'), controller.deleteDoctor);

// doctor gets their own bookings
router.get('/bookings', auth, permit('doctor'), controller.getDoctorBookings);

module.exports = router;
