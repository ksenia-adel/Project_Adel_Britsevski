const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorServiceController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// only authorized doctors or admins can link a service
router.post('/', auth, permit('doctor', 'admin'), controller.createDoctorService);

// doctor sees their own services
router.get('/my', auth, permit('doctor'), controller.getMyDoctorServices);

// anyone can view services by doctorid
router.get('/:doctorid', controller.getDoctorServicesById);

// delete a linked service for a doctor (by doctor or admin)
router.delete('/:id', auth, permit('doctor', 'admin'), controller.deleteDoctorService);

// get available slots for a specific service (open to all)
router.get('/available/:servicecatalogid', controller.getAvailableSlotsForService);

module.exports = router;
