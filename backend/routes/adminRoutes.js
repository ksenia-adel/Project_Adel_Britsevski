const express = require('express');
const router = express.Router();

const controller = require('../controllers/adminController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// create a new admin (only accessible by admin)
router.post('/', auth, permit('admin'), controller.createAdmin);

// get list of all admins (only accessible by admin)
router.get('/', auth, permit('admin'), controller.getAllAdmins);

// update admin by id (only accessible by admin)
router.put('/:id', auth, permit('admin'), controller.updateAdmin);

// delete admin by id (only accessible by admin)
router.delete('/:id', auth, permit('admin'), controller.deleteAdmin);

module.exports = router;
