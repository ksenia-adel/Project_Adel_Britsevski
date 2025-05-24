const express = require('express');
const router = express.Router();
const controller = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const scheduleController = require('../controllers/scheduleController');

// doctor creates a new schedule slot
router.post('/', auth, permit('doctor'), controller.createSlot);

// doctor gets their own schedule
router.get('/', auth, permit('doctor'), controller.getMySchedule);

// doctor deletes a schedule slot
router.delete('/:id', auth, permit('doctor'), controller.deleteSlot);

// get available dates (with free slots), open to all
router.get('/available-dates', scheduleController.getAvailableDates);

// get available schedule slots for a specific doctor (open to all)
router.get('/doctors/:doctorid', controller.getDoctorSchedule);

module.exports = router;
