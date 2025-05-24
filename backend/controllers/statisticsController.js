const { Statistic, Admin, User, Doctor, Patient, Booking } = require('../models');

exports.getStatistics = async (req, res) => {
  try {
    const [users, admins, doctors, patients, bookings] = await Promise.all([
      User.count(),
      Admin.count(),
      Doctor.count(),
      Patient.count(),
      Booking.count()
    ]);

    res.json({ users, admins, doctors, patients, bookings });

  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
};

exports.saveStatistics = async (req, res) => {
  try {
    const [users, admins, doctors, patients, bookings] = await Promise.all([
      User.count(),
      Admin.count(),
      Doctor.count(),
      Patient.count(),
      Booking.count()
    ]);

    const report = {
      users,
      admins,
      doctors,
      patients,
      bookings
    };

    const userId = req.user.userid;
    const admin = await Admin.findOne({ where: { userid: userId } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const saved = await Statistic.create({
      reporttype: 'summary',
      adminid: admin.adminid,
      generateddate: new Date(),
      reportcontent: JSON.stringify(report)
    });

    res.status(201).json({ message: 'Statistics report saved', saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save statistics', error: err.message });
  }
};
