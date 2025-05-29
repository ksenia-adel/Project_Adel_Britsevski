const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// create a new service (only accessible by admin)
router.post('/', auth, permit('admin'), serviceController.createService);

// get all services (open to everyone)
router.get('/', serviceController.getAllServices);

// update a service by id (only accessible by admin)
router.put('/:id', auth, permit('admin'), serviceController.updateService);

// delete a service by id (only accessible by admin)
router.delete('/:id', auth, permit('admin'), serviceController.deleteService);

module.exports = router;
