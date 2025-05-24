const express = require('express');
const router = express.Router();
const controller = require('../controllers/statisticsController');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

// get system statistics (admin only)
router.get('/', auth, permit('admin'), controller.getStatistics);
// save current statistics as a report
router.post('/', auth, permit('admin'), controller.saveStatistics);


module.exports = router;
