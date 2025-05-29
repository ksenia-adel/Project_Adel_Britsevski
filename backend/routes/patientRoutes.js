const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// apply auth and admin role check to all routes in this router
router.use(auth, permit('admin'));

// get all patients (only accessible by admin)
router.get('/', controller.getAllPatients);

// update patient info by id (only accessible by admin)
router.put('/:id', controller.updatePatient);

// delete patient by id (only accessible by admin)
router.delete('/:id', controller.deletePatient);

module.exports = router;
