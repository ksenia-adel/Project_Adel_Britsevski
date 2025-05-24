const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
console.log('Starting... Please, wait.');

// create a new booking (only for patients)
router.post('/', auth, permit('patient'), controller.createBooking);

// get all bookings for the logged-in patient
router.get('/', auth, permit('patient'), controller.getMyBookings);

// cancel a booking by id (only for the patient who owns it)
router.delete('/:id', auth, permit('patient'), controller.cancelBooking);

// mark a booking as paid (only for the booking owner)
router.put('/:id/pay', auth, permit('patient'), controller.payForBooking);

// get all bookings for the logged-in doctor
router.get('/doctor', auth, permit('doctor'), controller.getDoctorBookings);

module.exports = router;
